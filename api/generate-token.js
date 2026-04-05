/* ═══════════════════════════════════════════════════════════════
   /api/generate-token — Génération automatique de codes premium
   ───────────────────────────────────────────────────────────────
   Usage (admin uniquement) :
     GET /api/generate-token?email=user@example.com&admin_key=XXX

   Variables Vercel requises :
     TOKEN_SECRET  → clé secrète HMAC (chaîne quelconque, ex: "fa2026xK9")
     ADMIN_KEY     → mot de passe admin pour protéger l'endpoint

   Token généré : FA-[8CHARS]-[MMAA]
   Exemple      : FA-A3F2B8C1-0426 → valable tout avril 2026

   La vérification se fait dans /api/verify-token (mode HMAC)
   ═══════════════════════════════════════════════════════════════ */

import crypto from 'node:crypto';

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'OPTIONS') return res.status(200).end();

  /* ── Vérification clé admin ── */
  const adminKey  = (req.query.admin_key || '').trim();
  const envAdmin  = process.env.ADMIN_KEY || '';

  /* Mode dev : si ADMIN_KEY non configuré, on accepte tout */
  const adminOk = !envAdmin.trim() || adminKey === envAdmin;
  if (!adminOk) {
    return res.status(401).json({ error: 'Clé admin invalide.' });
  }

  /* ── Email ── */
  const email = (req.query.email || '').trim().toLowerCase();
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Email invalide.' });
  }

  /* ── Période : mois courant MMAA ── */
  const now   = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // 01-12
  const year  = String(now.getFullYear()).slice(2);           // ex: 26
  const mmaa  = month + year;                                 // ex: 0426

  /* ── Génération HMAC ── */
  const secret = process.env.TOKEN_SECRET || 'dev-secret';
  const payload = `${email}:${mmaa}`;
  const hmac = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  const code = hmac.slice(0, 8).toUpperCase(); // 8 chars hex → FA-A3F2B8C1

  const token = `FA-${code}-${mmaa}`;

  /* ── Date d'expiration (fin du mois) ── */
  const expires = lastDayOfMonth(2000 + parseInt(year, 10), parseInt(month, 10));

  return res.status(200).json({
    token,
    expires,
    email,
    note: `Ce code est valable jusqu'au ${new Date(expires).toLocaleDateString('fr-FR')} pour ${email}`
  });
}

function lastDayOfMonth(year, month) {
  const d = new Date(year, month, 0);
  return d.toISOString().split('T')[0];
}
