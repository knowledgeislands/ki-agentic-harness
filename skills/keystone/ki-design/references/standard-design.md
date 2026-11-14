---
type: standard@2026-11-14T03:31:09Z
revised: 2026-11-14T03:31:09Z
status: in force
---

# Design standard

## Contents

- [1. Introduction](#1-introduction)
- [2. Scope](#2-scope)
  - [2.1 In scope](#21-in-scope)
  - [2.2 Out of scope](#22-out-of-scope)
- [3. Terms and definitions](#3-terms-and-definitions)
- [4. Rules](#4-rules)
  - [4.1 What design covers](#41-what-design-covers)
  - [4.2 How a design is shaped](#42-how-a-design-is-shaped)
  - [4.3 Each kind's levels](#43-each-kinds-levels)
  - [4.4 Where a design is written down](#44-where-a-design-is-written-down)

## 1. Introduction

How a design of any kind is shaped in Knowledge Islands, before Authoring's skills write it down, and which skill takes each kind. The decisions behind it are in [the sources file](sources.md#3-decisions).

[Back to contents](#contents)

## 2. Scope

The shaping of a design, technical or visual, from its brief to the choices it settles.

### 2.1 In scope

- What the Design guild covers.
- The brief, the options and the review every design goes through.
- Each kind of design's levels, and who holds them.
- Where a design's choices are written down.

[Back to contents](#contents)

### 2.2 Out of scope

- How a repository keeps its interface design, the three visual levels and the component library: `ki-design-system`.
- Shaping a Project, theme or model before any work exists: `ki-work design`.
- The forms of decision records, specifications and diagrams: Authoring's skills.

[Back to contents](#contents)

## 3. Terms and definitions

| Term | Definition |
| --- | --- |
| **Design** | The shaping of something before it is built: what it is made of, how its parts fit and, for an interface, how it looks and behaves. **Standard:** this one, [4.1](#41-what-design-covers) |
| **Brief** | What a design is for, what it must satisfy and what it leaves out, agreed before any option is drawn. **Standard:** this one, [4.2](#42-how-a-design-is-shaped) |
| **Level** | One grain at which a kind of design is drawn, agreed before the finer one, as information architecture comes before a wireframe. **Standard:** this one, [4.3](#43-each-kinds-levels) |

[Back to contents](#contents)

## 4. Rules

The rules, part by part.

### 4.1 What design covers

The Design guild covers all design, technical as well as visual (DESIGN-LEAD). An information architect is one kind of architect, and a technical architect sits beside them. `ki-design` leads the guild; `ki-design-system` is its member for visual design and `ki-design-inspiration` for visual references. Technical design stays in the lead until it needs a member of its own (DESIGN-AUTHORING).

[Back to contents](#contents)

### 4.2 How a design is shaped

Every design goes through the same three steps, whatever its kind (DESIGN-AUTHORING):

1. **The brief.** What the design is for, what it must satisfy and what it leaves out, written and agreed before any option is drawn. The names already in use, in code or in the work, are read first.
2. **The options.** More than one way to meet the brief, each with what it costs, and the one recommended marked, so the choice is the owner's.
3. **The review.** A second reader checks the chosen design against the brief and the governing standard before it is called final, and says what has not been checked.

Rubric **DESIGN-1** to **DESIGN-3** review it.

[Back to contents](#contents)

### 4.3 Each kind's levels

Each kind of design is drawn at levels, each finer than the last, and a coarser level is agreed before the finer one is drawn, because a change costs least at the coarsest level.

- **Visual design** has three: information architecture, wireframes and mock-ups, held by `ki-design-system` (DESIGN-LEVELS).
- **Technical design** has its levels written here once they are settled; until then a technical design names the grain it is drawn at in its brief.

Rubric **DESIGN-4** reviews it.

[Back to contents](#contents)

### 4.4 Where a design is written down

Design shapes; Authoring writes down (DESIGN-AUTHORING). Each choice a design settles becomes a decision record under `ki-decision-records`; an accepted design becomes a specification under `ki-specs`; an architecture is drawn under `ki-diagrams`. `ki-design-system` already keeps its design specifications and decision records in Authoring's forms. A Project's shape, before any work exists, is `ki-work design`'s. Rubric **DESIGN-5** reviews it.

[Back to contents](#contents)
