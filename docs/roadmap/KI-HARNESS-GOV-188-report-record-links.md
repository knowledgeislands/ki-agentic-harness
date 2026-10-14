---
id: KI-HARNESS-GOV-188
area: GOV
title: report record links
project: ways-of-working
component: governance
kind: deliver
purpose: governance
status: done
blocks: []
blocked_by: []
baseline_ref: 28d1dc78084533dcb3f21b67e56a89f6acfd4ed3
created_at: 2026-10-14T14:14:15Z
updated_at: 2026-10-14T17:56:46Z
---

# Check That Every Record Identifier in an Owner Report Is a Link

## Goal

A `ki-pmo` rubric criterion checks that every roadmap, checkpoint, Project, Initiative and decision identifier an owner report cites is a Markdown link to its local file, or, for a pruned record, as `[<FULL-ID> (pruned)](https://github.com/<owner>/<repo>/blob/<last revision>/<path>)`, so that the linking rule a coordinating thread already carries stops slipping under load.

## Context

The rule exists twice already: `ki-delegation`'s owner-report standard requires every record to be cited by its full identifier and linked to its local file, and the personal communication rule says the same. During the KI-PRINCIPAL-ECO-013 pilot the ways-of-working coordinating thread still issued owner reports that named roadmap records by identifier without a link. Kris said on 2026-10-14, as received: "Getting a bit frustrated here again because now we're also losing the linking again for roadmap items in the summary output text." The lesson recorded on the pilot record is that the rule holds when a thread is fresh and slips when it is coordinating several agents at once, so a mechanical check belongs in the `ki-pmo` rubric rather than another sentence of prose.

This record is captured from that lesson under the standing instruction of 2026-10-14 to create no new feature records except items Kris asks for; the pilot-lessons brief asked for a single horizon-next record if the lesson needed a harness change. Capturing it adopts nothing beyond the horizon: planning and delivery wait for Kris.

## Boundary

- In scope: one new mechanical criterion in `ki-pmo`'s rubric items, its context function and fixture tests, the regenerated `rubric.md`, and one sentence in the `ki-pmo` standard naming what the criterion checks and what a pruned record links to.
- Out of scope: `ki-delegation`'s owner-report standard, which already states the rule; any checkpoint; the format of the report itself beyond the link requirement. The coordinator reminder hook and the output style were added to scope by Kris's LINK-GUARD approval above, which pairs this record with the hook line.

## Requirements

- The criterion reads the owner reports a thread has committed under its `+/_THREADS/<run>/` folder and the thread's checkpoint, finds every work-record, checkpoint, Project, Initiative and decision identifier, and fails when one appears outside a Markdown link.
- A link to a pruned record is accepted in the form `[<FULL-ID> (pruned)](https://github.com/<owner>/<repo>/blob/<last revision>/<path>)`, the last revision being the last commit in which the file existed, usually the parent of the prune commit; a pruned record left as a bare identifier or linked to its missing local file is still a failure. Kris set the form on 2026-10-14, as received: "LINK-FORM / clickable GitHub link to the file at its last revision; KI-HARNESS-GOV-188's check accepts it. Perhaps the link text can be `KI-HARNESS-GOV-188 (pruned)`". The earlier alternative of pointing at the Project note that carries the record is dropped.
- A quoted owner instruction that names a Needs tag, such as `ACCEPT-181`, is not a record identifier and does not trigger the check.

## Current state

Accepted as done on 2026-10-14; see Done. Approved and delivered on 2026-10-14. Kris approved it in the ways-of-working thread, as received: "LINK-GUARD / approve: hook line plus KI-HARNESS-GOV-188 in the harness, link printer in KI-TOOL-KI-CLI-127, output style handed to Rig: chezmoi". The harness part is this record and the hook line; the link printer belongs to `tools-ki` under KI-TOOL-KI-CLI-127 and the output-style deployment to Rig through chezmoi. Delivered on harness `main` from baseline `28d1dc78` with every gate passing. Awaiting review. On the same day Kris settled the pruned-record form, as received: "LINK-FORM / clickable GitHub link to the file at its last revision; KI-HARNESS-GOV-188's check accepts it. Perhaps the link text can be `KI-HARNESS-GOV-188 (pruned)`"; the standard, the hook line, the output style, the rubric item and the fixtures now state that one form and the Project-note alternative is dropped.

