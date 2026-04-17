import { getOpenAI } from '@/lib/openai'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import type { AgentType } from '@/types'

function getServiceClient() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function generateAndStoreStatus(opts: {
  agentId: string
  agentName: string
  agentType: AgentType
  userInput: string
  agentResponse: string
}): Promise<void> {
  const { agentId, agentName, agentType, userInput, agentResponse } = opts

  const openai = getOpenAI()

  const result = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    max_tokens: 20,
    temperature: 0.3,
    messages: [
      {
        role: 'system',
        content: `Generate a 3–6 word present-tense status for an AI agent card shown on a personal dashboard.

Rules:
- Maximum 6 words, no punctuation at the end
- Present tense, describes what the agent just did or is actively tracking
- Specific to this exchange — not generic
- Start with a verb or noun phrase
- Good examples: "Tracking rate negotiation prep", "Named the avoidance pattern", "Drafted board memo", "Projecting 12-month cash flow", "Voice model updated"
- Bad examples: "Ready to help", "Had a conversation", "Completed task"`,
      },
      {
        role: 'user',
        content: `Agent: ${agentName} (${agentType})
User asked about: ${userInput.slice(0, 200)}
Agent response excerpt: ${agentResponse.slice(0, 300)}`,
      },
    ],
  })

  const statusText = result.choices[0]?.message?.content?.trim() ?? ''
  if (!statusText || statusText.length > 60) return

  const service = getServiceClient()
  await service
    .from('agents')
    .update({ status_text: statusText, last_used_at: new Date().toISOString() })
    .eq('id', agentId)
}
