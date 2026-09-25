---
id: KI-HARNESS-GOV-094
area: GOV
title: Check constraint reach
theme: governance-consistency
horizon: triage
status: draft
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-09-25T09:06:24Z
updated_at: 2026-09-25T11:42:28Z
---

# KI-HARNESS-GOV-094: Check constraint reach

## Goal

Widening a constraint reaches every skill that restates it, rather than only the skill whose failure prompted the change.

## Context

On 2026-09-24, `69a0fc80` relaxed the digit-leading repository-code rule for roadmap identifiers across `ki-repo`, `ki-work-roadmap`, `ki-work-housekeeping` and `ki-accept` — the four skills that had failed. `ki-decision-records` and `ki-specs` each restate the same alpha-leading grammar in their own vendored rubric contexts (`scripts/rubric/contexts/decision-records.ts`, `scripts/rubric/contexts/specs.ts`) and were not touched, so they carried on enforcing the repealed rule.

Nothing reported the divergence. It surfaced a day later only because `5g-emerge-phase2` tried to use `5GE-P2` for both its roadmap and its decisions, found it legal in one instrument and illegal in the other, and invented the scope `EMERGE-P2` to work around a rule that no longer existed next door. That workaround was then written into `GDR-EMERGE-P2-001` as if it were a standing constraint. `ADR-KI-HARNESS-SKILLS-015` relaxed both instruments on 2026-09-25 and the seven records were renamed, so the instance is closed; the class is not.

The `ki-repo` REVIEW checklist has no question that would have caught it. Three items come close and each misses: "Renames were propagated to every reference" (`mode-review.md:208`) does not fire, because nothing was renamed and the old identifiers stayed valid; "The change does not introduce a second source of truth for an existing fact" (`:317`) prohibits creating duplication, and the duplication here is deliberate and predates the change; "A change to a declaration that another tool consumes was verified by running that tool" (`:368`) assumes the second enforcer is already known, and the failure was not knowing to look for one.

## Boundary

In scope: whether the REVIEW checklist gains a constraint-reach question, and where; and whether the identifier grammar should have one shared definition instead of six copies.

Out of scope: `ADR-KI-HARNESS-SKILLS-015` itself, which is settled; the contents of any individual rubric context; and the vendored-rubric architecture, which `ADR-KI-HARNESS-012` owns.

## Discussion

Two routes, not exclusive.

**The checklist question.** Add to Duplication and reuse (`mode-review.md:311-318`), which is already the "one fact, one authoritative definition" lens and whose last item applies the same shape to security-relevant logic. Wording: _A change to a constraint reached every skill that restates it._ The evidence is one grep for the regex literal or the prose sentence across `skills/`, which is cheap enough that a reviewer will actually run it. It slots after `:317` without disturbing the broad-to-narrow progression `:33` protects.

Against it: the checklist's own rule prefers deleting an item that never fires (`:43`), and a constraint grammar changes perhaps a few times a year. For it: the failure mode is silent — nothing goes red, a repository just quietly invents a workaround — and silent failures are what a checklist earns its keep on.

**The structural fix.** The question documents a hazard rather than removing it. The cause is that six skills each vendor a copy of one grammar with no shared definition and nothing that fails when they diverge. A single definition in `tools-ki`, or a conformance test asserting the copies agree, would make the question unnecessary. This is the same shape as `KI-HARNESS-GOV-093`: a fact with multiple copies and no drift check.

**Decided 2026-09-25: standardise the grammar.** One shared definition, with the copies either importing it or held to it by a conformance test that fails when they diverge. That removes the hazard rather than documenting it, and it is why the checklist question is not being added: `mode-review.md:43` prefers deleting an item that never fires, and a question asking a reviewer to grep for copies of a constraint earns nothing once the copies cannot silently disagree. If the shared definition turns out not to be reachable for all six skills, the one-line question at `:317` is the fallback and this item says so rather than leaving the gap open.

What that makes concrete for execution: the six restating skills are `ki-repo`, `ki-work-roadmap`, `ki-work-housekeeping`, `ki-accept`, `ki-decision-records` and `ki-specs`; the grammar to unify is the repository-code and scope-segment pair settled by `ADR-KI-HARNESS-SKILLS-015` (`[A-Z0-9][A-Z0-9-]{1,23}` for a code, `[A-Z0-9]*[A-Z][A-Z0-9]*` for a scope segment); and the constraint on where it can live is `ADR-KI-HARNESS-012`, which owns the vendored-rubric architecture and is the reason each skill holds its own copy today. Whether the shared definition sits in `tools-ki` or is enforced across vendored copies by test is the open design question, not whether to have one.

- [ADR-KI-HARNESS-SKILLS-015](../decisions/ADR-KI-HARNESS-SKILLS-015-identifier-scope-segments-accept-any-legal-repository-code.md) relaxed both governance instruments
- [KI-HARNESS-GOV-093](KI-HARNESS-GOV-093-keep-plugin-projection-current.md) is the same one-fact-many-copies shape applied to the plugin projection
