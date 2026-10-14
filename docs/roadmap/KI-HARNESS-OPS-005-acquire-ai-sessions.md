---
id: KI-HARNESS-OPS-005
title: Acquire AI sessions
kind: deliver
purpose: capability
project: knowledge-acquisition
component: acquire
area: OPS
horizon: now
status: in-progress
blocks: []
blocked_by: []
baseline_ref: 7373e7c496caa223f5e2dce988ab41bb700f31ad
created_at: 2026-08-22T22:13:22Z
updated_at: 2026-10-14T13:45:43Z
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

On 2026-09-22, the user selected the official ChatGPT account export as the authorised bootstrap source for the first complete readable snapshot. At that point the request had reached ChatGPT's account re-authentication boundary and delivery was pending. The export remains sensitive external source material outside Git; after delivery it must be inspected for project membership, complete conversation content, write-ups, and assets before a bounded converter can produce the existing `ki-chatgpt-capture` input. This snapshot does not provide the intended incremental source contract, so the end-to-end source step remains open.

On 2026-09-26, the user confirmed that the requested ChatGPT account export has been delivered. Its local path and archive hash have not yet been recorded, so no archive content or completeness claim has been inspected. The agreed source split is to use this export once as the authoritative bootstrap candidate, use the opaque local cache only to nominate changed identities, and evaluate browser acquisition for new or changed readable conversations. Browser-derived content remains provisional until it is reconciled against the bootstrap export and later periodic exports; rendered UI alone is not evidence of complete branches, write-ups, attachments, or project coverage.

## Steps

- [x] Confirm that the official ChatGPT account export is available as the one-time bootstrap candidate.
- [x] Record the export's external source-store location and archive hash, then inspect its schema, project membership, conversation identity, write-ups, and assets read-only without committing source payloads.
- [x] Convert only verified export evidence into the canonical `ki-chatgpt-capture` form and retain explicit omissions for every unsupported field or asset class.
- [ ] Evaluate the hybrid incremental path: local-cache change nomination, browser retrieval of new or changed readable sessions through the isolated Obscura trial merged from `KI-HARNESS-GOV-087` (see Discussion), and periodic full-export reconciliation before browser coverage is trusted.
- [x] Define comparable read-only provider operations for discovery, listing, faithful reading, and checkpoints.
- [x] Implement and verify Claude, Codex, and opaque ChatGPT source adapters without source mutation.
- [x] Implement the action-first acquisition command and machine-readable adapter registry in `tools-ki`.
- [x] Validate a structured readable ChatGPT bundle that retains opaque source identity, byte count, and hash without committing opaque payload bytes.
- [x] Define stable ChatGPT project selectors and receiver mappings using immutable project identity, reserved `<Domain>: <Topic>` prefixes for non-personal domains, a provisional unprefixed Personal / Kit migration default, and retained prior names as migration aliases.
- [x] Publish `ki-acquire-chatgpt` with machine-readable adapter metadata and a clear dependency boundary with `ki-housekeeping-chatgpt`.
- [x] Select the official ChatGPT account export as the authorised bootstrap source, keep its sensitive archive outside Git, and retain incremental acquisition as a separate gap.
- [ ] Connect ChatGPT acquisition to a readable, authorised source that can enumerate projects and return complete conversations with their write-ups and assets.
- [x] Stage every conversation from each selected project into its mapped repository, retaining source identity, project evidence, timestamps, content, assets, omissions, hashes, and acquisition checkpoint.
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
- sibling `mcp-housekeeping-claude`, the combined `mcp-housekeeping-chatgpt`, and `tools-ki` repositories where their owners adopt the revised contract
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

The action-first executor and read-only provider mechanics exist. The official account export is now available as the authorised bootstrap source, but its path, hash, observed schema, project membership, write-ups, assets, and conversation completeness have not yet been inspected. The installed-application records remain opaque, while the existing executable path begins from a user-prepared `ki-chatgpt-capture` tree rather than an account export ZIP. The remaining bridge must inspect the delivered export, convert only verified source evidence, and keep browser-based incremental acquisition provisional and export-reconciled without reverse-engineering private storage or undocumented network endpoints.

