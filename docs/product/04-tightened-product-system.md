# Tightened Product System

**Phase 4 of AURA HQ — Removing bloat, enforcing buildability, making every decision explicit**

> The previous blueprint was correct in direction but inflated in places. This phase cuts what was decorative depth, resolves what was left ambiguous, and produces a system precise enough to take directly into engineering planning.

---

## Table of Contents

1. [What Gets Cut](#1-what-gets-cut)
2. [Refined Product Backbone](#2-refined-product-backbone)
3. [Sharper MVP Definition](#3-sharper-mvp-definition)
4. [Cleaner Interaction Model](#4-cleaner-interaction-model)
5. [The 5 Most Important Product Decisions](#5-the-5-most-important-product-decisions)
6. [The 5 Biggest System Risks](#6-the-5-biggest-system-risks)

---

## 1. What Gets Cut

The previous blueprint had seven core objects where four will do. It listed eight domain types without specifying what "distinct capability profiles" means in code. It described memory as three structural layers without acknowledging that real persistent memory across LLM sessions is an engineering problem, not a UX pattern. It proposed "weekly synthesis" as a retention hook without defining how it is triggered or how it avoids becoming ignored noise.

| Removed | Why |
|---|---|
| "Goal Threads" as a core system object | A useful workspace feature, not a system-level object. Premature elevation. |
| "Agent Memory" as a peer object | Memory is a property of an agent, not a standalone entity. |
| "Capabilities" as a peer object | A property of a domain. Exists only in relation to an agent. |
| "Domain" as a peer object | An agent attribute. Does not stand alone. |
| Weekly synthesis as retention hook | Complex to do well; risks becoming ignored noise before trust is established |
| Eight domain types at launch | Three excellent domains > six mediocre ones |
| Memory panel as a separate surface (MVP) | A simple editable list inside the workspace is sufficient for first version |
| Freeform text as an alternative entry point | Test the capability model strictly before adding an escape hatch |

---

## 2. Refined Product Backbone

### The Four Core Objects

**Principal**
One person. The apex of the structure. Every other object exists in a defined relationship to them — beneath them, serving a purpose they stated. There is no team mode. There is no social layer. The singular constraint is not a limitation; it is the product's identity.

**Agent**
A named AI system with three fixed properties:

- **Domain** — a typed scope category that determines its capability set and memory schema. Not a label — a functional constraint. A Finance agent and a Work agent behave differently because their domain determines different capabilities, different memory categories, and different output formats.
- **Purpose** — one sentence written by the user at creation. Stored permanently. Visible in the workspace at all times. Required — an agent without a purpose statement cannot be created.
- **Memory store** — a structured record of: seeded input (facts, documents, goals provided at creation) and retained facts (domain-relevant information extracted from interactions and explicitly confirmed by the user). Not a chat log. A user-controlled knowledge base scoped to one domain.

**HQ**
The spatial hierarchy. Its job: show the Principal at the top and communicate the state of all agents without requiring navigation.

Agent states:
- **Active** — used in the last 7 days
- **Quiet** — 8 to 30 days since last use
- **Dormant** — 30+ days since last use
- **Incomplete** — created but never used

Each state has a distinct visual treatment. The HQ is useful because it shows what is alive and what is neglected — not because it is beautiful.

**Workspace**
The per-agent interaction surface. A focused environment with a defined capability set, persistent output cards, and visible access to the agent's memory and purpose. Every workspace is visibly different by domain because every domain has a different capability set. The difference must be real and immediately apparent — not a label swap.

---

### The Main Unit of Value — Stated Precisely

**An agent that produces better output today than it did 30 days ago, because of what it has retained.**

Not the HQ. Not the avatar. Not the structure. The value is demonstrated improvement over time within a specific domain the user cares about. If the product cannot prove that claim by day 30 for an engaged first-time user, nothing else matters.

---

### Key Moments of Value

| Moment | What it must prove |
|---|---|
| Avatar reveal | I am at the center of something that was designed for me |
| First capable agent output | This is better than generic AI because it knows my situation |
| Return to HQ (day 7) | The structure tells me something I did not already know |
| Memory surfacing (day 30) | The agent remembered something I said weeks ago and used it |
| Second agent creation | I am building an infrastructure, not just using a tool |

---

## 3. Sharper MVP Definition

### The Honest Constraint

A real MVP for AURA HQ is not a stripped-down version of the full vision. It is the smallest system that can prove the core claim: *an agent that knows your domain gets more useful over time.*

Everything in MVP is chosen because it directly tests or enables that claim. Everything else is deferred.

### What Ships in MVP

**Avatar generation — full investment, non-negotiable quality bar**

**Three domain types only: Work, Health, Finance**
The three highest-frequency life domains across the widest demographic. Three fully-built domains beat six partially-built ones. Domains four through six are added after the first three are proven.

**HQ view**
Up to five agent nodes. Four visual states. One ambient status line beneath the Principal: one sentence, specific and actionable. No navigation elements competing with the spatial hierarchy.

**Agent creation — mandatory minimum seeding**
Domain → Name → Purpose (required) → Seeding (three domain-specific questions, answers required before creation completes). An agent with zero seeded context cannot be created. The system states why: *"Your agent needs to know your situation before it can help with it."* Upload is optional on top of the three questions.

**Three capabilities per domain**

| Domain | Capabilities |
|---|---|
| Work | Draft · Review · Research |
| Finance | Analyze · Track · Advise |
| Health | Log · Reflect · Research |

**Structured memory — two layers**
- Seeded input (stored at creation, user-editable)
- Retained facts (extracted during interactions, user-confirmed before storage, deletable at any time)

The user sees all stored memory as a simple list inside the workspace. Every item shows: what the fact is, when it was added, and a delete button. No hidden storage.

**Return experience**
On every return to HQ, agents surface one line of specific status beneath their node — not a generic activity indicator but something actionable: *"Goal: reduce Q2 expenses — 2 weeks without update"* or *"3 outputs from your last session, 1 saved to memory."*

**Flat monthly subscription, 14-day free trial**
No usage metering. No free tier with limited agents. Premium entry, honest trial, clear renewal value.

---

### What Does Not Ship in MVP

| Excluded | Reason |
|---|---|
| Weekly synthesis | Complex; risks becoming noise before trust is established |
| Memory panel as a separate surface | Simple list inside workspace is sufficient |
| Agent discovery / templates | Creates breadth expectation before depth is proven |
| Domains 4–6 | Build depth first, breadth second |
| Freeform text override | Test capability model strictly; add escape hatch only if data shows net friction |
| Sharing or social features | Dilutes singular-Principal premise |
| Mobile app | Validate spatial layout on web before compressing it |
| Avatar evolution or milestones | Core agent utility must be proven first |

---

### What MVP Must Prove

Four hypotheses. The data from the first 90 days answers them or refocuses the roadmap.

1. Do users return to the HQ, or do they navigate past it directly to agents?
2. Do seeded agents produce noticeably better output than unseeded agents?
3. Does the capability strip reduce prompt anxiety or create frustration?
4. Does memory surfacing change how users perceive the agent's value?

---

## 4. Cleaner Interaction Model

### The Problem with the Previous Model

The previous model was right in direction but inconsistent. It said "do not default to chat" then described conversational moments indistinguishable from chat. It proposed capability strips but did not specify what happens with freeform input. It described output cards without defining their anatomy across different capability types.

This pass makes the model internally consistent and technically specified.

---

### How Interaction Works

**Entry: capability selection**

The workspace opens to a three-item capability strip. The user selects one. This opens a focused panel with:

- A single, specific prompt scoped to that capability (one or two sentences)
- A text input field
- Relevant memory items surfaced from the agent's stored context (shown read-only beneath the input)

The user responds to a specific prompt — not an open void. This reduces prompt anxiety and keeps agent outputs within a defined scope.

**Freeform input in MVP: not supported**

If a user types into the workspace outside of a capability panel: *"Select an action above to get started."* This is strict but testable. If data shows net friction from this constraint, a lightweight "Ask" capability is added as a fourth option in the next iteration.

**Output: cards with fixed anatomy**

Every agent output is a persistent card with:

- **Label** — capability used
- **Context line** — the user's input summarized in one line
- **Output** — agent's response, formatted for the capability type
- **Save to memory** — one button; saves one confirmed fact to the agent's memory store
- **Refine** — one button; reopens the capability panel with previous input pre-loaded

Cards persist. They do not disappear when the session ends. The workspace accumulates cards as a record of work — not as a chat history. A card from three months ago is still present. A chat message from three months ago is gone.

**The critical distinction:** In a chat product, the session is the artifact. In AURA HQ, the card is the artifact. The session produces cards. Cards outlive sessions. This must be enforced in every engineering and design decision.

---

### What the Interaction Model Is Not

- A chat thread with UI elements placed around it
- A form-based tool that happens to use AI
- A GPT wrapper with a custom system prompt and a prettier interface

**The test for every interaction decision:** Does this make the agent feel like a specialized collaborator, or does it make it feel like a renamed chat window?

---

## 5. The 5 Most Important Product Decisions

These cannot be deferred, reversed cheaply, or made by default. Each has downstream consequences for every other part of the system.

---

### Decision 1: Is memory explicit or implicit?

**Explicit** — the user sees everything stored, confirms what gets saved, can delete any item. Trust through transparency. More friction, much higher trust ceiling.

**Implicit** — the agent retains context automatically. Lower friction. When it gets something wrong, there is nowhere to point.

**Decision: explicit memory.**

AURA HQ's premise is that the user is the principal and the agent is subordinate. A subordinate that stores information without your knowledge or consent inverts that relationship. The confirmation friction is the product's integrity cost — worth paying.

---

### Decision 2: How many domains, and what does "distinct" mean in code?

"Distinct capability profile" must mean something technically real — different memory schemas, different output formats, different domain-specific prompting logic. If the only difference between a Work agent and a Finance agent is the system prompt header, the domain model is cosmetic.

**Decision: three domains at MVP, built to full depth.**

Before shipping, a mandatory QA test: give the same underlying question to a Work agent and a Finance agent. If the outputs are structurally similar, the differentiation is not real. This test runs before any user sees the product.

---

### Decision 3: Is the avatar a one-time event or an ongoing identity element?

**One-time** — generated at onboarding, remains static. High-investment moment, no ongoing cost.

**Ongoing** — regenerable, evolves with milestones, has visual states.

**Decision: one-time for MVP, with one explicit expansion path built into the generation model.**

The generation model must have enough range that a user who regenerates gets a genuinely different result — not a re-run. Build a graceful fallback style for inputs that do not render well in the primary style. Do not build avatar evolution until core agent utility is proven.

---

### Decision 4: Does the capability strip accept or reject freeform input?

Rejecting is a strong product statement: this is not a chat product. Accepting with graceful routing is more usable but softer.

**Decision: reject freeform input in MVP, strictly.**

Test whether users adapt or leave. Both outcomes are informative. Adapting users validate the capability model. Users who leave identify the friction ceiling. Adding freeform input later is easy. Removing it after users are habituated to it is very hard.

---

### Decision 5: What is the pricing model?

**Decision: flat monthly subscription (~$20–30/month), 14-day free trial.**

This simplifies engineering (no usage metering), aligns with premium positioning, and forces the product to earn renewal monthly — which is the correct discipline. The monthly renewal pressure is a feature: it prevents the team from building things that are beautiful but not valuable.

---

## 6. The 5 Biggest System Risks

### Risk 1: Memory that performs like memory but isn't

If memory is implemented as a long context window stuffed with conversation history, it will feel contextual early and degrade as the window fills. The most engaged users — the ones the product needs most — will notice.

Real persistent memory requires: structured extraction of domain-relevant facts, user confirmation before storage, a retrieval mechanism that surfaces relevant stored facts at the start of each capability call, and a domain-specific schema defining what each agent type stores.

**Mitigation:** Build the memory mechanism before building the memory UI. Do not show users a memory panel until the system can reliably retrieve relevant stored facts in agent outputs. If engineering is not ready, launch with seeded context only and call it what it is.

---

### Risk 2: The HQ becoming a navigation menu

By session three, most users will have a dominant agent. They will navigate directly to its workspace on launch. Within two weeks, the HQ is something they pass through, not a surface they read.

**Mitigation:** The HQ must deliver at least one piece of information the user cannot get by going directly to their agent. The ambient status line must be specific and actionable — not "Your Work agent is active" but "Your Finance agent has an unresolved item from 3 days ago." If the HQ cannot consistently deliver that, it is a navigation menu and should be designed as one rather than pretending otherwise.

---

### Risk 3: Domain differentiation being cosmetic

If a Work agent and a Finance agent feel identical except for the node color, the organizational structure is exposed as visual fiction. Experienced users will recognize this in the first week. It will destroy the product's credibility at the exact moment users are deciding whether it is worth the subscription.

**Mitigation:** Domain differentiation must be specified at four levels before shipping: system prompt logic, memory schema, capability labels, and output format. The QA test described in Decision 2 must pass before launch.

---

### Risk 4: The avatar quality floor being too low

AI image generation has inherent variance. Some faces render well in a given style. Some do not. A user who receives a poor avatar result after the product's onboarding promises a portrait that represents how they "appear in their world" will not forgive it — and they will not be quiet about it.

**Mitigation:** Three requirements before shipping.
1. Test the generation model across diverse face types, ages, and photo qualities — not just clean, well-lit portraits.
2. Build one-click regeneration that produces a genuinely different result (not a re-run).
3. Build a simplified fallback style that works reliably across all inputs. Not the preferred experience — but it exists.

---

### Risk 5: The behavioral ask exceeding user willingness

AURA HQ asks users to: adopt capability selection instead of open input, seed agents before use, confirm memory storage, and return to an HQ view rather than going directly to work. That is a significant ask from someone currently typing into ChatGPT for free.

The product's quality must justify that ask in the first interaction. Not "better than most AI tools" — "noticeably better than what I was using for free, in the first session, on the first capability."

**Mitigation:** The seeding questions are the mechanism that makes the first interaction better. They must extract genuinely differentiating context — specific, domain-relevant facts that change output quality, not surface-level preferences. The seeding questions are a product design problem. They determine whether the behavioral ask is justified or not. They should be designed, tested, and refined before the rest of the product is built around them.

---

*Previous: [03 — Product Blueprint ←](03-product-blueprint.md)*
