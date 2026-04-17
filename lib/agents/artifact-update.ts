import { getOpenAI } from '@/lib/openai'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import type { AgentType } from '@/types'

function getServiceClient() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

// Maps agent_type + capability → artifact_type + update instructions
const ARTIFACT_TRIGGERS: Partial<Record<AgentType, Record<string, {
  artifactType: 'voice_model' | 'pattern_registry' | 'negotiation_context'
  systemPrompt: (userInput: string, agentResponse: string, existing: string) => string
}>>> = {
  Manuscript: {
    'voice-check': {
      artifactType: 'voice_model',
      systemPrompt: (input, response, existing) =>
        `You maintain a voice model for a writer. Update it based on new analysis.

Current model (may be empty):
${existing || '(none yet)'}

New writing sample reviewed:
${input.slice(0, 500)}

Analysis of that writing:
${response.slice(0, 600)}

Output an updated voice model in 3–5 sentences covering:
- Sentence length and structural tendencies
- Tone and register (formal/casual, direct/hedged, etc.)
- Distinctive vocabulary or rhetorical moves
- Known weaknesses or drift patterns to correct

Output only the updated voice model — no preamble, no labels.`,
    },
  },

  Grain: {
    'name': {
      artifactType: 'pattern_registry',
      systemPrompt: (input, response, existing) =>
        `You maintain a registry of behavioral patterns for a person. Add the newly named pattern.

Current registry:
${existing || '(empty)'}

Pattern just named (from agent response):
${response.slice(0, 500)}

Output the updated registry. Keep all existing entries. Append the new pattern as a new entry.
Format each entry as: [Pattern name]: [1-sentence description]
Output only the registry — no extra text.`,
    },
  },

  Terms: {
    'prepare': {
      artifactType: 'negotiation_context',
      systemPrompt: (input, response, existing) =>
        `You maintain a running negotiation context for someone. Update it with the latest session.

Previous context:
${existing || '(none yet)'}

Latest negotiation topic:
${input.slice(0, 300)}

Preparation provided:
${response.slice(0, 500)}

Output an updated 3–5 sentence negotiation context summary capturing:
- What they're negotiating and with whom
- Their goal and walkaway position (if known)
- Key preparation points from the most recent session

Output only the context — no labels, no preamble.`,
    },
  },
}

export async function updateArtifactIfTriggered(opts: {
  agentId: string
  userId: string
  agentType: AgentType
  capability: string
  userInput: string
  agentResponse: string
}): Promise<void> {
  const { agentId, userId, agentType, capability, userInput, agentResponse } = opts

  const config = ARTIFACT_TRIGGERS[agentType]?.[capability]
  if (!config) return

  const service = getServiceClient()

  // Load existing artifact
  const { data: existing } = await service
    .from('agent_artifacts')
    .select('content')
    .eq('agent_id', agentId)
    .eq('artifact_type', config.artifactType)
    .maybeSingle()

  const existingContent = existing?.content ?? ''

  const openai = getOpenAI()
  const result = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    max_tokens: 400,
    temperature: 0.2,
    messages: [
      {
        role: 'user',
        content: config.systemPrompt(userInput, agentResponse, existingContent),
      },
    ],
  })

  const updatedContent = result.choices[0]?.message?.content?.trim() ?? ''
  if (!updatedContent) return

  await service.from('agent_artifacts').upsert(
    {
      agent_id: agentId,
      user_id: userId,
      artifact_type: config.artifactType,
      content: updatedContent,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'agent_id,artifact_type' }
  )
}
