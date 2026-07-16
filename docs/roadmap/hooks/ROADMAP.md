# Hooks roadmap

## Blocking

Actively broken, or blocking the `Next` horizon: takes priority over everything else and must clear before `Next` work proceeds. Empty means nothing is on fire.

## Next

Scoped and ready to start — the immediate queue, picked up before anything in **Soon** or **Future**.

## Soon

Understood and roughly scoped but not yet started — worth doing once the **Next** queue clears, ahead of anything still speculative.

### Govern the shipped Claude Code hooks as `ki-claude-hooks`

After the installer is established, create a governance skill and checker for the Plan Mode lifecycle hooks, stale Git-lock guard, binding contract, ownership, fail-safe behaviour, runtime selection, portability limits, tests, and audit expectations. Do not redesign the shipped hook behaviour or fold unrelated runtime support into this work.

### Manage Claude hooks through chezmoi and verify required hooks

Make `ki-dotfiles-chezmoi` govern the managed-environment hook path: establish a valid regular-file payload, then act as the sole writer of matching Claude Code registrations in `~/.claude/settings.json`. Bootstrap installs skills only; it neither installs hooks nor writes Claude settings. Each skill that relies on a hook must audit its required hook capability and, when safe and meaningful, conform its repository-facing declaration without assuming chezmoi is available. Retain a renderer-neutral off-ramp for environments not managed by chezmoi.

## Waiting for

Worth doing, but presently blocked on an external dependency or decision. Revisit when its named condition changes rather than treating it as dormant local work.

## Future

Speculative or not yet scoped — items marked _(candidate)_ need a scoping pass (or a decision to drop them) before they're actionable.
