---
id: KI-HARNESS-GOV-058
area: GOV
title: Classify Skill Applicability
theme: governance-consistency
horizon: next
status: done
blocks: []
blocked_by: []
baseline_ref: 93d05b983345c3289daa4401a1f883b3e3b04566
created_at: 2026-09-13T15:45:43Z
updated_at: 2026-09-16T12:53:49Z
---

# Classify Skill Applicability

## Goal

Make every canonical skill state how it becomes applicable so mechanical audits can prove coverage is complete and intentional omissions remain explicit.

## Context

The Harness now publishes 60 skills. `ki-repo` detects repository patterns and requires matching declarations, including documentation roots, but no contract proves that every canonical skill is represented by a baseline, detector, declaration-only, or invocation-only applicability path. Without exhaustive classification, new skills can silently fall outside applicability auditing even when repository evidence is mechanically detectable.

The original “activation” framing conflates host-managed discovery-link activation with repository applicability. It also mixes the existing `ki-kind` lifecycle axis, detection scope, declarations, and direct process invocation in one proposed enum. Repository-shape skills need narrower downstream signals without forcing every specialised check into `ki-repo`.

## Boundary

Do not activate skills automatically, infer policy from prose or directory placement, replace `ki-kind`, require process skills to appear as repository governance declarations, or migrate consumer repositories before the public vocabulary and detector registry are approved.

## Current state

`ki-kind: governance | process` already owns lifecycle classification. `ki-repo-harness` parses every canonical skill and is the natural collection-level completeness owner; `ki-skills` can validate one skill's metadata shape. `ki-repo` currently carries 20 hard-coded coverage detectors, but executable detector rubrics have no agreed portable registry that a harness-wide audit can compare bidirectionally with skill metadata.

The approved contract adds one orthogonal `ki-applicability` field with the exact values `baseline | detected | declaration-only | invocation-only`. `baseline` is limited to `ki-repo` and `ki-authoring`; every process skill is `invocation-only`; a governance skill named in the detector registry is `detected`; every other governance skill is `declaration-only`.

For this version, `ki-repo` is the sole repository-applicability detector owner and declares the complete canonical target list in `ki-detects: [...]` frontmatter. Its local executable coverage paths must agree bidirectionally with that list. `ki-skills` validates each skill's metadata and local consistency, while `ki-repo-harness` proves collection completeness, exact baseline membership, process classification, and registry-to-skill agreement. Downstream skills retain their specialised evidence and shape validation without becoming independent applicability selectors.

## Steps

- [x] Record the approved `ki-applicability` and `ki-detects` contract in `ADR-KI-HARNESS-SKILLS-014`, dependent on ADR-005, ADR-SKILLS-006, and ADR-012.
- [x] Add `ki-applicability` syntax and kind-consistency validation to `ki-skills`, including exact process-to-`invocation-only` enforcement.
- [x] Give `ki-repo` the sole `ki-detects` registry and make its current coverage, primary-structure, runtime, and adapter-selection targets agree with the declared list in both directions.
- [x] Extend `ki-repo-harness` to require classification on every canonical skill, enforce the exact two-skill baseline, resolve every detector target, and publish applicability in the generated capability catalogue.
- [x] Classify all 60 canonical skills from the accepted rules without changing `ki-kind`, dependency, runtime-binding, or host-activation semantics.
- [x] Add the accepted collection and coverage invariants to the Harness and governance Specifications.
- [x] Regenerate the affected rubrics and `skills/README.md`, then run focused and aggregate verification.

## Files touched

- `docs/decisions/ADR-KI-HARNESS-SKILLS-014-*.md`
- `docs/specs/governance.md` and `docs/specs/harness.md`
- canonical `skills/**/SKILL.md` metadata
- `skills/keystone/ki-skills/` metadata validation, rubric, and tests
- `skills/keystone/ki-repo/` detector registry, rubric, and tests
- `skills/repo-structure/ki-repo-harness/` completeness publication, rubric, and tests
- generated rubrics and `skills/README.md`
- this roadmap record

## Verify

- Focused `ki-skills` frontmatter tests prove all four values, reject missing or invalid metadata, and require every process skill to be `invocation-only`.
- Focused `ki-repo` tests prove its declared detector targets and executable coverage targets are equal, unique, and resolvable.
- Focused `ki-repo-harness` tests prove all 60 skills are classified, only `ki-repo` and `ki-authoring` are `baseline`, every process skill is `invocation-only`, and every `detected` skill appears in `ki-repo`'s registry.
- Generated rubric and capability publications are exact.
- `ki repo audit --skill ki-skills --repo .`
- `ki repo audit --skill ki-repo --repo .`
- `ki repo conform --skill ki-repo-harness --repo .`
- `ki repo audit --skill ki-repo-harness --repo .`
- `ki repo audit --skill ki-authoring --repo .`
- `bun run test`
- `bunx tsc --noEmit`

