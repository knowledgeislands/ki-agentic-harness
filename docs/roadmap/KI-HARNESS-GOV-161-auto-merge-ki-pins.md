---
id: KI-HARNESS-GOV-161
area: GOV
title: Auto-merge ki pins
status: triage
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-10-08T09:30:00Z
updated_at: 2026-10-08T10:45:00Z
---

# KI-HARNESS-GOV-161: Auto-Merge ki Pins

## Goal

Decide whether a released `ki` pin bump opened by an `update-ki-pin.yml` receiver may merge automatically once its required checks pass, or stays a human-reviewed pull request.

## Context

`KI-HARNESS-GOV-141`, done on 2026-10-08, stated the released-pin receiver contract in the `ki-engineering` standard. Its bump pull request rewrites only `.github/ki-version` and merges after human review, because XDR-KI-HARNESS-001 requires a person to review dependency changes. KI Website already auto-merges exact version-only tool updates under its own decision, ODR-KI-WEB-001, so the estate has a precedent for bounded automation.

Auto-merging the pin would amend XDR-KI-HARNESS-001 for this one dependency, so it is the organisation owner's decision, not the delivering agent's.

## Boundary

- **In:** whether to auto-merge, the conditions it would need (required checks, branch rules the App cannot bypass, a version-only diff), and the XDR-KI-HARNESS-001 amendment if the answer is yes.
- **Out:** the receiver itself, which `KI-HARNESS-GOV-141` delivered; App installation and credentials, which the organisation owner provisions per repository.

## Discussion

- With the pin in its own file, a bump's diff is one line, and CI installs and verifies the new release before merge. Is that enough evidence to merge without a person?
- Would auto-merge apply estate-wide, or only where a repository opts in?
