/* ============================================================
   FOREX AVERAGE — CHATBOT.JS
   IA officielle Forex Average · Powered by Gemini
   ============================================================ */

(function () {
  "use strict";

  /* ── CONFIG ── */
  const CONFIG = {
    API_KEY: "AIzaSyBmlRkBim4CpbrgmB1s4IZIty_RsUP5RGQ",
    MODEL:   "gemini-2.0-flash",
    API_URL: "https://generativelanguage.googleapis.com/v1beta/models/",

    BROKERS: {
      exness: {
        name: "Exness",
        url:  "https://one.exnesstrack.net/a/forex_average", // ← Mets ton lien affiliation
        why:  "spreads ultra-bas sur EUR/USD dès 0.0 pip, idéal scalping",
        styles: ["scalping", "day trading", "hft"],
      },
      xm: {
        name: "XM",
        url:  "https://clicks.pipaffiliates.com/c?c=forex_average", // ← Mets ton lien affiliation
        why:  "bonus de bienvenue jusqu'à $500, plateforme MT4/MT5, idéal débutants",
        styles: ["swing trading", "débutant", "position trading"],
      },
      icmarkets: {
        name: "IC Markets",
        url:  "https://icmarkets.com/?camp=forex_average", // ← Mets ton lien affiliation
        why:  "exécution ultra-rapide, ECN pur, parfait pour les algos et scalpers avancés",
        styles: ["scalping", "algo trading", "ecn"],
      },
    },

    LINKS: {
      youtube:        "https://youtube.com/@forexaverage",
      telegram_free:  "https://t.me/forexaverageanalyse",
      telegram_vip:   "https://t.me/+8Q2zPHrvFghlMzI8",
      tradingview:    "https://fr.tradingview.com/u/Forexaverage/",
      myfxbook:       "https://www.myfxbook.com/portfolio/tracking-record/11855178",
      calculateur:    "/calculateur.html",
      analyses:       "/analyses.html",
    },
  };

  /* ── SYSTEM PROMPT ── */
  const SYSTEM_PROMPT = `
Tu es l'IA officielle de Forex Average, assistant expert trading.
Réponds UNIQUEMENT en français. Sois direct, professionnel et pédagogue.

=== TON RÔLE ===
1. Conseiller broker : propose UNIQUEMENT des brokers régulés (ASIC, CySEC, FCA).
   Avant de recommander, pose des questions sur le style de trading (scalping, swing, débutant).
2. Promouvoir l'écosystème Forex Average : YouTube, Telegram (gratuit + VIP), analyses, calculateurs.
3. Éducation trading : explique spreads, levier, gestion du risque avec pédagogie.
4. Sécurité : mets en garde contre les brokers non régulés et les arnaques "gains garantis".

=== BROKERS PARTENAIRES ===
- Exness : spreads 0.0 pip, idéal scalping. Lien : ${CONFIG.BROKERS.exness.url}
- XM : bonus $500, MT4/MT5, idéal débutants. Lien : ${CONFIG.BROKERS.xm.url}
- IC Markets : ECN pur, exécution ultra-rapide, scalpers avancés. Lien : ${CONFIG.BROKERS.icmarkets.url}

=== LIENS FOREX AVERAGE ===
- YouTube : ${CONFIG.LINKS.youtube}
- Telegram gratuit : ${CONFIG.LINKS.telegram_free}
- Telegram VIP : ${CONFIG.LINKS.telegram_vip}
- TradingView : ${CONFIG.LINKS.tradingview}
- Track Record : ${CONFIG.LINKS.myfxbook}
- Calculateurs : ${CONFIG.LINKS.calculateur}
- Analyses : ${CONFIG.LINKS.analyses}

=== FORMAT DE RÉPONSE ===
- Utilise des retours à la ligne pour aérer.
- Quand tu recommandes un broker, indique clairement le lien sous forme [BROKER:nom] que le système convertira en bouton.
- Quand tu invites à rejoindre Telegram, indique [TELEGRAM:free] ou [TELEGRAM:vip].
- Quand tu mentionnes YouTube, indique [YOUTUBE].
- Quand tu mentionnes les analyses, indique [ANALYSES].
- Quand tu mentionnes le calculateur, indique [CALCULATEUR].
- Maximum 3-4 paragraphes courts par réponse.
- Termine TOUJOURS par la mention légale : "⚠️ Le trading comporte des risques de perte en capital."

=== CE QUE TU NE FAIS PAS ===
- Promettre des gains garantis
- Recommander des brokers non régulés
- Donner des signaux de trading précis (c'est le rôle du canal Telegram)
- Répondre à des sujets hors trading/finance
`;

  /* ── STATE ── */
  let conversationHistory = [];
  let isOpen = false;
  let isTyping = false;
  let hasGreeted = false;

  /* ── INJECT HTML ── */
  function injectHTML() {
    const html = `
    <div id="fa-chat-widget">

      <!-- Bouton flottant -->
      <button id="fa-chat-toggle" aria-label="Ouvrir le chat IA Forex Average">
        <span id="fa-chat-icon-open">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        </span>
        <span id="fa-chat-icon-close" style="display:none;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </span>
        <span id="fa-notif-dot"></span>
      </button>

      <!-- Fenêtre chat -->
      <div id="fa-chat-window" aria-live="polite">

        <!-- Header -->
        <div id="fa-chat-header">
          <div id="fa-chat-header-left">
            <div id="fa-chat-avatar">
              <span>FA</span>
              <span id="fa-online-dot"></span>
            </div>
            <div>
              <div id="fa-chat-name">Forex Average IA</div>
              <div id="fa-chat-status">En ligne · Réponse instantanée</div>
            </div>
          </div>
          <button id="fa-chat-close" aria-label="Fermer">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <!-- Messages -->
        <div id="fa-chat-messages"></div>

        <!-- Suggestions rapides -->
        <div id="fa-quick-suggestions">
          <button class="fa-suggestion" data-msg="Quel broker me conseilles-tu ?">🏦 Choisir un broker</button>
          <button class="fa-suggestion" data-msg="Comment rejoindre le Telegram ?">📱 Rejoindre Telegram</button>
          <button class="fa-suggestion" data-msg="Explique-moi la gestion du risque">📐 Gestion du risque</button>
          <button class="fa-suggestion" data-msg="C'est quoi le spread en trading ?">📚 C'est quoi le spread ?</button>
        </div>

        <!-- Input -->
        <div id="fa-chat-input-area">
          <textarea
            id="fa-chat-input"
            placeholder="Pose ta question sur le trading…"
            rows="1"
            aria-label="Message"
          ></textarea>
          <button id="fa-chat-send" aria-label="Envoyer">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="22" y1="2" x2="11" y2="13"/>
              <polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </div>

        <!-- Footer -->
        <div id="fa-chat-footer">
          Propulsé par <strong>Gemini AI</strong> · Forex Average
        </div>

      </div>
    </div>`;

    document.body.insertAdjacentHTML("beforeend", html);
  }

  /* ── INJECT CSS ── */
  function injectCSS() {
    const css = `
    /* ── WIDGET WRAPPER ── */
    #fa-chat-widget {
      position: fixed;
      bottom: 1.6rem;
      right: 1.6rem;
      z-index: 9999;
      font-family: -apple-system, "SF Pro Text", BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif;
    }

    /* ── TOGGLE BUTTON ── */
    #fa-chat-toggle {
      width: 58px; height: 58px;
      border-radius: 50%;
      background: #FFD700;
      border: none; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      color: #000;
      box-shadow: 0 4px 24px rgba(255,215,0,0.40);
      transition: transform 0.22s ease, box-shadow 0.22s ease, background 0.22s ease;
      position: relative;
      margin-left: auto;
    }
    #fa-chat-toggle:hover {
      transform: translateY(-3px) scale(1.06);
      box-shadow: 0 8px 32px rgba(255,215,0,0.55);
      background: #FFE552;
    }

    /* Notif dot */
    #fa-notif-dot {
      position: absolute;
      top: 3px; right: 3px;
      width: 12px; height: 12px;
      border-radius: 50%;
      background: #22c55e;
      border: 2px solid #000;
      animation: fa-pulse 2s infinite;
    }
    @keyframes fa-pulse {
      0%,100% { opacity: 1; transform: scale(1); }
      50%      { opacity: 0.6; transform: scale(0.88); }
    }

    /* ── CHAT WINDOW ── */
    #fa-chat-window {
      position: absolute;
      bottom: 70px; right: 0;
      width: 360px;
      max-height: 560px;
      background: #0a0a0a;
      border: 1px solid rgba(255,215,0,0.22);
      border-radius: 18px;
      overflow: hidden;
      display: none;
      flex-direction: column;
      box-shadow: 0 20px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,215,0,0.08);
      animation: fa-slideUp 0.25s cubic-bezier(0.4,0,0.2,1);
    }
    #fa-chat-window.open { display: flex; }

    @keyframes fa-slideUp {
      from { opacity: 0; transform: translateY(16px) scale(0.97); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }

    /* ── HEADER ── */
    #fa-chat-header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 1rem 1.2rem;
      background: #111;
      border-bottom: 1px solid rgba(255,215,0,0.14);
      flex-shrink: 0;
    }
    #fa-chat-header-left { display: flex; align-items: center; gap: 0.75rem; }

    #fa-chat-avatar {
      width: 38px; height: 38px; border-radius: 50%;
      background: #FFD700;
      display: flex; align-items: center; justify-content: center;
      font-size: 0.72rem; font-weight: 900; color: #000;
      position: relative; flex-shrink: 0;
    }
    #fa-online-dot {
      position: absolute; bottom: 1px; right: 1px;
      width: 9px; height: 9px; border-radius: 50%;
      background: #22c55e; border: 1.5px solid #111;
    }

    #fa-chat-name { font-size: 0.88rem; font-weight: 700; color: #fff; line-height: 1.2; }
    #fa-chat-status { font-size: 0.68rem; color: #22c55e; font-weight: 500; margin-top: 1px; }

    #fa-chat-close {
      background: transparent; border: none; cursor: pointer;
      color: rgba(255,255,255,0.4); padding: 4px;
      border-radius: 6px; display: flex;
      transition: color 0.2s, background 0.2s;
    }
    #fa-chat-close:hover { color: #fff; background: rgba(255,255,255,0.08); }

    /* ── MESSAGES ── */
    #fa-chat-messages {
      flex: 1; overflow-y: auto;
      padding: 1.2rem;
      display: flex; flex-direction: column; gap: 1rem;
      scroll-behavior: smooth;
    }
    #fa-chat-messages::-webkit-scrollbar { width: 4px; }
    #fa-chat-messages::-webkit-scrollbar-track { background: transparent; }
    #fa-chat-messages::-webkit-scrollbar-thumb { background: rgba(255,215,0,0.2); border-radius: 4px; }

    /* Message bulle */
    .fa-msg { display: flex; gap: 0.6rem; animation: fa-fadeMsg 0.2s ease; }
    @keyframes fa-fadeMsg { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }

    .fa-msg--bot { align-items: flex-start; }
    .fa-msg--user { align-items: flex-start; flex-direction: row-reverse; }

    .fa-msg__avatar {
      width: 28px; height: 28px; border-radius: 50%;
      background: #FFD700; color: #000;
      font-size: 0.6rem; font-weight: 900;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0; margin-top: 2px;
    }
    .fa-msg--user .fa-msg__avatar { background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.5); }

    .fa-msg__bubble {
      max-width: 80%;
      padding: 0.75rem 1rem;
      border-radius: 14px;
      font-size: 0.83rem; line-height: 1.65;
    }
    .fa-msg--bot .fa-msg__bubble {
      background: #1a1a1a;
      border: 1px solid rgba(255,215,0,0.12);
      color: rgba(255,255,255,0.88);
      border-radius: 4px 14px 14px 14px;
    }
    .fa-msg--user .fa-msg__bubble {
      background: #FFD700;
      color: #000; font-weight: 500;
      border-radius: 14px 4px 14px 14px;
    }

    /* Liens dans les bulles */
    .fa-msg__bubble a {
      color: #FFD700; font-weight: 600;
      text-decoration: none; border-bottom: 1px solid rgba(255,215,0,0.3);
      transition: border-color 0.2s;
    }
    .fa-msg--user .fa-msg__bubble a { color: #000; border-color: rgba(0,0,0,0.3); }
    .fa-msg__bubble a:hover { border-color: #FFD700; }

    /* Boutons CTA dans les bulles */
    .fa-cta-btn {
      display: inline-flex; align-items: center; gap: 0.4rem;
      margin-top: 0.6rem; margin-right: 0.4rem;
      padding: 0.5rem 0.9rem;
      border-radius: 50px; font-size: 0.76rem; font-weight: 700;
      text-decoration: none; border: none; cursor: pointer;
      transition: transform 0.18s ease, box-shadow 0.18s ease;
    }
    .fa-cta-btn:hover { transform: translateY(-1px); }

    .fa-cta-btn--gold { background: #FFD700; color: #000; box-shadow: 0 2px 12px rgba(255,215,0,0.3); }
    .fa-cta-btn--gold:hover { background: #FFE552; box-shadow: 0 4px 18px rgba(255,215,0,0.45); }

    .fa-cta-btn--green { background: #16a34a; color: #fff; box-shadow: 0 2px 12px rgba(22,163,74,0.3); }
    .fa-cta-btn--green:hover { background: #15803d; }

    .fa-cta-btn--outline {
      background: transparent; color: #FFD700;
      border: 1px solid rgba(255,215,0,0.35);
    }
    .fa-cta-btn--outline:hover { background: rgba(255,215,0,0.1); }

    /* Typing indicator */
    .fa-typing { display: flex; align-items: center; gap: 4px; padding: 0.6rem 0.8rem; }
    .fa-typing span {
      width: 6px; height: 6px; border-radius: 50%;
      background: rgba(255,215,0,0.5);
      animation: fa-bounce 1.2s infinite;
    }
    .fa-typing span:nth-child(2) { animation-delay: 0.18s; }
    .fa-typing span:nth-child(3) { animation-delay: 0.36s; }
    @keyframes fa-bounce {
      0%,60%,100% { transform: translateY(0); }
      30%          { transform: translateY(-5px); }
    }

    /* Mention légale dans bubble */
    .fa-legal {
      font-size: 0.68rem !important;
      color: rgba(255,255,255,0.35) !important;
      border-top: 1px solid rgba(255,255,255,0.06) !important;
      margin-top: 0.6rem !important;
      padding-top: 0.5rem !important;
      display: block;
    }

    /* ── SUGGESTIONS RAPIDES ── */
    #fa-quick-suggestions {
      padding: 0 1rem 0.6rem;
      display: flex; flex-wrap: wrap; gap: 0.4rem;
      flex-shrink: 0;
    }
    .fa-suggestion {
      padding: 0.38rem 0.75rem;
      background: rgba(255,215,0,0.07);
      border: 1px solid rgba(255,215,0,0.2);
      border-radius: 50px; color: rgba(255,255,255,0.75);
      font-size: 0.73rem; font-weight: 500;
      cursor: pointer; font-family: inherit;
      transition: all 0.18s ease;
    }
    .fa-suggestion:hover {
      background: rgba(255,215,0,0.15);
      border-color: rgba(255,215,0,0.4);
      color: #fff;
    }

    /* ── INPUT AREA ── */
    #fa-chat-input-area {
      display: flex; align-items: flex-end; gap: 0.6rem;
      padding: 0.7rem 1rem;
      border-top: 1px solid rgba(255,255,255,0.06);
      background: #111;
      flex-shrink: 0;
    }

    #fa-chat-input {
      flex: 1; resize: none; min-height: 36px; max-height: 100px;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 10px;
      color: #fff; font-size: 0.83rem; font-family: inherit;
      padding: 0.55rem 0.85rem; line-height: 1.5;
      transition: border-color 0.2s;
      overflow-y: auto;
    }
    #fa-chat-input:focus { outline: none; border-color: rgba(255,215,0,0.4); }
    #fa-chat-input::placeholder { color: rgba(255,255,255,0.28); }

    #fa-chat-send {
      width: 36px; height: 36px; border-radius: 10px;
      background: #FFD700; border: none; cursor: pointer;
      color: #000; display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
      transition: background 0.18s, transform 0.18s;
    }
    #fa-chat-send:hover { background: #FFE552; transform: scale(1.05); }
    #fa-chat-send:disabled { background: rgba(255,215,0,0.25); cursor: not-allowed; transform: none; }

    /* ── FOOTER ── */
    #fa-chat-footer {
      text-align: center; padding: 0.5rem;
      font-size: 0.62rem; color: rgba(255,255,255,0.2);
      background: #111; border-top: 1px solid rgba(255,255,255,0.04);
      flex-shrink: 0;
    }

    /* ── RESPONSIVE ── */
    @media (max-width: 420px) {
      #fa-chat-widget { bottom: 1rem; right: 1rem; }
      #fa-chat-window { width: calc(100vw - 2rem); right: 0; bottom: 68px; }
    }
    `;

    const style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);
  }

  /* ── PARSE RESPONSE — remplace les placeholders par des boutons HTML ── */
  function parseResponse(text) {
    // Broker buttons
    text = text.replace(/\[BROKER:exness\]/gi, `
      <br><a href="${CONFIG.BROKERS.exness.url}" target="_blank" rel="noopener noreferrer" class="fa-cta-btn fa-cta-btn--gold">🏦 Ouvrir un compte Exness</a>`);
    text = text.replace(/\[BROKER:xm\]/gi, `
      <br><a href="${CONFIG.BROKERS.xm.url}" target="_blank" rel="noopener noreferrer" class="fa-cta-btn fa-cta-btn--gold">🏦 Ouvrir un compte XM</a>`);
    text = text.replace(/\[BROKER:icmarkets\]/gi, `
      <br><a href="${CONFIG.BROKERS.icmarkets.url}" target="_blank" rel="noopener noreferrer" class="fa-cta-btn fa-cta-btn--gold">🏦 Ouvrir un compte IC Markets</a>`);

    // Telegram buttons
    text = text.replace(/\[TELEGRAM:vip\]/gi, `
      <br><a href="${CONFIG.LINKS.telegram_vip}" target="_blank" rel="noopener noreferrer" class="fa-cta-btn fa-cta-btn--green">💎 Rejoindre Telegram VIP</a>`);
    text = text.replace(/\[TELEGRAM:free\]/gi, `
      <br><a href="${CONFIG.LINKS.telegram_free}" target="_blank" rel="noopener noreferrer" class="fa-cta-btn fa-cta-btn--green">📱 Rejoindre Telegram Gratuit</a>`);

    // YouTube
    text = text.replace(/\[YOUTUBE\]/gi, `
      <br><a href="${CONFIG.LINKS.youtube}" target="_blank" rel="noopener noreferrer" class="fa-cta-btn fa-cta-btn--outline">📺 Voir la chaîne YouTube</a>`);

    // Analyses
    text = text.replace(/\[ANALYSES\]/gi, `
      <br><a href="${CONFIG.LINKS.analyses}" class="fa-cta-btn fa-cta-btn--outline">📊 Voir les analyses</a>`);

    // Calculateur
    text = text.replace(/\[CALCULATEUR\]/gi, `
      <br><a href="${CONFIG.LINKS.calculateur}" class="fa-cta-btn fa-cta-btn--outline">🧮 Ouvrir le calculateur</a>`);

    // Retours à la ligne
    text = text.replace(/\n/g, "<br>");

    // Mention légale en gris
    text = text.replace(
      /⚠️ Le trading comporte des risques de perte en capital\./gi,
      `<span class="fa-legal">⚠️ Le trading comporte des risques de perte en capital.</span>`
    );

    return text;
  }

  /* ── ADD MESSAGE ── */
  function addMessage(role, html, isHTML = false) {
    const container = document.getElementById("fa-chat-messages");
    const isBot = role === "bot";

    const wrapper = document.createElement("div");
    wrapper.className = `fa-msg fa-msg--${isBot ? "bot" : "user"}`;

    const avatar = document.createElement("div");
    avatar.className = "fa-msg__avatar";
    avatar.textContent = isBot ? "FA" : "Toi";

    const bubble = document.createElement("div");
    bubble.className = "fa-msg__bubble";

    if (isHTML) {
      bubble.innerHTML = html;
    } else {
      bubble.textContent = html;
    }

    wrapper.appendChild(avatar);
    wrapper.appendChild(bubble);
    container.appendChild(wrapper);
    container.scrollTop = container.scrollHeight;

    return wrapper;
  }

  /* ── TYPING INDICATOR ── */
  function showTyping() {
    const container = document.getElementById("fa-chat-messages");
    const wrapper = document.createElement("div");
    wrapper.className = "fa-msg fa-msg--bot";
    wrapper.id = "fa-typing-indicator";

    const avatar = document.createElement("div");
    avatar.className = "fa-msg__avatar";
    avatar.textContent = "FA";

    const bubble = document.createElement("div");
    bubble.className = "fa-msg__bubble fa-typing";
    bubble.innerHTML = "<span></span><span></span><span></span>";

    wrapper.appendChild(avatar);
    wrapper.appendChild(bubble);
    container.appendChild(wrapper);
    container.scrollTop = container.scrollHeight;
  }

  function hideTyping() {
    const el = document.getElementById("fa-typing-indicator");
    if (el) el.remove();
  }

  /* ── CALL GEMINI API ── */
  async function callGemini(userMessage) {
    conversationHistory.push({ role: "user", parts: [{ text: userMessage }] });

    const body = {
      system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents: conversationHistory,
      generationConfig: {
        temperature:     0.7,
        maxOutputTokens: 600,
        topP:            0.9,
      },
    };

    const url = `${CONFIG.API_URL}${CONFIG.MODEL}:generateContent?key=${CONFIG.API_KEY}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`API Error ${response.status}`);
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Désolé, je n'ai pas pu générer une réponse.";

    conversationHistory.push({ role: "model", parts: [{ text }] });

    return text;
  }

  /* ── SEND MESSAGE ── */
  async function sendMessage(message) {
    if (!message.trim() || isTyping) return;

    const input = document.getElementById("fa-chat-input");
    const sendBtn = document.getElementById("fa-chat-send");
    const suggestions = document.getElementById("fa-quick-suggestions");

    // Masque les suggestions après le 1er message
    if (suggestions) suggestions.style.display = "none";

    // Affiche le message user
    addMessage("user", message);

    // Reset input
    if (input) { input.value = ""; input.style.height = "auto"; }

    // État loading
    isTyping = true;
    if (sendBtn) sendBtn.disabled = true;
    showTyping();

    try {
      const response = await callGemini(message);
      hideTyping();
      const parsed = parseResponse(response);
      addMessage("bot", parsed, true);
    } catch (err) {
      hideTyping();
      addMessage("bot",
        "Désolé, une erreur s'est produite. Rejoins notre Telegram pour une aide directe ! [TELEGRAM:free]",
        false
      );
      console.error("Chatbot error:", err);
    }

    isTyping = false;
    if (sendBtn) sendBtn.disabled = false;
  }

  /* ── GREETING ── */
  function showGreeting() {
    if (hasGreeted) return;
    hasGreeted = true;

    setTimeout(() => {
      addMessage("bot",
        `Bonjour ! 👋 Je suis l'IA officielle de <strong>Forex Average</strong>.<br><br>
        Je peux t'aider à :<br>
        🏦 Choisir un <strong>broker régulé</strong> adapté à ton style<br>
        📐 Comprendre la <strong>gestion du risque</strong><br>
        📱 Rejoindre notre <strong>communauté Telegram</strong><br>
        📊 Accéder aux <strong>analyses et calculateurs</strong><br><br>
        Comment puis-je t'aider aujourd'hui ?<br>
        <span class="fa-legal">⚠️ Le trading comporte des risques de perte en capital.</span>`,
        true
      );
    }, 300);
  }

  /* ── TOGGLE WINDOW ── */
  function toggleChat() {
    const window_ = document.getElementById("fa-chat-window");
    const iconOpen  = document.getElementById("fa-chat-icon-open");
    const iconClose = document.getElementById("fa-chat-icon-close");
    const notifDot  = document.getElementById("fa-notif-dot");

    isOpen = !isOpen;
    window_.classList.toggle("open", isOpen);
    iconOpen.style.display  = isOpen ? "none"  : "flex";
    iconClose.style.display = isOpen ? "flex"  : "none";
    if (notifDot) notifDot.style.display = "none";

    if (isOpen) {
      showGreeting();
      setTimeout(() => {
        const input = document.getElementById("fa-chat-input");
        if (input) input.focus();
      }, 250);
    }
  }

  /* ── INIT EVENTS ── */
  function initEvents() {
    // Toggle
    document.getElementById("fa-chat-toggle")?.addEventListener("click", toggleChat);
    document.getElementById("fa-chat-close")?.addEventListener("click", toggleChat);

    // Send on button click
    document.getElementById("fa-chat-send")?.addEventListener("click", () => {
      const val = document.getElementById("fa-chat-input")?.value || "";
      sendMessage(val.trim());
    });

    // Send on Enter (Shift+Enter = nouvelle ligne)
    document.getElementById("fa-chat-input")?.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        const val = e.target.value || "";
        sendMessage(val.trim());
      }
    });

    // Auto-resize textarea
    document.getElementById("fa-chat-input")?.addEventListener("input", (e) => {
      e.target.style.height = "auto";
      e.target.style.height = Math.min(e.target.scrollHeight, 100) + "px";
    });

    // Suggestions rapides
    document.querySelectorAll(".fa-suggestion").forEach((btn) => {
      btn.addEventListener("click", () => {
        sendMessage(btn.dataset.msg);
      });
    });
  }

  /* ── BOOT ── */
  function init() {
    injectCSS();
    injectHTML();
    initEvents();

    // Montre le dot de notification après 3s pour attirer l'attention
    setTimeout(() => {
      const dot = document.getElementById("fa-notif-dot");
      if (dot && !isOpen) dot.style.display = "block";
    }, 3000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
