---
id: ADR-KI-HARNESS-011
title: 'Project skill copies and repository-local links'
date: 2026-07-16
status: current
type: Architecture Decision Record
type_url: https://knowledgeislands.info/specifications/decision-records/adr
decision_type: architecture
---

# ADR-KI-HARNESS-011: Project skill copies and repository-local links

## Context

The harness has three distinct state surfaces: verified installed compatible harnesses for a user, explicitly activated runtime discovery links, and a repository's declarative coverage.

The current legacy implementation still contains copied runtime skills and mechanical self-governance units under `.ki`. Those derived footprints must not make a harness checkout or a copied repository executor appear to be an ordinary runtime dependency.

## Decision

The three state surfaces remain separate and have explicit owners.

- The CLI host owns verified harness registration in the user's XDG data location. It does not publish user or repository runtime copies merely by installing a harness.
- User-scope activation owns managed discovery links in the selected user runtime. It activates only the named installed skill and cannot create repository state.
- Repository-scope activation owns the selected repository declaration update and its managed discovery links. It cannot create user runtime state, a copied executor, or a harness-checkout dependency.
- A repository-local `ki-self` remains authored and committed by that repository. Any runtime projection is a managed activation link, not a generated skill copy.
- The legacy `.ki` runners, manifests, copied checkers, and copied payloads are migration inputs only. They have no role in native operation resolution and are removed only with complete ownership proof.
- Activation and migration use ownership markers, containment and conflict checks, dry-run support, idempotence, and refusal for altered, unfamiliar, linked, or concurrently changed material.

## Consequences

- Ordinary sessions depend on verified installed harnesses and explicitly managed discovery links, not a harness checkout or copied payload.
- A consumer repository cannot acquire a checkout-dependent project link by accident or through the public activation path.
- Global and repository activation stay narrow, selected-scope operations; no activation expands implicitly from a repository to the user or vice versa.
- A valid legacy runtime copy may migrate only with complete ownership proof; divergent or unsafe local content is preserved for manual reconciliation.

## References

- [ADR-KI-HARNESS-006](ADR-KI-HARNESS-006-user-installation-repository-bootstrap-and-self-sufficiency.md) — the user-installation, repository-activation, and self-sufficiency contracts.
- [ADR-KI-HARNESS-008](ADR-KI-HARNESS-008-vendored-cross-skill-tools-for-harness-shaped-targets.md) — harness-gated whole-tree operations.
- [ADR-KI-HARNESS-SKILLS-004](ADR-KI-HARNESS-SKILLS-004-skills-must-be-valid-standalone.md) — standalone skill validity and composition.
