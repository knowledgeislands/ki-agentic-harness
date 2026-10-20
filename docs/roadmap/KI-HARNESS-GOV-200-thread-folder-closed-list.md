---
id: KI-HARNESS-GOV-200
area: GOV
title: Thread folder closed list
project: ways-of-working
component: governance
kind: deliver
priority: medium
size: m
status: awaiting-review
horizon: now
blocks: []
blocked_by: []
baseline_ref: 7b9ec10cb403dda93c2eec7e5d38c02f939e2178
created_at: 2026-10-15T22:55:39Z
updated_at: 2026-10-20T05:40:24Z
---

# Thread Folder Closed List

## Goal

The `ki-delegation` run packet states the work folder's closed list and the temporary home, one footer line in `assets/run-prompt.md` tells every background agent where temporary output goes and that it writes nothing into the work folder beyond its report, and the `ki-work-package` rubric checks each work folder against its closed list and tidy rules, failing a file kind outside the list and warning on what is due for a tidy, so that work folders stay pruned without relying on each coordinator remembering. It also carries the goal of [KI-HARNESS-GOV-196](KI-HARNESS-GOV-196-scratch-output-in-temp.md), merged here: the `ki-delegation` background-run standard tells every background agent to put screenshots and other scratch output in the launcher's per-run temporary directory, `$TMPDIR/ki-agents/<run>/<name>/`, never in a work folder or a working tree, so that tracked work folders and working trees carry only durable work.

## Context

Kris Brown set the thread folder's contents in the ways-of-working thread on 15 October 2026 (THREADS-CONTENT): "A thread folder holds a closed list, decisions.md and <name>.report.md only; briefs live in the state folder, work products in their owning home, temporary output in the temporary location." The same day Kris set the temporary home (THREADS-TMP-HOME): "Temporary output goes in <primary checkout>/tmp/<run>/<name>/ in the repository the agent works in, ignored and deleted when the run closes or they are superflous to requirements; machine-only scratch may stay in the state folder as <name>.work/. Improve the ways-of-working via whichever skill to ensure that the threads are regularly trimmed back as needed." Kris asked for this record in THREADS-TELL: "Open one ki-agentic-harness record (closed list in the ki-delegation run packet, one run-prompt.md footer line, a ki-coordination rubric item) and one tools-ki record (ki agent launch creates tmp/<run>/<name>/, ki agent close removes it)."

The standards wording for the closed list, the temporary home and the mark-time trim is carried directly, not by this record; this record owns the mechanical parts. Today the ki-coordination rubric runs COORD-1 to COORD-8 in `skills/change-management/ki-coordination/scripts/rubric/items/threads.ts`, none of which reads a thread folder's file list, and `assets/run-prompt.md` names only the report path.

