import Link from 'next/link'

interface Props {
  children: React.ReactNode
  href?: string
  linkLabel?: string
}

// Consistent section heading with a brand accent bar and optional "see all" link.
export default function SectionHeading({ children, href, linkLabel = 'View all →' }: Props) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18, gap: 16 }}>
      <h2 style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 'clamp(20px, 3vw, 26px)', fontWeight: 900, letterSpacing: '-0.02em' }}>
        <span style={{ width: 5, height: 24, background: 'var(--brand,#CC0000)', borderRadius: 3, flexShrink: 0 }} />
        {children}
      </h2>
      {href && (
        <Link href={href} style={{ fontSize: 13, fontWeight: 700, color: 'var(--brand,#CC0000)', textDecoration: 'none', whiteSpace: 'nowrap' }}>
          {linkLabel}
        </Link>
      )}
    </div>
  )
}