Safe deletion also depends on a provider-supported, identity-specific mutation surface. If ChatGPT exposes no safe deletion operation, the system must produce a verified manual-release manifest and stop. Browser automation is not an acceptable substitute for an auditable deletion contract.

Related, non-blocking: `ki-principal` is documenting the provider-neutral knowledge acquisition lifecycle this record's acquisition feeds, and already treats this harness work as a possible later source of Harbour-staged captures without waiting on it. Neither blocks the other. [KI-HARNESS-GOV-087](KI-HARNESS-GOV-087-evaluate-obscura-browser-runtime.md) evaluates the local browser runtime the incremental path may use; the three share a cluster but keep distinct owners.

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

### Pickup checkpoint — 2026-09-27

- Verified partial harness delivery: `b9d07c25` publishes `skills/acquire/ki-acquire-chatgpt/SKILL.md` and its acquisition standard. The [current bridge boundary](../../skills/acquire/ki-acquire-chatgpt/SKILL.md#chatgpt-acquisition) advertises only local capture and read-only mutation semantics; the provider-neutral acquisition decision distinguishes readable acquisition from opaque-store housekeeping. The record’s completed groundwork should not be replayed.
- Remaining: complete readable project enumeration/acquisition, receiver staging, incremental reconciliation and the separately authorised retirement path are not proven by that bridge. Claude and Codex acquisition-specific capabilities remain absent from the inspected `skills/acquire/` source shelf. The delivered export, immutable project bindings, complete-project move and receiver-local triage were not inspected here. Earlier MCP, CLI, bundle and export assertions remain historical evidence, not fresh end-to-end verification.
- Closure route: reconcile those historical source and receiving-repository claims before continuing the preserved In-progress plan. Obtain the missing fidelity and routing evidence, keep browser evaluation under GOV-087, and retain a disabled or verified manual retirement path until its safety and authority requirements are met. Acquisition success is never deletion authority; later closure still requires review and explicit owner acceptance.

Evidence scope: inspected local `main` at `0ad0377a0e7e14b1cd7314bce414d4871b062efc` on 2026-09-27. The read-only probe of `http://127.0.0.1:3100/api/health` could not connect; live tasks, current claims and runtime configuration were not verified. The local Git worktree registry was inspected, not every retained worktree’s contents. Before further implementation, reconcile the current destination branch, linked coordination tasks and retained worktrees where applicable, including reachability, patch equivalence and uncommitted work. Missing evidence does not release ownership or lift a hold. This checkpoint is guidance, not a mechanical execution block or a grant to resume. Lifecycle, checkboxes and ownership remain unchanged; retain any later done record until the principal explicitly selects pruning.

### Export inspection checkpoint - 2026-10-04

Read-only inspection of the delivered official account export; no payload was copied into Git and no ChatGPT source state changed.

- **Location:** `sources-personal` source store, `+/chatgpt-export/`, already extracted (no archive retained). `export_manifest.json` version 1 lists 160 files by path and size; every listed file is present at its declared size. The manifest carries no content hashes, so identity is recorded here: `export_manifest.json` SHA-256 `fd69273fe3ccb040fcf515a7cb7688d1ab31091cc870c9c8f68d237db94fda10`; aggregate SHA-256 over sorted `path<TAB>size<TAB>sha256` lines of the listed files `63bbf7091b4ebeacb56cb1cd8face98ad9ebaff83ebfb5ed6276adbe3b393361`.
- **Schema and identity:** `conversations-000..003.json` hold 334 conversations with 334 unique `conversation_id` values; each carries a full `mapping` tree with `current_node`, timestamps, archive and star flags. Messages: 3,440 user and 4,224 assistant, typed `multimodal_text`, `text`, `reasoning_recap` and `thoughts`.
- **Project membership:** `conversation_template_id` carries 17 distinct `g-p-` project identifiers plus 6 conversations outside any project. The export carries no project display names, so it cannot by itself bind the immutable identifiers to the routing inventory above.
- **Assets:** 147 `.dat` asset files. Of 126 attachment identifiers referenced from messages, 70 are present; of 857 distinct content asset pointers, 45 resolve to a present file. The export is therefore incomplete for assets, and conversion must record the rest as explicit omissions rather than treat the export as asset-complete.

**Question for Kris:** the 17 `g-p-` project identifiers need binding to project names (for example from a read-only capture of the ChatGPT project list) before routing can fail closed on immutable identity. Will you supply that inventory, or authorise a one-off read-only capture of it? Until then the conversion and staging steps stay open and this record remains `in-progress`.

### Bootstrap staging checkpoint - 2026-10-14

Kris answered the export question above on 2026-10-14 in the knowledge-acquisition run: 'BIND - launch the background agent: preserve the project list, bind the 17 IDs, then convert and stage the export.' The bindings are under [Immutable project bindings](#immutable-project-bindings---2026-10-14). No ChatGPT or OpenAI source state changed, and no export payload entered this repository.

- **Source:** the export is unchanged since inspection: its aggregate SHA-256 still matches `63bbf709...3361`.
- **Conversion:** a converter in the receiver, `.acquire/chatgpt/account-export-2026-09-22/convert.py` (SHA-256 `f3d4e103202df91f7fba250a1b4163d42b2dc1160f882408a84cc8cbe6333def`), turns each conversation into a `ki-chatgpt-capture` tree. The existing `ki acquire import --adapter chatgpt` then emits one KEP per conversation. No `tools-ki` change was needed.
- **Package contents:** each KEP holds:
  - the conversation object, re-serialised, with a canonical content hash;
  - a rendered record of the current branch and any other branches;
  - the project-conversation relationship;
  - available assets;
  - front matter with source file, index and hashes;
  - explicit omissions.
- **Staging:** `krisb/acquire` commits `b5158e6` and `bc23689` stage all 334 conversations under `captures/<territory-key>/chatgpt/account-export-2026-09-22/`:

  | Territory | Conversations |
  | --- | --- |
  | `personal` | 85 |
  | `legal` | 102 |
  | `knowledge-islands` | 55 |
  | `humans-not-robots` | 66 |
  | `equal-remedy` | 5 |
  | `_review` | 21 |

  The `_review` count is The Tower Game's 15 plus the 6 unprojected conversations. There were no failed reads and no overlapping mappings. All 334 packages verify against their checksums from a clean checkout. A scoped `.gitattributes` stops line-ending normalisation.
- **Assets:** 69 referenced assets are included. 1,669 referenced asset identifiers are omitted, most of them voice-mode audio. Each omission is listed in its conversation record. One is a 174.6 MB legal PDF that exceeds the GitHub file limit, so it stays only in the source store.
- **Unreferenced exports:** 77 export files, about 106 MB, are referenced by no conversation. They are listed with hashes in the receiver checkpoint `.acquire/chatgpt/account-export-2026-09-22/checkpoint.json` and not staged.

Still open:

- confirming the provisional Tower Game and Spirituality bindings;
- deciding what happens to the 77 unreferenced export files;
- the incremental source and project enumeration;
- changed-session handling;
- receiver-local triage;
- one verified complete project move;
- the retirement gate.

The record stays `in-progress`.

### Tower Game receiver move - 2026-10-14

On 2026-10-14 Kris decided to move The Tower Game's 15 conversations to `personal`. The 15 packages carrying `g-p-69ff7f83be248191a5cae112d3ff706f` moved from `captures/_review/` to `captures/personal/chatgpt/account-export-2026-09-22/` with `git mv`. Package contents, source hashes and checksums are unchanged. The receiver checkpoint and converter bind the project to `personal`, and the checkpoint records the move. Each package's own record still carries its staging-time `territory_key: _review`, because that record is checksummed acquisition evidence.

- **Staged counts:** `personal` now holds 100 and `_review` holds the 6 unprojected conversations. The total is still 334, and every package verifies against its checksums from a clean checkout.
- **Still open:** the Spirituality binding, which stays under separate review, and the other items listed above.

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

#### Immutable project bindings - 2026-10-14

Kris authorised these bindings on 2026-10-14 in the knowledge-acquisition run ('bind the 17 IDs'). The 17 identifiers are exactly those in the export's `conversation_template_id`. Prior names come from the cloud project list captured before the 2026-10-12 renames. That listing is preserved unchanged in the `sources-personal` store as `+/chatgpt-export-project-names-2026-10-12.tsv`, SHA-256 `eaeb39a71221ed78a668bf1b5afa09c48fdc266ac4cabddf5e315c06e195b268`. Current names follow `<Territory> - <Sub-area>`, the project naming convention Kris set on 2026-10-12 in the state-of-play run, and supersede the `<Domain>: <Topic>` form above. The receiver for every territory is the private `acquire` inbox at `captures/<territory-key>/chatgpt/`; the earlier `kit-*` receivers are historical.

| Project ID | Current name | Migration aliases | Territory key | Conversations |
| --- | --- | --- | --- | --- |
| `g-p-69eb35d7e7fc81918ed37bc20f0c8be1` | Knowledge Islands - General | Knowledge Islands: General | `knowledge-islands` | 55 |
| `g-p-67fc441d39e88191bb2efc630e1504af` | Legal - General | Legal: General | `legal` | 102 |
| `g-p-6a3c8cc4b44c8191a58f3c6b7c66ae3b` | Equal Remedy - General | Equal Remedy: General; Equal Remedy | `equal-remedy` | 5 |
| `g-p-685ea6f7a5e8819180d8ea191bbbe23a` | Humans Not Robots - 5G Emerge | HNR: 5G Emerge | `humans-not-robots` | 25 |
| `g-p-67fc3ce56ebc819192ecfb9583004c90` | Humans Not Robots - Product | HNR: Product | `humans-not-robots` | 41 |
| `g-p-6a16102ecaac8191b483bd286979e6dc` | Personal - Van Build | Kit: Van Build; Van Build | `personal` | 1 |
| `g-p-6849f00c6050819183d533e75218519e` | Personal - Side Hustle Ideas | Kit: Side Hussle Ideas; Side Hustle Ideas | `personal` | 7 |
| `g-p-69465bf021a481918f0b7e3268539eb1` | Personal - Home Improvement | Kit: Home Improvement; Home Improvement | `personal` | 4 |
| `g-p-694655e2709c8191bd816026d45c1eee` | Personal - Costa Rica | Kit: Costa Rica; Costa Rica | `personal` | 10 |
| `g-p-67fc427d557881918931a1408952701a` | Personal - Spirituality | Kit: Spirituality; Spirituality | `personal` (provisional) | 18 |
| `g-p-684ef0f4c274819185742d3bb3874196` | Personal - Productivity | Kit: Productivity; Productivity | `personal` | 7 |
| `g-p-67fc4361628481919ae3eae3a04c226f` | Personal - Fitness and Wellbeing | Kit: Fitness and Wellbeing; Fitness and Wellbeing | `personal` | 11 |
| `g-p-67fc41be62b481919afc54ce000fd518` | Personal - Relationships | Kit: Relationships; Relationships | `personal` | 7 |
| `g-p-6a520a14adc88191bd2da11f31b8b70e` | Personal - Travel Ideas | Kit: Travel Ideas; Travel Ideas | `personal` | 1 |
| `g-p-6a9e4443e6988191bf124428cabfd330` | Personal - Festivals | Kit: Festivals; Festivals | `personal` | 6 |
| `g-p-67fc42f7b8d08191af805b83daeb3ef7` | Personal - Tattoos | Kit: Tattoos; Tattoos | `personal` | 13 |
| `g-p-69ff7f83be248191a5cae112d3ff706f` | Personal - The Tower Game | Kit: The Tower Game; The Tower Game | `personal` | 15 |

The 328 project conversations and the 6 outside any project total 334, matching the export. The 6 unprojected conversations route to `_review`.

Two bindings are provisional:

- **Spirituality** - it routes to `personal` by its current name, but the 2026-10-12 rename report offered `Sacred Inquiry - Spirituality` as an option.
- **Equal Remedy** - the earlier proposal to rename it `Legal: Financial Remedy` and route it to Legal was not applied. Kris renamed it `Equal Remedy: General`, and its conversation titles concern the Equal Remedy organisation, so it binds to `equal-remedy`.

The Tower Game first staged to `_review`, because its receiver was left unresolved above pending a creative or game repository. On 2026-10-14 Kris decided to move its 15 conversations to `personal`, so it is now bound there.

`Engineering` and its proposed `Knowledge Islands: Engineering` name match none of the 17 identifiers, so no export conversation carries them.

### Complete acquisition before triage

The import unit is the complete conversation, not a model-selected excerpt. Every conversation in an approved project scope should land in the mapped repository first. Local triage can then extract durable knowledge, retain the full source, route bounded consequences elsewhere, or record that nothing further is needed. This makes the deletion decision depend on faithful acquisition rather than on perfect up-front interpretation.

### Provider posture

ChatGPT deserves the first complete workflow because chat-mode conversations have the highest likelihood of uncaptured knowledge. Codex and Claude agent sessions should use the same fidelity and retirement rules, but a lighter exception-based review because their work is usually resolved into repositories during execution.

### Source retirement

The intended steady state is to remove source conversations after their complete acquired form is verified in the correct repository, not to keep duplicate provider history indefinitely. “Moved” means the receiver contains a complete checksummed version at a named Git revision, the source has not changed since manifest generation, every failure or omission is resolved or explicitly accepted, and the exact deletion manifest receives immediate human approval. Acquisition success alone is not deletion authority.

### Source fidelity

The opaque ChatGPT installed-application store is useful for identity, timestamps, byte counts, hashes, and change detection, but not for recovering readable knowledge or proving project routing. Receiving repositories retain those metadata rather than opaque payload bytes by default. Until an authorised readable source exists, the local store cannot satisfy the complete-session acquisition goal by itself. A user-prepared capture remains safe and useful, but the workflow must clearly distinguish preparing a readable source from acquiring a mapped project.

### Isolated browser trial

Merged from `KI-HARNESS-GOV-087` (Evaluate Obscura browser runtime), approved by Kris on 2026-10-07 under decision 17 of the state-of-play design, because this record's hybrid-path Step already names the trial.

The trial asks whether a self-hosted Obscura headless browser, in a disposable runtime with a deliberately provisioned authentication profile, can enumerate ChatGPT projects and conversations, read complete visible content and emit deterministic checkpoints, correlated with local-cache identities and reconciled against the official export. In order: pin and build one Obscura source revision, stopping if it needs unmanaged credentials or an unsafe installation; run a non-secret synthetic fixture to verify isolation, CDP or Playwright interaction, extraction and teardown; present an isolated session for deliberate interactive sign-in; inventory one bounded project read-only; record omissions and hashes in a local-evaluation packet; then update the agentic radar only as the evidence warrants.

It evaluates and records evidence only: no estate adoption, managed cloud dependency, cookie transfer, password or multi-factor automation, stealth or detection-evasion features, or provider mutation, and it fails closed wherever fidelity cannot be shown. It needs Kris present for the sign-in and Kris's approval to build the unvetted `h4ckf0r0day/obscura` source on this Mac, or a choice of a disposable VM or container instead. The merged record's full plan is at [its last open revision](https://github.com/knowledgeislands/ki-agentic-harness/blob/05d6acecb33dc19a6ac4aab7b077700c5ae9d2fc/docs/roadmap/KI-HARNESS-GOV-087-evaluate-obscura-browser-runtime.md).
