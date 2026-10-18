---
id: KI-HARNESS-GOV-198
area: GOV
title: Reply forms
kind: deliver
purpose: governance
project: ways-of-working
component: change-management
status: done
blocks: []
blocked_by: []
baseline_ref: 737cd4d11a738415bf5c92b16b6eabd3da4b68c8
created_at: 2026-10-16T21:21:46Z
updated_at: 2026-10-18T17:35:03Z
---

# KI-HARNESS-GOV-198: Reply Forms

## Goal

Every thread replies to the owner in one of three named forms: a plain conversational reply by default, the owner report when a unit of work ends, and the coordinator summary with its heading, banner and checkpoint machinery only in a coordinating thread. A conversational thread can do bounded work directly without being pushed into coordinator forms.

## Context

Kris asked on 2026-10-16, as relayed in the `ways-of-working` thread, for the reporting rules to "explicitly distinguish ordinary conversational replies, completed-work reports, and coordinator summaries", with routine answers kept plain and coordinator checkpoints, marks and banners confined to coordinating threads. The `reporting-forms` run drafted the definitions and every edit in [its report](/Users/krisbrown/workspaces/knowledge-islands/ki-principal/+/_THREADS/ways-of-working/reporting-forms.report.md). Kris agreed the draft under REPLY-FORMS in the [decisions log](/Users/krisbrown/workspaces/knowledge-islands/ki-principal/+/_THREADS/ways-of-working/decisions.md): "Take the recommended option a) for FORMS-AGREE, FORMS-OWNER, UNIT-TRIVIAL, NO-REPLY-BLOCK, CONV-CHECKPOINT, CONVRUN-NARROW (which answers CONVERSATIONAL-RUN), FORMS-PHASE and FORMS-RECORD; withdraw ROLE-REPORT; land the reply forms first as Phase 1a." FORMS-RECORD asked for this one record for the harness edits, separate from the proposed thread-identity record.

Before this change the `ki-coordination` standard said every report to the owner was an owner report, the hook line and output style fired in any session of a declaring checkout without a scope, and the pick-up table gave a conversational thread HOLD and DONE rows.

## Boundary

- In: the report's edits 5.1 to 5.6 in this repository - the `ki-coordination` standard's new Reply forms section and the scoping edits around it, the `ki-coordination` description and body, the banner test, the `ki-delegation` Reporting pointers, the `ki-work-folder` conversational-checkpoint sentence, the two source reviews - and the regenerated hook line, pointer, output style, run-prompt Report paragraph and authority footers.
- Out: the chezmoi edits 5.7 to 5.9 and the ki-principal edit 5.10, which go under REPORTING-FORMS with no record after Kris reviews `chezmoi diff`; the role field and the hook's role gate, which the session-identity Phases 1 and 3 own and which later remove the hook-line scope sentence; a `ki-coordination` rubric item checking conversational replies, which the drafting run left out.

## Current state

Delivered at the resting point recorded under Review.

## Steps

- [x] Add the Reply forms section, with Units of work, Conversational bounded work and Coordinator-only machinery, before Owner report, and answer CONVERSATIONAL-RUN there with CONVRUN-NARROW's wording.
- [x] Scope the Thread types Banner row, Re-anchoring, the Owner report opening, Heading and Reply block bullets, Report forms, Draining and the pick-up table to coordinating threads.
- [x] Scope the `hook-line`, `hook-pointer`, `run-report`, `footer-report` and `output-style` sources.
- [x] Update the `ki-coordination` SKILL.md, the `ki-delegation` Reporting section, the `ki-work-folder` standard and both source reviews.
- [x] Regenerate the surfaces with `ki dev skill generate ki-coordination --write` and pin the scope in the banner and hook tests.

## Files touched

- `skills/change-management/ki-coordination/references/standards-coordination.md`, `SKILL.md`, `references/sources.md`, `scripts/banner.test.ts`
- `skills/governance/ki-delegation/references/standards-background-runs.md`, `references/sources.md`, `assets/run-prompt.md`, `assets/rules-none.md`, `assets/rules-push.md`, `assets/rules-prune.md`, `assets/rules-release.md`
- `skills/governance/ki-work-folder/references/standards-work-folder.md`
- `hooks/coordinator-reminder.sh`, `hooks/coordinator-reminder.test.ts`, `output-styles/ki-coordinator.md`
- `docs/roadmap/_ISSUES.md`, this record

