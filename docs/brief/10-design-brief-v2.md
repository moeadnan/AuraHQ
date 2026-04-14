# AURA HQ — Design Brief v2
**For: Senior Product Designer + Frontend Engineer**
**Version: 2.0 | April 2026 | Authoritative reference — use this, not v1**

---

## 1. What We Are Building

AURA HQ is a personal AI infrastructure platform. One person — the Principal — occupies the apex of a visual organizational hierarchy. Beneath them: scoped AI agents, each with a defined domain, a user-written purpose, domain-specific capabilities, and persistent memory. The product has three surfaces: **HQ** (structure at a glance), **Workspace** (work with one agent), **Creation Flow** (making a new agent). Everything else is a panel within one of these three.

**Core promise:** *For the first time, AI has a structure — and you are at the top of it.*

**Design mantra:** Does this make the user feel like the principal of their own intelligent world, or like a user of someone else's product? If the former: keep it. If the latter: cut it.

---

## 2. Target User

An intelligent adult — founder, creative professional, knowledge worker — who:
- Has used ChatGPT and found it useful but impersonal
- Would pay for something excellent that genuinely works for them
- Is not looking for more AI features; is looking for authorship over their AI relationship

**Not:** a developer, AI enthusiast, or technical professional.

---

## 3. Emotional Sequence

Design to produce these feelings in order. Each maps to a specific product moment.

| # | Feeling | Moment | What makes it real |
|---|---|---|---|
| 1 | Recognized | Avatar reveal | Portrait looks like a great photo of them, not an AI output |
| 2 | Positioned | HQ reveal | They see themselves at the top of a structure that assembled beneath them |
| 3 | Capable | First agent output | Output is visibly more relevant than generic AI because it used their context |
| 4 | Composed | Returning to HQ | The ambient status tells them something specific they did not already know |
| 5 | Invested | Second/third agent | They are building something that reflects their actual priorities |

---

## 4. Product Principles

Seven rules. When two options conflict, apply the relevant rule.

1. **Principal supremacy.** Resin Amber and the avatar are the warmest, most dominant elements on every surface. Nothing competes.
2. **The structure is the product.** The HQ hierarchy is not navigation chrome. It is the product's central feature.
3. **Agents are collaborators, not chat threads.** Named, positioned, purposeful, memory-holding. Using one is delegation.
4. **Memory is demonstrated, not managed.** It surfaces automatically in the input panel. Management is secondary, in a panel.
5. **The HQ earns return.** It must deliver specific, actionable agent-state information on every visit. If it cannot, show visual states only — no generic copy.
6. **Friction is justified or eliminated.** Seeding (required) and capability selection (required) are justified. All other friction is not.
7. **Non-negotiable quality at four moments.** Avatar reveal · HQ reveal · First agent output · First memory surfacing. Mediocrity at any of these four is a launch-blocker.

---

## 5. Key Flows

### Flow 1 — Onboarding (~4 min, no back button, no progress bar, no exit)

```
Landing → "Build your HQ"
→ Email signup
→ Q1  [full-screen card selection: primary role/domain]
→ Q2  [full-screen card selection: area needing most support]
→ Q3  [full-screen open text: "What would you do with more mental capacity?"]
→ Photo upload  "Place yourself at the top"
   ↳ Avatar generation starts in background during Q3 + upload
→ Generation screen  "Composing your presence"
   ↳ Ceremony starts ONLY when result is ready — never before
→ Avatar reveal ceremony  [13 seconds — see §15]
→ 2 seconds silence  portrait only, no UI
→ Subscription offer  [14-day trial, flat monthly ~$25/mo]
   ↳ Accept → HQ assembles below portrait
   ↳ Decline → exit / grace period
→ Suggested first agent appears  [name drawn from Q3 answer]
→ "Your [domain] agent is ready. Open to begin."
```

**Hard constraints:**
- Q3 answer must visibly determine the suggested agent name or purpose — not a generic default
- Payment wall positioned after avatar reveal, before HQ assembles — this is the product's highest-confidence conversion moment
- If avatar generation is not ready when ceremony should begin: extend generation screen, never begin ceremony early

---

### Flow 2 — Agent Creation

