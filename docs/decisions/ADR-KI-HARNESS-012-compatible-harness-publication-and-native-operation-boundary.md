---
id: ADR-KI-HARNESS-012
title: 'Compatible harness publication and native-operation boundary'
date: 2026-07-24
status: current
type: Architecture Decision Record
type_url: https://knowledgeislands.info/specifications/decision-records/adr
decision_type: architecture
decision_depends_on:
  - ADR-KI-HARNESS-003
  - ADR-KI-HARNESS-006
  - ADR-KI-HARNESS-007
  - ADR-KI-HARNESS-011
---

# ADR-KI-HARNESS-012: Compatible harness publication and native-operation boundary

## Context

Governed repositories currently receive copied checkers, aggregate runners, manifests, and runtime payloads under `.ki/`. That repository-local executor duplicates governance implementation into every repository. The earlier replacement model also treated the entire harness as one installed skill collection, which cannot accommodate an additional compatible harness without making a harness checkout, a runtime link, or an arbitrary archive an implicit operation source.

Knowledge Islands needs compatible harnesses to publish interoperable, typed capabilities while preserving declarative repository coverage, standalone mechanical execution, explicit runtime activation, and strict separation between user and repository state. The harness must define that portable publication boundary without taking ownership of the `ki` executable, its registry, or its grammar.

## Decision

Knowledge Islands adopts the **compatible harness** as the published unit. A compatible harness is a verified, regular-file artefact carrying a `harness.toml` manifest, a stable harness identifier, its compatibility declaration, and a typed capability inventory. The base `knowledgeislands/ki-agentic-harness` is the baseline compatible harness. Other harnesses may add capabilities only by publishing the same contract; a checkout, a cache, a runtime projection, or a repository `.ki/` directory is never an implicit harness or operation source.

A harness inventory names each capability's kind, local name, source root, compatibility constraints, integrity-covered files, and any registered native operations. A skill is addressed as `<harness-id>:<skill-name>`. Other capability kinds reserve `<harness-id>:<kind>/<name>` so that their own standards can define their local-name rules without creating an untyped directory convention. A capability inventory is an index: it must agree with the capability's authoritative source and cannot load an undeclared module.

The harness defines only artefact and capability semantics. `tools-ki` owns XDG registration, acquisition and integrity verification, capability activation, repository resolution, public commands, native operation execution, reporting, migration, release delivery, and support diagnostics. A compatible harness supplies registered in-process operations for the capability kinds that support them; the host selects, validates, orders, and runs them. Missing, incompatible, undeclared, or untrusted capabilities fail before a write.

Repository vendoring ends. Existing `.ki` runner and manifest state is a migration input only: it is never an execution fallback and is never removed without complete ownership proof. Compatible-harness projection modes are `vendor`, a managed regular-file copy, and `symlink`, a contained managed link to a verified installed harness. Neither mode creates a repository-vendored executor.

## Consequences

Repositories remain declarative through `.ki-config.toml`, but a clean clone requires the verified compatible harnesses that provide its declared capabilities before mechanical governance can run. CI must establish those harnesses explicitly and fail with recovery guidance when acquisition or integrity verification fails.

Skills retain ownership of their standards and mechanical operations, but their implementations migrate from standalone vendored scripts to registered native modules. The former bootstrap aggregate, generated `.ki/bin` wrappers, repository manifest, and package-script aliases to them are retired without a compatibility path. Existing user and repository ownership protections remain part of activation and migration rather than reasons to retain the executor.

The initial selection model is `latest`: users do not select a harness or capability version. The publication and installation layouts retain an explicit `latest` slot so a later contract can retain versioned siblings with declared compatibility and integrity evidence, without changing capability identity.

The interoperable manifest, capability identity, projection, and operation-registration boundary is in the [compatible harness contract](references/compatible-harness-contract.md). `tools-ki` records its host-specific registry, command, repository, and delivery decisions separately.

## References

- [ADR-KI-HARNESS-003](ADR-KI-HARNESS-003-mechanical-first-agent-judgment-progressively-enhances.md) — standalone mechanical governance.
- [ADR-KI-HARNESS-006](ADR-KI-HARNESS-006-user-installation-repository-bootstrap-and-self-sufficiency.md) — separated user and repository installation scopes.
- [ADR-KI-HARNESS-007](ADR-KI-HARNESS-007-uniform-skill-modes-bare-mode-scripts-and-a-coverage-scoped-aggregate-gate.md) — universal modes and coverage-scoped aggregation.
- [ADR-KI-HARNESS-011](ADR-KI-HARNESS-011-project-skill-copies-and-repository-local-links.md) — managed runtime payload ownership.
