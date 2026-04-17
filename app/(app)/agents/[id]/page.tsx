import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AgentWorkspace } from '@/components/workspace/AgentWorkspace'
import type { Agent, MemoryItem, AgentWatch, AgentArtifact } from '@/types'

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
  status_text: null,
  position_index: 0,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

export default async function AgentPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    if (process.env.NODE_ENV !== 'development') redirect('/login')
    return (
      <AgentWorkspace
        agent={DEV_AGENT}
        initialMemory={[]}
        initialCards={[]}
        initialWatches={[]}
        initialArtifacts={[]}
        userId="dev"
        googleConnected={false}
      />
    )
  }

  const [
    { data: agent },
    { data: memory },
    { data: convRows },
    { data: googleConn },
    { data: watches },
    { data: artifacts },
  ] = await Promise.all([
    supabase
      .from('agents')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single(),
    supabase
      .from('memory_items')
      .select('*')
      .eq('agent_id', id)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(25),
    supabase
      .from('conversations')
      .select('id, role, content, created_at')
      .eq('agent_id', id)
      .eq('user_id', user.id)
      .in('role', ['user', 'assistant'])
      .order('created_at', { ascending: true })
      .limit(60),
    supabase
      .from('oauth_connections')
      .select('id')
      .eq('user_id', user.id)
      .eq('provider', 'google')
      .maybeSingle(),
    supabase
      .from('agent_watches')
      .select('*')
      .eq('agent_id', id)
      .eq('user_id', user.id)
      .eq('resolved', false)
      .order('created_at', { ascending: false })
      .limit(10),
    supabase
      .from('agent_artifacts')
      .select('*')
      .eq('agent_id', id)
      .eq('user_id', user.id),
  ])

  if (!agent) notFound()

  return (
    <AgentWorkspace
      agent={agent as Agent}
      initialMemory={(memory ?? []) as MemoryItem[]}
      initialCards={convRows ?? []}
      initialWatches={(watches ?? []) as AgentWatch[]}
      initialArtifacts={(artifacts ?? []) as AgentArtifact[]}
      userId={user.id}
      googleConnected={!!googleConn}
    />
  )
}
