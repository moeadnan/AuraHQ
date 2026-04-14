import { type AgentDefinition, type AgentType } from '@/types'

export const AGENT_DEFINITIONS: Record<AgentType, AgentDefinition> = {
  // ─── WORK DOMAIN ──────────────────────────────────────────────────────────
  Manuscript: {
    type: 'Manuscript',
    domain: 'Work',
    tagline: 'Your writing, in your voice',
    energyType: 'Exact',
    visualDescription: 'Seven horizontal lines of varying weight',
    capabilities: [
      {
        key: 'draft',
        label: 'Draft',
        prompt: 'Describe what you need written — the purpose, audience, and key points you want covered.',
      },
      {
        key: 'refine',
        label: 'Refine',
        prompt: 'Paste the text you want refined. Tell me what specifically needs work.',
      },
      {
        key: 'voice-check',
        label: 'Voice check',
        prompt: 'Paste a piece of your writing. I\'ll tell you where it drifts from your established voice.',
      },
    ],
    seedingQuestions: [
      'Describe your writing in three words — how you want it to sound, not how it currently sounds.',
      'Who is your most important audience for written work, and how do they communicate?',
      'What is the writing mistake you make most when working under pressure?',
    ],
  },

  Counsel: {
    type: 'Counsel',
    domain: 'Work',
    tagline: 'Your thinking, honestly opposed',
    energyType: 'Adversarial',
    visualDescription: 'A single acute geometric wedge, narrow, high-precision',
    capabilities: [
      {
        key: 'challenge',
        label: 'Challenge',
        prompt: 'Describe the position or decision you\'re committed to. I\'ll build the strongest case against it.',
      },
      {
        key: 'clarify',
        label: 'Clarify',
        prompt: 'Walk me through your reasoning on something. I\'ll identify the assumptions you haven\'t examined.',
      },
      {
        key: 'align',
        label: 'Align',
        prompt: 'Describe your current plan or direction. I\'ll compare it against what you\'ve said your goals are.',
      },
    ],
    seedingQuestions: [
      'What is the most important professional goal you are working toward right now?',
      'What category of decision do you find hardest to think through clearly?',
      'Describe a professional decision you regretted — specifically, what went wrong in your thinking?',
    ],
  },

  Dispatch: {
    type: 'Dispatch',
    domain: 'Work',
    tagline: 'Your hardest professional communications, drafted',
    energyType: 'Diplomatic',
    visualDescription: 'A grid of small horizontal marks in a 4×3 arrangement',
    capabilities: [
      {
        key: 'draft',
        label: 'Draft',
        prompt: 'Who are you writing to, what\'s the relationship, and what needs to be said?',
      },
      {
        key: 'calibrate',
        label: 'Calibrate',
        prompt: 'Paste the message and tell me the adjustment: more direct, softer, more urgent, or more collaborative?',
      },
      {
        key: 'repair',
        label: 'Repair',
        prompt: 'Describe what went wrong in the relationship or conversation. I\'ll help you frame the reset.',
      },
    ],
    seedingQuestions: [
      'Name the two or three professional relationships that matter most to your work right now.',
      'What is your consistent communication weakness — too soft, too blunt, too deferential, too formal?',
      'Describe a professional communication situation you consistently find difficult.',
    ],
  },

  // ─── MONEY DOMAIN ─────────────────────────────────────────────────────────
  Ledger: {
    type: 'Ledger',
    domain: 'Money',
    tagline: 'Your money, interpreted',
    energyType: 'Analytical',
    visualDescription: 'Nine fine concentric partial arcs from a lower-left point',
    capabilities: [
      {
        key: 'analyze',
        label: 'Analyze',
        prompt: 'Share what\'s been happening with your money lately — spending, income, shifts. I\'ll give you an honest read.',
      },
      {
        key: 'compare',
        label: 'Compare',
        prompt: 'What period or pattern do you want to compare against your goals or past behavior?',
      },
      {
        key: 'project',
        label: 'Project',
        prompt: 'Describe your current financial trajectory. I\'ll show you where it ends up in 3, 6, and 12 months.',
      },
    ],
    seedingQuestions: [
      'What is a financial decision you keep postponing — and what is actually stopping you?',
      'If your financial situation were exactly where you want it in five years, what would be different about your daily life?',
      'Where does money create the most anxiety in your life right now, and why?',
    ],
  },

  Horizon: {
    type: 'Horizon',
    domain: 'Money',
    tagline: 'Your financial goals, tracked honestly',
    energyType: 'Forward-looking',
    visualDescription: 'A single arc climbing to a terminal point at upper right',
    capabilities: [
      {
        key: 'track',
        label: 'Track',
        prompt: 'Which goal do you want a progress report on? Share where you currently are.',
      },
      {
        key: 'model',
        label: 'Model',
        prompt: 'Describe the scenario you want to run — what changes, what\'s the goal, what\'s the timeline?',
      },
      {
        key: 'prioritize',
        label: 'Prioritize',
        prompt: 'Which goals are in tension right now? I\'ll help you reason through which one to accelerate.',
      },
    ],
    seedingQuestions: [
      'What is a financial decision you keep postponing — and what is actually stopping you?',
      'If your financial situation were exactly where you want it in five years, what would be different about your daily life?',
      'Where does money create the most anxiety in your life right now, and why?',
    ],
  },

  Terms: {
    type: 'Terms',
    domain: 'Money',
    tagline: 'Your financial negotiations, prepared',
    energyType: 'Strategic',
    visualDescription: 'Two horizontal lines with a single perpendicular bisecting both',
    capabilities: [
      {
        key: 'prepare',
        label: 'Prepare',
        prompt: 'What negotiation is coming up? Tell me your goal, your current position, and what you\'re uncertain about.',
      },
      {
        key: 'translate',
        label: 'Translate',
        prompt: 'Paste the clause or contract language you need explained in plain terms.',
      },
      {
        key: 'price',
        label: 'Price',
        prompt: 'Describe the engagement, what you\'re delivering, and the context. I\'ll help you determine a fee.',
      },
    ],
    seedingQuestions: [
      'What is a financial decision you keep postponing — and what is actually stopping you?',
      'If your financial situation were exactly where you want it in five years, what would be different about your daily life?',
      'Where does money create the most anxiety in your life right now, and why?',
    ],
  },

  // ─── PERSONAL GROWTH DOMAIN ───────────────────────────────────────────────
  Mirror: {
    type: 'Mirror',
    domain: 'Personal Growth',
    tagline: 'Your inner world, reflected without distortion',
    energyType: 'Reflective',
    visualDescription: 'Two identical forms facing each other across a precise center axis',
    capabilities: [
      {
        key: 'reflect',
        label: 'Reflect',
        prompt: 'What is happening for you right now — internally, not circumstantially? I\'ll ask the questions that produce clarity.',
      },
      {
        key: 'surface',
        label: 'Surface',
        prompt: 'Tell me what\'s been on your mind lately. I\'ll find the recurring themes you haven\'t named.',
      },
      {
        key: 'clarify',
        label: 'Clarify',
        prompt: 'Describe the situation you\'re inside and can\'t see clearly. I\'ll separate the noise from the signal.',
      },
    ],
    seedingQuestions: [
      'What is something you are currently struggling to understand about yourself?',
      'What is a pattern in your life you\'ve recognized but not been able to change?',
      'What would genuine clarity about yourself allow you to do?',
    ],
  },

  Grain: {
    type: 'Grain',
    domain: 'Personal Growth',
    tagline: 'Your patterns, named before they can change',
    energyType: 'Perceptive',
    visualDescription: 'Twelve lines of varying weight at a consistent 15-degree angle',
    capabilities: [
      {
        key: 'identify',
        label: 'Identify',
        prompt: 'Describe a behavior or reaction of yours that you don\'t fully understand. I\'ll look for the pattern.',
      },
      {
        key: 'name',
        label: 'Name',
        prompt: 'Tell me about a pattern you\'ve already noticed. I\'ll give it a precise working description.',
      },
      {
        key: 'track',
        label: 'Track',
        prompt: 'Which named pattern do you want to check on? I\'ll tell you whether it\'s actually changing.',
      },
    ],
    seedingQuestions: [
      'What is a behavior or reaction of yours that you don\'t fully understand?',
      'What pattern do the people who know you best say they see in you?',
      'In what kinds of situations do you feel most like yourself — and least?',
    ],
  },

  Meridian: {
    type: 'Meridian',
    domain: 'Personal Growth',
    tagline: 'Your values, made operational',
    energyType: 'Anchoring',
    visualDescription: 'A horizontal line crossing the exact center of a circle, extending beyond it',
    capabilities: [
      {
        key: 'orient',
        label: 'Orient',
        prompt: 'Describe the decision you\'re facing. I\'ll tell you which of your stated values are most at stake.',
      },
      {
        key: 'check',
        label: 'Check',
        prompt: 'Tell me about a recent decision or a period of behavior. I\'ll measure it against your values.',
      },
      {
        key: 'define',
        label: 'Define',
        prompt: 'Let\'s write a precise, usable statement of one of your values — specific enough to navigate from.',
      },
    ],
    seedingQuestions: [
      'What do you value most in how you live and work — name three things in your own language.',
      'Describe a recent decision you feel was right. What made it right?',
      'Where do your actions most often drift from what you say you believe?',
    ],
  },
}

export const DOMAIN_AGENTS: Record<string, AgentType[]> = {
  'Work': ['Manuscript', 'Counsel', 'Dispatch'],
  'Money': ['Ledger', 'Horizon', 'Terms'],
  'Personal Growth': ['Mirror', 'Grain', 'Meridian'],
}

export const DOMAINS = ['Work', 'Money', 'Personal Growth'] as const

export function getAgentDef(type: AgentType): AgentDefinition {
  return AGENT_DEFINITIONS[type]
}
