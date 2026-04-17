import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { getOpenAI } from '@/lib/openai'
import { buildSystemPrompt } from '@/lib/agents/system-prompts'
import { extractAndStoreMemory } from '@/lib/agents/memory-extract'
import { generateAndStoreStatus } from '@/lib/agents/status-generate'
import { extractAndStoreWatches } from '@/lib/agents/watch-extract'
import { updateArtifactIfTriggered } from '@/lib/agents/artifact-update'
import type { AgentType, MemoryItem, AgentArtifact, AgentWatch } from '@/types'

function getServiceClient() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

async function getUserFromRequest(req: NextRequest) {
  const authHeader = req.headers.get('Authorization')
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.slice(7)
    const anon = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    const { data: { user } } = await anon.auth.getUser(token)
    if (user) return user
  }
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

function sse(event: Record<string, string>): Uint8Array {
  return new TextEncoder().encode(`data: ${JSON.stringify(event)}\n\n`)
}

// Derive continuity context from existing conversation history
function buildContinuityContext(
  convRows: { role: string; content: string; created_at: string }[]
): string | undefined {
  if (convRows.length === 0) return undefined

  const lastMessage = convRows.at(-1)
  if (!lastMessage) return undefined

  const hoursAgo = (Date.now() - new Date(lastMessage.created_at).getTime()) / (1000 * 60 * 60)
  if (hoursAgo < 6) return undefined // same session, no continuity needed

  const daysAgo = Math.floor(hoursAgo / 24)
  const lastAssistant = [...convRows].reverse().find(m => m.role === 'assistant')
  if (!lastAssistant) return undefined

  const when = daysAgo === 0 ? 'earlier today' : daysAgo === 1 ? 'yesterday' : `${daysAgo} days ago`
  const excerpt = lastAssistant.content.slice(0, 180).replace(/\n+/g, ' ')
  return `This person was last here ${when}. Your last message to them ended with: "${excerpt}"`
}

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  const user = await getUserFromRequest(req)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id: agentId } = await params
  const body = await req.json() as { capability?: string; user_input?: string }
  const capability = body.capability ?? 'auto'
  const userInput = (body.user_input ?? '').trim()

  if (!userInput) {
    return NextResponse.json({ error: 'user_input is required' }, { status: 400 })
  }

  const service = getServiceClient()

  // Load all agent data in parallel
  const [
    { data: agent },
    { data: memoryRows },
    { data: convRows },
    { data: artifactRows },
    { data: watchRows },
  ] = await Promise.all([
    service
      .from('agents')
      .select('*')
      .eq('id', agentId)
      .eq('user_id', user.id)
      .single(),
    service
      .from('memory_items')
      .select('*')
      .eq('agent_id', agentId)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(25),
    service
      .from('conversations')
      .select('id, role, content, created_at')
      .eq('agent_id', agentId)
      .eq('user_id', user.id)
      .in('role', ['user', 'assistant'])
      .order('created_at', { ascending: true })
      .limit(40),
    service
      .from('agent_artifacts')
      .select('artifact_type, content')
      .eq('agent_id', agentId)
      .eq('user_id', user.id),
    service
      .from('agent_watches')
      .select('content')
      .eq('agent_id', agentId)
      .eq('user_id', user.id)
      .eq('resolved', false)
      .order('created_at', { ascending: false })
      .limit(5),
  ])

  if (!agent) {
    return NextResponse.json({ error: 'Agent not found' }, { status: 404 })
  }

  const memory = (memoryRows ?? []) as MemoryItem[]
  const conversations = (convRows ?? []) as { id: string; role: string; content: string; created_at: string }[]
  const artifacts = (artifactRows ?? []) as Pick<AgentArtifact, 'artifact_type' | 'content'>[]
  const watches = (watchRows ?? []) as Pick<AgentWatch, 'content'>[]

  const continuityContext = buildContinuityContext(conversations)

  const systemPrompt = buildSystemPrompt({
    agentType: agent.agent_type as AgentType,
    agentName: agent.name,
    purpose: agent.purpose,
    memory,
    capability,
    artifacts,
    watches,
    continuityContext,
  })

  // Build full message array: system + history + new user message
  const messages: { role: 'system' | 'user' | 'assistant'; content: string }[] = [
    { role: 'system', content: systemPrompt },
    ...conversations.map(c => ({
      role: c.role as 'user' | 'assistant',
      content: c.content,
    })),
    { role: 'user', content: userInput },
  ]

  const openai = getOpenAI()

  const stream = new ReadableStream({
    async start(controller) {
      let fullText = ''

      try {
        const completion = await openai.chat.completions.create({
          model: 'gpt-4o',
          messages,
          stream: true,
          max_tokens: 1500,
          temperature: 0.7,
        })

        for await (const chunk of completion) {
          const delta = chunk.choices[0]?.delta?.content ?? ''
          if (delta) {
            fullText += delta
            controller.enqueue(sse({ type: 'delta', text: fullText }))
          }
        }

        // Store conversation turns (must complete before closing stream)
        await Promise.all([
          service.from('conversations').insert([
            { agent_id: agentId, user_id: user.id, role: 'user', content: userInput },
            { agent_id: agentId, user_id: user.id, role: 'assistant', content: fullText },
          ]),
          service
            .from('agents')
            .update({ last_used_at: new Date().toISOString() })
            .eq('id', agentId),
        ])

        // Fire background agentic work — no await, runs concurrently after stream closes
        Promise.all([
          extractAndStoreMemory({
            agentId,
            userId: user.id,
            agentType: agent.agent_type as AgentType,
            purpose: agent.purpose,
            userInput,
            agentResponse: fullText,
            existingMemory: memory,
          }),
          generateAndStoreStatus({
            agentId,
            agentName: agent.name,
            agentType: agent.agent_type as AgentType,
            userInput,
            agentResponse: fullText,
          }),
          extractAndStoreWatches({
            agentId,
            userId: user.id,
            agentResponse: fullText,
          }),
          updateArtifactIfTriggered({
            agentId,
            userId: user.id,
            agentType: agent.agent_type as AgentType,
            capability,
            userInput,
            agentResponse: fullText,
          }),
        ]).catch(() => {})

      } catch (err) {
        const message = err instanceof Error ? err.message : 'Something went wrong'
        controller.enqueue(sse({ type: 'error', text: message }))
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}
