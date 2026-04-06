import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'
import { DEFAULT_RSS_FEEDS } from '../lib/content/rss-feeds.js'

// Load .env.local
const envPath = path.resolve(process.cwd(), '.env.local')
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, 'utf-8').split('\n')
  for (const line of lines) {
    const [key, ...rest] = line.split('=')
    if (key && rest.length) {
      process.env[key.trim()] = rest.join('=').trim()
    }
  }
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

function detectSportFromUrl(url: string): string | null {
  if (url.includes('path=football') || url.includes('/football/')) return 'football'
  if (url.includes('path=mbball') || url.includes('/basketball/')) return 'basketball'
  if (url.includes('path=volleyball') || url.includes('/volleyball/')) return 'volleyball'
  if (url.includes('path=wrestling') || url.includes('/wrestling/')) return 'wrestling'
  if (url.includes('path=baseball') || url.includes('/baseball/')) return 'baseball'
  return null
}

async function seedRssSources() {
  const schools = Object.keys(DEFAULT_RSS_FEEDS)
  console.log(`Seeding RSS sources for ${schools.length} schools...`)

  let total = 0
  for (const schoolSlug of schools) {
    const urls = DEFAULT_RSS_FEEDS[schoolSlug]
    for (const url of urls) {
      const sport = detectSportFromUrl(url)
      const { error } = await supabase
        .from('rss_sources')
        .upsert(
          {
            school_slug: schoolSlug,
            url,
            sport,
            is_active: true,
          },
          { onConflict: 'school_slug,url' }
        )

      if (error) {
        // If unique constraint doesn't exist on (school_slug, url), just insert
        if (error.code === '42P10' || error.message.includes('constraint')) {
          await supabase.from('rss_sources').insert({
            school_slug: schoolSlug,
            url,
            sport,
            is_active: true,
          })
        } else {
          console.error(`  Error for ${schoolSlug}/${url}:`, error.message)
        }
      }
      total++
    }
    console.log(`  ${schoolSlug}: ${urls.length} feeds`)
  }

  console.log(`\nDone! ${total} RSS sources seeded across ${schools.length} schools.`)

  // Verify
  const { count } = await supabase
    .from('rss_sources')
    .select('*', { count: 'exact', head: true })
  console.log(`Total RSS sources in DB: ${count}`)
}

seedRssSources().catch(console.error)
