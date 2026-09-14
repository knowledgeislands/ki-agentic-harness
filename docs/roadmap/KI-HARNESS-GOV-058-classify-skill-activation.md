---
id: KI-HARNESS-GOV-058
area: GOV
title: Classify skill activation
theme: governance-consistency
horizon: triage
status: draft
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-09-13T15:45:43Z
updated_at: 2026-09-14T02:09:58Z
---

# Classify skill activation

## Goal

Make every canonical skill state how it becomes applicable so mechanical audits can prove that activation coverage is complete and that intentional omissions are explicit.

## Context

The harness currently publishes 57 skills. `ki-repo` detects several repository patterns and requires matching declarations, including documentation roots, but no contract proves that every canonical skill is represented by that registry, a downstream detector, an explicit-only policy, or process invocation.

Without an exhaustive classification, new skills can silently fall outside activation auditing even when their repository evidence would be mechanically detectable. Repository-shape skills also need to own narrower downstream signals without forcing every specialised check into `ki-repo`.

## Boundary

Do not activate skills automatically, infer policy from prose or directory placement, or require process skills to appear as repository governance declarations. Do not migrate consumer repositories until the classification vocabulary and audits are agreed.

## Discussion

### Activation vocabulary

The candidate vocabulary is `baseline`, `repository-detected`, `downstream-detected`, `explicit`, and `process`. Shaping should confirm whether this is one frontmatter field plus an owning detector for downstream cases, or an equivalent typed structure with the same exhaustive meaning.

### Mechanical completeness

`ki-skills` should fail a canonical skill with no valid activation classification. Each detector owner should then fail when its registry and the skills naming it as owner disagree in either direction.

### Downstream ownership

Repository-wide evidence belongs to `ki-repo`; shape-specific evidence belongs to the active parent skill. For example, a Knowledge Base capability can be classified as downstream-detected by `ki-repo-kb`, whose own audit then checks the applicable nested shape and declaration.

### Explicit omissions

Where a reliable signal exists but a repository deliberately declines the corresponding standard, the existing `coverage-<skill> = false` pattern should remain a visible audit note rather than becoming silent absence.
