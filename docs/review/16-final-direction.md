# AURA HQ — Final Direction
**The authoritative final statement. Supersedes all prior positioning documents.**
**April 2026**

---

> This document converts all prior critique into decision. Every section is a resolved position, not a working hypothesis. When prior documents conflict with this one, this one is correct.

---

## 1. Final Concept Statement

AURA HQ is a personal AI organization — built by one person, around one person, commanded by one person.

You begin with your portrait: an AI-rendered image of you, positioned at the apex of a visual hierarchy you will build beneath it. Below your portrait, you design a structure of named AI agents — each scoped to a real domain of your life or work, each holding your context, each working from purposes you wrote. The longer you build, the more the structure reflects the actual architecture of your intelligent life.

This is not a productivity tool. Not a chat interface with a premium wrapper. Not a collection of AI features organized by category. It is the first AI product structured by you, around you, reporting to you.

The relationship it creates is organizational, not transactional. You are above it. It works beneath you. That is the premise, and every decision in the product either reinforces it or undermines it.

---

## 2. Final Product Promise

**AI that works beneath you, not beside you.**

Every other AI product is positioned beside you — a collaborator, a co-pilot, a partner, a companion. AURA HQ is positioned beneath you. The direction is not beside, not alongside, not at the table with you. Beneath you. Organized under you. Answering to you.

This is not a posture of coldness. It is a posture of structural clarity. You command. The agents serve. The structure is yours.

---

## 3. Final Emotional Promise

**The feeling of leading an intelligent organization that knows you.**

Not the feeling of using a tool. Not the feeling of being helped. The specific feeling of returning to a structure you built — your portrait at the top of it, your agents holding your context, the ambient read of what is active and what is waiting — and feeling composed, capable, and organized in a way that no single app or assistant has ever produced.

This feeling has a name: being the principal of your own intelligent life.

That is what the product delivers. Not productivity. Not AI access. Not a better chat experience. The specific feeling of structural command over the intelligence working for you.

---

## 4. Final Product Description

AURA HQ has three surfaces and one organizing premise.

The premise: you are at the top. Your portrait — AI-rendered from a photo you upload, lit with the specific warmth of directed light, placed in the product's visual world — sits at the apex of the HQ. Beneath it, connected by structural lines, are the agents you have built. Each has a name you gave it, a purpose you wrote, a domain that determines its capabilities, and a memory of your situation that grows with every interaction.

The HQ is the first surface. It shows you the structure at a glance — what is active, what is quiet, what is waiting. You descend from it into workspaces and surface to it from any point in the product. It is not a launch screen. It is the place you command from.

The Workspace is the second surface. This is where you work with one agent. A fixed header shows the agent's name, domain, and the purpose statement you wrote. Beneath it, a capability strip presents three specific actions — not an open text field, not a chat window, but structured delegation. You select an action. The input panel opens with a specific prompt and the memory context the agent has accumulated. You submit. An output card develops into the work area. The cards accumulate. The desk builds over time.

The Creation Flow is the third surface. Five steps: domain, name, purpose, seeding, placement. All required. The seeding questions are the most important copy in the product — they are the beginning of a relationship, not an intake form. When you confirm, you return to the HQ and watch the connection line draw and the node populate. You built something.

Everything else — profile, agent settings, memory management — is a panel within one of these three surfaces. The product is three things deep. Not more.

---

## 5. Final Visual Direction Statement

**Institutional geometry, inhabited by one person.**

The hierarchy is cool, precise, and structural. The portrait at its apex is warm, luminous, and singular. These two visual registers do not resolve into each other — they coexist in specific tension. Structure is cold because it is institutional. Presence is warm because it is human. The distance between them is the product's entire visual identity.

**In practice:**

The HQ connector lines are 1px, Deep Slate Warm (`#2A2620`), rendered as deliberate geometric arcs. They are the cool register — formal, structural, authoritative. The Principal's avatar ring is Resin Amber (`#B8762A`), the warmest and highest-saturation element on any surface. It appears no more than three times per surface. Every appearance must feel earned.

The ground is Burnt Umber Dark (`#16100A`) — warm-dark, not grey-dark. The primary surface is Antler (`#EFE8DA`) — unbleached natural fiber, not parchment. Shadows are Burnished Sienna (`#5C4A38`) at 8–12% opacity — never grey. No borders anywhere. No blue, no purple, no pure black or white.

