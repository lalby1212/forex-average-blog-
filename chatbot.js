// ═══════════════════════════════════════════════════════════
// chatbot.js — ForexBot Widget
// À inclure dans chaque page HTML juste avant </body>
// <script src="/chatbot.js"></script>
// ═══════════════════════════════════════════════════════════

(function () {
  'use strict';

  // ── CONFIG ──────────────────────────────────────────────
  const CONFIG = {
    apiUrl:       '/api/chat',
    subscribeUrl: '/api/subscribe',
    telegramFree: 'https://t.me/forexaverageanalyse',
    telegramPaid: 'https://t.me/+8Q2zPHrvFghlMzI8',
    accentColor:  '#FFD700',
    botName:      'ForexBot',
    greeting:     'Salut 👋 Je suis ForexBot, ton assistant trading. Tu veux analyser un marché, comprendre un indicateur ou apprendre le risk management ?'
  };

  // ── STYLES ──────────────────────────────────────────────
  const style = document.createElement('style');
  style.textContent = `
    #fb-bubble {
      position: fixed; bottom: 24px; right: 24px; z-index: 9999;
      width: 52px; height: 52px; border-radius: 50%;
      background: #FFD700; border: none; cursor: pointer;
      box-shadow: 0 4px 20px rgba(255,215,0,0.4);
      display: flex; align-items: center; justify-content: center;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    #fb-bubble:hover { transform: scale(1.08); box-shadow: 0 6px 28px rgba(255,215,0,0.55); }
    #fb-bubble svg { width: 24px; height: 24px; }
    #fb-bubble .fb-close { display: none; }
    #fb-bubble.open .fb-chat-icon { display: none; }
    #fb-bubble.open .fb-close { display: block; }

    #fb-badge {
      position: absolute; top: -3px; right: -3px;
      width: 16px; height: 16px; border-radius: 50%;
      background: #ef4444; color: #fff;
      font-size: 10px; font-weight: 700;
      display: flex; align-items: center; justify-content: center;
      font-family: Inter, sans-serif;
    }
    #fb-badge.hidden { display: none; }

    #fb-window {
      position: fixed; bottom: 88px; right: 24px; z-index: 9998;
      width: 360px; max-width: calc(100vw - 32px);
      height: 520px; max-height: calc(100vh - 120px);
      background: #0f0f0f;
      border: 1px solid rgba(255,215,0,0.2);
      border-radius: 18px;
      display: flex; flex-direction: column;
      box-shadow: 0 24px 64px rgba(0,0,0,0.7);
      font-family: Inter, system-ui, sans-serif;
      overflow: hidden;
      opacity: 0; pointer-events: none; transform: translateY(12px) scale(0.97);
      transition: opacity 0.22s ease, transform 0.22s ease;
    }
    #fb-window.open { opacity: 1; pointer-events: all; transform: translateY(0) scale(1); }

    /* Header */
    #fb-header {
      display: flex; align-items: center; gap: 0.75rem;
      padding: 1rem 1.1rem 0.9rem;
      background: rgba(255,215,0,0.05);
      border-bottom: 1px solid rgba(255,255,255,0.06);
      flex-shrink: 0;
    }
    #fb-avatar {
      width: 36px; height: 36px; border-radius: 50%;
      background: #FFD700; display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }
    #fb-avatar svg { width: 18px; height: 18px; }
    .fb-header-info { flex: 1; }
    .fb-header-name { font-size: 0.88rem; font-weight: 700; color: #fff; }
    .fb-header-status { font-size: 0.72rem; color: #22c55e; display: flex; align-items: center; gap: 4px; }
    .fb-status-dot { width: 6px; height: 6px; border-radius: 50%; background: #22c55e; }

    /* Messages */
    #fb-messages {
      flex: 1; overflow-y: auto; padding: 1rem;
      display: flex; flex-direction: column; gap: 0.6rem;
      scroll-behavior: smooth;
    }
    #fb-messages::-webkit-scrollbar { width: 4px; }
    #fb-messages::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }

    .fb-msg {
      max-width: 88%; font-size: 0.83rem; line-height: 1.5;
      padding: 0.6rem 0.85rem; border-radius: 14px;
      animation: fb-pop 0.18s ease;
    }
    @keyframes fb-pop { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }

    .fb-msg.bot {
      background: rgba(255,255,255,0.06); color: #e8e8e8;
      border-radius: 4px 14px 14px 14px; align-self: flex-start;
    }
    .fb-msg.user {
      background: #FFD700; color: #000; font-weight: 500;
      border-radius: 14px 4px 14px 14px; align-self: flex-end;
    }

    /* CTA Cards */
    .fb-cta {
      background: rgba(255,215,0,0.08);
      border: 1px solid rgba(255,215,0,0.25);
      border-radius: 12px; padding: 0.8rem;
      margin-top: 0.3rem; align-self: flex-start; max-width: 88%;
      animation: fb-pop 0.18s ease;
    }
    .fb-cta-title { font-size: 0.8rem; font-weight: 700; color: #FFD700; margin-bottom: 0.4rem; }
    .fb-cta-desc { font-size: 0.75rem; color: #aaa; margin-bottom: 0.65rem; line-height: 1.4; }
    .fb-cta-btn {
      display: inline-block; padding: 0.45rem 0.9rem;
      background: #FFD700; color: #000; border-radius: 8px;
      font-size: 0.78rem; font-weight: 700; text-decoration: none;
      cursor: pointer; border: none; font-family: inherit;
      transition: background 0.15s;
    }
    .fb-cta-btn:hover { background: #ffec40; }

    /* Email form */
    .fb-email-form { display: flex; flex-direction: column; gap: 0.5rem; }
    .fb-email-input {
      padding: 0.5rem 0.75rem; border-radius: 8px;
      border: 1px solid rgba(255,215,0,0.3);
      background: rgba(255,255,255,0.05); color: #fff;
      font-size: 0.8rem; font-family: inherit; outline: none;
      transition: border-color 0.15s;
    }
    .fb-email-input:focus { border-color: #FFD700; }
    .fb-email-input::placeholder { color: #666; }

    /* Typing indicator */
    .fb-typing {
      display: flex; gap: 5px; align-items: center;
      padding: 0.6rem 0.85rem;
      background: rgba(255,255,255,0.06);
      border-radius: 4px 14px 14px 14px;
      align-self: flex-start;
    }
    .fb-typing span {
      width: 6px; height: 6px; border-radius: 50%;
      background: #888; animation: fb-bounce 1.2s infinite ease-in-out;
    }
    .fb-typing span:nth-child(2) { animation-delay: 0.2s; }
    .fb-typing span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes fb-bounce {
      0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
      40% { transform: translateY(-5px); opacity: 1; }
    }

    /* Input zone */
    #fb-input-zone {
      display: flex; gap: 0.5rem; padding: 0.8rem 1rem;
      border-top: 1px solid rgba(255,255,255,0.06);
      flex-shrink: 0;
    }
    #fb-input {
      flex: 1; padding: 0.55rem 0.85rem;
      background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 10px; color: #e8e8e8;
      font-size: 0.83rem; font-family: inherit;
      outline: none; resize: none;
      transition: border-color 0.15s;
    }
    #fb-input:focus { border-color: rgba(255,215,0,0.4); }
    #fb-input::placeholder { color: #555; }
    #fb-send {
      width: 36px; height: 36px; border-radius: 9px;
      background: #FFD700; border: none; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0; transition: background 0.15s, transform 0.1s;
      align-self: flex-end;
    }
    #fb-send:hover { background: #ffec40; transform: scale(1.05); }
    #fb-send:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }
    #fb-send svg { width: 16px; height: 16px; }

    /* Suggestions rapides */
    #fb-suggestions {
      display: flex; gap: 0.4rem; flex-wrap: wrap;
      padding: 0 1rem 0.6rem; flex-shrink: 0;
    }
    .fb-chip {
      padding: 0.3rem 0.65rem; border-radius: 20px;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      color: #aaa; font-size: 0.72rem; cursor: pointer;
      font-family: inherit; transition: background 0.15s, color 0.15s;
      white-space: nowrap;
    }
    .fb-chip:hover { background: rgba(255,215,0,0.1); color: #FFD700; border-color: rgba(255,215,0,0.3); }

    /* ── LEAD GATE ── */
    #fb-gate {
      position: absolute; inset: 0; z-index: 10;
      background: #0f0f0f;
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      padding: 1.8rem 1.6rem;
      text-align: center;
      animation: fb-pop 0.25s ease;
    }
    #fb-gate.hidden { display: none; }
    .fb-gate-icon {
      width: 56px; height: 56px; border-radius: 50%;
      background: rgba(255,215,0,0.1);
      border: 1px solid rgba(255,215,0,0.3);
      display: flex; align-items: center; justify-content: center;
      margin-bottom: 1.1rem;
    }
    .fb-gate-icon svg { width: 26px; height: 26px; }
    .fb-gate-title {
      font-size: 1rem; font-weight: 700; color: #fff;
      margin-bottom: 0.5rem; line-height: 1.3;
    }
    .fb-gate-sub {
      font-size: 0.78rem; color: #888; line-height: 1.5;
      margin-bottom: 1.4rem;
    }
    .fb-gate-sub strong { color: #FFD700; font-weight: 600; }
    .fb-gate-form { width: 100%; display: flex; flex-direction: column; gap: 0.65rem; }
    .fb-gate-input {
      width: 100%; padding: 0.7rem 0.9rem;
      background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,215,0,0.25);
      border-radius: 10px; color: #fff;
      font-size: 0.83rem; font-family: inherit; outline: none;
      transition: border-color 0.15s;
      text-align: center;
    }
    .fb-gate-input:focus { border-color: #FFD700; }
    .fb-gate-input::placeholder { color: #555; }
    .fb-gate-input.error { border-color: #ef4444; }
    .fb-gate-btn {
      width: 100%; padding: 0.75rem;
      background: #FFD700; color: #000;
      border: none; border-radius: 10px;
      font-size: 0.88rem; font-weight: 700;
      font-family: inherit; cursor: pointer;
      transition: background 0.15s, transform 0.1s;
    }
    .fb-gate-btn:hover { background: #ffec40; transform: translateY(-1px); }
    .fb-gate-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
    .fb-gate-skip {
      margin-top: 0.75rem; font-size: 0.7rem; color: #555;
      cursor: pointer; background: none; border: none;
      font-family: inherit; transition: color 0.15s;
    }
    .fb-gate-skip:hover { color: #888; }
    .fb-gate-privacy {
      margin-top: 0.5rem; font-size: 0.65rem; color: #444;
    }

    @media (max-width: 480px) {
      #fb-window { right: 12px; bottom: 80px; width: calc(100vw - 24px); }
      #fb-bubble { right: 12px; bottom: 12px; }
    }
  `;
  document.head.appendChild(style);

  // ── HTML ────────────────────────────────────────────────
  const widget = document.createElement('div');
  widget.innerHTML = `
    <!-- Bulle flottante -->
    <button id="fb-bubble" aria-label="Ouvrir le chat">
      <span id="fb-badge" class="hidden">1</span>
      <svg class="fb-chat-icon" viewBox="0 0 24 24" fill="none">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" fill="#000" stroke="#000" stroke-width="0"/>
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" fill="none" stroke="#1a1a1a" stroke-width="2" stroke-linejoin="round"/>
        <circle cx="8.5" cy="10" r="1.2" fill="#1a1a1a"/>
        <circle cx="12" cy="10" r="1.2" fill="#1a1a1a"/>
        <circle cx="15.5" cy="10" r="1.2" fill="#1a1a1a"/>
      </svg>
      <svg class="fb-close" viewBox="0 0 24 24" fill="none">
        <path d="M18 6L6 18M6 6l12 12" stroke="#1a1a1a" stroke-width="2.5" stroke-linecap="round"/>
      </svg>
    </button>

    <!-- Fenêtre chat -->
    <div id="fb-window" role="dialog" aria-label="ForexBot">

      <!-- LEAD GATE — affiché en premier si email non collecté -->
      <div id="fb-gate">
        <div class="fb-gate-icon">
          <svg viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="#FFD700" stroke-width="1.5"/>
            <path d="M5 15l4-4 3 3 4-5 3 2" stroke="#FFD700" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="fb-gate-title">Accède à ForexBot gratuitement</div>
        <div class="fb-gate-sub">
          Pose tes questions sur le <strong>Forex, l'Or, les Cryptos</strong> et le risk management — réponses instantanées par IA.
        </div>
        <div class="fb-gate-form">
          <input class="fb-gate-input" id="fb-gate-email" type="email" placeholder="ton@email.com" autocomplete="email" />
          <button class="fb-gate-btn" id="fb-gate-submit">Accéder au chat →</button>
        </div>
        <div class="fb-gate-privacy">🔒 Pas de spam. Désabonnement en 1 clic.</div>
      </div>

      <div id="fb-header">
        <div id="fb-avatar">
          <svg viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="#1a1a1a" stroke-width="1.5"/>
            <path d="M5 15l4-4 3 3 4-5 3 2" stroke="#1a1a1a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="fb-header-info">
          <div class="fb-header-name">ForexBot</div>
          <div class="fb-header-status"><span class="fb-status-dot"></span> En ligne</div>
        </div>
      </div>

      <div id="fb-messages"></div>

      <div id="fb-suggestions">
        <button class="fb-chip" data-q="Comment fonctionne le levier ?">📊 Levier</button>
        <button class="fb-chip" data-q="Explique-moi Fibonacci">📐 Fibonacci</button>
        <button class="fb-chip" data-q="Comment gérer mon risque ?">🛡️ Risk</button>
        <button class="fb-chip" data-q="Analyse EUR/USD">💶 EUR/USD</button>
      </div>

      <div id="fb-input-zone">
        <textarea id="fb-input" placeholder="Pose ta question…" rows="1" maxlength="500"></textarea>
        <button id="fb-send" aria-label="Envoyer">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(widget);

  // ── STATE ────────────────────────────────────────────────
  // Mémorise si l'email a déjà été collecté (localStorage)
  const STORAGE_KEY = 'fb_unlocked';
  const alreadyUnlocked = localStorage.getItem(STORAGE_KEY) === '1';

  const state = {
    open:        false,
    loading:     false,
    messages:    [],
    emailDone:   alreadyUnlocked,
    unlocked:    alreadyUnlocked,   // true = gate masquée
    badgeShown:  false
  };

  // ── REFS ─────────────────────────────────────────────────
  const bubble      = document.getElementById('fb-bubble');
  const win         = document.getElementById('fb-window');
  const msgEl       = document.getElementById('fb-messages');
  const inputEl     = document.getElementById('fb-input');
  const sendBtn     = document.getElementById('fb-send');
  const badge       = document.getElementById('fb-badge');
  const chips       = document.querySelectorAll('.fb-chip');
  const gate        = document.getElementById('fb-gate');
  const gateEmail   = document.getElementById('fb-gate-email');
  const gateSubmit  = document.getElementById('fb-gate-submit');

  // ── GATE LOGIC ───────────────────────────────────────────
  // Cache le gate si déjà débloqué
  if (state.unlocked) gate.classList.add('hidden');

  function unlockChat() {
    state.unlocked = true;
    state.emailDone = true;
    localStorage.setItem(STORAGE_KEY, '1');
    gate.style.opacity = '0';
    gate.style.transform = 'scale(0.96)';
    gate.style.transition = 'opacity 0.2s, transform 0.2s';
    setTimeout(() => gate.classList.add('hidden'), 200);
    if (state.messages.length === 0) showGreeting();
    setTimeout(() => inputEl.focus(), 350);
  }

  gateSubmit.addEventListener('click', async () => {
    const email = gateEmail.value.trim();
    if (!email || !email.includes('@')) {
      gateEmail.classList.add('error');
      gateEmail.focus();
      return;
    }
    gateEmail.classList.remove('error');
    gateSubmit.textContent = '⏳ Inscription…';
    gateSubmit.disabled = true;

    try {
      await fetch(CONFIG.subscribeUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
    } catch (_) { /* silencieux — on débloque quand même */ }

    unlockChat();
  });

  gateEmail.addEventListener('keydown', e => {
    if (e.key === 'Enter') gateSubmit.click();
  });

  // ── TOGGLE ───────────────────────────────────────────────
  bubble.addEventListener('click', () => {
    state.open = !state.open;
    bubble.classList.toggle('open', state.open);
    win.classList.toggle('open', state.open);
    badge.classList.add('hidden');
    // Si déjà débloqué et premier clic → greeting
    if (state.open && state.unlocked && state.messages.length === 0) showGreeting();
    // Focus : gate ou input
    if (state.open) {
      setTimeout(() => state.unlocked ? inputEl.focus() : gateEmail.focus(), 250);
    }
  });

  // ── GREETING ─────────────────────────────────────────────
  function showGreeting() {
    setTimeout(() => addBotMessage(CONFIG.greeting), 300);
  }

  // Badge après 3 secondes (attire l'attention)
  setTimeout(() => {
    if (!state.open && !state.badgeShown) {
      state.badgeShown = true;
      badge.classList.remove('hidden');
    }
  }, 3000);

  // ── CHIPS ────────────────────────────────────────────────
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const q = chip.dataset.q;
      sendMessage(q);
      // Cache les chips après le premier usage
      document.getElementById('fb-suggestions').style.display = 'none';
    });
  });

  // ── INPUT ────────────────────────────────────────────────
  inputEl.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      triggerSend();
    }
  });
  inputEl.addEventListener('input', () => {
    // Auto-resize textarea
    inputEl.style.height = 'auto';
    inputEl.style.height = Math.min(inputEl.scrollHeight, 100) + 'px';
  });
  sendBtn.addEventListener('click', triggerSend);

  function triggerSend() {
    const text = inputEl.value.trim();
    if (!text || state.loading) return;
    inputEl.value = '';
    inputEl.style.height = 'auto';
    sendMessage(text);
  }

  // ── SEND ─────────────────────────────────────────────────
  async function sendMessage(text) {
    // Affiche le message user
    addUserMessage(text);
    state.messages.push({ role: 'user', content: text });

    // Indicateur de frappe
    const typingEl = addTyping();
    sendBtn.disabled = true;
    state.loading = true;

    try {
      const res = await fetch(CONFIG.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: state.messages })
      });

      const data = await res.json();
      typingEl.remove();

      if (!res.ok) throw new Error(data.error || 'Erreur');

      let reply = data.reply;
      state.messages.push({ role: 'assistant', content: reply });

      // Détecte les CTA spéciaux et les retire du texte
      const hasTelegramCTA = reply.includes('[CTA_TELEGRAM]');
      const hasEmailCTA    = reply.includes('[CTA_EMAIL]');
      reply = reply.replace(/\[CTA_TELEGRAM\]/g, '').replace(/\[CTA_EMAIL\]/g, '').trim();

      addBotMessage(reply);

      if (hasTelegramCTA) {
        setTimeout(() => addTelegramCTA(), 400);
      } else if (hasEmailCTA && !state.emailDone) {
        setTimeout(() => addEmailForm(), 400);
      }

    } catch (err) {
      typingEl.remove();
      addBotMessage("Désolé, une erreur s'est produite. Réessaie dans un instant 🔄");
    } finally {
      sendBtn.disabled = false;
      state.loading = false;
    }
  }

  // ── RENDER HELPERS ───────────────────────────────────────
  function addUserMessage(text) {
    const el = document.createElement('div');
    el.className = 'fb-msg user';
    el.textContent = text;
    msgEl.appendChild(el);
    scrollToBottom();
  }

  function addBotMessage(text) {
    const el = document.createElement('div');
    el.className = 'fb-msg bot';
    el.textContent = text;
    msgEl.appendChild(el);
    scrollToBottom();
    return el;
  }

  function addTyping() {
    const el = document.createElement('div');
    el.className = 'fb-typing';
    el.innerHTML = '<span></span><span></span><span></span>';
    msgEl.appendChild(el);
    scrollToBottom();
    return el;
  }

  function addTelegramCTA() {
    const el = document.createElement('div');
    el.className = 'fb-cta';
    el.innerHTML = `
      <div class="fb-cta-title">📲 Rejoins la communauté</div>
      <div class="fb-cta-desc">Choisis ton niveau d'accès :</div>
      <div style="display:flex;flex-direction:column;gap:0.5rem;margin-top:0.2rem;">
        <a class="fb-cta-btn" href="${CONFIG.telegramFree}" target="_blank" rel="noopener"
           style="background:rgba(255,215,0,0.12);color:#FFD700;border:1px solid rgba(255,215,0,0.3);text-align:center;">
          🆓 Canal gratuit — Analyses & actualités
        </a>
        <a class="fb-cta-btn" href="${CONFIG.telegramPaid}" target="_blank" rel="noopener"
           style="text-align:center;">
          ⚡ Premium 24.99$/mois — Signaux & alertes live
        </a>
      </div>
    `;
    msgEl.appendChild(el);
    scrollToBottom();
  }

  function addEmailForm() {
    state.emailDone = true; // montre une seule fois
    const el = document.createElement('div');
    el.className = 'fb-cta';
    el.innerHTML = `
      <div class="fb-cta-title">📬 Reçois nos analyses</div>
      <div class="fb-cta-desc">Laisse ton email et reçois nos analyses hebdomadaires gratuitement.</div>
      <div class="fb-email-form">
        <input class="fb-email-input" type="email" placeholder="ton@email.com" />
        <button class="fb-cta-btn fb-email-submit">S'inscrire gratuitement</button>
      </div>
    `;
    msgEl.appendChild(el);
    scrollToBottom();

    const emailInput  = el.querySelector('.fb-email-input');
    const submitBtn   = el.querySelector('.fb-email-submit');

    submitBtn.addEventListener('click', async () => {
      const email = emailInput.value.trim();
      if (!email || !email.includes('@')) {
        emailInput.style.borderColor = '#ef4444';
        return;
      }
      submitBtn.textContent = '⏳ Inscription…';
      submitBtn.disabled = true;

      try {
        const res = await fetch(CONFIG.subscribeUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });
        const data = await res.json();
        el.innerHTML = `
          <div class="fb-cta-title">✅ Tu es inscrit !</div>
          <div class="fb-cta-desc">Tu recevras nos prochaines analyses sur ${email}. Bienvenue dans la communauté 🎉</div>
        `;
        setTimeout(() => addBotMessage("Super ! Tu recevras nos analyses directement dans ta boîte mail. Tu veux découvrir autre chose sur le trading ?"), 500);
      } catch {
        submitBtn.textContent = 'Réessayer';
        submitBtn.disabled = false;
      }
    });
  }

  function scrollToBottom() {
    requestAnimationFrame(() => {
      msgEl.scrollTop = msgEl.scrollHeight;
    });
  }

})();
