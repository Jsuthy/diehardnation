import { SCHOOLS } from '@/lib/constants/schools'
import { CONFERENCES } from '@/lib/constants/conferences'
import { PRO_LEAGUE_LIST, PRO_TEAM_LIST } from '@/lib/sports/pro-data'
import { SEED_EVENTS, CORE_SPORTS } from '@/lib/sports/events-seed'

// A comprehensive, link-rich plain-text index for LLMs / answer engines
// (the emerging llms.txt convention). Built from static catalogs so it always
// resolves fast without a DB hit. Linked from /llms.txt.
export const dynamic = 'force-static'
export const revalidate = 86400

const SITE = 'https://diehardnation.com'

export async function GET() {
  const lines: string[] = []
  const p = (s = '') => lines.push(s)

  p('# DieHardNation — Full Index')
  p()
  p('DieHardNation is an independent fan-gear aggregator and sports hub. We')
  p('compare officially licensable jerseys, hoodies, hats and apparel from eBay')
  p('and Amazon across college and pro teams, leagues and major events, and add')
  p('buying guides, price ranges and authenticity guidance. Not affiliated with')
  p('any team, league, the NCAA, or a manufacturer. Listings update daily.')
  p()
  p('## Page types')
  p('- /[school] — college team fan-gear hub (e.g. /georgia, /texas-am)')
  p('- /[school]/gear/[sport] — sport-specific college gear')
  p('- /team/[team] — pro team fan-gear hub (NFL, NBA, MLB, NHL)')
  p('- /league/[league] — league-level gear hub')
  p('- /events/[event] — event/"moment" gear pages for major sporting events')
  p('- /sport/[sport] — sport-level hub')
  p('- /news, /trending — latest and most-popular gear')
  p()

  p('## Sports')
  for (const s of CORE_SPORTS) p(`- ${s.name}: ${SITE}/sport/${s.slug}`)
  p()

  p('## College teams (FBS schools)')
  for (const conf of CONFERENCES) {
    const schools = SCHOOLS.filter(s => s.conference === conf.slug).sort((a, b) => a.fan_size_rank - b.fan_size_rank)
    if (!schools.length) continue
    p(`### ${conf.fullName}`)
    for (const s of schools) {
      p(`- ${s.name} (${s.mascot}, ${s.city}, ${s.state}): ${SITE}/${s.slug}`)
    }
    p()
  }

  p('## Pro leagues')
  for (const l of PRO_LEAGUE_LIST) p(`- ${l.name}: ${SITE}/league/${l.slug}`)
  p()

  p('## Pro teams')
  for (const l of PRO_LEAGUE_LIST) {
    const teams = PRO_TEAM_LIST.filter(t => t.league_slug === l.slug)
    if (!teams.length) continue
    p(`### ${l.name}`)
    for (const t of teams) p(`- ${t.name} (${t.city}): ${SITE}/team/${t.slug}`)
    p()
  }

  p('## Major events')
  for (const e of [...SEED_EVENTS].sort((a, b) => a.start_date.localeCompare(b.start_date))) {
    p(`- ${e.name} (${e.start_date}): ${SITE}/events/${e.slug}`)
  }
  p()

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  })
}
