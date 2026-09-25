---
name: ki-agent-coordination-paperclip
ki-kind: governance
ki-applicability: declaration-only
ki-depends-on: []
ki-shared-dependencies: [ki-skills:rubric]
description: >
  Govern how Paperclip coordinates agents around a Knowledge Island group or archipelago while repositories
  remain knowledge and work authority. Use when designing or auditing Paperclip agents, tasks, direct sessions,
  or execution workspaces for KI; not for Paperclip API mechanics.
argument-hint: 'audit <arrangement> | conform <arrangement> | educate <arrangement> | help | refresh'
---

# KI agent coordination — Paperclip

## Position

Paperclip is a coordination plane around Knowledge Islands, not their memory or governance authority. A KI repository and admitted revision remain the durable source for knowledge, work records, authority, and review evidence. Paperclip may schedule agents, hold operational task state, and bind execution workspaces without becoming the place where durable KI meaning lives.

This skill owns the relationship between those systems. Paperclip's own `paperclip` skill owns control-plane API mechanics, authentication, checkout, task updates, comments, and delegation. Use `ki-subagents` when defining a portable agent role and the active `ki-work` adapter when changing a KI work record.

Read the [Paperclip coordination standard](references/standards-agent-coordination-paperclip.md) before designing or assessing an arrangement. Read the [generated rubric](references/rubric.md) for its review criteria and the [source record](references/sources.md) only when refreshing volatile Paperclip claims.

## Shared model

Keep four identities distinct:

- an **agent role** is durable organisational identity and responsibility;
- a **run or session** is one execution continuity in an agent harness;
- a **workspace** is the filesystem and admitted baseline available to that run;
- a **worker** is the compute or process executing it.

Rita and Sue may both work on `tools-rig` and start from the same admitted revision. When both can mutate files concurrently, give each task a separate worktree or equivalent isolated checkout. Sharing the logical island does not require sharing one mutable directory.

Direct human-agent sessions remain valid. A directly addressed agent may use Paperclip's own skill to inspect assignments, create or update coordinated tasks, and return evidence. Paperclip is a shared coordination plane, not a mandatory conversational gateway.

## Operating modes

This governance skill carries **AUDIT · CONFORM · EDUCATE · REFRESH**. `help` / `-h` / `?` explains the skill, invocation, modes, and off-ramps, then stops. With no clear mode, provide the same explanation and only in an interactive session ask which mode and arrangement to use.

### Mode AUDIT

Run `ki repo audit --skill ki-agent-coordination-paperclip --repo <repo>` when the repository declares this capability. Apply the judgment criteria in the generated rubric to the supplied Paperclip company, agent, task, workspace, and KI evidence. Report repository facts separately from remote Paperclip facts; an unavailable remote view is unknown, not a pass.

### Mode CONFORM

Bring an explicitly scoped coordination design or local declaration into line with the standard. Preserve repository authority, repair task-to-work links, separate concurrent mutable workspaces, and identify evidence that must return to the island. Use Paperclip's own skill for authorised remote changes; this skill never treats an assignment as permission to mutate a repository, push, merge, deploy, or accept KI work.

### Mode EDUCATE

Explain or draft the smallest arrangement that preserves the shared model. Start with one company or group, named repository identities, agent roles, task-to-work locators, workspace isolation, and evidence return. Do not provision a company, invent remote identifiers, or require every conversation to pass through Paperclip.

### Mode REFRESH

**Precondition:** REFRESH writes only this canonical skill in `ki-agentic-harness`. From an installed copy, stop and redirect to the Harness.

On the cadence in the [source record](references/sources.md), re-read Paperclip's official skill and documentation for task, workspace, chat, identity, and authority changes. Update only the Paperclip-facing delta; KI repository authority and lifecycle semantics remain with their owning KI skills.
