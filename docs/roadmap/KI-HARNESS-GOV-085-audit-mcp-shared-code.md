---
id: KI-HARNESS-GOV-085
area: GOV
title: Audit MCP shared code
theme: governance-consistency
horizon: now
status: awaiting-review
blocks: []
blocked_by: []
baseline_ref: b105590518f5863597610794c8f2382907b5f3df
created_at: 2026-09-22T05:50:17Z
updated_at: 2026-09-24T08:41:30Z
---

## Goal

Establish a trustworthy MCP-estate consistency baseline and make genuinely shared MCP source code governable as skill-owned vendored material without introducing a package-registry dependency.

## Context

Nine current `mcp-*` repositories declare both `ki-engineering` and `ki-repo-mcp`. A fresh read-only sweep found that eight pass both current governance layers. `mcp-housekeeping-codex` retains its already-recorded 100% coverage gap, while `mcp-housekeeping-chatgpt` retains its already-recorded warning because its host-only configuration intentionally omits `process.loadEnvFile()`.

The MCP standard says `access-level.ts`, `annotations.ts`, and `audit-log.ts` are shared helpers kept in sync across siblings, but the repositories do not currently have a canonical source or drift check. The evidence is not one simple stale copy: `access-level.ts` alone currently forms several byte-distinct families, `annotations.ts` varies in every repository, and logging and result helpers mix shared behaviour with repository-specific capability. Blindly copying one implementation across the estate would erase intentional differences as readily as it would remove drift.

## Boundary

This item owns the Harness-side audit, classification, canonical vendoring contract, fixtures, and safe publication mechanism. Canonical reusable files live with `ki-repo-mcp` as installed skill assets or templates and are copied into consumers under explicit ownership evidence; they are not published as npm packages or introduced as runtime dependencies.

The item does not edit sibling MCP repositories, release servers, change live bindings, or infer that every similarly named utility must be identical. Repository migrations remain independently reviewable receiver-owned work after the Harness contract identifies exact variants and upgrade paths.

## Current state

The existing mechanical MCP shape is healthy across the fleet, so the missing layer is consistency governance rather than another generic repository audit. Two small known findings already have local owners: `MCP-HC-FND-001` covers the Codex coverage deficit and `MCP-HG-FND-002` covers the ChatGPT configuration disposition. No duplicate records are needed.

`ki-repo-mcp` currently describes shared helpers in prose but provides no canonical vendored payload, capability profile, provenance marker, semantic drift check, or guarded conform action. Consequently, matching behaviour may diverge silently and legitimate variants cannot be distinguished from accidental forks.

## Steps

- [x] Inventory every MCP repository's common utility surface, exported API, behaviour, tests, and consumers; classify exact matches, intentional capability variants, stale copies, and repository-specific code.
- [x] Define the smallest stable vendoring profiles for genuinely shared concepts such as access gating, annotations, audit logging, and MCP result envelopes without forcing unrelated helpers into one abstraction.
- [x] Add canonical skill-owned source assets with provenance and version evidence, plus a deterministic projection manifest that maps each supported profile to its destination files.
- [x] Extend `ki-repo-mcp` audit and rubric coverage to report missing, modified, obsolete, and locally extended managed files while preserving explicitly declared repository-owned seams.
- [x] Add guarded CONFORM proposals that vendor only an unambiguous declared profile, never overwrite unexplained local changes, and remain idempotent.
- [x] Add fixtures for exact agreement, intentional variants, stale managed copies, unmanaged extensions, partial projections, and safe refusal; regenerate the published rubric.
- [x] Produce a repository-by-repository migration matrix and capture only the remaining receiver-owned changes in their local roadmaps.

## Files touched

- `skills/repo-structure/ki-repo-mcp/SKILL.md`
- `skills/repo-structure/ki-repo-mcp/assets/`
- `skills/repo-structure/ki-repo-mcp/references/standards-mcp-servers.md`
- `skills/repo-structure/ki-repo-mcp/references/standards-mcp-shared-code.md`
- `skills/repo-structure/ki-repo-mcp/references/rubric.md`
- `skills/repo-structure/ki-repo-mcp/scripts/rubric/`
- `docs/decisions/`
- `docs/roadmap/KI-HARNESS-GOV-085-audit-mcp-shared-code.md`

## Verify

- A committed estate matrix accounts for every current MCP repository and every candidate shared helper without treating filename equality as semantic identity.
- Focused fixtures prove canonical projections detect drift, preserve declared variants, and refuse ambiguous overwrites.
- `ki dev skill rubric ki-repo-mcp` reproduces the committed rubric.
- `ki repo audit --skill ki-repo-mcp --repo .`, `ki repo audit --skill ki-skills --repo .`, and `ki repo audit --skill ki-work-roadmap --repo .` pass.
- `bun run test` and `bunx tsc --noEmit` pass.

