-- Allow anon to read RSS sources
CREATE POLICY "public_read_rss" ON rss_sources FOR SELECT TO anon USING (is_active = true);
