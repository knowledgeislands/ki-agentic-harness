# Design document format — as at 2026-11-08T21:02:41Z

Base: ki-agentic-harness@ce761f924 (8 November 2026, 21:02 GMT)

Touches: `skills/governance/ki-authoring/references/standards-knowledge-promotion.md`, `skills/change-management/ki-coordination/references/standards-decisions.md`, `skills/change-management/ki-work-design/references/standards-work-design.md`, `skills/governance/ki-work-package/references/standards-work-package.md`

## Contents

- [1. Introduction](#1-introduction)
- [2. Scope](#2-scope)
  - [2.1 In scope](#21-in-scope)
  - [2.2 Out of scope](#22-out-of-scope)
- [3. Terms and definitions](#3-terms-and-definitions)
- [4. Outline](#4-outline)
  - [4.1 Document types](#41-document-types)
  - [4.2 Ownership](#42-ownership)
  - [4.3 Base and rebase](#43-base-and-rebase)
- [5. Example](#5-example)
- [6. Changes](#6-changes)
- [7. Open](#7-open)
  - [7.1 To decide](#71-to-decide)
  - [7.2 To cover](#72-to-cover)
  - [7.3 Consequences](#73-consequences)

## 1. Introduction

Design note, still in draft, for the design of the Knowledge Islands document types: their base shape and their suffixes. It follows the structure of its companion, [coordinator-reply-format.design.md](coordinator-reply-format.design.md).

Kris took two decisions at 22:05 CET on 8 November 2026, relayed by `personal.reg.inbox`. Under DOC-TYPES a there are two document types only: the **change document** (`.change.md`), which carries the design outline and a planning section, as in this format, and the **standard**. There is no separate design type: a design note becomes a change document. Under STD-BASE a every change document carries `Base: ki-agentic-harness@<commit>` and a `Touches:` line listing the standard files it changes, with no version numbers and no per-file hashes. Both now stand in `ki-authoring`'s [document types](../../../../skills/governance/ki-authoring/references/standards-knowledge-promotion.md#document-types). This note is itself a change document under the new rule; like every existing `.design.md` file, it keeps its name through the rollout.

[Back to contents](#contents)

## 2. Scope

### 2.1 In scope

- The **change document** (`.change.md`): its base shape, the sections every change document has, in order, its suffix and its `Base:` and `Touches:` header.
- The **standard**, as the second document type and the one a change document changes.
- Which standard owns the types, and how a producing skill declares that its document is formed on a type and what it adds.

### 2.2 Out of scope

- Run briefs and run reports: under DOC-TYPES they are not document types, and their owning skills keep their shapes.
- Where the files live in a work package: `ki-work-package` keeps that.
- Chat replies: the [coordinator reply format](coordinator-reply-format.design.md) governs those.
- The five package files, `_index.md`, `state.md`, `discussions.md`, `messages.md` and `decisions.md`.

[Back to contents](#contents)

## 3. Terms and definitions

| Term | Definition |
| --- | --- |
| **Document type** | A kind of durable Markdown document with a fixed base shape: the change document or the standard. **Standard:** `ki-authoring` [document types](../../../../skills/governance/ki-authoring/references/standards-knowledge-promotion.md#document-types) |
| **Change document** | A `.change.md` file proposing a change to one or more standards: the design outline and a planning section. **Standard:** `ki-authoring` [document types](../../../../skills/governance/ki-authoring/references/standards-knowledge-promotion.md#document-types) |
| **Base** | The `Base: ki-agentic-harness@<commit>` header line naming the harness commit the document was written against. **Standard:** `ki-authoring` [document types](../../../../skills/governance/ki-authoring/references/standards-knowledge-promotion.md#document-types) |
| **Touches** | The `Touches:` header line listing the standard files the document changes. **Standard:** `ki-authoring` [document types](../../../../skills/governance/ki-authoring/references/standards-knowledge-promotion.md#document-types) |
| **Base shape** | The sections every document of a type has, in order. **Standard:** None yet; proposed in this design at [open point 5](#71-to-decide) |
| **Producing skill** | A skill that writes documents of a type, such as `ki-work-design` writing change documents. **Standard:** None yet; defined in this design at [4.2 Ownership](#42-ownership) |
| **Additive part** | A section or rule a producing skill adds on top of the base shape. **Standard:** None yet; defined in this design at [4.2 Ownership](#42-ownership) |

> **Deltas**
>
> - **Agreed** [change 2](#6-changes) · [change 5](#6-changes): the two types, the change document's suffix and its `Base:` and `Touches:` header.
> - **Open** [5](#71-to-decide) · [change 3](#6-changes): the base shape every change document shares.

[Back to contents](#contents)

## 4. Outline

### 4.1 Document types

| Type | Suffix | Where it is named or shaped |
| --- | --- | --- |
| Change document | `<slug>.change.md` | `ki-authoring` (the type and its header); `ki-work-design` (life cycle: draft, review, graduation, deletion); `ki-coordination` (guards for pruning); `ki-work-package` (where it lives) |
| Standard | `standards-<topic>.md` in a skill's `references/` | `ki-authoring` (the type); `ki-skills` (where a skill keeps its standards) |

A `.design.md` design note stays readable as a change document through the rollout and is not renamed.

> **Deltas**
>
> - **Agreed** [change 2](#6-changes) · [change 4](#6-changes): two types, the change document and the standard; the design note becomes a change document.
> - **Open** [4](#71-to-decide): the change document's life cycle stays with `ki-work-design`.

### 4.2 Ownership

- `ki-authoring` owns each type and the change document's header.
- Each producing skill states which type it writes and lists its additive parts.

> **Deltas**
>
> - **Agreed** [change 1](#6-changes): `ki-authoring` owns the types.
> - **Consequence** [1](#73-consequences): producing skills are reduced to a pointer and their additive parts.

### 4.3 Base and rebase

- The change document opens with its title, then `Base: ki-agentic-harness@<commit>` and a `Touches:` line listing each standard file it changes by its repository path.
- There are no version numbers and no per-file hashes.
- To rebase, read `git diff <base>..main -- <touched files>`, update the document to match, then move `Base:` to the new commit.

> **Deltas**
>
> - **Agreed** [change 5](#6-changes): the header and the rebase procedure.
> - **Consequence** [5](#73-consequences): a moved-since-base check.

[Back to contents](#contents)

## 5. Example

The first change document is `personal.reg.inbox`'s `coordination/coordination.change.md` in Personal Inbox, at revision `abc3a70e`: a title line, `Status:`, `Base: ki-agentic-harness@dfd9d413a` and a `Touches:` line naming three standard files, then Introduction, Scope, Terms, Outline, Changes, Steps and Open, with Steps as its planning section in place of this format's Example.

[Back to contents](#contents)

## 6. Changes

| # | Where | Today | Change | Status |
| --- | --- | --- | --- | --- |
| 1 | [Ownership](#42-ownership) | Shapes restated across four skills | One owner, `ki-authoring`; skills add only their own parts | Agreed (DOC-TYPES) |
| 2 | [Suffix](#41-document-types) | `.design.md` a convention | `.change.md`, the change document's suffix | Agreed (DOC-TYPES) |
| 3 | [Base shape](#3-terms-and-definitions) | No shared shape for a change document | Seven numbered sections with Contents, Deltas call-outs and back links, as both designs use, with a planning section | Proposed (point 5) |
| 4 | [Name](#41-document-types) | _Design note_ in the standards, _design document_ in this design's name | _Change document_ in standards and file names | Agreed (DOC-TYPES) |
| 5 | [Base and rebase](#43-base-and-rebase) | No record of what a design was written against | `Base:` and `Touches:` header lines and the rebase procedure | Agreed (STD-BASE) |

[Back to contents](#contents)

## 7. Open

Three kinds of point: to decide, to cover and consequences. Those to cover and the consequences are a firm commitment for the next round.

### 7.1 To decide

1. **Owner:** settled. `ki-authoring` owns the types, as DOC-TYPES and STD-BASE were placed on 8 November 2026. **From:** [4.2](#42-ownership).
2. **Which types:** settled by DOC-TYPES a on 8 November 2026: the change document and the standard, only. **From:** [4.1](#41-document-types).
3. **Report and the owner report:** no longer open. Under DOC-TYPES the report is not a document type, so the owner report stays with `ki-coordination`. **From:** [4.1](#41-document-types).
4. **Change document's life cycle:** whether it stays with `ki-work-design`, with only the type and header moving. Recommended, high confidence: the life cycle stays; only the type and header move. **From:** [4.1](#41-document-types).
5. **Change document's base shape:** the seven sections both these designs share, Introduction, Scope (In scope, Out of scope), Terms and definitions, Outline, Example, Changes, and Open (To decide, To cover, Consequences), with a planning section such as Steps beside or in place of Example, as the first change document has it, and with a **Deltas** call-out, a quote block holding a bulleted list. Each bullet opens with a prefix that links forward: **Agreed** to its row in Changes, **Open** to its point in To decide (with the proposed change row beside it), and **Consequence** to its item in Consequences; each link names the item's number and points at its section, since plain Markdown has no per-item anchors. Links run back as well: each row in Changes links its Where to the element it changes, and each point in To decide and each item in Consequences ends with a **From:** link to the elements it concerns. The call-out sits at the end of each lowest-level section, one with no subsections of its own, that has something agreed, open or consequential; a section with none of these has no call-out. A change to a section as a whole, such as its structure, goes in a call-out straight after that section's lead-in, the one thing besides the lead-in allowed before its first subsection; and a design for something wholly new has none. A section with subsections holds nothing outside them but a short lead-in paragraph: no table, list or call-out before its first subsection. The same holds at every level: a subsection with its own subsections, `4.1.1`, holds only a lead-in before them. Sections and subsections are numbered, `2.`, `2.1` and `2.1.1`, so their level is clear in any viewer. The document opens with its title, its `Base:` and `Touches:` lines and a **Contents** list linking every section and subsection, and each section ends with a **Back to contents** link. In Terms and definitions, a two-column table, Term and Definition, each definition ending with a `**Standard:**` line linking the standard that defines it, or saying there is none yet. Proposed as the change document's base shape; both designs already use it. **From:** [3](#3-terms-and-definitions).
6. **Name:** settled by DOC-TYPES a on 8 November 2026: _change document_, suffix `.change.md`. **From:** [4.1](#41-document-types).

### 7.2 To cover

- Front matter: whether each type carries any, and which fields, beyond the change document's `Base:` and `Touches:` lines.
- Checks: rubric items that test a document against its type.

### 7.3 Consequences

1. **Producing skills reduced.** At graduation, each producing skill's text becomes a pointer to its type plus its additive parts. **From:** [4.2](#42-ownership).
2. **Brief and report formats.** No longer a consequence: under DOC-TYPES neither is a document type, and their owning skills keep their shapes. **From:** [2.2](#22-out-of-scope).
3. **Run report as a report.** No longer a consequence, for the same reason. **From:** [open point 3](#71-to-decide).
4. **Plan format.** A wider follow-up: survey the plan formats AI systems produce today, such as Claude Code's plan mode, Codex's plan steps and ChatGPT's plans, and set the change document's planning section on them or additive to them, so a plan an LLM writes needs only our additive parts rather than a rewrite. Its fit with the `ki-plan` work-record readiness is part of that work. **From:** [open point 2](#71-to-decide).
5. **Moved-since-base check.** A check, for `ki.sop.tools`, that reports a change document whose touched files have changed on `main` since its `Base:`. **From:** [4.3](#43-base-and-rebase).

[Back to contents](#contents)
