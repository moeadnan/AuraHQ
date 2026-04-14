'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

interface AvatarCeremonyProps {
  avatarUrl: string
  onComplete: () => void
}

type Phase =
  | 'chemistry'   // 0-1.5s: dark frame with grain
  | 'warmth'      // 1.5-3.5s: warm tones resolve
  | 'form'        // 3.5-5.5s: face becomes readable
  | 'definition'  // 5.5-7s: fine detail + ring appears
  | 'silence'     // 7-9s: portrait only, name appears
  | 'done'

export function AvatarCeremony({ avatarUrl, onComplete }: AvatarCeremonyProps) {
  const [phase, setPhase] = useState<Phase>('chemistry')
  const [imageOpacity, setImageOpacity] = useState(0)
  const [ringOpacity, setRingOpacity] = useState(0)
  const [showName, setShowName] = useState(false)

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []

    // Chemistry phase — dark, grain visible
    timers.push(setTimeout(() => setPhase('warmth'), 1500))

    // Warmth phase — image starts fading in with warm tones
    timers.push(setTimeout(() => {
      setPhase('warmth')
      setImageOpacity(0.3)
    }, 1500))

    // Form phase — image more visible
    timers.push(setTimeout(() => {
      setPhase('form')
      setImageOpacity(0.65)
    }, 3500))

    // Definition phase — full image + ring appears
    timers.push(setTimeout(() => {
      setPhase('definition')
      setImageOpacity(1)
      setRingOpacity(1)
    }, 5500))

    // Silence phase — name appears
    timers.push(setTimeout(() => {
      setPhase('silence')
      setShowName(true)
    }, 7000))

    // Done — trigger next step
    timers.push(setTimeout(() => {
      setPhase('done')
      onComplete()
    }, 9500))

    return () => timers.forEach(clearTimeout)
  }, [onComplete])

  return (
    <div
      className="min-h-dvh flex flex-col items-center justify-center ceremony-frame"
      style={{ background: 'var(--color-ground)' }}
    >
      {/* Grain overlay */}
      <div className="ceremony-grain" aria-hidden="true" />

      {/* Portrait */}
      <div
        className="relative mb-8"
        style={{
          width: 200,
          height: 200,
          borderRadius: '50%',
          overflow: 'hidden',
          boxShadow: `0 0 0 ${ringOpacity * 2}px rgba(184, 118, 42, ${ringOpacity})`,
          transition: 'box-shadow 1500ms cubic-bezier(0.04, 0, 0.2, 1)',
        }}
      >
        {/* Base dark circle */}
        <div
          className="absolute inset-0 rounded-full"
          style={{ background: 'var(--color-ground)' }}
        />

        {/* Avatar image */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: imageOpacity,
            transition: 'opacity 2000ms cubic-bezier(0.04, 0, 0.2, 1)',
          }}
        >
          <Image
            src={avatarUrl}
            alt="Your portrait"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Warm color wash overlay (reduces as image fully resolves) */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(184, 118, 42, 0.15) 0%, transparent 70%)',
            opacity: phase === 'warmth' || phase === 'form' ? 1 : 0,
            transition: 'opacity 1000ms cubic-bezier(0.04, 0, 0.2, 1)',
          }}
        />
      </div>

      {/* Name appears in silence phase */}
      {showName && (
        <p
          className="font-display font-light tracking-widest animate-fade-in"
          style={{
            fontSize: '22px',
            color: 'var(--color-surface)',
            letterSpacing: '0.1em',
          }}
        >
          Your HQ
        </p>
      )}
    </div>
  )
}
