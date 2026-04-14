import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AgentCreationFlow } from '@/components/creation/AgentCreationFlow'

export default async function NewAgentPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: existingAgents } = await supabase
    .from('agents')
    .select('id, domain, agent_type')
    .eq('user_id', user.id)

  return (
    <AgentCreationFlow
      userId={user.id}
      existingAgentTypes={(existingAgents ?? []).map(a => a.agent_type)}
    />
  )
}
