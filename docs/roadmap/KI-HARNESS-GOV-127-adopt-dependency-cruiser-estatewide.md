---
id: KI-HARNESS-GOV-127
area: GOV
title: Adopt Dependency Cruiser estatewide
theme: governance-consistency
horizon: triage
status: draft
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-10-02T05:27:09Z
updated_at: 2026-10-02T05:32:46Z
---

# KI-HARNESS-GOV-127: Adopt Dependency Cruiser estatewide

## Goal

Every applicable KI engineering repository has a working, enforced check of its source dependency graph and declared import boundaries. A reviewer can see which repositories are covered and why any repository is exempt.

## Context

The `ki-engineering` standard already names Dependency Cruiser for enforcing stated dependency directions (`skills/governance/ki-engineering/references/standards-engineering.md:85`), but it is not part of the common audited toolchain alongside Biome, TypeScript, Knip, and Syncpack. On 2026-10-02, `mcp-acquire-whatsapp` was the only repository under `knowledgeislands/` with a `.dependency-cruiser.ts` configuration; `tools-ki` had none. The separate `infoschematics` project also has a working configuration and check. The existing examples cover circular and unresolved imports as well as repository-specific architectural rules.

A file or dependency declaration alone does not prove a check is effective. The engineering standard records that Dependency Cruiser can report a clean result after examining zero modules when its TypeScript parser is incompatible, and that unresolved imports can evade path-based rules (`standards-engineering.md:86-87`). Universal adoption therefore needs an applicability rule, execution and coverage evidence, and a test that a deliberate boundary crossing fails.

## Boundary

This item owns the portable `ki-engineering` policy, audit and conformance behaviour, and a reviewable estate rollout route for applicable TypeScript/Bun repositories. Repository-specific boundary directions remain with each source owner; the harness must not invent them from folder names. Do not impose this tool on non-TypeScript repositories without a separate applicability decision or treat a zero-module cruise as passing evidence.

## Discussion

### Common contract

Decide the minimum shared check, including circular and unresolved dependencies, how each repository declares meaningful import directions, and whether the checker runs through the test suite or a repository command. Treat tracked `scripts/` code as a candidate source root and require an explicit reason when it is excluded; checks that only cruise `src/` can miss imports from repository tooling. Extend the engineering rubric so a missing, disconnected, or ineffective check is visible in `ki repo audit`, with conformance limited to safe, deterministic setup. Retain the existing standard's separate supported TypeScript install root where the repository compiler is incompatible.

### Rollout evidence

Inventory repositories governed by `ki-engineering`, record applicability, existing enforcement, and whether their `scripts/` code is covered, then sequence repository-owned adoption work for gaps. Verification should demonstrate that the checker visits the intended source roots, resolves the imports used by its rules, and fails on a deliberate crossing. The two working configurations provide starting examples, not a single rule set to copy into unrelated repositories.
