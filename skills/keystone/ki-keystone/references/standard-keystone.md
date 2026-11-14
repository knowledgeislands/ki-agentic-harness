---
type: standard@2026-11-14T03:22:59Z
revised: 2026-11-14T03:22:59Z
status: in force
---

# Keystone standard

## Contents

- [1. Introduction](#1-introduction)
- [2. Scope](#2-scope)
  - [2.1 In scope](#21-in-scope)
  - [2.2 Out of scope](#22-out-of-scope)
- [3. Terms and definitions](#3-terms-and-definitions)
- [4. Rules](#4-rules)
  - [4.1 The joining rule](#41-the-joining-rule)
  - [4.2 One lead for each guild](#42-one-lead-for-each-guild)
  - [4.3 The guild map](#43-the-guild-map)
  - [4.4 Where a session starts](#44-where-a-session-starts)

## 1. Introduction

What the Keystone guild holds and how its lead, `ki-keystone`, keeps the guild tree of a skill collection: who joins Keystone, how each guild is led, the guild map, and where a session starts. What a guild and a lead are, and how membership is declared, is `ki-skills`' [guilds standard](../../ki-skills/references/standard-guilds.md). The decisions behind these rules are in [the sources file](sources.md#3-decisions).

[Back to contents](#contents)

## 2. Scope

The Keystone guild, and the guild tree of any skill collection organised into guilds.

### 2.1 In scope

- Who may join Keystone.
- One lead for each guild, and every lead in Keystone.
- The guild map: what it shows, where it is held and how it is made.
- Where a session starts in a repository.

[Back to contents](#contents)

### 2.2 Out of scope

- What a guild, a lead and a member are, names and prefixes, and membership keys: `ki-skills`' [guilds standard](../../ki-skills/references/standard-guilds.md).
- A harness's published skills catalogue: `ki-repo-backpack`.
- Which members a guild has and when to use each: each guild's lead.

[Back to contents](#contents)

## 3. Terms and definitions

| Term | Definition |
| --- | --- |
| **Guild** | A set of skills that belong together and work together, led by one lead skill; `ki-agentic-systems`' [guild card](../../ki-agentic-systems/knowledge/system/system.guild.md) says what it is. **Standard:** `ki-skills`' [guilds standard](../../ki-skills/references/standard-guilds.md) |
| **Keystone** | The guild of guilds: what every other guild rests on, and each guild's lead. **Standard:** this one, [4.1](#41-the-joining-rule) |
| **Skill collection** | The skills a repository holds under its `skills/` folder, at any depth of guild folders. **Standard:** this one, [4.2](#42-one-lead-for-each-guild) |
| **Guild map** | Each guild with its lead and members, generated from the skills' frontmatter. **Standard:** this one, [4.3](#43-the-guild-map) |

[Back to contents](#contents)

## 4. Rules

The rules, part by part.

### 4.1 The joining rule

A skill joins Keystone only when it leads a guild, or when every guild rests on it, as `ki-skills` and `ki-knowledge-graph` do (KEYSTONE-MIN). A skill that serves one guild joins that guild, however widely it is used, and Keystone never becomes a dumping ground. `ki-keystone` leads Keystone and is its one exception at the top; there is no deeper hierarchy (KEYSTONE-HUB). Rubric **KEYSTONE-4** reviews it.

[Back to contents](#contents)

### 4.2 One lead for each guild

Once any skill in a repository's `skills/` collection declares a guild, every skill there declares one (GUILD-PLACE). Every guild a skill declares or leads has exactly one lead, and every lead is a member of Keystone, so Keystone lists the leads and each guild opens from its lead (GUILD-LEAD, KEYSTONE-HUB). Rubric **KEYSTONE-1** and **KEYSTONE-2** check it, and the harness's capability publication checks the same of the collection it publishes.

A lead discloses its guild as the guilds standard sets out: a line of purpose, and each member once with when to use it. Rubric **KEYSTONE-5** reviews it.

[Back to contents](#contents)

### 4.3 The guild map

`ki-keystone` holds the guild map in its SKILL.md, between the `ki-keystone:guild-map` markers: each guild, Keystone first and the rest by name, with its lead and its members, rendered from every skill's `ki-guild` and `ki-leads` and never written by hand (KEYSTONE-SKILL). `ki dev skill generate ki-keystone` renders it, and rubric **KEYSTONE-3** checks the committed map against the frontmatter. Each guild's purpose, in a line, is written beside the map in the same SKILL.md, because frontmatter carries no purpose.

The harness's published catalogue, in its `skills/README.md`, stays with `ki-repo-backpack` and groups every skill by the same declared guild; the guild map is the short form a session reads first.

[Back to contents](#contents)

### 4.4 Where a session starts

A session in a repository starts with `ki-repo`, for the repository and the skills it declares; `ki-authoring`, for anything written down; and `ki-agentic-systems`, for the words (KEYSTONE-SKILL). `ki-keystone` names all three, and from there a session finds the guild and lead for its work in the guild map.

[Back to contents](#contents)
