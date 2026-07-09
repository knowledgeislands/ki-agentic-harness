# ADR-KI-HARNESS-SKILLS-003: Dependency order for multi-skill composition

**Date:** 2026-06-23

## Context

When auditing a repo that multiple governance skills apply to, the skills must be applied in some order. A skill that composes on a sibling (e.g. `ki-mcp` composes on `ki-engineering`) produces more accurate results if the base has already been judged. Without a canonical order, different callers would apply skills in different sequences, producing inconsistent results and risking context overflow when all skill files are loaded simultaneously.

## Decision

When walking a set of skills serially in a single agent context, apply them in **dependency order**, foundations first:

```text
authoring → engineering → repo → decision-records → housekeeping → kb → streams → activities → live-artifacts → mcp → website → website-cloudflare → plans → agents → skills → tokenomics → handoffs → harness → bootstrap
```

`bootstrap` is last because it is the install keystone that wires every other skill into a repo, so it composes on `repo`, `engineering`, and `harness`; `harness` precedes it because it composes on the skills and agents linters and the engineering toolchain. The KB-zone skills cluster after `kb` (`streams` → `activities` → `live-artifacts`), `decision-records` and `memory` sit after `repo` as the governance instruments over repo-external artifacts that repos and bases both consume, and `handoffs` follows `tokenomics` (its model-tier basis). Load and release one skill at a time to keep peak context at one skill, not the full set — this is what prevents a mid-audit compaction.

### Naming grammar

Skill names follow the grammar **`ki-<concern>[-<technology>]`**. The set has three name classes, all conforming to it: **artifact-type** names govern a kind of thing (`ki-repo`, `ki-skills`, `ki-agents`, `ki-mcp`, `ki-harness`, `ki-plans`, `ki-decision-records`, `ki-housekeeping`); **doctrine/family** names govern a practice or a family with members (`ki-authoring`, `ki-engineering`, `ki-tokenomics`, `ki-handoffs`, `ki-bootstrap`, the `ki-kb-*` family with its `<family>-<member>` shape); **stack-specific standards** realise a concern in a named technology, with the concern leading and the technology qualifier last, so that replacing the stack is a suffix edit and siblings sort by concern. Applying the rule to the one class that predated it renames `ki-11ty-websites` → **`ki-website`** and `ki-cloudflare-hosting` → **`ki-website-cloudflare`** (executed by plan 006; the order above is refreshed to the post-rename names, plus the missing `memory`, by plan 004). Considered and declined: `ki-tokenomics` → `ki-tiering` (routability is cheaper to fix by sharpening the plans/handoffs/tokenomics descriptions); `ki-housekeeping` → `ki-housekeeping-claude` (a qualifier earns its place only when a second memory system exists); any rename of `ki-authoring` (the most-referenced off-ramp — worst cost-benefit). Future stack-specific skills take the same shape (a hosting standard on another provider would be `ki-hosting-<provider>`). Historical records keep old names; only live surfaces are swept.

## Consequences

- A composing skill's base is judged before the skill itself is reached.
- In a serial walk, execution time scales with the number of skills; in parallel invocations (ADR-KI-HARNESS-AGENTS-001), this order governs synthesis ranking, not execution order.

## References

- The `ki-skills` skill — Mode AUDIT, set-audit discipline.
- The `ki-engineering` enforcement framework, §5 AUDIT — "Auditing a set … bounds its own context".
- ADR-KI-HARNESS-AGENTS-001, later in the reading order, uses this dependency order as synthesis-ranking priority when parallelising multi-skill execution.
