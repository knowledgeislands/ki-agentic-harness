<!-- GENERATED FILE: edit scripts/rubric/items/, not this publication. -->

# Generated rubric — feature definitions

> **Generated publication.** The TypeScript rubric items under `scripts/rubric/items/` are canonical; this file is generated from the in-memory catalogue. Edit the item definitions, then rerun `scripts/rubric/publish.ts`.

Line-by-line criteria for auditing ki-feature-definitions. Classifications are derived from item aspects: **[M]** mechanical and **[J]** judgment. Sources are cited as declared by each canonical item.

## INDEX — feature index

→ [standard](feature-format.md)

The corpus has a populated registry that maps prefixes to area files.

- **INDEX-1 [M] — docs/features/index.md exists** — `docs/features/index.md` exists. Missing is a FAIL — there is no registry to validate against. (feature-format.md)
- **INDEX-2 [M] — index.md contains a populated areas table** — `index.md` contains at least one areas table (a table with `Prefix` and `File` columns) with ≥ 1 row. No table is a FAIL. (feature-format.md)

## AREA — area registration

→ [standard](feature-format.md)

Area-table files and corpus files agree.

- **AREA-1 [M] — every file named in an areas table exists** — Every file named in an areas table exists on disk. A missing file is a WARN (the table is ahead of the corpus). (feature-format.md)
- **AREA-2 [M] — every area file is registered** — Every `*.md` in `docs/features/` (except `index.md`) is registered under at least one prefix in an areas table. An unregistered file is a WARN. (feature-format.md)

## ID — requirement identity

→ [standard](feature-format.md)

Requirement headings, prefixes, and append-only IDs form a coherent registry.

- **ID-1 [M] — requirement headings use canonical IDs** — Every level-3 heading outside a `## Gaps …` section matches `### <PREFIX>-NNN — <title>` (multi-segment uppercase prefix, ≥ 3-digit serial, em-dash separator). A non-conforming H3 is a FAIL. (feature-format.md)
- **ID-2 [M] — requirement prefixes are registered to their file** — Each requirement's prefix is registered in an areas table, and to this file. An unregistered prefix, or a prefix registered to a different file, is a FAIL. (feature-format.md)
- **ID-3 [M] — requirement IDs are unique across the corpus** — IDs are unique across the corpus (append-only, never reused). A duplicate `<PREFIX>-NNN` is a WARN. (feature-format.md)

## REQ — normative requirement shape

→ [standard](feature-format.md)

Active requirements state normative behaviour.

- **REQ-1 [M] — requirements carry an RFC-2119 keyword** — Each non-deprecated requirement's body carries an RFC-2119 keyword (`MUST` / `SHOULD` / `MAY` …, uppercase). None is a FAIL — a requirement with no normative verb is not testable. (feature-format.md)

## VERIFY — verification hooks

→ [standard](feature-format.md)

Active requirements carry a verification hook whose quality is reviewed.

- **VERIFY-1 [M] — requirements carry a Verify hook** — Each non-deprecated requirement has a `_Verify:_` line. Missing is a WARN. (feature-format.md)
- **VERIFY-2 [J] — Verify hooks are concrete and checkable** — The `_Verify:_` hook is concrete and checkable — a built-output assertion, a named test, or a linked source symbol — not a restatement of the requirement. (feature-format.md)
  - _Review prompt:_ The `_Verify:_` hook is concrete and checkable — a built-output assertion, a named test, or a linked source symbol — not a restatement of the requirement.

## BEHAVIOUR — behavioural altitude

→ [standard](feature-format.md)

Requirements specify behaviour rather than rationale or procedure.

- **BEHAVIOUR-1 [J] — requirements describe behaviour** — The statement describes behaviour, not rationale (that is a DR) or procedure (that is a guide). A requirement that explains why should move the reasoning to a Decision Record and cite it. (feature-format.md)
  - _Review prompt:_ The statement describes behaviour, not rationale (that is a DR) or procedure (that is a guide). A requirement that explains why should move the reasoning to a Decision Record and cite it.

## AS-BUILT — as-built truth

→ [standard](feature-format.md)

The numbered contract describes current system behaviour.

- **AS-BUILT-1 [J] — numbered requirements describe the system today** — The numbered requirement is true of the system today. Aspirational or not-yet-built behaviour belongs in `## Gaps`, not in the numbered contract. (feature-format.md)
  - _Review prompt:_ The numbered requirement is true of the system today. Aspirational or not-yet-built behaviour belongs in `## Gaps`, not in the numbered contract.

## SPLIT — requirement focus

→ [standard](feature-format.md)

Independently verifiable behaviours have independent IDs.

- **SPLIT-1 [J] — unrelated behaviours use separate IDs** — A heading that bundles several unrelated behaviours should split into separate IDs so each verifies independently. (feature-format.md)
  - _Review prompt:_ A heading that bundles several unrelated behaviours should split into separate IDs so each verifies independently.

## DR-LINK — decision traceability

→ [standard](feature-format.md)

Governed behaviours preserve their link from why to what.

- **DR-LINK-1 [J] — governed requirements cite their Decision Record** — A requirement that follows from a recorded decision cites its DR. Absence is not a mechanical failure, but a governed behaviour with no link is a gap in the audit trail from why to what. (feature-format.md)
  - _Review prompt:_ A requirement that follows from a recorded decision cites its DR. Absence is not a mechanical failure, but a governed behaviour with no link is a gap in the audit trail from why to what.

## AREA-FIT — area fit

→ [standard](feature-format.md)

Requirements remain in the area their behaviour belongs to.

- **AREA-FIT-1 [J] — requirements fit their area file** — Each requirement sits in the area file its prefix belongs to; a requirement that has drifted to the wrong area should move (and, if its behaviour changed area, take a new ID in the right prefix rather than moving the number). (feature-format.md)
  - _Review prompt:_ Each requirement sits in the area file its prefix belongs to; a requirement that has drifted to the wrong area should move (and, if its behaviour changed area, take a new ID in the right prefix rather than moving the number).
