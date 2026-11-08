# Coordinating-work standard: reporting

This file holds the reply forms every session uses and the owner report with its queries, answers, tags, quiet tools and links. It extends [the core](standards-coordination.md).

## Contents

- [Reply forms](#reply-forms)
  - [Session kinds](#session-kinds)
  - [Units of work](#units-of-work)
  - [Conversational bounded work](#conversational-bounded-work)
  - [Coordinator-only machinery](#coordinator-only-machinery)
- [Owner report](#owner-report)
  - [Answers](#answers)
  - [Quiet tools](#quiet-tools)
  - [Tags](#needs-tags)
- [Links and wording](#links-and-wording)
- [Linking records](#linking-records)
- [Report rule sources](#report-rule-sources)

## Reply forms

Every reply to the owner takes one of three forms.

| Form | When | Shape |
| --- | --- | --- |
| Conversational reply | The default in every conversational session, for anything that does not end a [unit of work](#units-of-work): answers, acknowledgements, clarifying questions, plans proposed for agreement and timed progress updates | Plain prose: no heading, section, tag or banner. A question for the owner is one line |
| Owner report | When a unit of work ends, in any session, and as every background agent's final report | The [owner report](#owner-report): `## Done`, `## In Progress` and `## Queries`. In a conversational session, including regular or ad hoc work without a coordinating opener, it has no report heading, form line or banner and opens at `## Done` |
| Coordinator forms | Every reply while explicitly coordinating a valid package, and a run's final report to it | The [coordinator reply format](standards-report-forms.md#coordinator-reply-format): each reply's [trigger](standards-report-forms.md#triggers) sets its structure, the [Summary](standards-report-forms.md#the-summary), Status, Bootstrap, Stop, Position, Update or Answer, and its layout, Full, Medium, Short or Minimal, with the package and mark that go with them; a run writes its run report in Medium |

- While coordinating, the report at the end of a unit is the Summary.
- In a conversational session, a request for a "summary", "full summary", "mark" or "status" gets a conversational reply, and a "recap" gets the ordinary `ki-recap` session recap in its own form; neither borrows a coordinator form.
- **Suggestions carry a confidence.** In every reply form and every session, a suggestion is a recommendation carrying a confidence, `high`, `medium` or `low`: a query's options under the [owner report](#owner-report), a suggestion in a conversational reply, a plan proposed for agreement and a run report alike.

Sources: REPORTING-FORMS, RECOMMEND-CONFIDENCE and REPLY-FORMAT in [the decision register](sources.md#decision-register).

### Session kinds

A session with no coordinating opener is conversational. It may do bounded work directly, including regular or ad hoc work, and uses the conversational reply forms. A repository declaring this skill, or injecting its hook, does not make a session a coordinator.

A run is the detached actor a coordinator briefs under `ki-delegation`, not a fourth owner-facing session kind. It delivers its bounded unit and returns the owner report to its reporting package.

Sources: REPORTING-FORMS in [the decision register](sources.md#decision-register).

### Units of work

A unit of work ends, and a report is owed, when at least one of these holds since the last report:

1. **Changed:** a change to a repository, configuration or external system was committed, or deliberately left uncommitted with the reason stated.
2. **Sent:** work passed to other work, a repository, a record or a person, such as a captured record, a trade, a `messages.md` line or a handoff.
3. **Run finished:** a run the session launched has finished; for a background agent, its own run is ending.
4. **Deliverable:** a deliverable the owner asked for, such as a document, report, draft or analysis written to a file, has been produced.
5. **Stopped for the owner:** the work stopped before completion with something the owner must decide, supply or do, such as a failure, a block or a decision.

None of these ends a unit, and each gets a conversational reply: answering a question, however many reads it took; acknowledging an instruction or decision; a clarifying question; an interim step or timed update; a single read, lookup or check; a plan proposed for agreement.

- A change the owner asked for, made in the same turn in one file or one commit, with nothing failed, open or left to decide, is confirmed in one plain line naming what changed.
- Work ending with nothing changed and nothing open is told in one plain line; with nothing changed but something open, it meets criterion 5.
- A background agent always reports, because its report is its run's only output.
- One report covers every unit that ended in the same turn.

### Conversational bounded work

A conversational session does bounded work directly, without delegating, opening a run or becoming a coordinator. Work is bounded when it serves the matter the owner raised in the session, stays within the authority given there and each repository's own rules, and can finish with the owner in the session.

- The session may delegate when it chooses.
- It becomes a coordinator only when the owner opens or re-bootstraps it with a coordinating [opener](standards-opening.md#opening-work), never on its own.
- When the work outgrows the bound, because it needs a Project's decisions, more than one run at once, or would keep the owner waiting across sessions, the session says so in one line and proposes the Project's work, or new Project work through the State of play.

Work that must outlive the session takes an ad hoc package, `+/_WORK/<territory>.reg.<slug>/`, under the work-package standard. It pauses by putting the work On hold through a `state.md` update, with no Stop or banner. Its agents head their reports `# <work title> › <run name>` with `**Run report at <local time>**` and no banner.

Sources: CONVERSATIONAL-RUN and CONVRUN-NARROW in [the decision register](sources.md#decision-register).

### Coordinator-only machinery

The report heading and form line, the banner and its thread line, the mark, the acting rule for `messages.md`, re-anchoring after compaction, the turn budget and the watcher belong to coordinators only. A conversational session's optional package is a plain record: it notes a pause in `state.md`'s front matter and how to carry on in its next steps, and is finished and pruned when the work ends.

## Owner report

Every report a unit of work owes under [Reply forms](#reply-forms) takes one shape, the **owner report**: a background agent's final `<name>.report.md`, which the owner reads directly; a coordinator's Bootstrap and Stop; and a conversational session's report when a unit ends. A coordinator's [Summary](standards-report-forms.md#the-summary), including the one it sends with, builds its own sections from the same parts: its queries, links, plain English and levels are the owner report's. This standard is the one source; `ki-delegation` links here, and the runtime surfaces are rendered from [Generated surfaces](standards-coordination.md#generated-surfaces).

The label is written `Outstanding - no action requested now` and the query heading `<tag> - <title>`, each with a spaced hyphen.

- **Heading:**
  - a coordinator's report opens with the heading block, its [report heading](standards-report-forms.md#banner-detail) and form line;
  - a background agent's run report uses the heading of the work it reports to with `› <run name>` added, and the form line `**Run report at <local time> · last mark <local time>**`;
  - a conversational session's report has no report heading, form line or banner and opens at `## Done`;
  - a background agent reporting to a conversational session or to ad hoc work heads its saved file `# <work title> › <run name>`, with the form line `**Run report at <local time>**`, and no banner.
- **Sections:** `## Done`, `## In Progress` and `## Queries`, in that order, every time, with the optional `## Findings` between `## In Progress` and `## Queries`. An empty section still appears and says so in one line, `Nothing is running` or `No outstanding queries`. One exception: a [Summary](standards-report-forms.md#the-summary) or Status keeps its own sections. A [Stop](standards-holds.md#putting-work-on-hold) for a hold keeps the three, with Left over in `## In Progress` and the parked queries in `## Queries`, one line each, with no Context, Query or Options, because the queries live in the package.
- **Done:** completed outcomes, one line each, with material failures, corrections and limitations beside them, not behind them. A background agent puts its commit identifiers and check results here, because the owner reads the report, not the log.
- **In Progress:** what is running and what is waiting, each with its owner or dependency. Then, under `Outstanding - no action requested now`, the matters that need nothing from the owner, grouped as agent work, receiver-owned work, verification limitations and retained material, apart from the decisions the owner must make.
  - A [Summary](standards-report-forms.md#the-summary) is windowed on its start: a handoff to other work is reported once, under `## Summary`, and not carried after; an item a record holds is left to the roadmap; and its status table holds only this work's own holdings. A Summary since an earlier time gives the longer view.
- **Findings:** optional, and only on the owner's request: the output of an investigation, such as a survey, table, comparison or assessment, informing a judgement the owner has still to make. A run's own observations and check results stay in Done or become queries.
  - **Placement:** while at least one is open, `## Findings` sits between `## In Progress` and `## Queries` in a run report, Bootstrap or other Medium reply, and between `## Status` and `## Queries` in a [Summary](standards-report-forms.md#the-summary). Otherwise it is left out.
  - **Shape:** each finding is a `### <TAG> - <plain-language title>` heading, its tag in the [tag](#needs-tags) vocabulary. Before any table it opens with three lines: **Goal**, the question asked, in the owner's words where they exist, who asked and when; **Scope**, what was and was not looked at; **As of**, when the facts were last checked. The table or short list follows, then one line naming the queries it raised.
  - **Queries:** a finding raises queries rather than replacing them. Each decision it calls for is a query in `## Queries`, whose Context may name the finding by its tag.
  - **Carrying:** a finding is carried in full, table and all, in every report until a mark settles it, unless the owner keeps it open, or until the owner says they are content. A prompt drafted for the owner to hand on is carried the same way under `## Findings`: its goal line says who it is for and what it asks, and the prompt is given in full in one fenced block.
  - **Settling:** at settlement, give each finding or prompt one disposition in `decisions.md`: homed in a record, in a change document or in `decisions.md`, or dropped.
  - **File:** between reports, a finding lives in the package as `findings/<tag>.md`, holding exactly the text the report carries, goal first. The package read counts `findings/` with the five files, under `ki-work-package`'s [closed list](../../../governance/ki-work-package/references/standards-work-package.md#closed-list).
- **Queries:** one `###` heading per actionable query, `<tag> - <plain-language title>`, linked to its record where one exists, the tag from the [tag](#needs-tags) vocabulary. A routine open matter is not a query; it belongs in In Progress. Nor is a push of stacked commits: routine push state is left out of the report and banner. A query's body is three bold labels and nothing else:

  ```markdown
  ### <TAG> - <plain-language title>

  **Context:** <enough for the owner to decide without reading anything else>

  **Query:** <the question, in one sentence>

  **Options:**

  a) (recommended, confidence <high, medium or low> - <one-line reason>) <the recommended course>

  b) <an alternative>
  ```

  - **Parts:** **Context** gives enough to decide without reading anything else, including the matter's significance and current state. **Query** is the question in one sentence. **Options** is the lettered list, `a)`, `b)` and so on, with no bullet before a letter.
  - **Paragraphs:** the three parts are separate paragraphs with a blank line between them, and each option is its own paragraph with a blank line between options, so the query passes `rumdl check` under the house `.rumdl.toml`, whose MD013 reflow would otherwise join lazily continued lines.
  - **Recommendation:** option a) is always the recommendation and carries `(recommended, confidence <level> - <reason>)` before its text, the level `high`, `medium` or `low` and the reason one line, as in `a) (recommended, confidence high - the patch is already on main) push it`. Only option a) carries a confidence.
  - **Confidence:** reflects how reversible the course is and how much of what it rests on the session verified directly, rather than took from another agent's report. A course that destroys, deletes or publishes and rests on claims not verified directly is never `high`. Consistency with an earlier decision is not a reason and earns no level: an option a) whose only reason is an earlier decision is capped at `medium`.
  - **Checks:** the rubric's COORD-11 warns on any line of a Queries section beginning `<letter>) (recommended` without `, confidence high|medium|low - <reason>)`, and when one `###` query marks more than one option `(recommended`; such a query is split into separately tagged queries.
  - **Review:** before reaching the owner, a query passes the [query review](standards-queries.md#query-review) where its confidence or course calls for one.
  - **Alternatives:** further options appear only when they are real alternatives. A query needing only confirmation still gives a), plus b) for the obvious alternative, such as "leave it as it is".
  - **Reply block:** a coordinator's reply or a run report that carries at least one query in full closes its queries with the reply block: one fenced `text` block, one line per query, its tag and the recommended option's letter, as `<TAG> a`, ready for the owner to copy, change and send. A conversational session's report carries none.

  A query and its options:

  ```markdown
  ### LINK-GUARD - where the link guard should live

  **Context:** The hook line already names the linking rule, and KI-HARNESS-GOV-188 carries the harness half; the link printer is a `ki` change, so each half has a different home.

  **Query:** Should the link guard be split across its homes, or held in the harness until the printer lands?

  **Options:**

  a) (recommended, confidence high - each half's home is already settled) split it: hook line and KI-HARNESS-GOV-188 in the harness, the printer in KI-TOOL-KI-CLI-127

  b) hold the whole guard in the harness until the printer lands
  ```

- **Posting outside:** a recommendation to post anything in the owner's name outside the owner's own repositories and services, an issue, comment, reaction, pull request, discussion, review or message on another owner's repository or service such as an upstream issue tracker, is a query, never an action. Its **Context** or option carries the exact text proposed and where it would go, and nothing is posted until the owner answers that query; a broader grant, an earlier answer or a recommended option never stands in for it. `ki-delegation` owns the ban under its [external-posting rule](../../../governance/ki-delegation/references/standards-background-runs.md#authority-tiers).
- **Plain English:** a query's Context, Query and options, and the report's other explanations, are in plain English. A technical term appears only where needed and is explained in plain words the first time. Links to records are kept under **Links**.
- **Headings:** the sections are `##` headings and each query a `###` heading, so a report nests the same way wherever it appears, under the one `#` report heading. Sub-headings in `Done`, where a long report groups outcomes by topic, and the banner heading are `###` too.
- **Links:** every record, package file, Project, theme, decision, receipt and evidence artefact is linked under [Linking records](#linking-records), a pruned record as `[<FULL-ID> (pruned)](https://github.com/<owner>/<repo>/blob/<last revision>/<path>)`.
- **Levels:** the owner's personal instructions set a communication level, `quiet`, `standard` or `detailed`, which this standard does not restate. The shape is the same at every level; the level sets only depth.
  - `quiet`: the status-line cadence during work is unchanged, this report replaces the end-of-unit report, done items are one line each, in-progress items name only the work and what it waits on, and a query carries just enough context to be answered cold.
  - `standard`: adds material context and exceptions to each section.
  - `detailed`: adds the plan, validation evidence and rationale.
  - No level hides a failure, a required decision or a material risk.
  - In a coordinator session the level never changes the layout and governs only the wording inside B1, the Answer, under the [coordinator reply format](standards-report-forms.md#coordinator-reply-format).

Sources: REPORT-SOURCE, OWNER-REPORT-FORMAT, REPORT-HEADINGS, REPLY-BLOCK, HOLD-QUERIES, SUMMARY-WINDOW, FINDINGS-SECTION, QUERY-SHAPE, FORM-VS-RUMDL, CONFIDENCE-STANDARD, REVIEW-LIFT, ACCEPT-BY-CRITERIA, CONFIDENCE-CHECK, REVIEW-CHECK, NO-EXTERNAL-POSTING and PLAIN-ENGLISH and REPLY-FORMAT in [the decision register](sources.md#decision-register).

### Answers

A coordinator reply or run report carrying a query in full ends its queries with the reply block under the owner report's **Reply block**; no report carries a `No reply needed.` line. The owner answers by sending the block as it stands or changed, or in speech, naming a query by its tag or answering in order, and may answer with an option's bare letter. The worker reads each answer back as taken in `decisions.md`, in the turn it arrives, `Taken as: <the instruction it will act on>`, and asks one line where an answer is unclear, never acting on a guess. A suggested course is not approval: nothing is acted on until the owner answers.

Sources: REPLY-BLOCK and REPLY-FORMAT in [the decision register](sources.md#decision-register).

### Quiet tools

Every session and every background agent runs its tools quietly and reports what they found, never what they printed.

- **Git:** run Git with `-q` wherever the command takes it, such as `git commit -q`, `git fetch -q`, `git pull -q` and `git push -q`.
- **No pasted output:** never paste gate, audit, test or Git output into a reply, update or report, in full or in part; it stays in the session log.
- **One line per outcome:** report each outcome in one plain line, such as "tests pass", "the ki-coordination audit has no new findings" or "the unit failed its push", naming a failure and what it means in the same line. Detail and evidence follow only when the owner asks.

Sources: QUIET-TOOLS and RESTART-AGREE in [the decision register](sources.md#decision-register).

<a id="needs-tags"></a>

### Tags

Each outstanding query carries a short mnemonic tag, such as `BOT-1`, `CSWAP` or `PUSH`, never a bare number, so the owner can answer "BOT-1 do it". The tag heads the query in a report and labels the same item in `discussions.md`'s parked tags, the banner and a Summary's status table: it is the one vocabulary for open items. A tag is stable: it keeps its meaning across reports until the item is resolved and is never reused. Queries are never numbered.

## Links and wording

- **Links:** every record a report names is linked by its full identifier to its local file under [Linking records](#linking-records). The rubric flags any record identifier a report leaves unlinked.
- **Wording:** plain language; "background agents" for the worker processes and "runs" for their groups, never "helpers". When the owner must paste a message into another session, give it in a code block ready to copy.

## Linking records

Whenever a session or report mentions a roadmap or work record, a package file, a theme, a Project, a decision, a receipt or an evidence artefact, it cites the full identifier, such as `KI-HARNESS-GOV-144` rather than `GOV-144`, because area codes repeat across repositories, and uses it as the link text.

- **Target:** link each to its local file by absolute path, so it opens in the owner's editor, resolving the repository through the KI registry (`ki registry`) where available. Use the verified canonical remote URL only when there is no local copy. A query heading links to its record where one exists.
- **Never invented:** when a target cannot be resolved, the text says so.
- **Pruned records:** a pruned record has no local file, so it is linked as `[<FULL-ID> (pruned)](https://github.com/<owner>/<repo>/blob/<last revision>/<path>)`. The link text is always the full identifier followed by `(pruned)`, and the last revision is the last commit in which the file existed, usually the parent of the prune commit. A live record keeps its local-file link; a pruned record is never pointed at the Project note that carries it, nor left as a bare identifier.
- **Scope:** status lines, reports, recaps and package files alike, a background agent's report included.
- **Check:** the rubric's COORD-7 checks the reports under `+/_WORK/<id>/`, in each focus folder its `_index.md` declares and in `reports/`.
  - Every full record identifier in their prose, a record or a Decision Record, sits inside a Markdown link.
  - A link that names a record and targets an absolute local path points at a file that exists, inside the audited checkout and wherever the target's folder is present on the machine, so a checkout beside it is checked too.
  - A target outside the checkout whose folder is absent, as every other repository is on a CI runner, is checked for shape only: a Markdown file whose name opens with the linked identifier, as [KI-HARNESS-GOV-197 (pruned)](https://github.com/knowledgeislands/ki-agentic-harness/blob/95a1ab58/docs/roadmap/KI-HARNESS-GOV-197-pmo-7-outside-checkout-links.md) set.
  - Fenced blocks, inline code spans, which quote literal text such as a commit subject and cannot hold a link, and tags such as `ACCEPT-181` are not record identifiers and are not checked.

Sources: LINK-FORM in [the decision register](sources.md#decision-register).

## Report rule sources

<!-- ki-coordination:source run-report -->

```markdown
**Report** to `<report path>`, in the run's state folder and nowhere else, as an owner report: the ki-coordination report heading of the work you report to with `› <run name>` added, `# [<Theme>](<local theme page>) › [<Project>](<local Project note>) › <run name>` for Project work, or `# [<actual work label>](<actual local work page>) › <run name>` for regular/ad hoc coordination, the bold `**Run report at <local time> · last mark <local time>**` line and one `---`, then `## Done`, `## In Progress` and `## Queries`, each query carrying **Context**, **Query** and lettered **Options** as separate paragraphs with a blank line between them, each option its own paragraph, `a) (recommended, confidence <level> - <reason>)` first and no bullets, closing the queries with a reply block, one fenced `text` block with one line per query, its tag and the recommended letter, as `<TAG> a`, in plain English with a technical term only where needed and explained once, keeping links to work items and records; where the brief asks for findings, add `## Findings` between `## In Progress` and `## Queries`, each finding a `### <TAG> - <title>` heading opening with its **Goal**, **Scope** and **As of** lines before any table, and write it also to the finding file the brief names; then, for coordinating work, the glyph banner the ki-coordination [Banner](../../../change-management/ki-coordination/references/standards-coordination.md#banner) section prints, its `###` state heading, `### 🤖 → 👤 Handoff to supervisor · at <local time>`, or `· blocked · at <local time>` where you send back with a blocking query, its counts line of five views with zeros, `🤖 <n> running · ⏳ <n> queued · 👤 <n> with you · ⛔ <n> blocked · 🅿️ <n> parked`, and `- [state] what · holder · at <time>` list, closing with one thread line, `🧵 <work-id>` for every explicitly coordinating package, including main and secondary State of play, Project, regular and ad hoc work, using the work you report to, and no send or resume line; a run report to a conversational session, including regular or ad hoc work without coordination, has no mark in its form line and no banner. The report's first non-blank line is its `#` heading, after front matter if the report has any. Run tools quietly under the ki-coordination [quiet-tools rule](../../../change-management/ki-coordination/references/standards-coordination.md#quiet-tools): run Git with `-q`, never paste gate, audit or Git output, and report each outcome in one line. Owner reports, run reports and banners omit routine push state and other sessions' stacked commits; if your own unit could not be published because its push failed, Done names the affected unit and reason. A Stop keeps nothing about pushes beyond a failure.
```

<!-- ki-coordination:source footer-report -->

```markdown
- Write the report as the owner report the ki-coordination [owner-report standard](../../../change-management/ki-coordination/references/standards-coordination.md#owner-report) sets: the ki-coordination report heading of the work you report to with `› <run name>` added, `# [<Theme>](<local theme page>) › [<Project>](<local Project note>) › <run name>` for Project work, or `# [<actual work label>](<actual local work page>) › <run name>` for regular/ad hoc coordination, then the bold `**Run report at <local time> · last mark <local time>**` line and one `---`; `## Done`, with commit identifiers and each check's outcome in one line; `## In Progress`; where the brief asks for findings, `## Findings`, each finding a `### <TAG> - <title>` heading opening with its **Goal**, **Scope** and **As of** lines before any table, also written to the finding file the brief names; `## Queries`, each query carrying **Context**, **Query** and **Options** as separate paragraphs with a blank line between them, each lettered option its own paragraph with a blank line between options, `a) (recommended, confidence <level> - <reason>)` first and no bullets, in plain English with a technical term only where needed and explained once, keeping links to work items and records, closing the queries with a reply block, one fenced `text` block with one line per query, its tag and the recommended letter, as `<TAG> a`; then, for coordinating work, the glyph banner, its `###` state heading, `### 🤖 → 👤 Handoff to supervisor · at <local time>`, or `· blocked · at <local time>` where you send back with a blocking query, its counts line of five views with zeros, `🤖 <n> running · ⏳ <n> queued · 👤 <n> with you · ⛔ <n> blocked · 🅿️ <n> parked`, and `- [state] what · holder · at <time>` list, closing with one thread line, `🧵 <work-id>` for every explicitly coordinating package, including main and secondary State of play, Project, regular and ad hoc work, using the work you report to, and no send or resume line; a run report to a conversational session, including regular or ad hoc work without coordination, has no mark in its form line and no banner. Run tools quietly under the ki-coordination [quiet-tools rule](../../../change-management/ki-coordination/references/standards-coordination.md#quiet-tools): run Git with `-q`, never paste gate, audit or Git output, and report each outcome in one line. Owner reports, run reports and banners omit routine push state and other sessions' stacked commits; if your own unit could not be published because its push failed, Done names the affected unit and reason. A Stop keeps nothing about pushes beyond a failure.
```
