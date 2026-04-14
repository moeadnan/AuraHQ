import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { type AgentType, type NodeState } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Determine node activity state based on last_used_at */
export function getNodeState(lastUsedAt: string | null): NodeState {
  if (!lastUsedAt) return 'incomplete'
  const days = (Date.now() - new Date(lastUsedAt).getTime()) / (1000 * 60 * 60 * 24)
  if (days <= 7) return 'active'
  if (days <= 30) return 'quiet'
  return 'dormant'
}

/** Format relative time for ambient status */
export function relativeTime(dateStr: string | null): string {
  if (!dateStr) return 'never'
  const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24))
  if (days === 0) return 'today'
  if (days === 1) return '1 day ago'
  if (days < 30) return `${days} days ago`
  const months = Math.floor(days / 30)
  return `${months} month${months > 1 ? 's' : ''} ago`
}

/** Map agent type to its domain */
export function agentTypeToDomain(type: AgentType): string {
  const map: Record<AgentType, string> = {
    Manuscript: 'Work', Counsel: 'Work', Dispatch: 'Work',
    Ledger: 'Money', Horizon: 'Money', Terms: 'Money',
    Mirror: 'Personal Growth', Grain: 'Personal Growth', Meridian: 'Personal Growth',
  }
  return map[type]
}
