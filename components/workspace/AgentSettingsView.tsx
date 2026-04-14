'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { Agent } from '@/types'

interface AgentSettingsViewProps {
  agent: Agent
}

export function AgentSettingsView({ agent }: AgentSettingsViewProps) {
  const router = useRouter()
  const [name, setName] = useState(agent.name)
  const [purpose, setPurpose] = useState(agent.purpose)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const supabase = createClient()
    await supabase
      .from('agents')
      .update({ name: name.trim(), purpose: purpose.trim() })
      .eq('id', agent.id)
    setSaving(false)
    router.push(`/agents/${agent.id}`)
  }

  async function handleDelete() {
    if (!confirmDelete) {
      setConfirmDelete(true)
      return
    }
    setDeleting(true)
    const supabase = createClient()
    await supabase.from('agents').delete().eq('id', agent.id)
    router.push('/hq')
  }

  return (
    <div className="min-h-dvh" style={{ background: 'var(--color-ground)' }}>
      <header className="flex items-center px-5 py-4" style={{ borderBottom: '1px solid rgba(42, 38, 32, 0.5)' }}>
        <Link href={`/agents/${agent.id}`} className="text-sm mr-4" style={{ color: 'var(--color-text-tertiary)' }}>
          ← Back
        </Link>
        <p className="font-medium text-sm" style={{ color: 'var(--color-surface)' }}>
          {agent.name} · Settings
        </p>
      </header>

      <main className="max-w-md mx-auto px-5 pt-8 pb-12">
        <form onSubmit={handleSave} className="space-y-6 mb-10">
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--color-text-tertiary)' }}>
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value.slice(0, 30))}
              maxLength={30}
              required
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--color-text-tertiary)' }}>
              Purpose
            </label>
            <textarea
              value={purpose}
              onChange={e => setPurpose(e.target.value.slice(0, 120))}
              maxLength={120}
              rows={3}
              required
              className="input-field"
              style={{ fontFamily: 'var(--font-display)', fontSize: '15px' }}
            />
            <p className="text-xs mt-1" style={{ color: 'var(--color-text-tertiary)' }}>{purpose.length}/120</p>
          </div>

          <button type="submit" disabled={saving} className="btn-primary w-full">
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </form>

        {/* Danger zone */}
        <div className="pt-6" style={{ borderTop: '1px solid rgba(42, 38, 32, 0.4)' }}>
          <p className="text-xs font-medium mb-3" style={{ color: 'var(--color-text-tertiary)' }}>
            Danger zone
          </p>
          {!confirmDelete ? (
            <button
              onClick={handleDelete}
              className="text-sm"
              style={{ color: '#c0392b', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              Delete this agent
            </button>
          ) : (
            <div>
              <p className="text-sm mb-3" style={{ color: 'var(--color-surface)' }}>
                This will delete the agent and all its memory. This cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="btn-ghost text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="text-sm px-4 py-2 rounded"
                  style={{ background: '#c0392b', color: 'white', border: 'none', cursor: 'pointer' }}
                >
                  {deleting ? 'Deleting…' : 'Yes, delete'}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
