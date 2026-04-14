# Refined App Experience

**Phase 8 of AURA HQ — Cleaning, tightening, and making every decision explicit**

> Removing SaaS dashboard patterns, thin chatbot conventions, and over-described concepts. The result: a product with three surfaces, a spatial navigation model, and a clear claim it can actually prove.

---

## Table of Contents

1. [Refined Core App Model](#1-refined-core-app-model)
2. [Stronger Screen Hierarchy](#2-stronger-screen-hierarchy)
3. [Sharper MVP App Flow](#3-sharper-mvp-app-flow)
4. [The 5 Most Important UX Moves](#4-the-5-most-important-ux-moves)
5. [The 5 Biggest App Experience Traps](#5-the-5-biggest-app-experience-traps)

---

## What Gets Cut Before Starting

| Cut | Why |
|---|---|
| Principal's miniature avatar as navigation element | Tapping your own face to go "home" is not intuitive without explanation — navigation that requires explanation is broken |
| Eight "main screens" | Dashboard thinking — the product has three surfaces; everything else is a panel or flow |
| Discovery / Inspiration as a screen | App-store mindset applied to a personal infrastructure product |
| Ambient status copy without real data backing | Generic copy (*"Your agents are active"*) is worse than no copy |

---

## 1. Refined Core App Model

### The spatial premise

AURA HQ has a spatial architecture that no other product uses. Two axes of movement, both reinforcing the product's premise.

**The vertical axis — HQ above, workspaces below:**
Moving from HQ to workspace is a descent (you are entering your agent's domain). Moving from workspace to HQ is a rise (you are surfacing to your command view). On mobile: swipe up from any workspace to surface the HQ. On desktop: the HQ is always accessible from the top edge of the workspace view.

**The horizontal axis — agents side by side:**
Workspaces are laterally connected. You move between agents without surfacing to the HQ. On mobile: swipe left or right within a workspace. On desktop: a narrow agent rail at the workspace's left edge shows the other agents in your HQ. The rightmost position in the horizontal axis is always the creation entry point — the next empty position.

```
         ┌─────────────────────────────┐
         │  HQ — Principal + Structure  │  ← swipe up to surface
         └───────────────┬─────────────┘
                         │ tap node to descend
         ┌───────────────▼──────────────────────────────┐
         │ [Work] ←→ [Finance] ←→ [Health] ←→ [  +  ] │
         └──────────────────────────────────────────────┘
                ↕ swipe between workspaces horizontally
```

The plus node at the right of the horizontal axis is always visible — the structure's next position, waiting to be filled.

### The three primary surfaces

The product has exactly three surfaces. Everything else is a panel, a modal state, or a flow that emerges from one of these three.

**Surface 1 — The HQ**
Where you return. State of the entire system at a glance. Principal at apex, agents below, ambient status. Entry point to all workspaces and to the creation flow.

**Surface 2 — The Workspace**
Where work happens with a specific agent. Capability strip, output cards, memory context. Laterally connected to adjacent workspaces. The desk.

**Surface 3 — The Creation Flow**
The contained ceremony of making a new agent. Opens from any empty node. Has its own visual grammar. Closes by returning to the HQ with the new agent in position.

### What does not get its own surface

| Element | Lives in |
|---|---|
| Profile / avatar | Panel: tap the Principal node in HQ |
| Memory management | Panel: expandable from workspace bottom |
| Agent settings | Panel: workspace header settings icon |
| Templates / inspiration | Step: within creation flow at domain selection |
| HQ settings | Within profile panel |

**The test:** Is this a place you go, or information you summon? If you can summon it without leaving where you are, it must be a panel.

---

### The ambient status — specified precisely

The ambient status is one sentence, maximum 12 words, combining the most active and the most neglected agent with specific state.

**Format:** *"[Agent] has [state]. [Agent] hasn't heard from you in [duration]."*

**Examples:**
- *"Work has a draft ready. Finance hasn't heard from you in 11 days."*
- *"Health logged a reflection. Work is waiting on 2 open items."*
- *"Finance flagged something. All other agents are quiet."*

This sentence is the reason to look at the HQ on every return rather than navigating directly to a workspace. It must be backed by real activity data. If the data infrastructure cannot support this at launch: **do not ship the ambient status line.** Communicate state through node visual treatment alone. Generic copy is worse than no copy.

---

## 2. Stronger Screen Hierarchy

```
SURFACE 1: HQ
┌──────────────────────────────────────────┐
│          [Avatar Portrait]               │
│          Principal Name                  │
│  "Work has a draft. Finance: 11 days."   │
│                                          │
│   ┌──────┐  ┌──────┐  ┌──────┐  ┌──┐   │
│   │ Work │  │ Fin. │  │ Hlth │  │+ │   │
│   └──────┘  └──────┘  └──────┘  └──┘   │
└──────────────────────────────────────────┘
        ↓ tap node         ↓ tap +

SURFACE 2: WORKSPACE              SURFACE 3: CREATION
┌────────────────────────┐        ┌─────────────────────┐
│ Work  ·  Burnished tag │        │ Step 1: Domain      │
│ "Help me..."           │        │ Step 2: Name        │
│ [Draft] [Review] [Rsrch│        │ Step 3: Purpose     │
├────────────────────────┤        │ Step 4: Seed (req.) │
│ [Output Card]          │        │ Step 5: Confirm     │
│ [Output Card]          │        └─────────────────────┘
│ [Output Card]          │         Closes → HQ, new node
├────────────────────────┤
│ ▸ Memory  (8 items)    │
└────────────────────────┘
  ↑ swipe up to HQ    ←→ swipe between agents
```

### Screen responsibilities — the hard rules

**HQ must only show:** Principal identity, structural hierarchy, agent activity states, ambient status, and entry points to workspaces and creation. Nothing that requires navigation within the HQ itself.

**Workspace must only show:** The agent's fixed identity (name, domain, purpose), capabilities, work outputs, and memory. Nothing from other agents. Nothing that could exist in the HQ.

**Creation flow must only show:** The five creation steps, one at a time. No navigation back to HQ mid-flow. No previewing the HQ structure until the confirmation step.

---

## 3. Sharper MVP App Flow

### What the MVP must prove

**One claim:** A scoped, seeded agent produces better output from session one than any generic AI tool — and improves with use.

Everything in the MVP either proves this claim or establishes the emotional foundation that makes proving it matter.

---

### The complete MVP flow

```
ENTRY
└─ Landing: archetypal HQ silhouette, empty Principal seat, "Build your HQ"

ONBOARDING — non-skippable, ~4 minutes, no progress bar
├─ Q1: Primary role / domain  [full screen, answer cards]
├─ Q2: Area needing most support  [full screen, answer cards]
├─ Q3: What would you do with more mental capacity?  [open text]
├─ Photo upload: "Place yourself at the top"
│   └─ [Avatar generation begins in background during Q3 + upload]
├─ Generation ceremony: 13s — begins only when result is ready
├─ Avatar reveal: 2 seconds of silence
└─ Subscription offer (14-day trial)
    ├─ Accept → HQ assembles → suggested agent from Q3 appears
    └─ Decline → exit or grace period

FIRST SESSION
├─ HQ: Principal + 1 suggested agent + 2 empty nodes
├─ Tap agent → workspace
├─ One-time quiet guidance: most relevant capability glows slightly
├─ Input panel: capability-specific prompt + seeded memory items visible
│   └─ "Based on what you told me" above memory items
├─ First output card appears
├─ "Save to memory" surfaces on card
└─ Swipe up → HQ updates ambient status

EXPANSION
├─ Tap empty node → creation flow
├─ Three domain types available: Work, Finance, Health
├─ Max 5 agent nodes in MVP (Principal + 4 agents)
└─ Lateral swipe between workspaces enabled from session 2

RETURN SESSION (day 2+)
├─ HQ ambient status shows real agent state (specific, actionable)
├─ Memory items surface automatically in capability input from session 2
└─ Node visual states reflect actual usage
```

---

### The five MVP screens — complete specifications

**A — Landing**
Burnt Umber Dark. Full HQ silhouette — empty Resin Amber Principal ring, three empty agent nodes in centered arc, Deep Slate Warm connector lines. Logotype in display serif. One CTA: *"Build your HQ."* Nothing else.

**B — Onboarding**
Four moments, single contained flow, no back navigation, no progress bar.
- Questions: display serif at ~30pt, answer cards in Antler with Burnished Sienna text
- Photo: Resin Amber circle frame, *"Place yourself at the top"*
- Generation: Burnt Umber Dark, *"Composing your presence"* in serif, grain develops
- Reveal: 13-second ceremony (ceremony begins only when result is ready)

**C — HQ**
Principal avatar (Resin Amber ring, portrait) at center-top. Ambient status one line below in Burnished Sienna humanist sans. Agents in horizontal arc — maximum four nodes, first-tier only. Plus node at far right. Swipe up from workspace to reach.

**D — Agent Workspace**
Fixed header: agent name + domain tag. Purpose statement below in Burnished Sienna. Capability strip (3 items per domain). Input panel expands from strip on selection. Output cards accumulate in work area. Memory panel expandable from bottom. Lateral swipe between agents.

**E — Creation Flow**
Five full-screen steps. Domain grid → Name input → Purpose text (previewed in serif as permanent element) → Seeding (3 domain-specific required questions) → Placement preview + *"Add to your HQ."* Returns to HQ with connection line drawing and node population animation.

---

### Definitive MVP exclusions

| Excluded | Reason |
|---|---|
| Domains 4–6 | Three real > six shallow |
| Discovery screen | Creates breadth before depth is proven |
| Weekly synthesis | Engineering complexity, noise risk |
| Agent sub-structures | Requires second-tier HQ layout, not built in MVP |
| Sharing | Dilutes singular premise |
| Mobile app | Web first — validate spatial layout |
| Freeform "Ask" mode | Test capability model without escape hatch |
| Notification system | Trust before push |
| Animated decorations beyond the 7 defined microinteractions | No decoration |

---

### The four MVP hypotheses — answered by month 3

1. Does the avatar ceremony produce subscription conversion at a rate that validates the cost of building it?
2. Do seeded agents produce measurably higher session frequency than unseeded agents?
3. Does the capability strip model produce higher-quality first outputs than a freeform input would have?
4. Do users swipe up to the HQ between workspace sessions, or bypass it entirely?

Hypothesis 4 determines whether the HQ is a product or a loading screen. If users consistently bypass it, the ambient status mechanism must be rebuilt before V2.

---

## 4. The 5 Most Important UX Moves

These are the decisions that make AURA HQ irreducibly different. Remove any one and the product becomes undifferentiated.

---

### Move 1: The spatial navigation model

No navigation chrome. Movement is spatial and reinforces the product's premise: you are above your agents, and your agents work in parallel beneath you.

Swipe up → HQ (command view). Swipe left / right → adjacent workspace (lateral delegation). Tap node → descend into workspace. The navigation model is the product's metaphor, expressed as gesture.

**Why this matters:** Every other product with multi-agent architecture uses a tab bar, a sidebar, or a menu — patterns that treat agents as equal-weight items in a list. The spatial model treats them as parallel, beneath-you collaborators. The gesture reinforces the hierarchy before a word is read.

---

### Move 2: The capability strip

Three specific capabilities per domain. The user selects an action before typing. The input panel that opens is scoped to that action and pre-contextualised with memory items.

A user who opens ChatGPT sees a blank box and must compose a prompt from scratch. A user who opens their AURA Finance agent sees *"Analyze · Track · Advise"* and selects the action most relevant to their current need. The action selection is the framing that makes the agent's response more precise.

**Why this matters:** The capability model is the product's most direct functional differentiation from generic AI chat. If executed poorly, AURA HQ is a chat product with premium chrome. Executed well, it is the mechanism that makes agents feel genuinely specialized.

---

### Move 3: Memory as encountered context

Memory is not something the user manages. It is something they encounter — as context cards appearing automatically in the input panel, before they type anything, labeled *"Based on what you told me."*

The sequence: select capability → input panel opens → two or three memory items surface below the text area → user types → agent responds with that context already integrated.

**Why this matters:** A memory feature in a settings panel is an archive. A memory feature that surfaces in the workflow is a collaborator. The difference between these two determines whether the user perceives AURA HQ's core claim as real or as aspirational copy.

---

### Move 4: The HQ as operational read

The HQ is worth returning to only if it tells the user something specific they did not already know. The ambient status line — one sentence, two agent states, specific and actionable — is the mechanism.

*"Work has a draft ready. Finance hasn't heard from you in 11 days."*

This is the reason the HQ is a destination rather than a navigation step.

**Why this matters:** If users skip the HQ on every return, the product's central premise — that the user commands a structure from above — is undermined by their own behavior. The ambient status line is the feature that makes commanding from above feel true rather than decorative.

---

### Move 5: Mandatory seeding with domain-specific questions

Creating an agent requires answering three questions before placement. The questions are different for each domain. The answers become the agent's first memory items, in the user's own words.

**Work:**
- *What is the most important thing you are working on right now?*
- *What kind of output do you most often need help producing?*
- *What do you wish someone would handle so you don't have to think about it?*

**Finance:**
- *Describe your current financial situation in one sentence.*
- *What is your most important financial goal in the next 12 months?*
- *What financial decision are you currently avoiding or unsure about?*

**Health:**
- *What aspect of your health are you most focused on right now?*
- *What is your biggest obstacle to the health habits you want?*
- *What would feeling good in your body actually allow you to do?*

**Why this matters:** The quality of the seeding questions determines the quality of every first interaction. Getting them wrong: first output is barely better than generic AI. Getting them right: first output is so clearly contextualized to this specific person that the product's core claim is proven in session one.

---

## 5. The 5 Biggest App Experience Traps

---

### Trap 1: The HQ becomes a lobby users walk through

**The failure:** Users glance at HQ, immediately swipe to their most-used workspace. Within a week, HQ is a loading screen.

**What causes it:** Ambient status delivers generic copy. Node states look identical regardless of activity. HQ offers nothing the workspace doesn't.

**How to prevent it:** Ambient status must be specific and data-backed from session one. If it cannot be, do not ship it — use node visual states only. Node states (active / quiet / dormant / incomplete) must be visually distinct enough to read in one glance: not just color differences but differences in weight, opacity, and presence.

---

### Trap 2: The capability strip becomes a cage

**The failure:** User wants to ask a specific question, cannot identify the right capability, finds no text box, interprets the product as broken rather than structured.

**What causes it:** Capability labels are too narrow or too generic. "Draft" does not clearly communicate what it covers for users who think in freeform questions.

**How to prevent it:** Capability labels must be precise and each one surfaced with a brief contextual example on hover or first-tap. Add a fourth, visually smaller capability: *"Something else"* — which opens a freeform input. Its presence communicates: this is a structure, not a cage. The escape hatch is visible. Most users will not use it — and that data will confirm the capability model's validity.

---

### Trap 3: The avatar ceremony loses users mid-generation

**The failure:** User uploads a photo, sees what looks like a loading screen, loses confidence, navigates away.

**What causes it:** Generation takes longer than expected. "Composing your presence" is visually indistinguishable from a broken loading state after 30 seconds. No feedback that anything is happening.

**How to prevent it:** Avatar generation must complete during the question phase — the ceremony can only begin when the result is ready. If generation fails, communicate warmly and specifically: *"We couldn't compose your portrait with this photo — try a clearer one."* Never a generic error. The developing grain texture during the generation screen must read as active creation, not passive waiting.

---

### Trap 4: Memory becomes homework

**The failure:** After a few weeks, the user has 40+ memory items. The panel is a database they cannot remember building. Managing it feels like maintenance, not use.

**What causes it:** Every "Save to memory" tap adds an item automatically. No confirmation of what specifically is being saved. No prompting to review or prune.

**How to prevent it:** Three constraints. (1) Saving a memory requires confirming a single, specific extracted statement — the user edits it to one sentence before storing. (2) The memory panel shows items in recency groups with a light prompt on older items: *"Still relevant?"* (3) Cap at 25 items per agent. When reached, the system requires archiving something before adding more. Constraint forces curation.

---

### Trap 5: Avatar quality variance produces inconsistent first impressions

**The failure:** Beautiful result for users with clear, well-lit photos. Poor result for users with casual selfies, unusual lighting, or faces the model handles less well. The 13-second ceremony amplifies the quality expectation — failure after it is worse than failure without it.

**What causes it:** Model tuned on limited photographic range. No fallback for failure modes. No user recovery path after a disappointing result.

**How to prevent it:** Five measures before launch. (1) Test across genuinely diverse inputs — skin tones, ages, lighting conditions, photo qualities. (2) Build a fallback style that works reliably across all inputs. (3) Build one-click regeneration (different seed, not a re-run). (4) After two regenerations, offer the fallback explicitly: *"Try a different interpretation."* (5) If quality cannot meet the standard for all users: **do not perform the 13-second ceremony for a result below the quality threshold.** Generate a non-portrait styled avatar instead. Never let the ceremony precede a mediocre result.

---

*Previous: [07 — App Experience Design ←](07-app-experience.md)*