```
HQ → tap empty node → full-screen creation flow [no HQ chrome visible]
→ Step 1  Domain grid  [6 cards: visual signature + label]
→ Step 2  Name  [single serif text input, naming examples in Burnished Sienna below]
→ Step 3  Purpose  [text area: user sees their text render in serif as permanent workspace element while typing]
→ Step 4  Seeding  [3 questions, one at a time, freeform text, all required — see §11 for questions]
→ Step 5  Placement preview  [node preview: signature + name + purpose] → "Add to your HQ"
→ Returns to HQ: connection line draws → node populates [full animation: ~1.5 seconds]
```

**Hard constraints:**
- Purpose statement: required, cannot skip
- Seeding questions: all three required, cannot skip
- Creation flow: never a modal over HQ — full contained surface

---

### Flow 3 — Using an Agent (primary daily flow)

```
HQ → tap agent node → workspace [warm cross-dissolve]
→ Fixed header: [Agent Name] | Domain | [⚙]
→ Purpose statement [always visible, Burnished Sienna]
→ Capability strip: [Cap A] [Cap B] [Cap C] [Something else ↓]
→ Select capability → input panel expands upward from strip [280ms]
   Panel contains: capability label / specific prompt / text area /
   memory context cards ["Based on what you told me"] / [Submit]
→ Submit → output card develops into work area [~500ms]
→ Card actions: [Save to memory] [Refine]
→ Swipe up → HQ  |  Swipe left/right → adjacent workspace
```

---

### Flow 4 — Return Visit

```
App opens → HQ
→ Ambient status: "Work has a draft ready. Finance hasn't heard from you in 11 days."
→ Node visual states: active (warm) / quiet / dormant / incomplete [see §12]
→ Tap node → workspace  |  Tap empty node → creation
```

---

## 6. The Three Surfaces

### Surface 1 — HQ

```
┌─────────────────────────────────────────────────┐
│                                                 │
│              ┌──────────────┐                  │
│              │  [portrait]  │  ← Resin Amber ring
│              └──────────────┘                  │
│              Principal Name                     │
│    "Work has a draft. Finance: 11 days."        │  ← Burnished Sienna, sans, small
│                                                 │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──┐  │
│  │  [sig]   │ │  [sig]   │ │  [sig]   │ │+ │  │
│  │  Work    │ │ Finance  │ │  Health  │ │  │  │
│  │    ●     │ │          │ │    ·     │ │  │  │
│  └──────────┘ └──────────┘ └──────────┘ └──┘  │
│                                                 │
└─────────────────────────────────────────────────┘
```

**Layout specs:**
- Principal avatar: circular, ~120px desktop / ~80px mobile, centered
- Resin Amber ring: 2px, always present on Principal only
- Agent nodes: 120×140px desktop / 88×104px mobile, 8px radius
- Connection lines: 1px Deep Slate Warm, gentle arc (not straight, not diagonal)
- Node horizontal spacing: 24px minimum
- Empty nodes: Deep Slate Warm frame at 20% opacity, "+" in Burnished Sienna, pulse: 1 cycle/3s at 10% luminosity variance
- Background: Burnt Umber Dark throughout

**HQ never shows:** notification badges, output previews, navigation chrome, any element outside this structural vocabulary.

**Navigation from HQ:**
- Tap agent node → workspace
- Tap empty node → creation flow
- Tap Principal avatar → profile panel
- From any workspace: swipe up (mobile) / top-edge HQ button (desktop)

---

### Surface 2 — Agent Workspace

```
┌─────────────────────────────────────────┐
│  [Agent Name]              [⚙]         │  fixed
│  Domain tag                             │  fixed, Burnished Sienna
│  "Purpose statement — one sentence."    │  fixed, always visible
├─────────────────────────────────────────┤
│  [Draft]   [Review]  [Research]  [···]  │  fixed capability strip
├─────────────────────────────────────────┤  ↕ when capability selected, panel
│   ┌─ Capability label ───────────────┐  │    expands upward from this line
│   │  Specific prompt text            │  │
│   │  ┌──────────────────────────┐    │  │
│   │  │  text area               │    │  │
│   │  └──────────────────────────┘    │  │
│   │  Based on what you told me:      │  │
│   │  ┌──────────────────────────┐    │  │
│   │  │ memory item 1            │    │  │
│   │  └──────────────────────────┘    │  │
│   │                       [Submit]   │  │
│   └──────────────────────────────────┘  │
├─────────────────────────────────────────┤
│  [Output Card — most recent]            │  scrollable
│  [Output Card]                          │
│  [Output Card]                          │
├─────────────────────────────────────────┤
│  ▸ Memory  (12 items)  "Goal: ..."      │  expandable panel, bottom
└─────────────────────────────────────────┘
```

