import Link from 'next/link'

const TOP_SCHOOLS = [
  { slug: 'nebraska', name: 'Nebraska' },
  { slug: 'alabama', name: 'Alabama' },
  { slug: 'ohio-state', name: 'Ohio State' },
  { slug: 'michigan', name: 'Michigan' },
  { slug: 'texas', name: 'Texas' },
  { slug: 'georgia', name: 'Georgia' },
  { slug: 'penn-state', name: 'Penn State' },
  { slug: 'lsu', name: 'LSU' },
  { slug: 'notre-dame', name: 'Notre Dame' },
  { slug: 'tennessee', name: 'Tennessee' },
]

const BROWSE_SPORTS = [
  { href: '/sport/american-football', name: 'NFL & Football' },
  { href: '/sport/basketball', name: 'NBA & Basketball' },
  { href: '/sport/baseball', name: 'MLB & Baseball' },
  { href: '/sport/ice-hockey', name: 'NHL & Hockey' },
  { href: '/sport/soccer', name: 'Soccer' },
  { href: '/events', name: 'Upcoming Events' },
]

export default function Footer() {
  return (
    <footer style={{
      background: 'white',
      borderTop: '1px solid var(--border)',
      padding: '48px 0 24px',
      fontSize: 13,
    }}>
      <div className="container">
        <div className="footer-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 32,
          marginBottom: 32,
        }}>
          <style>{`
            @media (max-width: 768px) {
              .footer-grid { grid-template-columns: repeat(2, 1fr) !important; }
            }
          `}</style>

          {/* Brand */}
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.jpg" alt="DieHardNation" style={{ height: 64, width: 'auto', display: 'block', marginBottom: 10 }} />
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 8 }}>
              Independent fan gear &amp; sports news hub for every team. Not affiliated with any league, team or the NCAA.
            </p>
            <p style={{ color: 'var(--text-muted)' }}>&copy; 2026 DieHardNation</p>
          </div>

          {/* Top Schools */}
          <nav aria-label="Top schools">
            <div style={{ fontWeight: 700, marginBottom: 8 }}>Top Schools</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {TOP_SCHOOLS.map(s => (
                <Link key={s.slug} href={`/${s.slug}`} style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
                  {s.name}
                </Link>
              ))}
            </div>
          </nav>

          {/* Browse Sports */}
          <nav aria-label="Browse sports">
            <div style={{ fontWeight: 700, marginBottom: 8 }}>Browse Sports</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {BROWSE_SPORTS.map(s => (
                <Link key={s.href} href={s.href} style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
                  {s.name}
                </Link>
              ))}
            </div>
          </nav>

          {/* Info */}
          <nav aria-label="Site information">
            <div style={{ fontWeight: 700, marginBottom: 8 }}>Info</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <Link href="/legal" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Legal &amp; Disclosures</Link>
              <Link href="/legal#affiliate" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Affiliate Disclosure</Link>
              <Link href="/legal#privacy" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Privacy Policy</Link>
              <Link href="/legal#terms" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Terms</Link>
            </div>
          </nav>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid var(--border)',
          paddingTop: 16,
          fontSize: 11,
          color: 'var(--text-muted)',
          lineHeight: 1.6,
        }}>
          DieHardNation is an independent fan site. All trademarks are property of their
          respective owners. We earn affiliate commissions from qualifying purchases via
          eBay, Amazon and other retailers, at no extra cost to you.
          <br />
          As an Amazon Associate I earn from qualifying purchases.
        </div>
      </div>
    </footer>
  )
}
