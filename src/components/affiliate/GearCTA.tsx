'use client'

import { useEffect, useState } from 'react'

interface AffiliateLink {
  provider: string
  label: string
  url: string
  isPrimary: boolean
  commissionRate: number
}

interface GearCTAProps {
  query: string
  title?: string
  teamName?: string
  sportName?: string
}

const PROVIDER_COLORS: Record<string, string> = {
  amazon: '#FF9900',
  fanatics: '#D50032',
  dicks: '#014A86',
  academy: '#ED1C24',
  ebay: '#E43137',
}

export default function GearCTA({ query, title }: GearCTAProps) {
  const [links, setLinks] = useState<AffiliateLink[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    setLoading(true)
    fetch(`/api/affiliate/links?q=${encodeURIComponent(query)}`)
      .then(r => r.json())
      .then(data => { if (active) setLinks(data.links || []) })
      .catch(() => { if (active) setLinks([]) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [query])

  const primary = links.find(l => l.isPrimary) || links[0]
  const secondary = links.filter(l => l !== primary)

  return (
    <section
      style={{
        borderLeft: '4px solid var(--brand, #CC0000)',
        background: '#FAFAFA',
        borderRadius: 'var(--radius-md, 8px)',
        padding: '20px 24px',
        margin: '24px 0',
      }}
    >
      <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 14, letterSpacing: '-0.01em' }}>
        {title || `Shop ${query}`}
      </h3>

      {loading && !primary ? (
        <div style={{ height: 48, width: 220, background: '#EEE', borderRadius: 6 }} />
      ) : primary ? (
        <>
          <a
            href={primary.url}
            target="_blank"
            rel="nofollow sponsored noopener"
            style={{
              display: 'inline-block',
              background: PROVIDER_COLORS[primary.provider] || '#CC0000',
              color: '#FFFFFF',
              fontWeight: 800,
              fontSize: 16,
              padding: '14px 28px',
              borderRadius: 8,
              textDecoration: 'none',
            }}
          >
            {primary.label}
          </a>

          {secondary.length > 0 && (
            <div style={{ marginTop: 14, fontSize: 13, color: 'var(--text-secondary, #555)' }}>
              Also check:{' '}
              {secondary.map((l, i) => (
                <span key={l.provider}>
                  <a
                    href={l.url}
                    target="_blank"
                    rel="nofollow sponsored noopener"
                    style={{ color: 'var(--brand, #CC0000)', fontWeight: 600, textDecoration: 'underline' }}
                  >
                    {l.provider.charAt(0).toUpperCase() + l.provider.slice(1)}
                  </a>
                  {i < secondary.length - 1 ? ' | ' : ''}
                </span>
              ))}
            </div>
          )}
        </>
      ) : (
        <p style={{ fontSize: 13, color: 'var(--text-muted, #999)' }}>Gear links loading…</p>
      )}

      <p style={{ fontSize: 11, color: 'var(--text-muted, #999)', marginTop: 14 }}>
        Affiliate links — commission earned at no cost to you.
      </p>
    </section>
  )
}
