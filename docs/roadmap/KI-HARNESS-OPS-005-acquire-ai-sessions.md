---
id: KI-HARNESS-OPS-005
title: Acquire AI sessions
area: OPS
theme: operations
horizon: now
status: in-progress
blocks: []
blocked_by: []
baseline_ref: 7373e7c496caa223f5e2dce988ab41bb700f31ad
created_at: 2026-08-22T22:13:22Z
updated_at: 2026-09-22T01:08:55Z
---

## Goal

Acquire complete conversations from configured AI projects into the repositories best served by their knowledge, preserve them faithfully for local review, and retire the source conversations only after the move is complete and independently verified.

## Context

ChatGPT is used substantially in chat mode, so its project conversations can contain useful reasoning, decisions, sources, and write-ups that never reached a Knowledge Islands repository. The desired first action is not to decide which fragments are valuable. It is to bring each selected project's complete sessions into the right repository, then decide locally what to harvest, retain, route, or discard.

Codex and Claude agent sessions are different: most work is resolved into repository files, commits, roadmap records, or recaps while the session is active. They should use the same acquisition and retirement safety model, but normally only need exception-based import when a full session contains uncaptured material.

The source MCPs and Harness skills are still named `housekeeping`, even where they expose acquisition mechanics. The action-first `tools-ki` contract now discovers explicit `ki-acquire-*` capabilities, so acquisition must be separated from housekeeping rather than inferred from those legacy names.

## Boundary

This item owns complete-session acquisition, project-to-repository routing, receiver-local staging, and the evidence required before source retirement. It does not selectively excerpt a source conversation during import, infer durable knowledge automatically, treat opaque ChatGPT application bytes as decoded conversations, silently route an unknown project, or delete any source conversation merely because an import command returned successfully.

Deletion is a separate, destructive release operation. It requires a current exact manifest, a verified recoverable repository copy, and explicit human approval immediately before source mutation. Until that gate exists and passes, acquisition remains read-only.

## Current state

The first readable acquisition pilot landed in `kit-principal` as commit `79b9279`, then commit `cd11849` replaced the flattened capture with a structured thread, linked Markdown message note, relationships, source metadata, and ledger. Commit `6fc04f1` removed the 490-byte opaque payload from the current tree while retaining its byte count and verified SHA-256 as provenance. The bundle contains four messages and no linked assets. No ChatGPT source state changed.

The pilot initially appeared to show a literal-home-path binding defect. Fresh inspection proved current `mcp-housekeeping-chatgpt` source, built output, and direct configuration loading already expand `~` to the user home. Commit `f8cb93c` locks that behaviour with regression coverage and completes the provider's shared engineering baseline. The still-running Codex MCP process continues to reproduce the old repository-relative path, so the remaining condition is a runtime restart and discovery recheck rather than another renderer or adapter change.

The source-mechanics groundwork is real but the end-to-end move is incomplete. The Claude, Codex, and ChatGPT MCP repositories expose comparable read-only discovery, listing, reading, and checkpoint operations, and their tests and builds pass. The ChatGPT local-store adapter safely inventories opaque `*.data` records and returns exact bytes, but those bytes do not provide a readable conversation surface or reliable project-name routing.

`tools-ki` commit `a49ff67` provides the action-first `ki acquire list|import|status|reconcile|reset` framework. Its adapter registry expects `ki-acquire-chatgpt`, `ki-acquire-claude`, and `ki-acquire-codex`; only `ki-acquire-granola` is currently published by the Harness. The executable ChatGPT path accepts a user-prepared local capture and produces a verified KEP, but it does not enumerate ChatGPT projects, acquire every conversation within a mapped project, stage those sessions into multiple receiving repositories, or delete verified source conversations.

The former Awaiting review packet proved the read-only MCP mechanics, bindings, registry entries, Agora membership, and prepared-capture packaging. It did not prove project routing, complete readable conversation acquisition, or safe source retirement, so this record is In progress.

