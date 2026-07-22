<!-- GENERATED FILE: edit scripts/rubric/items/, not this publication. -->

# Generated rubric — decision records

> **Generated publication.** The TypeScript rubric items under `scripts/rubric/items/` are canonical; this file is generated from the in-memory catalogue. Edit the item definitions, then rerun `scripts/rubric/publish.ts`.

Line-by-line criteria for auditing ki-decision-records. Classifications are derived from item aspects: **[M]** mechanical, **[J]** judgment, **[M + J]** hybrid, and **[M-heuristic + J]** hybrid with heuristic mechanical evidence. Sources are cited as declared by each canonical item.

## Contents

- [FILENAME — file and naming checks](#filename--file-and-naming-checks)
- [ROOT — collection-root checks](#root--collection-root-checks)
- [FM — frontmatter checks](#fm--frontmatter-checks)
- [TYPE-FIT — decision classification](#type-fit--decision-classification)
- [BODY — body structure checks](#body--body-structure-checks)
- [INDEX — index checks](#index--index-checks)

## FILENAME — file and naming checks

→ [standard](dr-format.md)

Canonical decision-record filenames and serial namespaces.

- **FILENAME-1 [M] — Canonical decision-record filename** — Filename is `<ID>-<title-slug>.md`: the canonical uppercase record ID, a dash, then the title lowercased with each non-alphanumeric run replaced by one dash and leading or trailing dashes removed. (dr-format.md)
- **FILENAME-2 [M] — Unique serial within prefix and scope** — NNN is unique per prefix within its `<SCOPE>` namespace; two files may share the same integer if they carry different prefixes; no two files share the same prefix+scope+serial combination. `XXX` files are exempt from uniqueness. (dr-format.md)
- **FILENAME-3 [M] — Contiguous serial series** — Within each prefix+scope series the serials start at `001` and are contiguous. A gap is fixed by renumbering the series and sweeping every citation of shifted codes in the same change. `XXX` pending files are exempt. (dr-format.md)

## ROOT — collection-root checks

→ [standard](dr-format.md)

The first Decision Record in a newly marked collection adopts the instrument itself.

- **ROOT-1 [M] — Adoption root for a new collection** — An index marked `<!-- ki-decision-records: adoption-root -->` begins with `GDR-<SCOPE>-001: Adopting Decision Records`. Existing unmarked collections are migration cases and are not rewritten automatically. (dr-format.md)

## FM — frontmatter checks

→ [standard](dr-format.md)

Required universal decision metadata.

- **FM-0 [M] — Decision-record frontmatter** — YAML frontmatter block is present on every decision record. (dr-format.md)
- **FM-3 [M] — Human-readable record type** — `type` is the canonical human-readable record type for the filename prefix. (dr-format.md)
- **FM-4 [M] — Decision type metadata** — `decision_type` field is present. (dr-format.md)
- **FM-5 [M] — Prefix and decision type alignment** — `decision_type` exactly matches the canonical value encoded by the filename prefix. This makes required KB metadata internally consistent; it does not prove that the prefix is the right semantic classification. (dr-format.md)
- **FM-6 [M] — Core decision metadata** — `id`, `title`, `date`, `status`, and `type_url` are present; ID and title compose the H1, date uses YYYY-MM-DD, and the URL matches the record prefix. (dr-format.md)

## TYPE-FIT — decision classification

→ [standard](dr-format.md)

Semantic alignment between a decision and its canonical prefix.

- **TYPE-FIT-1 [J] — Semantic decision classification** — The filename prefix accurately categorises the decision itself; the body makes the type obvious. A mismatch is resolved with a human by choosing the correct canonical record ID or metadata, never by mechanically overwriting either side. (dr-format.md)
  - _Review prompt:_ Assess whether the filename prefix accurately categorises the decision itself without a stretch fit and whether the body makes the type obvious. Resolve a mismatch with a human, never by mechanically overwriting either side.

## BODY — body structure checks

→ [standard](dr-format.md)

Present-state decision-record structure and writing quality.

- **BODY-1 [M] — Canonical heading** — Heading matches `# <PREFIX>-<SCOPE>-NNN: <title>`; the ID prefix is present and matches the filename. (dr-format.md)
- **BODY-3 [M] — No legacy date line** — A decision record does not carry a legacy bold `**Date:**` line; its date belongs in frontmatter. (dr-format.md)
- **BODY-4 [M] — Required decision sections** — `## Context`, `## Decision`, and `## Consequences` sections are all present. (dr-format.md)
- **BODY-5 [J] — Value-neutral context** — Context is value-neutral forces, not advocacy ("the island currently…" not "we need to…"). (dr-format.md)
  - _Review prompt:_ Assess whether Context states value-neutral forces rather than advocacy.
- **BODY-6 [J] — Active-voice decision** — Decision is in active voice ("This island adopts…" or "We will…"). (dr-format.md)
  - _Review prompt:_ Assess whether Decision uses active voice.
- **BODY-7 [J] — Substantive sections** — Each section has real, non-placeholder substance. (dr-format.md)
  - _Review prompt:_ Assess whether every required section contains real, non-placeholder substance.
- **BODY-8 [J] — Focused length** — Length is one to two pages, roughly 200–500 body words. (dr-format.md)
  - _Review prompt:_ Assess whether the body is a focused one to two pages, roughly 200–500 words.
- **BODY-9 [J] — Noun-phrase title** — Title is a short noun phrase, not a question or full sentence. (dr-format.md)
  - _Review prompt:_ Assess whether the title is a short noun phrase rather than a question or full sentence.
- **BODY-10 [J] — Present-state record** — The record is written as now and carries no historic, superseding, or forward-looking narration. Such content belongs in the ROADMAP or a KB stream, not in a present-state record. (dr-format.md)
  - _Review prompt:_ Assess whether the record states the present decision without historic, superseding, forward-looking, parked, or not-yet-started narration.

## INDEX — index checks

→ [standard](dr-format.md)

Complete, current, and readable decision-record indexes.

- **INDEX-1 [M] — Decision index exists** — The index file exists (`Decisions.md` in a KB, `README.md` in a code repository). (dr-format.md)
- **INDEX-2 [M] — Exactly one index entry per record** — Every decision-record file has exactly one entry in the index list, linked by ID. (dr-format.md)
- **INDEX-3 [M] — No stale index entries** — No index entry references a decision-record file that does not exist. (dr-format.md)
- **INDEX-6 [J] — Reveal order** — Entries are in a sensible reveal order: a from-scratch build narrative with roots first, then dependents, weaving sub-scopes in. (dr-format.md)
  - _Review prompt:_ Assess whether index entries form a sensible from-scratch reveal order with roots before dependents.
- **INDEX-7 [J] — Index gloss alignment** — An entry's gloss matches the decision record's heading title, excluding the ID prefix. (dr-format.md)
  - _Review prompt:_ Compare every index gloss with its decision record's heading title, excluding the ID prefix.
- **INDEX-8 [M] — Ascending serial reveal order** — Within each prefix, serials ascend in reveal order; a higher serial never precedes a lower serial. A violation is fixed by renumbering rather than reordering out of sequence. (dr-format.md)
