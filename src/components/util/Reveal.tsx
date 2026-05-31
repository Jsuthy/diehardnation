'use client'

import { useEffect, useRef } from 'react'

// Fades + slides children in when they scroll into view (once).
export default function Reveal({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) { el.classList.add('is-visible'); io.disconnect() }
        })
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return <div ref={ref} className="dhn-reveal" style={style}>{children}</div>
}
