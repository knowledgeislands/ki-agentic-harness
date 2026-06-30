# ADR-KI-HARNESS-SKILLS-002: Mechanical and judgment checker split

**Status:** Accepted

**Date:** 2024-01-01

## Context

Governance audits required both deterministic checks (file exists, field is non-empty, naming pattern matches) and non-deterministic judgment (is the description trigger-rich, is the altitude right, is a prose section covering the right ground). Mixing these in a single prose-driven AUDIT pass meant re-deriving deterministic facts on every run, burning model context on work a script could do, and risking inconsistency between runs. Equally, hard-coding all checks into a script discarded the judgment value a model brings to qualitative criteria.

## Decision

Every governance skill's AUDIT is split into two layers:

- **Mechanical [M]** — a TypeScript/Bun checker in `scripts/audit-<concern>.ts` runs all deterministic criteria, emits findings on the unified severity ladder, and exits non-zero on any FAIL. The AUDIT mode runs the checker first and captures its output verbatim — never re-derives what the checker already found.
- **Judgment [J]** — the reader/agent applies criteria the checker cannot decide deterministically (prose quality, altitude, collision assessment). These are surfaced inline in the checker output as ADVISORY where the checker can point at the specific criterion.

A criterion starts in the checker unless it genuinely requires judgment. A criterion that is scriptable but left to prose is a finding.

## Consequences

- Model context is spent only on judgment criteria that genuinely need it.
- Mechanical findings are reproducible and not subject to per-run variance.
- The rubric's `[M]`/`[J]` tags make the split visible and auditable.
- SHAPE-9 in the skills rubric enforces that [M] criteria without a checker are flagged as findings.
- Checkers depend only on Node/Bun builtins — no npm dependencies; skills are symlinked individually so cross-skill imports would break.

## References

- [skills/knowledgeislands-engineering/references/enforcement-framework.md](../../skills/knowledgeislands-engineering/references/enforcement-framework.md) §2 — the mechanical-checker contract, §3 — the rubric format.
- [docs/design.md](../design.md) §Principles — "Mechanical work belongs in the checker, not in tokens (SHAPE-9)".
