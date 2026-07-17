# ADR-KI-HARNESS-SKILLS-012: Local copies for checker support

**Date:** 2026-07-17

## Context

Every governance checker must run after its skill is installed alone or copied into a repository's durable mechanical surface.

The canonical checker-report builder belongs to `ki-skills`, but each checker needs that same implementation without importing a path in the `ki-skills` source tree or assuming another vendored skill is adjacent.

The existing composition rule correctly prevents either of those assumptions, but it does not yet distinguish reusable implementation payload from governance coverage or mode composition.

## Decision

`ki-skills` is the root of the **checker-contract system**.

It owns the canonical report contract and its executable support modules, self-governs from its own shipped files, and has no checker-support requirement on itself.

Checker support is a narrow packaging relationship, declared separately from `implies:`.

A provider declares the support modules it offers with `checker-supports:`.

A dependent declares the exact provider/module references it needs with `checker-requires:`.

The bootstrap engine validates those declarations and materialises regular-file copies at `scripts/vendored/<provider>/<module>.ts` in the dependent skill's source payload and in its generated `.ki-meta` checker payload.

A dependent imports only its local copied module.

Support modules may use builtins and other files in their own copied local closure, but never a sibling skill path.

Checker-support declarations do not add an `implies:` edge, select a skill for governance coverage, or alter composition order.

## Consequences

The checker contract has one owned implementation while every consuming checker remains directly runnable and portable.

The source and generated payloads gain an explicit, attributable copied subtree that bootstrap can validate and hash.

The `ki-skills` checker can mechanically reject a direct or escaping import while allowing the declared local copy.

Bootstrap must resolve, copy, test, and audit the full declared support closure before a dependent checker uses it.

This is deliberately narrower than a shared runtime library or a general skill-dependency system: policy relationships remain composition only.

## References

- [ADR-KI-HARNESS-SKILLS-004](ADR-KI-HARNESS-SKILLS-004-skills-valid-standalone.md) — standalone skill constraint.
- [ADR-KI-HARNESS-006](ADR-KI-HARNESS-006-bootstrapping-and-self-sufficiency.md) — durable vendored payloads.
- [ADR-KI-HARNESS-SKILLS-010](ADR-KI-HARNESS-SKILLS-010-comparable-cited-checker-findings.md) — shared finding model and aggregate rendering boundary.
