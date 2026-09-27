---
id: KI-HARNESS-OPS-001
title: Complete Claude-state cleanup
area: OPS
theme: operations
horizon: waiting-for
status: draft
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-07-29T00:10:07Z
updated_at: 2026-09-27T16:50:38Z
---

## Goal

Retain the origin and approval boundary of the host Claude cleanup while its operational delivery is owned by DOTFILES-UE-056, rather than maintaining a second cleanup plan in the portable harness.

## Context

The principal delivery record is [DOTFILES-UE-056](https://github.com/krisb/dotfiles/blob/main/docs/roadmap/DOTFILES-UE-056-review-host-claude-cleanup.md). The predecessor removed in harness commit aa704b15e111bed44305f66a009d218564111c9d explicitly described this machine's Claude projects and telemetry and excluded memory. That history establishes host-wide ownership; its old measurements are not a current inventory or deletion target.

On 27 September 2026 the principal approved the roadmap ownership split. This record preserves its identifier, Waiting for / draft state and provenance. Chezmoi owns the refreshed inventory, exact approval, execution and verification; neither the ownership edit nor this retained pointer authorises deletion.

## Boundary

Do not preserve stale counts as a target or broaden cleanup beyond the reviewed set. This record no longer owns cleanup execution or changes to portable housekeeping capabilities. It is not complete merely because the principal record exists; any later disposition remains an explicit lifecycle decision.

## Discussion

### Return condition

The host principal DOTFILES-UE-056 retains the wait for deliberately authorised destructive access and a refreshed inventory presented for exact approval before deletion. Follow its evidence here without duplicating its execution plan or broadening its session-and-telemetry boundary.
