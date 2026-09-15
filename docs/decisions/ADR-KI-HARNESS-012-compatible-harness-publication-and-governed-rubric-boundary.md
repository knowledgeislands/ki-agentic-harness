---
id: ADR-KI-HARNESS-012
title: 'Compatible harness publication and governed-rubric boundary'
date: 2026-07-24
status: current
decision_type_url: https://knowledgeislands.info/specifications/decision-records/adr
decision_type: architecture
decision_depends_on:
  - ADR-KI-HARNESS-003
  - ADR-KI-HARNESS-006
  - ADR-KI-HARNESS-007
  - ADR-KI-HARNESS-011
---

# ADR-KI-HARNESS-012: Compatible harness publication and governed-rubric boundary

## Context

Governed repositories currently receive copied checkers, aggregate runners, manifests, and runtime payloads under `.ki/`. That repository-local executor duplicates governance implementation into every repository. The earlier replacement model also treated the entire harness as one installed skill collection, which cannot accommodate an additional compatible harness without making a harness checkout, a runtime link, or an arbitrary archive an implicit operation source.

Knowledge Islands needs compatible harnesses to publish typed capabilities while preserving declarative repository coverage and strict separation between user and repository state. The harness must define its payload boundary without taking ownership of the `ki` executable, its registry, or its grammar.

## Decision

Knowledge Islands adopts the **compatible harness** as the published unit. The current compatible payload is a verified archive containing regular `skills/`, `subagents/`, and `hooks/` directories. The host derives a harness identity from its installed `<owner>/<repository>` path and discovers skills from their `SKILL.md` frontmatter. The base `knowledgeislands/ki-agentic-harness` is the baseline compatible harness. A checkout, cache, runtime projection, or repository `.ki/` directory is never an implicit harness or operation source.

A skill is addressed as `<harness-id>:<skill-name>`. Other capability kinds reserve `<harness-id>:<kind>/<name>` when the host supports them. A skill's source directory and frontmatter remain authoritative. For governed skills, the harness contributes only the skill-specific rubric definition, evidence/context builders, and declared safe repairs; no unlisted or escaping file becomes executable.

The harness defines this payload and capability semantics only. `tools-ki` owns acquisition evidence, installation layout, capability activation, repository resolution, public commands, governed-rubric execution, reporting, migration, release delivery, and support diagnostics. The host selects, validates, orders, and runs compatible rubric definitions through one generic runtime. Missing, incompatible, undeclared, or untrusted capabilities fail before a write.

Repository vendoring ends. Existing `.ki` runner and manifest state is a migration input only: it is never an execution fallback and is never removed without complete ownership proof. Current activation uses managed links from the verified installed payload. Copied projection and version selection are outside the Harness payload contract.

The one repository-local exception is an explicitly declared `ki-self` at the canonical physical `.agents/skills/ki-self/` source. Its direct catalogue uses the same native rubric contract and repository-scoped transaction, but remains repository-owned, reports distinct provenance, and grants no authority to another local skill or caller-selected path.

## Consequences

Repositories remain declarative through `.ki.toml`, but a clean clone requires the verified compatible harnesses that provide its declared capabilities before mechanical governance can run. CI must establish those harnesses explicitly and fail with recovery guidance when acquisition or integrity verification fails.

Skills retain ownership of their standards, rubrics, evidence, and declared mechanical repairs, while `tools-ki` owns the generic checker, reporter, mode, ordering, and transaction runtime. The former bootstrap aggregate, generated `.ki/bin` wrappers, repository manifest, and package-script aliases to them are retired without a compatibility path. Existing user and repository ownership protections remain part of activation and migration rather than reasons to retain the executor.

The direct-payload capability and governed-rubric boundary is in the [compatible harness contract](references/compatible-harness-contract.md). `tools-ki` records its host-specific installation, command, repository, and delivery decisions separately.

## References

- [ADR-KI-HARNESS-003](ADR-KI-HARNESS-003-mechanical-first-agent-judgment-progressively-enhances.md) — standalone mechanical governance.
- [ADR-KI-HARNESS-006](ADR-KI-HARNESS-006-user-installation-repository-bootstrap-and-self-sufficiency.md) — separated user and repository installation scopes.
- [ADR-KI-HARNESS-007](ADR-KI-HARNESS-007-uniform-skill-modes-bare-mode-scripts-and-a-coverage-scoped-aggregate-gate.md) — universal modes and coverage-scoped aggregation.
- [ADR-KI-HARNESS-011](ADR-KI-HARNESS-011-project-skill-copies-and-repository-local-links.md) — managed runtime payload ownership.
