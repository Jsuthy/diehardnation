import type { School } from '@/lib/supabase/types'

export const CONTENT_CALENDAR = [
  { topic: 'Best {name} Football Jerseys This Season', type: 'gear-guide', sport: 'football' },
  { topic: 'Top {nickname} Hoodies for Game Day', type: 'gear-guide' },
  { topic: '{name} Gift Guide — Best Fan Gifts Under $50', type: 'gift-guide' },
  { topic: 'Best {mascot} Hats for Every Fan', type: 'gear-guide' },
  { topic: '{name} Basketball Gear — Shop the Latest', type: 'gear-guide', sport: 'basketball' },
  { topic: 'Gift Guide: What to Buy the {nickname} Fan in Your Life', type: 'gift-guide' },
  { topic: '{name} Volleyball Fan Gear — Support the {mascot}', type: 'gear-guide', sport: 'volleyball' },
  { topic: 'Best {name} T-Shirts Ranked by Fans', type: 'gear-guide' },
  { topic: '{name} Gear Under $25 — Affordable Fan Finds', type: 'gift-guide' },
  { topic: 'Game Day Essentials: {nickname} Fan Gear Checklist', type: 'scheduled' },
  { topic: 'Best {name} Football Hoodies for Tailgate Season', type: 'gear-guide', sport: 'football' },
  { topic: "{name} Women's Fan Gear — Best Picks", type: 'gear-guide' },
  { topic: 'Top {nickname} Gifts for Kids and Youth Fans', type: 'gift-guide' },
  { topic: '{name} Snapbacks and Hats — Fan Favorites', type: 'gear-guide' },
  { topic: 'Holiday Gift Guide: {name} Fan Edition', type: 'gift-guide' },
  { topic: 'Best {mascot} Crewneck Sweatshirts This Year', type: 'gear-guide' },
  { topic: '{name} Accessories — Beyond the Jersey', type: 'gear-guide' },
  { topic: 'Why {nickname} Fans Are the Most Loyal in College Sports', type: 'scheduled' },
  { topic: 'Best Vintage {name} Gear on eBay Right Now', type: 'gear-guide' },
  { topic: '{name} Football Season Preview — Gear Up', type: 'gear-guide', sport: 'football' },
  { topic: 'Top {name} Amazon Finds This Month', type: 'gear-guide' },
  { topic: '{name} Gear for the Office — Professional Fan Style', type: 'scheduled' },
  { topic: 'Best {name} Basketball Hoodies — Hoops Season', type: 'gear-guide', sport: 'basketball' },
  { topic: 'Ranking the Best {nickname} Football Jerseys', type: 'gear-guide', sport: 'football' },
  { topic: '{name} Fan Travel Guide — What to Wear on the Road', type: 'scheduled' },
  { topic: 'Best {mascot} Gear Deals of the Month', type: 'gear-guide' },
  { topic: '{name} Volleyball — Shop the Best Fan Apparel', type: 'gear-guide', sport: 'volleyball' },
  { topic: 'Top {name} Gifts for Alumni', type: 'gift-guide' },
  { topic: '{name} vs The World — Fan Gear Rankings', type: 'scheduled' },
  { topic: 'Best {nickname} Gear for New Fans', type: 'gear-guide' },
  { topic: '{name} Wrestling Fan Gear — Support the Mat {mascot}', type: 'gear-guide', sport: 'wrestling' },
  { topic: 'Top {nickname} Baseball Fan Apparel', type: 'gear-guide', sport: 'baseball' },
  { topic: '{name} Gift Guide Under $100', type: 'gift-guide' },
  { topic: 'Best {mascot} Long Sleeve Shirts for Fall', type: 'gear-guide' },
  { topic: 'Stadium Ready: {name} Game Day Fashion', type: 'scheduled' },
  { topic: '{name} Spring Gear — Lighten Up Your Fan Wardrobe', type: 'gear-guide' },
  { topic: 'Best {name} Fan Gear on a Budget', type: 'gift-guide' },
  { topic: 'Top {nickname} Gear Trending This Week', type: 'gear-guide' },
  { topic: '{name} Rivalry Week — Gear Up for the Big Game', type: 'scheduled' },
  { topic: 'Best {mascot} Zip-Up Hoodies Ranked', type: 'gear-guide' },
  { topic: '{name} Fan Gear History — From Vintage to Now', type: 'scheduled' },
  { topic: 'Best {name} Hats for Summer', type: 'gear-guide' },
  { topic: '{name} Bowl Season Gear — Shop Now', type: 'gear-guide', sport: 'football' },
  { topic: 'Gift Ideas for the {nickname} Superfan', type: 'gift-guide' },
  { topic: '{name} Football Recruiting — What It Means for Fans', type: 'scheduled', sport: 'football' },
  { topic: 'Best {mascot} Youth Jerseys for Kids', type: 'gear-guide' },
  { topic: '{name} Basketball March Madness Gear Guide', type: 'gear-guide', sport: 'basketball' },
  { topic: 'Top {nickname} Gear Gifts for Dad', type: 'gift-guide' },
  { topic: '{name} Transfer Portal Season — Fan Reaction Gear', type: 'scheduled' },
  { topic: 'Best {name} Fan Gear on Amazon Prime', type: 'gear-guide' },
  { topic: '{name} Season Opener — Get Your Gear Ready', type: 'gear-guide' },
  { topic: 'Year in Review: Best {nickname} Gear Moments', type: 'scheduled' },
] as const

export function fillPlaceholders(topic: string, school: School): string {
  return topic
    .replace(/\{name\}/g, school.name)
    .replace(/\{nickname\}/g, school.nickname)
    .replace(/\{mascot\}/g, school.mascot)
}

export function getTopicForWeek(
  school: School,
  weekNumber?: number
): { topic: string; type: string; sport?: string; week: number } {
  const weekNum = weekNumber ?? Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000)) % 52
  const item = CONTENT_CALENDAR[weekNum % CONTENT_CALENDAR.length]
  return {
    topic: fillPlaceholders(item.topic, school),
    type: item.type,
    sport: 'sport' in item ? item.sport : undefined,
    week: weekNum,
  }
}
