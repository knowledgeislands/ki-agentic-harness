---
id: 'FND-019'
title: Review structural consistency across shipped skills
status: in-progress
roadmap: foundation-tooling/review-structural-consistency-across-shipped-skills
blocks: —
blocked-by: —
---

## Context

The harness has grown multiple exemplar skills and several legitimate concern-specific implementation shapes.

We need a structured review that finds unjustified divergence without treating every skill as a line-by-line template copy.

## Current state

`ki-skills` checks skill shape and cross-skill declarations, but it intentionally does not prescribe all implementation layout choices across checkers, mode wiring, shared modules, tests, generated payloads, and documentation ownership.

The first completed review slice is the governed-entrypoint family: it identified and repaired one direct EDUCATE hand-off in `ki-repo-roadmap` that had not followed the de facto in-process pattern.

The wider review remains in progress; the remaining slices will examine checker decomposition, safe writes, generated payload treatment, HELP, and documentation-to-code ownership at the same level of evidence.

## Review areas

Each area is reviewed across comparable skills, beginning with the strongest relevant exemplars. A difference is only a finding when it weakens a shared contract, safety, testability, or ownership boundary; visual similarity alone is not the goal.

1. **Governed entrypoints and mode wiring** — `govern.ts`/`educate.ts` ownership, aggregate contract, local hand-offs, and retired entrypoints. **Completed:** one `ki-repo-roadmap` subprocess repair.
2. **Rubric structure and publication** — organisation of `rubric/` contexts, item catalogues, index modules, generated `references/rubric.md`, context factories, and the boundary between a checker-contract provider and a dependent skill. **Completed:** one publisher repair and a bounded parity follow-up.
3. **Checker decomposition and shared modules** — what stays skill-local, what is safely vendored, and whether imports point in the intended provider-to-consumer direction. **Completed:** provider-to-consumer implementation direction conforms; one test-ownership question is retained for the documentation/evidence slice.
4. **Safe writes and external boundaries** — atomicity, idempotence, dry-run behaviour, symlink handling, subprocesses, and which external-tool calls are genuine boundaries. **In progress:** subprocess and writer inventory complete; direct non-bootstrap writers remain for focused assessment.
5. **Generated payloads and HELP** — source-to-vendored parity, generated documentation, HELP snapshots, and the tests that protect each projection. **Completed:** source-harness projection and generated HELP contracts conform.
6. **Documentation, ownership, and evidence** — the relationship between standards, rubrics, source provenance, code, frontmatter ownership declarations, and focused versus end-to-end tests.

## Steps

1. ✓ Select representative exemplars for governance, process, harness, and lightweight skills. Define a review matrix covering frontmatter and mode boundaries, checker decomposition, shared-module direction, script/fixture/test layout, safe-write and subprocess patterns, generated payload treatment, HELP, and documentation-to-code ownership.
2. Inventory every shipped skill against that matrix in dependency order. Record evidence and classify each difference as intentional concern-specific design, harmless variation, suspected inconsistency, or a material contract/safety defect; do not edit implementation during the inventory. The governed-entrypoint slice is complete; continue with the remaining structural dimensions.
3. Review the suspected differences with each owning skill's standard, rubric, tests, and generated surfaces. Settle the minimal common patterns that are genuinely shared, identify where exemplars should change instead of dependants, and record any durable ownership decision in the appropriate standard or decision record.
4. Apply only small, unambiguous consistency repairs with their focused tests and generated payload refreshes. Split each broader or disputed repair into a separately scoped roadmap item and plan, with dependencies where needed. The governed-entrypoint repair is complete; do not infer wider implementation normalisation from it.
5. Publish the final review result and follow-up map, update the relevant rubric or guidance only for adopted common patterns, and run structural, generated-payload, and serial repository gates.

## Files touched

- shipped `skills/**/` sources, references, scripts, tests, and generated payloads only where a finding is unambiguous.
- this plan's assessment record and focused roadmap follow-ups for material discrepancies.
- owning standards, rubrics, or decision records only when the review adopts a durable common pattern.

Actual changes:

- `skills/general-governance/ki-repo-roadmap/scripts/educate.ts`
- `skills/general-governance/ki-repo-roadmap/scripts/govern.ts`
- `skills/general-governance/ki-repo-roadmap/scripts/repo-roadmap.test.ts`
- `skills/implied-families/ki-website-cloudflare/scripts/rubric/publish.ts`
- `skills/implied-families/ki-website-cloudflare/scripts/rubric/publish.test.ts`
- `skills/implied-families/ki-website-cloudflare/references/rubric.md`
- `skills/environment/ki-binding/scripts/rubric/contexts/binding.ts`
- `skills/environment/ki-binding/scripts/rubric/contexts/binding.test.ts`

