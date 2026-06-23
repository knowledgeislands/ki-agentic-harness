# ADR audit rubric

The line-by-line checkable criteria behind [the format standard](adr-format.md). Each is tagged **[M] mechanical** (the bundled
[`../scripts/audit-adrs.ts`](../scripts/audit-adrs.ts) enforces it and prints the **id** in brackets) or **[J] judgment** (a reader assesses
it). Check IDs are what the script emits.

A criterion's tag is a contract with the script: if you find yourself eyeballing an **[M]** check, run the auditor instead; a **[J]** check
that becomes deterministic should move into the script and flip to **[M]**.

## Per-file checks

Each `ADR-*.md` file in the decisions directory is checked independently.

### Filename

- **name-format [M]** Filename matches `^ADR-[A-Z][A-Z0-9]*(-[A-Z][A-Z0-9]*)*-\d{3,}\.md$`. The scope contains only uppercase alpha-leading
  segments (`[A-Z][A-Z0-9]*`); the terminal serial is all-digits, zero-padded to ≥ 3. FAIL if the pattern does not match. (standard: Naming
  convention)

### Heading

- **title-heading [M]** The first non-empty line is an H1 (`#`) heading. Its text begins with the ADR ID (the filename stem) followed by
  `:`. FAIL if absent or if the heading ID does not match the filename stem. (standard: §1 Title)

### Status and Date fields

- **status-field [M]** A `**Status:**` bold-key line is present. The value is one of: `Proposed`, `Accepted`, `Deprecated`, or a string
  beginning with `Superseded by ADR-` followed by a valid ADR ID pattern. FAIL if absent or if the value does not match a known pattern.
  (standard: §2 Status)
- **date-field [M]** A `**Date:**` bold-key line is present. The value matches `YYYY-MM-DD`. FAIL if absent or malformed. (standard: §2
  Date)
- **superseded-link [M]** When Status is `Superseded by ADR-<ID>`, the referenced ID must name an existing file in the same decisions
  directory. WARN if the named file is absent (the successor may not yet be committed, but it is worth flagging). (standard: §2 Status —
  superseded lifecycle)

### Required sections

- **section-context [M]** `## Context` heading is present. FAIL if absent. (standard: §3)
- **section-decision [M]** `## Decision` heading is present. FAIL if absent. (standard: §4)
- **section-consequences [M]** `## Consequences` heading is present. FAIL if absent. (standard: §5)

## Cross-file checks

These checks span all ADR files in the decisions directory.

- **serial-unique [M]** No two files share the same `ADR-<SCOPE>-NNN` stem (case-insensitive). FAIL if a duplicate is found. (standard:
  Naming convention — NNN is never reused)

## Index checks (docs/decisions/README.md)

- **index-present [M]** An index file (`README.md` or `index.md`) exists in the decisions directory. WARN if absent (not FAIL — a single-ADR
  directory may not yet have one). (standard: Index)
- **index-complete [M]** Every `ADR-*.md` file in the directory appears as a row in the index table (matched by ID). WARN per missing row.
  (standard: Index)
- **index-stale [M]** For each row in the index, the `Status` cell matches the ADR file's own Status field. WARN per mismatch — the index is
  display; the file is authoritative. (standard: Index)
- **index-order [M]** Index rows appear in filename-ascending order (i.e. lexicographic by ADR ID). ADVISORY if out of order. (standard:
  Index)

## Judgment (not deterministic — apply by reading)

- **section-content [J]** Each required section (`## Context`, `## Decision`, `## Consequences`) contains real substance — not a
  placeholder, not a single sentence that restates the title. A stub section (the result of CONFORM adding an empty shell) is not acceptable
  in an `Accepted` ADR.
- **context-neutral [J]** `## Context` reads as value-neutral forces — facts about the situation — not advocacy for the decision that
  follows. Red flags: "we need to", "the problem is", "obviously", "clearly".
- **decision-voice [J]** `## Decision` uses active voice. Red flags: passive constructions ("it was decided", "X will be used"), future
  tense without a subject, nominal style ("the adoption of X").
- **length [J]** The ADR body (excluding heading and Status/Date lines) is one to two pages (roughly 200–500 words). Shorter may mean the
  context is under-documented; longer may mean it is a design document, not a decision record.
- **scope [J]** The ADR records a single decision. If the Consequences section lists several independently reversible choices, they likely
  belong in separate records.
- **sync [J]** This rubric, [the format standard](adr-format.md), and the script's constants agree. When the standard moves (after a
  REFRESH), all three move together.
