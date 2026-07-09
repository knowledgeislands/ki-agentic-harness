# ADR-KI-HARNESS-SKILLS-001: AUDIT/CONFORM/INIT/REFRESH canonical modes

**Date:** 2024-01-01

## Context

Each governance skill needed a consistent operating vocabulary — a caller asking a skill to "check" something, versus "fix" something, versus "keep it current" was getting different command names across skills, making the set hard to compose and hard to learn. Skills also had skill-specific modes that had no stable naming or ordering convention.

## Decision

Every governance skill exposes the universal four modes — **AUDIT**, **CONFORM**, **INIT**, **REFRESH** — using exactly those names, in alphabetical order. A skill may add skill-specific modes (e.g. OPTIMISE, operational note modes) but must expose the universal four first.

- **AUDIT** — run the checker, capture its output verbatim, then apply judgment criteria; report by location → criterion → fix.
- **CONFORM** — run AUDIT to get the fix list, then apply the fixes in place, then re-run AUDIT until clean.
- **INIT** — scaffold a new conformant artifact, or bring an off-standard one onto the floor from scratch. Its mechanical half is a per-skill `scripts/bootstrap.ts` (the INIT counterpart to `audit-*.ts`) that runs from the remote source with no skill installed, declares and triggers the skills the frontmatter `implies:`, and satisfies the self-sufficiency contract (vendored scripts, per-skill and repo-wide `ki:*` keys).
- **REFRESH** — re-anchor the standard to its sources on the skill's declared cadence.

The SHAPE-5 criterion in the skills rubric enforces that every governance skill exposes this shape.

## Consequences

- A caller can invoke any governance skill with the same four top-level commands.
- Composition is predictable: one skill calls another's AUDIT as a named step; INIT starts the bootstrap chain and pulls the skills it implies.
- Skill-specific modes extend the vocabulary without replacing it; the universal four are always present.
- OPTIMISE remains an accepted optional extension for pushing a compliant artifact from the floor toward excellent.

## References

- [skills/ki-engineering/references/enforcement-framework.md](../../skills/ki-engineering/references/enforcement-framework.md) §5 — the modes in full.
- [docs/skill-design.md](../guides/user-guide/skill-design.md) §Principles — "One governance-mode model (SHAPE-5)".
