import type { School } from '@/lib/supabase/types'

export interface SchoolFilter {
  required: string[]
  excluded: string[]
}

export const SCHOOL_FILTERS: Record<string, SchoolFilter> = {
  'michigan': {
    required: ['michigan'],
    excluded: ['michigan state', 'msu', 'spartans'],
  },
  'michigan-state': {
    required: ['michigan state', 'spartans', 'msu'],
    excluded: [],
  },
  'usc': {
    required: ['usc', 'southern cal', 'southern california', 'trojans'],
    excluded: ['troy ', 'indiana', 'utah state', 'illinois state',
      'michigan state', 'arkansas state', 'arizona state',
      'florida state', 'mississippi state', 'ohio state',
      'penn state', 'kansas state', 'iowa state', 'fresno'],
  },
  'georgia': {
    required: ['georgia', 'bulldogs', 'dawgs', 'uga'],
    excluded: ['georgia tech', 'georgia state', 'georgia southern',
      'mississippi', 'fresno'],
  },
  'georgia-tech': {
    required: ['georgia tech', 'yellow jackets', 'ramblin wreck'],
    excluded: ['georgia bulldogs', 'uga', 'dawgs'],
  },
  'alabama': {
    required: ['alabama', 'crimson tide', 'roll tide', 'bama'],
    excluded: ['alabama state', 'north alabama', 'uab', 'troy'],
  },
  'florida': {
    required: ['florida gators', 'gators', 'uf ', 'university of florida'],
    excluded: ['florida state', 'florida international', 'fiu',
      'florida atlantic', 'fau', 'south florida', 'usf',
      'central florida', 'ucf', 'florida a&m'],
  },
  'florida-state': {
    required: ['florida state', 'seminoles', 'fsu', 'noles'],
    excluded: ['florida gators', 'university of florida'],
  },
  'ohio-state': {
    required: ['ohio state', 'buckeyes', 'osu buckeyes'],
    excluded: ['ohio university', 'ohio bobcats', 'miami ohio',
      'bowling green', 'kent state', 'akron'],
  },
  'penn-state': {
    required: ['penn state', 'nittany lions', 'psu'],
    excluded: [],
  },
  'texas': {
    required: ['texas longhorns', 'longhorns', 'hook em', 'ut austin'],
    excluded: ['texas am', 'texas a&m', 'texas tech', 'texas state',
      'north texas', 'texas southern', 'texas christian',
      'tcu', 'utep', 'utsa', 'texas san antonio'],
  },
  'texas-am': {
    required: ['texas am', 'texas a&m', 'aggies', 'gig em', '12th man'],
    excluded: ['texas longhorns', 'hook em', 'utah state aggies', 'new mexico state'],
  },
  'lsu': {
    required: ['lsu', 'louisiana state', 'tigers lsu', 'geaux tigers'],
    excluded: ['missouri tigers', 'memphis tigers', 'auburn tigers',
      'clemson tigers', 'pacific tigers'],
  },
  'auburn': {
    required: ['auburn', 'war eagle', 'tigers auburn'],
    excluded: ['lsu tigers', 'missouri tigers', 'memphis tigers',
      'clemson tigers'],
  },
  'clemson': {
    required: ['clemson', 'tigers clemson'],
    excluded: ['lsu tigers', 'missouri tigers', 'memphis tigers',
      'auburn tigers'],
  },
  'missouri': {
    required: ['missouri', 'mizzou'],
    excluded: ['lsu tigers', 'memphis tigers', 'auburn tigers',
      'clemson tigers'],
  },
  'oregon': {
    required: ['oregon ducks', 'ducks oregon', 'go ducks', 'uoregon'],
    excluded: ['oregon state', 'beavers'],
  },
  'oregon-state': {
    required: ['oregon state', 'beavers', 'osu beavers'],
    excluded: ['oregon ducks', 'ohio state'],
  },
  'washington': {
    required: ['washington huskies', 'uw huskies', 'go dawgs uw'],
    excluded: ['washington state', 'washington dc', 'washington football',
      'commanders'],
  },
  'washington-state': {
    required: ['washington state', 'wsu', 'cougars wsu', 'go cougs'],
    excluded: ['washington huskies', 'uw huskies'],
  },
  'iowa': {
    required: ['iowa hawkeyes', 'hawkeyes', 'iowa football', 'iowa basketball'],
    excluded: ['iowa state', 'cyclones'],
  },
  'iowa-state': {
    required: ['iowa state', 'cyclones', 'isu cyclones'],
    excluded: ['iowa hawkeyes', 'hawkeyes'],
  },
  'kansas': {
    required: ['kansas jayhawks', 'jayhawks', 'ku jayhawks', 'rock chalk'],
    excluded: ['kansas state', 'wildcats kansas', 'ksu'],
  },
  'kansas-state': {
    required: ['kansas state', 'wildcats ksu', 'k-state', 'kstate'],
    excluded: ['kansas jayhawks', 'jayhawks'],
  },
  'ole-miss': {
    required: ['ole miss', 'rebels ole miss', 'hotty toddy'],
    excluded: ['mississippi state', 'bulldogs mississippi'],
  },
  'mississippi-state': {
    required: ['mississippi state', 'bulldogs msu', 'hail state'],
    excluded: ['ole miss', 'rebels'],
  },
  'miami': {
    required: ['miami hurricanes', 'hurricanes', 'the u miami', 'canes'],
    excluded: ['miami ohio', 'miami redhawks', 'miami dolphins'],
  },
  'miami-ohio': {
    required: ['miami ohio', 'miami redhawks', 'redhawks'],
    excluded: ['miami hurricanes', 'hurricanes', 'the u'],
  },
  'nebraska': {
    required: ['nebraska', 'cornhuskers', 'huskers', 'go big red'],
    excluded: [],
  },
  'north-carolina': {
    required: ['north carolina tar heels', 'tar heels', 'unc '],
    excluded: ['nc state', 'east carolina', 'north carolina state'],
  },
  'nc-state': {
    required: ['nc state', 'wolfpack', 'north carolina state'],
    excluded: ['tar heels', 'unc '],
  },
  'oklahoma': {
    required: ['oklahoma sooners', 'sooners', 'boomer sooner'],
    excluded: ['oklahoma state', 'cowboys oklahoma', 'pokes'],
  },
  'oklahoma-state': {
    required: ['oklahoma state', 'cowboys osu', 'pokes', 'go pokes'],
    excluded: ['oklahoma sooners', 'sooners', 'boomer'],
  },
  'south-carolina': {
    required: ['south carolina gamecocks', 'gamecocks'],
    excluded: ['jacksonville state'],
  },
  'tennessee': {
    required: ['tennessee volunteers', 'volunteers', 'vols', 'rocky top'],
    excluded: ['middle tennessee', 'tennessee state', 'tennessee tech'],
  },
  'wisconsin': {
    required: ['wisconsin badgers', 'badgers', 'on wisconsin'],
    excluded: [],
  },
  'colorado': {
    required: ['colorado buffaloes', 'buffaloes', 'buffs', 'cu buffs'],
    excluded: ['colorado state', 'rams'],
  },
  'colorado-state': {
    required: ['colorado state', 'rams csu'],
    excluded: ['colorado buffaloes', 'cu buffs'],
  },
}

