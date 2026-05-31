// ════════════════════════════════════════════════════════
//  api/analyse.js — Vercel Serverless Function
//  Analyse fondamentale via Claude AI + cache Supabase
//
//  Variables d'environnement requises (Vercel Settings > Env):
//    ANTHROPIC_API_KEY  → ta clé API Anthropic (console.anthropic.com)
//    SUPABASE_URL       → https://bpfpghlpdzevzyhalxov.supabase.co
//    SUPABASE_ANON_KEY  → sb_publishable_XHStaFT7Lkp7FRomgGmOFw_8puBQvTZ
//
//  Coût estimé : ~$0.001 par analyse · cache 4h · ~20 paires actives
//  Dépendance : npm install @anthropic-ai/sdk @supabase/supabase-js
// ════════════════════════════════════════════════════════

import Anthropic      from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';

/* ── Config ── */
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
const SB_URL        = process.env.SUPABASE_URL        || 'https://bpfpghlpdzevzyhalxov.supabase.co';
const SB_KEY        = process.env.SUPABASE_ANON_KEY   || 'sb_publishable_XHStaFT7Lkp7FRomgGmOFw_8puBQvTZ';
const CACHE_TTL_H   = 4;    // heures avant rafraîchissement
const MODEL         = 'claude-haiku-4-5-20251001';  // rapide, économique

/* ── Catégorie par symbole ── */
const SYMBOL_CAT = {
  'EURUSD=X':'forex','GBPUSD=X':'forex','USDJPY=X':'forex','USDCHF=X':'forex',
  'USDCAD=X':'forex','AUDUSD=X':'forex','NZDUSD=X':'forex','EURGBP=X':'forex',
  'EURJPY=X':'forex','GBPJPY=X':'forex','CADJPY=X':'forex','AUDJPY=X':'forex',
  'GBPAUD=X':'forex','EURAUD=X':'forex','NZDCHF=X':'forex','CHFJPY=X':'forex',
  'XAUUSD=X':'or','XAGUSD=X':'or',
  'CL=F':'petrole','BZ=F':'petrole','NG=F':'petrole',
  'BTC-USD':'crypto','ETH-USD':'crypto','SOL-USD':'crypto','BNB-USD':'crypto',
  'XRP-USD':'crypto','ADA-USD':'crypto','AVAX-USD':'crypto','DOGE-USD':'crypto',
  'LINK-USD':'crypto','DOT-USD':'crypto','MATIC-USD':'crypto','LTC-USD':'crypto',
  '^GSPC':'macro','^NDX':'macro','^DJI':'macro','^GDAXI':'macro',
  '^FTSE':'macro','^N225':'macro','^FCHI':'macro','^STOXX50E':'macro',
};

