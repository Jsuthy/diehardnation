export const PRICE_RANGES = [
  { slug: 'under-25',  label: 'Under $25',   min: 0,   max: 24.99 },
  { slug: '25-to-50',  label: '$25\u201350',  min: 25,  max: 49.99 },
  { slug: '50-to-100', label: '$50\u2013100', min: 50,  max: 99.99 },
  { slug: 'over-100',  label: 'Over $100',   min: 100, max: 9999  },
] as const
