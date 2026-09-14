---
id: KI-HARNESS-GOV-058
area: GOV
title: Classify Skill Applicability
theme: governance-consistency
horizon: next
status: draft
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-09-13T15:45:43Z
updated_at: 2026-09-14T18:53:27Z
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

The leading design is an orthogonal applicability policy such as `baseline | detected | declaration-only | invocation-only`, with a detector owner required only for `detected`. The exact vocabulary, registry location, and Decision Record shape remain approval gates before Ready.

## Steps

- [ ] Decide the public applicability vocabulary and explicitly separate it from `ki-kind` and host activation.
- [ ] Decide the canonical detector-registry location and bidirectional ownership contract.
- [ ] Record the accepted public contract in a new Decision Record or an explicit amendment to the existing skill-shape decision.
- [ ] Add per-skill metadata validation to `ki-skills` and exhaustive collection enforcement and publication to `ki-repo-harness`.
- [ ] Make each detector-owning skill's declarative registry agree with executable detector coverage, with `ki-repo` retaining repository-wide evidence and downstream shape skills retaining specialised evidence.
- [ ] Migrate all canonical skills only after the vocabulary and registry contract are accepted.
- [ ] Regenerate rubric and capability publications and add focused behavioural coverage.

## Files touched

- Decision Record under `docs/decisions/`
- canonical `skills/**/SKILL.md` metadata
- `skills/keystone/ki-skills/` metadata validation and tests
- `skills/keystone/ki-repo/` coverage registry and tests
- `skills/repo-structure/ki-repo-harness/` completeness publication and tests
- generated rubrics and `skills/README.md`
- focused `ki-skills` evaluation scenario when useful

## Verify

- Focused `ki-skills`, `ki-repo`, and `ki-repo-harness` tests
- Generated rubric publication checks
- `ki repo audit --skill ki-skills --repo .`
- `ki repo audit --skill ki-repo --repo .`
- `ki repo conform --skill ki-repo-harness --repo .`
- `ki repo audit --skill ki-repo-harness --repo .`
- `ki repo audit --skill ki-authoring --repo .`
- `bun run test`
- `bunx tsc --noEmit`

## Dependencies / blocks

Readiness requires explicit approval of the applicability vocabulary, detector-registry owner, bidirectional coverage contract, and Decision Record approach. These are public contract choices affecting every canonical skill and downstream consumer, so implementation remains outside autonomous batch authority until resolved.

## Documentation impact

### Decision Records

Add `ADR-KI-HARNESS-SKILLS-014` or explicitly amend the existing skill-shape Decision Record before implementation.

### Specifications

Update repository or harness specifications only if the accepted contract changes their observable conformance requirements.

### Guides

Update authoring or repository guidance only after the metadata contract is accepted and implemented.

### Roadmap

Keep this item as the decision and migration authority. Consumer migrations, if required, become separately reviewable owner-local work.

## Discussion

### Applicability vocabulary

The earlier candidates `baseline`, `repository-detected`, `downstream-detected`, `explicit`, and `process` mix several axes. A cleaner public contract keeps lifecycle in `ki-kind`, describes applicability separately, and records a detector owner only where detection exists.

### Mechanical completeness

`ki-repo-harness` should fail when a canonical skill lacks a valid applicability classification. `ki-skills` should validate the field syntax and per-skill consistency. Detector owners should fail when their declared registry and executable coverage disagree in either direction.

### Downstream ownership

Repository-wide evidence remains with `ki-repo`; shape-specific evidence remains with the active parent skill. For example, a Knowledge Base capability can be detected by `ki-repo-kb`, but a repository that deliberately declines the corresponding standard should retain an explicit coverage opt-out rather than silent absence.
