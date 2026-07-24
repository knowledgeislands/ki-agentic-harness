---
id: ADR-KI-HARNESS-003
title: 'Mechanical-first — agent judgment progressively enhances'
date: 2026-07-09
status: current
type: Architecture Decision Record
type_url: https://knowledgeislands.info/specifications/decision-records/adr
decision_type: architecture
---

# ADR-KI-HARNESS-003: Mechanical-first — agent judgment progressively enhances

## Context

An agentic harness serves two kinds of agent: **human and LLM**. Its work divides into two styles: **mechanical** — deterministic, decidable by a script — and **judgemental** — requiring an agent, of either kind. The governance skills meet both: an agent applies judgment, and plain automation (CI, pre-commit hooks, scheduled REFRESH sweeps, a bootstrap on a machine with no model) runs the deterministic work. When a skill's core work needs an LLM to execute at all, none of the automated paths work, a human agent cannot carry the skill either, and every AUDIT re-derives deterministic facts in model context at token cost. This record fixes the foundational stance that prevents that: the deterministic work must stand on its own, runnable without a model. It is the stance each skill then applies by isolating its deterministic criteria in a standalone checker.

## Decision

Every skill's mechanical half runs standalone — no LLM, no model context — as a plain CLI. It is _mechanical_ in the precise sense that it runs **outside the agentic loop**: a CI job, a pre-commit hook, a scheduled sweep, or a bare shell can invoke it with no model in the picture. Agent judgment — human or LLM — is a **progressive enhancement** layered on that mechanical baseline, never a prerequisite for it: the baseline always runs and is always useful alone; an agent, when present, adds the judgment layer on top.

- **AUDIT / CONFORM** — the checker, and the mechanical CONFORM fixes, run to completion as pure CLI; an agent, when present, adds the judgment layer (the mechanical/judgment split, later in the reading order).
- **EDUCATE** — as pure CLI it scaffolds and wires with safe defaults and **prints the judgment checks it skipped**; under an agent it also applies that judgment. A human agent reading the printed list and finishing the checks by hand is the same pattern as an LLM doing so — the enhancement layer does not care which kind of agent supplies it.
- A criterion a script can decide deterministically belongs in the checker, not in tokens; an agent's context — a model's window or a human's attention — is spent only on criteria that genuinely need judgment.
- **Every environment has a mechanical prompt.** Whatever the repo type — engineering or not, `package.json` or not — a governed repository has a model-free invocation surface through the installed `ki` tool. Native repository operations resolve that repository's declared coverage from verified installed compatible harnesses. This keeps the mechanical baseline universal without copying an executor into each repository.

**The no-LLM realisability test.** Any feature of the harness — a skill, an agent, an MCP server, a hook, an eval, or otherwise — is designed and reviewed against one falsifiable question: **if no LLM agent were available, is the feature still realisable?** It passes if its mechanical part runs as a script and any remaining judgment can be carried by a human agent reading the script's output, including the skipped-judgment list it must print. It fails if it only functions with an LLM in the loop — that means the LLM was a prerequisite, not a progressive enhancement, and the mechanical baseline is incomplete.

## Consequences

- CI, pre-commit, scheduled REFRESH, and remote bootstrap all run the mechanical half with no model.
- A skill is usable — and a repo governable — on zero LLM budget; an agent of either kind improves results but is never required.
- A pure-CLI run must surface what it skipped (the judgment checks), so a human or LLM agent can finish them later.
- This is the precondition for repository self-sufficiency: mechanical operations run without an LLM, but a clean clone first acquires the verified compatible harnesses that supply its declared operations.
- The concrete surface of the mechanical half is a skill's registered native operation in a verified installed compatible harness. Repository declarations select those operations and their explicit dependencies; the native `ki` host orders and reports them. A package-script alias may be a local convenience, but it is not the canonical operation surface.
- The realisability test is applied at design and review time to every new feature, not only to skills; a feature that fails it is returned for a mechanical baseline before it lands.
