---
id: KI-HARNESS-OPS-005
title: Acquire AI sessions
area: OPS
theme: operations
horizon: now
status: awaiting-review
blocks: []
blocked_by: []
baseline_ref: 7373e7c496caa223f5e2dce988ab41bb700f31ad
created_at: 2026-08-22T22:13:22Z
updated_at: 2026-09-16T21:47:55Z
---

## Goal

Give Knowledge Islands a provider-neutral way to discover and faithfully stage repository-relevant AI sessions so durable knowledge can later be harvested and the source can eventually be retired safely.

## Context

Claude and Codex currently hold accumulated local working state through different mechanisms. Both providers need a comparable read-only discovery, listing, reading, and checkpoint surface. The KI command owns acquisition into a repository working area; the provider MCPs supply only source mechanics.

## Boundary

This first delivery does not archive or delete source sessions, infer durable knowledge automatically, decrypt or reverse-engineer opaque provider stores, or make MCP a knowledge store. It preserves provider-specific tools and does not require perfect repository routing.

## Current state

Arcadia owns the provider-neutral acquisition lifecycle. `mcp-housekeeping-claude` and `mcp-housekeeping-codex` expose comparable read-only session surfaces. `tools-ki` commit `5c49e8a` adds `ki space acquire chatgpt import` for a validated, user-prepared local capture, staged content-addressably at `+/_ACQUIRE/chatgpt/`.

The installed ChatGPT application has been inventoried at `~/Library/Application Support/com.openai.chat`: 185 conversation records across 33 project roots. Its project-scoped `conversations-v3-*/<session>.data` records are opaque, so the direct adapter must preserve their bytes and metadata rather than assume a private plaintext format. No source material has been changed.

The 2026-09-02 resumption revalidated the clean `mcp-housekeeping-chatgpt` checkout: its opaque local-store adapter and three focused tests pass with TypeScript. The repository is registered and declares reciprocal `ki-all` and `ki-mcps` Agora memberships. Its engineering audit still reports missing shared toolchain/Knip/coverage configuration, so final cross-provider integration verification remains open and the engineering baseline is routed to receiver-owned `MCP-HG-FND-001` in commit `6d02148`.

## Steps

- [x] Define the shared session adapter result and checkpoint contract.
- [x] Add matching read-only session discovery surfaces to the Claude and Codex MCPs.
- [x] Align the Claude and Codex housekeeping skills with the acquisition lifecycle.
- [x] Extend `tools-ki` with provider-context staging for validated local ChatGPT captures.
- [x] Inventory the installed ChatGPT application's local session-store shape without reading or changing conversation contents.
- [x] Create and register `mcp-housekeeping-chatgpt` as the third provider MCP, with the same `discover`, `list`, `read`, and `checkpoint` semantics.
- [x] Implement read-only ChatGPT local-store discovery, including stable project/session identities, paths, byte counts, modification times, content hashes, and opaque-payload status.
- [x] Implement faithful byte-for-byte ChatGPT record acquisition into the `tools-ki` Harbour path, retaining provenance and explicit media/interpretation omissions.
- [x] Add isolated fixtures for direct ChatGPT-store discovery, checkpoint incrementality, unsafe-path rejection, and opaque-record preservation.
- [x] Verify each provider surface, skill, binding, registry entry, Agora membership, and repository-context working-area import together.

## Files touched

- `docs/decisions/ADR-KI-HARNESS-SKILLS-007-provider-neutral-ai-session-acquisition-and-adapter-pairing.md`
- `skills/environment/ki-housekeeping-claude/`
- `skills/environment/ki-housekeeping-codex/`
- sibling `mcp-housekeeping-claude`, `mcp-housekeeping-codex`, `mcp-housekeeping-chatgpt`, and `tools-ki` repositories

## Verify

- The three provider MCPs expose equivalent read-only `discover`, `list`, `read`, and `checkpoint` operations.
- Direct ChatGPT discovery returns only path-derived metadata and never reads credentials, changes the application store, or presents opaque bytes as decoded conversation text.
- A ChatGPT acquisition retains original bytes, source identity, project/session paths, timestamps, hashes, and provenance before any harvesting action.
- Fixture tests cover new, unchanged, changed, missing, symlinked, and malformed local-store entries; `tools-ki` verifies KEP checksums and repeatable Harbour checkpoints.
- Each affected repository passes its test suite and focused `ki repo audit`; the existing `tools-ki` implementation passes 672 tests with 100% coverage.

## Dependencies / blocks

