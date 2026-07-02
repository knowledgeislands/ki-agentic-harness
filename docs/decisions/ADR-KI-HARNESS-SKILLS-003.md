# ADR-KI-HARNESS-SKILLS-003: Dependency order for multi-skill composition

**Status:** Accepted

**Mutability:** open

**Date:** 2024-01-01

## Context

When auditing a repo that multiple governance skills apply to, the skills must be applied in some order. A skill that composes on a sibling (e.g. `ki-mcp` composes on `ki-engineering`) produces more accurate results if the base has already been judged. Without a canonical order, different callers would apply skills in different sequences, producing inconsistent results and risking context overflow when all skill files are loaded simultaneously.

## Decision

When walking a set of skills serially in a single agent context, apply them in **dependency order**, foundations first:

```text
authoring → engineering → repo → kb → streams → mcp → 11ty-websites → cloudflare-hosting → agents → skills → tokenomics → harness
```

`harness` is last because it composes on the skills and agents linters and the engineering toolchain. Load and release one skill at a time to keep peak context at one skill, not the full set — this is what prevents a mid-audit compaction.

## Consequences

- A composing skill's base is judged before the skill itself is reached.
- In a serial walk, execution time scales with the number of skills; in parallel invocations (ADR-KI-HARNESS-AGENTS-001), this order governs synthesis ranking, not execution order.

## References

- [skills/ki-skills/SKILL.md](../../skills/ki-skills/SKILL.md) — Mode AUDIT, set-audit discipline.
- [skills/ki-engineering/references/enforcement-framework.md](../../skills/ki-engineering/references/enforcement-framework.md) §5 AUDIT — "Auditing a set … bounds its own context".
- [ADR-KI-HARNESS-AGENTS-001](ADR-KI-HARNESS-AGENTS-001.md) — uses this dependency order as synthesis-ranking priority when parallelising multi-skill execution.

## Changelog

- 2026-07-02 — added the `**Mutability:**` marker (open); made the AGENTS-001 reference a relative link.
