---
id: KI-HARNESS-GOV-188
area: GOV
title: report record links
project: ways-of-working
component: governance
kind: deliver
purpose: governance
horizon: next
status: draft
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-10-14T14:14:15Z
updated_at: 2026-10-14T14:14:15Z
---

# Check That Every Record Identifier in an Owner Report Is a Link

## Goal

A `ki-pmo` rubric criterion checks that every roadmap, checkpoint, Project, Initiative and decision identifier an owner report cites is a Markdown link to its local file, or, for a pruned record, to the Project note that carries its substance or to its last Git revision, so that the linking rule a coordinating thread already carries stops slipping under load.

## Context

The rule exists twice already: `ki-delegation`'s owner-report standard requires every record to be cited by its full identifier and linked to its local file, and the personal communication rule says the same. During the KI-PRINCIPAL-ECO-013 pilot the ways-of-working coordinating thread still issued owner reports that named roadmap records by identifier without a link. Kris said on 2026-10-14, as received: "Getting a bit frustrated here again because now we're also losing the linking again for roadmap items in the summary output text." The lesson recorded on the pilot record is that the rule holds when a thread is fresh and slips when it is coordinating several agents at once, so a mechanical check belongs in the `ki-pmo` rubric rather than another sentence of prose.

This record is captured from that lesson under the standing instruction of 2026-10-14 to create no new feature records except items Kris asks for; the pilot-lessons brief asked for a single horizon-next record if the lesson needed a harness change. Capturing it adopts nothing beyond the horizon: planning and delivery wait for Kris.

## Boundary

- In scope: one new mechanical criterion in `ki-pmo`'s rubric items, its context function and fixture tests, the regenerated `rubric.md`, and one sentence in the `ki-pmo` standard naming what the criterion checks and what a pruned record links to.
- Out of scope: `ki-delegation`'s owner-report standard, which already states the rule; the coordinator reminder hook; the output style; any checkpoint; the format of the report itself beyond the link requirement.

## Requirements

- The criterion reads the owner reports a thread has committed under its `+/_THREADS/<run>/` folder and the thread's checkpoint, finds every work-record, checkpoint, Project, Initiative and decision identifier, and fails when one appears outside a Markdown link.
- A link to a pruned record is accepted when it points at the Project note that carries the record's substance or at a Git-revision locator of the record's last committed state; a bare identifier for a pruned record is still a failure.
- A quoted owner instruction that names a Needs tag, such as `ACCEPT-181`, is not a record identifier and does not trigger the check.

## Current state

Draft at horizon Next. Captured on 2026-10-14 from the pilot lesson; not yet planned.

## Steps

- [ ] Decide which identifier grammars the criterion matches, importing `ki-work-roadmap:work-identifiers` rather than restating the pattern.
- [ ] Add the rubric item, its context function and fixture tests covering a linked identifier, a bare identifier, a pruned record linked to its Project note or Git revision, and a quoted Needs tag.
- [ ] Regenerate `rubric.md` and add the sentence to the standard.

## Files touched

- `skills/change-management/ki-pmo/references/` (the standard, sources and rubric items)
- `skills/change-management/ki-pmo/rubric.md` (generated)
- `skills/change-management/ki-pmo/scripts/` (context function and tests)

## Verify

- `bun run test` passes, including the new fixture tests.
- `bunx tsc --noEmit` passes.
- `ki repo audit --skill ki-pmo` passes in Knowledge Islands Principal, and the new criterion reports the pilot thread's reports correctly.

## Dependencies / blocks

Depends on KI-HARNESS-GOV-187, which makes the thread model normative in `ki-pmo` and is awaiting review; this record edits the same standard and should follow it. Blocks nothing recorded.

## Documentation impact

### Decision Records

None. The linking rule is already set; this adds a check.

### Specifications

None.

### Guides

One sentence in the `ki-pmo` standard naming the criterion.

### Roadmap

No follow-on record.

## Discussion

### Why a rubric criterion and not more prose

The owner-report standard already says it, and the thread still missed it under load. A mechanical criterion gives the thread's own audit a place to catch the slip before Kris does, and gives Wave F a measure of whether the coordinating threads keep to it.
