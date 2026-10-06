# Recap procedure

_On-demand procedure for `ki-recap`. The kind, scope, and leg summary live in [`SKILL.md`](../SKILL.md) and are already loaded; this file is the full procedure._

## Contents

- [Recap procedure](#recap-procedure)
  - [Contents](#contents)
  - [1. Run the grounding helper](#1-run-the-grounding-helper)
  - [2. Summarise](#2-summarise)
  - [3. Surface what is outstanding](#3-surface-what-is-outstanding)
  - [4. Harvest the learnings, and route each](#4-harvest-the-learnings-and-route-each)
  - [5. Discussion coverage](#5-discussion-coverage)
  - [6. Actions](#6-actions)
  - [7. Route future-work selection to `ki-next`](#7-route-future-work-selection-to-ki-next)
  - [8. Preserve the handoff and compact at the boundary](#8-preserve-the-handoff-and-compact-at-the-boundary)
  - [9. Create a portable checkpoint hand-off](#9-create-a-portable-checkpoint-hand-off)

**Ground every claim in reality, not memory.** Warm in-session context, compaction summaries, and recalled memory entries are hypotheses about state, not evidence of it — concurrent sessions, background processes, and elapsed time all make them stale. Before the recap asserts a checkable fact — a commit landed, a gate passed, a file contains something, a plan is open — check it now (`git log`, re-run the read-only gate, read the file). What cannot be cheaply re-checked, state as recollection ("as of when it ran"), not as fact.

**Set the coverage boundary before checking repository state.** Inventory the material topics, decisions, deliveries, and agreed follow-ups in the entire live thread through this invocation, including work before earlier recaps or compaction and work in other repositories. Use the visible conversation and available carry-forward context for discovery; reconcile each claim against current canonical evidence. A repository-matched transcript is advisory and may be a different concurrent session. If part of the thread is unavailable after compaction or transcript selection is uncertain, identify the missing span and ask for the needed context; do not certify whole-thread completion from a partial inventory.

Treat user messages arriving during work as steering unless they expressly replace or cancel earlier instructions. Before the recap or final handoff, reconcile every visible material message, including decisions made after an earlier summary was drafted. A queued message that could not reasonably have been addressed before the previous response remains live input for the next response; acknowledge and incorporate its still-relevant content rather than treating the intervening summary as closure. Do not infer queue-versus-steer delivery mode solely from timing when the runtime does not expose it. If the message's scope is genuinely ambiguous, state the assumption or ask; do not silently discard either request.

## 1. Run the grounding helper

```bash
bun skills/change-management/ki-recap/scripts/recap-grounding.ts --json --runtime detect
```

(From another repo, use the harness-absolute path, per the "Audit script paths" convention: `bun /path/to/ki-agentic-harness/skills/change-management/ki-recap/scripts/recap-grounding.ts --json`.) Run it separately with each repository path touched by this thread, not only the invocation's working directory. Record which repository each result grounds.

When the runtime does not identify the live session and more than one eligible Claude or Codex session is active for the repository, choose the session explicitly instead of relying on newest modification time:

```bash
bun skills/change-management/ki-recap/scripts/recap-grounding.ts --json --transcript <session-file>.jsonl
```

`detect` is the default. Inside an identified Claude Code session, where the documented `CLAUDE_CODE_SESSION_ID` is set, it selects that session's own `<session-id>.jsonl` from any project directory under the Claude projects root (`CLAUDE_CONFIG_DIR/projects` or `~/.claude/projects`), whichever repository is being grounded. When that transcript is missing, duplicated, or the identity is malformed, it declines transcript evidence with a `transcriptSelection.reason` and never substitutes another session or runtime. A Claude Code runtime without an identity (`CLAUDECODE=1`) searches only the target's Claude project directory. Only when no runtime is identified does `detect` compare the newest repository-matching transcript of both runtimes. Use `--runtime claude` or `--runtime codex` to force one; `--runtime codex` and `--transcript` bypass the live-session locator, and under `detect` a `--transcript` selector searches both runtimes even inside Claude Code. Claude repository candidates live in the target's derived project directory, named by replacing every non-alphanumeric character of its path with `-`. Codex candidates are found recursively below `~/.codex/sessions/` and qualify only when their `session_meta.payload.cwd` resolves to the target repository. Those are helper selection rules, not a definition of the live thread: a thread may operate across repositories without changing its initial `cwd`.

Discovery is bounded. Candidates are listed from directory metadata and inspected newest first; only complete lines within a 64 KiB prefix are read to check eligibility, and discovery stops at the first eligible candidate. At most 256 headers per runtime are inspected. Reaching that limit without a match reports `transcriptSelection.reason: discovery-limit`, which means transcript evidence is unavailable, not absent. Only the selected transcript body is parsed. `transcriptSelection` reports the `method` (`live-session`, `newest-eligible`, `explicit`, or `none`), any `reason`, the number of headers `examined`, and whether the limit was reached.

The selector is a basename, not a path. It must name exactly one eligible regular `.jsonl` candidate; absolute paths, traversal, other extensions, symlinks, files for another repository, and ambiguous duplicate basenames are rejected.

This emits a `repository` object with `available` or `unavailable` status, the physical Git root when available, staged/unstaged/untracked `filesTouched`, a combined staged-and-unstaged `diffStat`, `toolTally`, `highCostCandidates` (repeated identical calls, large-file re-reads), and the exact `ki-work-recap-repository-evidence/v1` marker. The marker records only the resolved repository root, full `HEAD` or `null`, and observed clean/dirty worktree state. On a later run, the helper recovers only a type-valid marker from the selected runtime's helper-output record and reports `transcriptEvidence.status` as `unchanged`, `changed`, or `unavailable`.

The comparison qualifies transcript-derived tool tallies and high-cost suggestions; it never replaces fresh Git checks. A missing, malformed, foreign-repository, unresolvable, or same-commit-dirty marker is `unavailable`, not a guessed result. Local Claude and Codex JSONL is a version-sensitive convenience format; parse failure or no selected transcript is `unavailable`, never transcript completeness. It is a **helper**, not a checker — treat its output as raw signal to combine with warm in-session context, not a verdict.

## 2. Summarise

Before reporting final repository state, apply the `ki-batch` “Batch retention” rule to `+/_BATCHES/` in each repository this thread worked in. Delete only the eligible inactive records under that owner's rule, without another confirmation, then refresh Git grounding and report the exact removals and Git recovery. This maintenance exception does not select work, promote learnings, or prune roadmap items; proposed Actions remain a user checklist.

Using the whole-thread inventory plus each touched repository's `filesTouched` / `diffStat`: state what changed, what was decided, and why — in the order it happened, not a topic reshuffle. Keep it to what a reader picking this up cold would need: no blow-by-blow tool narration. For each material topic, establish whether it was delivered, explicitly declined, superseded, or remains follow-up; do not treat an earlier recap as a terminal boundary.

State push state as this session's action at the named local `HEAD`, as [`ki-git`](../../../governance/ki-git/references/standards-git.md#commit-publication-and-integration-authority) requires: pushed, or not pushed by this session, never "unpushed" or "the remote is behind". A peer may push the shared ref between two recaps, and Git grounding does not make that position durable.

## 3. Surface what is outstanding

**Always check whether everything is committed in every touched repository** — even if the session felt "done", verify the working tree for the files this thread touched (staged, unstaged, and untracked) in each one. If any required `repository.status` is `unavailable`, say which Git evidence is unavailable and do not claim clean, committed, or no-actions status for the whole thread. Uncommitted session work is the most common silently-dropped outstanding item. Files dirty from _other_ threads of work are out of scope (per the stay-scoped rule) — note their existence in one line at most, never enumerate or adopt them.

Then look only for work still open in this thread: uncommitted edits, a failing gate, a decision still open, or an explicitly deferred fix this thread still owns without a durable home. Do not use a recap to inventory repository backlog, peer-repository state, or plausible future work; those are outside the thread and `ki-next` owns future-work selection. **Ground every "uncommitted" or "still dirty" claim in the `filesTouched` from the grounding helper run at the start of _this_ recap, never in a `git status`/`git diff` seen earlier in the conversation** — commits (yours or a concurrent process's) can land between that earlier look and the recap itself, and stale context reads as a false outstanding item. If `transcriptEvidence.status` is `changed` or `unavailable`, describe transcript-derived tool tallies only as historical or omit their recommendation. If meaningful time has passed since step 1 ran, re-run it before finalizing this section.

For each substantive follow-up agreed in the thread, identify the owning repository and its configured local work adapter. Inspect the current canonical roadmap or Stream records for an existing item covering that exact work; verify its ID, path, and lifecycle state rather than trusting a link or recalled identifier. If none exists, use `ki-next`'s bounded Triage capture in that owner, including its audit, deduplication, and issue-ledger rules; capture is not adoption, planning, or implementation. If the owner uses a remote adapter, cannot be accessed, or fails the capture gate, state the exact impediment and leave a `PRESERVE-SESSION-DEFERRAL` Action. Do not create a substitute record in the invocation repository. An explicit user decision that no follow-up is intended, including an external concern they deliberately decline to track, needs no item; merely assigning another owner does not make an agreed follow-up disappear. Apply the house rule:

- Work captured in a roadmap item or Stream, whether newly created or routed to an existing record in this or another repository, is a **recorded deferral**. Name its canonical home and current lifecycle state under what happened or deferred work, not under outstanding or Actions. Unchecked Steps, pending review, and future acceptance belong to that record's lifecycle; they do not keep this thread open. Check current Git and verification evidence separately for an unfinished implementation unit in this thread.
- If this thread agreed to preserve a deferred fix but has not given it a durable home, capture it through `ki-next` where its owner permits local intake. If capture cannot complete, name the blocker and exact owner route; do not manufacture a record for work merely noticed during the recap or explicitly declined by the user.

## 4. Harvest the learnings, and route each

For each dead-end, workaround, or convention discovered this session, load `ki-authoring` and apply its knowledge-promotion convention set — **confirm with the user before writing anywhere durable**.

The standard owns the placement ladder, promotion evidence, and duplicate-reconciliation rule; this procedure only identifies the likely route:

| Learning shape | Route to |
| --- | --- |
| Stable repository convention | Portable `AGENTS.md`, or a runtime file only when it is genuinely runtime-specific |
| Checker, rubric, shared rule, or reusable operation | Its owning skill, standard, reference, agent, or hook — add a criterion only after scanning the relevant catalogue and linter |
| New reusable repository-review concept | The `ki-repo` REVIEW procedure — raise it as a repository-review checklist candidate and offer the canonical update |
| A bounded procedure | An existing appropriate guide, rather than new standing orientation |
| Durable personal fact or user preference | Runtime memory or synchronised personal configuration, according to its scope |
| Deferred work with no home yet | Non-KB: `ROADMAP.md`, or a `ki-plan` if it is multi-step. KB: `Streams/Roadmap/`, or a `ki-plan` if it is multi-step. |

Use `highCostCandidates` from the grounding helper as a starting list, not the full set — warm context surfaces things the helper cannot see (a design dead-end, a rejected approach).

For a repository-review checklist candidate, name the concept and the gap it would close, then ask whether to update the canonical `ki-repo` REVIEW reference. Do not edit the checklist merely because the recap identified the candidate; user confirmation still governs the durable learning write. If approved, preserve that reference's broad-to-narrow structure and reconcile any lower-layer copy or pointer.

### Per-record review mini recap

When `ki-accept` requests a record-scoped recap, do not run or imply a full-session recap. Ground only the record's delivered outputs and verification evidence, then record these H3 parts in a roadmap item's `## Review` section or the equivalent proposal review evidence: **Delivered**, **Change Summary**, **Verification**, **Outstanding concerns**, and **Mini recap**. The summary names the material changes and useful primary paths; verification records concrete commands, outcomes, and the checked evidence revision; concerns hold open questions and further review analysis. The mini recap may name a learning and its proposed route, but it must say that the route is unapproved. User closure of the record sets it Done only; it does not approve a guide, rubric, agent, hook, memory, or other durable learning write.

## 5. Discussion coverage

Reconcile every material point in the thread inventory, whether or not a matrix is shown. Add the matrix after the three recap legs and before Actions when the user asks for coverage or multiple materially distinct discussion points would otherwise be difficult to trace. Omit it for a simple single-topic recap. It is a compact reviewer aid: it summarises conclusions already grounded by the preceding legs; it does not mine unavailable transcripts, classify every conversational turn, or establish transcript completeness.

Immediately before the matrix, state its evidence scope. Rows may draw only on warm in-session context, the selected eligible transcript, and freshly checked repository evidence. Label the matrix **bounded and non-exhaustive** whenever transcript evidence is absent, ambiguous, changed, or otherwise unavailable; do not silently fill gaps from recollection.

Use exactly these short columns, linking canonical records where a durable home exists:

| Discussion point | Owning home | Disposition | Evidence |
| --- | --- | --- | --- |
| <material point> | <canonical record or `—`> | <closed vocabulary> | <fresh check or scoped session evidence> |

Use only this closed disposition vocabulary:

- `delivered` — evidence-backed completed work.
- `captured` — work placed in its durable queue or record. A roadmap item or Stream added during this session is part of what happened, not an Action.
- `deferred` — an agreed deferral awaiting a canonical record, or a recorded pause with a named durable home and return condition.
- `out-of-scope` — a concern explicitly declined as follow-up or never agreed as work for this thread; note material risk without adopting its work.
- `decision-needed` — an unresolved user-owned choice.

Reconcile the matrix with [Surface what is outstanding](#3-surface-what-is-outstanding) and [Actions](#6-actions): an agreed follow-up without a verified durable home, regardless of owner, and every `decision-needed` row remains outstanding and has a corresponding final Action. An agreed but unwritten handoff is `deferred`, not `out-of-scope`; an `out-of-scope` row has no Action. Do not turn a captured record into an Action merely because it is actionable later.

Apply these scenario checks before presenting the matrix:

| Situation | Required result |
| --- | --- |
| Simple single-topic recap | Omit the matrix, but still reconcile its disposition. |
| Multi-topic recap with grounded evidence | Use the four columns and only the closed dispositions. |
| Transcript evidence absent, ambiguous, changed, or unavailable | State the bounded non-exhaustive scope; omit unsupported rows and withhold a whole-thread completion claim if the missing span cannot be recovered. |
| Agreed cross-repository handoff has a verified owner item | Mark it `captured`; its unfinished lifecycle is not a thread Action. |
| Agreed handoff lacks a durable home or a choice remains unresolved | Keep it outstanding and add a reconciled Action. |
| External concern explicitly declined as follow-up | Mark it `out-of-scope` if material; add no Action for the owner's work. |

## 6. Actions

Close the recap with an **Actions** section: a short, concrete, imperative list of only the unfinished work that emerged from this session's steps 3–5 — each item something that could be done right now, with the exact command, file, or artefact named. Do not add generic backlog, peer-repository state, a proposed feature, or a future-work choice merely because it is actionable; those are `ki-next` concerns, not recap actions. Prefix each item with a short, unique, uppercase hyphenated label that names the work (usually two to four words), so the user can respond in chat by label ("do `COMMIT-DOCS` and `FIX-AUTHORING-AUDIT`") instead of restating the action. Do not use arbitrary sequence labels such as `A1`, `A2`, or `A3`; labels are ephemeral recap handles, not roadmap identifiers. Typical entries:

- `COMMIT-SESSION-CHANGES` — Commit (or explicitly discard) the session's uncommitted files — name the paths and suggest the commit message.
- `PRESERVE-SESSION-DEFERRAL` — Create the offered roadmap record or plan for a thread explicitly deferred during this session that has no home.
- `APPLY-LEARNING-ROUTE` — Apply an approved learning route from the knowledge-promotion standard (for example, a repository rule, skill criterion, hook, memory, or personal configuration update).
- `RERUN-FAILING-GATE` — Re-run a gate that was left failing, or finish a mid-change thread.

Decide the Actions list from the grounded evidence before considering the terminal rendering. The completion banner is derived from an empty Actions list, never a goal: do not suppress, downgrade, or reroute a genuine action to make the banner eligible. In particular, reconcile outstanding claims against the grounding helper's current `filesTouched` evidence rather than warm context, and do not call work verified unless the required gate actually ran and passed.

Render the completion banner only when all of these conditions hold together:

1. The grounding helper reports `repository.status: available` and a non-null full `HEAD` for every touched repository. Its `filesTouched` evidence, reconciled against this thread's touched paths, shows no uncommitted session-owned changes. Unrelated dirty work does not count as session work; an unavailable or contested attribution does not count as clean evidence.
2. The whole-thread inventory is sufficiently evidenced, every touched repository's session-owned changes are committed and verified, and steps 3–5 leave no outstanding work, uncaptured agreed follow-up, decision, failing or omitted verification, or other Action. A verified owner item is sufficient for follow-up; its later lifecycle does not fail this condition. An explicit decision not to pursue follow-up needs no item.
3. Every learning harvested in step 4 has a decided route: it was written to its approved durable owner or the user explicitly declined it. A proposed route awaiting confirmation is undecided and blocks the banner.

The banner states current evidence rather than a session event, so two recaps over unchanged `HEAD` values both render it. That repetition is correct and deliberately unguarded: it means a banner withheld under conditions 1–3, or missed in error, is recovered by the next recap at which those conditions hold. A condition on recap history would instead make a miss permanent, because the only route back to eligibility would be doing more work — absurd when the claim being made is that no work remains.

A commit this session has not pushed does **not** block the banner. Pushing is a separate user decision and may trigger deployment. The banner attests only that session-owned paths at the named local `HEAD` values have no uncommitted work and that this thread has no outstanding work or unrouted learning; it does not claim unrelated paths are clean or the remote is synchronised.

When every condition passes, render this five-line frame literally and without colour, ANSI escapes, substituted wording, or improvised art:

```text
╭──────────────────────────────────────────────────╮
│  █▀▀▄ █▀▀█ █▄ █ █▀▀▀   · thread closed           │
│  █  █ █  █ █ ██ █▀▀    · nothing outstanding     │
│  █▄▄▀ █▄▄█ █  █ █▄▄▄   · every learning routed   │
╰──────────────────────────────────────────────────╯
```

Each framed line is exactly 52 terminal display columns. Measure terminal display width by Unicode code point width, not byte length. Keep the frame byte-identical so transcript archives can find completed sessions by searching for `█▄▄▀ █▄▄█ █  █ █▄▄▄`.

Immediately below the frame, render the variable evidence line with three leading spaces:

```text
   <repository-basename> · <seven-character-HEAD> · <YYYY-MM-DD>
```

Use the invocation repository's physical Git root basename, the seven-character abbreviation of its full `HEAD` observed by the same grounding pass, and the recap date. When the thread touched other repositories, follow this line with one plain evidence line per additional repository (`<repository-basename> · <seven-character-HEAD>`); the fixed frame remains unchanged. Evidence lines stay outside the frame and are not padded to 52 columns.

If the Actions list is empty but any banner condition fails, retain a truthful one-line no-actions state that names the numbered condition which blocked the banner, and any material evidence gap behind it; never render a partial or weakened banner. A bare “none” hides the difference between a finished session and one whose completion check did not pass, and leaves the reader no way to tell that the banner was owed. Do **not** perform checklist Actions unprompted; the exception is `ki-next`'s already-authorised, bounded Triage capture for an agreed substantive follow-up. Durable learning writes still require step-4 confirmation.

## 7. Route future-work selection to `ki-next`

Future-work selection is separate from recap. Route to `ki-next` only when the user asks to choose, rank, or defer future work; it is not a Specific action, a standing recap requirement, or an automatic handoff:

1. State the boundary: `ki-next` re-runs the current roadmap audit and treats any recap context as a lead rather than fact.
2. Do not turn candidate work into a recap action, promote an item, create a plan, or write a learning route merely by naming the route. `ki-next` capture is used only for substantive follow-up already agreed in this thread; other selection waits for the user.

Apply these scenario checks when offering it:

| Situation | Required result |
| --- | --- |
| Clean recap | Say “No actions”; do not manufacture a `ki-next` handoff. |
| Future work is merely visible in the repository | Omit it from the recap; it is neither an outstanding thread nor a Specific action. |
| User asks to choose future work | Route to `ki-next`, which re-grounds the roadmap before selection. |
| Deferred work was already parked on the roadmap | Record it as what happened, not outstanding. |
| Learning route is unapproved | Label it as a proposal; neither recap nor `ki-next` writes it. |

## 8. Preserve the handoff and compact at the boundary

The end of a recap is a compaction boundary, not a place to measure headroom. Compaction is the default action there — the recap has just recorded the durable outcome, so the span it summarised is the material the next cycle no longer needs. Do not gate the decision on a context-use percentage or a remaining-headroom figure: no runtime adapter is required to expose one, and a threshold that cannot be read is a rule that never fires.

Identify the next work cycle's scope first. The goal is to reduce active context to the information that cycle needs, not merely to preserve a record of the finished session. Preserve only the scoped digest below, then invoke the documented runtime- or vendor-specific compaction mechanism before beginning `ki-next`, planning, or implementation work. The applicable `ki-tokenomics` runtime adapter owns the mechanism's documented evidence boundary.

Two conditions withhold the default. **Safety:** do not compact in the middle of an active implementation unit, a pending user decision, an unfinished tool operation, or uncommitted work whose recovery information is not yet recorded. **Minimum footprint:** do not compact when no substantive work has entered context since the last compaction. Judge that by work done, not by tokens counted — a recap that runs immediately after a compaction, or a recap followed straight into `ki-next`, compacts once at the later boundary rather than twice across an unchanged span. This floor exists to stop thrashing; it is not licence to defer compaction across real work.

Runtimes differ in what they expose and permit. Current Claude Code and Codex documentation each expose a user-invocable `/compact` command as well as automatic compaction/hook events. A documented user command is not standing agent authority: offer it or obtain the applicable runtime/user approval; do not invoke it autonomously. Where no mechanism can be invoked or authority is unavailable, say so plainly and continue with the digest as the bounded handoff; it is not a substitute for reducing the live context.

Write a carry-forward digest of the recapped span:

```markdown
## Context

<why this span of work happened>

## Next scope

<the next work cycle and the minimum context it needs; omit resolved material that does not inform it>

## Decisions

<decisions made, one line each>

## Files Touched

<paths, from the grounding helper's filesTouched/diffStat>

## Outstanding

<from step 3>

## Learnings Routed

<from step 4, one line per learning: what it was, where it went>

## Keywords

<comma-separated terms for future retrieval>
```

State plainly that this digest is a **carry-forward artefact**, not a context-window reduction. Runtime- or vendor-specific compaction remains the applicable `ki-tokenomics` adapter's boundary; this procedure offers the documented mechanism at the safe recap-to-new-work boundary, with the aim of retaining only the next cycle's scope.

## 9. Create a portable checkpoint hand-off

Run this composition only when the user explicitly invokes `ki-recap checkpoint <thread>`. It is optional and separate from ordinary recap. `ki-recap` supplies grounded source evidence; `ki-checkpoint` remains the sole owner of checkpoint identity, schema, update, resume, and removal.

1. Resolve the physical Git root and expected repository identity. Require the repository to declare `ki-checkpoint`, then run its read-only audit and stop if the capability or target record is invalid.
2. Require the exact human-selected `<thread>` and explicit authority to update it. Resolve only `+/_CHECKPOINTS/<thread>.md`; refuse missing, ambiguous, nested, runtime-derived, or mismatched identity.
3. Ground the hand-off in the current immutable `HEAD`. If required work is uncommitted, require one complete portable patch against that exact baseline; a partial diff, shared working tree, transcript, runtime session, or provider snapshot is insufficient.
4. Require the scoped authority, result destination, and expected verification that the receiving agent needs. Refuse repository mismatch, stale baseline, missing input, or an interrupted prior update without writing; re-ground all evidence before any retry.
5. Invoke the existing `ki-checkpoint` UPDATE procedure with concise reconstruction state and references to durable owners. Never embed a transcript or make the checkpoint the only copy of a decision, accepted work state, patch, or result.
6. Return a hand-off containing repository identity, thread, authority scope, result destination, verification plan, and committed baseline or portable-patch reference. A fresh agent must be able to reconstruct the governed task from those portable inputs without the originating transcript or shared filesystem.

The pure [`checkpoint-handoff.ts`](../scripts/internal/checkpoint-handoff.ts) model exercises this no-write preflight. It is evidence for the procedure, not a host command or a replacement for live repository and checkpoint validation.
