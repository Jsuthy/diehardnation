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

const CONFERENCES = [
  { slug: 'sec', name: 'SEC' },
  { slug: 'big-ten', name: 'Big Ten' },
  { slug: 'big-12', name: 'Big 12' },
  { slug: 'acc', name: 'ACC' },
  { slug: 'american', name: 'American' },
  { slug: 'mountain-west', name: 'Mtn West' },
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
        <div style={{
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
            <div style={{ fontWeight: 900, fontSize: 16, letterSpacing: '-0.03em', marginBottom: 8 }}>
              DIEHARDNATION
            </div>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 8 }}>
              Independent college fan gear aggregator. Not affiliated with any university or NCAA.
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

          {/* Conferences */}
          <nav aria-label="Conferences">
            <div style={{ fontWeight: 700, marginBottom: 8 }}>Conferences</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {CONFERENCES.map(c => (
                <Link key={c.slug} href={`/?conference=${c.slug}`} style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
                  {c.name}
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
          respective owners. We earn affiliate commissions from qualifying purchases
          from eBay and Amazon.
        </div>
      </div>
    </footer>
  )
}
