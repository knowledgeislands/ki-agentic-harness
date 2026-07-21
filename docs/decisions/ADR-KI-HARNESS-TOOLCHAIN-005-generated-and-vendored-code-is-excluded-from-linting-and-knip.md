---
id: ADR-KI-HARNESS-TOOLCHAIN-005
title: 'Generated and vendored code is excluded from linting and knip'
date: 2026-07-11
status: current
type: Architecture Decision Record
type_url: https://knowledgeislands.info/specifications/decision-records/adr
decision_type: architecture
---

# ADR-KI-HARNESS-TOOLCHAIN-005: Generated and vendored code is excluded from linting and knip

## Context

Two kinds of file in a Knowledge Islands repo are produced, not authored: vendored governance checkers (copied verbatim from the harness into a repo's self-sufficiency tree so it can self-govern) and generated code (typed MCP clients emitted by a codegen step). Both are byte-for-byte reproductions of a source maintained elsewhere. When the standard toolchain treats them as ordinary source, Biome reformats them — drifting a vendored copy away from its canonical original — and knip reports their entry points as unused files, so a repo's read-only gate can never be clean.

## Decision

Generated and vendored code is excluded from the conformance toolchain — it is never reformatted, and never counted as unused.

- Biome's `files.includes` excludes the generated and vendored trees (e.g. `!src/generated/**` and the vendored-checker tree, whether `scripts/ki/**` or the `.ki-meta/` self-sufficiency tree).
- knip's `ignore` lists the same trees, so their unreferenced entry points do not surface as unused files.
- The principle: a file that is a faithful reproduction of a source maintained elsewhere is owned by that source, not by this repo's style; conformance is asserted against the source, not re-derived here.

## Consequences

- A repo's read-only `ki:verify` gate can be clean even though it carries vendored checkers and generated clients.
- A vendored copy stays byte-identical to its canonical original because no local formatter rewrites it, so the self-sufficiency contract's copy-verbatim guarantee holds.
- The exclusion is per-repo configuration — a newly introduced generated tree must be added to both the Biome and knip exclusions.

## References

- [ADR-KI-HARNESS-TOOLCHAIN-001](ADR-KI-HARNESS-TOOLCHAIN-001-bun-biome-and-knip-standard-toolchain.md) — the Biome / knip toolchain these exclusions configure.
- [ADR-KI-HARNESS-006](ADR-KI-HARNESS-006-user-installation-repository-bootstrap-and-self-sufficiency.md) — the self-sufficiency contract that vendors the checkers this rule protects.
