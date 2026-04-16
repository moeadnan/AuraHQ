'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { AGENT_DEFINITIONS } from '@/lib/agents/definitions'
import { AgentSignature } from '@/components/hq/AgentSignature'
import type { Agent, MemoryItem, OutputCard } from '@/types'

interface AgentWorkspaceProps {
  agent: Agent
  initialMemory: MemoryItem[]
  initialCards: OutputCard[]
  userId: string
  googleConnected: boolean
}

type ToolStep =
  | { kind: 'status'; text: string }
  | { kind: 'tool_start'; tool: string; text: string }
  | { kind: 'tool_done'; tool: string; text: string }

type ChatMessage = {
  id: string
  role: 'user' | 'assistant'
  content: string
  created_at: string
}

function uid() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

const TOOL_NEEDS_GOOGLE = new Set(['Dispatch', 'Manuscript'])

function MarkdownText({ text }: { text: string }) {
  // Render **bold**, then newlines
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith('**') && part.endsWith('**')
          ? <strong key={i}>{part.slice(2, -2)}</strong>
          : part.split('\n').map((line, j, arr) => (
              <span key={`${i}-${j}`}>
                {line}
                {j < arr.length - 1 && <br />}
              </span>
            ))
      )}
    </>
  )
}

export function AgentWorkspace({
  agent,
  initialMemory,
  initialCards,
  userId,
  googleConnected,
}: AgentWorkspaceProps) {
  const def = AGENT_DEFINITIONS[agent.agent_type]

  // Hydrate messages from conversation rows (id, role, content, created_at)
  const [messages, setMessages] = useState<ChatMessage[]>(
    (initialCards as unknown as Array<{ id: string; role: string; content: string; created_at: string }>)
      .filter(r => r.role === 'user' || r.role === 'assistant')
      .map(r => ({ id: r.id, role: r.role as 'user' | 'assistant', content: r.content, created_at: r.created_at }))
  )
  const [memory, setMemory] = useState<MemoryItem[]>(initialMemory)
  const [activeCapability, setActiveCapability] = useState<string | null>(null)
  const [userInput, setUserInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [liveSteps, setLiveSteps] = useState<ToolStep[]>([])
  const [streamingContent, setStreamingContent] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [memoryOpen, setMemoryOpen] = useState(false)

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  const needsGoogle = TOOL_NEEDS_GOOGLE.has(agent.agent_type)
  const showConnectBanner = needsGoogle && !googleConnected

  // Mark agent as recently used
  useEffect(() => {
    createClient()
      .from('agents')
      .update({ last_used_at: new Date().toISOString() })
      .eq('id', agent.id)
      .then(() => {})
  }, [agent.id])

  // Auto-scroll to bottom on new content
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length, streamingContent])

  function selectCapability(key: string) {
    setActiveCapability(prev => (prev === key ? null : key))
    setTimeout(() => textareaRef.current?.focus(), 80)
  }

  async function handleSubmit() {
    const text = userInput.trim()
    if (!text || loading) return

    const userMsg: ChatMessage = {
      id: uid(),
      content: text,
      created_at: new Date().toISOString(),
    }
    setMessages(prev => [...prev, userMsg])
    setUserInput('')
    setLoading(true)
    setLiveSteps([])
    setStreamingContent('')
    setSubmitError(null)

    try {
      const { data: { session } } = await createClient().auth.getSession()
      const authHeader = session?.access_token
        ? { 'Authorization': `Bearer ${session.access_token}` }
        : {}

      const res = await fetch(`/api/agents/${agent.id}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeader },
        body: JSON.stringify({ capability: activeCapability ?? 'auto', user_input: text }),
      })

      if (!res.ok || !res.body) throw new Error('Request failed')

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      let outputText = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })

        const parts = buffer.split('\n\n')
        buffer = parts.pop() ?? ''

        for (const part of parts) {
          if (!part.startsWith('data: ')) continue
          let evt: Record<string, string> | null = null
          try { evt = JSON.parse(part.slice(6)) } catch { continue }
          if (!evt) continue

          if (evt.type === 'status') {
            setLiveSteps(prev => [...prev, { kind: 'status', text: evt!.text }])
          } else if (evt.type === 'tool_start') {
            setLiveSteps(prev => [...prev, { kind: 'tool_start', tool: evt!.tool, text: evt!.text }])
          } else if (evt.type === 'tool_done') {
            setLiveSteps(prev => {
              const next = [...prev]
              const idx = next.findLastIndex(s => s.kind === 'tool_start' && (s as { tool: string }).tool === evt!.tool)
              if (idx >= 0) next[idx] = { kind: 'tool_done', tool: evt!.tool, text: evt!.text }
              else next.push({ kind: 'tool_done', tool: evt!.tool, text: evt!.text })
              return next
            })
          } else if (evt.type === 'delta') {
            outputText = evt.text
            setStreamingContent(outputText)
          } else if (evt.type === 'error') {
            throw new Error(evt.text)
          }
        }
      }

      if (outputText) {
        const assistantMsg: ChatMessage = {
          id: uid(),
          role: 'assistant',
          content: outputText,
          created_at: new Date().toISOString(),
        }
        setMessages(prev => [...prev, assistantMsg])
      }
    } catch (err) {
      console.error(err)
      setSubmitError(err instanceof Error ? err.message : 'Something went wrong. Try again.')
    } finally {
      setLoading(false)
      setLiveSteps([])
      setStreamingContent(null)
      setActiveCapability(null)
    }
  }

  async function deleteMemoryItem(itemId: string) {
    await createClient().from('memory_items').delete().eq('id', itemId)
    setMemory(prev => prev.filter(m => m.id !== itemId))
  }

  const activeCapDef = def.capabilities.find(c => c.key === activeCapability)

  return (
    <div className="h-dvh flex flex-col overflow-hidden" style={{ background: 'var(--color-ground)' }}>

      {/* Chrome header */}
      <header
        className="flex items-center justify-between px-5 py-3 flex-shrink-0"
        style={{ background: 'var(--color-chrome)', borderBottom: '1px solid var(--color-chrome-border)' }}
      >
        <div className="flex items-center gap-3">
          <Link href="/hq" className="text-xs mr-1" style={{ color: 'rgba(255,255,255,0.38)' }}>
            ← HQ
          </Link>
          <AgentSignature agentType={agent.agent_type} size={26} />
          <div>
            <p className="font-display text-sm leading-tight" style={{ color: 'var(--color-raised)' }}>
              {agent.name}
            </p>
            <p className="text-xs" style={{ color: 'var(--color-principal)', opacity: 0.8 }}>
              {agent.domain}
            </p>
          </div>
        </div>
        <button
          onClick={() => setMemoryOpen(o => !o)}
          className="text-xs px-2.5 py-1 rounded"
          style={{
            color: memoryOpen ? 'var(--color-principal)' : 'rgba(255,255,255,0.38)',
            background: memoryOpen ? 'rgba(200,146,42,0.12)' : 'transparent',
            border: 'none', cursor: 'pointer',
          }}
        >
          Memory · {memory.length}
        </button>
      </header>

      {/* Memory drawer */}
      {memoryOpen && (
        <div className="flex-shrink-0 border-b" style={{ background: 'var(--color-chrome-deep)', borderColor: 'var(--color-chrome-border)' }}>
          <div className="px-5 py-3 max-h-48 overflow-y-auto">
            {memory.length === 0 ? (
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.38)' }}>No memory yet.</p>
            ) : (
              <div className="space-y-1.5">
                {memory.map(item => (
                  <div key={item.id} className="flex items-start justify-between gap-3">
                    <p className="text-xs flex-1 leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>{item.content}</p>
                    <button onClick={() => deleteMemoryItem(item.id)} className="text-xs flex-shrink-0"
                      style={{ color: 'rgba(255,255,255,0.28)', background: 'none', border: 'none', cursor: 'pointer' }}>×</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Connect Gmail banner */}
      {showConnectBanner && (
        <div
          className="mx-4 mt-3 px-4 py-2.5 rounded-lg flex items-center justify-between gap-4 flex-shrink-0"
          style={{ background: 'rgba(200,146,42,0.07)', border: '1px solid rgba(200,146,42,0.22)' }}
        >
          <p className="text-xs" style={{ color: 'var(--color-secondary)' }}>
            Connect Gmail to unlock {agent.name}'s full capabilities.
          </p>
          <Link href="/settings/connections"
            className="text-xs font-medium flex-shrink-0 px-3 py-1 rounded-lg"
            style={{ background: 'var(--color-principal)', color: '#fff' }}>
            Connect
          </Link>
        </div>
      )}

      {/* Chat thread */}
      <div className="flex-1 overflow-y-auto px-4 py-5" style={{ scrollBehavior: 'smooth' }}>

        {/* Agent introduction */}
        <div className="flex items-end gap-2 mb-4">
          <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center"
            style={{ background: 'var(--color-chrome)' }}>
            <AgentSignature agentType={agent.agent_type} size={16} />
          </div>
          <div className="max-w-sm px-4 py-3 rounded-2xl rounded-bl-sm text-sm leading-relaxed italic"
            style={{ background: 'var(--color-surface)', color: 'var(--color-text-secondary)', border: '1px solid var(--color-structural)' }}>
            {agent.purpose}
          </div>
        </div>

        {/* Past messages */}
        {messages.map(msg => (
          <div key={msg.id} className={`flex items-end gap-2 mb-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
            {msg.role === 'assistant' && (
              <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center"
                style={{ background: 'var(--color-chrome)' }}>
                <AgentSignature agentType={agent.agent_type} size={16} />
              </div>
            )}
            <div className="group max-w-xs md:max-w-md lg:max-w-lg">
              <div
                className="px-4 py-3 rounded-2xl text-sm leading-relaxed"
                style={msg.role === 'user' ? {
                  background: 'var(--color-chrome)',
                  color: 'rgba(255,255,255,0.88)',
                  borderBottomRightRadius: '4px',
                } : {
                  background: 'var(--color-surface)',
                  color: 'var(--color-text-primary)',
                  border: '1px solid var(--color-structural)',
                  borderBottomLeftRadius: '4px',
                }}
              >
                <MarkdownText text={msg.content} />
              </div>
            </div>
          </div>
        ))}

        {/* Live tool steps */}
        {loading && liveSteps.length > 0 && (
          <div className="flex items-end gap-2 mb-2">
            <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center"
              style={{ background: 'var(--color-chrome)' }}>
              <AgentSignature agentType={agent.agent_type} size={16} />
            </div>
            <div className="px-4 py-3 rounded-2xl rounded-bl-sm space-y-1.5"
              style={{ background: 'var(--color-surface)', border: '1px solid var(--color-structural)' }}>
              {liveSteps.map((s, i) => (
                <div key={i} className="flex items-center gap-2">
                  {s.kind === 'tool_start' && (
                    <><span style={{ color: 'var(--color-principal)', fontSize: '10px' }}>⟳</span>
                      <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>{s.text}</span></>
                  )}
                  {s.kind === 'tool_done' && (
                    <><span style={{ color: 'var(--color-principal)', fontSize: '10px' }}>✓</span>
                      <span className="text-xs font-medium" style={{ color: 'var(--color-secondary)' }}>{s.text}</span></>
                  )}
                  {s.kind === 'status' && (
                    <><span style={{ color: 'var(--color-text-tertiary)', fontSize: '10px' }}>●</span>
                      <span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>{s.text}</span></>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Streaming response */}
        {streamingContent !== null && (
          <div className="flex items-end gap-2 mb-3">
            <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center"
              style={{ background: 'var(--color-chrome)' }}>
              <AgentSignature agentType={agent.agent_type} size={16} />
            </div>
            <div className="max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-2xl rounded-bl-sm text-sm leading-relaxed"
              style={{ background: 'var(--color-surface)', color: 'var(--color-text-primary)', border: '1px solid var(--color-structural)' }}>
              {streamingContent
                ? <><MarkdownText text={streamingContent} /><span className="inline-block w-0.5 h-4 ml-0.5 align-middle animate-pulse" style={{ background: 'var(--color-principal)' }} /></>
                : <span className="flex gap-1 items-center py-0.5">
                    {[0,1,2].map(i => (
                      <span key={i} className="w-1.5 h-1.5 rounded-full inline-block"
                        style={{ background: 'var(--color-principal)', opacity: 0.5, animation: `pulse 1.2s ${i * 0.2}s infinite` }} />
                    ))}
                  </span>
              }
            </div>
          </div>
        )}

        {/* Error */}
        {submitError && (
          <p className="text-xs text-center py-2" style={{ color: '#b42828' }}>{submitError}</p>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div className="flex-shrink-0" style={{ background: 'var(--color-raised)', borderTop: '1px solid var(--color-structural)' }}>

        {/* Capability pills */}
        <div className="px-4 pt-3 flex gap-2 flex-wrap">
          {def.capabilities.map(cap => (
            <button
              key={cap.key}
              onClick={() => selectCapability(cap.key)}
              className="text-xs px-3 py-1 rounded-full transition-all"
              style={{
                background: activeCapability === cap.key ? 'var(--color-principal)' : 'transparent',
                color: activeCapability === cap.key ? '#fff' : 'var(--color-text-tertiary)',
                border: `1px solid ${activeCapability === cap.key ? 'var(--color-principal)' : 'var(--color-structural)'}`,
                cursor: 'pointer',
              }}
            >
              {cap.label}
            </button>
          ))}
          {activeCapability && (
            <button onClick={() => setActiveCapability(null)}
              className="text-xs px-2 py-1 rounded-full"
              style={{ color: 'var(--color-text-tertiary)', background: 'none', border: 'none', cursor: 'pointer' }}>
              ✕ clear
            </button>
          )}
        </div>

        {/* Hint text when capability selected */}
        {activeCapDef && (
          <p className="px-4 pt-2 text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
            {activeCapDef.prompt}
          </p>
        )}

        {/* Input row */}
        <div className="flex items-end gap-3 px-4 py-3">
          <textarea
            ref={textareaRef}
            value={userInput}
            onChange={e => {
              setUserInput(e.target.value)
              e.target.style.height = 'auto'
              e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'
            }}
            placeholder={activeCapDef?.prompt ?? 'Message…'}
            rows={1}
            className="flex-1 resize-none rounded-xl px-4 py-2.5 text-sm outline-none"
            style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-structural)',
              color: 'var(--color-text-primary)',
              lineHeight: '1.5',
              maxHeight: '120px',
              overflow: 'auto',
            }}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit() } }}
          />
          <button
            onClick={handleSubmit}
            disabled={loading || !userInput.trim()}
            className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center transition-opacity"
            style={{
              background: 'var(--color-chrome)',
              color: '#fff',
              border: 'none',
              cursor: loading || !userInput.trim() ? 'default' : 'pointer',
              opacity: loading || !userInput.trim() ? 0.4 : 1,
            }}
          >
            {loading
              ? <span className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
              : <span style={{ fontSize: '14px', lineHeight: 1 }}>↑</span>
            }
          </button>
        </div>
      </div>

    </div>
  )
}
