---
id: KI-HARNESS-OPS-005
title: Acquire AI session residuals
area: OPS
theme: operations
horizon: now
status: in-progress
blocks: []
blocked_by: []
baseline_ref: 7373e7c496caa223f5e2dce988ab41bb700f31ad
created_at: 2026-08-22T22:13:22Z
updated_at: 2026-09-16T22:05:58Z
---

## Goal

Give Knowledge Islands a selective, provider-neutral way to review AI sessions for useful residual knowledge that was not captured during the original work, then faithfully acquire only the source material needed for later harvesting.

## Context

AI-session acquisition is not bulk preservation and is not synonymous with housekeeping. Most agentic Codex and Claude sessions complete work directly in repositories, so their normal outcome should be no residual acquisition. ChatGPT chat-mode conversations are more likely to contain useful reasoning, decisions, or source material that has not reached a repository and therefore deserve a stronger review path.

The provider MCPs currently expose read-only source mechanics under `mcp-housekeeping-claude`, `mcp-housekeeping-codex`, and `mcp-housekeeping-chatgpt`. The corresponding Harness skills are also still named `ki-housekeeping-*`, even where their content describes acquisition. The action-first `tools-ki` contract now discovers machine-readable `ki-acquire-*` adapter declarations instead of inferring acquisition from housekeeping prose or provider names.

## Boundary

This item owns selective session review and acquisition contracts. It does not acquire every session, infer that a completed agent session contains residual value, classify opaque ChatGPT application records as decoded conversations, harvest durable knowledge automatically, or archive or delete source sessions. Housekeeping may consume verified acquisition evidence before a later cleanup decision, but cleanup remains a separate concern and authority boundary.

## Current state

The source-mechanics groundwork is real but the end-to-end capability is incomplete. The Claude, Codex, and ChatGPT MCP repositories expose comparable read-only discovery, listing, reading, and checkpoint operations, and their tests and builds pass. The ChatGPT local-store adapter safely inventories opaque `*.data` records and can return exact bytes, but those bytes do not provide a semantic conversation review surface.

`tools-ki` commit `a49ff67` provides the action-first `ki acquire list|import|status|reconcile|reset` framework. Its adapter registry expects `ki-acquire-chatgpt`, `ki-acquire-claude`, and `ki-acquire-codex`; only `ki-acquire-granola` is currently published by the Harness. The executable ChatGPT path accepts a user-prepared local capture and produces a verified KEP, but it does not discover ChatGPT chat conversations, decide which sessions contain residual knowledge, or stage selected conversation material directly into a receiving repository.

The former Awaiting review packet proved the read-only MCP mechanics, bindings, registry entries, Agora membership, and prepared-capture packaging. It did not prove the selective residual-review workflow now required, so this record has returned to In progress.

## Steps

- [x] Define comparable read-only provider operations for discovery, listing, faithful reading, and checkpoints.
- [x] Implement and verify Claude, Codex, and opaque ChatGPT source adapters without source mutation.
- [x] Implement the action-first acquisition command and machine-readable adapter registry in `tools-ki`.
- [ ] Define the selective residual-review contract, including explicit `no residual value`, `acquire selected source`, `already captured`, and `needs human review` outcomes.
- [ ] Publish `ki-acquire-chatgpt` with machine-readable adapter metadata and a clear relationship to `ki-housekeeping-chatgpt`.
- [ ] Separate Claude and Codex acquisition guidance from their housekeeping skills, using exception-based residual review rather than routine bulk import.
- [ ] Decide whether the existing `mcp-housekeeping-*` repositories remain shared read-only source adapters or need acquisition-specific names or projections.
- [ ] Connect ChatGPT chat-mode review to a readable, authorised source path; treat the opaque installed-application store as provenance evidence only unless its format becomes officially supported.
- [ ] Add end-to-end fixtures proving selective acquisition, no-op disposition, already-captured detection, explicit uncertainty, repository routing, repeatable checkpoints, and untouched provider state.
- [ ] Verify one representative ChatGPT residual acquisition and one completed agent-session no-op without archiving or deleting either source session.

## Files touched

