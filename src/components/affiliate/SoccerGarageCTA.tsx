// SoccerGarage.com affiliate CTA (CJ Affiliate, publisher ID 101721012).
// Soccer-only retailer, so this is shown only on soccer sport/league/event pages.
// Deep-links via a real CJ link ID so it falls back to soccergarage.com (still
// tracked) if deep-linking is ever disabled for the advertiser.

const CJ_PID = '101721012'
const SG_LINK_ID = '10479704' // SoccerGarage.com homepage text link (highest EPC)

export function soccerGarageUrl(query: string): string {
  const dest = `https://www.soccergarage.com/search.php?search_query=${encodeURIComponent(query)}`
  return `https://www.jdoqocy.com/click-${CJ_PID}-${SG_LINK_ID}?url=${encodeURIComponent(dest)}`
}

export default function SoccerGarageCTA({ query, title }: { query: string; title?: string }) {
  return (
    <section
      style={{
        borderLeft: '4px solid #0B6E4F',
        background: '#FAFAFA',
        borderRadius: 'var(--radius-md, 8px)',
        padding: '20px 24px',
        margin: '20px 0',
      }}
    >
      <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 12, letterSpacing: '-0.01em' }}>
        {title || 'Shop soccer gear at SoccerGarage'}
      </h3>
      <a
        href={soccerGarageUrl(query)}
        target="_blank"
        rel="nofollow sponsored noopener"
        style={{
          display: 'inline-block', background: '#0B6E4F', color: '#fff', fontWeight: 800,
          fontSize: 16, padding: '14px 28px', borderRadius: 8, textDecoration: 'none',
        }}
      >
        Shop SoccerGarage →
      </a>
      <p style={{ fontSize: 11, color: 'var(--text-muted, #999)', marginTop: 14 }}>
        Cleats, jerseys, balls and keeper gear.
      </p>
    </section>
  )
}
