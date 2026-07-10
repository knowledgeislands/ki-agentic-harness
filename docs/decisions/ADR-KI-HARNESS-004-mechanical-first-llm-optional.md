# ADR-KI-HARNESS-004: Mechanical-first, LLM-optional operation

**Date:** 2026-07-09

## Context

The governance skills run in two ways: an agent (LLM) applies judgment, and plain automation (CI, pre-commit hooks, scheduled REFRESH sweeps, a bootstrap on a machine with no model) runs the deterministic work. When a skill's core work needs an LLM to execute at all, none of the automated paths work, and every AUDIT re-derives deterministic facts in model context at token cost. This record fixes the foundational stance that prevents that: the deterministic work must stand on its own, runnable without a model. It is the stance each skill then applies by isolating its deterministic criteria in a standalone checker.

## Decision

Every skill's mechanical half runs standalone — no LLM, no model context — as a plain CLI. The LLM is an optional layer that adds judgment on top, never a prerequisite for the mechanical work.

- **AUDIT / CONFORM** — the checker, and the mechanical CONFORM fixes, run to completion as pure CLI; an LLM, when present, adds the `[J]` judgment pass (the `[M]`/`[J]` mechanical/judgment split is the next decision in the reading order).
- **INIT** — as pure CLI it scaffolds and wires with safe defaults and **prints the judgment checks it skipped**; under an LLM it also applies that judgment.
- A criterion a script can decide deterministically belongs in the checker (SHAPE-9 in the skills rubric); the reader's context is spent only on criteria that genuinely need judgment.

## Consequences

- CI, pre-commit, scheduled REFRESH, and remote bootstrap all run the mechanical half with no model.
- A skill is usable — and a repo governable — on zero LLM budget; the model improves results but is never required.
- A pure-CLI run must surface what it skipped (the judgment checks), so a human or agent can finish them later.
- This is the precondition for the self-sufficiency contract (its own decision later in the reading order): scripts that run without an LLM can also run without the skill installed.
