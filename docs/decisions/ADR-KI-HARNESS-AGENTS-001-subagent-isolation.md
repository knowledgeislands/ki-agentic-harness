# ADR-KI-HARNESS-AGENTS-001: Subagent isolation for multi-skill invocation

**Date:** 2026-06-23

## Context

A multi-skill operation (AUDIT, CONFORM, or any mode run across the governance skill set) has two goals in tension: bound each skill's context (so the run does not load every skill's files at once) and complete quickly. The concerns are largely independent — each governance skill checks its own surface — so they do not need to share a context or run in sequence. Running each concern in its own subagent satisfies both goals: the subagent loads only the files for its concern, so its context is as bounded as a single-skill window, and the concerns run in parallel rather than summing their durations.

This applies to all Knowledge Islands multi-skill invocations, not only audits.

## Decision

For any multi-skill invocation (AUDIT, CONFORM, REFRESH, or other modes run across multiple governance skills):

1. **Run the mechanical aggregate first** — the repository's `ki:audit` entrypoint is the authoritative mechanical result. Keep set-level checks such as skill-name collisions and description reciprocity in the orchestrator, because they are cross-skill by nature.
2. **Fan out only independent judgment review** — when the host supports subagents and the review is large enough to justify them, use `ki-delegate` to give each reviewer one bounded concern and the already-captured mechanical result. Do not re-run or reinterpret another concern's checker in a subagent.
3. **Synthesise in the main agent** — collect the bounded reviews, rank findings with dependency-order priority (foundations first, per ADR-KI-HARNESS-SKILLS-003), and report across concerns. The orchestrator remains responsible for gating any resulting changes.

This is a method, not a tracked runtime workflow. Each host uses its available delegation mechanism without making that mechanism part of the governed harness contract.

## Consequences

- The mechanical audit remains reproducible without an agent runtime or custom workflow code.
- When used, each reviewer’s context is bounded to a single concern and independent judgment review can complete in parallel.
- The dependency order from ADR-KI-HARNESS-SKILLS-003 becomes synthesis ranking priority, not execution order.
- A reviewer failure does not invalidate the aggregate mechanical result; report the review gap honestly and retry or review it in the main context.
- Cross-skill checks remain in the main context because they cannot be isolated per concern.
- No Claude-specific workflow must track changing checker paths, concern names, or runtime APIs.

## References

- [ADR-KI-HARNESS-SKILLS-003](ADR-KI-HARNESS-SKILLS-003-dependency-order-composition.md) — the dependency order that governs synthesis ranking.
