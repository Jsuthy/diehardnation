-- 007 — Global sports expansion
-- Sports / leagues / teams / events / articles / affiliate_config / subscribers
-- College routes are untouched; these are all additive.

-- Sports taxonomy
CREATE TABLE IF NOT EXISTS sports (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,
  name          text not null,
  tsdb_name     text,
  category      text not null default 'team_sport',
  region        text not null default 'global',
  is_active     boolean default true,
  fan_size_rank integer default 99,
  created_at    timestamptz default now()
);

-- Leagues
CREATE TABLE IF NOT EXISTS leagues (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,
  name          text not null,
  short_name    text,
  sport_slug    text references sports(slug),
  country       text,
  region        text default 'global',
  tsdb_id       text,
  is_active     boolean default true,
  fan_size_rank integer default 99,
  created_at    timestamptz default now()
);

-- Teams (professional, global)
CREATE TABLE IF NOT EXISTS teams (
  id              uuid primary key default gen_random_uuid(),
  slug            text unique not null,
  name            text not null,
  short_name      text,
  nickname        text,
  city            text,
  country         text default 'US',
  league_slug     text references leagues(slug),
  sport_slug      text references sports(slug),
  primary_color   text default '#000000',
  secondary_color text default '#FFFFFF',
  tsdb_id         text,
  is_active       boolean default true,
  fan_size_rank   integer default 99,
  created_at      timestamptz default now()
);

-- Events (surge capture pages)
CREATE TABLE IF NOT EXISTS events (
  id                 uuid primary key default gen_random_uuid(),
  slug               text unique not null,
  name               text not null,
  sport_slug         text references sports(slug),
  league_slug        text references leagues(slug),
  event_type         text not null,
  start_date         date,
  end_date           date,
  year               integer,
  description        text,
  search_surge_rank  integer default 99,
  is_active          boolean default true,
  is_recurring       boolean default true,
  created_at         timestamptz default now()
);

-- Articles (Jeff's daily editorial)
CREATE TABLE IF NOT EXISTS articles (
  id               uuid primary key default gen_random_uuid(),
  slug             text unique not null,
  title            text not null,
  content          text not null,
  excerpt          text not null,
  author           text default 'DieHardNation',
  sport_slug       text references sports(slug),
  league_slug      text references leagues(slug),
  team_slugs       text[] default '{}',
  school_slugs     text[] default '{}',
  event_slug       text references events(slug),
  tags             text[] default '{}',
  meta_title       text,
  meta_description text,
  is_published     boolean default false,
  published_at     timestamptz,
  created_at       timestamptz default now(),
  updated_at       timestamptz default now()
);

-- Affiliate config (monetization waterfall)
CREATE TABLE IF NOT EXISTS affiliate_config (
  id              uuid primary key default gen_random_uuid(),
  provider        text unique not null,
  is_active       boolean default true,
  priority        integer not null,
  tag             text,
  base_url        text not null,
  commission_rate numeric(5,2),
  notes           text,
  updated_at      timestamptz default now()
);

INSERT INTO affiliate_config
  (provider, is_active, priority, tag, base_url, commission_rate, notes)
VALUES
  ('amazon',   false, 1, 'nebrasketball-20',
   'https://www.amazon.com/s', 6.00,
   'Pending PA API approval — flip is_active to true when ready'),
  ('fanatics',  false, 2, '',
   'https://www.fanatics.com/search', 8.00,
   'Apply via Awin/CJ — flip is_active to true when approved'),
  ('dicks',     false, 3, '',
   'https://www.dickssportinggoods.com/search#query=', 5.00,
   'Apply via CJ — flip is_active to true when approved'),
  ('academy',   false, 4, '',
   'https://www.academy.com/search?q=', 5.00,
   'Apply via CJ — flip is_active to true when approved'),
  ('ebay',      true,  5,
   'JEFFREYS-Nebraske-PRD-94c5ab990-4d29e217',
   'https://www.ebay.com/sch/i.html', 4.00,
   'Live and working')
ON CONFLICT (provider) DO NOTHING;

-- Email subscribers
CREATE TABLE IF NOT EXISTS subscribers (
  id          uuid primary key default gen_random_uuid(),
  email       text unique not null,
  first_name  text,
  sport_slug  text,
  school_slug text,
  source      text default 'website',
  created_at  timestamptz default now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_leagues_sport ON leagues(sport_slug);
CREATE INDEX IF NOT EXISTS idx_teams_league ON teams(league_slug);
CREATE INDEX IF NOT EXISTS idx_teams_sport ON teams(sport_slug);
CREATE INDEX IF NOT EXISTS idx_teams_country ON teams(country);
CREATE INDEX IF NOT EXISTS idx_events_sport ON events(sport_slug);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(start_date);
CREATE INDEX IF NOT EXISTS idx_articles_published ON articles(published_at desc);
CREATE INDEX IF NOT EXISTS idx_articles_sport ON articles(sport_slug);
CREATE INDEX IF NOT EXISTS idx_articles_tags ON articles USING gin(tags);
CREATE INDEX IF NOT EXISTS idx_articles_team_slugs ON articles USING gin(team_slugs);

-- RLS
ALTER TABLE sports ENABLE ROW LEVEL SECURITY;
ALTER TABLE leagues ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_sports" ON sports;
DROP POLICY IF EXISTS "public_read_leagues" ON leagues;
DROP POLICY IF EXISTS "public_read_teams" ON teams;
DROP POLICY IF EXISTS "public_read_events" ON events;
DROP POLICY IF EXISTS "public_read_articles" ON articles;
DROP POLICY IF EXISTS "public_read_affiliate" ON affiliate_config;
DROP POLICY IF EXISTS "anon_insert_subscribers" ON subscribers;

CREATE POLICY "public_read_sports" ON sports
  FOR SELECT TO anon USING (true);
CREATE POLICY "public_read_leagues" ON leagues
  FOR SELECT TO anon USING (true);
CREATE POLICY "public_read_teams" ON teams
  FOR SELECT TO anon USING (true);
CREATE POLICY "public_read_events" ON events
  FOR SELECT TO anon USING (true);
CREATE POLICY "public_read_articles" ON articles
  FOR SELECT TO anon USING (is_published = true);
CREATE POLICY "public_read_affiliate" ON affiliate_config
  FOR SELECT TO anon USING (is_active = true);
CREATE POLICY "anon_insert_subscribers" ON subscribers
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "service_all_sports" ON sports
  FOR ALL TO service_role USING (true);
CREATE POLICY "service_all_leagues" ON leagues
  FOR ALL TO service_role USING (true);
CREATE POLICY "service_all_teams" ON teams
  FOR ALL TO service_role USING (true);
CREATE POLICY "service_all_events" ON events
  FOR ALL TO service_role USING (true);
CREATE POLICY "service_all_articles" ON articles
  FOR ALL TO service_role USING (true);
CREATE POLICY "service_all_affiliate" ON affiliate_config
  FOR ALL TO service_role USING (true);
CREATE POLICY "service_all_subscribers" ON subscribers
  FOR ALL TO service_role USING (true);
