---
id: KI-HARNESS-FND-025
area: FND
title: Restore knip source coverage
theme: foundation-tooling
horizon: triage
status: draft
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-09-18T03:14:14Z
updated_at: 2026-09-18T03:14:14Z
---

# Restore knip source coverage

## Goal

Make knip inspect the Harness's current domain-grouped TypeScript source layout without weakening justified generated or runtime-projection exclusions.

## Context

The 2026-09-18 engineering alignment review ran `bunx knip`. It exited successfully but reported 14 configuration hints. The configured `skills/*/scripts/**/*.ts` entry and project patterns no longer match the current `skills/<domain>/<skill>/scripts/` layout, while several ignores and legacy entry patterns match no files. A clean exit therefore does not currently demonstrate the Decision Record's intended dependency and dead-code coverage.

## Boundary

Update only intentional knip entry, project, ignore, binary, and dependency exceptions needed for current source ownership. Do not make exported APIs private merely to silence the tool, remove runtime projections without their owner, or broaden ignores around genuine unused code. Any resulting unused dependency or export finding needs its own evidence-backed disposition.

## Discussion

The finding is mechanically reproducible and distinct from the existing engineering rubric: `ki-engineering` validates the presence and declared role of knip but does not currently prove that every intended source tree matches a knip project pattern. Planning should decide whether coverage belongs solely in repository configuration or warrants a reusable audit check.
