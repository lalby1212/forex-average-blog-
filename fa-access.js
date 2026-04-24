/**
 * fa-access.js — Forex Average Access Control
 * ─────────────────────────────────────────────
 * Charge une seule fois : vérifie la session Supabase + abonnement VIP.
 * Expose : window.FA = { loggedIn, isVIP }
 * Dispatch : document → 'fa:access' event
 * Auto-gate : scanne [data-gate="vip"] et [data-gate="inscrit"]
 *
 * Usage dans les pages :
 *   <script src="fa-access.js"></script>
 *
 * Sur un élément HTML :
 *   <div data-gate="vip">   ← bloqué pour non-VIP
 *   <div data-gate="inscrit"> ← bloqué pour non-connecté
 *
 * Depuis JS custom :
 *   document.addEventListener('fa:access', ({ detail }) => { ... })
 *   FAGate.gate(element, 'vip')   ← gate manuel
 *   FAGate.html('vip')            ← HTML de la carte CTA
 */

(function () {
  'use strict';

  /* ── Config ─────────────────────────────────────────────── */
  var SB_URL = 'https://bpfpghlpdzevzyhalxov.supabase.co';
  var SB_KEY = 'sb_publishable_XHStaFT7Lkp7FRomgGmOFw_8puBQvTZ';

  /* ── CSS ─────────────────────────────────────────────────── */
  var CSS = [
    /* wrapper overlay */
    '.fa-gate-overlay{',
      'position:absolute;inset:0;z-index:20;',
      'display:flex;flex-direction:column;align-items:center;justify-content:flex-end;',
      'pointer-events:none;border-radius:inherit;',
    '}',
    /* blur layer */
    '.fa-gate-blur{',
      'position:absolute;inset:0;',
      'backdrop-filter:blur(7px);-webkit-backdrop-filter:blur(7px);',
      'background:rgba(0,0,0,0.15);',
      'border-radius:inherit;',
    '}',
    /* gradient fade at top */
    '.fa-gate-fade{',
      'position:absolute;top:0;left:0;right:0;height:160px;',
      'background:linear-gradient(to bottom,transparent,rgba(4,4,4,0.92));',
      'pointer-events:none;',
    '}',
    /* floating CTA card */
    '.fa-gate-card{',
      'position:relative;z-index:3;pointer-events:all;',
      'margin-bottom:2.5rem;',
      'background:rgba(12,12,12,0.97);',
      'border:1px solid rgba(255,215,0,0.22);',
      'border-radius:18px;',
      'padding:1.8rem 2.2rem 1.6rem;',
      'max-width:420px;width:90%;',
      'text-align:center;',
      'box-shadow:0 32px 90px rgba(0,0,0,0.75),0 0 0 1px rgba(255,215,0,0.07);',
      'backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);',
    '}',
    /* card inner */
    '.fa-gate-icon{font-size:2rem;margin-bottom:0.5rem;display:block;}',
    '.fa-gate-title{',
      'font-size:1.2rem;font-weight:800;color:#fff;',
      'margin-bottom:0.3rem;letter-spacing:-0.01em;',
    '}',
    '.fa-gate-sub{',
      'font-size:0.8rem;color:rgba(255,255,255,0.42);',
      'margin-bottom:1.1rem;line-height:1.5;',
    '}',
    '.fa-gate-features{',
      'list-style:none;text-align:left;margin-bottom:1.2rem;',
      'display:flex;flex-direction:column;gap:0.4rem;padding:0;',
    '}',
    '.fa-gate-features li{',
      'font-size:0.8rem;color:rgba(255,255,255,0.58);',
      'display:flex;align-items:flex-start;gap:0.5rem;',
    '}',
    '.fa-gate-features li::before{content:"✓";color:#22c55e;font-weight:800;flex-shrink:0;margin-top:1px;}',
    '.fa-gate-price{',
      'font-size:0.76rem;color:rgba(255,255,255,0.28);margin-bottom:1rem;',
    '}',
    '.fa-gate-price strong{font-size:1.45rem;color:#FFD700;font-weight:900;}',
    /* CTA buttons */
    '.fa-gate-btn{',
      'display:block;width:100%;',
      'padding:0.75rem 1.5rem;',
      'background:linear-gradient(135deg,#FFD700,#F59E0B);',
      'color:#000;font-weight:800;font-size:0.88rem;',
      'border-radius:9px;text-decoration:none;',
      'transition:opacity 0.2s,transform 0.2s;',
      'margin-bottom:0.6rem;',
    '}',
    '.fa-gate-btn:hover{opacity:0.9;transform:translateY(-1px);}',
    '.fa-gate-link{',
      'display:block;font-size:0.76rem;',
      'color:rgba(255,255,255,0.32);text-decoration:none;',
      'transition:color 0.2s;margin-top:0.2rem;',
    '}',
    '.fa-gate-link:hover{color:rgba(255,255,255,0.7);}',
    /* gate target must be positioned */
    '[data-gate-applied]{position:relative !important;overflow:hidden !important;}',
    /* mobile */
    '@media(max-width:600px){',
      '.fa-gate-card{padding:1.4rem 1.2rem 1.2rem;margin-bottom:1.5rem;}',
      '.fa-gate-title{font-size:1.05rem;}',
    '}'
  ].join('');

  function injectCSS() {
    if (document.getElementById('fa-access-css')) return;
    var s = document.createElement('style');
    s.id = 'fa-access-css';
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  /* ── Card HTML builder ───────────────────────────────────── */
  function buildHTML(level, loggedIn) {
    if (level === 'vip') {
      return [
        '<span class="fa-gate-icon">👑</span>',
        '<div class="fa-gate-title">Contenu Réservé VIP</div>',
        '<div class="fa-gate-sub">Débloquez l\'accès complet avec le plan VIP</div>',
        '<ul class="fa-gate-features">',
          '<li>Toutes les analyses premium avec niveaux précis</li>',
          '<li>Analyse macro complète — 28 paires G10</li>',
          '<li>Screener temps réel multi-marchés</li>',
          '<li>Signaux de trading prioritaires</li>',
        '</ul>',
        '<div class="fa-gate-price">À partir de <strong>24.99€</strong><span>/mois</span></div>',
        '<a href="pricing.html" class="fa-gate-btn">✦ Devenir VIP</a>',
        loggedIn
          ? ''
          : '<a href="login.html" class="fa-gate-link">Déjà inscrit ? Se connecter →</a>'
      ].join('');
    } else {
      /* inscrit gate */
      return [
        '<span class="fa-gate-icon">🔒</span>',
        '<div class="fa-gate-title">Connexion Requise</div>',
        '<div class="fa-gate-sub">Créez un compte gratuit pour accéder à cet outil</div>',
        '<ul class="fa-gate-features">',
          '<li>Graphiques TradingView avancés</li>',
          '<li>Calculateurs de trading professionnels</li>',
          '<li>Dashboard & journal de trading</li>',
          '<li>Actualités marchés illimitées</li>',
        '</ul>',
        '<a href="register.html" class="fa-gate-btn">Créer un compte gratuit</a>',
        '<a href="login.html" class="fa-gate-link">Déjà inscrit ? Se connecter →</a>'
      ].join('');
    }
  }

  /* ── Apply gate to an element ────────────────────────────── */
  function gate(el, level, loggedIn) {
    if (!el || el.dataset.gateApplied) return;
    el.dataset.gateApplied = '1';

    // Ensure the element is a positioning context
    var cs = window.getComputedStyle(el);
    if (cs.position === 'static') el.style.position = 'relative';
    el.style.overflow = 'hidden';
    if (!el.style.minHeight) el.style.minHeight = '220px';

    // Build overlay
    var overlay = document.createElement('div');
    overlay.className = 'fa-gate-overlay';
    overlay.innerHTML =
      '<div class="fa-gate-blur"></div>' +
      '<div class="fa-gate-fade"></div>' +
      '<div class="fa-gate-card">' + buildHTML(level, loggedIn) + '</div>';

    el.appendChild(overlay);
  }

  /* ── Supabase access check ───────────────────────────────── */
  async function checkAccess() {
    var loggedIn = false;
    var isVIP    = false;

    try {
      // Reuse existing sb client or create one
      var client = window.sb;
      if (!client && window.supabase) {
        client = window.supabase.createClient(SB_URL, SB_KEY);
      }
      // Wait up to 600ms for supabase to initialise
      if (!client) {
        await new Promise(function(resolve) {
          var attempts = 0;
          var t = setInterval(function() {
            if (window.sb) { client = window.sb; clearInterval(t); resolve(); }
            else if (window.supabase) {
              client = window.supabase.createClient(SB_URL, SB_KEY);
              clearInterval(t); resolve();
            }
            if (++attempts > 12) { clearInterval(t); resolve(); }
          }, 50);
        });
      }

      if (client) {
        var sessionRes = await client.auth.getSession();
        var session    = sessionRes.data && sessionRes.data.session;
        if (session) {
          loggedIn = true;
          var subRes = await client
            .from('subscriptions')
            .select('plan,status,expires_at')
            .eq('user_id', session.user.id)
            .eq('status', 'active')
            .maybeSingle();
          var sub = subRes.data;
          isVIP = !!(sub && sub.plan === 'vip' && new Date(sub.expires_at) > new Date());
        }
      }
    } catch (e) {
      console.warn('[FA Access]', e);
    }

    return { loggedIn: loggedIn, isVIP: isVIP };
  }

  /* ── Main init ───────────────────────────────────────────── */
  async function init() {
    injectCSS();

    var access = await checkAccess();
    window.FA  = access;

    var loggedIn = access.loggedIn;
    var isVIP    = access.isVIP;

    // Auto-gate [data-gate] elements
    document.querySelectorAll('[data-gate]').forEach(function(el) {
      var level = el.getAttribute('data-gate');
      if (level === 'vip'     && !isVIP)    gate(el, 'vip',     loggedIn);
      if (level === 'inscrit' && !loggedIn) gate(el, 'inscrit', loggedIn);
    });

    // Dispatch event for custom page logic
    document.dispatchEvent(new CustomEvent('fa:access', {
      detail: { loggedIn: loggedIn, isVIP: isVIP }
    }));
  }

  /* ── Public API ──────────────────────────────────────────── */
  window.FAGate = {
    gate: gate,
    html: buildHTML
  };

  /* ── Boot ────────────────────────────────────────────────── */
  // Small delay so Supabase CDN + sb init can run first
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() { setTimeout(init, 80); });
  } else {
    setTimeout(init, 80);
  }

})();
