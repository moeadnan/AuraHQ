'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { DOMAINS, DOMAIN_AGENTS, AGENT_DEFINITIONS } from '@/lib/agents/definitions'
import { AgentSignature } from '@/components/hq/AgentSignature'
import type { AgentType, Domain } from '@/types'

interface ExistingAgent {
  agent_type: string
  name: string
}

interface AgentCreationFlowProps {
  userId: string
  existingAgents: ExistingAgent[]
  ownerName: string | null
  ownerAvatarUrl: string | null
}

type Step = 'select' | 'name' | 'purpose' | 'seed-0' | 'seed-1' | 'seed-2' | 'confirm'

type ChatMsg =
  | { id: string; kind: 'system'; text: string }
  | { id: string; kind: 'user'; text: string }
  | { id: string; kind: 'picker' }
  | { id: string; kind: 'agent-card' }
  | { id: string; kind: 'capabilities'; agentType: AgentType }
  | { id: string; kind: 'question'; text: string; hint: string }

// ── Per-agent purpose examples shown as tappable suggestion chips ────────────

const PURPOSE_EXAMPLES: Record<AgentType, [string, string, string]> = {
  Manuscript: [
    'Draft and refine everything I write so it sounds exactly like me',
    'Write emails, docs, and pitches in my voice — not generic AI prose',
    'Turn my rough notes into polished writing, every time',
  ],
  Counsel: [
    'Challenge my thinking and expose blind spots before I commit',
    'Be my devil\'s advocate on every major professional decision',
    'Tell me what\'s wrong with my plan before someone else does',
  ],
  Dispatch: [
    'Draft all my difficult professional messages diplomatically',
    'Help me say hard things clearly without damaging relationships',
    'Write the communications I keep putting off or getting wrong',
  ],
  Ledger: [
    'Analyze my finances and give me an honest read, no sugar-coating',
    'Track my spending patterns and project where they lead',
    'Tell me where I\'m losing money and exactly what to do about it',
  ],
  Horizon: [
    'Hold me accountable to my financial goals with honest tracking',
    'Model the scenarios for my savings so I know what\'s realistic',
    'Keep me on track toward the financial future I\'ve described',
  ],
  Terms: [
    'Prepare me for every negotiation so I walk in knowing my position',
    'Translate contracts into plain language and flag what I should fight',
    'Help me price my work and negotiate without underselling myself',
  ],
  Mirror: [
    'Ask me the questions that produce clarity when I\'m stuck in my head',
    'Help me understand what\'s actually driving me when I feel reactive',
    'Be the honest mirror I can\'t give myself when I\'m too close to see',
  ],
  Grain: [
    'Name the patterns in my behavior before they repeat again',
    'Help me see the recurring dynamics I\'m too close to recognize',
    'Track whether the patterns I want to change are actually shifting',
  ],
  Meridian: [
    'Keep my decisions aligned with what I actually say I value',
    'Call me out when my actions drift from my stated beliefs',
    'Help me build values specific enough to actually navigate from',
  ],
}

// Brief context shown under each seed question explaining why it matters
const SEED_CONTEXT = [
  'So I know how to show up for you — not just what to say, but how.',
  'So I can aim at what actually matters to you, not just the surface task.',
  'So I know where to push and where to tread carefully.',
]


// ── Main component ───────────────────────────────────────────────────────────

