// ════════════════════════════════════════════════════════
//  api/analyse.js — Vercel Serverless Function
//  Analyse fondamentale automatique avec cache Supabase
//
//  Logique :
//  1. Vérifie le cache Supabase (< 4h → retourne directement)
//  2. Si périmé → fetch news /api/news + scoring sentiment
//  3. Génère TLDR, facteurs, conclusion
//  4. Stocke en Supabase pour les prochains visiteurs
//  5. Retourne l'analyse fraîche
//
//  Usage : /api/analyse?symbol=EURUSD=X&category=forex&label=EUR/USD
// ════════════════════════════════════════════════════════

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://bpfpghlpdzevzyhalxov.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY || 'sb_publishable_XHStaFT7Lkp7FRomgGmOFw_8puBQvTZ';
const CACHE_TTL_H  = 4; // heures avant rafraîchissement

/* ── Mots-clés pour le scoring ── */
const BULL = ['hausse','haussier','bull','achat','rebond','croissance','fort','positif',
  'gain','record','support','rally','montée','optimiste','progression','force',
  'rise','buy','long','strong','positive','gains','growth','bullish','recovery'];

const BEAR = ['baisse','baissier','bear','vente','chute','recul','faible','négatif',
  'perte','creux','pression','correction','risque','rejet','pessimiste','déclin',
  'fall','sell','short','weak','negative','loss','decline','bearish','drop','crash'];

/* ── Catégories par symbole ── */
const SYMBOL_CAT = {
  'EURUSD=X':'forex','GBPUSD=X':'forex','USDJPY=X':'forex','USDCHF=X':'forex',
  'USDCAD=X':'forex','AUDUSD=X':'forex','NZDUSD=X':'forex','EURGBP=X':'forex',
  'EURJPY=X':'forex','GBPJPY=X':'forex','CADJPY=X':'forex','AUDJPY=X':'forex',
  'XAUUSD=X':'or','XAGUSD=X':'or',
  'CL=F':'petrole','BZ=F':'petrole',
  'BTC-USD':'crypto','ETH-USD':'crypto','SOL-USD':'crypto','BNB-USD':'crypto',
  'XRP-USD':'crypto','ADA-USD':'crypto','AVAX-USD':'crypto','DOGE-USD':'crypto',
  '^GSPC':'macro','^NDX':'macro','^DJI':'macro','^GDAXI':'macro',
  '^FTSE':'macro','^N225':'macro','^FCHI':'macro',
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  const { symbol = 'EURUSD=X', label = 'EUR/USD' } = req.query;
  const category = req.query.category || SYMBOL_CAT[symbol] || 'forex';

  const sb = createClient(SUPABASE_URL, SUPABASE_KEY);

  /* ── 1. Vérifier le cache Supabase ── */
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
        return res.status(200).json(cached);
      }
    }
  } catch(e) { /* Supabase offline — continuer */ }

  /* ── 2. Fetch news fraîches ── */
  let items = [];
  try {
    const proto = req.headers['x-forwarded-proto'] || 'https';
    const host  = req.headers['host'] || 'forexaverage.com';
    const newsUrl = `${proto}://${host}/api/news?category=${category}`;
    const r = await fetch(newsUrl, { signal: AbortSignal.timeout(8000) });
    if (r.ok) items = (await r.json()).items || [];
  } catch(e) { /* news indisponibles → analyse avec contexte par défaut */ }

  /* ── 3. Scoring sentiment ── */
  const texts = items.map(i => (i.title + ' ' + (i.summary || '')).toLowerCase());
  const combined = texts.join(' ');
  let bullScore = 0, bearScore = 0;
  BULL.forEach(w => { bullScore += (combined.match(new RegExp('\\b' + w, 'g')) || []).length; });
  BEAR.forEach(w => { bearScore += (combined.match(new RegExp('\\b' + w, 'g')) || []).length; });
  const total    = bullScore + bearScore || 1;
  const rawScore = Math.round((bullScore / total) * 100);
  const score    = Math.max(10, Math.min(90, rawScore)); // borner 10-90
  const sentiment = score > 55 ? 'bullish' : score < 45 ? 'bearish' : 'neutral';

  /* ── 4. Générer l'analyse ── */
  const analysis = buildAnalysis({ symbol, label, category, sentiment, score, items });

  /* ── 5. Stocker en Supabase ── */
  try {
    await sb.from('market_analysis').upsert({
      symbol,
      label,
      category,
      sentiment:   analysis.sentiment,
      score:       analysis.score,
      tldr:        analysis.tldr,
      factors:     analysis.factors,
      conclusion:  analysis.conclusion,
      news_count:  items.length,
      updated_at:  new Date().toISOString(),
    }, { onConflict: 'symbol', ignoreDuplicates: false });
  } catch(e) { /* Stocker en silent fail */ }

  res.setHeader('Cache-Control', 's-maxage=900, stale-while-revalidate=300');
  res.setHeader('X-Cache', 'MISS');
  return res.status(200).json(analysis);
}

