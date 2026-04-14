import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AgentSettingsView } from '@/components/workspace/AgentSettingsView'
import type { Agent } from '@/types'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function AgentSettingsPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: agent } = await supabase
    .from('agents')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!agent) notFound()

  return <AgentSettingsView agent={agent as Agent} />
}
