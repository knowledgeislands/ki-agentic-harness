---
id: KI-HARNESS-GOV-093
area: GOV
title: Keep plugin projection current
theme: governance-consistency
horizon: triage
status: draft
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-09-25T08:50:34Z
updated_at: 2026-09-25T08:50:34Z
---

# KI-HARNESS-GOV-093: Keep plugin projection current

## Goal

A change to a canonical skill reaches `ki-plugins` without a person remembering to regenerate it, or the staleness is visible to something that fails.

## Context

`ki-plugins` is a generated, lossy projection of this repository, produced by `ki:binding:claude:build-plugin` and never hand-edited (ADR-KI-HARNESS-005). Nothing fails when it falls behind its source.

`ADR-KI-HARNESS-SKILLS-015` relaxed the decision-record and specification identifier grammars in `ki-decision-records` and `ki-specs` on 2026-09-25. Repositories resolving skills from this checkout picked the change up immediately; any consumer resolving them through the published plugin still enforces the old alpha-leading rule, and would reject an identifier this repository now calls well-formed. The divergence was noticed in conversation rather than reported by a check.

That is one instance of the general case: every skill edit makes the projection stale, and the window between the two is unbounded and unmeasured.

## Boundary

In scope: the mechanism by which `ki-plugins` tracks this repository, and the one regeneration that carries `ADR-KI-HARNESS-SKILLS-015` to it.

Out of scope: the projection's lossiness, which `ADR-KI-HARNESS-005` already settles; the contents of `ki-plugins`, which are never hand-edited; and any change to how other runtimes resolve skills.

## Discussion

Three candidate routes, to be chosen at triage rather than assumed here.

1. **Regenerate on demand.** Treat the projection as something a session refreshes when it changes a skill. Cheapest, and exactly the mechanism that already failed to fire in this case.
2. **Drift check that fails.** A gate regenerates into a scratch directory and compares, so a stale projection is a `FAIL` rather than a thing to remember. This is the `ki-repo` REVIEW expectation that vendored or generated copies are checked for drift by something that fails, applied to this repository's own output. It needs the regeneration path to be deterministic and bounded.
3. **Housekeeping cadence.** A recurring `ki-work-housekeeping` item that regenerates and commits. Catches drift eventually rather than at the point it is introduced, and the cadence is an arbitrary tolerance for how long consumers may be wrong.

Route 2 subsumes route 1 and makes route 3 unnecessary; routes 1 and 3 are only worth taking if the regeneration turns out not to be deterministic enough to diff.

Whichever route wins, the immediate regeneration carrying `ADR-KI-HARNESS-SKILLS-015` is owed to consumers of the published plugin and should not wait for it.
