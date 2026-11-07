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
  - [Needs tags](#needs-tags)
- [Links and wording](#links-and-wording)
- [Linking records](#linking-records)
- [Report rule sources](#report-rule-sources)

## Reply forms

Every reply to the owner takes one of three forms.

| Form | When | Shape |
| --- | --- | --- |
| Conversational reply | The default in every session, for anything that does not end a [unit of work](#units-of-work): answers, acknowledgements, clarifying questions, plans proposed for agreement and timed progress updates | Plain prose. No heading, section, Needs tag or banner, except that a coordinator's reply that moves the mark, changes the work's state or answers where the work stands ends with the [banner](standards-coordination.md#banner). A question for the owner is one line |
| Completed-work report | When a unit of work ends, in any session, and as every background agent's final report | The [owner report](#owner-report): `## Done`, `## In Progress` and `## Queries`. In a conversational session, including regular or ad hoc work without a coordinating opener, it has no report heading, form line or banner, and opens at `## Done` |
| Coordinator summary | Only while explicitly coordinating a valid work package | The [report forms](standards-report-forms.md#report-forms): the [Summary](standards-report-forms.md#the-summary), the re-bootstrap report and the hold report, each under the report heading and form line, closing with the banner and its thread line, with the work package and mark that go with them |

While coordinating, the completed-work report is the Summary. In a conversational session a request for a "summary", "full summary", "mark" or "status" gets a conversational reply, and a request for a "recap" gets the ordinary `ki-recap` session recap in its own form; neither borrows a coordinator form.

**Suggestions are recommendations with a confidence.** In every reply form, and in every session, coordinating or not, a suggestion is put as a recommendation carrying a confidence value, `high`, `medium` or `low`. A query's options already carry this under the [owner report](#owner-report); the rule extends it to a suggestion in a conversational reply, a plan proposed for agreement and a run report alike.

Sources: REPORTING-FORMS and RECOMMEND-CONFIDENCE in [the decision register](sources.md#decision-register).

### Session kinds

A session with no coordinating opener is conversational. It may do bounded work directly, including regular or ad hoc work, and uses the conversational reply forms. The repository declaring this skill or injecting its hook does not make the session a coordinator.

A background run is the detached actor a coordinator briefs under `ki-delegation`, rather than a fourth owner-facing session kind. It delivers its bounded unit and returns the owner report to its reporting package.

Sources: REPORTING-FORMS in [the decision register](sources.md#decision-register).

### Units of work

A unit of work ends, and a completed-work report is owed, when at least one of these holds for the work since the last such report:

1. **Changed:** a change to a repository, configuration or external system was committed, or was deliberately left uncommitted with the reason stated.
2. **Sent:** work passed to other work, a repository, a record or a person, such as a captured record, a trade, a `messages.md` line or a handoff.
3. **Run finished:** a background run the session launched has finished; for a background agent, its own run is ending.
4. **Deliverable:** a deliverable the owner asked for, such as a document, report, draft or analysis written to a file, has been produced.
5. **Stopped for the owner:** the work stopped before completion with something the owner must decide, supply or do, such as a failure, a block or a decision.

None of these ends a unit of work, and each gets a conversational reply: answering a question, however many reads it took; acknowledging an instruction or a decision; a clarifying question; an interim step or a timed update; a single read, lookup or check; a plan proposed in conversation for agreement.

A change the owner asked for and that was made in the same turn, in one file or one commit, with nothing failed, open or left to decide, is confirmed in one plain line naming what changed, and needs no report. Work that ends with nothing changed and nothing open is told in one plain line; work that ends with nothing changed but something open meets criterion 5. A background agent always reports, because its report is its run's only output. One report covers every unit that ended in the same turn.

### Conversational bounded work

A conversational session does bounded work directly, without delegating, opening a run or becoming a coordinator. The work is bounded when it serves the matter the owner raised in the session, stays within the authority the owner gave there and each repository's own rules, and can finish with the owner in the session. The session may delegate when it chooses. It becomes a coordinator only when the owner opens or re-bootstraps it with a coordinating [opener](standards-opening.md#opening-work), never on its own. When the work outgrows the bound, because it needs a Project's decisions, more than one run at once, or would keep the owner waiting across sessions, the session says so in one line and proposes the Project's work, or new Project work through territory work.

Work that must outlive the session takes an ad hoc work folder, `+/_WORK/<territory>.reg.<slug>/`, under the work-package standard. It pauses by putting the work On hold through a state-file update, with no hold report or banner, and its agents head their reports `# <work title> › <run name>` with `**Run report at <local time>**` and no banner.

Sources: CONVERSATIONAL-RUN and CONVRUN-NARROW in [the decision register](sources.md#decision-register).

### Coordinator-only machinery

The report heading and form line, the banner and its thread line, the mark, the message queue's acting rule, re-anchoring after compaction, the turn budget and the heartbeat belong to coordinators only. A conversational session's optional work package is the plain record: it notes a pause in its state file's front matter and how to carry on in its next steps, and is finished and pruned when the work ends.

## Owner report

Every completed-work report under [Reply forms](#reply-forms) takes one shape, the **owner report**: a background agent's final `<name>.report.md`, which the owner reads directly, a coordinator's re-bootstrap report, and the report a conversational session gives when a unit of work ends. A coordinator's [Summary](standards-report-forms.md#the-summary), including the Summary it sends with, takes its own shape from the same parts: its queries, links, plain English and levels are the owner report's, and its sections are its own. This standard is its one source; `ki-delegation` links here, and the runtime surfaces are rendered from [Generated surfaces](standards-coordination.md#generated-surfaces).

The standard's own text writes the label `Outstanding - no action requested now` and the query heading `<tag> - <title>` with a spaced hyphen.

- **Heading:** every coordinator's owner report opens with the [report heading](standards-coordination.md#banner) and its state form line. A background agent's run report uses the heading of the work it reports to with `› <run name>` added and the form `Run report`. A conversational session's completed-work report has no report heading, form line or banner: it opens at `## Done`. A background agent reporting to a conversational session or to ad hoc work heads its saved file `# <work title> › <run name>`, with the form line `**Run report at <local time>**`, and closes with no banner.
- **Sections:** the three headings `## Done`, `## In Progress` and `## Queries`, in that order, every time, with the optional `## Findings` between `## In Progress` and `## Queries` under **Findings** below. A [Summary](standards-report-forms.md#the-summary) is the exception that keeps its own sections. An empty section still appears and says so in one line, `Nothing is running` or `No outstanding queries`, so the owner never wonders whether it was dropped. A [hold report](standards-holds.md#putting-work-on-hold) is the one exception: its sections are `## Done`, `## Parked` and `## Left over`, with no Context, Query or Options, because the queries live in the work file.
- **Done:** completed outcomes, one line each, with material failures, corrections and limitations beside them rather than behind them. A background agent puts its commit identifiers and check results here, because the owner reads the report and not the log.
- **In Progress:** what is running and what is waiting, each with its owner or dependency. Then, under `Outstanding - no action requested now`, the matters that need nothing from the owner, grouped as agent work, receiver-owned work, verification limitations and retained material, kept apart from the decisions the owner must make. A [Summary](standards-report-forms.md#the-summary) is windowed on its start: a handoff to other work is reported once, under `## Summary since <time>`, and not carried after it; an item a roadmap record holds is left to the roadmap; and its status table holds only this work's own holdings. A Summary since an earlier time is the longer view.
- **Findings:** optional. When the owner has asked for findings, the output of an investigation, such as a survey, a table, a comparison or an assessment, that informs a judgement the owner has still to make, a run report or a re-bootstrap report carries `## Findings` between `## In Progress` and `## Queries`, and a [Summary](standards-report-forms.md#the-summary) between `## Status` and `## Queries`, while at least one is open, and leaves it out otherwise. Only an owner request makes a finding; a run's own observations and a check's results stay in Done or become queries. Each finding is a `### <TAG> - <plain-language title>` heading, its tag in the [Needs tag](#needs-tags) vocabulary, opening before any table with three lines: **Goal**, the question asked, in the owner's words where they exist, who asked it and when; **Scope**, what was looked at and what was not; and **As of**, when the facts were last checked. The table or short list follows, then one line naming the queries it raised. A finding raises queries rather than replacing them: each decision it calls for is a query in `## Queries`, whose Context may name the finding by its tag. A finding is carried in full, table and all, in every report until a mark settles it, unless the owner keeps it open, or until the owner says they are content. A prompt drafted for the owner to hand on is carried the same way under `## Findings`, its goal line saying who it is for and what it asks, the prompt itself in full in one fenced block. At settlement the coordinator gives each finding or prompt one disposition in the decisions log: homed in a record, homed in a design note, homed in the decisions log, or dropped. Between reports a finding lives in the work folder as `findings/<tag>.md`, holding exactly the text the report carries, goal first, and the package read counts `findings/` with the five files under `ki-work-package`'s [closed list](../../../governance/ki-work-package/references/standards-work-package.md#closed-list).
- **Queries:** one heading per actionable query, `<tag> - <plain-language title>`, linked to its record where one exists. The tag is a [Needs tag](#needs-tags). A routine open matter is not a query; it belongs in the section above. Nor is a push of stacked commits, under [Banner](standards-coordination.md#banner); routine push state is omitted from the report and banner. The body of a query is three bold labels and nothing else:

  ```markdown
  ### <TAG> - <plain-language title>

  **Context:** <enough for the owner to decide without reading anything else>

  **Query:** <the question, in one sentence>

  **Options:**

  a) (recommended, confidence <high, medium or low> - <one-line reason>) <the recommended course>

  b) <an alternative>
  ```

  **Context** gives enough for the owner to decide without reading anything else, including the matter's significance and current state. **Query** is the question in one sentence. **Options** is the lettered list, `a)`, `b)` and so on, with no bullet in front of a letter. The three labelled parts are separate paragraphs with a blank line between them, and each lettered option is its own paragraph with a blank line between options, so that a query passes `rumdl check` under the house `.rumdl.toml`, whose MD013 reflow would otherwise join lazily continued lines into one. Option a) is always the recommendation and carries `(recommended, confidence <level> - <reason>)` before its text, the level `high`, `medium` or `low` and the reason one line, such as `a) (recommended, confidence high - the patch is already on main) push it`. Confidence reflects how reversible the course is and how much of what it rests on the session verified directly rather than took from another agent's report: a course that destroys, deletes or publishes and rests on claims not verified directly is never `high`. Consistency with an earlier decision is not a reason and earns no level: an option a) whose only stated reason is an earlier decision is capped at `medium`. Only option a) carries a confidence. The rubric's COORD-11 warns on any line of a report's Queries section that begins `<letter>) (recommended` without `, confidence high|medium|low - <reason>)`. COORD-11 also warns when one `###` query marks more than one option `(recommended`; such a query is split into separately tagged queries. Before a query reaches the owner, it passes the [query review](standards-queries.md#query-review) where its confidence or its course calls for one. Further options appear only when they are real alternatives: a query that needs only confirmation still gives a), plus b) for the obvious alternative, such as "leave it as it is". A query and its options:

  ```markdown
  ### LINK-GUARD - where the link guard should live

  **Context:** The hook line already names the linking rule, and KI-HARNESS-GOV-188 carries the harness half; the link printer is a `ki` change, so each half has a different home.

  **Query:** Should the link guard be split across its homes, or held in the harness until the printer lands?

  **Options:**

  a) (recommended, confidence high - each half's home is already settled) split it: hook line and KI-HARNESS-GOV-188 in the harness, the printer in KI-TOOL-KI-CLI-127

  b) hold the whole guard in the harness until the printer lands
  ```

- **Posting outside:** a recommendation to post anything in Kris's name outside his own repositories and services, an issue, comment, reaction, pull request, discussion, review or message on another owner's repository or service such as an upstream issue tracker, is a query, never an action: its **Context** or its option carries the exact text proposed and where it would go, and nothing is posted until Kris answers that query; a broader grant, an earlier answer or a recommended option never stands in for it. `ki-delegation` owns the ban under its [external-posting rule](../../../governance/ki-delegation/references/standards-background-runs.md#authority-tiers).
- **Plain English:** a query's Context, Query and options, and the report's other explanations, are written in plain English. A technical term appears only where it is needed and is explained in plain words the first time it appears. Links to work items and records are kept under **Links** below.
- **Headings:** the three sections are `##` headings and each query is a `###` heading, so a report nests the same way wherever it appears, under the one `#` report heading. Sub-headings inside `Done`, where a long report groups outcomes by topic, are `###` too, and so is the banner heading.
- **Links:** every record, work file, Project, theme, decision, receipt and evidence artefact under [Linking records](#linking-records); a pruned roadmap record, which has no local file any more, is linked as `[<FULL-ID> (pruned)](https://github.com/<owner>/<repo>/blob/<last revision>/<path>)`, the last revision being the last commit in which the file existed, usually the parent of the prune commit.
- **Levels:** the owner's personal instructions set a communication level, `quiet`, `standard` or `detailed`, and this standard does not restate those instructions. The shape is the same at every level; the level sets only depth. Under `quiet`, the status-line cadence during work is unchanged, this report replaces the end-of-unit report, done items are one line each, in-progress items name only the work and what it waits on, and a query carries just enough context to be answered cold. `standard` adds material context and exceptions to each section. `detailed` adds the plan, validation evidence and rationale. No level hides a failure, a required decision or a material risk.

Sources: REPORT-SOURCE, OWNER-REPORT-FORMAT, REPORT-HEADINGS, REPLY-BLOCK, HOLD-QUERIES, SUMMARY-WINDOW, FINDINGS-SECTION, QUERY-SHAPE, FORM-VS-RUMDL, CONFIDENCE-STANDARD, REVIEW-LIFT, ACCEPT-BY-CRITERIA, CONFIDENCE-CHECK, REVIEW-CHECK, NO-EXTERNAL-POSTING and PLAIN-ENGLISH in [the decision register](sources.md#decision-register).

### Answers

An owner report carries no copyable reply block and no `No reply needed.` line. The owner answers in speech, naming a query by its tag or answering in order, and may answer with an option's bare letter. The worker reads each answer back as taken in the decisions log, in the turn it arrives, `Taken as: <the instruction it will act on>`, and asks one line where an answer is unclear, never acting on a guess. A suggested course in a query is not approval: nothing is acted on until the owner answers.

Sources: REPLY-BLOCK in [the decision register](sources.md#decision-register).

### Quiet tools

Every session and every background agent runs its tools quietly and reports what they found, never what they printed.

- **Git:** run Git with `-q` wherever the command takes it, such as `git commit -q`, `git fetch -q`, `git pull -q` and `git push -q`.
- **No pasted output:** never paste gate, audit, test or Git output into a reply, an update or a report, in full or in part; it stays in the session log.
- **One line per outcome:** report each outcome in one plain line, such as "tests pass", "the ki-coordination audit has no new findings" or "the unit failed its push", naming a failure and what it means in the same line. Detail and evidence follow only when the owner asks.

Sources: QUIET-TOOLS and RESTART-AGREE in [the decision register](sources.md#decision-register).

### Needs tags

Each outstanding query carries a short mnemonic tag, such as `BOT-1`, `CSWAP` or `PUSH`, rather than a bare number, so the owner can answer "BOT-1 do it". The tag heads the query in an owner report, labels the same item in the work file's parked tags, the banner and a Summary's status table, and is the one vocabulary for open items wherever they appear. A tag is stable: it keeps its meaning across repeated reports until the item is resolved and is never reused for something else. Queries are never numbered.

## Links and wording

- **Links:** every roadmap record a report names is linked by its full identifier to its local file, under [Linking records](#linking-records), and a pruned record is linked as `[<FULL-ID> (pruned)](https://github.com/<owner>/<repo>/blob/<last revision>/<path>)`. The rubric flags any record identifier a report leaves unlinked.
- **Wording:** plain language, and "background agents", never "helpers". When the owner must paste a message into another session, the coordinator gives it in a code block ready to copy.

## Linking records

Whenever a session or a report mentions a roadmap or work record, a work file, a theme, a Project, a decision, a receipt or an evidence artefact, it cites the full identifier, such as `KI-HARNESS-GOV-144` rather than `GOV-144`, because area codes repeat across repositories, and uses that full identifier as the link text.

It links each one to the local file by absolute path, so that it opens in the owner's editor, resolving the repository through the KI registry (`ki registry`) where one is available. It uses the verified canonical remote URL only when there is no local copy. A query heading links to its underlying record when one exists. A link is never invented: when a target cannot be resolved, the text says so. A pruned roadmap record has no local file any more, so it is linked as `[<FULL-ID> (pruned)](https://github.com/<owner>/<repo>/blob/<last revision>/<path>)`: the link text is always the full identifier followed by `(pruned)`, and the last revision is the last commit in which the file existed, usually the parent of the prune commit. A live record keeps its local-file link; a pruned record is never pointed at the Project note that carries it and never left as a bare identifier. This applies to status lines, owner reports, recaps and work files alike, and a background agent's report follows the same rule. The rubric's COORD-7 checks the reports under `+/_WORK/<id>/`, in each focus folder its `work.md` declares and in `reports/`: every full record identifier in their prose, a work record or a Decision Record, sits inside a Markdown link, and a link that names a record and targets an absolute local path points at a file that exists. The existence check applies inside the audited checkout and wherever the target's folder is present on the machine, so another checkout beside it is checked too; a target outside the checkout whose folder is absent, as every other repository is on a CI runner, is checked for shape only, a Markdown file whose name opens with the linked identifier, as [KI-HARNESS-GOV-197 (pruned)](https://github.com/knowledgeislands/ki-agentic-harness/blob/95a1ab58/docs/roadmap/KI-HARNESS-GOV-197-pmo-7-outside-checkout-links.md) set. Fenced blocks, inline code spans, which quote literal text such as a commit subject and cannot hold a link, and Needs tags such as `ACCEPT-181` are not record identifiers and are not checked.

Sources: LINK-FORM in [the decision register](sources.md#decision-register).

## Report rule sources

<!-- ki-coordination:source run-report -->

```markdown
**Report** to `<report path>`, in the run's state folder and nowhere else, as an owner report: the ki-coordination report heading of the work you report to with `› <run name>` added, `# [<Theme>](<local theme page>) › [<Project>](<local Project note>) › <run name>` for Project work, or `# [<actual work label>](<actual local work page>) › <run name>` for regular/ad hoc coordination, the bold `**🤖 → 👤 Handoff to supervisor · Run report at <local time> · last mark <local time>**` line, adding `· blocked` after the state where you send back with a blocking query, and one `---`, then `## Done`, `## In Progress` and `## Queries`, each query carrying **Context**, **Query** and lettered **Options** as separate paragraphs with a blank line between them, each option its own paragraph, `a) (recommended, confidence <level> - <reason>)` first, no bullets and no reply block, in plain English with a technical term only where needed and explained once, keeping links to work items and records; where the brief asks for findings, add `## Findings` between `## In Progress` and `## Queries`, each finding a `### <TAG> - <title>` heading opening with its **Goal**, **Scope** and **As of** lines before any table, and write it also to the finding file the brief names; then, for coordinating work, the glyph banner the ki-coordination [Banner](../../../change-management/ki-coordination/references/standards-coordination.md#banner) section prints, its `###` state heading, counts line and `- [state] what · holder · since` list, closing with one thread line, `🧵 <work-id>` for every explicitly coordinating package, including main and secondary State of play, Project, regular and ad hoc work, using the work you report to, and no send or resume line; a run report to a conversational session, including regular or ad hoc work without coordination, has no mark in its form line and no banner. The report's first non-blank line is its `#` heading, after front matter if the report has any. Run tools quietly under the ki-coordination [quiet-tools rule](../../../change-management/ki-coordination/references/standards-coordination.md#quiet-tools): run Git with `-q`, never paste gate, audit or Git output, and report each outcome in one line. Owner reports, run reports and banners omit routine push state and other sessions' stacked commits; if your own unit could not be published because its push failed, Done names the affected unit and reason. A hold report keeps nothing about pushes beyond a failure.
```

<!-- ki-coordination:source footer-report -->

```markdown
- Write the report as the owner report the ki-coordination [owner-report standard](../../../change-management/ki-coordination/references/standards-coordination.md#owner-report) sets: the ki-coordination report heading of the work you report to with `› <run name>` added, `# [<Theme>](<local theme page>) › [<Project>](<local Project note>) › <run name>` for Project work, or `# [<actual work label>](<actual local work page>) › <run name>` for regular/ad hoc coordination, then the bold `**🤖 → 👤 Handoff to supervisor · Run report at <local time> · last mark <local time>**` line, with `· blocked` after the state where you send back with a blocking query, and one `---`; `## Done`, with commit identifiers and each check's outcome in one line; `## In Progress`; where the brief asks for findings, `## Findings`, each finding a `### <TAG> - <title>` heading opening with its **Goal**, **Scope** and **As of** lines before any table, also written to the finding file the brief names; `## Queries`, each query carrying **Context**, **Query** and **Options** as separate paragraphs with a blank line between them, each lettered option its own paragraph with a blank line between options, `a) (recommended, confidence <level> - <reason>)` first and no bullets, in plain English with a technical term only where needed and explained once, keeping links to work items and records, and no reply block, the owner answering in speech; then, for coordinating work, the glyph banner, its `###` state heading, counts line and `- [state] what · holder · since` list, closing with one thread line, `🧵 <work-id>` for every explicitly coordinating package, including main and secondary State of play, Project, regular and ad hoc work, using the work you report to, and no send or resume line; a run report to a conversational session, including regular or ad hoc work without coordination, has no mark in its form line and no banner. Run tools quietly under the ki-coordination [quiet-tools rule](../../../change-management/ki-coordination/references/standards-coordination.md#quiet-tools): run Git with `-q`, never paste gate, audit or Git output, and report each outcome in one line. Owner reports, run reports and banners omit routine push state and other sessions' stacked commits; if your own unit could not be published because its push failed, Done names the affected unit and reason. A hold report keeps nothing about pushes beyond a failure.
```
