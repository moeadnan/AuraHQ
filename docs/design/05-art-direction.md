# Art Direction

**Phase 5 of AURA HQ — Full visual system definition**

> Four disciplines in sequence: emotional visual interpreter, brand visual strategist, interface art director, motion director, with critical aesthetic review. The goal is a visual system specific enough to brief a design team, commission a development environment, and reject wrong interpretations before they are built.

---

## Table of Contents

1. [Visual Thesis](#1-visual-thesis)
2. [Mood World](#2-mood-world)
3. [Color System](#3-color-system)
4. [Materials and Surfaces](#4-materials-and-surfaces)
5. [Typography and Form](#5-typography-and-form)
6. [Motion and Light](#6-motion-and-light)
7. [Avatar and Agent Identity](#7-avatar-and-agent-identity)
8. [Visual Risks](#8-visual-risks)
9. [Final Recommendation — Composed Luminance](#9-final-recommendation--composed-luminance)
10. [Alternate Directions](#10-alternate-directions)

---

## 1. Visual Thesis

### Personal luminance

The visual language of AURA HQ is the quality of light that belongs to a specific person — not ambient illumination, not broadcast light, but the directed, warm, intelligent light of a space designed for one. The product should feel like stepping into a room that was composed around your presence.

This thesis contains two inseparable ideas:

**Personal** — the visual system is not universal or neutral. It responds to the individual. The Principal's avatar is the warmest, most present element in the interface. Everything else is cooler, more functional, arranged around them. The hierarchy is felt before it is read.

**Luminance** — light is the primary design material. Not color. Not shape. Light. The quality of warmth, direction, and temperature in the interface is what produces the feeling of being elevated rather than managed. Light is the difference between a space that was curated and one that was assembled.

Together: the product should feel like standing in directed, warm light, at the center of something organized specifically around you. Empowered without being proclaimed. Beautiful without being decorative. Intelligent without being cold.

### What this thesis rejects

| Rejected direction | Why |
|---|---|
| Luminance without warmth | Cold glowing UIs read as technological distance, not human presence |
| Warmth without intelligence | Amber-and-parchment lifestyle aesthetic feels like comfort, not command |
| Neutrality as premium | Emptiness masquerading as sophistication — premium is the quality of decision, not the absence of it |

**The visual test for every design choice:** Does this feel like it was placed here for this specific person, or does it feel like it was placed here for everyone?

---

## 2. Mood World

### The world AURA HQ inhabits

Not a future. Not a fantasy. A heightened present.

The reference is not a tech product. It is the feeling of specific, real things that possess a particular quality of composed excellence:

**Five sensory anchors:**

**1. A lamp at dusk in a room designed for one person.**
Not overhead fluorescence. Not cinematic neon. A single source of warm light, positioned with intention, casting directed shadow. The room belongs to someone specific. The objects are meaningful, not decorative.

**2. The inside of a fine watch case, opened for the first time.**
Warm metal that is not shiny — slightly oxidized, textured at micro scale. Mechanisms that are precise and visible but not exposed as performance. The quality of things built to be both beautiful and functional, where neither compromises the other.

**3. A first-edition book printed with care.**
Typography that has weight and intention. Paper with tooth and warmth. The architecture of a page that was composed rather than filled. The feeling that the person who designed this believed you were worth the effort.

**4. A portrait sitting, not a selfie.**
Light positioned by someone who knows what they are doing. The subject composed rather than caught. Something true about the person revealed rather than flattered superficially. The feeling of being seen and rendered faithfully.

**5. A great room before the curtain rises.**
The collective held breath. The darkness that is not empty — charged with anticipation. The moment before something important begins. AURA HQ should carry this quality in its transition moments.

### What this world explicitly excludes

| Excluded world | Why |
|---|---|
| Dark-mode sci-fi | Technological distance, not human presence |
| Soft wellness gradients | Comfort, not command |
| Editorial fashion minimalism | Style over substance — empty premium |
| Brutalist interface design | Authority through aggression, not composure |
| Glassmorphism tech | Transparency as decoration, not structural logic |
| Warm indie-app amber | Quaint, not elevated |

---

## 3. Color System

The color system follows the visual thesis. Light is the primary material. Color is how the system expresses the temperature and direction of that light. Every tone is chosen for its emotional function, not its aesthetic appeal in isolation.

### Foundations

| Name | Hex | Role |
|---|---|---|
| Warm Parchment | `#F2EDE4` | The world. All base surfaces. The material the product lives within. |
| Deep Warm Charcoal | `#1A1612` | Weight and authority. Primary text, structural depth, the thing that makes warmth readable. |
| Warm Stone | `#8A7E72` | Rest and distance. Secondary text, inactive states, present but not urgent elements. |

### Raised surfaces

| Name | Hex | Role |
|---|---|---|
| Antique Ivory | `#EDE5D3` | Elevation. Card surfaces, panels, modal backgrounds — above the ground, below the accent. |
| Luminous Warm White | `#F8F4EE` | Focus. The highest-contrast moments: active inputs, selected states, Principal avatar background. |

### Glow tones

| Name | Hex | Role |
|---|---|---|
| Amber Cognac | `#C4893A` | The Principal. The warmest, most alive point. Avatar node ring, apex indicator, highest-emphasis interactions. Used sparingly — every appearance must feel significant. |
| Pale Gold | `#D4A85A` | Response. The system acknowledging interaction with warmth. Hover states on primary actions, active capability indicators. |

### Accents

| Name | Hex | Role |
|---|---|---|
| Antique Rose Copper | `#B87B6A` | Intimacy. Peak emotional moments: memory save confirmations, milestones, avatar reveal, first agent creation. |
| Soft Sage Warm | `#7D8A7A` | Resolution. Dormant agent states, completed goal threads, work that is done and set aside with care. |

### Rules

- No blue tones. Blue reads as technological distance.
- No pure black (`#000000`) or pure white (`#FFFFFF`). Both strip warmth from adjacent tones.
- No saturated primaries. They read as notification colors in a system designed for calm.
- No purple or violet. The AI-purple convention is precisely what AURA HQ is not.
- Amber Cognac appears in the interface no more than 3–4 times per screen. Each appearance must feel earned.

---

## 4. Materials and Surfaces

### The surface logic

Surfaces should feel like they have material weight — not because they mimic physical objects, but because they express the quality of physical objects translated into light and form.

### Three surface types

**Ground surface — Warm Parchment**
The environment the product lives within. Not a background — a room. Slightly warm, very subtly textured at pixel level (fine grain visible at high DPI, imperceptible at standard). No border separates it from the viewport. The user is inside this world.

**Raised surface — Antique Ivory panels**
Cards, workspaces, and focused surfaces sit above the ground. Elevation expressed through a subtle warm shadow — not a border, not a stroke. Shadow uses a faint amber tint (not grey), is soft and wide, reads as a gentle lift. No element ever uses a border to define its edge. The edge is the shadow.

**Deep surface — HQ environment**
Slightly darker than standard surfaces. Agent nodes sit above this deeper ground, creating architectural depth. The Principal node appears not only at the top but slightly forward — closer to the viewer — through careful shadow and scale treatment.

### Material references (for design intent)

| Material | Quality it contributes |
|---|---|
| Warm vellum | Fine-grain texture at pixel level on all ground surfaces. Warm, slightly toothy, holds light without reflection. |
| Oxidized brass | Quality of the amber accent family. Warm, slightly uneven at micro scale, rich without ostentation. |
| Frosted umber glass | Modal overlays and focus states. Warm amber-tinted obscuring — turning toward a lamp, not away from one. |
| Fine linen | Influence on HQ background quality. Slightly irregular, slightly organic, warm. Felt, not seen. |

### What this material language avoids

| Avoided reference | Why |
|---|---|
| Glassmorphism (blur + transparency) | 2020 tech trend, not premium craft |
| Neumorphism (soft emboss) | Too soft, too domestic, loses structural clarity |
| Flat design (no depth) | Generic SaaS — no material intelligence |
| Polished metallic surfaces | Too reflective, too cool, too aggressive |
| Dark gradient backgrounds | Dark-mode tech convention — wrong register |

---

## 5. Typography and Form

### Display type — contemporary editorial serif

**Target quality:** editorial authority with humanist construction. Not nostalgic, not fashionable.

**Specific references:** Lyon Text (Kai Bernau), Canela (Commercial Type), Freight Display.

**Usage:** Principal's name at apex, domain headers, product's signature moments. Not body copy. Not UI labels. Only moments of structural authority.

**Tracking:** comfortable authority — not tight (anxious), not wide (casual). A good typographer's instinct.

### Operational type — humanist sans-serif

**Target quality:** warmth at the stroke level. Slight variation in stroke width, humanist terminals, lowercase 'a' with an opinion.

**Specific references:** Söhne (Klim Type Foundry), Untitled Sans (Klim), iA Writer Duo.

**Usage:** all operational interface copy — capability labels, memory items, card content, error states, onboarding questions.

**The typographic rule:** serif communicates structural authority. Sans communicates operational intelligence. The distinction is not aesthetic — it communicates hierarchy through voice.

---

### Shape language

**No circles for structural elements.** Circles signal friendliness and softness — the shape language of social products. Agent nodes are softened rectangles. Only the Principal's avatar uses a circular frame, because the Principal is a person, not a structure. This distinction is expressive before it is read.

**Corner radius system:**
- Base elements (cards, nodes, inputs): `10px`
- Small elements (tags, compact items): `6px`
- Large containers (modals, creation flow): `18px`
- Applied consistently — never changed for visual interest

**Shape hierarchy of the interface:**

| Element | Shape |
|---|---|
| Principal avatar | Circular frame — the person |
| Agent nodes | Softened rectangles — the structure |
| Capability strip items | Compact rounded rectangles |
| Output cards | Standard rectangle, warm shadow |
| Modal containers | Large rectangle, maximum radius |

The circular portrait surrounded by rectangular agent structures communicates the product's premise through form: the person is organic; the system is structured.

---

### Spacing mood

**Base unit: `8px`.** All spacing is a multiple of this unit. Every gap in the interface is a decision, not a default.

**Generous but not empty.** Space is used as a signal of composition — not as a default. Elements breathe because they were placed with intention, not because the design is unfinished.

**Reading density:**
- HQ view: most spatially generous — it is the world
- Workspace / operational surfaces: comfortable reading density — it is the desk
- Creation flow: focused, constrained — it is a single act

---

### Composition style

**Central hierarchy, not grid filling.** The HQ is not a grid of equal-weight elements. It is a hierarchy with a clear apex. The eye always knows where authority is.

**Stable vertical axis.** Compositions are not perfectly symmetrical, but the Principal's central position is inviolable. Agent structures may grow asymmetrically as the user builds — the Principal never shifts.

---

## 6. Motion and Light

### The physical law of motion

All motion obeys one principle: **things have weight and they settle.**

**Easing:** Custom curve — very brief ease-in (2–3% of duration), long soft ease-out (60% of duration). Like placing something of precise weight onto a surface. Not spring physics (playful). Not linear (mechanical).

### Duration scale

| Interaction type | Duration |
|---|---|
| Micro interactions (hover, focus) | 120–160ms |
| State transitions (card appearance, selection) | 280–380ms |
| Screen transitions (HQ to workspace) | 480–600ms |
| Signature moments (avatar reveal, structure assembly) | 3,000–8,000ms |

---

### Screen transitions

Slow, warm cross-dissolve. Not a slide, not a push. Elements leaving reduce in luminosity (warm fade toward background). Elements arriving increase in luminosity from background. The product breathes the new surface into view.

### Surface reveals (cards appearing)

Three-part sequence:
1. Warm shadow resolves — 150ms
2. Surface lifts from ground — 150ms
3. Content fades in — 200ms

**Total: 500ms.** The card was placed — it did not appear from nowhere.

---

### The avatar reveal — the signature animation

**Total duration: 6–8 seconds. Never shortened.**

| Phase | Timing | Description |
|---|---|---|
| Grain | 0–1.5s | Warm frame resolves to fine photographic grain. Warmth and texture only — nothing identifiable. |
| Form | 1.5–3.5s | Silhouette emerges at 30% completion — general face shape in soft warm form. Recognizable structure, not person. |
| Detail | 3.5–5.5s | Portrait becomes specific. Face recognizable. Light quality visible. Color resolves. |
| Presence | 5.5–6.5s | Final sharpening. Portrait completes. Very subtle warm radiance appears around avatar frame — light concentration, not glow effect. |
| Held | 6.5–8s | Two full seconds. No buttons. No prompts. No copy. The portrait and the name. Then the structure resolves below. |

This is not a loading state. Its duration is its value.

---

### HQ structure assembly

After the avatar reveal, the organizational structure resolves:

1. Connection lines draw downward from the Principal node — warm lines extending like roots, 800ms each, staggered
2. Agent node frames resolve — first as outlines, then filling with Antique Ivory, then domain indicators appearing
3. Empty nodes appear last — slightly cooler, slightly less present, but clearly present

**Total structure assembly: 2.5–3 seconds.** Nothing arrives simultaneously.

---

### Hover feeling

Luminosity increase only — no scale, no shadow amplification. Enters at 120ms ease-out. Exits at 160ms ease-out (slightly slower — warmth lingers). Agent nodes on hover show a faint Amber Cognac ring — a quiet suggestion: this element responds to you.

### Loading states

No spinners. No skeleton screens.

- **Short loading (under 2s):** very slow warm breathing pulse — luminosity oscillation between Warm Parchment and Antique Ivory, one cycle per 1.8 seconds
- **Long processing:** dedicated atmospheric states — designed experiences, not loading indicators

### Glow behavior

Glow in this system means: warm light concentration. Not neon. Not LED.

**Only two elements receive glow:**
1. The Principal's avatar node — always. Amber Cognac at 12% opacity, 40px blur radius. Ambient, not pulsing.
2. Active agents — 30% of Principal's intensity. Communicates: something here is alive.

**The rule:** Glow indicates intelligence and attention. Reserved strictly. Using it elsewhere dilutes the system.

---

## 7. Avatar and Agent Identity

### The user avatar — the artistic direction mandate

**The output must look like a very good portrait photograph taken in this product's visual world.** Not illustrated. Not 3D rendered. Not obviously AI-generated. The test: someone unfamiliar with AURA HQ looks at the avatar and thinks "that's a nice portrait" — not "that's an AI image."

**Lighting:** Single warm key light, approximately 10 o'clock position. Very subtle fill from opposite side, slightly cooler. Directionality: above and slightly forward. The result: warmth, presence, and facial dimension without harshness.

**Background:** Original photo background removed. Replaced with the product's deep warm background tone — Warm Parchment to Deep Warm Charcoal soft gradient, lightest immediately behind the face.

**Color:** Pushed slightly warm — the Amber Cognac family — without becoming tinted or filtered. Skin tones preserved accurately and embedded within the product's warmth. Effect: "this person, in better light" — not "this person, filtered."

---

### Agent visual identity — domain signatures

Agents are not people. They do not have portrait-style images. Each domain has a **visual signature** — a precisely rendered abstract composition using the product's color system.

| Domain | Visual character | Color primary | Form quality |
|---|---|---|---|
| Work | Architectural structure | Deep Warm Charcoal + Warm Stone | Fine horizontal/vertical lines — precision, plan, structure |
| Finance | Numerical precision | Amber Cognac + Pale Gold | Fine concentric arcs — scale, proportion, exactness |
| Health | Organic rhythm | Antique Rose Copper + Warm Stone | Soft warm curves — breath, pulse, living cycle |
| Creative | Emergent form | Full palette, warm-led | Geometric and organic elements in relation — potential and process |
| Learning | Layered depth | Antique Ivory + Warm Stone | Overlapping translucent planes — accumulation and depth |
| Personal | Radial warmth | Amber Cognac radiating | Warm center, expanding outward — presence, self-possession |

**The critical distinction:** Principal = portrait (a person). Agents = abstract compositions (domain characters). This distinction is preserved absolutely. No agent ever has a portrait-style image. The visual hierarchy — person at top, intelligences below — is communicated through visual language before it is read in the structure.

**How personality exists without silliness:**
The way to make something feel alive is not to make it look like a living thing. It is to make it feel like it was made by someone alive, for someone alive. Each agent's visual signature is so specific — so clearly made for that domain — that it communicates character without anthropomorphizing. Precision is the personality.

---

## 8. Visual Risks

### Risk 1: The warm palette tipping into Pinterest journal

The warmth of this system occupies color territory also inhabited by lifestyle content, journaling apps, and self-help brands. One wrong execution and AURA HQ reads as a Notion template, not a premium AI platform.

**What produces this failure:** warm colors at high saturation, organic textures (wood grain, watercolor), soft curved shapes, lifestyle photography references.

**What prevents it:** warmth always coexisting with structural precision. Amber Cognac appears on a precisely defined node ring, not on a soft blob. The Warm Parchment surface has fine grain, not wood grain. Shape language is decided and consistent, not casual.

---

### Risk 2: The serif typeface reading as lifestyle brand

Editorial serifs are used by luxury fashion and aspirational wellness. Without counterbalance, AURA HQ could read as an image product rather than an intelligent one.

**What produces this failure:** using the serif too broadly, pairing it with excessive white space, allowing editorial quality to become decorative.

**What prevents it:** serif reserved for structural authority only. All operational copy uses humanist sans. The product looks like a product designed by someone who understands publication-quality type — not like a publication.

---

### Risk 3: The avatar looking like a Lensa filter

Lensa-style outputs — plastic skin, dramatic fantasy lighting, stylized AI perfection — are recognizable immediately and communicate "consumer toy, not premium product."

**What produces this failure:** any artistic style directive pushing toward illustration, painting, fantasy, or AI aesthetic conventions. Oversaturated warm skin tones. Loss of actual features in favor of "beautiful AI version."

**What prevents it:** the mandate is photography, not painting. Every quality decision returns to one test: does this look like a nice portrait photograph, or does it look like an AI-generated image?

---

### Risk 4: Premium through emptiness

Extreme whitespace and minimal elements as a signal of sophistication — resulting in an interface that feels incomplete rather than considered.

**What produces this failure:** HQ with two nodes floating in vast space, workspaces where the capability strip is the only element, typography large and sparse as a default.

**What prevents it:** density that is earned. The HQ contains the full structure with visual weight filling space intentionally. Workspaces accumulate cards. Capability strips have context. The product is not trying to look minimal — it is trying to look precise.

---

### Risk 5: The glow becoming an AI cliché

Blue-purple glow, gradient orbs, pulsing light animations, and sparkle effects are the current visual convention of "AI product." They are used by every LLM interface built in the last two years.

**What produces this failure:** any blue or purple tone, gradient orbs in backgrounds, pulsing animations near AI-generated content.

**What prevents it:** the strict no-blue rule and the strict two-element-only glow rule. The product's intelligence is expressed through the quality of its outputs — not through visual effects announcing that intelligence is happening.

---

## 9. Final Recommendation — Composed Luminance

### One-sentence brief

A product that feels like a space of directed, warm light — designed for one person specifically, expressed through the quality of materials, the precision of structure, and the warmth of the light that makes everything visible.

### Full specification summary

**Color:**
Warm Parchment `#F2EDE4` · Deep Warm Charcoal `#1A1612` · Antique Ivory `#EDE5D3` · Luminous Warm White `#F8F4EE` · Warm Stone `#8A7E72` · Amber Cognac `#C4893A` · Pale Gold `#D4A85A` · Antique Rose Copper `#B87B6A` · Soft Sage Warm `#7D8A7A`

**Typography:**
Display — Lyon Text or Canela (editorial serif, structural authority moments only)
Operational — Söhne or Untitled Sans (humanist sans, all interface copy)

**Shape:**
Corner radius `10px` base. Circular frame for Principal avatar only. All structural elements in softened rectangles. Shadow-based elevation with warm amber tint. No borders.

**Motion:**
Custom ease: 3% ease-in, 60% ease-out. Avatar reveal: 6–8 seconds, four-phase development metaphor. Structure assembly: hierarchical stagger, 2.5 seconds total. Screen transitions: warm cross-dissolve. Hover: luminosity increase only, 120ms.

**Materials:**
Fine vellum grain on all ground surfaces. Oxidized brass quality in amber accent elements. Warm frosted amber for focus states. No glassmorphism. No neumorphism.

**Avatar:**
Editorial portrait quality. Warm key light, 10 o'clock. Product background behind subject. Warm color treatment preserving accuracy. Passes the "nice portrait photo" test.

**Agent identity:**
Domain-specific abstract compositions. Precisely rendered, non-representational, character-driven. No portraits, no icons, no illustrations. Precision is the personality.

---

## 10. Alternate Directions

### Alternate A — "Warm Architecture"

A harder, more structural version of the primary direction. Warmth subordinated to geometric precision.

**What changes:**
- Base surface: aged concrete warm tone, approximately `#DDD4C4` — slightly cooler, heavier
- Typography: high-quality grotesque replacing the serif entirely — Graphik or ABC Diatype
- Corner radius drops to `4px` — more decisively rectangular
- HQ structure becomes more rigorously grid-based, precise isometric-adjacent hierarchy
- Motion becomes slightly faster and more decisive — less breath, more placement

**Emotional register:** More decisive, more explicitly structural, slightly less warm. The product of someone who thinks in systems. Appropriate if the target user skews heavily toward founders and operators rather than creatives.

**Risk:** Can tip toward cold enterprise without precision maintenance. Warmth must be earned through material quality and typography, not through color quantity.

---

### Alternate B — "Studio Light"

A lighter, more luminous version of the primary direction. The product lives closer to white, warmth expressed through light quality rather than surface color.

**What changes:**
- Base surface: `#F8F4EF` — very close to white, unmistakably warm
- Amber Cognac accent becomes more prominent — it is the primary warmth source against a lighter base
- Agent visual signatures become more open — more space around each composition
- HQ background uses a very soft warm gradient (lightest at center, slightly warmer at edges) — a lit studio quality
- Motion becomes slightly more luminous in its reveals — dissolves use a brief increase in white light

**Emotional register:** More luminous, lighter, more immediately inviting. Slightly more accessible as a first impression. Standing in good studio light — directed, warm, precise. Appropriate if research shows the primary emotional barrier for new users is intimidation rather than triviality.

**Risk:** Can tip toward generic premium minimalism of current SaaS products. The amber accent must work harder to carry the premium signal. Quality of every surface must be held more rigorously than in the primary direction.

---

*Previous: [04 — Tightened Product System ←](../product/04-tightened-product-system.md)*
