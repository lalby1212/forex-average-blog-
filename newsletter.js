/* ============================================================
   FOREX AVERAGE — NEWSLETTER.JS
   Formulaire Mailchimp · Style noir/or du site
   Injection automatique : section page d'accueil + footer
   ============================================================ */

(function () {
  "use strict";

  /* ── CONFIG MAILCHIMP ── */
  const MC_ACTION = "https://forexaverage.us16.list-manage.com/subscribe/post?u=ce68d01f57fb30339440d1baf&id=3bca3391d4&f_id=00481fe1f0";
  const MC_HIDDEN = "b_ce68d01f57fb30339440d1baf_3bca3391d4";

  /* ── CSS ── */
  function injectCSS() {
    document.head.insertAdjacentHTML("beforeend", `<style>
    /* ── SECTION NEWSLETTER (page d'accueil) ── */
    .nl-section {
      position: relative; z-index: 1;
      background: linear-gradient(135deg, #0a0a0a 0%, #000 100%);
      border-top: 1px solid rgba(255,215,0,0.18);
      border-bottom: 1px solid rgba(255,215,0,0.18);
      padding: 5rem 2rem;
      overflow: hidden;
    }

    .nl-section::before {
      content: "";
      position: absolute; top: 50%; left: 50%;
      transform: translate(-50%,-50%);
      width: 700px; height: 400px;
      background: radial-gradient(ellipse, rgba(255,215,0,0.05) 0%, transparent 70%);
      pointer-events: none;
    }

    .nl-inner {
      max-width: 680px;
      margin: 0 auto;
      text-align: center;
      position: relative; z-index: 1;
    }

    .nl-eyebrow {
      display: inline-block;
      font-size: 0.68rem; font-weight: 700;
      letter-spacing: 0.22em; text-transform: uppercase;
      color: #FFD700; margin-bottom: 1rem;
    }

    .nl-title {
      font-size: clamp(1.8rem, 4vw, 2.6rem);
      font-weight: 900; letter-spacing: -0.03em;
      line-height: 1.1; color: #fff;
      margin-bottom: 0.8rem;
    }

    .nl-sub {
      font-size: 0.95rem; color: rgba(255,255,255,0.6);
      line-height: 1.75; font-weight: 300;
      margin-bottom: 2.4rem; max-width: 520px;
      margin-left: auto; margin-right: auto;
    }

    /* Badges avantages */
    .nl-badges {
      display: flex; flex-wrap: wrap; gap: 0.5rem;
      justify-content: center; margin-bottom: 2.4rem;
    }

    .nl-badge {
      display: inline-flex; align-items: center; gap: 0.35rem;
      background: rgba(255,215,0,0.08);
      border: 1px solid rgba(255,215,0,0.2);
      border-radius: 50px; padding: 0.32rem 0.8rem;
      font-size: 0.73rem; font-weight: 600;
      color: rgba(255,255,255,0.75);
    }

    /* Formulaire */
    .nl-form {
      display: flex; flex-direction: column; gap: 1rem;
    }

    .nl-row {
      display: grid; grid-template-columns: 1fr 1fr; gap: 0.8rem;
    }

    .nl-field {
      display: flex; flex-direction: column; gap: 0.4rem;
      text-align: left;
    }

    .nl-label {
      font-size: 0.72rem; font-weight: 700;
      letter-spacing: 0.08em; text-transform: uppercase;
      color: #FFD700;
    }

    .nl-input {
      width: 100%; padding: 0.88rem 1rem;
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.12);
      border-radius: 10px; color: #fff;
      font-size: 0.9rem;
      font-family: -apple-system,"SF Pro Text",BlinkMacSystemFont,"Helvetica Neue",Arial,sans-serif;
      transition: border-color 0.2s, box-shadow 0.2s;
      -webkit-appearance: none;
    }

    .nl-input:focus {
      outline: none;
      border-color: #FFD700;
      box-shadow: 0 0 0 3px rgba(255,215,0,0.1);
    }

    .nl-input::placeholder { color: rgba(255,255,255,0.28); }

    .nl-submit {
      width: 100%; padding: 0.95rem;
      background: #FFD700; color: #000;
      border: none; border-radius: 50px;
      font-size: 0.92rem; font-weight: 700;
      font-family: inherit; cursor: pointer;
      letter-spacing: 0.02em;
      transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
      box-shadow: 0 4px 20px rgba(255,215,0,0.25);
    }

    .nl-submit:hover {
      background: #FFE552;
      transform: translateY(-2px);
      box-shadow: 0 8px 32px rgba(255,215,0,0.4);
    }

    .nl-submit:disabled {
      background: rgba(255,215,0,0.3);
      cursor: not-allowed; transform: none;
    }

    /* Messages succès / erreur */
    .nl-msg {
      padding: 0.9rem 1.2rem;
      border-radius: 10px;
      font-size: 0.85rem; font-weight: 600;
      text-align: center; display: none;
    }

    .nl-msg--success {
      background: rgba(34,197,94,0.1);
      border: 1px solid rgba(34,197,94,0.3);
      color: #86efac;
    }

    .nl-msg--error {
      background: rgba(239,68,68,0.1);
      border: 1px solid rgba(239,68,68,0.3);
      color: #fca5a5;
    }

    .nl-legal {
      font-size: 0.7rem; color: rgba(255,255,255,0.22);
      line-height: 1.6; text-align: center;
    }

    /* ── FOOTER MINI FORM ── */
    .nl-footer-wrap {
      border-top: 1px solid rgba(255,215,0,0.1);
      padding-top: 2rem;
      margin-top: 2rem;
    }

    .nl-footer-title {
      font-size: 0.82rem; font-weight: 700;
      color: rgba(255,255,255,0.7);
      margin-bottom: 0.8rem; text-align: center;
      letter-spacing: 0.02em;
    }

    .nl-footer-title span { color: #FFD700; }

    .nl-footer-form {
      display: flex; gap: 0.5rem; flex-wrap: wrap;
      justify-content: center; max-width: 500px;
      margin: 0 auto;
    }

    .nl-footer-input {
      flex: 1; min-width: 130px; padding: 0.6rem 0.9rem;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 8px; color: #fff;
      font-size: 0.82rem;
      font-family: -apple-system,"SF Pro Text",BlinkMacSystemFont,"Helvetica Neue",Arial,sans-serif;
      transition: border-color 0.2s;
    }

    .nl-footer-input:focus {
      outline: none; border-color: rgba(255,215,0,0.4);
    }

    .nl-footer-input::placeholder { color: rgba(255,255,255,0.25); }

    .nl-footer-btn {
      padding: 0.6rem 1.4rem;
      background: #FFD700; color: #000;
      border: none; border-radius: 8px;
      font-size: 0.8rem; font-weight: 700;
      font-family: inherit; cursor: pointer;
      transition: background 0.2s, transform 0.2s;
      white-space: nowrap;
    }

    .nl-footer-btn:hover { background: #FFE552; transform: translateY(-1px); }
    .nl-footer-btn:disabled { background: rgba(255,215,0,0.3); cursor: not-allowed; transform: none; }

    .nl-footer-msg {
      width: 100%; text-align: center;
      font-size: 0.78rem; padding: 0.5rem;
      border-radius: 6px; display: none;
    }

    /* ── RESPONSIVE ── */
    @media (max-width: 600px) {
      .nl-row { grid-template-columns: 1fr; }
      .nl-section { padding: 3.5rem 1.2rem; }
      .nl-badges { gap: 0.4rem; }
      .nl-badge { font-size: 0.68rem; }
    }

    @media (max-width: 420px) {
      .nl-footer-form { flex-direction: column; }
      .nl-footer-input, .nl-footer-btn { width: 100%; }
    }
    </style>`);
  }

  /* ── HTML SECTION PRINCIPALE ── */
  function buildSectionHTML() {
    return `
    <section class="nl-section" id="newsletter">
      <div class="nl-inner">
        <span class="nl-eyebrow">📧 Newsletter Gratuite</span>
        <h2 class="nl-title">Restez Connecté aux Marchés</h2>
        <p class="nl-sub">Recevez chaque semaine nos meilleures analyses Forex, Crypto &amp; Commodities directement dans votre boîte mail. Gratuit, sans spam.</p>

        <div class="nl-badges">
          <span class="nl-badge">⚡ Analyses hebdomadaires</span>
          <span class="nl-badge">₿ Crypto &amp; Forex</span>
          <span class="nl-badge">🥇 Or &amp; Commodities</span>
          <span class="nl-badge">🔕 0 spam</span>
        </div>

        <form class="nl-form" id="nl-main-form"
          action="${MC_ACTION}" method="post"
          target="_blank" novalidate>

          <div class="nl-row">
            <div class="nl-field">
              <label class="nl-label" for="nl-fname">Prénom</label>
              <input class="nl-input" type="text" name="FNAME" id="nl-fname"
                placeholder="Votre prénom" autocomplete="given-name">
            </div>
            <div class="nl-field">
              <label class="nl-label" for="nl-email">Email <span style="color:#ef4444">*</span></label>
              <input class="nl-input" type="email" name="EMAIL" id="nl-email"
                placeholder="votre@email.com" required autocomplete="email">
            </div>
          </div>

          <!-- Honeypot anti-bot Mailchimp -->
          <div style="position:absolute;left:-5000px;" aria-hidden="true">
            <input type="text" name="${MC_HIDDEN}" tabindex="-1" value="">
          </div>

          <div class="nl-msg nl-msg--success" id="nl-main-success">
            ✅ Parfait ! Vérifiez votre boîte mail pour confirmer votre inscription.
          </div>
          <div class="nl-msg nl-msg--error" id="nl-main-error">
            ❌ Une erreur s'est produite. Vérifiez votre email et réessayez.
          </div>

          <button type="submit" class="nl-submit" id="nl-main-btn">
            🚀 Recevoir les Analyses Gratuitement
          </button>

          <p class="nl-legal">
            En vous inscrivant, vous acceptez de recevoir nos emails d'analyses.<br>
            Désabonnement possible à tout moment en un clic. Powered by Mailchimp.
          </p>
        </form>
      </div>
    </section>`;
  }

  /* ── HTML FOOTER MINI FORM ── */
  function buildFooterHTML() {
    return `
    <div class="nl-footer-wrap" id="nl-footer-wrap">
      <div class="nl-footer-title">📧 Newsletter — <span>Analyses gratuites chaque semaine</span></div>
      <form class="nl-footer-form" id="nl-footer-form"
        action="${MC_ACTION}" method="post"
        target="_blank" novalidate>
        <input class="nl-footer-input" type="text" name="FNAME"
          placeholder="Prénom" autocomplete="given-name">
        <input class="nl-footer-input" type="email" name="EMAIL"
          placeholder="votre@email.com" required autocomplete="email">
        <!-- Honeypot -->
        <div style="position:absolute;left:-5000px;" aria-hidden="true">
          <input type="text" name="${MC_HIDDEN}" tabindex="-1" value="">
        </div>
        <button type="submit" class="nl-footer-btn" id="nl-footer-btn">S'inscrire</button>
        <div class="nl-footer-msg nl-msg--success" id="nl-footer-success">✅ Confirmez dans votre mail !</div>
        <div class="nl-footer-msg nl-msg--error" id="nl-footer-error">❌ Vérifiez votre email.</div>
      </form>
    </div>`;
  }

  /* ── INJECT SECTION PRINCIPALE ── */
  function injectSection() {
    // On insère la section avant la section FAQ ou avant le footer
    const faq     = document.querySelector('.faq-section, #faq, [id*="faq"]');
    const footer  = document.querySelector('footer');
    const target  = faq || footer;

    if (!target) return;

    const div = document.createElement("div");
    div.innerHTML = buildSectionHTML();
    target.parentNode.insertBefore(div.firstElementChild, target);
  }

  /* ── INJECT FOOTER FORM ── */
  function injectFooterForm() {
    // Trouve le footer et insère avant les footer-links ou au début
    const footerLinks = document.querySelector('.footer-links, .footer__links');
    const footer      = document.querySelector('footer');

    if (footerLinks) {
      footerLinks.insertAdjacentHTML("beforebegin", buildFooterHTML());
    } else if (footer) {
      footer.insertAdjacentHTML("afterbegin", buildFooterHTML());
    }
  }

  /* ── GESTION SOUMISSION FORMULAIRE ── */
  function handleFormSubmit(formId, btnId, successId, errorId) {
    const form = document.getElementById(formId);
    if (!form) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const email   = form.querySelector('[name="EMAIL"]');
      const btn     = document.getElementById(btnId);
      const success = document.getElementById(successId);
      const error   = document.getElementById(errorId);

      // Validation email
      if (!email || !email.value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        if (error) { error.style.display = "block"; error.textContent = "❌ Entrez un email valide."; }
        return;
      }

      // Reset messages
      if (success) success.style.display = "none";
      if (error)   error.style.display   = "none";

      // Désactiver bouton
      if (btn) { btn.disabled = true; btn.textContent = "Inscription en cours…"; }

      // Soumettre via fetch (JSONP Mailchimp)
      const url = form.action.replace("/post?", "/post-json?") + "&c=?";
      const data = new FormData(form);
      const params = new URLSearchParams();
      data.forEach((v, k) => params.append(k, v));

      // Mailchimp ne supporte pas CORS directement → on soumet le form natif
      // puis on affiche un message de succès optimiste
      form.submit();

      // Message succès affiché après 800ms
      setTimeout(() => {
        if (success) { success.style.display = "block"; }
        if (btn) { btn.disabled = false; btn.textContent = formId === "nl-main-form" ? "🚀 Recevoir les Analyses Gratuitement" : "S'inscrire"; }
        form.reset();
      }, 800);
    });
  }

  /* ── SCRIPT MAILCHIMP VALIDATION ── */
  function loadMailchimpScript() {
    const s = document.createElement("script");
    s.src = "//s3.amazonaws.com/downloads.mailchimp.com/js/mc-validate.js";
    s.async = true;
    s.onload = () => {
      if (window.jQuery && window.fnames) {
        window.fnames = ["EMAIL", "FNAME"];
        window.ftypes = ["email", "text"];
      }
    };
    document.body.appendChild(s);
  }

  /* ── INIT ── */
  function init() {
    injectCSS();
    injectSection();
    injectFooterForm();
    handleFormSubmit("nl-main-form",   "nl-main-btn",   "nl-main-success",   "nl-main-error");
    handleFormSubmit("nl-footer-form", "nl-footer-btn", "nl-footer-success", "nl-footer-error");
    loadMailchimpScript();
  }

  document.readyState === "loading"
    ? document.addEventListener("DOMContentLoaded", init)
    : init();

})();
