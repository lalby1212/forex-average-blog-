/* ============================================================
   fa-access.js — Forex Average · Système d'accès partagé v3
   ============================================================
   Nouveauté v3 : détection automatique de la session Supabase.
   Si l'utilisateur s'est connecté via Supabase Auth (login.html, etc.),
   fa-access récupère sa session et la synchronise dans ses propres clés
   localStorage. Plus besoin d'appeler FA.login() manuellement.
   ============================================================ */

(function () {
  'use strict';

  /* ══ NAV MOBILE — gestionnaire délégué robuste ══
     Attaché à `document` dès le chargement du script (avant boot()),
     donc fonctionne même si l'init échoue ou si la page est lourde. */
  if (!window.__faNavDelegated) {
    window.__faNavDelegated = true;
    var faOpenMenu = function (menu, burger) {
      if (!menu.__faHome) menu.__faHome = { p: menu.parentNode, n: menu.nextSibling };
      menu.classList.add('open', 'fa-mobmenu');
      document.body.appendChild(menu);           /* sort du contexte d'empilement de #mainNav */
      if (burger) burger.classList.add('active');
      document.body.classList.add('fa-menu-open');
      document.body.style.overflow = 'hidden';
      window.__faMenuRef = menu;
    };
    var faCloseMenu = function () {
      var m = window.__faMenuRef || document.querySelector('.fa-mobmenu') || document.querySelector('#mainNav .nav-links') || document.getElementById('navLinks');
      if (m) {
        m.classList.remove('open', 'fa-mobmenu');
        m.removeAttribute('style');
        if (m.__faHome) { try { m.__faHome.n ? m.__faHome.p.insertBefore(m, m.__faHome.n) : m.__faHome.p.appendChild(m); } catch (e) {} }
      }
      var b = document.querySelector('#mainNav .hamburger'); if (b) b.classList.remove('active');
      document.body.classList.remove('fa-menu-open');
      document.body.style.overflow = '';
    };
    document.addEventListener('click', function (e) {
      var t = e.target; if (!t || !t.closest) return;
      var burger = t.closest('#mainNav .hamburger, #hamburgerBtn');
      if (burger) {
        e.preventDefault(); e.stopPropagation();
        var menu = document.querySelector('#mainNav .nav-links') || document.getElementById('navLinks');
        if (!menu) return;
        if (menu.classList.contains('open')) {
          faCloseMenu();
          burger.setAttribute('aria-expanded', 'false');
        } else {
          faOpenMenu(menu, burger);
          burger.setAttribute('aria-expanded', 'true');
        }
        return;
      }
      var tgl = t.closest('.nav-item-drop > a[href="#"], .nav-item-drop > a[role="button"]');
      var drop = t.closest('.nav-item-drop');
      if (drop && tgl) {
        e.preventDefault();
        var was = drop.classList.contains('open');
        document.querySelectorAll('.nav-item-drop.open').forEach(function (d) { d.classList.remove('open'); });
        if (!was) drop.classList.add('open');
        return;
      }
      var link = t.closest('#mainNav .nav-links a[href]');
      if (link) {
        var href = link.getAttribute('href') || '';
        if (href && href !== '#' && link.getAttribute('role') !== 'button' && window.innerWidth <= 900) faCloseMenu();
        return;
      }
      if (!drop) document.querySelectorAll('.nav-item-drop.open').forEach(function (d) { d.classList.remove('open'); });
    }, true);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') faCloseMenu(); });
    window.addEventListener('resize', function () { if (window.innerWidth > 900) faCloseMenu(); });
  }


  /* ── Clés localStorage ── */
  const KEY_USER  = 'fa_user';
  const KEY_PLAN  = 'fa_plan';  // 'free' | 'vip'
  const KEY_TOKEN = 'fa_token';

  /* ── Helpers ── */
  function getUser()  { try { return JSON.parse(localStorage.getItem(KEY_USER) || 'null'); } catch { return null; } }
  function getPlan()  { return localStorage.getItem(KEY_PLAN) || 'free'; }
  function isLogged() { return !!getUser() && !!localStorage.getItem(KEY_TOKEN); }
  function isVip()    { return isLogged() && getPlan() === 'vip'; }

  /* ── Activation VIP (appelé par webhook Stripe ou manuellement) ──
     FA.setPlan('vip')  → active le VIP
     FA.setPlan('free') → repasse en gratuit                         */
  function setPlan(plan) {
    if (!isLogged()) return false;
    localStorage.setItem(KEY_PLAN, plan);
    if (typeof initNav === 'function') initNav();
    return true;
  }

  /* ── Config Supabase ── */
  const SB_URL = 'https://bpfpghlpdzevzyhalxov.supabase.co';
  const SB_KEY = 'sb_publishable_XHStaFT7Lkp7FRomgGmOFw_8puBQvTZ';

  /* ── Synchronisation depuis Supabase ──
     Si l'utilisateur est connecté via Supabase Auth mais que les clés FA
     ne sont pas encore posées, on les remplit à partir de la session SB.
     Retourne { synced, userId, accessToken } pour la récupération du plan. */
  function syncFromSupabase() {
    try {
      for (const k of Object.keys(localStorage)) {
        if (!k.startsWith('sb-') || !k.endsWith('-auth-token')) continue;
        const raw = localStorage.getItem(k);
        if (!raw) continue;
        let sess;
        try { sess = JSON.parse(raw); } catch { continue; }
        if (!sess || !sess.access_token) continue;
        // Vérif expiration
        if (sess.expires_at && sess.expires_at * 1000 < Date.now()) continue;

        const user  = sess.user || {};
        const email = user.email || '';
        if (!email) continue;
        const meta  = user.user_metadata || {};
        const name  = meta.name || meta.full_name || meta.display_name || email.split('@')[0];

        // Pose les clés FA si absentes
        if (!localStorage.getItem(KEY_USER))  localStorage.setItem(KEY_USER,  JSON.stringify({ email, name }));
        if (!localStorage.getItem(KEY_TOKEN)) localStorage.setItem(KEY_TOKEN, sess.access_token);

        // Plan = free par défaut, sera écrasé par fetchPlanFromSupabase()
        if (!localStorage.getItem(KEY_PLAN)) localStorage.setItem(KEY_PLAN, 'free');

        return { synced: true, userId: user.id, accessToken: sess.access_token };
      }
    } catch (e) { /* silent */ }
    return { synced: false };
  }

  /* ── Récupération du plan depuis subscriptions ── */
  /* Diffuse l'état d'accès (VIP / connexion) aux pages qui gatent leur contenu */
  function emitAccess() {
    try {
      document.dispatchEvent(new CustomEvent('fa:access', {
        detail: { isVIP: isVip(), loggedIn: isLogged(), plan: getPlan() }
      }));
    } catch (e) {}
  }

  async function fetchPlanFromSupabase(userId, accessToken) {
    try {
      const res = await fetch(
        SB_URL + '/rest/v1/subscriptions?user_id=eq.' + userId + '&select=plan,status,expires_at&limit=1',
        {
          headers: {
            'apikey': SB_KEY,
            'Authorization': 'Bearer ' + accessToken,
            'Accept': 'application/json'
          }
        }
      );
      if (!res.ok) return;
      const rows = await res.json();
      if (!rows || !rows.length) return;
      const sub = rows[0];
      const isActive = sub.status === 'active';
      const notExpired = !sub.expires_at || new Date(sub.expires_at) > new Date();
      const plan = (sub.plan === 'vip' && isActive && notExpired) ? 'vip' : 'free';
      localStorage.setItem(KEY_PLAN, plan);
      // Rafraîchir nav + paywall avec le bon plan
      initNav();
      if (plan === 'vip') {
        // Supprimer les paywalls déjà posés
        document.querySelectorAll('.fa-paywall-overlay').forEach(el => el.remove());
        document.querySelectorAll('.fa-locked').forEach(el => el.classList.remove('fa-locked'));
      }
      emitAccess(); // ⚡ re-notifier les pages (gate VIP) avec le plan confirmé
    } catch (e) { /* silent — pas de fetch = on garde 'free' */ }
  }

  /* ── Détection de session Supabase active (sans modif des clés FA) ── */
  function hasSupabaseSession() {
    try {
      for (const k of Object.keys(localStorage)) {
        if (!k.startsWith('sb-') || !k.endsWith('-auth-token')) continue;
        const raw = localStorage.getItem(k);
        if (!raw) continue;
        let sess;
        try { sess = JSON.parse(raw); } catch { continue; }
        if (sess && sess.access_token) {
          if (!sess.expires_at || sess.expires_at * 1000 > Date.now()) return true;
        }
      }
    } catch (e) {}
    return false;
  }

  /* ── Login / Logout ── */
  window.FA = {
    login(email, name, plan) {
      const token = btoa(email + ':' + Date.now());
      localStorage.setItem(KEY_USER,  JSON.stringify({ email, name: name || email.split('@')[0] }));
      localStorage.setItem(KEY_PLAN,  plan || 'free');
      localStorage.setItem(KEY_TOKEN, token);
      location.reload();
    },
    logout() {
      localStorage.removeItem(KEY_USER);
      localStorage.removeItem(KEY_PLAN);
      localStorage.removeItem(KEY_TOKEN);
      // Nettoyage Supabase aussi
      try {
        Object.keys(localStorage).forEach(k => {
          if (k.startsWith('sb-') && k.endsWith('-auth-token')) localStorage.removeItem(k);
        });
      } catch (e) {}
      location.href = 'index.html';
    },
    isLogged,
    isVip,
    getUser,
    getPlan,
    /* Helpers exposés en bonus */
    syncFromSupabase,
    hasSupabaseSession,
    setPlan
  };

  /* ── Initialisation nav ── */
  function initNav() {
    const user   = getUser();
    const logged = isLogged();
    const plan   = getPlan();

    /* Boutons invité */
    document.querySelectorAll('.nav-auth-guest').forEach(el => {
      el.style.display = logged ? 'none' : 'flex';
    });

    /* Zone profil */
    document.querySelectorAll('.nav-auth-user').forEach(el => {
      el.style.display = logged ? 'flex' : 'none';
    });

    if (logged && user) {
      /* Initiales avatar */
      const initials = (user.name || user.email)
        .split(/[\s@.]+/).filter(Boolean)
        .slice(0, 2).map(w => w[0].toUpperCase()).join('');

      document.querySelectorAll('.fa-avatar').forEach(el => {
        el.textContent = initials;
      });

      /* Nom affiché */
      document.querySelectorAll('.fa-username').forEach(el => {
        el.textContent = user.name || user.email.split('@')[0];
      });

      /* Email affiché */
      document.querySelectorAll('.fa-email').forEach(el => {
        el.textContent = user.email;
      });

      /* Badge plan */
      const planLabel = plan === 'vip' ? '✦ VIP' : 'Gratuit';
      const planClass = plan === 'vip' ? 'badge-vip' : 'badge-free';
      document.querySelectorAll('.fa-plan-badge').forEach(el => {
        el.textContent = planLabel;
        el.className   = 'fa-plan-badge ' + planClass;
      });
    }
  }

  /* ── Paywall ── */
  function initPaywall() {
    const vip = isVip();

    /* data-gate="vip" → masqué si pas VIP */
    document.querySelectorAll('[data-gate="vip"]').forEach(el => {
      if (!vip) {
        el.classList.add('fa-locked');
        const overlay = document.createElement('div');
        overlay.className = 'fa-paywall-overlay';
        overlay.innerHTML = `
          <div class="fa-paywall-box">
            <div class="fa-paywall-icon">🔒</div>
            <div class="fa-paywall-title">Contenu VIP</div>
            <div class="fa-paywall-desc">Accédez à cette section avec un abonnement VIP</div>
            <a href="pricing.html" class="fa-paywall-btn">Voir les offres →</a>
          </div>`;
        el.style.position = 'relative';
        el.appendChild(overlay);
      }
    });

    /* data-gate="logged" → masqué si pas connecté */
    document.querySelectorAll('[data-gate="logged"]').forEach(el => {
      if (!isLogged()) {
        el.style.display = 'none';
      }
    });
  }

  /* ── Redirect pages authentifiées ── */
  function checkAuthPage() {
    const authPages = ['dashboard.html', 'journal.html', 'profile.html', 'track-record.html', 'admin-premium.html'];
    const page = location.pathname.split('/').pop();
    if (authPages.includes(page) && !isLogged()) {
      location.href = 'login.html?redirect=' + encodeURIComponent(page);
    }
  }

  /* ── Dropdown nav (click outside to close) ── */
  function initDropdowns() { /* remplacé par le gestionnaire délégué robuste en tête de fichier */ }

  /* ── Logout buttons ── */
  function initLogoutBtns() {
    document.querySelectorAll('.fa-logout-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        e.preventDefault();
        window.FA.logout();
      });
    });
  }

  /* ── CSS paywall injecté ── */
  function injectStyles() {
    if (document.getElementById('fa-access-styles')) return;
    const s = document.createElement('style');
    s.id = 'fa-access-styles';
    s.textContent = `
      /* Avatar */
      .fa-avatar {
        width: 32px; height: 32px; border-radius: 50%;
        background: linear-gradient(135deg, #FFD700, #FFA500);
        color: #000; font-weight: 800; font-size: 0.75rem;
        display: flex; align-items: center; justify-content: center;
        flex-shrink: 0; letter-spacing: 0;
      }
      /* Plan badge */
      .fa-plan-badge {
        display: inline-block; padding: 0.12rem 0.5rem;
        border-radius: 4px; font-size: 0.68rem; font-weight: 700;
        letter-spacing: 0.3px;
      }
      .badge-vip  { background: rgba(255,215,0,0.15); color: #FFD700; border: 1px solid rgba(255,215,0,0.3); }
      .badge-free { background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.45); border: 1px solid rgba(255,255,255,0.1); }
      /* Logout btn */
      .fa-logout-btn {
        color: #ef4444 !important;
        border-top: 1px solid rgba(239,68,68,0.15) !important;
        margin-top: 0.25rem !important;
        padding-top: 0.6rem !important;
      }
      .fa-logout-btn:hover { background: rgba(239,68,68,0.08) !important; }
      /* Paywall */
      .fa-locked { min-height: 200px; overflow: hidden; }
      .fa-paywall-overlay {
        position: absolute; inset: 0;
        background: linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.92) 40%, rgba(0,0,0,0.98) 100%);
        display: flex; align-items: center; justify-content: center;
        z-index: 10; border-radius: inherit;
      }
      .fa-paywall-box {
        text-align: center; padding: 2rem;
      }
      .fa-paywall-icon { font-size: 2rem; margin-bottom: 0.75rem; }
      .fa-paywall-title { font-size: 1.1rem; font-weight: 700; color: #fff; margin-bottom: 0.4rem; }
      .fa-paywall-desc { font-size: 0.85rem; color: rgba(255,255,255,0.55); margin-bottom: 1.25rem; }
      .fa-paywall-btn {
        display: inline-block; padding: 0.65rem 1.5rem;
        background: linear-gradient(135deg, #FFD700, #FFA500);
        color: #000; text-decoration: none; border-radius: 8px;
        font-weight: 700; font-size: 0.88rem;
      }

    `;
    document.head.appendChild(s);
  }

  /* ── Rafraîchissement auto du token Supabase ──
     Évite que les pages utilisent un access_token expiré (erreur "JWT expired").
     Si le token est expiré (ou < 2 min de marge), on le renouvelle via le
     refresh_token, puis on réécrit la session dans localStorage. */
  async function refreshSessionIfNeeded() {
    try {
      let sbKey = null;
      for (const k of Object.keys(localStorage)) {
        if (k.startsWith('sb-') && k.endsWith('-auth-token')) { sbKey = k; break; }
      }
      if (!sbKey) return;
      let sess = null;
      try { sess = JSON.parse(localStorage.getItem(sbKey)); } catch { return; }
      if (!sess || !sess.refresh_token) return;

      const expMs = sess.expires_at ? sess.expires_at * 1000 : 0;
      if (expMs && expMs > Date.now() + 120000) return; // encore valide → rien à faire

      const rr = await fetch(SB_URL + '/auth/v1/token?grant_type=refresh_token', {
        method: 'POST',
        headers: { 'apikey': SB_KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: sess.refresh_token })
      });
      if (!rr.ok) return;
      const ns = await rr.json();
      if (ns && ns.access_token) {
        sess.access_token  = ns.access_token;
        sess.refresh_token = ns.refresh_token || sess.refresh_token;
        sess.expires_at    = ns.expires_at || (Math.floor(Date.now() / 1000) + (ns.expires_in || 3600));
        sess.expires_in    = ns.expires_in || sess.expires_in;
        if (ns.user) sess.user = ns.user;
        localStorage.setItem(sbKey, JSON.stringify(sess));
        // Synchroniser aussi la clé FA si déjà posée
        if (localStorage.getItem(KEY_TOKEN)) localStorage.setItem(KEY_TOKEN, ns.access_token);
      }
    } catch (e) { /* silent */ }
  }

  /* ── Boot ── */
  async function boot() {
    // ⚡ Rafraîchir le token s'il est expiré (AVANT tout contrôle d'accès)
    await refreshSessionIfNeeded();

    // ⚡ Sync Supabase → FA (identité + token)
    const sbResult = syncFromSupabase();

    injectStyles();
    checkAuthPage();
    initNav();
    initPaywall();
    initDropdowns();
    initLogoutBtns();
    emitAccess(); // ⚡ premier signal d'accès (valeurs locales)

    // ⚡ Fetch plan depuis subscriptions Supabase (async, met à jour nav après)
    if (sbResult && sbResult.synced && sbResult.userId && sbResult.accessToken) {
      fetchPlanFromSupabase(sbResult.userId, sbResult.accessToken);
    }
  }

  /* FAGate : overlay Passez VIP sur une zone gatee */
  window.FAGate = window.FAGate || {
    gate: function (el, level, loggedIn) {
      try {
        if (!el || el.querySelector(':scope > .fa-gate-overlay')) return;
        var cs = window.getComputedStyle(el);
        if (cs && cs.position === 'static') el.style.position = 'relative';
        var ov = document.createElement('div');
        ov.className = 'fa-gate-overlay';
        ov.style.cssText = 'position:absolute;inset:0;z-index:20;display:flex;flex-direction:column;'
          + 'align-items:center;justify-content:center;text-align:center;gap:.8rem;padding:1.5rem;'
          + 'background:linear-gradient(180deg,rgba(10,12,18,.55) 0%,rgba(10,12,18,.92) 60%);'
          + 'backdrop-filter:blur(3px);border-radius:inherit;';
        var msg = loggedIn
          ? 'Analyse reservee aux membres VIP'
          : 'Connecte-toi et passe VIP pour debloquer cette analyse';
        ov.innerHTML = '<div style="font-size:1.6rem;">\u{1F512}</div>'
          + '<div style="color:#fff;font-weight:700;font-size:.95rem;max-width:320px;">' + msg + '</div>'
          + '<a href="pricing.html" style="background:linear-gradient(135deg,#f0b90b,#d4a017);color:#0a0c12;'
          + 'font-weight:800;padding:.6rem 1.4rem;border-radius:10px;text-decoration:none;font-size:.9rem;">'
          + (loggedIn ? '\u2B50 Passer VIP' : '\u2B50 Voir les offres VIP') + '</a>';
        el.appendChild(ov);
      } catch (e) {}
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

})();
