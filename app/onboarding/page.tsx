'use client'

import { useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { AvatarCeremony } from '@/components/onboarding/AvatarCeremony'
import { SubscriptionOffer } from '@/components/onboarding/SubscriptionOffer'

type Step =
  | 'q1'       // role/domain
  | 'q2'       // area needing support
  | 'q3'       // what you'd do with more mental capacity
  | 'photo'    // photo upload
  | 'generating' // avatar generation in progress
  | 'ceremony' // avatar reveal ceremony
  | 'offer'    // subscription offer

const ROLES = [
  { value: 'Founder / Entrepreneur', icon: '◈' },
  { value: 'Creative Professional', icon: '◇' },
  { value: 'Knowledge Worker', icon: '◆' },
  { value: 'Executive / Leader', icon: '◉' },
  { value: 'Freelancer / Consultant', icon: '○' },
  { value: 'Something else', icon: '◌' },
]

const SUPPORT_AREAS = [
  { value: 'Work and output quality', icon: '◈' },
  { value: 'Money and financial clarity', icon: '◆' },
  { value: 'Self-understanding and growth', icon: '◇' },
  { value: 'Projects and execution', icon: '◉' },
  { value: 'Health and daily habits', icon: '○' },
  { value: 'All of the above', icon: '◌' },
]

export default function OnboardingPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [step, setStep] = useState<Step>('q1')
  const [role, setRole] = useState('')
  const [supportArea, setSupportArea] = useState('')
  const [capacityAnswer, setCapacityAnswer] = useState('')
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [generationError, setGenerationError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  // Start avatar generation in background after photo is selected
  const generateAvatar = useCallback(async (file: File, capturedCapacityAnswer: string) => {
    const formData = new FormData()
    formData.append('photo', file)
    formData.append('capacityAnswer', capturedCapacityAnswer)

    try {
      const res = await fetch('/api/avatar/generate', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Generation failed')
      }

      const data = await res.json()
      setAvatarUrl(data.avatarUrl)
      setStep('ceremony')
    } catch (err) {
      console.error('Avatar generation failed:', err)
      setGenerationError('Avatar generation encountered an issue. Using your original photo.')
      // Fall back to original photo
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const path = `${user.id}/avatar_fallback.jpg`
        const { data: uploaded } = await supabase.storage.from('avatars').upload(path, file, { upsert: true })
        if (uploaded) {
          const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(path)
          setAvatarUrl(urlData.publicUrl)
        }
      }
      setStep('ceremony')
    }
  }, [])

  function handlePhotoSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setPhotoFile(file)
    const reader = new FileReader()
    reader.onload = (ev) => setPhotoPreview(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  function handlePhotoConfirm() {
    if (!photoFile) return
    setStep('generating')
    generateAvatar(photoFile, capacityAnswer)
  }

  async function handleCeremonyComplete() {
    setStep('offer')
  }

  async function handleOfferAccept() {
    setSaving(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase.from('profiles').update({
      role,
      support_area: supportArea,
      capacity_answer: capacityAnswer,
      avatar_url: avatarUrl,
      onboarding_completed: true,
      subscription_status: 'trial',
    }).eq('id', user.id)

    router.push('/hq')
  }

  async function handleOfferDecline() {
    setSaving(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase.from('profiles').update({
      role,
      support_area: supportArea,
      capacity_answer: capacityAnswer,
      avatar_url: avatarUrl,
      onboarding_completed: true,
      subscription_status: 'expired',
    }).eq('id', user.id)

    router.push('/hq')
  }

  // ─── Ceremony / Offer screens ──────────────────────────────────────────────
  if (step === 'ceremony' && avatarUrl) {
    return (
      <AvatarCeremony
        avatarUrl={avatarUrl}
        onComplete={handleCeremonyComplete}
      />
    )
  }

  if (step === 'offer') {
    return (
      <SubscriptionOffer
        avatarUrl={avatarUrl!}
        onAccept={handleOfferAccept}
        onDecline={handleOfferDecline}
        loading={saving}
        suggestedDomain={supportArea}
      />
    )
  }

  // ─── Main onboarding flow ──────────────────────────────────────────────────
  return (
    <div
      className="min-h-dvh flex flex-col items-center justify-center px-6"
      style={{ background: 'var(--color-ground)' }}
    >
      <div className="w-full max-w-xl">
        {/* Q1 — Role */}
        {step === 'q1' && (
          <div className="animate-fade-up">
            <p
              className="text-xs font-medium tracking-widest uppercase mb-6 text-center"
              style={{ color: 'var(--color-text-tertiary)' }}
            >
              1 of 3
            </p>
            <h2
              className="font-display font-light text-center mb-8"
              style={{ fontSize: '30px', color: 'var(--color-surface)', letterSpacing: '0.015em', lineHeight: 1.3 }}
            >
              What do you do?
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {ROLES.map((r) => (
                <button
                  key={r.value}
                  onClick={() => { setRole(r.value); setStep('q2') }}
                  className="p-4 rounded-lg text-left transition-all"
                  style={{
                    background: role === r.value ? 'rgba(184, 118, 42, 0.12)' : 'rgba(42, 38, 32, 0.5)',
                    border: `1px solid ${role === r.value ? 'rgba(184, 118, 42, 0.5)' : 'rgba(42, 38, 32, 0.6)'}`,
                    color: 'var(--color-surface)',
                  }}
                >
                  <span className="block text-lg mb-1" style={{ color: 'var(--color-principal)' }}>{r.icon}</span>
                  <span className="text-sm">{r.value}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Q2 — Support area */}
        {step === 'q2' && (
          <div className="animate-fade-up">
            <p
              className="text-xs font-medium tracking-widest uppercase mb-6 text-center"
              style={{ color: 'var(--color-text-tertiary)' }}
            >
              2 of 3
            </p>
            <h2
              className="font-display font-light text-center mb-8"
              style={{ fontSize: '30px', color: 'var(--color-surface)', letterSpacing: '0.015em', lineHeight: 1.3 }}
            >
              Where do you need
              <br />the most support?
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {SUPPORT_AREAS.map((a) => (
                <button
                  key={a.value}
                  onClick={() => { setSupportArea(a.value); setStep('q3') }}
                  className="p-4 rounded-lg text-left transition-all"
                  style={{
                    background: 'rgba(42, 38, 32, 0.5)',
                    border: '1px solid rgba(42, 38, 32, 0.6)',
                    color: 'var(--color-surface)',
                  }}
                >
                  <span className="block text-lg mb-1" style={{ color: 'var(--color-principal)' }}>{a.icon}</span>
                  <span className="text-sm">{a.value}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Q3 — Mental capacity */}
        {step === 'q3' && (
          <div className="animate-fade-up">
            <p
              className="text-xs font-medium tracking-widest uppercase mb-6 text-center"
              style={{ color: 'var(--color-text-tertiary)' }}
            >
              3 of 3
            </p>
            <h2
              className="font-display font-light text-center mb-3"
              style={{ fontSize: '30px', color: 'var(--color-surface)', letterSpacing: '0.015em', lineHeight: 1.3 }}
            >
              What would you do with
              <br />more mental capacity?
            </h2>
            <p
              className="text-center text-sm mb-8"
              style={{ color: 'var(--color-text-tertiary)' }}
            >
              Your first agent will be built from your answer.
            </p>
            <textarea
              value={capacityAnswer}
              onChange={e => setCapacityAnswer(e.target.value)}
              placeholder="Write without filtering. This is for you."
              rows={4}
              className="input-field mb-4"
              style={{ fontSize: '16px' }}
            />
            <button
              onClick={() => setStep('photo')}
              disabled={capacityAnswer.trim().length < 10}
              className="btn-primary w-full"
            >
              Continue
            </button>
          </div>
        )}

        {/* Photo upload */}
        {step === 'photo' && (
          <div className="animate-fade-up text-center">
            <h2
              className="font-display font-light mb-3"
              style={{ fontSize: '30px', color: 'var(--color-surface)', letterSpacing: '0.015em' }}
            >
              Place yourself at the top
            </h2>
            <p
              className="text-sm mb-8"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Upload a photo. AI will render your portrait for your HQ.
            </p>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoSelect}
              className="hidden"
            />

            {!photoPreview ? (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-40 h-40 rounded-full mx-auto flex flex-col items-center justify-center gap-3 mb-8 transition-all"
                style={{
                  background: 'rgba(42, 38, 32, 0.5)',
                  border: '1px dashed rgba(184, 118, 42, 0.4)',
                  color: 'var(--color-text-tertiary)',
                }}
              >
                <span className="text-3xl" style={{ color: 'var(--color-principal)' }}>+</span>
                <span className="text-xs">Upload photo</span>
              </button>
            ) : (
              <div className="relative w-40 h-40 rounded-full mx-auto mb-8 overflow-hidden principal-ring">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photoPreview}
                  alt="Your photo"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                  style={{ background: 'rgba(22, 16, 10, 0.6)' }}
                >
                  <span className="text-xs" style={{ color: 'var(--color-surface)' }}>Change</span>
                </button>
              </div>
            )}

            <button
              onClick={handlePhotoConfirm}
              disabled={!photoFile}
              className="btn-primary w-full max-w-xs mx-auto block"
            >
              Generate my portrait
            </button>

            <p className="text-xs mt-3" style={{ color: 'var(--color-text-tertiary)' }}>
              Any clear photo works. A face photo gives the best result.
            </p>
          </div>
        )}

        {/* Generating */}
        {step === 'generating' && (
          <div className="text-center animate-fade-in">
            <div
              className="w-32 h-32 rounded-full mx-auto mb-8 flex items-center justify-center"
              style={{ background: 'rgba(42, 38, 32, 0.6)', border: '2px solid rgba(184, 118, 42, 0.3)' }}
            >
              <span
                className="font-display font-light text-4xl animate-pulse"
                style={{ color: 'var(--color-principal)' }}
              >
                ◈
              </span>
            </div>
            <p
              className="font-display font-light text-xl mb-2"
              style={{ color: 'var(--color-surface)', letterSpacing: '0.02em' }}
            >
              Composing your portrait
            </p>
            <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
              This takes about 30 seconds
            </p>
            {generationError && (
              <p className="text-xs mt-4" style={{ color: 'var(--color-principal-light)' }}>
                {generationError}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