/* ═══════════════════════════════════════════════════════ */
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  const { symbol = 'EURUSD=X', label = 'EUR/USD' } = req.query;
  const category = req.query.category || SYMBOL_CAT[symbol] || 'forex';
  const sb = createClient(SB_URL, SB_KEY);

  /* ── 1. Cache Supabase ── */
  try {
    const { data: cached } = await sb
      .from('market_analysis')
      .select('*')
      .eq('symbol', symbol)
      .maybeSingle();

    if (cached?.updated_at) {
      const ageH = (Date.now() - new Date(cached.updated_at).getTime()) / 3_600_000;
      if (ageH < CACHE_TTL_H) {
        res.setHeader('Cache-Control', `s-maxage=${Math.floor((CACHE_TTL_H - ageH) * 3600)}`);
        res.setHeader('X-Cache', 'HIT');
        return res.status(200).json({ ...cached, source: 'cache' });
      }
    }
  } catch(e) { /* Supabase indisponible — continuer */ }

  /* ── 2. Fetch actualités ── */
  let items = [];
  try {
    const proto   = req.headers['x-forwarded-proto'] || 'https';
    const host    = req.headers['host'] || 'forexaverage.com';
    const newsUrl = `${proto}://${host}/api/news?category=${category}`;
    const r = await fetch(newsUrl, { signal: AbortSignal.timeout(8000) });
    if (r.ok) items = (await r.json()).items || [];
  } catch(e) { /* news indisponibles */ }

  /* ── 3. Générer l'analyse ── */
  let analysis;
  let source = 'claude';

  if (ANTHROPIC_KEY && items.length >= 3) {
    try {
      analysis = await generateWithClaude(symbol, label, category, items);
    } catch(e) {
      console.error('[analyse] Claude error:', e.message);
      analysis = generateFallback(symbol, label, category, items);
      source = 'fallback';
    }
  } else {
    analysis = generateFallback(symbol, label, category, items);
    source = items.length < 3 ? 'fallback_no_news' : 'fallback_no_key';
  }

  /* ── 4. Stocker en Supabase ── */
  try {
    await sb.from('market_analysis').upsert({
      symbol,
      label,
      category,
      sentiment:  analysis.sentiment,
      score:      analysis.score,
      tldr:       analysis.tldr,
      factors:    analysis.factors,
      conclusion: analysis.conclusion,
      news_count: items.length,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'symbol', ignoreDuplicates: false });
  } catch(e) { /* Stocker en silent fail */ }

  res.setHeader('Cache-Control', 's-maxage=900, stale-while-revalidate=300');
  res.setHeader('X-Cache', 'MISS');
  return res.status(200).json({ ...analysis, source });
}

/* ════════════════════════════════════════════════════════
   CLAUDE AI — Génère une analyse professionnelle
════════════════════════════════════════════════════════ */
async function generateWithClaude(symbol, label, category, items) {
  const client = new Anthropic({ apiKey: ANTHROPIC_KEY });

  /* Préparer les headlines (max 12) */
  const headlines = items.slice(0, 12).map((item, i) =>
    `${i+1}. [${item.source}] ${item.title}${item.summary ? ' · ' + item.summary.slice(0, 120) : ''}`
  ).join('\n');

  const catFR = { forex:'Forex', or:'Or & Métaux', petrole:'Pétrole & Énergie', crypto:'Crypto', macro:'Indices & Macro' }[category] || category;

  const prompt = `Tu es un analyste financier senior spécialisé en trading institutionnel (${catFR}).

Analyse ces actualités récentes pour **${label}** (${symbol}) :

${headlines}

Réponds UNIQUEMENT avec ce JSON valide (sans markdown, sans texte autour) :
{
  "sentiment": "bullish" | "bearish" | "neutral",
  "score": <entier 0-100. 50=neutre, >60=haussier, <40=baissier>,
  "tldr": "<2 phrases max en français. Factuel, direct, pro. Cite le sentiment dominant et la raison principale.>",
  "factors": [
    "<facteur 1 — max 12 mots, en français, précis>",
    "<facteur 2>",
    "<facteur 3>",
    "<facteur 4>"
  ],
  "conclusion": "<1 phrase directionnelle en français. Ex: 'Biais haussier sur EUR/USD — acheter sur replis vers 1.155, stop 1.148.' Ou si neutre: 'Attendre confirmation directionnelle avant de prendre position.'>  "
}

Règles strictes :
- score basé sur le consensus réel des actualités (pas d'opinion personnelle)
- si les news sont mixtes → neutral (40-60)
- facteurs = drivers réels mentionnés dans les news (banques centrales, données macro, flux, géopolitique...)
- conclusion = actionnable pour un trader intraday/swing
- RÉPONDRE EN JSON UNIQUEMENT`;

  const message = await client.messages.create({
    model:      MODEL,
    max_tokens: 700,
    messages:   [{ role: 'user', content: prompt }],
  });

  const text = message.content[0]?.text?.trim() || '';

  /* Parser le JSON de la réponse */
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error(`Claude returned no JSON: ${text.slice(0, 200)}`);

  const parsed = JSON.parse(match[0]);

  /* Validation */
  if (!['bullish','bearish','neutral'].includes(parsed.sentiment)) throw new Error('Invalid sentiment');
  if (typeof parsed.score !== 'number' || parsed.score < 0 || parsed.score > 100) throw new Error('Invalid score');
  if (!parsed.tldr || !Array.isArray(parsed.factors) || !parsed.conclusion) throw new Error('Missing fields');

  return {
    symbol, label, category,
    sentiment:  parsed.sentiment,
    score:      Math.round(parsed.score),
    tldr:       parsed.tldr,
    factors:    parsed.factors.slice(0, 5),
    conclusion: parsed.conclusion,
  };
}

