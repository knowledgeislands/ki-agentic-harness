---
id: KI-HARNESS-GOV-163
area: GOV
title: Bun boundary proof adapter
status: triage
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-10-08T10:20:00Z
updated_at: 2026-10-08T10:20:00Z
---

# KI-HARNESS-GOV-163: Bun boundary proof adapter

## Goal

`DESIGN-2`'s mechanical half can prove a boundary checker in a repository whose suite runs under `bun test` and whose TypeScript lives outside `src/`, and in a flat repository's root `scripts/`. This repository then adopts Dependency Cruiser as the reference Bun adopter and passes that proof.

## Context

`KI-HARNESS-GOV-127` planned this repository's own adoption, but its re-plan against `DESIGN-2` found the existing adapter cannot see it. The flat adapter cruises root `src/` only and runs boundary tests through a bare `vitest run` entrypoint (`skills/governance/ki-engineering/scripts/rubric/contexts/boundaries.ts`). This repository has no `src/`; its TypeScript lives under `skills/`, `hooks/`, `evals/` and `**/scripts/`, and its `test` script is `bun test`. Today `DESIGN-2` reports it not applicable. Committing a `.dependency-cruiser.ts` without a matching adapter turns that into a `FAIL` the repository cannot clear, so adoption waits for the adapter.

The same `KI-HARNESS-GOV-127` inventory found that every flat adopter cruises `src/` only. Root `scripts/` TypeScript goes unchecked in `mcp-acquire-whatsapp`, `mcp-git-audit`, `mcp-gsuite`, `mcp-housekeeping-claude`, `mcp-ki-kb-fs`, `mcp-ki-kb-notion-mirror`, `mcp-m365`, `tools-git-almanac`, `tools-ki` and, in `apps-observatory`, `scripts/diagrams/`.

## Boundary

In scope: a `bun test` native proof adapter and declared source roots beyond `src/` in `DESIGN-2`'s mechanical evidence; this repository's `.dependency-cruiser.ts`, `tooling/boundaries/` install root, `prepare` step, boundary test with a module floor and deliberate-violation case, and `knip.json` entries; the regenerated `ki-engineering` rubric; and receiver roadmap records asking each repository above to cover or exclude its root `scripts/`.

Out of scope: choosing any repository's boundary directions, and trades while trades are on hold.

## Discussion

Captured as the remaining part of `KI-HARNESS-GOV-127` during the Baseline rollout.
