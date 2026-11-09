---
type: standard@2026-11-09T21:36:32Z
revised: 2026-11-09T21:36:32Z
status: in force
---

# Change format

## Contents

- [1. Introduction](#1-introduction)
- [2. Scope](#2-scope)
  - [2.1 In scope](#21-in-scope)
  - [2.2 Out of scope](#22-out-of-scope)
- [3. Terms and definitions](#3-terms-and-definitions)
- [4. Rules](#4-rules)
  - [4.1 Front matter](#41-front-matter)
  - [4.2 Inputs and outputs](#42-inputs-and-outputs)
  - [4.3 Shape](#43-shape)
  - [4.4 Naming](#44-naming)
  - [4.5 Landing](#45-landing)
  - [4.6 Validation](#46-validation)

## 1. Introduction

What a change document is: a proposal to change one or more standards, or how work is done, with its design outline and a planning section. It follows the [format format](standard-formats-format.md). The decisions behind these rules are in [the sources file](sources.md).

[Back to contents](#contents)

## 2. Scope

The format of a change document, from its front matter to its last section, and what happens to it when it lands.

### 2.1 In scope

- A change document's front matter, status values, inputs and outputs.
- Its shape, Deltas call-outs, links and Changes table.
- How it is named, how it lands, and what a validator checks.

[Back to contents](#contents)

### 2.2 Out of scope

- What every type of document shares: the [format format](standard-formats-format.md).
- A change document's life cycle, from draft to deletion: `ki-work-design`.
- Where a change document is kept: whoever keeps it says.

[Back to contents](#contents)

## 3. Terms and definitions

| Term | Definition |
| --- | --- |
| **Change document** | A proposal to change one or more standards, or how work is done: its design outline and a planning section. **Standard:** this one, [1](#1-introduction) |
| **Deltas call-out** | A quote block at the end of a section listing what the section changes, leaves open or causes, each linking forward. **Standard:** this one, [4.3](#43-shape) |
| **Question** | A point to be settled before the change is agreed. **Standard:** this one, [4.5](#45-landing) |
| **Gap** | Something the change knowingly leaves uncovered, accepted by the time it is agreed. **Standard:** this one, [4.5](#45-landing) |
| **Consequence** | Work the change causes beyond its own outputs. **Standard:** this one, [4.5](#45-landing) |
| **Landing** | Carrying an agreed change's content into its outputs, with each gap and consequence given a home outside them. **Standard:** this one, [4.5](#45-landing) |

[Back to contents](#contents)

## 4. Rules

The rules, part by part.

### 4.1 Front matter

```yaml
---
type: change@<version ref of standard-formats-change.md>
revised: 2026-11-09T21:36:32Z
status: <one of the values below>
inputs:
  - <organisation>/<repository>@<version ref>
  - <organisation>/<repository>:<path>@<version ref>
  - <file>@<version ref>
outputs:
  - <organisation>/<repository>:<path, wildcards allowed>
---
```

`status` takes one of these values:

| Status | Meaning |
| --- | --- |
| `draft` | Being written; not ready for anyone to review. |
| `review` | Ready for its owner to go through, section by section. |
| `agreed` | Accepted by its owner; nothing is acted on until rollout starts. |
| `rolling out` | Its steps are being carried out. |
| `on hold` | Paused, with the reason given in the Introduction. |
| `done` | Its steps are carried out and its changes landed. |
| `replaced` | Overtaken by another change, linked from the first line of its Introduction. |

A short status line may open the Introduction where it helps a reader, but the front matter is the record.

[Back to contents](#contents)

### 4.2 Inputs and outputs

- **`inputs`** lists what the change was written against, each with its version ref: a whole repository, `<organisation>/<repository>@<version ref>`, meaning it was considered as a whole; a file within one, `<organisation>/<repository>:<path>@<version ref>`, pointing out something that specifically informs the change; or another change document, `<file>@<version ref>`, the ref being its `revised` when read. An input outside Git takes a date as its version ref, or its URL where it has one.
- **`outputs`** lists every file the change writes, standards or code, as `<organisation>/<repository>:<path>`; a path may use wildcards, such as `knowledgeislands/tools-ki:src/agent/**`. A file the change edits is also an input; a file it creates is an output only.
- **A moved input does not block.** If an input has moved on by the time the change is acted on, what changed since its ref is taken into account, each Before in Changes is checked against the new version and corrected, and the ref moves up to it.
- **Out of date.** A change whose input names an older version than its current one is out of date, as for `type` in the format format; it is brought into line when next acted on.

[Back to contents](#contents)

### 4.3 Shape

1. **Sections:** 1 Introduction, 2 Scope (2.1 In scope, 2.2 Out of scope), 3 Terms and definitions, 4 Outline, 5 Steps, 6 Changes, 7 Open (7.1 Questions, 7.2 Gaps, 7.3 Consequences).
2. **A section with subsections** may also hold the call-out for a change to the section as a whole, straight after its lead-in.
3. **Deltas call-out** at the end of each lowest-level section that changes, leaves open or causes something: a quote block of bullets, each opening **Change** (its row in Changes), **Open** (its question), **Gap** (its item in Gaps) or **Consequence** (its item in Consequences), naming the item's number and linking to its list, not the single item.
4. **Links back:** each row in Changes names in Where the output file and section it changes, and links to the section of this document it comes from; each question, gap and consequence ends with a **From:** link.
5. **Terms and definitions** is a two-column table of concepts, not front matter fields, each definition ending with a **Standard:** line naming the standard that defines it, or saying none yet.
6. **Changes** is a numbered table: number, Where, Before, After. Each row is a change to an output: Before is what the output says at its input ref, After what it will say once the change lands. Rows carry no status: the table may change during review like the rest, and is agreed with the whole.
7. **New and changed outputs.** For a new document, Steps say where it will live and what it takes to put it there, and Changes has one row: Before is None, After is the new document at its path. For a changed document, Steps say where it lives and what happens to it, such as edits, a move, a split or a rename, and Changes has a row for each change.
8. **Refinements are edits, not changes.** Improving the document's own wording or ideas during review leaves no trace in it; Git history keeps it.
9. **No names or dates on agreements:** Git history records who agreed what, and when. A date stays where it is itself content, such as a decision quoted from elsewhere.
10. **Scope and Gaps do not repeat each other.** Out of scope sets the boundary and may link to a gap; Gaps holds the detail.

[Back to contents](#contents)

### 4.4 Naming

A change document uses the suffix pattern, `[<name>.]change.md`. Where several are taken in order, their names are prefixed `NN-`, numbered in tens by group with gaps for new ones; a change split in two keeps its name, the second phase adding `-2`.

[Back to contents](#contents)

### 4.5 Landing

- **Open fills** while a change is in `draft` and `review`, and empties as it moves on. A gap may be raised as a question and answered: either the change comes to cover it, or it is accepted as a known gap.
- **By `agreed`,** Questions is None, and every gap left is accepted by that status, with no marker.
- **Before `done`,** each consequence and gap gets a home outside the standard, chosen by whatever manages the change: a step in this change if it is done in the rollout, or otherwise a record or a new change wherever that work keeps them. A home may lie ahead, and the item links forward to it. A link to its home then replaces the item, so by `done`, Gaps and Consequences are None too.
- **Nothing from Open is written into a standard,** which stands complete within its scope.

[Back to contents](#contents)

### 4.6 Validation

Beyond the format format's checks, a validator checks:

1. **Front matter:** every field is present, and `status` is one of the seven values.
2. **Open against status:** an `agreed` change has no questions left; a `done` change has Gaps and Consequences of None.
3. **Inputs:** an input that has moved past its version ref is reported, asking for each Before to be checked against the new version; it does not block.
4. **Shape:** the seven sections and Deltas call-outs are present, and links run both ways.
5. **Portable:** the parts that land, the Outline and each After, refer to no other change document, nothing still to come, and no particular package, session, person or process, unless the change is about that thing; such references belong in the Introduction, Steps and Open.

[Back to contents](#contents)
