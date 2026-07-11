# SDR-KI-HARNESS-001: Runtime-portable contracts and executor positioning

**Date:** 2026-07-11

## Context

The agent-tooling market has settled into layers rather than competing products: applications, agent runtimes/harnesses (Hermes Agent, pi.dev, OpenClaw, Claude Code, the Claude Agent SDK, the OpenAI Agents SDK), orchestration primitives (MCP servers, memory, planning, subagents), and model providers. Knowledge Islands sits above the runtime layer: it is a governance-and-capability framework — territory boundaries, evidence and provenance rules, validation for accuracy, correctness, and completeness — and the runtimes are execution substrates beneath it that do not define the epistemic rules. The harness's artefacts (skills, agents, checkers, the `.ki-config.toml` contract) are Markdown and scripts that are portable in principle, but Claude Code is today the only environment that has ever executed them, and nothing has proven the portability. The candidate runtimes differ in philosophy: Hermes is a batteries-included, model-agnostic persistent agent (memory, scheduling, skills, delegation, channels); Pi is a deliberately minimal TypeScript core where extensions provide everything; OpenClaw is strongest as an always-reachable multi-channel gateway. Extending a minimal runtime to feature parity with a batteries-included one, or nesting one generic runtime inside another, duplicates ownership of sessions, context, tools, and lifecycle.

## Decision

Knowledge Islands capabilities are expressed through portable contracts — skills, MCP interfaces, evidence and validation protocols, the `.ki-config.toml` binding — and never through the assumptions of any one runtime. Concretely:

- No runtime becomes the definition of the system; each is a conforming execution environment. Claude Code is the current one; Hermes is the intended first conforming environment for persistent, scheduled, steward-style work; Pi serves as the portability and conformance test and as a repo-local coding workbench; OpenClaw is deferred until a multi-channel gateway is specifically needed.
- Runtimes divide by workload and sit beside one another, never nested: persistent stewards and scheduled work on the batteries-included runtime; controlled, narrow, high-assurance work on the minimal one. Effort goes overwhelmingly into the Knowledge Islands contracts themselves, not into recreating one runtime's features in another.
- **Best tool for the job** is a central tenet, and "tool" spans deterministic scripts as much as model providers and tiers: a mechanical check where one suffices, then the cheapest sufficient intelligence tier, then frontier reasoning only where judgment is genuinely needed — extending the mechanical-first paradigm from capability to _capability independence_.
- Learned behaviour is **proposed, never silently promoted**: an agent may propose a memory entry or an improved skill, but promotion into governed territory passes through an explicit governance gate, as the Enactment Process already requires for knowledge-base content.

## Consequences

Skills, checkers, and configuration must avoid runtime-specific assumptions where avoiding them is cheap, and any that remain are deliberate and known. Adopting a second runtime becomes a conformance exercise against existing contracts rather than a rewrite, and implementing one narrow skill on a minimal runtime is the test that the standards are genuinely portable rather than one runtime's configuration under a Knowledge Islands label. The propose-versus-promote boundary extends governance from knowledge-base content to harness-side learning, which existing mechanisms do not yet gate uniformly. The best-tool-for-the-job tenet gives the mechanical/judgment split and the model-tier standards (ki-tokenomics, ki-handoffs) a single articulated rationale.

## References

- [ADR-KI-HARNESS-002](ADR-KI-HARNESS-002-purpose-scope-structure.md) — the purpose and scope of the harness whose positioning this record sets.
- [ADR-KI-HARNESS-004](ADR-KI-HARNESS-004-mechanical-first-llm-optional.md) — the mechanical-first paradigm this strategy generalises.
- [Hermes Agent](https://github.com/NousResearch/hermes-agent) — the batteries-included persistent runtime.
- [pi.dev](https://pi.dev) — the minimal TypeScript runtime.
- [OpenClaw](https://docs.openclaw.ai) — the multi-channel gateway runtime.
