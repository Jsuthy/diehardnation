import Link from 'next/link'
import { heroGradient, contrastText, lighten } from '@/lib/sports/color'

interface Crumb { label: string; href?: string }
interface Badge { label: string; href?: string }

interface Props {
  title: string
  baseColor?: string
  accentColor?: string
  eyebrow?: string
  subtitle?: string
  breadcrumb?: Crumb[]
  badges?: Badge[]
  children?: React.ReactNode
}

// Themed hero with a color gradient, a large ghosted monogram watermark,
// breadcrumb, eyebrow pill, title and badge row. Server component.
export default function PageHero({
  title, baseColor = '#1C2C4E', accentColor, eyebrow, subtitle, breadcrumb, badges, children,
}: Props) {
  const fg = contrastText(baseColor)
  const muted = fg === '#FFFFFF' ? 'rgba(255,255,255,0.72)' : 'rgba(0,0,0,0.6)'
  const chipBg = fg === '#FFFFFF' ? 'rgba(255,255,255,0.16)' : 'rgba(0,0,0,0.08)'
  const accent = accentColor || lighten(baseColor, 0.35)

  const crumbLd = breadcrumb && breadcrumb.length > 1 ? {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumb.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.label,
      ...(c.href ? { item: `https://diehardnation.com${c.href}` } : {}),
    })),
  } : null

  return (
    <section style={{ position: 'relative', background: heroGradient(baseColor), color: fg, overflow: 'hidden' }}>
      {crumbLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbLd) }} />
      )}
      {/* Monogram watermark */}
      <span aria-hidden style={{
        position: 'absolute', right: '-2%', top: '50%', transform: 'translateY(-50%)',
        fontSize: 'clamp(220px, 34vw, 460px)', fontWeight: 900, lineHeight: 1,
        color: fg, opacity: 0.07, letterSpacing: '-0.05em', userSelect: 'none', pointerEvents: 'none',
      }}>
        {title.charAt(0).toUpperCase()}
      </span>

      <div className="container" style={{ position: 'relative', padding: '40px 20px 48px' }}>
        {breadcrumb && breadcrumb.length > 0 && (
          <nav style={{ fontSize: 12, fontWeight: 600, marginBottom: 18, color: muted }}>
            {breadcrumb.map((c, i) => (
              <span key={i}>
                {c.href ? <Link href={c.href} style={{ color: muted, textDecoration: 'none' }}>{c.label}</Link> : c.label}
                {i < breadcrumb.length - 1 && <span style={{ opacity: 0.5 }}>{'  ›  '}</span>}
              </span>
            ))}
          </nav>
        )}

        {eyebrow && (
          <span style={{
            display: 'inline-block', fontSize: 11, fontWeight: 800, textTransform: 'uppercase',
            letterSpacing: '0.1em', background: chipBg, padding: '5px 12px', borderRadius: 20, marginBottom: 16,
          }}>
            {eyebrow}
          </span>
        )}

        <h1 style={{
          fontSize: 'clamp(38px, 6.5vw, 76px)', fontWeight: 900, letterSpacing: '-0.035em',
          lineHeight: 0.98, maxWidth: 900, textShadow: fg === '#FFFFFF' ? '0 2px 20px rgba(0,0,0,0.18)' : 'none',
        }}>
          {title}
        </h1>

        {subtitle && (
          <p style={{ fontSize: 'clamp(15px, 2vw, 19px)', fontWeight: 600, color: muted, marginTop: 14, maxWidth: 680 }}>
            {subtitle}
          </p>
        )}

        {badges && badges.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 20 }}>
            {badges.map((b, i) => {
              const inner = (
                <span style={{
                  display: 'inline-block', fontSize: 13, fontWeight: 700, background: chipBg,
                  padding: '6px 14px', borderRadius: 20, color: fg,
                }}>
                  {b.label}
                </span>
              )
              return b.href
                ? <Link key={i} href={b.href} style={{ textDecoration: 'none' }}>{inner}</Link>
                : <span key={i}>{inner}</span>
            })}
          </div>
        )}

        {children && <div style={{ marginTop: 22 }}>{children}</div>}
      </div>

      {/* Accent strip in the secondary color */}
      <div style={{ height: 6, background: accent }} />
    </section>
  )
}