export function getSchoolFilter(school: School): SchoolFilter {
  if (SCHOOL_FILTERS[school.slug]) {
    return SCHOOL_FILTERS[school.slug]
  }
  return {
    required: [
      school.name.toLowerCase(),
      school.nickname.toLowerCase(),
      school.mascot.toLowerCase(),
    ],
    excluded: [],
  }
}

export const SPECIFIC_SEARCH_TERMS: Record<string, Record<string, string[]>> = {
  'michigan': {
    football: ['michigan wolverines football', 'michigan wolverines shirt',
      'michigan wolverines hoodie', 'go blue michigan shirt'],
    basketball: ['michigan wolverines basketball', 'michigan wolverines hoops'],
    general: ['michigan wolverines gear', 'michigan wolverines apparel',
      'university of michigan shirt'],
  },
  'michigan-state': {
    football: ['michigan state spartans football', 'spartans msu shirt',
      'michigan state football hoodie'],
    basketball: ['michigan state spartans basketball', 'msu spartans hoops'],
    general: ['michigan state spartans gear', 'msu spartans apparel'],
  },
  'usc': {
    football: ['usc trojans football', 'southern california trojans',
      'usc football shirt', 'fight on usc'],
    basketball: ['usc trojans basketball', 'southern cal basketball'],
    general: ['usc trojans gear', 'southern california trojans shirt',
      'usc trojans apparel'],
  },
  'georgia': {
    football: ['georgia bulldogs football', 'uga bulldogs shirt',
      'georgia bulldogs hoodie', 'go dawgs shirt'],
    basketball: ['georgia bulldogs basketball', 'uga basketball'],
    general: ['georgia bulldogs gear', 'uga bulldogs apparel', 'dawgs shirt'],
  },
  'florida': {
    football: ['florida gators football', 'uf gators shirt',
      'florida gators hoodie', 'go gators shirt'],
    basketball: ['florida gators basketball', 'gators hoops shirt'],
    general: ['florida gators gear', 'university of florida shirt'],
  },
  'ohio-state': {
    football: ['ohio state buckeyes football', 'osu buckeyes shirt',
      'ohio state football hoodie', 'buckeyes gear'],
    basketball: ['ohio state buckeyes basketball', 'buckeyes hoops'],
    general: ['ohio state buckeyes gear', 'ohio state buckeyes apparel'],
  },
  'texas': {
    football: ['texas longhorns football', 'hook em horns shirt',
      'longhorns football hoodie', 'ut longhorns gear'],
    basketball: ['texas longhorns basketball', 'ut basketball shirt'],
    general: ['texas longhorns gear', 'longhorns apparel', 'hook em shirt'],
  },
  'texas-am': {
    football: ['texas a&m aggies football', 'aggies football shirt',
      'gig em aggies hoodie'],
    basketball: ['texas a&m aggies basketball', 'aggies basketball'],
    general: ['texas a&m aggies gear', '12th man shirt', 'aggies apparel'],
  },
  'lsu': {
    football: ['lsu tigers football', 'louisiana state tigers shirt',
      'geaux tigers shirt', 'lsu football hoodie'],
    basketball: ['lsu tigers basketball', 'geaux tigers basketball'],
    general: ['lsu tigers gear', 'louisiana state tigers apparel'],
  },
  'auburn': {
    football: ['auburn tigers football', 'war eagle shirt',
      'auburn football hoodie'],
    basketball: ['auburn tigers basketball', 'war eagle basketball'],
    general: ['auburn tigers gear', 'war eagle apparel'],
  },
  'oregon': {
    football: ['oregon ducks football', 'go ducks shirt',
      'oregon ducks hoodie'],
    basketball: ['oregon ducks basketball'],
    general: ['oregon ducks gear', 'oregon ducks apparel'],
  },
  'iowa': {
    football: ['iowa hawkeyes football', 'hawkeyes football shirt',
      'iowa hawkeyes hoodie'],
    basketball: ['iowa hawkeyes basketball'],
    general: ['iowa hawkeyes gear', 'iowa hawkeyes apparel'],
  },
  'iowa-state': {
    football: ['iowa state cyclones football', 'cyclones football shirt'],
    basketball: ['iowa state cyclones basketball'],
    general: ['iowa state cyclones gear', 'cyclones apparel'],
  },
  'oklahoma': {
    football: ['oklahoma sooners football', 'boomer sooner shirt',
      'sooners football hoodie'],
    basketball: ['oklahoma sooners basketball'],
    general: ['oklahoma sooners gear', 'sooners apparel'],
  },
  'oklahoma-state': {
    football: ['oklahoma state cowboys football', 'go pokes shirt'],
    basketball: ['oklahoma state cowboys basketball'],
    general: ['oklahoma state cowboys gear', 'osu cowboys apparel'],
  },
}
