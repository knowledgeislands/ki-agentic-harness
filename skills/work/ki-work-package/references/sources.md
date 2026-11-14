---
type: sources@2026-11-09T21:36:32Z
revised: 2026-11-14T13:51:34Z
refresh: canonical · on-change
---

# Work-package sources

## Contents

- [1. Introduction](#1-introduction)
- [2. Outside sources](#2-outside-sources)
  - [2.1 Authoritative](#21-authoritative)
  - [2.2 Advisory](#22-advisory)
- [3. Decisions](#3-decisions)
- [4. Last review](#4-last-review)

## 1. Introduction

The sources behind [the work-package standard](standard-work-package.md), [the role standard](standard-roles.md) and its [migration file](standards-roles-migration.md), and the generated [rubric](rubric.md). The standards are owned in house, so the sources are decisions and the designs behind them rather than outside specifications.

[Back to contents](#contents)

## 2. Outside sources

The designs and skills the standards draw on.

### 2.1 Authoritative

| Source | Governs | Last reviewed |
| --- | --- | --- |
| Local checkpoint standard and focused fixtures | House-owned active-only schema, explicit removal authority, and negative-path safety evidence; not a completed reconstruction outcome | 2026-09-15 |
| The `ki.ways-of-working` work-package design note and decisions log in Knowledge Islands Principal, now `ki.prj.ways-of-working` | The five-file package, routing description, message queue and important flag, size limits, progressive reveal and the rename to `ki-work-package` | 2026-10-31 |
| `ki-recap` | User-facing recap and durable learning boundary | 2026-08-06 |
| `ki-repo` | Optional capability declaration and generic working-area ownership | 2026-08-06 |
| [Role-catalogue brief](https://github.com/krisb/dotfiles/blob/2fe13be/+/_WORK/personal.reg.household-terra/housekeeping/role-catalogue.brief.md), the `ki.reg.guilds` roles design and decisions log | The role standard: catalogue, tiers, glyphs, `role` and `workers` fields, thread line and the role migration file | 2026-11-07 |
| The work package format change, phase 1, `01-work-package-format.change.md` in the Agora store's `agora.sop.main` package | The store location, the package shape, the state in `_index.md`, change documents, `repositories:`, messages through the store and the tidy | 2026-11-09 |

[Back to contents](#contents)

### 2.2 Advisory

None.

[Back to contents](#contents)

## 3. Decisions

The phase 1 work package format change, agreed by Kris on 9 November 2026, gives the decisions dated that day; the earlier decisions it replaces are kept, superseded. Other decisions behind the rules are named where the standards state them.

| Id | Decision | Date | Backs | Status |
| --- | --- | --- | --- | --- |
| STATE-FILE | A package has five files, the state in `state.md`, rewritten at every move. | 2026-10-19 | [work package](standard-work-package.md) | Superseded by PACKAGE-STATE |
| FILES-AT-CREATION | All five package files exist from creation, "so others can queue work into `messages.md` at once". | 2026-10-19 | [work package](standard-work-package.md) | Superseded by PACKAGE-SHAPE |
| QUERIES-FILE | Every open and parked query lives in full in the package's discussion file. | 2026-10-19 | [work package](standard-work-package.md) | Superseded by PACKAGE-DECISIONS |
| PACKAGE-LAYOUT | The top level holds only the five package files. | 2026-10-30 | [work package](standard-work-package.md) | Superseded by PACKAGE-SHAPE |
| LAYOUT-PILLARS | Focus areas listed in `_index.md`, each a folder holding its briefs, reports and designs. | 2026-11-02 | [work package](standard-work-package.md) | Superseded by PACKAGE-SHAPE |
| SUB-PACKAGE | A sub-package is a doer's own short-lived five-file package for one focus area of its parent. | 2026-11-02 | [work package](standard-work-package.md#47-sub-packages) | Superseded by PACKAGE-SHAPE |
| THREAD-TIDY | At each mark the thread deletes every report whose queries are answered and whose outcome has a durable home. | 2026-10-14 | [work package](standard-work-package.md#410-the-tidy) | Superseded by PACKAGE-TIDY |
| MSG-SECTIONS | `messages.md` keeps `## Inbound` and `## Outbound`, ACK lines at the top of Inbound. | 2026-11-04 | [work package](standard-work-package.md#48-messages) | Superseded by PACKAGE-MESSAGES |
| PACKAGE-STORE | A package lives in the Agora store, at `work/<territory>/<work id>/`; where the store sits on each rig is whatever that rig sets. | 2026-11-09 | [work package](standard-work-package.md#42-location-and-identity) | In force |
| PACKAGE-SHAPE | A package is its `_index.md` and its change documents, `NN-<slug>.change.md`, numbered in tens by group; where it holds more than one strand of work, each is a sub-package of the same shape. There are no other package files and no focus folders. | 2026-11-09 | [work package](standard-work-package.md#43-the-shape) | In force |
| PACKAGE-STATE | The state lives in `_index.md`, which is enough to recover from: at most five Now lines, Held and `workers`, with no history. | 2026-11-09 | [work package](standard-work-package.md#45-the-state), [roles](standard-roles.md#45-role-fields) | In force |
| PACKAGE-DECISIONS | Decisions live in the change document they belong to until each goes to its durable home and the change is deleted; open points live in its Open section. | 2026-11-09 | [work package](standard-work-package.md#46-change-documents) | In force |
| PACKAGE-REPOSITORIES | `_index.md`'s front matter carries `repositories:`, the repositories the package mainly works in, with a Scope line saying it may still change others. | 2026-11-09 | [work package](standard-work-package.md#44-the-entry-file) | In force |
| PACKAGE-MESSAGES | Messages between work live in the Agora store, through its MCP; a package keeps no message queue of its own. | 2026-11-09 | [work package](standard-work-package.md#48-messages) | In force |
| AGORANOMOS-ROLE | The agoranomos joins the role catalogue as a leader, glyph 🏺, keeping the state of every work package in the Agora store from `agora.sop.main`, the root of its work tree. | 2026-11-10 | [roles](standard-roles.md#43-role-catalogue) | In force |
| PACKAGE-TIDY | The tidy's ten steps bring each package to the shape, ending with a rubric check and a short report. | 2026-11-09 | [work package](standard-work-package.md#410-the-tidy) | In force |
| TITLE-DROP | A package's `_index.md` carries no `title` field; its id and its place in the tree name it, and a view works out a place's words from them (TITLE-WORDS). Kris, relayed by the Cairn summit's guardian from the summit's [change 43](https://github.com/krisb/ki-cairn-store/blob/main/work/cairn/cairn.summit/43-work-package-format-2.change.md). | 2026-11-13 | [work package](standard-work-package.md#44-the-entry-file) | In force |
| REMIT-IN-INDEX | Goals are a node's direction and Scope its remit, In what it may decide and do and Out what goes up; a node changes its own way of working where the change reaches only it and its children. Kris, relayed by the Cairn summit's guardian from the summit's [change 00](https://github.com/krisb/ki-cairn-store/blob/main/work/cairn/cairn.summit/00-authority-tree.change.md). | 2026-11-11 | [work package](standard-work-package.md#44-the-entry-file) | In force |
| AGORA-NAME, ROOT-ROLE, THREAD-GLYPH | Agora is renamed Cairn, and the store the Cairn store; the root's role is the guardian, glyph 🪨, seated at `cairn.summit`, in place of the agoranomos and its amphora. Kris, 11 November, relayed by the Cairn summit's guardian from the summit's [change 05](https://github.com/krisb/ki-cairn-store/blob/8e4746657458d41bc47aeba994cde9412e08a535/work/cairn/cairn.summit/05-cairn.change.md). | 2026-11-11 | [roles](standard-roles.md) and [work package](standard-work-package.md) | In force |
| SEAT-LINE | A seat working in a package without its keys closes with `<role glyph> <work-id>+<role>`: its catalogue glyph, no 🔑, and its seat address; 🔑 stays the keyholder's alone. Kris, 14 November, in conversation, accepting Wayland's `📐 ki.cairn+architect` and `🎨 ki.cairn+illustrator` for sitting D of `cairn.wayfinder.designs`. | 2026-11-14 | [roles](standard-roles.md#46-thread-line) | In force |
| OPENER-NAME | Every brief or opener that starts a new agent session names the thread line it is to take and tells the session to rename itself to that line as its first act, `/rename <thread line>` in Claude Code; a background run needs none. Kris, 14 November, in conversation: "when we give out briefs to instruct new agents like this, that we make it clear what its name is". | 2026-11-14 | [roles](standard-roles.md#46-thread-line) | In force |

[Back to contents](#contents)

## 4. Last review

- 2026-11-14 - After Kris took SEAT-LINE a and OPENER-NAME a in conversation that day: the [thread line](standard-roles.md#46-thread-line) gains its keyless form, `<role glyph> <work-id>+<role>`, for a seat working in a package without its keys, settling the seat address the section had left to the seat rules, and every opener that starts a session names its line and has the session rename itself first. `ki-coordination`, `ki-meeting`, `ki-delegation`, `ki-work` and `ki-keystone` point here. No external source refreshed.
- 2026-11-10 - Under `agora.sop.main`, after Kris took AGORANOMOS-ROLE in its coordination change that day: the role catalogue gains the agoranomos, a leader with glyph 🏺 that keeps the state of every work package from `agora.sop.main`. With `ki agent` removed in `tools-ki` v0.15.0, the close-out deletes the package with no `ki agent close` step, identity reaches a session through its agent host, and the delegation row names the run packet without a state folder, launcher or close gate. No external source refreshed.
- 2026-11-09 - Landed the [work package format change](#3-decisions), phase 1, agreed by Kris on 9 November 2026: a package lives in the Agora store at `work/<territory>/<work id>/` and is its `_index.md` and its `NN-<slug>.change.md` change documents, with sub-packages of the same shape; the state folds into `_index.md`; decisions and open points live in their change document; `repositories:` names where it works; messages go through the Agora store; and the tidy brings each package to the shape. `standards-work-package.md` and `standards-roles.md` became `standard-work-package.md` and `standard-roles.md` in the standard format, and the finished entry-file migration file was deleted. No external source refreshed.
- 2026-11-08 - Under run `work-review-retire` of `ki.reg.guilds`, after Kris's WORK-REVIEW-RETIRE at 21:47 GMT that day, "do it now", following "delete `+/_WORK_REVIEW`" a minute earlier: the `+/_WORK_REVIEW/` holding area MIGRATION-REVIEW set on 18 October 2026 is retired. Live work is a package in `+/_WORK/`, the rest is deleted, and FOLDER-5 warns on a leftover area during the rollout, under one deletable line in `standards-roles-migration.md`. No external source refreshed.
- 2026-11-08 - Under run `doc-types` of `ki.reg.guilds`, after Kris took DOC-TYPES a and STD-BASE a at 22:05 CET that day, relayed by `personal.reg.inbox`: the closed list's design note becomes the change document, `<slug>.change.md`, the `ki-authoring` document type carrying `Base:` and `Touches:`; an existing `.design.md` file stays readable during the rollout under the closed list's migration footnote.
- 2026-11-08 - Under run `harness-index` of `ki.reg.guilds`, after Kris's INDEX-ENTRY that day, relayed by `personal.reg.inbox`: "a good time to change that now, put it into the standard". A package's entry file is `_index.md`, was `work.md`, with the same front matter and content, so that it sorts first. Checks read either name during the rollout, prefer `_index.md` and fail a folder holding both, under the deletable `standards-index-entry-migration.md`.
- 2026-11-07 - Under run `batch-finish` of `ki.reg.guilds`, after Kris took RECAP-NARROW a) and HELD-VS-RECORD a) that day: `ki-recap` has no checkpoint composition, so a hand-off update goes through the update lifecycle alone, and Held keeps only work waiting on a named decision or event while deferred deliverable work becomes a triage record through `ki-next`, matching `ki-coordination`. No external source refreshed.
- 2026-11-07 - Under run `doer-lessons` of `ki.reg.guilds`, from the lessons Kris asked to be made durable through Claude Design (CD-63) and the illustrator (ILL-26) to `ki.prj.agora`, routed as MSG-991aa6ad and MSG-275b0e5b: Messages lines gain the fresh-pull, keep-both-sides rule for `messages.md` and the writer's-clock rule for a line's time. The seat-to-seat protocol the two makers used is left to Kris as a query.
- 2026-11-07 - Under run `orca-land` of `ki.reg.guilds`, after Kris took REPORT-HOME a) that day: the steward's entry point gains an Orca worker's report copied in at receive, the `ki-delegation` run packet's one named exception to the launcher as only writer.
- 2026-11-07 - Under STAGE-C-ROLES, Kris at 02:30 GMT on 7 November 2026: "land the role catalogue and role glyphs first, end to end", with the catalogue in this skill. Added `standards-roles.md` and the deletable `standards-roles-migration.md`, `work.md`'s required `role` and `state.md`'s `workers`, checked by RECORD-2 against the catalogue table. Taken with the reviewed options under ROLES-WRITE the same night: one role per seat ("it isn't a multi-role"), no `uri` in `workers` (WORKERS-URI, "Drop it"), and no seat address yet. This is an in-house decision review; no external source refreshed.

2026-11-06 - Under INBOX-RENAME from `personal.reg.inbox-terra`, at Kris's word ("Do full rename to inbox now and coordinate that"), the assistant repository became the Inbox: `krisb/assistant` is now `krisb/inbox`, its packages `personal.reg.inbox-terra` and `personal.reg.inbox-sol`, and its store `sources-inbox`. Live wording here follows; older lines below keep the names they had.

2026-10-31 - Reviewed Kris's FEEDBACK-AS-MESSAGE direction of 31 October 2026 in the `ki.prj.ways-of-working` decisions log: "we can probably drop the feedback idea. We just send a message with it instead." Owner feedback on a document now arrives as a `messages.md` line, by the owner's hand or written word for word by the steward with the owner named as speaker; the hand-written and steward-written feedback packages admitted under READ-FEEDBACK-NOW earlier that day are withdrawn, and the Observatory's `feedback-send` packages stay readable for the tolerance window. This is an in-house decision review; no external source was refreshed.

- 2026-11-05 - Reviewed MSG-SECTIONS, Kris's "standard first, then roll out" of about 23:05 GMT on 4 November 2026 relayed by `personal.reg.household-terra`, with RECORD-2-HEADINGS from `personal.reg.assistant-sol` and part 2 of its session-coordination spec: `messages.md` keeps `## Inbound` and `## Outbound`, ACK lines at the top of Inbound, sent lines in Outbound until acknowledged, and short `MSG-` ids; RECORD-2 accepts both shapes now and warns on the H1-only file for the tolerance window. Also INDEX-NAME, State of play settling `_index.md` as each focus folder's entry file at Kris's lean (ATER-006), with `index.md` warned on for its tolerance window. This is an in-house decision review; no external source was refreshed.
- 2026-10-31 - Reviewed Kris's READ-FEEDBACK-NOW answer, taken a) under ACCEPT-BY-CRITERIA on 31 October 2026 in the `ki.prj.ways-of-working` decisions log, and the `design/package-layout/design.md` note's reading-and-feedback section. Feedback packages may now be written by the owner by hand, or by the work's own steward verbatim from the owner's words, alongside the Observatory's `feedback-send`; the package names the owner as speaker and keeps any later reading apart. This is an in-house decision review; no external source was refreshed.
- 2026-10-25 - Reviewed Kris's FINDINGS-SECTION answer in `ki.ways-of-working/decisions.md` and the coordination standard's owner-report Findings retention. The existing `findings/<tag>.md` form is admitted by the work-package closed list and FOLDER-1, read with the package, retained while open and settled before tidy or close-out. This is an in-house contract review; no external source refreshed.
- 2026-10-25 - Reviewed Kris's 24 and 25 October answers in the `ki.ways-of-working` decisions log and the `model-shape-report.md`, `overview.md` and `unattended-work.md` designs under `wow-harness-model-2`. Explicit assigned stewardship and acknowledged handover, package homes, parent and covers relations, host requirements and reporting-package homing; STEWARD-FIELD remains a placeholder. This is an in-house decision review; no external source was refreshed.
- 2026-10-23 — Under `wow-method-enact`, the reviewed [method-feedback proposal](https://github.com/knowledgeislands/ki-principal/blob/0fe1e199671d3cee55f6434a46b8daeed805dfb1/+/_WORK/ki.ways-of-working/design/method-feedback.md) and [coordination-lessons proposal](https://github.com/knowledgeislands/ki-principal/blob/f1ca327e10b8e99d98acf0baaebbe71d78a8b285/+/_WORK/ki.ways-of-working/design/coordination-lessons.md) support minimal five-file On hold package creation by an authorised first sender or State of play for an absent registered Project, with the first message queued and release left to the owner-opened coordinator. The wider unattended-wake service, DRAIN-END, medium-confidence Cloudflare credential proposal and unconfirmed standing rules remain deferred. This is an in-house policy review; no external source was refreshed.
- 2026-10-19 — Under the `no-alias-sweep` brief, after Kris answered NO-ALIAS on 19 October: "we no longer support `ki-work-folder` - lets just get it renamed. lets live with any fall out". The deprecated `ki-work-folder` alias, its `[skills.ki-work-folder]` coverage reading and `ki-coordination`'s optional dependency are removed; `ki-work-package` is again a required dependency of `ki-coordination`.
- 2026-10-19 — Under the `work-package-standard` brief, after Kris's answers on 19 October: PACKAGE-NAME, "I want `ki-work-package` please, where it lives is a folder"; STATE-FILE and FILES-AT-CREATION, five files all created at once; and WORK-QUEUE-PRIORITY, a queue taken in priority order with an important flag taken first. The skill was renamed from `ki-work-folder`, which stays a deprecated alias for the tolerance window, and its checks accept both the package and the single-file shape until the migration pass closes the window.
- 2026-10-17 — Under the `restart-standard` brief, after Kris answered RESTART-AGREE in the `ways-of-working` thread: "Agree the restart design section 1 as written". Another coordinating thread may add one line to a coordination checkpoint's messages block without it counting as an update, and a coordinating checkpoint gains its `role` at the latest on its `FIRST-STEP` line at restart, after RUN-HYGIENE: "each thread fixes its checkpoint form and adds role on its FIRST-STEP line at restart".
- 2026-10-15 — Adopted the ` > ` thread label form, `<Space> > <Initiative> > <project in words>`, `<Space> > SoP` and `<Space> > <topic>`, from the thread list Kris showed on 2026-10-15 and approved with "this is a better way I think", and the host suffix in his words "no, the machine is only added if its limited to that machine, so intake and chezmoi misc are machine specific". Earlier labels stay valid until the owner approves each change; the transition mapping sits in Thread label.
- 2026-09-15 — Simplified the lifecycle to active records plus explicit deletion, with Git as the only recovery history. This establishes the authored safety contract only; it does not prove a successful fresh-agent reconstruction trial or that the six-section schema outperforms a smaller record.
- Current runtime resume and compaction features are supporting platform context, not part of the portable checkpoint contract and not evidence that one system can generate or activate another.

[Back to contents](#contents)
