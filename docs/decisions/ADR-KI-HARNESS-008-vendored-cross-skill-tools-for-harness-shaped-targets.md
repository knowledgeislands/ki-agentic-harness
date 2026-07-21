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

Repository bootstrap produces the ordinary self-governance surface under `.ki-meta/`, but a harness-shaped repository also authors a whole `skills/` tree.

That tree needs two additional generated tools: one to validate and render the implication graph, and one to render generated HELP output. A checkout-dependent project linker belongs to the harness developer workflow, not the vendored bootstrap engine.

## Decision

When a resolved repository carries `ki-harness`, the bootstrap engine vendors exactly two manifest-hashed cross-skill tools into `.ki-meta/bin/`:

- `skill-graph.ts` validates and renders the implication graph across the harness's `SKILL.md` files.
- `skill-help.ts` renders a skill's HELP block and checks the generated skill index.

They are engine-level artifacts because they range over a harness's whole skills tree rather than one governed skill's declared checker unit.

The engine vendors neither a user installer nor a runtime linker. `ki-harness` owns the explicit source-harness-only project linker; it composes the bootstrap publisher's safe payload transaction but does not become part of the vendored bootstrap surface.

## Consequences

- An ordinary repository receives only the self-governance surface its declared coverage requires.
- A harness-shaped repository receives graph and HELP tooling that its generated package scripts can invoke without a source checkout.
- `sync-skills.ts` is removed from the bootstrap engine's cross-skill vendor list. Its replacement is implemented and governed with `ki-harness`, outside `.ki-meta/` bootstrap delivery.
- The bootstrap engine may continue to use its local HELP renderer while creating per-skill snapshots; that renderer is not a public user-install or repository-bootstrap entry point.

## References

- [ADR-KI-HARNESS-006](ADR-KI-HARNESS-006-user-installation-repository-bootstrap-and-self-sufficiency.md) — the repository bootstrap and self-sufficiency boundary.
- [ADR-KI-HARNESS-007](ADR-KI-HARNESS-007-uniform-skill-modes-bare-mode-scripts-and-a-coverage-scoped-aggregate-gate.md) — coverage-scoped vendoring.