## Steps

- [x] Decide which identifier grammars the criterion matches, importing `ki-work-roadmap:work-identifiers` rather than restating the pattern.
- [x] Add the rubric item, its context function and fixture tests covering a linked identifier, a bare identifier, a pruned record linked as `<FULL-ID> (pruned)` to its last GitHub revision, and a quoted Needs tag.
- [x] Regenerate `rubric.md` and add the sentence to the standard.

## Files touched

- `skills/change-management/ki-pmo/references/` (the standard, sources and rubric items)
- `skills/change-management/ki-pmo/rubric.md` (generated)
- `skills/change-management/ki-pmo/scripts/` (context function, vendored `work-identifiers.ts` and tests)
- `skills/change-management/ki-pmo/SKILL.md` (shared dependency and Mode AUDIT sentence)
- `hooks/coordinator-reminder.sh`, `hooks/coordinator-reminder.test.ts`, `hooks/README.md` and `output-styles/ki-coordinator.md` (the hook line and the output style, under the LINK-GUARD approval)
- `skills/keystone/ki-skills/scripts/internal/remediation-inventory.test.ts` (criterion counts)

## Verify

- `bun run test` passes, including the new fixture tests.
- `bunx tsc --noEmit` passes.
- `ki repo audit --skill ki-pmo` passes in Knowledge Islands Principal, and the new criterion reports the pilot thread's reports correctly.

## Dependencies / blocks

Depended on KI-HARNESS-GOV-187, which made the thread model normative in `ki-pmo` and was accepted as done on 2026-10-14 before this record was delivered. Blocks nothing recorded.

## Documentation impact

### Decision Records

None. The linking rule is already set; this adds a check.

### Specifications

None.

### Guides

One sentence in the `ki-pmo` standard naming the criterion.

### Roadmap

No follow-on record.

## Review

### Delivered

A mechanical `PMO-7` criterion in `ki-pmo`'s rubric reads every thread report `+/_THREADS/<run>/*.report.md` and flags, at WARN level, each full record identifier left outside a Markdown link and each record link whose absolute local target no longer exists, so that a pruned record is linked as `[<FULL-ID> (pruned)](https://github.com/<owner>/<repo>/blob/<last revision>/<path>)` rather than to a deleted file. The identifier grammar is composed from the vendored `ki-work-roadmap:work-identifiers` module, so a work record such as `KI-HARNESS-GOV-187` and a Decision Record such as `ADR-KI-HARNESS-010` are both caught, while a Needs tag such as `ACCEPT-181` or `GOV-187-REVIEW` and a short form such as `GOV-187` are not. Fenced blocks, including the reply block the owner pastes back, are skipped. The standard's Linking records rule, its coordinating-thread practices, the Mechanical boundary, the SKILL.md Mode AUDIT sentence, the sources review, the regenerated rubric, the coordinator reminder hook line and its tests and README, and the `ki-coordinator` output style all state the pruned-record rule.

### Change Summary

- `scripts/rubric/contexts/pmo.ts`: `threadReports`, `recordIdentifiers`, `reportLinkFindings` and `linkOutcomes` add a `links` outcome context; `scripts/shared/work-identifiers.ts` is the vendored copy and `SKILL.md` declares `ki-work-roadmap:work-identifiers`.
- `scripts/rubric/items/threads.ts`: `PMO-7`, mechanical WARN, diagnostic remediation, sourced to `standards-pmo.md#linking-records`; `references/rubric.md` regenerated.
- `scripts/rubric/contexts/pmo.test.ts`: fixtures for a linked identifier, a bare identifier beside a quoted Needs tag, a pruned record linked as `<FULL-ID> (pruned)` to its last GitHub revision, a pruned record linked to its deleted file, a fenced reply block, and a thread folder with no reports.
- `references/standards-pmo.md`: a **Links** practice, the pruned-record sentence and the PMO-7 description under Linking records, and the Mechanical boundary; `references/sources.md` records the review with Kris's words.
- `hooks/coordinator-reminder.sh`, its test and `hooks/README.md`: the reminder line gains the linking sentence; `output-styles/ki-coordinator.md` says a pruned record is linked as `<FULL-ID> (pruned)` to the GitHub link to the file at its last revision and that the rubric flags unlinked identifiers.
- `skills/keystone/ki-skills/scripts/internal/remediation-inventory.test.ts`: the criterion counts advance by one.

