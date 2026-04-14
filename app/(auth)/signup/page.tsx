'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      },
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    // Update profile name immediately
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase.from('profiles').update({ name }).eq('id', user.id)
    }

    router.push('/onboarding')
  }

  return (
    <div>
      <h1
        className="font-display font-light text-2xl text-center mb-2"
        style={{ color: 'var(--color-surface)' }}
      >
        Begin your HQ
      </h1>
      <p className="text-center text-sm mb-8" style={{ color: 'var(--color-text-tertiary)' }}>
        14-day free trial. No card needed.
      </p>

      <form onSubmit={handleSignup} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-xs font-medium mb-1.5 tracking-wide"
            style={{ color: 'var(--color-text-tertiary)' }}
          >
            Your name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="First name is fine"
            required
            className="input-field"
            autoComplete="given-name"
          />
        </div>

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
            placeholder="At least 8 characters"
            required
            minLength={8}
            className="input-field"
            autoComplete="new-password"
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
          {loading ? 'Creating your account…' : 'Create account'}
        </button>
      </form>

      <p className="text-center text-sm mt-6" style={{ color: 'var(--color-text-tertiary)' }}>
        Already have an account?{' '}
        <Link href="/login" style={{ color: 'var(--color-principal-light)' }}>
          Sign in
        </Link>
      </p>
    </div>
  )
}
