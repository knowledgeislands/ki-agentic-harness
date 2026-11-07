# Design document format — as at 2026-11-07T14:12:48Z

## Contents

- [1. Introduction](#1-introduction)
- [2. Scope](#2-scope)
  - [2.1 In scope](#21-in-scope)
  - [2.2 Out of scope](#22-out-of-scope)
- [3. Terms and definitions](#3-terms-and-definitions)
- [4. Outline](#4-outline)
  - [4.1 Document types today](#41-document-types-today)
  - [4.2 Proposed ownership](#42-proposed-ownership)
- [5. Example](#5-example)
- [6. Changes](#6-changes)
- [7. Open](#7-open)
  - [7.1 To decide](#71-to-decide)
  - [7.2 To cover](#72-to-cover)
  - [7.3 Consequences](#73-consequences)

## 1. Introduction

Design note, still in draft, for the design of the **design note** as a Knowledge Islands document type: its base shape and its `.design.md` suffix. It is the first of the document types; the brief and the report follow as their own passes. It follows the structure of its companion, [coordinator-reply-format.design.md](coordinator-reply-format.design.md), and changes nothing in any standard yet.

The idea, from that design's follow-ups: one standard, probably `ki-authoring`, owns each document type's base shape and suffix; each skill that produces a document says it is formed on that type and adds only its own parts.

[Back to contents](#contents)

## 2. Scope

### 2.1 In scope

- The **design note** (`.design.md`): its base shape, the sections every design note has, in order, and its file suffix and name.
- The general model the brief and the report will follow: a document type, its owning standard, and a producing skill's additive parts.
- Which standard owns the types, and how a producing skill declares that its document is formed on a type and what it adds.

### 2.2 Out of scope

- The brief's and the report's own shapes: each is a follow-up pass under [7.3 Consequences](#73-consequences).
- Where the files live in a work package: `ki-work-package` keeps that.
- Chat replies: the [coordinator reply format](coordinator-reply-format.design.md) governs those.
- The five package files, `work.md`, `state.md`, `discussions.md`, `messages.md` and `decisions.md`.

[Back to contents](#contents)

## 3. Terms and definitions

| Term | Definition |
| --- | --- |
| **Document type** | A kind of Markdown file with a fixed base shape and suffix: brief, report or design note. **Standard:** None yet; defined in this design at [4.1 Document types today](#41-document-types-today) |
| **Base shape** | The sections every document of a type has, in order. **Standard:** None yet; proposed in this design at [open point 5](#71-to-decide) |
| **Producing skill** | A skill that writes documents of a type, such as `ki-delegation` writing briefs. **Standard:** None yet; defined in this design at [4.2 Proposed ownership](#42-proposed-ownership) |
| **Additive part** | A section or rule a producing skill adds on top of the base shape. **Standard:** None yet; defined in this design at [4.2 Proposed ownership](#42-proposed-ownership) |
| **Suffix** | The part of the file name before `.md` that names the type, such as `.brief`. **Standard:** None yet; defined in this design at [4.1 Document types today](#41-document-types-today) |

> **Deltas**
>
> - **Open** [5](#71-to-decide) · [change 3](#6-changes): the base shape every design note shares.

[Back to contents](#contents)

## 4. Outline

### 4.1 Document types today

| Type | Suffix | Where it is named or shaped today |
| --- | --- | --- |
| Brief | `<run>.brief.md` | `ki-work-package` (focus folder, rubric FOLDER-1); `ki-delegation` (prompt shape, run packet) |
| Report | `<name>.report.md` | `ki-delegation` (a run's final report); `ki-work-package` (where it is homed); `ki-coordination` (the owner report shape) |
| Design note | `.design.md`, by convention only | `ki-work-design` (life cycle: draft, review, graduation, deletion); `ki-coordination` (guards for pruning) |

> **Deltas**
>
> - **Open** [2](#71-to-decide): which types there are.
> - **Open** [3](#71-to-decide): whether the owner report becomes the report's base shape.
> - **Open** [4](#71-to-decide): the design note's life cycle stays put.
> - **Open** [6](#71-to-decide) · [change 2](#6-changes) · [change 4](#6-changes): the suffix, and one name.

### 4.2 Proposed ownership

- `ki-authoring`, or a home of its own, owns each type's base shape and suffix.
- Each producing skill states which type it writes and lists its additive parts.

> **Deltas**
>
> - **Open** [1](#71-to-decide) · [change 1](#6-changes): one owner for each type's shape.
> - **Consequence** [1](#73-consequences): producing skills are reduced to a pointer and their additive parts.

[Back to contents](#contents)

## 5. Example

Not yet: one base shape per type, once the types are agreed.

[Back to contents](#contents)

## 6. Changes

| # | Where | Today | Change | Status |
| --- | --- | --- | --- | --- |
| 1 | [Ownership](#42-proposed-ownership) | Shapes restated across four skills | One owner per type; skills add only their own parts | Proposed (point 1) |
| 2 | [Suffix](#41-document-types-today) | `.design.md` a convention | A defined suffix | Proposed (point 6) |
| 3 | [Base shape](#3-terms-and-definitions) | No shared shape for a design note | Seven numbered sections with Contents, Deltas call-outs and back links, as both designs use | Proposed (point 5) |
| 4 | [Name](#41-document-types-today) | _Design note_ in the standards, _design document_ in this design's name | One name in standards and file names | Proposed (point 6) |

[Back to contents](#contents)

## 7. Open

Three kinds of point: to decide, to cover and consequences. Those to cover and the consequences are a firm commitment for the next round.

### 7.1 To decide

1. **Owner:** `ki-authoring`, which governs how documents are written, or a standard of its own for document types. Recommended, medium confidence: `ki-authoring`, since it already governs how documents are written. **From:** [4.2](#42-proposed-ownership).
2. **Which types:** brief, report and design note; whether findings, run packets or others join them. Recommended, medium confidence: the three now, others joining later by the same model. **From:** [4.1](#41-document-types-today).
3. **Report and the owner report:** whether the owner report's shape, today in `ki-coordination`, becomes the report type's base shape. Recommended, medium confidence: yes, so a run report and an owner report share one base. **From:** [4.1](#41-document-types-today).
4. **Design note's life cycle:** whether it stays with `ki-work-design`, with only the shape moving. Recommended, high confidence: the life cycle stays; only the shape moves. **From:** [4.1](#41-document-types-today).
5. **Design note's base shape:** the seven sections both these designs share, Introduction, Scope (In scope, Out of scope), Terms and definitions, Outline, Example, Changes, and Open (To decide, To cover, Consequences), with a **Deltas** call-out, a quote block holding a bulleted list. Each bullet opens with a prefix that links forward: **Agreed** to its row in Changes, **Open** to its point in To decide (with the proposed change row beside it), and **Consequence** to its item in Consequences; each link names the item's number and points at its section, since plain Markdown has no per-item anchors. Links run back as well: each row in Changes links its Where to the element it changes, and each point in To decide and each item in Consequences ends with a **From:** link to the elements it concerns. The call-out sits at the end of each lowest-level section, one with no subsections of its own, that has something agreed, open or consequential; a section with none of these has no call-out. A change to a section as a whole, such as its structure, goes in a call-out straight after that section's lead-in, the one thing besides the lead-in allowed before its first subsection; and a design for something wholly new has none. A section with subsections holds nothing outside them but a short lead-in paragraph: no table, list or call-out before its first subsection. The same holds at every level: a subsection with its own subsections, `4.1.1`, holds only a lead-in before them. Sections and subsections are numbered, `2.`, `2.1` and `2.1.1`, so their level is clear in any viewer. The document opens with a **Contents** list linking every section and subsection, and each section ends with a **Back to contents** link. In Terms and definitions, a two-column table, Term and Definition, each definition ending with a `**Standard:**` line linking the standard that defines it, or saying there is none yet. Proposed as the design note's base shape; both designs already use it. **From:** [3](#3-terms-and-definitions).
6. **Name: design note or design document.** The standards say _design note_; this design's name says _design document_. One name is chosen and used in both the standards and the file names. Recommended, medium confidence: _design note_, the name the standards already use; the suffix `.design.md` fits either. **From:** [4.1](#41-document-types-today).

### 7.2 To cover

- Front matter: whether each type carries any, and which fields.
- Checks: rubric items that test a document against its type.

### 7.3 Consequences

1. **Producing skills reduced.** At graduation, each producing skill's text becomes a pointer to its type plus its additive parts. **From:** [4.2](#42-proposed-ownership).
2. **Brief and report formats.** The brief and the report get the treatment the design note has had here: a base shape agreed from worked examples, fixed numbered sections, a contents list with back links, and **Deltas** call-outs where a document records a change. Each is worked through as its own pass once the design note's shape is settled. **From:** [2.2](#22-out-of-scope).
3. **Run report as a report.** The coordinator reply format's run report is a report document; its H, B and F parts may become the report type's base shape ([open point 3](#71-to-decide)).
4. **Plan format.** A wider follow-up: survey the plan formats AI systems produce today, such as Claude Code's plan mode, Codex's plan steps and ChatGPT's plans, and set a Knowledge Islands plan standard built on them or additive to them, so a plan an LLM writes needs only our additive parts rather than a rewrite. Its fit with the `ki-plan` work-record readiness is part of that work. **From:** [open point 2](#71-to-decide).

[Back to contents](#contents)
