---
id: KI-HARNESS-GOV-135
area: GOV
title: Review governance date provenance
theme: governance-consistency
horizon: now
status: ready
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-10-04T10:59:42Z
updated_at: 2026-10-05T08:02:49Z
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

## Current state

`Repository governance` (`mode-review.md:185`) asks at `:187` that the repository declaration reflects what the repository now contains, but nothing asks what a governance or conformance date evidences. The `ki-repo` mechanical rubric does not read such dates and is not changed. Line numbers are as observed on 2026-10-05; anchor by text.

## Steps

- [ ] Insert one question directly after `The repository declaration reflects what the repository now contains.` in `Repository governance`: `- [ ] Each governance or conformance date states what it claims - an evidenced adoption, a preserved historical assertion, or the first surviving declaration - and none is backdated by inference or read as proof of audited conformance.`
- [ ] Run the verification below.

## Files touched

- `skills/keystone/ki-repo/references/mode-review.md`

## Verify

1. `Repository governance` contains exactly one new date-provenance question, directly after the declaration question.
2. The question distinguishes the three date kinds named in the Goal and refuses both inferred backdating and reading a date as audited conformance.
3. No file under `skills/keystone/ki-repo/scripts/` and no generated rubric changes: `git diff --stat` shows only `mode-review.md` for this record.
4. Added text uses British English and ASCII hyphens only; focused audits report no new finding in `mode-review.md`.
5. `bun run test` and `bunx tsc --noEmit` pass.

```bash
bun run test
bunx tsc --noEmit
ki repo audit --skill ki-repo --progress never
ki repo audit --skill ki-authoring --progress never
```

## Dependencies / blocks

`blocked_by` and `blocks` are empty by intent. This record edits `Repository governance` while [KI-HARNESS-GOV-096](KI-HARNESS-GOV-096-detect-zero-match-generators.md), [KI-HARNESS-GOV-124](KI-HARNESS-GOV-124-review-artefact-idempotence.md), [KI-HARNESS-GOV-098](KI-HARNESS-GOV-098-render-every-derived-signal.md) and [KI-HARNESS-GOV-123](KI-HARNESS-GOV-123-review-unsettled-source-readings.md) edit `Automated verification` of the same file; it is last in the preferred batch order and its text anchor is independent of theirs, so it cannot conflict.

## Documentation impact

### Decision Records

None. A judgment prompt in the REVIEW checklist changes no structural decision.

### Specifications

None.

### Guides

None. The website skills-by-outcome guide does not restate REVIEW questions.

### Roadmap

None. Any date corrections a review surfaces are routed to the receiving repository's own roadmap under its authority.

## Discussion

### Decision

Add the date-provenance judgment prompt to the `ki-repo` REVIEW checklist under `Repository governance`, with no rubric change. Decided by the Fable reviewer under delegated autonomy, reversible.

### Placement

`Repository governance` rather than `Automated verification`: the prompt judges what a governance record asserts, which `Checklist evolution` places in the narrowest fitting lens, and it needs no tool run as evidence.

### Origin

Captured at the owner's request after the accepted territory-governance work. The date lens is a proposed judgment aid; this Triage record preserves it for review without treating the discussion as approval to change the standard. That approval is now given by the Decision above.
