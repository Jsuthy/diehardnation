'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { searchSchools, type SchoolData } from '@/lib/constants/schools'

interface SchoolSearchProps {
  placeholder?: string
  style?: React.CSSProperties
  inputStyle?: React.CSSProperties
}

export default function SchoolSearch({
  placeholder = 'Find your school...',
  style,
  inputStyle,
}: SchoolSearchProps) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SchoolData[]>([])
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (query.length >= 1) {
      setResults(searchSchools(query).slice(0, 8))
      setOpen(true)
      setActiveIndex(-1)
    } else {
      setResults([])
      setOpen(false)
    }
  }, [query])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function navigate(school: SchoolData) {
    setOpen(false)
    setQuery('')
    router.push(`/${school.slug}`)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex(i => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex(i => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && activeIndex >= 0 && results[activeIndex]) {
      navigate(results[activeIndex])
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  return (
    <div ref={wrapperRef} style={{ position: 'relative', ...style }}>
      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => query.length >= 1 && setOpen(true)}
        placeholder={placeholder}
        style={{
          width: '100%',
          border: '1px solid var(--border-strong)',
          borderRadius: 20,
          padding: '8px 16px',
          fontSize: 14,
          outline: 'none',
          background: 'white',
          color: 'var(--text-primary)',
          ...inputStyle,
        }}
      />
      {open && results.length > 0 && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          background: 'white',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-lg)',
          marginTop: 4,
          zIndex: 200,
          overflow: 'hidden',
        }}>
          {results.map((school, i) => (
            <div
              key={school.slug}
              onClick={() => navigate(school)}
              style={{
                padding: '10px 16px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                background: i === activeIndex ? 'var(--surface)' : 'white',
                transition: 'background 0.1s',
              }}
              onMouseEnter={() => setActiveIndex(i)}
            >
              <span style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: school.primary_color,
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
                fontWeight: 900,
                flexShrink: 0,
              }}>
                {school.short_name.charAt(0)}
              </span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{school.short_name}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{school.mascot} &middot; {school.conference.toUpperCase()}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