This record was issued as KI-HARNESS-GOV-195, which the Granola record [KI-HARNESS-GOV-195 (pruned)](https://github.com/knowledgeislands/ki-agentic-harness/blob/87da1b26/docs/roadmap/KI-HARNESS-GOV-195-granola-screenshots-markers.md) already held, and was renumbered on 16 October 2026. COORD-9 (`737cd4d1`) now delivers the rubric half: a heuristic warning on a thread folder holding a file outside the closed list. What remains is the run-packet closed list, if the direct wording has not already stated it, and the `run-prompt.md` footer line.

The work model, [GDR-KI-PRINCIPAL-009](https://github.com/knowledgeislands/ki-principal/blob/main/Admin/Governance/Decisions/GDR-KI-PRINCIPAL-009-the-work-model.md) and the [Work Process](https://github.com/knowledgeislands/ki-principal/blob/main/Pillars/Philosophy/Model/Processes/Work%20Process/Work%20Process.md), replaces the thread folder `+/_THREADS/<run>/` with the work folder `+/_WORK/<id>/`, and [KI-HARNESS-GOV-210 (pruned)](https://github.com/knowledgeislands/ki-agentic-harness/blob/08468196/docs/roadmap/KI-HARNESS-GOV-210-work-model-write-in.md) writes it into the harness. Its closed list grows to `work.md`, `decisions.md`, `<name>.report.md`, `briefs/<run>.md` and `design/`, under the `ki-coordination` standard's Pruning the work folder, and briefs move from the state folder into `briefs/`. COORD-9 now checks the work folder against that list. THREADS-CONTENT's "briefs live in the state folder" is superseded by that move; its closed-list principle stands.

Kris Brown made `ki-work-folder` the canonical specification of the work folder on 18 October 2026, taking WORK-FOLDER-OWNER a), read back as "the work-folder skill is the canonical specification; ki-coordination timing and judgement; ki-delegation run side only; ki-work-design graduation; others check in on the four-point contract", and took WORK-FOLDER-CHECKS a) the same turn, "Yep, and the workflow checks we can go with", read back as "audit checks into KI-HARNESS-GOV-200; one new tools-ki record for the close-gate parse, unnumbered `decide`, launch refusal and `ki work message`/`prune`". The closed list, entry points, tidy rules, review area and Messages line shape now sit in the `ki-work-folder` [work-folder standard](../../skills/governance/ki-work-package/references/standards-work-package.md#the-work-folder), now the `ki-work-package` work-package standard,, so the checks belong to that skill's rubric, and COORD-9 moves there from `ki-coordination`.

Kris Brown merged [KI-HARNESS-GOV-196](KI-HARNESS-GOV-196-scratch-output-in-temp.md) into this record on 20 October 2026 under SWEEP-MERGE a), recorded in Knowledge Islands Principal `+/_WORK/ki.ways-of-working/decisions.md` (05:20 BST), because both records edit the same temporary-home sentence and the same `run-prompt.md`. Its rule came from the 5G Emerge Phase 3 coordination work, where Kris said on 16 October 2026: "basically you should be using the temp folder for things like screenshots, not the threads folders", and decided: "Create a Harness work record to add the rule to the ki-delegation background-run standard: screenshots and other scratch output go in the system temp folder, never in a thread folder or repository." Kris adopted it on 20 October 2026 under HARNESS-TRIAGE a) as the launcher's per-run directory, which `ki agent close` empties and removes.

## Boundary

- In: the closed list stated in the run packet's knowledge-file table if the direct wording has not already done so; one `run-prompt.md` footer line naming `<primary checkout>/tmp/<run>/<name>/` for temporary output and saying the agent writes nothing else into `+/_WORK/<id>/`; the ki-coordination rubric item that lists every `+/_WORK/<id>/` folder and flags each file outside the closed list, which COORD-9 delivers as a warning.
- In, under WORK-FOLDER-CHECKS, in the `ki-work-package` rubric, with COORD-9 retired from `ki-coordination` in the same change:
  - FAIL: a file kind outside the closed list in `+/_WORK/<id>/`, including anything in `design/` beyond design notes and their diagram sources and renders;
  - WARN: a report whose queries are all answered in the decisions log; a brief whose run's report has been received; finished work whose folder outlives the mark that closes it; a Messages line that does not take the `- <YYYY-MM-DD> · <TAG> · <sender title>: ...` shape; a `+/_WORK_REVIEW/` folder with no index line, or an index line with no folder; and a decisions-log heading the close gate cannot parse, matched to whatever heading form the tools-ki close-gate record settles.