**Workspace rules — no exceptions:**
- No open text input as primary entry point
- No chat bubble layout
- No scrolling message timeline
- No "typing..." or "thinking..." indicators
- No Send button visible as primary action
- Cards persist across sessions — never cleared automatically

**Output card anatomy:**
- Capability label: small, Burnished Sienna
- Context line: user input summarized, one line
- Output: formatted per capability type
- Actions: `Save to memory` · `Refine` (text links, not buttons)

**Memory panel (expandable from bottom):**
- Collapsed: memory icon + count + one-line preview of top fact
- Expanded: full list, grouped by recency (≤30 days / older), each with delete
- "Still relevant?" prompt on items older than 30 days
- Cap: 25 items per agent — at cap, must archive/delete before adding more

**Lateral navigation:** Swipe left/right between workspaces. Agent rail visible on desktop left edge.

---

### Surface 3 — Agent Creation Flow

Full-screen, contained. No HQ chrome visible. Five steps.

| Step | Layout | Rules |
|---|---|---|
| 1. Domain | 6-card grid, visual signature + label, 3×2 | Card tap: Resin Amber ring pulses (300ms) → advance |
| 2. Name | Single input, display serif in field | Naming examples below in Burnished Sienna — not defaults |
| 3. Purpose | Text area | User text renders in display serif as they type, previewing permanent state |
| 4. Seed | 3 questions, one per screen, freeform text | All required. Cannot advance without answering. |
| 5. Confirm | Node preview: signature + name + purpose | "Add to your HQ" — single action |

On confirm → HQ → connection line draws → node populates (full animation).

---

### Panels (not surfaces)

| Panel | Access trigger | Contents |
|---|---|---|
| Profile | Tap Principal avatar in HQ | Portrait (large), regenerate/replace options, name, subscription, account |
| Agent settings | ⚙ in workspace header | Name (edit), domain, purpose (edit), memory (edit), archive, delete |
| Memory management | Expand memory strip in workspace | Full list, recency groups, delete per item, "Still relevant?" prompts |

---

## 7. Avatar System

### Quality standard

Every avatar output must pass: **"Does this look like a great portrait photo, or does it look like an AI-generated image?"**

If a designer, unfamiliar with AI generation, looks at the output and thinks "AI" — it fails. This is the only test that matters. All model selection, fine-tuning, and style decisions return to it.

### Lighting specification

**Rembrandt lighting.** Key light ~45° up, ~45° to one side. Produces a triangle of warm light on the shadow side of the face. Warm fill from opposite side at ~20% key intensity. Background: Burnt Umber Dark to Deep Slate Warm soft gradient behind the subject.

All AURA portraits are identifiable by this lighting quality alone. It is the avatar system's visual signature.

### Color

- Warmth comes from the light, not from post-processing
- Skin tones: accurate, not idealized or universalized
- Overall image sits in the product's warm palette without appearing filtered

### Pre-launch requirements (all required, not optional)

1. Test generation across diverse inputs: 5+ skin tones, 3+ age ranges, multiple photo qualities (studio, casual selfie, outdoor)
2. Document failure modes — inputs that consistently produce poor results
3. Build fallback style (simpler, abstract but premium) that auto-activates when generation confidence is below threshold
4. Build one-click regeneration producing a genuinely different result (different seed, not re-run)
5. Never begin the 13-second ceremony for a below-threshold result — extend generation screen instead

---

## 8. Agent System

### Agent object — four properties only (MVP)

| Property | Type | Required | Notes |
|---|---|---|---|
| Domain | Enum: Work / Finance / Health | Yes | Determines capabilities, memory schema, output format |
| Name | String, user-defined | Yes | Max 30 chars |
| Purpose | String, user-written | Yes | Max 120 chars, one sentence, visible in workspace always |
| Memory | Structured key-value store | Auto-populated from seeding | Seeded input + confirmed facts, max 25 items |

### Domain capability profiles

Each capability maps to distinct system prompting logic, memory categories, and output format. **These are not interchangeable across domains.**