The 2026-09-19 Now review confirms that the routing inventory below has settled the selector contract: immutable ChatGPT project identity is canonical, current and prior names are review and migration evidence, `<Domain>: <Topic>` is reserved for non-personal domains, and unprefixed projects provisionally route to Personal / Kit. That design step is complete. Publishing `ki-acquire-chatgpt` remains separate from claiming executable completeness: the installed local store is still opaque and cannot satisfy readable project enumeration, complete conversation fidelity, or source-retirement verification.

On 2026-09-20, the user confirmed every visible ChatGPT project had been renamed with a prefix, retiring the provisional unprefixed fallback. Exact immutable project-ID bindings still need to be captured from an authorised inventory rather than inferred from those names.

The canonical `ki-acquire-chatgpt` capability now publishes the current prepared-capture metadata and the intended incremental source, routing, fidelity, checkpoint, staging, and retirement contract. This does not claim executable completeness: the installed local store remains opaque and cannot satisfy readable project enumeration, complete conversation fidelity, or source-retirement verification.

On 2026-09-22, the user selected the official ChatGPT account export as the authorised bootstrap source for the first complete readable snapshot. The request reached ChatGPT's account re-authentication boundary and is not yet delivered. The export remains sensitive external source material outside Git; after delivery it must be inspected for project membership, complete conversation content, write-ups, and assets before a bounded converter can produce the existing `ki-chatgpt-capture` input. This snapshot does not provide the intended incremental source contract, so the end-to-end source step remains open.

## Steps

- [x] Define comparable read-only provider operations for discovery, listing, faithful reading, and checkpoints.
- [x] Implement and verify Claude, Codex, and opaque ChatGPT source adapters without source mutation.
- [x] Implement the action-first acquisition command and machine-readable adapter registry in `tools-ki`.
- [x] Validate a structured readable ChatGPT bundle that retains opaque source identity, byte count, and hash without committing opaque payload bytes.
- [x] Define stable ChatGPT project selectors and receiver mappings using immutable project identity, reserved `<Domain>: <Topic>` prefixes for non-personal domains, a provisional unprefixed Personal / Kit migration default, and retained prior names as migration aliases.
- [x] Publish `ki-acquire-chatgpt` with machine-readable adapter metadata and a clear dependency boundary with `ki-housekeeping-chatgpt`.
- [x] Select the official ChatGPT account export as the authorised bootstrap source, keep its sensitive archive outside Git, and retain incremental acquisition as a separate gap.
- [ ] Connect ChatGPT acquisition to a readable, authorised source that can enumerate projects and return complete conversations with their write-ups and assets.
- [ ] Stage every conversation from each selected project into its mapped repository, retaining source identity, project evidence, timestamps, content, assets, omissions, hashes, and acquisition checkpoint.
- [ ] Represent unmapped projects, overlapping receiver mappings, missing sessions, changed sessions, and failed reads explicitly without guessing or silently dropping content.
- [ ] Add receiver-local triage after acquisition so complete sessions can be harvested, retained as source evidence, routed onward, or marked as containing no residual knowledge.
- [ ] Separate Claude and Codex acquisition guidance from their housekeeping skills, using exception-based full-session import rather than routine bulk import.
- [ ] Decide whether the existing `mcp-housekeeping-*` repositories remain shared read-only source adapters or need acquisition-specific names or projections.
- [ ] Implement a separately invoked source-retirement manifest and provider-supported deletion path that fails closed on incomplete, changed, uncommitted, or unverifiable acquisitions.
- [ ] Verify one complete ChatGPT project move and one completed agent-session no-op before enabling any source deletion.

## Files touched

