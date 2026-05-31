'use client'

import { useEffect, useState } from 'react'

export default function Countdown({ date }: { date: string | null }) {
  const [days, setDays] = useState<number | null>(null)

  useEffect(() => {
    if (!date) return
    const target = new Date(date).getTime()
    const update = () => {
      const diff = target - Date.now()
      setDays(Math.max(0, Math.ceil(diff / 86400000)))
    }
    update()
    const id = setInterval(update, 3600000)
    return () => clearInterval(id)
  }, [date])

  if (!date || days === null) return null

  return (
    <div style={{ display: 'inline-flex', alignItems: 'baseline', gap: 8, marginTop: 12 }}>
      <span style={{ fontSize: 40, fontWeight: 900, lineHeight: 1, color: '#fff' }}>{days}</span>
      <span style={{ fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.85)' }}>
        {days === 0 ? 'happening now' : days === 1 ? 'day to go' : 'days to go'}
      </span>
    </div>
  )
}
