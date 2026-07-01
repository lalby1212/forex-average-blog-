/* ============================================================
   fa-journal.js — Forex Average · Sync Plan + Journal (Supabase)
   ------------------------------------------------------------
   Source de vérité = table Supabase `trading_data` (1 ligne/compte).
   Le localStorage sert de CACHE local : les pages continuent de lire
   `fa_active_plan` et `fa_journal_<email>` comme avant.

   API :
     await FAJournal.pull()        -> hydrate le localStorage depuis Supabase
     await FAJournal.pushPlan()    -> envoie le plan local vers Supabase
     await FAJournal.pushTrades()  -> envoie les trades locaux vers Supabase
     FAJournal.ready               -> Promise résolue après le 1er pull
   Ne nécessite PAS supabase-js (fetch REST direct).
   ============================================================ */
(function () {
  'use strict';

  var SB  = 'https://bpfpghlpdzevzyhalxov.supabase.co';
  var KEY = 'sb_publishable_XHStaFT7Lkp7FRomgGmOFw_8puBQvTZ';

  function session() {
    try {
      for (var k in localStorage) {
        if (k.indexOf('sb-') === 0 && k.indexOf('-auth-token') > 0) {
          var s = JSON.parse(localStorage.getItem(k) || 'null');
          if (s && s.access_token) { s.__k = k; return s; }
        }
      }
    } catch (e) {}
    return null;
  }
  function uid()   { var s = session(); return (s && s.user) ? s.user.id : null; }
  function email() {
    var s = session();
    if (s && s.user && s.user.email) return s.user.email;
    try { var u = JSON.parse(localStorage.getItem('fa_user') || 'null'); return u && u.email; } catch (e) { return null; }
  }
  function jKey() { return 'fa_journal_' + (email() || 'guest'); }

  /* Rafraîchit le token si expiré (évite JWT expired) */
  async function freshToken() {
    var s = session(); if (!s) return null;
    var exp = s.expires_at ? s.expires_at * 1000 : 0;
    if (exp && (exp - Date.now()) > 60000) return s.access_token;
    if (!s.refresh_token) return s.access_token;
    try {
      var r = await fetch(SB + '/auth/v1/token?grant_type=refresh_token', {
        method: 'POST', headers: { 'apikey': KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: s.refresh_token })
      });
      if (!r.ok) return s.access_token;
      var d = await r.json();
      try {
        s.access_token = d.access_token; s.refresh_token = d.refresh_token;
        s.expires_at = d.expires_at; s.expires_in = d.expires_in;
        var copy = Object.assign({}, s); delete copy.__k;
        localStorage.setItem(s.__k, JSON.stringify(copy));
      } catch (e) {}
      return d.access_token;
    } catch (e) { return s.access_token; }
  }

  async function fetchRow() {
    var t = await freshToken(), u = uid();
    if (!t || !u) return null;
    try {
      var r = await fetch(SB + '/rest/v1/trading_data?user_id=eq.' + u + '&select=plan,trades',
        { headers: { 'apikey': KEY, 'Authorization': 'Bearer ' + t } });
      if (!r.ok) return null;
      var rows = await r.json();
      return (rows && rows[0]) ? rows[0] : { plan: {}, trades: [] };
    } catch (e) { return null; }
  }

  async function upsert(patch) {
    var t = await freshToken(), u = uid();
    if (!t || !u) return false;
    var body = Object.assign({ user_id: u, updated_at: new Date().toISOString() }, patch);
    try {
      var r = await fetch(SB + '/rest/v1/trading_data?on_conflict=user_id', {
        method: 'POST',
        headers: { 'apikey': KEY, 'Authorization': 'Bearer ' + t, 'Content-Type': 'application/json',
                   'Prefer': 'resolution=merge-duplicates,return=minimal' },
        body: JSON.stringify(body)
      });
      return r.ok || r.status === 201 || r.status === 204;
    } catch (e) { return false; }
  }

  /* Hydrate le localStorage depuis Supabase (Supabase prime) */
  async function pull() {
    var row = await fetchRow();
    if (!row) return false;
    try {
      if (row.plan && Object.keys(row.plan).length) {
        localStorage.setItem('fa_active_plan', JSON.stringify(row.plan));
      }
      if (Array.isArray(row.trades)) {
        localStorage.setItem(jKey(), JSON.stringify(row.trades));
      }
    } catch (e) {}
    return true;
  }

  async function pushPlan() {
    var plan = null;
    try { plan = JSON.parse(localStorage.getItem('fa_active_plan') || 'null'); } catch (e) {}
    if (!plan) return false;
    return upsert({ plan: plan });
  }

  async function pushTrades() {
    var trades = [];
    try { trades = JSON.parse(localStorage.getItem(jKey()) || '[]'); } catch (e) {}
    return upsert({ trades: Array.isArray(trades) ? trades : [] });
  }

  var ready = pull().catch(function () { return false; });

  window.FAJournal = {
    pull: pull, pushPlan: pushPlan, pushTrades: pushTrades,
    ready: ready, _uid: uid, _email: email, _jKey: jKey
  };
})();
