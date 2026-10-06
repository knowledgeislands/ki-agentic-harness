---
id: KI-HARNESS-GOV-100
area: GOV
title: Report push as action
theme: governance-consistency
horizon: now
status: done
blocks: []
blocked_by: []
baseline_ref: 564d2d1b62583c051b34f1593d5812023fe4aafd
created_at: 2026-09-26T12:39:00Z
updated_at: 2026-10-06T21:19:43Z
---

# KI-HARNESS-GOV-100: Report push as action

## Goal

A session reports what it did rather than what the shared branch currently looks like, so that a handoff statement does not become false through someone else's action.

## Context

Raised by `apps-observatory` on 2026-09-26. Two commits were made there under the standing rule that an agent never pushes unprompted, and both recaps reported them as unpushed - true at the time, and verified against `git` rather than recalled.

By the next recap both were on `origin/main`. `git reflog show origin/main` recorded pushes at 2026-09-24 09:16 and 2026-09-25 15:15, and `git ls-remote` confirmed the remote tip. Neither push was mine. A peer writer in the same checkout committed twice and pushed, carrying my commits with theirs, as a push of a shared branch necessarily does.

Nothing was damaged and no rule was broken by either party: the peer pushed their own work, and a push takes the branch, not a selection of commits. What broke was the truth value of a handoff statement. "Committed, not pushed" was a claim about a shared ref that a third party can change without touching my work, and it decayed silently between two recaps of the same session.

## Boundary

In scope: the wording in `ki-git` and `ki-recap` that reports push state, so that both phrase it as an action this session took or did not take at a named revision, never as a current fact about a shared ref.

Out of scope: the standing no-push rule itself, which worked exactly as intended; concurrent-writer policy, which `ki-git` already governs; the peer's commits, which were legitimate; any change to the recap grounding helper, a new rubric item, or a rubric criterion (the `HYGIENE` guidance wording is in scope only so that Verify item 3 holds); and the completion banner's conditions.

## Current state

`skills/governance/ki-git/references/standards-git.md:51` already ends: "Report publication as an action taken or not taken; do not treat a shared ref's current position as durable session-owned state" (landed in `f9dbcd90`). It does not tie the action to a revision. `:109` still says "the unpushed commit", a positional phrase. `skills/change-management/ki-recap/references/standards-session-recap.md` has no push-reporting instruction in `## 2. Summarise` or `## 3. Surface what is outstanding`, and `:139` opens "An unpushed commit does **not** block the banner", again positional. Neither `scripts/recap-grounding.ts` nor `scripts/internal/checkpoint-handoff.ts` reads remote or upstream state, so no code asserts push state. The `ki-git` publication rubric (`scripts/rubric/items/publication.ts`) judges authority, not phrasing, and is unchanged.

## Steps

- [x] `standards-git.md:51`: replace the final sentence with: report publication as an action at a revision, for example "this session did not push; local `main` at `abc1234`" or "pushed `abc1234` to `origin/main`", never as a current fact about a shared ref such as "this is unpushed". A shared ref moves under any writer with access, so its position is true only when checked and is re-checked rather than carried forward.
- [x] `standards-git.md:109`: reword "If the unpushed commit captured unrelated work" to "If a commit this session has not pushed captured unrelated work".
- [x] `standards-session-recap.md` `## 2. Summarise`: add one sentence applying the `ki-git` rule: state push state as this session's action at the named local `HEAD` (pushed, or not pushed by this session), never as "unpushed" or "the remote is behind"; a peer may push the shared ref between two recaps, and Git grounding does not make that position durable.
- [x] `standards-session-recap.md:139`: reword "An unpushed commit does **not** block the banner" to "A commit this session has not pushed does **not** block the banner".
- [x] `skills/governance/ki-git/scripts/rubric/items/hygiene.ts`: in the hygiene guidance, reword "before rebuilding an unpushed commit" to "before rebuilding a commit this session has not pushed", then regenerate `references/rubric.md` with `ki dev skill rubric ki-git`. Only the guidance text changes; no criterion, outcome or item code moves.
- [x] Run the verification below.

## Files touched

- `skills/governance/ki-git/references/standards-git.md`
- `skills/change-management/ki-recap/references/standards-session-recap.md`
- `skills/governance/ki-git/scripts/rubric/items/hygiene.ts`
- `skills/governance/ki-git/references/rubric.md` (regenerated)

## Verify

1. `standards-git.md` states push reporting as an action taken or not taken at a named revision and explains why a shared ref's position is not carried forward.
2. `standards-session-recap.md` instructs a recap to report push state the same way, with the revision named, and cites `ki-git` as the owner rather than restating the full rule.
3. `git grep -n -i unpushed -- skills/governance/ki-git skills/change-management/ki-recap` returns no positional claim about a shared ref.
4. The only rubric change is the `HYGIENE` guidance wording in `hygiene.ts` and its regenerated copy in `references/rubric.md`; no criterion, outcome, item code or test changes, and `ki dev skill rubric ki-git` reports the regenerated rubric in sync.
5. Added text uses British English and ASCII hyphens only; focused audits report no new finding in either file.
6. `bun run test` and `bunx tsc --noEmit` pass.

