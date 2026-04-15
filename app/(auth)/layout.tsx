import Link from 'next/link'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-dvh flex flex-col items-center justify-center px-6"
      style={{ background: 'var(--color-ground)' }}
    >
      <div className="w-full max-w-sm">
        <Link
          href="/"
          className="block text-center font-display font-bold text-xl mb-10 tracking-widest"
          style={{ color: 'var(--color-principal)', letterSpacing: '0.25em' }}
        >
          AURA HQ
        </Link>
        {children}
      </div>
    </div>
  )
}
