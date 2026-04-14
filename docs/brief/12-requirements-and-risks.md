# AURA HQ — Requirements and Risks
**Reference sheet for designer + engineer | April 2026**

---

## 10 Highest-Priority Design Requirements

Ordered by failure impact. First five are launch-blockers.

---

**DR-01 — Avatar output quality**
The avatar transformation must produce an output that a person unfamiliar with AI generation would describe as "a great portrait photo." Test across minimum: 3 skin tone ranges, 3 age ranges, studio photo, casual selfie, outdoor photo (9 test inputs minimum). Document failure modes. Build fallback style. Ship only when ≥90% of test inputs pass.
**Failure mode:** Users see a mediocre result after 13 seconds of ceremony. Trust destroyed. No recovery.

---

**DR-02 — Resin Amber budget enforced**
`--color-principal` (`#B8762A`) appears on ≤3 elements per rendered surface. Enumerate them per screen during design review: Principal avatar ring (1), one primary active state (2), one peak-moment indicator (3). Any proposal for a fourth use requires removing an existing one.
**Failure mode:** Amber used broadly → product reads as a warm wellness app, not an intelligent structure.

---

**DR-03 — Principal node visual supremacy**
On the HQ surface, the Principal avatar node must be measurably the highest-contrast, warmest element. No agent node, no copy, no structural element equals or exceeds its visual presence. Verify in Figma: inspect contrast ratios and color temperature against all other elements on the HQ canvas.
**Failure mode:** An agent node or UI element competes with the Principal → the hierarchy is visually undermined.

---

**DR-04 — No borders anywhere**
Surface edges are defined by shadow only: `0px 4px 20px rgba(92,74,56,0.08)` (surface), `0px 8px 32px rgba(92,74,56,0.12)` (elevated). Zero stroked borders on any element at any size. Shadow color is always Burnished Sienna-based (`rgba(92,74,56,…)`), never grey.
**Failure mode:** Borders make the product look like a SaaS tool. Warm shadows make it look material.

---

**DR-05 — Domain signatures are non-representational**
The three MVP domain visual signatures (Work, Finance, Health) must be abstract formal compositions, not icons, not symbols, not emoji-adjacent. Work: horizontal line intervals. Finance: concentric arcs. Health: sinusoidal forms. Produce SVG compositions before the rest of the design system is built — they affect node sizing and the visual register of the entire HQ.
**Failure mode:** Representational icons make agents look like menu items. The HQ becomes an app launcher.

---

**DR-06 — Typography strictly separated by role**
Canela/Lyon Text: Principal name at HQ apex, onboarding questions, creation flow headers only. Söhne/ABC Diatype: all operational copy including capability labels, card content, purpose statements, ambient status, memory items, error states. No exceptions, no mixing within a single element. Review: if the serif appears on a capability label or card body, it is wrong.
**Failure mode:** Broad serif use → product reads as a lifestyle magazine, not an intelligent tool.

---

**DR-07 — HQ node states visually distinct at a glance**
Active, quiet, dormant, and incomplete nodes must be distinguishable without reading any label — through signature opacity alone (100% / 80% / 50% / 30%) and activity dot presence/color. Test: screenshot the HQ at each state, blur to 40px, verify states remain distinguishable.
**Failure mode:** All nodes look the same → the HQ delivers no information → users bypass it to go directly to workspaces.

---

**DR-08 — Connection lines: 1px, arc, cool-toned**
HQ connector lines: 1px stroke, `--color-structural` (`#2A2620`), rendered as a gentle downward arc from the Principal's node to each agent. Not straight vertical. Not diagonal. The arc communicates flow from one source. At node-population: the line draws over 600ms using a Burnished Sienna cursor that leaves Deep Slate Warm in its wake.
**Failure mode:** Straight or diagonal lines → HQ looks like a flowchart or mind map template.

---

**DR-09 — Motion easing: custom cubic-bezier only**
All transitions use `cubic-bezier(0.04, 0, 0.2, 1)`. No spring physics. No `ease-in-out`. No platform defaults (`ease`, `linear`, `ease-in`). Implement as a CSS custom property: `--ease-settle: cubic-bezier(0.04, 0, 0.2, 1)`. Apply globally.
**Failure mode:** Spring physics or platform defaults make the product feel like every other app. The specific easing is the motion's identity.

---

**DR-10 — Warm shadow color, not grey**
Every shadow in the product uses Burnished Sienna (`#5C4A38`) at low opacity, not grey (`rgba(0,0,0,…)`). Implement as: `box-shadow: 0px 4px 20px rgba(92, 74, 56, 0.08)` (surface), `0px 8px 32px rgba(92, 74, 56, 0.12)` (elevated). Grey shadows immediately drop the product into generic SaaS territory.
**Failure mode:** Grey shadows → all warmth in the palette is neutralized by cold depth cues.

