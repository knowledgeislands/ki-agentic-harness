# Hooks roadmap

## Blocking

Actively broken, or blocking the `Next` horizon: takes priority over everything else and must clear before `Next` work proceeds. Empty means nothing is on fire.

## Next

Scoped and ready to start — the immediate queue, picked up before anything in **Soon** or **Future**.

### Graduate `git-lock-check.sh` into the harness hook surface

Move the chezmoi repo's user-level `Stop` hook for stale `.git/*.lock` files into harness ownership alongside the plan lifecycle pair. Add `hooks/git-lock-check.sh` and an adversarial `hooks/git-lock-check.test.ts`; document the third hook in `hooks/README.md`; and generalize `skills/keystone/ki-bootstrap/scripts/link-hooks.ts` so each declared hook carries its own event and matcher rather than hardcoding `hooks.PostToolUse`. The new hook uses `Stop` with matcher `*`; `plan-stamp.sh` and `plan-sync.sh` remain `PostToolUse`. The dependent chezmoi removal is tracked in that repo.

## Soon

Understood and roughly scoped but not yet started — worth doing once the **Next** queue clears, ahead of anything still speculative.

### Govern Claude Code hooks as a first-class harness surface

Create the governance skill for the populated `hooks/` surface. Decide between `ki-hooks` (the surface-name pattern) and `ki-claude-hooks` (explicit runtime coupling), then AUDIT/CONFORM house script style, adversarial safety posture, linker and `settings.json` registration integrity, and the user-level installation documented in `hooks/README.md`. Seed the rubric from the plan hook safety work: input parsed with `jq`, resolved-path containment, symlink refusal, atomic same-directory writes, fail-safe malformed input, and correct event/matcher registration.

Hooks are executable automation bound to a runtime's proprietary lifecycle and configuration surface. The first standard therefore governs Claude Code hooks explicitly; another runtime's hook mechanism becomes a sibling surface with its own registration model rather than an extension hidden behind false portability. Cross-reference `ki-recap`, which already names a hook as one possible destination for harvested learnings.

## Waiting for

Worth doing, but presently blocked on an external dependency or decision. Revisit when its named condition changes rather than treating it as dormant local work.

## Future

Speculative or not yet scoped — items marked _(candidate)_ need a scoping pass (or a decision to drop them) before they're actionable.
