'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { AGENT_DEFINITIONS } from '@/lib/agents/definitions'
import { AgentSignature } from '@/components/hq/AgentSignature'
import type { Agent } from '@/types'

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

function MarkdownText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith('**') && part.endsWith('**')
          ? <strong key={i}>{part.slice(2, -2)}</strong>
          : part.split('\n').map((line, j, arr) => (
              <span key={`${i}-${j}`}>{line}{j < arr.length - 1 && <br />}</span>
            ))
      )}
    </>
  )
}

const TOOL_NEEDS_GOOGLE = new Set(['Dispatch', 'Manuscript'])

interface AgentMiniChatProps {
  agent: Agent
  minimized: boolean
  onToggleMinimize: () => void
  onClose: () => void
}

export function AgentMiniChat({ agent, minimized, onToggleMinimize, onClose }: AgentMiniChatProps) {
  const def = AGENT_DEFINITIONS[agent.agent_type]

  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [userInput, setUserInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [liveSteps, setLiveSteps] = useState<ToolStep[]>([])
  const [streamingContent, setStreamingContent] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [unreadCount, setUnreadCount] = useState(0)
  const [isGoogleConnected, setIsGoogleConnected] = useState(false)

  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const needsGoogle = TOOL_NEEDS_GOOGLE.has(agent.agent_type)

  // Load conversation history and google connection status on mount
  useEffect(() => {
    ;(async () => {
      const supabase = createClient()
      const [{ data: convRows }, { data: googleConn }] = await Promise.all([
        supabase
          .from('conversations')
          .select('id, role, content, created_at')
          .eq('agent_id', agent.id)
          .in('role', ['user', 'assistant'])
          .order('created_at', { ascending: true })
          .limit(60),
        supabase
          .from('oauth_connections')
          .select('id')
          .eq('provider', 'google')
          .maybeSingle(),
      ])
      if (convRows) {
        setMessages(
          convRows
            .filter(r => r.role === 'user' || r.role === 'assistant')
            .map(r => ({ id: r.id, role: r.role as 'user' | 'assistant', content: r.content, created_at: r.created_at }))
        )
      }
      setIsGoogleConnected(!!googleConn)
    })()
  }, [agent.id])

  // Auto-scroll when expanded
  useEffect(() => {
    if (!minimized) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages.length, streamingContent, minimized])

  // Clear unread when expanded
  useEffect(() => {
    if (!minimized) setUnreadCount(0)
  }, [minimized])

  async function getAuthHeader(): Promise<Record<string, string>> {
    const { data: { session } } = await createClient().auth.getSession()
    return session?.access_token ? { 'Authorization': `Bearer ${session.access_token}` } : {}
  }

  async function connectGoogle() {
    try {
      const headers = await getAuthHeader()
      const res = await fetch('/api/connect/google', { headers })
      const data = await res.json()
      if (data.auth_url) window.location.href = data.auth_url
    } catch { /* ignore */ }
  }

  async function disconnectGoogle() {
    try {
      const headers = await getAuthHeader()
      await fetch('/api/connect/google', { method: 'DELETE', headers })
      setIsGoogleConnected(false)
    } catch { /* ignore */ }
  }

  async function handleSubmit() {
    const text = userInput.trim()
    if (!text || loading) return

    const userMsg: ChatMessage = {
      id: uid(),
      role: 'user',
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
      const headers = await getAuthHeader()

      const res = await fetch(`/api/agents/${agent.id}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify({ capability: 'auto', user_input: text }),
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
        if (minimized) setUnreadCount(c => c + 1)
      }
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setLoading(false)
      setLiveSteps([])
      setStreamingContent(null)
    }
  }

  return (
    <div
      style={{
        width: '320px',
        borderRadius: minimized ? '12px 12px 0 0' : '12px 12px 0 0',
        overflow: 'hidden',
        boxShadow: '0px 6px 30px rgba(92, 74, 56, 0.28)',
        flexShrink: 0,
      }}
    >
      {/* Header tile — always visible */}
      <div
        className="flex items-center justify-between px-3 py-2.5 cursor-pointer select-none"
        style={{ background: 'var(--color-chrome)' }}
        onClick={onToggleMinimize}
      >
        <div className="flex items-center gap-2 min-w-0">
          <AgentSignature agentType={agent.agent_type} size={18} />
          <span className="text-xs font-medium truncate" style={{ color: 'rgba(255,255,255,0.9)' }}>
            {agent.name}
          </span>
          {loading && !minimized && (
            <span className="w-1.5 h-1.5 rounded-full animate-pulse flex-shrink-0" style={{ background: 'var(--color-principal)' }} />
          )}
          {minimized && unreadCount > 0 && (
            <span
              className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: 'var(--color-principal)', color: '#fff', fontSize: '10px', fontWeight: 600 }}
            >
              {unreadCount}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 flex-shrink-0" onClick={e => e.stopPropagation()}>
          <Link
            href={`/agents/${agent.id}`}
            className="w-5 h-5 flex items-center justify-center rounded text-xs"
            style={{ color: 'rgba(255,255,255,0.38)', textDecoration: 'none' }}
            title="Open full workspace"
          >
            ↗
          </Link>
          <button
            onClick={onToggleMinimize}
            className="w-5 h-5 flex items-center justify-center"
            style={{ color: 'rgba(255,255,255,0.5)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '10px' }}
          >
            {minimized ? '▲' : '▼'}
          </button>
          <button
            onClick={onClose}
            className="w-5 h-5 flex items-center justify-center text-sm"
            style={{ color: 'rgba(255,255,255,0.5)', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            ×
          </button>
        </div>
      </div>

      {/* Chat body — only when expanded */}
      {!minimized && (
        <div className="flex flex-col" style={{ height: '420px', background: 'var(--color-raised)' }}>

          {/* Connect Gmail strip */}
          {needsGoogle && !isGoogleConnected && (
            <div
              className="flex items-center justify-between px-3 py-2 flex-shrink-0"
              style={{ background: 'rgba(200,146,42,0.07)', borderBottom: '1px solid rgba(200,146,42,0.18)' }}
            >
              <p className="text-xs" style={{ color: 'var(--color-secondary)' }}>Gmail required for full access</p>
              <button
                onClick={connectGoogle}
                className="text-xs px-2.5 py-1 rounded-lg"
                style={{ background: 'var(--color-principal)', color: '#fff', border: 'none', cursor: 'pointer' }}
              >
                Connect
              </button>
            </div>
          )}

          {/* Gmail connected strip */}
          {needsGoogle && isGoogleConnected && (
            <div
              className="flex items-center justify-between px-3 py-1.5 flex-shrink-0"
              style={{ borderBottom: '1px solid var(--color-structural)' }}
            >
              <span className="text-xs" style={{ color: 'var(--color-principal)' }}>Gmail ●</span>
              <button
                onClick={disconnectGoogle}
                className="text-xs"
                style={{ color: 'rgba(122,138,154,0.7)', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Disconnect
              </button>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2" style={{ minHeight: 0 }}>

            {/* Agent intro */}
            <div className="flex items-end gap-1.5">
              <div className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center" style={{ background: 'var(--color-chrome)' }}>
                <AgentSignature agentType={agent.agent_type} size={14} />
              </div>
              <div
                className="max-w-[85%] px-3 py-2 rounded-xl rounded-bl-sm text-xs leading-relaxed italic"
                style={{ background: 'var(--color-surface)', color: 'var(--color-text-secondary)', border: '1px solid var(--color-structural)' }}
              >
                {agent.purpose}
              </div>
            </div>

            {/* Past messages */}
            {messages.map(msg => (
              <div key={msg.id} className={`flex items-end gap-1.5 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                {msg.role === 'assistant' && (
                  <div className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center" style={{ background: 'var(--color-chrome)' }}>
                    <AgentSignature agentType={agent.agent_type} size={14} />
                  </div>
                )}
                <div
                  className="max-w-[80%] px-3 py-2 rounded-xl text-xs leading-relaxed"
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
            ))}

            {/* Live tool steps */}
            {loading && liveSteps.length > 0 && (
              <div className="flex items-end gap-1.5">
                <div className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center" style={{ background: 'var(--color-chrome)' }}>
                  <AgentSignature agentType={agent.agent_type} size={14} />
                </div>
                <div className="px-3 py-2 rounded-xl rounded-bl-sm space-y-1" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-structural)' }}>
                  {liveSteps.map((s, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      {s.kind === 'tool_start' && (
                        <><span style={{ color: 'var(--color-principal)', fontSize: '9px' }}>⟳</span>
                          <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>{s.text}</span></>
                      )}
                      {s.kind === 'tool_done' && (
                        <><span style={{ color: 'var(--color-principal)', fontSize: '9px' }}>✓</span>
                          <span className="text-xs font-medium" style={{ color: 'var(--color-secondary)' }}>{s.text}</span></>
                      )}
                      {s.kind === 'status' && (
                        <><span style={{ color: 'var(--color-text-tertiary)', fontSize: '9px' }}>●</span>
                          <span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>{s.text}</span></>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Streaming */}
            {streamingContent !== null && (
              <div className="flex items-end gap-1.5">
                <div className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center" style={{ background: 'var(--color-chrome)' }}>
                  <AgentSignature agentType={agent.agent_type} size={14} />
                </div>
                <div
                  className="max-w-[80%] px-3 py-2 rounded-xl rounded-bl-sm text-xs leading-relaxed"
                  style={{ background: 'var(--color-surface)', color: 'var(--color-text-primary)', border: '1px solid var(--color-structural)' }}
                >
                  {streamingContent
                    ? <><MarkdownText text={streamingContent} /><span className="inline-block w-0.5 h-3 ml-0.5 align-middle animate-pulse" style={{ background: 'var(--color-principal)' }} /></>
                    : <span className="flex gap-1 items-center py-0.5">
                        {[0, 1, 2].map(i => (
                          <span key={i} className="w-1.5 h-1.5 rounded-full inline-block"
                            style={{ background: 'var(--color-principal)', opacity: 0.5, animation: `pulse 1.2s ${i * 0.2}s infinite` }} />
                        ))}
                      </span>
                  }
                </div>
              </div>
            )}

            {submitError && (
              <p className="text-xs text-center" style={{ color: '#b42828' }}>{submitError}</p>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Capability pills — compact single row */}
          {def.capabilities.length > 0 && (
            <div className="flex gap-1.5 px-3 pt-2 flex-wrap flex-shrink-0">
              {def.capabilities.slice(0, 3).map(cap => (
                <span
                  key={cap.key}
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{ background: 'transparent', color: 'var(--color-text-tertiary)', border: '1px solid var(--color-structural)' }}
                >
                  {cap.label}
                </span>
              ))}
            </div>
          )}

          {/* Input row */}
          <div
            className="flex items-end gap-2 px-3 py-2.5 flex-shrink-0"
            style={{ borderTop: '1px solid var(--color-structural)' }}
          >
            <textarea
              ref={textareaRef}
              value={userInput}
              onChange={e => {
                setUserInput(e.target.value)
                e.target.style.height = 'auto'
                e.target.style.height = Math.min(e.target.scrollHeight, 80) + 'px'
              }}
              placeholder="Message…"
              rows={1}
              className="flex-1 resize-none rounded-lg px-3 py-2 text-xs outline-none"
              style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-structural)',
                color: 'var(--color-text-primary)',
                lineHeight: '1.5',
                maxHeight: '80px',
                overflow: 'auto',
              }}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit() } }}
            />
            <button
              onClick={handleSubmit}
              disabled={loading || !userInput.trim()}
              className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center"
              style={{
                background: 'var(--color-chrome)',
                color: '#fff',
                border: 'none',
                cursor: loading || !userInput.trim() ? 'default' : 'pointer',
                opacity: loading || !userInput.trim() ? 0.4 : 1,
              }}
            >
              {loading
                ? <span className="w-2.5 h-2.5 border border-white border-t-transparent rounded-full animate-spin" />
                : <span style={{ fontSize: '12px', lineHeight: 1 }}>↑</span>
              }
            </button>
          </div>

        </div>
      )}
    </div>
  )
}
