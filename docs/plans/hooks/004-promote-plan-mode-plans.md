---
id: '004'
title: Promote Plan Mode plans into `docs/plans/`
status: in-progress
roadmap: Promote Plan Mode plans into `docs/plans/`
blocks: —
blocked-by: —
---

# Promote Plan Mode plans into `docs/plans/`

## Context

Claude Code's interactive Plan Mode (`EnterPlanMode`/`ExitPlanMode`) plans land as personal scratch files under `~/.claude/plans/`. The file can remain after a session ends, but it is neither versioned with the repository nor governed and indexed as a `docs/plans/` artifact. The user wants selected Plan Mode plans promoted into `docs/plans/<theme>/<NNN>-<slug>.md` so they become durable repository work rather than undiscoverable runtime scratch.

The original framing was "a hook that moves the plan file." Research surfaced why a blind, auto-firing hook is the wrong shape for the _move_ itself:

- `docs/plans/` frontmatter requires a `roadmap:` field — a plan with no ROADMAP `Blocking` or `Next` item is misfiled per the near-horizon principle (`skills/general-governance/ki-plans/references/plan-format.md`). A Plan Mode plan has no such linkage; picking one is a judgment call, not a mechanical copy.
- Filename placement (`<theme>/<NNN>-<slug>.md`) requires deriving the next global id from both the valid index and the plans on disk, then picking or confirming a theme against ROADMAP sections — again judgment, not string manipulation a `PostToolUse` shell hook can safely do unattended.
- `docs/decisions/references/runtime-feature-coverage.md` explicitly flags that Claude Code's "Plan Mode" and this repo's "plan" artifact are "same word, entirely different mechanisms" — bridging them silently on every `ExitPlanMode` risks polluting `docs/plans/` with throwaway plans the user never meant to keep.
- `ki-plan`'s existing `new` subcommand (`skills/process/ki-plan/references/lifecycle.md`) already implements this exact id/theme/roadmap logic — but only as prose Claude executes itself when the skill runs, not as an importable script. There's nothing to shell out to from a hook.
- The existing hooks (`plan-stamp.sh`, `plan-sync.sh`) already had a symlink-traversal write bug caught by adversarial review before shipping; widening their write surface from `~/.claude/plans/` to arbitrary repo paths is exactly the kind of change that needs the same scrutiny, not an add-on afterthought.

So the approach below adds a deliberate, user-invoked **`/ki-plan promote` lifecycle subcommand** and upgrades the existing hooks' shared state to a secure versioned contract. The hook still does not choose, place, or write a governed repository plan; it records authenticated session provenance that promotion can validate before making a judgment-led copy.

## Current state

- `hooks/plan-stamp.sh` now writes secure v1 JSON state with the exact version, session id, resolved scratch path, and physically resolved hook-event working directory needed by both consumers. `plan-sync.sh` validates that record and temporarily retains safe read compatibility with legacy plaintext pointers; `/ki-plan promote` rejects legacy state because it lacks repository provenance.
- The hooks now enforce a bounded session allowlist, a physically jailed current-user-owned `.state` directory with no shared write bits, stale-state invalidation, JSON-quoted YAML, exact-target scratch replacement, exclusive state publication, and state-record freshness before sync commits. Focused tests deterministically exercise the symlink-to-directory and state-change races found by adversarial review.
- Claude Code skills support `${CLAUDE_SESSION_ID}` substitution in `SKILL.md`; Claude Code replaces it with the current session identifier before the skill content reaches the model. Hook JSON's `session_id` is the same current-session identifier, so the resolved substitution selects the state file written by `plan-stamp.sh`. Supporting reference files read later are ordinary files, so the substitution must appear in the always-loaded `SKILL.md`, not only in `references/lifecycle.md`.
- The installed skill directory is `ki-plan`, so its explicit slash invocation is `/ki-plan`; `/plan` was the name of the former custom command and is not an installed alias.
- `ki-plan`'s `new` subcommand already carries the plan-format judgment, but its existing id allocation trusts the index alone and its preflight permits a `[plans] path` override. Promotion v1 deliberately narrows the write surface to the default physical `<git-root>/docs/plans`, allocates from the union of valid index and on-disk ids, and refuses drift, malformed ids, duplicates, symlinked path components, or an existing destination.
- Promoted plans are independent in v1: `blocks: —` and `blocked-by: —`. Promotion will not make reciprocal edits to other active plans; dependency wiring remains an explicit later plan edit after the new artifact exists and passes audit.
- Hooks are registered via `skills/keystone/ki-bootstrap/scripts/link-hooks.ts`'s `HOOK_NAMES`/`HOOK_PAIRS`, merge-patched into `~/.claude/settings.json` under `hooks.PostToolUse` as `{matcher, hooks:[{type:'command', command, timeout:5}]}`. No new entry is needed here since no new hook script is being added.
- Claude Code's scratch `plansDirectory` and the governed repository destination are separate boundaries. Promotion v1 supports only the hooks' default `$HOME/.claude/plans` scratch root and the repository's default `<git-root>/docs/plans` destination; it does not honor either a Claude Code scratch override or a KI `[plans] path` override.
- The promotion lifecycle, runtime coverage, catalogue, and hook documentation now encode the reviewed transaction. Repository-wide tests and audits pass. An isolated Claude CLI smoke fixture reached the runtime with an explicit session id but correctly had no access to the user's authentication (`Not logged in`, zero API turns and zero cost); credentials were not copied into the fixture. The remaining closure gate is therefore an authenticated interactive Claude Code `/ki-plan promote` smoke test.

