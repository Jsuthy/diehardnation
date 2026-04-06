-- ================================================================
-- DieHardNation: Multi-school schema migration
-- Drops old single-school tables and recreates for 130 FBS schools
-- ================================================================

-- Drop old triggers first
DROP TRIGGER IF EXISTS products_price_range ON products;

-- Drop old policies
DO $$ BEGIN
  EXECUTE (
    SELECT string_agg('DROP POLICY IF EXISTS "' || polname || '" ON "' || relname || '";', E'\n')
    FROM pg_policy p JOIN pg_class c ON p.polrelid = c.oid
    WHERE relname IN ('products','click_events','subscribers','news_posts','programmatic_pages','rss_sources')
  );
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- Drop old tables (cascade to remove FK references)
DROP TABLE IF EXISTS click_events CASCADE;
DROP TABLE IF EXISTS subscribers CASCADE;
DROP TABLE IF EXISTS rss_sources CASCADE;
DROP TABLE IF EXISTS programmatic_pages CASCADE;
DROP TABLE IF EXISTS news_posts CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS school_search_terms CASCADE;
DROP TABLE IF EXISTS schools CASCADE;

-- Drop old functions
DROP FUNCTION IF EXISTS update_price_range() CASCADE;
DROP FUNCTION IF EXISTS increment_click_count(uuid) CASCADE;

-- ================================================================
-- NEW SCHEMA
-- ================================================================

-- Schools table
CREATE TABLE schools (
  id              uuid primary key default gen_random_uuid(),
  slug            text unique not null,
  name            text not null,
  short_name      text not null,
  mascot          text not null,
  nickname        text not null,
  city            text not null,
  state           text not null,
  conference      text not null,
  primary_color   text not null default '#CC0000',
  secondary_color text not null default '#FFFFFF',
  fan_size_rank   integer default 99,
  is_active       boolean default false,
  is_live         boolean default false,
  created_at      timestamptz default now()
);

-- Products table
CREATE TABLE products (
  id             uuid primary key default gen_random_uuid(),
  school_slug    text not null references schools(slug) on delete cascade,
  external_id    text not null,
  source         text not null default 'ebay',
  title          text not null,
  description    text default '',
  price          numeric(10,2) not null default 0,
  original_price numeric(10,2),
  image_url      text,
  affiliate_url  text not null,
  slug           text not null,
  category       text not null default 'tees',
  sport          text not null default 'general',
  brand          text,
  price_range    text not null default 'under-25',
  is_featured    boolean default false,
  is_active      boolean default true,
  click_count    integer default 0,
  created_at     timestamptz default now(),
  updated_at     timestamptz default now(),
  UNIQUE(school_slug, external_id, source)
);

-- Programmatic pages table
CREATE TABLE programmatic_pages (
  id            uuid primary key default gen_random_uuid(),
  school_slug   text not null references schools(slug) on delete cascade,
  slug          text not null,
  page_type     text not null,
  sport         text,
  category      text,
  price_range   text,
  brand         text,
  title         text not null,
  description   text not null,
  product_count integer default 0,
  is_active     boolean default true,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now(),
  UNIQUE(school_slug, slug)
);

-- News posts table
CREATE TABLE news_posts (
  id           uuid primary key default gen_random_uuid(),
  school_slug  text not null references schools(slug) on delete cascade,
  slug         text not null,
  title        text not null,
  content      text not null,
  excerpt      text not null default '',
  is_published boolean default true,
  published_at timestamptz default now(),
  created_at   timestamptz default now(),
  UNIQUE(school_slug, slug)
);

-- RSS sources table
CREATE TABLE rss_sources (
  id          uuid primary key default gen_random_uuid(),
  school_slug text not null references schools(slug) on delete cascade,
  url         text not null,
  sport       text,
  is_active   boolean default true,
  created_at  timestamptz default now()
);