- `docs/decisions/ADR-KI-HARNESS-SKILLS-007-provider-neutral-ai-session-acquisition-and-adapter-pairing.md`
- `skills/acquire/ki-acquire-chatgpt/`
- prospective `skills/acquire/ki-acquire-claude/` and `skills/acquire/ki-acquire-codex/`
- `skills/environment/ki-housekeeping-chatgpt/`
- `skills/environment/ki-housekeeping-claude/`
- `skills/environment/ki-housekeeping-codex/`
- sibling `mcp-housekeeping-claude`, `mcp-housekeeping-codex`, `mcp-housekeeping-chatgpt`, and `tools-ki` repositories where their owners adopt the revised contract
- receiving repositories selected by the approved ChatGPT project map

## Verify

- `ki acquire list` reports declared `ki-acquire-*` capabilities from machine-readable Harness metadata and does not infer adapters from `ki-housekeeping-*` names.
- A project inventory uses stable source identity, shows the current project name, and reports every conversation in the selected project before writing.
- Each mapped project targets exactly one eligible receiver unless explicit intentional duplication is approved; unmapped or conflicting projects fail closed.
- A complete acquisition preserves every readable conversation and associated write-up or asset from the selected project, with explicit omissions rather than fabricated content.
- An unchanged repeat produces no payload change; a changed conversation produces a new verified version without losing the previously acquired form.
- Receiver-local triage occurs after full acquisition and does not need source access to decide what knowledge to harvest.
- A retirement preview names each exact source conversation, its acquired receiver path, hashes, verified Git revision, and any unresolved acquisition concern.
- Deletion is unavailable until every manifest entry has a recoverable acquired copy, the source still matches the manifest, and the human approves that exact current manifest.
- Opaque ChatGPT `*.data` bytes are never presented as decoded conversation content or committed to a receiving repository by default; source identity, byte count, and hash remain as provenance.
- Claude and Codex default to no acquisition when the repository already contains the session's outcome; any exception imports the complete selected session.
- Every affected repository passes its focused tests and KI audits, and no acquisition test or ordinary import path can mutate a provider.

## Dependencies / blocks

The action-first executor and read-only provider mechanics exist. The official account export is the authorised bootstrap source, but it has not yet been delivered or verified to preserve project membership, write-ups, assets, and every complete conversation. The installed-application records are opaque, while the existing executable path begins from a user-prepared `ki-chatgpt-capture` tree rather than an account export ZIP. The remaining bridge must inspect the delivered export, convert only verified source evidence, and keep a supported incremental source as a separate requirement without reverse-engineering private storage.

Safe deletion also depends on a provider-supported, identity-specific mutation surface. If ChatGPT exposes no safe deletion operation, the system must produce a verified manual-release manifest and stop. Browser automation is not an acceptable substitute for an auditable deletion contract.

The existing housekeeping skills must remain usable while acquisition-specific capabilities are introduced. Any MCP rename or repository split requires separately coordinated receiver work; this Harness record can define the intended capability boundary without silently renaming sibling repositories.

## Documentation impact

### Decision Records

Amend or supersede `ADR-KI-HARNESS-SKILLS-007` because it still assigns acquisition semantics to housekeeping skills. Record the action-first `ki acquire import --adapter <provider>` grammar, that complete acquisition precedes receiver-local knowledge triage, and that deletion is a separate manifest-authorised operation.

### Specifications

Specify project selectors, receiver coverage, complete-session fidelity, versioning, post-acquisition triage, retirement manifests, recoverability evidence, and deletion invalidation rules.

### Guides

Document the ChatGPT project workflow first: inspect mappings, preview complete project coverage, acquire into receivers, verify repository evidence, triage locally, generate a retirement manifest, and approve deletion separately. Document the lighter exception-based posture for Claude and Codex.

### Roadmap

Keep this item open through acquisition-skill separation, one verified complete ChatGPT project move, and a deletion path that remains disabled until its safety gate passes. Receiver-owned executor or MCP changes remain independently planned and accepted in their repositories.

## Discussion

### Acquisition and housekeeping

