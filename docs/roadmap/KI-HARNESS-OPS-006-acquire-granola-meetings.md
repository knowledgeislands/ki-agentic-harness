---
id: KI-HARNESS-OPS-006
title: Acquire Granola meetings
area: OPS
theme: operations
horizon: now
status: in-progress
blocks: []
blocked_by: []
baseline_ref: 98e637e8c63581f3c0535fcf73974f45415eaa47
created_at: 2026-08-24T15:11:06Z
updated_at: 2026-09-16T00:00:00Z
---

## Goal

Give Knowledge Islands a governed, repeatable way to acquire every historical and future Granola meeting faithfully into one or more eligible receiving repositories, using `kit-principal` as the initial catch-all receiver while preserving later direct ingress to a better canonical island.

## Context

[ADR-KI-ARCADIA-001](https://github.com/knowledgeislands/ki-arcadia-principal/blob/main/Admin/Governance/Decisions/ADR-KI-ARCADIA-001-provider-neutral-knowledge-acquisition.md) defines provider-neutral discovery, acquisition, staging, harvesting, durable knowledge, and separate source retirement. [ADR-KI-HARNESS-SKILLS-007](../decisions/ADR-KI-HARNESS-SKILLS-007-provider-neutral-ai-session-acquisition-and-adapter-pairing.md) places reusable provider skills and read-only adapter contracts in Harness, while [KI-HARNESS-OPS-005](KI-HARNESS-OPS-005-acquire-ai-sessions.md) applies that boundary to AI-session providers. Granola is the first communication-source provider and therefore needs its own work record rather than widening the AI-session item.

The public command is `ki acquire <provider> import`; the additional `space` segment in earlier language was a transcription artefact, not a second architectural layer. `tools-ki` now implements repository-context `ki acquire granola import` and stages into the selected repository's Harbour.

Legacy Granola activities in `kit-legal` and `kit-principal` prove useful source operations and routing evidence: folder listing, folder-scoped and unfiltered meeting listing, stable meeting IDs, generated summaries, participants, and unfoldered-meeting detection. They also expose limitations this work must replace: recent or today-only windows, one-folder ownership, one-meeting-at-a-time classification, note creation before faithful staging, and source tag mutation. The activities disagree on raw-transcript availability, so transcript entitlement remains unproven.

## Boundary

This item owns the reusable Granola acquisition skill and provider contract, receiver-selection semantics, reconciliation state model, cross-repository delivery plan, and bounded trade preparations. It does not create a Granola adapter repository, implement receiver-owned changes directly, contact Granola during planning, harvest durable knowledge, mutate Granola folders, tags, notes, or meetings, automate a browser, archive a meeting, or delete source material.

Any locally registered repository that declares and resolves the Granola skill may be a receiver. `kit-principal` is the initial catch-all because it is the primary personal knowledge base, not because the lifecycle requires one permanent receiving island. Folder mappings may later direct acquisition straight into the expected home. Material acquired into the wrong repository, or knowledge with wider applicability, is routed later through governed harvesting and `ki-trades`; direct cross-repository filesystem moves remain outside the design.

## Current state

The reusable `ki-housekeeping-granola` skill, provider contract, receiver selectors, official read-only MCP binding, and repository-context `ki acquire granola import` operation now exist. `tools-ki` commit `9161ab8` replaces the initial content-addressed directory presentation with one readable Markdown file per meeting plus one provider-level incremental ledger. Completed legacy acquisitions can migrate in place after their existing evidence verifies; unstarted receivers acquire directly into the readable form.

`DOTFILES-UE-015` registered and authenticated Granola's official `https://mcp.granola.ai/mcp` endpoint through the chezmoi-managed mcporter binding. A live schema check on 2026-08-27 reports healthy HTTP transport and six read-only tools: account information, folder listing, meeting listing, meeting details, transcript retrieval, and natural-language notes query. The official endpoint is therefore the selected source adapter; do not create a local MCP wrapper without an evidenced normalization or checkpoint requirement.

The accepted capability evidence proves custom historical date windows, folder-scoped listing, UUID lookup, generated summaries, participants, and non-empty raw transcripts. It also proves material gaps: no native pagination or completeness indicator, no folder identity on meeting results, no direct unfoldered classification, no creation or update timestamp, no source URL, no tags, no attachment or media surface, no content-version signal, and no deletion tombstone. Meeting details can be fetched in batches of ten; transcripts are fetched one meeting at a time.

## Steps

- [x] Author `ki-housekeeping-granola` with the provider-neutral lifecycle, read-only source boundary, fidelity requirements, explicit omissions, receiver-selection semantics, completeness reconciliation, checkpoint semantics, and separate retirement gate.
- [x] Define the Granola provider contract as `discover`, `list`, `read`, and `checkpoint`, including complete date-window enumeration across global, folder, and inferred-unfoldered populations, stable identity, canonical content hashes, returned source projections, folder evidence, participants, notes, transcript, and omissions.
- [x] Prove available Granola API or MCP capabilities through authoritative documentation and a separately approved read-only test, recording unsupported or account-tier-restricted fields without inventing fallbacks.
- [x] Reconcile the public CLI as one `ki acquire granola import` operation that resolves the current or explicitly selected repository and stages verified meeting documents in its Harbour.
- [x] Implement a provider-neutral Granola renderer in `tools-ki` with one Markdown document per meeting, source-projection hashes, document checksum, version history, and provider-level ledger.
- [x] Define receiver-local selectors by stable Granola folder identity plus first-class unfoldered and residual policies; report inclusion, exclusion, overlap, and unmatched outcomes.
- [x] Configure direct ingress by best-served repository while retaining `kit-principal` for Personal, unfoldered, and residual meetings.
- [ ] Reconcile the union of all configured receiver scopes against complete Granola discovery, failing closed on unexplained coverage gaps or conflicting duplicate identities and warning when unfoldered meetings require human consideration.
- [x] Stage one Markdown document per meeting under each receiver's `+/_ACQUIRE/granola/`, advancing the local ledger only after document checksum and identity verification.
- [x] Preserve generated notes, raw transcripts, participants, folder evidence, hashes, explicit omissions in readable lint-clean Markdown: meeting title H1, optional Attendees H2, source sections H2 with nested H3+, final Transcript H2.
- [x] Model source amendments explicitly: changed source hashes update the meeting document, append ledger version history, and retain the previous acquired form in Git; scope exit never implies source or local deletion.
- [x] Make interrupted imports resumable: publish each document atomically, never advance the ledger before verification, and recover an orphan document's acquisition timestamp on retry.
- [ ] Add fixtures for saturated and split date windows, new, unchanged and changed meetings, multiple-folder membership, folder reassignment, unmatched folders, duplicate identities, inferred-unfoldered meetings, unsafe paths, unavailable transcript or media, interrupted writes, corrupted existing stages, and repeatable checkpoints.
- [ ] Create receiver-owned roadmap items directly in `tools-ki`, `kit-legal`, and `kit-principal`, and update Arcadia's existing acquisition record; do not retain or submit trades for this rollout.
- [x] Define the future release-manifest contract and prove the retirement gates without adding a source-mutation tool to the acquisition provider.
- [x] Replace the published skill's initial `kit-principal` catch-all wording with a receiver-neutral contract: folder selectors choose the best-served repository, while unfoldered, unmatched, and conflicting meetings remain explicit reconciliation outcomes.
- [ ] Deliver the first direct-ingress mappings through receiver-owned work: Granola `Legal` folder to `kit-legal` and Granola `Personal` folder to `kit-principal`, using stable folder IDs as selectors and folder names as review evidence.

## Files touched

Harness-owned expected files:

- `skills/environment/ki-housekeeping-granola/`
- `.ki.toml` only when the new skill is approved and trade routes are ready to declare
- this roadmap record and approved outbound records under `-/_TRADES/`
- ADR-KI-HARNESS-SKILLS-007 only if implementation proves that its adapter-pairing decision genuinely extends beyond AI sessions

Receiver-owned expected surfaces, changed only through accepted local work:

- the official remote Granola MCP remains external; a local adapter repository is not expected unless an evidenced normalization or checkpoint gap requires one
- `tools-ki` acquisition commands, KEP core, specifications, manual, changelog, and CLI fixtures
- Arcadia's ADR-KI-ARCADIA-001 command language, `KI-ARCADIA-MOD-006` lifecycle record, and future portable acquisition specification
- `kit-principal` Harbour configuration, initial catch-all scope, acquisition and coverage ledgers, Granola triage activity, and reciprocal `ki-trades` declarations
- later receiving repositories' Granola skill declarations, folder selectors, local ledgers, and triage records
- `kit-legal` Harbour configuration, stable `Legal` folder selector, local acquisition ledger, Granola triage activity, and reciprocal `ki-trades` declarations

## Verify

Harness planning contract gates:

```bash
ki repo audit --skill ki-work-roadmap --repo .
ki repo audit --skill ki-delegation --repo .
ki repo audit --skill ki-trades --repo .
ki repo audit --skill ki-housekeeping-granola --repo .
ki repo audit --skill ki-skills --repo .
bun run test
bunx tsc --noEmit
```

Receiver delivery must additionally prove:

- `ki acquire granola import` stages into the current or explicitly selected eligible repository without requiring a `space` segment;
- caller-managed custom date windows enumerate global history and every live folder, split every saturated 100-result window, and fail closed when a minimum-granularity window remains saturated;
- repository selectors include configured folders only, treat unfoldered as an explicit selector, and report unmatched, overlapping, and excluded meetings;
- the union of configured receiver scopes reconciles with the complete discovery snapshot, with `kit-principal` initially covering the residual set;
- an unchanged repeat produces no document or ledger delta, while a changed meeting updates exactly one Markdown document and appends one ledger version linked to the same source identity;
- folder reassignment may change the receiving repository for a later observation without deleting the prior receiver's document or Git history;
- duplicate IDs with conflicting provider payloads fail closed rather than overwriting evidence;
- every staged meeting document passes checksum and source-identity verification before ledger advancement;
- missing transcript, attachment, audio, recording, tag, folder, URL, or timestamp data appears as an explicit omission rather than fabricated content;
- an interrupted run resumes verified documents without losing or duplicating meetings;
- no acquisition test or runtime path invokes Granola mutation, browser automation, direct cross-repository writes, archive, or deletion.

## Dependencies / blocks

Harness-local skill-contract work can begin from the accepted `DOTFILES-UE-015` capability evidence. The official MCP supplies stable UUID lookup but not complete pagination or changed-content signals; the Harness contract must make caller-managed date-window saturation checks and explicit content revalidation part of acquisition rather than claiming native support.

`tools-ki` already has a declared route from Harness, but receiver priority and implementation remain with `tools-ki`. Arcadia currently accepts knowledge from Harness and owns `KI-ARCADIA-MOD-006`; its command language needs an approved correction. `kit-principal` does not yet declare `ki-trades`, so its route requires separate receiver consent and reciprocal configuration before a work trade can be received. Later receiving repositories require their own skill activation and work authority. The official remote MCP is the selected adapter; any local normalization wrapper requires separate evidence, work, and approval.

The exact conflict policy for a meeting belonging to multiple mapped folders is not yet locked. Implementation must establish deterministic ownership or explicit duplication semantics before direct multi-repository ingress can ship.

## Delegation

### Locked decisions

- `ki acquire <provider> import` is the public acquisition grammar; the earlier `space` segment is not a second public architecture.
- Any eligible repository may acquire Granola meetings according to its declared selector; `kit-principal` is the initial catch-all and residual receiver, not the permanent exclusive destination.
- Acquisition covers complete historical and future meetings across folder and unfoldered results; recent windows and one-folder importers are insufficient.
- Unfoldered meetings are a first-class selection category and remain visible to human review even when a configured receiver includes them.
- A meeting whose mapped folders imply different receivers fails closed for human selection; duplication requires an explicit intentional policy.
- Acquisition is incremental, idempotent, content-addressed, changed-meeting-aware, and faithful before interpretation.
- Initial and pre-retirement runs exhaustively re-read and hash content. Routine runs combine identity discovery with bounded recent revalidation and a scheduled exhaustive sweep whose cadence may be revised from operating evidence.
- Folder, tag, and participant data is routing evidence, not canonical classification.
- Correct direct ingress should avoid unnecessary large trades; later routing uses governed harvesting and `ki-trades`, never direct cross-repository filesystem moves.
- The acquisition provider and MCP surface are read-only with respect to Granola.
- Import success never authorises source archive, deletion, tagging, folder movement, note editing, or any other mutation.
- Missing source material is preserved as an explicit omission.

### Escalate

- Escalate before creating a local Granola normalization wrapper, changing a sibling repository, submitting a trade, or activating a new trade route.
- Escalate if caller-managed window splitting cannot prove complete identity enumeration or exhaustive content revalidation cannot detect changed meeting projections.
- Escalate before credentials, live Granola access, network mutation, browser automation, source archive, deletion, or any write outside authorised Harness paths.
- Escalate if replacing `ki space acquire` or changing current `ki acquire` semantics would break a supported workflow without an approved migration, or if Arcadia and `tools-ki` cannot converge on the single public grammar.
- Escalate when selector scopes overlap, leave an unexplained coverage gap, or cannot deterministically handle multiple-folder membership.
- Escalate if Granola returns conflicting duplicate identities, required source material has no omission channel, or a proposed document change is incompatible with the governed one-file-per-meeting contract.
- Escalate any retirement proposal before its deletion manifest is regenerated and approved immediately before any future source mutation.

### Worker: granola-provider-contract

- **Deliverable:** A reviewable `ki-housekeeping-granola` skill and provider-capability contract, plus draft receiver-specific trade payloads that preserve this record's ownership boundaries.
- **Inputs:** ADR-KI-ARCADIA-001, ADR-KI-HARNESS-SKILLS-007, KI-HARNESS-OPS-005, this record, the existing provider skills, current `tools-ki` acquisition and document-rendering implementation, and named legacy Granola activities.
- **Scope:** Harness skill files and explicitly approved Harness outbound trade preparations only; no sibling-repository writes, provider-repository creation, live Granola calls, or source mutation.
- **Authority:** Read named local evidence and author the bounded Harness contract. Do not infer unavailable provider fields, submit trades, contact external systems, or grant receiver implementation authority.
- **Isolation:** Use an isolated worktree with an exclusive Harness file boundary. Any Git staging uses a worker-specific temporary index; the coordinator serialises commits.
- **Verify:** The coordinator reviews `ki-skills`, `ki-trades`, `ki-delegation`, `ki-work-roadmap`, TypeScript, and changed-file tests.
- **Return:** A concise patch summary, capability matrix, omissions, verification evidence, proposed trades, and unresolved decisions; no trade submission, route activation, repository creation, or sibling write.
- **Checkpoint:** Return when the Harness contract and receiver payload drafts are reviewable; stop before live provider access or receiver implementation.

### Worker: granola-routing-reconciliation

- **Deliverable:** A deterministic receiver-selection and reconciliation contract covering folder mappings, unfoldered meetings, residual ownership, overlap, scope changes, and provider-wide completeness.
- **Inputs:** This record's locked decisions, registered-repository model, local skill declarations, Granola folder evidence, meeting-document identity rules, and `ki-trades` receipt semantics.
- **Scope:** Design and fixtures within approved Harness files only; no receiver configuration writes, source access, trade submission, or cross-repository moves.
- **Authority:** Specify selectors, reports, invariants, and failure cases. Do not assign a real folder to a repository or resolve an overlap without owner approval.
- **Isolation:** Use an isolated worktree and an exclusive Harness fixture boundary; use a worker-specific Git index for any staging.
- **Verify:** The coordinator proves complete folder and unfoldered coverage, deterministic residual handling, visible overlaps, stable identity across receivers, and immutable handling of scope changes.
- **Return:** The state model, fixture matrix, unresolved ownership choices, and proposed receiver configuration schema.
- **Checkpoint:** Return when every discovered meeting is demonstrably selected once, explicitly duplicated, or reported for human resolution.

### Worker: granola-retirement-gate

- **Deliverable:** A provider-neutral future release-manifest contract demonstrating the retirement gates and manual-release fallback when no safe API exists.
- **Inputs:** This record's locked decisions, Arcadia's lifecycle, verified meeting documents and checkpoints, provider-wide coverage evidence, receiver dispositions, `ki-trades` receipts, and documented Granola archive/delete capabilities from later approved read-only research.
- **Scope:** Design and fixtures only within approved Harness files; no deletion implementation, live manifest generation, browser automation, or source access.
- **Authority:** Specify evidence and fail-closed checks. Do not weaken a gate, infer a receipt, select meetings for deletion, or authorise source mutation.
- **Isolation:** Use a read-only evidence lane with no write-capable external tools; any proposed Harness text returns as a patch for coordinator review.
- **Verify:** The coordinator checks that every gate is independently evidenced, every manifest entry names an exact source identity and hash, any post-manifest amendment invalidates approval, and absence of a safe API yields a manual-release manifest only.
- **Return:** A gate-by-gate contract, unresolved provider dependencies, fixture scenarios, and an explicit statement that no source mutation was performed or authorised.
- **Checkpoint:** Return once the contract rejects every missing-gate or stale-manifest fixture; stop before implementing or invoking archive or deletion.

## Documentation impact

### Decision Records

ADR-KI-ARCADIA-001 remains the lifecycle authority but needs a receiver-neutral correction from `ki space acquire` to the single public `ki acquire` grammar. ADR-KI-HARNESS-SKILLS-007 remains the AI-session pairing authority unless implementation establishes a genuinely shared non-AI adapter decision; do not broaden it merely to mention Granola.

### Specifications

`tools-ki` now supplies the as-built public CLI, one-file-per-meeting Markdown rendering, and provider-level incremental ledger. Arcadia may promote the portable acquisition specification after Granola proves the second source class.

### Guides

Add an operator guide only after end-to-end acquisition is verified. It must explain folder and unfoldered selection, residual handling, complete-history reconciliation, amendments, explicit omissions, immutable versions, human warnings, harvesting, trade receipts, indefinite source retention, and the separate retirement gate.

### Roadmap

Keep this work distinct from KI-HARNESS-OPS-005 because a communication source introduces multi-repository receiver selection, source-folder reconciliation, and ongoing mutable-record concerns. Receiver repositories retain their own prioritisation, planning, implementation, review, and acceptance records through approved trades.

## Discussion

### Direct-ingress decision

The latest receiver decision supersedes every earlier reference in this record to `kit-principal` as an initial or residual catch-all. Granola folder evidence should route meetings directly to the repository best served by the material. The first governed mappings are `Legal` to `kit-legal` and `Personal` to `kit-principal`; stable folder IDs are the selectors, while names remain human-readable review evidence.

Unfoldered, unmatched, excluded, and multi-folder-conflict identities stay visible in the provider-wide reconciliation report. They are not silently assigned to either repository. A later operating decision may add an explicit receiver or prompt policy after experience with the first mappings; conflicting receiver mappings continue to fail closed for human selection, and duplication remains explicit only.

The committed Harness unit `0726b5cc` therefore needs one follow-up correction to remove its initial catch-all wording before receiver delivery. Receiver work must include separate governed deliveries for `kit-legal` and `kit-principal`, alongside the existing `tools-ki` and Arcadia responsibilities.

### Proposed state flow

```text
Granola discovery snapshot
  -> reconcile every folder plus unfoldered meetings
  -> resolve repository selectors and residual ownership
  -> read faithful source state
  -> render one checksummed Markdown file per meeting
  -> verify document and advance receiver ledger
  -> human or agentic triage
  -> retain, harvest locally, or route through ki-trades
  -> continue incremental reconciliation
  -> optionally become a separately approved retirement candidate
```

Acquisition establishes a faithful local observation; it is not harvesting and does not imply source retirement. Harvesting promotes durable knowledge and records a disposition. A meeting may remain in Granola indefinitely while recurring acquisition observes changes. Retirement is an optional later release operation, not the successful end state of every import.

### CLI reconciliation

The public operation is `ki acquire granola import`. It resolves the current repository by default, supports the existing explicit repository-selection convention, validates the Granola receiver scope, and stages one verified Markdown document per meeting in the repository's Harbour. Source hashing, ledgering, and document rendering are internal reusable capabilities, not reasons for a second `space` command.

The earlier `ki space acquire` wording remains migration context, not a second Granola command. Granola uses the implemented `ki acquire granola import` grammar; any broader ChatGPT compatibility cleanup remains governed separately.

### Receiver selection and coverage

Each eligible repository declares the Granola folder identities it accepts and an explicit unfoldered policy. Unfoldered is not inferred from an empty folder name. Acquisition reports how many meetings were selected, excluded, unmatched, or selected by more than one receiver. Interactive runs may prompt for human consideration; unattended runs must emit durable warnings and follow only the configured policy rather than guessing.

The initial rollout gives `kit-principal` complete catch-all coverage. As mappings mature, a provider-wide coverage plan may assign named folders directly to the repositories expected to retain their knowledge. `kit-principal` can then retain Personal, unfoldered, and residual unmatched scopes. Correct direct ingress avoids large transfer trades while preserving a catch-all that prevents knowledge loss.

Complete acquisition is a property of the union of receiver scopes, not of any single repository. A provider-wide reconciliation snapshot must prove that every discovered stable identity is represented by an accepted receiver scope or is explicitly awaiting human resolution. Overlap is visible and never silently deduplicated across repositories. The multiple-folder precedence or intentional-duplication policy remains an implementation decision requiring owner approval.

### Complete incremental acquisition

The official MCP has no cursor, page, limit, total, or completeness field and has returned a saturated 100-meeting default result. Complete discovery must therefore partition the requested history into caller-managed custom ISO-date windows for the global population and every folder. Any window returning exactly 100 meetings is saturated and must be split until every leaf window is below the observed cap. A saturated minimum-granularity window fails closed because completeness cannot be proved.

The acquisition union deduplicates UUIDs across date windows and folder queries. Because meeting results do not carry folder identity, each folder association is evidence from the query context. Unfoldered meetings are inferred only after complete reconciliation as global UUIDs absent from the union of every complete folder-scoped result. Compatible folder memberships merge as routing evidence; conflicting source representations fail closed for review.

Identity discovery and content revalidation use separate checkpoints. The listing surface can find new UUIDs but exposes no update or version indicator, so it cannot prove an existing meeting unchanged. Amendment detection re-reads meeting details and transcripts and compares canonical hashes with the latest verified ledger entry. Any pre-retirement repeat requires a complete content sweep. A missing identity or scope exit is a reported delta, never source-deletion evidence. Interrupted runs leave verified Markdown documents recoverable and never claim ledger completion for an unverified write.

### Amendments and reconciliation

The acquisition key is provider account plus stable Granola meeting identity. A change to notes, summary, folders, tags, participants, transcript, attachments, audio, or recording state updates that meeting's Markdown document and appends the new source hash to ledger history; Git retains the previous acquired form. The source identity remains stable across versions.

A folder change can move a later version into a different receiver scope. The earlier repository retains its verified evidence and records scope exit or supersession, while the new receiver acquires the current version directly from Granola. The absence of a meeting from one local scope is not evidence that Granola deleted it. If prior harvested knowledge is affected, the changed version is flagged for triage and any cross-island correction uses a bounded trade with receipt evidence.

If source deletion is never enabled, this versioned reconciliation loop is the steady state: Granola remains mutable working state, Knowledge Islands retains immutable observations and durable harvested knowledge, and each repeat reports new, changed, missing, unmatched, or conflicting state. KI never writes its classification or reconciliation decisions back to Granola through this provider.

### Acquisition fidelity

The official adapter can preserve the Granola UUID, title, human-readable meeting date, participant and involvement evidence, generated summary, folder associations derived from query context, and raw transcript with generic speaker labels. The acquired original is the faithful MCP projection, not an undocumented claim to Granola's internal source record.

Verified omissions currently include Granola URL, creation and update timestamps, direct folder membership, tags, transcript timestamps, attachments, audio, recording references and bytes, source version, and deletion tombstone. It records separate hashes for every returned projection. Account-tier or later schema limitations remain explicit omissions; summaries do not masquerade as transcripts, query-derived folder evidence does not masquerade as native membership, and unavailable references do not masquerade as media bytes.

### Repository responsibilities and trades

- **Harness:** Owns `ki-housekeeping-granola`, the reusable four-operation contract, receiver-selection and reconciliation semantics, fidelity requirements, retirement-safety standards, fixtures, and outbound trade preparations.
- **Granola adapter:** Granola's official remote MCP owns authentication, source schemas, read-only meeting projections, and its no-mutation tool surface. It does not provide KI checkpoints, completeness proof, or change detection.
- **tools-ki:** Owns the single public CLI, repository resolution, one-file-per-meeting Markdown renderer, source hashing, Granola profile, caller-managed date-window enumeration, rate-limit handling, content revalidation, atomic Harbour staging, provider-level checkpoint and ledger mechanics, coverage reporting, and verification. Delivery remains receiver-controlled.
- **Arcadia:** Remains the authority for the provider-neutral lifecycle, corrects the public command language, and decides when Granola evidence is sufficient to shape a portable acquisition specification. Delivery is a knowledge trade linked to `KI-ARCADIA-MOD-006`, not a Harness edit to Arcadia.
- **kit-principal:** Owns its `+/_ACQUIRE/granola/`, initial catch-all and later Personal/unfoldered/residual selectors, local acquisition ledger, coverage coordination, and later triage and harvesting process. Delivery requires route activation and an approved work trade.
- **Other receiving repositories:** Own their skill activation, folder selectors, Harbour meeting documents, local ledger, and triage. They receive work only through their own approved roadmap authority.

Trades are not required when a meeting is acquired directly into the intended receiver. They remain appropriate when an acquisition was routed incorrectly, a changed meeting affects knowledge already promoted elsewhere, or harvested knowledge has wider applicability. Those trades should carry the bounded material and disposition evidence needed by the receiver rather than treating the original meeting corpus as one large transfer.

### Verified Granola capability envelope

- The official remote MCP is authenticated and healthy through mcporter and exposes six read-only tools with no mutation-capable operation.
- `list_meetings` accepts global or folder-scoped custom ISO-date windows but exposes no pagination or completeness input or output; an observed default result saturated at 100 meetings.
- `list_meeting_folders` returns folder IDs, titles, descriptions, and nested-inclusive note counts; meeting results do not carry their folder identity or hierarchy.
- Meeting UUID lookup, generated summaries, participants, and transcripts work. Detail requests accept at most ten UUIDs; transcript requests accept one UUID.
- Sampled projections expose no Granola URL, creation or update timestamp, tags, attachments, media, source version, or deletion tombstone. Transcript output has generic speakers and no timestamps.
- The natural-language query tool is useful for exploration but is not a faithful acquisition primitive and supplied no source citation in the representative check.

### Implementation policy

- When mapped folders imply different receivers, acquisition fails closed for human selection. It acquires into multiple repositories only when an explicit intentional-duplication policy names that outcome.
- Initial acquisition and its verification repeat exhaustively read and hash every available meeting projection. Routine acquisition performs complete identity discovery, bounded recent content revalidation, and a scheduled exhaustive sweep. The first cadence is operational policy rather than a permanent architectural decision and should be revised from measured runtime, rate-limit, and amendment evidence.
- Any custom date window returning exactly 100 meetings is saturated and splits recursively. A saturated single-day window fails closed because the official schema cannot narrow below ISO-date granularity or prove completeness.

### Remaining provider question

Granola's supported recoverable export, archive, deletion API, and deletion-manifest capabilities remain unverified. No such capability is assumed, and this does not block read-only acquisition.

### Legacy-use-case treatment

The legacy activities contribute source vocabulary, stable IDs, folder evidence, participant and summary use, unfoldered detection, and the principle that the source remains in Granola. Direct note creation, one-folder scoping, recent windows, one-meeting pickers, processed or skipped tags, and source mutation are not compatibility requirements. The new workflow acquires first, preferably into the expected receiver, then triages or trades only the material that needs another home.

### Future retirement safety gate

Granola retirement is a separate future operation and remains unavailable until an exact proposed manifest proves:

1. Complete acquisition-count reconciliation across the union of receiver scopes, every folder, and unfoldered history.
2. Stable source identities and hashes for every meeting version in scope.
3. A repeat acquisition with no unexplained new, changed, missing, failed, overlapping, unmatched, or unverifiable meeting.
4. Successful checksum and source-identity verification for every acquired meeting document.
5. A recorded harvest, retention, or routing disposition for every meeting.
6. Confirmed `ki-trades` receipts for material routed to other islands.
7. A recoverable provider export or archive where Granola supports one.
8. An exact deletion manifest naming every source identity and reviewed hash.
9. Explicit human approval of that exact manifest immediately before mutation.

Any source amendment after manifest generation invalidates the manifest and its approval. If Granola exposes no safe archive or delete API, the system emits a verified manual-release manifest and stops. Browser automation is not an acceptable substitute. Choosing never to delete is valid and leaves recurring incremental reconciliation as the permanent operating model.
