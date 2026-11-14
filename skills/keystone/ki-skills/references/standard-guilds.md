---
type: standard@2026-11-14T03:12:34Z
revised: 2026-11-14T03:12:34Z
status: in force
---

# Guilds standard

## Contents

- [1. Introduction](#1-introduction)
- [2. Scope](#2-scope)
  - [2.1 In scope](#21-in-scope)
  - [2.2 Out of scope](#22-out-of-scope)
- [3. Terms and definitions](#3-terms-and-definitions)
- [4. Rules](#4-rules)
  - [4.1 What a guild is](#41-what-a-guild-is)
  - [4.2 Keystone](#42-keystone)
  - [4.3 Names and prefixes](#43-names-and-prefixes)
  - [4.4 Membership](#44-membership)
  - [4.5 How a lead discloses its guild](#45-how-a-lead-discloses-its-guild)
  - [4.6 The guild map](#46-the-guild-map)

## 1. Introduction

How the skills of a Knowledge Islands harness are grouped into guilds, each led by one skill, with Keystone as the guild of guilds. It sits beside [the Knowledge Islands skill standard](standard-knowledge-islands.md), whose skill shape declares the guild keys this standard gives meaning to. The decisions behind these rules are in [the sources file](sources.md#3-decisions); they were settled in the Cairn summit's change 25.

[Back to contents](#contents)

## 2. Scope

What a guild is, how one is led, named and joined, and how a session finds its way from Keystone to the skill it needs.

### 2.1 In scope

- What a guild and a lead skill are.
- Keystone, the guild of guilds, and the rule for joining it.
- How guilds, leads and members are named.
- How membership is declared, and what a skill's folder means.
- How a lead discloses its guild, family leads, and process skills folded into a lead as subcommands.
- The guild map `ki-keystone` holds.

[Back to contents](#contents)

### 2.2 Out of scope

- Skill shape, kind, applicability and dependency composition: [the Knowledge Islands skill standard](standard-knowledge-islands.md).
- Which guild each skill belongs to: each skill's own frontmatter, read into the guild map.
- How a harness repository lays out and publishes its skills: `ki-repo-harness`.

[Back to contents](#contents)

## 3. Terms and definitions

| Term | Definition |
| --- | --- |
| **Guild** | A set of skills that belong together and work together, with one purpose a reader can name, led by one lead skill. **Standard:** this one, [4.1](#41-what-a-guild-is) |
| **Lead skill** | The skill that leads a guild: it says what the guild is for and discloses its other skills as they are needed. Named after its guild. **Standard:** this one, [4.1](#41-what-a-guild-is), [4.5](#45-how-a-lead-discloses-its-guild) |
| **Member** | A skill that declares a guild in its `ki-guild` key. **Standard:** this one, [4.4](#44-membership) |
| **Keystone** | The guild of guilds: what every other guild rests on, and each guild's lead skill. Led by `ki-keystone`. **Standard:** this one, [4.2](#42-keystone) |
| **Family lead** | A member that holds the rules a family of runtime skills shares, as `ki-env-binding` does for its Claude and ChatGPT skills; it leads its family, not a guild. **Standard:** this one, [4.5](#45-how-a-lead-discloses-its-guild) |
| **Subcommand** | A process that runs as a mode of its guild's lead, as `ki-work plan` does, rather than as a skill of its own. **Standard:** this one, [4.5](#45-how-a-lead-discloses-its-guild) |
| **Guild map** | Each guild in a line, with its purpose and its lead, generated from the skills' frontmatter and held by `ki-keystone`. **Standard:** this one, [4.6](#46-the-guild-map) |

[Back to contents](#contents)

## 4. Rules

The rules, part by part.

### 4.1 What a guild is

A guild is a set of skills that belong together and work together, with one purpose a reader can name in a line (GUILD-TERM). Each guild is a tree of skills led by one lead skill, which discloses the rest the way a skill discloses its references: a lead says what the guild is for and names each member with when to use it, and a member is loaded only when it is needed (GUILD-LEAD). A guild is not a layer above skills. Nothing new sits above a skill, a guild stays within what a skill can be, and a skill family's prefix already shows the same grouping on a smaller scale.

Every guild has exactly one lead, and a skill leads at most one guild. A lead may be any kind of skill, a knowledge skill included, as `ki-agentic-systems` leads the Agentic systems guild (AGENTS-GUILD).

[Back to contents](#contents)

### 4.2 Keystone

Keystone is the guild of guilds (KEYSTONE-HUB). Its lead, `ki-keystone`, mostly signposts: it points to each guild's lead. Each guild's lead is a member of Keystone as well as the root of its own guild, so Keystone lists the leads and each guild opens from its lead. `ki-keystone` itself is the one exception, at the top; there is no deeper hierarchy.

Keystone stays minimal (KEYSTONE-MIN). It holds only what every other guild rests on, and never becomes a dumping ground. **The joining rule:** a skill joins Keystone only when it is a guild's lead, or when every guild rests on it, as `ki-skills` and `ki-knowledge-graph` do. A skill that serves one guild joins that guild, however widely it is used. `ki-repo` stays in Keystone, among its best-known skills, and leads the Repository guild (GUILD-PLACE).

[Back to contents](#contents)

### 4.3 Names and prefixes

A guild's lead is named after it, and the guild's prefix is the lead's name: `ki-repo` and `ki-repo-*`, `ki-work` and `ki-work-*` (GUILD-NAMED). A new member of a guild takes the guild's prefix. A member's own family extends the prefix, as `ki-env-binding` and `ki-env-binding-claude` do.

The guilds' names and prefixes are settled:

| Guild | Lead | Prefix |
| --- | --- | --- |
| Keystone | `ki-keystone` | None: its members are leads and what every guild rests on |
| Repository | `ki-repo` | `ki-repo-` |
| Work | `ki-work` | `ki-work-` |
| Agentic systems | `ki-agentic-systems` | `ki-agentic-` (AGENTS-GUILD) |
| Acquire | `ki-acquire` | `ki-acquire-` |
| Environment | `ki-env` | `ki-env-` (ENV-PREFIX) |
| Design | `ki-design` | `ki-design-` (DESIGN-LEAD) |
| Authoring | `ki-authoring` | `ki-authoring-` |

A member named before its guild was settled keeps its name until its guild is reviewed, as `ki-git`, `ki-engineering`, `ki-coordination` and the four writing skills of Authoring do: the prefix is required of new members, and a rename is decided, never assumed. A guild's machine name, the value its members declare, is its name in lower-case kebab case, as `agentic-systems`.

[Back to contents](#contents)

### 4.4 Membership

Membership is declared, never foldered (GUILD-PLACE). Every Knowledge Islands skill names its guild in exact frontmatter, `ki-guild: <guild>`, and a lead also names the guild it leads, `ki-leads: <guild>`. Both keys carry the `ki-` prefix every Knowledge Islands key carries, so neither collides with the Agent Skills specification's (KI-KEYS).

- **A lead is a member of Keystone,** `ki-guild: keystone`, and only `ki-keystone` declares `ki-leads: keystone`.
- **The folder is storage, not structure.** A harness stores its skills in one folder per guild, named by the guild's machine name, with every lead in `keystone/` (GUILD-FOLDERS); tools and readers take membership from the frontmatter, never from the path.
- **A repository-local `ki-self`** belongs to no guild.

The Knowledge Islands skill standard's [skill shape](standard-knowledge-islands.md#42-skill-shape) carries the keys, rubric **KI-SHAPE-22** checks each skill's declaration, and the harness's capability publication checks the collection: every skill declares a guild, every lead is a member of Keystone, and no guild has more than one lead.

[Back to contents](#contents)

### 4.5 How a lead discloses its guild

A lead discloses its guild the way a skill discloses its references: a little at a time, and only as needed.

1. **One line of purpose.** The lead's description and opening say what the guild is for, so a session knows whether it is in the right place.
2. **Its members, each with when to use it.** The lead names each member once, with the request or repository shape that calls for it, and leaves the member's own rules to the member. Where a member is a family's lead, the guild's lead names the family lead, not each runtime skill.
3. **Family leads.** Where runtime skills share rules, a family lead holds them and each runtime skill adds only its runtime's delta, as `ki-env-binding`, `ki-env-housekeeping` and `ki-env-tokenomics` do for their Claude and ChatGPT skills (HOUSEKEEPING-LEAD).
4. **Process skills as subcommands.** Process skills that form one lifecycle become subcommands of their guild's lead, as governance skills already have modes (PROCESS-SUBCOMMANDS): `ki-work next | plan | implement | accept | recap | design`, and `ki-acquire pulse`. `ki-bootstrap` became `ki-keystone bootstrap` the same way (BOOTSTRAP-FOLD).
   - Each subcommand's detail is a reference, `references/mode-<verb>.md`, loaded only when the subcommand is called.
   - A boundary the separate skill kept survives as a rule of its subcommand: `implement` never accepts its own work, and `accept` needs the owner's approval.
   - Not every process folds: one outside a lifecycle stays a skill of its own until its guild is reviewed, as `ki-trade`, `ki-delegation-orca` and `ki-design-inspiration` do.
   - The lead's description must still fire for every way the folded work is asked for, tested with the trigger checks in [the Agent Skills standard](standard-agent-skills.md) before the separate skills go.

[Back to contents](#contents)

### 4.6 The guild map

`ki-keystone` holds the guild map: each guild in a line, with its purpose and its lead, generated from the skills' frontmatter rather than written by hand (KEYSTONE-SKILL). It also names where a session starts in a repository, `ki-repo`, `ki-authoring` and `ki-agentic-systems`, and states Keystone's joining rule, pointing here for the rest of the guild rules. A harness's published skills catalogue groups skills by their declared guild in the same way.

[Back to contents](#contents)
