'use client'

import Image from 'next/image'

interface SubscriptionOfferProps {
  avatarUrl: string
  onAccept: () => void
  onDecline: () => void
  loading: boolean
  suggestedDomain: string
}

export function SubscriptionOffer({
  avatarUrl,
  onAccept,
  onDecline,
  loading,
  suggestedDomain,
}: SubscriptionOfferProps) {
  return (
    <div
      className="min-h-dvh flex flex-col items-center justify-center px-6 animate-fade-in"
      style={{ background: 'var(--color-ground)' }}
    >
      <div className="w-full max-w-sm text-center">
        {/* Portrait */}
        <div
          className="w-24 h-24 rounded-full mx-auto mb-6 relative overflow-hidden principal-ring"
          style={{ boxShadow: '0 0 0 2px var(--color-principal), 0 0 20px rgba(184, 118, 42, 0.3)' }}
        >
          <Image
            src={avatarUrl}
            alt="Your portrait"
            fill
            className="object-cover"
          />
        </div>

        <h2
          className="font-display font-normal text-2xl mb-2"
          style={{ color: 'var(--color-primary)' }}
        >
          Your HQ is ready
        </h2>
        <p className="text-sm mb-8" style={{ color: 'var(--color-text-secondary)' }}>
          Start building your agents. Your first 14 days are free.
        </p>

        {/* Pricing card */}
        <div
          className="rounded-lg p-6 mb-6 text-left"
          style={{ background: 'var(--color-surface)', border: '1px solid var(--color-structural)' }}
        >
          <div className="flex items-baseline justify-between mb-4">
            <span
              className="font-display font-normal text-3xl"
              style={{ color: 'var(--color-primary)' }}
            >
              $25
            </span>
            <span className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
              / month after trial
            </span>
          </div>

          <ul className="space-y-2">
            {[
              'All 3 domains: Work, Money, Personal Growth',
              '9 specialized agents with persistent memory',
              'Up to 25 memory items per agent',
              'Unlimited conversations',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                <span style={{ color: 'var(--color-principal)', marginTop: 1 }}>◆</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={onAccept}
          disabled={loading}
          className="btn-primary w-full mb-3 text-base py-4"
        >
          {loading ? 'Building your HQ…' : 'Start 14-day free trial'}
        </button>

        <button
          onClick={onDecline}
          disabled={loading}
          className="text-sm w-full py-2"
          style={{ color: 'var(--color-text-tertiary)', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          Maybe later
        </button>
      </div>
    </div>
  )
}
