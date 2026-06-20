-- Trending capture: stores sports-related Google Trends terms, mapped to the
-- existing entity (school/team/league/event/sport) they should boost, plus
-- unmatched-but-sports-related terms as moment-page candidates.

CREATE TABLE IF NOT EXISTS trending_signals (
  id              uuid primary key default gen_random_uuid(),
  term            text not null,
  normalized_term text not null,
  source          text not null default 'google_trends',
  geo             text,
  traffic         text,
  traffic_value   integer default 0,
  -- Matched entity (null when this is a moment-page candidate).
  matched_type    text,          -- school | team | league | event | sport | null
  matched_slug    text,
  matched_path    text,
  context         text[] default '{}',
  -- Lifecycle: candidate → page exists? Set when a moment page is generated.
  is_candidate    boolean default false,
  captured_at     timestamptz default now()
);

-- One row per term per ~capture window; re-captures update traffic/last seen.
CREATE UNIQUE INDEX IF NOT EXISTS trending_signals_term_day
  ON trending_signals (normalized_term, (captured_at::date));

CREATE INDEX IF NOT EXISTS trending_signals_matched
  ON trending_signals (matched_type, matched_slug);
CREATE INDEX IF NOT EXISTS trending_signals_candidate
  ON trending_signals (is_candidate, traffic_value DESC);
CREATE INDEX IF NOT EXISTS trending_signals_captured
  ON trending_signals (captured_at DESC);

-- Public read so the /trending page and homepage can surface live trends.
ALTER TABLE trending_signals ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS trending_signals_anon_read ON trending_signals;
CREATE POLICY trending_signals_anon_read ON trending_signals
  FOR SELECT USING (true);
