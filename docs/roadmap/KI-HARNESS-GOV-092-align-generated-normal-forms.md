---
id: KI-HARNESS-GOV-092
area: GOV
title: Align generated normal forms
theme: governance-consistency
horizon: now
status: awaiting-review
blocks: []
blocked_by: []
baseline_ref: 68040b3e4e63a83186587410bc84d2db80ff14d4
created_at: 2026-09-25T05:43:18Z
updated_at: 2026-10-06T17:21:44Z
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

- [x] Add a "Generated output and its normaliser" paragraph to section 5 of `standards-engineering.md` stating the three-way classification from Discussion: (1) repository-owned producer and shape, faithfully representable by the normaliser, so the producer emits the normal form; (2) byte identity with an external canonical source is the contract, so the path is excluded and producer drift is proved separately, as `ADR-KI-HARNESS-TOOLCHAIN-005` already requires; (3) the normaliser cannot represent the format, so the narrowest exclusion with a recorded reason. Convenience is not a reason.
- [x] Add `GEN-2 [J]`, "generated output matches its normaliser", to `scripts/rubric/items/generated.ts`, with scope (committed generated paths and their producers), prompt (is each path classified, and does a class-1 producer emit its normaliser's fixed point?), outcomes (`conforming`, `producer emits non-normal form`, `exclusion unjustified`, `classification decision required`) and guidance that routes class-1 fixes into the producer, not the formatter configuration.
- [x] Increment the expected code count in `scripts/rubric/items/index.test.ts` by one, rather than hardcoding a total, and assert `GEN-2` is present.
- [x] Regenerate `references/rubric.md` with `ki dev skill rubric ki-engineering`.
- [x] Add two items to Duplication and reuse in `mode-review.md`, after "Vendored or generated copies are checked for drift by something that fails.": "Repository-owned generated output inside formatter scope was regenerated and formatted with no resulting diff." and "Each generated path excluded from formatting is narrow and names external byte authority or genuine representational incompatibility as its reason."

## Files touched

- `skills/governance/ki-engineering/references/standards-engineering.md`
- `skills/governance/ki-engineering/scripts/rubric/items/generated.ts`
- `skills/governance/ki-engineering/scripts/rubric/items/index.test.ts`
- `skills/governance/ki-engineering/references/rubric.md`
- `skills/keystone/ki-repo/references/mode-review.md`
- `skills/keystone/ki-skills/scripts/internal/remediation-inventory.test.ts` (count only, added during delivery)

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

Sequencing: this record and [KI-HARNESS-FND-026](KI-HARNESS-FND-026-complete-conform-activation.md), [KI-HARNESS-GOV-109](KI-HARNESS-GOV-109-fail-when-commit-gates-absent.md) and [KI-HARNESS-GOV-127](KI-HARNESS-GOV-127-adopt-dependency-cruiser-estatewide.md) all edit the shared `ki-engineering` files `scripts/rubric/items/index.test.ts`, `references/rubric.md` and `references/standards-engineering.md`. Increment counts, never hardcode them; whichever lands second rebases. A sequencing note, not a dependency.

The `mode-review.md` anchor here is the Duplication and reuse lens, outside `Automated verification`, so it is independent of the [KI-HARNESS-GOV-096](KI-HARNESS-GOV-096-detect-zero-match-generators.md), [KI-HARNESS-GOV-098](KI-HARNESS-GOV-098-render-every-derived-signal.md), [KI-HARNESS-GOV-123](KI-HARNESS-GOV-123-review-unsettled-source-readings.md), [KI-HARNESS-GOV-124](KI-HARNESS-GOV-124-review-artefact-idempotence.md) and [KI-HARNESS-GOV-135](KI-HARNESS-GOV-135-review-governance-date-provenance.md) batch.

## Documentation impact

### Decision Records

None. The rule is consistent with `ADR-KI-HARNESS-TOOLCHAIN-005`, whose ownership basis is class 2. If review finds that it changes that record's boundary, amend or supersede the record rather than contradicting it in the standard.

### Specifications

`standards-engineering.md` gains one paragraph.

### Guides

None.

### Roadmap

None.

## Review

### Delivered

The producer-normaliser rule with its three-way ownership classification, one judgment criterion and two REVIEW checklist items, from baseline `68040b3e4e63a83186587410bc84d2db80ff14d4`. Exclusions held: no generated file was reformatted, no projection or vendoring exclusion changed, `ki-authoring`'s template contract is untouched, no mechanical regenerate-and-diff criterion was added, and `ADR-KI-HARNESS-TOOLCHAIN-005` needed no amendment because class 2 restates its ownership basis.

### Change Summary

- `skills/governance/ki-engineering/references/standards-engineering.md`: new "Generated output and its normaliser" paragraph in section 5, after the managed-surface exclusion paragraph, stating classes 1 to 3, naming the producer as the fix point for class 1 and citing the ADR for class 2.
- `skills/governance/ki-engineering/scripts/rubric/items/generated.ts`: `GEN-2 [J]` with the planned scope, prompt, four outcomes and producer-first guidance; the `GEN` family description now also names generated output, so it still describes both items.
- `skills/governance/ki-engineering/scripts/rubric/items/index.test.ts`: expected code count 60 to 61 and `GEN-2` asserted present.
- `skills/governance/ki-engineering/references/rubric.md`: regenerated with `ki dev skill rubric ki-engineering --write` from this worktree.
- `skills/keystone/ki-repo/references/mode-review.md`: the two Duplication and reuse items, immediately after the drift-check item.
- Approved deviation: `skills/keystone/ki-skills/scripts/internal/remediation-inventory.test.ts` counts estate-wide criteria; `criteria` 729 to 730 and `judgment` 283 to 284 for the one new judgment criterion. The plan's Files touched did not anticipate this cross-skill count.

### Verification

1. Section 5 states all three classes, the producer fix point for class 1, and the ADR citation for class 2 without contradicting it.
2. `ki dev skill rubric ki-engineering` reports `references/rubric.md is in sync`, and the rubric lists `GEN-2 [J] — Generated output matches its normaliser`. The installed harness links the primary checkout, so render and check ran with an isolated temporary XDG configuration whose `knowledgeislands/ki-agentic-harness` install linked this worktree.
3. `mode-review.md` Duplication and reuse carries both items, one line each, after "Vendored or generated copies are checked for drift by something that fails."
4. Applied by hand: `apps/site-rig/pipeline/pull.ts` owns producer and JSON shape and Biome represents it, so class 1 with the fix in the producer; `apps/site-tower/data` JSONL cannot be represented by Biome, so class 3 with a recorded narrow exclusion; `.claude/skills` is a byte-exact projection of another source, so class 2 under the ADR.

- `bun run test`: 943 pass, 0 fail. `bunx tsc --noEmit`: clean. `bunx biome check .`: no errors (pre-existing warnings only).
- `ki repo audit --skill ki-engineering --progress never`: PASS.
- `ki repo audit --skill ki-repo --progress never`: `ki-repo` content criteria clean; FAIL only on environment findings unrelated to this change: `REPO-REG-1` (the temporary worktree is not in the local repository registry) and `RUNTIMES-2` user-scope runtime activation for eight skills.

### Outstanding concerns

None for the delivered contract. The `ki-repo` audit environment failures are local-registry and runtime-activation state, not repository content.

### Post-change review

The goal is met at the standard and review level: a reviewer reading section 5 alone reaches the same three classifications for the `kit-midnight.ninja` evidence. Scope held to the stated files plus the one count-only test. Regression risk is low: one judgment item and two checklist lines, with counts incremented rather than restructured. Independent Fable review approved with no blocking or should-fix findings; its nit that Files touched omitted the inventory test was applied, and two further nits concern pre-existing text outside this diff. Ready for acceptance.

### Mini recap

Added the producer-normaliser rule, `GEN-2 [J]` and two REVIEW items; regenerated the rubric. Gates green. Learning route proposed: the `ki dev skill rubric --write` path follows the installed harness link, so rubric regeneration from a worktree needs an isolated XDG install; that may merit a `ki-skills` or `tools-ki` note through `ki-next`, not promoted here.

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
