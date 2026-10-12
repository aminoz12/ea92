'use client'

// Custom global error boundary. Besides being good practice, defining our own
// global-error works around a Next.js 15.5 bug where the built-in
// global-error module fails to resolve in the React Client Manifest
// ("Could not find the module .../builtin/global-error.js# ...").
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="fr">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
          background: '#f9fafb',
          color: '#1f2937',
          padding: '24px',
        }}
      >
        <div style={{ maxWidth: 480, textAlign: 'center' }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>
            Une erreur est survenue
          </h1>
          <p style={{ color: '#6b7280', marginBottom: 24 }}>
            Désolé, un problème est survenu. Veuillez réessayer.
          </p>
          <button
            onClick={() => reset()}
            style={{
              background: '#dc2626',
              color: '#fff',
              border: 'none',
              borderRadius: 12,
              padding: '12px 24px',
              fontWeight: 700,
              fontSize: 16,
              cursor: 'pointer',
            }}
          >
            Réessayer
          </button>
        </div>
      </body>
    </html>
  )
}