- `docs/decisions/ADR-KI-HARNESS-SKILLS-007-provider-neutral-ai-session-acquisition-and-adapter-pairing.md`
- `skills/acquire/ki-acquire-chatgpt/`
- prospective `skills/acquire/ki-acquire-claude/` and `skills/acquire/ki-acquire-codex/`
- `skills/environment/ki-housekeeping-chatgpt/`
- `skills/environment/ki-housekeeping-claude/`
- `skills/environment/ki-housekeeping-codex/`
- sibling `mcp-housekeeping-claude`, `mcp-housekeeping-codex`, `mcp-housekeeping-chatgpt`, and `tools-ki` repositories where their owners adopt the revised contract

## Verify

- `ki acquire list` reports declared `ki-acquire-*` capabilities from machine-readable Harness metadata and does not infer adapters from `ki-housekeeping-*` names.
- A review can enumerate candidate sessions without acquiring all of them or reading unrelated repository material.
- A `no residual value` or `already captured` outcome writes no acquired payload and remains distinguishable from an unreadable or uncertain session.
- A selected ChatGPT chat acquisition preserves readable source material, source identity, timestamps, assets, omissions, hashes, and receiving-repository provenance before harvesting.
- Claude and Codex default to no acquisition when repository work already contains the material; any exception names the specific residual knowledge and source evidence selected.
- Opaque ChatGPT `*.data` bytes are never presented as decoded conversation content.
- Acquisition never grants archive or deletion authority, and every affected repository passes its focused tests and KI audits.

## Dependencies / blocks

The action-first executor and read-only provider mechanics exist. The principal unresolved dependency is a readable, authorised ChatGPT chat source: the current installed-application records are opaque, while the existing executable path begins from a user-prepared capture. The design must choose an official export, user-prepared capture, supported API, or another authorised readable surface without reverse-engineering private storage.

The existing housekeeping skills must remain usable while acquisition-specific capabilities are introduced. Any MCP rename or repository split requires separately coordinated receiver work; this Harness record can define the intended capability boundary without silently renaming sibling repositories.

## Documentation impact

### Decision Records

Amend or supersede `ADR-KI-HARNESS-SKILLS-007` because it still assigns acquisition semantics to housekeeping skills and names the retired `ki space acquire <provider> import` grammar.

### Specifications

Specify the residual-review dispositions and the boundary between candidate discovery, selected acquisition, later harvesting, and separately authorised source cleanup.

### Guides

Document the ChatGPT-first review workflow and the lighter exception-based posture for Claude and Codex once a readable source path and repository staging flow are verified.

### Roadmap

Keep this item open through acquisition-skill separation and one verified selective workflow. Receiver-owned executor or MCP changes remain independently planned and accepted in their repositories.

## Discussion

### Acquisition and housekeeping

Acquisition asks whether a source contains useful material not yet held by the receiving Knowledge Island and, if so, stages selected evidence faithfully. Housekeeping asks what can be retained, archived, or removed after that evidence and its durable consequences have been reviewed. The same read-only MCP may support both processes, but one skill name and one lifecycle must not collapse their different intent or authority.

### Selectivity

The unit of work is not every session. It is a reviewable candidate session plus an explicit disposition. A completed coding session that already committed its decisions, implementation, tests, and follow-up work should normally produce `already captured` or `no residual value`. Acquisition is warranted only when identifiable reasoning, decisions, sources, unresolved work, or reusable knowledge would otherwise disappear from the repository record.

### Provider posture

ChatGPT chat-mode deserves the first complete workflow because it is used for exploratory conversation and therefore has the highest likelihood of uncaptured residual knowledge. Codex and Claude agent sessions should use the same contract but a lighter exception-based review because their work is usually resolved into repository files, commits, roadmap records, or recaps during execution.

### Source fidelity

The opaque ChatGPT installed-application store is useful for identity, timestamps, byte counts, and change detection, but not for deciding semantic value. Until an authorised readable source exists, it cannot satisfy the residual-review goal by itself. A user-prepared capture remains safe and useful, but the workflow must clearly distinguish preparing a readable source from selecting and acquiring residual knowledge.
