# ADR format standard

The quotable standard behind [the rubric](audit-rubric.md) and [`../scripts/audit-adrs.ts`](../scripts/audit-adrs.ts). Grounded in Michael
Nygard's original 2011 format (see [sources](sources.md)) with one house addition (`## References`). Mode REFRESH re-reads the sources and
proposes diffs here.

## Naming convention

```text
ADR-<SCOPE>-NNN
```

- **`ADR-`** is the fixed prefix.
- **`<SCOPE>`** is one or more uppercase alpha-leading segments separated by `-`. Scope is open — there is no fixed enumeration. KI repos
  use `KI` as the first segment by convention (e.g. `KI-HARNESS`, `KI-MCP`, `KI-HARNESS-SKILLS`). A scope segment matches `[A-Z][A-Z0-9]*`;
  a digit-only segment is invalid as a scope segment (it would be ambiguous with the serial).
- **`NNN`** is a zero-padded decimal serial (≥ 3 digits). It is monotonically increasing within its `ADR-<SCOPE>` namespace, never
  reassigned, never reused — even if an ADR is superseded, its number is retired.

Examples: `ADR-KI-HARNESS-001`, `ADR-KI-MCP-003`, `ADR-KI-HARNESS-SKILLS-002`.

Filename: `ADR-<SCOPE>-NNN.md`. Stored in `docs/decisions/` by default; a repo may choose a different path and pass it to the checker.

## Sections

Every ADR has exactly these sections, in this order:

### 1. Title (heading)

```markdown
# ADR-<SCOPE>-NNN: <Short noun phrase>
```

The title is a short noun phrase — not a question, not a full sentence. The heading must reproduce the full ADR ID as its prefix so a reader
can identify the record from the heading alone.

### 2. Status and Date (bold fields, immediately after the heading)

```markdown
**Status:** Proposed | Accepted | Deprecated | Superseded by ADR-<SCOPE>-NNN

**Date:** YYYY-MM-DD
```

These are freestanding bold-key lines, not a table or code block. `**Date:**` records when the status last changed (not the creation date).
Valid Status values:

| Value                 | Meaning                                                                   |
| --------------------- | ------------------------------------------------------------------------- |
| `Proposed`            | Under discussion; stakeholders have not yet agreed                        |
| `Accepted`            | Agreed upon and in effect — **do not modify the body; supersede instead** |
| `Deprecated`          | The approach is being phased out but not replaced by a single successor   |
| `Superseded by ADR-…` | Replaced by the named ADR; include the full ID of the successor           |

When an ADR is superseded: (1) update its Status to `Superseded by ADR-<SCOPE>-NNN`; (2) add a `Supersedes ADR-<SCOPE>-NNN` line in the
successor's Status block or References section. Both records are retained — the history is the point.

### 3. `## Context`

The forces at play — technological, organisational, political, temporal — that made a decision necessary. Write in value-neutral language:
state facts, not advocacy. Avoid "we need to" or "the problem is"; prefer "the system currently…" or "two approaches exist…". One to three
paragraphs. The reader of a future ADR will use this section as the context for their own record.

### 4. `## Decision`

The team's response to those forces. One paragraph or a short bulleted list. Written in active voice: "We will…" or "The project adopts…".
Not rationale — just what was decided. Rationale belongs in Context (the forces) and Consequences (the trade-offs).

### 5. `## Consequences`

The resulting context after the decision is applied — positive outcomes, trade-offs, and neutral follow-on constraints. Keep it factual.
Consequences from one ADR frequently become the Context for the next; write them with that in mind.

### 6. `## References` (house addition)

```markdown
## References

- [Title](../path/to/doc.md) — one-line note on why it is cited.
```

Optional but expected when the decision codifies an existing standard or cites a prior art source. Relative Markdown links only. Omit the
section entirely if there are genuinely no relevant references (the checker treats its absence as acceptable).

## Template

```markdown
# ADR-<SCOPE>-NNN: <Title>

**Status:** Proposed

**Date:** YYYY-MM-DD

## Context

<The forces at play. Value-neutral. One to three paragraphs.>

## Decision

<What was decided. Active voice. One paragraph or short list.>

## Consequences

<Positive outcomes, trade-offs, and follow-on constraints.>

## References

- [Source title](../path/to/doc.md) — why cited.
```

## Index

`docs/decisions/README.md` (or equivalent) must carry a Markdown table with one row per ADR, ordered by filename:

```markdown
| ID                 | Title                          | Status   | Date       |
| ------------------ | ------------------------------ | -------- | ---------- |
| ADR-KI-HARNESS-001 | [Title](ADR-KI-HARNESS-001.md) | Accepted | 2024-01-01 |
```

The Title cell is a relative link to the ADR file. Status and Date must match the ADR's own fields. A new ADR row is added in filename order
before the ADR is merged; a superseded ADR's Status cell is updated when the superseding ADR lands.

## Writing guidance

- **Length**: one to two pages (roughly 200–500 words of body). An ADR is a decision record, not a design document.
- **Voice**: active, present tense. "We will adopt X" not "X was adopted" or "X should be adopted".
- **Scope**: one decision per ADR. If a decision has multiple parts that could each be independently reconsidered, split them.
- **Immutability**: once `Accepted`, a record is never edited for content — only the Status line changes (to `Deprecated` or `Superseded`).
  Typo fixes are acceptable; rewording the Decision is not.
- **Chaining**: the Consequences of one ADR become the Context of the next. Write each as if handing off to a future author.
