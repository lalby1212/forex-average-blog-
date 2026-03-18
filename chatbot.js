/* ============================================================
   FOREX AVERAGE — CHATBOT.JS (DESIGN PREMIUM)
   IA officielle Forex Average · Powered by Gemini
   ============================================================ */

(function () {
  "use strict";

  const CONFIG = {
    API_KEY: "AIzaSyAVRmhA134BNcGt4kyVhF4MIM-RTxnWtAA", 
    API_URL: "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=",
    
    BROKERS: {
      exness: "https://one.exnesstrack.net/a/forex_average",
      xm: "https://clicks.pipaffiliates.com/c?c=forex_average",
      icmarkets: "https://icmarkets.com/?camp=forex_average"
    },
    LINKS: {
      telegram: "https://t.me/forexaverageanalyse",
      youtube: "https://youtube.com/@forexaverage"
    }
  };

  // Instructions intégrées au message pour éviter l'erreur 400
  const SYSTEM_CONTEXT = `Instructions: Tu es l'expert de Forex Average. 
  Réponds en français, court et pro. 
  PROMEUT Exness (${CONFIG.BROKERS.exness}), XM (${CONFIG.BROKERS.xm}) et Telegram (${CONFIG.LINKS.telegram}). 
  Formatte tes liens brokers ainsi: [BROKER:nom].
  Termine par: ⚠️ Le trading comporte des risques de perte en capital.`;

  let conversationHistory = [];
  let isOpen = false;

  function injectAssets() {
    const css = `
    #fa-chat-widget { position: fixed; bottom: 25px; right: 25px; z-index: 10000; font-family: 'Inter', -apple-system, sans-serif; }
    #fa-chat-toggle { width: 60px; height: 60px; border-radius: 50%; background: #FFD700; border: none; cursor: pointer; box-shadow: 0 8px 24px rgba(0,0,0,0.2); font-size: 24px; transition: 0.3s; }
    #fa-chat-toggle:hover { transform: scale(1.1); background: #f0cc00; }
    
    #fa-chat-window { 
      position: absolute; bottom: 80px; right: 0; width: 380px; height: 580px; 
      background: #171717; border: 1px solid #333; border-radius: 16px; 
      display: none; flex-direction: column; overflow: hidden; 
      box-shadow: 0 12px 40px rgba(0,0,0,0.5); 
    }
    #fa-chat-window.open { display: flex; }
    
    #fa-chat-header { background: #1f1f1f; padding: 20px; border-bottom: 1px solid #333; display: flex; align-items: center; gap: 12px; }
    #fa-chat-avatar { width: 32px; height: 32px; background: #FFD700; border-radius: 8px; color: #000; font-weight: bold; display: flex; align-items: center; justify-content: center; }
    
    #fa-chat-messages { flex: 1; padding: 20px; overflow-y: auto; display: flex; flex-direction: column; gap: 15px; background: #171717; }
    .fa-msg { padding: 12px 16px; border-radius: 12px; font-size: 14px; line-height: 1.5; max-width: 85%; }
    .fa-msg--bot { background: #262626; color: #ececec; align-self: flex-start; border: 1px solid #333; }
    .fa-msg--user { background: #FFD700; color: #000; align-self: flex-end; font-weight: 500; }
    
    #fa-chat-input-area { padding: 15px; background: #1f1f1f; display: flex; gap: 10px; border-top: 1px solid #333; }
    #fa-chat-input { flex: 1; background: #2d2d2d; border: 1px solid #444; color: #fff; padding: 12px; border-radius: 8px; outline: none; }
    #fa-chat-input:focus { border-color: #FFD700; }
    #fa-chat-send { background: #FFD700; border: none; padding: 0 15px; border-radius: 8px; cursor: pointer; font-weight: bold; }
    
    .fa-btn { display: inline-block; margin-top: 10px; padding: 10px 15px; background: #FFD700; color: #000; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 13px; transition: 0.2s; }
    .fa-btn:hover { background: #fff; }
    .fa-legal { font-size: 11px; color: #666; display: block; margin-top: 12px; font-style: italic; }
    `;
    const style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);

    const html = `
    <div id="fa-chat-widget">
      <button id="fa-chat-toggle">🟡</button>
      <div id="fa-chat-window">
        <div id="fa-chat-header">
          <div id="fa-chat-avatar">FA</div>
          <div><div style="font-weight:600; font-size:15px;">Forex Average AI</div><div style="font-size:11px; color:#22c55e;">● Actif</div></div>
        </div>
        <div id="fa-chat-messages"></div>
        <div id="fa-chat-input-area">
          <input type="text" id="fa-chat-input" placeholder="Posez votre question...">
          <button id="fa-chat-send">S</button>
        </div>
      </div>
    </div>`;
    document.body.insertAdjacentHTML("beforeend", html);
  }

  function parse(text) {
    text = text.replace(/\[BROKER:exness\]/gi, `<a href="${CONFIG.BROKERS.exness}" target="_blank" class="fa-btn">🏦 Trader sur Exness</a>`);
    text = text.replace(/\[BROKER:xm\]/gi, `<a href="${CONFIG.BROKERS.xm}" target="_blank" class="fa-btn">🏦 Ouvrir un compte XM</a>`);
    text = text.replace(/\[BROKER:icmarkets\]/gi, `<a href="${CONFIG.BROKERS.icmarkets}" target="_blank" class="fa-btn">🏦 IC Markets ECN</a>`);
    text = text.replace(/\n/g, "<br>");
    text = text.replace(/⚠️ Le trading comporte des risques de perte en capital\./gi, `<span class="fa-legal">⚠️ Le trading comporte des risques de perte en capital.</span>`);
    return text;
  }

  function addMsg(role, content, isHTML = false) {
    const box = document.getElementById("fa-chat-messages");
    const d = document.createElement("div");
    d.className = `fa-msg fa-msg--${role}`;
    if (isHTML) d.innerHTML = content; else d.textContent = content;
    box.appendChild(d);
    box.scrollTop = box.scrollHeight;
  }

  async function callAI(msg) {
    // Si c'est le premier message, on injecte le contexte
    let promptText = conversationHistory.length === 0 ? `${SYSTEM_CONTEXT}\n\nUser: ${msg}` : msg;
    conversationHistory.push({ role: "user", parts: [{ text: promptText }] });

    try {
      const r = await fetch(CONFIG.API_URL + CONFIG.API_KEY, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: conversationHistory })
      });

      const data = await r.json();
      if (!r.ok) throw new Error(data.error?.message || "Erreur");

      const res = data.candidates[0].content.parts[0].text;
      conversationHistory.push({ role: "model", parts: [{ text: res }] });
      return res;
    } catch (e) {
      console.error(e);
      return "Désolé, une erreur est survenue. Vérifiez votre clé API.";
    }
  }

  async function handle() {
    const input = document.getElementById("fa-chat-input");
    const val = input.value.trim();
    if (!val) return;

    addMsg("user", val);
    input.value = "";
    const ai = await callAI(val);
    addMsg("bot", parse(ai), true);
  }

  function init() {
    injectAssets();
    document.getElementById("fa-chat-toggle").onclick = () => {
      isOpen = !isOpen;
      document.getElementById("fa-chat-window").classList.toggle("open", isOpen);
      if (isOpen && conversationHistory.length === 0) {
        addMsg("bot", "Bienvenue chez Forex Average. Comment puis-je vous aider dans votre trading aujourd'hui ?");
      }
    };
    document.getElementById("fa-chat-send").onclick = handle;
    document.getElementById("fa-chat-input").onkeydown = (e) => { if (e.key === "Enter") handle(); };
  }

  init();
})();
