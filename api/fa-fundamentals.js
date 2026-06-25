/* ============================================================
   fa-fundamentals.js — Forex Average · Pilier Fondamental v1
   ------------------------------------------------------------
   Module SANS DOM : juste les scores macro + le calcul du
   différentiel par paire, pour alimenter le critère
   « Fondamentaux » de admin-scores.html.

   ⚠️  Ces scores REFLÈTENT fondamentaux-data.js (MAJ 28 Avril 2026).
       Quand tu mets à jour fondamentaux-data.js, reporte ici les
       nouveaux `score:` (devises + actifs).
   ============================================================ */
(function () {
  'use strict';

  /* Score global par devise (échelle ≈ -3 … +3) */
  var CURRENCY = {
    USD: -1.0, EUR: 0.5, GBP: 0.0, JPY: 0.0, CHF: 1.5,
    AUD: 1.5, NZD: -0.5, CAD: -1.0, NOK: 1.5, SEK: -0.5
  };

  /* Score global par actif non-forex (échelle ≈ -5 … +5), clé = nom dans admin-scores */
  var ASSET = {
    'XAU/USD': 4.0, 'XAG/USD': 3.0, 'Platinum': 0.5, 'Copper': 2.5,
    'Brent Oil': 3.5, 'WTI Oil': 2.5, 'Natural Gas': -1.5,
    'S&P 500': 2.0, 'NASDAQ': 2.5, 'DAX': 1.5, 'CAC 40': 0.5, 'Nikkei': 3.0, 'FTSE 100': 1.0,
    'BTC/USD': -0.5, 'ETH/USD': -1.5, 'SOL/USD': -1.5, 'BNB/USD': 0.0, 'XRP/USD': -0.5
  };

  function clamp(v, mn, mx) { return Math.max(mn, Math.min(mx, v)); }
  function sgn(v) { return (v >= 0 ? '+' : '') + v; }

  /* Renvoie { score (-25..+25), detail } ou null si pas de donnée macro.
     - Forex  : différentiel devise_base − devise_quote, ×10, borné ±25.
     - Autres : note de l'actif ×5, bornée ±25. */
  function fundamental(instrument, categorie) {
    if (categorie === 'forex' && instrument.indexOf('/') > 0) {
      var p = instrument.split('/');
      var b = CURRENCY[p[0]], q = CURRENCY[p[1]];
      if (b === undefined || q === undefined) return null;
      var diff = b - q;
      return {
        score: clamp(Math.round(diff * 10), -25, 25),
        kind: 'forex',
        detail: p[0] + ' (' + sgn(b) + ') vs ' + p[1] + ' (' + sgn(q) + ') · différentiel ' + sgn(diff)
      };
    }
    if (ASSET[instrument] !== undefined) {
      var sc = ASSET[instrument];
      return {
        score: clamp(Math.round(sc * 5), -25, 25),
        kind: 'asset',
        detail: 'Note macro ' + sgn(sc) + ' / 5'
      };
    }
    return null; // crypto/exotiques sans donnée → on garde le mot-clé
  }

  window.FAFundamentals = { fundamental: fundamental, CURRENCY: CURRENCY, ASSET: ASSET };
})();
