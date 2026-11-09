---
type: standard@2026-11-09T21:36:32Z
revised: 2026-11-09T21:36:32Z
status: in force
---

# Format format

## Contents

- [1. Introduction](#1-introduction)
- [2. Scope](#2-scope)
  - [2.1 In scope](#21-in-scope)
  - [2.2 Out of scope](#22-out-of-scope)
- [3. Terms and definitions](#3-terms-and-definitions)
- [4. Rules](#4-rules)
  - [4.1 Document types](#41-document-types)
  - [4.2 Front matter](#42-front-matter)
  - [4.3 Version refs](#43-version-refs)
  - [4.4 Shape](#44-shape)
  - [4.5 Naming](#45-naming)
  - [4.6 What each format says](#46-what-each-format-says)
  - [4.7 Validation](#47-validation)

## 1. Introduction

What every type of document shares, and what the format standard for each type must say. Every format standard is an instance of this one, this one included. The decisions behind these rules are in [the sources file](sources.md).

[Back to contents](#contents)

## 2. Scope

The parts every type of document shares.

### 2.1 In scope

- Document types and their format standards.
- The front matter every document carries, and version refs.
- The shape every document shares.
- How documents are named.
- What each format standard says, and what a validator of any format checks.

[Back to contents](#contents)

### 2.2 Out of scope

- What is particular to one type: its own format standard says it.
- Where a document lives: each owner says.

[Back to contents](#contents)

## 3. Terms and definitions

| Term | Definition |
| --- | --- |
| **Document type** | The kind of a document, such as standard, change or sources: the same word in its `type` field and its file name. **Standard:** this one, [4.1](#41-document-types) |
| **Format standard** | The standard that sets how one type of document looks, named `standard-formats-<type>.md`. **Standard:** this one, [4.1](#41-document-types) |
| **Front matter** | The YAML block at the top of a document, holding what is about it rather than in it. **Standard:** this one, [4.2](#42-front-matter) |
| **Version ref** | What follows an `@`: an ISO 8601 date and time in UTC to the second, such as `2026-11-09T08:12:34Z`, or a Git ref, such as a commit hash. **Standard:** this one, [4.3](#43-version-refs) |
| **Change of substance** | An edit that alters what a document says, as against a mechanical one such as reformatting. **Standard:** this one, [4.2](#42-front-matter) |

[Back to contents](#contents)

## 4. Rules

The rules, part by part.

### 4.1 Document types

- **Each type has one word,** such as `standard`, `change` or `sources`, used in its `type` field and its file name.
- **Each type has one format standard,** `standard-formats-<type>.md`, in `ki-authoring`'s `references/`.
- **A format standard not yet agreed** stands at its final path as a draft, with `status: draft`, so that documents of its type have something to name; the agreed standard later replaces it at the same path.

[Back to contents](#contents)

### 4.2 Front matter

Every document opens with front matter, then its title. Every type carries at least:

```yaml
---
type: <type>@<version ref of standard-formats-<type>.md>
revised: 2026-11-09T21:36:32Z
---
```

- **`type`** names the format standard the document follows, at the version it follows. There is no separate format field.
- **`revised`** is the date and time, in UTC to the second, of the document's last change of substance. It must be accurate: it moves with every change of substance, and not with a mechanical edit. A date survives a repository's history being squashed, where a commit would not.
- **The title** is the document's name alone; when it stands is in `revised`.

[Back to contents](#contents)

### 4.3 Version refs

- **Times or commits.** Either kind of version ref may be used where it fits. A commit is exact but has to be checked against its repository; a time is simple and usually enough, and is given to the second, since minutes can collide.
- **Out of date.** A document whose `type` names an older version of its format standard than the current one is out of date. It need not be revised at once: when it is next changed, it is brought into line and its `type` moves up.

[Back to contents](#contents)

### 4.4 Shape

1. **Contents** after the title, linking every section and subsection.
2. **Sections are numbered,** and subsections numbered `4.1`, `4.1.1`, so their level shows in any viewer.
3. **Each section ends** with a **Back to contents** link.
4. **A section with subsections** holds only a short lead-in before them: no table or list.

A format standard sets its type's sections; these four hold for every type.

[Back to contents](#contents)

### 4.5 Naming

Every type names its files by one of two patterns:

- **Suffix:** `[<name>.]<type>.md`, such as `change-format.change.md`, or `change.md` alone.
- **Prefix:** `<type>[-<name>].md`, such as `standard-markdown.md`.

A name is in kebab case, such as `formats-change`. A pattern is a default: a place with good reason to differ may, and says why.

[Back to contents](#contents)

### 4.6 What each format says

A format standard says, for its type:

1. its type word, and which naming pattern it uses;
2. its front matter, adding to `type` and `revised`;
3. its sections and their order;
4. anything it adds to or replaces from this standard;
5. what a validator checks beyond [4.7](#47-validation).

A format standard is itself a standard, so it follows the standard format as well as this one.

[Back to contents](#contents)

### 4.7 Validation

A validator of any format checks:

1. **Front matter:** `type` and `revised` are present, and `type` names a format standard that exists.
2. **Format version:** the version ref in `type` is the current one; if not, the document is reported out of date.
3. **Name:** the file name follows its format's pattern, or the place says why it differs.
4. **Shape:** Contents, numbered sections and Back to contents links are present.

[Back to contents](#contents)
