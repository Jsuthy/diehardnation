// Sports data ingestion — run once, then periodically (overnight) via n8n.
// Respects TheSportsDB free-tier rate limits (~25 req/min). Expect a long run.
//
//   npx tsx src/scripts/ingest-sports-data.ts          (full run)
//   npx tsx src/scripts/ingest-sports-data.ts --seed   (events + core sports only, fast)
//
// Loads .env.local so SUPABASE_* and THESPORTSDB_API_KEY are available.

import * as fs from 'fs'
import * as path from 'path'

const envPath = path.resolve(process.cwd(), '.env.local')
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf-8').split('\n')) {
    const [key, ...rest] = line.split('=')
    if (key && rest.length) process.env[key.trim()] = rest.join('=').trim()
  }
}

import { seedCoreSportsAndEvents, runFullIngestion } from '@/lib/sports/ingest'

async function main() {
  const seedOnly = process.argv.includes('--seed')

  if (seedOnly) {
    console.log('[ingest] Seeding core sports + events (fast, no API)...')
    const { sports, events } = await seedCoreSportsAndEvents()
    console.log(`[ingest] Done. sports=${sports} events=${events}`)
    return
  }

  console.log('[ingest] Starting full ingestion (this takes a while — rate limited)...')
  const result = await runFullIngestion()
  console.log('[ingest] Complete:', JSON.stringify(result, null, 2))
}

main().then(() => process.exit(0)).catch(err => {
  console.error('[ingest] Fatal:', err)
  process.exit(1)
})