```bash
git grep -n -i unpushed -- skills/governance/ki-git skills/change-management/ki-recap
bun run test
bunx tsc --noEmit
ki dev skill rubric ki-git
ki repo audit --skill ki-git --progress never
ki repo audit --skill ki-skills --progress never
ki repo audit --skill ki-authoring --progress never
```

## Dependencies / blocks

`blocked_by` and `blocks` are empty by intent. The central rule already landed in `f9dbcd90`; this record completes it with the revision and the recap instruction.

## Documentation impact

### Decision Records

None. The publication-authority rule is unchanged; only its reporting form is sharpened.

### Specifications

None.

### Guides

None. The website skills-by-outcome guide does not restate Git reporting conventions.

### Roadmap

None.

## Review

### Delivered

Push state in `ki-git` and `ki-recap` is now phrased as an action this session took or did not take at a named revision, never as a current fact about a shared ref. The standing no-push rule, concurrent-writer policy, the recap grounding helper, rubric criteria and the banner's conditions are unchanged. Baseline `564d2d1b62583c051b34f1593d5812023fe4aafd`; plan amendment `42b1d053`; implementation `2de98975`.

### Change Summary

- `skills/governance/ki-git/references/standards-git.md`: the publication-authority paragraph's final sentence now gives revision-bound examples and the re-check rationale (Step 1); the hygiene recovery sentence reads "a commit this session has not pushed" (Step 2).
- `skills/change-management/ki-recap/references/standards-session-recap.md`: `## 2. Summarise` gains the push-reporting instruction, citing `ki-git` by link to `#commit-publication-and-integration-authority` (Step 3); the banner rule reads "A commit this session has not pushed" (Step 4).
- `skills/governance/ki-git/scripts/rubric/items/hygiene.ts` and `references/rubric.md`: the `HYGIENE` guidance wording only (Step 5, added by the plan amendment).
- Deviation in the Verify 4 method. `ki dev skill rubric ki-git` resolves the installed dev-linked harness, which is the shared primary checkout, not this worktree, and `--write` would have written into that shared checkout. The regenerated `rubric.md` was therefore produced by applying the identical guidance substitution, then verified as described below.

### Verification

- `git grep -n -i unpushed -- skills/governance/ki-git skills/change-management/ki-recap`: two hits, `standards-git.md:51` and `standards-session-recap.md:55`, both quoted counter-examples rather than positional claims (Verify 3).
- Rubric sync (Verify 4): the Fable reviewer rendered the worktree's `ki-git` rubric definition through tools-ki's own `renderRubricMarkdown` (`src/core/rubric/render.ts`) and found it byte-identical to `references/rubric.md`. The implementer's independent check imported the worktree's rubric items and found all 33 title, description and guidance strings verbatim in `rubric.md`; with the old `rubric.md` restored it reports the hygiene guidance missing. No criterion, outcome, item code or test changed.
- `bun run test`: 945 pass, 0 fail. `bunx tsc --noEmit`: clean. `bunx biome check .`: exit 0.
- `ki repo audit --skill ki-git --progress never`: PASS. `--skill ki-authoring`: PASS. `--skill ki-skills`: only the pre-existing `LONG-3` refresh-cadence warning. `--skill ki-work-roadmap`: PASS.
- Verify 1, 2 and 5: Steps 1 to 4 applied with every element present, the recap cites `ki-git` rather than restating it, and the added text is British English with ASCII hyphens only.

### Outstanding concerns

None blocking. Run `ki dev skill rubric ki-git` once from the dev-linked primary checkout after it fast-forwards to this delivery, to confirm the literal command reports the rubric in sync. The pre-existing American spelling "serialize" in the same `HYGIENE` guidance is outside this record.

### Post-change review

The goal is met: both skills now ask for the invariant fact, this session's action at a revision, instead of a shared ref's volatile position. Scope held to the planned five Steps across four files plus this record. Regression risk is low, because only prose and one guidance string changed. Independent review by a Fable subagent returned APPROVE WITH CHANGES. Its one should-fix finding was this handoff and the recorded Verify 4 evidence, both done here. Its two nits were left as they stand: the recap instruction runs to two sentences, and "serialize" is pre-existing. Ready for acceptance.

### Mini recap

Delivered revision-bound push reporting in `ki-git` and `ki-recap`, after a plan amendment that closed the Verify grep gap. All gates pass. The rubric was verified by an equivalent render rather than the literal dev command. Learning route: `ki dev skill rubric` cannot verify a worktree, so the harness `AGENTS.md` toolchain note could say how to regenerate a rubric from a worktree; that is offered for `ki-next` capture, not promoted here.