- In, built by the `threads-fix` run under THREADS-REGRESSION: STRUCTURE-1 fails a retired `+/_THREADS/` or `+/_CHECKPOINTS/` folder, tracked or not, beside an existing `+/_WORK/`, with the work-folder standard's Old checkpoints section saying so; and `ki-recap`'s portable hand-off resolves only `+/_WORK/<id>/work.md`, never a retired folder.
- Out: the launcher creating and removing `tmp/<run>/<name>/`, which [KI-TOOL-KI-CLI-137 (pruned)](https://github.com/knowledgeislands/tools-ki/blob/a22214ee581b73a1f395da88f9a118ad89814bb9/docs/roadmap/KI-TOOL-KI-CLI-137-agent-run-tmp-home.md) owns; clearing any existing thread folder, which each owning thread does at its next mark under THREADS-CLEAR, and moving old thread folders into work folders, which the work-model migration's phase 3 does; the report-heading check that [KI-HARNESS-GOV-175 (pruned)](https://github.com/knowledgeislands/ki-agentic-harness/blob/87da1b26/docs/roadmap/KI-HARNESS-GOV-175-delegation-run-events.md) carries.

## Current state

Checked on 20 October 2026 at `30cbbd1d`.

- The closed list, entry points, tidy rules, review area and Messages line shape live in the `ki-work-package` [work-package standard](../../skills/governance/ki-work-package/references/standards-work-package.md#the-work-folder); `ki-work-folder` was renamed `ki-work-package` in `9e174750`. The background-run standard's run packet section describes the knowledge and runtime split but does not link that closed list.
- The background-run standard still names `<primary checkout>/tmp/<run>/<name>/` as the temporary home. The `ki agent` launcher in tools-ki (`src/core/agent/runs.ts`) now appends a progress-protocol footer that names a per-run temporary directory outside every repository, under the system temporary root, which `ki agent close` empties and removes. The standard and the launcher disagree.
- `assets/run-prompt.md` names only the report path; the launcher's footer, not the skeleton, carries the temporary-output line today.
- COORD-9 in `skills/change-management/ki-coordination/scripts/rubric/items/threads.ts` warns, as a heuristic, on a file outside the closed list, on an answered report and on more than eight open queries. The `ki-work-package` rubric (STRUCTURE, RECORD, LIFECYCLE, BOUNDARY and CONFIG families) reads none of the folder's closed list, tidy rules, Messages lines or review area.
- The THREADS-REGRESSION part is delivered: STRUCTURE-1 fails a retired `+/_THREADS/` or `+/_CHECKPOINTS/` beside `+/_WORK/` (`7d9959dc`), and `ki-recap`'s hand-off resolves only `+/_WORK/<id>/work.md` (`references/standards-session-recap.md`).
- The close gate's heading form is being settled in [KI-TOOL-KI-CLI-152](/Users/krisbrown/workspaces/knowledge-islands/tools-ki/docs/roadmap/KI-TOOL-KI-CLI-152-work-folder-housekeeping-commands.md), in progress: the close gate reads every entry of a decisions log, whatever its heading.

## Steps

- [x] Replace the temporary-home sentence in the background-run standard's run packet section with the launcher's `$TMPDIR/ki-agents/<run>/<name>/`: screenshots and other scratch output go there, never in a work folder or a working tree, and `ki agent close` removes it; keep Kris's 15 October words as the superseded rule and quote the 16 October and 20 October answers that replace it.
- [x] Say how an agent keeps evidence the owner asks for: it copies the file to its owning home deliberately and names it in its report.
- [x] In the background-run standard's run packet section, link the `ki-work-package` closed list rather than restating it, and say that a run writes nothing into `+/_WORK/<id>/` beyond its report.
- [x] Add one footer line to `skills/governance/ki-delegation/assets/run-prompt.md` naming the temporary home and the no-other-writes rule, in the same words as the launcher footer.
- [x] Add a work-folder family to the `ki-work-package` rubric: a FAIL item for a file kind outside the closed list, `design/` included; WARN items for an answered report, a brief whose report has been received, a finished work's folder outliving its closing mark, a malformed Messages line, an unmatched `+/_WORK_REVIEW/` folder or index line, more than eight open queries, and a decisions-log heading the close gate cannot parse.
- [x] Retire COORD-9 from `ki-coordination`, pointing its standard text at the new `ki-work-package` items, and keep the judgment prompt with the item that inherits it.
- [x] Add boundary fixtures for each new item, including a clean folder, a stray file, a stray `design/` file and each tidy case.
- [x] Regenerate the `ki-work-package`, `ki-coordination` and, if its cited text changes, `ki-delegation` rubrics, and update the remediation-inventory test's criteria counts.
- [x] Before landing the FAIL, run `ki repo audit --skill ki-work-package` in the eight territory Capitals and record any stray file as a message to its owning work.

## Files touched

- `skills/governance/ki-delegation/references/standards-background-runs.md`, `assets/run-prompt.md`, and `references/rubric.md` if regenerated
- `skills/governance/ki-work-package/scripts/rubric/items/` (a new work-folder item file and `index.ts`), its rubric context and tests, `references/rubric.md`, and `references/standards-work-package.md` where an item needs a citable anchor
- `skills/change-management/ki-coordination/scripts/rubric/items/threads.ts`, its context and tests, `references/rubric.md`, and the standard's Pruning the work folder section
- `skills/keystone/ki-skills/scripts/internal/remediation-inventory.test.ts`

## Verify

- `bun run test` and `bunx tsc --noEmit` pass.
- `ki repo audit --skill ki-work-package`, `--skill ki-coordination` and `--skill ki-delegation` report no FAIL here.
- `ki dev skill rubric ki-work-package` and `ki dev skill rubric ki-coordination` leave no diff.
- A fixture work folder holding a stray file fails the new item, and a clean folder passes it.
- `ki dev skill rubric ki-delegation` leaves no diff, and `grep -rn 'primary checkout>/tmp' skills/governance/ki-delegation` finds no remaining rule text.

## Dependencies / blocks

- Decided: the launcher's out-of-repository per-run directory is the temporary home, under HARNESS-TRIAGE a) of 20 October 2026; [KI-HARNESS-GOV-196](KI-HARNESS-GOV-196-scratch-output-in-temp.md), which amended the standard to it, is merged into this record under SWEEP-MERGE a).
- Decided: the closed-list item lands as FAIL, as WORK-FOLDER-CHECKS a) set, after the Capitals' census in the last Step has recorded each stray file as a message to its owning work.
- The decisions-log heading check follows [KI-TOOL-KI-CLI-152](/Users/krisbrown/workspaces/knowledge-islands/tools-ki/docs/roadmap/KI-TOOL-KI-CLI-152-work-folder-housekeeping-commands.md); if it has not landed, that one WARN item waits and the rest proceed.

## Documentation impact

### Decision Records

None needed: the owner decisions are recorded in the ways-of-working decisions log, and the work-folder ownership is already in the `ki-work-package` standard.

### Specifications

None: this repository keeps no Specification for the work folder; the standard is the contract.

### Guides

None: no human guide describes the work folder's checks.

### Roadmap

None beyond this record; COORD-12's promotion is [KI-HARNESS-GOV-215](KI-HARNESS-GOV-215-pmo-12-to-fail.md).

## Review

### Delivered

The work folder's closed list and tidy are now checked by a new FOLDER family in the `ki-work-package` rubric, and COORD-9 is retired from `ki-coordination`. The background-run standard, the run-prompt footer and the work-package standard all name the launcher's per-run temporary directory, `$TMPDIR/ki-agents/<run>/<name>/`, in place of `<primary checkout>/tmp/<run>/<name>/`. This also delivers the goal of KI-HARNESS-GOV-196, merged into this record under SWEEP-MERGE.

### Change Summary

- `ki-work-package`: new context `scripts/rubric/contexts/work-folder.ts` and new family `scripts/rubric/items/folder.ts`, wired into the context, the session families and `items/index.ts`.
  - FOLDER-1 (FAIL, with a WARN override): a file outside the closed list, `design/` included. Thread folders under `+/_THREADS/` warn as legacy for the tolerance window.
  - FOLDER-2 (WARN): an answered report. It inherits COORD-9's judgement prompt.
  - FOLDER-3 (WARN): a brief whose report has been received.
  - FOLDER-4 (WARN): a finished work's folder outliving its closing mark.
  - FOLDER-5 (WARN): an unmatched `+/_WORK_REVIEW/` folder or index line.
  - FOLDER-6 (WARN): more than eight open queries.
- `ki-coordination`: COORD-9 is removed. Its awaiting-acceptance cap moves into COORD-3's owner-queue cap. `standards-coordination.md` and `output-styles/ki-coordinator.md` now point at the FOLDER items.
- `ki-delegation`: the temporary-home rule is replaced. Kris's 15 October words are kept as superseded, and the 16 October words and the 20 October HARNESS-TRIAGE adoption are quoted. The rule now says a run writes nothing into `+/_WORK/<id>/` beyond its report, and kept evidence is copied to its owning home and named in the report. `assets/run-prompt.md` gains the launcher's footer line plus the no-other-writes rule.
- The `ki-work-package` closed-list sentence is updated. Rubrics are regenerated, and the remediation-inventory counts are updated (+5 criteria).

### Verification

- `bun run test`: 1349 pass, 0 fail.
- `bunx tsc --noEmit`: clean.
- Focused audits (isolated home): `ki-work-package` PASS, `ki-delegation` PASS and `ki-skills` PASS. `ki-coordination` has FAIL=0; its two COORD-8 warnings come from the isolated home. `ki-work-roadmap` has FAIL=0.
- New fixture tests in `work-folder.test.ts` cover a clean folder (pass), a stray file and a stray `design/` file (fail), the thread legacy warning, answered reports, received briefs, the finished folder, the review index and the query limit.
- `grep -rn 'primary checkout>/tmp' skills/governance/ki-delegation` finds only the superseded quotation and the history in `sources.md`.
- Census of the eight Capitals with the new code:
  - FOLDER-1 fails in Knowledge Islands Principal (`ki.baseline-rollout`, `ki.mac-studio-setup`, `ki.tools-burndown` and `ki.ways-of-working`) and in HNR Principal (`hnr.fourth-white-paper`).
  - Each owning work was sent a FOLDER-CLOSED line in its `messages.md`, committed locally and not pushed.
  - ER, TMX, VA and SI pass. Legal and Personal show only tidy warnings.

### Outstanding concerns

- The decisions-log heading WARN is not built. It must match the heading form settled by [KI-TOOL-KI-CLI-152](/Users/krisbrown/workspaces/knowledge-islands/tools-ki/docs/roadmap/KI-TOOL-KI-CLI-152-work-folder-housekeeping-commands.md), which is awaiting review and not landed. The record's dependency rule lets the rest proceed.
- No separate Messages-line WARN was added. The existing RECORD schema check (`MESSAGE_LINE`) already fails a malformed line, which is stronger than the warning asked for.
- Once the harness is installed, FOLDER-1 will fail the Knowledge Islands and HNR Principal audits until those five folders are tidied.

### Post-change review

The rubric listings name candidates only and never delete. The closed list matches the standard's Closed list section. The thread-folder checks keep COORD-9's old tolerance behaviour.

### Mini recap

The FOLDER family replaces COORD-9, temporary output moves to the launcher's directory, and five Capital work folders have stray-file messages waiting.

## Discussion

Capture only, on Kris Brown's explicit request in THREADS-TELL; adoption, priority and plan belong to this repository. Built in the work-folder rename run of 18 October only as far as the standards: the checks are recorded here and not built, because a new FAIL would fail every territory whose work folders still hold stray files until each is tidied, and because the decision-heading check must match the heading form the tools-ki close-gate record has yet to settle. Kris named THREADS-REGRESSION on 18 October 2026, in the ways-of-working decisions log under "owner answers, recap batch", after `ki agent` copied a chezmoi run report into `+/_THREADS/chezmoi/` in Knowledge Islands Principal at 09:19 BST; the launcher side is in [KI-TOOL-KI-CLI-150 (pruned)](https://github.com/knowledgeislands/tools-ki/blob/4f8d97d2/docs/roadmap/KI-TOOL-KI-CLI-150-work-folder-entry-points.md). The STRUCTURE-1 failure fires only where `+/_WORK/` exists, so territories still in the tolerance window keep their warnings; today only Knowledge Islands Principal holds `+/_WORK/`, and it holds neither retired folder. Still open from that run: `ki-recap`'s `checkpoint <thread>` argument and its `checkpoint-handoff.ts` model keep the checkpoint names, for the work-model migration's phase 5 to rename. Questions for planning: whether COORD-9 should move from a warning to a failure once existing thread folders are cleared; whether an inbox file joins the closed list once the inbox moves into the thread folder, as the background-run standard anticipates; and whether this record and [KI-HARNESS-GOV-175 (pruned)](https://github.com/knowledgeislands/ki-agentic-harness/blob/87da1b26/docs/roadmap/KI-HARNESS-GOV-175-delegation-run-events.md) share one `run-prompt.md` edit.

### Planning answers, 20 October 2026

Kris Brown answered PLANNED-READY on 20 October 2026 in the ways-of-working decisions log, "owner answers on the 03:08 BST send": "the old do need to move to Ready if possible, and we need to move them", taken as a): take the listed answers and mark each record Ready where the readiness checks pass. The two open decisions are recorded under Dependencies / blocks, and the record is Ready.
