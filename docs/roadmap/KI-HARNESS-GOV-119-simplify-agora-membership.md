---
id: KI-HARNESS-GOV-119
area: GOV
title: Simplify Agora membership
theme: governance-consistency
horizon: triage
status: draft
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-09-27T19:09:14Z
updated_at: 2026-09-27T19:09:14Z
---

# KI-HARNESS-GOV-119: Simplify Agora membership

## Goal

Decide whether reciprocal Agora membership can be declared without a role label, then simplify the portable contract if the label has no necessary purpose.

## Context

Arcadia Principal's `kis` Agora assigns labels such as `product` and `distribution` to members. The current `ki-agora` standard requires a role on each side and matching values for reciprocity, although a role grants no permission or priority. A user discussion in `ki-arcadia-principal` on 2026-09-27 identified removing this apparent redundancy as low-priority prospective work.

## Boundary

Keep owner approval, independent member consent, canonical identities, and reciprocal resolution. This item owns the harness-side contract, rubric, examples, and migration guidance; `KI-TOOL-CLI-089` in `tools-ki` owns CLI implementation and is blocked by the contract decision. Do not change existing Agora declarations during intake.

## Discussion

### Contract choice

Check whether any consumer needs role distinctions beyond display and reciprocal equality. If not, consider representing home members as identities and member consent as Agora ID plus home, without introducing a replacement classification field. Decide how existing declarations migrate before changing validation.