## Done

Accepted 2026-10-06 by Kris Brown on the review packet above.

## Discussion

### Decision

`ki-git` and `ki-recap` phrase push state as an action taken at a revision, never as a current shared-ref fact. Decided by the Fable reviewer under delegated autonomy, reversible. This resolves the pickup checkpoint's open question: the recap procedure does need its own explicit instruction, because its banner text and outstanding-work section are where positional phrasing reappears.

### Scope re-check - 2026-10-06

The record is already narrowed to what `f9dbcd90` left: the revision-bound wording and the recap instruction. At `e30948ad` none of the four Steps has landed. One gap in the plan: Verify item 3 greps the whole `ki-git` skill, which also matches "an unpushed commit" in the hygiene guidance at `skills/governance/ki-git/scripts/rubric/items/hygiene.ts:22` and its generated copy in `references/rubric.md:75`. No Step covers that text, so Verify item 3 would fail as planned. Amend the Steps through `ki-plan` (reword the hygiene guidance and regenerate the rubric, which also changes Verify item 4) or narrow the grep before implementation starts.

### Plan amendment - 2026-10-06

Resolved the hold below by the first option, at the coordinator's direction and through `ki-plan`: a fifth Step rewords the `HYGIENE` guidance in `hygiene.ts` and regenerates the `ki-git` rubric, Files touched lists both files, the Boundary admits that guidance wording only, and Verify item 4 now expects the regenerated rubric in sync rather than unchanged. Verify item 3's grep is unchanged. The record stays `ready`.

### Implementation hold - 2026-10-06

Not implemented on pickup, because the plan gap recorded in the scope re-check is still open at `a845446a17fb9f18cc4a7c1bc3aeba0c16894ebe`. `git grep -n -i unpushed` still matches the hygiene guidance at `skills/governance/ki-git/scripts/rubric/items/hygiene.ts:22` and its generated copy at `references/rubric.md:75`, so Verify item 3 would fail with the Steps as written. A planning choice is needed through `ki-plan` before delivery: either add a Step rewording that hygiene guidance and regenerating the `ki-git` rubric, which replaces Verify item 4's "rubric unchanged" expectation, or narrow Verify item 3's grep to the two reference files the Steps edit. Status, Steps and baseline are unchanged.

### Pickup checkpoint - 2026-09-27

- Verified delivery candidate: `f9dbcd90` added the action-versus-position reporting rule, still present in [the Git standard’s publication authority section](../../skills/governance/ki-git/references/standards-git.md#commit-publication-and-integration-authority). The central requested rule is not missing and should not be implemented again.
- Remaining: assess whether the recap procedure needs an explicit corresponding instruction or already obtains sufficient guidance from the governing Git policy. No runtime recap-behaviour test or independent acceptance was established by this audit.
- Closure route: this remains unadopted Triage, not an accepted delivery. Use the proper human-approved adoption and review route, or an applicable approved intake disposition; do not mark it done solely because matching wording exists.

Evidence scope: inspected local `main` at `0ad0377a0e7e14b1cd7314bce414d4871b062efc` on 2026-09-27. The read-only probe of `http://127.0.0.1:3100/api/health` could not connect; live tasks, current claims and runtime configuration were not verified. The local Git worktree registry was inspected, not every retained worktree’s contents. Before further implementation, reconcile the current destination branch, linked coordination tasks and retained worktrees where applicable, including reachability, patch equivalence and uncommitted work. Missing evidence does not release ownership or lift a hold. This checkpoint is guidance, not a mechanical execution block or a grant to resume. Lifecycle, checkboxes and ownership remain unchanged; retain any later done record until the principal explicitly selects pruning.

The distinction the guidance currently blurs is between two different facts. _I did not push_ is a statement about this session's actions, is permanently true once true, and is the thing the no-push rule is actually about. _The commit is unpushed_ is a statement about a shared ref's current position, is true only at the moment it is checked, and is not this session's property at all. Recaps have been making the second while meaning the first.

It matters at handoff more than during work. A reader of "two commits are local, unpushed" plans to review before publication and may find publication already happened - which, where a push to `main` triggers a deploy, means the decision the sentence was protecting was taken by someone else while the reader was reading. In this instance CI was the only consequence, and it was already red for an unrelated reason.

Candidate wording for `ki-git`: _Report push state as an action, not a position: "I did not push" rather than "this is unpushed". A shared ref moves under any writer with access, so a claim about its current position is true only when made and must be re-checked, not carried forward._

There is a second-order point worth keeping. Verifying against `git` - which both recaps did - is not sufficient here, because the check was sound and the fact changed afterwards. Grounding protects against stale context; it does not make a volatile fact durable. The only reliable fix is to assert the invariant thing instead.

- [KI-HARNESS-GOV-096](KI-HARNESS-GOV-096-detect-zero-match-generators.md) and this record share a root: a statement that was true when measured, carried forward as though it were a standing fact.
