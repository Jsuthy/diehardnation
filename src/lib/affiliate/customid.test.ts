import assert from 'node:assert/strict'
import { buildCustomId, sanitizeCustomId, withEbayCustomId, buildEbaySearchUrl, EBAY_CAMPAIGN_ID } from './customid'

assert.equal(buildCustomId('team', 'kansas-city-chiefs'), 'team-kansas-city-chiefs')
assert.equal(buildCustomId('league', 'nfl'), 'league-nfl')
assert.equal(buildCustomId('home'), 'home')
assert.equal(buildCustomId('search', 'Chiefs jersey'), 'search-chiefs-jersey')
assert.equal(buildCustomId('event', 'world-cup-2026'), 'event-world-cup-2026')
assert.equal(sanitizeCustomId('!!!'), '')
assert.ok(buildCustomId('search', 'x'.repeat(400)).length <= 256)

const tagged = withEbayCustomId('https://www.ebay.com/itm/123?campid=5339267498&customid=', 'team-chiefs')
assert.ok(tagged.includes('customid=team-chiefs'))
assert.ok(tagged.includes('campid=5339267498'))

const search = buildEbaySearchUrl('Chiefs jersey', 'search-chiefs-jersey')
assert.ok(search.includes('campid=' + EBAY_CAMPAIGN_ID))
assert.ok(search.includes('customid=search-chiefs-jersey'))
assert.ok(!search.includes('JEFFREYS-Nebraske'))

console.log('customid tests passed')