## Dependencies / blocks

The user approved the exact contract on 2026-09-16: the four-value `ki-applicability` vocabulary, the exact two-skill baseline, process-to-`invocation-only`, `ki-repo` as sole detector owner with `ki-detects`, bidirectional registry enforcement, and a new `ADR-KI-HARNESS-SKILLS-014`. No known build dependency blocks delivery.

## Delegation

After approval, bounded workers may classify disjoint canonical skill roots only after the metadata validator and detector target set pass their focused gate. The orchestrator exclusively owns the Decision Record, shared validators, detector integration, Specifications, generated rubrics, `skills/README.md`, aggregate verification, and final review so concurrent workers do not collide on shared publications.

## Documentation impact

### Decision Records

Add `ADR-KI-HARNESS-SKILLS-014` for the new public applicability contract, dependent on ADR-KI-HARNESS-005, ADR-KI-HARNESS-SKILLS-006, and ADR-KI-HARNESS-012. Preserve those records as the owners of validate-down configuration, skill kind, and compatible capability publication.

### Specifications

Update `docs/specs/governance.md` with the per-skill classification and detector-registry invariants, and `docs/specs/harness.md` with exhaustive collection enforcement and publication requirements.

### Guides

No guide change is planned. The Decision Record, skill standards, Specifications, and generated capability catalogue are the authoritative surfaces; add user guidance only if implementation reveals a distinct workflow.

### Roadmap

Keep this item as the decision and migration authority. Consumer migrations, if required, become separately reviewable owner-local work.

## Review

### Delivered

Delivered the approved applicability contract against immutable baseline `93d05b983345c3289daa4401a1f883b3e3b04566`. The boundary remains classification, detector ownership, validation, and publication; it does not activate skills or migrate consumer repositories.

### Summary of changes

Added `ADR-KI-HARNESS-SKILLS-014`, governance and Harness Specification requirements, `ki-applicability` across all 60 canonical skills, and the sole `ki-repo` `ki-detects` registry. Extended `ki-skills`, `ki-repo`, and `ki-repo-harness` validation and tests, then regenerated their rubrics and the capability catalogue.

### Verification

Focused applicability, publication, and detector-registry tests pass. Audits for `ki-skills`, `ki-repo`, `ki-repo-harness`, `ki-decision-records`, `ki-specs`, `ki-work-roadmap`, and `ki-authoring` pass. `bunx tsc --noEmit`, `bun run test`, `bunx biome check`, and `git diff --check` pass.

### Outstanding concerns

None within the approved boundary. Consumer repositories may need separately owned declaration changes only when their installed Harness and local policy adopt this metadata contract.

### Post-change review

The implementation makes collection omissions and detector drift mechanically visible without coupling applicability to skill kind or runtime activation. Regression risk is concentrated in adding or renaming detector targets and is covered bidirectionally by focused tests. The item is ready for acceptance review.

### Mini recap

The Harness now publishes an exhaustive applicability route for every canonical skill and proves its detector registry matches executable repository coverage. No automatic learning promotion or follow-on work is required from this delivery.

## Done

Accepted 2026-09-16 by Kris Brown on the review packet above.

## Discussion

### Applicability vocabulary

The earlier candidates `repository-detected`, `downstream-detected`, `explicit`, and `process` mix detection ownership, lifecycle, and invocation. The proposed closed vocabulary keeps lifecycle in `ki-kind`, host activation outside this field, and repository applicability in one independently checkable axis.

### Mechanical completeness

`ki-repo-harness` should fail when a canonical skill lacks a valid classification, the baseline set differs from the accepted pair, a process skill is not `invocation-only`, or the detected set differs from `ki-repo`'s declared registry. `ki-skills` should reject invalid per-skill metadata, and `ki-repo` should fail when its declarative and executable detector targets disagree in either direction.

### Downstream ownership

Repository applicability remains with `ki-repo`; shape-specific evidence remains with the selected downstream skill. A repository that deliberately declines a mechanically detected standard retains the existing explicit coverage opt-out and audit note rather than creating a second detector registry or allowing silent absence.
