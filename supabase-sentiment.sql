-- ════════════════════════════════════════════════════════════════
--  FOREX AVERAGE — Pilier Sentiment
--  Tables : news_cache (cache RSS partagé) + sentiment_history (backtest)
--  À exécuter dans Supabase → SQL Editor.
--  La page admin-scores.html FONCTIONNE même sans ces tables
--  (les appels échouent silencieusement et retombent sur le live).
--  Ces tables ne font qu'AJOUTER le cache partagé et l'historisation.
-- ════════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────
-- 1. NEWS_CACHE — cache RSS partagé (TTL applicatif 15 min)
--    Déduplication naturelle par lien d'article.
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.news_cache (
    id            BIGSERIAL    PRIMARY KEY,
    source        TEXT         NOT NULL,
    title         TEXT         NOT NULL,
    summary       TEXT,
    link          TEXT         NOT NULL,
    published_at  TIMESTAMPTZ,
    fetched_at    TIMESTAMPTZ  DEFAULT NOW(),
    CONSTRAINT news_cache_unique UNIQUE (link)
);

CREATE INDEX IF NOT EXISTS idx_news_cache_fetched
    ON public.news_cache (fetched_at DESC);

ALTER TABLE public.news_cache ENABLE ROW LEVEL SECURITY;

-- Lecture publique : tous les visiteurs profitent du cache
DROP POLICY IF EXISTS "news_cache_public_read" ON public.news_cache;
CREATE POLICY "news_cache_public_read" ON public.news_cache
    FOR SELECT USING (true);

-- Écriture réservée aux utilisateurs connectés (l'admin lors d'une analyse)
DROP POLICY IF EXISTS "news_cache_auth_insert" ON public.news_cache;
CREATE POLICY "news_cache_auth_insert" ON public.news_cache
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "news_cache_auth_update" ON public.news_cache;
CREATE POLICY "news_cache_auth_update" ON public.news_cache
    FOR UPDATE USING (auth.uid() IS NOT NULL);


-- ─────────────────────────────────────────
-- 2. SENTIMENT_HISTORY — historique des scores (calibrage / backtest)
--    Une ligne déposée à chaque publication d'analyse.
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.sentiment_history (
    id              BIGSERIAL    PRIMARY KEY,
    instrument      TEXT         NOT NULL,
    sentiment_score NUMERIC      NOT NULL,        -- −15 … +15
    article_count   INT          DEFAULT 0,
    confidence      TEXT,                          -- high | med | low | bad
    fallback        BOOLEAN      DEFAULT FALSE,
    bull_signals    INT          DEFAULT 0,
    bear_signals    INT          DEFAULT 0,
    created_at      TIMESTAMPTZ  DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sentiment_history_instr
    ON public.sentiment_history (instrument, created_at DESC);

ALTER TABLE public.sentiment_history ENABLE ROW LEVEL SECURITY;

-- Lecture publique (permet d'afficher un historique de score plus tard)
DROP POLICY IF EXISTS "sentiment_history_public_read" ON public.sentiment_history;
CREATE POLICY "sentiment_history_public_read" ON public.sentiment_history
    FOR SELECT USING (true);

-- Écriture réservée aux connectés
DROP POLICY IF EXISTS "sentiment_history_auth_insert" ON public.sentiment_history;
CREATE POLICY "sentiment_history_auth_insert" ON public.sentiment_history
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);


-- ─────────────────────────────────────────
-- 3. (Optionnel) Purge automatique du cache > 24h
--    À lancer manuellement ou via un cron Supabase (pg_cron).
-- ─────────────────────────────────────────
-- DELETE FROM public.news_cache WHERE fetched_at < NOW() - INTERVAL '24 hours';

-- ════════════════════════════════════════════════════════════════
--  ✅ Terminé. Tables : news_cache, sentiment_history.
-- ════════════════════════════════════════════════════════════════
