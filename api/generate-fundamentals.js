// ════════════════════════════════════════════════════════════════
//  api/generate-fundamentals.js — Vercel Serverless Function
//  Génère l'analyse fondamentale COMPLÈTE via Claude AI et l'écrit
//  dans la table Supabase `fundamentals`. Traite par lots de 5.
//
//  Variables d'environnement (Vercel → Settings → Environment Variables) :
//    ANTHROPIC_API_KEY          → ta clé Anthropic (console.anthropic.com)
//    SUPABASE_SERVICE_ROLE_KEY  → clé service_role Supabase (SECRÈTE, serveur only)
//    SUPABASE_URL               → (optionnel) https://bpfpghlpdzevzyhalxov.supabase.co
//    SUPABASE_ANON_KEY          → (optionnel) clé publishable
//    ANTHROPIC_MODEL            → (optionnel) défaut claude-sonnet-4-6
//    RSS2JSON_KEY               → (optionnel) ta clé rss2json
//
//  Appel : GET /api/generate-fundamentals?category=currency&offset=0
//          (avec header Authorization: Bearer <jwt admin>)
//  Réponse : { category, processed:[codes], total, nextOffset|null }
// ════════════════════════════════════════════════════════════════

export const maxDuration = 60;

const SB_URL  = process.env.SUPABASE_URL || 'https://bpfpghlpdzevzyhalxov.supabase.co';
const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ANON    = process.env.SUPABASE_ANON_KEY || 'sb_publishable_XHStaFT7Lkp7FRomgGmOFw_8puBQvTZ';
const ANTHRO  = process.env.ANTHROPIC_API_KEY;
const MODEL   = process.env.ANTHROPIC_MODEL || 'claude-haiku-4-5-20251001';
const RSSKEY  = process.env.RSS2JSON_KEY || 'fk4tjm400zm37ji6dzx7koexwnvud4fjjhd8xpky';
const CHUNK   = 1;

/* Piliers par catégorie (clés EXACTES attendues par fondamentaux.html) */
const PILLARS = {
  currency: [['monetary','Monétaire'],['inflation','Inflation'],['growth','Croissance'],['employment','Emploi'],['risk','Risque']],
  metal:    [['supply','Offre'],['demand','Demande'],['usd','USD'],['rates','Taux'],['risk','Risque']],
  energy:   [['opec','OPEC'],['inventories','Stocks'],['demand','Demande'],['usd','USD'],['seasonal','Saisonnalité']],
  indice:   [['policy','Banque centrale'],['macro','Macro'],['earnings','Bénéfices'],['flows','Flux'],['risk','Risque']],
  crypto:   [['macro','Macro'],['onchain','On-chain'],['adoption','Adoption'],['supply','Offre'],['sentiment','Sentiment']]
};

const NEWS_FEEDS = {
  currency: ['https://www.forexlive.com/feed/news','https://www.investing.com/rss/news_1.rss','https://www.fxempire.com/api/v1/en/articles/rss/news'],
  metal:    ['https://www.bullionvault.com/gold-news/rss.do'],
  energy:   ['https://oilprice.com/rss/main'],
  indice:   ['https://feeds.content.dowjones.io/public/rss/mw_topstories','https://www.cnbc.com/id/100003114/device/rss/rss.html'],
  crypto:   ['https://cointelegraph.com/rss','https://beincrypto.com/feed/']
};

function send(res, code, obj){ res.status(code).json(obj); }

async function getNewsHeadlines(category){
  var feeds = (NEWS_FEEDS[category] || NEWS_FEEDS.currency).slice(0, 2);
  var results = await Promise.all(feeds.map(async function(f){
    try{
      var u = 'https://api.rss2json.com/v1/api.json?count=10' + (RSSKEY ? '&api_key='+RSSKEY : '') + '&rss_url=' + encodeURIComponent(f);
      var r = await fetch(u, { signal: AbortSignal.timeout(5000) });
      if(!r.ok) return [];
      var d = await r.json();
      if(d && d.status==='ok' && d.items) return d.items.map(function(it){ return it.title; }).filter(Boolean);
      return [];
    }catch(e){ return []; }
  }));
  var heads = [];
  results.forEach(function(a){ heads = heads.concat(a); });
  return heads.slice(0, 20);
}

