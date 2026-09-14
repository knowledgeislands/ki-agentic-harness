---
id: KI-HARNESS-HK-003
title: Weekly model signal review
status: active
cadence: P1W
last-run: null
grace: P2D
spawn-policy: when-due
spawn-horizon: now
active-run: null
---

# Weekly model signal review

## Goal

Keep model identity, route availability, pricing, licensing, and deprecation evidence current without turning weekly signals into automatic recommendation-ring or runtime-default changes.

## Procedure

1. Bound recent public signals through `ki-pulse`, then verify relevant identity, availability, price, licence, and lifecycle facts against current primary sources registered by `ki-model-radar`.
2. Audit the committed radar snapshot for malformed, stale, unsupported, or internally inconsistent model, route, benchmark, and evidence records.
3. Record an evidenced no-change result or prepare the smallest reviewable snapshot correction; do not reconsider recommendation rings in the weekly lane.
4. Route material releases, retirement consequences, trials, adapter work, and runtime-default changes through the monthly review or a separately owned roadmap item using `ki-next`.

## Successful-run evidence

The linked run records its review window, inspected sources, changed facts or explicit no-change result, stale or contradictory evidence, and every separately routed follow-up. It does not merge incompatible benchmark units, infer support from publicity, or mutate consumer configuration.

## Obsolescence

Delete this template only when another accepted mechanism performs the same bounded weekly evidence and deprecation review while preserving reviewed snapshot changes and receiver-owned consumer work.
