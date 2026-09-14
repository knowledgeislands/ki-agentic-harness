---
id: KI-HARNESS-FND-023
area: FND
title: Verify capability publication counts
theme: foundation-tooling
horizon: triage
status: draft
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-09-14T19:26:00Z
updated_at: 2026-09-14T19:26:00Z
---

# Verify capability publication counts

## Goal

Detect when the root README's authored capability count drifts from the canonical generated catalogue.

## Context

Since 2026-08-09, the generated skills catalogue changed in 13 commits while the root README changed in seven. The README advertised 51 skills while the catalogue had reached 57 and then 58, before being corrected to 59. Existing generation checks do not own this authored summary claim.

## Boundary

Use valid `SKILL.md` frontmatter or the generated catalogue as deterministic input. A conform operation, if adopted, may change only an unambiguous exact count token; it must not rewrite surrounding authored prose or guess when the claim is absent or ambiguous.

## Discussion

This is proposed as a small `ki-repo-harness` publication check. Readiness should decide whether audit-only enforcement is sufficient and provide fixtures for missing, ambiguous, and unequal count claims. `KI-HARNESS-GOV-058` covers applicability registration and does not duplicate this publication concern.