## Steps

1. ✓ Research the deliberate-promotion boundary: keep theme, ROADMAP linkage, canonical-section mapping, and repository writes in `/ki-plan promote`, not an unattended `ExitPlanMode` hook; confirm the real `/ki-plan` invocation and Claude Code's `${CLAUDE_SESSION_ID}` substitution in always-loaded `SKILL.md`.
2. ✓ Adversarially review the initial design and lock v1 scope: default scratch and repository plan directories only; versioned JSON provenance; independent promoted plans; clean-audit precondition; union id allocation; physical component validation; no fallback and no clobber.
3. ✓ Upgrade `hooks/plan-stamp.sh` and `hooks/plan-sync.sh` to the secure v1 state contract:
   - Accept only session ids matching the bounded filename-safe allowlist `^[A-Za-z0-9][A-Za-z0-9_-]{0,127}$`.
   - Resolve `$HOME/.claude/plans`; create `.state` only beneath that real root, then require `.state` to be a real non-symlink directory whose physical parent is the plans root.
   - Once the session id and state jail are safe, atomically invalidate that session's previous state before any later stamp validation can reject the event, so a failed `ExitPlanMode` cannot leave a stale plan promotable.
   - Validate the hook-event `cwd` as an absolute existing directory and store its physical path in v1 JSON alongside `version: 1`, the validated session id, and the resolved scratch path. Write the state atomically through a temp file inside the safe `.state` directory.
   - Render the scratch frontmatter's display `cwd` as a JSON-quoted string, which is also a valid YAML scalar; never interpolate raw hook input into YAML.
   - Make `plan-sync.sh` consume and validate v1 JSON while retaining safe, containment-checked read support for a legacy one-line plaintext pointer. Reject malformed JSON rather than misclassifying it as legacy.
4. ✓ Extend `hooks/plan-stamp.test.ts` and `hooks/plan-sync.test.ts` around the state jail, stale-state invalidation, session allowlist, JSON schema/provenance, quoted display cwd, malformed JSON, and legacy sync-only compatibility while retaining every existing traversal, progress, and idempotence regression.
5. ✓ Replace the initial `ki-plan` prose with the reviewed promotion transaction in `SKILL.md` and `references/lifecycle.md`:
   - Keep `${CLAUDE_SESSION_ID}` in always-loaded `SKILL.md`, reject an unresolved or unsafe value, consume v1 JSON only, require its session id to match, and validate its scratch path and physical hook-event cwd. Reject plaintext legacy state, malformed JSON, absent state, wrong-repository provenance, and every fallback-selection strategy.
   - Require a clean read-only `ki:plans:audit` before choosing an id or destination. Stop on any FAIL or WARN and on index/on-disk drift, a malformed id, or a duplicate id; do not repair unrelated plan state during promotion.
   - Support only the default physical `<git-root>/docs/plans`. Validate the git root, `docs`, `plans`, theme, and destination components in order: each existing component must be a real non-symlink path physically contained by the git root; theme and filename components must match their safe grammars and contain no separator; create missing directories only after all read-only gates pass.
   - Allocate `<NNN>` as max plus one over the union of valid README index ids and valid on-disk plan filename/frontmatter ids. Set `blocks: —` and `blocked-by: —`; do not edit any other plan for reciprocal dependencies.
   - Require the destination to be absent by `lstat` semantics, including no dangling symlink. Re-resolve every path component and recheck the id union, clean audit, and destination immediately before an exclusive/no-clobber write; abort on drift.
   - Preserve the source scratch and state pointer, write the plan and index/graph consistently, and run the plan audit again. If the new transaction does not audit cleanly, roll back only its new plan/index changes and report the failure.