export function AgentCreationFlow({ userId, existingAgents, ownerName, ownerAvatarUrl }: AgentCreationFlowProps) {
  const router = useRouter()
  const msgId = useRef(0)
  function nextId() { return String(++msgId.current) }

  const existingAgentTypes = existingAgents.map(a => a.agent_type)

  // Collected data
  const [domain, setDomain] = useState<Domain | null>(null)
  const [agentType, setAgentType] = useState<AgentType | null>(null)
  const [name, setName] = useState('')
  const [purpose, setPurpose] = useState('')
  const [seeds, setSeeds] = useState(['', '', ''])
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  // Conversation
  const [step, setStep] = useState<Step>('select')
  const [messages, setMessages] = useState<ChatMsg[]>([
    { id: '0', kind: 'system', text: 'Which role does your HQ need?' },
    { id: '1', kind: 'picker' },
  ])
  const [inputValue, setInputValue] = useState('')
  const [inputKey, setInputKey] = useState(0)

  const def = agentType ? AGENT_DEFINITIONS[agentType] : null
  const chatEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (step !== 'select' && step !== 'confirm') {
      const t = setTimeout(() => inputRef.current?.focus(), 350)
      return () => clearTimeout(t)
    }
  }, [step])

  function push(...msgs: ChatMsg[]) {
    setMessages(prev => [...prev, ...msgs])
  }

  function delayedPush(msgs: ChatMsg[], delay = 300) {
    const t = setTimeout(() => push(...msgs), delay)
    return () => clearTimeout(t)
  }

  // ── Step handlers ────────────────────────────────────────

  function handleSelectAgent(type: AgentType, d: Domain) {
    if (step !== 'select') return
    const agentDef = AGENT_DEFINITIONS[type]
    setAgentType(type)
    setDomain(d)
    setName(type)
    setStep('name')
    push({ id: nextId(), kind: 'user', text: type })
    delayedPush([
      { id: nextId(), kind: 'capabilities', agentType: type },
    ], 200)
    delayedPush([
      { id: nextId(), kind: 'system', text: `${agentDef.tagline}. Name it — default is "${type}" or make it yours.` },
    ], 700)
    setInputValue(type)
    setInputKey(k => k + 1)
  }

  function handleSubmitName() {
    const trimmed = inputValue.trim()
    if (!trimmed) return
    setName(trimmed)
    push({ id: nextId(), kind: 'user', text: trimmed })
    setStep('purpose')
    delayedPush([
      { id: nextId(), kind: 'system', text: `What does ${trimmed} do specifically for you? One clear sentence — this defines its focus permanently. Pick an example below or write your own.` },
    ])
    setInputValue('')
    setInputKey(k => k + 1)
  }

  function handleSubmitPurpose() {
    const trimmed = inputValue.trim()
    if (!def || trimmed.length < 10) return
    setPurpose(trimmed)
    push({ id: nextId(), kind: 'user', text: trimmed })
    setStep('seed-0')
    delayedPush([
      { id: nextId(), kind: 'system', text: `Good. Now give ${name} your context — 3 questions that make this yours, not a generic tool. The more honest you are, the smarter it gets.` },
    ], 300)
    delayedPush([
      { id: nextId(), kind: 'question', text: def.seedingQuestions[0], hint: SEED_CONTEXT[0] },
    ], 800)
    setInputValue('')
    setInputKey(k => k + 1)
  }

  function handleSubmitSeed(seedIndex: number) {
    const trimmed = inputValue.trim()
    if (!def || trimmed.length < 5) return
    setSeeds(prev => {
      const next = [...prev]
      next[seedIndex] = trimmed
      return next
    })
    push({ id: nextId(), kind: 'user', text: trimmed })
    setInputValue('')
    setInputKey(k => k + 1)

    if (seedIndex < 2) {
      setStep(`seed-${seedIndex + 1}` as Step)
      delayedPush([
        { id: nextId(), kind: 'question', text: def.seedingQuestions[seedIndex + 1], hint: SEED_CONTEXT[seedIndex + 1] },
      ])
    } else {
      setStep('confirm')
      delayedPush([
        { id: nextId(), kind: 'system', text: `That's ${name} built. Ready to add it to your HQ?` },
        { id: nextId(), kind: 'agent-card' },
      ], 300)
    }
  }

  async function handleCreate() {
    if (!agentType || !domain || !def) return
    setSaving(true)
    setSaveError(null)

    const supabase = createClient()
    const { data: agent, error } = await supabase
      .from('agents')
      .insert({
        user_id: userId,
        name: name.trim(),
        domain,
        agent_type: agentType,
        purpose: purpose.trim(),
        seed_answer_1: seeds[0].trim(),
        seed_answer_2: seeds[1].trim(),
        seed_answer_3: seeds[2].trim(),
        position_index: existingAgentTypes.length,
      })
      .select()
      .single()

    if (error || !agent) {
      console.error('Agent insert error:', JSON.stringify(error))
      setSaveError(error?.message ?? 'Something went wrong. Please try again.')
      setSaving(false)
      return
    }

    await supabase.from('memory_items').insert([
      { agent_id: agent.id, user_id: userId, content: `You said: "${seeds[0].trim()}"`, source: 'seed' },
      { agent_id: agent.id, user_id: userId, content: `You said: "${seeds[1].trim()}"`, source: 'seed' },
      { agent_id: agent.id, user_id: userId, content: `You said: "${seeds[2].trim()}"`, source: 'seed' },
    ])

    router.push(`/agents/${agent.id}`)
  }

  // ── Live preview values ──────────────────────────────────

  const previewName = step === 'name' ? (inputValue || agentType || '') : name
  const previewPurpose = step === 'purpose' ? inputValue : purpose
  const committedSeeds = seeds.filter(s => s.length > 0).length

  // ── Input area ───────────────────────────────────────────

  function renderInput() {
    if (step === 'select') return null

    if (step === 'name') {
      return (
        <div className="flex gap-2">
          <input
            key={inputKey}
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="text"
            value={inputValue}
            onChange={e => setInputValue(e.target.value.slice(0, 30))}
            placeholder={agentType ?? 'Agent name'}
            maxLength={30}
            className="input-field flex-1"
            style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.01em' }}
            onKeyDown={e => { if (e.key === 'Enter') handleSubmitName() }}
          />
          <button
            onClick={handleSubmitName}
            disabled={inputValue.trim().length < 1}
            className="btn-primary px-5 flex-shrink-0"
          >
            →
          </button>
        </div>
      )
    }

    if (step === 'purpose') {
      const examples = agentType ? PURPOSE_EXAMPLES[agentType] : []
      return (
        <div>
          {examples.length > 0 && (
            <div className="flex flex-col gap-1.5 mb-3">
              {examples.map((ex, i) => (
                <button
                  key={i}
                  onClick={() => { setInputValue(ex); setInputKey(k => k + 1) }}
                  className="text-left px-3 py-2 rounded-lg transition-all"
                  style={{
                    background: inputValue === ex ? 'rgba(184,118,42,0.09)' : 'var(--color-surface)',
                    border: inputValue === ex ? '1px solid rgba(184,118,42,0.35)' : '1px solid var(--color-structural)',
                    color: inputValue === ex ? 'var(--color-principal)' : 'var(--color-text-secondary)',
                    fontSize: '13px',
                    fontStyle: 'italic',
                  }}
                >
                  "{ex}"
                </button>
              ))}
            </div>
          )}
          <textarea
            key={inputKey}
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={inputValue}
            onChange={e => setInputValue(e.target.value.slice(0, 120))}
            placeholder="Or write your own one-sentence focus…"
            rows={3}
            maxLength={120}
            className="input-field mb-2"
            style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.01em', fontSize: '15px', lineHeight: 1.6 }}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmitPurpose() } }}
          />
          <div className="flex items-center justify-between">
            <span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>{inputValue.length}/120 · Shift+Enter for newline</span>
            <button
              onClick={handleSubmitPurpose}
              disabled={inputValue.trim().length < 10}
              className="btn-primary px-5 py-2 text-sm"
            >
              →
            </button>
          </div>
        </div>
      )
    }

    const seedIndex = step === 'seed-0' ? 0 : step === 'seed-1' ? 1 : step === 'seed-2' ? 2 : -1
    if (seedIndex >= 0) {
      return (
        <div>
          <textarea
            key={inputKey}
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            placeholder="Be specific — vague answers produce generic responses."
            rows={3}
            className="input-field mb-2"
            style={{ fontSize: '15px', lineHeight: 1.6 }}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmitSeed(seedIndex) } }}
          />
          <div className="flex items-center justify-between">
            <span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>Question {seedIndex + 1} of 3 · Shift+Enter for newline</span>
            <button
              onClick={() => handleSubmitSeed(seedIndex)}
              disabled={inputValue.trim().length < 5}
              className="btn-primary px-5 py-2 text-sm"
            >
              →
            </button>
          </div>
        </div>
      )
    }

    if (step === 'confirm') {
      return (
        <div>
          <button
            onClick={handleCreate}
            disabled={saving}
            className="btn-primary w-full"
          >
            {saving ? 'Building…' : 'Add to my HQ'}
          </button>
          {saveError && (
            <p className="text-xs mt-2 text-center" style={{ color: '#c0392b' }}>{saveError}</p>
          )}
        </div>
      )
    }

    return null
  }

  // ── Render ───────────────────────────────────────────────

  return (
    <div className="h-dvh flex flex-col overflow-hidden" style={{ background: 'var(--color-ground)' }}>

      {/* Header — spans full width */}
      <header
        className="flex items-center px-6 py-4 flex-shrink-0"
        style={{ background: 'var(--color-chrome)', borderBottom: '1px solid var(--color-chrome-border)' }}
      >
        <button
          onClick={() => router.push('/hq')}
          className="text-sm mr-4"
          style={{ color: 'rgba(255,255,255,0.38)', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          ← Back
        </button>
        <span
          className="font-display font-bold text-lg tracking-widest"
          style={{ color: 'var(--color-principal)', letterSpacing: '0.2em' }}
        >
          AURA HQ
        </span>
      </header>

      {/* Body: chat fills full width, config panel overlays from right */}
      <div className="relative flex flex-1 overflow-hidden">

        {/* ── Chat column — always full width ────────────────── */}
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">

          {/* Live preview strip — appears once agent type is chosen */}
          {agentType && (
            <div
              className="mx-5 mt-4 mb-1 rounded-lg px-4 py-3 flex items-center gap-3 flex-shrink-0"
              style={{ background: 'var(--color-surface)', border: '1px solid var(--color-structural)' }}
            >
              <AgentSignature agentType={agentType} size={34} />
              <div className="min-w-0 flex-1">
                <p className="font-medium text-sm leading-tight" style={{ color: 'var(--color-text-primary)' }}>
                  {previewName || agentType}
                </p>
                {previewPurpose ? (
                  <p className="text-xs italic truncate mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>
                    {previewPurpose}
                  </p>
                ) : (
                  <p className="text-xs italic mt-0.5" style={{ color: 'var(--color-text-tertiary)' }}>
                    {AGENT_DEFINITIONS[agentType].tagline}
                  </p>
                )}
              </div>
              <div className="flex gap-1.5 flex-shrink-0">
                {seeds.map((s, i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full transition-colors"
                    style={{ background: s.length > 0 ? 'var(--color-principal)' : 'var(--color-structural)' }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Chat scroll area */}
          <div className="flex-1 overflow-y-auto px-5 pb-4 pt-4">
            <div className="max-w-lg mx-auto space-y-3">

              {messages.map(msg => {

                if (msg.kind === 'system') {
                  return (
                    <div key={msg.id} className="flex items-start gap-2.5">
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ background: 'var(--color-structural)' }}
                      >
                        <span style={{ color: 'var(--color-principal)', fontSize: '10px' }}>◈</span>
                      </div>
                      <div
                        className="rounded-2xl rounded-tl-sm px-4 py-2.5 max-w-sm"
                        style={{ background: 'var(--color-surface)' }}
                      >
                        <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-primary)' }}>
                          {msg.text}
                        </p>
                      </div>
                    </div>
                  )
                }

                if (msg.kind === 'user') {
                  return (
                    <div key={msg.id} className="flex justify-end">
                      <div
                        className="rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-sm"
                        style={{
                          background: 'rgba(184, 118, 42, 0.10)',
                          border: '1px solid rgba(184, 118, 42, 0.18)',
                        }}
                      >
                        <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-primary)' }}>
                          {msg.text}
                        </p>
                      </div>
                    </div>
                  )
                }

                if (msg.kind === 'picker') {
                  return (
                    <div key={msg.id} className="pl-8 space-y-5 pt-1">
                      {DOMAINS.map(d => (
                        <div key={d}>
                          <p
                            className="text-xs font-medium tracking-widest uppercase mb-2.5"
                            style={{ color: 'var(--color-text-tertiary)' }}
                          >
                            {d}
                          </p>
                          <div className="grid grid-cols-3 gap-2">
                            {DOMAIN_AGENTS[d].map(type => {
                              const agentDef = AGENT_DEFINITIONS[type]
                              const alreadyAdded = existingAgentTypes.includes(type)
                              const isDisabled = alreadyAdded || step !== 'select'
                              return (
                                <button
                                  key={type}
                                  onClick={() => !isDisabled && handleSelectAgent(type, d)}
                                  disabled={isDisabled}
                                  className="flex flex-col items-center py-3 px-1.5 rounded-xl transition-all"
                                  style={{
                                    background: 'var(--color-surface)',
                                    border: '1px solid rgba(92, 74, 56, 0.12)',
                                    opacity: isDisabled ? 0.38 : 1,
                                    cursor: isDisabled ? 'default' : 'pointer',
                                  }}
                                >
                                  <AgentSignature agentType={type} size={30} />
                                  <p className="font-medium text-center mt-2 leading-tight" style={{ color: 'var(--color-text-primary)', fontSize: '12px' }}>
                                    {type}
                                  </p>
                                  <p className="text-center mt-0.5 leading-snug" style={{ color: 'var(--color-text-secondary)', fontSize: '10px', fontStyle: 'italic' }}>
                                    {agentDef.tagline}
                                  </p>
                                  {alreadyAdded && (
                                    <span className="mt-1" style={{ color: 'var(--color-principal)', fontSize: '10px' }}>✓ Added</span>
                                  )}
                                </button>
                              )
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                }

                if (msg.kind === 'capabilities') {
                  const agentDef = AGENT_DEFINITIONS[msg.agentType]
                  return (
                    <div key={msg.id} className="pl-8">
                      <div
                        className="rounded-xl px-4 py-3"
                        style={{ background: 'var(--color-surface)', border: '1px solid var(--color-structural)' }}
                      >
                        <p className="text-xs font-medium tracking-widest uppercase mb-2.5" style={{ color: 'var(--color-text-tertiary)', letterSpacing: '0.12em' }}>
                          What {msg.agentType} does for you
                        </p>
                        <div className="flex flex-wrap gap-1.5 mb-2.5">
                          {agentDef.capabilities.map(cap => (
                            <span
                              key={cap.key}
                              className="px-2.5 py-1 rounded-full text-xs font-medium"
                              style={{ background: 'rgba(184,118,42,0.08)', color: 'var(--color-principal)', border: '1px solid rgba(184,118,42,0.2)' }}
                            >
                              {cap.label}
                            </span>
                          ))}
                        </div>
                        <p className="text-xs italic" style={{ color: 'var(--color-text-tertiary)' }}>
                          {agentDef.tagline}
                        </p>
                      </div>
                    </div>
                  )
                }

                if (msg.kind === 'question') {
                  return (
                    <div key={msg.id} className="flex items-start gap-2.5">
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ background: 'var(--color-structural)' }}
                      >
                        <span style={{ color: 'var(--color-principal)', fontSize: '10px' }}>◈</span>
                      </div>
                      <div
                        className="rounded-2xl rounded-tl-sm px-4 py-2.5 max-w-sm"
                        style={{ background: 'var(--color-surface)' }}
                      >
                        <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-primary)' }}>
                          {msg.text}
                        </p>
                        <p className="text-xs italic mt-2" style={{ color: 'var(--color-text-tertiary)', borderTop: '1px solid var(--color-structural)', paddingTop: '6px' }}>
                          {msg.hint}
                        </p>
                      </div>
                    </div>
                  )
                }

                if (msg.kind === 'agent-card' && agentType && def) {
                  return (
                    <div key={msg.id} className="pl-8">
                      <div
                        className="rounded-xl p-4"
                        style={{ background: 'var(--color-surface)', border: '1px solid var(--color-structural)' }}
                      >
                        <div className="flex items-start gap-3 mb-3">
                          <AgentSignature agentType={agentType} size={40} />
                          <div className="min-w-0">
                            <p
                              className="font-display font-normal text-base"
                              style={{ color: 'var(--color-text-primary)', letterSpacing: '0.01em' }}
                            >
                              {name}
                            </p>
                            <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-tertiary)' }}>
                              {domain} · {agentType}
                            </p>
                            <p
                              className="text-sm leading-relaxed italic mt-1.5"
                              style={{ color: 'var(--color-text-secondary)' }}
                            >
                              {purpose}
                            </p>
                          </div>
                        </div>
                        <div
                          className="pt-3 flex items-center gap-2"
                          style={{ borderTop: '1px solid var(--color-structural)' }}
                        >
                          <div className="flex gap-1.5">
                            {seeds.map((s, i) => (
                              <div
                                key={i}
                                className="w-2 h-2 rounded-full"
                                style={{ background: s ? 'var(--color-principal)' : 'var(--color-structural)' }}
                              />
                            ))}
                          </div>
                          <span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                            3 memory seeds
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                }

                return null
              })}

              <div ref={chatEndRef} />
            </div>
          </div>

          {/* Input bar */}
          {step !== 'select' && (
            <div
              className="px-5 pb-5 pt-3 flex-shrink-0"
              style={{ borderTop: '1px solid var(--color-structural)', background: 'var(--color-ground)' }}
            >
              <div className="max-w-lg mx-auto">
                {renderInput()}
              </div>
            </div>
          )}
        </div>

        {/* ── Agent config panel — slides in from right as overlay ── */}
        {agentType && def && (
          <div
            key={agentType}
            className="animate-slide-right hidden md:flex flex-col absolute right-0 top-0 bottom-0 w-72 overflow-hidden"
            style={{
              background: 'rgba(245, 239, 229, 0.96)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              borderLeft: '1px solid var(--color-structural)',
              zIndex: 10,
            }}
          >
            {/* Panel header */}
            <div
              className="px-5 py-4 flex items-center gap-3 flex-shrink-0"
              style={{ borderBottom: '1px solid var(--color-structural)' }}
            >
              <AgentSignature agentType={agentType} size={40} />
              <div className="min-w-0 flex-1">
                <p
                  className="font-display font-normal leading-tight"
                  style={{ color: 'var(--color-text-primary)', fontSize: '17px', letterSpacing: '0.01em' }}
                >
                  {previewName || agentType}
                </p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span
                    className="px-2 py-0.5 rounded-full text-xs font-medium"
                    style={{ background: 'rgba(184,118,42,0.10)', color: 'var(--color-principal)', border: '1px solid rgba(184,118,42,0.22)' }}
                  >
                    {agentType}
                  </span>
                  <span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                    {domain}
                  </span>
                </div>
              </div>
            </div>

            {/* Panel body */}
            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">

              {/* Mission */}
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase mb-2.5"
                  style={{ color: 'var(--color-text-tertiary)', letterSpacing: '0.16em' }}>
                  Mission
                </p>
                <p
                  className="text-sm leading-relaxed"
                  style={{
                    color: previewPurpose ? 'var(--color-text-primary)' : 'var(--color-text-tertiary)',
                    fontStyle: previewPurpose ? 'normal' : 'italic',
                  }}
                >
                  {previewPurpose || 'Not defined yet…'}
                </p>
              </div>

              {/* Capabilities */}
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase mb-2.5"
                  style={{ color: 'var(--color-text-tertiary)', letterSpacing: '0.16em' }}>
                  Capabilities
                </p>
                <div className="space-y-2">
                  {def.capabilities.map((cap, i) => (
                    <div key={cap.key} className="flex items-start gap-2.5">
                      <div
                        className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ background: 'var(--color-structural)', fontSize: '10px', color: 'var(--color-principal)', fontWeight: 600 }}
                      >
                        {i + 1}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
                          {cap.label}
                        </p>
                        <p className="text-xs leading-snug mt-0.5" style={{ color: 'var(--color-text-tertiary)' }}>
                          {cap.prompt.split('.')[0]}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Context / Memory seeds */}
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase mb-2.5"
                  style={{ color: 'var(--color-text-tertiary)', letterSpacing: '0.16em' }}>
                  Context · {committedSeeds}/3
                </p>
                <div className="flex gap-1 mb-3">
                  {[0, 1, 2].map(i => (
                    <div
                      key={i}
                      className="flex-1 h-1 rounded-full transition-colors"
                      style={{
                        background: seeds[i]
                          ? 'var(--color-principal)'
                          : step === `seed-${i}`
                            ? 'rgba(184,118,42,0.35)'
                            : 'var(--color-structural)',
                      }}
                    />
                  ))}
                </div>
                <div className="space-y-3">
                  {def.seedingQuestions.map((q, i) => {
                    const answer = seeds[i]
                    const isActive = step === `seed-${i}`
                    const isDone = answer.length > 0
                    return (
                      <div key={i}>
                        <p
                          className="text-xs leading-snug"
                          style={{
                            color: isDone
                              ? 'var(--color-text-secondary)'
                              : isActive
                                ? 'var(--color-text-primary)'
                                : 'var(--color-text-tertiary)',
                            opacity: !isDone && !isActive ? 0.45 : 1,
                            fontWeight: isActive ? 500 : 400,
                          }}
                        >
                          {q}
                        </p>
                        {isDone && (
                          <p
                            className="text-xs italic mt-1.5 px-2.5 py-1.5 rounded-lg"
                            style={{
                              color: 'var(--color-principal)',
                              background: 'rgba(184,118,42,0.07)',
                              borderLeft: '2px solid rgba(184,118,42,0.4)',
                            }}
                          >
                            {answer}
                          </p>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  )
}
