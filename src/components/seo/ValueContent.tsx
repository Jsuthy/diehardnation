// Renders the value-add content engine output: data-driven content blocks and
// an SEO-friendly FAQ accordion. Pure server component using native <details>
// so the content is fully in the HTML (crawlable, no client JS) and the FAQ
// stays collapsible for users. Pair with buildFaqSchema() for matching JSON-LD.

import type { ContentBlock } from '@/lib/seo/content-blocks'

export function ContentSection({ block }: { block: ContentBlock }) {
  return (
    <section className="container" style={{ padding: '28px 20px' }}>
      <h2 style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-0.02em', marginBottom: 14 }}>
        {block.heading}
      </h2>
      {block.paragraphs.map((p, i) => (
        <p
          key={i}
          style={{
            fontSize: 15,
            lineHeight: 1.7,
            color: 'var(--text-secondary)',
            maxWidth: 760,
            marginBottom: 12,
          }}
        >
          {p}
        </p>
      ))}
    </section>
  )
}

export function FaqSection({
  faqs,
  heading = 'Frequently Asked Questions',
}: {
  faqs: { question: string; answer: string }[]
  heading?: string
}) {
  if (!faqs.length) return null
  return (
    <section className="container" style={{ padding: '28px 20px' }} aria-label={heading}>
      <h2 style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-0.02em', marginBottom: 16 }}>
        {heading}
      </h2>
      <div style={{ maxWidth: 760 }}>
        {faqs.map((f, i) => (
          <details
            key={i}
            style={{
              borderBottom: '1px solid var(--border)',
              padding: '14px 0',
            }}
          >
            <summary
              style={{
                fontSize: 15,
                fontWeight: 700,
                cursor: 'pointer',
                listStyle: 'none',
                color: 'var(--text-primary)',
              }}
            >
              {f.question}
            </summary>
            <p
              style={{
                fontSize: 14,
                lineHeight: 1.7,
                color: 'var(--text-secondary)',
                marginTop: 10,
              }}
            >
              {f.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  )
}
