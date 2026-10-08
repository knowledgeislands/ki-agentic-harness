---
id: KI-HARNESS-GOV-164
area: GOV
title: Hand off living diagrams
kind: deliver
purpose: capability
initiative: platform-foundations
component: governance
status: triage
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-10-08T10:30:00Z
updated_at: 2026-10-08T10:30:00Z
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

## Discussion

### Route

A knowledge trade if the trade hold has lifted; otherwise a work record raised in each receiving repository by someone with authority there.

### Acceptance evidence

Each receiver holds a trade or a work record naming `ki-diagrams` and the outcome above.

### Dependencies

Waits on the trade hold in the `ki-trades` standard, or on an operator able to record work directly in each receiver. Neither receiver's work blocks this record.
