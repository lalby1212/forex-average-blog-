/* ============================================================
   fa-analyse.js — Forex Average · Analyse fondamentale LIVE
   ------------------------------------------------------------
   Calcule, côté navigateur et SANS clé Anthropic :
     score = différentiel macro (fa-fundamentals.js)  ×  sentiment actualités (rss2json)
   Expose : window.FAAnalyse.compute(symbol, label, gcategory) -> Promise<analysis>
   Dépend de fa-fundamentals.js (window.FAFundamentals).
   ============================================================ */
(function () {
  'use strict';

  var RSS2JSON_KEY = 'fk4tjm400zm37ji6dzx7koexwnvud4fjjhd8xpky';
  var RSS = 'https://api.rss2json.com/v1/api.json?count=15' +
            (RSS2JSON_KEY ? '&api_key=' + RSS2JSON_KEY : '') + '&rss_url=';

  /* Flux par catégorie (validés OK avec ta clé) */
  var FEEDS = {
    forex:     ['https://www.forexlive.com/feed/news', 'https://www.investing.com/rss/news_1.rss', 'https://www.fxempire.com/api/v1/en/articles/rss/news'],
    commodity: ['https://www.bullionvault.com/gold-news/rss.do', 'https://oilprice.com/rss/main'],
    crypto:    ['https://cointelegraph.com/rss', 'https://beincrypto.com/feed/'],
    indice:    ['https://feeds.content.dowjones.io/public/rss/mw_topstories', 'https://www.cnbc.com/id/100003114/device/rss/rss.html']
  };

  /* Termes par devise (filtrage + sentiment) */
  var CT = {
    USD:['dollar','dxy','fed','federal reserve','powell','greenback'],
    EUR:['euro','ecb','european central bank','lagarde','eurozone'],
    GBP:['pound','sterling','gbp','bank of england','boe','cable'],
    JPY:['yen','jpy','bank of japan','boj','ueda'],
    CHF:['franc','chf','swiss','snb'],
    AUD:['aussie','aud','rba','australia','australian dollar'],
    NZD:['kiwi','nzd','rbnz','new zealand'],
    CAD:['loonie','cad','bank of canada','boc','canadian']
  };
  var ASSET_TERMS = {
    'XAU/USD':['gold','xau','bullion','precious metal'], 'XAG/USD':['silver','xag'],
    'WTI Oil':['wti','crude','oil','opec','petroleum'], 'Brent Oil':['brent','crude','opec','oil'],
    'Natural Gas':['natural gas','lng','gas price'],
    'BTC/USD':['bitcoin','btc'], 'ETH/USD':['ethereum','eth'], 'SOL/USD':['solana','sol'],
    'BNB/USD':['binance','bnb'], 'XRP/USD':['xrp','ripple'],
    'S&P 500':['s&p','spx','wall street','equities','stocks'], 'NASDAQ':['nasdaq','tech stocks'],
    'DAX':['dax','german stocks','frankfurt'], 'CAC 40':['cac','french stocks','paris'],
    'Nikkei':['nikkei','japan stocks'], 'FTSE 100':['ftse','uk stocks','london']
  };

  var BULL = ['surge','rally','rallied','gains','gained','rises','rose','jump','climb','climbs','higher','bullish','strong','beats',' beat ','hawkish','upbeat','optimism','breakout','soars','advance','rebound'];
  var BEAR = ['falls','fell','drop','drops','decline','declines','lower','bearish','weak','weakens','misses',' miss ','dovish','slump','plunge','tumble','selloff','pressure','losses','sinks','retreat','recession'];

  /* Mapping symbole graphique -> instrument fa-fundamentals (non-forex) */
  var SYM2INSTR = {
    'XAUUSD=X':'XAU/USD','XAGUSD=X':'XAG/USD','CL=F':'WTI Oil','BZ=F':'Brent Oil','NG=F':'Natural Gas',
    'BTC-USD':'BTC/USD','ETH-USD':'ETH/USD','SOL-USD':'SOL/USD','BNB-USD':'BNB/USD','XRP-USD':'XRP/USD',
    '^GSPC':'S&P 500','^NDX':'NASDAQ','^DJI':'S&P 500','^GDAXI':'DAX','^FCHI':'CAC 40','^N225':'Nikkei','^FTSE':'FTSE 100','^STOXX50E':'DAX'
  };
  var GCAT2FCAT = { forex:'forex', or:'commodity', petrole:'commodity', crypto:'crypto', macro:'indice' };

  function clamp(v,a,b){ return Math.max(a, Math.min(b, v)); }

  async function fetchFeed(u){
    try{
      var c=new AbortController(), t=setTimeout(function(){c.abort();},8000);
      var r=await fetch(RSS+encodeURIComponent(u),{signal:c.signal}); clearTimeout(t);
      if(!r.ok) return [];
      var d=await r.json(); if(!d||d.status!=='ok'||!d.items) return [];
      return d.items.map(function(it){ return ((it.title||'')+' '+(it.description||'')).toLowerCase().replace(/<[^>]*>/g,' '); });
    }catch(e){ return []; }
  }
  async function getNews(fcat){
    var key='fa_news_'+fcat;
    try{ var cc=JSON.parse(sessionStorage.getItem(key)||'null'); if(cc&&Date.now()-cc.t<15*60000) return cc.a; }catch(e){}
    var feeds=FEEDS[fcat]||FEEDS.forex, all=[];
    for(var i=0;i<feeds.length;i++){ all=all.concat(await fetchFeed(feeds[i])); }
    try{ sessionStorage.setItem(key, JSON.stringify({t:Date.now(), a:all})); }catch(e){}
    return all;
  }
  function count(txt,words){ var n=0; for(var i=0;i<words.length;i++){ if(txt.indexOf(words[i])!==-1) n++; } return n; }

  async function compute(sym, label, gcat){
    var fcat = GCAT2FCAT[gcat] || 'forex';
    var instrument = (fcat==='forex') ? label : (SYM2INSTR[sym] || label);

    /* 1. Différentiel macro */
    var fund = (window.FAFundamentals) ? window.FAFundamentals.fundamental(instrument, fcat) : null;
    var macro100 = fund ? clamp(Math.round(50 + (fund.score/25)*40), 5, 95) : 50;

    /* 2. Termes de filtrage news */
    var terms = [];
    if(fcat==='forex'){
      var p=label.split('/');
      [p[0],p[1]].forEach(function(c){ terms = terms.concat(CT[c] || [String(c).toLowerCase()]); });
    } else {
      terms = ASSET_TERMS[instrument] || [String(label).toLowerCase()];
    }

    /* 3. Sentiment actualités */
    var arts = await getNews(fcat);
    var matched = arts.filter(function(a){ return terms.some(function(t){ return a.indexOf(t)!==-1; }); });
    var sector = false;
    if(matched.length===0){ matched = arts; sector = true; }
    var b=0, br=0;
    matched.forEach(function(a){ b+=count(a,BULL); br+=count(a,BEAR); });
    var newsTilt = clamp(Math.round(((b-br)/(b+br+1))*20), -20, 20);

    /* 4. Mélange : 65% macro · 35% news */
    var score = clamp(Math.round(macro100*0.65 + (50+newsTilt)*0.35), 2, 98);
    var sentiment = score>=58 ? 'bullish' : score<=42 ? 'bearish' : 'neutral';

    var factors = [];
    if(fund) factors.push('Différentiel macro · ' + fund.detail);
    factors.push('Sentiment actualités · ' + b + ' signaux haussiers / ' + br + ' baissiers (' + matched.length + ' articles' + (sector?' secteur':'') + ')');
    if(fcat==='forex'){ var pp=label.split('/'); factors.push('Banques centrales ' + pp[0] + ' vs ' + pp[1] + ' · différentiel de taux à surveiller'); }
    factors.push('Régime de risque global · flux & positionnement');

    var dir = sentiment==='bullish' ? 'haussiers (long)' : sentiment==='bearish' ? 'baissiers (short)' : 'neutres (attendre confirmation)';
    var biais = sentiment==='bullish' ? 'haussier' : sentiment==='bearish' ? 'baissier' : 'neutre';
    var tldr = label + ' — biais ' + biais + '. ' + (fund ? fund.detail + '. ' : '') +
               'Sentiment actualités ' + (newsTilt>3?'positif':newsTilt<-3?'négatif':'mitigé') + '.';
    var conclusion = 'Privilégier les setups ' + dir + ' sur ' + label + '. Confirmer avec l\'onglet Technique (BOS + OB).';

    return { score:score, sentiment:sentiment, tldr:tldr, factors:factors, conclusion:conclusion,
             updated_at:new Date().toISOString(), source:'live' };
  }

  window.FAAnalyse = { compute: compute };
})();
