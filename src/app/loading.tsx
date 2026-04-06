export default function Loading() {
  return (
    <main className="container" style={{ padding: '48px 20px' }}>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
      `}</style>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 16,
      }}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            style={{
              background: '#F0F0F0',
              borderRadius: 'var(--radius-md)',
              aspectRatio: '3/4',
              animation: 'pulse 1.5s ease-in-out infinite',
            }}
          />
        ))}
      </div>
    </main>
  )
}
