---
id: ADR-KI-HARNESS-008
title: 'Vendored cross-skill tools for harness-shaped targets'
date: 2026-07-13
status: current
type: Architecture Decision Record
type_url: https://knowledgeislands.info/specifications/decision-records/adr
decision_type: architecture
---

# ADR-KI-HARNESS-008: Vendored cross-skill tools for harness-shaped targets

## Context

The legacy repository bootstrap implementation produces an ordinary self-governance surface under `.ki/`, but a harness-shaped repository also authors a whole `skills/` tree.

That tree needs two additional harness operations: one to validate and render the implication graph, and one to render generated HELP output. A checkout-dependent project linker does not belong to the public operation surface.

## Decision

When a resolved repository carries `ki-harness`, the verified base harness provides exactly two native cross-skill operations:

- `skill-graph.ts` validates and renders the implication graph across the harness's `SKILL.md` files.
- `skill-help.ts` renders a skill's HELP block and checks the generated skill index.

They are harness-level operations because they range over a harness's whole skills tree rather than one governed skill's declared checker unit. The native host resolves them from the verified installed base harness; it does not copy them into `.ki/bin` or execute a repository-local fallback.

The native operation host provides neither a checkout-dependent runtime linker nor a repository-vendored executor. User and repository activation create only managed runtime discovery links, with ownership, containment, idempotence, dry-run, and refusal protections.

## Consequences

- An ordinary repository declares only the governance operations its coverage requires; verified installed compatible harnesses supply them at execution time.
- A harness-shaped repository gains graph and HELP operations through the verified base harness, without a copied tool, generated package runner, or source checkout dependency.
- The existing vendored cross-skill tools are legacy migration state. They may be examined only by the explicit fail-closed migration operation and never serve as a native-operation fallback.
- `sync-skills.ts` and any checkout-local renderer remain implementation details until their responsibilities are represented as registered collection operations; neither is a public repository execution entry point.

## References

- [ADR-KI-HARNESS-006](ADR-KI-HARNESS-006-user-installation-repository-bootstrap-and-self-sufficiency.md) — the user-installation and repository-activation boundary.
- [ADR-KI-HARNESS-007](ADR-KI-HARNESS-007-uniform-skill-modes-bare-mode-scripts-and-a-coverage-scoped-aggregate-gate.md) — coverage-scoped native operations.