/* ════════════════════════════════════════════════════════
   FALLBACK — Scoring par mots-clés si Claude indisponible
════════════════════════════════════════════════════════ */
const BULL_KW = ['hausse','haussier','bull','achat','rebond','fort','positif','gain','record',
  'rise','buy','long','strong','positive','gains','growth','bullish','recovery','rally'];
const BEAR_KW = ['baisse','baissier','bear','vente','chute','recul','faible','négatif',
  'perte','pression','correction','risque','rejet','fall','sell','short','weak','bearish','drop'];

function generateFallback(symbol, label, category, items) {
  const combined = items.map(i => (i.title + ' ' + (i.summary || '')).toLowerCase()).join(' ');
  let bull = 0, bear = 0;
  BULL_KW.forEach(w => { bull += (combined.match(new RegExp('\\b' + w + '\\b', 'g')) || []).length; });
  BEAR_KW.forEach(w => { bear += (combined.match(new RegExp('\\b' + w + '\\b', 'g')) || []).length; });

  const total     = bull + bear || 1;
  const score     = Math.max(10, Math.min(90, Math.round((bull / total) * 100)));
  const sentiment = score > 55 ? 'bullish' : score < 45 ? 'bearish' : 'neutral';
  const dirFR     = sentiment === 'bullish' ? 'haussier' : sentiment === 'bearish' ? 'baissier' : 'neutre';

  const recentTitles = items.slice(0, 3).map(i => i.title).join(' · ');
  const tldr = items.length >= 3
    ? `${label} affiche un biais ${dirFR} (score ${score}/100) basé sur ${items.length} actualités. ${recentTitles.slice(0, 160)}…`
    : getDefaultTldr(label, dirFR, category, score);

  return {
    symbol, label, category, sentiment, score,
    tldr,
    factors: extractFactors(combined, category),
    conclusion: buildConclusion(label, sentiment, score, category),
  };
}

function getDefaultTldr(label, dir, category, score) {
  const m = {
    forex:   `${label} affiche un biais ${dir} (${score}/100). Contexte macro dominé par les différentiels de taux G10 et les flux institutionnels.`,
    or:      `Or en tendance ${dir}e (${score}/100). Dollar, taux réels et demande banques centrales comme drivers principaux.`,
    petrole: `${label} en tendance ${dir}e (${score}/100). OPEC+, géopolitique et demande asiatique conditionnent le prix.`,
    crypto:  `${label} affiche un biais ${dir} (${score}/100). BTC dominance et flux institutionnels orientent le marché.`,
    macro:   `${label} en régime ${dir} (${score}/100). Fed, bénéfices corporates et sentiment risk-on/off guident la direction.`,
  };
  return m[category] || m.forex;
}

