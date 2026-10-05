---
id: KI-HARNESS-GOV-092
area: GOV
title: Align generated normal forms
theme: governance-consistency
horizon: now
status: ready
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-09-25T05:43:18Z
updated_at: 2026-10-05T08:03:47Z
---

# KI-HARNESS-GOV-092: Align generated normal forms

## Goal

Committed generated files regenerate without formatter churn: a repository-owned producer emits the governing normaliser's fixed point, while producer-authoritative or unrepresentable output carries a narrow, explicit exemption with a recorded reason.

## Context

In `kit-midnight.ninja`, `apps/site-rig/pipeline/pull.ts` wrote a JSON catalogue using `JSON.stringify(raw, null, 2)`, while Biome collapsed its short arrays during commit. Each refresh therefore re-expanded formatting that `lint-staged` immediately removed, hiding three meaningful lines inside 333 insertions and 111 deletions. Commit `6966792b8dfe1fb90f0005e47a3f68efcd9395b3` fixed the cycle by formatting the catalogue through Biome as part of generation.

The same repository also demonstrates a legitimate exclusion: `apps/site-tower/data` contains append-only JSONL that Biome cannot represent without destroying its record format. Runtime skill projections such as `.claude/skills` and `.agents/skills` form a third case. They are byte-exact copies owned by another source, so the local repository must not rewrite them even when a formatter could preserve their semantics. Current `ADR-KI-HARNESS-TOOLCHAIN-005` deliberately excludes generated and vendored copies on that ownership basis.

Existing standards cover adjacent cases but not this complete distinction. `ki-authoring` requires canonical templates to be formatter fixed points, `ki-engineering` excludes managed discovery surfaces, and repository REVIEW checks generated-copy drift and unjustified ignore-list widening. None explicitly tests a locally shape-owned committed generator and its normaliser for byte stability.

## Boundary

In scope: the general producer-normaliser rule, with its three-way ownership classification, in the `ki-engineering` standard and as one judgment criterion in its rubric; and a regenerate-and-format check, plus an exclusion-justification check, in the `ki-repo` REVIEW checklist.

Out of scope: mandating that every generated file be formatted; removing or narrowing any current projection or vendoring exclusion; asserting that `rumdl` has caused an observed Markdown instance of this problem; changing `ki-authoring`'s existing fixed-point contract for canonical templates; any mechanical regenerate-and-diff criterion, which needs a repository-declared regeneration command that does not exist yet; and any estate-wide audit or remediation. The supplied four-repository survey is indicative evidence, not a measured estate-wide result.

## Current state

Verified on `main` at `19651664`. `standards-engineering.md` section 5 says generated and managed discovery surfaces stay out of every mechanical tool and cites `ADR-KI-HARNESS-TOOLCHAIN-005`, but says nothing about a repository-owned generator whose output the local formatter does govern. The `ki-engineering` catalogue has one `GEN` item, `GEN-1` (managed discovery surfaces share exclusions), and 60 codes in total (`scripts/rubric/items/index.test.ts:75`). The `ki-repo` REVIEW checklist's Duplication and reuse lens (`skills/keystone/ki-repo/references/mode-review.md:314`-`:322`) checks that generated copies record their revision and are drift-checked, and Automated verification (`:377`) forbids widening an ignore list to pass a gate; neither asks whether a generator emits its normaliser's fixed point.

## Steps

- [ ] Add a "Generated output and its normaliser" paragraph to section 5 of `standards-engineering.md` stating the three-way classification from Discussion: (1) repository-owned producer and shape, faithfully representable by the normaliser, so the producer emits the normal form; (2) byte identity with an external canonical source is the contract, so the path is excluded and producer drift is proved separately, as `ADR-KI-HARNESS-TOOLCHAIN-005` already requires; (3) the normaliser cannot represent the format, so the narrowest exclusion with a recorded reason. Convenience is not a reason.
- [ ] Add `GEN-2 [J]`, "generated output matches its normaliser", to `scripts/rubric/items/generated.ts`, with scope (committed generated paths and their producers), prompt (is each path classified, and does a class-1 producer emit its normaliser's fixed point?), outcomes (`conforming`, `producer emits non-normal form`, `exclusion unjustified`, `classification decision required`) and guidance that routes class-1 fixes into the producer, not the formatter configuration.
- [ ] Update the expected code count in `scripts/rubric/items/index.test.ts` from 60 to 61 and assert `GEN-2` is present.
- [ ] Regenerate `references/rubric.md` with `ki dev skill rubric ki-engineering`.
- [ ] Add two items to Duplication and reuse in `mode-review.md`, after "Vendored or generated copies are checked for drift by something that fails.": "Repository-owned generated output inside formatter scope was regenerated and formatted with no resulting diff." and "Each generated path excluded from formatting is narrow and names external byte authority or genuine representational incompatibility as its reason."

## Files touched

- `skills/governance/ki-engineering/references/standards-engineering.md`
- `skills/governance/ki-engineering/scripts/rubric/items/generated.ts`
- `skills/governance/ki-engineering/scripts/rubric/items/index.test.ts`
- `skills/governance/ki-engineering/references/rubric.md`
- `skills/keystone/ki-repo/references/mode-review.md`

## Verify

1. Section 5 of `standards-engineering.md` states all three classes, names the producer as the fix point for class 1, and cites `ADR-KI-HARNESS-TOOLCHAIN-005` for class 2 without contradicting it.
2. `ki dev skill rubric ki-engineering` reports the published rubric current and it lists `GEN-2 [J]`.
3. `mode-review.md` Duplication and reuse carries both new items, in the stated position, each as a one-line checklist item.
4. Applied by hand to the `kit-midnight.ninja` evidence, the rule classifies `apps/site-rig/pipeline/pull.ts` output as class 1, `apps/site-tower/data` JSONL as class 3, and `.claude/skills` as class 2; a reviewer reading only the standard reaches the same three answers.

```bash
bun run test
bunx tsc --noEmit
ki repo audit --skill ki-engineering --progress never
ki repo audit --skill ki-repo --progress never
```

## Dependencies / blocks

None.

## Documentation impact

### Decision Records

None. The rule is consistent with `ADR-KI-HARNESS-TOOLCHAIN-005`, whose ownership basis is class 2. If review finds that it changes that record's boundary, amend or supersede the record rather than contradicting it in the standard.

### Specifications

`standards-engineering.md` gains one paragraph.

### Guides

None.

### Roadmap

None.

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

### Decision

`ki-engineering` owns the producer-normaliser rule with its three-way ownership classification, and the `ki-repo` REVIEW checklist gains the regenerate-and-format check. Decided by the Fable reviewer under delegated autonomy, reversible.

`ki-engineering` owns the producer-normaliser rule with the three-way ownership classification above; `ki-repo` REVIEW gains the regenerate-and-format check. `ki-authoring` keeps its current template contract unchanged.

### Evidence scope

Biome over committed JSON is directly observed. The named skill-projection exclusions are established estate practice and are already normative in this repository. Rumdl over generated Markdown is a plausible extension, not yet an observed failure, and should remain labelled as such until a live case or focused test supports it.
