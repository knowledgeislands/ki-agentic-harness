# Knowledge Acquisition Framework and Knowledge Export Package specification brief

**Origin:** `ki-agentic-harness` GOV-001

**Receiving repository:** `knowledgeislands/ki-specifications`

**Relationship:** define the portable KAF and KEP contracts. The receiving repository owns its roadmap, plan, specification identifiers, publication, and any decision records.

## Requested outcome

Publish a coherent specification family for acquisition and export that lets a source connector create a portable, fidelity-preserving Knowledge Export Package (KEP), independently of both knowledge extraction and Knowledge Island ingress.

## Locked lifecycle boundary

```text
external system
  → KAF acquisition
  → immutable KEP
  → KBEP extraction
  → extracted knowledge package
  → KBIP governed ingress
  → Knowledge Island
```

- **KAF** retrieves and preserves source records, assets, provenance, integrity evidence, and native source relationships. It does not extract reusable knowledge, deduplicate, canonicalise, infer semantic relationships, or govern knowledge.
- **KBEP** consumes a KEP, preserving its identity and provenance while extracting, normalising, relating, and reviewing reusable knowledge. Its current “Source Capture” stage must not retrieve external content; rename or redefine it as KEP intake and evidence selection.
- **KBIP** consumes KBEP output and retains its upstream lineage. It assigns canonical representation, governance, lifecycle, and publication treatment without rewriting the immutable KEP.

## KEP v0 contract

The first contract is a canonical directory tree. A `.kep.zip` archive is an optional distribution encoding only when its ordering, metadata, compression, and timestamps are normalised; the canonical payload identity is the directory contents and checksum set.

```text
kep/
├── kep.toml
├── README.md
├── source/
│   ├── originals/
│   └── records/
├── assets/
├── relationships/
│   └── native.jsonl
└── checksums/
    └── sha256sums.txt
```

`kep.toml` must define at least: KEP format/version; content-derived package identity; connector identity and version; source-system identity; capture boundary; source-record and asset inventories; provenance references; known omissions; and checksum-manifest location. It must not record secrets, browser profiles, cookies, access tokens, or non-deterministic generation timestamps.

Source records preserve the source content and available source metadata. Assets retain original bytes under a stable digest-derived path. Relationships record only source-native links and their evidence. Binary assets are never embedded in Markdown.

Mutable connector checkpoint state, session data, caches, and logs remain outside the KEP. A resumed acquisition creates a new immutable KEP when the selected source boundary changes.

## Determinism and integrity

- The same normalised source inputs and connector version produce the same payload paths, manifest values, relationship ordering, and checksum manifest.
- Record-byte fidelity takes priority over presentation normalisation. Any intentional normalisation must be declared in connector metadata.
- The content-derived package identity is calculated from canonical manifest and payload digests; capture-run timing belongs in external operational state, not the immutable payload.
- A validator reports missing, changed, unreferenced, or digest-mismatched records and assets without mutating the package.

## Connector contract

A connector plans, acquires, resumes from local checkpoint state, validates, and emits a KEP. It declares supported source forms, required user interaction, source metadata it can preserve, asset behaviour, limitations, and whether it is read-only.

The first connector profile is **user-assisted ChatGPT import**: accept an already user-obtained export or capture directory and preserve available conversation order, roles, timestamps, identifiers, attachments, generated assets, and project membership. Browser automation, undocumented APIs, and authentication-profile use are outside v0.

## Acceptance criteria

1. KAF, KBEP, and KBIP have non-overlapping responsibilities and explicit upstream/downstream artifacts.
2. A KEP validator can prove payload integrity and identify an incomplete capture without extracting knowledge.
3. A user-assisted ChatGPT capture can become a KEP without network access, browser control, credentials, or source-session mutation.
4. A later KBEP implementation can process the KEP without returning to the original source system.

## Deferred decisions

- Archive signature format, publisher trust, and registry distribution.
- Browser automation, API integrations, and authentication storage.
- Connector package repository layout and release model.
- The precise KBEP extracted-package schema and KBIP canonical-ingress schema.