/* ── Générateur d'analyse ── */
function buildAnalysis({ symbol, label, category, sentiment, score, items }) {
  const isBull = sentiment === 'bullish';
  const isBear = sentiment === 'bearish';
  const dir    = isBull ? 'haussier' : isBear ? 'baissier' : 'neutre';

  /* TLDR basé sur les vraies headlines */
  let tldr = '';
  if (items.length >= 3) {
    const top = items.slice(0, 3).map(i => i.title).join(' · ');
    tldr = `${label} affiche un biais ${dir} (score ${score}/100). Actualités récentes : ${top.slice(0, 200)}…`;
  } else {
    tldr = getDefaultTldr(label, dir, category, score);
  }

  /* Facteurs clés extraits des headlines */
  const factors = extractFactors(items, category, label);

  /* Conclusion directionnelle */
  const conclusion = buildConclusion(label, sentiment, score, category);

  return { symbol, label, category, sentiment, score, tldr, factors, conclusion };
}

function getDefaultTldr(label, dir, category, score) {
  const map = {
    forex:   `${label} affiche un biais ${dir} (score ${score}/100). Contexte macro dominé par les différentiels de taux G10 et les flux institutionnels.`,
    or:      `L'or maintient un biais ${dir}. Dollar, taux réels et géopolitique restent les drivers principaux.`,
    petrole: `Le pétrole (${label}) en tendance ${dir}e. OPEC+, géopolitique et demande asiatique conditionnent le prix.`,
    crypto:  `${label} en tendance ${dir}e. BTC dominance, liquidités on-chain et flux institutionnels orientent le marché.`,
    macro:   `${label} en régime ${dir}. Fed, bénéfices corporates et sentiment risk-on/risk-off guident la direction.`,
  };
  return map[category] || map.forex;
}

