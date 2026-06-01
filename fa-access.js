/* ============================================================
   fa-access.js — Forex Average · Système d'accès partagé v2
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
      location.href = 'index.html';
    },
    isLogged,
    isVip,
    getUser,
    getPlan
  };

  /* ── Initialisation nav ── */
  function initNav() {
    const user   = getUser();
    const logged = isLogged();
    const plan   = getPlan();

    /* Boutons invité */
    document.querySelectorAll('.nav-auth-guest').forEach(el => {
      el.style.display = logged ? 'none' : '';
    });

    /* Zone profil */
    document.querySelectorAll('.nav-auth-user').forEach(el => {
      el.style.display = logged ? '' : 'none';
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
      if (!drop) {
        document.querySelectorAll('.nav-item-drop.open').forEach(d => d.classList.remove('open'));
        return;
      }
      const wasOpen = drop.classList.contains('open');
      document.querySelectorAll('.nav-item-drop.open').forEach(d => d.classList.remove('open'));
      if (!wasOpen) drop.classList.add('open');
    });

    /* Mobile nav toggle */
    const burger = document.querySelector('.nav-burger');
    const mobileMenu = document.querySelector('.nav-links-wrap');
    if (burger && mobileMenu) {
      burger.addEventListener('click', () => {
        mobileMenu.classList.toggle('open');
        burger.classList.toggle('open');
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
    `;
    document.head.appendChild(s);
  }

  /* ── Boot ── */
  function boot() {
    injectStyles();
    checkAuthPage();
    initNav();
    initPaywall();
    initDropdowns();
    initLogoutBtns();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

})();