| Domain | Capabilities | Output format |
|---|---|---|
| Work | Draft · Review · Research | Documents, structured text, analysis |
| Finance | Analyze · Track · Advise | Structured data, summaries, recommendations |
| Health | Log · Reflect · Research | Personal tracking entries, reflections, information |

**Pre-launch QA gate:** Present the same question to a Work agent and a Finance agent. If the outputs are structurally similar, domain differentiation is not real and the product must not launch. This test is a launch requirement.

### Agent node visual signatures

Abstract formal compositions. Not icons. Not emoji. Not representational imagery.

| Domain | Formal quality | Primary tones | Description |
|---|---|---|---|
| Work | Interval + measure | Deep Slate Warm on Antler | Precisely-spaced horizontal lines of varying weight |
| Finance | Arc + precision | Resin Amber on Burnt Umber Dark | Fine concentric partial arcs from a geometric center |
| Health | Breath + interval | Pale Resin on Antler warm | Soft overlapping sinusoidal forms |

### Seeding questions (verbatim — do not paraphrase)

These are the most important copy in the product. They determine first-interaction quality.

**Work agent:**
1. *What is the most important thing you are working on right now?*
2. *What kind of output do you most often need help producing?*
3. *What do you wish someone would handle so you don't have to think about it?*

**Finance agent:**
1. *Describe your current financial situation in one sentence.*
2. *What is your most important financial goal in the next 12 months?*
3. *What financial decision are you currently avoiding or unsure about?*

**Health agent:**
1. *What aspect of your health are you most focused on right now?*
2. *What is your biggest obstacle to the health habits you want?*
3. *What would feeling good in your body actually allow you to do?*

Answers are stored verbatim as the agent's first memory items, attributed as "You said."

---

## 9. HQ Structure Direction

### Spatial navigation model

```
         HQ [above — swipe up to surface from any workspace]
              │
   ┌──────────▼──────────────────────────────┐
   │ [Work] ←→ [Finance] ←→ [Health] ←→ [+] │
   └──────────────────────────────────────────┘
      Agents [horizontal — swipe left/right between workspaces]
```

No tab bar. No sidebar. No hamburger menu. Gesture is the navigation.

### Node activity states

| State | Trigger | Signature opacity | Activity dot | Ring |
|---|---|---|---|---|
| Active | Used ≤7 days | 100% | Resin Amber | none |
| Quiet | 8–30 days | 80% | Burnished Sienna | none |
| Dormant | 30+ days | 50% | Deep Slate Warm | none |
| Incomplete | Never used | 30% | none | none |

### Ambient status specification

Format: one sentence, ≤12 words, names two agents.
Pattern: `"[Agent] has [state]. [Agent] hasn't heard from you in [duration]."`
Examples:
- *"Work has a draft ready. Finance hasn't heard from you in 11 days."*
- *"Health logged a reflection. Work is waiting on 2 open items."*

**Rule:** If real activity data is not available at launch, ship no ambient status text. Communicate state through node visual treatment only. Generic copy is worse than silence.

---

## 10. Color System

| Token | Name | Hex | Role |
|---|---|---|---|
| `--color-ground` | Burnt Umber Dark | `#16100A` | HQ environment. All background surfaces. |
| `--color-surface` | Antler | `#EFE8DA` | Cards, panels, workspaces. Primary work surface. |
| `--color-surface-raised` | Morning Glass | `#F5F0E7` | Active inputs, avatar background, modals. |
| `--color-text-primary` | Burnt Umber Dark | `#16100A` | Body text on light surfaces. |
| `--color-text-secondary` | Burnished Sienna | `#5C4A38` | Labels, purpose statements, ambient status, secondary info. |
| `--color-text-tertiary` | Warm Stone | `#8A7E72` | Placeholders, inactive labels, tertiary info. |
| `--color-principal` | Resin Amber | `#B8762A` | Principal avatar ring, primary CTA state, peak emotional moments. ≤3 per surface. |
| `--color-principal-light` | Pale Resin | `#CCAA6A` | Hover states, active capability strip item. |
| `--color-structural` | Deep Slate Warm | `#2A2620` | HQ connector lines, inactive node borders, structural elements. |
| `--color-resolution` | Verdigris Warm | `#6B7A68` | Dormant node states, completed workstreams. |