### Verification

`bun run test` 1149 pass, 0 fail; `bunx tsc --noEmit` clean; `bun test hooks/coordinator-reminder.test.ts skills/change-management/ki-pmo/scripts/banner.test.ts` 19 pass; `ki repo audit --skill` for `ki-pmo`, `ki-delegation`, `ki-work-roadmap` and `ki-authoring` pass; `ki-skills` and `ki-repo-harness` pass with the pre-existing warnings only, two `ki-skills` sources past refresh cadence and two `ki-diagrams` DIAG-4 freshness warnings on the skill map and skill graph. `ki repo audit --skill ki-pmo --repo ki-principal` runs PMO-7 against the Capital: of the 67 reports under `+/_THREADS/ways-of-working/`, 46 carry a finding, 38 unlinked-identifier lines and 21 missing-target lines, the missing targets being records pruned since the report was written; the other thread folders show the same pattern and none was changed.

### Outstanding concerns

- A Needs tag shaped like a record identifier, such as `RC-OPS-005` in one ways-of-working report, is matched by the grammar and flagged; the standard asks threads not to shape tags that way, and no registry lookup of repository codes was added.
- The criterion is WARN, not FAIL, because the Capital's existing reports predate the rule and a FAIL would turn every `ki-pmo` audit there red until each thread repairs its own reports; raising it to FAIL is one word in `threads.ts` once the reports are clean.
- Reports in other threads' folders carry findings and were not fixed, as the task set.
- The decisions log and checkpoints are not scanned: the log is in the owner's words and the checkpoint is `ki-checkpoint`'s.

### Post-change review

The check lives where the lesson said it should, in the rubric rather than in another sentence of prose, and every surface that states the linking rule now states the pruned-record case in the same words. The grammar is imported, not restated, so a change to `ki-work-roadmap:work-identifiers` flows through the shared-module drift check.

### Mini recap

PMO-7 flags unlinked record identifiers and dead record links in thread reports; the hook line, standard, output style and README say a pruned record is linked as `<FULL-ID> (pruned)` to the GitHub link to the file at its last revision; the Capital's existing reports show the slip the lesson described.

## Done

Accepted 2026-10-14 by Kris Brown on the review packet above, in Kris's words: "GOV-188-REVIEW / accept KI-HARNESS-GOV-188 as done on its review packet". The link check's level was settled by Kris the same day, as received: "LINK-LEVEL / keep the link check at warning; raise it to failure once this thread's reports are repaired", so PMO-7 stays WARN at acceptance. The Verify gates were re-run at acceptance: `bun run test` 1151 pass, 0 fail; `bunx tsc --noEmit` clean; `ki repo audit --skill` for `ki-pmo`, `ki-work-roadmap` and `ki-authoring` pass in this repository; and `ki repo audit --skill ki-pmo --repo` Knowledge Islands Principal reports `ki-pmo` at WARN with no failure, PMO-7 flagging the unlinked identifiers and dead record links in the `ways-of-working` thread reports as the criterion intends. The same Capital run shows five `ki-checkpoint` failures on other threads' checkpoints, a fleet finding outside this record's scope and untouched here.

## Discussion

### Why a rubric criterion and not more prose

The owner-report standard already says it, and the thread still missed it under load. A mechanical criterion gives the thread's own audit a place to catch the slip before Kris does, and gives Wave F a measure of whether the coordinating threads keep to it.

### Raising PMO-7 to FAIL

PMO-7 is WARN because the Capital's existing reports predate the rule. Kris set the sequence on 2026-10-14, as received: "LINK-LEVEL / keep the link check at warning; raise it to failure once this thread's reports are repaired". Once the `ways-of-working` thread's reports are repaired, a later run changes the one word in `threads.ts` to FAIL and regenerates the rubric; that change is not part of this record.
