---
id: KI-HARNESS-GOV-174
area: GOV
title: Portable live-artifact standard
status: triage
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-10-12T20:01:01Z
updated_at: 2026-10-12T20:01:01Z
---

## Goal

The live-artifact standard (`ki-repo-kb-live-artifacts`) describes a pair that can be hosted outside Cowork: its Markdown half declares the tools the page may call and the bridge version it speaks, and its audit checks both.

## Context

On 2026-10-12 Kris adopted work in apps-observatory to open live artifacts in the Observatory as well as in Cowork, with the open MCP Apps standard's `postMessage` JSON-RPC as the bridge. The Observatory records that choice in its decision record [Live artifacts speak the MCP Apps bridge](https://github.com/knowledgeislands/apps-observatory.local/blob/main/docs/decisions/PDR-KI-OBSERVA-006-live-artifacts-speak-the-mcp-apps-bridge.md). A page keeps coding against the `window.cowork` subset; outside Cowork a bridge script provides it over MCP Apps.

The Observatory will open only a pair that declares a manifest, because the tool allow-list is its security boundary and Cowork keeps its own list in a private store. Today the standard governs only the pair's naming, frontmatter (`status`, `renders`, `author`), index, and 24-hour staleness. It has no data-access contract and no notion of a host. Two pairs, HNR Council in hnr-principal and Activity Status in legal-principal, are the Observatory's proof and will carry the manifest fields by hand first.

## Boundary

- In scope: manifest fields on the Markdown half (declared tools as server and tool, bridge version), the portable page surface (`callMcpTool` required; `askClaude` and `runScheduledTask` optional and feature-detected; no external script beyond named pinned libraries), and AUDIT and CONFORM checks for them.
- Out of scope: the Observatory host, the bridge script, the ChatGPT publication server, and Cowork itself.
- The normative contract may live in ki-specifications rather than in this skill, as the Observatory's plan recommends; if so, the skill cites it and keeps authoring and audit.

## Discussion

Field names are not settled. The existing `artifact_id` key on tracked pairs already names the Cowork artifact, so the manifest probably extends it rather than adding a new file.

Cowork tool names carry the host's own server aliases, such as `mcp__kit-mcp-ki-kb-fs__kb_list`. A portable manifest should name the configured server, not an alias, and leave alias mapping to each host.

The skill's own sources note says no real pair has yet validated its sync checks. The two proof pairs could validate both the existing checks and the new ones.
