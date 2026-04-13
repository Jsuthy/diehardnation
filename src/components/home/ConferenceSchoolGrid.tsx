'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { SCHOOLS, getSchoolsByConference, type SchoolData } from '@/lib/constants/schools'
import { CONFERENCES } from '@/lib/constants/conferences'
import { getLogoUrl } from '@/lib/schools/logos'

const TAB_LIST = [
  { slug: 'all', name: 'All' },
  ...CONFERENCES.slice(0, 7),
]

export default function ConferenceSchoolGrid() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('all')
  const [showAll, setShowAll] = useState(false)

  const schools = activeTab === 'all'
    ? [...SCHOOLS].sort((a, b) => a.fan_size_rank - b.fan_size_rank)
    : getSchoolsByConference(activeTab)

  const displaySchools = activeTab === 'all' && !showAll
    ? schools.slice(0, 40)
    : schools

  return (
    <section style={{ padding: '48px 0' }}>
      <style>{`
        .school-grid {
          display: grid;
          grid-template-columns: repeat(8, 1fr);
          gap: 12px;
        }
        @media (max-width: 1024px) {
          .school-grid { grid-template-columns: repeat(5, 1fr); }
        }
        @media (max-width: 640px) {
          .school-grid { grid-template-columns: repeat(4, 1fr); }
        }
        .conf-tabs {
          display: flex;
          gap: 0;
          overflow-x: auto;
          border-bottom: 1px solid var(--border);
          margin-bottom: 24px;
        }
        .conf-tabs::-webkit-scrollbar { display: none; }
      `}</style>

      {/* Tabs */}
      <div className="conf-tabs">
        {TAB_LIST.map(tab => (
          <button
            key={tab.slug}
            onClick={() => { setActiveTab(tab.slug); setShowAll(false); }}
            style={{
              fontSize: 13,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              padding: '8px 16px',
              border: 'none',
              borderBottom: `2px solid ${activeTab === tab.slug ? 'var(--brand)' : 'transparent'}`,
              background: 'none',
              color: activeTab === tab.slug ? 'var(--brand)' : 'var(--text-secondary)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'color 0.15s, border-color 0.15s',
            }}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="school-grid">
        {displaySchools.map((school: SchoolData) => (
          <div
            key={school.slug}
            onClick={() => router.push(`/${school.slug}`)}
            style={{
              padding: '16px 8px',
              textAlign: 'center',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              transition: 'all 0.15s',
              background: 'white',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'var(--brand)'
              e.currentTarget.style.background = '#FAFAFA'
              e.currentTarget.style.transform = 'translateY(-1px)'
              e.currentTarget.style.boxShadow = 'var(--shadow-sm)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--border)'
              e.currentTarget.style.background = 'white'
              e.currentTarget.style.transform = 'none'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            {(() => {
              const logoUrl = getLogoUrl(school.slug)
              return logoUrl ? (
                <img
                  src={logoUrl}
                  alt={`${school.short_name} logo`}
                  width={48}
                  height={48}
                  loading="lazy"
                  style={{ objectFit: 'contain' }}
                />
              ) : (
                <div style={{
                  fontSize: 32,
                  fontWeight: 900,
                  color: school.primary_color,
                  lineHeight: 1,
                }}>
                  {school.short_name.charAt(0)}
                </div>
              )
            })()}
            <div style={{
              fontSize: 12,
              fontWeight: 600,
              marginTop: 8,
              color: 'var(--text-primary)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>
              {school.short_name}
            </div>
          </div>
        ))}
      </div>

      {/* Show all button */}
      {activeTab === 'all' && !showAll && (
        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <button
            onClick={() => setShowAll(true)}
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: 'var(--brand)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              letterSpacing: '0.02em',
            }}
          >
            Show all 130 schools
          </button>
        </div>
      )}
    </section>
  )
}
