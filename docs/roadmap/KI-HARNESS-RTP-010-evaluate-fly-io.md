---
id: KI-HARNESS-RTP-010
title: Evaluate Fly.io hosting
area: RTP
theme: runtime-portability
horizon: triage
status: draft
blocks: []
blocked_by: [KI-HARNESS-RTP-012]
baseline_ref: null
created_at: 2026-09-01T10:24:06Z
updated_at: 2026-09-14T13:44:33Z
---

## Goal

If Techne identifies Fly.io as a useful proof candidate, determine whether it can satisfy the Harness portable execution contract for one bounded Knowledge Islands workload.

## Context

Techne proposal `TECHNE-GOV-005` owns the engineering model, provider landscape, comparison criteria, and any technology recommendation. This record is a downstream Harness adapter proof, not the canonical Fly.io evaluation.

If Techne selects Fly.io for proof, evaluate the provider claims recorded there through `KI-HARNESS-RTP-012` rather than treating Fly.io's API as the standard itself.

## Boundary

Do not select or recommend Fly.io, duplicate Techne's technology landscape, create an account, provision infrastructure, incur spend, or introduce a dependency while this remains an investigation. Keep a bounded Harness conformance proof distinct from general service hosting, durable agent workspaces, and remote-development needs.

## Discussion

### Evaluation questions

After Techne names a concrete proof workload, test the portable contract's required isolation, state recovery, credential and egress controls, lifecycle operations, evidence return, and provider exit boundary. Feed provider-specific operational findings back to Techne rather than turning them into Harness policy.

### Promotion evidence

Require both an accepted Techne direction in `TECHNE-GOV-005` and the portable contract from `KI-HARNESS-RTP-012` before promoting this provider-specific proof.

Before adopting beyond Triage, name the bounded workload and its current constraint, the Fly.io surface proposed for it, an acceptable cost and trust boundary, and reversible proof with explicit pass, fail, and cleanup criteria.
