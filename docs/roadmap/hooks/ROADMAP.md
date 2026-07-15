# Hooks roadmap

## Blocking

## Next

### Promote Plan Mode plans into thematic roadmaps

Claude Code's interactive Plan Mode (`EnterPlanMode`/`ExitPlanMode`) plans land only as scratch files under `~/.claude/plans/`, stamped and progress-synced in place by `hooks/plan-stamp.sh`/`hooks/plan-sync.sh`. Reconcile the optional `promote` subcommand in the `ki-plan` lifecycle (`skills/process/ki-plan/references/lifecycle.md`) with repo-first planning so a selected scratch plan can become a governed `docs/roadmap/<theme>/plans/<NNN>-<slug>.md` entry without making Plan Mode canonical or mandatory. Keep promotion deliberate and user-invoked: the qualified `roadmap:` locator, theme, and global id require judgment an auto-firing hook cannot safely apply unattended. See `plans/004-promote-plan-mode-plans.md`.

## Soon

## Waiting for

## Future