Provider implementation depends on the available local Claude state and Codex app-server protocol. The direct ChatGPT work requires a new provider-MCP checkout and must accept that the installed application's cache is opaque. It is not blocked on a manually requested export: raw cache records can be acquired faithfully, while any unavailable generated-image or attachment bytes remain explicit omissions. Granola and communication-source acquisition remain follow-on adapters.

## Documentation impact

### Decision Records

Arcadia's `ADR-KI-ARCADIA-001` records the provider-neutral acquisition architecture. ADR-KI-HARNESS-SKILLS-007 records this item's provider-adapter boundary.

### Specifications

No as-built KI acquisition specification exists until repository-context staging is implemented and verified.

### Guides

Add an operational guide once the direct ChatGPT acquisition command is usable, including its opaque-payload boundary and checkpoint interpretation.

### Roadmap

This item holds the cross-repository delivery sequence and future provider work.

## Review

### Delivered

The approved provider-neutral AI-session acquisition boundary is implemented across the Harness, the three provider MCP repositories, and `tools-ki`. Claude, Codex, and ChatGPT expose comparable read-only discovery, listing, faithful-read, and checkpoint operations; the ChatGPT path preserves its local records as opaque bytes. The source-retirement boundary remains explicitly outside acquisition.

The immutable implementation baseline was `7373e7c496caa223f5e2dce988ab41bb700f31ad`. The current verification pass was performed against Harness revision `06be13320d5ffe7d57a565a86d90f6ba58e37c29` and the clean provider-repository revisions recorded by their respective `HEAD`s.

### Summary of changes

- Added the shared provider-adapter acquisition contract and aligned the Claude and Codex housekeeping skills with it.
- Added the read-only `mcp-housekeeping-chatgpt` adapter and Harness skill for opaque installed-application records.
- Added repository-context ChatGPT capture staging in `tools-ki`, with provenance, checksums, and omission evidence.
- Registered all three provider repositories locally and in the Harness Agora; the ChatGPT MCP is present in the canonical MCP binding for `chatgpt-codex` and `mcporter`.

### Verification

- `mcp-housekeeping-claude`: 315 tests passed and `tsc -p tsconfig.build.json` passed.
- `mcp-housekeeping-codex`: 8 tests passed and `tsc -p tsconfig.build.json` passed.
- `mcp-housekeeping-chatgpt`: 3 tests passed and `tsc -p tsconfig.build.json` passed.
- `ki repo audit --skill ki-housekeeping-claude --repo .` passed.
- `ki repo audit --skill ki-housekeeping-codex --repo .` passed.
- `ki repo audit --skill ki-housekeeping-chatgpt --repo .` passed.
- `ki repo audit --skill ki-agora --repo .` passed.
- `MCPORTER_CONFIG=~/.config/mcporter/mcporter.json ki repo audit --skill ki-binding --repo .` passed against the canonical binding source.
- The local KI registry contains `mcp-housekeeping-claude`, `mcp-housekeeping-codex`, and `mcp-housekeeping-chatgpt` with their physical repository paths.

### Outstanding concerns

The current committed `tools-ki` surface still uses provider-first `ki acquire <provider> import` grammar. Its already-planned action-first adapter migration is owned by `KI-TOOL-CLI-072`; it does not invalidate the acquisition and source-safety boundary delivered here.

### Post-change review

The implementation satisfies the item goal without broadening MCP authority or treating opaque ChatGPT records as decoded content. Verification covers the provider source mechanics, Harness governance, registry, Agora, and portable binding evidence. The separately owned CLI grammar migration is an explicit follow-on rather than unfinished scope in this item. OPS-005 is ready for human acceptance.

### Mini recap

AI-session acquisition now has a verified three-provider, read-only source layer and a repository-context staging path. No source session was changed, archived, or deleted. The only remaining related work is the independently tracked action-first CLI migration.

## Discussion

### Direct installed-application acquisition

Provider MCPs are the source-mechanics layer. The direct ChatGPT adapter will inspect the installed application's working directory with no credentials, network requests, cache mutation, or private-format decryption. Its `read` operation may return a faithful opaque record rather than claim a decoded conversation. `tools-ki` owns the subsequent repository-context capture and Harbour staging.

### Provider vocabulary

The comparable operations are `discover`, `list`, `read`, and `checkpoint`. `import` is deliberately not an MCP operation: `ki space acquire <provider> import` is the repository-context command that turns a provider read into staged KI material.

### Safety boundary

Archive and deletion require a later verified acquisition and harvest decision. A checkpoint is evidence for incremental selection, not authority to destroy a source session.
