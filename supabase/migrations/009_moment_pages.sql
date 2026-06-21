-- Moment pages: trend-driven gear pages generated from sports-related Google
-- Trends terms that don't map to an existing entity (e.g. "tunisia vs japan",
-- a viral player, a one-off matchup). Products are sourced live from eBay at
-- render time; this table only stores the page metadata. Quality-gated at
-- generation (only created when enough real products exist) and expiring so
-- stale thin pages don't accumulate.

CREATE TABLE IF NOT EXISTS moment_pages (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,
  term          text not null,          -- original trending term
  title         text not null,
  description   text not null,
  gear_query    text not null,          -- cleaned query used for eBay search
  sport_slug    text,                   -- best-guess sport, if any
  context       text[] default '{}',    -- related news headlines from the feed
  traffic       text,
  product_count integer default 0,      -- last verified live product count
  indexable     boolean default true,   -- set by the quality gate at generation
  is_active     boolean default true,
  expires_at    timestamptz,            -- after this, route noindexes + sitemap drops
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

CREATE INDEX IF NOT EXISTS moment_pages_active
  ON moment_pages (is_active, indexable, expires_at);
CREATE INDEX IF NOT EXISTS moment_pages_created
  ON moment_pages (created_at DESC);

-- Public (anon) read so the ISR-rendered /trending/[slug] pages resolve.
ALTER TABLE moment_pages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS moment_pages_anon_read ON moment_pages;
CREATE POLICY moment_pages_anon_read ON moment_pages
  FOR SELECT USING (true);
