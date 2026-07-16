# Hooks roadmap

## Blocking

Actively broken, or blocking the `Next` horizon: takes priority over everything else and must clear before `Next` work proceeds. Empty means nothing is on fire.

## Next

Scoped and ready to start — the immediate queue, picked up before anything in **Soon** or **Future**.

## Soon

Understood and roughly scoped but not yet started — worth doing once the **Next** queue clears, ahead of anything still speculative.

### Govern the shipped Claude Code hooks as `ki-claude-hooks`

Create a governance skill and checker for the already-shipped Plan Mode lifecycle hooks, stale Git-lock guard, settings installation, and linker contract. Close the remote-delivery gap explicitly: the per-repository `curl | sh` bootstrap runs from a disposable tarball and cannot leave hook symlinks pointing into that source, so provide a separate one-time GitHub-backed global install leg that copies or version-stamps the Claude Code hook payload under `~/.claude/hooks/` and merge-patches `~/.claude/settings.json`. Do not make every repository bootstrap—or a parallel `mgit` fleet run—race to mutate the same global settings. Codify ownership, fail-safe behaviour, runtime selection, portability limits, tests, and audit expectations around the resulting surface without redesigning the hook behaviour. Sequence it after the remaining linker-publication hardening.

## Waiting for

Worth doing, but presently blocked on an external dependency or decision. Revisit when its named condition changes rather than treating it as dormant local work.

## Future

Speculative or not yet scoped — items marked _(candidate)_ need a scoping pass (or a decision to drop them) before they're actionable.
