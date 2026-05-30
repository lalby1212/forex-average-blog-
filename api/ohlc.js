// api/ohlc.js — Vercel Serverless Function
// Proxy Yahoo Finance pour éviter les problèmes CORS
// À placer dans le dossier api/ à la racine du projet Vercel (même niveau que api/news.js)

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  const { symbol = 'EURUSD=X', interval = '60m', range = '15d' } = req.query;

  // Nettoyage sécurité
  const cleanSym      = symbol.replace(/[^A-Z0-9=\-\^\.]/gi, '');
  const allowedInterv = ['1m','5m','15m','30m','60m','1h','1d','1wk','1mo'];
  const allowedRange  = ['1d','5d','15d','30d','60d','90d','1y','2y','5y'];
  const safeInterval  = allowedInterv.includes(interval)  ? interval  : '60m';
  const safeRange     = allowedRange.includes(range)       ? range     : '15d';

  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(cleanSym)}?interval=${safeInterval}&range=${safeRange}&includePrePost=false`;

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      res.status(response.status).json({ error: `Yahoo returned ${response.status}` });
      return;
    }

    const data = await response.json();

    // Cache 3 minutes
    res.setHeader('Cache-Control', 's-maxage=180, stale-while-revalidate=60');
    res.status(200).json(data);

  } catch(e) {
    res.status(500).json({ error: e.message || 'fetch failed' });
  }
}
