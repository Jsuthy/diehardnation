import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'
import { getSchoolFilter } from '../lib/ingestion/school-filters.js'
import type { School } from '../lib/supabase/types.js'

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

function isSchoolProduct(title: string, school: School): boolean {
  const t = title.toLowerCase()
  const filter = getSchoolFilter(school)

  for (const excluded of filter.excluded) {
    if (t.includes(excluded.toLowerCase())) return false
  }

  for (const required of filter.required) {
    if (t.includes(required.toLowerCase())) return true
  }

  return false
}

async function cleanProducts() {
  console.log('Cleaning cross-contaminated products...\n')

  const { data: schools } = await supabase
    .from('schools')
    .select('*')
    .eq('is_active', true)
    .order('fan_size_rank', { ascending: true })

  if (!schools || schools.length === 0) {
    console.log('No active schools found.')
    return
  }

  let totalDeleted = 0

  for (const school of schools) {
    const { data: products } = await supabase
      .from('products')
      .select('id, title')
      .eq('school_slug', school.slug)
      .eq('is_active', true)

    if (!products || products.length === 0) {
      console.log(`${school.slug}: 0 products (skip)`)
      continue
    }

    const toDelete: string[] = []
    for (const p of products) {
      if (!isSchoolProduct(p.title, school as School)) {
        toDelete.push(p.id)
      }
    }

    if (toDelete.length > 0) {
      // Deactivate rather than delete — safer
      const { error } = await supabase
        .from('products')
        .update({ is_active: false })
        .in('id', toDelete)

      if (error) {
        console.error(`  ${school.slug}: ERROR deactivating: ${error.message}`)
      } else {
        console.log(`${school.slug}: deactivated ${toDelete.length} of ${products.length} (${products.length - toDelete.length} remain)`)
        // Log some examples of what was removed
        const removed = products.filter(p => toDelete.includes(p.id))
        for (const r of removed.slice(0, 3)) {
          console.log(`    removed: "${r.title}"`)
        }
        if (removed.length > 3) {
          console.log(`    ... and ${removed.length - 3} more`)
        }
      }
    } else {
      console.log(`${school.slug}: all ${products.length} products clean`)
    }

    totalDeleted += toDelete.length
  }

  console.log(`\nTotal deactivated: ${totalDeleted}`)
}

cleanProducts().catch(console.error)
