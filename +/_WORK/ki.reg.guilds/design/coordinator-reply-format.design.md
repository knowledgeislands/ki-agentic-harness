# Coordinator reply format — as at 2026-11-07T14:12:48Z

## Contents

- [1. Introduction](#1-introduction)
- [2. Scope](#2-scope)
  - [2.1 In scope](#21-in-scope)
  - [2.2 Out of scope](#22-out-of-scope)
- [3. Terms and definitions](#3-terms-and-definitions)
- [4. Outline](#4-outline)
  - [4.1 Triggers](#41-triggers)
  - [4.2 Structure–part matrix](#42-structurepart-matrix)
  - [4.3 Part content](#43-part-content)
    - [4.3.1 Heading block](#431-heading-block)
      - [4.3.1.1 H1 Heading](#4311-h1-heading)
      - [4.3.1.2 H2 Form line](#4312-h2-form-line)
      - [4.3.1.3 H3 Opening note](#4313-h3-opening-note)
      - [4.3.1.4 H4 Rule](#4314-h4-rule)
    - [4.3.2 Body block](#432-body-block)
      - [4.3.2.1 B1 Answer](#4321-b1-answer)
      - [4.3.2.2 B2 Summary](#4322-b2-summary)
      - [4.3.2.3 B3 Status](#4323-b3-status)
      - [4.3.2.4 B4 Findings](#4324-b4-findings)
      - [4.3.2.5 B5 Queries](#4325-b5-queries)
      - [4.3.2.6 B6 Reply block](#4326-b6-reply-block)
    - [4.3.3 Footer block](#433-footer-block)
      - [4.3.3.1 F1 Art](#4331-f1-art)
      - [4.3.3.2 F2 Banner heading](#4332-f2-banner-heading)
      - [4.3.3.3 F3 Counts line](#4333-f3-counts-line)
      - [4.3.3.4 F4 Roadmap line](#4334-f4-roadmap-line)
      - [4.3.3.5 F5 Package line](#4335-f5-package-line)
      - [4.3.3.6 F6 Item list](#4336-f6-item-list)
      - [4.3.3.7 F7 Heading-for line](#4337-f7-heading-for-line)
      - [4.3.3.8 F8 Listening line](#4338-f8-listening-line)
      - [4.3.3.9 F9 Thread line](#4339-f9-thread-line)
- [5. Example](#5-example)
- [6. Changes](#6-changes)
- [7. Open](#7-open)
  - [7.1 To decide](#71-to-decide)
  - [7.2 To cover](#72-to-cover)
  - [7.3 Consequences](#73-consequences)

## 1. Introduction

Design note, agreed with Kris on 7 November 2026, for the coordinator reply format: the heading block, body block and footer block of every reply in a coordinator session. It changes nothing in the standard; the standard today is the harness's `skills/change-management/ki-coordination/references/standards-coordination.md` (Banner) and `standards-report-forms.md` (The Summary, Banner detail).

[Back to contents](#contents)

## 2. Scope

This is the **coordinator reply format**. Each reply it governs takes one of four **layouts**, Full, Medium, Short or Minimal, set by what reply structure it is.

### 2.1 In scope

- Every reply in a coordinator session: reports, ordinary answers, timed one-line updates and wake lines.
- A run report: the final report a run, a background agent the coordinator launched, writes into the work package. The run writes it itself, in the Medium layout; no trigger chooses it.
- The blocks and parts of a reply, the layouts, and when each layout applies.

> **Deltas**
>
> - **Agreed** [change 5](#6-changes): the scope is stated once, for every coordinator reply, timed updates and wake lines included as Minimal replies.

### 2.2 Out of scope

- A conversational session, with no coordinating opener: it uses the plain conversational reply, and the owner report without heading block or footer when a unit of work ends.
- A background agent's own replies while it works, which follow its brief; only its final run report is in scope.
- What each state's banner content is: that stays in the standard's table of states.
- The shape of brief, report and design-note files as documents: see [design-document-format.design.md](design-document-format.design.md).
- The **communication level**, quiet, standard or detailed: it never changes the layout and governs only the wording inside B1, the Answer. No Knowledge Islands standard defines the levels yet; they are set in the owner's personal communication preferences.

[Back to contents](#contents)

## 3. Terms and definitions

Terms only: the things the format is built from. The reply structure is a term; the structures themselves, such as Summary or Stop, are items within the format and live in [4.1](#41-triggers). Each definition ends with the standard that defines the term, or says there is none yet.

| Term | Definition |
| --- | --- |
| **Session** | A runtime instance acting on work. Some runtimes call it a thread or a chat; _thread_ survives only in the fixed names **thread line** (F9) and host sync thread. **Standard:** [`ki-coordination` glossary](/Users/krisbrown/.local/share/ki/harnesses/knowledgeislands/ki-agentic-harness/skills/change-management/ki-coordination/references/standards-coordination.md#glossary) |
| **Coordinator session** | A session the owner explicitly opened or resumed as a coordinator under `ki-coordination`, on a valid work package. Older text calls it a coordinating thread. **Standard:** [`ki-coordination` glossary](/Users/krisbrown/.local/share/ki/harnesses/knowledgeislands/ki-agentic-harness/skills/change-management/ki-coordination/references/standards-coordination.md#glossary) |
| **Reply** | One message from the coordinator to the owner in that session. **Standard:** [`ki-coordination` Reply forms](/Users/krisbrown/.local/share/ki/harnesses/knowledgeislands/ki-agentic-harness/skills/change-management/ki-coordination/references/standards-reporting.md#reply-forms) |
| **Coordinator reply format** | The format this design defines: the blocks and parts of a coordinator reply, and the layouts that select them. **Standard:** None yet; this design, from [1. Introduction](#1-introduction), graduates into `ki-coordination` |
| **Trigger** | What a reply meets that sets its reply structure, and so its layout, matched on a signal, tried in order of precedence, the first met winning. **Standard:** None yet; defined in this design at [4.1 Triggers](#41-triggers) |
| **Signal** | What a trigger is matched on: a **Phrase** in your message, the work's **State**, the **Time** of your messages and the last Full reply, or a **Move** the coordinator makes. **Standard:** None yet; defined in this design at [4.1 Triggers](#41-triggers) |
| **Layout** | The depth of a reply, which sets the blocks and parts it carries: **Full**, **Medium**, **Short** or **Minimal**, deepest to shallowest. **Standard:** None yet; defined in this design at [4.1 Triggers](#41-triggers) and [4.2 Structure–part matrix](#42-structurepart-matrix) |
| **Reply structure** | A specialisation of a layout, saying what the reply is, such as Summary, Status or Stop. Each reply structure has one layout, its depth; the structure decides which parts appear and how each part is shaped. **Standard:** None yet; defined in this design at [4.1 Triggers](#41-triggers), [4.2 Structure–part matrix](#42-structurepart-matrix) and [4.3 Part content](#43-part-content) |
| **Block** | A group of parts, in order: **Heading block** (H), **Body block** (B), **Footer block** (F). **Standard:** None yet; defined in this design at [4.2 Structure–part matrix](#42-structurepart-matrix) |
| **Part** | One coded element of a block: H1 to H4, B1 to B6, F1 to F9. **Standard:** None yet; defined in this design at [4.2 Structure–part matrix](#42-structurepart-matrix), one row per part |
| **Banner** | F2 to F9: the state, counts, items, modes and thread line. Full carries all of it; Medium and Short leave out F4 and F5. **Standard:** [`ki-coordination` Banner](/Users/krisbrown/.local/share/ki/harnesses/knowledgeislands/ki-agentic-harness/skills/change-management/ki-coordination/references/standards-coordination.md#banner) |
| **Mark** | The point in time the work was last marked, which only you move, with `mark`, `mark only` or `mark, status only`, or by a hold; a Summary covers the window from the last mark. Which triggers move it is at [4.1 Triggers](#41-triggers). **Standard:** [`ki-coordination` The mark](/Users/krisbrown/.local/share/ki/harnesses/knowledgeislands/ki-agentic-harness/skills/change-management/ki-coordination/references/standards-mark.md#the-mark) |
| **State** | One of the work's seven states, such as With worker or On hold; shown only in F2. **Standard:** [`ki-coordination` States and moves](/Users/krisbrown/.local/share/ki/harnesses/knowledgeislands/ki-agentic-harness/skills/change-management/ki-coordination/references/standards-coordination.md#states-and-moves) |
| **Holder** | Who an item is with: 👤 the owner, 🤖 a worker or run, 🧵 another session, 🌐 the outside world. **Standard:** [`ki-coordination` The Summary](/Users/krisbrown/.local/share/ki/harnesses/knowledgeislands/ki-agentic-harness/skills/change-management/ki-coordination/references/standards-report-forms.md#the-summary) |
| **Time** | Always in your local time, in one of two forms, each part choosing which in its entry in [4.3](#43-part-content): a **friendly time**, saying the day where it is not today, as in `10:30 GMT`, `yesterday 18:05 GMT` or `Thu 5 Nov 09:12 GMT`; or a **timestamp**, ISO 8601 with its offset, as in `2026-11-07T10:30+00:00`, the fallback wherever a friendly time does not fit. **Standard:** None yet; defined in this design |

> **Deltas**
>
> - **Agreed** [change 2](#6-changes): **session** replaces _thread_, and **coordinator session** replaces _coordinating thread_; _thread line_ keeps its name.
> - **Agreed** [change 3](#6-changes): **layout**, **block** and **part** are new terms; the four layouts replace the long and short footer; **reply structure** replaces _form_, with the structures themselves in [4.1](#41-triggers); _report_ is not a term.
> - **Agreed** [change 4](#6-changes): **holder** stays the term; the outside world's glyph becomes 🌐, leaving ⏳ to mean queued.
> - **Agreed** [change 24](#6-changes): **time** is a new term, with two forms, a friendly time and an ISO 8601 timestamp.

[Back to contents](#contents)

## 4. Outline

How a coordinator reply is built: the triggers that set its layout and kind, the blocks and parts in order, which blocks and parts each reply structure carries, and what each part carries.

### 4.1 Triggers

Each **trigger** sets exactly one **reply structure**, which enables the parts under [4.2](#42-structurepart-matrix); each part then reacts to the structure, the state and the mark, under [4.3](#43-part-content). A reply tries the triggers from [T1](#41-triggers) down, and **the first met wins**.

| Trigger | Signal | When | Structure |
| --- | --- | --- | --- |
| T1 | Time | **Gap:**<br>Either your message arrives `USER_LAST_MESSAGE` minutes or more after your previous one, while at least one query is with you; or no Full reply has been given for `SINCE_LAST_SUMMARY` minutes, met by the next reply. `USER_LAST_MESSAGE` is 30 and `SINCE_LAST_SUMMARY` is 120 by default | Summary |
| T2 | Move | **Session start:**<br>The first reply after the coordinating opener, or after a compaction once re-anchored | Bootstrap |
| T3 | Move | **Work stops:**<br>The coordinator commits the Project's close, or a hold or snooze after `pause`, `done for now` or `snooze` | Stop |
| T4 | Phrase | **Short phrases:**<br>`mark only`, `where are we`, `where does it stand` or `what's the state` | Position |
| T5 | Phrase | **Status phrases:**<br>`status` or `mark, status only` | Status |
| T6 | Phrase, Move or State | **Summary asks and events:**<br>Your phrase `mark`, `summary`, `summary since <time>`, `recap` or `full summary`; or the coordinator commits a send of the work to you or another target, or the last running or queued run the work dispatched finishes; the latter is met until a reply it wins | Summary |
| T7 | Move | **Other change of state:**<br>The coordinator commits any other change of state: a receive such as `with me`, a `resume`, the start of a drain | Position |
| T8 | Move | **Update:**<br>A timed update falls due under the update cadence, or a wake, by timer or inbox | Update |
| T9 | Phrase | **Anything else:**<br>Your message, when it meets no other trigger | Answer |

Each trigger is matched on a **signal**, or for [T6](#41-triggers) on any of three:

- **Phrase:** a line of your message that is exactly the phrase, ignoring case, spaces and a trailing full stop; `<time>` matches any time.
- **State:** the work's runs, from `ki agent status` and the package.
- **Time:** the times of your messages and of the last Full reply.
- **Move:** something the coordinator commits, or a wake.

Two things sit outside the triggers. The [mark](/Users/krisbrown/.local/share/ki/harnesses/knowledgeislands/ki-agentic-harness/skills/change-management/ki-coordination/references/standards-mark.md#the-mark) belongs to the standard: it moves on a hold and on the `mark` phrases, and shows only in H2 and B2. A **run report** is written by the run itself, in Medium, under [2.1](#21-in-scope).

> **Deltas**
>
> - **Agreed** [change 14](#6-changes): Stop, [T3](#41-triggers), folds into Medium's body shape.
> - **Agreed** [change 21](#6-changes): nine coded triggers, [T1](#41-triggers) to [T9](#41-triggers), each matched on a signal with exact phrases and setting one reply structure, tried in order, the first met winning; Position and Update are new; the re-bootstrap report becomes Bootstrap, and the hold and finish reports become one, Stop.
> - **Agreed** [change 22](#6-changes): [T4](#41-triggers)'s phrases are a finite list, grown as wordings that miss are noticed.
> - **Agreed** [change 23](#6-changes): the gaps, `USER_LAST_MESSAGE`, 30 minutes, and `SINCE_LAST_SUMMARY`, 120 minutes, change only when you ask in the session; a process such as setting up an unattended window may ask you what they should be.

### 4.2 Structure–part matrix

Which blocks and parts each reply structure carries, one column per structure with its layout, its depth, beneath its name. The three blocks always run in this order, each left out where none of its parts appear:

- **Heading block:** which work this is and which report.
- **Body block:** what the reply says, what happened and what you need to decide. B1, the Answer, holds whatever the reply says that no other part covers; the parts after it are the report's own.
- **Footer block:** where the work stands and whose move it is, read bottom up. Its **banner** is F2 to F9.

Each **block** row groups the parts beneath it. Each **part**: ● required, ○ optional, or left empty where it is not used. What each part carries, an optional part's condition, and how the structure, the state and the mark shape a part, are in its entry in [4.3](#43-part-content), linked from its code.

| Part | Summary<br>_Full_ | Status<br>_Full_ | Bootstrap<br>_Medium_ | Run report<br>_Medium_ | Stop<br>_Medium_ | Position<br>_Short_ | Update<br>_Minimal_ | Answer<br>_Minimal_ |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **Heading block** |  |  |  |  |  |  |  |  |
| [**H1**](#4311-h1-heading) · Heading | ● | ● | ● | ● | ● |  |  |  |
| [**H2**](#4312-h2-form-line) · Form line | ● | ● | ● | ● | ● |  |  |  |
| [**H3**](#4313-h3-opening-note) · Opening note | ○ | ○ | ○ | ○ | ○ |  |  |  |
| [**H4**](#4314-h4-rule) · Rule | ● | ● | ● | ● | ● |  |  |  |
| **Body block** |  |  |  |  |  |  |  |  |
| [**B1**](#4321-b1-answer) · Answer | ○ | ○ | ○ | ○ | ○ | ○ | ● | ● |
| [**B2**](#4322-b2-summary) · Summary | ● |  | ● | ● | ● |  |  |  |
| [**B3**](#4323-b3-status) · Status | ● | ● | ● | ● | ● |  |  |  |
| [**B4**](#4324-b4-findings) · Findings | ○ | ○ | ○ | ○ | ○ |  |  |  |
| [**B5**](#4325-b5-queries) · Queries | ● | ● | ● | ● | ● |  |  |  |
| [**B6**](#4326-b6-reply-block) · Reply block | ○ | ○ | ○ | ○ | ○ |  |  |  |
| **Footer block** |  |  |  |  |  |  |  |  |
| [**F1**](#4331-f1-art) · Art | ○ | ○ |  |  |  |  |  |  |
| [**F2**](#4332-f2-banner-heading) · Banner heading | ● | ● | ● | ● | ● | ● |  |  |
| [**F3**](#4333-f3-counts-line) · Counts line | ● | ● | ● | ● | ○ | ● |  |  |
| [**F4**](#4334-f4-roadmap-line) · Roadmap line | ● | ● |  |  |  |  |  |  |
| [**F5**](#4335-f5-package-line) · Package line | ● | ● |  |  |  |  |  |  |
| [**F6**](#4336-f6-item-list) · Item list | ● | ● | ● | ● | ● | ● |  |  |
| [**F7**](#4337-f7-heading-for-line) · Heading-for line | ○ | ○ | ○ |  | ○ | ○ |  |  |
| [**F8**](#4338-f8-listening-line) · Listening line | ● | ● | ● |  | ○ | ● |  |  |
| [**F9**](#4339-f9-thread-line) · Thread line | ● | ● | ● | ● | ● | ● |  |  |

● required · ○ optional, on its condition in [4.3](#43-part-content) · empty: not used.

> **Deltas**
>
> - **Agreed** [change 1](#6-changes): a structured outline: three named blocks, heading block, body block and footer block, each part coded.
> - **Agreed** [change 20](#6-changes): whatever the reply says that the format's other parts do not cover is stated in one part, the **Answer**; where it sits is set in the parts that follow.
> - **Consequence** [2](#73-consequences): the `ki-coordinator` output style's answer-first rule is rewritten: the answer follows the heading block, as B1.
> - **Agreed** [change 6](#6-changes): four fixed layouts, Full, Medium, Short and Minimal, replace the long and short footer; Minimal has no footer.
> - **Agreed** [change 11](#6-changes): F3, F4 and F8 show always or never, by reply structure.

### 4.3 Part content

Each part in full: what it carries, its form, when it appears and how the reply structure shapes it, and the changes agreed or open for it. Its rules are still to be worked through, part by part.

#### 4.3.1 Heading block

##### 4.3.1.1 H1 Heading

Which work this is, linked.

**Shaped by reply structure:** a [Run report](#41-triggers) adds `› <run name>`.

```text
# [<Territory or theme>](<local note>) › State of play
```

> **Deltas**
>
> - **Agreed** [change 15](#6-changes): H1 keeps today's rule.

##### 4.3.1.2 H2 Form line

Which reply structure, when it was given, and the window or mark.

**Shaped by reply structure:** names the reply structure.

**Shaped by the mark:** a hold's mark ends it `mark <time>`.

**Times:** friendly times, so `last mark` says the day where it is not today, as in `last mark yesterday 18:05 GMT`.

```text
**Summary at <now> · last mark <mark time>**
```

> **Deltas**
>
> - **Agreed** [change 7](#6-changes): H2 drops the state, and `last mark` replaces `since`.
> - **Agreed** [change 24](#6-changes): friendly times, naming the day where it is not today.

##### 4.3.1.3 H3 Opening note

Context worth putting high up, ahead of the body: an outline of the Answer, or anything unusual nothing else shows; the rest of the Answer stays in [B1](#4321-b1-answer).

**Appears when:** the reply has such context; otherwise it is left out.

```text
<one or two lines of context>
```

> **Deltas**
>
> - **Agreed** [change 16](#6-changes): H3 is optional, context put high up, splitting off an outline of the Answer where that helps.

##### 4.3.1.4 H4 Rule

`---`, which closes the heading block.

```text
---
```

#### 4.3.2 Body block

##### 4.3.2.1 B1 Answer

Anything the reply says that no other part of the format covers, in its own words and with any normal sections: an answer to the owner's message, an explanation, a short table. Present only when there is such content: a reply to a bare `summary` may have none, its Summary being B2.

**Appears when:** the reply says something no other part covers. In Minimal it is the whole reply, so always there.

```text
<anything the reply says that no other part covers>
```

##### 4.3.2.2 B2 Summary

What changed since the last mark. Medium calls it Done.

**Shaped by reply structure:** in every Medium kind, it is headed Done.

```text
## Summary

**<bold headline: what the window came to>**

- <one line per thing that changed since the last mark, or: Nothing changed.>
```

> **Deltas**
>
> - **Agreed** [change 8](#6-changes): the heading is `## Summary`, with no time.

##### 4.3.2.3 B3 Status

The full board of live items. Medium calls it In Progress.

**Shaped by reply structure:** in every Medium kind, it is headed In Progress.

**Shaped by state:** on hold, Left over comes here.

```text
## Status

| Focus | Where it stands |
| --- | --- |
| **<focus id>** ⭐<br><focus line> | **<state in a few words>**<br>🤖 <run work>; next: <step><br>👤 <with you>: <TAG> |
```

> **Deltas**
>
> - **Agreed** [change 14](#6-changes): a on hold, Left over comes here.

##### 4.3.2.4 B4 Findings

Findings you asked for, while one is open.

**Appears when:** a findings request is open.

```text
## Findings
```

##### 4.3.2.5 B5 Queries

Each decision you need to make, in full.

**Shaped by state:** on hold, Parked comes here, one line each.

```text
## Queries

### <TAG> - <plain title>

**Context:** <enough to decide without reading anything else>

**Query:** <one sentence>

**Options:**

a) (recommended, confidence <level> - <reason>) <the course>

b) <the alternative>
```

> **Deltas**
>
> - **Agreed** [change 14](#6-changes): a on hold, Parked comes here, one line each.

##### 4.3.2.6 B6 Reply block

The tags and letters, ready to copy.

**Appears when:** at least one query is in B5.

````text
```text
<TAG> a
```
````

> **Deltas**
>
> - **Agreed** [change 17](#6-changes): the reply block returns, whenever there is a query.
> - **Consequence** [3](#73-consequences): bringing it back revisits REPLY-BLOCK.

#### 4.3.3 Footer block

The banner is F2 to F9.

> **Deltas**
>
> - **Consequence** [5](#73-consequences): rendered surfaces check they still read the new F2 to F9.

##### 4.3.3.1 F1 Art

The Knowledge Islands drawing and its scroll.

**Appears when:** you have not asked for `no art`.

```text
<Knowledge Islands art; scroll: KNOWLEDGE ISLANDS>
```

> **Deltas**
>
> - **Agreed** [change 9](#6-changes): the scroll drops state, counts and time.
> - **Agreed** [change 18](#6-changes): the scroll says only KNOWLEDGE ISLANDS; the art stays as a visible marker and can go later without touching anything else.
> - **Consequence** [4](#73-consequences): Agora is told of the change.

##### 4.3.3.2 F2 Banner heading

The state, and when the work entered it.

```text
### <glyph state> · at <time the work entered this state>
```

> **Deltas**
>
> - **Agreed** [change 10](#6-changes): the only place the state appears.

##### 4.3.3.3 F3 Counts line

Running, queued, with you, blocked and parked.

**Appears when:** unless the work is Finished.

**Shaped by state:** the state sets the content: a paused hold's is `⏸️ drained · 🅿️ <n> queries parked`, a snoozing hold's `💤 waiting for a message · …`.

```text
🤖 <n> running · ⏳ <n> queued · 👤 <n> with you · ⛔ <n> blocked · 🅿️ <n> parked
```

> **Deltas**
>
> - **Agreed** [change 19](#6-changes): all five views, zeros written.
> - **Consequence** [4](#73-consequences): Agora is told of the change.

##### 4.3.3.4 F4 Roadmap line

The roadmap's record counts.

```text
🗺️ roadmap · <n> records · <n> open · <n> done awaiting prune · <n> ideas
```

> **Deltas**
>
> - **Agreed** [change 19](#6-changes): `🗺️ roadmap · none` where there is no roadmap.
> - **Consequence** [4](#73-consequences): Agora is told of the change.

##### 4.3.3.5 F5 Package line

Inbox, outbox, held and awaiting ACK.

```text
📦 package · inbox <n> · outbox <n> · held <n> · awaiting ACK <n>
```

> **Deltas**
>
> - **Consequence** [4](#73-consequences): Agora is told of the change.

##### 4.3.3.6 F6 Item list

One line per live item.

**Shaped by state:** On hold lists only `[parked]` and `[release]`; Finished lists `[finished]`.

```text
- [<state>] <what> · <holder> · at <time>
```

> **Deltas**
>
> - **Agreed** [change 12](#6-changes) · [change 13](#6-changes): items end `· at <time>`, and carry no `[awaiting ACK]` items.

##### 4.3.3.7 F7 Heading-for line

While heading for a hold or a handoff.

**Appears when:** the work is heading for a hold or a handoff.

```text
↪️ <draining or finishing> → <target>
```

##### 4.3.3.8 F8 Listening line

Whether the session watches its inbox.

**Appears when:** unless the work is Finished.

```text
<👂 listening | 🔇 not listening>
```

> **Deltas**
>
> - **Agreed** [change 19](#6-changes): `🔇 not listening` by default.

##### 4.3.3.9 F9 Thread line

Role glyph, 🔑 and work id, always last.

```text
<role glyph> 🔑 <work-id>
```

[Back to contents](#contents)

## 5. Example

A Full reply, with the reference codes in the right margin; they are not part of a reply.

````text
# [<Territory or theme>](<local note>) › State of play                         H1

**Summary at <now> · last mark <mark time>**                                 H2

<one or two lines of context; only when there is some>                       H3

---                                                                          H4

<anything the reply says that no other part covers; only when there is some>  B1

## Summary                                                                   B2

**<bold headline: what the window came to>**

- <one line per thing that changed since the last mark, or: Nothing changed.>

## Status                                                                    B3

| Focus | Where it stands |
| --- | --- |
| **<focus id>** ⭐<br><focus line from work.md> | **<state in a few words>**<br>🤖 <run work>; next: <step><br>🧵 <other package>: <what>; next: <step><br>🌐 <waiting on whom><br>👤 <with you>: <TAG> |

## Findings                                                                  B4

## Queries                                                                   B5

### <TAG> - <plain title>

**Context:** <enough to decide without reading anything else>

**Query:** <one sentence>

**Options:**

a) (recommended, confidence <level> - <reason>) <the course>

b) <the alternative>

```text                                                                       B6
<TAG> a
<TAG> a
```

<Knowledge Islands art; scroll: KNOWLEDGE ISLANDS>                            F1

### <glyph state> · at <time the work entered this state>                    F2

🤖 <n> running · ⏳ <n> queued · 👤 <n> with you · ⛔ <n> blocked · 🅿️ <n> parked   F3

🗺️ roadmap · <n> records · <n> open · <n> done awaiting prune · <n> ideas    F4

📦 package · inbox <n> · outbox <n> · held <n> · awaiting ACK <n>             F5

- [<state>] <what> · <holder> · at <time>                                    F6

↪️ <draining or finishing> → <target>                                        F7

<👂 listening | 🔇 not listening>                                            F8

<role glyph> 🔑 <work-id>                                                    F9
````

[Back to contents](#contents)

## 6. Changes

Every change against today's standard, agreed or proposed. Each **Deltas** call-out links the changes that touch its section.

| # | Where | Today | Change | Status |
| --- | --- | --- | --- | --- |
| 1 | [Structure](#42-structurepart-matrix) | Heading, sections, art and banner described separately | Three named blocks, heading block, body block and footer block, every part coded | Agreed |
| 2 | [Terms](#3-terms-and-definitions) | _Coordinating thread_, _the thread_ | **Coordinator session**, **session**; _thread line_ unchanged | Agreed |
| 3 | [Terms](#3-terms-and-definitions) | Long footer, short footer; _form_ for the kind of report | **Layout**: Full, Medium, Short, Minimal; **reply structure** for the kind of reply; **block** and **part** | Agreed |
| 4 | [Holder](#3-terms-and-definitions) | ⏳ for the outside world | 🌐 for the outside world; ⏳ means queued only | Agreed |
| 5 | [Scope](#21-in-scope) | Spread across the Banner section and reply forms | Stated once, for every coordinator reply, timed updates included | Agreed |
| 6 | [Layouts](#42-structurepart-matrix) | Footer required on any reply that moves the mark or gives state; plain answers have none | Four fixed layouts set by the reply structure; Minimal has no footer | Agreed |
| 7 | [H2](#4312-h2-form-line) | `<glyph state> · Summary at <now> · since <start>` | `Summary at <now> · last mark <mark>`, no state | Agreed |
| 8 | [B2](#4322-b2-summary) | `## Summary since <time>` | `## Summary` | Agreed |
| 9 | [F1](#4331-f1-art) | Scroll carries host, state, counts, date and time | No state, counts or time | Agreed |
| 10 | [F2](#4332-f2-banner-heading) | State and time repeated in H2 and F1 | Shown in F2 only | Agreed |
| 11 | [F3](#4333-f3-counts-line), [F4](#4334-f4-roadmap-line), [F8](#4338-f8-listening-line) | Shown only "where they apply" | Always or never, by reply structure | Agreed |
| 12 | [F6](#4336-f6-item-list) | Items end `· since <time>` | Items end `· at <time>` | Agreed |
| 13 | [F6](#4336-f6-item-list) | One `[awaiting ACK]` item per message | No items; the count stays in F5 | Agreed |
| 14 | [Stop](#41-triggers), [B3](#4323-b3-status), [B5](#4325-b5-queries) | Hold report has Done, Left over, Parked | Left over → B3, Parked → B5 | Agreed |
| 15 | [H1](#4311-h1-heading) | Theme › Project, State of play, run name | Unchanged | Agreed |
| 16 | [H3](#4313-h3-opening-note) | An opening note with no fixed rule | Optional: context put high up, such as an outline of the Answer, only when there is some | Agreed |
| 17 | [B6](#4326-b6-reply-block) | No reply block (REPLY-BLOCK) | Reply block returns, whenever there is a query | Agreed |
| 18 | [F1](#4331-f1-art) | Scroll carries host, state, counts, date and time | Scroll says only KNOWLEDGE ISLANDS | Agreed |
| 19 | [F3](#4333-f3-counts-line), [F4](#4334-f4-roadmap-line), [F8](#4338-f8-listening-line) | Counts line gives only the views that apply; roadmap line only where there is a roadmap; listening line only where the thread has the capability | All five views with zeros; `🗺️ roadmap · none`; `🔇 not listening` default | Agreed |
| 20 | [B1](#4321-b1-answer) | Answer the message first, then the Summary | Whatever the reply says that no other part covers goes in one part, the Answer (B1): first in the body, after the heading block; only when there is some; the whole body in Minimal | Agreed |
| 21 | [Triggers](#41-triggers) | Kinds of reply listed in prose under each footer, chosen by judgement; Short and Minimal replies unnamed | Nine coded triggers, [T1](#41-triggers) to [T9](#41-triggers), each matched on a signal and setting one reply structure, tried in order, the first met winning; Position and Update new; the re-bootstrap report renamed Bootstrap; the hold and finish reports one structure, Stop | Agreed |
| 22 | [T4](#41-triggers) | Any reply that answers where the work stands, by judgement | A finite list of phrases, grown as wordings that miss are noticed | Agreed |
| 23 | [T1](#41-triggers) | The first reply after 30 minutes or more without a message from you, while queries are with you | A gap of `USER_LAST_MESSAGE` minutes since your last message, while queries are with you, or `SINCE_LAST_SUMMARY` minutes without a Full reply; 30 and 120 by default, changed only when you ask in the session, and open to question by a process such as an unattended window | Agreed |
| 24 | [Time](#3-terms-and-definitions), [H2](#4312-h2-form-line) | Local time with its zone, such as `19:13 BST`, one form everywhere | Local time in two forms, a friendly time that names the day where it is not today and an ISO 8601 timestamp as the fallback, each part choosing which | Agreed |

[Back to contents](#contents)

## 7. Open

Nothing here stops the format being put in place now. It holds three kinds of point: to decide, to cover and consequences. Those to cover and the consequences are a firm commitment: the next round comes back to every one of them, whatever else is happening.

### 7.1 To decide

Nothing open: every point has been decided.

### 7.2 To cover

For later; listed so nothing is lost.

- **Interactive query pass:** the counter line, context and card layout when queries are taken one at a time.
- **Inserted lines:** the restart suggestion, placed directly before F2, and the `Rename thread:` line ending a Bootstrap's Done.
- **Times:** which form, friendly time or timestamp, each part uses, set in its entry in 4.3, and the three meanings of a time. The two forms themselves are agreed in change 24.
- **Identifiers and links:** full record ids, absolute-path links, pruned-record links.
- **Territory Summary:** one Summary over several packages, queries qualified by work id.
- **Communication levels:** no level shortens a layout; levels govern only the prose in B1.
- **Generated surfaces:** where the format is rendered from the standard, and the banner test that checks it.

Closed as unchanged, the standard's rule standing: width and rendering, about 90 columns, plain Markdown and `<br>` in table cells; saved reports, a report file versus a chat reply, old reports never rewritten.

### 7.3 Consequences

Outside this design, but set off by it. Each is to be thought about, deferred or delegated, not solved here.

1. **Formalise the document types: brief, report and design note.** Now its own design, [design-document-format.design.md](design-document-format.design.md), alongside this one. Today their names and shapes are spread across `ki-work-package` (where they live, rubric FOLDER-1), `ki-delegation` (`<name>.report.md`), `ki-coordination` (owner report, design-note guards) and `ki-work-design` (the design note's life cycle); `.design.md` is a convention, not a rule. Proposed approach: `ki-authoring` owns each document type's base shape and suffix, and each skill that produces one says it is formed on that type and adds only its own parts. Assessment: a good approach, medium-high confidence — one owner for each shape, and the skills stop restating it; the check is whether document types belong in the authoring standard or need their own home. **Moved** to that design. **From:** [2.2](#22-out-of-scope).
2. **The standard's own text.** Graduating this design rewrites the Banner section and the report-forms reference, regenerates the generated surfaces (the `ki-coordinator` output style among them) and updates the banner test. **Delegated** at graduation, as one run in the harness. **From:** [4.2](#42-structurepart-matrix).
3. **REPLY-BLOCK.** Bringing the reply block, B6, back revisits the decision that removed it, logged in the owner's words. **From:** [B6](#4326-b6-reply-block).
4. **Agora's footer.** What the art and footer lines carry is `ki.prj.agora`'s under FOOTER-AGORA; F1, F3, F4 and F5 changes go to it as a message line before graduation. **From:** [F1](#4331-f1-art), [F3](#4333-f3-counts-line), [F4](#4334-f4-roadmap-line), [F5](#4335-f5-package-line).
5. **Rendered surfaces.** The Observatory's Work tab and any surface drawing the banner check they still read the new F2 to F9. **From:** [Footer block](#433-footer-block).
6. **Saved reports.** Reports saved in the old layout stay readable and are never rewritten for the new one. **From:** [7.2](#72-to-cover).

[Back to contents](#contents)
