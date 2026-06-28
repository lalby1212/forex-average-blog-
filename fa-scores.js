/* ============================================================
   fa-scores.js — Forex Average · Widget Scores Macro v1.0
   ============================================================
   Usage sur n'importe quelle page d'analyse :

   <div id="score-widget"></div>
   <script src="fa-scores.js"></script>
   <script>FAScores.render('score-widget', 'EUR/USD');</script>
   ============================================================ */

(function () {
  'use strict';

  const SB_URL = 'https://bpfpghlpdzevzyhalxov.supabase.co';
  const SB_KEY = 'sb_publishable_XHStaFT7Lkp7FRomgGmOFw_8puBQvTZ';

  /* ── CSS injecté une seule fois ── */
  function injectCSS() {
    if (document.getElementById('fa-scores-css')) return;
    const s = document.createElement('style');
    s.id = 'fa-scores-css';
    s.textContent = `
      .fas-wrap {
        background: #0f0f0f;
        border: 1px solid rgba(255,215,0,0.15);
        border-radius: 16px;
        padding: 1.75rem 1.5rem;
        margin: 2rem 0;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      }
      .fas-header {
        display: flex; align-items: center; justify-content: space-between;
        margin-bottom: 1.5rem; flex-wrap: wrap; gap: .75rem;
      }
      .fas-title {
        font-size: .7rem; font-weight: 700; letter-spacing: 1.5px;
        text-transform: uppercase; color: rgba(255,215,0,.6);
      }
      .fas-updated { font-size: .72rem; color: rgba(255,255,255,.3); }
      .fas-global {
        display: flex; align-items: center; gap: 2rem;
        margin-bottom: 1.75rem; flex-wrap: wrap;
      }
      .fas-ring-wrap {
        position: relative; width: 110px; height: 110px; flex-shrink: 0;
      }
      .fas-ring-wrap svg { transform: rotate(-90deg); }
      .fas-ring-bg  { fill: none; stroke: rgba(255,255,255,.06); stroke-width: 10; }
      .fas-ring-bar { fill: none; stroke-width: 10; stroke-linecap: round;
                      transition: stroke-dashoffset .8s cubic-bezier(.4,0,.2,1); }
      .fas-ring-label {
        position: absolute; inset: 0; display: flex; flex-direction: column;
        align-items: center; justify-content: center; text-align: center;
      }
      .fas-ring-num  { font-size: 1.6rem; font-weight: 900; line-height: 1; color: #fff; }
      .fas-ring-max  { font-size: .65rem; color: rgba(255,255,255,.35); }
      .fas-global-info { flex: 1; min-width: 0; }
      .fas-instrument { font-size: 1.35rem; font-weight: 900; color: #fff; margin-bottom: .35rem; }
      .fas-bias {
        display: inline-block; padding: .25rem .75rem; border-radius: 6px;
        font-size: .78rem; font-weight: 700; letter-spacing: .3px; margin-bottom: .5rem;
      }
      .fas-bias-bull { background: rgba(34,197,94,.15);  color: #22c55e; border: 1px solid rgba(34,197,94,.3); }
      .fas-bias-bear { background: rgba(239,68,68,.15);  color: #ef4444; border: 1px solid rgba(239,68,68,.3); }
      .fas-bias-neut { background: rgba(255,255,255,.07); color: rgba(255,255,255,.55); border: 1px solid rgba(255,255,255,.1); }
      .fas-score-sent { font-size: .8rem; color: rgba(255,255,255,.5); }
      .fas-score-sent strong { color: #FFD700; }
      .fas-bars { display: flex; flex-direction: column; gap: .85rem; margin-bottom: 1.75rem; }
      .fas-bar-row { display: flex; align-items: center; gap: .85rem; }
      .fas-bar-label { width: 110px; flex-shrink: 0; font-size: .78rem; color: rgba(255,255,255,.6); font-weight: 500; }
      .fas-bar-track {
        flex: 1; height: 6px; background: rgba(255,255,255,.07);
        border-radius: 99px; overflow: hidden; position: relative;
      }
      .fas-bar-fill { height: 100%; border-radius: 99px; transition: width .7s cubic-bezier(.4,0,.2,1); }
      .fas-bar-val { width: 50px; text-align: right; flex-shrink: 0; font-size: .78rem; font-weight: 700; color: #fff; }
      .fas-bar-max { font-size: .65rem; color: rgba(255,255,255,.3); font-weight: 400; }
      .fas-sections { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
      @media (max-width: 600px) { .fas-sections { grid-template-columns: 1fr; } }
      .fas-section {
        background: rgba(255,255,255,.03); border: 1px solid rgba(255,255,255,.07);
        border-radius: 10px; padding: 1rem 1.1rem;
      }
      .fas-section.full { grid-column: 1 / -1; }
      .fas-section-title {
        font-size: .65rem; font-weight: 700; letter-spacing: 1.2px;
        text-transform: uppercase; color: rgba(255,215,0,.5); margin-bottom: .5rem;
      }
      .fas-section-body { font-size: .83rem; color: rgba(255,255,255,.7); line-height: 1.55; white-space: pre-line; }
      .fas-empty { color: rgba(255,255,255,.25); font-style: italic; }
      .fas-skeleton {
        background: linear-gradient(90deg, #1a1a1a 25%, #222 50%, #1a1a1a 75%);
        background-size: 200% 100%; animation: fas-shimmer 1.2s infinite; border-radius: 6px;
      }
      @keyframes fas-shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
    `;
    document.head.appendChild(s);
  }

  function scoreColor(pct) {
    if (pct >= 65) return '#22c55e';
    if (pct >= 40) return '#FFD700';
    if (pct >= 20) return '#f97316';
    return '#ef4444';
  }

  function getBias(total) {
    if (total >= 65)  return { label: '📈 Haussier',             cls: 'fas-bias-bull' };
    if (total >= 45)  return { label: '↗ Légèrement haussier',  cls: 'fas-bias-bull' };
    if (total >= 35)  return { label: '↔ Neutre',               cls: 'fas-bias-neut' };
    if (total >= 20)  return { label: '↘ Légèrement baissier',  cls: 'fas-bias-bear' };
    return                   { label: '📉 Baissier',            cls: 'fas-bias-bear' };
  }

  function barPct(val, max) {
    return Math.round(((val + max) / (2 * max)) * 100);
  }

  function renderHTML(data) {
    const total = (data.tendance||0) + (data.momentum||0) +
                  (data.volatilite||0) + (data.fondamentaux||0) +
                  (data.sentiment_score||0);
    const totalPct = Math.max(0, Math.min(100, Math.round(((total + 100) / 200) * 100)));
    const color    = scoreColor(totalPct);
    const bias     = getBias(totalPct);
    const circ     = 2 * Math.PI * 45;
    const dash     = circ - (totalPct / 100) * circ;
    const updatedStr = data.updated_at
      ? 'Mis à jour ' + new Date(data.updated_at).toLocaleDateString('fr-FR', { day:'2-digit', month:'short', year:'numeric' })
      : '';

    const bars = [
      { label:'Tendance',     val: data.tendance||0,         max:25 },
      { label:'Momentum',     val: data.momentum||0,         max:20 },
      { label:'Volatilité',   val: data.volatilite||0,       max:15 },
      { label:'Fondamentaux', val: data.fondamentaux||0,     max:25 },
      { label:'Sentiment',    val: data.sentiment_score||0,  max:15 },
    ];

    const barsHTML = bars.map(b => {
      const pct    = barPct(b.val, b.max);
      const bcolor = b.val >= 0 ? '#22c55e' : '#ef4444';
      const sign   = b.val >= 0 ? '+' : '';
      return `<div class="fas-bar-row">
        <span class="fas-bar-label">${b.label}</span>
        <div class="fas-bar-track"><div class="fas-bar-fill" style="width:${pct}%;background:${bcolor}"></div></div>
        <span class="fas-bar-val">${sign}${b.val}<span class="fas-bar-max">/${b.max}</span></span>
      </div>`;
    }).join('');

    const sec = (title, text, full) => `<div class="fas-section${full?' full':''}">
      <div class="fas-section-title">${title}</div>
      <div class="fas-section-body${text?'':' fas-empty'}">${text||'Non renseigné'}</div>
    </div>`;

    const sentSign = (data.score_sentiment||0) >= 0 ? '+' : '';

    return `<div class="fas-wrap">
      <div class="fas-header">
        <span class="fas-title">Score Macro</span>
        <span class="fas-updated">${updatedStr}</span>
      </div>
      <div class="fas-global">
        <div class="fas-ring-wrap">
          <svg viewBox="0 0 100 100" width="110" height="110">
            <circle class="fas-ring-bg"  cx="50" cy="50" r="45"/>
            <circle class="fas-ring-bar" cx="50" cy="50" r="45"
              stroke="${color}"
              stroke-dasharray="${circ.toFixed(1)}"
              stroke-dashoffset="${dash.toFixed(1)}"/>
          </svg>
          <div class="fas-ring-label">
            <span class="fas-ring-num" style="color:${color}">${total>=0?'+':''}${total}</span>
            <span class="fas-ring-max">/100</span>
          </div>
        </div>
        <div class="fas-global-info">
          <div class="fas-instrument">${data.instrument}</div>
          <div class="fas-bias ${bias.cls}">${bias.label}</div>
          <div class="fas-score-sent">Score Sentiment : <strong>${sentSign}${data.score_sentiment||0}</strong></div>
        </div>
      </div>
      <div class="fas-bars">${barsHTML}</div>
      <div class="fas-sections">
        ${sec('Score Sentimental', sentSign+(data.score_sentiment||0), false)}
        ${sec('Décision fondamentale', data.decision, false)}
        ${sec('Contexte fondamental', data.contexte, true)}
        ${sec('Limite / Invalidation', data.limite, true)}
      </div>
    </div>`;
  }

  function renderSkeleton() {
    return `<div class="fas-wrap">
      <div class="fas-header"><span class="fas-title">Score Macro</span></div>
      <div class="fas-global">
        <div class="fas-ring-wrap fas-skeleton" style="border-radius:50%;"></div>
        <div style="flex:1">
          <div class="fas-skeleton" style="height:22px;width:120px;margin-bottom:.6rem;"></div>
          <div class="fas-skeleton" style="height:14px;width:80px;"></div>
        </div>
      </div>
      <div class="fas-bars">${[1,2,3,4,5].map(()=>`<div class="fas-bar-row">
        <div class="fas-skeleton" style="width:100px;height:12px;"></div>
        <div class="fas-skeleton" style="flex:1;height:6px;margin:0 .85rem;"></div>
        <div class="fas-skeleton" style="width:40px;height:12px;"></div>
      </div>`).join('')}</div>
    </div>`;
  }

  async function fetchScore(instrument) {
    const res = await fetch(
      `${SB_URL}/rest/v1/market_scores?instrument=eq.${encodeURIComponent(instrument)}&limit=1`,
      { headers: { 'apikey': SB_KEY, 'Accept': 'application/json' } }
    );
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const rows = await res.json();
    return rows && rows[0] ? rows[0] : null;
  }

  window.FAScores = {
    render(containerId, instrument) {
      injectCSS();
      const el = document.getElementById(containerId);
      if (!el) return;
      el.innerHTML = renderSkeleton();
      fetchScore(instrument)
        .then(data => {
          el.innerHTML = data
            ? renderHTML(data)
            : `<div class="fas-wrap"><p style="color:rgba(255,255,255,.4);text-align:center;padding:2rem">Aucun score disponible pour ${instrument}</p></div>`;
        })
        .catch(() => {
          el.innerHTML = `<div class="fas-wrap"><p style="color:rgba(255,255,255,.4);text-align:center;padding:2rem">Scores temporairement indisponibles</p></div>`;
        });
    }
  };

})();