function buildPrompt(category, instruments, headlines){
  var pk = PILLARS[category];
  var keys = pk.map(function(p){ return p[0]; });
  var pillarDesc = pk.map(function(p){ return '"'+p[0]+'" ('+p[1]+')'; }).join(', ');
  var instrList = instruments.map(function(x){ return '- code "'+x.code+'" : '+(x.name||x.code)+(x.bank?(' ('+x.bank+')'):''); }).join('\n');
  var news = headlines.length ? headlines.map(function(h){ return '- '+h; }).join('\n') : '(aucune actualité disponible)';

  return [
'Tu es analyste macro/géopolitique pour la plateforme Forex Average. Tu produis une analyse fondamentale STRUCTURÉE, factuelle et prudente, à but informatif (pas de conseil financier, pas de promesse de gain).',
'',
'CATÉGORIE : '+category,
'INSTRUMENTS à analyser :',
instrList,
'',
'ACTUALITÉS RÉCENTES (titres) :',
news,
'',
'CONSIGNES :',
'- Pour CHAQUE instrument, produis un objet JSON avec EXACTEMENT ces champs :',
'  code (string, identique à ci-dessus),',
'  score (number entre -5 et +5 = biais fondamental global),',
'  bias (string court en MAJUSCULES, ex "LÉG. HAUSSIER"),',
'  bias_cls (un de : "bt-hawk","bt-lhawk","bt-neu","bt-ldov","bt-dov" selon score),',
'  rate (string, taux directeur / niveau de référence court, ex "3.50-3.75%"),',
'  key_data (array de paires [libellé, valeur], 3 à 5 éléments),',
'  pillars (objet avec EXACTEMENT ces clés : '+pillarDesc+' ; chaque valeur = {"score": number -5..+5, "wt": string ex "40%"}),',
'  detail (objet avec les MÊMES clés de piliers ; chaque valeur = {"rows":[{"k":string,"v":string,"c":"bull"|"bear"|"neutral"}], "pr":string paragraphe d\'analyse}),',
'  pricing (string court, contexte de prix/niveaux),',
'  concl (string court, synthèse directionnelle).',
'- Tout en FRANÇAIS. Reste factuel, nuancé, sans promesse de rendement.',
'- SOIS CONCIS pour tenir dans la limite : 2 à 3 lignes de détail MAX par pilier, paragraphes (pr) de 1 à 2 phrases, key_data 3 à 4 éléments.',
'- bias_cls : score>=1.5 "bt-hawk" ; 0.5..1.4 "bt-lhawk" ; -0.4..0.4 "bt-neu" ; -1.4..-0.5 "bt-ldov" ; <=-1.5 "bt-dov".',
'',
'RÉPONDS UNIQUEMENT avec un tableau JSON valide (commençant par [ et finissant par ]), sans texte ni balises autour.'
  ].join('\n');
}

async function callClaude(prompt){
  var r = await fetch('https://api.anthropic.com/v1/messages', {
    method:'POST',
    headers:{ 'x-api-key': ANTHRO, 'anthropic-version':'2023-06-01', 'content-type':'application/json' },
    body: JSON.stringify({ model: MODEL, max_tokens: 4000, messages:[{ role:'user', content: prompt }] }),
    signal: AbortSignal.timeout(50000)
  });
  if(!r.ok){ var t = await r.text(); throw new Error('Anthropic '+r.status+': '+t.slice(0,200)); }
  var data = await r.json();
  var text = (data.content && data.content[0] && data.content[0].text) ? data.content[0].text : '';
  text = text.replace(/```json/gi,'').replace(/```/g,'').trim();
  var m = text.match(/\[[\s\S]*\]/);
  if(m){ return JSON.parse(m[0]); }
  var o = text.match(/\{[\s\S]*\}/);
  if(o){ return [JSON.parse(o[0])]; }
  throw new Error('Réponse Claude sans JSON exploitable');
}

