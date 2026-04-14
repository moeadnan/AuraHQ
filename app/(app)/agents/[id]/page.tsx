import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AgentWorkspace } from '@/components/workspace/AgentWorkspace'
import type { Agent, MemoryItem, OutputCard } from '@/types'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function AgentPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: agent }, { data: memory }, { data: cards }] = await Promise.all([
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
      .from('output_cards')
      .select('*')
      .eq('agent_id', id)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20),
  ])

  if (!agent) notFound()

  return (
    <AgentWorkspace
      agent={agent as Agent}
      initialMemory={(memory ?? []) as MemoryItem[]}
      initialCards={(cards ?? []) as OutputCard[]}
      userId={user.id}
    />
  )
}
