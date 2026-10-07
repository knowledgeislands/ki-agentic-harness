---
id: KI-HARNESS-GOV-135
area: GOV
title: Review governance date provenance
kind: deliver
purpose: upkeep
initiative: platform-foundations
component: keystone
status: cancelled
resolution: merged
resolution_target: KI-HARNESS-GOV-123
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-10-04T10:59:42Z
updated_at: 2026-10-07T20:29:49Z
---

# KI-HARNESS-GOV-135: Review governance date provenance

## Goal

Make repository reviews distinguish an evidenced adoption date, a historical recorded assertion, and the date of the first surviving declaration, without presenting any of them as proof of audited conformance.

## Context

The territory-governance review found a newly added Legal Conformance entry whose date was earlier than the first surviving `.ki.toml` declaration. The new entry was corrected; older recorded dates were preserved as historical assertions rather than silently rewritten. This revealed a reusable review question, not evidence that every old date is wrong.

## Boundary

In scope: one judgment prompt in `skills/keystone/ki-repo/references/mode-review.md` asking what evidence supports each governance or conformance date and what that date actually claims. No rubric item, mechanical check or generated file changes.

Preserve historical claims unless an authorised correction has evidence. Do not backdate newly authored rows from inference, equate surviving Git history with the actual adoption event, or infer verified conformance from a declaration. Unknown or incomplete history should remain explicit.

Out of scope: estate-wide metadata edits, a new date schema, a mechanical backdating checker, and any correction in a receiving repository, which retains local review and acceptance authority.

## Cancelled

Approved by Kris on 2026-10-07 under decision 17 of the state-of-play design, which approved every cancel and merge in the easiest-first delivery plan.

Resolution `merged` into [KI-HARNESS-GOV-123](KI-HARNESS-GOV-123-review-unsettled-source-readings.md): it is another single judgment prompt in the same `mode-review.md`. The scope worth keeping is folded into that record's Boundary and Discussion. It leaves no outstanding change of its own.

## Discussion

### Decision

Add the date-provenance judgment prompt to the `ki-repo` REVIEW checklist under `Repository governance`, with no rubric change. Decided by the Fable reviewer under delegated autonomy, reversible.

### Placement

`Repository governance` rather than `Automated verification`: the prompt judges what a governance record asserts, which `Checklist evolution` places in the narrowest fitting lens, and it needs no tool run as evidence.

### Origin

Captured at the owner's request after the accepted territory-governance work. The date lens is a proposed judgment aid; this Triage record preserves it for review without treating the discussion as approval to change the standard. That approval is now given by the Decision above.