Acquisition moves a complete selected source into a receiving repository with enough fidelity to support later decisions without returning to the provider. Housekeeping decides what can be retained, archived, or removed after that verified move. The same read-only MCP may support both processes, but one skill name and one lifecycle must not collapse their different intent or authority.

### Project routing inventory

The visible ChatGPT projects provide the first routing inventory. For the initial migration, an unprefixed project defaults to Personal / Kit and routes to `kit-principal`; this avoids moving or renaming every existing project before acquisition and is not a permanent taxonomy decision. Use the controlled display form `<Domain>: <Topic>` for projects already identified with a non-personal domain so related projects group visibly and routing intent remains legible. Names are still review evidence rather than identity: acquisition configuration must bind the immutable source project ID, record the current name, and retain any earlier name as an alias.

- **Knowledge Islands:** rename `Knowledge Islands: General` as the general architecture project and `Engineering` to `Knowledge Islands: Engineering`. Proposed receivers are Arcadia for General and Techne for Engineering; create a distinct `Knowledge Islands: Harness` project if Harness-specific conversations become substantial rather than silently splitting one project's sessions during import.
- **Legal:** keep `Legal: General`; rename `Equal Remedy` to the legally accurate `Legal: Financial Remedy`. Both map to `kit-legal`.
- **HNR:** retain `HNR: 5G Emerge` and `HNR: Product`; both map to `kit-hnr`.
- **Provisional Personal / Kit default:** leave `Festivals`, `Tattoos`, `Travel Ideas`, `Relationships`, `Van Build`, `Fitness and Wellbeing`, `Costa Rica`, `Productivity`, `Spirituality`, `Home Improvement`, and `Side Hustle Ideas` unprefixed during the initial migration; all route to `kit-principal` for now.
- **Creative or game work:** rename `The Tower Game` to `Creative: The Tower Game`, but leave its receiver unresolved until an existing or new repository is selected.

Add or correct only the non-personal prefixes already worth distinguishing before the first acquisition checkpoint, then freeze project identity and names until the move and deletion manifest are complete. Do not consolidate or move conversations between ChatGPT projects during that window. After full acquisition, revisit whether the remaining projects should be prefixed, consolidated, or routed elsewhere from the safety of the receiving repositories.

`New project` is an interface action rather than a source project and is excluded from the inventory.

The unprefixed names above are now migration aliases rather than current routing inputs. Freeze the prefixed names and immutable identities until the first complete acquisition checkpoint and any later deletion manifest are complete; read their current prefixes from the authorised inventory rather than guessing them from prior names.

### Complete acquisition before triage

The import unit is the complete conversation, not a model-selected excerpt. Every conversation in an approved project scope should land in the mapped repository first. Local triage can then extract durable knowledge, retain the full source, route bounded consequences elsewhere, or record that nothing further is needed. This makes the deletion decision depend on faithful acquisition rather than on perfect up-front interpretation.

### Provider posture

ChatGPT deserves the first complete workflow because chat-mode conversations have the highest likelihood of uncaptured knowledge. Codex and Claude agent sessions should use the same fidelity and retirement rules, but a lighter exception-based review because their work is usually resolved into repositories during execution.

### Source retirement

The intended steady state is to remove source conversations after their complete acquired form is verified in the correct repository, not to keep duplicate provider history indefinitely. “Moved” means the receiver contains a complete checksummed version at a named Git revision, the source has not changed since manifest generation, every failure or omission is resolved or explicitly accepted, and the exact deletion manifest receives immediate human approval. Acquisition success alone is not deletion authority.

### Source fidelity

The opaque ChatGPT installed-application store is useful for identity, timestamps, byte counts, hashes, and change detection, but not for recovering readable knowledge or proving project routing. Receiving repositories retain those metadata rather than opaque payload bytes by default. Until an authorised readable source exists, the local store cannot satisfy the complete-session acquisition goal by itself. A user-prepared capture remains safe and useful, but the workflow must clearly distinguish preparing a readable source from acquiring a mapped project.
