// Core types for AURA HQ

export type Domain = 'Work' | 'Money' | 'Personal Growth'

export type AgentType =
  // Work domain
  | 'Manuscript'
  | 'Counsel'
  | 'Dispatch'
  // Money domain
  | 'Ledger'
  | 'Horizon'
  | 'Terms'
  // Personal Growth domain
  | 'Mirror'
  | 'Grain'
  | 'Meridian'

export type AgentCapability =
  // Manuscript
  | 'Draft' | 'Refine' | 'Voice check'
  // Counsel
  | 'Challenge' | 'Clarify' | 'Align'
  // Dispatch
  | 'Draft message' | 'Calibrate' | 'Repair'
  // Ledger
  | 'Analyze' | 'Compare' | 'Project'
  // Horizon
  | 'Track' | 'Model' | 'Prioritize'
  // Terms
  | 'Prepare' | 'Translate' | 'Price'
  // Mirror
  | 'Reflect' | 'Surface' | 'Clarify thinking'
  // Grain
  | 'Identify' | 'Name' | 'Track pattern'
  // Meridian
  | 'Orient' | 'Check' | 'Define'

export type NodeState = 'active' | 'quiet' | 'dormant' | 'incomplete'

export interface Profile {
  id: string
  name: string | null
  role: string | null
  support_area: string | null
  capacity_answer: string | null
  avatar_url: string | null
  avatar_fallback_used: boolean
  onboarding_completed: boolean
  subscription_status: 'trial' | 'active' | 'expired'
  trial_ends_at: string | null
  created_at: string
  updated_at: string
}

export interface Agent {
  id: string
  user_id: string
  name: string
  domain: Domain
  agent_type: AgentType
  purpose: string
  seed_answer_1: string | null
  seed_answer_2: string | null
  seed_answer_3: string | null
  last_used_at: string | null
  position_index: number
  created_at: string
  updated_at: string
}

export interface MemoryItem {
  id: string
  agent_id: string
  user_id: string
  content: string
  source: 'seed' | 'confirmed' | 'auto'
  created_at: string
}

export interface OutputCard {
  id: string
  agent_id: string
  user_id: string
  capability: string
  user_input: string
  output_text: string
  saved_to_memory: boolean
  created_at: string
}

export interface AgentDefinition {
  type: AgentType
  domain: Domain
  tagline: string
  capabilities: { key: string; label: string; prompt: string }[]
  seedingQuestions: [string, string, string]
  energyType: string
  visualDescription: string
}

export interface OnboardingData {
  name: string
  role: string
  supportArea: string
  capacityAnswer: string
  photoFile: File | null
  photoPreview: string | null
}
