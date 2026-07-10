# ADR-KI-HARNESS-SKILLS-002: Mechanical and judgment checker split

**Date:** 2026-06-23

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
- The skills rubric enforces that [M] criteria without a checker are flagged as findings.
- Checkers depend only on Node/Bun builtins — no npm dependencies; skills are symlinked individually so cross-skill imports would break.

## References

- [ADR-KI-HARNESS-004](ADR-KI-HARNESS-004-mechanical-first-llm-optional.md) — the mechanical-first, LLM-optional foundation this per-skill split realises.

The mechanical-checker contract and the rubric format are set out in the `ki-engineering` enforcement framework, and the governing principle — mechanical work belongs in the checker, not in tokens — is in the user guide's skill-design principles.
