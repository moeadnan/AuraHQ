'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import type { Agent, Profile, AgentType } from '@/types'
import { getNodeState, relativeTime } from '@/lib/utils'
import { AgentSignature } from './AgentSignature'
import { AgentMiniChat } from './AgentMiniChat'
import { createClient } from '@/lib/supabase/client'
import { DOMAINS, DOMAIN_AGENTS } from '@/lib/agents/definitions'

// Frame shape per agent role — color filters removed, real image variants used instead
const AGENT_STYLES: Record<AgentType, {
  borderRadius: string
  borderColor: string
  shadow?: string
}> = {
  Manuscript: { borderRadius: '5px',              borderColor: 'rgba(92,74,56,0.45)' },
  Counsel:    { borderRadius: '1px',              borderColor: 'rgba(42,38,32,0.55)',  shadow: '2px 2px 0 rgba(42,38,32,0.12)' },
  Dispatch:   { borderRadius: '7px 1px 7px 1px', borderColor: 'rgba(92,74,56,0.3)' },
  Ledger:     { borderRadius: '50%',              borderColor: 'rgba(184,118,42,0.55)', shadow: '0 0 0 3px rgba(184,118,42,0.1)' },
  Horizon:    { borderRadius: '50% 50% 50% 4px', borderColor: 'rgba(204,170,106,0.65)', shadow: '0 4px 14px rgba(204,170,106,0.22)' },
  Terms:      { borderRadius: '0px',              borderColor: 'rgba(42,38,32,0.5)',   shadow: '3px 0 0 rgba(42,38,32,0.12)' },
  Mirror:     { borderRadius: '50%',              borderColor: 'rgba(42,38,32,0.22)' },
  Grain:      { borderRadius: '3px',              borderColor: 'rgba(138,126,114,0.45)' },
  Meridian:   { borderRadius: '50%',              borderColor: 'rgba(184,118,42,0.65)', shadow: '0 0 0 4px rgba(184,118,42,0.1), 0 0 0 8px rgba(184,118,42,0.04)' },
}


const DOMAIN_META: Record<string, { short: string; label: string; color: string }> = {
  'Work':            { short: 'WORK',   label: 'Work',   color: 'var(--color-secondary)' },
  'Money':           { short: 'MONEY',  label: 'Money',  color: 'var(--color-principal)' },
  'Personal Growth': { short: 'GROWTH', label: 'Growth', color: 'var(--color-resolution)' },
}

const AVATAR_SIZE = 68

interface HQViewProps {
  profile: Profile
  agents: Agent[]
}

// ── Styled avatar — loads per-agent variant, falls back to base avatar ────────
function StyledAvatar({ avatarUrl, name, agentType, userId }: {
  avatarUrl: string | null
  name: string
  agentType: AgentType
  userId: string
}) {
  const s = AGENT_STYLES[agentType]

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  // Each agent type has its own variant: avatar_manuscript.png, avatar_counsel.png, etc.
  const variantUrl = supabaseUrl && userId
    ? `${supabaseUrl}/storage/v1/object/public/avatars/${userId}/avatar_${agentType.toLowerCase()}.png`
    : avatarUrl

  const [imgSrc, setImgSrc] = useState<string | null>(variantUrl ?? avatarUrl)

  useEffect(() => {
    setImgSrc(variantUrl ?? avatarUrl)
  }, [variantUrl, avatarUrl])

  return (
    <div
      className="relative overflow-hidden flex-shrink-0"
      style={{
        width: AVATAR_SIZE,
        height: AVATAR_SIZE,
        borderRadius: s.borderRadius,
        border: `1.5px solid ${s.borderColor}`,
        boxShadow: s.shadow,
      }}
    >
      {imgSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imgSrc}
          alt={name}
          onError={() => setImgSrc(avatarUrl)}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div
          className="absolute inset-0 flex items-center justify-center font-display font-light"
          style={{ background: 'var(--color-structural)', color: 'var(--color-principal)', fontSize: '24px' }}
        >
          {name?.[0]?.toUpperCase() || '◈'}
        </div>
      )}
      <div className="absolute bottom-1 right-1" style={{ width: 16, height: 16, opacity: 0.7, pointerEvents: 'none' }}>
        <AgentSignature agentType={agentType} size={16} />
      </div>
    </div>
  )
}