---

## 10 Highest-Priority UX Requirements

Ordered by failure impact. First four are launch-blockers.

---

**UX-01 — No open text box as primary workspace entry point**
The workspace opens to the capability strip. There is no visible text input until a capability is selected. The input panel expands from the strip when a capability is selected. This is the product's primary differentiation from chat products. Zero exceptions. If a capability is missing, the solution is to add a capability or improve the "Something else" escape hatch — not to add a persistent text input.
**Test:** Open any workspace and check: is there a text input visible before selecting a capability? If yes: broken.

---

**UX-02 — Output cards persist across sessions**
Cards in the workspace are never automatically cleared. They accumulate. A user who returns after three months sees the work from three months ago. Cards can be manually deleted from the agent settings panel, but not by any automatic process. Session end does not clear cards.
**Test:** Create a card, close browser, return next day: card is present.

---

**UX-03 — Seeding questions cannot be skipped**
In agent creation Step 4, all three domain-specific seeding questions are required before the Step 5 confirmation becomes accessible. The "Next" control is disabled (not hidden) until an answer of minimum 20 characters is entered. The system communicates once on entering Step 4: *"Your agent gives better answers when it knows your situation."*
**Test:** Attempt to complete agent creation without answering seeding questions: must be impossible.

---

**UX-04 — Memory surfaces automatically in the input panel**
From the user's second session with a given agent, memory items appear automatically in the input panel below the text area, labeled *"Based on what you told me."* The user does not trigger this — it happens on every capability panel open. Show maximum 3 items, ordered by relevance to the selected capability. This is the interaction that proves the product's core claim.
**Test:** Create agent, seed it, use it once, return: memory items appear in input panel without user action.

---

**UX-05 — HQ reachable from any workspace in one gesture**
From any workspace: swipe up (mobile) or click HQ-return affordance at top edge (desktop) → HQ. One gesture or one click, no intermediate screen. Swipe-up gesture on mobile must not conflict with OS-level scroll behavior — implement as a dedicated gesture zone at the top of the workspace header.
**Test:** From workspace, perform one swipe/click: HQ is visible within 540ms.

---

**UX-06 — Adjacent workspaces reachable without surfacing to HQ**
From any workspace: swipe left or right → adjacent agent's workspace (in creation order). Desktop: agent rail on left edge shows all agents, click to navigate. The rightmost position in the horizontal axis is always the "+" creation entry. No requirement to return to HQ to switch between agents.
**Test:** With 3 agents created, navigate from Work workspace to Health workspace without touching HQ: must be possible in one gesture.

---

**UX-07 — Ambient status text must be specific or absent**
The ambient status line must name actual agents with actual states. It is populated from real activity data (last session timestamp, pending card states). If the data infrastructure is not ready at launch, the ambient status line does not ship — the HQ communicates through node visual states only. Generic copy (*"Your agents are active"*) is prohibited.
**Test:** Simulate a user with Work agent used yesterday and Finance agent unused for 15 days. Verify: ambient status reads *"Work active. Finance hasn't heard from you in 15 days."*

---

**UX-08 — Creation flow never opens as a modal**
Tapping an empty node in the HQ initiates a full-screen creation flow. Not a slide-up sheet. Not an overlay. Not a side panel. The creation flow is a contained surface with its own background and no HQ structure visible. The transition from HQ to creation flow: warm cross-dissolve over 540ms.
**Test:** Tap empty node: verify no HQ chrome is visible in the creation flow at any step.

---

**UX-09 — Memory saving requires explicit confirmation**
"Save to memory" does not save automatically. When tapped, a confirmation step appears: the system presents an extracted one-sentence statement of what it understood as the key fact. The user can edit this sentence before confirming save. The confirmed sentence (not the raw card content) is stored as the memory item.
**Test:** Tap "Save to memory" on a card → verify: user sees an editable extracted fact before it is stored.

---

**UX-10 — Payment wall positioned correctly**
Subscription offer appears after the avatar reveal silence ends (after the 2 seconds of silence, before the HQ structure begins assembling). Not before onboarding. Not at the end of onboarding before avatar. Not after the HQ assembles. The user has just experienced the product's most important emotional moment. The offer is presented at peak emotional investment.
**Test:** Walk through full onboarding: verify subscription offer appears after portrait is fully visible and silent, before any HQ structure or agent appears.

---

## 10 Biggest Execution Risks

Ordered by likelihood × impact. Each has a specific prevention measure.

---

**ER-01 — Avatar generation quality variance**
**Severity:** Critical · **Likelihood:** High
The generation model produces excellent results for clean, well-lit photos and poor results for casual selfies, unusual lighting, or less common face types. The 13-second ceremony amplifies failure.
**Prevention:** Mandatory pre-launch test set (minimum 9 inputs as specified in DR-01). Fallback style built and tested. Ceremony conditional on quality threshold. Quality is a launch gate.

