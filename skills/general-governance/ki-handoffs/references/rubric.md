<!-- GENERATED FILE: edit scripts/rubric/items/, not this publication. -->

# Generated rubric — Knowledge Islands handoff readiness

> **Generated publication.** The TypeScript rubric items under `scripts/rubric/items/` are canonical. Edit those definitions, then rerun `scripts/rubric/publish.ts`.

## Contents

- [HAND — Handoff readiness](#hand--handoff-readiness)

## HAND — Handoff readiness

→ [standard](standards.md#the-opt-in-marker-contract)

The opt-in marker contract and delegation-readiness doctrine.

- **HAND-1 [M] — Semantic tier marker** — An artifact with handoff: true carries a tier field whose value is one of haiku / sonnet / opus (the opt-in marker contract). Missing or out-of-set → FAIL. (standards.md#the-opt-in-marker-contract)
- **HAND-2 [M] — Decisions locked versus escalate** — An artifact with handoff: true has a body section whose heading matches decisions, and that section names both locked and escalate (the opt-in marker contract; the quality bar's “Decisions resolved”). Missing section or either label → FAIL. (standards.md#the-opt-in-marker-contract, standards.md#the-quality-bar)
- **HAND-3 [M] — Readiness marker** — An artifact with handoff: true carries a readiness marker: a readiness: frontmatter field, a ## Readiness heading, or a Readiness test checkbox (the readiness test). Missing → WARN. (standards.md#the-opt-in-marker-contract, standards.md#the-readiness-test)
- **HAND-4 [J] — Locked decisions are closed** — The locked decisions are genuinely closed: no residual reasoning, hedging, or open questions parked under “locked” (the reasoning-layer split; quality bar “Decisions resolved”). (standards.md#the-reasoning-layer-split, standards.md#the-quality-bar)
  - _Review prompt:_ The locked decisions are genuinely closed: no residual reasoning, hedging, or open questions parked under “locked” (the reasoning-layer split; quality bar “Decisions resolved”).
- **HAND-5 [J] — Definition of done** — Each unit carries a definition-of-done that is a pass/fail acceptance test, not a goal (quality bar “Definition-of-done”). (standards.md#the-quality-bar)
  - _Review prompt:_ Each unit carries a definition-of-done that is a pass/fail acceptance test, not a goal (quality bar “Definition-of-done”).
- **HAND-6 [J] — Appropriate assigned tier** — The assigned tier is appropriate to how concrete the steps are: mechanical work at the cheap class, spec-driven drafting at the mid class, hard judgement at the top class; a unit that could only run at the planning tier signals under-decomposed reasoning (tier assignment). (standards.md#tier-assignment)
  - _Review prompt:_ The assigned tier is appropriate to how concrete the steps are: mechanical work at the cheap class, spec-driven drafting at the mid class, hard judgement at the top class; a unit that could only run at the planning tier signals under-decomposed reasoning (tier assignment).
- **HAND-7 [J] — Cold-agent readiness** — The readiness test would actually pass: a cold agent at the assigned tier could execute the first phase from the spec alone (the readiness test). (standards.md#the-readiness-test)
  - _Review prompt:_ The readiness test would actually pass: a cold agent at the assigned tier could execute the first phase from the spec alone (the readiness test).
- **HAND-8 [J] — Tokenomics composition boundary** — Cost and tier-selection reasoning are not restated here but deferred to ki-tokenomics; no model ids or prices are hard-coded on the artifact (composition boundary). (standards.md#tier-assignment)
  - _Review prompt:_ Cost and tier-selection reasoning are not restated here but deferred to `ki-tokenomics`; no model ids or prices are hard-coded on the artifact (composition boundary).
