# ADR-KI-HARNESS-SKILLS-005: The handoff doctrine is its own skill

**Date:** 2026-07-02

## Context

A reusable methodology recurs across bases: spend the top reasoning tier once to plan a body of work, then bank that reasoning as an implementation-ready spec a cheaper tier or a cold agent can execute without re-reasoning. Two existing skills own neighbouring concerns. `ki-plans` owns plan-before-execute and the plan quality bar (in a KB the equivalent is a `ki-kb-streams` proposal Checklist). `ki-tokenomics` owns model-tier cost and selection — `preferred_model`, the mode→tier table, standard §4/§8. Neither owns the connective concern: how to decompose and write work so a cheaper tier can execute it — decisions-locked-vs-escalate, a per-unit recommended tier, and a cold-model readiness test. The set's cardinal rule is composition, not duplication, so the question is whether this is a new skill or an extension of the two.

## Decision

The handoff doctrine is a **new, composition-shaped governance skill, `ki-handoffs`**. It owns _how to make work delegable across tiers_ and nothing else: the reasoning-layer split, the handoff-spec quality bar, the opt-in marker contract (`handoff: true`, `tier`, a decisions-locked-vs-escalate section, a readiness marker), and the cold-model readiness test. It owns no artifact of its own — the host artifact is a `ki-plans` plan in a code repo or a `ki-kb-streams` proposal Checklist in a KB, and `ki-handoffs` adds only the delegation-readiness delta. It refers tier cost and selection to `ki-tokenomics` and never restates the tier table or hard-codes a model id (tiers are named semantically; ids resolve via `claude-api`). The composition edges to `ki-plans`, `ki-kb-streams`, `ki-tokenomics`, and `ki-agents` are reciprocal off-ramps.

## Consequences

- The doctrine is discoverable as a named method (`is this ready to hand off`, `make this delegable`) rather than buried in another skill's quality bar.
- `ki-plans` and `ki-tokenomics` are unchanged; `ki-handoffs` composes on them at runtime by being run in sequence, per ADR-KI-HARNESS-SKILLS-004.
- A new opt-in artifact convention (`handoff: true`) is added; only artifacts that opt in are audited, so existing plans and proposals are unaffected.
- The skill slots into the canonical dependency order (ADR-KI-HARNESS-SKILLS-003) after `ki-plans` / `ki-tokenomics`, which it composes on.

## References

- [skills/ki-handoffs/SKILL.md](../../skills/ki-handoffs/SKILL.md) and [references/handoffs-standard.md](../../skills/ki-handoffs/references/handoffs-standard.md).
- [ADR-KI-HARNESS-SKILLS-004](ADR-KI-HARNESS-SKILLS-004.md) — composition by run-in-sequence, standalone validity.
- `ki-tokenomics` standard §4 (runtime levers — model tier) and §8 (multi-model flows) — the boundary this skill defers to.
