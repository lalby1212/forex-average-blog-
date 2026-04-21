-- ═══════════════════════════════════════════════════════════════════
--  FOREX AVERAGE — Script SQL complet
--  Copiez-collez dans : Supabase → SQL Editor → New query → Run
--  ORDRE IMPORTANT : exécutez le script dans l'ordre ci-dessous
-- ═══════════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────
-- 1. TABLE PROFILES
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
    id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username      TEXT UNIQUE NOT NULL,
    email         TEXT,
    bio           TEXT,
    avatar_url    TEXT,
    total_trades  INT         DEFAULT 0,
    win_rate      INT         DEFAULT 0,
    total_r       NUMERIC     DEFAULT 0,
    created_at    TIMESTAMPTZ DEFAULT NOW(),
    updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- 2. TABLE SUBSCRIPTIONS (plan / VIP)
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id       UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    plan          TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free','vip')),
    status        TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','cancelled','expired')),
    period        TEXT CHECK (period IN ('monthly','quarterly','yearly')),
    stripe_id     TEXT,                  -- Stripe subscription ID (futur)
    amount        NUMERIC,               -- Montant payé
    currency      TEXT DEFAULT 'USD',
    started_at    TIMESTAMPTZ DEFAULT NOW(),
    expires_at    TIMESTAMPTZ,           -- NULL = illimité (admin)
    created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- 3. TABLE TRADES (track record public)
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.trades (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id       UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    symbol        TEXT NOT NULL,
    direction     TEXT NOT NULL CHECK (direction IN ('BUY','SELL')),
    entry_price   NUMERIC,
    exit_price    NUMERIC,
    result        NUMERIC NOT NULL,      -- en R
    trade_date    DATE NOT NULL,
    note          TEXT,
    created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- 4. TABLE JOURNAL_ENTRIES (journal privé)
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.journal_entries (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id       UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,

    -- Identification
    symbol        TEXT NOT NULL,
    direction     TEXT NOT NULL CHECK (direction IN ('BUY','SELL')),
    timeframe     TEXT,                  -- M1, M5, M15, M30, H1, H4, D1, W1
    setup_tag     TEXT,                  -- Breakout, Retest, Fibonacci, Divergence…

    -- Gestion du risque
    entry_price   NUMERIC,
    stop_loss     NUMERIC,
    take_profit   NUMERIC,
    risk_percent  NUMERIC,               -- % du capital risqué
    result_r      NUMERIC NOT NULL,      -- Résultat en R

    -- Dates
    entry_date    DATE NOT NULL,
    exit_date     DATE,

    -- Analyse
    pre_note      TEXT,                  -- Analyse avant le trade
    post_note     TEXT,                  -- Review après fermeture

    -- Psychologie
    emotion       TEXT,                  -- Calme, Confiant, Stressé, FOMO, Impatient
    followed_plan BOOLEAN,              -- A-t-il respecté son plan ?
    rating        INT CHECK (rating BETWEEN 1 AND 5),  -- Note 1-5 étoiles

    created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- 5. INDEX
-- ─────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_trades_user_id       ON public.trades(user_id);
CREATE INDEX IF NOT EXISTS idx_trades_date          ON public.trades(trade_date DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_username    ON public.profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_rank        ON public.profiles(win_rate DESC, total_r DESC);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user   ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON public.subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_journal_user_id      ON public.journal_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_journal_date         ON public.journal_entries(entry_date DESC);
CREATE INDEX IF NOT EXISTS idx_journal_setup        ON public.journal_entries(setup_tag);

-- ─────────────────────────────────────────
-- 6. ROW LEVEL SECURITY (RLS)
-- ─────────────────────────────────────────
ALTER TABLE public.profiles       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trades         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;

-- PROFILES : lecture publique, écriture par le propriétaire
CREATE POLICY "profiles_select_all"    ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles_insert_self"   ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_self"   ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_delete_self"   ON public.profiles FOR DELETE USING (auth.uid() = id);

-- SUBSCRIPTIONS : lecture uniquement par le propriétaire
-- ⚠️  INSERT / UPDATE / DELETE : PAS de policy client → seul le service role (webhook Stripe) peut écrire
-- Les clients ne peuvent JAMAIS s'attribuer eux-mêmes un plan VIP.
-- Toute modification passe par : Supabase Edge Function + clé service_role (non exposée côté client).
CREATE POLICY "subs_select_self" ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);

-- TRADES : lecture publique, écriture par le propriétaire
CREATE POLICY "trades_select_all"   ON public.trades FOR SELECT USING (true);
CREATE POLICY "trades_insert_self"  ON public.trades FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "trades_update_self"  ON public.trades FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "trades_delete_self"  ON public.trades FOR DELETE USING (auth.uid() = user_id);

-- JOURNAL : privé — lecture et écriture uniquement par le propriétaire
CREATE POLICY "journal_select_self" ON public.journal_entries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "journal_insert_self" ON public.journal_entries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "journal_update_self" ON public.journal_entries FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "journal_delete_self" ON public.journal_entries FOR DELETE USING (auth.uid() = user_id);

-- ─────────────────────────────────────────
-- 7. TRIGGER — Création de profil automatique
-- ─────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
    INSERT INTO public.profiles (id, username, email)
    VALUES (
        NEW.id,
        COALESCE(
            NEW.raw_user_meta_data->>'username',
            split_part(NEW.email, '@', 1)
        ),
        NEW.email
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ─────────────────────────────────────────
-- 8. TRIGGER — Mise à jour updated_at
-- ─────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ─────────────────────────────────────────
-- 9. ACTIVER UN UTILISATEUR VIP (manuellement)
-- Exécutez cette requête pour activer un VIP :
-- ─────────────────────────────────────────
-- INSERT INTO public.subscriptions (user_id, plan, status, period, expires_at)
-- VALUES (
--     'UUID_DU_USER_ICI',      -- Trouvable dans Supabase → Authentication → Users
--     'vip',
--     'active',
--     'monthly',
--     NOW() + INTERVAL '30 days'
-- );

-- ─────────────────────────────────────────
-- 10. TABLE TRANSLATIONS (cache traductions)
--   Cache serveur des titres traduits EN→FR
--   évite de rappeler l'API à chaque visite.
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.translations (
    id             BIGSERIAL    PRIMARY KEY,
    source_text    TEXT         NOT NULL,
    translated_text TEXT        NOT NULL,
    source_lang    TEXT         NOT NULL DEFAULT 'en',
    target_lang    TEXT         NOT NULL DEFAULT 'fr',
    created_at     TIMESTAMPTZ  DEFAULT NOW(),
    CONSTRAINT translations_unique UNIQUE (source_text, source_lang, target_lang)
);

-- Index pour lookup rapide
CREATE INDEX IF NOT EXISTS idx_translations_lookup
    ON public.translations (source_text, source_lang, target_lang);

-- RLS : lecture publique (tous les visiteurs profitent du cache)
ALTER TABLE public.translations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "translations_public_read" ON public.translations
    FOR SELECT USING (true);

-- ⚠️  INSERT : authentification requise + limites de longueur (évite le spam anonyme)
CREATE POLICY "translations_public_insert" ON public.translations
    FOR INSERT WITH CHECK (
        auth.uid() IS NOT NULL AND
        length(source_text)     < 1000 AND
        length(translated_text) < 1000
    );

-- ─────────────────────────────────────────
-- 11. ACTIVER UN UTILISATEUR VIP (manuellement)
-- ─────────────────────────────────────────

-- ═══════════════════════════════════════════════════════════════════
--  ✅ SCRIPT TERMINÉ — Base de données Forex Average configurée !
--
--  Tables créées :
--  → profiles         (profils publics, stats track record)
--  → subscriptions    (plans free/vip, dates d'expiration)
--  → trades           (track record public)
--  → journal_entries  (journal privé, 13 champs d'analyse)
--  → translations     (cache traductions EN→FR, actualités)
-- ═══════════════════════════════════════════════════════════════════
