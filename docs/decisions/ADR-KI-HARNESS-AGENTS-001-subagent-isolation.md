# ADR-KI-HARNESS-AGENTS-001: Subagent isolation for multi-skill invocation

**Date:** 2026-06-23

## Context

A multi-skill operation (AUDIT, CONFORM, or any mode run across the governance skill set) has two goals in tension: bound each skill's context (so the run does not load every skill's files at once) and complete quickly. The concerns are largely independent — each governance skill checks its own surface — so they do not need to share a context or run in sequence. Running each concern in its own subagent satisfies both goals: the subagent loads only the files for its concern, so its context is as bounded as a single-skill window, and the concerns run in parallel rather than summing their durations.

This applies to all Knowledge Islands multi-skill invocations, not only audits.

## Decision

For any multi-skill invocation (AUDIT, CONFORM, REFRESH, or other modes run across multiple governance skills):

1. **COLL checks first** — run the set-level collision checks (COLL-1: name uniqueness via `bun run ki:skills:lint`; COLL-2: description off-ramp reciprocity by reading all `description` fields) in the main agent context. These are cross-skill by nature and cheap; they must run before fan-out.
2. **Fan out to subagents** — spawn one `agent()` per concern in `parallel()`. Each subagent receives only its concern's files, runs the mechanical checker (`bun run ki:<concern>:audit --json`) and applies the judgment criteria, and returns a structured JSON object: `{ concern, exit_code, fail[], warn[], polish[], advisory[], pass_count }`.
3. **Synthesise in the main agent** — collect all subagent results, rank findings with dependency-order priority (foundations first, per ADR-KI-HARNESS-SKILLS-003), and report across concerns.

For the harness multi-concern audit specifically, the workflow is codified in `.claude/workflows/ki-multi-skill-audit.ts`.

## Consequences

- Multi-skill runs complete in time proportional to the slowest single concern, not the sum.
- Each subagent's context is bounded to a single concern.
- The dependency order from ADR-KI-HARNESS-SKILLS-003 becomes synthesis ranking priority, not execution order.
- A subagent failure (one concern) does not abort the others.
- COLL checks remain in the main context because they are cross-skill and cannot be isolated per concern.
- The saved workflow (`.claude/workflows/ki-multi-skill-audit.ts`) is the canonical implementation for harness audits.

## References

- [ADR-KI-HARNESS-SKILLS-003](ADR-KI-HARNESS-SKILLS-003-dependency-order-composition.md) — the dependency order that governs synthesis ranking.
- The `ki-skills` SKILL.md — Mode AUDIT, set-audit discipline.
- The `ki-harness` SKILL.md — Mode AUDIT step 2, the multi-concern audit.
- The `ki-multi-skill-audit` workflow — the saved workflow.
