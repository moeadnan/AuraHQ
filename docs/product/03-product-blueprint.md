# Product Blueprint

**Phase 3 of AURA HQ — Concrete product system for design and prototyping**

> Six specialists in sequence: product architect, UX strategist, service designer, AI interaction designer, retention strategist, and critical product reviewer. The goal is a product system precise enough to guide real design and engineering decisions.

---

## Table of Contents

1. [Product Backbone](#1-product-backbone)
2. [User Journey](#2-user-journey)
3. [Main Product Surfaces](#3-main-product-surfaces)
4. [Agent Creation Framework](#4-agent-creation-framework)
5. [Interaction Model](#5-interaction-model)
6. [Retention and Expansion](#6-retention-and-expansion)
7. [MVP Scope](#7-mvp-scope)
8. [Premium Future Version](#8-premium-future-version)
9. [Critical Review](#9-critical-review)
10. [Final Blueprint](#10-final-blueprint)

---

## 1. Product Backbone

*Product Architect*

Before mapping screens, define the objects precisely. Ambiguity at the object level produces interface confusion at every stage below it.

### Core Objects

**The Principal**
The user. Not a profile. Not an account. The person who occupies the apex of the structure. Everything in the system exists in relation to the Principal — beneath them, serving them, scoped to their defined priorities. One Principal per HQ. Singular by design.

**The HQ**
The visual organizational structure. Not a dashboard. Not a home screen. A spatial, hierarchical representation of the Principal's intelligent infrastructure. The HQ is the primary surface — the place the user returns to, builds within, and reads at a glance. It must communicate the state of the entire system without requiring navigation.

**The Avatar**
The visual identity of the Principal within the HQ. Not a profile photo. A styled portrait rendered in the visual language of the platform. The avatar occupies the apex node permanently — it is the visual anchor of the hierarchy and the first signal of what kind of product this is.

**The Agent**
A scoped AI system assigned to a specific domain. An agent has: a name, a domain, a stated purpose, a capability profile, a memory store, and a visual identity. An agent is not a chat thread. It is a member of the Principal's organizational structure with a defined role and accumulated context.

**The Domain**
The scope boundary of an agent. Domains are typed (Work, Health, Finance, Creative, Learning, Personal, Legal, Relationships) but can be customized. A domain shapes what capabilities the agent offers, what memory categories it maintains, and what default action types it surfaces. Two agents in different domains behave differently. A Finance agent and a Creative agent do not have the same capability profile, even if both use the same underlying model.

**Agent Memory**
The accumulated context an agent holds about the Principal's domain. Memory has three layers:
- **Seeded context** — what the user gave the agent at creation (documents, notes, preferences)
- **Interaction history** — what the agent has learned through use
- **Stated goals** — what the Principal has told the agent they are working toward

Memory is the mechanism by which agents become more valuable over time. It is not a chat history. It is a structured knowledge base scoped to a domain.

**Capabilities**
The typed action set available within each agent — defined per domain. A Work agent might have: Draft, Review, Research, Plan, Summarize. A Health agent might have: Track, Reflect, Advise, Research, Remind. Capabilities constrain what the agent does, which prevents it from becoming a generic assistant with a custom name.

**Goal Threads**
Named, ongoing workstreams within an agent. A goal thread holds: the stated goal, all interactions related to it, a summary of progress, and current status. Goal threads provide continuity — they make the agent feel like a collaborator on something real, not a tool that forgets when the session ends.

---

### The Main Unit of Value

Not the HQ view. Not the avatar.

**The main unit of value is a domain-scoped agent that knows your context and demonstrates that knowledge in every interaction.**

The HQ view is the orienting structure. The avatar is the identity anchor. But the moment a user asks their Finance agent to review a contract and it responds with relevant context from a document they uploaded three weeks ago — that is when the product earns its keep. Everything else is architecture supporting that moment.

---

### What Keeps Users Engaged Beyond Novelty

Three compounding forces:

**Identity investment** — The structure reflects the user's priorities. Every agent named and positioned is a declaration of what matters. Abandoning the structure feels like abandoning their own organizational design — not just losing a tool.

**Memory accumulation** — Agents become more useful as they hold more context. A user who has worked with their Work agent for three months is not in the same relationship with it as on day one. The value curve is upward. This creates switching cost rooted in utility, not artificial lock-in.

**Structural incompleteness** — The HQ always has empty nodes. Not as a dark pattern — as an honest representation. There are domains the user has not yet addressed. The empty node is a visible gap, a quiet pull toward the next act of organizational design.

---

### Key Moments of Value

| Moment | What it delivers |
|---|---|
| Avatar reveal | Emotional contract — I am at the center of this |
| First agent creation | Structural investment — I am building something |
| First agent output | Functional proof — this works for me |
| Returning after absence | Recognition — the system knows what happened |
| Agent improvement over time | Compounding trust — it knows my domain now |
| Second and third agent | Structural coherence — this is becoming real infrastructure |

---

## 2. User Journey

*UX Strategist*

### Landing

One job: produce the feeling that this product is unlike anything the user has encountered — without explaining it. The HQ structure is visible: a beautifully rendered organizational hierarchy with a portrait at the apex. The seat is empty. The implication is immediate and wordless: *that seat is yours.*

Single call to action: **"Build your HQ."**

Not "Sign up free." Not "Get started."

### Onboarding

**Email entry**
Single field. No social auth competing on the first screen. The visual world is already present.

**Intake ritual — three questions, one at a time**

Each presented full-screen, with weight. Each answer acknowledged before the next appears.

1. *What is the primary domain of your current life or work?*
   Founder / Creative professional / Knowledge worker / Student / Other
2. *Which area of your life most needs intelligent support right now?*
   Work / Health & energy / Money / Creative output / Learning / Personal / All of the above
3. *What is one thing you would do differently if you had more mental capacity?*
   Open text — short, not a paragraph

The third question is the most important. The user's own words reappear in the structure immediately after onboarding — as the name or purpose of their first suggested agent. That reflection is the proof the system was listening.

**Photo upload**

Framed as identity placement, not profile setup. Copy: *"How do you appear at the top of your world."* A brief preview of what the transformation will look like — not a surprise, a prepared moment.

**Transformation**

An atmospheric processing state — not a spinner, not a progress bar. A breathing visual. Duration: 8–12 seconds. Controlled anticipation.

**Avatar reveal**

The portrait resolves. Full screen. The user's face in the visual language of the product. Below it, their name. Two seconds of silence. No buttons. Just the portrait. Then: the structure beneath it begins to resolve.

**HQ reveal**

The organizational structure expands below the avatar. Two or three partially visible empty nodes below. One pre-suggested agent — drawn from the third intake answer — already named and positioned, waiting to be confirmed.

*"Your first agent is ready. Would you like to begin here, or build your own?"*

### First Agent Creation

If the suggested agent is accepted: a brief confirmation flow — domain, purpose, optional seeding. Under ninety seconds.

If the user builds their own: the full agent creation flow.

Either path ends with the first agent node populated in the HQ. The structure is no longer empty. The user has made their first organizational decision.

### Using Agents

The user opens their first agent. The workspace is not a chat window. A starting action is prompted: *"What would you like your Work agent to help you with first? Try: Draft, Review, Research, or Plan."* The user selects, provides context, receives output — rendered as a structured card.

### Returning to the HQ

On return, the user is not dropped into the last agent they used. They are returned to the HQ. A brief summary appears beneath the Principal node: *"Your Work agent has 2 items waiting. Your Health agent has been quiet for 4 days."*

The HQ is a read-at-a-glance operational status board. Not a notification list. A visual state.

### Expanding Over Time

As agents are added, the structure grows. An agent used heavily may begin to show sub-nodes — tasks, goals, threads that have become structural. Empty nodes remain visible. The structure is never complete, which is accurate: a person's intelligent infrastructure is never finished.

---

## 3. Main Product Surfaces

*Service Designer*

### Surface 1 — HQ View (Primary Home)

The central, spatial organizational hierarchy. Always the home base.

**Contains:**
- Principal avatar at apex
- Agent nodes arranged below in a hierarchical, breathable layout
- Each agent node shows: name, domain icon, activity status (active / quiet / new)
- Empty nodes where structure is incomplete
- Ambient status strip beneath the Principal: a single line summarizing system state

**Does not contain:**
- Activity feed or notification stream
- Navigation bar competing with the structure
- Anything that makes it look like a dashboard

**Interaction:** Tap any agent node to enter its workspace. Tap an empty node to begin agent creation.

---

### Surface 2 — Onboarding Flow

Described fully in the User Journey section. Treated as its own visual grammar — slightly more cinematic than the operational product. The most crafted surface in the system, designed with that priority.

---

### Surface 3 — Avatar Stage

The screen where the avatar is first revealed and can later be viewed or replaced. Not a settings page — a dedicated stage. The user's portrait in full, with their name beneath it. Options: regenerate, replace photo. Infrequently visited, but significant when it is.

---

### Surface 4 — Agent Workspace

The primary interaction surface. Each agent has its own workspace.

**Contains:**
- Agent name and domain — present but not dominant
- The agent's stated purpose — one sentence, set at creation, always visible
- Capability strip: 3–5 typed action icons, labeled
- Active work area: where current output is rendered as structured cards
- Memory panel: accessible but not default-visible — what this agent knows
- Goals panel: what the user has told this agent they are working toward

**Does not contain:**
- An open text box as the primary entry point
- A scrolling chat history
- Anything that makes it look like a messaging application

---

### Surface 5 — Agent Creation Flow

Described fully in the Agent Creation section. A focused, step-by-step flow with its own contained visual treatment.

---

### Surface 6 — Memory View

A structured surface within each agent workspace showing what the agent holds:
- Seeded documents and notes
- Stated goals
- Key facts retained from interactions
- Domain preferences the user has expressed

The user can edit, add to, or remove any item. This surface is critical for trust: the user must be able to see and control what their agent knows. Opacity here breaks the sense of agency the product promises.

---

### Surface 7 — Agent Settings

Accessible from within the workspace. Contains: name, domain, purpose statement, memory contents, capability profile, and the option to archive or delete. Not prominently surfaced — visited when the user wants to adjust what an agent is, not as a regular destination.

---

### Surface 8 — HQ Settings

Accessible from the Principal node. Contains: account, subscription, avatar regeneration, HQ theme (limited, curated options), notification preferences. A calm, considered menu — not a settings dump.

---

### Surface 9 — Agent Discovery

A structured catalog of agent templates across domains. Not a marketplace. A curated reference for users who do not know what to build next. In MVP: present but minimal. In full product: a meaningful expansion surface.

---

## 4. Agent Creation Framework

*AI Interaction Designer*

Agent creation is the most important functional act in the product. It must feel considered, not casual. The creation flow must gently enforce the conditions that make agents valuable.

### The Five-Step Creation Flow

**Step 1 — Domain selection**
A curated visual grid of domain types. Eight to ten options, each with a distinct visual identity (an icon or color signature that carries through to the agent's node in the HQ). The user selects one, or creates a custom domain. Custom domains are allowed but gently discouraged for first-time users — the system surfaces the closest existing domain and asks if that fits before accepting a custom entry.

**Step 2 — Name the agent**
A single text field. Prompt: *"What do you want to call this agent?"* The system does not suggest a name. Naming is the user's first act of ownership. Examples shown lightly below — not defaults, context: *"Some people name their agents by domain (Finance), by role (Budget Advisor), or by function (Research)."*

**Step 3 — State the purpose**
One sentence, written by the user in plain language. Prompt: *"In one sentence, what should this agent help you with?"*

This is not a system prompt. It is a declaration of intent. The user's language is what they see — not a technical configuration. The purpose statement appears permanently in the agent workspace. It is a contract.

**Step 4 — Seed the agent** *(optional but prompted)*

Prompt: *"Give your agent a head start."* Three options:
- Upload a document
- Paste a note
- Answer three quick domain-specific questions

The third option is the recommended path for new users. For a Finance agent, the questions might be:
- *What is your current financial situation in one sentence?*
- *What are you trying to do with your money in the next 12 months?*
- *What is the biggest financial decision you are facing right now?*

The system communicates the value clearly: seeded agents give better, more relevant responses from the first interaction.

**Step 5 — Confirm and place**
A preview of the agent node as it will appear in the HQ. Name, domain, purpose. Single confirmation: *"Add to your HQ."* The transition back shows the new node settling into position. Weighted, deliberate motion.

---

### What Keeps Agents from Becoming Gimmicks

**Domain scoping constrains the capability profile.** A Health agent does not offer "Draft contract." A Legal agent does not offer "Create a workout plan." The capability set is domain-specific. This prevents agents from collapsing into general assistants.

**The purpose statement is a contract.** The user wrote it. It appears in the workspace. When agent output does not match the purpose, the user can see the mismatch. The gap prompts them to either refine the agent or use it correctly.

**Memory creates accountability.** When an agent has memory, it can be evaluated against its history. "You told me last month your goal was to reduce spending in category X — you have increased it." That is an agent doing its job. Without memory, the agent is stateless and accountability-free.

**Creation has friction by design.** The flow takes three to five minutes for a well-seeded agent. Users who invest time in creation invest attention in use. The creation flow should not be shortened below a meaningful threshold.

---

## 5. Interaction Model

*AI Interaction Designer*

Chat is the wrong default — not because chat is bad, but because chat is context-free, structure-free, and history-free unless explicitly engineered otherwise. Chat makes agents feel like generic assistants. The model below makes them feel like scoped collaborators.

### The Capability Strip

Each agent workspace opens to a strip of typed capabilities — not an open text box. The capabilities are domain-specific and limited to 3–5 per agent.

| Domain | Capabilities |
|---|---|
| Work | Draft · Review · Research · Plan · Summarize |
| Finance | Analyze · Track · Advise · Forecast · Review |
| Health | Log · Reflect · Advise · Research · Remind |
| Creative | Generate · Develop · Critique · Explore · Refine |
| Legal | Review · Explain · Draft · Flag · Research |

The user selects a capability, which opens a focused input panel scoped to that action — not a chat window, but a structured prompt context with a clear question.

- **Draft:** *What do you need drafted? Give me the context and the output you want.*
- **Analyze:** *What should I analyze? Upload a document or describe the situation.*

The interaction is initiated by selecting an action, not by typing into a blank field. The user is choosing what to do, not asking a question into a void.

### Structured Output Cards

Agent outputs are rendered as persistent, titled cards — not chat bubbles. Each card has: the capability used, a timestamp, the output content, and actions (Save, Refine, Share, Add to Memory).

Cards persist in the workspace until dismissed. The workspace looks like a desk where work is being done — not a message thread.

### Goal Threads

Named, ongoing workstreams within an agent. A goal thread holds: the stated goal, all related interactions, a summary of progress, and current status.

Goal threads make the agent feel like a real collaborator with continuity — not a tool that forgets when the session ends.

### Conversational Moments

Conversation is reserved for moments that benefit from it:

- Clarifying context during a complex task
- Reflecting on a goal thread
- Brief agent-initiated check-ins: *"You haven't updated your Health goals in 3 weeks — still relevant?"*

These moments are brief, purposeful, and often agent-initiated. They resemble a brief exchange with a capable collaborator, not a chat product.

### What This Model Avoids

- Open text box as primary entry (produces prompt anxiety in non-technical users)
- Scrolling chat histories that make the agent feel like a messaging thread
- Responses that ignore the agent's defined domain or memory
- The illusion of conversation masking the absence of context retention

---

## 6. Retention and Expansion

*Retention Strategist*

### Why Users Return

**The HQ is the status board.**
The user returns to the HQ not to navigate to something, but to read the state of their world. Which agents are active. What is waiting. What has been quiet. If the HQ is informative on every return, the return habit forms.

**Agents with memory surface things the user forgot they said.**
When a user returns to their Finance agent and sees: *"3 weeks ago you said you were planning to review your subscription costs — you haven't done that yet"* — that is not a notification. That is a collaborator doing their job. This contextual continuity is the core retention mechanism.

**The structure is never complete.**
Empty nodes are always visible. Not aggressively — simply present. A person with a Work, Health, and Finance agent can still see empty positions in their HQ. The structure communicates that there is more to build.

**Weekly synthesis.**
Once a week, each active agent produces a one-paragraph synthesis: what has been accomplished in this domain, what is in progress, what is pending. A brief "State of your HQ" view — not an email push, not an alert. A surface the user opens by choice. For users who engage with it, this becomes a weekly ritual.

**Agent milestones.**
When an agent has been used regularly for 30 days, or completed a stated goal, the HQ acknowledges it — not with celebration, but with a quiet, permanent visual change to the agent's node. A subtle indicator that this agent has depth. The user sees their structure becoming more real over time.

---

### How the System Deepens

**Year 1 trajectory for an engaged user:**

| Period | State |
|---|---|
| Month 1 | 1–3 agents, basic capability use, shallow memory |
| Month 3 | 3–5 agents, goal threads established, memory surfacing relevant context |
| Month 6 | Full domain coverage, cross-domain patterns beginning to emerge |
| Month 12 | Genuine personal knowledge infrastructure — something the user would not want to rebuild |

The depth trajectory is not feature-driven. It is memory-driven. The longer a user is present, the more irreplaceable the system becomes — not through artificial switching cost, but because the agents have become genuinely contextualized to their life.

### Cross-Agent Intelligence (Future)

Eventually: agents within the same HQ share a meta-layer of context. The Finance and Work agents know they belong to the same Principal. The system can surface cross-domain insights. This requires careful design to avoid feeling intrusive. Reserved for a mature version of the product.

---

## 7. MVP Scope

*Product Architect*

The most common way premium-concept products fail is by shipping a diluted version of their vision while claiming the full experience. The MVP must deliver the core emotional and functional contract — not a sketch of it.

### Must Ship

| Category | Requirement |
|---|---|
| Identity | Full avatar generation — excellent quality, non-negotiable |
| Structure | HQ view with up to 6 agent nodes, spatial layout, Principal at apex |
| Onboarding | Complete ritual: 3 questions, photo upload, transformation, reveal |
| Domains | 6 domain types with distinct capability profiles |
| Agent creation | Full flow: domain, name, purpose, optional seeding |
| Agent workspace | Capability strip (3–5 per domain), output cards, basic memory view |
| Memory | Seeded context at creation + interaction retention, user-editable |
| Return experience | HQ state view on login, agent activity summary |
| Weekly synthesis | Per-agent one-paragraph summary, accessible from HQ |

### Must Not Ship in MVP

| Feature | Why |
|---|---|
| Cross-agent intelligence | Architecturally complex; easily feels gimmicky if shallow |
| Agent sub-structures | Too complex before core agents are proven valuable |
| Mobile app | Web first — spatial HQ layout must be validated before compressing to mobile |
| Discovery / template marketplace | Creates breadth expectation before depth is proven |
| Collaboration or sharing | Dilutes the singular-Principal premise |
| Agent-initiated proactive outreach | Trust must be established before agents push unsolicited |
| More than 6 domains at launch | Fewer, better-defined domains beat many shallow ones |
| Avatar customization options | One excellent output beats ten mediocre style choices |

---

## 8. Premium Future Version

| Feature | Why it belongs in V2+ |
|---|---|
| Cross-agent insights and synthesis | Requires established memory depth across multiple agents |
| Agent sub-structures | Natural evolution once core agents are proven |
| Mobile app with compressed HQ view | After spatial layout is validated on desktop/web |
| Domain expansion (Legal, Relationships, etc.) | After core 6 domains show engagement patterns |
| Custom capability configuration | After users have used defaults long enough to know what they want |
| Shareable HQ views (read-only) | Professional use case — after core personal product is solid |
| API access for power users | After product has identity beyond "AI wrapper" |

---

## 9. Critical Review

*Critical Product Reviewer*

### 1. The HQ view is in danger of becoming a beautiful lobby no one sits in

Users will navigate to their most-used agent within two sessions and stop returning to the HQ structure. If the HQ is just a navigation layer, it is beautiful overhead. It must have intrinsic value on every return — not just as a way to navigate, but as a genuine operational status board. If it tells the user something they did not already know, it earns its place as home. If it just shows icons to click through, it will be abandoned.

### 2. The capability strip is a constraint users will resist

Non-technical users accustomed to open chat input will encounter the capability strip and feel limited. The product must handle freeform input gracefully — not by abandoning the capability model, but by mapping freeform input to the nearest capability, or including a lightweight "Other" escape hatch that does not undermine the structure. The capability strip is the right model. The implementation must not make it feel like a cage.

### 3. Memory is the most important and most fragile claim

If memory retention is shallow — if agents do not surface relevant context from more than a few interactions back, if the memory panel is just a chat history — the product's core differentiation is false. Memory must be genuinely structured: categorized, searchable, agent-initiated, and demonstrably useful in output quality. Do not launch AURA HQ claiming memory-driven agents if the memory is a prompt-stuffed conversation log.

### 4. The avatar moment may be a one-session event

After the onboarding peak, the avatar is a static node at the top of the HQ. It does not evolve. For users who have used the product for six months, the avatar risks becoming wallpaper. The product must consider what role the avatar plays beyond onboarding — whether it evolves with milestones, reflects HQ activity, or remains static but is always displayed prominently enough to reinforce the emotional premise.

### 5. The premium positioning creates a quality bar most teams cannot maintain

Every surface must be premium. Not just the HQ and avatar — the error states, loading screens, empty states, email confirmations, mobile web fallback. Premium products break most obviously in the moments nobody designed for. One poorly designed error screen in an otherwise beautiful product is disproportionately damaging to trust.

### 6. The product has no sharing mechanism

Users who love the product have no way to express that love within the product itself. At least one high-quality sharing moment should be designed — the avatar reveal, or a "State of your HQ" shareable card — that lets users share the experience in a way that represents the product well. Not a growth hack. Designing for the natural human impulse to share something beautiful and personal.

---

## 10. Final Blueprint

### Product Backbone

**Core objects:** Principal, HQ, Avatar, Agent, Domain, Agent Memory, Capabilities, Goal Threads

**Main unit of value:** A domain-scoped agent that knows your context and demonstrates that knowledge in every interaction.

**Structural premise:** One person at the apex. Everything else in service of them. The hierarchy is not decorative — it is the product's organizing principle and the source of its emotional differentiation.

---

### User Journey

```
Landing → "Build your HQ"
→ Email sign-in
→ Intake ritual (3 questions, one at a time, full-screen)
→ Photo upload ("How you appear in your world")
→ Avatar transformation (8–12 seconds, atmospheric)
→ Avatar reveal (2 seconds of silence)
→ HQ structure resolves beneath the avatar
→ First agent suggestion (from intake answers)
→ Agent confirmation or custom creation
→ First agent workspace open
→ Guided first capability use
→ Return: HQ state view → agent activity → weekly synthesis
→ Expansion: empty nodes, new domains, deeper goal threads
```

---

### Main Screens

| Screen | Primary function |
|---|---|
| Landing | Atmospheric entry — show the structure, show the empty seat |
| Onboarding flow | Ritual intake — questions, photo, transformation, reveal |
| HQ View | Home — spatial hierarchy, agent status, ambient state |
| Avatar Stage | Identity surface — portrait display, regeneration |
| Agent Workspace | Primary work surface — capability strip, output cards, memory |
| Agent Creation | Focused creation flow — domain, name, purpose, seed |
| Agent Settings | Edit domain, purpose, memory — calm, considered |
| Memory View | Structured context per agent — viewable, editable, trustworthy |
| Weekly Synthesis | State of HQ — one paragraph per active agent |
| Agent Discovery | Domain templates — minimal in MVP, expanded later |

---

### Agent Creation Framework

Five steps: Domain selection → Name → Purpose statement → Seeding → Confirmation and placement.

**Constraints that keep agents meaningful:**
- Domain-specific capability profiles
- Purpose statement written by user in plain language, permanently visible
- Creation flow has designed friction — 3–5 minutes minimum
- Minimum viable seeding prompted before completion

---

### Interaction Model

- Primary: Capability strip → focused input → structured output card
- Supporting: Goal threads for ongoing workstreams
- Conversational: Brief, purposeful, often agent-initiated — not a default mode

---

### Retention Hooks

| Hook | Mechanism |
|---|---|
| HQ as status board | Informative on every return — not just navigation |
| Memory surfacing | Agent references context the user gave weeks ago |
| Structural incompleteness | Empty nodes visible, not aggressive |
| Weekly synthesis | Per-agent summary, user-accessed by choice |
| Agent milestones | Quiet visual depth indicators on HQ nodes |
| Goal thread continuity | Ongoing workstreams pull users back to unfinished work |

---

### The Three Non-Negotiables

The product works if and only if three things are simultaneously true:

**1. The structure feels real.**
The HQ is not a navigation menu. It is a genuine organizational representation of the user's intelligent infrastructure. The visual hierarchy communicates authority and belonging.

**2. The agents feel different from each other.**
A Finance agent and a Work agent are demonstrably different in capability, memory structure, output format, and interaction style. They are not the same model with different names.

**3. The memory makes the agents irreplaceable.**
An agent that has been used for three months knows things about the user's domain that no new tool can replicate immediately. That accumulated context is the product's deepest value and its strongest retention mechanism.

If all three are true, AURA HQ is a product.
If any of them is false, it is a beautiful concept that will not survive extended use.

---

*Previous: [02 — Refined Concept ←](../strategy/02-refined-concept.md)*
