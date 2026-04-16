'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface Connection {
  email: string
  connected_at: string
}

interface ConnectionsState {
  google?: Connection
}

const AGENT_USES: Record<string, string[]> = {
  google: ['Dispatch (read + draft email)', 'Manuscript (read email context)'],
}

export function ConnectionsView() {
  const searchParams = useSearchParams()
  const [connections, setConnections] = useState<ConnectionsState>({})
  const [loading, setLoading] = useState(true)
  const [connecting, setConnecting] = useState<string | null>(null)
  const [banner, setBanner] = useState<{ kind: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    // Show banner from OAuth redirect query params
    const connected = searchParams.get('connected')
    const error = searchParams.get('error')
    if (connected) setBanner({ kind: 'success', text: `${connected.charAt(0).toUpperCase() + connected.slice(1)} connected successfully.` })
    if (error) setBanner({ kind: 'error', text: error === 'google_denied' ? 'Google access was denied.' : 'Something went wrong. Try again.' })
  }, [searchParams])

  async function authHeaders(): Promise<HeadersInit> {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()
    return session?.access_token
      ? { 'Authorization': `Bearer ${session.access_token}` }
      : {}
  }

  useEffect(() => {
    ;(async () => {
      try {
        const headers = await authHeaders()
        const r = await fetch('/api/connect/status', { headers })
        const data = await r.json()
        setConnections(data.connections || {})
      } catch {
        // ignore
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  async function connectGoogle() {
    setConnecting('google')
    try {
      const headers = await authHeaders()
      const res = await fetch('/api/connect/google', { headers })
      const data = await res.json()
      if (data.auth_url) {
        window.location.href = data.auth_url
      }
    } catch {
      setBanner({ kind: 'error', text: 'Failed to start Google connection.' })
      setConnecting(null)
    }
  }

  async function disconnectGoogle() {
    const headers = await authHeaders()
    await fetch('/api/connect/google', { method: 'DELETE', headers })
    setConnections(prev => { const n = { ...prev }; delete n.google; return n })
    setBanner({ kind: 'success', text: 'Google disconnected.' })
  }

  return (
    <div className="min-h-dvh flex flex-col" style={{ background: 'var(--color-ground)' }}>
      <header
        className="flex items-center justify-between px-6 py-4 flex-shrink-0"
        style={{ background: 'var(--color-chrome)', borderBottom: '1px solid var(--color-chrome-border)' }}
      >
        <span className="font-display font-bold text-lg tracking-widest"
          style={{ color: 'var(--color-principal)', letterSpacing: '0.2em' }}>
          AURA HQ
        </span>
        <Link href="/hq" className="text-xs" style={{ color: 'rgba(255,255,255,0.38)' }}>
          ← Back to HQ
        </Link>
      </header>

      <main className="flex-1 px-6 py-8 max-w-xl mx-auto w-full">
        <p className="font-display text-2xl font-light mb-1" style={{ color: 'var(--color-primary)' }}>
          Connections
        </p>
        <p className="text-sm mb-8" style={{ color: 'var(--color-text-tertiary)' }}>
          Connect your accounts so your agents can read and act on your behalf.
        </p>

        {/* Banner */}
        {banner && (
          <div
            className="mb-6 px-4 py-3 rounded-lg text-sm"
            style={{
              background: banner.kind === 'success' ? 'rgba(200,146,42,0.08)' : 'rgba(180,40,40,0.08)',
              border: `1px solid ${banner.kind === 'success' ? 'rgba(200,146,42,0.25)' : 'rgba(180,40,40,0.25)'}`,
              color: banner.kind === 'success' ? 'var(--color-principal)' : '#b42828',
            }}
          >
            {banner.text}
          </div>
        )}

        {loading ? (
          <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>Loading…</p>
        ) : (
          <div className="space-y-4">
            {/* Google */}
            <div
              className="rounded-xl p-5"
              style={{ background: 'var(--color-surface)', border: '1px solid var(--color-structural)' }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 min-w-0">
                  {/* Google icon */}
                  <div
                    className="w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center text-base font-bold"
                    style={{ background: 'var(--color-chrome)', color: 'var(--color-principal)' }}
                  >
                    G
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-sm" style={{ color: 'var(--color-primary)' }}>
                      Google
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-tertiary)' }}>
                      Gmail · Calendar · Contacts
                    </p>
                    {connections.google ? (
                      <p className="text-xs mt-1" style={{ color: 'var(--color-principal)' }}>
                        ● {connections.google.email}
                      </p>
                    ) : (
                      <p className="text-xs mt-1" style={{ color: 'var(--color-text-tertiary)' }}>
                        Not connected
                      </p>
                    )}
                    {/* Which agents use this */}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {AGENT_USES.google.map(use => (
                        <span
                          key={use}
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{ background: 'rgba(200,146,42,0.08)', color: 'var(--color-principal)', border: '1px solid rgba(200,146,42,0.18)' }}
                        >
                          {use}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  {connections.google ? (
                    <button
                      onClick={disconnectGoogle}
                      className="text-xs px-3 py-1.5 rounded-lg"
                      style={{ background: 'transparent', border: '1px solid var(--color-structural)', color: 'var(--color-text-tertiary)', cursor: 'pointer' }}
                    >
                      Disconnect
                    </button>
                  ) : (
                    <button
                      onClick={connectGoogle}
                      disabled={connecting === 'google'}
                      className="btn-primary text-xs py-2 px-4"
                    >
                      {connecting === 'google' ? 'Opening…' : 'Connect'}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* More integrations coming */}
            <div
              className="rounded-xl p-5 opacity-40"
              style={{ border: '1px dashed var(--color-structural)' }}
            >
              <p className="text-sm font-medium" style={{ color: 'var(--color-primary)' }}>
                More integrations coming
              </p>
              <p className="text-xs mt-1" style={{ color: 'var(--color-text-tertiary)' }}>
                Notion · Slack · GitHub · Apple Health
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
