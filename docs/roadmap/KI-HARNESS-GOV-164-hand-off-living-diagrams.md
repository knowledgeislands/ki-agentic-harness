---
id: KI-HARNESS-GOV-164
area: GOV
title: Hand off living diagrams
kind: deliver
purpose: capability
initiative: platform-foundations
component: governance
status: done
blocks: []
blocked_by: []
baseline_ref: 0f87bf6d1d0bb6e9e3eb453aac452e9c4670f326
created_at: 2026-10-08T10:30:00Z
updated_at: 2026-10-09T06:50:00Z
---

# KI-HARNESS-GOV-164: Hand off living diagrams

## Goal

`ki-website` and `apps-observatory` each learn that the `ki-diagrams` skill exists: the website can add a skills-by-outcome entry for keeping diagrams, and the Observatory can retire its own `scripts/diagrams/export-svg.ts` when it adopts the skill.

## Context

Split from KI-HARNESS-GOV-131 on 2026-10-08. That record delivered the `ki-diagrams` skill and planned two outbound knowledge trades as its last step. The cross-repository trade standard now carries a hold - "Submit no new trade until the territory model is settled. Do the work directly, or record it as work in the receiving repository" - so the delegated run that delivered KI-HARNESS-GOV-131 raised neither trade, and it had no authority to write either receiving repository.

## Boundary

In scope: telling each receiver, once, what `ki-diagrams` offers it:

- **ki-website** - a skills-by-outcome entry for keeping diagrams, pointing at the skill's Diagrams standard.
- **apps-observatory** - the SVG exporter now ships as `skills/governance/ki-diagrams/scripts/export-svg.ts`, verified byte-identical to its own on `beacon-request`, so it may retire `scripts/diagrams/export-svg.ts` and move its `docs/diagrams/README.md` operational fields into `docs/diagrams/diagrams.toml` when it declares `[skills.ki-diagrams]`.

The receivers own whether and when to act. Out of scope: any change in either receiving repository.

## Current state

Delivered by direct handoff on 2026-10-08: each receiver holds a Triage record naming `ki-diagrams` and the outcome above. Kris Brown accepted it on 2026-10-09.

## Steps

- [x] Record the `ki-website` handoff directly as KI-WEB-SITE-043, with Kris's approval.
- [x] Record the `apps-observatory` handoff directly as KI-OBS-OPS-002, with Kris's approval.
- [x] Record the handoff evidence here.

## Files touched

- `docs/roadmap/KI-HARNESS-GOV-164-hand-off-living-diagrams.md`

## Verify

1. `ki-website` `docs/roadmap/` holds KI-WEB-SITE-043 naming `ki-diagrams` and the skills-by-outcome entry, and it is on `origin/main`.
2. `apps-observatory` `docs/roadmap/` holds KI-OBS-OPS-002 naming `ki-diagrams` and the exporter retirement, and it is on `origin/main`.
3. `ki repo audit --skill ki-work-roadmap` passes in this repository.

## Dependencies / blocks

None. Neither receiver's record blocks this one.

## Documentation impact

### Decision Records

None.

### Specifications

None.

### Guides

None.

### Roadmap

This record only.

## Review

### Delivered

- `ki-website` and `apps-observatory` each hold a Triage record naming `ki-diagrams` and the outcome it offers them, recorded directly under the trade hold.

### Change Summary

- `ki-website` KI-WEB-SITE-043 and `apps-observatory` KI-OBS-OPS-002 (each receiver's own commits).
- This record's handoff evidence (`0f87bf6d`).

### Verification

- Both receiver records exist in their primary checkouts, which match `origin/main`.
- `ki repo audit --skill ki-work-roadmap` passes.

### Outstanding concerns

None. Each receiver owns whether and when it acts.

### Post-change review

The handoff told each receiver once, as the Boundary required, and changed nothing else in either repository beyond its own record.

### Mini recap

Delivered by direct handoff rather than by trade; the acceptance evidence is met.

## Done

Accepted 2026-10-09 by Kris Brown (GOV-020 owner decision 4) on the review packet above, resolved as delivered by direct handoff to KI-WEB-SITE-043 and KI-OBS-OPS-002.

## Discussion

### Route

A knowledge trade if the trade hold has lifted; otherwise a work record raised in each receiving repository by someone with authority there.

### Acceptance evidence

Each receiver holds a trade or a work record naming `ki-diagrams` and the outcome above.

### Dependencies

Waits on the trade hold in the `ki-trades` standard, or on an operator able to record work directly in each receiver. Neither receiver's work blocks this record.

### Handoff evidence

On 2026-10-08, with Kris's approval, the work was recorded directly in each receiver as a Triage record naming `ki-diagrams`, the outcome above and this record as origin: `ki-website` KI-WEB-SITE-043 and `apps-observatory` KI-OBS-OPS-002. Neither blocks this record and this record blocks neither. The acceptance evidence is therefore met.
