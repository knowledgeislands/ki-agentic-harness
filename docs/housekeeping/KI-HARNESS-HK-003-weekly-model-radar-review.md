---
id: KI-HARNESS-HK-003
title: Weekly model radar review
status: active
cadence: P1W
last-run: 2026-09-18
grace: P2D
spawn-policy: when-due
spawn-horizon: now
active-run: null
---

# Weekly model radar review

## Goal

Keep model and execution-route evidence current and reassess recommendations weekly without turning new signals into automatic adoption or consumer-default changes.

## Procedure

1. Use `ki-pulse` for bounded recent discovery, then verify relevant model identity, availability, price, licence, lifecycle, and benchmark claims against the primary and independent sources registered by `ki-model-radar`.
2. Audit the committed snapshot and review its models, routes, benchmarks, unresolved signals, material releases, and retirement consequences. Preserve the evaluated unit and benchmark applicability; never silently merge bare-model, endpoint, model-agent, or complete-environment scores.
3. Prepare the smallest evidenced fact correction or recommendation, support, retirement, or benchmark-lifecycle proposal. Ring movement still requires the radar owner's evidence and human-review gates, including counter-evidence and uncertainty; a weekly cadence does not lower those gates.
4. Record an explicit no-change result when appropriate. Apply snapshot changes only through the reviewed run, and route trial, adapter, installation, default, and retirement consequences to owner-local work through `ki-next`. Do not mutate consumer configuration.

## Successful-run evidence

The linked run retains the review window, inspected sources and revision, changed facts or no-change result, local-fit evidence, proposed movements and counter-evidence, approvals, and separately routed follow-ups. It distinguishes radar advice from actual consumer support and defaults.

This template combines the former HK-003 signal and HK-004 release reviews. HK-004 is retired, not an additional weekly obligation; its earlier procedure remains in Git history.

## Obsolescence

Retire this template only when an accepted replacement provides equivalent weekly model and route reassessment, evidence retention, movement review, and receiver-owned follow-up routing.
