import Link from 'next/link'

export default function LandingPage() {
  return (
    <main className="min-h-dvh flex flex-col" style={{ background: 'var(--color-ground)' }}>
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-6">
        <span
          className="font-display text-xl tracking-widest"
          style={{ color: 'var(--color-principal)', letterSpacing: '0.25em' }}
        >
          AURA HQ
        </span>
        <Link
          href="/login"
          className="text-sm"
          style={{ color: 'var(--color-text-tertiary)' }}
        >
          Sign in
        </Link>
      </header>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 text-center max-w-2xl mx-auto">
        <p
          className="text-sm font-medium tracking-widest uppercase mb-8"
          style={{ color: 'var(--color-principal)', letterSpacing: '0.2em' }}
        >
          Personal AI infrastructure
        </p>

        <h1
          className="font-display font-light leading-tight mb-6"
          style={{
            fontSize: 'clamp(42px, 6vw, 72px)',
            color: 'var(--color-surface)',
            letterSpacing: '0.02em',
            lineHeight: 1.15,
          }}
        >
          Build your AI system
          <br />
          <em style={{ color: 'var(--color-principal)' }}>around you</em>
        </h1>

        <p
          className="text-base leading-relaxed mb-12 max-w-lg"
          style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-sans)' }}
        >
          You at the top. Agents built beneath you. Each one scoped, named, and holding your context.
          The first AI that works for you — not beside you.
        </p>

        <Link href="/signup" className="btn-primary text-base px-10 py-4">
          Build your HQ
        </Link>

        <p
          className="text-xs mt-4"
          style={{ color: 'var(--color-text-tertiary)' }}
        >
          14-day free trial · No credit card required
        </p>
      </section>

      {/* Feature strip */}
      <section className="px-8 pb-16 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto w-full">
        {[
          {
            label: 'Your portrait at the top',
            description: 'AI transforms your photo into a stylized portrait. You become the apex of your own structure.',
          },
          {
            label: 'Agents built for you',
            description: 'Create agents across Work, Money, and Personal Growth. Each holds your context and deepens with use.',
          },
          {
            label: 'A system, not a chat',
            description: 'Not a conversation box. A visual hierarchy of intelligence organized around your life.',
          },
        ].map((f) => (
          <div key={f.label} className="p-6 rounded-lg" style={{ background: 'rgba(42, 38, 32, 0.4)', border: '1px solid rgba(42, 38, 32, 0.6)' }}>
            <p
              className="font-display font-light text-lg mb-2"
              style={{ color: 'var(--color-surface)', letterSpacing: '0.01em' }}
            >
              {f.label}
            </p>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
              {f.description}
            </p>
          </div>
        ))}
      </section>
    </main>
  )
}
