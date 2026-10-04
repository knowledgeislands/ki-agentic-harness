---
id: KI-HARNESS-GOV-133
area: GOV
title: Reject projection ancestor symlinks
theme: governance-consistency
horizon: triage
status: draft
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-10-04T10:52:28Z
updated_at: 2026-10-04T10:52:28Z
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

## Discussion

Captured at the owner's request during MCP shared-utility adoption review. This record retains the confirmed defect as unadopted Triage work; it authorises no implementation and makes no readiness or acceptance claim. No existing retained roadmap item or inbound trade owned this specific ancestor-validation gap at capture.