function extractFactors(combined, category) {
  const patterns = [
    { re: /fed|fomc|powell|réserve fédérale/i, msg: 'Politique monétaire Fed · Décisions de taux et forward guidance' },
    { re: /bce|ecb|lagarde/i,                  msg: 'BCE · Politique monétaire zone euro' },
    { re: /boj|bank of japan|yen/i,             msg: 'BoJ · Normalisation progressive de la politique monétaire japonaise' },
    { re: /inflation|cpi|ipc|pce/i,             msg: 'Données inflation (CPI/PCE) · Influence sur les décisions de taux' },
    { re: /emploi|nfp|chômage|jobs/i,           msg: 'Marché de l\'emploi · NFP comme catalyseur principal' },
    { re: /pib|gdp|croissance|growth/i,         msg: 'Perspectives de croissance économique' },
    { re: /géopolitique|war|guerre|conflit/i,   msg: 'Tensions géopolitiques · Aversion au risque' },
    { re: /opec|opep|pétrole|oil/i,             msg: 'OPEC+ et prix de l\'énergie' },
    { re: /bitcoin|btc|crypto|etf/i,            msg: 'Flux crypto et ETF institutionnels' },
    { re: /dollar|dxy|usd index/i,              msg: 'Dynamique du Dollar Index (DXY)' },
    { re: /chine|china|pboc/i,                  msg: 'Demande chinoise et politique PBoC' },
  ];
  const found = [];
  for (const p of patterns) {
    if (p.re.test(combined)) { found.push(p.msg); if (found.length >= 4) break; }
  }
  const fallbacks = {
    forex:   ['Différentiels de taux G10','Flux institutionnels et positionnements spéculatifs','Données macro à surveiller'],
    or:      ['Taux réels · Corrélation inverse','Dollar · Impact direct','Demande banques centrales record'],
    petrole: ['OPEC+ discipline de production','Demande asiatique · PMI Chine/Inde','Prime de risque géopolitique'],
    crypto:  ['BTC dominance · Corrélation altcoins','Flux ETF institutionnels','Cycle halving · Supply shock'],
    macro:   ['Fed accommodante · PE expansif','IA monétisation · BPA en hausse','Rachats d\'actions records'],
  };
  while (found.length < 3) {
    const fb = fallbacks[category] || fallbacks.forex;
    const n = fb[found.length % fb.length];
    if (!found.includes(n)) found.push(n); else break;
  }
  return found.slice(0, 5);
}

function buildConclusion(label, sentiment, score, category) {
  const m = {
    bullish: {
      forex:   `Biais haussier (${score}/100) sur ${label}. Chercher setups longs sur replis vers OB/FVG — confirmer avec onglet Technique.`,
      or:      `Or haussier (${score}/100). Acheter sur replis. Surveiller niveaux clés via SMC.`,
      petrole: `Pétrole haussier (${score}/100). Long sur replis. Surveiller OPEC+ et données inventaires.`,
      crypto:  `${label} haussier (${score}/100). Accumuler sur zones de support. Stop sous dernier swing low.`,
      macro:   `${label} haussier (${score}/100). Long sur replis vers zones de support key.`,
    },
    bearish: {
      forex:   `Biais baissier (${score}/100) sur ${label}. Favoriser ventes sur rebonds vers OB/FVG résistance.`,
      or:      `Or sous pression (${score}/100). Short sur rebonds. Surveiller Dollar et taux réels.`,
      petrole: `Pétrole baissier (${score}/100). Ventes sur résistances. Surveiller décisions OPEC+.`,
      crypto:  `${label} baissier (${score}/100). Éviter longs CT. Short sur rebonds avec stop tight.`,
      macro:   `${label} baissier (${score}/100). Réduire exposition. Surveiller catalyseurs macro.`,
    },
    neutral: {
      forex:   `Biais neutre sur ${label} (${score}/100). Attendre confirmation directionnelle. Range trading possible.`,
      or:      `Or en consolidation (${score}/100). Attendre breakout ou retour sur support majeur.`,
      petrole: `Pétrole en range (${score}/100). Pas de biais clair — surveiller OPEC+ pour catalyseur.`,
      crypto:  `${label} en range (${score}/100). Attendre confirmation BTC dominance avant de prendre position.`,
      macro:   `Indice en range (${score}/100). Attendre catalyseur (Fed, BPA) avant de prendre position.`,
    },
  };
  return m[sentiment]?.[category] || `Biais ${sentiment} (${score}/100) sur ${label}. Combiner avec analyse technique SMC.`;
}
