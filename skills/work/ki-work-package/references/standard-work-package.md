---
type: standard@2026-11-09T21:36:32Z
revised: 2026-11-10T02:25:04Z
status: in force
---

# Work package

## Contents

- [1. Introduction](#1-introduction)
- [2. Scope](#2-scope)
  - [2.1 In scope](#21-in-scope)
  - [2.2 Out of scope](#22-out-of-scope)
- [3. Terms and definitions](#3-terms-and-definitions)
- [4. Rules](#4-rules)
  - [4.1 Activation and ownership](#41-activation-and-ownership)
  - [4.2 Location and identity](#42-location-and-identity)
  - [4.3 The shape](#43-the-shape)
  - [4.4 The entry file](#44-the-entry-file)
  - [4.5 The state](#45-the-state)
  - [4.6 Change documents](#46-change-documents)
  - [4.7 Sub-packages](#47-sub-packages)
  - [4.8 Messages](#48-messages)
  - [4.9 Writers](#49-writers)
  - [4.10 The tidy](#410-the-tidy)
  - [4.11 Work identity and native sessions](#411-work-identity-and-native-sessions)
  - [4.12 Optional runtime reminder consumers](#412-optional-runtime-reminder-consumers)
  - [4.13 Update lifecycle](#413-update-lifecycle)
  - [4.14 Resume lifecycle](#414-resume-lifecycle)
  - [4.15 Removal lifecycle](#415-removal-lifecycle)
  - [4.16 Prohibited payloads and claims](#416-prohibited-payloads-and-claims)
  - [4.17 Audit and conform boundary](#417-audit-and-conform-boundary)

## 1. Introduction

A work package is the folder for one piece of work above a work item: its entry file, `_index.md`, and its change documents, with sub-packages of the same shape where the work has more than one strand. It lives in the Cairn store, at `work/<territory>/<work id>/`. The entry file is enough to recover from: a fresh agent, or State of play routing new work, pointed at it knows where the work stands without a transcript, private runtime state or a vendor session. Git is the logbook: each move is a commit, so the package keeps no moves list and no history. The decisions behind these rules are in [the sources file](sources.md#3-decisions).

The work model is the [Work Process](https://github.com/knowledgeislands/ki-principal/blob/main/Pillars/Philosophy/Model/Processes/Work%20Process/Work%20Process.md) note's, decided by [GDR-KI-PRINCIPAL-009](https://github.com/knowledgeislands/ki-principal/blob/main/Admin/Governance/Decisions/GDR-KI-PRINCIPAL-009-the-work-model.md). The skill was `ki-checkpoint` until Kris answered WORK-FOLDER-NAME on 18 October 2026, read back as `ki-work-folder`, and became `ki-work-package` when Kris answered on 19 October 2026, "I want `ki-work-package` please, where it lives is a folder", read back as PACKAGE-NAME. The session-level checkpoint remains the conversational word for writing the package's state before a pause.

[Back to contents](#contents)

## 2. Scope

What a work package holds, where it lives, and how it is kept.

### 2.1 In scope

- Where a package lives, its identity, and the files and folders it holds.
- Its entry file: definition, repositories, state and links to its changes and sub-packages.
- Where its state, decisions, open points and messages live.
- Who writes a package, and the tidy that brings each package to the shape.
- Updating, resuming and removing a package, and what it must never carry.

[Back to contents](#contents)

### 2.2 Out of scope

- The contents of the work itself.
- The format of a change document: `ki-authoring`'s [change format](../../../keystone/ki-authoring/references/standard-formats-change.md).
- How messages and presence are stored: the Cairn store's contract and its MCP.
- When a package is tidied, the levels, states and moves, and the report forms: `ki-coordination`.
- The run side, briefs and run reports included: `ki-delegation`.
- How sessions share the Cairn store, how its history is squashed, and how `ki` and the hooks find packages in it. These are not yet set.

[Back to contents](#contents)

## 3. Terms and definitions

| Term | Definition |
| --- | --- |
| **Work package** | The folder for one piece of work above a work item: its entry file and its change documents, with sub-packages of the same shape. **Standard:** this one, [4.3](#43-the-shape) |
| **Entry file** | A package's `_index.md`: purpose, repositories, the state for recovery, and links to its changes and sub-packages. **Standard:** this one, [4.4](#44-the-entry-file) |
| **State** | Where the work lies now: the state fields, at most five Now lines, Held and the live seats under `workers`, with no history. **Standard:** this one, [4.5](#45-the-state) |
| **Sub-package** | One strand of a package's work, with the same shape as a package. **Standard:** this one, [4.7](#47-sub-packages) |
| **Change document** | A proposal to change standards or how work is done, with its design outline and a planning section. **Standard:** `ki-authoring`'s [change format](../../../keystone/ki-authoring/references/standard-formats-change.md) |
| **The tidy** | The pass that brings a package to the shape and keeps only what is current. **Standard:** this one, [4.10](#410-the-tidy) |
| **Holder** | Who the work lies with: `owner`, `agent`, `run/<name>`, `work/<id>`, `person/<handle>` or `repo/<name>`. **Standard:** this one, [4.5](#45-the-state) |
| **Keyholder** | The session holding a package's keys, the seat that may write its package. **Standard:** [the role standard](standard-roles.md#44-marks) |

[Back to contents](#contents)

## 4. Rules

The rules, part by part.

### 4.1 Activation and ownership

The capability is optional. A repository declares `ki-work-package` in `.ki.toml`; the declaration is an empty capability marker. The audit reads the packages under `work/` in a repository that declares it. Git supplies any recovery history.

This standard is the one specification of the work package, as Kris answered WORK-FOLDER-OWNER on 18 October 2026, read back as "the work-folder skill is the canonical specification; ki-coordination timing and judgement; ki-delegation run side only; ki-work design graduation; others check in on the four-point contract". It owns the package's shape, its entry file, who writes it and the tidy, at every level, coordinated or not. The other owners keep only their side and link here for the rest:

| Concern | Owner |
| --- | --- |
| When a package is tidied, at send, mark, hold and finish; whether an outcome has a durable home; the report forms; acting on messages and route receipt | `ki-coordination` |
| The run packet, with run briefs and reports, and how a session delegates to its agent host's subagents | `ki-delegation` |
| The format of a change document | `ki-authoring` |
| A change document's review and graduation | `ki-work design` |
| Messages and presence between work | The Cairn store and its MCP |

[Back to contents](#contents)

### 4.2 Location and identity

A work package lives in the Cairn store, at `work/<territory>/<work id>/`, one per piece of work above a work item; where the store sits on each rig is whatever that rig sets. A work item has no package, because its record is its home. `<work id>` is the work's dotted id under `ki-coordination`'s [Work naming](../../ki-coordination/references/standards-opening.md#work-naming), which defines the id, slug and title: lower-case kebab segments joined by `.`, never a host, an underscore or a runtime session identifier. `<territory>` is the id's first segment. The folder name, the `id` field of `_index.md` and its H1 agree exactly.

`work/` holds only territory folders, and each territory folder only packages, each a physical directory with its entry file. Symlinked, timestamped, archived and alternate layouts are invalid; the one nesting is a [sub-package](#47-sub-packages). There is no holding area for work awaiting review, as Kris set under WORK-REVIEW-RETIRE on 8 November 2026: live work is a package, and work that is not live is deleted, Git keeping its history.

A package names the repositories it mainly works in under `repositories:` in its entry file, and it may still change others. Records remain in the repositories that own their plans, priority and acceptance; a record's `project` resolves through the Capital's registry without execution authority. A record without `project` goes first to its regular or ad hoc owner, then to State of play only when unresolved.

Every package below the main State of play names its coordinating State of play as `parent`, including a secondary, a Project, regular work and ad hoc work; a sub-package names its parent package instead. For ad hoc work this is the coordinating State of play, not the regular-work prefix in its id. The main keeps `covers` as the register of the Project, regular umbrella and ad hoc work it coordinates, including work covered through a secondary, before a package exists and after it is pruned. Secondary `covers` lists remain its assigned subset. Check package parents against that register, same-territory membership, unique coverage by secondaries and absence of cycles; never infer coverage from the presence of a package.

[Back to contents](#contents)

### 4.3 The shape

A package is its entry file and its change documents. Where it holds more than one strand of work, each strand is a sub-package with the same shape; where it holds one, the change documents sit at the top.

```text
<package>/
  _index.md              entry: purpose, repositories, state for recovery, links to its changes and sub-packages
  NN-<slug>.change.md    the work: decisions taken inside it, discussion in its Open section
  <sub-package>/         a strand of work, the same shape again
    _index.md
    NN-<slug>.change.md
```

- **The package's `_index.md` is enough to recover.** It holds the state, what is in hand, what waits and who is working, and links to every change and sub-package, so an agent pointed at it knows where things stand.
- **There are no other package files:** no `state.md`, `decisions.md`, `discussions.md` or `messages.md`, and no focus folders, run reports, briefs, findings or feedback files. The words focus and theme are not used for sub-packages: theme belongs to roadmaps, and focus suggests what is looked at first.
- **No empty folders.**
- **Temporary output** belongs in the run's temporary directory, `$TMPDIR/ki-agents/<run>/<name>/`, outside every repository, under the `ki-delegation` [run packet](../../../agentic-systems/ki-delegation/references/standards-background-runs.md#run-packet); scripts, screenshots, `scratch/` folders and the output of tools never enter a package.

[Back to contents](#contents)

### 4.4 The entry file

A package's entry file is `_index.md`, so it sorts first, as Kris set under INDEX-ENTRY on 8 November 2026: "a good time to change that now, put it into the standard". It holds the work's definition and its state.

```yaml
---
id: ki.prj.observatory
parent: ki.sop.main
level: project
project: observatory
theme: model
description: >-
  Builds and runs the local Observatory in apps-observatory.local, the territory's read-only view of work, runs
  and diagrams. Takes Observatory features, its design system and `ki work status` consumers. Not for timelines
  and calendars (ki.reg.timelines) or the work model itself (ki.prj.ways-of-working).
worker: agent
supervisor: owner
role: warden
created_at: 2026-10-13T23:50:00Z
repositories:
  - apps-observatory.local
state: with-worker
since: 2026-10-19T11:25:41Z
workers:
  - role: warden
    tier: managers
    since: 2026-10-19T07:14:00Z
    status: active
    listening: off
---
```

The definition's field set is closed; the state fields of [4.5](#45-the-state) stand beside it, and nothing else:

| Field | Presence | Value |
| --- | --- | --- |
| `id` | required | the work's dotted id, agreeing with its folder |
| `level` | required | `territory`, `regular` or `project` |
| `label` | optional | title with an inventory host or category requirement suffix; never a session seat |
| `project` | required at `project` level, else absent | the Project note's slug, typed id's third segment |
| `theme` | optional | a theme page's slug, or `null` |
| `parent` | required below the main, absent on the main | coordinating State of play id, or a sub-package's parent package |
| `covers` | required on States of play, absent otherwise | main register or secondary non-empty subset |
| `description` | required | the routing description, at most 500 characters |
| `worker`, `supervisor` | required | each a holder |
| `role` | required | the package's role, one role from [the role catalogue](standard-roles.md#43-role-catalogue); a package without one is warned on under [the role migration file](standards-roles-migration.md) |
| `created_at` | optional | UTC time the package was created, no later than `since` |
| `repositories` | required | a list of the repository names the package mainly works in, empty where it works in none |

Territory work is the main State of play, id `<territory>.sop.main` (legacy `<territory>` remains readable), or a secondary State of play, id `<territory>.sop.<name>`, under the `ki-coordination` [secondary States of play](../../ki-coordination/references/standards-territory.md#secondary-states-of-play); `sop` is never a second segment at another level. The level is the one authority for the kind of work: not the title, a native session name, the folder name, the repository declaration, an output style, a hook line or a cached copy.

The `description` is written for routing, in a skill description's voice, as Kris answered DESCRIPTION-SHAPE: third person, what the work does, then "Takes ..." naming the kinds of unit it accepts, then "Not for ..." naming the neighbouring works by id, one to three sentences, tested against a handful of ambiguous routing examples. There is no `active` or `accepts` field: every state except `finished` can receive, and a work winding down says "Not taking new units" in its description.

The body has exactly this heading sequence, with an optional one-line `## Values` after Scope:

```markdown
# ki.prj.observatory

## Goals

## Scope

## Values

## Now

## Held

## Changes
```

- **Goals** - the node's **direction**: the standing goals of the work, stable across its waves, as few as it needs. For Project work the first line links the Project note's `outcome` and never restates it; for regular work it links the Activity note; for territory work, the Charter. Links point upward: the package names its Project, and the Project note never links down.
- **Scope** - the node's **remit**: `In:` and `Out:` lines, In naming what the work may decide and do, and Out what goes up or belongs to which other work, by id, and a line saying the package works mainly in the repositories `repositories:` names and may still change others. This is what State of play reads when two descriptions both match.
- **Values** - optional: one line linking the shared values in the Work Process note and adding any the work holds itself, as Kris chose VALUES-HOME a) on 7 November 2026: "Write them once in the Work Process note under an Enactment record, and give each `work.md` an optional one-line `## Values` section linking them and adding any of its own."
- **Now** and **Held** - the state's body, under [4.5](#45-the-state).
- **Changes** - a link to every change document and every sub-package, one list item each, saying in a line what it is and where it stands.

Each section says something, if only `None`. Nothing else belongs in the entry file: no history, evidence or discussion. Direction and remit need no section of their own (REMIT-IN-INDEX): a node's way of working is part of its remit, changed by the node where the change reaches only it and its children, and proposed up the tree where it reaches wider, as Kris took on 11 November 2026 in the Cairn summit's [change 00](https://github.com/krisb/ki-cairn-store/blob/main/work/cairn/cairn.summit/00-authority-tree.change.md).

[Back to contents](#contents)

### 4.5 The state

The state lives in `_index.md`: its state fields, at most five Now lines, Held and `workers`, with no history. It is rewritten in place at every move, so the package's Git log is the history of the work's moves.

| Field | Presence | Value |
| --- | --- | --- |
| `state` | required | `with-worker`, `handoff-to-supervisor`, `with-supervisor`, `handoff-to-worker`, `handoff`, `on-hold` or `finished` |
| `target` | required in `handoff`, else absent | the holder the work is in transit to |
| `hold` | required in `on-hold`, else absent | a mapping of `reason`, `paused`, or `more-expected` for Snoozing until `ki` accepts `snoozing`, `release`, the condition in words, and an optional `set_by`, `owner` or `worker`, the worker setting only the idle `more-expected` hold under `ki-coordination`'s [Putting work on hold](../../ki-coordination/references/standards-holds.md#putting-work-on-hold); absent reads `owner` |
| `blocking` | optional | `true` only in `handoff-to-supervisor`, when the worker sent back with a blocking query |
| `since` | required | UTC time of the last move |
| `received` | optional | UTC time of the supervisor's receive, or `null` |
| `beat` | optional | UTC time of the last heartbeat while with a worker, or `null` |
| `mark` | optional | UTC time of the last mark |
| `method_read` | optional | the short ki-agent-backpack revision whose `ki-coordination` and `ki-work-package` guidance the worker last read, or `null` |
| `listening_enabled` | optional | `true` when the thread has the listening capability, by the owner's express word or an agreed role; absent reads `false` |
| `listening_status` | required while `listening_enabled` is `true`, else absent | `on` while the inbox watcher is armed, `off` otherwise |
| `syncing_enabled` | optional | `true` when the thread is its host's sync thread; absent reads `false`; `true` requires `listening_enabled: true` |
| `syncing_status` | required while `syncing_enabled` is `true`, else absent | `on` while host sync runs, `off` otherwise |
| `workers` | optional | the package's live seats, each a mapping of `role` and `tier` and at most `since`, `status` and `listening`, under [the role standard's fields](standard-roles.md#45-role-fields); absent or empty when no seat is live |

The holder the work lies with now and its role are derived from `state`, `target`, `worker` and `supervisor`, never stored. Timestamps use UTC RFC 3339 second precision; quote `label` in YAML where it contains `>`. There is no `title` field: a package's id and its place in the tree name it, and a view works out its words from them (TITLE-DROP and TITLE-WORDS, Kris, 13 November 2026). The four capability fields record the thread capabilities under `ki-coordination`'s [Thread capabilities](../../ki-coordination/references/standards-listening.md#thread-capabilities), as Kris set under FOOTER-CAPABILITY-STATUS-2, relayed on 1 November 2026: each thread carries `listening_enabled`, `listening_status`, `syncing_enabled` and `syncing_status`, and if `syncing_enabled` is true, `listening_enabled` must be true, because a syncing thread is always a listening thread. `_enabled` says whether the thread has the capability; `_status` says whether it is on now, and the banner's mode lines read both. These are the fields the Work Process note's Observatory fields read through `ki work status`. `method_read` replaces the body line a coordinator once wrote under its refresh rule; setting it is the confirmation that a `REFRESH` message has been acted on, under `ki-coordination`'s [Refreshing this guidance](../../ki-coordination/references/standards-coordination.md#refreshing-this-guidance).

- **Now** - at most five lines: what is running, what lies with whom, since when. It holds the present only.
- **Held** - work waiting on a named decision or event, one line each with its release condition. Deferred deliverable work becomes an unadopted triage record in its home repository under `ki-work next`'s [capture rule](../../../keystone/ki-work/references/standards-next-work.md#capture-substantive-prospective-work), as Kris took HELD-VS-RECORD a) on 7 November 2026, and ideas go to the Project note's Notes or to a record through `ki-work next`; neither stays here.
- **Workers** - the live seats, one entry each; a seat that has ended leaves the list.

History stays out, as Kris answered STATE-HISTORY: the recap since the mark reads the package's Git log, so nothing needs a dated log in Now or Held. Evidence, such as commit identifiers, test counts and artefact hashes, lives in the run report and the commit; the state may link one, not copy it.

[Back to contents](#contents)

### 4.6 Change documents

- **Change documents carry the work.** Each is `NN-<slug>.change.md`, under `ki-authoring`'s [change format](../../../keystone/ki-authoring/references/standard-formats-change.md), its slug lower-case kebab case.
- **They are numbered** in tens by group, in the order they are taken, with gaps for new ones.
- **Decisions live in the change document they belong to.** When the change closes, each goes to its durable home, a standard, `AGENTS.md` or a record, and the change is deleted. Review and graduation are `ki-work design`'s.
- **Open points live in a change document's Open section,** in full, and nothing already answered stays there.

[Back to contents](#contents)

### 4.7 Sub-packages

A sub-package is one strand of a package's work: a package in miniature, with its own `_index.md` and one or more change documents, in a folder of the package named by a lower-case kebab slug. A package with one strand needs none.

- **Identity:** its id is `<parent id>.<slug>`, under `ki-coordination`'s [Work naming](../../ki-coordination/references/standards-opening.md#work-naming), and its folder, `id` and H1 agree.
- **Form:** the package's shape, its `level` the parent's. Its `parent` names the parent package, not a State of play, and it stays out of every State of play's `covers`, since its parent is already there.
- **Links:** the parent's Changes section links it.

[Back to contents](#contents)

### 4.8 Messages

Messages between work live in the Cairn store, through its MCP; a package keeps no message queue of its own. Who may send, how a coordinator acts on a message and route receipt are `ki-coordination`'s [Messages between work](../../ki-coordination/references/standards-messages.md#messages-between-work).

Owner feedback on a document the work produced arrives as a message, as Kris set under FEEDBACK-AS-MESSAGE on 31 October 2026: "we can probably drop the feedback idea. We just send a message with it instead". A message carrying the owner's words quotes them word for word, naming the owner as speaker; any later reading of the feedback, what a point means or where it is homed, goes to the change document the point reaches.

[Back to contents](#contents)

### 4.9 Writers

Every writer is named, and every other party only reads. This standing contract implements the ownership set out in [4.1](#41-activation-and-ownership) and is the contract other skills, tools and runs check in on:

1. **One owner sets the shape and the tidy rules:** this standard sets the closed list, what each writer may write and how a deletion is made.
2. **Every other writer is named** with its permitted kinds, in the table below.
3. **Only the package's own work deletes.** Runs, other work and tools never delete there.
4. **A check backs each writer mechanically,** through the [rubric](rubric.md); the judgement whether an outcome has a durable home stays with the work's own steward under `ki-coordination`.

| Writer | Writes | Never |
| --- | --- | --- |
| The package's own steward† | `_index.md`, its change documents and sub-packages, and tidy deletions | Another package |
| A background run, design runs and `ki-work design` included | A change document in the package its brief names | Any other kind, its report included |

† The work's own steward is its keyholder, and includes its explicitly assigned State of play. Other work and State of play write nothing in a package: they send a message.

The `description` in `_index.md` is written by the work's steward, at seeding with State of play; State of play proposes a change to it by a message. Readers, such as `ki work status`, the Observatory and the rubrics, change nothing; a change of shape names them as consumers.

A Project package has one explicitly assigned coordinating work, either its covering State of play or its own Project coordination work. The assignment is committed when the package is created or adopted and names work, never a host, session or `self`. It is distinct from the holder derived from state, worker and supervisor: assignment neither receives work nor releases a hold. Where the assignment is recorded is not yet set (STEWARD-FIELD); this rule adds no field, changes no holder field and does not select a storage encoding.

Opening or closing a dedicated Project thread requires an acknowledged handover. The old steward reconciles runs in flight, queued launches and pending writes, stops launching for the package and commits the assignment change in one coherent write. The new steward acknowledges before acting and takes supervision of the reconciled runs. A closed or quiet session, missing binding or old heartbeat transfers nothing; there is no timeout takeover. Uncertain ownership is reported. A State of play acting for a package with no active session, under `ki-coordination`'s [acting for idle work](../../ki-coordination/references/standards-territory.md#territory-work), takes over nothing.

An assigned State of play is the package's own steward for every writer's purpose, including the state, change documents and tidying. Work assigned elsewhere receives only messages. Creation is limited to a registered Project within the territory's active-package cap, in the state its actual move supports; an absent package never implies `with-worker`.

A run brief names its reporting package separately from the product repository; the package's steward receives the result. A classification change reconciles running work and report destinations before rerouting anything.

[Back to contents](#contents)

### 4.10 The tidy

The pass each package receives to reach the shape, and to keep it:

1. **The shape.** The entry file is `_index.md`; the state folds into it, and live decisions and open points move into the change document they belong to.
2. **Consolidate.** Keep only what is current. Delete anything whose outcome has a lasting home: a commit, a record, a standard or `AGENTS.md`. Git keeps the history.
3. **Sub-packages.** Each strand of work becomes a sub-package with its own `_index.md` and change documents, or its changes come up to the top where the package has one strand. Retire one that has ended; merge ones that overlap.
4. **No empty folders.**
5. **Identity.** `_index.md`'s `id`, `level`, `role` and H1 match the package's current work id and the role catalogue.
6. **The state is now.** At most five Now lines, waiting items under Held, live seats under `workers`, no history.
7. **Every open point is in a change document's Open section,** in full, and nothing already answered.
8. **Every rule has a home.** A decision that changes how work is done goes into the standard that owns the practice or, if local to one repository, that repository's `AGENTS.md`.
9. **The roster is current.** The package is registered under its current id, with nothing left under an old id.
10. **Earlier copies listed.** Any copy left elsewhere after a move or rename is listed, and removed only on its owner's word.

Each tidy ends with a check against the work-package rubric and a short report: what changed, what was deleted and why, and what needs the owner.

- **When:** `ki-coordination` says when a coordinator tidies; regular and ad hoc work tidies at its own next update.
- **How:** in one commit by explicit path, `git rm` of each file named and nothing else, never a folder-wide delete, so that Git history holds every deleted file. The deletion is operational work and opens no record. A change whose outcome has no durable home yet is kept, not homed in haste. The rubric lists candidates; a listing is never permission to delete.
- **Who:** each piece of work tidies only its own package. Territory work never tidies another package; it names each package the rubric flags in a message to that work, and the owning work tidies at its next send. The one exception is a finished work's package, which no coordinator reads once the work is Finished: territory work closes it itself under Close-out.
- **Before a hold:** work going On hold, for either reason and whoever sets it, first tidies its package, so that it holds nothing already dealt with: each change document goes once it has landed. Kris set it under HOLD-TIDY at about 18:10 GMT on 4 November 2026: "you can't tell me that you're on hold expecting more, yet then have additional things in there that have been dealt with."
- **Close-out:** finished work's package is deleted at the mark that closes it, in one commit, once its decisions are homed and its change documents resolved, under [4.15](#415-removal-lifecycle). Where the package outlives the finishing thread, territory work closes it at an owner-authorised mark of its own whose report names the package, so that the package is deleted rather than flagged, as Kris asked under FINISHED-TIDY-KICK on 30 October 2026, "Sort out the method so that the kick actually gets the folder deleted", and adopted on 1 November 2026. This is administrative close-out only: it reopens nothing, accepts nothing and settles nothing on the owner's behalf. It first checks that the state is `finished`, every decision is homed and other durable information has reached its owners, no change document is left open, and no run of the work is running or queued. If all hold, it deletes the package in one commit by explicit path, `docs(work): <id> close-out`. If any check fails, it deletes nothing and puts one open point to the owner in a change document of its own.

[Back to contents](#contents)

### 4.11 Work identity and native sessions

A native client session, a Claude Code or Codex session or a Zed tab, is seated in one package and may act in other packages that its coordinating work explicitly stewards. The package identifies the work and its level; the session is an actor, never the unit of work or evidence of stewardship. A local binding establishes identity only, not liveness or write authority.

- **Key:** `<repository name>/<work id>`, such as `ki-principal/ki.ways-of-working`. It is stable across hosts, clients and sessions.
- **Authority:** the entry file's `id` identifies the work and its `level` describes its type. Coordination is an explicitly owner-opened session role on any valid package under `ki-coordination`, not a consequence of level, id, native name or binding. Its opener checks scope, opening authority and coordination capability, preserving any specific owner-approved exception. The native session name derives from the work label; it never decides work identity, level or stewardship.
- **Binding:** the native session identifiers for a piece of work live only in a machine-local runtime file, `~/.local/state/ki/threads/<repository>/<slug>.json`, as Work naming names it. The binding is never committed, never copied into the package, which keeps no runtime identifier under [4.16](#416-prohibited-payloads-and-claims), and never moved between hosts: each host rebuilds its own.
- **Supply:** identity reaches a session through one of three channels, in this order: the agent host's environment and session name, for a session an agent host or a host tool starts; the `SessionStart` hook on startup, resume and compact, where the binding exists; and the pasted opener or thread identity, which names the id and label, where no hook runs.
- **Drift:** a mismatch between the binding, the native name and the entry file is reported in one line and never repaired by the session that finds it; the owner renames by hand, or the work's next update corrects the package.

Until the `ki thread` tooling and its hook registration ship, no binding is written and a session knows its work only from its opener, its thread identity or an explicit id under [4.14](#414-resume-lifecycle).

[Back to contents](#contents)

### 4.12 Optional runtime reminder consumers

A runtime-specific reminder consumer is separately opt-in. It may act only when its native event contract is independently evidenced and all of the following are true:

1. The repository declares `ki-work-package` and resolves to one physical repository root.
2. The runtime adapter is explicitly enabled in that runtime's own configuration; the portable `ki-work-package` declaration remains an empty capability marker.
3. The adapter receives one exact, human-selected work id from that explicit runtime configuration. It resolves only `work/<territory>/<id>/_index.md` in the Cairn store; directory scans, newest-record selection, runtime-derived names, and archived or nested fallback are forbidden.
4. The resolved record is a regular file that satisfies this standard's identity and closed-schema requirements.

The only first-delivery action is a compact reminder that the already-selected package may need an explicit update. The consumer does not create, update, remove, select, or reword a package file; infer work state or completion; invoke `ki-work recap`; read a transcript or vendor session; or expose a session identifier. Repeated, interrupted, malformed, unknown, absent, or otherwise unsafe input is a quiet no-op. The native runtime adapter owns its event semantics, registration, timeout, exit behaviour, and any actionable failure text; the portable contract supplies no shared hook or fallback.

[Back to contents](#contents)

### 4.13 Update lifecycle

Every send, receive, mark and hold rewrites the state in `_index.md`, its fields, Now and Held, under `ki-coordination`'s [Picking work up](../../ki-coordination/references/standards-bootstrap.md#picking-work-up), and otherwise the package changes only on explicit user request or a documented repository-local trigger, such as before context compaction or a known pause. The definition changes only when the work does. A generic Stop event is not authority to create or choose a package.

An update replaces the current state in place. It never appends a moves list, timestamped copies or transcript history. Only sends and the supervisor's receives commit, each subject carrying the move, as in `docs(work): ki.prj.ways-of-working send to owner`; the package's Git log is the logbook.

Write durable decisions, accepted work state, or reusable knowledge to their proper owners before referring to them from the package. The package may name those canonical artifacts; it must not become their only copy.

An update that hands work to a fresh agent follows this lifecycle and nothing else. `ki-work recap` supplies no package update and has no checkpoint composition, as Kris took RECAP-NARROW a) on 7 November 2026; the update procedure refuses any repository mismatch, stale baseline, ambiguous work, interrupted update or incomplete work state. The hand-off names the physical repository identity, immutable committed baseline or one complete portable patch against that baseline, scoped authority, result destination, and expected verification. A transcript, runtime session, shared filesystem, or provider snapshot may be available but is never required evidence and cannot replace those portable inputs. The package records concise current state and references to durable owners; it does not embed the patch, become the result store, or take ownership of the delegated work.

[Back to contents](#contents)

### 4.14 Resume lifecycle

The manual portable flow is deliberately small:

1. Require the user-selected work id or, from an opener, the Project slug.
2. Resolve to one exact package, `work/<territory>/<id>/` in the Cairn store. If no folder, or more than one, matches, stop and ask the human which package is meant.
3. Read `_index.md` in full and validate the package's identity and schema; open a change document or sub-package when the work in hand lies in it.
4. Act on its state as `ki-coordination`'s Picking work up sets it, its messages first, and continue from its Now.

The title and label never take part in resolution. Do not search archived or nested paths as a fallback. Resume creates a fresh working context; it does not reopen, locate, or authenticate to the conversation that last held the work.

[Back to contents](#contents)

### 4.15 Removal lifecycle

Finished work keeps its package with `state: finished` until the mark that closes it, when the package is deleted in one commit with Git keeping it, by the finishing coordinator or, where the package outlives the finishing thread, by territory work at its own mark, under [4.10](#410-the-tidy) and `ki-coordination`'s [Finishing Project work](../../ki-coordination/references/standards-mark.md#finishing-project-work). Removal otherwise requires explicit user direction; an agent must not infer completion from record content, a quiet session, or a Stop event. First confirm durable facts reached their proper owners, then delete the exact package.

No retired copy is kept. Git is the recovery mechanism, so `_RETIRED`, archive, timestamped-copy, and other nested layouts are invalid.

[Back to contents](#contents)

### 4.16 Prohibited payloads and claims

A package contains its definition, its current state and its change documents, not a transcript. It has no vendor-session field, conversation URL, runtime identifier or chat log. A session's host seat, where it runs or will resume, stays out of packages, holds and reports. A host or category required by the work may appear on a message, brief, record or package label. Names resolve through the territory's machine inventory, with concrete hosts distinguished from categories; bootstrap and re-anchoring map the local machine to that inventory rather than trusting a raw hostname. Unknown, renamed or ambiguous names block device-dependent execution until resolved. Prose must not claim that a future agent can access or reopen the session that last held the work.

It is also not a completion signal, roadmap, decision record, knowledge store, or session recap. Project notes and theme pages ([the Project registry standard](../../../keystone/ki-work/references/standards-project-registry.md)) are the durable home of standing outcome and status, and the entry file names its Project while the Project note does not link down. `ki-work recap` owns the user-facing judgment-led recap; the relevant governance skill owns each durable artifact. An optional runtime reminder consumer may use only an already-selected valid record under [its explicit contract](#412-optional-runtime-reminder-consumers). It does not grant write authority, choose work, invoke recap, read session material, or turn a portable procedure into a native host operation.

[Back to contents](#contents)

### 4.17 Audit and conform boundary

AUDIT, CONFORM, and EDUCATE are currently hosted `ki repo` operations. REMOVE, RESUME, and UPDATE remain explicit agent procedures until a host operation is implemented and independently verified. AUDIT reads every package under `work/` in a repository that declares the capability and validates each package's location, identity, closed front matter, body, closed list, Changes links and boundary, sub-packages included; it warns on Now past five lines, a description past 500 characters, history in the state and each earlier copy of a package left in a retired working area, `+/_WORK/`, `+/_WORK_REVIEW/`, `+/_THREADS/` or `+/_CHECKPOINTS/`; it reports absent scope as not applicable when the capability is undeclared, and rejects symlinks and unsupported layouts.

CONFORM never authors a package file or moves work between states or shapes. It may publish the generated rubric, but it cannot create, update, or remove a package, because those actions need human-selected work and explicit write authority.

[Back to contents](#contents)