// ── Filled agent card ────────────────────────────────────────────────────────
function FilledCard({ agent, profile, onOpenChat }: { agent: Agent; profile: Profile; onOpenChat: () => void }) {
  const state = getNodeState(agent.last_used_at)
  const dotColor =
    state === 'active' ? 'var(--color-principal)' :
    state === 'quiet'  ? 'var(--color-text-secondary)' :
                         'var(--color-structural)'
  return (
    <div className="block group w-full relative cursor-pointer" onClick={onOpenChat}>
      <div
        className="flex flex-col items-center py-3 px-3 rounded-lg transition-all duration-200 w-full"
        style={{ background: 'var(--color-surface)', border: '1px solid var(--color-structural)', boxShadow: 'var(--shadow-surface)' }}
      >
        <div className="transition-transform duration-200 group-hover:scale-[1.03]">
          <StyledAvatar avatarUrl={profile.avatar_url} name={profile.name || 'You'} agentType={agent.agent_type} userId={profile.id} />
        </div>
        <p className="text-center leading-tight mt-2 font-medium truncate w-full"
          style={{ color: 'var(--color-text-primary)', fontSize: '12px' }}>
          {agent.name}
        </p>
        <div className="flex items-center gap-1 mt-1 w-full justify-center">
          <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: dotColor }} />
          {agent.status_text ? (
            <p className="truncate text-center" style={{ color: 'var(--color-text-tertiary)', fontSize: '10px' }}>
              {agent.status_text}
            </p>
          ) : (
            <p style={{ color: 'var(--color-text-tertiary)', fontSize: '10px' }}>{relativeTime(agent.last_used_at)}</p>
          )}
        </div>
      </div>
      {/* Hover shortcut to full workspace */}
      <Link
        href={`/agents/${agent.id}`}
        className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 w-5 h-5 flex items-center justify-center rounded text-xs transition-opacity"
        style={{ background: 'rgba(200,146,42,0.12)', color: 'var(--color-principal)', textDecoration: 'none' }}
        onClick={e => e.stopPropagation()}
        title="Open workspace"
      >
        ↗
      </Link>
    </div>
  )
}

// ── Vacancy card ─────────────────────────────────────────────────────────────
function VacancyCard({ agentType }: { agentType: AgentType }) {
  const s = AGENT_STYLES[agentType]
  return (
    <Link href="/agents/new" className="block group w-full">
      <div
        className="flex flex-col items-center py-3 px-3 rounded-lg w-full transition-all duration-200 group-hover:opacity-70"
        style={{ opacity: 0.42, border: '1px dashed rgba(92,74,56,0.2)' }}
      >
        <div className="flex items-center justify-center"
          style={{ width: AVATAR_SIZE, height: AVATAR_SIZE, borderRadius: s.borderRadius, border: '1px dashed rgba(92,74,56,0.28)', background: 'rgba(92,74,56,0.04)' }}>
          <AgentSignature agentType={agentType} size={28} />
        </div>
        <p className="text-center leading-tight mt-2 italic truncate w-full"
          style={{ color: 'var(--color-text-tertiary)', fontSize: '12px' }}>
          {agentType}
        </p>
        <p style={{ color: 'var(--color-principal)', fontSize: '10px', marginTop: '3px' }}>+ Appoint</p>
      </div>
    </Link>
  )
}

// ── Domain column ─────────────────────────────────────────────────────────────
function DomainColumn({ domain, agents, profile, onOpenChat }: { domain: string; agents: Agent[]; profile: Profile; onOpenChat: (agent: Agent) => void }) {
  const meta = DOMAIN_META[domain]
  const domainAgents = DOMAIN_AGENTS[domain]
  const filledInDomain = domainAgents.filter(t => agents.some(a => a.agent_type === t)).length

  return (
    <div className="flex flex-col items-center">
      {/* Vertical drop from crossbar */}
      <div className="w-px h-8" style={{ background: 'var(--color-structural)' }} />

      {/* Domain header node */}
      <div
        className="w-full rounded-lg px-3 py-2 text-center"
        style={{ background: 'var(--color-surface)', border: `1px solid ${meta.color}`, boxShadow: 'var(--shadow-surface)' }}
      >
        <p className="font-sans font-medium tracking-widest uppercase"
          style={{ color: meta.color, fontSize: '10px', letterSpacing: '0.16em' }}>
          {meta.label}
        </p>
        <p style={{ color: 'var(--color-text-tertiary)', fontSize: '10px', marginTop: '2px' }}>
          {filledInDomain}/{domainAgents.length}
        </p>
      </div>

      {/* Agents stacked with connecting lines */}
      {domainAgents.map((agentType) => {
        const agent = agents.find(a => a.agent_type === agentType)
        return (
          <div key={agentType} className="flex flex-col items-center w-full">
            <div className="w-px h-5" style={{ background: 'var(--color-structural)' }} />
            {agent
              ? <FilledCard agent={agent} profile={profile} onOpenChat={() => onOpenChat(agent)} />
              : <VacancyCard agentType={agentType} />}
          </div>
        )
      })}
    </div>
  )
}