The avatar is rendered in Rembrandt lighting — one warm key light at 45 degrees, one small light triangle on the shadow side of the face. Editorial portrait quality: could sit beside a New Yorker photograph and not be visibly inferior. It looks like a great photograph of the person, not a stylized AI output.

Agent signatures are abstract formal compositions — non-representational, non-iconic, rendered in the product's palette at node scale. A briefcase on an agent node is not AURA HQ. Precise geometry is the personality.

Motion develops from warm to cool — warmest tones arrive first in every reveal. The easing is `cubic-bezier(0.04, 0, 0.2, 1)`. Things settle with weight. Nothing springs. Nothing bounces. Nothing performs.

---

## 6. Final MVP Statement

### The MVP proves one claim

A scoped, seeded agent — built by the user, holding the user's context — produces noticeably better output from session one than any generic AI tool. And it improves with every session.

If this claim cannot be demonstrated unmistakably in the first interaction, the product should not launch. Not "iterate." Not launch.

### The three MVP domains

**Work · Money · Personal Growth**

This is a deliberate departure from the previous Work / Finance / Health configuration. Here is the reasoning:

Health was the weakest of the three original domains. Health agents (habit tracking, medical preparation, pattern logging) are competent but not distinctive — dozens of apps do health logging. They do not demonstrate why this product is worth $25/month over a general AI tool.

Personal Growth is the strongest argument. Mirror — a structured reflective space that holds your patterns over time — is more emotionally distinctive, more press-worthy, and more immediately compelling as a reason to pay than any Health agent. Nobody has built this. It is also the domain that most directly demonstrates what AURA HQ specifically is: an AI that knows you structurally, not situationally.

MVP Personal Growth ships Mirror, Grain, and Meridian as available agents in this domain.

MVP domain labels use: **Work, Money, Personal Growth** — in user-facing copy throughout. Not "Finance." Money is the human word.

### What ships in MVP

| Component | Specification |
|---|---|
| Onboarding ceremony | 3 questions, photo upload, avatar generation, 13-phase ceremony, HQ reveal |
| Avatar generation | Must pass portrait quality test. Fallback style must exist before ceremony is built. |
| HQ view | Principal at apex, up to 4 agent nodes, single-tier arc, ambient timestamp layer |
| Work domain | Manuscript · Counsel · Dispatch |
| Money domain | Ledger · Horizon · Terms |
| Personal Growth domain | Mirror · Grain · Meridian |
| Agent creation flow | All 5 steps, seeding required, full animation on return |
| Agent workspace | Fixed header, purpose, capability strip (3 + structured prompt builder), output cards, memory |
| Memory system | Seeded + confirmed facts, 25-item cap, automatic surfacing in input panel |
| HQ ambient layer | Last-interaction timestamp per agent (guaranteed minimum) + node visual states |
| Spatial navigation | Swipe up from workspace → HQ; swipe horizontal between workspaces |
| Subscription | Flat monthly ~$25, 14-day trial, paywall after avatar reveal before HQ assembles |

### The HQ ambient layer — resolved

The ambient status sentence ("Work has a draft ready. Finance hasn't heard from you in 11 days") has been deferred to "when data is ready." That is not a launch decision. The guaranteed minimum that ships at launch is: last-interaction timestamp per agent, displayed directly on each node. "Manuscript — 2 days ago." "Ledger — 14 days ago." "Mirror — today." This requires only a timestamp per agent. It is always available. It is always honest. It creates asymmetric information — something you can only get from the HQ — without requiring backend pipeline work. The richer ambient status sentence ships in V1.1 when the data layer supports it.

### The fallback avatar style — resolved

When avatar generation confidence is below threshold, the fallback activates automatically. The fallback style: a refined monochromatic silhouette study. The source portrait reduced to tonal areas — Rembrandt lighting preserved as warm-to-shadow zones, fine facial detail removed, skin tones unified into warm-neutral bands. Premium and abstract, not low-quality. The user does not know they received the fallback. The ceremony adapts: Chemistry, Warmth, and Form phases proceed normally; Definition resolves without fine detail (smooth tonal portrait rather than photorealistic); Silence and Structure are unchanged. The Resin Amber ring luminizes. The ceremony continues.

### The ceremony — resolved for non-first-time users

The 13-phase ceremony plays once: at first onboarding, for the first avatar. On all subsequent sessions, the HQ assembles from its current state. No ceremony on login. No ceremony on navigation. Avatar regeneration is the only other trigger for the full ceremony — regeneration is a deliberate act of revisiting the becoming, and it earns the full duration. New agent creation uses only the node connection animation and population sequence (no ceremony). The ceremony is singular. That singularity is part of its value.

