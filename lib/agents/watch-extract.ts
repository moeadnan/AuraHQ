import { getOpenAI } from '@/lib/openai'
import { createClient as createServiceClient } from '@supabase/supabase-js'

function getServiceClient() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function extractAndStoreWatches(opts: {
  agentId: string
  userId: string
  agentResponse: string
}): Promise<void> {
  const { agentId, userId, agentResponse } = opts

  if (agentResponse.length < 80) return

  const openai = getOpenAI()

  const result = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    max_tokens: 200,
    temperature: 0.2,
    messages: [
      {
        role: 'system',
        content: `Scan this AI agent response for forward-looking observations — things the agent is tracking or wants to revisit.

Extract 0–2 watches. A watch is something the agent intends to check on or monitor. Look for:
- Explicit statements like "I'll watch whether...", "Next time check...", "Worth revisiting..."
- Implicit forward intent: the agent describes something still unresolved, a trajectory that needs monitoring, or an open question to come back to

Format: one watch per line, phrased as what the agent is watching (e.g., "Whether the rate negotiation moves forward as planned")
If nothing forward-looking is present, return nothing.`,
      },
      {
        role: 'user',
        content: agentResponse.slice(0, 800),
      },
    ],
  })

  const raw = result.choices[0]?.message?.content?.trim() ?? ''
  if (!raw) return

  const watches = raw
    .split('\n')
    .map(l => l.replace(/^[-•*]\s*/, '').trim())
    .filter(l => l.length > 10 && l.length < 200)
    .slice(0, 2)

  if (watches.length === 0) return

  const service = getServiceClient()
  const rows = watches.map(content => ({
    agent_id: agentId,
    user_id: userId,
    content,
    resolved: false,
  }))
  await service.from('agent_watches').insert(rows)
}
