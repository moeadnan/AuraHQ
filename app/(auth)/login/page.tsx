'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

const DEV_EMAIL = 'dev@aurahq.local'
const DEV_PASSWORD = 'devpass123'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function devLogin(destination: '/onboarding' | '/hq') {
    const supabase = createClient()
    await supabase.auth.signInWithPassword({ email: DEV_EMAIL, password: DEV_PASSWORD })
    router.push(destination)
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      setError('Invalid email or password.')
      setLoading(false)
      return
    }

    // Check if onboarding is complete
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('onboarding_completed')
        .eq('id', user.id)
        .single()

      router.push(profile?.onboarding_completed ? '/hq' : '/onboarding')
    }
  }

  return (
    <div className="relative">
      {/* Dev shortcuts */}
      <div className="absolute -top-8 -right-2 flex gap-2">
        <button
          type="button"
          onClick={() => devLogin('/onboarding')}
          className="text-xs px-3 py-1.5 rounded"
          style={{
            background: 'var(--color-raised)',
            border: '1px solid rgba(184, 118, 42, 0.4)',
            color: 'var(--color-principal)',
            cursor: 'pointer',
          }}
        >
          Onboarding →
        </button>
        <button
          type="button"
          onClick={() => devLogin('/hq')}
          className="text-xs px-3 py-1.5 rounded"
          style={{
            background: 'var(--color-raised)',
            border: '1px solid rgba(184, 118, 42, 0.4)',
            color: 'var(--color-principal)',
            cursor: 'pointer',
          }}
        >
          Sign in →
        </button>
      </div>
      <h1
        className="font-display font-normal text-2xl text-center mb-2"
        style={{ color: 'var(--color-primary)' }}
      >
        Return to your HQ
      </h1>
      <p className="text-center text-sm mb-8" style={{ color: 'var(--color-text-tertiary)' }}>
        Your agents are waiting.
      </p>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-xs font-medium mb-1.5 tracking-wide"
            style={{ color: 'var(--color-text-tertiary)' }}
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className="input-field"
            autoComplete="email"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-xs font-medium mb-1.5 tracking-wide"
            style={{ color: 'var(--color-text-tertiary)' }}
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Your password"
            required
            className="input-field"
            autoComplete="current-password"
          />
        </div>

        {error && (
          <p className="text-sm" style={{ color: '#c0392b' }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full mt-2"
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <p className="text-center text-sm mt-6" style={{ color: 'var(--color-text-tertiary)' }}>
        No account yet?{' '}
        <Link href="/signup" style={{ color: 'var(--color-principal-light)' }}>
          Build your HQ
        </Link>
      </p>
    </div>
  )
}
