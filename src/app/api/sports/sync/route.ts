import { NextResponse } from 'next/server'
import { runFullIngestion, seedCoreSportsAndEvents } from '@/lib/sports/ingest'

// Long-running incremental sync. Triggered weekly by n8n (see N8N_WORKFLOWS.md).
// Auth: Bearer INGEST_SECRET.
export const maxDuration = 60
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '')
  if (token !== process.env.INGEST_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  // ?seed=1 runs only the fast core-sports + events seed (no rate-limited API calls).
  if (searchParams.get('seed') === '1') {
    const { sports, events } = await seedCoreSportsAndEvents()
    return NextResponse.json({ sports, events, leagues: 0, teams: 0, duration_ms: 0 })
  }

  // NOTE: A full ingestion takes much longer than the 60s function limit.
  // In production this should run on the Mac Mini via the CLI script; the
  // route exists so n8n can trigger a seed refresh or be pointed at a worker.
  const result = await runFullIngestion()
  return NextResponse.json(result)
}
