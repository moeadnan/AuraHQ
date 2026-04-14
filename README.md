# AURA HQ

> *AI that works beneath you, not beside you.*

AURA HQ is a personal AI organization — built by one person, around one person, commanded by one person. You begin with your portrait. Beneath it, you build a system of named AI agents across Work, Money, and Personal Growth. Each agent holds your context, deepens with every use, and works from purposes you wrote.

---

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, TypeScript, Tailwind CSS v4 |
| Backend | **FastAPI (Python 3.12)** managed with **uv** |
| Database | Supabase (Postgres + Auth + Storage) |
| AI | OpenAI GPT-4o (avatar), GPT-4o-mini (agents), DALL-E 3 (portraits) |
| Deployment | Vercel (frontend) + any Python host (backend) |

---

## Project structure

```
/
├── app/
│   ├── (auth)/            # Login and signup pages
│   │   ├── login/
│   │   └── signup/
│   ├── (app)/             # Protected app routes (requires auth + onboarding)
│   │   ├── hq/            # Main HQ view
│   │   └── agents/
│   │       ├── new/       # Agent creation flow
│   │       └── [id]/      # Agent workspace + settings
│   ├── onboarding/        # First-run onboarding flow
│   ├── api/
│   │   ├── avatar/generate/   # POST — DALL-E 3 avatar generation
│   │   └── agents/[id]/
│   │       ├── chat/          # POST — GPT-4o-mini agent conversation
│   │       └── memory/        # GET/DELETE — memory management
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx           # Landing page
├── components/
│   ├── creation/          # AgentCreationFlow (5-step)
│   ├── hq/                # HQView, AgentSignature (SVG visual identities)
│   ├── onboarding/        # AvatarCeremony, SubscriptionOffer
│   └── workspace/         # AgentWorkspace, AgentSettingsView
├── lib/
│   ├── agents/
│   │   ├── definitions.ts # All 9 agent definitions (capabilities, seeding, energy)
│   │   └── system-prompts.ts  # Domain-specific system prompt builder
│   ├── supabase/
│   │   ├── client.ts      # Browser Supabase client
│   │   ├── server.ts      # Server-side Supabase client
│   │   └── middleware.ts  # Auth session management
│   ├── openai.ts
│   └── utils.ts
├── supabase/
│   └── migrations/
│       └── 001_initial.sql    # Full DB schema + RLS + storage
├── types/
│   └── index.ts           # All TypeScript types
├── middleware.ts           # Route protection
└── vercel.json
```

---

## Setup

### 1. Install prerequisites

```bash
# just (command runner)
brew install just

# uv (Python package manager)
curl -LsSf https://astral.sh/uv/install.sh | sh
```

### 2. Clone and run first-time setup

```bash
git clone <repo>
cd aurahq
just setup      # installs npm deps + creates backend venv + copies .env.local
```

### 3. Fill in environment variables

Edit `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
OPENAI_API_KEY=...
BACKEND_URL=http://localhost:8000     # points Next.js at the FastAPI backend
```

### 4. Run the Supabase migration

1. Create a project at [supabase.com](https://supabase.com)
2. In SQL Editor, run `supabase/migrations/001_initial.sql`
3. In Authentication settings, disable email confirmation for development

### 5. Run both services

```bash
just dev        # starts Next.js (port 3000) + FastAPI (port 8000) together
```

Or separately:

```bash
just dev-frontend   # Next.js only
just dev-backend    # FastAPI only
```

Open [http://localhost:3000](http://localhost:3000).

FastAPI interactive docs: [http://localhost:8000/api/docs](http://localhost:8000/api/docs)

---

## Deployment (Vercel)

1. Push to GitHub
2. Import the repo at [vercel.com](https://vercel.com)
3. Add all environment variables in Vercel project settings
4. Deploy

The `vercel.json` is already configured with 60-second function timeouts for avatar generation and agent chat.

---

## The 9 agents

### Work domain
| Agent | Tagline | Capabilities |
|-------|---------|--------------|
| **Manuscript** | Your writing, in your voice | Draft · Refine · Voice check |
| **Counsel** | Your thinking, honestly opposed | Challenge · Clarify · Align |
| **Dispatch** | Your hardest communications, drafted | Draft · Calibrate · Repair |

### Money domain
| Agent | Tagline | Capabilities |
|-------|---------|--------------|
| **Ledger** | Your money, interpreted | Analyze · Compare · Project |
| **Horizon** | Your financial goals, tracked honestly | Track · Model · Prioritize |
| **Terms** | Your financial negotiations, prepared | Prepare · Translate · Price |

### Personal Growth domain
| Agent | Tagline | Capabilities |
|-------|---------|--------------|
| **Mirror** | Your inner world, reflected without distortion | Reflect · Surface · Clarify |
| **Grain** | Your patterns, named before they can change | Identify · Name · Track |
| **Meridian** | Your values, made operational | Orient · Check · Define |

---

## Design system

All colors, spacing, and motion are derived from the AURA HQ design specification:

| Token | Value | Role |
|-------|-------|------|
| `--color-ground` | `#16100A` | All backgrounds |
| `--color-surface` | `#EFE8DA` | Cards and panels |
| `--color-raised` | `#F5F0E7` | Active inputs |
| `--color-principal` | `#B8762A` | Avatar ring, primary CTAs |
| `--color-secondary` | `#5C4A38` | Labels, purpose text |
| `--color-structural` | `#2A2620` | Lines, borders |

Typography: Cormorant Garamond (display/serif) · DM Sans (operational/sans).

---

## Documentation

All product, design, and experience documentation lives in `/docs`:

| Folder | Contents |
|--------|----------|
| `docs/strategy/` | Concept development, refined concept |
| `docs/product/` | Product blueprint, agent catalog v2 |
| `docs/design/` | Art direction, visual system |
| `docs/experience/` | App experience design |
| `docs/brief/` | Design brief v2, requirements |
| `docs/review/` | Critical review, final direction |

---

## Core principle

Every decision returns to one question:

*Does this make the user feel like the architect of their own intelligent world, or less?*

If less — cut it. If more — protect it.
