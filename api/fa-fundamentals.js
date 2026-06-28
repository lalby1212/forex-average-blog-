/* ============================================================
   fa-fundamentals.js — Forex Average · Pilier Fondamental v2
   ------------------------------------------------------------
   Lit les scores depuis la table Supabase `fundamentals`
   (alimentée par admin-fondamentaux.html). Les valeurs ci-dessous
   ne servent que de SECOURS si Supabase est indisponible.
   Expose : window.FAFundamentals.fundamental(instrument, categorie)
            window.FAFundamentals.whenReady()  -> Promise
   ============================================================ */
(function () {
  'use strict';

  var SB_URL = 'https://bpfpghlpdzevzyhalxov.supabase.co';
  var SB_KEY = 'sb_publishable_XHStaFT7Lkp7FRomgGmOFw_8puBQvTZ';

  /* ── Valeurs de secours (MAJ 28 Avril 2026) ── */
  var CURRENCY = {
    USD: -1.0, EUR: 0.5, GBP: 0.0, JPY: 0.0, CHF: 1.5,
    AUD: 1.5, NZD: -0.5, CAD: -1.0, NOK: 1.5, SEK: -0.5
  };
  var ASSET = {
    'XAU/USD': 4.0, 'XAG/USD': 3.0, 'Platinum': 0.5, 'Copper': 2.5,
    'Brent Oil': 3.5, 'WTI Oil': 2.5, 'Natural Gas': -1.5,
    'S&P 500': 2.0, 'NASDAQ': 2.5, 'DAX': 1.5, 'CAC 40': 0.5, 'Nikkei': 3.0, 'FTSE 100': 1.0,
    'BTC/USD': -0.5, 'ETH/USD': -1.5, 'SOL/USD': -1.5, 'BNB/USD': 0.0, 'XRP/USD': -0.5
  };

  /* Mapping code de la table -> clé ASSET utilisée par le scoring */
  var CODE2ASSET = {
    GOLD:'XAU/USD', SILVER:'XAG/USD', COPPER:'Copper', PLATINUM:'Platinum', PALLADIUM:'Palladium',
    WTI:'WTI Oil', BRENT:'Brent Oil', NATGAS:'Natural Gas',
    'S&P 500':'S&P 500', NASDAQ:'NASDAQ', 'DAX 40':'DAX', NIKKEI:'Nikkei', 'CAC 40':'CAC 40', 'FTSE 100':'FTSE 100',
    BTC:'BTC/USD', ETH:'ETH/USD', SOL:'SOL/USD', XRP:'XRP/USD', BNB:'BNB/USD'
  };

  function clamp(v, mn, mx) { return Math.max(mn, Math.min(mx, v)); }
  function sgn(v) { return (v >= 0 ? '+' : '') + v; }

  /* ── Chargement Supabase (override les valeurs de secours) ── */
  var ready = (async function () {
    try {
      var r = await fetch(SB_URL + '/rest/v1/fundamentals?select=code,category,score',
        { headers: { 'apikey': SB_KEY, 'Accept': 'application/json' } });
      if (!r.ok) return false;
      var rows = await r.json();
      if (!Array.isArray(rows) || !rows.length) return false;
      rows.forEach(function (x) {
        if (x.score == null) return;
        if (x.category === 'currency') { CURRENCY[x.code] = Number(x.score); }
        else { var key = CODE2ASSET[x.code] || x.code; ASSET[key] = Number(x.score); }
      });
      return true;
    } catch (e) { return false; }
  })();

  function fundamental(instrument, categorie) {
    if (categorie === 'forex' && instrument.indexOf('/') > 0) {
      var p = instrument.split('/');
      var b = CURRENCY[p[0]], q = CURRENCY[p[1]];
      if (b === undefined || q === undefined) return null;
      var diff = b - q;
      return { score: clamp(Math.round(diff * 10), -25, 25), kind: 'forex',
               detail: p[0] + ' (' + sgn(b) + ') vs ' + p[1] + ' (' + sgn(q) + ') · différentiel ' + sgn(diff) };
    }
    if (ASSET[instrument] !== undefined) {
      var sc = ASSET[instrument];
      return { score: clamp(Math.round(sc * 5), -25, 25), kind: 'asset', detail: 'Note macro ' + sgn(sc) + ' / 5' };
    }
    return null;
  }

  window.FAFundamentals = {
    fundamental: fundamental,
    CURRENCY: CURRENCY,
    ASSET: ASSET,
    whenReady: function () { return ready; }
  };
})();
