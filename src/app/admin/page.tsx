'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'

interface Stats {
  total_schools: number
  schools_live: number
  schools_pending: number
  total_products: number
  total_pages: number
  total_articles: number
  products_by_source: { ebay: number; amazon: number }
  build_queue: Array<{
    slug: string
    name: string
    short_name: string
    conference: string
    fan_size_rank: number
    build_status: string | null
  }>
}

export default function AdminPage() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [building, setBuilding] = useState<string | null>(null)
  const [buildResult, setBuildResult] = useState<string | null>(null)
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())

  const fetchStats = useCallback(async () => {
    if (!token) return
    try {
      const res = await fetch('/api/admin/stats', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        setStats(await res.json())
        setLastRefresh(new Date())
      }
    } catch { /* silent */ }
    setLoading(false)
  }, [token])

  useEffect(() => {
    fetchStats()
    const interval = setInterval(fetchStats, 60000)
    return () => clearInterval(interval)
  }, [fetchStats])

  async function buildSchool(slug: string) {
    if (!token) return
    setBuilding(slug)
    setBuildResult(null)

    try {
      const res = await fetch('/api/schools/build', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ school_slug: slug }),
      })
      const data = await res.json()
      if (data.success) {
        setBuildResult(`${slug}: ${data.products_ingested} products, ${data.pages_created} pages, ${data.articles_published} articles (${Math.round(data.duration_ms / 1000)}s)`)
      } else if (data.already_live) {
        setBuildResult(`${slug} is already live`)
      } else {
        setBuildResult(`Error: ${data.error || 'Unknown error'}`)
      }
      fetchStats()
    } catch (err) {
      setBuildResult(`Error: ${err}`)
    }
    setBuilding(null)
  }

  if (!token) {
    return (
      <main style={{ padding: 48, textAlign: 'center' }}>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>Access Denied</h1>
        <p style={{ color: '#6B6B6B', marginTop: 8 }}>Add ?token=YOUR_ADMIN_TOKEN to the URL.</p>
      </main>
    )
  }

  if (loading) {
    return <main style={{ padding: 48, textAlign: 'center' }}><p>Loading...</p></main>
  }

  if (!stats) {
    return <main style={{ padding: 48, textAlign: 'center' }}><p>Failed to load stats. Check your token.</p></main>
  }

  const pct = Math.round((stats.schools_live / stats.total_schools) * 100)

  return (
    <main style={{ maxWidth: 960, margin: '0 auto', padding: '32px 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 900, letterSpacing: '-0.02em' }}>DieHardNation Admin</h1>
        <span style={{ fontSize: 12, color: '#9B9B9B' }}>
          Last refresh: {lastRefresh.toLocaleTimeString()} (auto-refreshes every 60s)
        </span>
      </div>

      {/* Progress bar */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 14, fontWeight: 700 }}>{stats.schools_live} of {stats.total_schools} schools live</span>
          <span style={{ fontSize: 14, fontWeight: 700 }}>{pct}%</span>
        </div>
        <div style={{ height: 12, background: '#E8E8E8', borderRadius: 6, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${pct}%`, background: '#CC0000', borderRadius: 6, transition: 'width 0.5s' }} />
        </div>
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
        {[
          { label: 'Schools Live', value: stats.schools_live },
          { label: 'Total Products', value: stats.total_products },
          { label: 'Total Pages', value: stats.total_pages },
          { label: 'Total Articles', value: stats.total_articles },
        ].map(s => (
          <div key={s.label} style={{
            border: '1px solid #E8E8E8',
            borderRadius: 8,
            padding: 16,
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 28, fontWeight: 900 }}>{s.value.toLocaleString()}</div>
            <div style={{ fontSize: 12, color: '#6B6B6B', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Build result */}
      {buildResult && (
        <div style={{
          padding: 12,
          background: buildResult.startsWith('Error') ? '#FEE' : '#EFE',
          borderRadius: 6,
          fontSize: 13,
          marginBottom: 16,
          border: `1px solid ${buildResult.startsWith('Error') ? '#FCC' : '#CFC'}`,
        }}>
          {buildResult}
        </div>
      )}

      {/* Build queue */}
      <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>Build Queue &mdash; Next Schools</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, marginBottom: 32 }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #E8E8E8' }}>
            <th style={{ textAlign: 'left', padding: '8px 4px', fontWeight: 700 }}>Rank</th>
            <th style={{ textAlign: 'left', padding: '8px 4px', fontWeight: 700 }}>School</th>
            <th style={{ textAlign: 'left', padding: '8px 4px', fontWeight: 700 }}>Conference</th>
            <th style={{ textAlign: 'left', padding: '8px 4px', fontWeight: 700 }}>Status</th>
            <th style={{ textAlign: 'right', padding: '8px 4px', fontWeight: 700 }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {stats.build_queue.map(school => (
            <tr key={school.slug} style={{ borderBottom: '1px solid #E8E8E8' }}>
              <td style={{ padding: '8px 4px' }}>{school.fan_size_rank}</td>
              <td style={{ padding: '8px 4px', fontWeight: 600 }}>{school.name}</td>
              <td style={{ padding: '8px 4px', textTransform: 'uppercase', fontSize: 11, color: '#6B6B6B' }}>{school.conference}</td>
              <td style={{ padding: '8px 4px' }}>
                <span style={{
                  display: 'inline-block',
                  fontSize: 10,
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: 10,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  background: school.build_status === 'building' ? '#FFF3CD'
                    : school.build_status === 'complete' ? '#D4EDDA'
                    : school.build_status === 'failed' ? '#F8D7DA'
                    : '#E8E8E8',
                  color: school.build_status === 'building' ? '#856404'
                    : school.build_status === 'complete' ? '#155724'
                    : school.build_status === 'failed' ? '#721C24'
                    : '#6B6B6B',
                }}>
                  {school.build_status || 'pending'}
                </span>
              </td>
              <td style={{ padding: '8px 4px', textAlign: 'right' }}>
                <button
                  onClick={() => buildSchool(school.slug)}
                  disabled={building !== null}
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    padding: '4px 12px',
                    border: 'none',
                    borderRadius: 4,
                    background: building === school.slug ? '#6B6B6B' : '#CC0000',
                    color: 'white',
                    cursor: building !== null ? 'not-allowed' : 'pointer',
                    opacity: building !== null && building !== school.slug ? 0.4 : 1,
                  }}
                >
                  {building === school.slug ? 'Building...' : 'Build Now'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {stats.build_queue.length === 0 && (
        <p style={{ color: '#6B6B6B', textAlign: 'center', padding: 24 }}>
          All schools have been built!
        </p>
      )}
    </main>
  )
}
