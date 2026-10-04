---
id: KI-HARNESS-GOV-134
area: GOV
title: Align MCP safety contracts
theme: governance-consistency
horizon: triage
status: draft
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-10-04T10:57:53Z
updated_at: 2026-10-04T10:57:53Z
---

# KI-HARNESS-GOV-134: Align MCP safety contracts

## Goal

Make the MCP standard's authentication recovery and dry-run guidance consistent with access gating and complete-operation preview safety, so receiver fixes can be judged against one truthful contract.

## Context

The [MCP server standard](../../skills/repo-structure/ki-repo-mcp/references/standards-mcp-servers.md) correctly hides write-annotated, token-persisting authentication tools at the default read tier, but its recovery guidance in two places unconditionally recommends `*_auth_start`. Fixture-only registration in GSuite and M365 confirmed that the 401 hint names a tool unavailable at that tier. Their receiver-owned intake records are `MCP-GSUITE-FND-007` and `MCP-M365-FND-006`; their implementations and annotations remain local decisions.

The same standard's dry-run rule does not state clearly that accepting a preview flag on an optional CLI requires the complete operation, including preparatory mutations, to be side-effect-free. Notion Mirror's `roots publish --dry-run` accepts the flag but can still reach mutating branches (`MCP-NOTION-TOOL-009`). Git Audit's commit preview stages into the real index (`MCP-GIT-TOOL-006`). These are receiver-owned defects, not reasons to weaken the standard's access gate or move domain logic into the Harness.

The existing tool catalogue and guide rubrics already own registered-surface accuracy and usable procedures. Current README tool-name sets match the reviewed registrations; GSuite's access-tier prose is a receiver-specific drift. Catalogue generation is an implementation option, not a house requirement. Superseded-repository routing is likewise governed by existing roadmap and trade authority rules.

## Boundary

If adopted, update both duplicated authentication hint passages in the MCP server standard so the recovery path is reachable for the caller's configured access tier. Preserve the write classification of authentication that persists tokens. Clarify that a supported dry run covers preparatory and final effects, and that an unsupported combination is rejected before any effect. Align the TOOL-1 judgment prompt and its source references with these rules, and add focused rubric/standard tests where the Harness has executable checks.

Do not add a new skill, mandate a generated catalogue, change receiver implementations, alter Git's hook or concurrency policy, or treat source scans as proof of runtime availability. `KI-HARNESS-GOV-133` separately owns the shared-code symlink-ancestor safety defect and does not block this standards clarification.

## Discussion

This unadopted Triage item records the narrow cross-repository standard refinement identified by the full rubric comparison on 2026-10-04. Before readiness, inspect both recovery passages, the dry-run rule, TOOL-1's source links and tests, then propose exact wording and a verification plan. Receiver records retain selection, delivery and acceptance authority; this item grants none of those transitions.
