---
id: KI-HARNESS-RTP-015
area: RTP
title: Verify run MCP connection
theme: runtime-portability
horizon: triage
status: draft
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-09-30T08:20:00Z
updated_at: 2026-09-30T08:20:00Z
---

# Verify run MCP connection

## Goal

A local Paperclip run reaches the host's mcporter bridge through a granted Paperclip remote MCP connection, so `COORD-14` conformance rests on live evidence rather than inspected code.

## Context

[KI-HARNESS-RTP-014](https://github.com/knowledgeislands/ki-agentic-harness/blob/ff6d023be0985ff4d431945fbdf241ef7318b6a3/docs/roadmap/KI-HARNESS-RTP-014-route-mcp-through-mcporter.md) documented the route from Paperclip `2026.916.1` source: runs replace user configuration, and Paperclip admits a loopback MCP endpoint on a private deployment. No connection to `http://127.0.0.1:3333/mcp` exists or was exercised, and the bridge refused connections from an interactive session on 30 September 2026.

## Boundary

Creating and granting the connection is a principal-authorised Paperclip configuration change. This record verifies it and corrects the harness guidance if evidence contradicts it. It does not provision a remote host.

## Discussion

### Open questions

- Which agents need the grant: every repository role, or only those whose tasks use KI MCP servers?
- Does the bridge need a keep-alive supervisor so that runs do not fail when it stops?
