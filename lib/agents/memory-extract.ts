import { getOpenAI } from '@/lib/openai'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import type { AgentType, MemoryItem } from '@/types'

function getServiceClient() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function extractAndStoreMemory(opts: {
  agentId: string
  userId: string
  agentType: AgentType
  purpose: string
  userInput: string
  agentResponse: string
  existingMemory: MemoryItem[]
}): Promise<void> {
  const { agentId, userId, agentType, purpose, userInput, agentResponse, existingMemory } = opts

  const openai = getOpenAI()

  const result = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    max_tokens: 150,
    temperature: 0.2,
    messages: [
      {
        role: 'system',
        content: `Extract 0–2 specific facts about this user from the conversation exchange below.
Rules:
- Facts must be about the user: their situation, preferences, patterns, goals, history, or specific details they revealed
- Each fact must be concrete and reusable in future sessions — not a summary of what was discussed
- If the user revealed nothing new worth remembering, return nothing
- One fact per line, no bullets, no numbering
- Maximum 20 words per fact
- Do NOT extract: generic advice given, the task that was completed, or conversation summaries`,
      },
      {
        role: 'user',
        content: `Agent type: ${agentType}
Agent purpose: ${purpose}
User said: ${userInput.slice(0, 400)}
Agent responded: ${agentResponse.slice(0, 600)}`,
      },
    ],
  })

  const raw = result.choices[0]?.message?.content?.trim() ?? ''
  if (!raw) return

  const newFacts = raw
    .split('\n')
    .map(l => l.trim())
    .filter(l => l.length > 5 && l.length < 160)
    .slice(0, 2)

  if (newFacts.length === 0) return

  const service = getServiceClient()

  // Prune oldest auto items to stay within the 25-item limit
  const currentCount = existingMemory.length
  const available = 25 - currentCount
  if (available <= 0) {
    const autoItems = existingMemory
      .filter(m => m.source === 'auto')
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    const toDelete = autoItems.slice(0, newFacts.length)
    if (toDelete.length > 0) {
      await service
        .from('memory_items')
        .delete()
        .in('id', toDelete.map(m => m.id))
    }
  }

  const rows = newFacts.map(content => ({
    agent_id: agentId,
    user_id: userId,
    content,
    source: 'auto',
  }))

  await service.from('memory_items').insert(rows)
}