6. ✓ Clean up the surrounding contract in `hooks/README.md`, `docs/guides/user-guide/skill-catalogue.md`, and `docs/decisions/references/runtime-feature-coverage.md`: document the v1 JSON/legacy boundary; distinguish the portable governed-plan artifact from Claude-Code-only Plan Mode discovery; use `/ki-plan`; and present lifecycle verbs in one consistent rubric-compliant order.
7. Run the live authenticated Claude Code `/ki-plan promote` success and rejection smoke test. Focused hook tests, plan/skill/authoring audits, Markdown checks, the full repository test suite, and two adversarial reviews are complete. The isolated unauthenticated CLI attempt made no model call and no repository change; keep the plan `in-progress` until the runtime-only smoke test passes.

## Files touched

- `skills/process/ki-plan/SKILL.md`
- `skills/process/ki-plan/references/lifecycle.md`
- `hooks/README.md`
- `hooks/plan-stamp.sh`
- `hooks/plan-stamp.test.ts`
- `hooks/plan-sync.sh`
- `hooks/plan-sync.test.ts`
- `docs/guides/user-guide/skill-catalogue.md`
- `docs/decisions/references/runtime-feature-coverage.md`

## Verify

- **State jail and freshness:** accept the safe allowlist boundaries and reject empty, dotted, separated, overlong, or punctuation-bearing session ids; reject a symlinked or displaced `.state`; confirm a rejected stamp removes prior state for that safe session; confirm temp/atomic writes remain inside the real state directory.
- **JSON provenance and display safety:** assert the exact v1 keys and values, the resolved scratch path, and physical hook-event `cwd`; exercise spaces, quotes, `:`, `#`, and newline-bearing hostile input and confirm the stamped frontmatter remains parseable YAML with one quoted scalar. Confirm promotion uses JSON provenance rather than trusting editable scratch frontmatter.
- **Legacy boundary:** confirm `plan-sync.sh` accepts a safe legacy plaintext pointer and still applies progress, while rejecting malformed JSON; confirm `/ki-plan promote` rejects both legacy and malformed state without reading another file or writing to the repository.
- **Scratch containment and wrong root:** retain outside-root, traversal, missing, and symlink scratch cases; add a valid v1 state whose physical `cwd` belongs to another repository and confirm promotion stops with no plan/index changes.
- **Clean audit and id union:** make the pre-promotion plan audit fail or warn and confirm promotion stops; cover index-max greater than disk-max and disk-max greater than index-max; reject malformed, duplicate, and filename/frontmatter/index-drift ids before allocation.
- **Destination jail and no clobber:** reject separators or traversal in theme/slug, symlinked `docs`, `plans`, or theme components, a destination regular file, a destination symlink, and a dangling destination symlink. Simulate a destination or id appearing between selection and write and confirm the immediate recheck aborts rather than overwriting or reallocating silently.
- **Successful promotion:** from a valid current-session v1 record and clean default `docs/plans`, confirm theme and ROADMAP judgment, lossless section mapping, independent dependency fields (`blocks: —`, `blocked-by: —`), an exclusively created destination, correct index/graph update, untouched scratch/state, and a clean post-promotion plan audit.
- **Regression and contract:** run `bun hooks/plan-stamp.test.ts`, `bun hooks/plan-sync.test.ts`, `bun run ki:plans:audit`, `bun run ki:skills:audit`, and `bun run ki:authoring:audit`; confirm `/ki-plan` help/catalogue/runtime claims use the same lifecycle order and that existing `new`, `execute`, `done`, and `status` behavior is unchanged outside the narrowed default repository destination.

## Dependencies / blocks

No plan dependency. Runtime dependency for `promote`: Claude Code skill substitution plus the installed v1 `plan-stamp.sh` hook using the default `$HOME/.claude/plans` scratch directory. The governed plan format remains a KI-owned portable artifact; Plan Mode discovery and its provenance bridge are Claude-Code-specific.

## Update — direction change (2026-07-16)

A live check found that `${CLAUDE_SESSION_ID}` substitution in `SKILL.md` and the `plan-stamp.sh` state serialization both work, but the runtime does **not** fire the `PostToolUse(ExitPlanMode)` hook on the Claude Code SDK / editor-extension surface — only the interactive CLI does. So Step 7's "live authenticated smoke test" cannot be met on that surface; it was never an auth problem. Rather than harden the bridge further, the decision is to make `ki-plan` **repo-first**: plans are authored via `new` straight into `docs/plans/`, native Plan Mode's `~/.claude/plans/` scratch file is never canonical, and `promote` is demoted to an optional Claude-Code-CLI-only convenience. This removes the hook dependency and is portable to Codex (which has no Plan Mode). `ki-plan`'s `SKILL.md` now records this stance ("Planning is repo-first"). This plan stays `in-progress`; full rescoping/closing — and any trimming of the `promote` procedure in `lifecycle.md` — is deferred until the in-flight `ki-plans` → `ki-project-roadmap` rename lands, to avoid colliding with that work.
