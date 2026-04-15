import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { getOpenAI } from '@/lib/openai'

function buildStylePrompt(capacityAnswer: string): string {
  const lower = capacityAnswer.toLowerCase()
  if (/build|start|found|create/.test(lower))
    return 'Studio founder aesthetic. Confident, composed expression. Professional but not corporate.'
  if (/write|design|art|creative/.test(lower))
    return 'Creative director aesthetic. Thoughtful expression. Artistic but precise.'
  if (/invest|money|financial|business/.test(lower))
    return 'Executive portrait aesthetic. Polished, authoritative expression.'
  if (/health|fit|run|workout/.test(lower))
    return 'Performance-oriented aesthetic. Alert, energized expression.'
  if (/think|learn|read|research/.test(lower))
    return 'Intellectual aesthetic. Perceptive, engaged expression.'
  return 'Professional portrait. Composed, confident expression. Premium editorial quality.'
}

async function getUserFromRequest(req: NextRequest) {
  // Primary: use the access token from the Authorization header
  const authHeader = req.headers.get('Authorization')
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.slice(7)
    // Verify the token using the anon client
    const anon = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    const { data: { user } } = await anon.auth.getUser(token)
    if (user) return user
  }

  // Fallback: try server-side cookie-based session
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function POST(req: NextRequest) {
  const user = await getUserFromRequest(req)

  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const formData = await req.formData()
  const photo = formData.get('photo') as File | null
  const capacityAnswer = (formData.get('capacityAnswer') as string) ?? ''

  if (!photo || !photo.type.startsWith('image/')) {
    return NextResponse.json({ error: 'File must be an image' }, { status: 400 })
  }

  const photoBytes = await photo.arrayBuffer()
  const mime = photo.type || 'image/jpeg'

  const openai = getOpenAI()

  // Convert photo to a File for the images.edit endpoint
  const photoFile = new File([photoBytes], 'photo.png', { type: mime })

  // Build style from Q3 answer
  const stylePrompt = buildStylePrompt(capacityAnswer)

  // Generate a stylized avatar directly from the photo — preserves the person's likeness
  const imageResponse = await openai.images.edit({
    model: 'gpt-image-1',
    image: photoFile,
    prompt:
      `Transform this photo into a stylized editorial portrait avatar. ` +
      `Preserve the person's exact facial features, skin tone, hair color, and hair style — ` +
      `the result must be clearly recognizable as the same person. ` +
      `${stylePrompt} ` +
      `Rembrandt lighting: warm key light at 45 degrees, subtle shadow triangle. ` +
      `Deep warm dark brown gradient background. ` +
      `Cinematic quality, sharp focus on face, painterly editorial style. ` +
      `No text, no watermarks.`,
    size: '1024x1024',
  })

  const imageB64 = imageResponse.data[0]?.b64_json
  if (!imageB64) {
    return NextResponse.json({ error: 'Image generation returned no data' }, { status: 500 })
  }
  const imgBytes = Buffer.from(imageB64, 'base64')
  const storagePath = `${user.id}/avatar.png`

  // Use service role for storage operations to avoid RLS issues
  const service = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  await service.storage.from('avatars').upload(storagePath, imgBytes, {
    contentType: 'image/png',
    upsert: true,
  })

  const { data: publicUrlData } = service.storage.from('avatars').getPublicUrl(storagePath)
  const avatarUrl = publicUrlData.publicUrl

  await service.from('profiles').update({ avatar_url: avatarUrl }).eq('id', user.id)

  return NextResponse.json({ avatarUrl })
}
