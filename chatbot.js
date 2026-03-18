/* ============================================================
   FOREX AVERAGE — CHATBOT.JS
   IA officielle Forex Average · Powered by OpenAI GPT-4o-mini
   ============================================================ */

(function () {
  "use strict";

  /* ── CONFIG — mets ta clé OpenAI ligne 11 ── */
  const CONFIG = {
    API_KEY: "COLLE_TA_CLE_OPENAI_ICI", // sk-proj-...
    MODEL:   "gpt-4o-mini",
    API_URL: "https://api.openai.com/v1/chat/completions",

    BROKERS: {
      exness:    { name: "Exness",     url: "https://one.exnesstrack.net/a/forex_average" },
      xm:        { name: "XM",         url: "https://clicks.pipaffiliates.com/c?c=forex_average" },
      icmarkets: { name: "IC Markets", url: "https://icmarkets.com/?camp=forex_average" },
    },

    LINKS: {
      youtube:       "https://youtube.com/@forexaverage",
      telegram_free: "https://t.me/forexaverageanalyse",
      telegram_vip:  "https://t.me/+8Q2zPHrvFghlMzI8",
      tradingview:   "https://fr.tradingview.com/u/Forexaverage/",
      myfxbook:      "https://www.myfxbook.com/portfolio/tracking-record/11855178",
      calculateur:   "/calculateur.html",
      analyses:      "/analyses.html",
    },
  };

  /* ── SYSTEM PROMPT ── */
  const SYSTEM = `Tu es l'IA officielle de Forex Average, assistant expert trading.
Réponds UNIQUEMENT en français. Sois direct, professionnel et pédagogue.

RÔLE :
1. Broker : propose UNIQUEMENT des brokers régulés (ASIC, CySEC, FCA). Pose des questions sur le style de trading avant de recommander.
2. Écosystème Forex Average : YouTube, Telegram gratuit + VIP, analyses, calculateurs.
3. Éducation : explique spreads, levier, gestion du risque avec pédagogie.
4. Sécurité : mets en garde contre les brokers non régulés et les arnaques.

BROKERS PARTENAIRES (régulés uniquement) :
- Exness : spreads 0.0 pip, idéal scalping → écris [BROKER:exness]
- XM : bonus $500, MT4/MT5, idéal débutants → écris [BROKER:xm]
- IC Markets : ECN pur, ultra-rapide → écris [BROKER:icmarkets]

LIENS (utilise ces tags dans tes réponses) :
- Telegram gratuit → [TELEGRAM:free]
- Telegram VIP → [TELEGRAM:vip]
- YouTube → [YOUTUBE]
- Analyses → [ANALYSES]
- Calculateur → [CALCULATEUR]

FORMAT : Maximum 4 paragraphes courts. Termine TOUJOURS par : ⚠️ Le trading comporte des risques de perte en capital.

INTERDIT : gains garantis, brokers non régulés, signaux précis, sujets hors trading.`;

  /* ── STATE ── */
  let messages = [{ role: "system", content: SYSTEM }];
  let isOpen   = false;
  let isTyping = false;
  let greeted  = false;

  /* ── CSS ── */
  function injectCSS() {
    document.head.insertAdjacentHTML("beforeend", `<style>
    #fa-widget{position:fixed;bottom:1.6rem;right:1.6rem;z-index:9999;font-family:-apple-system,"SF Pro Text",BlinkMacSystemFont,"Helvetica Neue",Arial,sans-serif}
    #fa-toggle{width:58px;height:58px;border-radius:50%;background:#FFD700;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#000;box-shadow:0 4px 24px rgba(255,215,0,.4);transition:transform .22s ease,box-shadow .22s ease;position:relative;margin-left:auto}
    #fa-toggle:hover{transform:translateY(-3px) scale(1.06);box-shadow:0 8px 32px rgba(255,215,0,.55)}
    #fa-notif{position:absolute;top:3px;right:3px;width:12px;height:12px;border-radius:50%;background:#22c55e;border:2px solid #000;display:none;animation:faPulse 2s infinite}
    @keyframes faPulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.6;transform:scale(.88)}}
    #fa-window{position:absolute;bottom:70px;right:0;width:360px;max-height:560px;background:#0a0a0a;border:1px solid rgba(255,215,0,.22);border-radius:18px;overflow:hidden;display:none;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,.7);animation:faSlide .25s cubic-bezier(.4,0,.2,1)}
    #fa-window.open{display:flex}
    @keyframes faSlide{from{opacity:0;transform:translateY(16px) scale(.97)}to{opacity:1;transform:translateY(0) scale(1)}}
    #fa-header{display:flex;align-items:center;justify-content:space-between;padding:1rem 1.2rem;background:#111;border-bottom:1px solid rgba(255,215,0,.14);flex-shrink:0}
    #fa-header-left{display:flex;align-items:center;gap:.75rem}
    #fa-avatar{width:38px;height:38px;border-radius:50%;background:#FFD700;color:#000;font-size:.72rem;font-weight:900;display:flex;align-items:center;justify-content:center;position:relative;flex-shrink:0}
    #fa-online{position:absolute;bottom:1px;right:1px;width:9px;height:9px;border-radius:50%;background:#22c55e;border:1.5px solid #111}
    #fa-name{font-size:.88rem;font-weight:700;color:#fff;line-height:1.2}
    #fa-status{font-size:.68rem;color:#22c55e;font-weight:500;margin-top:1px}
    #fa-close{background:transparent;border:none;cursor:pointer;color:rgba(255,255,255,.4);padding:4px;border-radius:6px;display:flex;transition:color .2s,background .2s}
    #fa-close:hover{color:#fff;background:rgba(255,255,255,.08)}
    #fa-messages{flex:1;overflow-y:auto;padding:1.2rem;display:flex;flex-direction:column;gap:1rem;scroll-behavior:smooth}
    #fa-messages::-webkit-scrollbar{width:4px}
    #fa-messages::-webkit-scrollbar-thumb{background:rgba(255,215,0,.2);border-radius:4px}
    .fa-msg{display:flex;gap:.6rem;animation:faMsg .2s ease}
    @keyframes faMsg{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
    .fa-msg--bot{align-items:flex-start}
    .fa-msg--user{align-items:flex-start;flex-direction:row-reverse}
    .fa-av{width:28px;height:28px;border-radius:50%;background:#FFD700;color:#000;font-size:.6rem;font-weight:900;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:2px}
    .fa-msg--user .fa-av{background:rgba(255,255,255,.08);color:rgba(255,255,255,.5)}
    .fa-bub{max-width:80%;padding:.75rem 1rem;font-size:.83rem;line-height:1.65;border-radius:14px}
    .fa-msg--bot .fa-bub{background:#1a1a1a;border:1px solid rgba(255,215,0,.12);color:rgba(255,255,255,.88);border-radius:4px 14px 14px 14px}
    .fa-msg--user .fa-bub{background:#FFD700;color:#000;font-weight:500;border-radius:14px 4px 14px 14px}
    .fa-btn{display:inline-flex;align-items:center;gap:.4rem;margin-top:.6rem;margin-right:.4rem;padding:.5rem .9rem;border-radius:50px;font-size:.76rem;font-weight:700!important;text-decoration:none;border:none;cursor:pointer;transition:transform .18s;font-family:inherit}
    .fa-btn:hover{transform:translateY(-1px)}
    .fa-btn--gold{background:#FFD700!important;color:#000!important;box-shadow:0 2px 12px rgba(255,215,0,.3)}
    .fa-btn--gold:hover{background:#FFE552!important}
    .fa-btn--green{background:#16a34a!important;color:#fff!important;box-shadow:0 2px 12px rgba(22,163,74,.3)}
    .fa-btn--green:hover{background:#15803d!important}
    .fa-btn--outline{background:transparent!important;color:#FFD700!important;border:1px solid rgba(255,215,0,.35)!important}
    .fa-btn--outline:hover{background:rgba(255,215,0,.1)!important}
    .fa-legal{display:block;font-size:.68rem!important;color:rgba(255,255,255,.3)!important;border-top:1px solid rgba(255,255,255,.06);margin-top:.6rem;padding-top:.5rem}
    .fa-typing{display:flex;align-items:center;gap:4px;padding:.6rem .8rem}
    .fa-typing span{width:6px;height:6px;border-radius:50%;background:rgba(255,215,0,.5);animation:faBounce 1.2s infinite}
    .fa-typing span:nth-child(2){animation-delay:.18s}
    .fa-typing span:nth-child(3){animation-delay:.36s}
    @keyframes faBounce{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-5px)}}
    #fa-suggestions{padding:0 1rem .6rem;display:flex;flex-wrap:wrap;gap:.4rem;flex-shrink:0}
    .fa-sugg{padding:.38rem .75rem;background:rgba(255,215,0,.07);border:1px solid rgba(255,215,0,.2);border-radius:50px;color:rgba(255,255,255,.75);font-size:.73rem;font-weight:500;cursor:pointer;font-family:inherit;transition:all .18s}
    .fa-sugg:hover{background:rgba(255,215,0,.15);border-color:rgba(255,215,0,.4);color:#fff}
    #fa-input-area{display:flex;align-items:flex-end;gap:.6rem;padding:.7rem 1rem;border-top:1px solid rgba(255,255,255,.06);background:#111;flex-shrink:0}
    #fa-input{flex:1;resize:none;min-height:36px;max-height:100px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:10px;color:#fff;font-size:.83rem;font-family:inherit;padding:.55rem .85rem;line-height:1.5;transition:border-color .2s;overflow-y:auto}
    #fa-input:focus{outline:none;border-color:rgba(255,215,0,.4)}
    #fa-input::placeholder{color:rgba(255,255,255,.28)}
    #fa-send{width:36px;height:36px;border-radius:10px;background:#FFD700;border:none;cursor:pointer;color:#000;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:background .18s,transform .18s}
    #fa-send:hover{background:#FFE552;transform:scale(1.05)}
    #fa-send:disabled{background:rgba(255,215,0,.25);cursor:not-allowed;transform:none}
    #fa-footer{text-align:center;padding:.5rem;font-size:.62rem;color:rgba(255,255,255,.2);background:#111;border-top:1px solid rgba(255,255,255,.04);flex-shrink:0}
    @media(max-width:420px){#fa-widget{bottom:1rem;right:1rem}#fa-window{width:calc(100vw - 2rem);right:0;bottom:68px}}
    </style>`);
  }

  /* ── HTML ── */
  function injectHTML() {
    document.body.insertAdjacentHTML("beforeend", `
    <div id="fa-widget">
      <button id="fa-toggle" aria-label="Chat IA Forex Average">
        <span id="fa-icon-open"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></span>
        <span id="fa-icon-close" style="display:none"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></span>
        <span id="fa-notif"></span>
      </button>
      <div id="fa-window">
        <div id="fa-header">
          <div id="fa-header-left">
            <div id="fa-avatar">FA<span id="fa-online"></span></div>
            <div><div id="fa-name">Forex Average IA</div><div id="fa-status">En ligne · Réponse instantanée</div></div>
          </div>
          <button id="fa-close" aria-label="Fermer"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
        </div>
        <div id="fa-messages"></div>
        <div id="fa-suggestions">
          <button class="fa-sugg" data-msg="Quel broker me conseilles-tu ?">🏦 Choisir un broker</button>
          <button class="fa-sugg" data-msg="Comment rejoindre le Telegram ?">📱 Telegram</button>
          <button class="fa-sugg" data-msg="Explique-moi la gestion du risque">📐 Gestion du risque</button>
          <button class="fa-sugg" data-msg="C'est quoi le spread ?">📚 Le spread</button>
        </div>
        <div id="fa-input-area">
          <textarea id="fa-input" placeholder="Pose ta question sur le trading…" rows="1"></textarea>
          <button id="fa-send" aria-label="Envoyer"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg></button>
        </div>
        <div id="fa-footer">Propulsé par <strong>GPT-4o mini</strong> · Forex Average</div>
      </div>
    </div>`);
  }

  /* ── PARSE TAGS → BOUTONS ── */
  function parse(t) {
    t = t.replace(/\[BROKER:exness\]/gi,   `<br><a href="${CONFIG.BROKERS.exness.url}"    target="_blank" rel="noopener noreferrer" class="fa-btn fa-btn--gold">🏦 Ouvrir un compte Exness</a>`);
    t = t.replace(/\[BROKER:xm\]/gi,       `<br><a href="${CONFIG.BROKERS.xm.url}"        target="_blank" rel="noopener noreferrer" class="fa-btn fa-btn--gold">🏦 Ouvrir un compte XM</a>`);
    t = t.replace(/\[BROKER:icmarkets\]/gi,`<br><a href="${CONFIG.BROKERS.icmarkets.url}" target="_blank" rel="noopener noreferrer" class="fa-btn fa-btn--gold">🏦 Ouvrir un compte IC Markets</a>`);
    t = t.replace(/\[TELEGRAM:vip\]/gi,    `<br><a href="${CONFIG.LINKS.telegram_vip}"   target="_blank" rel="noopener noreferrer" class="fa-btn fa-btn--green">💎 Telegram VIP</a>`);
    t = t.replace(/\[TELEGRAM:free\]/gi,   `<br><a href="${CONFIG.LINKS.telegram_free}"  target="_blank" rel="noopener noreferrer" class="fa-btn fa-btn--green">📱 Telegram Gratuit</a>`);
    t = t.replace(/\[YOUTUBE\]/gi,         `<br><a href="${CONFIG.LINKS.youtube}"         target="_blank" rel="noopener noreferrer" class="fa-btn fa-btn--outline">📺 YouTube</a>`);
    t = t.replace(/\[ANALYSES\]/gi,        `<br><a href="${CONFIG.LINKS.analyses}"        class="fa-btn fa-btn--outline">📊 Analyses</a>`);
    t = t.replace(/\[CALCULATEUR\]/gi,     `<br><a href="${CONFIG.LINKS.calculateur}"     class="fa-btn fa-btn--outline">🧮 Calculateur</a>`);
    t = t.replace(/⚠️ Le trading comporte des risques de perte en capital\./gi,
      `<span class="fa-legal">⚠️ Le trading comporte des risques de perte en capital.</span>`);
    t = t.replace(/\n/g, "<br>");
    return t;
  }

  /* ── ADD MESSAGE ── */
  function addMsg(role, html, isHTML = false) {
    const c   = document.getElementById("fa-messages");
    const w   = document.createElement("div"); w.className = `fa-msg fa-msg--${role}`;
    const av  = document.createElement("div"); av.className = "fa-av"; av.textContent = role === "bot" ? "FA" : "Toi";
    const b   = document.createElement("div"); b.className = "fa-bub";
    if (isHTML) b.innerHTML = html; else b.textContent = html;
    w.appendChild(av); w.appendChild(b); c.appendChild(w);
    c.scrollTop = 99999;
  }

  /* ── TYPING ── */
  function showTyping() {
    const c = document.getElementById("fa-messages");
    const w = document.createElement("div"); w.className = "fa-msg fa-msg--bot"; w.id = "fa-typing";
    const av = document.createElement("div"); av.className = "fa-av"; av.textContent = "FA";
    const b  = document.createElement("div"); b.className = "fa-bub fa-typing";
    b.innerHTML = "<span></span><span></span><span></span>";
    w.appendChild(av); w.appendChild(b); c.appendChild(w); c.scrollTop = 99999;
  }
  function hideTyping() { document.getElementById("fa-typing")?.remove(); }

  /* ── API OPENAI ── */
  async function callAI(userMsg) {
    messages.push({ role: "user", content: userMsg });
    const res = await fetch(CONFIG.API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${CONFIG.API_KEY}` },
      body: JSON.stringify({ model: CONFIG.MODEL, messages, max_tokens: 500, temperature: 0.7 }),
    });
    if (!res.ok) {
      const e = await res.json().catch(() => ({}));
      throw new Error(e?.error?.message || `HTTP ${res.status}`);
    }
    const data  = await res.json();
    const reply = data?.choices?.[0]?.message?.content;
    if (!reply) throw new Error("Réponse vide");
    messages.push({ role: "assistant", content: reply });
    return reply;
  }

  /* ── SEND ── */
  async function send(msg) {
    if (!msg.trim() || isTyping) return;
    const input = document.getElementById("fa-input");
    const btn   = document.getElementById("fa-send");
    const sugg  = document.getElementById("fa-suggestions");
    if (sugg) sugg.style.display = "none";
    addMsg("user", msg);
    if (input) { input.value = ""; input.style.height = "auto"; }
    isTyping = true; if (btn) btn.disabled = true;
    showTyping();
    try {
      const reply = await callAI(msg);
      hideTyping();
      addMsg("bot", parse(reply), true);
    } catch (err) {
      hideTyping();
      console.error("[FA Chatbot]", err.message);
      addMsg("bot",
        `Désolé, problème technique. 😕 Rejoins notre communauté :<br>
        <a href="${CONFIG.LINKS.telegram_free}" target="_blank" rel="noopener noreferrer" class="fa-btn fa-btn--green">📱 Telegram Gratuit</a>
        <a href="${CONFIG.LINKS.telegram_vip}"  target="_blank" rel="noopener noreferrer" class="fa-btn fa-btn--green">💎 Telegram VIP</a>
        <span class="fa-legal">⚠️ Le trading comporte des risques de perte en capital.</span>`, true);
    }
    isTyping = false; if (btn) btn.disabled = false;
  }

  /* ── GREETING ── */
  function greet() {
    if (greeted) return; greeted = true;
    setTimeout(() => addMsg("bot", `
      Bonjour ! 👋 Je suis l'IA officielle de <strong>Forex Average</strong>.<br><br>
      Je peux t'aider à :<br>
      🏦 Choisir un <strong>broker régulé</strong> adapté à ton profil<br>
      📐 Comprendre la <strong>gestion du risque</strong><br>
      📱 Rejoindre notre <strong>communauté Telegram</strong><br>
      📊 Accéder aux <strong>analyses et calculateurs</strong><br><br>
      Comment puis-je t'aider aujourd'hui ?
      <span class="fa-legal">⚠️ Le trading comporte des risques de perte en capital.</span>
    `, true), 300);
  }

  /* ── TOGGLE ── */
  function toggle() {
    isOpen = !isOpen;
    document.getElementById("fa-window").classList.toggle("open", isOpen);
    document.getElementById("fa-icon-open").style.display  = isOpen ? "none" : "flex";
    document.getElementById("fa-icon-close").style.display = isOpen ? "flex" : "none";
    document.getElementById("fa-notif").style.display = "none";
    if (isOpen) { greet(); setTimeout(() => document.getElementById("fa-input")?.focus(), 250); }
  }

  /* ── EVENTS ── */
  function initEvents() {
    document.getElementById("fa-toggle")?.addEventListener("click", toggle);
    document.getElementById("fa-close")?.addEventListener("click", toggle);
    document.getElementById("fa-send")?.addEventListener("click", () =>
      send(document.getElementById("fa-input")?.value?.trim() || ""));
    document.getElementById("fa-input")?.addEventListener("keydown", e => {
      if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(e.target.value?.trim() || ""); }
    });
    document.getElementById("fa-input")?.addEventListener("input", e => {
      e.target.style.height = "auto";
      e.target.style.height = Math.min(e.target.scrollHeight, 100) + "px";
    });
    document.querySelectorAll(".fa-sugg").forEach(b => b.addEventListener("click", () => send(b.dataset.msg)));
  }

  /* ── INIT ── */
  function init() {
    injectCSS(); injectHTML(); initEvents();
    setTimeout(() => { const d = document.getElementById("fa-notif"); if (d && !isOpen) d.style.display = "block"; }, 3000);
  }

  document.readyState === "loading"
    ? document.addEventListener("DOMContentLoaded", init)
    : init();

})();
