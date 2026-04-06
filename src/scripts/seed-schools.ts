import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

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

// Inline the schools data to avoid path alias issues with tsx
import { SCHOOLS } from '../lib/constants/schools.js'

async function seedSchools() {
  console.log(`Seeding ${SCHOOLS.length} schools...`)

  const rows = SCHOOLS.map(s => ({
    slug: s.slug,
    name: s.name,
    short_name: s.short_name,
    mascot: s.mascot,
    nickname: s.nickname,
    city: s.city,
    state: s.state,
    conference: s.conference,
    primary_color: s.primary_color,
    secondary_color: s.secondary_color,
    fan_size_rank: s.fan_size_rank,
    is_active: s.slug === 'nebraska',
    is_live: s.slug === 'nebraska',
  }))

  const batchSize = 50
  let total = 0
  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize)
    const { error, data } = await supabase
      .from('schools')
      .upsert(batch, { onConflict: 'slug' })
      .select()

    if (error) {
      console.error(`Batch ${i} error:`, error.message)
    } else {
      total += data?.length || 0
      console.log(`  Batch ${Math.floor(i / batchSize) + 1}: ${data?.length || 0} schools upserted`)
    }
  }

  console.log(`\nDone! ${total} schools seeded.`)

  const { count } = await supabase
    .from('schools')
    .select('*', { count: 'exact', head: true })
  console.log(`Total schools in DB: ${count}`)

  const { data: active } = await supabase
    .from('schools')
    .select('slug')
    .eq('is_active', true)
  console.log(`Active schools: ${active?.map(s => s.slug).join(', ')}`)
}

seedSchools().catch(console.error)
