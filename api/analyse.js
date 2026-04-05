/* ═══════════════════════════════════════════════════════════════
   /api/analyse — Analyse IA complète pour Forex Average Premium
   ─────────────────────────────────────────────────────────────
   1. Données de prix réelles via Yahoo Finance (gratuit)
   2. News RSS pour contexte fondamental
   3. GPT-4o-mini → analyse structurée (TL;DR, technique, fond.)
   4. Fallback keyword scoring si pas de crédits OpenAI
   ═══════════════════════════════════════════════════════════════ */

/* ── Mapping TradingView symbol → Yahoo Finance ── */
const YF_MAP = {
  'OANDA:XAUUSD':    'GC=F',
  'OANDA:XAGUSD':    'SI=F',
  'TVC:USOIL':       'CL=F',
  'TVC:UKOIL':       'BZ=F',
  'FX:EURUSD':       'EURUSD=X',
  'FX:GBPUSD':       'GBPUSD=X',
  'FX:USDJPY':       'JPY=X',
  'FX:USDCHF':       'CHF=X',
  'FX:AUDUSD':       'AUDUSD=X',
  'FX:USDCAD':       'CAD=X',
  'FX:NZDUSD':       'NZDUSD=X',
  'BITSTAMP:BTCUSD': 'BTC-USD',
  'BITSTAMP:ETHUSD': 'ETH-USD',
  'COINBASE:SOLUSD': 'SOL-USD',
  'FOREXCOM:SPXUSD': '^GSPC',
  'FOREXCOM:NSXUSD': '^NDX',
  'FOREXCOM:DEU40':  '^GDAXI'
};

/* ── Flux RSS par catégorie ── */
const FEEDS = {
  forex:   ['https://www.forexlive.com/feed/news', 'https://www.fxstreet.com/rss/news'],
  crypto:  ['https://cointelegraph.com/rss', 'https://decrypt.co/feed'],
  or:      ['https://www.kitco.com/rss/kitconews.rss', 'https://www.mining.com/feed/'],
  petrole: ['https://oilprice.com/rss/main', 'https://rigzone.com/news/rss/rigzone_latest.aspx'],
  macro:   ['https://feeds.reuters.com/reuters/businessNews', 'https://feeds.marketwatch.com/marketwatch/topstories/']
};

/* ── Mots-clés pour fallback ── */
const BULL = ['surges','rises','gains','rally','bullish','positive','strong','growth','beats','record',
              'boost','demand','high','above','hausse','monte','rebond','achat','fort','solide'];
const BEAR = ['falls','drops','declines','plunges','bearish','weak','loss','sell','crash','concerns',
              'risk','fears','misses','low','below','baisse','chute','recul','vente','faible','craint'];

