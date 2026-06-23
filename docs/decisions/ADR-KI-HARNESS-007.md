# ADR-KI-HARNESS-007: Dependency order for multi-skill composition

**Status:** Superseded by ADR-KI-HARNESS-009

**Date:** 2024-01-01

## Context

When auditing a repo that multiple governance skills apply to, the skills must be applied in some order. A skill that composes on a sibling
(e.g. `knowledgeislands-mcp` composes on `knowledgeislands-engineering`) produces more accurate results if the base has already been judged.
Without a canonical order, different callers would apply skills in different sequences, producing inconsistent results and risking context
overflow when all skill files are loaded simultaneously.

## Decision

When walking a set of skills serially in a single agent context, apply them in **dependency order**, foundations first:

```text
authoring → engineering → repo → kb → streams → mcp → 11ty-websites → cloudflare-hosting → agents → skills → tokenomics → harness
```

`harness` is last because it composes on the skills and agents linters and the engineering toolchain. Load and release one skill at a time
to keep peak context at one skill, not the full set — this is what prevents a mid-audit compaction.

## Consequences

- A composing skill's base is judged before the skill itself is reached.
- Peak context stays bounded at one skill file plus the target's artifacts.
- Serial execution means the set audit takes time proportional to the number of skills.

**Note:** This serial walk was the initial standard. It has been superseded by ADR-KI-HARNESS-009 (subagent isolation), which preserves the
dependency-order priority in the synthesis phase while parallelising execution. The dependency order itself remains canonical — it
determines synthesis ranking, not execution order.

## References

- [skills/knowledgeislands-skills/SKILL.md](../../skills/knowledgeislands-skills/SKILL.md) — Mode AUDIT, set-audit discipline.
- [skills/knowledgeislands-engineering/references/enforcement-framework.md](../../skills/knowledgeislands-engineering/references/enforcement-framework.md)
  §5 AUDIT — "Auditing a set … bounds its own context".
- ADR-KI-HARNESS-009 — the superseding decision.
