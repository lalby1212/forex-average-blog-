/* ============================================================
   FOREX AVERAGE — CHATBOT.JS (CORRIGÉ)
   IA officielle Forex Average · Powered by Gemini
   ============================================================ */

(function () {
  "use strict";

  /* ── CONFIG ── */
  const CONFIG = {
    API_KEY: "TAIzaSyAVRmhA134BNcGt4kyVhF4MIM-RTxnWtAA", 
    API_URL: "https://generativelanguage.googleapis.com/v1/models/",

    BROKERS: {
      exness: {
        name: "Exness",
        url:  "https://one.exnesstrack.net/a/forex_average",
      },
      xm: {
        name: "XM",
        url:  "https://clicks.pipaffiliates.com/c?c=forex_average",
      },
      icmarkets: {
        name: "IC Markets",
        url:  "https://icmarkets.com/?camp=forex_average",
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
1. Conseiller broker : propose UNIQUEMENT des brokers régulés (Exness, XM, IC Markets).
2. Promouvoir l'écosystème Forex Average : YouTube, Telegram, analyses, calculateurs.
3. Éducation trading : explique spreads, levier, gestion du risque.

=== LIENS ===
- Exness : ${CONFIG.BROKERS.exness.url}
- XM : ${CONFIG.BROKERS.xm.url}
- IC Markets : ${CONFIG.BROKERS.icmarkets.url}
- YouTube : ${CONFIG.LINKS.youtube}
- Telegram : ${CONFIG.LINKS.telegram_free}

=== FORMAT DE RÉPONSE ===
- Utilise [BROKER:nom], [TELEGRAM:free], [YOUTUBE] pour les boutons.
- Termine TOUJOURS par : "⚠️ Le trading comporte des risques de perte en capital."
`;

  /* ── STATE ── */
  let conversationHistory = [];
  let isOpen = false;
  let isTyping = false;
  let hasGreeted = false;

  /* ── INJECT HTML & CSS ── */
  function injectLayout() {
    const css = `
    #fa-chat-widget { position: fixed; bottom: 20px; right: 20px; z-index: 9999; font-family: sans-serif; }
    #fa-chat-toggle { width: 60px; height: 60px; border-radius: 50%; background: #FFD700; border: none; cursor: pointer; box-shadow: 0 4px 15px rgba(0,0,0,0.3); }
    #fa-chat-window { position: absolute; bottom: 80px; right: 0; width: 350px; height: 500px; background: #0a0a0a; border: 1px solid #FFD700; border-radius: 15px; display: none; flex-direction: column; overflow: hidden; color: white; }
    #fa-chat-window.open { display: flex; }
    #fa-chat-header { background: #111; padding: 15px; border-bottom: 1px solid #333; font-weight: bold; }
    #fa-chat-messages { flex: 1; padding: 15px; overflow-y: auto; display: flex; flex-direction: column; gap: 10px; }
    .fa-msg { padding: 8px 12px; border-radius: 10px; max-width: 80%; font-size: 14px; line-height: 1.4; }
    .fa-msg--bot { background: #222; align-self: flex-start; border: 1px solid #333; }
    .fa-msg--user { background: #FFD700; color: #000; align-self: flex-end; }
    #fa-chat-input-area { padding: 10px; border-top: 1px solid #333; display: flex; gap: 5px; }
    #fa-chat-input { flex: 1; background: #222; border: 1px solid #444; color: white; padding: 8px; border-radius: 5px; }
    #fa-chat-send { background: #FFD700; border: none; padding: 0 15px; border-radius: 5px; cursor: pointer; font-weight: bold; }
    .fa-cta-btn { display: block; margin-top: 5px; padding: 8px; background: #FFD700; color: #000; text-align: center; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 12px; }
    .fa-legal { font-size: 10px; color: #777; display: block; margin-top: 10px; border-top: 1px solid #333; padding-top: 5px; }
    `;
    const style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);

    const html = `
    <div id="fa-chat-widget">
      <button id="fa-chat-toggle">💬</button>
      <div id="fa-chat-window">
        <div id="fa-chat-header">Forex Average IA</div>
        <div id="fa-chat-messages"></div>
        <div id="fa-chat-input-area">
          <input type="text" id="fa-chat-input" placeholder="Posez une question...">
          <button id="fa-chat-send">></button>
        </div>
      </div>
    </div>`;
    document.body.insertAdjacentHTML("beforeend", html);
  }

  /* ── PARSE & DISPLAY ── */
  function parseResponse(text) {
    text = text.replace(/\[BROKER:exness\]/gi, `<a href="${CONFIG.BROKERS.exness.url}" target="_blank" class="fa-cta-btn">🏦 Ouvrir Exness</a>`);
    text = text.replace(/\[BROKER:xm\]/gi, `<a href="${CONFIG.BROKERS.xm.url}" target="_blank" class="fa-cta-btn">🏦 Ouvrir XM</a>`);
    text = text.replace(/\[BROKER:icmarkets\]/gi, `<a href="${CONFIG.BROKERS.icmarkets.url}" target="_blank" class="fa-cta-btn">🏦 Ouvrir IC Markets</a>`);
    text = text.replace(/\[TELEGRAM:free\]/gi, `<a href="${CONFIG.LINKS.telegram_free}" target="_blank" class="fa-cta-btn" style="background:#22c55e;color:#fff;">📱 Telegram Gratuit</a>`);
    text = text.replace(/\n/g, "<br>");
    text = text.replace(/⚠️ Le trading comporte des risques de perte en capital\./gi, `<span class="fa-legal">⚠️ Le trading comporte des risques de perte en capital.</span>`);
    return text;
  }

  function addMessage(role, content, isHTML = false) {
    const container = document.getElementById("fa-chat-messages");
    const div = document.createElement("div");
    div.className = `fa-msg fa-msg--${role === "bot" ? "bot" : "user"}`;
    if (isHTML) div.innerHTML = content; else div.textContent = content;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
  }

  /* ── API CALL (FIXED) ── */
  async function callGemini(userMessage) {
    conversationHistory.push({ role: "user", parts: [{ text: userMessage }] });

    const MODELS = ["gemini-1.5-flash", "gemini-2.0-flash"];
    let lastError = null;

    for (const model of MODELS) {
      try {
        const body = {
          // STRUCTURE CORRIGÉE : parts est un tableau []
          system_instruction: { 
            parts: [{ text: SYSTEM_PROMPT }] 
          },
          contents: conversationHistory,
          generationConfig: { temperature: 0.7, maxOutputTokens: 800 }
        };

        const response = await fetch(`${CONFIG.API_URL}${model}:generateContent?key=${CONFIG.API_KEY}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)
        });

        if (!response.ok) {
          const errData = await response.json();
          lastError = errData?.error?.message || response.status;
          continue;
        }

        const data = await response.json();
        const resText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (resText) {
          conversationHistory.push({ role: "model", parts: [{ text: resText }] });
          return resText;
        }
      } catch (e) { lastError = e.message; }
    }
    throw new Error(lastError);
  }

  /* ── EVENTS ── */
  async function handleSend() {
    const input = document.getElementById("fa-chat-input");
    const msg = input.value.trim();
    if (!msg || isTyping) return;

    addMessage("user", msg);
    input.value = "";
    isTyping = true;

    try {
      const aiRes = await callGemini(msg);
      addMessage("bot", parseResponse(aiRes), true);
    } catch (e) {
      addMessage("bot", "Erreur de connexion. Vérifiez votre clé API.");
    }
    isTyping = false;
  }

  function init() {
    injectLayout();
    document.getElementById("fa-chat-toggle").onclick = () => {
      isOpen = !isOpen;
      document.getElementById("fa-chat-window").classList.toggle("open", isOpen);
      if (isOpen && !hasGreeted) {
        addMessage("bot", "Bonjour ! Comment puis-je vous aider dans votre trading ?");
        hasGreeted = true;
      }
    };
    document.getElementById("fa-chat-send").onclick = handleSend;
    document.getElementById("fa-chat-input").onkeydown = (e) => { if(e.key === "Enter") handleSend(); };
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
