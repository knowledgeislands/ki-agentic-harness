# ADR-KI-HARNESS-AGENTS-001: Subagent isolation for multi-skill invocation

**Status:** Accepted

**Date:** 2026-06-23

## Context

Multi-skill operations (AUDIT, CONFORM, or any mode run across the full governance skill set) were previously executed serially in a single
agent context — one skill at a time in dependency order (ADR-KI-HARNESS-SKILLS-003). This approach achieved its primary goal of bounding
context (load one skill, release it before loading the next), but it serialised work that is largely independent, meaning a full harness
audit took as long as the sum of all concern durations.

The same context-bounding goal can be achieved — better — by running each concern in its own subagent. Each subagent loads only the files
for its concern, runs its checker and judgment pass, and returns structured findings. The main agent synthesises the results. This
parallelises execution while keeping each subagent's context as bounded as the old serial walk's single-concern window.

This applies to all Knowledge Islands multi-skill invocations, not only audits.

## Decision

For any multi-skill invocation (AUDIT, CONFORM, REFRESH, or other modes run across multiple governance skills):

1. **COLL checks first** — run the set-level collision checks (COLL-1: name uniqueness via `bun run ki:skills:lint`; COLL-2: description
   off-ramp reciprocity by reading all `description` fields) in the main agent context. These are cross-skill by nature and cheap; they must
   run before fan-out.
2. **Fan out to subagents** — spawn one `agent()` per concern in `parallel()`. Each subagent receives only its concern's files, runs the
   mechanical checker (`bun run <concern>:audit --json`) and applies the judgment criteria, and returns a structured JSON object:
   `{ concern, exit_code, fail[], warn[], polish[], advisory[], pass_count }`.
3. **Synthesise in the main agent** — collect all subagent results, rank findings with dependency-order priority (foundations first, per
   ADR-KI-HARNESS-SKILLS-003), and report across concerns.

For the harness multi-concern audit specifically, the workflow is codified in `.claude/workflows/ki-multi-skill-audit.ts`.

## Consequences

- Multi-skill runs complete in time proportional to the slowest single concern, not the sum.
- Each subagent's context is bounded to one concern — the same bound as the old serial walk.
- The dependency order from ADR-KI-HARNESS-SKILLS-003 becomes synthesis ranking priority, not execution order.
- A subagent failure (one concern) does not abort the others.
- COLL checks remain in the main context because they are cross-skill and cannot be isolated per concern.
- The saved workflow (`.claude/workflows/ki-multi-skill-audit.ts`) is the canonical implementation for harness audits.

## References

- ADR-KI-HARNESS-SKILLS-003 — the dependency order that governs synthesis ranking.
- [skills/knowledgeislands-skills/SKILL.md](../../skills/knowledgeislands-skills/SKILL.md) — Mode AUDIT, set-audit discipline (updated to
  reference this ADR).
- [skills/knowledgeislands-harness/SKILL.md](../../skills/knowledgeislands-harness/SKILL.md) — Mode AUDIT step 2 (updated to reference the
  workflow).
- [.claude/workflows/ki-multi-skill-audit.ts](../../.claude/workflows/ki-multi-skill-audit.ts) — the saved workflow.
