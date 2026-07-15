# Hooks roadmap

## Blocking

## Next

### Promote Plan Mode plans into `docs/plans/`

Claude Code's interactive Plan Mode (`EnterPlanMode`/`ExitPlanMode`) plans land only as scratch files under `~/.claude/plans/`, stamped and progress-synced in place by `hooks/plan-stamp.sh`/`hooks/plan-sync.sh`. Add a `promote` subcommand to the `ki-plan` lifecycle (`skills/process/ki-plan/references/lifecycle.md`) that turns a session's Plan Mode plan into a governed `docs/plans/<theme>/<NNN>-<slug>.md` entry — reusing `plan-stamp.sh`'s existing `~/.claude/plans/.state/<session_id>` pointer to locate the scratch file, and `new`'s existing id-derivation/theme/roadmap-confirmation logic to place it correctly. Deliberately a user-invoked lifecycle command, not a new auto-firing hook: the `roadmap:`/theme/id fields require judgment a `PostToolUse` hook can't safely apply unattended, and widening either existing hook's write surface from `~/.claude/plans/` to arbitrary repo paths is a separate, security-sensitive change left out of scope here. See `docs/plans/hooks/004-promote-plan-mode-plans.md`.

## Soon

## Waiting for

## Future
