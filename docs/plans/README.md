# Implementation Plans

Active plans only — one file per ROADMAP `Blocking` or `Next` item. Each plan is self-contained: context, current state, ordered steps, files touched, and a verify section. Read the plan before starting the item; update its `status` when work begins or completes.

The five-horizon model lives in [ROADMAP.md](../../ROADMAP.md), not here — a plan is written when an item enters `Blocking` or `Next` and removed when it lands. The format is defined in the `ki-plans` skill's [plan-format.md](../../skills/general-governance/ki-plans/references/plan-format.md).

| Plan                                                                    | Theme  | Title                                      | Status      | Blocks |
| ----------------------------------------------------------------------- | ------ | ------------------------------------------ | ----------- | ------ |
| [004](hooks/004-promote-plan-mode-plans.md)                             | hooks  | Promote Plan Mode plans into `docs/plans/` | in-progress | —      |
| [005](config/005-make-config-declarations-and-scaffolding-fail-safe.md) | config | Config integrity†                          | open        | —      |

† Make configuration declarations and scaffolding fail-safe.

## Dependency graph

```text
004
005
```
