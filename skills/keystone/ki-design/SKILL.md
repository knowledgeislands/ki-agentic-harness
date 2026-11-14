---
name: ki-design
ki-kind: governance
ki-applicability: declaration-only
ki-guild: keystone
ki-leads: design
ki-depends-on: []
ki-shared-dependencies: [ki-skills:rubric]
description: >
  Lead the Design guild: how any design, technical or visual, is shaped before it is written down, from a brief
  through options and review, and each kind's levels. Use to start or review a design, or to find the design skill
  for it; `ki-design-system` owns interface design, `ki-work-design` shaping a Project, and Authoring's skills the
  records a design leaves.
argument-hint: 'audit <repo> | conform <repo> | educate <repo> | help | refresh'
---

# Design

The Design guild covers all design, technical as well as visual: an information architect is one kind of architect, and a technical architect sits beside them. This skill says how a design is shaped, from a brief through options and review, and which member or neighbouring skill takes each kind. [The design standard](references/standard-design.md) holds the rules.

Design shapes; Authoring writes down. Once a choice is made, Authoring's skills record it: a decision record for each choice, a specification once a design is accepted, and diagrams for an architecture.

## Members

- **`ki-design-system`** for interface design: how a repository keeps its tokens, design guide, design specifications and checks, the three levels of visual design (information architecture, wireframes and mock-ups), and the component library.
- **`ki-design-inspiration`** for visual references: curated galleries turned into directions for a website or component.

## Neighbours

- **`ki-work-design`** shapes a Project, theme or model before any work record exists.
- **`ki-decision-records`**, **`ki-specs`** and **`ki-diagrams`** write down the decisions, specifications and diagrams a design leaves.

Technical design stays in this skill until it needs a member of its own.

## Operating modes

For `help`, `-h`, `?` or no recognised mode, explain the guild, how a design is shaped and which skill takes each kind, without changing anything; offer a mode choice only in an interactive session.

### Mode AUDIT

Run `ki repo audit --skill ki-design --repo <repo>`; the host checks the rubric publication. Then review the repository's design work against [the standard](references/standard-design.md): whether each design started from a brief, weighed options, was reviewed, and left its records in Authoring's forms.

### Mode CONFORM

Run AUDIT, then `ki repo conform --skill ki-design --repo <repo> --dry-run`. The host may regenerate the rubric publication; nothing else is changed automatically, because a design's shape is decided, not repaired.

### Mode EDUCATE

Start a design: write the brief, name the kind and the level it starts at, and route visual design to `ki-design-system` and a Project's shape to `ki-work-design`.

### Mode REFRESH

REFRESH writes only in the canonical `ki-agentic-harness` repository; from an installed copy, stop and redirect there. Read [the sources](references/sources.md), compare the standard with the decisions it comes from, then make and verify the smallest correction.