## Verify

1. Every shipped skill has a recorded structural assessment with evidence and classification.
2. The result distinguishes legitimate variation from concrete defects and does not produce a blanket rewrite.
3. Every material discrepancy is either repaired with tests or has a focused, dependency-aware follow-up item.
4. Any changed source/vendored surface is regenerated and passes `bun run test` and `bun run ki:audit`.

## Dependencies / blocks

This review is independent of the lifecycle, linking, layout, and progress plans; it may create focused follow-ups that depend on them.

## Assessment record — governed entrypoint slice

### Scope and method

This initial slice compares governed entrypoint structure, not the line-by-line content of every skill.

It covers the 31 shipped skills present on 2026-07-22 in this one dimension, using the `ki-skills` checker root as the primary governed-checker exemplar and `ki-plan` as the lightweight process exemplar.

The evidence pass inspected frontmatter and mode boundaries, governed entrypoints, shared-module direction, public script and test layout, and local subprocess use.

It does not close the remaining review dimensions: safe-write patterns, generated payload treatment, HELP, and documentation-to-code ownership require their own comparable slices.

The baseline command was `bun skills/keystone/ki-skills/scripts/govern.ts audit skills --reporter=terminal --reporter-levels=WARN --progress=never`.

It reported zero FAILs and two existing `KI-SHAPE-7` WARNs about always-on anchors; neither warning is a structural implementation discrepancy found by this review.

### Governance skills

All 27 governance skills declare dependencies and a public invocation hint, carry `scripts/govern.ts` and `scripts/educate.ts`, expose `plan`, `check`, and `main`, and have retired their separate `audit.ts` and `conform.ts` entrypoints.

| Skill or set | Assessment | Evidence and classification |
| --- | --- | --- |
| `ki-skills` | Intentional exemplar | Owns the canonical shared rubric, checker, reporter, checker-reporter, and governed-entrypoint modules. Its richer contexts and focused tests are the correct provider-side shape. |
| `ki-bootstrap` | Intentional exemplar | Owns the bootstrap and publishing engine, so its governed EDUCATE branch legitimately calls its own import-safe repository engine rather than the generic per-skill educator. Its larger safety and parity suite matches that boundary. |
| `ki-repo` | Conforms | Uses the shared governed checker and educator contract; its project-publishing tests are concern-specific. |
| `ki-authoring`, `ki-engineering` | Conform | Foundation checkers use the shared contract; their domain-specific evidence and tool invocations are legitimate. |
| `ki-binding`, `ki-housekeeping`, `ki-tokenomics` | Conform | Environment checkers use the shared contract. Their optional external commands are domain boundaries, not local entrypoint hand-offs. |
| `ki-agents`, `ki-decision-records`, `ki-feature-definitions`, `ki-handoffs` | Conform | The governance-checker comparison slice found the standard dependent shape: vendored `ki-skills` checker modules plus in-process `runSkillEducator`. Context and test granularity match each concern. |
| `ki-repo-roadmap` | Repair applied | Its former `Bun.spawnSync` hand-off to adjacent `educate.ts` is replaced by an import-safe `main(argv)` call. Its profile and safe-write suite continues to cover the behaviour. |
| `ki-binding-chezmoi`, `ki-kb-activities`, `ki-kb-live-artifacts`, `ki-kb-streams`, `ki-website-cloudflare` | Conform | Implied-family skills retain the standard governed-entrypoint and shared-educator shape. |
| `ki-dotfiles-chezmoi`, `ki-harness`, `ki-homebrew-tap`, `ki-kb`, `ki-mcp`, `ki-plugins`, `ki-specifications`, `ki-tools`, `ki-website` | Conform | Repo-structure skills retain the same portable governed-entrypoint shape. Their test counts vary with real filesystem and external-tool risk. |

### Process skills

| Skill | Assessment | Evidence and classification |
| --- | --- | --- |
| `ki-delegate` | Intentional process shape | A lightweight procedure skill; it does not claim governance modes or a vendored checker. |
| `ki-next` | Intentional process shape | A lightweight roadmap-selection procedure; it composes with the lifecycle without duplicating its checker. |
| `ki-plan` | Intentional process exemplar | Owns lifecycle procedure and validates through the roadmap governance skill instead of carrying a second checker. |
| `ki-recap` | Intentional process shape | A focused recap procedure with a grounding test; it is correctly exempt from governance entrypoints. |