**Absolute rules:**
- No blue tones anywhere
- No `#000000` or `#FFFFFF`
- No purple or violet
- `--color-principal` (Resin Amber) appears ≤3 times per rendered surface
- All shadows: Burnished Sienna at low opacity (8–12%), never grey

### Surface elevation

| Level | Surface color | Shadow |
|---|---|---|
| Ground | `#16100A` | none |
| Surface | `#EFE8DA` | `0px 4px 20px rgba(92, 74, 56, 0.08)` |
| Elevated | `#F5F0E7` | `0px 8px 32px rgba(92, 74, 56, 0.12)` |

No borders on any surface. Edges are defined by shadow only.

---

## 11. Typography

### Display / structural authority
- **Typeface:** Canela (Commercial Type) or Lyon Text (Kai Bernau)
- **Weight:** Light or Regular — never Bold at display sizes
- **Tracking:** +10 to +20 (slightly open — not tight, not wide)
- **Use:** Principal name at HQ apex, domain headers, creation flow headers, onboarding questions
- **Never use for:** body copy, capability labels, card content, any operational text

### Operational
- **Typeface:** Söhne (Klim Type Foundry) or ABC Diatype
- **Not:** Inter, SF Pro, or any system default
- **Weight:** Regular (body), Medium (labels, emphasis)
- **Use:** All interface copy — capability labels, card content, memory items, inputs, ambient status, error states

**Rule:** Serif = structural authority positions only. Sans = all operational copy. Never reversed.

### Type scale (base 16px)

| Role | Size | Weight | Font |
|---|---|---|---|
| Principal name (HQ) | 22px | Light | Canela |
| Onboarding question | 28–32px | Regular | Canela |
| Agent name (workspace) | 18px | Regular | Söhne |
| Purpose statement | 14px | Regular | Söhne |
| Capability label | 13px | Medium | Söhne |
| Card body | 14px | Regular | Söhne |
| Ambient status | 12px | Regular | Söhne |
| Memory items | 13px | Regular | Söhne |

---

## 12. Shape Language

- **One circle only:** Principal avatar frame. No other UI element.
- **All other elements:** Rounded rectangles
- **Corner radius:** `8px` (base) · `6px` (small) · `16px` (large containers)
- **Consistent — never changed for aesthetic variation**

---

## 13. Motion System

### Easing function

All animations: `cubic-bezier(0.04, 0, 0.2, 1)` — 3% ease-in, 60% ease-out. Weighted settlement, not spring. Not linear.

### Duration reference

| Category | Duration |
|---|---|
| Hover in | 120ms |
| Hover out | 200ms |
| State change (button, capability) | 150ms |
| Card appearance | 500ms |
| Input panel expansion | 280ms |
| Screen transitions | 540ms |
| Node population | 1,200ms total |
| Connection line draw | 600ms |
| Avatar ceremony | 6,000–8,000ms |

### Reveal order: warm first

All reveals follow this sequence: warmest tones first → structure → fine detail. Applied to every element that appears or transitions.

- **Card appears:** warm shadow resolves (150ms) → surface fills warm-to-cool (200ms) → content fades in (150ms)
- **Node populates:** connection line draws (600ms) → line settles Sienna→Slate (400ms) → node outline resolves (300ms) → surface fills from center (300ms) → domain signature develops (400ms) → name fades (200ms)
- **Screen transition:** outgoing cools (warm tones reduce first, 240ms) / incoming warms (warm tones arrive first, 300ms)

### Hover

- Enter: luminosity +15%, 120ms
- Exit: luminosity returns, 200ms (slower — warmth lingers)
- No scale. No shadow amplification. Luminosity only.

### Memory save particle

- 8px Resin Amber circle
- Travels curved arc from card to memory strip
- Duration: 600ms, eases in → eases hard out at destination
- Memory count increments as particle arrives (not before)

### Avatar Reveal Ceremony — complete spec

**Total: 6–8 seconds ceremony. Non-negotiable duration.**

| Phase | Timing | Visual |
|---|---|---|
| Chemistry | 0–1.5s | `#16100A` frame. Very fine warm grain visible — photographic paper before developer. |
| Warmth | 1.5–3.5s | Warmest tones resolve first: skin highlights, key-light areas, background glow. Form not yet distinguishable. |
| Form | 3.5–5.5s | Face structure becomes readable. Rembrandt light triangle visible. Specifically this person. |
| Definition | 5.5–7s | Fine detail resolves. Portrait complete. Resin Amber ring luminizes over 1.5s to full saturation. |
| Silence | 7–9s | Nothing moves. No UI elements. Portrait + name in Canela, character by character at reading pace. Then 2s of stillness. |
| HQ Assembly | 9–13s | Connection lines draw from Principal (600ms each, 200ms stagger), node frames resolve, signatures develop, names appear. |

