import { slugify } from './utils'

// World Cup 2026 content cluster data. National teams are the core commercial
// inventory of a World Cup ("argentina jersey", "usa soccer jersey" etc.). These
// feed /team/[slug] gear pages (via pro-data) and the /events/world-cup-2026 hub,
// which cross-links to every nation + featured player to flow equity site-wide.

export interface WCNation {
  country: string
  primary: string
  secondary: string
  confederation: string
}

// Major footballing nations whose jerseys have real search/sales demand. Framed
// as national-team gear (not a qualification claim) so it stays evergreen.
export const WC_NATIONS: WCNation[] = [
  // Hosts
  { country: 'United States', primary: '#002868', secondary: '#BF0A30', confederation: 'CONCACAF' },
  { country: 'Mexico', primary: '#006847', secondary: '#CE1126', confederation: 'CONCACAF' },
  { country: 'Canada', primary: '#D52B1E', secondary: '#FFFFFF', confederation: 'CONCACAF' },
  // South America
  { country: 'Argentina', primary: '#75AADB', secondary: '#FFFFFF', confederation: 'CONMEBOL' },
  { country: 'Brazil', primary: '#FEDF00', secondary: '#009C3B', confederation: 'CONMEBOL' },
  { country: 'Uruguay', primary: '#5CBFEB', secondary: '#FFFFFF', confederation: 'CONMEBOL' },
  { country: 'Colombia', primary: '#FCD116', secondary: '#003893', confederation: 'CONMEBOL' },
  { country: 'Ecuador', primary: '#FFD100', secondary: '#0072CE', confederation: 'CONMEBOL' },
  { country: 'Chile', primary: '#0039A6', secondary: '#D52B1E', confederation: 'CONMEBOL' },
  // Europe
  { country: 'France', primary: '#002395', secondary: '#ED2939', confederation: 'UEFA' },
  { country: 'England', primary: '#CF142B', secondary: '#FFFFFF', confederation: 'UEFA' },
  { country: 'Spain', primary: '#C60B1E', secondary: '#FFC400', confederation: 'UEFA' },
  { country: 'Germany', primary: '#000000', secondary: '#DD0000', confederation: 'UEFA' },
  { country: 'Portugal', primary: '#006600', secondary: '#FF0000', confederation: 'UEFA' },
  { country: 'Netherlands', primary: '#FF6200', secondary: '#AE1C28', confederation: 'UEFA' },
  { country: 'Belgium', primary: '#E30613', secondary: '#000000', confederation: 'UEFA' },
  { country: 'Italy', primary: '#0066CC', secondary: '#FFFFFF', confederation: 'UEFA' },
  { country: 'Croatia', primary: '#FF0000', secondary: '#FFFFFF', confederation: 'UEFA' },
  { country: 'Poland', primary: '#DC143C', secondary: '#FFFFFF', confederation: 'UEFA' },
  { country: 'Switzerland', primary: '#FF0000', secondary: '#FFFFFF', confederation: 'UEFA' },
  { country: 'Denmark', primary: '#C60C30', secondary: '#FFFFFF', confederation: 'UEFA' },
  { country: 'Sweden', primary: '#006AA7', secondary: '#FFCD00', confederation: 'UEFA' },
  { country: 'Norway', primary: '#BA0C2F', secondary: '#00205B', confederation: 'UEFA' },
  // Africa
  { country: 'Morocco', primary: '#C1272D', secondary: '#006233', confederation: 'CAF' },
  { country: 'Senegal', primary: '#00853F', secondary: '#FDEF42', confederation: 'CAF' },
  { country: 'Nigeria', primary: '#008751', secondary: '#FFFFFF', confederation: 'CAF' },
  { country: 'Ghana', primary: '#006B3F', secondary: '#FCD116', confederation: 'CAF' },
  { country: 'Ivory Coast', primary: '#FF8200', secondary: '#009E60', confederation: 'CAF' },
  { country: 'Cameroon', primary: '#007A5E', secondary: '#CE1126', confederation: 'CAF' },
  { country: 'Egypt', primary: '#CE1126', secondary: '#000000', confederation: 'CAF' },
  // Asia / Oceania
  { country: 'Japan', primary: '#0033A0', secondary: '#FFFFFF', confederation: 'AFC' },
  { country: 'South Korea', primary: '#C60C30', secondary: '#003478', confederation: 'AFC' },
  { country: 'Australia', primary: '#00843D', secondary: '#FFCD00', confederation: 'AFC' },
  { country: 'Saudi Arabia', primary: '#006C35', secondary: '#FFFFFF', confederation: 'AFC' },
  { country: 'Iran', primary: '#239F40', secondary: '#DA0000', confederation: 'AFC' },
  { country: 'Qatar', primary: '#8A1538', secondary: '#FFFFFF', confederation: 'AFC' },
]

export const WC_EVENT_SLUG = 'world-cup-2026'
export const WC_LEAGUE_SLUG = 'world-cup'
export const WC_HOSTS = ['United States', 'Canada', 'Mexico']

/** Slug of a nation's /team page (must match how pro-data derives it). */
export function wcTeamSlug(country: string): string {
  return slugify(`${country} National Team`)
}

/** Featured star players for the hub — slugs must exist in players.ts. */
export const WC_FEATURED_PLAYERS = [
  'lionel-messi', 'kylian-mbappe', 'erling-haaland', 'vinicius-junior',
  'jude-bellingham', 'harry-kane', 'cristiano-ronaldo', 'mohamed-salah',
]