-- Click events table
CREATE TABLE click_events (
  id          uuid primary key default gen_random_uuid(),
  product_id  uuid references products(id) on delete cascade,
  school_slug text,
  source      text,
  referrer    text,
  user_agent  text,
  created_at  timestamptz default now()
);

-- Email subscribers table
CREATE TABLE subscribers (
  id          uuid primary key default gen_random_uuid(),
  email       text unique not null,
  school_slug text,
  created_at  timestamptz default now()
);

-- School search terms table
CREATE TABLE school_search_terms (
  id          uuid primary key default gen_random_uuid(),
  school_slug text not null references schools(slug) on delete cascade,
  term        text not null,
  sport       text default 'general',
  is_active   boolean default true,
  created_at  timestamptz default now(),
  UNIQUE(school_slug, term)
);

-- ================================================================
-- INDEXES
-- ================================================================
CREATE INDEX idx_products_school       ON products(school_slug);
CREATE INDEX idx_products_school_sport ON products(school_slug, sport);
CREATE INDEX idx_products_school_cat   ON products(school_slug, category);
CREATE INDEX idx_products_featured     ON products(school_slug, is_featured);
CREATE INDEX idx_products_active       ON products(is_active);
CREATE INDEX idx_products_clicks       ON products(click_count desc);
CREATE INDEX idx_prog_pages_school     ON programmatic_pages(school_slug);
CREATE INDEX idx_prog_pages_slug       ON programmatic_pages(slug);
CREATE INDEX idx_news_school           ON news_posts(school_slug);
CREATE INDEX idx_news_published        ON news_posts(published_at desc);
CREATE INDEX idx_click_events_product  ON click_events(product_id);
CREATE INDEX idx_search_terms_school   ON school_search_terms(school_slug);

-- ================================================================
-- FUNCTIONS & TRIGGERS
-- ================================================================
CREATE OR REPLACE FUNCTION update_price_range()
RETURNS TRIGGER AS $$
BEGIN
  NEW.price_range := CASE
    WHEN NEW.price < 25  THEN 'under-25'
    WHEN NEW.price < 50  THEN '25-to-50'
    WHEN NEW.price < 100 THEN '50-to-100'
    ELSE 'over-100'
  END;
  NEW.updated_at := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER products_price_range
  BEFORE INSERT OR UPDATE OF price ON products
  FOR EACH ROW EXECUTE FUNCTION update_price_range();

CREATE OR REPLACE FUNCTION increment_click_count(product_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE products SET click_count = click_count + 1 WHERE id = product_id;
END;
$$ LANGUAGE plpgsql;

-- ================================================================
-- ROW LEVEL SECURITY
-- ================================================================
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE programmatic_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE click_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE rss_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_search_terms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_schools" ON schools FOR SELECT TO anon USING (true);
CREATE POLICY "public_read_products" ON products FOR SELECT TO anon USING (is_active = true);
CREATE POLICY "public_read_pages" ON programmatic_pages FOR SELECT TO anon USING (is_active = true);
CREATE POLICY "public_read_news" ON news_posts FOR SELECT TO anon USING (is_published = true);
CREATE POLICY "service_all" ON schools FOR ALL TO service_role USING (true);
CREATE POLICY "service_all_products" ON products FOR ALL TO service_role USING (true);
CREATE POLICY "service_all_pages" ON programmatic_pages FOR ALL TO service_role USING (true);
CREATE POLICY "service_all_news" ON news_posts FOR ALL TO service_role USING (true);
CREATE POLICY "service_all_clicks" ON click_events FOR ALL TO service_role USING (true);
CREATE POLICY "service_all_subs" ON subscribers FOR ALL TO service_role USING (true);
CREATE POLICY "service_all_rss" ON rss_sources FOR ALL TO service_role USING (true);
CREATE POLICY "service_all_search_terms" ON school_search_terms FOR ALL TO service_role USING (true);
CREATE POLICY "anon_insert_clicks" ON click_events FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon_insert_subs" ON subscribers FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon_read_search_terms" ON school_search_terms FOR SELECT TO anon USING (true);
