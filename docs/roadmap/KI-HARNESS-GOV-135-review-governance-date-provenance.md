---
id: KI-HARNESS-GOV-135
area: GOV
title: Review governance date provenance
theme: governance-consistency
horizon: triage
status: draft
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-10-04T10:59:42Z
updated_at: 2026-10-04T10:59:42Z
---

# KI-HARNESS-GOV-135: Review governance date provenance

## Goal

Make repository reviews distinguish an evidenced adoption date, a historical recorded assertion, and the date of the first surviving declaration, without presenting any of them as proof of audited conformance.

## Context

The territory-governance review found a newly added Legal Conformance entry whose date was earlier than the first surviving `.ki.toml` declaration. The new entry was corrected; older recorded dates were preserved as historical assertions rather than silently rewritten. This revealed a reusable review question, not evidence that every old date is wrong.

## Boundary

If adopted, add a concise judgment prompt to the canonical `ki-repo` REVIEW guidance asking what evidence supports each Conformance or governance date and what the date actually claims. Inspect the existing review guidance before choosing exact wording and whether any rubric alignment is necessary.

Preserve historical claims unless an authorised correction has evidence. Do not backdate newly authored rows from inference, equate surviving Git history with the actual adoption event, or infer verified conformance from a declaration. Unknown or incomplete history should remain explicit.

This record does not authorise estate-wide metadata edits, introduce a new date schema or mechanical backdating checker, or implement the proposed review prompt. Any receiver corrections retain local review and acceptance authority.

## Discussion

Captured at the owner's request after the accepted territory-governance work. The date lens is a proposed judgment aid; this Triage record preserves it for review without treating the discussion as approval to change the standard.
