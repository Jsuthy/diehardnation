'use client'

import { useRouter, usePathname } from 'next/navigation'
import type { School } from '@/lib/supabase/types'
import { SPORTS } from '@/lib/constants/sports'
import { getLogoUrl } from '@/lib/schools/logos'

interface SchoolNavProps {
  school: School
}

export default function SchoolNav({ school }: SchoolNavProps) {
  const router = useRouter()
  const pathname = usePathname()

  const activeSport = (() => {
    const match = pathname.match(/\/gear\/([a-z-]+)/)
    return match ? match[1] : 'all'
  })()

  function navigateToSport(sportSlug: string) {
    if (sportSlug === 'all' || sportSlug === 'general') {
      router.push(`/${school.slug}`)
    } else {
      router.push(`/${school.slug}/gear/${sportSlug}`)
    }
  }

  const logoUrl = getLogoUrl(school.slug)

  return (
    <nav style={{
      height: 48,
      background: school.secondary_color || '#0A0A0A',
      borderBottom: '1px solid rgba(255,255,255,0.1)',
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        height: '100%',
        gap: 8,
        overflowX: 'auto',
      }}>
        {/* School badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0, marginRight: 12 }}>
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={`${school.name} logo`}
              width={32}
              height={32}
              style={{ objectFit: 'contain' }}
            />
          ) : (
            <div style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: school.primary_color,
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 14,
              fontWeight: 900,
            }}>
              {school.short_name.charAt(0)}
            </div>
          )}
          <span style={{
            color: 'white',
            fontWeight: 700,
            fontSize: 14,
            whiteSpace: 'nowrap',
          }}>
            {school.short_name}
          </span>
        </div>

        {/* Sport tabs */}
        <div style={{ display: 'flex', gap: 4, overflowX: 'auto' }}>
          <button
            onClick={() => navigateToSport('all')}
            style={{
              background: activeSport === 'all' ? school.primary_color : 'transparent',
              color: activeSport === 'all' ? 'white' : 'rgba(255,255,255,0.6)',
              fontSize: 13,
              fontWeight: 600,
              padding: '4px 12px',
              borderRadius: 20,
              border: 'none',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s',
            }}
          >
            All Gear
          </button>
          {SPORTS.filter(s => s.slug !== 'general').map(sport => (
            <button
              key={sport.slug}
              onClick={() => navigateToSport(sport.slug)}
              style={{
                background: activeSport === sport.slug ? school.primary_color : 'transparent',
                color: activeSport === sport.slug ? 'white' : 'rgba(255,255,255,0.6)',
                fontSize: 13,
                fontWeight: 600,
                padding: '4px 12px',
                borderRadius: 20,
                border: 'none',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s',
              }}
            >
              {sport.name}
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}
