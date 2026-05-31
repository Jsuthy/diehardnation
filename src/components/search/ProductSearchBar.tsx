'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ProductSearchBar({ initialQuery = '', sort }: { initialQuery?: string; sort?: string }) {
  const router = useRouter()
  const [q, setQ] = useState(initialQuery)

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!q.trim()) return
    const params = new URLSearchParams({ q: q.trim() })
    if (sort && sort !== 'best') params.set('sort', sort)
    router.push(`/search?${params.toString()}`)
  }

  return (
    <form onSubmit={submit} style={{ display: 'flex', gap: 10, maxWidth: 720 }}>
      <input
        value={q}
        onChange={e => setQ(e.target.value)}
        placeholder="Search any team, player, jersey, hat…"
        autoFocus={!initialQuery}
        style={{
          flex: 1, height: 52, padding: '0 18px', fontSize: 16, borderRadius: 8,
          border: '2px solid var(--text-primary)', outline: 'none', background: '#fff',
        }}
      />
      <button type="submit" style={{
        height: 52, padding: '0 26px', fontSize: 15, fontWeight: 800, color: '#fff',
        background: 'var(--brand,#CC0000)', border: 'none', borderRadius: 8, cursor: 'pointer',
      }}>
        Search
      </button>
    </form>
  )
}
