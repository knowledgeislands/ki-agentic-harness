# KDR format standard

**Contents:** [Naming convention](#naming-convention) · [Type taxonomy](#type-taxonomy) · [Frontmatter](#frontmatter) ·
[Sections](#sections) · [Template](#template) · [Index](#index) · [Writing guidance](#writing-guidance)

The quotable standard behind [the rubric](audit-rubric.md) and [`../scripts/audit-kdrs.ts`](../scripts/audit-kdrs.ts). Grounded in Michael
Nygard's original 2011 ADR format (see [sources](sources.md)) with two house additions: a `type` frontmatter field and `## References`.
Extends that foundation into the domain of knowledge islands rather than software architecture. Mode REFRESH re-reads the sources and
proposes diffs here.

## Naming convention

```text
KDR-<SCOPE>-NNN
```

- **`KDR-`** is the fixed prefix.
- **`<SCOPE>`** is one or more uppercase alpha-leading segments separated by `-`. Scope is open — there is no fixed enumeration. KI island
  repos use the island's identifier as the first segment (e.g. `ARCADIA`, `PRINCIPAL`). A scope segment matches `[A-Z][A-Z0-9]*`; a
  digit-only segment is invalid (it would be ambiguous with the serial).
- **`NNN`** is a zero-padded decimal serial (≥ 3 digits). Monotonically increasing within its `KDR-<SCOPE>` namespace, never reassigned,
  never reused — even if a KDR is superseded, its number is retired.

Examples: `KDR-ARCADIA-001`, `KDR-ARCADIA-TOOLS-002`, `KDR-PRINCIPAL-001`.

Filename: `KDR-<SCOPE>-NNN-<slug>.md` where `<slug>` is a short lowercase hyphenated summary of the title. Stored in `Admin/Decisions/` by
default; a repo may choose a different path and configure it in `.ki-config.toml`.

## Type taxonomy

Every KDR carries a `type` frontmatter field, one of six values:

| Value          | Covers                                                |
| -------------- | ----------------------------------------------------- |
| `architecture` | Structure of the island, zones, repo relationships    |
| `product`      | What the island produces, its purpose, scope          |
| `governance`   | Processes, authority, change mechanisms               |
| `taxonomy`     | Tag hierarchies, classification schemes, vocabularies |
| `naming`       | Naming conventions for notes, files, identifiers      |
| `process`      | Operational procedures, workflows, activity design    |

## Frontmatter

Each KDR note carries standard island frontmatter plus the KDR-specific `type` field:

```yaml
---
tags:
  - card/kdr
type: architecture | product | governance | taxonomy | naming | process
status: current - Month YYYY
author: Written with Claude | Manual | Mixed
---
```

`status` follows the island's note lifecycle convention (draft/current/outdated/archive). It tracks the note's maintenance state, not the
decision's lifecycle — the decision lifecycle (`Proposed`, `Accepted`, etc.) lives in the body as a `**Status:**` line.

## Sections

Every KDR has exactly these sections, in this order:

### 1. Title (heading)

```markdown
# KDR-<SCOPE>-NNN: <Short noun phrase>
```

The title is a short noun phrase — not a question, not a full sentence. The heading reproduces the full KDR ID as its prefix so a reader can
identify the record from the heading alone.

### 2. Status and Date (bold fields, immediately after the heading)

```markdown
**Status:** Proposed | Accepted | Deprecated | Superseded by KDR-<SCOPE>-NNN

**Date:** YYYY-MM-DD
```

Freestanding bold-key lines, not a table or code block. `**Date:**` records when the Status last changed (not the creation date). Valid
Status values:

| Value                 | Meaning                                                              |
| --------------------- | -------------------------------------------------------------------- |
| `Proposed`            | Under discussion; not yet agreed                                     |
| `Accepted`            | Agreed and in effect — **do not modify the body; supersede instead** |
| `Deprecated`          | Being phased out but not replaced by a single successor              |
| `Superseded by KDR-…` | Replaced by the named KDR; include the full ID of the successor      |

When a KDR is superseded: (1) update its Status to `Superseded by KDR-<SCOPE>-NNN`; (2) add a `Supersedes KDR-<SCOPE>-NNN` line in the
successor. Both records are retained — the history is the point.

### 3. `## Context`

The forces at play — structural, operational, relational, temporal — that made a decision necessary. Value-neutral language: state facts,
not advocacy. Avoid "we need to" or "the problem is"; prefer "the island currently..." or "two approaches exist...". One to three
paragraphs. The reader of a future KDR will use this section as the context for their own record.

### 4. `## Decision`

The team's response to those forces. One paragraph or a short bulleted list. Active voice: "This island adopts..." or "We will...". Not
rationale — just what was decided. Rationale belongs in Context (the forces) and Consequences (the trade-offs).

### 5. `## Consequences`

The resulting context after the decision is applied — positive outcomes, trade-offs, and neutral follow-on constraints. Keep it factual.
Consequences from one KDR frequently become the Context for the next; write them with that in mind.

### 6. `## References` (house addition, optional)

```markdown
## References

- [Title](../path/to/note.md) — one-line note on why it is cited.
```

Expected when the decision codifies an existing standard or cites a prior source. Relative Markdown links only. Omit entirely if there are
genuinely no relevant references.

## Template

```markdown
---
tags:
  - card/kdr
type: architecture
status: draft - Month YYYY
author: Written with Claude
---

# KDR-<SCOPE>-NNN: <Title>

**Status:** Proposed

**Date:** YYYY-MM-DD

## Context

<The forces at play. Value-neutral. One to three paragraphs.>

## Decision

<What was decided. Active voice. One paragraph or short list.>

## Consequences

<Positive outcomes, trade-offs, and follow-on constraints.>

## References

- [Source title](../path/to/note.md) — why cited.
```

## Index

`Admin/Decisions/Decisions.md` must carry a Markdown table with one row per KDR, ordered by filename:

```markdown
| ID              | Title                                                          | Type       | Status   | Date       |
| --------------- | -------------------------------------------------------------- | ---------- | -------- | ---------- |
| KDR-ARCADIA-001 | [Adopting KDRs](KDR-ARCADIA-001-knowledge-decision-records.md) | governance | Accepted | 2026-06-25 |
```

The Title cell is a relative link to the KDR file. Status and Date must match the KDR's own `**Status:**` and `**Date:**` fields. A new KDR
row is added in filename order; a superseded KDR's Status cell is updated when the superseding KDR lands.

## Writing guidance

- **Length**: one to two pages (roughly 200-500 words of body). A KDR is a decision record, not a design document.
- **Voice**: active, present tense. "This island adopts X" not "X was adopted" or "X should be adopted".
- **Scope**: one decision per KDR. If a decision has multiple independently reconsidered parts, split them.
- **Immutability**: once `Accepted`, a record is never edited for content — only the Status line changes. Typo fixes are acceptable;
  rewording the Decision is not.
- **Chaining**: the Consequences of one KDR become the Context of the next. Write each as if handing off to a future author.
- **Language**: follow the island's language convention (British English for KI islands).
