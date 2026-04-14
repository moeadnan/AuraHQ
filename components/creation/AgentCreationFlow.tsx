'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { DOMAINS, DOMAIN_AGENTS, AGENT_DEFINITIONS } from '@/lib/agents/definitions'
import { AgentSignature } from '@/components/hq/AgentSignature'
import type { AgentType, Domain } from '@/types'

interface AgentCreationFlowProps {
  userId: string
  existingAgentTypes: string[]
}

type Step = 'domain' | 'type' | 'name' | 'purpose' | 'seed-1' | 'seed-2' | 'seed-3' | 'confirm'

export function AgentCreationFlow({ userId, existingAgentTypes }: AgentCreationFlowProps) {
  const router = useRouter()

  const [step, setStep] = useState<Step>('domain')
  const [domain, setDomain] = useState<Domain | null>(null)
  const [agentType, setAgentType] = useState<AgentType | null>(null)
  const [name, setName] = useState('')
  const [purpose, setPurpose] = useState('')
  const [seed1, setSeed1] = useState('')
  const [seed2, setSeed2] = useState('')
  const [seed3, setSeed3] = useState('')
  const [saving, setSaving] = useState(false)

  const def = agentType ? AGENT_DEFINITIONS[agentType] : null

  const DOMAIN_ICONS: Record<string, string> = {
    'Work': '◈',
    'Money': '◆',
    'Personal Growth': '◇',
  }

  async function handleCreate() {
    if (!agentType || !domain || !def) return
    setSaving(true)

    const supabase = createClient()

    const { data: agent, error } = await supabase
      .from('agents')
      .insert({
        user_id: userId,
        name: name.trim(),
        domain,
        agent_type: agentType,
        purpose: purpose.trim(),
        seed_answer_1: seed1.trim(),
        seed_answer_2: seed2.trim(),
        seed_answer_3: seed3.trim(),
        position_index: existingAgentTypes.length,
      })
      .select()
      .single()

    if (error || !agent) {
      console.error(error)
      setSaving(false)
      return
    }

    // Store seeding answers as initial memory
    await supabase.from('memory_items').insert([
      { agent_id: agent.id, user_id: userId, content: `You said: "${seed1.trim()}"`, source: 'seed' },
      { agent_id: agent.id, user_id: userId, content: `You said: "${seed2.trim()}"`, source: 'seed' },
      { agent_id: agent.id, user_id: userId, content: `You said: "${seed3.trim()}"`, source: 'seed' },
    ])

    router.push(`/agents/${agent.id}`)
  }

  function back() {
    const steps: Step[] = ['domain', 'type', 'name', 'purpose', 'seed-1', 'seed-2', 'seed-3', 'confirm']
    const idx = steps.indexOf(step)
    if (idx > 0) setStep(steps[idx - 1])
    else router.push('/hq')
  }

  return (
    <div
      className="min-h-dvh flex flex-col"
      style={{ background: 'var(--color-ground)' }}
    >
      {/* Header */}
      <header className="flex items-center px-6 py-5">
        <button
          onClick={back}
          className="text-sm mr-4"
          style={{ color: 'var(--color-text-tertiary)', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          ← Back
        </button>
        <span
          className="font-display font-light text-sm tracking-widest"
          style={{ color: 'var(--color-principal)', letterSpacing: '0.2em' }}
        >
          AURA HQ
        </span>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 pb-12">
        <div className="w-full max-w-md">

          {/* Step: Domain */}
          {step === 'domain' && (
            <div className="animate-fade-up">
              <h2
                className="font-display font-light text-2xl mb-2"
                style={{ color: 'var(--color-surface)', letterSpacing: '0.015em' }}
              >
                Choose a domain
              </h2>
              <p className="text-sm mb-8" style={{ color: 'var(--color-text-secondary)' }}>
                Your agent will be specialized within this area.
              </p>
              <div className="space-y-3">
                {DOMAINS.map((d) => (
                  <button
                    key={d}
                    onClick={() => { setDomain(d); setStep('type') }}
                    className="w-full p-4 rounded-lg text-left flex items-center gap-4 transition-all"
                    style={{
                      background: 'rgba(42, 38, 32, 0.5)',
                      border: '1px solid rgba(42, 38, 32, 0.6)',
                    }}
                  >
                    <span className="text-2xl" style={{ color: 'var(--color-principal)' }}>
                      {DOMAIN_ICONS[d]}
                    </span>
                    <div>
                      <p className="font-medium text-sm" style={{ color: 'var(--color-surface)' }}>{d}</p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-tertiary)' }}>
                        {DOMAIN_AGENTS[d].join(' · ')}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step: Agent type */}
          {step === 'type' && domain && (
            <div className="animate-fade-up">
              <h2
                className="font-display font-light text-2xl mb-2"
                style={{ color: 'var(--color-surface)', letterSpacing: '0.015em' }}
              >
                {domain}
              </h2>
              <p className="text-sm mb-8" style={{ color: 'var(--color-text-secondary)' }}>
                Choose the agent that fits your need.
              </p>
              <div className="space-y-3">
                {DOMAIN_AGENTS[domain].map((type) => {
                  const d = AGENT_DEFINITIONS[type]
                  const alreadyCreated = existingAgentTypes.includes(type)
                  return (
                    <button
                      key={type}
                      onClick={() => { if (!alreadyCreated) { setAgentType(type); setName(type); setStep('name') } }}
                      disabled={alreadyCreated}
                      className="w-full p-4 rounded-lg text-left flex items-center gap-4 transition-all"
                      style={{
                        background: 'rgba(42, 38, 32, 0.5)',
                        border: '1px solid rgba(42, 38, 32, 0.6)',
                        opacity: alreadyCreated ? 0.4 : 1,
                        cursor: alreadyCreated ? 'not-allowed' : 'pointer',
                      }}
                    >
                      <div className="flex-shrink-0">
                        <AgentSignature agentType={type} size={40} />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm" style={{ color: 'var(--color-surface)' }}>{type}</p>
                        <p className="text-xs mt-0.5 italic" style={{ color: 'var(--color-text-secondary)' }}>
                          {d.tagline}
                        </p>
                      </div>
                      {alreadyCreated && (
                        <span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>Added</span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Step: Name */}
          {step === 'name' && def && (
            <div className="animate-fade-up">
              <h2
                className="font-display font-light text-2xl mb-2"
                style={{ color: 'var(--color-surface)', letterSpacing: '0.015em' }}
              >
                Name your agent
              </h2>
              <p className="text-sm mb-8" style={{ color: 'var(--color-text-secondary)' }}>
                The default name works. Or make it yours.
              </p>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value.slice(0, 30))}
                placeholder={agentType || 'Agent name'}
                maxLength={30}
                className="input-field text-lg mb-2"
                style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.01em', fontSize: '18px' }}
                autoFocus
              />
              <p className="text-xs mb-8" style={{ color: 'var(--color-text-tertiary)' }}>
                Examples in this domain: {DOMAIN_AGENTS[domain!].join(', ')}
              </p>
              <button
                onClick={() => setStep('purpose')}
                disabled={name.trim().length < 1}
                className="btn-primary w-full"
              >
                Continue
              </button>
            </div>
          )}

          {/* Step: Purpose */}
          {step === 'purpose' && def && (
            <div className="animate-fade-up">
              <h2
                className="font-display font-light text-2xl mb-2"
                style={{ color: 'var(--color-surface)', letterSpacing: '0.015em' }}
              >
                Write its purpose
              </h2>
              <p className="text-sm mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                One sentence. This appears in the workspace — always visible.
              </p>
              <p
                className="text-xs mb-6 italic"
                style={{ color: 'var(--color-principal-light)' }}
              >
                &ldquo;{def.tagline}&rdquo;
              </p>
              <textarea
                value={purpose}
                onChange={e => setPurpose(e.target.value.slice(0, 120))}
                placeholder="What is this agent's single job in your system?"
                rows={3}
                maxLength={120}
                className="input-field mb-2"
                style={{
                  fontFamily: 'var(--font-display)',
                  letterSpacing: '0.01em',
                  fontSize: '16px',
                  lineHeight: 1.6,
                }}
                autoFocus
              />
              <p className="text-xs mb-6" style={{ color: 'var(--color-text-tertiary)' }}>
                {purpose.length}/120
              </p>
              <button
                onClick={() => setStep('seed-1')}
                disabled={purpose.trim().length < 10}
                className="btn-primary w-full"
              >
                Continue
              </button>
            </div>
          )}

          {/* Seeding questions */}
          {['seed-1', 'seed-2', 'seed-3'].includes(step) && def && (
            <div className="animate-fade-up">
              <p
                className="text-xs font-medium tracking-widest uppercase mb-6"
                style={{ color: 'var(--color-text-tertiary)' }}
              >
                {step === 'seed-1' ? '1' : step === 'seed-2' ? '2' : '3'} of 3 · Building your agent&apos;s memory
              </p>
              <h2
                className="font-display font-light text-2xl mb-8"
                style={{ color: 'var(--color-surface)', letterSpacing: '0.015em', lineHeight: 1.3 }}
              >
                {step === 'seed-1' && def.seedingQuestions[0]}
                {step === 'seed-2' && def.seedingQuestions[1]}
                {step === 'seed-3' && def.seedingQuestions[2]}
              </h2>
              <textarea
                value={step === 'seed-1' ? seed1 : step === 'seed-2' ? seed2 : seed3}
                onChange={e => {
                  if (step === 'seed-1') setSeed1(e.target.value)
                  else if (step === 'seed-2') setSeed2(e.target.value)
                  else setSeed3(e.target.value)
                }}
                placeholder="Your answer…"
                rows={4}
                className="input-field mb-4"
                autoFocus
              />
              <button
                onClick={() => {
                  if (step === 'seed-1') setStep('seed-2')
                  else if (step === 'seed-2') setStep('seed-3')
                  else setStep('confirm')
                }}
                disabled={
                  (step === 'seed-1' && seed1.trim().length < 5) ||
                  (step === 'seed-2' && seed2.trim().length < 5) ||
                  (step === 'seed-3' && seed3.trim().length < 5)
                }
                className="btn-primary w-full"
              >
                Continue
              </button>
            </div>
          )}

          {/* Confirm */}
          {step === 'confirm' && def && agentType && (
            <div className="animate-fade-up">
              <h2
                className="font-display font-light text-2xl mb-6"
                style={{ color: 'var(--color-surface)', letterSpacing: '0.015em' }}
              >
                Add to your HQ
              </h2>

              {/* Preview node */}
              <div
                className="rounded-lg p-6 mb-8 flex items-start gap-4"
                style={{ background: 'var(--color-surface)' }}
              >
                <AgentSignature agentType={agentType} size={56} />
                <div>
                  <p
                    className="font-display font-light text-lg mb-1"
                    style={{ color: 'var(--color-text-primary)', letterSpacing: '0.01em' }}
                  >
                    {name}
                  </p>
                  <p className="text-xs mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                    {domain} · {agentType}
                  </p>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    {purpose}
                  </p>
                </div>
              </div>

              <button
                onClick={handleCreate}
                disabled={saving}
                className="btn-primary w-full"
              >
                {saving ? 'Building…' : 'Add to my HQ'}
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
