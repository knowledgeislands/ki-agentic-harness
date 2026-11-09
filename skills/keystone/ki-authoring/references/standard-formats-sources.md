---
type: standard@2026-11-09T21:36:32Z
revised: 2026-11-09T21:36:32Z
status: in force
---

# Sources format

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
  - [4.4 Decisions](#44-decisions)
  - [4.5 Validation](#45-validation)

## 1. Introduction

What a skill's sources file is: the record of the outside specifications and the decisions its standards rest on. It follows the [format format](standard-formats-format.md). The decisions behind these rules are in [the sources file](sources.md).

[Back to contents](#contents)

## 2. Scope

The format of a sources file.

### 2.1 In scope

- A sources file's front matter, shape and name.
- How decisions are recorded, and what happens to one that is superseded.
- What a validator checks beyond the format format.

[Back to contents](#contents)

### 2.2 Out of scope

- What every type of document shares: the [format format](standard-formats-format.md).
- How a skill reviews its outside sources: its REFRESH mode.

[Back to contents](#contents)

## 3. Terms and definitions

| Term | Definition |
| --- | --- |
| **Sources file** | A skill's record of the outside specifications and the decisions its standards rest on. **Standard:** this one, [1](#1-introduction) |
| **Outside source** | A specification or tool outside the harness that a standard follows, reviewed on a cadence. **Standard:** this one, [4.2](#42-shape) |
| **Decision** | A choice behind a rule, given an id when the change that makes it lands. **Standard:** this one, [4.4](#44-decisions) |

[Back to contents](#contents)

## 4. Rules

The rules, part by part.

### 4.1 Front matter

```yaml
---
type: sources@<version ref of standard-formats-sources.md>
revised: 2026-11-09T21:36:32Z
refresh: <kind> · <cadence>
---
```

- **`refresh`** says how the skill's outside sources are reviewed, such as `external-spec · monthly`.
- **A review** that only confirms last-reviewed dates is not a change of substance, so it does not move `revised`.

[Back to contents](#contents)

### 4.2 Shape

1. **Sections:** 1 Introduction, 2 Outside sources (2.1 Authoritative, 2.2 Advisory), 3 Decisions, 4 Last review.
2. **The Introduction** names the standards the file backs.
3. **Outside sources** are tables of Source, Governs or Informs, and Last reviewed: authoritative sources are specifications the standards follow; advisory sources inform judgement only.
4. **Last review** says what the latest review confirmed and what it is watching.

[Back to contents](#contents)

### 4.3 Naming

A sources file uses the suffix pattern, `[<name>.]sources.md`; a skill's own is `sources.md` in its `references/`.

[Back to contents](#contents)

### 4.4 Decisions

- **Decisions** is a table of Id, Decision, Date, Backs and Status: each decision behind the skill's rules, with the standards it backs.
- **A decision gets its id when the change that makes it lands,** an upper-case short name such as `STD-BASE`; a change document carries no ids.
- **A superseded decision** is kept, its Status naming the id that replaced it, not deleted.

[Back to contents](#contents)

### 4.5 Validation

Beyond the format format's checks, a validator checks:

1. **Front matter:** `refresh` is present.
2. **Sections:** the four sections are present, in order.
3. **Decisions:** each id is unique, each Backs names a standard that exists, and each superseded decision names an id that exists.

[Back to contents](#contents)
