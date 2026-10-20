# Granola acquisition standard

## Scope

This standard adds Granola's completeness and capability rules to the `ki-acquire` common contract. It governs read-only import through `ki acquire import --adapter granola` and the separately confirmed additive Acquired marker. `tools-ki` owns execution; Knowledge Islands Principal owns the provider-neutral lifecycle.

Acquisition keeps no ledger, checkpoint, journal or flagged-identity file. The committed capture is the only record: its front matter carries the source identity, account binding, hashes and folder memberships, and Git history holds earlier bytes. An interrupted run is simply repeated.

## Contents

- [Owned notes and source boundary](#owned-notes-and-source-boundary)
- [Complete identity enumeration](#complete-identity-enumeration)
- [Folder routing](#folder-routing)
- [Capture packages](#capture-packages)
- [Repeat runs and amendments](#repeat-runs-and-amendments)
- [Acquisition fidelity](#acquisition-fidelity)
- [Acquired marker](#acquired-marker)
- [Source retirement](#source-retirement)

## Owned notes and source boundary

Acquisition covers the connected principal's own meeting notes. Notes owned by someone else and shared with the principal are out of scope: exclude them without reading content or seeking another access path. If ownership cannot be established, exclude the note.

The official remote MCP is the source. Acquisition allowlists its read tools: account, folders, owned-note date-window listing, meeting details in batches of at most ten, paged transcripts, and screenshots in batches of at most five. Natural-language query is exploratory, never an acquisition record. Stop when a required read changes shape. Import never changes provider state; unrelated advertised mutation tools grant no authority. Credentials stay in the client credential store.

`CLIENT_HTTP_NOT_IMPLEMENTED` is a transport failure, not an empty account: restart the `mcporter` daemon once and retry the same read, then stop if it still fails. Accept an empty source only when a successful listing reports zero meetings.

## Complete identity enumeration

Complete history is a reconciled set, not one response. List the global population over custom ISO-date windows filtered to `involvement.captured_by_me`; treat exactly 100 results as saturated and split the window until every leaf returns fewer, failing closed if a single date saturates. Repeat for every live folder, overlap boundaries by one date, and deduplicate by UUID. Do not claim completeness while any leaf is missing, saturated or failed.

## Folder routing

The global UUID set is the coverage authority; complete folder-scoped sets supply routing evidence. A UUID absent from every complete folder set is unfoldered. Folder IDs, not names, are selectors.

A receiver declares `folder_ids` and its `unfoldered` and `residual` policies. Each accepts `true`, `false` or `"flag"`; a flag reports UUID, title, date and folder evidence without reading details or transcripts, and is never counted as acquired. Conflicting receiver claims fail closed for human selection; no lexical order, folder name or repository priority decides. Duplication across receivers needs explicit `duplicate_folder_ids` in each.

## Capture packages

With `capture_root` and `folder_territories`, each meeting has one package at `<capture_root>/<territory>/granola/<date>--<title>--<uuid>/meeting.md`, with screenshots and their checksum manifest beside it. A meeting whose folders map to several territories, or to an unmapped folder, goes under `<capture_root>/_review/granola/` for owner routing. Without `capture_root`, documents land beneath `+/_ACQUIRE/granola/`. Front matter carries identity, provenance, every folder membership, territory routes, hashes and omissions; the body has the title, attendees, normalised notes and a readable transcript, and stays lint-clean.

## Repeat runs and amendments

Members of the Acquired folder are skipped on membership alone, before any content read. For other meetings, an existing capture is found by UUID wherever it is filed beneath the capture directory and kept, not overwritten. `--refresh` rewrites it in place at its existing path and keeps a transcript the provider no longer returns; `--refresh-acquired`, which implies `--refresh`, re-reads Acquired members too. Several captures of one meeting, or a capture bound to another account, are always kept and reported. A skip claims nothing about unchanged source content, and a missing identity or changed entitlement never authorises deletion.

## Acquisition fidelity

Each capture preserves what the MCP faithfully returns: privacy-minimised account and workspace provenance, meeting UUID, title, date, participants, folder evidence, notes, the complete transcript with returned speakers, request and content hashes, and explicit omissions. Current omissions are source URL, creation and update timestamps, tags, audio, content version and deletion tombstone. The readable rendering is a working document, not Granola's internal record.

Screenshots are attachments. Reconcile the listing count with distinct attachment UUIDs, validate each image's base64 and true format, and keep the exact returned bytes with a manifest of expected count (including zero), UUIDs, filenames, sizes and SHA-256. Conflicting bytes for an existing attachment fail closed. MCP bytes do not prove equality with desktop originals; `ki acquire images` preserves separately exported originals.

## Acquired marker

The optional `acquired_folder_id` names an owner-controlled private folder, distinct from every territory selector. Its membership marks a meeting as dealt with. No import marks implicitly.

`ki acquire mark --adapter granola` previews an exact window and optional UUID set; only `--confirm` invokes `add_note_to_folder`. Before adding, verify the account, the folder's privacy, a single committed capture and its files, an available transcript, fresh hashes matching the capture's front matter, screenshot UUIDs and bytes, and unchanged original memberships; then read back the original memberships plus Acquired. Failures stay visible without blocking independent successes. The marker removes no membership and grants neither reconciliation nor retirement.

## Source retirement

Retirement is separate from acquisition and marking, and Granola exposes no safe archive or delete API. The executor may only produce an exact manual-release manifest and stop; a human deletes the listed meetings in Granola. Browser automation is not a substitute.

A meeting enters the manifest only after a full-history `--refresh-acquired` import across every receiver, with each capture committed and unchanged, its detail and transcript available, routing resolved, and, for screenshot-bearing notes, a fresh desktop export matching the committed manifest in count, UUIDs and bytes. Unknown screenshot presence excludes it. The manifest names one account, each UUID and its source-version hash, and needs explicit human approval immediately before deletion; any later change invalidates the affected entries. Keeping a meeting in Granola indefinitely is a valid outcome.
