import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AgentSettingsView } from '@/components/workspace/AgentSettingsView'
import type { Agent } from '@/types'

interface PageProps {
  params: Promise<{ id: string }>
}

const DEV_AGENT: Agent = {
  id: 'dev',
  user_id: 'dev',
  name: 'Manuscript',
  domain: 'Work',
  agent_type: 'Manuscript',
  purpose: 'Your writing, sharpened. Drafts, refinements, and voice checks — all in your style.',
  seed_answer_1: null,
  seed_answer_2: null,
  seed_answer_3: null,
  last_used_at: null,
  position_index: 0,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

export default async function AgentSettingsPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    if (process.env.NODE_ENV !== 'development') redirect('/login')
    return <AgentSettingsView agent={DEV_AGENT} />
  }

  const { data: agent } = await supabase
    .from('agents')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!agent) notFound()

  return <AgentSettingsView agent={agent as Agent} />
}
