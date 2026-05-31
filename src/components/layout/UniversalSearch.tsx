'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { searchAll, type SearchResult } from '@/lib/sports/search-index'

interface Props {
  placeholder?: string
  style?: React.CSSProperties
  inputStyle?: React.CSSProperties
}

const TYPE_COLOR: Record<string, string> = {
  Team: '#CC0000', League: '#0A0A0A', Sport: '#0080C6', Event: '#D50032', School: '#014A86',
}

export default function UniversalSearch({ placeholder = 'Search teams, sports, events…', style, inputStyle }: Props) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (query.length >= 2) {
      setResults(searchAll(query, 8))
      setOpen(true)
      setActiveIndex(-1)
    } else {
      setResults([])
      setOpen(false)
    }
  }, [query])

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  useEffect(() => {
    function onSlash(e: KeyboardEvent) {
      if (e.key === '/' && !['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onSlash)
    return () => document.removeEventListener('keydown', onSlash)
  }, [])

  function go(r: SearchResult) {
    setOpen(false)
    setQuery('')
    router.push(r.href)
  }

  function shopAll() {
    setOpen(false)
    const qq = query.trim()
    setQuery('')
    router.push(`/search?q=${encodeURIComponent(qq)}`)
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIndex(i => Math.min(i + 1, results.length - 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIndex(i => Math.max(i - 1, 0)) }
    else if (e.key === 'Enter') {
      e.preventDefault()
      if (activeIndex >= 0 && results[activeIndex]) go(results[activeIndex])
      else if (query.trim().length >= 2) shopAll()
    }
    else if (e.key === 'Escape') setOpen(false)
  }

  return (
    <div ref={wrapperRef} style={{ position: 'relative', ...style }}>
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        onKeyDown={onKeyDown}
        onFocus={() => query.length >= 2 && setOpen(true)}
        placeholder={placeholder}
        aria-label="Search teams, sports, events and schools"
        style={{
          width: '100%', border: '1px solid var(--border-strong)', borderRadius: 20,
          padding: '8px 16px', fontSize: 14, outline: 'none', background: 'white',
          color: 'var(--text-primary)', ...inputStyle,
        }}
      />
      {open && query.trim().length >= 2 && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, background: 'white',
          border: '1px solid var(--border)', borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-lg)', marginTop: 4, zIndex: 200, overflow: 'hidden',
        }}>
          {/* Shop-all (product search) row — always first */}
          <div
            onClick={shopAll}
            onMouseEnter={() => setActiveIndex(-1)}
            style={{
              padding: '11px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10,
              background: activeIndex === -1 ? 'var(--surface)' : 'white', borderBottom: results.length ? '1px solid var(--border)' : 'none',
            }}
          >
            <span style={{ width: 26, height: 26, borderRadius: 6, background: 'var(--brand,#CC0000)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>⚲</span>
            <div style={{ flex: 1, fontSize: 14, fontWeight: 700 }}>
              Shop all gear for “{query.trim()}”
            </div>
            <span style={{ fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--brand,#CC0000)' }}>Search</span>
          </div>

          {results.map((r, i) => (
            <div
              key={`${r.type}-${r.href}`}
              onClick={() => go(r)}
              onMouseEnter={() => setActiveIndex(i)}
              style={{
                padding: '10px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10,
                background: i === activeIndex ? 'var(--surface)' : 'white', transition: 'background 0.1s',
              }}
            >
              <span style={{
                width: 26, height: 26, borderRadius: 6, background: r.color || '#0A0A0A', color: 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 900, flexShrink: 0,
              }}>
                {r.label.charAt(0)}
              </span>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.label}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{r.sub}</div>
              </div>
              <span style={{
                fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em',
                color: TYPE_COLOR[r.type] || '#666', flexShrink: 0,
              }}>
                {r.type}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
