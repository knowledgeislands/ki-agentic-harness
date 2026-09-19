---
type: ki-checkpoint
thread: estate-baseline-audit
state: active
created_at: 2026-09-19T08:56:54Z
updated_at: 2026-09-19T08:56:54Z
---

# estate-baseline-audit

## Objective

Mechanically conform, dependency-refresh, and judgmentally audit every Knowledge Islands repository, then leave independently committed baselines and an estate-level assessment for deciding future structure.

## Current state

The 21-repository estate has been inventoried. Nineteen repositories were initially clean; `mcp-acquire-whatsapp` and `tools-rig` contain active work and must be handled last without disturbing those changes. The first mechanical audit pass found several repository-specific failures plus one estate-resolution blocker: `ki-arcadia-principal` declares `ki-housekeeping-granola`, which the active Harness does not provide. Sandboxed test failures that attempted to write under sibling `node_modules` still need an unsandboxed confirmation. The remaining work is: finish mechanical audits; dry-run and apply safe conforms; refresh libraries and verify each repository; process approved Awaiting review roadmap records through a committed Done boundary and a later prune-only commit; count credible Now candidates without adopting Triage implicitly; locate or capture the estate dashboard work; audit `.ki.toml` readability and semantic neighbourhoods; perform the judgmental code, documentation, roadmap, working-area, and repository audit; inspect and remove only finished worktrees; commit exact touched paths in each repository; and publish the baseline report.

## Decisions made

Mechanical audit and conform precede dependency updates and judgmental review. Active repositories `mcp-acquire-whatsapp` and `tools-rig` stay until the end. Awaiting review records have human approval to close and prune when their evidence is valid, but pruning follows a distinct committed Done boundary. Triage adoption still needs exact selection. Shared-tree commits use touched-path tracking and explicit staging only. The chezmoi `.ki.toml` is a presentation exemplar for compact relationship declarations: dotted `memberships` and `routes` remain beside their owning skill roots when readable, while substantial multiline Agora homes may retain nested tables. Empty required specialist working subareas remain when their declaring skill is enabled; retired checkpoint directories do not.

## Files touched

`+/_CHECKPOINTS/estate-baseline-audit.md` only. Other visible Harness changes belong to concurrent work and are out of scope.

## Open questions

Whether the missing Granola capability is a stale Arcadia declaration or an unpublished Harness capability; which roadmap records are credible promotion candidates; whether an existing roadmap item already owns the graphical estate dashboard; and which temporary worktrees are demonstrably finished and safe to remove.

## Next step

Complete the unsandboxed mechanical audit of the nineteen non-active repositories, preserving the per-repository findings as the input to dry-run conform decisions.
