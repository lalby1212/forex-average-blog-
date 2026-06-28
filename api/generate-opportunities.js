// ════════════════════════════════════════════════════════════════
//  api/generate-opportunities.js — Vercel Serverless Function
//  Génère les « Meilleures Opportunités » d'une catégorie via Claude,
//  à partir des scores des instruments (table fundamentals) + actus.
//  Remplace les opportunités de la catégorie dans la table `opportunities`.
//
//  Variables d'environnement (mêmes que generate-fundamentals) :
//    ANTHROPIC_API_KEY · SUPABASE_SERVICE_ROLE_KEY · SUPABASE_URL
//    SUPABASE_ANON_KEY · ANTHROPIC_MODEL
//
//  Appel : POST /api/generate-opportunities?category=currency
//          header Authorization: Bearer <jwt admin>
//          body { headlines:[...] }
//  Réponse : { category, count }
// ════════════════════════════════════════════════════════════════

export const maxDuration = 60;

const SB_URL  = process.env.SUPABASE_URL || 'https://bpfpghlpdzevzyhalxov.supabase.co';
const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ANON    = process.env.SUPABASE_ANON_KEY || 'sb_publishable_XHStaFT7Lkp7FRomgGmOFw_8puBQvTZ';
const ANTHRO  = process.env.ANTHROPIC_API_KEY;
const MODEL   = process.env.ANTHROPIC_MODEL || 'claude-haiku-4-5-20251001';

const CATS = ['currency','metal','energy','indice','crypto'];

/* Consigne de format des paires selon la catégorie */
const PAIR_HINT = {
  currency: 'des PAIRES forex (ex "AUD/USD", "USD/CHF", "NOK/SEK") construites en opposant les devises au plus fort différentiel de score.',
  metal:    'des actifs métaux (ex "GOLD (Long)", "SILVER (Long / repli)", "COPPER (Long)").',
  energy:   'des actifs énergie (ex "WTI (Long)", "BRENT (Long)", "NATGAS (Short)").',
  indice:   'des indices (ex "S&P 500 (Long)", "NASDAQ (Long)", "DAX (Long)").',
  crypto:   'des cryptos (ex "BTC/USD (Long)", "ETH/USD (Short)").'
};

function send(res, code, obj){ res.status(code).json(obj); }

function buildPrompt(category, instruments, headlines){
  var list = instruments.map(function(x){
    return '- '+x.code+' ('+(x.name||x.code)+') : score '+(x.score==null?'?':x.score)+'/5'+(x.bias?(' · '+x.bias):'');
  }).join('\n');
  var news = (headlines && headlines.length) ? headlines.map(function(h){ return '- '+h; }).join('\n') : '(aucune actualité disponible)';

  return [
'Tu es analyste macro pour Forex Average. À partir des SCORES fondamentaux ci-dessous et des actualités, identifie les MEILLEURES opportunités de trading de la catégorie. But informatif, pas de conseil financier, pas de promesse de gain.',
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
'  rank (string "01".."06"),',
'  top (boolean ; true pour les 3 meilleures),',
'  pair (string),',
'  dir (string court : "BUY", "SELL", ou "SELL XXX"),',
'  dir_cls (string : "dir-buy" si achat/long, "dir-sell" si vente/short),',
'  logic (string HTML COURT : commence par <strong>…</strong> résumant la thèse, puis 1-2 phrases factuelles + une cible/zone. Max ~45 mots),',
'  spread (string HTML COURT : ex "Score diff : <span>AUD +1.5 vs USD −1.0 = 2.5 pts</span> · Cible : <span>0.72-0.73</span>").',
'- Tout en FRANÇAIS, factuel, nuancé.',
'',
'RÉPONDS UNIQUEMENT avec un tableau JSON valide (de [ à ]), sans texte ni balises autour.'
  ].join('\n');
}

async function callClaude(prompt){
  var r = await fetch('https://api.anthropic.com/v1/messages', {
    method:'POST',
    headers:{ 'x-api-key': ANTHRO, 'anthropic-version':'2023-06-01', 'content-type':'application/json' },
    body: JSON.stringify({ model: MODEL, max_tokens: 3000, messages:[{ role:'user', content: prompt }] }),
    signal: AbortSignal.timeout(50000)
  });
  if(!r.ok){ var t = await r.text(); throw new Error('Anthropic '+r.status+': '+t.slice(0,200)); }
  var data = await r.json();
  var text = (data.content && data.content[0] && data.content[0].text) ? data.content[0].text : '';
  text = text.replace(/```json/gi,'').replace(/```/g,'').trim();
  var m = text.match(/\[[\s\S]*\]/);
  if(m){ return JSON.parse(m[0]); }
  throw new Error('Réponse Claude sans JSON exploitable');
}

async function replaceCategory(category, items){
  // 1) supprimer les opportunités existantes de la catégorie
  await fetch(SB_URL+'/rest/v1/opportunities?category=eq.'+encodeURIComponent(category), {
    method:'DELETE',
    headers:{ 'apikey': SERVICE, 'Authorization':'Bearer '+SERVICE, 'Prefer':'return=minimal' }
  });
  // 2) insérer les nouvelles
  var rows = items.map(function(it, i){
    return {
      category: category,
      rank: it.rank || ('0'+(i+1)),
      top: !!it.top,
      pair: it.pair || '',
      dir: it.dir || '',
      dir_cls: (it.dir_cls === 'dir-sell' ? 'dir-sell' : 'dir-buy'),
      logic: it.logic || '',
      spread: it.spread || '',
      position: i,
      updated_at: new Date().toISOString()
    };
  });
  if(!rows.length) return 0;
  var r = await fetch(SB_URL+'/rest/v1/opportunities', {
    method:'POST',
    headers:{ 'apikey': SERVICE, 'Authorization':'Bearer '+SERVICE, 'Content-Type':'application/json', 'Prefer':'return=minimal' },
    body: JSON.stringify(rows)
  });
  if(!(r.ok || r.status===201 || r.status===204)){ var t = await r.text(); throw new Error('Insert '+r.status+': '+t.slice(0,150)); }
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
  if(CATS.indexOf(category) === -1) return send(res,400,{ error:'Catégorie invalide' });

  try{
    var ir = await fetch(SB_URL+'/rest/v1/fundamentals?category=eq.'+encodeURIComponent(category)+'&select=code,name,score,bias&order=score.desc',
      { headers:{ 'apikey':ANON } });
    var instruments = await ir.json();
    if(!Array.isArray(instruments) || !instruments.length) return send(res,200,{ category, count:0 });

    var heads = (req.body && Array.isArray(req.body.headlines)) ? req.body.headlines : [];
    var items = await callClaude(buildPrompt(category, instruments, heads));
    var count = await replaceCategory(category, items);

    return send(res,200,{ category, count });
  }catch(e){
    return send(res,500,{ error: (e && e.message) || 'Erreur génération opportunités' });
  }
}
