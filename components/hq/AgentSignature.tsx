// Abstract visual signatures for each agent type
// Non-representational, geometric compositions rendered as SVG

import { type AgentType } from '@/types'

interface AgentSignatureProps {
  agentType: AgentType
  size?: number
}

export function AgentSignature({ agentType, size = 64 }: AgentSignatureProps) {
  const s = size
  const signatures: Record<AgentType, React.ReactElement> = {
    // Work: Manuscript — seven horizontal lines of varying weight
    Manuscript: (
      <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
        {[8, 14, 20, 27, 34, 42, 50].map((y, i) => (
          <line
            key={i}
            x1="8" y1={y} x2="56" y2={y}
            stroke="#5C4A38"
            strokeWidth={[0.8, 1.5, 1, 2.5, 0.8, 1.5, 1.5][i]}
            opacity={0.9}
          />
        ))}
      </svg>
    ),

    // Work: Counsel — acute geometric wedge, off-center right
    Counsel: (
      <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
        <path d="M38 8 L52 32 L38 56" stroke="#2A2620" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
        <path d="M38 18 L47 32 L38 46" fill="#2A2620" opacity="0.6" />
      </svg>
    ),

    // Work: Dispatch — 4×3 grid of horizontal marks
    Dispatch: (
      <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
        {[16, 30, 44].map((y, row) =>
          [10, 22, 34, 46].map((x, col) => (
            <line
              key={`${row}-${col}`}
              x1={x} y1={y} x2={x + 8} y2={y}
              stroke="#5C4A38"
              strokeWidth="1.2"
              opacity={row === 2 && col === 1 ? 1 : 0.65}
            />
          ))
        )}
      </svg>
    ),

    // Money: Ledger — concentric partial arcs from lower-left
    Ledger: (
      <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
        {[12, 20, 28, 36, 44, 52, 60, 68, 76].map((r, i) => (
          <path
            key={i}
            d={`M 8,56 A ${r} ${r} 0 0 1 ${8 + r * 0.85},${56 - r * 0.85}`}
            stroke="#B8762A"
            strokeWidth="0.8"
            fill="none"
            opacity={0.7 + i * 0.03}
          />
        ))}
      </svg>
    ),

    // Money: Horizon — single arc lower-left to upper-right
    Horizon: (
      <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
        <path d="M 8 52 Q 32 8 56 12" stroke="#CCAA6A" strokeWidth="1.5" fill="none" />
        <circle cx="8" cy="52" r="2" fill="#CCAA6A" />
        <circle cx="56" cy="12" r="2" fill="#CCAA6A" />
      </svg>
    ),

    // Money: Terms — two horizontals + perpendicular bisector
    Terms: (
      <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
        <line x1="10" y1="24" x2="54" y2="24" stroke="#2A2620" strokeWidth="1.2" />
        <line x1="10" y1="40" x2="54" y2="40" stroke="#2A2620" strokeWidth="1.2" />
        <line x1="32" y1="16" x2="32" y2="48" stroke="#2A2620" strokeWidth="1.2" />
      </svg>
    ),

    // Personal Growth: Mirror — two identical forms facing each other
    Mirror: (
      <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
        <path d="M 10 16 L 28 32 L 10 48" stroke="#2A2620" strokeWidth="1.2" fill="none" strokeLinejoin="round" />
        <path d="M 54 16 L 36 32 L 54 48" stroke="#2A2620" strokeWidth="1.2" fill="none" strokeLinejoin="round" />
        <line x1="32" y1="10" x2="32" y2="54" stroke="#2A2620" strokeWidth="0.5" opacity="0.4" />
      </svg>
    ),

    // Personal Growth: Grain — 12 lines varying weight at 15° angle
    Grain: (
      <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
        {Array.from({ length: 12 }, (_, i) => {
          const x = 4 + i * 5
          const weight = 0.4 + (i % 3) * 0.6 + (i % 7) * 0.2
          return (
            <line
              key={i}
              x1={x} y1="56"
              x2={x + 14} y2="8"
              stroke="#8A7E72"
              strokeWidth={weight}
              opacity={0.7}
            />
          )
        })}
      </svg>
    ),

    // Personal Growth: Meridian — horizontal line crossing center of circle
    Meridian: (
      <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
        <circle cx="32" cy="32" r="16" stroke="#B8762A" strokeWidth="1" fill="none" />
        <line x1="4" y1="32" x2="60" y2="32" stroke="#B8762A" strokeWidth="1.2" />
      </svg>
    ),
  }

  return signatures[agentType] ?? (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <rect x="16" y="16" width="32" height="32" stroke="#2A2620" strokeWidth="1" fill="none" />
    </svg>
  )
}