/* ── Extraire titres RSS ── */
function extractTitles(xml, max = 8) {
  const titles = [];
  const re = /<item[\s\S]*?<\/item>/gi;
  let m;
  while ((m = re.exec(xml)) !== null && titles.length < max) {
    const tm = m[0].match(/<title[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/i);
    if (tm) {
      const t = tm[1].replace(/<[^>]*>/g, '').trim();
      if (t.length > 5) titles.push(t.slice(0, 160));
    }
  }
  return titles;
}

/* ── Fetcher Yahoo Finance OHLCV (5 jours) ── */
async function fetchPriceData(yfSymbol) {
  if (!yfSymbol) return null;
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(yfSymbol)}?interval=1d&range=5d`;
    const r = await fetch(url, {
      signal: AbortSignal.timeout(7000),
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; ForexAverage/1.0)' }
    });
    if (!r.ok) return null;
    const json = await r.json();
    const result = json?.chart?.result?.[0];
    if (!result) return null;

    const closes  = result.indicators?.quote?.[0]?.close || [];
    const highs   = result.indicators?.quote?.[0]?.high  || [];
    const lows    = result.indicators?.quote?.[0]?.low   || [];
    const volumes = result.indicators?.quote?.[0]?.volume || [];
    const meta    = result.meta || {};

    const validCloses = closes.filter(v => v != null);
    if (validCloses.length < 2) return null;

    const current   = meta.regularMarketPrice || validCloses[validCloses.length - 1];
    const open5d    = validCloses[0];
    const change5d  = ((current - open5d) / open5d * 100).toFixed(2);
    const high5d    = Math.max(...highs.filter(v => v != null)).toFixed(4);
    const low5d     = Math.min(...lows.filter(v => v != null)).toFixed(4);
    const currency  = meta.currency || 'USD';

    // Support / résistance simples (plus bas/haut des 5j)
    const support    = parseFloat(low5d);
    const resistance = parseFloat(high5d);
    const trend      = parseFloat(change5d) > 0.3 ? 'haussière' : parseFloat(change5d) < -0.3 ? 'baissière' : 'neutre/latérale';

    return {
      current: current.toFixed(current > 100 ? 2 : 4),
      change5d,
      high5d,
      low5d,
      support: support.toFixed(current > 100 ? 2 : 4),
      resistance: resistance.toFixed(current > 100 ? 2 : 4),
      trend,
      currency
    };
  } catch(e) { return null; }
}

export default async function handler(req, res) {
  const { category = 'forex', asset = '', symbol = '' } = req.query;

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=60');

  /* ── 1. Données de prix Yahoo Finance ── */
  const yfSymbol = YF_MAP[symbol] || null;
  const priceData = await fetchPriceData(yfSymbol);

  /* ── 2. Collecte news RSS ── */
  const feeds = FEEDS[category] || FEEDS.forex;
  const headlines = [];
  await Promise.allSettled(feeds.map(async url => {
    try {
      const r = await fetch(url, {
        signal: AbortSignal.timeout(8000),
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; ForexAverage/1.0)',
          'Accept': 'application/rss+xml, text/xml, */*'
        }
      });
      if (!r.ok) return;
      extractTitles(await r.text(), 8).forEach(t => headlines.push(t));
    } catch(e) {}
  }));

  /* ── 3. Analyse GPT-4o-mini ── */
  if (process.env.OPENAI_API_KEY && (headlines.length >= 2 || priceData)) {
    try {
      const priceBlock = priceData
        ? `📊 Données de marché en temps réel pour ${asset} :
- Prix actuel : ${priceData.current} ${priceData.currency}
- Performance 5j : ${priceData.change5d > 0 ? '+' : ''}${priceData.change5d}%
- Plus haut 5j : ${priceData.high5d} | Plus bas 5j : ${priceData.low5d}
- Support immédiat : ${priceData.support} | Résistance clé : ${priceData.resistance}
- Tendance 5j : ${priceData.trend}`
        : `Pas de données de prix disponibles pour ${asset}.`;

      const newsBlock = headlines.length > 0
        ? `📰 Actualités récentes (${headlines.length} titres) :\n${headlines.slice(0, 12).map((h, i) => `${i+1}. ${h}`).join('\n')}`
        : 'Pas d\'actualités récentes disponibles.';

      const prompt = `Tu es un analyste financier senior de Forex Average, expert en marchés ${category === 'or' ? 'des métaux précieux' : category === 'petrole' ? 'pétroliers' : category === 'crypto' ? 'crypto' : category === 'macro' ? 'actions & macro' : 'forex'}.

${priceBlock}

${newsBlock}

Génère une analyse complète et professionnelle pour ${asset}. Sois précis, cite les niveaux réels.

Réponds UNIQUEMENT en JSON valide (pas de markdown) :
{
  "sentiment": "bullish" | "bearish" | "neutral",
  "score": <entier 0-100, 50=neutre>,
  "tldr": "<résumé percutant en 2 phrases max, en français>",
  "technical": "<analyse technique rédigée en français, 3-5 phrases : tendance, niveaux clés, signaux, volumes>",
  "factors": ["<facteur fondamental 1, max 100 chars>", "<facteur 2>", "<facteur 3>", "<facteur 4>"],
  "conclusion": "<conclusion actionnable en 2-3 phrases : que faire concrètement>",
  "price": ${priceData ? priceData.current : 'null'},
  "change5d": "${priceData ? priceData.change5d : '0'}"
}`;

      const oaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        signal: AbortSignal.timeout(15000),
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 600,
          temperature: 0.2,
          response_format: { type: 'json_object' }
        })
      });

      if (oaiRes.ok) {
        const oaiData = await oaiRes.json();
        const text = oaiData.choices?.[0]?.message?.content || '';
        try {
          const a = JSON.parse(text);
          if (a.sentiment && a.tldr) {
            return res.status(200).json({
              sentiment:  a.sentiment,
              score:      Math.max(0, Math.min(100, Math.round(a.score || 50))),
              tldr:       a.tldr,
              technical:  a.technical || '',
              factors:    (a.factors || []).slice(0, 5),
              conclusion: a.conclusion || '',
              price:      a.price || priceData?.current,
              change5d:   a.change5d || priceData?.change5d,
              source:     'ai',
              count:      headlines.length
            });
          }
        } catch(e) {}
      }
    } catch(e) {}
  }

  /* ── 4. Fallback scoring ── */
  let bull = 0, bear = 0;
  headlines.forEach(h => {
    const l = h.toLowerCase();
    BULL.forEach(w => { if (l.includes(w)) bull++; });
    BEAR.forEach(w => { if (l.includes(w)) bear++; });
  });
  const total    = bull + bear || 1;
  const score    = Math.max(5, Math.min(95, 50 + Math.round(((bull - bear) / total) * 40)));
  const sentiment = score > 58 ? 'bullish' : score < 42 ? 'bearish' : 'neutral';

  const trendLabel = priceData
    ? `Tendance ${priceData.trend} sur 5 jours (${priceData.change5d > 0 ? '+' : ''}${priceData.change5d}%). Support : ${priceData.support} — Résistance : ${priceData.resistance}.`
    : 'Données techniques en cours de chargement.';

  return res.status(200).json({
    sentiment,
    score,
    tldr: `Sentiment ${sentiment === 'bullish' ? 'haussier' : sentiment === 'bearish' ? 'baissier' : 'neutre'} basé sur l'analyse des dernières actualités. ${trendLabel}`,
    technical: trendLabel,
    factors: headlines.slice(0, 4).map(h => h.length > 95 ? h.slice(0, 92) + '…' : h),
    conclusion: 'Activez votre clé OpenAI pour une analyse IA complète et personnalisée.',
    price:    priceData?.current || null,
    change5d: priceData?.change5d || '0',
    source:   'keywords',
    count:    headlines.length
  });
}
