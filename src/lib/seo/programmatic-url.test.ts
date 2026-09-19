import assert from 'node:assert/strict'
import { programmaticPagePath } from './programmatic-url'

// Live sitemap 404s (Jul 2026): all-gear, tees-as-sport, under/25 split.
assert.equal(
  programmaticPagePath({ school_slug: 'liberty', slug: 'all-gear', page_type: 'sport', sport: 'general' }),
  '/liberty/gear/general',
)
assert.equal(
  programmaticPagePath({ school_slug: 'liberty', slug: 'all-gear', page_type: 'sport' }),
  '/liberty/gear/general',
)
assert.equal(
  programmaticPagePath({ school_slug: 'liberty', slug: 'tees', page_type: 'sport-category', sport: 'general', category: 'tees' }),
  '/liberty/gear/general/tees',
)
assert.equal(
  programmaticPagePath({ school_slug: 'liberty', slug: 'tees', page_type: 'sport-category' }),
  '/liberty/gear/general/tees',
)
assert.equal(
  programmaticPagePath({ school_slug: 'liberty', slug: 'under-25', page_type: 'sport-price' }),
  '/liberty/gear/general/under-25',
)
assert.equal(
  programmaticPagePath({ school_slug: 'connecticut', slug: '25-to-50', page_type: 'sport-price' }),
  '/connecticut/gear/general/25-to-50',
)
assert.equal(
  programmaticPagePath({
    school_slug: 'north-carolina',
    slug: 'football-under-25',
    page_type: 'sport-price',
    sport: 'football',
    price_range: 'under-25',
  }),
  '/north-carolina/gear/football/under-25',
)
assert.equal(
  programmaticPagePath({ school_slug: 'alabama', slug: 'football', page_type: 'sport' }),
  '/alabama/gear/football',
)
assert.equal(
  programmaticPagePath({ school_slug: 'alabama', slug: 'gift-guide', page_type: 'gift-guide' }),
  '/alabama/gift-guides/gift-guide',
)
assert.equal(
  programmaticPagePath({ school_slug: 'x', slug: 'not-a-sport', page_type: 'sport' }),
  null,
)
assert.equal(
  programmaticPagePath({ school_slug: '', slug: 'football', page_type: 'sport' }),
  null,
)

console.log('programmatic-url tests passed')
