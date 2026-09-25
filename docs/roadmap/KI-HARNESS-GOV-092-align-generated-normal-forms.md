---
id: KI-HARNESS-GOV-092
area: GOV
title: Align generated normal forms
theme: governance-consistency
horizon: triage
status: draft
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-09-25T05:43:18Z
updated_at: 2026-09-25T05:43:18Z
---

# KI-HARNESS-GOV-092: Align generated normal forms

## Goal

Committed generated files regenerate without formatter churn: a repository-owned producer emits the governing normaliser's fixed point, while producer-authoritative or unrepresentable output carries a narrow, explicit exemption with a recorded reason.

## Context

In `kit-midnight.ninja`, `apps/site-rig/pipeline/pull.ts` wrote a JSON catalogue using `JSON.stringify(raw, null, 2)`, while Biome collapsed its short arrays during commit. Each refresh therefore re-expanded formatting that `lint-staged` immediately removed, hiding three meaningful lines inside 333 insertions and 111 deletions. Commit `6966792b8dfe1fb90f0005e47a3f68efcd9395b3` fixed the cycle by formatting the catalogue through Biome as part of generation.

The same repository also demonstrates a legitimate exclusion: `apps/site-tower/data` contains append-only JSONL that Biome cannot represent without destroying its record format. Runtime skill projections such as `.claude/skills` and `.agents/skills` form a third case. They are byte-exact copies owned by another source, so the local repository must not rewrite them even when a formatter could preserve their semantics. Current `ADR-KI-HARNESS-TOOLCHAIN-005` deliberately excludes generated and vendored copies on that ownership basis.

Existing standards cover adjacent cases but not this complete distinction. `ki-authoring` requires canonical templates to be formatter fixed points, `ki-engineering` excludes managed discovery surfaces, and repository REVIEW checks generated-copy drift and unjustified ignore-list widening. None explicitly tests a locally shape-owned committed generator and its normaliser for byte stability.

## Boundary

This item does not mandate formatting every generated file, remove current projection or vendoring exclusions, or assert that rumdl has caused an observed Markdown instance of this problem. The supplied four-repository survey is indicative evidence, not a measured estate-wide result. Any wider estate audit and remediation must be separately scoped from defining the standard and REVIEW lens.

## Discussion

### Authority model

Classify a committed generated path before choosing treatment:

1. When the repository owns both the producer and output shape, and its normaliser represents the file faithfully, the producer should emit that normal form.
2. When byte identity with an external canonical source is the contract, the producer remains sole byte authority. Exclude the projection or vendored copy from local formatting and prove source drift separately.
3. When the normaliser cannot faithfully represent the file format, use the narrowest explicit exemption and record why.

This extends the proposal's representability test with ownership. Without that branch, applying a local formatter to a byte-exact projection would conflict with `ADR-KI-HARNESS-TOOLCHAIN-005` even though its semantic content survived.

### Review check

For repository-owned generated output inside normaliser scope, REVIEW should regenerate it, run the governing formatter, and expect no diff. A non-empty formatting diff demonstrates competing byte authorities. The check must use a deterministic, bounded regeneration path and avoid treating unrelated runtime or source-data changes as formatter churn.

For excluded generated paths, REVIEW should instead confirm the exclusion is narrow, its reason matches either external byte authority or genuine representational incompatibility, and an appropriate producer-drift check exists. Convenience alone is not a sufficient exemption reason.

### Standards ownership

`ki-engineering` should own the general producer-normaliser rule for code and data toolchains. `ki-authoring` should retain its existing fixed-point contract for canonical templates and should adopt equivalent wording for generated authored material only after evidence establishes the case. `ki-repo` should own the cross-repository REVIEW questions. If implementation changes the decision boundary for generated or vendored code, amend or supersede `ADR-KI-HARNESS-TOOLCHAIN-005` rather than contradicting it in a lower-authority standard.

### Evidence scope

Biome over committed JSON is directly observed. The named skill-projection exclusions are established estate practice and are already normative in this repository. Rumdl over generated Markdown is a plausible extension, not yet an observed failure, and should remain labelled as such until a live case or focused test supports it.
