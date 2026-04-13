import * as fs from 'fs'
import * as path from 'path'

// Load .env.local manually
const envPath = path.resolve(process.cwd(), '.env.local')
const envContent = fs.readFileSync(envPath, 'utf-8')
for (const line of envContent.split('\n')) {
  const trimmed = line.trim()
  if (!trimmed || trimmed.startsWith('#')) continue
  const eqIndex = trimmed.indexOf('=')
  if (eqIndex === -1) continue
  const key = trimmed.slice(0, eqIndex)
  const value = trimmed.slice(eqIndex + 1)
  if (!process.env[key]) process.env[key] = value
}

import { createClient } from '@supabase/supabase-js'
import { SCHOOLS } from '../lib/constants/schools'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey)

async function syncColors() {
  let updated = 0
  let failed = 0
  const errors: string[] = []

  for (const school of SCHOOLS) {
    const { error } = await supabase
      .from('schools')
      .update({
        primary_color: school.primary_color,
        secondary_color: school.secondary_color,
      })
      .eq('slug', school.slug)

    if (error) {
      failed++
      errors.push(`${school.slug}: ${error.message}`)
    } else {
      updated++
    }
  }

  console.log(`\nSync complete:`)
  console.log(`  Updated: ${updated}`)
  console.log(`  Failed:  ${failed}`)
  console.log(`  Total:   ${SCHOOLS.length}`)

  if (errors.length > 0) {
    console.log('\nErrors:')
    errors.forEach(e => console.log(`  - ${e}`))
  }
}

syncColors().catch(console.error)
