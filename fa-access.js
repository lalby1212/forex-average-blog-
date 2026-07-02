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
  function initDropdowns() {
    document.addEventListener('click', e => {
      const drop = e.target.closest('.nav-item-drop');
      const tgl = e.target.closest('.nav-item-drop > a[href="#"], .nav-item-drop > a[role="button"]');
      if (tgl) e.preventDefault();
      if (!drop) {
        document.querySelectorAll('.nav-item-drop.open').forEach(d => d.classList.remove('open'));
        return;
      }
      const wasOpen = drop.classList.contains('open');
      document.querySelectorAll('.nav-item-drop.open').forEach(d => d.classList.remove('open'));
      if (!wasOpen) drop.classList.add('open');
    });

    /* Mobile nav toggle — vrais sélecteurs du markup (#mainNav .hamburger / .nav-links) */
    const burger = document.querySelector('#mainNav .hamburger') || document.getElementById('hamburgerBtn');
    const mobileMenu = document.querySelector('#mainNav .nav-links') || document.getElementById('navLinks');
    if (burger && mobileMenu && !burger.dataset.faWired) {
      burger.dataset.faWired = '1';
      burger.addEventListener('click', (e) => {
        e.stopPropagation();
        const willOpen = !mobileMenu.classList.contains('open');
        mobileMenu.classList.toggle('open', willOpen);
        burger.classList.toggle('active', willOpen);
        burger.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
        if (!willOpen) document.querySelectorAll('#mainNav .nav-item-drop.open').forEach(d => d.classList.remove('open'));
      });
    }
  }

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

      /* ═══ NAV AUTORITAIRE — scopée #mainNav, écrase les CSS empilés ═══ */
      #mainNav{position:sticky;top:0;z-index:1000;background:rgba(7,7,7,0.97);-webkit-backdrop-filter:blur(20px);backdrop-filter:blur(20px);border-bottom:1px solid rgba(255,215,0,0.14);}
      #mainNav .nav-container{max-width:1400px;margin:0 auto;padding:0 2rem;height:64px;display:flex;align-items:center;gap:1rem;}
      #mainNav .logo{display:flex;flex-direction:column;gap:3px;text-decoration:none;flex-shrink:0;line-height:1;}
      #mainNav .logo-main{font-weight:900;font-size:1.3rem;letter-spacing:-0.01em;text-transform:uppercase;display:block;}
      #mainNav .logo-forex{color:#fff!important;-webkit-text-fill-color:#fff!important;}
      #mainNav .logo-average{color:#FFD700!important;-webkit-text-fill-color:#FFD700!important;}
      #mainNav .logo-sub{font-size:0.45rem;font-weight:700;letter-spacing:1.8px;text-transform:uppercase;color:rgba(255,255,255,0.3)!important;-webkit-text-fill-color:rgba(255,255,255,0.3)!important;display:block;}
      #mainNav .nav-links{display:flex!important;list-style:none;align-items:center;gap:0.1rem;margin:0 0 0 auto;padding:0;flex-wrap:nowrap;height:auto;}
      #mainNav .nav-links>li{list-style:none;}
      #mainNav .nav-links>li>a{text-decoration:none;color:rgba(255,255,255,0.7);font-size:0.875rem;font-weight:500;letter-spacing:0.2px;padding:0.45rem 0.85rem;border-radius:6px;transition:color 0.2s,background 0.2s;display:inline-flex;align-items:center;gap:0.35rem;white-space:nowrap;height:auto;border-bottom:none;}
      #mainNav .nav-links>li>a:hover{color:#fff;}
      #mainNav .nav-links>li>a.active{color:#FFD700;font-weight:600;}
      #mainNav .hamburger{display:none;flex-direction:column;gap:5px;background:none;border:none;cursor:pointer;padding:0.4rem;margin-left:auto;}
      #mainNav .hamburger span{display:block;width:22px;height:2px;background:#fff;border-radius:2px;transition:all 0.3s;}
      #mainNav .nav-spacer{min-width:0.5rem;flex:0 0 auto;}
      #mainNav .nav-item-drop{position:relative;display:flex;align-items:center;height:auto;}
      #mainNav .nav-item-drop>a{height:auto;border-bottom:none;cursor:pointer;}
      #mainNav .drop-panel{display:none!important;position:absolute;top:calc(100% + 8px);left:50%;transform:translateX(-50%);min-width:220px;background:rgba(10,10,10,0.98);border:1px solid rgba(255,215,0,0.15);border-radius:12px;padding:0.5rem;box-shadow:0 20px 60px rgba(0,0,0,0.6);-webkit-backdrop-filter:blur(20px);backdrop-filter:blur(20px);z-index:200;}
      #mainNav .nav-item-drop:hover>.drop-panel,#mainNav .nav-item-drop.open>.drop-panel{display:block!important;}
      #mainNav .drop-link{display:flex!important;align-items:center;gap:0.75rem;padding:0.6rem 0.75rem;border-radius:8px;text-decoration:none;color:rgba(255,255,255,0.8);font-size:0.85rem;height:auto;}
      #mainNav .drop-link:hover{background:rgba(255,215,0,0.07);color:#fff;}
      #mainNav .drop-icon{width:32px;height:32px;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,0.06);border-radius:8px;flex-shrink:0;color:rgba(255,255,255,0.7);font-size:1rem;}
      #mainNav .drop-label{display:block;font-weight:600;font-size:0.85rem;line-height:1.2;}
      #mainNav .drop-desc{display:block;font-size:0.73rem;color:rgba(255,255,255,0.45);margin-top:1px;}
      #mainNav .drop-sep{height:1px;background:rgba(255,255,255,0.07);margin:0.35rem 0;}
      #mainNav .nav-chevron{width:12px;height:12px;opacity:0.6;transition:transform .2s;}
      #mainNav .nav-item-drop:hover .nav-chevron,#mainNav .nav-item-drop.open .nav-chevron{transform:rotate(180deg);}
      #mainNav .nav-login-btn{background:transparent;border:1px solid rgba(255,255,255,0.2);color:#fff!important;padding:0.4rem 1rem;border-radius:6px;font-size:0.83rem;font-weight:500;text-decoration:none;margin-right:0.4rem;}
      #mainNav .nav-login-btn:hover{border-color:rgba(255,255,255,0.5);}
      #mainNav .nav-cta{background:#FFD700;color:#000!important;padding:0.4rem 1rem;border-radius:6px;font-size:0.83rem;font-weight:700;text-decoration:none;}
      #mainNav .nav-cta:hover{background:#fff;}
      @media(max-width:900px){
        #mainNav .hamburger{display:flex!important;}
        #mainNav .nav-links{display:none!important;position:fixed;top:64px;left:0;right:0;bottom:0;background:rgba(5,5,5,0.98);flex-direction:column;align-items:flex-start;padding:1.5rem 1rem;gap:0.25rem;overflow-y:auto;z-index:999;margin:0;}
        #mainNav .nav-links.open,#mainNav .nav-links.active{display:flex!important;}
        #mainNav .nav-links>li{width:100%;}
        #mainNav .nav-links>li>a{width:100%;padding:0.85rem 1rem;font-size:1rem;}
        #mainNav .nav-item-drop{display:block;}
        #mainNav .drop-panel{position:static!important;transform:none!important;box-shadow:none!important;background:rgba(20,20,20,0.5)!important;border:none!important;border-radius:8px!important;margin:0.25rem 0 0.25rem 1rem;display:none!important;}
        #mainNav .nav-item-drop:hover>.drop-panel{display:none!important;}
        #mainNav .nav-item-drop.open>.drop-panel{display:block!important;}
        #mainNav .nav-spacer{display:none;}
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
