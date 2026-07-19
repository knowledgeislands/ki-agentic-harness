# ADR-KI-HARNESS-SKILLS-012: Local copies for checker modules

**Date:** 2026-07-17

## Context

Every governance checker must run after its skill is installed alone or copied into a repository's durable mechanical surface.

The canonical checker reporter belongs to `ki-skills`, but each checker needs that same implementation without importing a path in the `ki-skills` source tree or assuming another vendored skill is adjacent.

The existing composition rule correctly prevents either of those assumptions, but it does not yet distinguish reusable implementation payload from governance coverage or mode composition.

## Decision

`ki-skills` is the root of the **checker-contract system**.

It owns the canonical checker reporter and its executable modules, self-governs from its own shipped files, and has no checker-module dependency on itself.

Checker modules are a narrow packaging relationship, declared separately from `ki-depends-on:`.

A provider declares the modules it offers with `checker-modules:`.

A dependent declares the exact `provider:module` references it needs with `ki-checker-dependencies:`.

The module identifier has no extension and resolves to exactly one provider payload in `scripts/shared/`: either `scripts/shared/<module>.ts` or a self-contained `scripts/shared/<module>/` directory.

The bootstrap engine validates those declarations and materialises a shape-preserving copy under `scripts/vendored/<provider>/` in the dependent skill's source payload and in its generated `.ki-meta` checker payload.

The source payload and every entry in a directory payload must be regular, non-symlinked filesystem entries.

A dependent imports only its local copied module.

Checker modules may use builtins and other files in their own copied local closure, but never a sibling skill path.

Checker-module declarations do not add a `ki-depends-on:` edge, select a skill for governance coverage, or alter composition order.

## Consequences

The checker contract has one owned implementation while every consuming checker remains directly runnable and portable.

The source and generated payloads gain an explicit, attributable copied subtree that bootstrap can validate and hash.

The `ki-skills` checker can mechanically reject a direct or escaping import while allowing the declared local copy.

Bootstrap must resolve, copy, test, and audit the full declared checker-module closure before a dependent checker uses it.

This is deliberately narrower than a shared runtime library or a general skill-dependency system: policy relationships remain composition only.

## References

- [ADR-KI-HARNESS-SKILLS-004](ADR-KI-HARNESS-SKILLS-004-skills-valid-standalone.md) — standalone skill constraint.
- [ADR-KI-HARNESS-006](ADR-KI-HARNESS-006-bootstrapping-and-self-sufficiency.md) — durable vendored payloads.
- [ADR-KI-HARNESS-SKILLS-010](ADR-KI-HARNESS-SKILLS-010-comparable-cited-checker-findings.md) — shared finding model and aggregate rendering boundary.
