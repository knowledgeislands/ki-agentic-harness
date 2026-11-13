---
type: standard@2026-11-09T21:36:32Z
revised: 2026-11-10T02:24:37Z
status: in force
---

# Roles

## Contents

- [1. Introduction](#1-introduction)
- [2. Scope](#2-scope)
  - [2.1 In scope](#21-in-scope)
  - [2.2 Out of scope](#22-out-of-scope)
- [3. Terms and definitions](#3-terms-and-definitions)
- [4. Rules](#4-rules)
  - [4.1 Prime directive](#41-prime-directive)
  - [4.2 Tiers](#42-tiers)
  - [4.3 Role catalogue](#43-role-catalogue)
  - [4.4 Marks](#44-marks)
  - [4.5 Role fields](#45-role-fields)
  - [4.6 Thread line](#46-thread-line)
  - [4.7 Rules of the role model](#47-rules-of-the-role-model)

## 1. Introduction

A role is the job a seat does within a piece of work: what it owns and what it never does. This standard is the one home of the role catalogue, the three tiers, the glyph each role carries, the `role` and `workers` fields that record them, and the thread line a seat closes with. Kris asked for it under STAGE-C-ROLES at 02:30 GMT on 7 November 2026: "land the role catalogue and role glyphs first, end to end", the catalogue in `ki-work-package`, "every role with its tier, a one-line definition (what it owns, what it never does) and its glyph, the one home for what each glyph means". `ki-coordination` uses the thread line in its banner, session names and message senders; it holds no copy of the catalogue. Tolerance for the forms this standard replaces is in [the role migration file](standards-roles-migration.md), which can be deleted whole once the territories have moved. The decisions behind these rules are in [the sources file](sources.md#3-decisions).

[Back to contents](#contents)

## 2. Scope

The roles seats take within work, and how a package and a session record them.

### 2.1 In scope

- The prime directive every role answers to.
- The tiers, the role catalogue and the marks.
- The `role` and `workers` fields.
- The thread line, and the rules of the role model.

[Back to contents](#contents)

### 2.2 Out of scope

- The work package that carries the fields: [the work-package standard](standard-work-package.md).
- The banner, session names and message senders that show the thread line: `ki-coordination`.
- The admission gate, vote and seat folders, which land with the later seat rules.

[Back to contents](#contents)

## 3. Terms and definitions

| Term | Definition |
| --- | --- |
| **Territory** | An island's domain, such as KI, HNR or Personal. **Standard:** `ki-coordination` |
| **Package** | The work itself, named by its work id, such as `ki.prj.agora`; messages route to packages. **Standard:** [the work-package standard](standard-work-package.md) |
| **Seat** | One role taking part in a package; a session holding a package's keys is its seat. **Standard:** this one, [4.4](#44-marks) |
| **Tier** | A level of authority: leaders, managers or makers. **Standard:** this one, [4.2](#42-tiers) |
| **Role** | The job within a tier, one of the catalogue's. **Standard:** this one, [4.3](#43-role-catalogue) |
| **Pack** | A seat's own subagents and background runs; private to the seat. **Standard:** this one, [4.7](#47-rules-of-the-role-model) |
| **Guild** | A set of skills, such as change management, kept by the guildmaster. **Standard:** this one, [4.3](#43-role-catalogue) |
| **Library** | The knowledge base, kept by the librarian. **Standard:** this one, [4.3](#43-role-catalogue) |
| **Thread line** | The one string that names a session's seat. **Standard:** this one, [4.6](#46-thread-line) |

[Back to contents](#contents)

## 4. Rules

The rules, part by part.

### 4.1 Prime directive

Every institution in this model exists to serve its purpose and the people it serves, never to protect its members' standing. Kris's word for this is **ethical**: ethical guilds, as distinct from guilds, as he set it on 6 November 2026 in the [role-catalogue brief](https://github.com/krisb/dotfiles/blob/2fe13be/+/_WORK/personal.reg.household-terra/housekeeping/role-catalogue.brief.md). The test of any rule or role here is that Kris, or a new seat on its first day, can read it, understand it and challenge it without an intermediary.

- **Radical simplicity.** Every rule, role and standard is written so that it can be read, understood and challenged without an intermediary. If a seat cannot understand the rule it is held to, the rule is at fault, and complexity only the incumbent can navigate is a defect.
- **External accountability.** No tier polices itself alone. The guildmaster defines roles but is not their only judge: Kris, and the council for anything crossing territories, may review and overturn. Decisions and their reasons are recorded where anyone can read them, in change documents, standards, messages and Git.
- **Open entry.** A seat is admitted for its demonstrated fit to a role's stated standard, never for seniority, incumbency or sponsorship. An objection in an admission vote names the part of the role's standard that is not met; an objection without a reason does not count.
- **Purpose review.** Every role states its purpose and is reviewed against it. The capture signs are rules that grow, entry that gets harder without the work getting harder, roles that persist with nothing to do and decisions that only favour incumbents. Reserved roles stay reserved until the work calls for them.

[Back to contents](#contents)

### 4.2 Tiers

| Tier | Decides | Reports to |
| --- | --- | --- |
| leaders | Within their territory; matters that cross territories go to the leaders together | Kris, with queries |
| managers | Within standing grants; exceptions go up to the territory's leaders | The territory's leaders |
| makers | Within the hand-off they were given | The seat that handed the work over, never Kris directly |

[Back to contents](#contents)

### 4.3 Role catalogue

Every seat takes exactly one role from this table, and this table is the one place that says what each role glyph means. Role names are singular, and any seat may be one agent or a lead with a pack. Managers may also make. Chancellor, over several libraries, and a guildmaster for each guild are reserved: neither has a glyph until the work calls for it.

| Role | Tier | Glyph | Owns | Never does |
| --- | --- | --- | --- | --- |
| governor | leaders | 🏛️ | Heads one territory: its State of play, priorities, dispatch, the admission of its managers and the queries it brings to Kris; convenes its council | Outranks another territory's governor, decides for another territory, or does its managers' or makers' work |
| councillor | leaders | 🗳️ | A further leader's share of one territory's decisions, by its governor's grant, and its vote in the council and in admissions | Heads the territory, acts outside it, or decides alone what the council holds |
| quartermaster | leaders | 🧰 | The island's tools and MCP servers, kept working, released and accounted for, from its own secondary State of play | Decides how a tool must behave, which is the guild's, heads the territory, or releases without Kris |
| guardian | leaders | 🪨 | The state of every work package in the Cairn store, from `cairn.summit`, the root of its work tree | Does a package's own work, which is its seat's, or acts on a change document before Kris's word |
| warden | managers | ⚒️ | One Project: its package, records, runs and queue, from Ready to delivery awaiting acceptance | Sets priority across Projects, accepts its own delivery, or works outside its Project |
| steward | managers | 📋 | One regular package's standing work, within its standing grants | Takes up Project delivery or territory dispatch, or acts past its grants instead of taking the exception up |
| housekeeper | managers | 🏠 | One machine's health and its match with the declared setup: applies, drift, doctor findings and the installs Kris decides | Changes another machine, or changes the tooling and standards it applies |
| gatekeeper | managers | 🦉 | What comes in and goes out: capture, intake, mail and the packs prepared for Kris | Decides what it carries, or sends anything in Kris's name without his word |
| librarian | managers | 📚 | The library: what knowledge is kept, where, and how it is found | Owns the work the knowledge comes from, or keeps what has a durable home elsewhere |
| guildmaster | managers | ⚖️ | This catalogue and the skills that capture how we work | Judges roles alone, since Kris and the council may overturn it, or builds the tools and does the work its skills govern |
| journeyman | makers | 🐝 | A handed-off unit of general making, reported to the seat that handed it over | Takes work no seat handed it, or reports to Kris directly |
| illustrator | makers | 🎨 | Visual design and its artefacts for a handed-off piece | Takes work no seat handed it, or reports to Kris directly |
| architect | makers | 📐 | Information architecture: the structure, naming and models of a handed-off piece | Takes work no seat handed it, or reports to Kris directly |

Every `<territory>.sop.main` seat is its territory's governor; councillor is kept for any further leader, as Kris took SOP-MAIN-GOVERNOR a) under ROLES-WRITE on 7 November 2026. The quartermaster's seat is `ki.sop.tools`, KI > SoP (tools), a secondary State of play under `ki.sop.main`, as Kris set under QUARTERMASTER-SOP on 7 November 2026: "the actual quartermaster should be ki.sop.tools, and it should live as a leader". The guardian's seat is `cairn.summit`, the root of the Cairn store's work tree: Kris took the role as the agoranomos under AGORANOMOS-ROLE on 10 November 2026, and renamed it the guardian, glyph 🪨, under ROOT-ROLE and THREAD-GLYPH a on 11 November 2026. Each role glyph differs from every other and from the banner's state and line glyphs under `ki-coordination`'s [Banner](../../../change-management/ki-coordination/references/standards-coordination.md#banner).

[Back to contents](#contents)

### 4.4 Marks

Two marks stand in the thread line beside the role glyph. They are not roles and carry no authority of their own.

| Mark | Name | Meaning |
| --- | --- | --- |
| 🔑 | keyholder | The session holding the package's keys: the seat that may write its package and speak for it |
| 🧵 | thread | A session with no role yet, and every background run, which takes no seat and reports to the work it serves |

[Back to contents](#contents)

### 4.5 Role fields

A package records its role and its live seats in its entry file, `_index.md`, as Kris took ROLE-FIELDS a) under ROLES-WRITE on 7 November 2026, the seats moving there with the state under [the work-package standard](standard-work-package.md#45-the-state).

| Field | File | Value |
| --- | --- | --- |
| `role` | `_index.md` | The package's role: one catalogue role. Every package names one |
| `workers` | `_index.md` | A list of the package's live seats, each a mapping with the keys below; absent or empty when no seat is live |

| `workers` key | Requirement | Value |
| --- | --- | --- |
| `role` | required | One catalogue role |
| `tier` | required | The catalogue tier of that role: `leaders`, `managers` or `makers` |
| `since` | optional | UTC time the seat took the package up |
| `status` | optional | `active` or `idle` |
| `listening` | optional | `on` or `off` |

An entry carries nothing else. The seat's name is never stored: it is derived from its role's glyph and the work id, as the [thread line](#46-thread-line) sets out. An entry carries no session address, vendor session id or host, under the work-package standard's [prohibited payloads](standard-work-package.md#416-prohibited-payloads-and-claims), as Kris answered WORKERS-URI on 7 November 2026: "Drop it". A reader that needs to find a seat's live session, such as Cairn, reads the uncommitted machine-local thread binding `~/.local/state/ki/threads/<repository>/<slug>.json`, never the package. The `ki-work-package` rubric's RECORD-2 checks every value against this catalogue, reading the table in [4.3](#43-role-catalogue) at audit time, so the checker holds no copy of it.

[Back to contents](#contents)

### 4.6 Thread line

The thread line is the one string that names a session's seat. It closes every banner under `ki-coordination`'s [Banner](../../../change-management/ki-coordination/references/standards-coordination.md#banner), names the session, ends a bootstrap or re-bootstrap report's `Rename thread:` line and signs every message the seat sends:

```text
thread-line = role-glyph " 🔑 " work-id   ; a session whose seat has a role
            | "🧵 " work-id               ; a session with no role yet, and every background run
role-glyph  = the catalogue glyph of the seat's one role
work-id     = the authoritative id from _index.md
```

Examples: `⚖️ 🔑 ki.reg.guilds`, `🏛️ 🔑 ki.sop.main`, `🏠 🔑 personal.reg.household-sol`, `🦉 🔑 personal.reg.inbox-terra`. The role glyph standing ahead of the work id says the role, so the work id stays the package's own id; a seat address beyond it waits for the seat rules. A background run closes its report with `🧵 <work-id>` of the work it reports to, as Kris took RUN-THREAD-LINE a) under ROLES-WRITE.

The same string appears on each surface:

| Surface | Form |
| --- | --- |
| Banner's closing line | `<thread line>` |
| Session name | `claude --name "<thread line>"` at launch, or `/rename <thread line>` |
| Bootstrap and re-bootstrap report | `Rename thread: /rename <thread line>`, the last line of `## Done` |
| Message sender | `<label> (<thread line>):`, as in `KI > Guilds (⚖️ 🔑 ki.reg.guilds):` |
| Run report | `🧵 <work-id>` of the work it reports to |

[Back to contents](#contents)

### 4.7 Rules of the role model

These are the role-catalogue brief's rules as they stand today; the admission gate, vote and seat folders land with the later seat rules.

1. Only a seat with a role in this catalogue may join Cairn; Cairn tells an unrecognised session the path in: take a role, or ask the tier above.
2. Cairn members put being available for messages before doing work themselves, and hand work down to makers or their own pack.
3. Admission goes one tier up within scope: a maker asks its package's managers, a manager its territory's leaders. Quorum is no objection and at least 75% of that tier's live members voting; one live member is a quorum alone; a vote short of quorum after about two hours goes to Kris.
4. Authority follows the [tiers](#42-tiers).
5. A package's keyholder creates the seats it needs and ends them when they are no longer needed, even mid-work.
6. Naming migrates incrementally: a seat corrects its name the next time it takes up its role, and each governor brings its territory's packages into line, under [the role migration file](standards-roles-migration.md).
7. In web addresses, package and seat are separate query parameters, as in `package=ki.sop.main&seat=governor`.
8. One ratification round for today's seats: each declares its tier and role, and the tier above confirms, cascading through each territory's governor.
9. The guildmaster owns the role model as skills; `ki.cairn` builds the admission gate and vote into Cairn; the guildmaster and the librarian together carry islands, guilds and the library into the Knowledge Islands concept.
10. There is one library, `ki.reg.library`; a territory gets its own only if it needs one.
11. Each territory's council is its governor and any councillors. Matters that cross territories go to the governors together. No governor outranks another; `ki.sop.main`'s governor only convenes and records.
12. "Assistant" and "liaison" are not roles: whatever Kris is talking to is his point of contact in that capacity.

[Back to contents](#contents)
