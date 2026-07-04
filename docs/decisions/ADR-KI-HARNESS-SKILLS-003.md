# ADR-KI-HARNESS-SKILLS-003: Dependency order for multi-skill composition

**Status:** Accepted

**Mutability:** open

**Date:** 2024-01-01

## Context

When auditing a repo that multiple governance skills apply to, the skills must be applied in some order. A skill that composes on a sibling (e.g. `ki-mcp` composes on `ki-engineering`) produces more accurate results if the base has already been judged. Without a canonical order, different callers would apply skills in different sequences, producing inconsistent results and risking context overflow when all skill files are loaded simultaneously.

## Decision

When walking a set of skills serially in a single agent context, apply them in **dependency order**, foundations first:

```text
authoring → engineering → repo → decision-records → kb → streams → activities → live-artifacts → mcp → 11ty-websites → cloudflare-hosting → plans → agents → skills → tokenomics → handoffs → harness → bootstrap
```

`bootstrap` is last because it is the install keystone that wires every other skill into a repo, so it composes on `repo`, `engineering`, and `harness`; `harness` precedes it because it composes on the skills and agents linters and the engineering toolchain. The KB-zone skills cluster after `kb` (`streams` → `activities` → `live-artifacts`), `decision-records` sits after `repo` as the governance instrument that repos and bases both consume, and `handoffs` follows `tokenomics` (its model-tier basis). Load and release one skill at a time to keep peak context at one skill, not the full set — this is what prevents a mid-audit compaction.

## Consequences

- A composing skill's base is judged before the skill itself is reached.
- In a serial walk, execution time scales with the number of skills; in parallel invocations (ADR-KI-HARNESS-AGENTS-001), this order governs synthesis ranking, not execution order.

## References

- [skills/ki-skills/SKILL.md](../../skills/ki-skills/SKILL.md) — Mode AUDIT, set-audit discipline.
- [skills/ki-engineering/references/enforcement-framework.md](../../skills/ki-engineering/references/enforcement-framework.md) §5 AUDIT — "Auditing a set … bounds its own context".
- [ADR-KI-HARNESS-AGENTS-001](ADR-KI-HARNESS-AGENTS-001.md) — uses this dependency order as synthesis-ranking priority when parallelising multi-skill execution.

## Changelog

- 2026-07-02 — added the `**Mutability:**` marker (open); made the AGENTS-001 reference a relative link.
- 2026-07-04 — extended the dependency order from 12 to all 18 skills (added `decision-records`, `activities`, `live-artifacts`, `plans`, `handoffs`, `bootstrap`) and documented their placement rationale.