### Findings and adopted pattern

The shared pattern is deliberately narrow: a regular governance skill's `govern.ts` owns only command parsing and its checker's `plan`/`check` contract, while EDUCATE delegates in-process either to `runSkillEducator` or, for an engine-owning root, to an import-safe owner function.

`ki-repo-roadmap` was the one material discrepancy: it started a second Bun process to hand off to adjacent source code.

That extra process obscured direct control flow and created a needless execution boundary without adding user-space isolation or crossing an external command boundary.

The repair exports an import-safe `main(argv)` from `scripts/educate.ts`, preserves its standalone CLI wrapper, and calls that function from `scripts/govern.ts`.

Test-file counts and the number of rubric contexts are harmless concern-specific variation.

This slice did not assess rubric-publication parity; that separate concern is recorded below.

`ki-repo-roadmap`'s single large end-to-end suite explicitly exercises simple-profile education, thematic projection, safe writes, lifecycle validation, and drift; it is not under-tested merely because that evidence is not split into several files.

### Follow-up map

FND-019 includes the local `ki-repo-roadmap` EDUCATE hand-off repair because it is bounded, has an existing focused suite, and preserves an already-settled contract.

No broader normalisation work is justified by this first slice.

The existing roadmap item **Review `ki-bootstrap` for further simplification** remains the right separate home for bootstrap engine boundaries, including its own local process launches.

## Assessment record — rubric structure and publication

### Scope and method

This slice compares the structured-rubric provider layout and its human-readable publication contract across all 27 governance skills.

The comparison uses `ki-skills`' [rubric-authoring guidance](../../../../skills/keystone/ki-skills/references/rubric-authoring.md) as the standard: item definitions are canonical; `references/rubric.md` is their generated publication; that publication identifies its generated source, renders classification and citations, and has a read-only exact-parity test.

All 27 governance skills have the expected `scripts/rubric/contexts/`, `scripts/rubric/items/index.ts`, `scripts/rubric/publish.ts`, and `references/rubric.md` surfaces.

The number of context files and families varies for a reason: `ki-skills` is the shared provider with 17 families, while skills such as `ki-repo-roadmap` divide distinct subject models across focused contexts.

That is intentional concern-specific decomposition, not a template defect.

### Findings

| Set | Assessment | Evidence and action |
| --- | --- | --- |
| `ki-skills` | Intentional provider exemplar | Its richer catalogue, context factories, renderer, and exact-parity publication tests are the correct provider-side form. |
| 16 previously tested dependent skills | Conform | Their publication tests render the structured catalogue in memory and exact-compare the tracked Markdown. |
| `ki-website-cloudflare` | Repair applied | Its publisher omitted the required reader-facing generated-publication notice and per-item source citations, and it had no exact-parity test. The publisher now renders the standard presentation, accepts an explicit catalogue argument, and the new test protects the tracked publication. |
| `ki-housekeeping`, `ki-binding`, `ki-engineering`, `ki-authoring`, `ki-tokenomics`, `ki-binding-chezmoi`, `ki-repo`, `ki-repo-roadmap`, `ki-kb-streams`, `ki-kb` | Material consistency gap | Each has a structured catalogue and publisher but no direct or indirect read-only exact-parity test for `references/rubric.md`. This leaves generated documentation drift undetected. |

The Cloudflare repair is deliberately local and mechanical: it does not alter any rubric item, check, or Cloudflare hosting decision.

The remaining ten skills need a focused fleet follow-up to add publication parity protection and reconcile any renderer omissions against the established presentation contract.

This is a bounded generated-documentation consistency task, not evidence for extracting a shared renderer: table-of-contents choices, hybrid/heuristic labels, and asynchronous versus synchronous file writes remain legitimate local renderer choices where their publication stays complete and protected.

### Verification

The focused Cloudflare publication test passed, followed serially by `bun run ki:authoring:audit`, `bun run ki:bootstrap:audit`, `bun run ki:engineering:audit`, `bun run test`, and `bun run ki:audit`.

## Assessment record — checker decomposition and shared modules

### Scope and method

This slice checks the declared provider-to-consumer direction rather than comparing local rubric logic line by line.

It inventories each governance skill's `ki-shared-dependencies`, `ki-shared-modules`, `scripts/vendored/` links, and imports that leave a skill directory.

