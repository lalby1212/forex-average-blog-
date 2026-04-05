// ═══════════════════════════════════════════════════════════
// api/subscribe.js — Vercel Serverless Function
// Route : POST /api/subscribe
// Ajoute un email à ta liste Mailchimp
// ═══════════════════════════════════════════════════════════

export default async function handler(req, res) {

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email, firstName } = req.body;

  // Validation basique
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Email invalide' });
  }

  const MAILCHIMP_API_KEY  = process.env.MAILCHIMP_API_KEY;
  const MAILCHIMP_LIST_ID  = process.env.MAILCHIMP_LIST_ID;
  const MAILCHIMP_DC       = process.env.MAILCHIMP_DC;   // ex: "us21"

  if (!MAILCHIMP_API_KEY || !MAILCHIMP_LIST_ID || !MAILCHIMP_DC) {
    console.error('Variables Mailchimp manquantes');
    return res.status(500).json({ error: 'Configuration manquante' });
  }

  const url = `https://${MAILCHIMP_DC}.api.mailchimp.com/3.0/lists/${MAILCHIMP_LIST_ID}/members`;

  try {
    const mcRes = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Mailchimp utilise Basic Auth : n'importe quel username + la clé API
        'Authorization': 'Basic ' + Buffer.from(`anystring:${MAILCHIMP_API_KEY}`).toString('base64')
      },
      body: JSON.stringify({
        email_address: email,
        status: 'subscribed',       // 'pending' pour double opt-in
        merge_fields: {
          FNAME: firstName || ''
        },
        tags: ['chatbot', 'forex-average']
      })
    });

    const data = await mcRes.json();

    // 400 avec title "Member Exists" = déjà abonné, pas grave
    if (!mcRes.ok && data.title !== 'Member Exists') {
      console.error('Mailchimp error:', data);
      return res.status(502).json({ error: data.detail || 'Erreur Mailchimp' });
    }

    return res.status(200).json({
      success: true,
      message: data.title === 'Member Exists'
        ? 'Déjà inscrit'
        : 'Inscription réussie'
    });

  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
}
