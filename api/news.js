/* ═══════════════════════════════════════════════════════════
   Forex Average — API /api/news?category=forex
   Vercel serverless (Node 20) — fetch RSS côté serveur
   Pas de dépendance npm, parsing XML natif regex
═══════════════════════════════════════════════════════════ */

const FEEDS = {
  forex: [
    { name: 'FXStreet',   url: 'https://www.fxstreet.com/rss/news'             },
    { name: 'Forexlive',  url: 'https://www.forexlive.com/feed/'               },
    { name: 'DailyFX',   url: 'https://www.dailyfx.com/feeds/all'              }
  ],
  crypto: [
    { name: 'CoinTelegraph', url: 'https://cointelegraph.com/rss'              },
    { name: 'Decrypt',       url: 'https://decrypt.co/feed'                    },
    { name: 'BeInCrypto',   url: 'https://beincrypto.com/feed/'               }
  ],
  or: [
    { name: 'Kitco',      url: 'https://www.kitco.com/rss/kitconews.xml'       },
    { name: 'Mining.com', url: 'https://www.mining.com/feed/'                  },
    { name: 'Bullion Vault', url: 'https://www.bullionvault.com/gold-news/rss.do' }
  ],
  petrole: [
    { name: 'OilPrice',   url: 'https://oilprice.com/rss/main'                 },
    { name: 'Rigzone',    url: 'https://www.rigzone.com/news/rss/rigzone_latest.aspx' }
  ],
  macro: [
    { name: 'Reuters',     url: 'https://feeds.reuters.com/reuters/businessNews' },
    { name: 'MarketWatch', url: 'https://feeds.content.dowjones.io/public/rss/mw_topstories' },
    { name: 'CNBC',        url: 'https://www.cnbc.com/id/100003114/device/rss/rss.html' }
  ]
};

/* ─── Parser XML léger (regex RSS 2.0) ─── */
function getTag(xml, tag) {
  const re = new RegExp(
    `<${tag}[^>]*>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?<\\/${tag}>`,
    'i'
  );
  const m = xml.match(re);
  return m ? m[1].trim() : '';
}

function stripHtml(str) {
  return (str || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ').trim();
}

function parseRSS(xml, sourceName) {
  const items = [];
  const re = /<item>([\s\S]*?)<\/item>/gi;
  let match;
  while ((match = re.exec(xml)) !== null) {
    const block = match[1];

    /* Lien : <link> peut être vide en RSS 2.0, on cherche aussi guid */
    let link = getTag(block, 'link');
    if (!link) {
      const guidM = block.match(/<guid[^>]*>(https?:\/\/[^<]+)<\/guid>/i);
      link = guidM ? guidM[1].trim() : '';
    }

    const title   = stripHtml(getTag(block, 'title'));
    const summary = stripHtml(
      getTag(block, 'description') ||
      getTag(block, 'content:encoded') ||
      getTag(block, 'summary')
    ).slice(0, 300);
    const date = getTag(block, 'pubDate') || getTag(block, 'dc:date') || getTag(block, 'published');

    if (title && link) {
      items.push({ title, summary, link, date, source: sourceName });
    }
  }
  return items;
}

/* ─── Fetch une source avec timeout 8s ─── */
async function fetchSource(source) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(source.url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; ForexAverage/1.0; +https://forexaverage.fr)',
        'Accept': 'application/rss+xml, application/xml, text/xml, */*'
      }
    });
    clearTimeout(timeout);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const xml = await res.text();
    return parseRSS(xml, source.name);
  } catch (e) {
    console.warn(`[news-api] Failed: ${source.name} — ${e.message}`);
    return [];
  }
}

/* ─── Handler principal ─── */
export default async function handler(req, res) {
  /* CORS — accessible depuis n'importe quel domaine */
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { category = 'forex' } = req.query;
  const sources = FEEDS[category] || FEEDS.forex;

  /* Fetch toutes les sources en parallèle */
  const results = await Promise.all(sources.map(fetchSource));
  const allItems = results.flat();

  /* Dédoublonnage + tri chronologique */
  const seen = new Set();
  const items = allItems
    .filter(item => {
      const key = item.title.slice(0, 60).toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key); return true;
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 18);

  /* Cache Vercel CDN : 15 min, stale-while-revalidate 5 min */
  res.setHeader('Cache-Control', 's-maxage=900, stale-while-revalidate=300');
  return res.status(200).json({ items, category, count: items.length });
}