---

**ER-02 — Domain differentiation is cosmetic**
**Severity:** Critical · **Likelihood:** High
Work, Finance, and Health agents feel identical — same response style, same output structure, different labels. Experienced users identify this within the first week. The entire product premise collapses.
**Prevention:** Pre-launch QA gate: identical question to Work and Finance agents. If outputs are structurally similar: do not launch. Domain differentiation must be real at the system-prompt, memory-schema, and output-format levels.

---

**ER-03 — Memory is prompt-stuffing, not structured retrieval**
**Severity:** Critical · **Likelihood:** High
Memory is implemented by stuffing the entire conversation history into a long context window. Output quality degrades as context fills. Users who return after 30 days notice the agent has "forgotten" or gives worse responses. The product's core claim fails.
**Prevention:** Structured memory extraction: key-value store per agent, domain-specific fact schema, retrieval mechanism that surfaces relevant facts at capability call start. Do not ship memory surfacing (UX-04) until the underlying retrieval mechanism works correctly.

---

**ER-04 — Ceremony begins before generation is ready**
**Severity:** Critical · **Likelihood:** Medium
Avatar generation takes longer than expected. The generation screen stays up for 60+ seconds with no feedback. Users abandon before the ceremony begins.
**Prevention:** Avatar generation begins during Q3 (the longest step). Ceremony is a presentation of a ready result — it never begins as a loading animation. If generation takes longer than ceremony + questions, extend the generation screen. Never begin the ceremony without a complete, above-threshold result.

---

**ER-05 — HQ becomes a navigation lobby**
**Severity:** High · **Likelihood:** High
By day 5, users skip the HQ entirely and navigate directly to their most-used workspace. The structural premise — you command from above — is undermined by the actual usage pattern.
**Prevention:** Ambient status must be genuinely informative from session one (UX-07). Node visual states must be meaningfully distinct (DR-07). Monitor HQ visit rate in session analytics from day one. If users bypass HQ >80% of sessions within 2 weeks: the ambient status mechanism must be rebuilt before V1.1.

---

**ER-06 — Capability strip resisted as a constraint**
**Severity:** High · **Likelihood:** Medium
Users open the workspace, look for a text box, find none, and interpret the product as broken or limited.
**Prevention:** "Something else" escape hatch present at launch (visually smaller, always accessible). Capability labels include contextual examples on hover/first use. Monitor: what % of interactions use "Something else"? If >40%: capability labels need rewriting.

---

**ER-07 — Spatial navigation conflicts with OS gestures**
**Severity:** High · **Likelihood:** Medium
On iOS and Android, swipe-up and swipe-left/right conflict with system navigation gestures (back, home, app switcher).
**Prevention:** Swipe-up to HQ implemented as a gesture zone in the fixed workspace header (not the full screen). Horizontal workspace navigation implemented as a tab-style component on mobile, not a full-screen swipe. Test on iOS 17+ and Android 14+ before mobile launch.

---

**ER-08 — Memory panel becomes unmanaged accumulation**
**Severity:** Medium · **Likelihood:** High
After 6 weeks, the memory panel has 25 items the user doesn't remember adding. Managing it feels like database maintenance. Users stop caring about memory accuracy.
**Prevention:** 25-item hard cap enforced (cannot save more without deleting). Explicit save confirmation with fact editing (UX-09). "Still relevant?" prompt on items older than 30 days. Monitor: what % of users ever delete a memory item? If <5%: the confirmation flow needs refinement.

---

**ER-09 — Warm palette reads as lifestyle / wellness**
**Severity:** Medium · **Likelihood:** Medium
The amber and warm neutral palette, without the cool structural tones maintaining visual tension, reads as a journaling app or wellness tool.
**Prevention:** Resin Amber budget strictly enforced (DR-02). Deep Slate Warm connector lines and structural elements must maintain their cool register — never warmed up. Shape language must be rectangular (8px radius) — never rounded. Design review checklist includes: "Does the HQ feel like an organization or like a mood board?"

---

**ER-10 — Typography licensing delays**
**Severity:** Low · **Likelihood:** Medium
Canela and Söhne require commercial licensing. License procurement can take 2–4 weeks and requires budget approval.
**Prevention:** License both typefaces in the first week of design work, before any design decisions are finalized. Fallback stack if licenses are delayed: `Georgia` (display) + `system-ui` (operational) — acceptable for internal review only, not for launch or user-facing work.

---

*AURA HQ · Requirements and Risks v1.0 · April 2026*
*Full brief: `brief/10-design-brief-v2.md`*
