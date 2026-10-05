---
id: KI-HARNESS-RTP-002
title: Reach Cowork MCP servers
area: RTP
theme: runtime-portability
horizon: parked
status: draft
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-07-29T00:10:07Z
updated_at: 2026-10-05T10:45:00Z
---

## Goal

Provide a supported, secure way for Cowork to reach KI MCP servers.

## Context

Choose between sandbox-bundled servers and authenticated remote endpoints for host-local KI MCP servers in Cowork, then prove one supported path.

## Boundary

Unblock only when the owner selects the security posture and settles the plugin's license and visibility; web remains a separate manual-connector concern.

## Discussion

### Return condition

The owner must choose the endpoint security posture and settle plugin distribution constraints before either reachability path can be treated as supported.

### Owner question

Recorded 2026-10-05 by the Fable reviewer during make-ready triage; this record stays draft until Kris answers. Should Cowork reach KI MCP servers by bundling them in the sandbox or through authenticated remote endpoints, and what licence and visibility should the plugin carry?

### Parked

Parked 2026-10-05 on Kris's retirement of `ki-plugins` (`ADR-KI-HARNESS-015`). The plugin was the only route by which KI content reached Cowork, so with no supported Cowork packaging there is nothing for a reachable MCP server to serve, and the licence and visibility question about the plugin no longer arises. Return trigger: an owner decision to reinstate a supported Cowork packaging for Knowledge Islands; the security-posture question above then applies again.
