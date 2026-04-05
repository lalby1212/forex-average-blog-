/* ═══════════════════════════════════════════════════════════════
   /api/verify-token — Validation code premium mensuel
   ───────────────────────────────────────────────────────────────
   Format token : FA-[CODE]-[MMAA]
   Exemple      : FA-GOLD-0526  → expire fin mai 2026 (code manuel)
                  FA-A3F2B8C1-0426 → code auto-généré par email

   Deux modes de validation :
   1. Code manuel : base code dans PREMIUM_TOKENS env var (ex: GOLD,PRO,VIP)
   2. Code HMAC   : généré par /api/generate-token, vérifié avec TOKEN_SECRET
                    → nécessite email en paramètre

   Variables Vercel :
     PREMIUM_TOKENS = GOLD,PRO,VIP,ALPHA  (codes manuels, sans date)
     TOKEN_SECRET   = chaîne secrète HMAC (même valeur que generate-token)

   Réponse : { valid, expires, daysLeft, reason, mode }
   ═══════════════════════════════════════════════════════════════ */

import crypto from 'node:crypto';

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const token = (req.query.token || req.body?.token || '').trim().toUpperCase();
  const email = (req.query.email || req.body?.email || '').trim().toLowerCase();

  if (!token) {
    return res.status(400).json({ valid: false, reason: 'missing' });
  }

  /* ── Parser le token FA-CODE-MMAA ── */
  const match = token.match(/^FA-([A-Z0-9]+)-(\d{2})(\d{2})$/);
  if (!match) {
    return res.status(200).json({ valid: false, reason: 'format' });
  }

  const baseCode = match[1];       // ex: GOLD ou A3F2B8C1
  const monthStr = match[2];       // ex: 05
  const yearStr  = match[3];       // ex: 26

  const month = parseInt(monthStr, 10);
  const year  = 2000 + parseInt(yearStr, 10);

  if (month < 1 || month > 12) {
    return res.status(200).json({ valid: false, reason: 'format' });
  }

  /* ── Date d'expiration ── */
  const expires    = lastDayOfMonth(year, month);
  const today      = new Date(); today.setHours(0, 0, 0, 0);
  const expireDate = new Date(expires);

  if (expireDate < today) {
    return res.status(200).json({ valid: false, reason: 'expired', expires });
  }

  const mmaa = monthStr + yearStr;

  /* ── Mode 1 : code manuel (PREMIUM_TOKENS) ── */
  const rawTokens = process.env.PREMIUM_TOKENS || '';

  if (!rawTokens.trim()) {
    /* Dev : PREMIUM_TOKENS non configuré → accepter si HMAC valide ou format OK */
    if (email) {
      const isHmac = verifyHmac(email, mmaa, baseCode);
      if (isHmac) {
        return res.status(200).json({ valid: true, expires, daysLeft: daysUntil(expires), mode: 'hmac-dev' });
      }
    }
    /* Dev sans email : accepter tout token bien formé */
    return res.status(200).json({ valid: true, expires, daysLeft: daysUntil(expires), mode: 'dev' });
  }

  const validCodes = rawTokens
    .split(',')
    .map(t => t.trim().toUpperCase())
    .filter(t => t.length > 0);

  if (validCodes.includes(baseCode)) {
    /* Code manuel reconnu ✓ */
    return res.status(200).json({ valid: true, expires, daysLeft: daysUntil(expires), mode: 'manual' });
  }

  /* ── Mode 2 : code HMAC auto-généré ── */
  if (email) {
    const isHmac = verifyHmac(email, mmaa, baseCode);
    if (isHmac) {
      return res.status(200).json({ valid: true, expires, daysLeft: daysUntil(expires), mode: 'hmac' });
    }
    /* Email fourni mais HMAC ne correspond pas */
    return res.status(200).json({ valid: false, reason: 'invalid' });
  }

  /* Code inconnu, pas d'email fourni */
  return res.status(200).json({ valid: false, reason: 'invalid' });
}

/* ── Vérification HMAC (identique à generate-token) ── */
function verifyHmac(email, mmaa, baseCode) {
  try {
    const secret  = process.env.TOKEN_SECRET || 'dev-secret';
    const payload = `${email}:${mmaa}`;
    const hmac    = crypto.createHmac('sha256', secret).update(payload).digest('hex');
    const expected = hmac.slice(0, 8).toUpperCase();
    return expected === baseCode;
  } catch (e) {
    return false;
  }
}

/* Dernier jour du mois au format YYYY-MM-DD */
function lastDayOfMonth(year, month) {
  const d = new Date(year, month, 0);
  return d.toISOString().split('T')[0];
}

/* Nombre de jours restants */
function daysUntil(dateStr) {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  return Math.max(0, Math.ceil((target - today) / 86400000));
}
