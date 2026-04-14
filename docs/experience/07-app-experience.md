# App Experience Design

**Phase 7 of AURA HQ — Turning concept into actual application experience**

> Six disciplines in sequence: product UX architect, interaction designer, consumer app strategist, AI experience designer, design systems thinker, critical experience reviewer. The goal: a product-first, experience-first app system specific enough to design and build from.

---

## Table of Contents

1. [Core App Model](#1-core-app-model)
2. [Navigation Model](#2-navigation-model)
3. [Key User States](#3-key-user-states)
4. [Main Screens](#4-main-screens)
5. [Interaction Patterns](#5-interaction-patterns)
6. [Empty States](#6-empty-states)
7. [Microinteractions](#7-microinteractions)
8. [MVP App Version](#8-mvp-app-version)
9. [Critical Review](#9-critical-review)
10. [Final App UX Recommendation](#10-final-app-ux-recommendation)

---

## 1. Core App Model

### What the app fundamentally is

Most apps are reached for. AURA HQ is returned to.

A tool you reach for — a notes app, a calculator, a messaging thread — exists to accomplish a specific task, then recede. A place you return to — a home, a studio, a particular room — has a different relationship with you over time. You leave, you carry it with you, you come back and it is changed by your absence.

Every UX decision in AURA HQ follows from this distinction.

### What users see first

Not a dashboard. Not a tutorial. Not a feature list.

They see the structure — an archetypal HQ view with an empty apex and empty nodes below it. Not animated, not explained. Just the shape of the thing, waiting. The implication is immediate: *that seat is yours.*

### The center of gravity

The HQ view. Not the agent workspace. Not the profile. Not a feed.

Everything in the app is either the HQ, something you descend into from the HQ, or something you surface to from the HQ. The HQ is not a home screen in the conventional sense — it is not a dashboard, not a summary, not a springboard. It is the place.

### What the app is optimizing for

**Emotionally:** The feeling of standing at the top of something organized around you. Not excitement — composure. The particular quality of a person whose world is working on their behalf.

**Functionally:** Accumulated context that makes agents measurably more useful over time. Not individual interactions — the compounding value of a scoped AI that knows your domain.

Both must be simultaneously served. An experience that is emotionally satisfying but functionally shallow fails. An experience that is functionally deep but emotionally cold fails.

---

## 2. Navigation Model

### The wrong models

| Navigation pattern | Why it fails here |
|---|---|
| Tab bar | Implies equal-weight destinations — AURA HQ has one center of gravity |
| Sidebar | Suggests document-like content management — wrong register |
| Hamburger menu | Hides the structure — the structure is the product |
| Bottom sheet nav | Generic consumer app pattern — immediately undifferentiated |

### The right model: the world is the navigation

No persistent navigation chrome. The HQ view is the navigation system.

**Three movement types:**

**Descend** — tap any agent node to enter its workspace. Tap an empty node to begin agent creation.

**Surface** — a single persistent element exists across all screens: the Principal's miniature avatar portrait (circular, ~32px, Resin Amber frame) at the bottom edge. Tapping it from anywhere returns to the HQ.

**Return** — navigating back from any workspace or flow always returns to the HQ. There is no "back" that goes somewhere other than the HQ.

### Navigation during onboarding

No navigation at all. Questions → photo → generation → reveal. The user is in a corridor. They move forward through a ceremony. The HQ view is the destination, not the starting point.

---

## 3. Key User States

Each state is a distinct emotional position, not just a different screen.

### State 0 — No account

The archetypal HQ view: empty Principal node at apex, three empty agent nodes in a centered arc below, structural connections visible. One CTA at the bottom: **"Build your HQ."** No explanation. No feature list. The empty seat communicates everything.

### State 1 — Onboarding in progress

A corridor. Full-screen, single-focused moments. No exit. No back navigation. The product's visual register is fully present from the first moment. No progress bar — rituals do not have progress bars.

### State 2 — Avatar generation

The screen holds Burnt Umber Dark. One serif line centered: *"Composing your presence."* The development grain begins. 13 seconds of ceremony. No interactive elements.

### State 3 — First world reveal

Avatar reveal completes → silence → HQ structure assembles below. Connection lines first, then node frames, then the first suggested agent populates one node (drawn from the user's intake answers). One quiet prompt: *"Your [domain] agent is ready. Open to begin."* No tour. No tooltips.

### State 4 — HQ with no manually created agents

Principal node populated, empty frames below with very slow warm pulse (one cycle per 3 seconds). Quiet text below the structure: *"An empty position. What do you want to delegate here?"* Emptiness communicates readiness, not failure.

### State 5 — First agent created

Connection line draws from Principal to first agent. Node populates. One or two empty frames remain. The HQ reads as begun, not complete. Prompt: *"Your first position is filled. Enter to begin working with it."*

### State 6 — Growing system (2–4 agents)

Visible structure. Multiple agents. Some warmer (recently active), some cooler (quiet). Ambient status line communicates most recent activity state across agents. The emotional state: building something real.

### State 7 — Mature system (5+ agents, some with depth)

Full or near-full HQ. Agent nodes have subtle visual depth differences communicating time and use. Principal node is the warmest element on screen. The ambient status line cycles through specific agent states. The emotional state: inhabiting something built for you, by you.

---

## 4. Main Screens

### Entry / Landing

**Contains:** Full archetypal HQ view — empty Principal node (circular frame, Resin Amber), three empty agent nodes in centered arc, connection lines in Deep Slate Warm. Product logotype at bottom in display serif. One button: **Build your HQ.**

**Does not contain:** Secondary CTAs, feature copy, marketing language, any navigation.

---

### Onboarding — three moments

**Questions:** Full-screen, one question at a time. Display serif at ~30pt, centered, slightly above vertical center. Answer cards as warm rectangles: Antler surface, selected state shifts to Pale Resin with warm shadow. No progress bar. Warm cross-dissolve between questions.

**Photo upload:** Circular frame (~260px) in Resin Amber at center. Copy above: *"Place yourself at the top."* After photo selection: a confirming beat — the photo appears in the frame, the ring pulses once, one button: *"Begin."*

**Generation wait:** Burnt Umber Dark screen. One serif line: *"Composing your presence."* Generation grain resolves. Ceremony begins only when the avatar result is ready. **Generation must process during the question phase, not after photo submission.**

---

### Avatar Reveal + HQ Assembly

The 13-second ceremony (described in art direction) happens on a single screen without transition. The HQ structure assembles below the portrait within the same screen. The ceremony and the world are one continuous moment.

**The payment wall** appears immediately after the avatar reveal silence — before the HQ structure assembles. The user has experienced the product's most important emotional moment. They decide whether to continue from a position of having been moved.

---

### HQ View (the center)

**Fixed elements:**
- Principal node (avatar portrait, Resin Amber ring, serif name below)
- Ambient status line beneath name (one specific sentence, humanist sans, Burnished Sienna)
- Principal indicator at bottom edge

**Variable elements:**
- Agent nodes: rectangular, 8px radius, centered horizontal arc below Principal. First tier: up to four nodes. Connection lines curve gently from Principal apex to each node — not straight, not diagonal, a composed arc suggesting flow from one source.
- Empty nodes: Deep Slate Warm frame at ~20% opacity, centered "+" in Burnished Sienna, slow warm pulse.

**Agent node anatomy (default state):**
- Domain visual signature (formal composition, ~40×40px)
- Agent name (humanist sans, medium weight)
- Activity dot: Resin Amber (active ≤7 days) · Burnished Sienna (quiet, 8–30 days) · Deep Slate Warm (dormant) · none (incomplete)

**Nothing else on agent nodes.** No preview text, no badges, no notification counts.

---

### Agent Creation Flow

**Step 1 — Domain:** Full-screen grid of six domain cards, three per row. Each shows its visual signature and domain name. Selecting a card produces a brief Resin Amber ring acknowledgment → advance.

**Step 2 — Name:** Single text input, display serif in the field. Three light naming examples below in Burnished Sienna — not defaults, context.

**Step 3 — Purpose:** Text area. The user's text renders in display serif as they type — previewing it as the permanent workspace element it will become. Character maximum shown only when within 20 characters.

**Step 4 — Seeding:** Three choice cards — *Answer three questions* (Pale Resin suggested border), *Upload a document*, *Paste notes.* Questions appear one at a time, full-screen, freeform text input, required before advancing.

**Step 5 — Placement:** Agent node preview (signature, name, purpose first line). Confirmation: *"Add to your HQ."* On return: connection line draws, node populates with the full animation sequence.

---

### Agent Workspace

**Fixed header (always visible):**
Agent name · Domain below in Burnished Sienna · Settings access (right edge)

**Purpose statement:** One line, Burnished Sienna. Always visible below header. The contract.

**Capability strip:** Three items, horizontal. Antler surface inactive, Pale Resin surface active. Selection expands the input panel upward from the strip (not a modal — the strip unfurls into the panel).

**Input panel (when open):**
- Capability label (moves from strip to panel header)
- Capability-specific prompt (one to two sentences)
- Text area
- Memory context cards (surfaced automatically — *"Based on what you told me"*)

**Work area:** Output cards accumulate in reverse chronological order. Each card: capability label · context summary · output · Save to memory · Refine. Cards are permanent. They do not disappear.

**Memory strip (bottom, above capability strip):** Collapsed: icon + count + one-line preview of first fact. Expanded: full list of stored facts, each with delete option. Expands upward, pushes work area up.

**This workspace does not contain:** Open text input as primary element · Chat bubbles · Scrolling message timeline · Typing indicators · Send button.

---

### Profile

**Avatar stage:** Portrait at center, Resin Amber frame ring, serif name below. Faint ambient warmth behind portrait. Two quiet actions: *Regenerate portrait · Replace photo.*

**Below:** HQ name · Subscription status · Account settings · Notification preferences.

No statistics. No badges. No public-profile thinking.

---

### Discovery / Inspiration

Curated, categorized, anonymized domain template catalog. Not a feed. Not user-generated content. Accessed from within the creation flow at domain selection when the user wants inspiration. Domain sections with two to three template cards each. Selecting a template opens the creation flow with domain and suggested purpose pre-filled. Exists in MVP only as a future placeholder — not a primary destination.

---

## 5. Interaction Patterns

### Node behavior

| State | Behavior |
|---|---|
| Default | Static, warm or cool per activity state |
| Hover (web) | 15% luminosity increase · agent name slightly heavier · faint Resin Amber ring at ~15% opacity · 120ms ease-out |
| Tap | 97% scale over 80ms (press), then warm cross-dissolve to workspace |
| Long press / right-click | Quiet popover: *Edit · Move · Archive* |
| Empty node tap | "+" brightens briefly (80ms), creation flow begins |

### Card behavior

**Appearance:** Photographic development metaphor — warmest tones first, then structure, then text. Total: ~500ms.

**Save to memory:** Saved fact highlights briefly (Pale Resin pulse, 300ms). Warm particle (~8px, Resin Amber) travels a curved arc to the memory strip. Duration: 600ms. Memory count increments as particle arrives.

**Refine:** Capability strip item brightens. Input panel reopens with previous input pre-loaded and highlighted.

### Capability strip behavior

**Selection:** Surface shifts from Antler to Pale Resin (150ms). Input panel expands upward from strip over 280ms. Memory context cards develop into visibility below text area (100ms stagger per item).

**Submission:** Panel collapses (250ms). Strip returns to default. New output card begins developing in work area.

### Structured prompts — examples

| Domain + Capability | Prompt |
|---|---|
| Work + Draft | "What do you need drafted? Describe the purpose, the audience, and the outcome you want." |
| Finance + Analyze | "What should I analyze? Describe the situation or upload a document." |
| Health + Reflect | "What aspect of your health do you want to think through? I'll draw on what I know about your situation." |
| Work + Research | "What do you need researched? Tell me the question and what you already know." |

### Visual hierarchy — the rule

Every surface has one visual apex. The hierarchy of visual weight enforces the product's premise:

| Surface | Visual apex |
|---|---|
| HQ view | Principal avatar node |
| Workspace | Purpose statement + capability strip |
| Creation flow | Current step's prompt |
| Profile | Avatar portrait |

There is always one thing the eye goes to first. It is always the most meaningful thing on that surface.

---

## 6. Empty States

Empty states in AURA HQ never communicate absence. They communicate readiness.

### HQ with no agents

Three empty frames, connected by structural lines to the Principal. Very slow warm pulse (one cycle per 3 seconds). Ambient status line: *"Your structure is ready to be filled."* No CTA button — just the structure and the warmth of the empty positions.

### Agent workspace with no outputs

Work area below capability strip shows one quiet line in Burnished Sienna, centered: *"[Agent Name] knows your situation. Choose an action to begin."* Capability strip items glow slightly warmer than default — beginning is the natural next act.

### Memory strip with no stored facts

Expanded state shows: *"Save a fact from any output and it will live here."* No illustration. No ghost items. The honest state.

### Dormant agent workspace (30+ days)

Purpose statement appears with a faint warm underline. Below it: *"This agent still knows your situation from [date]. Start where you left off."* Most recent output card is slightly more present than others.

### Discovery with no templates

Three placeholder template cards per domain at very low opacity. Below each: *"Curated templates for this domain are coming."* No fake content.

---

## 7. Microinteractions

### First hover on Principal node

Resin Amber ring brightens 25% over 150ms. Ambient warmth behind avatar intensifies slightly. Returns at 200ms — slightly slower. The warmth lingers.

### The avatar reveal

The 13-second ceremony. The product's most important moment. Quality determines trust in everything that follows.

Final beat: as the Resin Amber ring completes luminization, a 600ms warmth emanates outward from the avatar frame — a brief increase in the adjacent background warmth, then settling. The avatar is present.

### First connection line drawing

Line draws at constant rate over 600ms — a fine Burnished Sienna cursor traveling the connection path, leaving permanent Deep Slate Warm in its wake. On completion: briefly settles at Burnished Sienna warmth (400ms) then cools to permanent state. Made with warmth; exists with structure.

### First agent node appearing

1. Node outline resolves (Deep Slate Warm, 1px) — 300ms
2. Frame fills with Antler surface, warming from center outward — 300ms
3. Domain signature develops (warmest tones first) — 400ms
4. Agent name fades in — 200ms

**Total: ~1.2 seconds. Each phase staggered by 100ms. Nothing simultaneous.**

### First capability selection

Capability item brightens (150ms). Input panel grows upward from the strip itself — not a slide from the bottom, an unfurling. Specific prompt fades in (200ms). Memory context cards develop below the text area (100ms stagger each). Total: ~500ms.

### First memory context surfacing

Above the memory items, one line in Burnished Sienna, very small: *"Based on what you told me."*

Four words that prove the product's core claim.

### Memory save particle

~8px Resin Amber particle travels a curved arc from card to memory strip. Duration: 600ms, slows as it arrives. Memory count increments as particle arrives — not before, not after.

### Agent depth signal over time

At creation: domain signature at slightly reduced opacity, fine strokes.
After 30 days of regular use: slightly higher opacity, slightly heavier strokes.

The change is not dramatic. Side-by-side comparison reveals it; casual observation does not. A mature agent looks more settled than a new one. Not gamification — the visual equivalent of something becoming more itself over time.

---

## 8. MVP App Version

### The minimal credible product

The MVP proves two claims in the first session:
1. The avatar ceremony produces genuine emotional investment
2. A seeded agent produces noticeably better output than generic AI

If neither claim is proven in session one, there is nothing to build toward.

### What ships

| Component | Specification |
|---|---|
| Onboarding ceremony | Complete — all three question screens, photo upload, 13-second ceremony, HQ reveal |
| HQ view | Up to 5 agent nodes (Principal + 4 agents), single-tier arc, ambient status line |
| Domain types | Three only: Work, Health, Finance — built to full depth |
| Agent creation flow | All five steps, mandatory seeding (three domain-specific questions required) |
| Agent workspace | Fixed header, purpose statement, 3 capabilities per domain, input panel, output cards, memory strip |
| Memory | Seeded input + confirmed facts, editable list, user-deletable |
| Return experience | Ambient status line: one specific, actionable sentence per return |
| Subscription | Flat monthly, 14-day trial, payment wall after avatar reveal before HQ structure |

### What does not ship

| Excluded | Reason |
|---|---|
| Discovery / templates | Breadth before depth is wrong |
| Weekly synthesis | Complex, risks noise before trust |
| Domains 4–6 | Three real > six shallow |
| Agent sub-structures | Premature complexity |
| Sharing | Dilutes singular-Principal premise |
| Mobile app | Web first — validate spatial layout before compressing |
| Freeform "Ask" capability | Test capability model strictly first |

### The four MVP hypotheses

By end of month 3, these must be answerable:

1. Does the avatar ceremony translate to subscription conversion?
2. Do seeded agents produce higher usage than unseeded agents?
3. Does the capability strip produce higher-quality interactions than freeform chat would?
4. Do users return to the HQ, or bypass it to go directly to workspaces?

Hypothesis 4 determines the long-term navigation architecture.

---

## 9. Critical Review

**1. The capability strip needs graceful handling of user resistance.**
"Select an action above" is too flat. Better: when the user seems to be looking for a freeform input (hesitating in the workspace), the capability strip pulses gently. Copy beneath: *"Tell [Agent Name] what to do by choosing an action above. Each one is already built for your situation."* Directing, not blocking.

**2. The 13-second ceremony is a technical and quality bet, not just a design one.**
Generation must complete during the question phase — the ceremony presents a ready result, it does not generate in real time. If the avatar is not ready when the ceremony should begin, the generation screen must extend gracefully. The ceremony cannot begin for a mediocre result.

**3. The HQ spatial layout breaks at 7+ agents.**
Single-tier arc of four agents is elegant. A second tier requires careful new layout logic — not accessible in MVP. Maximum 5 nodes (Principal + 4 agents) in MVP. Second-tier layout must be fully designed before V2 ships it.

**4. The memory strip at the bottom will be ignored.**
Memory must be encountered in the workflow first — as context cards in the input panel — before it lives in an archive strip. The strip is for management; the panel is where value is demonstrated. For the first 10 sessions, memory items must surface automatically in the input panel. After that, the strip's collapsed state shows a one-line preview of the most important stored fact.

**5. Discovery creates breadth expectations before depth is proven.**
Do not build the discovery screen until the three core domains are proven at depth. In MVP, when a user has filled all available agent slots, the creation flow presents the existing domain types again (multiple agents per domain are valid) rather than a template catalog.

---

## 10. Final App UX Recommendation

### The integrated principle

AURA HQ is a place the user returns to, not a tool they reach for. Every future feature must be evaluated against this: does it make AURA HQ more like a place, or more like a tool? If it makes it more like a tool, it is the wrong direction.

### Navigation

One persistent element: the Principal's miniature avatar at the bottom edge of every screen. Returns to HQ from anywhere. No tab bar. No sidebar. The HQ is the navigation.

### Onboarding structure is non-negotiable

Questions → photo upload → ceremony → avatar reveal → **payment wall** → HQ assembly → suggested agent → workspace entry. Not reordered. Not abbreviated. The payment wall placement — after the avatar reveal, before the HQ reveals — is the product's highest-confidence conversion moment.

### The HQ must deliver specific information on every return

The ambient status line must communicate something specific and actionable that the user could not know without reading it. If this cannot be made genuinely informative at launch, show the most recent output card from the most active agent instead. Specific always beats generic.

### The workspace must feel like a desk

Cards accumulate and persist. A user who opens an agent after three months should see the work they did then — still present, still accessible. Designing the workspace as a chat interface at any point, even temporarily, makes it very hard to redesign after users are habituated.

### Memory must be encountered before it is managed

Memory items surface automatically in the capability input panel from the first session. The memory strip is for management — the panel is where value is demonstrated. Both must exist. The panel is primary.

### Seeding is mandatory

An agent created without context will fail its first output. That first output is the product's most important functional proof moment. Mandatory seeding — three domain-specific questions, required before creation completes — is not friction. It is the mechanism that makes the first interaction better than anything the user has used before.

### Three things that must be true at launch

1. **The avatar is consistently excellent** — across diverse face types, ages, photo qualities. Solve this before building anything else.
2. **Seeded agents produce visibly better first outputs than generic AI** — the delta must be unmistakable. If it is not, the product's premise is unproven and should not launch.
3. **The HQ delivers specific, actionable information on every return** — not placeholder text, not generic activity. Specific state from the user's actual agents.

---

*Previous: [06 — Sharpened Art Direction ←](../design/06-sharpened-art-direction.md)*
