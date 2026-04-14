# AURA HQ — Design Brief
**For: Senior Product Designer + Frontend Engineer**
**Version: 1.0 | April 2026**

---

> This brief synthesizes all prior concept, product, design, and experience work into a single execution-ready document. It is the authoritative reference for design and frontend decisions. When in doubt, return here.

---

## Table of Contents

1. [Product Summary](#1-product-summary)
2. [Core Promise](#2-core-promise)
3. [Why This Product Matters](#3-why-this-product-matters)
4. [Target User](#4-target-user)
5. [Emotional Goals](#5-emotional-goals)
6. [Functional Goals](#6-functional-goals)
7. [Core Product Principles](#7-core-product-principles)
8. [Key Flows](#8-key-flows)
9. [Main Screens](#9-main-screens)
10. [Avatar System Direction](#10-avatar-system-direction)
11. [Agent System Direction](#11-agent-system-direction)
12. [Personal World / Structure Direction](#12-personal-world--structure-direction)
13. [Interaction Principles](#13-interaction-principles)
14. [Visual Principles](#14-visual-principles)
15. [Motion Principles](#15-motion-principles)
16. [MVP Scope](#16-mvp-scope)
17. [What to Exclude from MVP](#17-what-to-exclude-from-mvp)
18. [Premium Future Vision](#18-premium-future-vision)
19. [Risks to Avoid](#19-risks-to-avoid)
20. [Final Design Mantra](#20-final-design-mantra)

---

## 1. Product Summary

AURA HQ is a personal AI infrastructure platform. One person — the Principal — sits at the apex of a visual organizational structure. Beneath them, they build a team of AI agents, each scoped to a real domain of their life or work: their business, their finances, their health, their creative practice.

Each agent has a defined purpose (written by the user), a domain-specific capability set, and a persistent memory of the user's situation. Agents are not chat windows with custom names. They are positioned members of a structure the user designed — below them, serving purposes they stated, improving with every interaction.

The product has three primary surfaces: the **HQ** (the structure at a glance), the **Workspace** (where work happens with a single agent), and the **Creation Flow** (the ritual of making a new agent). Everything else is a panel or an in-surface state.

AURA HQ is the first AI product built around one premise: **you are the principal, and AI works for you within a structure you own.**

---

## 2. Core Promise

> *For the first time, AI has a structure — and you are at the top of it.*

This is not a tagline. It is the product's functional description, compressed to a sentence. Every screen, every interaction, every design decision either reinforces this claim or undermines it.

---

## 3. Why This Product Matters

People are experiencing a specific, largely unspoken anxiety about AI: it is powerful, it is accelerating, they do not fully understand it, and they fear it may diminish rather than amplify them. The dominant response from the AI industry — more tools, more interfaces, more chat boxes — does not address this anxiety. It deepens it.

AURA HQ addresses it directly. Not by making AI simpler, but by changing the user's relationship to it. The user is not a prompt-writer. They are a principal. The AI does not face them across a blank text box. It is organized beneath them, in a structure they built, serving purposes they defined.

The product fills a specific identity gap: there is no existing AI product that gives a person the experience of commanding their own intelligent organization. The gap is not a feature gap. It is a psychological one — and AURA HQ is designed to close it.

---

## 4. Target User

**Not** a developer, an AI enthusiast, or a technical professional.

The target user is an intelligent, capable adult — a founder, a creative professional, a knowledge worker, a builder — who:

- Has used ChatGPT or similar tools and found them useful but impersonal
- Watches AI reshaping their field and feels somewhere between curious and unsettled
- Cares about doing their best work and wishes they had more capacity
- Is not intimidated by powerful software, but is not excited by complexity
- Would pay for something excellent that genuinely works for them

**The key insight about this user:** They are not looking for more AI features. They are looking for a sense of authorship — the feeling that they are shaping their AI relationship, not being shaped by it. AURA HQ gives them that feeling by design, not by copy.

---

## 5. Emotional Goals

The product should make users feel the following — in this order of priority:

| Priority | Emotional state | When it is felt |
|---|---|---|
| 1 | Recognized | The avatar reveal — this was made for me |
| 2 | Positioned | The HQ reveal — I am at the top of this |
| 3 | Capable | First agent output — this knows my situation |
| 4 | Composed | Returning to the HQ — my world is organized |
| 5 | Invested | Building a second and third agent — this is mine |

The product should **never** make users feel:
- Overwhelmed by options
- Talked down to by copy
- Like they are using a generic AI tool with a pretty wrapper
- Like they are in a chat application
- Like the product is performing intelligence rather than delivering it

---

## 6. Functional Goals

| Goal | Specification |
|---|---|
| Domain-specific AI | Agents behave demonstrably differently across domains — not just different labels on the same prompts |
| Persistent memory | Agents surface retained context from prior sessions in every capability interaction |
| Structured delegation | Users select actions (not compose prompts) — capability strip drives all primary interactions |
| Accumulated work | Output cards persist in the workspace — the desk accumulates work, it does not reset |
| Ambient intelligence | The HQ communicates real agent state on every return without requiring navigation |
| Premium onboarding | The avatar transformation is so good that users show it to people who do not use AI |

---

## 7. Core Product Principles

These seven principles govern every design and product decision. When two options are in conflict, the principle resolves the conflict.

**1. The user is always the principal.**
The Principal's visual presence is the warmest, most dominant element on every surface. No feature, no agent, no output competes with the user's position at the apex.

**2. The structure is the product.**
The HQ organizational hierarchy is not a navigation menu or a decoration. It is the product's central feature. Decisions that reduce the structure to a springboard to workspaces are wrong decisions.

**3. Agents are scoped collaborators, not chat threads.**
An agent is a named, positioned member of a structure with a defined purpose, domain-specific capabilities, and accumulated context. Creating an agent is an act of organizational design. Using an agent is delegation, not querying.

**4. Memory is demonstrated, not managed.**
The primary experience of memory is encountering it — as context cards in the capability input panel, surfacing automatically. Memory management (editing, deleting) is secondary and lives in a panel. If users experience memory only as an archive to maintain, the product has failed.

**5. The product earns return.**
The HQ must deliver specific, actionable information on every return that the user could not get by navigating directly to a workspace. If it cannot, the HQ is a lobby and the product's central premise is decoration.

**6. Friction is either justified or eliminated.**
The capability strip has friction (users must select an action before typing). This friction is justified — it produces better first outputs. Seeding has friction (users must answer questions). This friction is justified — it produces agents with genuine context. All other friction is unjustified and must be removed.

**7. Premium quality is non-negotiable at the moments that matter.**
The avatar transformation, the HQ reveal, the first agent output, and the first memory surfacing are the four moments that determine whether a user trusts the product. Mediocrity at any of these four moments is fatal. Everything else can be iterated.

---

## 8. Key Flows

### Flow 1 — Onboarding (new user, ~4 minutes)

```
Landing → "Build your HQ"
→ Email signup
→ Q1: Primary role / domain [full-screen, answer cards]
→ Q2: Area needing most support [full-screen, answer cards]
→ Q3: What would you do with more mental capacity? [full-screen, open text]
→ Photo upload: "Place yourself at the top"
   [Avatar generation begins in background during Q3 + upload]
→ Generation screen: "Composing your presence"
   [Ceremony begins only when result is ready]
→ 13-second avatar development ceremony
→ 2 seconds of silence — portrait only
→ Subscription offer (14-day trial, flat monthly)
→ HQ structure assembles below the portrait
→ Suggested first agent appears (drawn from Q3 answer)
→ Prompt: "Your [domain] agent is ready. Open to begin."
```

**Non-negotiables in this flow:**
- No back button, no progress bar, no navigation of any kind
- Avatar ceremony never begins before the result is ready
- Subscription offer appears after avatar reveal, before HQ assembles
- The Q3 answer must visibly influence the suggested first agent name or purpose

---

### Flow 2 — Agent Creation (returning user)

```
HQ → tap empty node
→ Creation flow opens (full-screen, contained)
→ Step 1: Domain selection [grid of 6 cards with visual signatures]
→ Step 2: Name the agent [single text input, serif weight, naming examples in Burnished Sienna]
→ Step 3: Purpose statement [text area, purpose previewed in serif as permanent element]
→ Step 4: Seeding — 3 required domain-specific questions [one at a time, freeform text, required]
→ Step 5: Placement preview [agent node preview, "Add to your HQ"]
→ Return to HQ → connection line draws → node populates with full animation
```

**Non-negotiables in this flow:**
- Purpose statement cannot be skipped
- Seeding questions cannot be skipped
- The creation flow never opens as a modal over the HQ — it is a full contained experience
- On return: the user watches the connection line draw and the node populate

---

### Flow 3 — Using an Agent (primary daily flow)

```
HQ → tap agent node
→ Workspace opens (warm cross-dissolve)
→ Fixed header: agent name + domain + settings access
→ Purpose statement visible below header
→ Capability strip: 3 domain-specific items
→ User selects capability
→ Input panel expands from strip: specific prompt + memory context cards ("Based on what you told me")
→ User types → submits
→ Output card develops into work area (photographic reveal, ~500ms)
→ Card actions: Save to memory | Refine
→ Swipe up → returns to HQ (ambient status updated)
→ OR swipe left/right → adjacent agent workspace
```

---

### Flow 4 — Returning to HQ (daily return)

```
App opens → HQ view
→ Ambient status: one sentence, two agents, specific state
   e.g., "Work has a draft ready. Finance hasn't heard from you in 11 days."
→ Node visual states communicate activity (active / quiet / dormant / incomplete)
→ User reads state → taps relevant node → descends to workspace
→ OR: opens new creation → taps empty node
```

---

## 9. Main Screens

### The three primary surfaces

The product has three surfaces. Everything else is a panel or an in-flow step.

---

### Surface 1 — The HQ

**Layout:**
- Principal avatar (circular portrait, Resin Amber ring) centered at top, ~120px diameter on desktop
- Principal name in display serif below avatar
- Ambient status line below name: one sentence, humanist sans, Burnished Sienna, small but legible
- Agent nodes arranged in a centered horizontal arc below: up to four nodes in the first tier
- Connection lines from Principal to each node: 1px, Deep Slate Warm, gentle arc (not straight, not diagonal)
- Empty nodes at the right of the arc: Deep Slate Warm frame at 20% opacity, "+" in Burnished Sienna, slow warm pulse (one cycle per 3 seconds)

**Node anatomy (default state):**
- Domain visual signature (abstract composition, ~40×40px, centered in upper half)
- Agent name (humanist sans, medium weight)
- Activity dot: Resin Amber = active (≤7 days), Burnished Sienna = quiet (8–30 days), Deep Slate Warm = dormant (30+ days), none = incomplete

**What the HQ never shows:**
Notification badges, preview text from recent outputs, navigation elements, any UI not belonging to the structural vocabulary.

**Navigation:**
- Tap agent node → workspace (descend)
- Tap empty node → creation flow
- Tap Principal avatar → profile panel opens
- Swipe up (mobile) or top-edge tap (desktop) from any workspace → returns here

---

### Surface 2 — The Agent Workspace

**Layout (fixed header, scrolling work area):**

```
┌─────────────────────────────────────────┐
│ [Agent Name]                    [⚙ ]    │  ← fixed, never scrolls
│ Domain                                  │
│ "Purpose statement — one sentence."     │  ← fixed, always visible
├─────────────────────────────────────────┤
│  [Capability A] [Capability B] [Cap. C] │  ← fixed, always visible
├─────────────────────────────────────────┤
│                                         │
│  [Output Card — most recent]            │  ← scrollable work area
│  [Output Card]                          │
│  [Output Card]                          │
│                                         │
├─────────────────────────────────────────┤
│  ▸ Memory  (12 items)                   │  ← expandable panel, bottom
└─────────────────────────────────────────┘
```

**Capability strip:** Three items per domain. Selected item brightens to Pale Resin. Selection expands the input panel upward from the strip — not a modal, an unfurling.

**Input panel (open state):**
- Capability label at top of panel
- Specific prompt (1–2 sentences, scoped to this capability and domain)
- Text area
- Memory context cards below text area: compact, read-only, labeled *"Based on what you told me"*
- Submit action

**Output cards:**
- Capability label (small, Burnished Sienna)
- Context summary (one line, user's input summarized)
- Output content (formatted per capability type)
- Two text-link actions: *Save to memory* · *Refine*
- Cards are permanent — they do not disappear between sessions

**Memory panel (expandable from bottom):**
- Collapsed: memory icon + item count + one-line preview of most important fact
- Expanded: full list of stored facts, recency-grouped, each with delete option

**What the workspace never contains:**
Alternating chat bubbles, scrolling message timeline, "typing..." indicators, open text input as primary element, a "Send" button.

---

### Surface 3 — Agent Creation Flow

Five steps. Full-screen, contained. No HQ chrome visible during creation.

| Step | Content |
|---|---|
| Domain | Grid of 6 domain cards (visual signature + label). Select one or create custom. |
| Name | Single text input, display serif, naming examples below in Burnished Sienna. |
| Purpose | Text area. User's text previews in display serif as a permanent element — they see what it will look like in the workspace as they type it. |
| Seeding | Three domain-specific questions, one at a time, freeform text, all required. |
| Placement | Agent node preview (signature, name, purpose first line). Confirm: *"Add to your HQ."* |

**Returns to HQ:** Connection line draws → node populates with full animation sequence.

---

### Panels (not surfaces)

| Panel | Access | Contents |
|---|---|---|
| Profile | Tap Principal avatar in HQ | Portrait stage, name, avatar regeneration, subscription status, account settings |
| Agent settings | Settings icon in workspace header | Name, domain, purpose (editable), memory contents, archive/delete |
| Memory management | Expand memory panel in workspace | Full memory list, recency groups, delete per item |

---

## 10. Avatar System Direction

### The artistic mandate

The AURA HQ avatar transformation must produce an image that passes one test: **someone unfamiliar with AI image generation should look at it and think "that's a great portrait photo" — not "that's an AI-generated image."**

This is not a style preference. It is the quality standard. Every model selection, every fine-tuning decision, every artistic parameter returns to this test.

### The lighting specification

**Rembrandt lighting.** One warm key light at approximately 45 degrees up and 45 degrees to one side of the subject. This produces a small triangle of warm light on the shadow side of the face — Rembrandt's signature lighting technique — creating facial dimension, revealing character rather than flattening it, and producing a specific warmth quality that is visually consistent across all portraits.

Every AURA portrait should be identifiable by its light quality without seeing any other context. The lighting is the avatar's visual signature.

### The color treatment

- Warm key light embedded in the generation — the warmth comes from the light, not from a post-processing filter
- Background replaced with the product's Burnt Umber Dark to Deep Slate Warm gradient — the subject is in a space, not on a canvas
- Skin tones preserved accurately — the product sees the actual person, not an idealized type
- The overall image should sit in the warm territory of the product's palette without appearing tinted

### Quality requirements before launch

1. Test the generation model across a genuinely diverse input set — multiple skin tones, ages, face types, photo qualities, lighting conditions
2. Identify failure modes (the specific inputs that produce poor results) and either solve them or build a fallback
3. Build one-click regeneration that produces a genuinely different result (different seed, not a re-run)
4. Build a fallback artistic style for inputs below quality threshold — simpler, more abstract, still premium — that activates automatically when confidence is low
5. **The 13-second ceremony never begins for a result below the quality threshold.** If quality cannot be guaranteed, do not perform the ceremony.

### The reveal ceremony

Full specification in Motion Principles (Section 15). This ceremony is the product's most important designed moment. It must be treated as a core product feature, not a loading state.

---

## 11. Agent System Direction

### The four agent properties

Every agent has exactly these four properties. No more are added in MVP.

| Property | Definition | UX role |
|---|---|---|
| Domain | The typed scope category (Work / Finance / Health + 3 others in V2) | Determines capability set and memory schema |
| Name | User-defined at creation | Identity and ownership |
| Purpose | One sentence, written by user, required | Visible in workspace at all times — the agent's contract |
| Memory | Seeded input + confirmed facts | Surfaces as context in capability input panel |

### Domain capability profiles — MVP

These capability labels are not interchangeable. Each domain's capabilities map to distinct system-prompt logic, memory categories, and output formats.

| Domain | Capabilities | Output format emphasis |
|---|---|---|
| Work | Draft · Review · Research | Documents, structured text, analysis |
| Finance | Analyze · Track · Advise | Structured data, recommendations, summaries |
| Health | Log · Reflect · Research | Personal tracking, reflection, information |

**Domain differentiation must be real.** Before launch: ask the same underlying question to a Work agent and a Finance agent. If the outputs are structurally similar, the differentiation is not real. This test must pass.

### Agent visual signatures

Each domain has a unique abstract visual composition used as the agent's identity within its node. These are **not icons, not emoji, not representational imagery.** They are formal compositions — precise, non-literal, rendered in the product's palette.

| Domain | Visual quality | Primary tones |
|---|---|---|
| Work | Interval and measure — precise horizontal lines of varying weight | Deep Slate Warm on Antler |
| Finance | Arc and precision — fine concentric partial arcs from a geometric center | Resin Amber on Burnt Umber Dark |
| Health | Interval and breath — soft overlapping sinusoidal forms | Pale Resin on warm base |
| Creative (V2) | Emergence — geometric form dissolving into organic | Full palette |
| Learning (V2) | Stratification — horizontal layers of increasing density | Morning Glass to Burnished Sienna |
| Personal (V2) | Centered warmth — geometric form in Resin Amber at center | Resin Amber radiating |

### Seeding questions — the most important copy in the product

These questions determine the quality of every first interaction. They are not intake forms — they are the beginning of a relationship.

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

The answers to these questions are stored as the agent's first memory items — in the user's own words, attributed clearly.

---

## 12. Personal World / Structure Direction

### The HQ spatial model

The HQ is organized on two axes:

**Vertical:** HQ is above. Workspaces are below. Descend into an agent workspace from the HQ. Surface to the HQ from any workspace (swipe up on mobile; top-edge affordance on desktop).

**Horizontal:** Agent workspaces are side by side. Swipe between them without returning to the HQ. The rightmost position is always the creation entry point (the "+" node).

This spatial model is the product's navigation architecture. No tab bar. No sidebar. No hamburger menu. The gesture is the metaphor.

### The HQ layout specification

- Principal node: centered at top, ~120px avatar portrait, Resin Amber frame ring
- Agent nodes: horizontal arc below Principal, maximum four nodes in first tier (MVP)
- Connection lines: 1px, Deep Slate Warm, gentle downward arc from Principal to each node
- Node size: approximately 120×140px, 8px corner radius
- Spacing between nodes: 24px minimum, nodes should breathe
- Empty nodes: Deep Slate Warm frame at 20% opacity, "+" centered, slow warm pulse

### The ambient status

One sentence, ≤12 words, two agents named. Placed directly below the Principal's name.

Format: *"[Agent] has [state]. [Agent] hasn't heard from you in [duration]."*

This line must be backed by real activity data. If the data cannot be made specific, do not ship the line — communicate state through node visual treatment only.

### Node activity states — visual specification

| State | Trigger | Visual treatment |
|---|---|---|
| Active | Used within 7 days | Full presence — signature at full opacity, Resin Amber activity dot |
| Quiet | 8–30 days since use | Signature at ~80% opacity, Burnished Sienna activity dot |
| Dormant | 30+ days since use | Signature at ~50% opacity, Deep Slate Warm activity dot |
| Incomplete | Created, never used | Signature at ~30% opacity, no activity dot |

---

## 13. Interaction Principles

### The capability strip is the primary entry point

The workspace opens to three capability items. The user selects an action before typing anything. This is not a constraint — it is the mechanism that makes agent outputs more relevant than freeform chat.

**Capability strip rules:**
- Three items per domain, always visible, always accessible
- Selected item: Antler → Pale Resin surface shift, 150ms ease-out
- Selection expands the input panel upward from the strip (not a modal — an unfurling, 280ms)
- A fourth item ("Something else") is the freeform escape hatch — visually smaller, always present

### The input panel — anatomy

```
┌─ Capability label ──────────────────────────┐
│                                             │
│  [Specific prompt — 1 to 2 sentences]       │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │  Text area                          │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  Based on what you told me:                 │
│  ┌───────────────────────────────────────┐ │
│  │ Memory item 1                         │ │
│  └───────────────────────────────────────┘ │
│  ┌───────────────────────────────────────┐ │
│  │ Memory item 2                         │ │
│  └───────────────────────────────────────┘ │
│                                    [Submit] │
└─────────────────────────────────────────────┘
```

Memory items in the panel are read-only, compact, labeled *"Based on what you told me."* They appear automatically — the user does not summon them. Their presence proves the product's core claim before the user has typed a word.

### Output cards — anatomy and behavior

Each output is rendered as a persistent card, not a message. The card is the artifact. Sessions produce cards. Cards outlive sessions.

**Card anatomy:**
- Capability label (small, Burnished Sienna)
- Context line (user's input summarized, one line)
- Output content (formatted per capability type)
- Two text-link actions: *Save to memory* · *Refine*

**Card appearance animation:** 500ms, photographic development order — warmest tones first, then structure, then text. (See Motion Principles.)

**Save to memory:** Confirms a single extracted fact (user edits to one sentence). A warm particle (~8px, Resin Amber) travels a curved arc from the card to the memory strip. Memory count increments as particle arrives.

**Refine:** Capability strip item brightens. Input panel reopens with previous input pre-loaded.

### Memory — what the interaction model enforces

| Interaction | What it must not look like |
|---|---|
| Memory surfacing | Not a settings panel. Not an archive the user consults. Context that appears automatically in the workflow. |
| Memory saving | Not an automatic background process. A deliberate act — confirm one specific fact before it is stored. |
| Memory viewing | Not a database management tool. A list with recency groups and a gentle *"Still relevant?"* prompt on older items. |
| Memory cap | 25 items per agent. When reached: archive or delete before adding more. Forces curation. |

### What the product never does

- Never opens a chat-style alternating message interface
- Never shows a "typing..." or "thinking..." indicator
- Never presents a blank text box as the primary workspace entry point
- Never uses a refresh or loading spinner
- Never shows a notification badge on the HQ structure

---

## 14. Visual Principles

### The visual thesis

**The inhabited structure.** The cold geometry of institutional authority — inhabited by the warmth of one person. The organizational hierarchy is precise, geometric, cool-toned. The Principal's portrait is warm, luminous, singular. The tension between structure and presence is not a design problem to resolve — it is the product's visual identity.

**The visual test for every decision:** Does this hold the tension — structured enough to feel authoritative, warm enough to feel inhabited?

---

### The color palette

| Token | Name | Hex | Role |
|---|---|---|---|
| `--color-ground` | Burnt Umber Dark | `#16100A` | Base background. HQ environment. Warm-dark, not grey-dark. |
| `--color-surface` | Antler | `#EFE8DA` | Primary surface. Cards, panels, workspaces. |
| `--color-surface-raised` | Morning Glass | `#F5F0E7` | Elevated focus surface. Active inputs, avatar background. |
| `--color-text-primary` | Burnt Umber Dark | `#16100A` | Primary text on light surfaces. |
| `--color-text-secondary` | Burnished Sienna | `#5C4A38` | Secondary text, labels, purpose statements, ambient status. |
| `--color-text-tertiary` | Warm Stone | `#8A7E72` | Tertiary text, placeholder text, inactive labels. |
| `--color-principal` | Resin Amber | `#B8762A` | The Principal. Avatar ring. ≤3 appearances per surface. |
| `--color-principal-light` | Pale Resin | `#CCAA6A` | Hover states, active capability indicator, acknowledgment. |
| `--color-structural` | Deep Slate Warm | `#2A2620` | HQ connector lines, inactive node borders. The cool register. |
| `--color-resolution` | Verdigris Warm | `#6B7A68` | Dormant states, completed work, resolution. |

**Absolute palette rules:**
- No blue tones anywhere in the product
- No pure black (`#000000`) or pure white (`#FFFFFF`)
- No purple or violet (the AI-product convention this product rejects)
- Resin Amber appears ≤3 times per surface — every appearance must feel earned
- Shadow tints use Burnished Sienna at low opacity, never grey

---

### Typography

**Display / structural authority**
- Typeface: Canela (Commercial Type) or Lyon Text (Kai Bernau)
- Weight: Light to Regular — never Bold at display sizes
- Tracking: Slightly open — not tight (anxious), not wide (casual)
- Usage: Principal name at apex, domain section headers, creation flow headers, onboarding questions
- **Not used for:** body copy, labels, secondary information

**Operational**
- Typeface: Söhne (Klim Type Foundry) or ABC Diatype
- Not Inter. Not SF Pro. Not any system default.
- Weight: Regular for body, Medium for capability labels and emphasis
- Usage: All operational interface copy — capability labels, card content, memory items, form inputs, error states, ambient status

**Typographic rule:** Serif = structural authority. Sans = operational intelligence. Never reversed.

---

### Shape language

- **Only one circular element:** The Principal's avatar frame. No other UI element uses a circle.
- **All structural elements:** Rounded rectangles.
- **Corner radius system:** `8px` base · `6px` small elements · `16px` large containers
- **Consistent throughout** — never changed for visual interest
- **No borders.** All surface edges defined by shadow (warm Burnished Sienna tint at low opacity) or ground tone differentiation.

---

### Surface hierarchy

Three surface levels. Depth is expressed through warm shadow, never through borders.

| Level | Tone | Shadow |
|---|---|---|
| Ground | Burnt Umber Dark | None — this is the environment |
| Surface | Antler | Warm shadow: Burnished Sienna at 8% opacity, 0px 4px 20px |
| Elevated | Morning Glass | Warm shadow: Burnished Sienna at 12% opacity, 0px 8px 32px |

---

### The 10 non-negotiable visual principles

1. The Principal is the warmest, most present element on every surface. Without exception.
2. One light source — directed, not ambient. Warmth radiates from the Principal's position.
3. Structure is cool. Presence is warm. The difference between them is the product.
4. No borders. All edges are shadow or ground differentiation.
5. The avatar ceremony is never shortened. It is a ceremony, not a loading state.
6. Resin Amber appears ≤3 times per surface. Every appearance must feel earned.
7. Agent signatures are non-representational. Always. Precision is the personality.
8. Motion develops from warm to cool — warmth arrives before structure.
9. Typography serves hierarchy, not aesthetics. Serif = authority positions only.
10. Premium is expressed through decision quality, not decoration quantity.

---

## 15. Motion Principles

### The physics of motion

All motion obeys one rule: **things have weight and they settle.**

**Custom easing:** 3% ease-in, 60% ease-out. Like placing something of precise weight onto a surface. Never spring-based. Never linear.

### Duration scale

| Interaction | Duration |
|---|---|
| Hover state changes | 120–160ms |
| State transitions (card appearance, button states) | 280–380ms |
| Screen transitions | 480–600ms |
| Signature moments (avatar reveal, node population) | 1,000–13,000ms |

### The photographic development metaphor

All reveals follow this order: **warmest tones arrive first, then form, then fine detail.** This is the product's motion signature — not a timing convention, but a visual argument: warmth is what matters, structure is what supports it.

Applied to:
- Output card appearance (500ms): warm shadow → surface lift → content
- Node population (1,200ms): outline → warm fill → domain signature → name
- Screen transitions: outgoing surface cools first; incoming surface warms first

### Screen transitions

Warm cross-dissolve. Not a slide. Not a push. The outgoing surface reduces in luminosity (warm fade toward ground tone). The incoming surface increases in luminosity from ground tone. The product breathes surfaces into view.

### The avatar reveal ceremony — complete specification

**Total duration: 6–8 seconds of ceremony. Non-negotiable.**

| Phase | Timing | Visual |
|---|---|---|
| Chemistry | 0–1.5s | Burnt Umber Dark frame. Very fine warm grain — photographic paper before developer. Nothing identifiable. |
| Warmth | 1.5–3.5s | Warmest tones develop first — skin highlights, key light warmth, background glow. Warmth before form. |
| Form | 3.5–5.5s | Face becomes structurally distinguishable. Rembrandt light triangle visible. Specifically this person. |
| Definition | 5.5–7s | Fine detail resolves. Portrait complete. Resin Amber ring luminizes around frame — 1.5 seconds to full saturation. |
| Silence | 7–9s | No buttons. No copy. Portrait and name only. Name resolves character by character in display serif at reading pace. Two seconds of stillness. |
| Structure | 9–13s | HQ assembles below: connection lines draw from Principal (600ms each, staggered), node frames resolve, domain signatures develop, names appear. |

**Engineering constraint:** The ceremony begins only when the avatar generation result is ready. The ceremony is not a loading animation — it is the presentation of a completed result.

### Hover behavior

- Enter: luminosity increase (~15%), 120ms ease-out
- Exit: 200ms ease-out — slightly slower than entry. The warmth lingers.
- No scale changes. No shadow amplification.

### Node population (first agent creation)

1. Connection line draws from Principal: Burnished Sienna cursor traveling the path, leaving Deep Slate Warm in its wake → 600ms
2. Line settles: briefly warm (400ms) → cools to permanent Deep Slate Warm
3. Node outline resolves: 300ms
4. Surface fills from center: 300ms, photographic development order
5. Domain signature develops: 400ms, warmest tones first
6. Agent name fades in: 200ms

---

## 16. MVP Scope

The MVP proves one claim: **a scoped, seeded agent produces better output from session one than any generic AI tool — and improves with use.**

### What ships

| Component | Specification |
|---|---|
| Onboarding ceremony | Complete — 3 questions, photo upload, 13-second ceremony, HQ reveal |
| Avatar generation | Excellent quality, non-negotiable. Must pass the "nice portrait photo" test. |
| HQ view | Principal at apex, up to 4 agent nodes, single-tier arc, ambient status line |
| Domain types | 3 only: Work, Finance, Health — built to full functional depth |
| Agent creation flow | All 5 steps, mandatory seeding (3 domain-specific questions required) |
| Agent workspace | Fixed header, purpose statement, capability strip (3 per domain), input panel with memory surfacing, output cards, memory panel |
| Memory system | Seeded input + confirmed facts, user-editable, capped at 25 items per agent |
| Return experience | Ambient status: specific, data-backed, one sentence with two named agents |
| Spatial navigation | Swipe up from workspace → HQ; swipe left/right between workspaces |
| Subscription | Flat monthly (~$20–30), 14-day free trial, payment wall after avatar reveal |

### MVP capability profiles

**Work:** Draft · Review · Research
**Finance:** Analyze · Track · Advise
**Health:** Log · Reflect · Research

Three capabilities per domain. Each maps to distinct prompting logic, memory schema, and output format.

---

## 17. What to Exclude from MVP

| Excluded | Reason |
|---|---|
| Domains 4–6 (Creative, Learning, Personal) | Three real domains > six shallow ones |
| Discovery / template catalog | Creates breadth expectations before depth is proven |
| Weekly synthesis | Engineering complexity, noise risk before trust is established |
| Agent sub-structures (second tier) | Requires second-tier HQ layout not designed in MVP |
| Sharing or social features | Dilutes the singular-Principal premise |
| Mobile app | Web first — validate spatial layout before compressing |
| Notification system | Trust must be established before push |
| Profile editing beyond avatar regeneration | Unnecessary complexity in V1 |
| Any animation not in the 7 defined microinteractions | No decoration |
| Agent collaboration or cross-agent intelligence | V2 after core agents are proven |

---

## 18. Premium Future Vision

The trajectory after a successful MVP:

**V1.1 — Memory depth**
Agent memory grows genuinely smarter — not just storing facts but surfacing patterns. *"You've mentioned this three times in the last month."* Memory becomes a collaborator's perspective, not just an archive.

**V2.0 — Domain expansion**
Creative, Learning, and Personal domains added. Each fully specified before launch — distinct capability profiles, memory schemas, visual signatures. No shallow additions.

**V2.0 — Agent sub-structures**
Active agents can develop sub-nodes — ongoing goal threads made structural. The HQ grows a second tier for agents that have accumulated real depth. The visual language scales gracefully.

**V2.1 — Cross-agent intelligence**
Agents within the same HQ share a meta-context layer. The Finance and Work agents know they belong to the same Principal. The system surfaces cross-domain insights. *"Your Work schedule appears to be affecting your Health metrics."*

**V3.0 — Mobile application**
After the spatial layout is validated on web, a compressed but architecturally faithful mobile experience. The HQ must work at phone scale without losing its structural identity.

**V3.0 — Sharable HQ snapshot**
A high-quality, static representation of the user's HQ at a point in time — shareable as an image. Not a social feature. A personal artifact that happens to be beautiful.

**Premium tier**
A higher subscription tier for users who want: expanded memory capacity, additional domain types, priority avatar regeneration quality, and early access to new capabilities.

---

## 19. Risks to Avoid

### Risk 1: The avatar quality floor

**The trap:** The 13-second ceremony amplifies the quality expectation. A mediocre result after 13 seconds of ceremony is worse than a mediocre result delivered instantly.

**The prevention:** The ceremony never begins for a result below the quality threshold. Build a reliable fallback style before launch. Test across diverse inputs. Avatar quality is a launch-blocker, not a V1.1 improvement.

---

### Risk 2: The HQ becoming a lobby

**The trap:** Users glance at the HQ and navigate directly to their most-used workspace. Within a week, the HQ is a splash screen with no informational value.

**The prevention:** The ambient status must deliver specific, data-backed information on every return. If the data pipeline cannot support this, do not ship the ambient status line — communicate state through node visual treatments only. A specific visual state (warm active node vs. cool dormant node) is better than generic copy.

---

### Risk 3: Domain differentiation being cosmetic

**The trap:** A Work agent and a Finance agent feel identical except for their label and visual signature. Experienced users recognize this within the first week.

**The prevention:** Domain differentiation is specified at four levels — system prompt logic, memory schema, capability labels, output format. Before launch: run the QA test. Ask the same underlying question to a Work agent and a Finance agent. If the outputs are structurally similar, the differentiation is not real. This test is a launch requirement.

---

### Risk 4: Memory feeling like homework

**The trap:** After a month of use, the memory panel is a 40-item database the user cannot remember building or wants to maintain.

**The prevention:** Memory saving requires confirming a single, specific extracted fact — the user edits it before storing. Cap at 25 items per agent. The memory panel shows items in recency groups with a gentle *"Still relevant?"* on older items. Memory must feel curated, not accumulated.

---

### Risk 5: The warm palette reading as wellness or lifestyle

**The trap:** Resin Amber used broadly, organic textures, soft shapes — the product reads as a journal app or self-help tool.

**The prevention:** Resin Amber used strictly (≤3 per surface, specific roles only). Shape language is rectangular and decided, not round and casual. The structural cool of the HQ's connector lines and Deep Slate Warm tones maintains the intelligent register that prevents the warmth from reading as soft.

---

### Risk 6: The capability strip feeling like a cage

**The trap:** A user wants to type something specific, cannot identify the right capability, and interprets the product as broken.

**The prevention:** A fourth capability item — *"Something else"* — is always visible, visually smaller than the primary three. Capability labels include brief contextual examples (surfaced on hover or first use). The escape hatch communicates: this is a structure, not a limitation.

---

## 20. Final Design Mantra

Every screen, every interaction, every design decision returns to this:

**Does this make the user feel like the principal of their own intelligent world — or does it make them feel like a user of someone else's product?**

If it makes them feel like the principal: protect it.
If it makes them feel like a user: cut it.

This mantra resolves conflicts between aesthetics and function, between ambition and scope, between novelty and usability. It is the product's irreducible design standard. Apply it to every decision — including the ones that seem too small to matter.

---

*Prepared from: Concept Development (01) · Refined Concept (02) · Product Blueprint (03) · Tightened Product System (04) · Art Direction (05) · Sharpened Art Direction (06) · App Experience Design (07) · Refined App Experience (08)*

*AURA HQ · April 2026*
