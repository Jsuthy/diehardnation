// Shared helpers for the sports expansion.

export function slugify(input: string): string {
  return (input || '')
    .toString()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')
}

// Map a TheSportsDB strSport to one of our coarse categories.
export function detectCategory(sport: string): string {
  const s = (sport || '').toLowerCase()
  const team = ['soccer', 'football', 'basketball', 'baseball', 'hockey', 'rugby', 'cricket',
    'volleyball', 'handball', 'lacrosse', 'netball', 'water polo', 'kabaddi', 'sepak', 'hurling',
    'gaelic', 'softball', 'polo']
  const individual = ['tennis', 'golf', 'badminton', 'table tennis', 'snooker', 'darts', 'athletics',
    'gymnastics', 'archery', 'shooting', 'weightlifting', 'fencing', 'equestrian', 'triathlon',
    'pentathlon', 'esports', 'sumo']
  const motorsport = ['motor', 'rally', 'nascar', 'indycar', 'formula', 'superbike', 'drone racing']
  const combat = ['boxing', 'mma', 'wrestling', 'judo', 'karate', 'taekwondo']
  const water = ['swimming', 'diving', 'rowing', 'sailing', 'water polo', 'synchronized', 'surfing', 'canoe']
  const winter = ['ski', 'snowboard', 'biathlon', 'curling', 'bobsleigh', 'luge', 'skating', 'snow']
  const multi = ['olympic', 'commonwealth', 'asian games', 'pan american', 'multi']

  if (multi.some(k => s.includes(k))) return 'multi_sport'
  if (motorsport.some(k => s.includes(k))) return 'motorsport'
  if (combat.some(k => s.includes(k))) return 'combat'
  if (winter.some(k => s.includes(k))) return 'winter'
  if (water.some(k => s.includes(k))) return 'water'
  if (team.some(k => s.includes(k))) return 'team_sport'
  if (individual.some(k => s.includes(k))) return 'individual'
  return 'team_sport'
}

// Normalize a TheSportsDB colour value into a CSS hex string.
export function toHex(color: string | null | undefined, fallback = '#000000'): string {
  if (!color) return fallback
  const c = color.trim()
  if (/^#[0-9a-fA-F]{3,8}$/.test(c)) return c
  if (/^[0-9a-fA-F]{6}$/.test(c)) return `#${c}`
  return fallback
}
