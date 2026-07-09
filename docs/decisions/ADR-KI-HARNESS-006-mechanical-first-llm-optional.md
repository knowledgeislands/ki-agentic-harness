# ADR-KI-HARNESS-006: Mechanical-first, LLM-optional operation

**Date:** 2026-07-09

## Context

The governance skills run in two ways: an agent (LLM) applies judgment, and plain automation (CI, pre-commit hooks, scheduled REFRESH sweeps, a bootstrap on a machine with no model) runs the deterministic work. When a skill's core work needs an LLM to execute at all, none of the automated paths work, and every AUDIT re-derives deterministic facts in model context at token cost. The mechanical/judgment split ([ADR-KI-HARNESS-SKILLS-002](ADR-KI-HARNESS-SKILLS-002-mechanical-judgment-checker-split.md)) already isolates the deterministic criteria in a checker; this record states the broader operating stance that follows.

## Decision

Every skill's mechanical half runs standalone — no LLM, no model context — as a plain CLI. The LLM is an optional layer that adds judgment on top, never a prerequisite for the mechanical work.

- **AUDIT / CONFORM** — the checker, and the mechanical CONFORM fixes, run to completion as pure CLI; an LLM, when present, adds the `[J]` judgment pass.
- **INIT** — as pure CLI it scaffolds and wires with safe defaults and **prints the judgment checks it skipped**; under an LLM it also applies that judgment.
- A criterion a script can decide deterministically belongs in the checker (SHAPE-9); the reader's context is spent only on criteria that genuinely need judgment.

## Consequences

- CI, pre-commit, scheduled REFRESH, and remote bootstrap all run the mechanical half with no model.
- A skill is usable — and a repo governable — on zero LLM budget; the model improves results but is never required.
- A pure-CLI run must surface what it skipped (the judgment checks), so a human or agent can finish them later.
- This is the precondition for the self-sufficiency contract ([ADR-KI-HARNESS-007](ADR-KI-HARNESS-007-bootstrapping-and-self-sufficiency.md)): scripts that run without an LLM can also run without the skill installed.

## References

- [ADR-KI-HARNESS-SKILLS-002](ADR-KI-HARNESS-SKILLS-002-mechanical-judgment-checker-split.md) — the mechanical/judgment checker split this generalises.
- [ADR-KI-HARNESS-007](ADR-KI-HARNESS-007-bootstrapping-and-self-sufficiency.md) — the self-sufficiency contract that builds on this stance.
- [docs/design.md](../guides/user-guide/design.md) §Principles — "Mechanical work belongs in the checker, not in tokens".
- [enforcement-framework.md](../../skills/ki-engineering/references/enforcement-framework.md) §5 — the modes, including INIT's pure-CLI behaviour.
