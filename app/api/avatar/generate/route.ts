import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { getOpenAI } from '@/lib/openai'

// Cartoon-cinematic base — preserves likeness, stylizes into illustration
const BASE_PROMPT =
  `Transform this photo into a bold stylized portrait illustration. ` +
  `Semi-cartoon graphic style: clean strong outlines, vibrant saturated colors, simplified but expressive forms. ` +
  `Preserve the person's exact face shape, eyes, skin tone, and hair color — unmistakably the same person. ` +
  `Positive, confident, natural expression. Bright and uplifting feel. ` +
  `Dramatic Rembrandt lighting: strong warm key light, deep shadow triangle. ` +
  `Cinematic close-up composition, sharp focus on face. No text, no watermarks, no logos.`

// Per-agent clothing + setting — funny, creative, tied to each agent's role
const AGENT_CLOTHING: Record<string, string> = {
  manuscript:
    `Wearing a vintage tweed jacket with worn leather elbow patches, ink stains on the fingers and shirt cuffs, ` +
    `a feathered quill tucked behind the ear like a pen, tiny wire-rimmed spectacles slightly askew on the nose. ` +
    `Deep warm library background with faint bookshelves.`,

  counsel:
    `Wearing an austere judge's black robe with a comically oversized powdered white wig piled high on the head, ` +
    `holding a tiny gavel with an air of supreme authority, permanently skeptical raised-eyebrow expression. ` +
    `Dark formal wood-panelled courtroom background.`,

  dispatch:
    `Wearing a sharp diplomat's suit with an absurd collection of tiny country flag pins covering every inch of both lapels, ` +
    `a gleaming ambassador sash across the chest, a comically overstuffed leather briefcase under one arm. ` +
    `Neutral marble diplomatic hall background.`,

  ledger:
    `Wearing a classic accountant's outfit: bright green eyeshade visor pushed up on the forehead, ` +
    `rainbow suspenders over a crisp white shirt, breast pocket dangerously overstuffed with colored pens and a ruler, ` +
    `a comically large abacus beads necklace worn like jewelry. Clean mid-century office background.`,

  horizon:
    `Wearing a loud colorful stock-exchange trading floor vest covered in handwritten sticky notes with numbers and arrows, ` +
    `binoculars hung around the neck, paper ticker tape spilling dramatically from the breast pocket. ` +
    `High-energy financial trading floor background with glowing screens.`,

  terms:
    `Wearing an over-the-top double-breasted pinstripe power suit, silk pocket square perfectly folded, ` +
    `one wrist visibly handcuffed to an elegant monogrammed leather briefcase, three phones peeking from various pockets. ` +
    `Sleek dark negotiation room background.`,

  mirror:
    `Wearing an oversized cozy therapist cardigan in soft warm earth tones with mismatched buttons, ` +
    `sensible reading glasses perched on the nose, holding a small ornate hand mirror as a prop, ` +
    `a clipboard with illegible notes tucked under the other arm. Warm soft-lit background with faint bookshelves.`,

  grain:
    `Wearing a full Sherlock Holmes detective outfit: tweed deerstalker hat, long classic trench coat, ` +
    `holding an oversized magnifying glass up to one eye, small notebook covered in red-string conspiracy diagrams visible. ` +
    `Moody foggy atmospheric detective-office background.`,

  meridian:
    `Wearing a flowing linen explorer coat that is half Indiana Jones and half Zen monk robe, ` +
    `an antique brass compass on a chain around the neck, a worn leather-bound journal tucked under one arm, ` +
    `looking like someone who has seen every horizon and written it all down. Natural earthy background with faint mountain silhouette.`,
}

// Base style for the CEO node avatar
const BASE_STYLE =
  `Premium editorial portrait. Deep warm dark brown gradient background. Polished, composed expression.`

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

export async function POST(req: NextRequest) {
  const user = await getUserFromRequest(req)
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const formData = await req.formData()
  const photo = formData.get('photo') as File | null

  if (!photo || !photo.type.startsWith('image/')) {
    return NextResponse.json({ error: 'File must be an image' }, { status: 400 })
  }

  const photoBytes = await photo.arrayBuffer()
  const mime = photo.type || 'image/jpeg'
  const makeFile = () => new File([photoBytes], 'photo.png', { type: mime })

  const openai = getOpenAI()

  const service = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const agentEntries = Object.entries(AGENT_CLOTHING)

  // Generate base + all 9 agent variants in parallel from the original photo
  const [baseResult, ...agentResults] = await Promise.all([
    openai.images.edit({
      model: 'gpt-image-1',
      image: makeFile(),
      prompt: `${BASE_PROMPT} ${BASE_STYLE}`,
      size: '1024x1024',
    }),
    ...agentEntries.map(([, clothing]) =>
      openai.images.edit({
        model: 'gpt-image-1',
        image: makeFile(),
        prompt: `${BASE_PROMPT} ${clothing}`,
        size: '1024x1024',
      })
    ),
  ])

  const imageB64 = baseResult.data?.[0]?.b64_json
  if (!imageB64) {
    return NextResponse.json({ error: 'Image generation returned no data' }, { status: 500 })
  }

  async function uploadVariant(b64: string | undefined, path: string) {
    if (!b64) return
    const bytes = Buffer.from(b64, 'base64')
    await service.storage.from('avatars').upload(path, bytes, {
      contentType: 'image/png',
      upsert: true,
    })
  }

  // Upload base + all agent variants (variants are best-effort)
  await Promise.all([
    uploadVariant(imageB64, `${user.id}/avatar.png`),
    ...agentEntries.map(([name], i) =>
      uploadVariant(agentResults[i]?.data?.[0]?.b64_json, `${user.id}/avatar_${name}.png`)
    ),
  ])

  const { data: publicUrlData } = service.storage.from('avatars').getPublicUrl(`${user.id}/avatar.png`)
  const avatarUrl = publicUrlData.publicUrl

  await service.from('profiles').update({ avatar_url: avatarUrl }).eq('id', user.id)

  return NextResponse.json({ avatarUrl })
}