## Verify

`bun run test`, `bunx tsc --noEmit`, and `ki repo audit --skill ki-coordination`, `--skill ki-delegation`, `--skill ki-work-folder` and `--skill ki-work-roadmap`, run sequentially.

## Dependencies / blocks

None in this repository. The chezmoi personal guidance follows after this lands, because it names the Reply forms section.

## Documentation impact

### Decision Records

None: the decision is Kris's REPLY-FORMS answer, quoted in the standard and the decisions log.

### Specifications

None: the standard is the contract and changes in place.

### Guides

None: the website skills guide describes skills by outcome and is unaffected.

### Roadmap

None beyond this record; the session-identity records, when captured, adjust the scope sentences in their later phases.

## Review

### Delivered

The boundary above, from baseline `737cd4d11a738415bf5c92b16b6eabd3da4b68c8`, in the delivery commit that carries this record. Excluded as stated: chezmoi, ki-principal, the role field and gate, and a rubric item.

### Change Summary

The `ki-coordination` standard gains `## Reply forms` with the three forms, the five-criterion unit-of-work test and its one-line exemption, the bound on conversational work, CONVRUN-NARROW's answer to CONVERSATIONAL-RUN and the coordinator-only list. The Banner row, Re-anchoring, Owner report, Report forms, Draining and Picking up now confine the coordinator machinery to coordinating threads; the conversational HOLD and DONE rows leave the pick-up table, replaced by one impossible-combination line. `No reply needed.` stays in completed-work reports only. The hook line opens with a scope sentence, the pointer gains its conversational clause, the run-report and footer sources drop the footer banner for a conversational thread's run report, and the output style opens with its scope paragraph; all are regenerated. `hooks/coordinator-reminder.test.ts` carries the new literal line and pointer, a change the report did not list but the hook test requires.

### Verification

- `bun run test`: 1203 pass, 0 fail.
- `bunx tsc --noEmit`: clean.
- `ki repo audit --skill ki-delegation` and `--skill ki-work-folder`: pass. `--skill ki-skills`: pass with two LONG-3 refresh-cadence warnings on untouched skills.
- `ki repo audit --skill ki-coordination`: four COORD-7 failures and one COORD-9 warning, all in the untouched `+/_THREADS/skill-reviews/` folder. `--skill ki-work-roadmap`: one ITEM-1 failure, the duplicate `KI-HARNESS-GOV-195` that harness-routine raised as GOV-195-DUP. Fleet findings, not failures of this change.

### Outstanding concerns

None in the contract under change. The hook-line scope sentence is interim by design and is removed when the hook's role gate lands in session-identity Phase 3.

### Post-change review

The change meets the Goal in text: every surface a session sees now names the three forms and confines the coordinator machinery. Regression risk is low; the generated-surface test passes, so regeneration keeps the change. Ready for acceptance.

### Mini recap

Reply forms land as Phase 1a in the harness, with the hook and style regenerated and tests green. Learning route: a `ki-coordination` rubric item for conversational replies, if Kris wants one, would be its own record.

## Done

Accepted 2026-10-18 by Kris Brown on the review packet above.

## Discussion

### CONVERSATIONAL-RUN

Kris answered it through CONVRUN-NARROW's option a), so the standard states it under Conversational bounded work rather than as a separate decision: a run and a thread folder named for the checkpoint, a pause through a checkpoint update, and run reports headed `# <thread label> › <run name>` with no mark or footer banner.

### Acceptance

Accepted on 18 October 2026 by the `accept-prune` run of the ways-of-working Project work, under Kris Brown's standing grant recorded in the ways-of-working decisions log, entry "2026-10-18 17:59 BST - owner answers, recap batch" (ACCEPT-AND-PRUNE): "I think anything which is awaiting acceptance can be accepted, and then we can prune anything which is in a state of done". Re-check against `main` at `7d9959dc` before closure: `bun run test` passes, 1255 tests; `bunx tsc --noEmit` passes; `ki dev skill rubric` reports the touched skills' rubrics current and `ki dev skill generate ki-coordination` reports the surfaces in sync; `ki repo audit` passes every skill this record's Verify names, its one failure being the pre-existing `ki-engineering` SCR-11 hook finding outside this record.
