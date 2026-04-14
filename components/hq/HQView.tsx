'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import type { Agent, Profile } from '@/types'
import { getNodeState, relativeTime } from '@/lib/utils'
import { AgentSignature } from './AgentSignature'
import { createClient } from '@/lib/supabase/client'

interface HQViewProps {
  profile: Profile
  agents: Agent[]
}

export function HQView({ profile, agents }: HQViewProps) {
  const router = useRouter()
  const [signingOut, setSigningOut] = useState(false)

  async function handleSignOut() {
    setSigningOut(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  // Build ambient status from agent activity
  function buildAmbientStatus(): string {
    if (agents.length === 0) return 'Your HQ is ready. Build your first agent.'

    const sorted = [...agents].sort((a, b) => {
      if (!a.last_used_at) return 1
      if (!b.last_used_at) return -1
      return new Date(b.last_used_at).getTime() - new Date(a.last_used_at).getTime()
    })

    const active = sorted.find(a => a.last_used_at)
    const inactive = sorted.find(a => {
      if (!a.last_used_at) return false
      const days = (Date.now() - new Date(a.last_used_at).getTime()) / (1000 * 60 * 60 * 24)
      return days > 7
    })

    if (active && inactive && active.id !== inactive.id) {
      return `${active.name} — ${relativeTime(active.last_used_at)}. ${inactive.name} — ${relativeTime(inactive.last_used_at)}.`
    }
    if (active) {
      return `${active.name} — last used ${relativeTime(active.last_used_at)}.`
    }
    return 'Your agents are ready. Select one to begin.'
  }

  return (
    <div
      className="min-h-dvh flex flex-col"
      style={{ background: 'var(--color-ground)' }}
    >
      {/* Top bar */}
      <header className="flex items-center justify-between px-6 pt-6 pb-2">
        <span
          className="font-display font-light text-sm tracking-widest"
          style={{ color: 'var(--color-principal)', letterSpacing: '0.2em' }}
        >
          AURA HQ
        </span>
        <button
          onClick={handleSignOut}
          disabled={signingOut}
          className="text-xs"
          style={{ color: 'var(--color-text-tertiary)', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          Sign out
        </button>
      </header>

      {/* HQ Structure */}
      <main className="flex-1 flex flex-col items-center justify-start px-6 pt-10 pb-12">

        {/* Principal node */}
        <div className="flex flex-col items-center mb-2">
          <div
            className="relative rounded-full overflow-hidden mb-3"
            style={{
              width: 96,
              height: 96,
              boxShadow: '0 0 0 2px var(--color-principal)',
            }}
          >
            {profile.avatar_url ? (
              <Image
                src={profile.avatar_url}
                alt={profile.name || 'You'}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center font-display text-3xl font-light"
                style={{ background: 'var(--color-structural)', color: 'var(--color-principal)' }}
              >
                {profile.name?.[0]?.toUpperCase() || '◈'}
              </div>
            )}
          </div>

          <p
            className="font-display font-light text-principal text-center"
            style={{ color: 'var(--color-surface)' }}
          >
            {profile.name}
          </p>

          {/* Ambient status */}
          <p
            className="text-ambient text-center mt-1 max-w-xs"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            {buildAmbientStatus()}
          </p>
        </div>

        {/* Connection line from principal */}
        {agents.length > 0 && (
          <div
            className="w-px h-8 my-2"
            style={{ background: 'var(--color-structural)' }}
          />
        )}

        {/* Agent nodes row */}
        <div className="flex flex-wrap justify-center gap-4 mt-2 max-w-2xl">
          {agents.map((agent) => {
            const state = getNodeState(agent.last_used_at)
            return (
              <Link key={agent.id} href={`/agents/${agent.id}`}>
                <div className={`agent-node agent-node--${state} flex flex-col items-center justify-between p-3`}>
                  {/* Visual signature */}
                  <div className="flex-1 flex items-center justify-center w-full">
                    <AgentSignature agentType={agent.agent_type} size={64} />
                  </div>

                  {/* Agent name */}
                  <div className="w-full mt-2">
                    <p
                      className="text-xs font-medium text-center leading-tight"
                      style={{ color: 'var(--color-text-primary)' }}
                    >
                      {agent.name}
                    </p>
                    <p
                      className="text-xs text-center mt-0.5"
                      style={{ color: 'var(--color-text-tertiary)', fontSize: '10px' }}
                    >
                      {agent.domain}
                    </p>
                  </div>

                  {/* Activity dot */}
                  {state !== 'incomplete' && (
                    <div
                      className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full"
                      style={{
                        background:
                          state === 'active' ? 'var(--color-principal)' :
                          state === 'quiet' ? 'var(--color-text-secondary)' :
                          'var(--color-structural)',
                      }}
                    />
                  )}
                </div>
              </Link>
            )
          })}

          {/* Add agent node */}
          {agents.length < 4 && (
            <Link href="/agents/new">
              <div
                className="agent-node agent-node--incomplete flex flex-col items-center justify-center gap-2 cursor-pointer"
                style={{ border: '1px dashed rgba(184, 118, 42, 0.3)' }}
              >
                <span
                  className="text-2xl"
                  style={{ color: 'var(--color-principal)' }}
                >
                  +
                </span>
                <span
                  className="text-xs text-center"
                  style={{ color: 'var(--color-text-tertiary)' }}
                >
                  Add agent
                </span>
              </div>
            </Link>
          )}
        </div>

        {/* Timestamp layer — last used per agent */}
        {agents.length > 0 && (
          <div className="mt-8 space-y-1 text-center">
            {agents.map(a => (
              <p key={a.id} className="text-ambient" style={{ color: 'var(--color-text-tertiary)' }}>
                {a.name} · {relativeTime(a.last_used_at)}
              </p>
            ))}
          </div>
        )}

        {/* Empty state */}
        {agents.length === 0 && (
          <div className="mt-10 text-center max-w-xs">
            <p
              className="font-display font-light text-xl mb-2"
              style={{ color: 'var(--color-surface)' }}
            >
              Build your first agent
            </p>
            <p className="text-sm mb-6" style={{ color: 'var(--color-text-secondary)' }}>
              Each agent you create becomes part of your AI system — scoped, named, and holding your context.
            </p>
            <Link href="/agents/new" className="btn-primary">
              Create an agent
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}
