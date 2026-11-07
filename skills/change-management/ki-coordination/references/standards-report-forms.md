# Coordinating-work standard: report forms and banner

This file holds the report forms and verbs, one template per form, the Summary, and the banner detail with its marked examples. It extends [the core](standards-coordination.md), which holds the banner layout and the one table of states.

## Contents

- [Report forms](#report-forms)
  - [Templates](#templates)
  - [The Summary](#the-summary)
- [Banner detail](#banner-detail)

## Report forms

Only a coordinator uses these forms; a conversational session uses the first two [reply forms](standards-reporting.md#reply-forms). The coordinator has one summary form, the [Summary](#the-summary), running from a point in time, with the Status as its view without the window, and three other forms: the re-bootstrap report under [Bootstrap](standards-bootstrap.md#bootstrap), the hold report and the finish report. Any other reply that moves the mark, changes the state or answers where the work stands is a plain state reply. Each form opens with the [report heading](standards-coordination.md#banner) and closes with the [banner](standards-coordination.md#banner) and its thread line; [Templates](#templates) gives each complete.

| Form | Window | Given | Sections |
| --- | --- | --- | --- |
| [Summary](#the-summary) | since the last mark, since the session's start where there is none, or since any time the owner names | after every `mark`; on request, `summary` or `summary since <time>`; when all dispatched work has finished; at every send; and as the [gap Summary](standards-coordination.md#coordinator-responsiveness) after 30 minutes or more without an owner message while queries are with the owner. While work lies with a worker, timed one-to-two-line updates stand in for it and a blocking query is raised in a single line | `## Summary since <time>`, `## Status`, `## Findings` while one is open, `## Queries` in full, then the footer: the art unless `no art` was asked for, and the banner with its thread line |
| Re-bootstrap report | the work as picked up | at bootstrap and re-bootstrap | the owner report: `## Done` with the coordinator's role and where the work stands, `## In Progress` with what is running, and `## Queries` with every open query in full; closes with the banner |
| Status | none: the board as it stands | after `mark, status only`; on request, `status` | `## Status`, `## Findings` while one is open, `## Queries` in full, then the footer as a Summary's |
| [Hold report](standards-holds.md#putting-work-on-hold) | the drain itself | once, when the owner agrees a hold, and nothing else in that message | `## Done`, one line per repository; `## Parked`, the tags parked in `discussions.md`; `## Left over`; closes with the On hold banner and its thread line |
| Finish report | the close-out | once, when the work moves to [Finished](standards-mark.md#finishing-project-work) | `## Done`, the close-out steps; `## In Progress`; `## Queries`; closes with the Finished banner and its thread line |

The verbs, which the same plain words in chat also do:

```text
/ki-coordination mark                  strike the mark, then summarise since the previous one
/ki-coordination mark only             strike the mark, no summary
/ki-coordination summary               summarise since the last mark (or the thread's start)
/ki-coordination summary since 14:00   summarise from any point you name
/ki-coordination mark, status only     strike the mark, then the status table without the history
/ki-coordination status                the status table without the history; the mark stays
```

- Adding `no art` to any of them leaves the art out of the footer.
- Only `mark`, `mark only` and `mark, status only` move the mark, and a hold strikes one; a Summary and a Status never move it.
- The Status is the Summary without its `## Summary since <time>` section.
- `/ki-coordination hold`: drain plus On hold, as `pause` does, under [Putting work on hold](standards-holds.md#putting-work-on-hold), ending in the hold report.
- `/ki-coordination drain`: stop launching while the work stays With worker, let what is running finish, then give a Summary whose `## Summary since <time>` carries the drain check's result, `DRAINED`, or `NOT DRAINED` with what remains.
- `/ki-coordination resume`: release held work under **Release** in [Putting work on hold](standards-holds.md#putting-work-on-hold), as the word `resume` does.
- `/ki-coordination send`: make the send under [States and moves](standards-coordination.md#states-and-moves): commit and sync the package and give the Summary whose banner names the handoff.
- `/ki-coordination goals`: walk the Focus list in a [goal-setting pass](standards-queries.md#goal-setting-pass), as the word `goals` does, closing with a Status.
- `/ki-coordination receive`: take the owner's receive under [States and moves](standards-coordination.md#states-and-moves), as `with me` does, and commit it with the next send.
- Every report that sends is followed by [committing and pushing the package](standards-coordination.md#committing-the-work-folder).

`ki-recap` keeps only the ordinary session recap; every summary while coordinating is the Summary.

Sources: SUMMARY-MODEL, SUMMARY-NOW, STATUS-FORM, STATUS-FORM-2, STATUS-FORM-3, MARK-STATUS, MARK-DURABLE, STATUS-DESIGN, HOLD-VERBS, REPORT-FORMS-TIDY, COORD-COMMANDS, GOAL-SETTING and RECAP-OWNER in [the decision register](sources.md#decision-register).

### Templates

Each form has one complete template: its form line, its sections in order and its footer, long or short. A line in angle brackets says what goes there; a part marked _where it applies_ is left out otherwise. The sections below set each part's detail; the [Banner](standards-coordination.md#banner) examples show finished banners. The long footer is the art, then the banner with its roadmap and package lines; the short footer is the banner alone. A hold is visibly not a Summary: its report opens `⏸️ On hold · Hold report` or `💤 Snoozing (on hold) · Hold report`, carries `· mark`, not `· since`, has `## Done`, `## Parked` and `## Left over` and no Status or Queries, and closes with the short footer.

**Summary**, after `mark`, long footer:

```text
# [<Theme>](<theme page>) › [<Project>](<Project note>)

**<glyph state> · Summary at <now> · since <window start>**

---

## Summary since <window start>

**<what the window came to>**

- <one line per item that changed, or one line saying nothing changed>

## Status

| Focus | Where it stands |
| --- | --- |
| **<focus id>** ⭐<br><focus line from work.md> | **<state in a few words>**<br><holder glyph> <item>; next: <step> |

## Findings

<each open finding in full; where it applies>

## Queries

<every open query in full, or None.>

<the Knowledge Islands art, unless no art>

### <glyph state> · at <time the work entered this state>

<counts line>

🗺️ roadmap · <n> records · <n> open · <n> done awaiting prune · <n> ideas

📦 package · inbox <n> · outbox <n> · held <n> · awaiting ACK <n>

- [<state>] <what> · <holder> · since <time>

<↪️ heading-for line; where it applies>

<👂 or 🔇 listening line; where the thread has the capability>

<role glyph> 🔑 <work-id>
```

**Status**, after `mark, status only` or on `status`: the Summary's template with the form line `**<glyph state> · Status at <now> · last mark <mark>**` and without `## Summary since <window start>`, so `## Status` follows the rule; same long footer.

**Re-bootstrap report**, under [Bootstrap](standards-bootstrap.md#bootstrap), short footer:

```text
# [<Theme>](<theme page>) › [<Project>](<Project note>)

**<glyph state> · Re-bootstrap at <now> · last mark <mark>**

---

## Done

- <the coordinator's role and where the work stands>

Rename thread: /rename <role glyph> 🔑 <work-id>

## In Progress

<what is running and waiting, or Nothing is running>

## Findings

<each open finding in full; where it applies>

## Queries

<every open query in full, or No outstanding queries>

### <glyph state> · at <time the work entered this state>

<counts line>

- [<state>] <what> · <holder> · since <time>

<👂 or 🔇 listening line; where the thread has the capability>

<role glyph> 🔑 <work-id>
```

**Hold report**, under [Putting work on hold](standards-holds.md#putting-work-on-hold), alone in its message, short footer:

```text
# [<Theme>](<theme page>) › [<Project>](<Project note>)

**⏸️ On hold · Hold report at <now> · mark <the hold's mark>**

---

## Done

- <one line per repository>

## Parked

- <TAG> - <one line each>

## Left over

<another session's uncommitted file, or Nothing>

### ⏸️ On hold · paused until <release> · at <time the hold landed>

⏸️ drained · 🅿️ <n> queries parked

- [parked] <n> queries in `discussions.md`
- [release] <release>, or `resume`

<🔇 not listening; where the thread has the capability>

<role glyph> 🔑 <work-id>
```

**Hold report while Snoozing**: the hold report's template with the form line `**💤 Snoozing (on hold) · Hold report at <now> · mark <the hold's mark>**` and the Snoozing banner, short footer:

```text
### 💤 Snoozing (on hold) · at <time the snooze landed>

💤 waiting for a message · 🅿️ <n> queries parked

- [parked] <n> queries in `discussions.md`
- [release] a message arrives, or `resume`

👂 listening

<role glyph> 🔑 <work-id>
```

**Finish report**, at [Finishing Project work](standards-mark.md#finishing-project-work), short footer:

```text
# [<Theme>](<theme page>) › [<Project>](<Project note>)

**🏁 Finished · Finish report at <now> · last mark <mark>**

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

**Plain state reply**, for any other reply that moves the mark, as `mark only` does, changes the work's state, as a receive does, or answers where the work stands: no heading, form line or sections, one or two plain lines, then the short footer:

```text
<one or two plain lines saying what moved or where the work stands>

### <glyph state> · at <time the work entered this state>

<counts line>

- [<state>] <what> · <holder> · since <time>

<👂 or 🔇 listening line; where the thread has the capability>

<role glyph> 🔑 <work-id>
```

Sources: REPORT-FORMS-TIDY in [the decision register](sources.md#decision-register).

### The Summary

The **Summary** is the coordinator's one summary form. It runs from the last mark, from the session's start where there is none, or from any time the owner names, laid out for about 90 columns unless the owner asks for another width. Its form line reads `**<glyph state> · Summary at <local time> · since <local time>**`, the second time being the window's start under [Three times](standards-coordination.md#banner). It holds, in order:

1. **`## Summary since <time>`**, the window's start as local time, such as `## Summary since 22:34 BST`: one bold headline saying what the window came to, then one line per item that changed in it, delivered, decided, started, stopped, blocked or newly captured, with material failures, corrections and limitations beside the items they qualify, and commits and a recovered session among them. With nothing changed, one line says so.
2. **`## Status`**, the status table below.
3. **`## Findings`**, only while a finding the owner asked for is open, under the owner report's **Findings**.
4. **`## Queries`**, every open query in full under the [owner report](standards-reporting.md#owner-report), a proposed work transfer last, or `None.`. The [interactive pass](standards-queries.md#interactive-pass) follows, keeping each query's tag, Context, Query and Options.
5. **The footer**, in its long form: the art, then the [banner](standards-coordination.md#banner) with its [roadmap and package lines](#banner-detail) and its thread line.

**The status table** has two columns, **Focus** and **Where it stands**, and one row per focus area holding items, in `work.md`'s Focus order with the primary first. It is the full board, not a delta: every live item appears whether or not it changed.

- **Focus cell:** line one is the focus id alone in bold, the underscore escaped, as in `**\_emerging**`, with ⭐ on the primary. Under it, at normal size, the focus's line from `work.md`'s Focus section, word for word. The Focus column takes at most a third of the table's width, so each focus line stays one short phrase of goal and order; a longer line is shortened in `work.md`, never reworded in the Summary.
- **Where it stands:** a bold headline giving the focus's state in a few words, then one line per item, opening with its holder, 👤 Kris, 🤖 a worker, 🧵 another thread or ⏳ the outside world, then what it is and its next step. The owner's items come last and name their query's tag, so no waiting column is needed. Uncommitted work, unlogged decisions and repositories behind their remote, under the [repository level check](standards-sync.md#repository-level-check), are 🤖 lines in their own row, or the primary's.
- **`_emerging`** is a usable catch-all focus and gets a row like any other.
- **Rendering:** a plain Markdown table with `<br>` between the lines of a cell. The owner wants top-aligned cells, which Markdown cannot ask for; Orca's chat view is asked for them under [PERSONAL-DOTFILES-UE-107 (pruned)](https://github.com/krisb/dotfiles/blob/7f5a625/docs/roadmap/PERSONAL-DOTFILES-UE-107-decide-orca-adoption.md), ORCA-TABLE-ALIGN. Until then cells centre.

```markdown
## Status

| Focus | Where it stands |
| --- | --- |
| **reporting** ⭐<br>Status-led reports every thread can read cold | **Landing in the standard**<br>🤖 summary-model writes the Summary into ki-coordination; next: checks<br>👤 STATUS-WIDTH: whether 90 columns suits every surface |
| **\_emerging**<br>Side asks that may grow into focus areas | **Waiting outside**<br>⏳ Orca top-aligned table cells; next: Orca's answer |
```

**The footer** is the Knowledge Islands art, then the banner. The art shows on every Summary unless the owner added `no art`, and on no other report. What the art and the footer lines carry is for Knowledge Islands Agora, `ki.prj.agora`, to decide, liaising with `ki.sop.main` as the keeper of this standard. Until Agora publishes its own, the art is the 88-column Knowledge Islands drawing in the [summary-model design note](https://github.com/krisb/dotfiles/blob/29dc51c/+/_WORK/personal.reg.household-terra/_emerging/summary-model.design.md), whose scroll carries the host and the state, the counts in words, and the day, date and local time.

**Sources of a Summary:** `decisions.md`; every report in the package, and, for reports a [prune](standards-mark.md#pruning-the-work-folder) deleted, their last revision in Git; the parked tags in `discussions.md`; `ki agent status`; record transitions in the work's scope from the Git history of the roadmap paths; and `git log -- +/_WORK/<id>/`, the logbook. The mark bounds them all. Where a report is missing from the package and from Git, the Summary says what it could not read rather than reconstructing it from memory.

Sources: SUMMARY-MODEL, TABLE-ALIGN, FOOTER-AGORA and FOOTER-COUNTS in [the decision register](sources.md#decision-register).

## Banner detail

**Rendered glyphs.** The emoji stay the written notation in reports, terminals and commits. A rendered surface, such as the Observatory's Work tab, may draw the five glyphs, 🤖, 👤, 🎯, ⏸️ and 🏁, and Snoozing's 💤 once the package carries one, with the matching line glyphs from `@knowledgeislands/icons`, always with the state's words beside them. The words, arrows and banner shape do not change, and the package owns the mapping from state to glyph.

**Report heading.** One `#` heading, one bold form line and one horizontal rule, then the first section: `## Summary since <time>` in a [Summary](#the-summary), `## Done` otherwise. It is plain Markdown, not a fenced block, so the heading can carry links.

- **Heading:** `# [<Theme>](<local theme page>) › [<Project>](<local Project note>)`: the theme's display name, the `title` its page gives, linked to the page by absolute path, then ` › `, then the Project's display name in words, not its slug, linked to its note the same way.
  - Project work with no theme gives the Project alone.
  - A State of play writes the territory or theme it covers, linked to its local note, then `› State of play`; a secondary `› State of play (<name>)`.
  - Explicitly coordinating regular or ad hoc work uses `# [<actual work label>](<actual local work page>)`, optionally preceded by its real theme, linking `work.md` where no separate page exists; never fabricate a Project.
  - No rule stands before the heading, so it is the first line and H1 of every saved report.
- **Form line:** a blank line, then `**<glyph state> · <Form> at <local time> · <window or mark>**`: the glyph heading of the work's state as sent, then the form, `Summary`, `Status`, `Re-bootstrap`, `Run report`, `Hold report` or `Finish report`, and the times, local and written like `19:13 BST`. A Summary writes `· since <window start>`, the same time as its `## Summary since <time>`; a Status, re-bootstrap report, run report and finish report write `· last mark <local time>`; a hold report writes `· mark <local time>`, the mark struck for the hold.
- **Three times:** each with its own words.
  - `<Form> at <local time>`: when the report was given.
  - In a Summary, `since <time>`, in the form line and `## Summary since <time>` alike: the start of the window, the last mark, the session's start where there is none, or the owner's time. After `mark` it is the previous mark, because the new one has just been struck.
  - In the banner, the heading's `at <time>`: when the work entered the state shown, a moment, not a window's start. Each item's `since <time>`: how long it has stood in its place.
  - `since` opens only a span, never a moment.
- **Rule after:** a blank line, one `---`, a blank line, then the first `##` section.
- **Nothing else:** no window and no level. The form fixes the window and the banner carries the state.

Opening a Summary:

<!-- ki-coordination:block heading-example -->

```markdown
# [Model](/Users/krisbrown/workspaces/knowledge-islands/ki-principal/Streams/Themes/model.md) › [Ways of working](/Users/krisbrown/workspaces/knowledge-islands/ki-principal/Streams/Projects/ways-of-working.md)

**🤖 → 👤 Handoff to supervisor · Summary at 23:52 BST · since 22:34 BST**

---

## Summary since 22:34 BST
```

A State of play opening a Summary from a time the owner named:

```markdown
# [<territory or theme>](<its local note>) › State of play

**👤 With supervisor · Summary at 19:13 BST · since 09:00 BST**

---

## Summary since 09:00 BST
```

**Roadmap and package lines.** Directly beneath the counts line, each after a blank line, the Summary's footer carries one line of roadmap counts and one of package counts. In a Summary of work On hold the counts line is the hold line, `⏸️ drained · 🅿️ <n> queries parked`, or `💤 waiting for a message · 🅿️ <n> queries parked` while Snoozing, with the two lines beneath it, so the counts stay together under the heading and the thread line stays last.

- **Roadmap line:** `🗺️ roadmap · <n> records · <n> open · <n> done awaiting prune · <n> ideas`, from `ki repo roadmap summary` in the repository homing the package. Records is the total, ideas the `triage` horizon, done awaiting prune the done and cancelled records, and open every other record. A count of one takes the singular, as in `1 record` or `1 idea`. A repository with no roadmap has no roadmap line.
- **Package line:** `📦 package · inbox <n> · outbox <n> · held <n> · awaiting ACK <n>`, from the package: inbox counts the lines in `messages.md`'s `## Inbound`, outbox those in its `## Outbound`, held the items under `state.md`'s `## Held`, and awaiting ACK the Outbound lines no ACK has answered, one per `[awaiting ACK]` item.
- Both are counted afresh for each Summary and write their zeros; they are counts, never items.
- **Long and short footers:** the **long form** is the art, then the banner with these two lines, closing a Summary or a Status. The **short form** is the banner alone, closing a re-bootstrap report, hold report, run report, finish report and any other reply ending with the banner. [Templates](#templates) shows which each form takes.

**Mode lines.** A banner shows each capability the coordinator has, one line each, below the list and any heading-for line and above the thread line, a blank line before each. A line appears only where its `_enabled` field is true, and then always, showing its status; with `_enabled` false there is no line.

- With `listening_enabled: true`: `👂 listening` while the [watcher](standards-listening.md#inbox-watch) is armed, `listening_status: on`, and `🔇 not listening` otherwise, `listening_status: off`: while draining, On hold and paused, after "stop the wake" or "stop listening", or where the runtime cannot be woken.
- A coordinator the owner has not asked to listen, and that is no host sync thread, shows no listening line, never `🔇 not listening`.
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

🤖 2 running · 👤 1 with you · ⛔ 1 blocked

🗺️ roadmap · 6 records · 4 open · 1 done awaiting prune · 1 idea

📦 package · inbox 1 · outbox 0 · held 0 · awaiting ACK 0

- [running] work-model · run/work-model · since 23:20
- [running] tools-burndown fix · work/ki.tools-burndown · since 23:05
- [with you] WORK-HOME · owner · since 22:58
- [blocked] work folder commit · repo/ki-principal · since 22:40

👂 listening

⚒️ 🔑 ki.prj.ways-of-working
```

Handoff to supervisor, closing a Summary that sends the work to the owner:

<!-- ki-coordination:block handoff-banner -->

```markdown
### 🤖 → 👤 Handoff to supervisor · at 23:52 BST

👤 2 with you · 🅿️ 1 parked

🗺️ roadmap · 6 records · 3 open · 2 done awaiting prune · 1 idea

📦 package · inbox 0 · outbox 0 · held 0 · awaiting ACK 0

- [with you] WORK-MODEL · owner · since 23:52
- [with you] WORK-HOME · owner · since 22:58
- [parked] 1

👂 listening

⚒️ 🔑 ki.prj.ways-of-working
```

With worker, draining towards a hold after `pause`, with one run still finishing:

<!-- ki-coordination:block draining-banner -->

```markdown
### 🤖 With worker · at 23:41 BST

🤖 1 running · 👤 1 with you

- [running] work-model · run/work-model · since 23:20
- [with you] WORK-HOME · owner · since 22:58

↪️ draining → ⏸️ On hold

🔇 not listening

⚒️ 🔑 ki.prj.ways-of-working
```

**Restart suggestion.** Suggest restarting a session only when one of three triggers holds, and for nothing else:

- **Identity changed:** the work's id, level, label or run name changed in this session, as when a package moves from `hnr.prj.email-routing` to `hnr.reg.email-routing`. The session's name, run and opener no longer match `work.md`, and only a fresh opener sets all three again.
- **Repeated compaction:** the session has been compacted twice or more. Each [re-anchoring](standards-bootstrap.md#re-anchoring-after-compaction) rebuilds from a summary of a summary, and a fresh bootstrap from the package is more faithful.
- **Method moved on:** since the session opened, the method changed its opener, the hook line or the output style, checked under [Refreshing this guidance](standards-coordination.md#refreshing-this-guidance). A session keeps the style and opener it loaded at start; only a fresh session loads the current ones.

The suggestion is a single closing item placed with the banner, directly before its `###` heading and after `## Queries` or `## Status`, so the banner and thread line stay last. It is one bold line naming the trigger and saying plainly that the session would be better restarted, then the work's opener exactly as `ki agent prompts <territory>` prints it for this work, in one fenced block:

````text
**Restart suggested:** the work moved from hnr.prj.email-routing to hnr.reg.email-routing in this thread, so its label, run name and opener changed; this thread would be better restarted in a fresh session with this opener.

```text
Bootstrap as hnr.reg.email-routing regular work under ki-coordination.
...
```
````

- It is the second named exception to the rule that a report carries no send, resume or paste line, beside the bootstrap `Rename thread:` line under [Opening work](standards-opening.md#opening-work).
- Never for length, age, a change of state, a hold or a model switch alone.
- Give it in each report closing with the banner while the trigger holds; once the owner declines it, not again until a new trigger arises.
- A hold report, run report or conversational reply never carries it. Picking work up still follows the package, and the owner closes the old session.

Send and receive remain the work model's moves. To pick work up, follow [Picking work up](standards-bootstrap.md#picking-work-up) from the package; the thread line identifies work and is not a restart prompt.

On hold, closing a hold report:

<!-- ki-coordination:block hold-banner -->

```markdown
### ⏸️ On hold · paused until the harness migration lands · at 00:10 BST

⏸️ drained · 🅿️ 9 queries parked

- [parked] 9 queries in `discussions.md`
- [release] after the harness migration lands, or `resume`

🔇 not listening

⚒️ 🔑 ki.prj.ways-of-working
```

Snoozing, closing a hold report for a hold that waits for more to come:

<!-- ki-coordination:block snoozing-banner -->

```markdown
### 💤 Snoozing (on hold) · at 23:58 GMT

💤 waiting for a message · 🅿️ 2 queries parked

- [parked] 2 queries in `discussions.md`
- [release] a message arrives, or `resume`

👂 listening

⚒️ 🔑 ki.prj.ways-of-working
```

Finished, closing the last report at [Finishing Project work](standards-mark.md#finishing-project-work):

```markdown
### 🏁 Finished · Ways of working closed at 18:00 BST

- [finished] 14 work items accepted, decisions homed, work folder pruned

⚒️ 🔑 ki.prj.ways-of-working
```

**In an agent's report.** A background agent's run report takes the same heading and banner, under the [owner report](standards-reporting.md#owner-report): the heading of the work it reports to with `› <run name>` added and the form `Run report`, so its form line reads `**🤖 → 👤 Handoff to supervisor · Run report at <local time> · last mark <local time>**`, the mark being that work's, with `· blocked` added where it sends back with a blocking query. Its own banner gives the run's state and items, closing with the thread line of the work it reports to. Opening a run report:

```markdown
# [Model](/Users/krisbrown/workspaces/knowledge-islands/ki-principal/Streams/Themes/model.md) › [Ways of working](/Users/krisbrown/workspaces/knowledge-islands/ki-principal/Streams/Projects/ways-of-working.md) › migrate-phase1

**🤖 → 👤 Handoff to supervisor · Run report at 20:40 BST · last mark 14:54 BST**

---

## Done
```

Sources: BANNER-GLYPHS, RICH-HEADING, REPORT-FORMS-TIDY, SNOOZE-HEADING, FOOTER-COUNTS, LISTEN-STATUS, FOOTER-LAYOUT, FOOTER-CAPABILITY-STATUS-2, FOOTER-NOT-LISTENING, SYNC-LINE-OFF and RESTART-SUGGEST in [the decision register](sources.md#decision-register).
