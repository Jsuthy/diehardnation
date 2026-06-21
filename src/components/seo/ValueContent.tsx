// Renders the value-add content engine output: data-driven content blocks and
// an SEO-friendly FAQ accordion. Pure server component using native <details>
// so the content is fully in the HTML (crawlable, no client JS) and the FAQ
// stays collapsible for users. Pair with buildFaqSchema() for matching JSON-LD.

import type { ContentBlock, QuickAnswer } from '@/lib/seo/content-blocks'

// Self-contained answer box, placed high on the page. Format (short direct
// answer + scannable key facts) is what AI answer engines extract and cite.
export function QuickAnswerBox({ qa, label }: { qa: QuickAnswer; label: string }) {
  return (
    <section
      className="container"
      aria-label={`Quick answer: ${label}`}
      style={{ padding: '20px 20px 8px' }}
    >
      <div
        style={{
          maxWidth: 760,
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          padding: '16px 18px',
          background: 'var(--surface, #fafafa)',
        }}
      >
        <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8 }}>
          Quick Answer
        </p>
        <p style={{ fontSize: 15, lineHeight: 1.65, color: 'var(--text-primary)', marginBottom: 12 }}>
          {qa.answer}
        </p>
        <dl style={{ display: 'grid', gridTemplateColumns: 'max-content 1fr', gap: '6px 14px', margin: 0, fontSize: 13.5 }}>
          {qa.facts.map((f, i) => (
            <div key={i} style={{ display: 'contents' }}>
              <dt style={{ fontWeight: 700, color: 'var(--text-secondary)' }}>{f.label}</dt>
              <dd style={{ margin: 0, color: 'var(--text-secondary)' }}>{f.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

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