### Findings

All 27 governance skills declare their shared dependencies.

The source harness contains 106 manifest-governed links to `ki-skills` modules and 25 to the `ki-bootstrap` educator; no vendored link points at an undeclared third provider.

`ki-skills` is correctly the sole checker-contract provider (`rubric`, `checker`, `reporter`, `checker-reporter`, and `govern`), while `ki-bootstrap` is correctly the sole provider of the shared `educator` module.

There are no direct cross-skill implementation imports outside a skill's declared vendored boundary.

The larger direct engines in `ki-skills` and `ki-bootstrap`, `ki-repo`'s richer multi-subject checker adapter, and `ki-repo-roadmap`'s focused context split all align with their declared owner and concern.

One direct cross-skill import remains in a test: `ki-repo/scripts/internal/project-skill-publisher.test.ts` imports `ki-bootstrap`'s publisher implementation.

The implementation is owned and documented by `ki-bootstrap`, but the test is physically located under `ki-repo`.

This is not a checker-decomposition defect; assess whether it should move as part of the later documentation, ownership, and evidence slice, where the test's behavioural ownership can be judged without a cosmetic relocation.

### Classification

The implementation dependency direction conforms and needs no shared-module refactor.

The isolated test location is a recorded ownership question, not yet a repair: moving it is justified only if the evidence slice confirms that bootstrap, rather than repo, owns the test's public behavioural contract.

## Assessment record — safe writes and external boundaries (in progress)

### Initial inventory

The first pass separated test-only process launches from production boundaries and grouped production calls by ownership.

`git`, `brew`, and the authoring/engineering toolchain are genuine external boundaries; their subprocesses are not candidates for an in-process refactor.

`ki-bootstrap` owns its guarded publication, shared-module, and user-install process boundaries.

Those writers already carry dry-run, transaction, rollback, lock, and hostile-path evidence; the existing **Review `ki-bootstrap` for further simplification** roadmap item remains the right home to consider any imports without weakening their failure isolation.

`ki-tokenomics` still invokes its own audit and conform engines through Bun.

That is the known, separately scoped **Replace local tokenomics engine subprocesses** candidate; it is not expanded here.

### Repair applied

`ki-binding`'s optional BIND-3 project-link check was not reaching `ki-bootstrap`: it resolved both the retired `scripts/lib/` path and a directory one level short of the source `skills/` root.

The check now resolves the canonical `scripts/internal/repo-bootstrap/publish-project-skills.ts` source path, and a focused regression test confirms that the source-harness target exists.

This keeps the existing optional-unavailable behaviour for a deployment where that sibling source is genuinely absent, while restoring the intended source-harness composition path.

### Next evidence

The direct user-configuration pass identifies three follow-up candidates: `ki-binding` writes Cowork settings in place after its discovery read, `ki-housekeeping` writes state files in place, and `ki-agents` can recurse through a symlinked agent directory while collecting writable definitions.

Each has useful behaviour-level safeguards, but none has the transaction and hostile-path evidence established for bootstrap-owned or development-link writes.

The existing **Inventory non-critical writers for bounded follow-up** roadmap item now names this evidence and is the focused home for deciding each boundary's appropriate hardening.

No broader writer normalisation is inferred from the inventory alone.

## Assessment record — generated payloads and HELP

### Scope and method

This slice checks the source-harness projection rather than treating its manifest-governed links as ordinary repository copies.

It validates the complete skill graph and HELP catalogue, inspects the manifest entry classes, and runs the bootstrap source-parity audit.

### Findings

`skill-graph --check --check-doc` confirms all 31 shipped skills and the rendered user-guide graph are current.

`skill-help --check` confirms that the same 31 skills are covered by the editorial catalogue, while the per-skill HELP snapshot remains generated directly from each `SKILL.md` declaration rather than separately authored.

The source harness has 12 governed skills in its declared coverage.

Its manifest records 31 generated regular files (12 HELP snapshots, 12 educator launchers, and 7 aggregate or harness-bin files) and 38 declared local links (12 checker entrypoints, 12 educator skill sources, 12 shared educator modules, and the `skills` and `agents` catalogue roots).

`ki-bootstrap` BOOT-9/11/12/13 confirms the resolved set, direct entrypoint parity, educator set, and canonical source-link declarations.

### Classification

This is intentional source-harness behaviour: generated small control files remain regular and manifest-hashed, while canonical source trees and direct checker units remain local links.

No generated-payload or HELP consistency repair is needed from this slice.
