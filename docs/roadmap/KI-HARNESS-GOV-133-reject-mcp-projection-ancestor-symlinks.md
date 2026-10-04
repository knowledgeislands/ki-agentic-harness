---
id: KI-HARNESS-GOV-133
area: GOV
title: Reject projection ancestor symlinks
theme: governance-consistency
horizon: now
status: done
blocks: []
blocked_by: []
baseline_ref: b131f9aac3dc8425af67066e8b67252a7cd268cf
created_at: 2026-10-04T10:52:28Z
updated_at: 2026-10-04T16:28:46Z
---

# KI-HARNESS-GOV-133: Reject projection ancestor symlinks

## Goal

Shared MCP utility audit and CONFORM reject paths traversing symlinked ancestor directories before reading or proposing managed projections. Audit must not certify managed files reached through such links as conformant.

## Context

The [shared-code standard](../../skills/repo-structure/ki-repo-mcp/references/standards-mcp-shared-code.md) requires contained destinations, physical parent directories and regular repository-owned seams. The [shared-code context](../../skills/repo-structure/ki-repo-mcp/scripts/rubric/contexts/shared-code.ts) checks lexical containment and each file's leaf with `lstatSync`; its CONFORM guard checks only the immediate parent. An earlier symlinked ancestor can therefore escape those checks. The [shared-code rubric](../../skills/repo-structure/ki-repo-mcp/scripts/rubric/items/shared-code.ts) can accept exact managed bytes reached through that ancestor.

A disposable Bun fixture reproduced the gap on 2026-10-04 against Harness commit `654bc4f86eb01611582118c58904d5c943b14e5d`. It created a receiver root beside an external source directory, with physical `config/` and `utils/` directories and all three required seams in that external directory, then linked the receiver's `src/` to it. Calling `prepareMcpSharedCode` for `modern-v2-core` in CONFORM mode reported no missing seams and exposed `conformMissing`; invoking it proposed all three managed writes. After manually materialising those proposals only inside the disposable fixture, an audit-mode context classified all three files as exact, although their physical locations were outside the receiver root. A control with a direct `src/utils/` symlink correctly withheld `conformMissing`. Assertions passed and the fixture was removed.

This establishes unsafe context proposals and a false-clean audit classification. It does not establish that the CLI's final apply writer permits an external write; that writer was not exercised.

## Boundary

Repair belongs to the shared-code context and its [MCP context tests](../../skills/repo-structure/ki-repo-mcp/scripts/rubric/contexts/mcp.test.ts). Validate every root-relative ancestor component before inspecting managed files, required seams or utility extensions, and before proposing writes. Reject symlinked ancestors even when their targets remain inside the repository, because the existing contract requires physical parents.

Focused fixtures should cover inside-root and outside-root ancestor links, nested ancestors and direct-parent controls, required seam paths, exact existing managed files, missing managed destinations, and ordinary physical projections. Preserve missing-only creation, modified-file refusal and repeat-CONFORM idempotence. Clarify the existing standard only if needed; do not change profile opt-in semantics, migrate receiver repositories, introduce a shared audit engine or publish packages.

## Current state

`skills/repo-structure/ki-repo-mcp/scripts/rubric/contexts/shared-code.ts` classifies each managed destination, required seam and the `src/utils` extension directory with a leaf-only `lstatSync` (`nodeKind`), and its CONFORM guard checks only each destination's immediate parent. No root-relative ancestor above the leaf is validated, so a symlinked `src/` (inside or outside the repository) or a symlinked `src/utils/` reached as an ancestor passes. The seven local MCP server checkouts were checked on 2026-10-04 and none has a symlinked `src` or `src/*` entry, so the stricter rule is not expected to produce new estate findings.

## Steps

- [x] Add a root-relative physical-path classifier in `shared-code.ts` that walks every ancestor component between the repository root and the leaf, returns `unsafe` for a symlinked or non-directory ancestor, `missing` for an absent ancestor, and otherwise the existing leaf classification.
- [x] Use it for managed destinations, required seams, the `src/utils` extension scan and the CONFORM parent-directory guard, so no read or proposal happens through a symlinked ancestor.
- [x] Add focused `mcp.test.ts` fixtures: an outside-root `src` link with all seams and managed files present; an inside-root `src` link; a nested `src/utils` link beneath a physical `src`; each must refuse CONFORM proposals and must not classify managed files or seams as exact or present. Existing physical-projection tests remain the controls for missing-only creation, modified-file refusal and repeat-CONFORM idempotence.

