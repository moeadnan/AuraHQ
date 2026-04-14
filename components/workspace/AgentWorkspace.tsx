'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { AGENT_DEFINITIONS } from '@/lib/agents/definitions'
import { AgentSignature } from '@/components/hq/AgentSignature'
import type { Agent, MemoryItem, OutputCard } from '@/types'

interface AgentWorkspaceProps {
  agent: Agent
  initialMemory: MemoryItem[]
  initialCards: OutputCard[]
  userId: string
}

export function AgentWorkspace({ agent, initialMemory, initialCards, userId }: AgentWorkspaceProps) {
  const router = useRouter()
  const def = AGENT_DEFINITIONS[agent.agent_type]

  const [memory, setMemory] = useState<MemoryItem[]>(initialMemory)
  const [cards, setCards] = useState<OutputCard[]>(initialCards)
  const [activeCapability, setActiveCapability] = useState<string | null>(null)
  const [userInput, setUserInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [memoryExpanded, setMemoryExpanded] = useState(false)
  const [showStructuredPrompt, setShowStructuredPrompt] = useState(false)
  const [structuredI, setStructuredI] = useState('')
  const [structuredAbout, setStructuredAbout] = useState('')
  const [structuredFormat, setStructuredFormat] = useState('draft')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Update last_used_at on mount
  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('agents')
      .update({ last_used_at: new Date().toISOString() })
      .eq('id', agent.id)
      .then(() => {})
  }, [agent.id])

  function selectCapability(key: string) {
    if (activeCapability === key) {
      setActiveCapability(null)
      setShowStructuredPrompt(false)
      return
    }
    setActiveCapability(key)
    setShowStructuredPrompt(false)
    setUserInput('')
    setTimeout(() => textareaRef.current?.focus(), 150)
  }

  async function handleSubmit() {
    if (!activeCapability) return
    const inputText = showStructuredPrompt
      ? `I want to ${structuredI}${structuredAbout ? ` about ${structuredAbout}` : ''} as a ${structuredFormat}`
      : userInput
    if (!inputText.trim()) return

    setLoading(true)

    try {
      const res = await fetch(`/api/agents/${agent.id}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          capability: activeCapability,
          userInput: inputText,
        }),
      })

      if (!res.ok) throw new Error('Chat request failed')
      const data = await res.json()

      const newCard: OutputCard = {
        id: data.cardId,
        agent_id: agent.id,
        user_id: userId,
        capability: activeCapability,
        user_input: inputText,
        output_text: data.output,
        saved_to_memory: false,
        created_at: new Date().toISOString(),
      }

      setCards(prev => [newCard, ...prev])
      setUserInput('')
      setActiveCapability(null)
      setShowStructuredPrompt(false)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function saveToMemory(card: OutputCard) {
    const supabase = createClient()
    const content = `From ${card.capability} — ${card.output_text.slice(0, 200)}${card.output_text.length > 200 ? '…' : ''}`

    if (memory.length >= 25) {
      alert('Memory is full (25 items). Delete an item to add more.')
      return
    }

    const { data: newItem } = await supabase
      .from('memory_items')
      .insert({
        agent_id: agent.id,
        user_id: userId,
        content,
        source: 'confirmed',
      })
      .select()
      .single()

    if (newItem) {
      setMemory(prev => [newItem as MemoryItem, ...prev])
      await supabase
        .from('output_cards')
        .update({ saved_to_memory: true })
        .eq('id', card.id)
      setCards(prev => prev.map(c => c.id === card.id ? { ...c, saved_to_memory: true } : c))
    }
  }

  async function deleteMemoryItem(itemId: string) {
    const supabase = createClient()
    await supabase.from('memory_items').delete().eq('id', itemId)
    setMemory(prev => prev.filter(m => m.id !== itemId))
  }

  const activeCapDef = def.capabilities.find(c => c.key === activeCapability)
  const relevantMemory = activeCapability
    ? memory.slice(0, 3) // Show top 3 memory items in input panel
    : []

  return (
    <div
      className="min-h-dvh flex flex-col"
      style={{ background: 'var(--color-ground)' }}
    >
      {/* Fixed header */}
      <header
        className="flex items-center justify-between px-5 py-4 sticky top-0 z-10"
        style={{ background: 'var(--color-ground)', borderBottom: '1px solid rgba(42, 38, 32, 0.5)' }}
      >
        <div className="flex items-center gap-3">
          <Link
            href="/hq"
            className="text-xs mr-2"
            style={{ color: 'var(--color-text-tertiary)' }}
          >
            ← HQ
          </Link>
          <AgentSignature agentType={agent.agent_type} size={28} />
          <div>
            <p className="text-agent-name font-medium leading-tight" style={{ color: 'var(--color-surface)' }}>
              {agent.name}
            </p>
            <p className="text-xs" style={{ color: 'var(--color-principal-light)' }}>
              {agent.domain}
            </p>
          </div>
        </div>
        <Link
          href={`/agents/${agent.id}/settings`}
          className="text-xs"
          style={{ color: 'var(--color-text-tertiary)' }}
        >
          ⚙
        </Link>
      </header>

      {/* Purpose — always visible */}
      <div className="px-5 pt-4 pb-3">
        <p
          className="text-purpose italic leading-relaxed"
          style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-sans)' }}
        >
          {agent.purpose}
        </p>
      </div>

      {/* Capability strip */}
      <div className="px-5 pb-3 flex flex-wrap gap-2">
        {def.capabilities.map((cap) => (
          <button
            key={cap.key}
            onClick={() => selectCapability(cap.key)}
            className={`capability-btn ${activeCapability === cap.key ? 'capability-btn--active' : ''}`}
          >
            {cap.label}
          </button>
        ))}
        <button
          onClick={() => { setActiveCapability('other'); setShowStructuredPrompt(true) }}
          className={`capability-btn ${activeCapability === 'other' ? 'capability-btn--active' : ''}`}
        >
          Something else ↓
        </button>
      </div>

      {/* Input panel — expands when capability selected */}
      {activeCapability && (
        <div
          className="mx-5 mb-4 rounded-lg p-4 animate-slide-up"
          style={{ background: 'var(--color-surface)' }}
        >
          {!showStructuredPrompt ? (
            <>
              <p
                className="text-capability font-medium mb-2"
                style={{ color: 'var(--color-principal)' }}
              >
                {activeCapDef?.label ?? activeCapability}
              </p>
              <p className="text-xs mb-3" style={{ color: 'var(--color-text-secondary)' }}>
                {activeCapDef?.prompt}
              </p>

              {/* Memory context */}
              {relevantMemory.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs mb-1" style={{ color: 'var(--color-text-tertiary)' }}>
                    Based on what you told me:
                  </p>
                  {relevantMemory.map(m => (
                    <div
                      key={m.id}
                      className="text-xs rounded px-2 py-1.5 mb-1"
                      style={{
                        background: 'var(--color-raised)',
                        color: 'var(--color-text-secondary)',
                        borderLeft: '2px solid rgba(184, 118, 42, 0.3)',
                      }}
                    >
                      {m.content}
                    </div>
                  ))}
                </div>
              )}

              <textarea
                ref={textareaRef}
                value={userInput}
                onChange={e => setUserInput(e.target.value)}
                placeholder="Your input…"
                rows={3}
                className="input-field mb-3"
                onKeyDown={e => {
                  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSubmit()
                }}
              />

              <div className="flex items-center justify-between">
                <span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                  ⌘↵ to submit
                </span>
                <button
                  onClick={handleSubmit}
                  disabled={loading || !userInput.trim()}
                  className="btn-primary text-xs py-2 px-4"
                >
                  {loading ? 'Working…' : 'Submit'}
                </button>
              </div>
            </>
          ) : (
            // Structured prompt builder (Something else)
            <>
              <p
                className="text-capability font-medium mb-4"
                style={{ color: 'var(--color-principal)' }}
              >
                Build your request
              </p>
              <div className="space-y-3 mb-4">
                <div>
                  <label className="text-xs mb-1 block" style={{ color: 'var(--color-text-tertiary)' }}>
                    I want to
                  </label>
                  <input
                    type="text"
                    value={structuredI}
                    onChange={e => setStructuredI(e.target.value)}
                    placeholder="think through, draft, analyze, understand…"
                    className="input-field text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs mb-1 block" style={{ color: 'var(--color-text-tertiary)' }}>
                    About (optional)
                  </label>
                  <input
                    type="text"
                    value={structuredAbout}
                    onChange={e => setStructuredAbout(e.target.value)}
                    placeholder="the situation, topic, or decision"
                    className="input-field text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs mb-1 block" style={{ color: 'var(--color-text-tertiary)' }}>
                    As a
                  </label>
                  <select
                    value={structuredFormat}
                    onChange={e => setStructuredFormat(e.target.value)}
                    className="input-field text-sm"
                  >
                    {['draft', 'analysis', 'reflection', 'plan', 'response'].map(f => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <button
                  onClick={() => setShowStructuredPrompt(false)}
                  className="text-xs"
                  style={{ color: 'var(--color-text-tertiary)', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading || !structuredI.trim()}
                  className="btn-primary text-xs py-2 px-4"
                >
                  {loading ? 'Working…' : 'Submit'}
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Output cards */}
      <div className="flex-1 px-5 space-y-4 pb-6">
        {cards.length === 0 && !activeCapability && (
          <div className="text-center pt-8">
            <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
              Select a capability above to begin.
            </p>
          </div>
        )}

        {cards.map((card, i) => (
          <div
            key={card.id}
            className="rounded-lg p-5 animate-fade-up"
            style={{
              background: 'var(--color-surface)',
              animationDelay: `${i * 50}ms`,
            }}
          >
            {/* Card header */}
            <div className="flex items-center justify-between mb-3">
              <span
                className="text-capability font-medium uppercase tracking-wide"
                style={{ color: 'var(--color-principal)' }}
              >
                {card.capability}
              </span>
              <span
                className="text-xs"
                style={{ color: 'var(--color-text-tertiary)' }}
              >
                {new Date(card.created_at).toLocaleDateString()}
              </span>
            </div>

            {/* User input summary */}
            <p
              className="text-xs mb-3 pb-3"
              style={{
                color: 'var(--color-text-tertiary)',
                borderBottom: '1px solid rgba(92, 74, 56, 0.1)',
              }}
            >
              {card.user_input.length > 80 ? card.user_input.slice(0, 80) + '…' : card.user_input}
            </p>

            {/* Output */}
            <div
              className="text-card-body leading-relaxed whitespace-pre-wrap"
              style={{ color: 'var(--color-text-primary)' }}
            >
              {card.output_text}
            </div>

            {/* Card actions */}
            <div className="flex gap-4 mt-4 pt-3" style={{ borderTop: '1px solid rgba(92, 74, 56, 0.1)' }}>
              <button
                onClick={() => !card.saved_to_memory && saveToMemory(card)}
                disabled={card.saved_to_memory}
                className="text-xs transition-colors"
                style={{
                  color: card.saved_to_memory ? 'var(--color-text-tertiary)' : 'var(--color-principal)',
                  background: 'none',
                  border: 'none',
                  cursor: card.saved_to_memory ? 'default' : 'pointer',
                }}
              >
                {card.saved_to_memory ? '✓ Saved to memory' : 'Save to memory'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Memory panel */}
      <div
        className="mx-5 mb-6 rounded-lg overflow-hidden"
        style={{ border: '1px solid rgba(42, 38, 32, 0.4)' }}
      >
        <button
          onClick={() => setMemoryExpanded(!memoryExpanded)}
          className="w-full flex items-center justify-between px-4 py-3 text-left"
          style={{ background: 'rgba(42, 38, 32, 0.3)' }}
        >
          <span className="text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>
            Memory · {memory.length}/25
          </span>
          {memory.length > 0 && (
            <span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
              {memoryExpanded ? '↑ collapse' : `${memory[0]?.content.slice(0, 50)}…`}
            </span>
          )}
        </button>

        {memoryExpanded && (
          <div className="divide-y" style={{ borderColor: 'rgba(42, 38, 32, 0.3)' }}>
            {memory.length === 0 ? (
              <p className="px-4 py-3 text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                No memory items yet. Save a card to build memory.
              </p>
            ) : (
              memory.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start justify-between gap-3 px-4 py-3"
                  style={{ background: 'rgba(42, 38, 32, 0.2)' }}
                >
                  <p className="text-memory flex-1" style={{ color: 'var(--color-text-secondary)' }}>
                    {item.content}
                  </p>
                  <button
                    onClick={() => deleteMemoryItem(item.id)}
                    className="text-xs flex-shrink-0 mt-0.5"
                    style={{ color: 'var(--color-text-tertiary)', background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}
