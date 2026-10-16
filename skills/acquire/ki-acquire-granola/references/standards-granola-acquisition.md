# Granola acquisition standard

## Scope

This standard defines the provider-specific contract for faithfully acquiring Granola meetings into one or more Knowledge Islands repositories. It governs the read-only acquisition adapter and separately authorised additive progress marker and the evidence an executable `ki acquire import --adapter granola` implementation must preserve. Knowledge Islands Principal remains the authority for the provider-neutral lifecycle; `tools-ki` owns executable KEP construction and repository staging.

## Contents

- [Owned-note scope](#owned-note-scope)
- [Source boundary](#source-boundary)
- [Transport recovery](#transport-recovery)
- [Provider operations](#provider-operations)
- [Complete identity enumeration](#complete-identity-enumeration)
- [Folder, unfoldered, and receiver evidence](#folder-unfoldered-and-receiver-evidence)
- [Receiver declaration and flag-only outcomes](#receiver-declaration-and-flag-only-outcomes)
- [Incremental acquisition and amendments](#incremental-acquisition-and-amendments)
- [Acquisition fidelity](#acquisition-fidelity)
- [Staging and harvesting boundary](#staging-and-harvesting-boundary)

## Owned-note scope

Granola acquisition covers the connected principal's own meeting notes. Notes owned by someone else and shared with the principal are out of scope: do not read, import, harvest, reconcile, manage, or prepare them for deletion. A principal-owned note remains eligible when the principal shares it with others; a folder name alone does not establish ownership.

Global and folder enumeration, acquisition counts, receiver routing, and manual-release manifests apply to the principal-owned population. When identity metadata reveals an incoming shared note, exclude it without retrieving its content or seeking another access path through the desktop app, browser, local filesystem, or owner. Incoming shared notes do not count as missing acquisitions or block pruning of verified principal-owned notes. An unavailable shared note requires no follow-up. If ownership cannot be established, exclude the note from import and release until its identity evidence establishes that it belongs to the principal.

## Source boundary

Granola's official remote MCP is the selected source adapter. The verified surface provides read-only operations equivalent to:

- account and active-workspace identification;
- folder listing;
- global or folder-scoped meeting listing over a named date range;
- meeting details for at most ten UUIDs per request;
- paged transcripts per meeting UUID;
- screenshot count and attachment UUID enumeration, with image reads in batches of at most five;
- natural-language notes query.

Natural-language query is exploratory and MUST NOT be treated as a faithful acquisition record. Acquisition uses listing, detail, and transcript projections. An implementation MUST allowlist the read-only tools it invokes and MUST stop when a required read changes shape incompatibly. Unrelated advertised mutation tools do not grant authority and MUST NOT be invoked by acquisition.

The import adapter MUST NOT change provider state. A separate confirmed marker operation MAY add a verified note to the configured private progress folder under the checks below; it MUST NOT remove any membership or change notes, folder administration, workspace, archive, or deletion state. OAuth and provider credentials remain in the client credential store and MUST NOT enter a KEP, repository configuration, fixture, log, or trade.

## Transport recovery

An MCP response carrying `CLIENT_HTTP_NOT_IMPLEMENTED` is a transport failure, not evidence of an empty Granola account. When the public endpoint remains reachable but Granola schema inspection or a read-only call returns that error, the operator SHOULD restart the single-user `mcporter` daemon with `mcporter daemon restart`, then retry the same read-only operation once. Acquisition MUST still stop if the retry fails and MUST accept an empty source only when a successful listing explicitly reports zero meetings.

## Provider operations

### Discover

`discover` returns content-minimised evidence sufficient to establish:

- connected account and active-workspace identity in redacted or hashed form;
- provider endpoint and negotiated transport;
- available read-only tool names and schema hashes;
- entitled account scopes;
- folder inventory with stable IDs, titles, descriptions, and returned note counts;
- known caps, date granularity, and explicit unsupported fields.

Discovery MUST NOT retain meeting notes, summaries, transcripts, participants, or media.

### List

`list` enumerates meeting identities through global and folder-scoped custom ISO-date windows. It preserves UUID, title, returned meeting date, participant or involvement evidence, query scope, query window, response hash, and saturation status. Every request MUST filter `involvement.captured_by_me` to true. Rich listing memberships and screenshot counts are retained alongside complete folder-query evidence; disagreement fails closed.

### Read

`read` retrieves the structured meeting-detail projection and, when entitled, the transcript projection for one stable UUID. A caller MAY batch detail reads up to the provider's verified maximum but treats every meeting as an independent acquisition identity. Acquisition hashes the exact returned projections, then renders their metadata, notes, participants, and transcript into one human-readable Markdown file for that meeting. Folder and transcript pagination MUST advance without duplicate identities or inconsistent ranges; every transcript page remains hashed source evidence.

### Checkpoint

`checkpoint` records two distinct evidence layers:

- **Identity checkpoint:** complete enumerated UUID set, window and folder-query hashes, schema hash, account/workspace evidence, saturation outcomes, and omissions.
- **Content checkpoint:** for each UUID, hashes of exact detail and transcript projections, observed acquisition time, Markdown path, document checksum, version history, and explicit omissions.

An identity checkpoint cannot prove existing content unchanged because the verified provider supplies no update timestamp, ETag, or version identifier.

## Complete identity enumeration

Complete history is a reconciled set, not one provider response. The caller MUST:

1. Select a conservative history start before any expected meeting and the current acquisition end date.
2. List the global population for that custom ISO-date window.
3. Treat a response containing exactly 100 meetings as saturated and recursively split its date window.
4. Continue until every leaf window returns fewer than 100 meetings.
5. Fail closed if a saturated window cannot be narrowed below one ISO date.
6. Repeat the same window procedure for every discovered folder.
7. Deduplicate overlapping boundary windows and folder results by stable UUID.
8. Record every request window, response count, response hash, split, retry, and failure.

Window boundaries SHOULD overlap by one ISO date until inclusive and exclusive provider semantics are proven; UUID deduplication removes the intentional overlap. A rate-limited or interrupted run resumes from verified leaf-window checkpoints and MUST NOT claim completeness while any leaf is missing, saturated, failed, or unverifiable.

## Folder, unfoldered, and receiver evidence

The global UUID set is the coverage authority. The union of complete folder-scoped UUID sets supplies folder-routing evidence. A UUID in the global set but absent from every complete folder set is inferred unfoldered. This inference is valid only when the global and every folder enumeration share the same complete history interval and schema evidence.

Each eligible receiver declares folder IDs and its explicit unfoldered or residual policy. Folder names are presentation evidence, not stable selector identity. Folder selectors choose the repository best served by the meeting; no named repository is a permanent or implicit catch-all. Unfoldered, unmatched, or conflicting meetings remain explicit reconciliation outcomes unless an eligible receiver has deliberately declared the applicable residual selector.

When one meeting's mapped folders imply different receivers, acquisition MUST stop that meeting for human selection. It MUST NOT select by lexical order, first response, folder name, or repository priority. Multiple-repository acquisition is permitted only under an explicit intentional-duplication policy. Every unmatched, overlapping, excluded, and inferred-unfoldered identity remains visible in the acquisition report.

## Receiver declaration and flag-only outcomes

A receiver MAY map several stable `folder_ids` to one repository. This is one acquisition destination, not intentional duplication: each meeting UUID produces at most one current capture package there, with every observed folder ID and title preserved.

`unfoldered` and `residual` accept `true`, `false`, or `"flag"`. `true` selects the matching population for acquisition, `false` supplies no fallback, and `"flag"` reports matching identities for the owner to route. `unfoldered` applies to the global-minus-folder union; `residual` applies to foldered identities with no selected receiver. A flag records UUID, title, meeting date, folder evidence, and reason without reading meeting details or transcripts. Flagged identities remain visible on every run and MUST NOT be counted as acquired content. Conflicting receiver claims still fail closed; a flag policy does not authorise precedence or duplicate capture.

The optional `capture_root` selects a repository-relative temporary capture area. It MUST be a safe, non-empty relative path without traversal or symbolic-link escape. The optional `folder_territories` table maps selected stable folder IDs to explicit safe territory slugs. Keys MUST belong to `folder_ids`; every selected folder MUST have a mapping when `capture_root` is declared. Slugs identify territory routes independently of folder display titles and MUST NOT be inferred by renaming or normalising those titles.

A central receiver declares all intended folder selectors, their territory routes, and the desired flag policies. Provider folder renames change presentation evidence while stable selectors continue to route. Folder discovery still enumerates every live folder so newly introduced or unmatched folders cannot silently disappear from coverage reports.

## Incremental acquisition and amendments

An initial import MUST exhaustively enumerate and read every selected meeting, create one checksummed Markdown file per meeting, verify the documents and ledger, then repeat exhaustive enumeration and content hashing. A clean verification repeat has no unexplained identity or content delta.

Routine acquisition combines:

- complete identity enumeration for new, missing, moved, or newly visible UUIDs;
- bounded recent revalidation of detail and transcript projections;
- a scheduled exhaustive revalidation of every selected UUID.

The initial routine cadence is operating policy and MAY change from measured history size, rate limits, runtime, and amendment evidence. The ledger records the cadence and last exhaustive sweep. A pre-retirement verification MUST always perform exhaustive content revalidation regardless of routine cadence.

Changed detail or transcript hashes update the meeting's Markdown file and append the new content hash to its ledger history. Git retains the prior acquired version. A folder-scope exit, missing identity, inaccessible transcript, or changed entitlement is a reported delta, never evidence authorising deletion of source or acquired material.

## Acquisition fidelity

Each acquired meeting document preserves everything the official MCP faithfully returns in readable form:

- provider account and active-workspace provenance in a privacy-minimised stable form;
- stable meeting UUID;
- title and returned meeting date;
- participant and involvement evidence;
- folder IDs and names derived from query context;
- generated notes or summary and returned participants;
- raw transcript with the returned speaker representation;
- schema, request, response, and content hashes;
- acquisition timestamps, window evidence, and checkpoint identity;
- explicit omissions.

The exact returned MCP projections are hashed as source evidence rather than published as separate machine-oriented payload files. The readable Markdown rendering is the acquired working document and MUST NOT be represented as Granola's undocumented internal record. Verified current omissions include source URL, creation timestamp, update timestamp, tags, audio, recording references or bytes, content version, and deletion tombstone. Later provider fields are acquired only after the schema is refreshed and their fidelity is verified.

Shared-screen snapshots are attachments. When MCP attachment access is advertised, acquisition MUST reconcile the listing screenshot count with distinct detail attachment UUIDs, fetch batches of at most five, bind each returned image to its following meeting/attachment metadata, validate canonical base64 and true image format against MIME, and retain exact returned bytes. The checksum manifest records provider, detail-version hash, expected count (including verified zero), attachment UUIDs, metadata, filenames, byte counts, and SHA-256. Assets and manifest MUST verify before the note's acquisition receipt advances. Retain prior manifests and immutable assets; conflicting bytes for an existing attachment UUID fail closed. Recovery MUST recheck image evidence before reusing a completed component.

MCP-byte preservation does not prove equality with desktop originals. The manual `ki acquire images` export path remains available and retirement retains its independent original-export gate. Older MCP schemas without attachment access retain explicit attachment omissions and cannot qualify for automatic progress marking.

### Acquired progress marker

The optional `acquired_folder_id` MUST be distinct from territory selectors and identify an owner-controlled folder with private visibility and audience `only you`. It is progress metadata, never a territory or fallback receiver. Preserve all other memberships. Every live folder still participates in completeness enumeration.

Routine import MAY skip a note in that folder only when its ledger entry matches committed Git evidence and its local document, current MCP image manifest, expected screenshot count, and asset bytes verify against committed files. A retained handled receipt may establish already-preserved status without recreating removed captures. An unproved marker is flagged without reading content; it MUST NOT be treated as successful acquisition. `--refresh-acquired` bypasses the skip for deliberate amendment checks; `--refresh-transcripts` additionally refreshes transcripts. A skip makes no claim that mutable source content is unchanged.

`ki acquire mark --adapter granola` previews an exact date window and optional UUID set. Only `--confirm` invokes `add_note_to_folder`, never a general provider mutation dispatcher. Immediately before adding, require the same account, no recovery journal, a complete committed local capture and available transcript, matching fresh detail/transcript hashes, matching screenshot UUIDs and bytes, and unchanged original memberships. Revalidate the marker's privacy; read back the union of original memberships plus the marker. Failed notes remain visible exceptions without blocking independent successes. Already-marked notes are idempotent after local receipt verification. No import run marks implicitly.

The marker is a source-side processing queue. It does not replace preservation ledgers, authorise source retirement, prove receiver reconciliation, or migrate technical state.

## Staging and harvesting boundary

Without `capture_root`, `tools-ki` retains the existing receiver layout: one checksummed Markdown file per meeting beneath `+/_ACQUIRE/granola/`, with a collision-resistant name such as `<date>--<title>--<uuid>.md` and the existing provider-level checkpoint beside it.

With `capture_root`, each meeting has one package at `<capture_root>/<territory>/granola/<date>--<title>--<uuid>/meeting.md`. If its observed selected folders map to multiple territories, the package goes under `<capture_root>/_review/granola/` for later human routing. All observed folder memberships and all mapped territories remain in the capture metadata; neither folder ordering nor repository priority chooses a single territory silently. Original image exports and their checksum manifest stay beside the meeting document.

YAML frontmatter carries identity, provenance, folder evidence, territory routes where declared, hashes, acquisition metadata, and omissions. The body carries one H1 meeting title, optional H2 `Attendees`, source-note headings normalised beneath H2 without a synthetic `Notes` wrapper, and H2 `Transcript` with readable speaker turns. Acquired documents remain lint-clean without blanket lint suppression.

For a temporary central inbox, technical state lives separately beneath `.acquire/granola/`, outside removable capture packages. Its provider-level `ledger.json` advances only after document checksum and identity verification, and records stable source identity, current capture path and hashes, prior content hashes, scope evidence, and later handling disposition. Flags and recoverable journals are technical run evidence, not a hand-maintained capture index or durable knowledge store.

Acquisition does not classify durable knowledge, rewrite source notes, schedule imports, or reconcile knowledge into the owning repositories. The owner decides when to run it and later harvests each capture into the appropriate durable knowledge or declared source store. A capture package may be removed only after that preservation is verified and its handling disposition is recorded. Its technical checkpoint MUST survive removal: unchanged source material must not become a fresh capture merely because the temporary file has been handled. An amended source projection returns as an explicit review item. Missing staged evidence remains a verification failure, not an inferred handling decision.

An approved migration from several receivers MUST reconcile by UUID and verify the existing checksums before changing ingress. Preserve every differing acquired version and its original receiver provenance, retain existing handled dispositions, and keep auxiliary acquisition evidence recoverable. Consolidating multiple copies creates one current package per UUID without discarding variants. Only after central verification may superseded receiver declarations and old working captures be removed. Migration does not authorise source retirement, rewrite unrelated capture paths, or alter another source adapter's capture protocol.

Material acquired into the wrong repository, corrections affecting another island, and knowledge with wider applicability move only through governed harvesting and `ki-trades`.
