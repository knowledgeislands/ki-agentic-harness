# Project roadmap index

Canonical themes and active execution plans.

## Themes

- [foundation-tooling](foundation-tooling/ROADMAP.md)
- [governance-consistency](governance-consistency/ROADMAP.md)
- [hooks](hooks/ROADMAP.md)
- [operations](operations/ROADMAP.md)
- [runtime-portability](runtime-portability/ROADMAP.md)

## Active plans

| Plan | Theme | Title | Roadmap item | Status | Blocks |
| --- | --- | --- | --- | --- | --- |
| [foundation-tooling/002](foundation-tooling/plans/002-safe-generated-writes.md) | foundation-tooling | Harden generated-file writes | foundation-tooling/harden-generated-file-writes-against-symlinks-and-read-check-write-races | in-progress | foundation-tooling/004 |
| [foundation-tooling/003](foundation-tooling/plans/003-rollout-documentation-baseline.md) | foundation-tooling | Reconcile rollout documentation | foundation-tooling/reconcile-the-fleet-s-toolchain-prose-with-the-collapsed-toolchain | in-progress | foundation-tooling/004 |
| [foundation-tooling/004](foundation-tooling/plans/004-mcp-uniform-mode-rollout.md) | foundation-tooling | Pilot uniform modes across MCP repositories | foundation-tooling/sweep-the-mcp-repos-onto-the-uniform-mode-model-re-check-naming-across-surfaces | open (needs foundation-tooling/002+foundation-tooling/003) | — |

## Dependency graph

```text
foundation-tooling/002 ──► foundation-tooling/004
foundation-tooling/003 ──► foundation-tooling/004
```