### "Something else" — resolved

The capability strip escape hatch does not open a freeform text field. It opens a structured prompt builder. Three fields, one sentence: **[I want to] [free text] [for/about] [free text, optional] [as a] [format selector: draft / analysis / reflection / plan / other]**. The user can be flexible. The structure produces better output than a blank box. The experience is: structure → choice → structured flexibility. Never: structure → empty field. The blank field is the ChatGPT experience. Do not ship the ChatGPT experience.

---

## 7. Final Premium Future Vision

After MVP is proven — defined as: 60-day retention above industry baseline, and NPS above 50.

**V1.1 — HQ ambient intelligence**
The ambient status sentence ships when the data layer is ready. *"Manuscript has a draft you haven't opened. Ledger hasn't heard from you in 14 days."* Node visual states become more granular. The HQ becomes genuinely intelligent as a return surface, not just structurally beautiful.

**V1.2 — Memory depth**
Memory pattern surfacing: agents begin identifying recurring themes across stored facts. *"You've described time pressure as a constraint in three separate conversations."* Memory becomes perspective, not just archive. 25-item cap raises to 50 with explicit confirmation.

**V2.0 — Domain expansion**
Creative, Learning, Life Admin, Family added as available domains. Each fully specified with distinct capability profiles, memory schemas, agent signatures, and seeding questions before launch. Three agents per domain minimum. No shallow additions.

**V2.1 — Agent sub-structures**
Active agents that have accumulated genuine depth can develop sub-nodes — sustained goal threads made structural. The HQ grows a second tier for agents that have earned it. The visual language scales from one tier to two without losing hierarchy clarity.

**V2.2 — Cross-agent intelligence**
Agents within the same HQ share a meta-context layer — the knowledge that they answer to the same person. Mirror and Counsel begin to surface patterns across domains. *"What you're working on in your Work agent appears to be connected to something you've brought to Mirror three times."* This requires proven individual agent depth before it becomes meaningful.

**V3.0 — Mobile application**
After the spatial layout is validated and habitual on web, a compressed-but-architecturally-faithful mobile experience. The HQ works at phone scale without losing hierarchy. The swipe-up and swipe-horizontal navigation adapted for native gesture handling. Avatar ceremony optimized for mobile rendering. Not before V2.0 is stable.

**Premium tier**
A higher subscription level for users who want expanded memory capacity (100 items), additional domain types, priority avatar quality, and early access to new capabilities. Offered at month six, not at launch. Trust before upsell.

---

## 8. Final Non-Negotiables

These are irreducible. When development pressure, user testing, or resource constraints challenge them, the answer is no.

**1. Avatar quality is a launch condition, not a V1.1 improvement.**
The fallback style must exist before the ceremony is built. If the portrait quality cannot be made excellent and consistent, AURA HQ does not launch. There is no AURA HQ with a mediocre avatar.

**2. Memory surfaces automatically in the input panel from session two.**
Not on request. Not through navigation. Automatically, in the workflow, with the user's own words as the content. If this does not work, the product's core promise does not work. This is tested first. It ships or the product does not.

**3. The HQ provides information only available from the HQ.**
At minimum: last-interaction timestamps per agent, visible simultaneously without navigation. The HQ is never a splash screen. If it becomes a splash screen, the product's central premise has collapsed and the product must be reconsidered.

**4. Agent names from the catalog are used exactly, everywhere.**
Manuscript, Counsel, Dispatch, Mirror, Grain, Meridian, Ledger, Horizon, Terms, Chronicle, Momentum, Scope, Craft, Signal, Charter, Vault, Claim — every name is a product decision and a differentiator. No genericization. No renaming for "clarity." The names are the personality.

**5. The capability strip never leads to a blank text field.**
"Something else" opens the structured prompt builder. The blank field is the ChatGPT experience. Do not build the ChatGPT experience.

**6. The principal is warmest element on every surface.**
Resin Amber on the avatar ring. No element on any surface is warmer, more saturated, or more visually prominent than the Principal. Every design review checks this. If anything else competes: it is wrong.

**7. The avatar ceremony plays at full duration when the result is ready.**
Never shortened. Never begun before generation is complete. The ceremony is a presentation, not a loading animation. Its duration is its value. When product efficiency arguments challenge this, the answer is no.