// ── Main HQ view ─────────────────────────────────────────────────────────────
export function HQView({ profile, agents }: HQViewProps) {
  const router = useRouter()
  const [signingOut, setSigningOut] = useState(false)
  const [openPanels, setOpenPanels] = useState<{ id: string; agent: Agent; minimized: boolean }[]>([])

  async function handleSignOut() {
    setSigningOut(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  function openPanel(agent: Agent) {
    setOpenPanels(prev => {
      if (prev.some(p => p.id === agent.id)) {
        // Already open — un-minimize
        return prev.map(p => p.id === agent.id ? { ...p, minimized: false } : p)
      }
      // Add new panel, cap at 3
      const next = [...prev, { id: agent.id, agent, minimized: false }]
      return next.slice(-3)
    })
  }

  function closePanel(agentId: string) {
    setOpenPanels(prev => prev.filter(p => p.id !== agentId))
  }

  function toggleMinimize(agentId: string) {
    setOpenPanels(prev => prev.map(p => p.id === agentId ? { ...p, minimized: !p.minimized } : p))
  }

  const filledCount = agents.length

  return (
    <div className="min-h-dvh flex flex-col" style={{ background: 'var(--color-ground)' }}>
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 flex-shrink-0"
        style={{ background: 'var(--color-chrome)', borderBottom: '1px solid var(--color-chrome-border)' }}>
        <span className="font-display font-bold text-lg tracking-widest"
          style={{ color: 'var(--color-principal)', letterSpacing: '0.2em' }}>
          AURA HQ
        </span>
        <button onClick={handleSignOut} disabled={signingOut} className="text-xs"
          style={{ color: 'rgba(255,255,255,0.38)', background: 'none', border: 'none', cursor: 'pointer' }}>
          Sign out
        </button>
      </header>

      {/* Org chart */}
      <main className="flex-1 overflow-y-auto px-6 pt-8 pb-16">
        <div className="max-w-2xl mx-auto">

          {/* ── CEO node ────────────────────────────────────────────────────── */}
          <div className="flex flex-col items-center">
            <div className="relative overflow-hidden rounded-full flex-shrink-0"
              style={{ width: 96, height: 96, boxShadow: '0 0 0 2px var(--color-principal), 0 0 0 6px rgba(184,118,42,0.1)' }}>
              {profile.avatar_url ? (
                <Image src={profile.avatar_url} alt={profile.name || 'You'} fill className="object-cover" priority />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-display-xl text-4xl font-light"
                  style={{ background: 'var(--color-structural)', color: 'var(--color-principal)' }}>
                  {profile.name?.[0]?.toUpperCase() || '◈'}
                </div>
              )}
            </div>
            <p className="font-display-xl font-light text-xl mt-3" style={{ color: 'var(--color-primary)' }}>
              {profile.name}
            </p>
            <div className="flex items-center gap-2 mt-2 px-3 py-1.5 rounded-full"
              style={{ background: 'rgba(184,118,42,0.07)', border: '1px solid rgba(184,118,42,0.16)' }}>
              <span style={{ color: 'var(--color-principal)', fontSize: '11px', fontWeight: 500 }}>
                {filledCount === 0 ? '9 positions available' : `${filledCount} of 9 filled`}
              </span>
              <div className="flex gap-0.5">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="rounded-full" style={{ width: 4, height: 4, background: i < filledCount ? 'var(--color-principal)' : 'rgba(184,118,42,0.2)' }} />
                ))}
              </div>
            </div>
          </div>

          {/* ── Trunk line ──────────────────────────────────────────────────── */}
          <div className="flex justify-center">
            <div className="w-px h-8" style={{ background: 'var(--color-structural)' }} />
          </div>

          {/* ── Three domain columns with horizontal crossbar ───────────────── */}
          <div className="relative grid grid-cols-3">
            {/* Horizontal crossbar connecting the three column stubs */}
            <div className="absolute top-0 h-px pointer-events-none"
              style={{ left: 'calc(100% / 6)', right: 'calc(100% / 6)', background: 'var(--color-structural)' }} />

            {DOMAINS.map(domain => (
              <div key={domain} className="px-3">
                <DomainColumn domain={domain} agents={agents} profile={profile} onOpenChat={openPanel} />
              </div>
            ))}
          </div>

        </div>
      </main>

      {/* ── Bottom chat dock ─────────────────────────────────────────────────── */}
      {openPanels.length > 0 && (
        <div
          className="fixed bottom-0 right-4 flex items-end gap-2 z-50"
          style={{ pointerEvents: 'none' }}
        >
          {[...openPanels].reverse().map(panel => (
            <div key={panel.id} style={{ pointerEvents: 'auto' }}>
              <AgentMiniChat
                agent={panel.agent}
                minimized={panel.minimized}
                onToggleMinimize={() => toggleMinimize(panel.id)}
                onClose={() => closePanel(panel.id)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
