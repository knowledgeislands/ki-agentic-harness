---
type: standard@2026-11-09T21:36:32Z
revised: 2026-11-09T21:36:32Z
status: in force
---

# Standard format

## Contents

- [1. Introduction](#1-introduction)
- [2. Scope](#2-scope)
  - [2.1 In scope](#21-in-scope)
  - [2.2 Out of scope](#22-out-of-scope)
- [3. Terms and definitions](#3-terms-and-definitions)
- [4. Rules](#4-rules)
  - [4.1 Front matter](#41-front-matter)
  - [4.2 Shape](#42-shape)
  - [4.3 Naming](#43-naming)
  - [4.4 How a change lands](#44-how-a-change-lands)
  - [4.5 Validation](#45-validation)

## 1. Introduction

What a standard is: a document holding rules themselves, in a skill's `references/`, which changes land into. It follows the [format format](standard-formats-format.md), and this standard follows itself. The decisions behind these rules are in [the sources file](sources.md).

[Back to contents](#contents)

## 2. Scope

The format of a standard, and how a change lands into one.

### 2.1 In scope

- A standard's front matter, shape and name.
- How a landed change shows in a standard.
- What a validator checks beyond the format format.

[Back to contents](#contents)

### 2.2 Out of scope

- What every type of document shares: the [format format](standard-formats-format.md).
- Where a standard lives: the placement ladder in `ki-authoring`.
- What any one standard says.

[Back to contents](#contents)

## 3. Terms and definitions

| Term | Definition |
| --- | --- |
| **Standard** | A document holding rules themselves, in a skill's `references/`, which changes land into. **Standard:** this one, [1](#1-introduction) |
| **In force** | The status of a standard whose rules apply. **Standard:** this one, [4.1](#41-front-matter) |
| **Landing** | Carrying an agreed change's content into the standards it outputs. **Standard:** [change format](standard-formats-change.md) |

[Back to contents](#contents)

## 4. Rules

The rules, part by part.

### 4.1 Front matter

```yaml
---
type: standard@2026-11-09T21:36:32Z
revised: 2026-11-09T21:36:32Z
status: <draft or in force>
---
```

- **`status`** is `draft` while the standard stands ahead of the change that sets it, and `in force` once that change lands.
- **There are no inputs or outputs:** a standard is an input others are written against, and its history is in Git.

[Back to contents](#contents)

### 4.2 Shape

1. **Sections:** 1 Introduction, 2 Scope (2.1 In scope, 2.2 Out of scope), 3 Terms and definitions, 4 Rules.
2. **The Introduction** says what the standard governs and links to its skill's sources file, where the decisions behind its rules are kept.
3. **Terms and definitions** is a two-column table of concepts, each definition ending with a **Standard:** line naming the standard that defines it.
4. **Rules** holds the rules, in subsections by topic.
5. **No change parts:** no Steps, Changes, Open or Deltas call-outs; those belong to the change that alters the standard.

[Back to contents](#contents)

### 4.3 Naming

A standard uses the prefix pattern, `standard-<name>.md`.

[Back to contents](#contents)

### 4.4 How a change lands

When a change lands, its Introduction, Scope, Terms and Outline carry into the standard's Introduction, Scope, Terms and Rules. The standard's `revised` moves up, and the change's decisions are recorded in the skill's sources file. Nothing from the change's Open section is written into the standard, which stands complete within its scope.

[Back to contents](#contents)

### 4.5 Validation

Beyond the format format's checks, a validator checks:

1. **Status:** `status` is `draft` or `in force`.
2. **Sections:** the four sections are present, in order, and none of a change's parts.
3. **Sources:** the Introduction links to the skill's sources file.

[Back to contents](#contents)
