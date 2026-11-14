# Coordinating-work standard: reply format and banner

This file holds the coordinator reply format: its scope, the triggers that set each reply's structure and layout, the blocks and parts each structure carries, what each part holds, one template per structure, the verbs, the Summary's status table and footer, and the banner detail with its marked examples. It extends [the core](standards-coordination.md), which holds the banner layout and the one table of states.

## Contents

- [Coordinator reply format](#coordinator-reply-format)
  - [Blocks, parts and layouts](#blocks-parts-and-layouts)
  - [Triggers](#triggers)
  - [Structure–part matrix](#structurepart-matrix)
  - [Part content](#part-content)
  - [Templates](#templates)
  - [Verbs](#verbs)
  - [The Summary](#the-summary)
- [Banner detail](#banner-detail)

<a id="report-forms"></a>

## Coordinator reply format

The **coordinator reply format** governs every reply in a coordinator session: reports, ordinary answers, timed one-line updates and wake lines. It also governs a **run report**, the final report a run the coordinator launched writes into the work package; the run writes it itself, in the Medium layout, and no trigger chooses it.

It does not govern:

- a conversational session, with no coordinating opener, which uses the plain conversational reply and, when a unit of work ends, the owner report without heading block or footer, under [Reply forms](standards-reporting.md#reply-forms);
- a background agent's own replies while it works, which follow its brief; only its final run report is in scope;
- what each state's banner shows, which the [one table of states](standards-coordination.md#banner) sets;
- the **communication level**, quiet, standard or detailed, which never changes the layout and governs only the wording inside B1, the Answer. No Knowledge Islands standard defines the levels; the owner's personal communication preferences set them.

Sources: REPLY-FORMAT in [the decision register](sources.md#decision-register).

### Blocks, parts and layouts

A reply is built from up to three **blocks**, always in this order, each left out where none of its parts appear:

- **Heading block**, H1 to H4: which work this is and which reply.
- **Body block**, B1 to B6: what the reply says, what happened and what the owner needs to decide. B1, the Answer, holds whatever the reply says that no other part covers; the parts after it are the report's own.
- **Footer block**, F1 to F9: where the work stands and whose move it is, read from the bottom up. Its **banner** is F2 to F9.

Each block is a run of coded **parts**. Each reply has one **reply structure**, saying what the reply is, such as Summary, Status or Stop, and each structure has one **layout**, its depth: **Full**, **Medium**, **Short** or **Minimal**, deepest to shallowest. The structure decides which parts appear and how each part is shaped; Minimal has no footer.

**Time.** Every time is the owner's local time, in one of two forms, each part choosing which in its entry under [Part content](#part-content): a **friendly time**, naming the day where it is not today, as in `10:30 GMT`, `yesterday 18:05 GMT` or `Thu 5 Nov 09:12 GMT`; or a **timestamp**, ISO 8601 with its offset, as in `2026-11-07T10:30+00:00`, the fallback wherever a friendly time does not fit. A part that names no form keeps the form its template shows.

### Triggers

Each **trigger** sets exactly one reply structure, which enables the parts in the [structure–part matrix](#structurepart-matrix); each part then reacts to the structure, the state and the mark under [Part content](#part-content). A reply tries the triggers from T1 down, and the first met wins.

| Trigger | Signal | When | Structure |
| --- | --- | --- | --- |
| T1 | Time | **Gap:**<br>Either the owner's message arrives `USER_LAST_MESSAGE` minutes or more after their previous one, while at least one query is with the owner; or no Full reply has been given for `SINCE_LAST_SUMMARY` minutes, met by the next reply | Summary |
| T2 | Move | **Session start:**<br>The first reply after the coordinating opener, or after a compaction once re-anchored | Bootstrap |
| T3 | Move | **Work stops:**<br>The coordinator commits the Project's close, or a hold or snooze after `pause`, `done for now` or `snooze` | Stop |
| T4 | Phrase | **Short phrases:**<br>`mark only`, `where are we`, `where does it stand` or `what's the state` | Position |
| T5 | Phrase | **Status phrases:**<br>`status` or `mark, status only` | Status |
| T6 | Phrase, Move or State | **Summary asks and events:**<br>The owner's phrase `mark`, `summary`, `summary since <time>`, `recap` or `full summary`; or the coordinator commits a send of the work to the owner or another target, or the last running or queued run the work dispatched finishes; the latter is met until a reply it wins | Summary |
| T7 | Move | **Other change of state:**<br>The coordinator commits any other change of state: a receive such as `with me`, a `resume`, the start of a drain | Position |
| T8 | Move | **Update:**<br>A timed update falls due under the update [cadence](standards-coordination.md#coordinator-responsiveness), or a wake, by timer or inbox | Update |
| T9 | Phrase | **Anything else:**<br>The owner's message, when it meets no other trigger | Answer |

Each trigger is matched on a **signal**, or for T6 on any of three:

- **Phrase:** a line of the owner's message that is exactly the phrase, ignoring case, spaces and a trailing full stop; `<time>` matches any time. T4's phrases are a finite list, grown as wordings that miss are noticed.
- **State:** the work's runs, from the agent host's view of its agents and the package.
- **Time:** the times of the owner's messages and of the last Full reply.
- **Move:** something the coordinator commits, or a wake.

**The gaps.** `USER_LAST_MESSAGE` is 30 minutes and `SINCE_LAST_SUMMARY` is 120 minutes by default. They change only when the owner asks in the session; a process such as setting up an [unattended window](standards-unattended.md#unattended-windows) may ask the owner what they should be.

Two things sit outside the triggers. [The mark](standards-mark.md#the-mark) belongs to the standard: it moves on a hold and on `mark`, `mark only` and `mark, status only`, and shows only in H2 and B2. A run report is written by the run itself, in Medium.

Sources: REPLY-FORMAT in [the decision register](sources.md#decision-register).

### Structure–part matrix

Which parts each reply structure carries, one column per structure with its layout beneath its name: ● required, ○ optional, on its condition under [Part content](#part-content), and empty where the part is not used.

| Part | Summary<br>_Full_ | Status<br>_Full_ | Bootstrap<br>_Medium_ | Run report<br>_Medium_ | Stop<br>_Medium_ | Position<br>_Short_ | Update<br>_Minimal_ | Answer<br>_Minimal_ |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **Heading block** |  |  |  |  |  |  |  |  |
| **H1** · Heading | ● | ● | ● | ● | ● |  |  |  |
| **H2** · Form line | ● | ● | ● | ● | ● |  |  |  |
| **H3** · Opening note | ○ | ○ | ○ | ○ | ○ |  |  |  |
| **H4** · Rule | ● | ● | ● | ● | ● |  |  |  |
| **Body block** |  |  |  |  |  |  |  |  |
| **B1** · Answer | ○ | ○ | ○ | ○ | ○ | ○ | ● | ● |
| **B2** · Summary | ● |  | ● | ● | ● |  |  |  |
| **B3** · Status | ● | ● | ● | ● | ● |  |  |  |
| **B4** · Findings | ○ | ○ | ○ | ○ | ○ |  |  |  |
| **B5** · Queries | ● | ● | ● | ● | ● |  |  |  |
| **B6** · Reply block | ○ | ○ | ○ | ○ | ○ |  |  |  |
| **Footer block** |  |  |  |  |  |  |  |  |
| **F1** · Art | ○ | ○ |  |  |  |  |  |  |
| **F2** · Banner heading | ● | ● | ● | ● | ● | ● |  |  |
| **F3** · Counts line | ● | ● | ● | ● | ○ | ● |  |  |
| **F4** · Roadmap line | ● | ● |  |  |  |  |  |  |
| **F5** · Package line | ● | ● |  |  |  |  |  |  |
| **F6** · Item list | ● | ● | ● | ● | ● | ● |  |  |
| **F7** · Heading-for line | ○ | ○ | ○ |  | ○ | ○ |  |  |
| **F8** · Listening line | ● | ● | ● |  | ○ | ● |  |  |
| **F9** · Thread line | ● | ● | ● | ● | ● | ● |  |  |

● required · ○ optional, on its condition under [Part content](#part-content) · empty: not used.

F3, F4 and F8 show always or never by reply structure, never by judgement of whether they apply; F3 and F8 leave Stop only when the work is Finished.

Sources: REPLY-FORMAT in [the decision register](sources.md#decision-register).

### Part content

Each part: what it carries, when it appears and how the structure, the state and the mark shape it.

**Heading block.**

- **H1 Heading:** which work this is, linked, under **Report heading** in [Banner detail](#banner-detail): `# [<Theme>](<theme page>) › [<Project>](<Project note>)`, or `# [<territory or theme>](<local note>) › State of play`. A run report adds `› <run name>`.
- **H2 Form line:** which reply structure, when it was given and the mark: `**<Structure> at <now> · last mark <mark time>**`, the structure `Summary`, `Status`, `Bootstrap`, `Run report` or `Stop`. The mark time is the mark the reply's window opens at: after `mark`, the mark before the one just struck; otherwise the last mark struck, or the session's start where there is none. A Stop for a hold ends `· mark <the hold's mark>`. Both times are friendly times, so `last mark` names the day where it is not today, as in `last mark yesterday 18:05 GMT`. The work's state is not in H2; it shows only in F2.
- **H3 Opening note:** context worth putting high up, ahead of the body, such as an outline of the Answer or anything unusual that nothing else shows, in one or two lines; the rest of the Answer stays in B1. Only where the reply has such context.
- **H4 Rule:** one `---`, with a blank line either side, closing the heading block.

**Body block.**

- **B1 Answer:** anything the reply says that no other part covers, in its own words and with any normal sections: an answer to the owner's message, an explanation, a short table. It comes first in the body, straight after the heading block, and only where there is such content: a reply to a bare `summary` may have none, its Summary being B2. In Minimal it is the whole reply.
- **B2 Summary:** what changed since the window opened. In a Summary it is `## Summary`, with no time: one bold headline saying what the window came to, then one line per item that changed, delivered, decided, started, stopped, blocked or newly captured, with material failures, corrections and limitations beside the items they qualify, and commits and a recovered session among them; with nothing changed, one line says so. In every Medium structure it is `## Done`, one completed outcome per line: in a Bootstrap the coordinator's role and where the work stands, ending with the `Rename thread:` line under [Opening work](standards-opening.md#opening-work); in a run report its outcomes with commit identifiers and each check's outcome; in a Stop one line per repository for a hold, or one per close-out step at Finished.
- **B3 Status:** the full board of live items. In a Summary or Status it is `## Status`, the [status table](#the-summary). In every Medium structure it is `## In Progress`: what is running and what is waiting, each with its owner or dependency, or `Nothing is running`, then `Outstanding - no action requested now`. On hold, Left over comes here: another session's uncommitted file, or `Nothing`.
- **B4 Findings:** `## Findings`, only while a finding the owner asked for is open, under the owner report's **Findings**.
- **B5 Queries:** `## Queries`, each decision the owner needs to make, in full, under the [owner report](standards-reporting.md#owner-report), a proposed work transfer last, or `None.` in a Summary or Status and `No outstanding queries` in a Medium structure. On hold, the parked queries come here instead, one line each, `<TAG> - <one line>`.
- **B6 Reply block:** the tags, letters and confidences, ready to copy: one fenced `text` block after the last query, holding exactly the text to send back, for the owner to copy, change and send. The queries in B5 are grouped by priority under numbered headings, the most pressing first, each `<n> · <what the group is>`, adding `, can run while you're away` where the group's work can go ahead while the owner is away, with a blank line between groups; under each heading, one line per query, its tag, the recommended option's letter and that option's confidence in brackets, as `<TAG> a (high)`, under the owner report's **Reply block**. It appears whenever B5 carries at least one query in full.

**Footer block.**

- **F1 Art:** the Knowledge Islands drawing, whose scroll says only KNOWLEDGE ISLANDS, under **The footer** in [The Summary](#the-summary). Unless the owner asked for `no art`.
- **F2 Banner heading:** `### <glyph state> · at <time the work entered this state>`, from the [one table of states](standards-coordination.md#banner). It is the only place the work's state appears.
- **F3 Counts line:** `🤖 <n> running · ⏳ <n> queued · 👤 <n> with you · ⛔ <n> blocked · 🅿️ <n> parked`, all five views with zeros written, adding `· 📥 <n> to accept` in Project work with records awaiting the owner's acceptance. The state sets its content on hold: `⏸️ drained · 🅿️ <n> queries parked` on a paused hold, `💤 waiting for a message · 🅿️ <n> queries parked` while Snoozing. Left out only when the work is Finished.
- **F4 Roadmap line:** `🗺️ roadmap · <n> records · <n> open · <n> done awaiting prune · <n> ideas`, or `🗺️ roadmap · none` where the package's repository has no roadmap, under **Roadmap and package lines** in [Banner detail](#banner-detail).
- **F5 Package line:** `📦 package · inbox <n> · outbox <n> · held <n> · awaiting ACK <n>`, under the same.
- **F6 Item list:** one line per live item, `- [<state>] <what> · <holder> · at <time>`, under **Glyph banner** in [the core](standards-coordination.md#banner). It carries no `[awaiting ACK]` items; their count stays in F5. On hold it lists only `[parked]` and `[release]`; Finished lists `[finished]`.
- **F7 Heading-for line:** `↪️ <draining or finishing> → <target>`, only while the work is heading for a hold or a handoff, under **Heading for a hold or a handoff** in [the core](standards-coordination.md#banner).
- **F8 Listening line:** `👂 listening` while the [inbox watcher](standards-listening.md#inbox-watch) is armed, and `🔇 not listening` otherwise, by default, including a session the owner has not asked to listen. Left out only when the work is Finished.
- **F9 Thread line:** `<role glyph> 🔑 <work-id>`, or `🧵 <work-id>`, always last, under **Thread line** in [the core](standards-coordination.md#banner).

Sources: REPLY-FORMAT and REPLY-GROUPS in [the decision register](sources.md#decision-register).

### Templates

Each structure has one complete template. A line in angle brackets says what goes there; a part marked _only when there is some_ is left out otherwise. The [Banner](standards-coordination.md#banner) examples show finished banners.

**Summary**, Full, with each part's code in the right margin; the codes are not part of a reply:

````text
# [<Theme>](<theme page>) › [<Project>](<Project note>)                     H1

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
| **<focus id>** ⭐<br><focus line from _index.md> | **<state in a few words>**<br>🤖 <run work>; next: <step><br>🧵 <other package>: <what>; next: <step><br>🌐 <waiting on whom><br>👤 <with you>: <TAG> |

## Findings                                                                  B4

## Queries                                                                   B5

### <TAG> - <plain title>

**Context:** <enough to decide without reading anything else>

**Query:** <one sentence>

**Options:**

a) (recommended, confidence <level> - <reason>) <the course>

b) <the alternative>

```text                                                                       B6
1 · <what the most pressing group is>, can run while you're away
<TAG> a (<high, medium or low>)

2 · <what the next group is>
<TAG> a (<high, medium or low>)
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

**Status**, Full: the Summary's template with the form line `**Status at <now> · last mark <mark time>**` and no `## Summary`, so the Answer, where there is one, or `## Status` follows the rule; the same footer.

**Bootstrap**, Medium, under [Bootstrap](standards-bootstrap.md#bootstrap):

```text
# [<Theme>](<theme page>) › [<Project>](<Project note>)

**Bootstrap at <now> · last mark <mark time>**

---

## Done

- <the coordinator's role and where the work stands>

Rename thread: /rename <role glyph> 🔑 <work-id>

## In Progress

<what is running and waiting, or Nothing is running>

## Findings

<each open finding in full; only when there is some>

## Queries

<every open query in full, then the reply block, or No outstanding queries>

### <glyph state> · at <time the work entered this state>

🤖 <n> running · ⏳ <n> queued · 👤 <n> with you · ⛔ <n> blocked · 🅿️ <n> parked

- [<state>] <what> · <holder> · at <time>

<👂 listening | 🔇 not listening>

<role glyph> 🔑 <work-id>
```

**Run report**, Medium, written by the run under the [owner report](standards-reporting.md#owner-report): the Bootstrap's template with `› <run name>` added to the heading, the form line `**Run report at <now> · last mark <mark time>**`, `## Done` holding its outcomes, commits and checks, no `Rename thread:` line, and a banner of F2, F3, F6 and F9 alone, closing with `🧵 <work-id>` of the work it reports to.

**Stop**, Medium, for a hold, under [Putting work on hold](standards-holds.md#putting-work-on-hold), alone in its message:

```text
# [<Theme>](<theme page>) › [<Project>](<Project note>)

**Stop at <now> · mark <the hold's mark>**

---

## Done

- <one line per repository>

## In Progress

Left over: <another session's uncommitted file, or Nothing>

## Queries

- <TAG> - <one line each>

### ⏸️ On hold · paused until <release> · at <time the hold landed>

⏸️ drained · 🅿️ <n> queries parked

- [parked] <n> queries in `discussions.md`
- [release] <release>, or `resume`

🔇 not listening

<role glyph> 🔑 <work-id>
```

**Stop while Snoozing**: the hold's template with the Snoozing banner:

```text
### 💤 Snoozing (on hold) · at <time the snooze landed>

💤 waiting for a message · 🅿️ <n> queries parked

- [parked] <n> queries in `discussions.md`
- [release] a message arrives, or `resume`

👂 listening

<role glyph> 🔑 <work-id>
```

**Stop at Finished**, at [Finishing Project work](standards-mark.md#finishing-project-work):

```text
# [<Theme>](<theme page>) › [<Project>](<Project note>)

**Stop at <now> · last mark <mark time>**

---

## Done

- <one line per close-out step>

## In Progress

Nothing is running

## Queries

No outstanding queries

### 🏁 Finished · <work label> closed at <time>

- [finished] <what closed>

<role glyph> 🔑 <work-id>
```

**Position**, Short, for `mark only`, the other short phrases and any other change of state: no heading block, an optional Answer of a line or two, then the banner without F1, F4 and F5:

```text
<one or two plain lines saying what moved or where the work stands; only when there is some>

### <glyph state> · at <time the work entered this state>

🤖 <n> running · ⏳ <n> queued · 👤 <n> with you · ⛔ <n> blocked · 🅿️ <n> parked

- [<state>] <what> · <holder> · at <time>

<↪️ heading-for line; only when there is one>

<👂 listening | 🔇 not listening>

<role glyph> 🔑 <work-id>
```

**Update** and **Answer**, Minimal: the Answer alone, with no heading block and no footer. A timed update or wake line is one or two timestamped lines under the [cadence](standards-coordination.md#coordinator-responsiveness).

Sources: REPLY-FORMAT and REPORT-FORMS-TIDY in [the decision register](sources.md#decision-register).

### Verbs

The verbs, which the same plain words in chat also do:

```text
/ki-coordination mark                  strike the mark, then summarise since the previous one
/ki-coordination mark only             strike the mark, then the Position
/ki-coordination summary               summarise since the last mark (or the session's start)
/ki-coordination summary since 14:00   summarise from any point you name
/ki-coordination mark, status only     strike the mark, then the Status
/ki-coordination status                the Status; the mark stays
```

- Adding `no art` to any of them leaves the art out of the footer.
- Only `mark`, `mark only` and `mark, status only` move the mark, and a hold strikes one; a Summary and a Status never move it.
- The Status is the Summary without its `## Summary`.
- `/ki-coordination hold`: drain plus On hold, as `pause` does, under [Putting work on hold](standards-holds.md#putting-work-on-hold), ending in the Stop.
- `/ki-coordination drain`: stop launching while the work stays With worker, let what is running finish, then give a Summary whose `## Summary` carries the drain check's result, `DRAINED`, or `NOT DRAINED` with what remains.
- `/ki-coordination resume`: release held work under **Release** in [Putting work on hold](standards-holds.md#putting-work-on-hold), as the word `resume` does.
- `/ki-coordination send`: make the send under [States and moves](standards-coordination.md#states-and-moves): commit and sync the package and give the Summary whose banner names the handoff.
- `/ki-coordination goals`: walk the Focus list in a [goal-setting pass](standards-queries.md#goal-setting-pass), as the word `goals` does, closing with a Status.
- `/ki-coordination receive`: take the owner's receive under [States and moves](standards-coordination.md#states-and-moves), as `with me` does, and commit it with the next send.
- Every reply that sends is followed by [committing and pushing the package](standards-coordination.md#committing-the-work-folder).

`ki-work recap` keeps only the ordinary session recap; every summary while coordinating is the Summary.

Sources: SUMMARY-MODEL, SUMMARY-NOW, STATUS-FORM, STATUS-FORM-2, STATUS-FORM-3, MARK-STATUS, MARK-DURABLE, STATUS-DESIGN, HOLD-VERBS, REPORT-FORMS-TIDY, COORD-COMMANDS, GOAL-SETTING, RECAP-OWNER and REPLY-FORMAT in [the decision register](sources.md#decision-register).

### The Summary

The **Summary** is the coordinator's one summary form, a Full reply. It runs from the last mark, from the session's start where there is none, or from any time the owner names, laid out for about 90 columns unless the owner asks for another width. Where the owner named the window's start, B2's headline names it. It holds, in order, the parts the [structure–part matrix](#structurepart-matrix) gives: the heading block, the Answer where there is one, `## Summary`, `## Status`, `## Findings` while one is open, `## Queries` with every open query in full and the reply block, then the footer, the art unless `no art` was asked for, and the banner with its roadmap and package lines and its thread line. The [interactive pass](standards-queries.md#interactive-pass) follows `## Queries`, keeping each query's tag, Context, Query and Options.

**The status table** has two columns, **Focus** and **Where it stands**, and one row per focus area holding items, in `_index.md`'s Focus order with the primary first. It is the full board, not a delta: every live item appears whether or not it changed.

- **Focus cell:** line one is the focus id alone in bold, the underscore escaped, as in `**\_emerging**`, with ⭐ on the primary. Under it, at normal size, the focus's line from `_index.md`'s Focus section, word for word. The Focus column takes at most a third of the table's width, so each focus line stays one short phrase of goal and order; a longer line is shortened in `_index.md`, never reworded in the Summary.
- **Where it stands:** a bold headline giving the focus's state in a few words, then one line per item, opening with its **holder**, 👤 the owner, 🤖 a worker or run, 🧵 another session or 🌐 the outside world, then what it is and its next step. ⏳ means queued only. The owner's items come last and name their query's tag, so no waiting column is needed. Uncommitted work, unlogged decisions and repositories behind their remote, under the [repository level check](standards-sync.md#repository-level-check), are 🤖 lines in their own row, or the primary's.
- **`_emerging`** is a usable catch-all focus and gets a row like any other.
- **Rendering:** a plain Markdown table with `<br>` between the lines of a cell. The owner wants top-aligned cells, which Markdown cannot ask for; Orca's chat view is asked for them under [PERSONAL-DOTFILES-UE-107 (pruned)](https://github.com/krisb/dotfiles/blob/7f5a625/docs/roadmap/PERSONAL-DOTFILES-UE-107-decide-orca-adoption.md), ORCA-TABLE-ALIGN. Until then cells centre.

```markdown
## Status

| Focus | Where it stands |
| --- | --- |
| **reporting** ⭐<br>Status-led reports every session can read cold | **Landing in the standard**<br>🤖 summary-model writes the Summary into ki-coordination; next: checks<br>👤 STATUS-WIDTH: whether 90 columns suits every surface |
| **\_emerging**<br>Side asks that may grow into focus areas | **Waiting outside**<br>🌐 Orca top-aligned table cells; next: Orca's answer |
```

**The footer** is the Knowledge Islands art, then the banner. The art shows on every Summary and Status unless the owner added `no art`, and on no other reply. What the art and the footer lines carry is for Knowledge Islands Cairn, `ki.prj.agora`, to decide, liaising with `ki.sop.main` as the keeper of this standard. Until Cairn publishes its own, the art is the 88-column Knowledge Islands drawing in the [summary-model design note](https://github.com/krisb/dotfiles/blob/29dc51c/+/_WORK/personal.reg.household-terra/_emerging/summary-model.design.md), its scroll saying only KNOWLEDGE ISLANDS, with no host, state, counts, date or time. The art stays as a visible marker and can go later without touching anything else.

**Sources of a Summary:** `decisions.md`; every report in the package, and, for reports a [prune](standards-mark.md#pruning-the-work-folder) deleted, their last revision in Git; the parked tags in `discussions.md`; the agent host's view of its agents; record transitions in the work's scope from the Git history of the roadmap paths; and `git log -- +/_WORK/<id>/`, the logbook. The mark bounds them all. Where a report is missing from the package and from Git, the Summary says what it could not read rather than reconstructing it from memory.

Sources: SUMMARY-MODEL, TABLE-ALIGN, FOOTER-AGORA, FOOTER-COUNTS and REPLY-FORMAT in [the decision register](sources.md#decision-register).

## Banner detail

**Rendered glyphs.** The emoji stay the written notation in reports, terminals and commits. A rendered surface, such as the Observatory's Work tab, may draw the five glyphs, 🤖, 👤, 🎯, ⏸️ and 🏁, and Snoozing's 💤 once the package carries one, with the matching line glyphs from `@knowledgeislands/icons`, always with the state's words beside them. The words, arrows and banner shape do not change, and the package owns the mapping from state to glyph.

**Report heading.** The heading block: one `#` heading, one bold form line, an optional opening note and one horizontal rule, then the body. It is plain Markdown, not a fenced block, so the heading can carry links.

- **Heading:** `# [<Theme>](<local theme page>) › [<Project>](<local Project note>)`: the theme's display name, the `title` its page gives, linked to the page by absolute path, then ` › `, then the Project's display name in words, not its slug, linked to its note the same way.
  - Project work with no theme gives the Project alone.
  - A State of play writes the territory or theme it covers, linked to its local note, then `› State of play`; a secondary `› State of play (<name>)`.
  - Explicitly coordinating regular or ad hoc work uses `# [<actual work label>](<actual local work page>)`, optionally preceded by its real theme, linking `_index.md` where no separate page exists; never fabricate a Project.
  - No rule stands before the heading, so it is the first line and H1 of every saved report.
- **Form line:** a blank line, then H2, `**<Structure> at <now> · last mark <mark time>**`, under [Part content](#part-content), with no state.
- **Times:** each with its own words.
  - `<Structure> at <time>`: when the reply was given.
  - `last mark <time>`: the mark the reply's window opens at; `mark <time>` in a hold's Stop, the mark struck for the hold.
  - In the banner, the heading's `at <time>`: when the work entered the state shown. Each item's `at <time>`: when it took its place.
- **Rule after:** a blank line, one `---`, a blank line, then the body.

Opening a Summary:

<!-- ki-coordination:block heading-example -->

```markdown
# [Model](/Users/krisbrown/workspaces/knowledge-islands/ki-principal/Streams/Themes/model.md) › [Ways of working](/Users/krisbrown/workspaces/knowledge-islands/ki-principal/Streams/Projects/ways-of-working.md)

**Summary at 23:52 BST · last mark 22:34 BST**

---

## Summary
```

A State of play opening a Bootstrap whose last mark was the day before:

```markdown
# [<territory or theme>](<its local note>) › State of play

**Bootstrap at 09:13 BST · last mark yesterday 18:05 BST**

---

## Done
```

**Roadmap and package lines.** Directly beneath the counts line, each after a blank line, a Full reply's footer carries one line of roadmap counts and one of package counts. In a Full reply on work On hold the counts line is the hold line, with the two lines beneath it, so the counts stay together under the heading and the thread line stays last.

- **Roadmap line:** `🗺️ roadmap · <n> records · <n> open · <n> done awaiting prune · <n> ideas`, from `ki repo roadmap summary` in the repository homing the package. Records is the total, ideas the `triage` horizon, done awaiting prune the done and cancelled records, and open every other record. A count of one takes the singular, as in `1 record` or `1 idea`. A repository with no roadmap shows `🗺️ roadmap · none`.
- **Package line:** `📦 package · inbox <n> · outbox <n> · held <n> · awaiting ACK <n>`, from the package: inbox counts the lines in `messages.md`'s `## Inbound`, outbox those in its `## Outbound`, held the items under `state.md`'s `## Held`, and awaiting ACK the Outbound lines no ACK has answered.
- Both are counted afresh for each Full reply and write their zeros; they are counts, never items. Medium and Short replies carry neither.

**Mode lines.** The listening line, F8, sits below the list and any heading-for line and above the thread line, a blank line before it, in every Full, Bootstrap and Position reply and in a Stop unless the work is Finished.

- `👂 listening` while the [watcher](standards-listening.md#inbox-watch) is armed, `listening_status: on`; `🔇 not listening` otherwise, `listening_status: off`, which is the default: while draining, On hold and paused, after "stop the wake" or "stop listening", where the runtime cannot be woken, and where the owner has not asked the session to listen and it is no host sync thread.
- Work [Snoozing](standards-holds.md#putting-work-on-hold) shows plain `👂 listening` while its watcher is armed, because its 💤 heading and counts already say it waits for a message.
- There is no sync line: a host sync thread shows only its listening line. A listening host sync thread on sol closes:

```text
👂 listening

🏠 🔑 personal.reg.rig-sol
```

A run report's banner carries no mode lines and no heading-for line, because a run neither listens nor drains.

With worker, closing a Summary while runs are out:

<!-- ki-coordination:block with-worker-banner -->

```markdown
### 🤖 With worker · at 23:41 BST

🤖 2 running · ⏳ 0 queued · 👤 1 with you · ⛔ 1 blocked · 🅿️ 0 parked

🗺️ roadmap · 6 records · 4 open · 1 done awaiting prune · 1 idea

📦 package · inbox 1 · outbox 0 · held 0 · awaiting ACK 0

- [running] work-model · run/work-model · at 23:20
- [running] tools-burndown fix · work/ki.tools-burndown · at 23:05
- [with you] WORK-HOME · owner · at 22:58
- [blocked] work folder commit · repo/ki-principal · at 22:40

👂 listening

⚒️ 🔑 ki.prj.ways-of-working
```

Handoff to supervisor, closing a Summary that sends the work to the owner:

<!-- ki-coordination:block handoff-banner -->

```markdown
### 🤖 → 👤 Handoff to supervisor · at 23:52 BST

🤖 0 running · ⏳ 0 queued · 👤 2 with you · ⛔ 0 blocked · 🅿️ 1 parked

🗺️ roadmap · 6 records · 3 open · 2 done awaiting prune · 1 idea

📦 package · inbox 0 · outbox 1 · held 0 · awaiting ACK 1

- [with you] WORK-MODEL · owner · at 23:52
- [with you] WORK-HOME · owner · at 22:58
- [parked] 1

👂 listening

⚒️ 🔑 ki.prj.ways-of-working
```

With worker, a Position while draining towards a hold after `pause`, with one run still finishing:

<!-- ki-coordination:block draining-banner -->

```markdown
### 🤖 With worker · at 23:41 BST

🤖 1 running · ⏳ 0 queued · 👤 1 with you · ⛔ 0 blocked · 🅿️ 0 parked

- [running] work-model · run/work-model · at 23:20
- [with you] WORK-HOME · owner · at 22:58

↪️ draining → ⏸️ On hold

🔇 not listening

⚒️ 🔑 ki.prj.ways-of-working
```

**Restart suggestion.** Suggest restarting a session only when one of three triggers holds, and for nothing else:

- **Identity changed:** the work's id, level, label or run name changed in this session, as when a package moves from `hnr.prj.email-routing` to `hnr.reg.email-routing`. The session's name, run and opener no longer match `_index.md`, and only a fresh opener sets all three again.
- **Repeated compaction:** the session has been compacted twice or more. Each [re-anchoring](standards-bootstrap.md#re-anchoring-after-compaction) rebuilds from a summary of a summary, and a fresh bootstrap from the package is more faithful.
- **Method moved on:** since the session opened, the method changed its opener, the hook line or the output style, checked under [Refreshing this guidance](standards-coordination.md#refreshing-this-guidance). A session keeps the style and opener it loaded at start; only a fresh session loads the current ones.

The suggestion is a single closing item placed directly before F2, the banner's `###` heading, after `## Queries` and its reply block, or after the Answer in a Position, so the banner and thread line stay last. It is one bold line naming the trigger and saying plainly that the session would be better restarted, then the work's opener, filled from its `_index.md` under [Opening work](standards-opening.md#opening-work), in one fenced block:

````text
**Restart suggested:** the work moved from hnr.prj.email-routing to hnr.reg.email-routing in this session, so its label, run name and opener changed; this work would be better restarted in a fresh session with this opener.

```text
Bootstrap as hnr.reg.email-routing regular work under ki-coordination.
...
```
````

- It is the second named exception to the rule that a report carries no send, resume or paste line, beside the bootstrap `Rename thread:` line under [Opening work](standards-opening.md#opening-work).
- Never for length, age, a change of state, a hold or a model switch alone.
- Give it in each reply closing with the banner while the trigger holds; once the owner declines it, not again until a new trigger arises.
- A Stop, run report or conversational reply never carries it. Picking work up still follows the package, and the owner closes the old session.

Send and receive remain the work model's moves. To pick work up, follow [Picking work up](standards-bootstrap.md#picking-work-up) from the package; the thread line identifies work and is not a restart prompt.

On hold, closing a Stop:

<!-- ki-coordination:block hold-banner -->

```markdown
### ⏸️ On hold · paused until the harness migration lands · at 00:10 BST

⏸️ drained · 🅿️ 9 queries parked

- [parked] 9 queries in `discussions.md`
- [release] after the harness migration lands, or `resume`

🔇 not listening

⚒️ 🔑 ki.prj.ways-of-working
```

Snoozing, closing a Stop for a hold that waits for more to come:

<!-- ki-coordination:block snoozing-banner -->

```markdown
### 💤 Snoozing (on hold) · at 23:58 GMT

💤 waiting for a message · 🅿️ 2 queries parked

- [parked] 2 queries in `discussions.md`
- [release] a message arrives, or `resume`

👂 listening

⚒️ 🔑 ki.prj.ways-of-working
```

Finished, closing the Stop at [Finishing Project work](standards-mark.md#finishing-project-work):

```markdown
### 🏁 Finished · Ways of working closed at 18:00 BST

- [finished] 14 work items accepted, decisions homed, work folder pruned

⚒️ 🔑 ki.prj.ways-of-working
```

**In an agent's report.** A background agent's run report takes the same heading block and banner, under the [owner report](standards-reporting.md#owner-report): the heading of the work it reports to with `› <run name>` added and the structure `Run report`, so its form line reads `**Run report at <local time> · last mark <local time>**`, the mark being that work's. Its banner gives the run's state and items, `### 🤖 → 👤 Handoff to supervisor · at <time>`, or `### 🤖 → 👤 Handoff to supervisor · blocked · at <time>` where it sends back with a blocking query, closing with the thread line of the work it reports to. Opening a run report:

```markdown
# [Model](/Users/krisbrown/workspaces/knowledge-islands/ki-principal/Streams/Themes/model.md) › [Ways of working](/Users/krisbrown/workspaces/knowledge-islands/ki-principal/Streams/Projects/ways-of-working.md) › migrate-phase1

**Run report at 20:40 BST · last mark 14:54 BST**

---

## Done
```

Sources: BANNER-GLYPHS, RICH-HEADING, REPORT-FORMS-TIDY, SNOOZE-HEADING, FOOTER-COUNTS, LISTEN-STATUS, FOOTER-LAYOUT, FOOTER-CAPABILITY-STATUS-2, FOOTER-NOT-LISTENING, SYNC-LINE-OFF, RESTART-SUGGEST and REPLY-FORMAT in [the decision register](sources.md#decision-register).
