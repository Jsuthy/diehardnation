'use client'

import UniversalSearch from '@/components/layout/UniversalSearch'

export default function HeroSearch() {
  return (
    <UniversalSearch
      placeholder="Search any team, sport, event or school…"
      style={{ width: '100%', maxWidth: 480 }}
      inputStyle={{
        width: '100%',
        height: 52,
        border: '2px solid var(--text-primary)',
        borderRadius: 4,
        padding: '0 20px',
        fontSize: 16,
      }}
    />
  )
}
