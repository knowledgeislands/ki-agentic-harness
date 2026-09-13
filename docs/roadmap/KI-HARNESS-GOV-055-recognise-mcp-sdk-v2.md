---
id: KI-HARNESS-GOV-055
area: GOV
title: Recognise MCP SDK v2
theme: governance-consistency
horizon: next
status: ready
blocks: []
blocked_by: []
baseline_ref: null
---

# Recognise MCP SDK v2

## Goal

Discuss correcting repository governance so supported MCP SDK v2 servers are recognised as genuine `ki-repo-mcp` adopters.

## Context

The estate audit reported `COV-1` against `mcp-git-audit` because the coverage cascade recognises only the legacy `@modelcontextprotocol/sdk` package. The MCP server standard already supports the modern `@modelcontextprotocol/server` v2 profile, so the warning is a detector mismatch rather than a stale opt-in.

## Boundary

Do not migrate MCP implementations, alter protocol profiles, or weaken stale-adoption detection.

## Current state

The repository coverage detector recognises only `@modelcontextprotocol/sdk`, although `ki-repo-mcp` already accepts both that legacy package and the modern `@modelcontextprotocol/server` package. A modern-only repository therefore receives a false missing-governance finding before its declared MCP standard can assess the supported profile.

## Steps

- [ ] Update the MCP coverage signal and evidence label to recognise either supported server package.
- [ ] Update the configuration standard's matching detection-signal description.
- [ ] Add focused fixtures for legacy-only, modern-only, neither-package, and both-package repositories.
- [ ] Confirm mixed or unsupported protocol profiles remain exclusively governed by `ki-repo-mcp`.

## Files touched

- `skills/keystone/ki-repo/scripts/rubric/contexts/audit.ts`
- `skills/keystone/ki-repo/scripts/rubric/contexts/repository.test.ts`
- `skills/keystone/ki-repo/references/standards-configuration.md`
- `docs/roadmap/KI-HARNESS-GOV-055-recognise-mcp-sdk-v2.md`

## Verify

- Focused `repository.test.ts` coverage-signal fixtures pass.
- `bun run test` and `bunx tsc --noEmit` pass.
- `ki repo audit --skill ki-repo --repo .`, `ki repo audit --skill ki-skills --repo .`, `ki repo audit --skill ki-authoring --repo .`, and `ki repo audit --skill ki-work-roadmap --repo .` pass.

## Dependencies / blocks

No dependency blocks delivery. The accepted legacy and modern package identities already live in `ki-repo-mcp`; this item aligns only the upstream applicability signal.

## Documentation impact

### Decision Records

No Decision Record is required because the dual-package protocol policy is already accepted.

### Specifications

No behaviour-level product contract changes.

### Guides

No human-facing guide changes.

### Roadmap

Completing this item removes a false estate-audit finding without authorising MCP implementation migration.

## Discussion

Confirm that the coverage detector and its documented evidence label should accept either supported package, then add focused fixtures proving legacy, modern, missing, and conflicting dependency cases.
