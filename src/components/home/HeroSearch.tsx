'use client'

import SchoolSearch from '@/components/layout/SchoolSearch'

export default function HeroSearch() {
  return (
    <SchoolSearch
      placeholder="Nebraska, Alabama, Michigan..."
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