function extractFactors(items, category, label) {
  const patterns = [
    { re: /fed|fomc|réserve fédérale|powell/i, msg: 'Politique monétaire Fed · Décisions de taux et forward guidance' },
    { re: /bce|ecb|lagarde|banque centrale européenne/i, msg: 'BCE · Politique monétaire zone euro' },
    { re: /boj|bank of japan|yen|kuroda/i, msg: 'BoJ · Normalisation progressive de la politique monétaire japonaise' },
    { re: /inflation|cpi|ipc|pce/i, msg: 'Données d\'inflation · CPI/PCE influencent les décisions de taux' },
    { re: /emploi|nfp|chômage|jobs|unemployment/i, msg: 'Marché de l\'emploi · NFP et données emploi US comme catalyseur' },
    { re: /pib|gdp|croissance|growth/i, msg: 'Perspectives de croissance économique' },
    { re: /géopolitique|war|guerre|conflit|tensions/i, msg: 'Tensions géopolitiques · Aversion au risque accrue' },
    { re: /opec|opep|pétrole|oil|énergie|energy/i, msg: 'OPEC+ et prix de l\'énergie · Impact sur inflation et devises' },
    { re: /bitcoin|btc|crypto|ethereum|etf/i, msg: 'Flux crypto et ETF institutionnels · Appétit pour le risque' },
    { re: /dollar|dxy|usd|dollar index/i, msg: 'Dynamique du Dollar Index (DXY) · Corrélations directes' },
    { re: /chine|china|pboC|yuan/i, msg: 'Demande chinoise et politique PBoC · Facteur global' },
    { re: /gold|or|xau|métaux précieux/i, msg: 'Or et métaux précieux · Valeur refuge et taux réels' },
  ];

  const combined = items.map(i => i.title + ' ' + (i.summary || '')).join(' ');
  const found = [];
  for (const p of patterns) {
    if (p.re.test(combined)) {
      found.push(p.msg);
      if (found.length >= 4) break;
    }
  }

  /* Fallbacks si pas assez de matches */
  const fallbacks = {
    forex:   ['Différentiels de taux G10 · Principal driver des devises','Flux institutionnels et positionnements spéculatifs','Données macro (PMI, emploi, inflation) à surveiller'],
    or:      ['Taux réels · Corrélation inverse avec l\'or','Dollar faible/fort · Impact direct sur XAU/USD','Demande banques centrales record'],
    petrole: ['OPEC+ · Discipline de production maintenue','Demande asiatique · PMI industriel Chine/Inde','Tensions géopolitiques · Prime de risque supply'],
    crypto:  ['BTC dominance · Altcoins corrélés directement','Flux ETF institutionnels · Adoption mainstream','Cycle halving · Dynamique offre/demande'],
    macro:   ['Fed accommodante · Multiple PE expansif','IA monétisation · Révisions BPA corporates','Rachats d\'actions records · Support technique'],
  };

  while (found.length < 3) {
    const fb = fallbacks[category] || fallbacks.forex;
    const next = fb[found.length % fb.length];
    if (!found.includes(next)) found.push(next);
    else break;
  }

  return found.slice(0, 5);
}

function buildConclusion(label, sentiment, score, category) {
  const map = {
    bullish: {
      forex:   `Biais haussier (${score}/100) sur ${label}. Chercher setups longs sur replis vers OB/FVG. Confirmer avec SMC onglet Technique.`,
      or:      `Or haussier (${score}/100). Acheter sur replis. Support clé à surveiller via SMC sur l'onglet Graphique.`,
      petrole: `Pétrole haussier (${score}/100). Long sur replis. Surveiller OPEC+ et données inventaires.`,
      crypto:  `${label} haussier (${score}/100). Accumuler sur zones de support. Stop sous dernier swing low.`,
      macro:   `${label} haussier (${score}/100). Long sur replis. Utiliser SMC pour les points d'entrée précis.`,
    },
    bearish: {
      forex:   `Biais baissier (${score}/100) sur ${label}. Favoriser les ventes sur rebonds vers OB/FVG résistance.`,
      or:      `Métal sous pression (${score}/100). Short sur rebonds. Surveiller Dollar et taux réels.`,
      petrole: `Pétrole baissier (${score}/100). Ventes sur résistances. Surveiller décisions OPEC+.`,
      crypto:  `${label} baissier (${score}/100). Éviter longs CT. Short sur rebonds avec stop tight.`,
      macro:   `${label} baissier (${score}/100). Réduire exposition. Surveiller catalyseurs macro.`,
    },
    neutral: {
      forex:   `Biais neutre sur ${label}. Attendre confirmation directionnelle. Range trading possible.`,
      or:      `Or en consolidation. Attendre breakout ou retour sur support majeur.`,
      petrole: `Pétrole en range. Pas de biais directionnel clair. Surveiller OPEC+ pour catalyseur.`,
      crypto:  `${label} en range. Attendre confirmation BTC dominance. Pas de position directionnelle.`,
      macro:   `Indice en range. Attendre catalyseur (Fed, BPA, macro) avant de prendre position.`,
    },
  };
  return (map[sentiment]?.[category]) || `Biais ${sentiment} (${score}/100) sur ${label}. Combiner avec analyse technique.`;
}
