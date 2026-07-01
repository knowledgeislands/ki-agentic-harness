# ADR-KI-HARNESS-SKILLS-001: AUDIT/CONFORM/REFRESH canonical modes

**Status:** Accepted

**Date:** 2024-01-01

## Context

Each governance skill needed a consistent operating vocabulary — a caller asking a skill to "check" something, versus "fix" something, versus "keep it current" was getting different command names across skills, making the set hard to compose and hard to learn. Skills also had skill-specific modes that had no stable naming or ordering convention.

## Decision

Every governance skill exposes the universal three modes — **AUDIT**, **CONFORM**, **REFRESH** — using exactly those names, in alphabetical order. A skill may add skill-specific modes (e.g. INIT, OPTIMISE, operational note modes) but must expose the universal three first.

- **AUDIT** — run the checker, capture its output verbatim, then apply judgment criteria; report by location → criterion → fix.
- **CONFORM** — run AUDIT to get the fix list, then apply the fixes in place, then re-run AUDIT until clean.
- **REFRESH** — re-anchor the standard to its sources on the skill's declared cadence.

The SHAPE-5 criterion in the skills rubric enforces that every governance skill exposes this shape.

## Consequences

- A caller can invoke any governance skill with the same three top-level commands.
- Composition is predictable: one skill calls another's AUDIT as a named step.
- Skill-specific modes extend the vocabulary without replacing it; the universal three are always present.
- INIT and OPTIMISE are accepted as standard optional extensions for scaffolding and optimisation passes.

## References

- [skills/ki-engineering/references/enforcement-framework.md](../../skills/ki-engineering/references/enforcement-framework.md) §5 — the modes in full.
- [docs/design.md](../design.md) §Principles — "One governance-mode model (SHAPE-5)".
