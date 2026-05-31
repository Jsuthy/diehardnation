'use client'

import { useEffect, useMemo, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

interface Option { slug: string; name: string }

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

function PublishInner() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const authed = token === 'diehardnation_admin_2026'

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [excerptEdited, setExcerptEdited] = useState(false)
  const [sportSlug, setSportSlug] = useState('')
  const [leagueSlug, setLeagueSlug] = useState('')
  const [eventSlug, setEventSlug] = useState('')
  const [tagsInput, setTagsInput] = useState('')
  const [teamTags, setTeamTags] = useState<string[]>([])
  const [teamQuery, setTeamQuery] = useState('')
  const [status, setStatus] = useState<'idle' | 'saving' | 'done' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const [sports, setSports] = useState<Option[]>([])
  const [leagues, setLeagues] = useState<Option[]>([])
  const [events, setEvents] = useState<Option[]>([])
  const [recent, setRecent] = useState<{ slug: string; title: string; sport_slug: string | null; is_published: boolean; published_at: string | null }[]>([])

  // Load taxonomy + recent articles
  useEffect(() => {
    if (!authed) return
    fetch('/api/admin/taxonomy').then(r => r.json()).then(d => {
      setSports(d.sports || [])
      setLeagues(d.leagues || [])
      setEvents(d.events || [])
      setRecent(d.recent || [])
    }).catch(() => {})
  }, [authed])

  const filteredLeagues = useMemo(
    () => leagues.filter(l => !sportSlug || (l as Option & { sport_slug?: string }).sport_slug === sportSlug),
    [leagues, sportSlug]
  )

  const autoExcerpt = useMemo(
    () => content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 160),
    [content]
  )
  const effectiveExcerpt = excerptEdited ? excerpt : autoExcerpt
  const slug = useMemo(() => slugify(title).slice(0, 80) || 'article', [title])

  if (!authed) {
    return (
      <main style={{ padding: 80, textAlign: 'center' }}>
        <p>Not authorized. Append <code>?token=…</code> to the URL.</p>
      </main>
    )
  }

  async function publish(isPublished: boolean) {
    if (!title || !content) { setMessage('Title and content required.'); setStatus('error'); return }
    setStatus('saving'); setMessage('')
    const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean)
    const team_slugs = teamTags.filter(t => !t.startsWith('school:'))
    const school_slugs = teamTags.filter(t => t.startsWith('school:')).map(t => t.replace('school:', ''))
    try {
      const res = await fetch(`/api/articles?token=${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title, content, excerpt: effectiveExcerpt,
          sport_slug: sportSlug || null, league_slug: leagueSlug || null,
          event_slug: eventSlug || null, team_slugs, school_slugs, tags,
          is_published: isPublished,
        }),
      })
      const data = await res.json()
      if (res.ok) {
        setStatus('done')
        setMessage(isPublished ? `Published! View at /news/${data.slug}` : `Draft saved (${data.slug}).`)
        setTitle(''); setContent(''); setExcerpt(''); setExcerptEdited(false)
        setSportSlug(''); setLeagueSlug(''); setEventSlug(''); setTagsInput(''); setTeamTags([])
      } else {
        setStatus('error'); setMessage(data.error || 'Failed to publish.')
      }
    } catch {
      setStatus('error'); setMessage('Network error.')
    }
  }

  const labelStyle = { fontSize: 12, fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.05em', color: '#888', display: 'block', marginBottom: 6 }
  const selectStyle = { padding: '8px 10px', borderRadius: 6, border: '1px solid #ddd', fontSize: 14, minWidth: 160 }

  return (
    <main style={{ maxWidth: 800, margin: 'auto', padding: '40px 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <strong style={{ fontSize: 16 }}>DieHardNation | Publish</strong>
        <span style={{ fontSize: 13 }}>
          <a href="/admin" style={{ color: '#888', textDecoration: 'none' }}>← Admin</a>
          {'   '}
          <a href="/news" style={{ color: 'var(--brand,#CC0000)', textDecoration: 'none', marginLeft: 16 }}>View live site →</a>
        </span>
      </div>

      <input
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Write a compelling headline..."
        style={{ width: '100%', fontSize: 28, fontWeight: 700, border: 'none', borderBottom: '2px solid #eee', padding: '8px 0', outline: 'none', marginBottom: 20 }}
      />

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 20 }}>
        <div>
          <label style={labelStyle}>Sport</label>
          <select value={sportSlug} onChange={e => { setSportSlug(e.target.value); setLeagueSlug('') }} style={selectStyle}>
            <option value="">— Sport —</option>
            {sports.map(s => <option key={s.slug} value={s.slug}>{s.name}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>League</label>
          <select value={leagueSlug} onChange={e => setLeagueSlug(e.target.value)} style={selectStyle}>
            <option value="">— League —</option>
            {filteredLeagues.map(l => <option key={l.slug} value={l.slug}>{l.name}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Event</label>
          <select value={eventSlug} onChange={e => setEventSlug(e.target.value)} style={selectStyle}>
            <option value="">— Event —</option>
            {events.map(ev => <option key={ev.slug} value={ev.slug}>{ev.name}</option>)}
          </select>
        </div>
      </div>

      <textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder="Write your article here... Plain text or HTML both work. Gear CTAs will be auto-injected based on your tags."
        style={{ width: '100%', minHeight: 500, fontSize: 16, lineHeight: 1.8, padding: 14, border: '1px solid #eee', borderRadius: 8, outline: 'none', fontFamily: 'inherit', resize: 'vertical' }}
      />

      <div style={{ marginTop: 20 }}>
        <label style={labelStyle}>Excerpt (auto-generated, edit if needed)</label>
        <input
          value={effectiveExcerpt}
          onChange={e => { setExcerpt(e.target.value); setExcerptEdited(true) }}
          style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14 }}
        />
      </div>

      <div style={{ marginTop: 20 }}>
        <label style={labelStyle}>Tag teams or schools (type a slug, press Enter)</label>
        <input
          value={teamQuery}
          onChange={e => setTeamQuery(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && teamQuery.trim()) {
              e.preventDefault()
              setTeamTags(prev => Array.from(new Set([...prev, slugify(teamQuery)])))
              setTeamQuery('')
            }
          }}
          placeholder="e.g. kansas-city-chiefs  (or school:nebraska)"
          style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14 }}
        />
        {teamTags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
            {teamTags.map(t => (
              <span key={t} onClick={() => setTeamTags(prev => prev.filter(x => x !== t))}
                style={{ background: '#eee', borderRadius: 14, padding: '4px 10px', fontSize: 12, cursor: 'pointer' }}>
                {t} ✕
              </span>
            ))}
          </div>
        )}
      </div>

      <div style={{ marginTop: 20 }}>
        <label style={labelStyle}>Additional tags (comma-separated)</label>
        <input
          value={tagsInput}
          onChange={e => setTagsInput(e.target.value)}
          placeholder="transfer, rumor, injury, highlight"
          style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14 }}
        />
      </div>

      {/* SEO preview */}
      <div style={{ marginTop: 24, border: '1px solid #eee', borderRadius: 8, padding: 16 }}>
        <label style={labelStyle}>Google preview</label>
        <div style={{ fontSize: 13, color: '#006621' }}>diehardnation.com › news › {slug}</div>
        <div style={{ fontSize: 18, color: '#1a0dab', lineHeight: 1.3 }}>{title || 'Your headline'} | DieHardNation</div>
        <div style={{ fontSize: 13, color: '#545454' }}>{effectiveExcerpt || 'Your excerpt will appear here.'}</div>
      </div>

      <div style={{ display: 'flex', gap: 12, marginTop: 24, alignItems: 'center' }}>
        <button onClick={() => publish(false)} disabled={status === 'saving'}
          style={{ background: '#eee', border: 'none', borderRadius: 6, padding: '12px 20px', fontWeight: 700, cursor: 'pointer' }}>
          Save Draft
        </button>
        <button onClick={() => publish(true)} disabled={status === 'saving'}
          style={{ background: 'var(--brand,#CC0000)', color: '#fff', border: 'none', borderRadius: 6, padding: '14px 28px', fontWeight: 800, fontSize: 16, cursor: 'pointer' }}>
          {status === 'saving' ? 'Publishing…' : 'PUBLISH NOW'}
        </button>
        {message && (
          <span style={{ fontSize: 14, fontWeight: 600, color: status === 'error' ? '#EF4444' : '#16A34A' }}>{message}</span>
        )}
      </div>

      {/* Recent articles */}
      {recent.length > 0 && (
        <div style={{ marginTop: 48, paddingTop: 24, borderTop: '1px solid #eee' }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, marginBottom: 12 }}>Recent articles</h2>
          {recent.map(a => (
            <div key={a.slug} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f3f3f3', fontSize: 13 }}>
              <span style={{ fontWeight: 600 }}>{a.title}</span>
              <span style={{ color: '#888' }}>
                {a.sport_slug || '—'} · {a.is_published ? 'live' : 'draft'} ·{' '}
                <a href={`/news/${a.slug}`} style={{ color: 'var(--brand,#CC0000)', textDecoration: 'none' }}>View</a>
              </span>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}

export default function PublishPage() {
  return (
    <Suspense fallback={<main style={{ padding: 80 }}>Loading…</main>}>
      <PublishInner />
    </Suspense>
  )
}
