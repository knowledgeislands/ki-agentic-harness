# Implementation Plans

Active plans only — one file per ROADMAP "Next" item. Each plan is self-contained: context, current state, ordered steps, files touched, and a verify section. Read the plan before starting the item; update its `status` when work begins or completes.

Phasing (Next / Soon / Future) lives in [ROADMAP.md](../../ROADMAP.md), not here — a plan is written when an item enters "Next" and removed when it lands. The format is defined in the `ki-plans` skill's [plan-format.md](../../skills/ki-plans/references/plan-format.md).

| Plan                                                  | Theme | Title                                        | Status      | Blocks |
| ----------------------------------------------------- | ----- | -------------------------------------------- | ----------- | ------ |
| [001](codex/001-register-codex-runtime.md)            | codex | Register Codex CLI as a target runtime       | open        | —      |
| [002](codex/002-multi-runtime-install-linkers.md)     | codex | Multi-runtime install linkers (WS-B Phase 2) | in-progress | —      |
| [003](codex/003-develop-in-both-agents-md-and-mcp.md) | codex | AGENTS.md orientation + Codex MCP renderer   | in-progress | —      |

## Dependency graph

```text
001

002

003
```