async function upsert(item, category){
  var row = {
    code: item.code, category: category,
    score: (item.score==null?null:Number(item.score)),
    bias: item.bias||'', bias_cls: item.bias_cls||'bt-neu', rate: item.rate||'',
    key_data: item.key_data||[], pillars: item.pillars||{}, detail: item.detail||{},
    pricing: item.pricing||'', concl: item.concl||'', updated_at: new Date().toISOString()
  };
  var r = await fetch(SB_URL+'/rest/v1/fundamentals?on_conflict=code', {
    method:'POST',
    headers:{ 'apikey': SERVICE, 'Authorization':'Bearer '+SERVICE, 'Content-Type':'application/json', 'Prefer':'resolution=merge-duplicates,return=minimal' },
    body: JSON.stringify(row)
  });
  return r.ok || r.status===201 || r.status===204;
}

/* ── Mode OPPORTUNITÉS (fusionné pour rester sous la limite Vercel) ── */
const PAIR_HINT = {
  currency: 'des PAIRES forex (ex "AUD/USD", "USD/CHF", "NOK/SEK") en opposant les devises au plus fort différentiel de score.',
  metal:    'des actifs métaux (ex "GOLD (Long)", "SILVER (Long / repli)", "COPPER (Long)").',
  energy:   'des actifs énergie (ex "WTI (Long)", "BRENT (Long)", "NATGAS (Short)").',
  indice:   'des indices (ex "S&P 500 (Long)", "NASDAQ (Long)", "DAX (Long)").',
  crypto:   'des cryptos (ex "BTC/USD (Long)", "ETH/USD (Short)").'
};

function buildOppsPrompt(category, instruments, headlines){
  var list = instruments.map(function(x){
    return '- '+x.code+' ('+(x.name||x.code)+') : score '+(x.score==null?'?':x.score)+'/5'+(x.bias?(' · '+x.bias):'');
  }).join('\n');
  var news = (headlines && headlines.length) ? headlines.map(function(h){ return '- '+h; }).join('\n') : '(aucune actualité disponible)';
  return [
'Tu es analyste macro pour Forex Average. À partir des SCORES fondamentaux et des actus, identifie les MEILLEURES opportunités de trading de la catégorie. But informatif, pas de conseil financier, pas de promesse de gain.',
'',
'CATÉGORIE : '+category,
'INSTRUMENTS (score fondamental -5 à +5) :',
list,
'',
'ACTUALITÉS RÉCENTES (titres) :',
news,
'',
'CONSIGNES :',
'- Propose 4 à 6 opportunités, classées de la plus forte (rank "01") à la plus faible.',
'- Utilise '+(PAIR_HINT[category]||PAIR_HINT.currency),
'- Privilégie les plus GROSSES divergences de score (long le fort, short le faible).',
'- Pour CHAQUE opportunité, un objet JSON avec EXACTEMENT ces champs :',
'  rank (string "01".."06"), top (boolean ; true pour les 3 meilleures),',
'  pair (string), dir (string court : "BUY", "SELL", ou "SELL XXX"),',
'  dir_cls (string : "dir-buy" si achat/long, "dir-sell" si vente/short),',
'  logic (string HTML COURT : commence par <strong>…</strong> résumant la thèse, puis 1-2 phrases + une cible. Max ~45 mots),',
'  spread (string HTML COURT : ex "Score diff : <span>AUD +1.5 vs USD −1.0 = 2.5 pts</span> · Cible : <span>0.72-0.73</span>").',
'- Tout en FRANÇAIS, factuel, nuancé.',
'',
'RÉPONDS UNIQUEMENT avec un tableau JSON valide (de [ à ]), sans texte ni balises autour.'
  ].join('\n');
}

