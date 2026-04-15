import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { HQView } from '@/components/hq/HQView'
import type { Agent, Profile } from '@/types'

export default async function HQPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    if (process.env.NODE_ENV !== 'development') redirect('/login')
    return <HQView profile={{ id: 'dev', name: 'Dev', avatar_url: null, onboarding_completed: true } as Profile} agents={[]} />
  }

  const [{ data: profile }, { data: agents }] = await Promise.all([
    supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single(),
    supabase
      .from('agents')
      .select('*')
      .eq('user_id', user.id)
      .order('position_index', { ascending: true }),
  ])

  return (
    <HQView
      profile={(profile ?? { id: user.id, name: user.email, avatar_url: null, onboarding_completed: false }) as Profile}
      agents={(agents ?? []) as Agent[]}
    />
  )
}
