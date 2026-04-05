// ═══════════════════════════════════════════════════════════
// api/chat.js — Vercel Serverless Function
// Route : POST /api/chat
// ═══════════════════════════════════════════════════════════

export default async function handler(req, res) {

  // CORS — autorise ton domaine en production
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'messages[] requis' });
  }

  // Limite de sécurité — max 20 messages par session
  const history = messages.slice(-20);

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',          // rapide + peu cher, parfait pour un chatbot
        max_tokens: 500,               // réponses courtes = coût maîtrisé
        temperature: 0.7,
        messages: [
          {
            role: 'system',
            content: `Tu es ForexBot, l'assistant trading de Forex Average — une plateforme francophone dédiée au trading Forex, Crypto et Matières Premières.

TON RÔLE :
- Répondre aux questions sur le trading : Forex, Crypto, Or, Pétrole, indices
- Expliquer les concepts : pips, lots, levier, risk management, indicateurs (RSI, MACD, Fibonacci, Moyennes mobiles, Bandes de Bollinger, etc.)
- Analyser des situations de trading de façon pédagogique
- Orienter vers les outils du site : graphiques live, calculateurs, calendrier économique
- NE PAS donner de conseils financiers directs ni de signaux précis (tu n'es pas un gestionnaire de fonds)

STYLE :
- Répond toujours en français
- Sois concis, clair et professionnel
- Utilise des exemples concrets quand c'est utile
- Ton dynamique mais pas familier

CONVERSION (naturelle, jamais forcée) :
- Si l'utilisateur montre de l'intérêt pour aller plus loin, mentionne le Telegram Premium Forex Average (24.99$/mois) qui donne accès aux analyses exclusives et alertes en temps réel
- Si tu proposes le Telegram, ajoute ce texte exact en fin de message : [CTA_TELEGRAM]
- Si l'utilisateur demande à être tenu informé ou veut recevoir des analyses, propose-lui de laisser son email : [CTA_EMAIL]

OUTILS DU SITE (mentionne-les quand c'est pertinent) :
- Graphiques live TradingView → /graphique.html
- Calculateurs de trading → /calculateurs-trading.html
- Calendrier économique → /calendrier-economique.html
- Actualités → /actualites.html`
          },
          ...history
        ]
      })
    });

    if (!response.ok) {
      const err = await response.json();
      console.error('OpenAI error:', err);
      return res.status(502).json({ error: 'Erreur OpenAI', details: err });
    }

    const data = await response.json();
    const reply = data.choices[0].message.content;

    return res.status(200).json({
      reply,
      usage: data.usage  // input_tokens, output_tokens pour monitoring
    });

  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
}