async function replaceOpportunities(category, items){
  await fetch(SB_URL+'/rest/v1/opportunities?category=eq.'+encodeURIComponent(category), {
    method:'DELETE', headers:{ 'apikey': SERVICE, 'Authorization':'Bearer '+SERVICE, 'Prefer':'return=minimal' }
  });
  var rows = (items||[]).map(function(it, i){
    return { category: category, rank: it.rank || ('0'+(i+1)), top: !!it.top, pair: it.pair || '',
      dir: it.dir || '', dir_cls: (it.dir_cls === 'dir-sell' ? 'dir-sell' : 'dir-buy'),
      logic: it.logic || '', spread: it.spread || '', position: i, updated_at: new Date().toISOString() };
  });
  if(!rows.length) return 0;
  var r = await fetch(SB_URL+'/rest/v1/opportunities', {
    method:'POST',
    headers:{ 'apikey': SERVICE, 'Authorization':'Bearer '+SERVICE, 'Content-Type':'application/json', 'Prefer':'return=minimal' },
    body: JSON.stringify(rows)
  });
  if(!(r.ok || r.status===201 || r.status===204)){ var t = await r.text(); throw new Error('Insert opp '+r.status+': '+t.slice(0,150)); }
  return rows.length;
}

export default async function handler(req, res){
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers','Authorization, Content-Type');
  if(req.method==='OPTIONS'){ res.status(200).end(); return; }

  if(!ANTHRO)  return send(res,500,{ error:'ANTHROPIC_API_KEY manquante' });
  if(!SERVICE) return send(res,500,{ error:'SUPABASE_SERVICE_ROLE_KEY manquante' });

  // ── Auth admin ──
  var token = (req.headers.authorization||'').replace(/^Bearer\s+/i,'');
  if(!token) return send(res,401,{ error:'Token requis' });
  try{
    var ur = await fetch(SB_URL+'/auth/v1/user',{ headers:{ 'apikey':ANON, 'Authorization':'Bearer '+token } });
    if(!ur.ok) return send(res,401,{ error:'Session invalide' });
    var user = await ur.json();
    var pr = await fetch(SB_URL+'/rest/v1/profiles?id=eq.'+user.id+'&select=is_admin',{ headers:{ 'apikey':ANON, 'Authorization':'Bearer '+token } });
    var prof = await pr.json();
    if(!(prof && prof[0] && prof[0].is_admin===true)) return send(res,403,{ error:'Accès admin requis' });
  }catch(e){ return send(res,401,{ error:'Auth échouée' }); }

  var category = req.query.category;
  var offset = parseInt(req.query.offset||'0')||0;
  if(!PILLARS[category]) return send(res,400,{ error:'Catégorie invalide' });

  // ── Mode opportunités ──
  if (req.query.mode === 'opportunities') {
    try {
      var iro = await fetch(SB_URL+'/rest/v1/fundamentals?category=eq.'+encodeURIComponent(category)+'&select=code,name,score,bias&order=score.desc', { headers:{ 'apikey':ANON } });
      var instrO = await iro.json();
      if(!Array.isArray(instrO) || !instrO.length) return send(res,200,{ category, count:0 });
      var headsO = (req.body && Array.isArray(req.body.headlines)) ? req.body.headlines : [];
      var opps = await callClaude(buildOppsPrompt(category, instrO, headsO));
      var count = await replaceOpportunities(category, opps);
      return send(res,200,{ category, count });
    } catch(e){ return send(res,500,{ error:(e&&e.message)||'Erreur opportunités' }); }
  }

  try{
    // instruments de la catégorie (depuis la table)
    var ir = await fetch(SB_URL+'/rest/v1/fundamentals?category=eq.'+encodeURIComponent(category)+'&select=code,name,bank&order=position.asc',
      { headers:{ 'apikey':ANON } });
    var all = await ir.json();
    if(!Array.isArray(all) || !all.length) return send(res,200,{ category, processed:[], total:0, nextOffset:null });

    var batch = all.slice(offset, offset+CHUNK);
    if(!batch.length) return send(res,200,{ category, processed:[], total:all.length, nextOffset:null });

    var heads = (req.body && Array.isArray(req.body.headlines)) ? req.body.headlines : [];
    var items = await callClaude(buildPrompt(category, batch, heads));

    var processed = [];
    for(var i=0;i<items.length;i++){
      if(await upsert(items[i], category)) processed.push(items[i].code);
    }

    var next = offset + CHUNK;
    return send(res,200,{ category, processed, total: all.length, nextOffset: (next < all.length ? next : null) });
  }catch(e){
    return send(res,500,{ error: (e && e.message) || 'Erreur génération' });
  }
}
