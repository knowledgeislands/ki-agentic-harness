# Hooks roadmap

## Blocking

Actively broken, or blocking the `Next` horizon: takes priority over everything else and must clear before `Next` work proceeds. Empty means nothing is on fire.

## Next

Scoped and ready to start — the immediate queue, picked up before anything in **Soon** or **Future**.

### Install Claude Code hooks from GitHub safely

Provide a one-time, explicit global installer that fetches the three Claude Code hooks from GitHub, writes an owned versioned payload under `~/.claude/hooks/`, and merge-patches their registrations into `~/.claude/settings.json`. It must not run during repository bootstrap or a parallel `mgit` fleet operation. Preflight hostile parents and owned destinations, preserve unrelated hooks and settings, leave no disposable-source dependency, and cover fresh install, upgrade, blocker, malformed-settings, partial-failure, and idempotence cases.

## Soon

Understood and roughly scoped but not yet started — worth doing once the **Next** queue clears, ahead of anything still speculative.

### Govern the shipped Claude Code hooks as `ki-claude-hooks`

After the installer is established, create a governance skill and checker for the Plan Mode lifecycle hooks, stale Git-lock guard, settings-installation contract, ownership, fail-safe behaviour, runtime selection, portability limits, tests, and audit expectations. Do not redesign the shipped hook behaviour or fold unrelated runtime support into this work.

## Waiting for

Worth doing, but presently blocked on an external dependency or decision. Revisit when its named condition changes rather than treating it as dormant local work.

## Future

Speculative or not yet scoped — items marked _(candidate)_ need a scoping pass (or a decision to drop them) before they're actionable.
