'use client'

import { useState } from 'react'

interface EmailSignupProps {
  source?: 'homepage' | 'article' | 'team' | 'event' | string
  sportSlug?: string
  schoolSlug?: string
  variant?: 'dark' | 'light'
}

export default function EmailSignup({
  source = 'website',
  sportSlug,
  schoolSlug,
  variant = 'light',
}: EmailSignupProps) {
  const [firstName, setFirstName] = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')

  const dark = variant === 'dark'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !firstName) return
    setStatus('loading')
    try {
      const res = await fetch('/api/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, first_name: firstName, sport_slug: sportSlug, school_slug: schoolSlug, source }),
      })
      setStatus(res.ok ? 'done' : 'error')
    } catch {
      setStatus('error')
    }
  }

  const bg = dark ? '#0A0A0A' : '#FAFAFA'
  const fg = dark ? '#FFFFFF' : 'var(--text-primary, #0A0A0A)'
  const sub = dark ? '#BBBBBB' : 'var(--text-secondary, #555)'
  const inputBg = dark ? '#1A1A1A' : '#FFFFFF'
  const inputBorder = dark ? '#333' : 'var(--border, #E8E8E8)'

  return (
    <section style={{ background: bg, borderRadius: 'var(--radius-md, 8px)', padding: '28px 24px' }}>
      <h3 style={{ fontSize: 20, fontWeight: 800, color: fg, marginBottom: 4 }}>
        Get the latest sports news &amp; gear deals
      </h3>
      <p style={{ fontSize: 14, color: sub, marginBottom: 16 }}>
        Join the Nation — fresh coverage and deals in your inbox.
      </p>

      {status === 'done' ? (
        <p style={{ fontSize: 15, fontWeight: 700, color: dark ? '#4ADE80' : '#16A34A' }}>
          You&apos;re in! Welcome to DieHardNation.
        </p>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          <input
            type="text"
            required
            placeholder="First name"
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
            style={{ flex: '1 1 140px', padding: '12px 14px', borderRadius: 6, border: `1px solid ${inputBorder}`, background: inputBg, color: fg, fontSize: 14 }}
          />
          <input
            type="email"
            required
            placeholder="you@email.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{ flex: '2 1 200px', padding: '12px 14px', borderRadius: 6, border: `1px solid ${inputBorder}`, background: inputBg, color: fg, fontSize: 14 }}
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            style={{ background: 'var(--brand, #CC0000)', color: '#FFFFFF', fontWeight: 800, fontSize: 14, padding: '12px 22px', borderRadius: 6, border: 'none', cursor: 'pointer', opacity: status === 'loading' ? 0.6 : 1 }}
          >
            {status === 'loading' ? 'Joining…' : 'Join the Nation →'}
          </button>
        </form>
      )}
      {status === 'error' && (
        <p style={{ fontSize: 13, color: '#EF4444', marginTop: 10 }}>Something went wrong — please try again.</p>
      )}
    </section>
  )
}