**8. Domain differentiation must be real before launch.**
The QA gate: ask the same underlying question to a Work agent and a Money agent. If the outputs are structurally similar, domain differentiation is not real and the product must not launch. This test is a launch requirement, not a post-launch observation.

---

## 9. Final List of Things to Cut

These are decisions. Not suggestions. Cut them.

**Cut "For the first time" from the product promise and all positioning copy.**
It is a pitch phrase that undermines credibility. It may not be true. Replace with language that describes what the product specifically does, not that it is the first to do it.

**Cut "AURA" if the name can still change. If it cannot: never lead with it.**
The concept is stronger than the name. If the name is fixed, compensate: make "HQ" the visual and verbal center of the brand. The product is the HQ. The word that should echo in the user's mind is HQ — the command center, the structure, the place they return to.

**Cut "Principal" from all user-facing copy.**
Use it in design documentation. Never show it to users. Replace with "you" in all interface copy. Users do not think of themselves as principals. The word performs a status it does not produce.

**Cut "bridge between fear of AI and empowerment" from all documents.**
It was written in 2023 by hundreds of AI companies. It is not AURA HQ's specific contribution. Cut it. Let the product demonstrate the bridge rather than claiming to build one.

**Cut the Finance seeding questions as currently written and replace them.**
"Describe your current financial situation in one sentence" is a bank form.
Replacement:
1. *What is a financial decision you keep postponing — and what is actually stopping you?*
2. *If your financial situation were exactly where you want it in five years, what would be different about your daily life?*
3. *Where does money create the most anxiety in your life right now, and why?*
These questions produce a Money agent that feels like a relationship. The originals produce an intake form.

**Cut "Composing your presence" as generation screen copy.**
It is trying to be poetic at the moment of maximum user anxiety. Replace with silence, or a single word. "Ready." "Almost." Nothing is better than something precious.

**Cut The Document alternate art direction (from Phase 6).**
Alternate B describes a fundamentally different product. It contradicts the primary direction enough to create strategic confusion. Remove it from all reference documents. The primary direction is the direction.

**Cut weekly synthesis from all roadmap documents.**
It has been correctly excluded from MVP. Remove it from vision documents too. It is the kind of feature that sounds sophisticated in a deck and becomes ignored noise in a product. If it re-emerges, it comes from user behavior data — not from strategic aspiration.

**Cut the empty node pulse animation.**
"Slow warm pulse, one cycle per 3 seconds, at 10% luminosity variance." This is decorative. An empty node that gently glows will be noticed once and ignored permanently. Empty nodes communicate potential through their presence and their "+" affordance — not through animation. Remove the pulse.

---

## 10. Final Recommendation

Build the product that the concept deserves.

The concept is genuinely strong: a personal AI organization structured by one person, with their portrait at the apex, their agents below, their context held. The visual thesis — institutional geometry inhabited by warmth — is irreducible. The agent names have personality. The seeding questions have soul. The memory specification has rigor.

What has been holding the concept back is caution: the MVP domains chosen for safety rather than differentiation, the ambient status deferred rather than solved at a lower cost, the "Something else" escape hatch left open rather than redesigned, the fallback avatar style acknowledged but not specified.

The final recommendation: build with the bolder choices.

Ship Work, Money, and Personal Growth — not Work, Finance, and Health. Lead with Mirror. A product that offers a structured reflective intelligence that knows your patterns over time is more distinctive, more defensible, and more worth $25/month than a product that helps you log your sleep and track your budget. Those exist. Mirror does not.

Make the avatar excellent or do not launch. Specify the fallback. Solve the ceremony for edge cases. These are not engineering tasks — they are product decisions that have been deferred to engineering. Resolve them now.

Make the HQ earn return on day one with timestamps. Add the ambient status sentence in V1.1. Never allow the HQ to become a lobby.

Protect the four moments: avatar reveal, HQ reveal, first agent output, first memory surfacing. Everything else can be iterated. These cannot. They are the product's first impression, its proof of concept, and its reason to stay — in that order.

If those four moments are extraordinary and the daily capability loop delivers genuine value, AURA HQ will be something people talk about. Not because it is beautiful — because it is the first AI product that made them feel organized around themselves, rather than scattered across someone else's interface.

That is the product. Build it.

---

*AURA HQ · Final Direction · April 2026*
*This document resolves: review/15-critical-review.md and all prior positioning documents*
*Authoritative reference for all product, design, and engineering decisions*