## Dependencies / blocks

The Harness contract can be designed immediately. Before the final estate migration matrix is treated as current, re-run each repository's engineering and MCP audits after the locally owned `MCP-HC-FND-001` and `MCP-HG-FND-002` dispositions. Those cross-repository records are sequencing evidence, not local `blocks` entries.

## Documentation impact

### Decision Records

Record why governed vendoring is preferred over a runtime package dependency, how canonical profiles permit intentional variation, and which party owns future updates.

### Specifications

The `ki-repo-mcp` standard and rubric become the accepted projection and drift contract; no separate specification is expected unless implementation exposes a public host interface.

### Guides

Update existing MCP authoring guidance only if maintainers need a manual profile-selection or local-extension procedure after the automated contract is defined.

### Roadmap

Do not create speculative migration items in every MCP repository. Use the completed matrix to enrich an existing local owner or allocate one bounded receiver item only where a real change remains.

## Review

### Delivered

Delivered the approved MCP shared-code baseline from immutable starting revision `b105590518f5863597610794c8f2382907b5f3df`. The Harness now owns two explicit SDK-era profiles, deterministic source manifests, whole-file drift evidence, receiver-owned security seams, and guarded missing-file projection without changing any sibling MCP repository.

### Change Summary

Added `legacy-v1-core` and `modern-v2-core` assets for access gating, the complete annotation vocabulary, and SDK-compatible result envelopes. Added SHA-256 manifest verification, optional `.ki.toml` profile selection, missing/exact/modified/unsafe/obsolete/local-extension classification, safe idempotent CONFORM writes, focused fixtures, generated rubric coverage, and `GDR-KI-HARNESS-012`. The estate matrix records all nine MCP repositories and concludes that no receiver migration is mandatory before explicit profile adoption; `mcp-git-audit` remains the preferred future pilot.

### Verification

- Focused `ki-repo-mcp` suite: 19 tests passed with 128 assertions.
- Full Harness suite: 771 tests passed across 138 files with 3,315 assertions.
- `bunx tsc --noEmit`: passed.
- `ki dev skill rubric ki-repo-mcp`: generated publication is in sync.
- `ki-skills`, `ki-work-roadmap`, `ki-decision-records`, and `ki-authoring` audits: passed.
- Live `ki-repo-mcp` audit of `mcp-git-audit`: no failures; the existing source-release warning remains because its development HEAD is not annotated `v0.9.0`.

### Outstanding concerns

No receiver has adopted a profile yet. `audit-log.ts` deliberately remains repository-owned until a later shared audit engine can accept explicit sanitizer and server-identity seams. The optional `mcp-git-audit` pilot remains receiver-owned follow-on work rather than a hidden migration in this delivery.

### Post-change review

The delivered contract meets the item goal without introducing a registry dependency or normalising domain-specific security policy. Contained destinations, asset digests, physical-file checks, exact-byte comparisons, and all-or-nothing refusal around drift keep automated projection reversible and reviewable. The item is ready for acceptance review.

### Mini recap

MCP shared utilities now have a stable governed-vendoring baseline, while intentional variants remain explicit. The next useful evidence is one receiver-owned modern-profile pilot; it does not block review of this Harness contract.

## Discussion

### Planning decisions

The canonical source belongs to `ki-repo-mcp`, because that skill already owns the shared MCP source-shape contract and is installed wherever the projection is audited. Vendoring keeps each server buildable from its checkout, avoids a public or private npm dependency, and lets repository commits pin the exact code they reviewed.

The contract should prefer a few explicit capability profiles over either extreme: one lowest-common-denominator file that cannot express real needs, or one bespoke template per repository that provides no consistency. A managed file needs visible provenance and a deterministic source digest or version; repository-specific extension points must sit outside the managed region or be declared narrowly enough that audit can distinguish them.

### Audit order

First reconcile the two already-owned small findings, then freeze a fresh mechanical baseline. Next classify behaviour and API differences before selecting canonical sources. Only after that classification should CONFORM or receiver migration work be offered. This prevents a consistency initiative from normalising accidental current state or overwriting a more capable implementation with an older majority copy.

### Inventory finding

The nine-repository inventory found no byte-identical `annotations.ts` or `audit-log.ts` family. Only three exact-copy clusters exist: one modern access gate across three repositories, one legacy access gate across two repositories, and one legacy result helper across the same two repositories. Audit-log differences carry real domain redaction policy, so the managed design must extract a repository-owned sanitizer seam before any audit-log projection. The committed estate matrix owns the detailed classification and migration order.

### Relationship to GOV-078

This item governs source reuse inside MCP repositories. [KI-HARNESS-GOV-078](KI-HARNESS-GOV-078-standardise-mcp-server-distribution.md) separately governs how a completed MCP server reaches users and still needs replanning away from its registry-first assumption. Neither item should introduce npm merely to share internal code.
