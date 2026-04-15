import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AgentCreationFlow } from '@/components/creation/AgentCreationFlow'

export default async function NewAgentPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    if (process.env.NODE_ENV !== 'development') redirect('/login')
    return (
      <AgentCreationFlow
        userId="dev"
        existingAgents={[]}
        ownerName="Dev"
        ownerAvatarUrl={null}
      />
    )
  }

  const [{ data: existingAgents }, { data: profile }] = await Promise.all([
    supabase.from('agents').select('agent_type, name').eq('user_id', user.id),
    supabase.from('profiles').select('name, avatar_url').eq('id', user.id).single(),
  ])

  return (
    <AgentCreationFlow
      userId={user.id}
      existingAgents={(existingAgents ?? []) as { agent_type: string; name: string }[]}
      ownerName={profile?.name ?? user.email ?? null}
      ownerAvatarUrl={profile?.avatar_url ?? null}
    />
  )
}
