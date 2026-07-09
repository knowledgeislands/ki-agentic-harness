# ADR-KI-HARNESS-001: Composition over extension

**Date:** 2024-01-01

## Context

Knowledge Islands needed a way to let skills relate to each other without coupling. Two approaches were considered: base-coupled extension (a `<base>-kb` skill that inherits another skill's modes and overrides them) and composition (a skill runs a sibling's checker/mode in sequence and declares what delta it adds). Extension produces tight coupling — a base skill change forces every derived skill to track the change, and a derived skill cannot be installed without its base. It also introduces naming collisions when the same governance mode is exposed by both base and derived skills.

## Decision

Skills relate to one another exclusively through **composition**: a skill runs a sibling's checker or mode as a step in its own mode and adds its own delta. The edge is declared explicitly in the composing skill's AUDIT mode. What a base or repo needs differently from the standard is **declared, not forked** — data in the repo's `.ki-config.toml` table, prose in its `CLAUDE.md` — never a `<base>-*` skill that takes the shared modes. There is no inheritance, no import, no base-coupled extension.

## Consequences

- Any skill is valid installed standalone — it needs no sibling present to run.
- Adding or changing a skill does not force changes in skills that happen to compose with it.
- Composition is explicit and auditable: the AUDIT mode names its siblings.
- Per-repo variance is visible in `.ki-config.toml` and `CLAUDE.md`, not hidden in a derived skill's override.
- The SHAPE-2 criterion in the `ki-skills` rubric enforces this rule mechanically.

## References

- [docs/skill-design.md](../guides/user-guide/skill-design.md) §Principles — the Composition-only principle (SHAPE-2).
- [skills/ki-engineering/references/enforcement-framework.md](../../skills/ki-engineering/references/enforcement-framework.md) §6 — "Standard, not base-coupled extension (SHAPE-2)".