## Files touched

- `skills/repo-structure/ki-repo-mcp/scripts/rubric/contexts/shared-code.ts`
- `skills/repo-structure/ki-repo-mcp/scripts/rubric/contexts/mcp.test.ts`
- `docs/roadmap/KI-HARNESS-GOV-133-reject-mcp-projection-ancestor-symlinks.md`

## Verify

- `bun test skills/repo-structure/ki-repo-mcp`, `bun run test` and `bunx tsc --noEmit` pass.
- `ki repo audit --skill ki-repo-mcp --repo <each local MCP server checkout>` shows no new SHARED findings attributable to this change.
- `ki repo audit --skill ki-work-roadmap --repo .` passes.

## Dependencies / blocks

None. The standard already requires physical parents, so this is a conformance repair rather than a contract change; profile opt-in semantics, receiver migration and package publication stay out of scope.

## Documentation impact

### Decision Records

None.

### Specifications

None; the shared-code standard already states the physical-parent requirement.

### Guides

None.

### Roadmap

This record only.

## Review

### Delivered

The `ki-repo-mcp` shared-code context now validates every root-relative ancestor before it reads a managed file, a required seam or the `src/utils` extension directory, and before it exposes a CONFORM proposal. A symlinked ancestor, inside or outside the repository, makes the path `unsafe`, so audit cannot certify managed bytes reached through it and CONFORM proposes nothing.

### Change Summary

- `skills/repo-structure/ki-repo-mcp/scripts/rubric/contexts/shared-code.ts`: new `physicalKind(root, path)` walks each component between the root and the leaf, returning `unsafe` for a symlinked or non-directory ancestor and `missing` for an absent one, then the existing leaf classification. It replaces the leaf-only `nodeKind` for managed destinations, required seams, the `src/utils` scan and the CONFORM parent guard.
- `skills/repo-structure/ki-repo-mcp/scripts/rubric/contexts/mcp.test.ts`: a `projectedRepository` fixture built through the real CONFORM path; a physical control that audits with no violation; and three ancestor layouts (outside-root `src` link, inside-root `src` link, nested `src/utils` link beneath a physical `src`), each asserting `VIOLATION` and no `PASS` for every managed file and the `src/utils/errors.ts` seam, no `conformMissing`, and no proposed writes after a managed file is removed.

### Verification

- `bun test skills/repo-structure/ki-repo-mcp`: 33 pass, 0 fail. With `shared-code.ts` reverted to the baseline, the three ancestor tests fail, so they are not vacuous.
- `bun run test`: 857 pass, 0 fail. `bunx tsc --noEmit` and `bunx biome check` on the changed files: clean.
- `ki repo audit --skill ki-repo-mcp` against the seven local MCP server checkouts (`mcp-git-audit`, `mcp-gsuite`, `mcp-ki-kb-fs`, `mcp-ki-kb-notion-mirror`, `mcp-m365`, `mcp-acquire-whatsapp`, `mcp-housekeeping-claude`): PASS for each through the installed (linked) harness, so no new estate findings.
- `ki repo audit --skill ki-work-roadmap --repo .`: PASS.

### Outstanding concerns

The CLI's final apply writer was not exercised, as the record notes; the context no longer proposes writes in these layouts, which removes the reachable path. The repository root itself being a symlink stays outside this item's root-relative scope.

### Post-change review

Missing-only creation, modified-file refusal and repeat-CONFORM behaviour are unchanged for physical projections; the existing shared-code tests and the new physical control still pass. The standard already required physical parents, so no documentation change was needed.

### Mini recap

Ancestor symlinks no longer let the MCP shared-code audit certify, or CONFORM propose, managed files outside their physical parents; estate MCP audits remain clean.

## Done

Accepted 2026-10-04 on the review packet above, under the owner's delegated estate-push authority following an independent Fable review verdict of ACCEPT. Fable confirmed all criteria, low regression risk for live estate audits, and noted only that the capture-time Discussion wording is now historical.

## Discussion

Captured at the owner's request during MCP shared-utility adoption review. This record retains the confirmed defect as unadopted Triage work; it authorises no implementation and makes no readiness or acceptance claim. No existing retained roadmap item or inbound trade owned this specific ancestor-validation gap at capture.
