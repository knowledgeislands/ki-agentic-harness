---
id: KI-HARNESS-GOV-215
area: GOV
title: PMO-12 to FAIL
kind: deliver
purpose: governance
project: ways-of-working
component: change-management
horizon: hold
hold:
  reason: waiting-for
  condition: no report that PMO-12 reads opens with anything but its heading, once the older work folders are pruned
status: draft
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-10-18T08:55:31Z
updated_at: 2026-10-18T08:55:31Z
---

# KI-HARNESS-GOV-215: PMO-12 to FAIL

## Goal

The `ki-pmo` rubric's PMO-12, the check that a saved work report opens with its `#` report heading, moves from WARN to FAIL, so that a report that opens with a lint directive, a frame or a form line stops a mark rather than only warning.

## Context

[KI-HARNESS-GOV-175](/Users/krisbrown/workspaces/knowledge-islands/ki-agentic-harness/docs/roadmap/KI-HARNESS-GOV-175-delegation-run-events.md) delivered PMO-12 at WARN, because 14 older reports in other work's folders in Knowledge Islands Principal open with a lint directive or a frame. Kris Brown answered "yes, go ahead with all the recommended" on 18 October 2026 in the ways-of-working decisions log, "owner answers, batches 6 and 7", read back as taken: "PMO12-LEVEL a) - PMO-12 stays WARN, a leading lint directive still fails it, promote to FAIL once folders are pruned." This record carries the promotion; it is adopted and held until the condition holds.

## Boundary

- In: PMO-12's level in `skills/change-management/ki-pmo/scripts/rubric/items/threads.ts`, its remediation wording, the regenerated `rubric.md`, and the remediation inventory test that counts the estate's criteria by level.
- Out: what PMO-12 reads or accepts, which stays as delivered, a leading lint directive still failing it; editing any work folder's reports, which their own coordinators prune or fix at their marks; a release.

## Discussion

The release condition is observable: `ki repo audit --skill ki-pmo` across the territories' Capitals reports no PMO-12 warning. When it does, release this record to Now, plan it and deliver it; until then the warning lets coordinators mark without being blocked by reports that other work will prune.
