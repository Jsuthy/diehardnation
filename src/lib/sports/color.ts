// Small color helpers for theming heroes from a team/brand base color.

function clamp(n: number) { return Math.max(0, Math.min(255, Math.round(n))) }

export function hexToRgb(hex: string): [number, number, number] {
  let h = (hex || '#000000').replace('#', '').trim()
  if (h.length === 3) h = h.split('').map(c => c + c).join('')
  if (h.length !== 6) h = '000000'
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]
}

export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(v => clamp(v).toString(16).padStart(2, '0')).join('')
}

// Mix toward black (amount 0..1).
export function darken(hex: string, amount = 0.3): string {
  const [r, g, b] = hexToRgb(hex)
  return rgbToHex(r * (1 - amount), g * (1 - amount), b * (1 - amount))
}

// Mix toward white (amount 0..1).
export function lighten(hex: string, amount = 0.3): string {
  const [r, g, b] = hexToRgb(hex)
  return rgbToHex(r + (255 - r) * amount, g + (255 - g) * amount, b + (255 - b) * amount)
}

// Relative luminance → pick readable foreground.
export function contrastText(hex: string): string {
  const [r, g, b] = hexToRgb(hex)
  const L = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return L > 0.6 ? '#0A0A0A' : '#FFFFFF'
}

// A pleasant diagonal hero gradient from a base color.
export function heroGradient(base: string): string {
  return `linear-gradient(135deg, ${base} 0%, ${darken(base, 0.4)} 100%)`
}

// Distinct, premium base color per sport so pages aren't all the same red.
export const SPORT_COLORS: Record<string, string> = {
  'american-football': '#7A1F2B', basketball: '#C75B12', soccer: '#0B6E4F',
  baseball: '#1A3A6B', 'ice-hockey': '#1F3A5F', tennis: '#3E7C00', golf: '#0E5C3A',
  mma: '#8A1C1C', rugby: '#243B6B', cricket: '#1E5E4A', motorsport: '#111827',
  cycling: '#9A6A00', 'multi-sport': '#4B2E83', volleyball: '#A8431E',
  wrestling: '#5A1E2E', 'horse-racing': '#5C4326',
}

export function sportColor(slug?: string | null): string {
  return (slug && SPORT_COLORS[slug]) || '#7A1F2B'
}
