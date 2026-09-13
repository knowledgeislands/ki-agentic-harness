---
id: KI-HARNESS-GOV-055
area: GOV
title: Recognise MCP SDK v2
theme: governance-consistency
horizon: next
status: awaiting-review
blocks: []
blocked_by: []
baseline_ref: 09c73ed330f61cd1eaebf94603083ac89a64a828
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

- [x] Update the MCP coverage signal and evidence label to recognise either supported server package.
- [x] Update the configuration standard's matching detection-signal description.
- [x] Add focused fixtures for legacy-only, modern-only, neither-package, and both-package repositories.
- [x] Confirm mixed or unsupported protocol profiles remain exclusively governed by `ki-repo-mcp`.

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

## Review

### Delivered

Against baseline `09c73ed330f61cd1eaebf94603083ac89a64a828`, the repository coverage signal now recognises either accepted MCP server package without changing protocol-profile validation, package migrations, or nested-manifest discovery.

### Summary of changes

Updated the `ki-repo` coverage detector and its evidence label, aligned the configuration standard, and added four focused fixtures for legacy-only, modern-only, neither-package, and both-package repositories. A delegated worker changed only the three authorised implementation files; the coordinator reviewed and integrated the result.

### Verification

Four focused MCP coverage fixtures passed. The complete `repository.test.ts` file passed after delegated test processes finished. `ki-repo`, `ki-skills`, authoring, and roadmap audits passed; the full isolated Harness test suite and TypeScript passed. An initial full-suite run under concurrent worker-test load failed, then passed cleanly without code changes once those processes completed.

### Outstanding concerns

None. Mixed-package and unsupported-major validity remains intentionally owned by `ki-repo-mcp` rather than the coverage signal.

### Post-change review

The change is limited to applicability detection and preserves the accepted protocol boundary. Positive and negative fixtures protect both supported package families and the no-signal case, so the item is ready for acceptance.

### Mini recap

Modern MCP SDK v2 repositories now trigger the same governance coverage expectation as legacy MCP SDK v1 repositories, removing the known false estate-audit finding.

## Discussion

Confirm that the coverage detector and its documented evidence label should accept either supported package, then add focused fixtures proving legacy, modern, missing, and conflicting dependency cases.