**Engineering requirement:** Ceremony starts only when avatar result is ready. It is the presentation of a complete result, not a loading animation. Never start ceremony for a below-threshold quality result.

---

## 14. MVP Scope

### What ships

| Component | Status | Notes |
|---|---|---|
| Onboarding ceremony | Required | All 4 moments: questions, photo, ceremony, HQ reveal |
| Avatar generation | Required, launch-blocker | Must pass portrait quality test before any other work ships |
| HQ view | Required | Principal + up to 4 agents, single-tier arc, ambient status |
| Work domain | Required | Draft · Review · Research |
| Finance domain | Required | Analyze · Track · Advise |
| Health domain | Required | Log · Reflect · Research |
| Agent creation flow | Required | All 5 steps, seeding required |
| Agent workspace | Required | Capability strip, input panel, output cards, memory panel |
| Memory system | Required | Seeded + confirmed facts, 25-item cap, editable |
| Spatial navigation | Required | Swipe up → HQ, swipe H → adjacent workspace |
| Subscription | Required | Flat monthly ~$25, 14-day trial, paywall post-avatar pre-HQ |
| Return ambient status | Required | Data-backed specific copy, or node visual states only |

### What does not ship in MVP

| Excluded | Why |
|---|---|
| Domains 4–6 (Creative, Learning, Personal) | Depth over breadth |
| Discovery / templates screen | Breadth expectation before depth proven |
| Weekly synthesis | Engineering complexity, trust risk |
| HQ second tier / agent sub-structures | Not designed for MVP |
| Sharing / social | Dilutes singular premise |
| Mobile app | Web first; validate spatial layout |
| Push notifications | Trust before push |
| Profile editing beyond avatar regen | Unnecessary in V1 |
| Cross-agent intelligence | Requires established memory depth |
| Any animation outside the 13 defined | No decoration |

---

## 15. Post-MVP Roadmap

| Release | Feature | Unlock condition |
|---|---|---|
| V1.1 | Memory pattern surfacing ("You've mentioned this 3x") | Memory depth proven in usage data |
| V2.0 | Domains 4–6 (Creative, Learning, Personal) | Work/Finance/Health engagement proven |
| V2.0 | Agent sub-structures (second HQ tier) | Core agent usage depth proven |
| V2.1 | Cross-agent intelligence | Multiple agents with 3+ months history |
| V3.0 | Mobile app | Spatial layout validated on web |
| V3.0 | Shareable HQ snapshot | Product identity established |

---

## 16. Risks — Severity-Rated

| # | Risk | Severity | Launch condition |
|---|---|---|---|
| 1 | Avatar quality variance — poor results for non-ideal inputs | Critical | Block launch |
| 2 | Domain differentiation is cosmetic — agents feel identical | Critical | Block launch (QA gate) |
| 3 | Memory implemented as prompt-stuffing — degrades with use | Critical | Block launch |
| 4 | Ceremony starts before generation is ready | Critical | Block feature |
| 5 | HQ becomes navigation lobby — users bypass it after day 3 | High | Monitor from day 1 |
| 6 | Capability strip resisted — users can't find right action | High | Must have "Something else" escape hatch at launch |
| 7 | Ambient status ships with generic copy | High | If data not ready: ship no text, visual states only |
| 8 | Warm palette reads as wellness / journaling app | Medium | Resin Amber budget enforced, cool structural tones maintained |
| 9 | Memory accumulation — panel becomes unmanaged archive | Medium | 25-item cap + confirmation flow + recency prompts |
| 10 | Spatial gesture conflicts with OS-level swipe navigation | Medium | Test on iOS/Android before mobile launch |

---

## 17. Design Mantra

**Does this make the user feel like the principal of their own intelligent world — or like a user of someone else's product?**

Principal: protect it. User: cut it.

---

*AURA HQ · Design Brief v2 · April 2026*
*Supersedes: brief/09-design-brief.md*
