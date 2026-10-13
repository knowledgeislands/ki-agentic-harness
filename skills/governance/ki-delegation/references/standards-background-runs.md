# Background-run standard

## Contents

- [Scope](#scope)
- [Detachment](#detachment)
- [Coordinator responsiveness](#coordinator-responsiveness)
- [Run packet](#run-packet)
- [Prompt shape](#prompt-shape)
- [Authority tiers](#authority-tiers)
- [Decisions log](#decisions-log)
- [Coordination](#coordination)
- [Run queue](#run-queue)
- [Monitoring](#monitoring)
- [Reporting](#reporting)
  - [Owner report](#owner-report)
  - [Needs tags](#needs-tags)
  - [Coordinating threads](#coordinating-threads)
- [Project threads](#project-threads)
- [Thread working rules](#thread-working-rules)
- [Reference launcher](#reference-launcher)
- [Mechanical boundary](#mechanical-boundary)

## Scope

A background run is routine delegation of substantive work to one or more background agents. Anyone running Knowledge Islands work through an agent uses this contract, whatever the runtime.

A **background agent** is a worker launched detached through `ki agent` under this contract. An **in-session subagent** runs inside the launching session's turn and is not a background agent.

It complements the [delegation-packet standard](standards-delegation-packets.md): a packet makes an approved high-risk handoff durable inside a work record, while a background run governs how any delegated agent is launched, reports, coordinates and is watched. A high-risk run carries both.

Process skills still select, authorise, plan and accept work. Paperclip-coordinated delegation follows `ki-agent-coordination-paperclip`; subagent role definitions follow `ki-subagents`.

## Detachment

Launch every background agent detached from the launching session, in its own session, with standard input from `/dev/null` and output to its log. It must survive an interrupt of the launching session.

An in-session subagent runs under the turn that launched it and dies when that turn is interrupted, even when it still looks live. Use it only for work that may be lost.

## Coordinator responsiveness

A coordinating thread - the master thread or a project thread - is a coordinator. It dispatches work, decides with the owner and reports; it hands substantive reasoning, analysis and drafting to background agents rather than doing them in-thread. Because the reasoning happens in those agents, a coordinating thread runs on the lighter model purpose `ki-tokenomics` recommends for coordination, and heavier models are reserved for the background agents.

The coordinating thread stays responsive to the owner, so the owner never has to remind it to delegate. These rules are hard and checkable from its transcript:

- **Turn budget:** a coordinator turn makes a handful of quick tool calls and returns to the owner. A step goes to a background agent if it reads more than one or two short files, writes or edits more than a checkpoint line or a decision, runs tests, audits or builds, or would take more than about a minute.
- **Never in-thread:** analysis, design, drafting prose or prompts longer than a short brief, code or document edits, multi-repository investigation, and waiting in the foreground for an agent.
- **Waiting:** always through a detached [waiter](#run-queue) or [monitor](#monitoring), never a foreground wait or sleep.
- **Brief-writing:** the coordinator writes only a short brief citing the owner's decisions. If the brief itself needs research, a background agent researches and writes it.
- **Self-check:** before each tool call, the coordinator asks whether it is a quick check or bookkeeping; if not, it delegates. When it notices it has drifted into doing work, it stops, delegates the rest and tells the owner in one line.
- **Owner messages:** a new owner message is a steering request, not a stop. The thread folds it into running and queued work - redirecting, re-queuing or recording a decision as needed - and keeps going. It stops or aborts a background agent or piece of work only when the owner expressly says to stop or abort it, naming the work. Because it is never mid-way through long work, it answers an owner message promptly.

A runtime hook backs these rules: the harness `hooks/coordinator-reminder.sh` injects a one-line reminder of them on every owner message, and again after compaction, in a thread whose checkout holds `+/_CHECKPOINTS/`. It stays silent in agents `ki agent` launches. The hook is registered per machine by the user-environment manager.

## Run packet

A run is a named set of agents sharing one state directory. Each agent has six files:

| File | Content |
| --- | --- |
| `<name>.prompt.md` | The prompt as launched, with its authority footer and progress protocol |
| `<name>.launch.json` | The launch record: runtime, model and effort as launched |
| `<name>.status` | One line, `HH:MM <TZ> - plain-language activity`, in the owner's local time |
| `<name>.pid` | The detached process identifier |
| `<name>.log` | The runtime's combined output |
| `<name>.report.md` | The final report |

The agent overwrites its status at each change of activity and at least every two minutes, writes its report, then writes `DONE` as the last line of its status. `DONE` is the only completion signal.

The semantics are portable; the file names are the reference layout the launcher writes.

## Prompt shape

A run prompt is cold-agent ready. It contains, in order:

1. the task, citing the numbered owner decision that authorises it;
2. numbered steps;
3. a verification step;
4. the report path;
5. the instructions "Do not use background subagents." and "Never end your session while waiting.";
6. one authority footer, appended last.

When writing the steps and rules:

- Before forbidding a pattern, check whether the target repository already uses it as an established idiom. If it does, sanction it on the repository's own terms or raise the change as a separate decision.
- For a read-only audit, name the read-only checks, such as `prettier --check` or `rumdl check`, and forbid `lint:md` and any formatter run with `--write` or `--fix`.
- When hook or script work runs automatically on every matching event, propose an adversarial review by independent security and correctness reviewers, each finding reproduced by a separate agent, where multi-agent orchestration is authorised.

A long wait belongs in the foreground: the agent checks the condition every two minutes and updates its status meanwhile.

## Authority tiers

Each prompt ends with exactly one footer from this skill's `assets/`. Footers are cumulative and generalised; the task supplies the specifics.

| Tier | Footer | Adds |
| --- | --- | --- |
| none | [rules-none.md](../assets/rules-none.md) | Local commits only; no remote call of any kind |
| push | [rules-push.md](../assets/rules-push.md) | `git fetch` and fast-forward `git push` of the agent's own commits |
| prune | [rules-prune.md](../assets/rules-prune.md) | Deleting `done` or `cancelled` work records the cited decision approves |
| release | [rules-release.md](../assets/rules-release.md) | Only the release calls the task names, one by one |

No grant is implied. Every remote call an agent may make is named explicitly, either in its footer or in the task. A higher tier needs a cited owner decision. No footer authorises accepting work, force-pushing, `--no-verify`, handling secrets, or pushing commits the agent did not make.

Authority limits stay consistent with `ki-agent-coordination-paperclip`, which owns Paperclip delivery and integration grants.

## Decisions log

Each owner approval for delegated work becomes one numbered, dated entry in the run's decisions log, quoted in the owner's own words where possible. Numbers never repeat. A prompt cites its authority by number ("Decision 18"), never by paraphrase alone.

The run directory, decisions log included, is non-durable, machine-local working material under the XDG state root: it is not backed up or synced, and it is not a Decision Record. At each checkpoint update, and before a run or thread closes, consolidate every in-force decision into its durable owner - a Decision Record through `ki-decision-records`, a skill, or the thread's checkpoint. Nothing durable may exist only in the run directory.

Once a thread or run has closed and its in-force decisions are consolidated into their durable owners, archive or delete its `~/.local/state/ki/agents/<run>/` folder; `ki agent` writes the run there.

## Coordination

- **Ordering:** an agent that depends on another waits until that agent's status ends `DONE`, checking every two minutes.
- **Isolation:** parallel agents in one repository each use their own Git worktree. A lone agent may use the primary checkout. A background run's worktrees go under `~/.local/state/ki/agents/<run>/worktrees/<repo>`. Before it reports `DONE`, the agent removes each worktree it created with `git worktree remove` and deletes its branch once merged.
- **Commits:** pull with `--ff-only` before committing, commit only explicit paths, and leave other uncommitted changes untouched, following `ki-git`.
- **Commit trailer:** an agent's co-author trailer names the model that actually made the commit, read from its launch record or runtime, never the coordinator's model or one copied from the brief. This line owns the rule; footers and briefs point here.
- **Pushing:** never push someone else's unpushed commits without asking the owner.
- **Ambiguity:** stop and report rather than guess.

## Run queue

Keep agents moving. A coordinator never waits for a whole batch to finish before starting the next piece of work.

- **Queue:** ready-made prompts wait in the run's queue, each with its agent name and launch options. Queue order sets priority; reorder the queue, not the prompts, to change it.
- **Dispatcher:** one detached dispatcher per run keeps up to a set number of agents running. As soon as any running agent finishes, it launches the next queued agent, logs each launch, and exits when the queue is empty and nothing is running.
- **Gates:** queued work still waits on `DONE` gates. A queued agent that depends on another is launched with its wait, and waits in the foreground as under [Coordination](#coordination).
- **Waiter:** the coordinator keeps one background waiter armed. It blocks until the next agent finishes, prints that agent's name and last status (or that it exited without `DONE`), and marks it seen. On each wake, the coordinator reports the finish to the owner and re-arms the waiter.

## Monitoring

The launching session stays non-blocking. One monitor per run prints a single line every two minutes listing each agent's latest status, and ends with `ALL FINISHED` once no agent is still running.

An agent whose process has exited without `DONE` is flagged, never counted as finished.

After an interrupt, check the agent processes before saying anything is running. Relaunch a lost agent rather than wait for a notification that will not come.

## Reporting

The owner sees only status one-liners and each report. Tooling output, commit identifiers and step narration stay in the log and in the report, unless the owner asks.

### Owner report

Every report written for the owner takes one shape, the **owner report**: a background agent's final `<name>.report.md`, which the owner reads directly, and a coordinating thread's Summary, including the Summary at a resting point. It replaces the Done / Failed / Needs \<owner\> report wherever that shape was set. Kris set the format on 2026-10-13 as Decision 14 of the `ways-of-working` run, in these words:

> Use three major sections, in this order:
>
> 1. What has been done
>
>    Report completed outcomes clearly and concisely. Include material failures, corrections and limitations where relevant; do not hide them behind a success summary.
>
> 2. What is in progress
>
>    State what is actually running and what is waiting, with the responsible owner or dependency. Say “Nothing is running” when that is true.
>
>    Place outstanding matters that require no action from the owner here, before the outstanding queries. Label them “Outstanding — no action requested now”. Distinguish agent work, receiver-owned work, verification limitations and retained material from decisions the owner needs to make.
>
> 3. Outstanding queries
>
>    Give each actionable query its own heading:
>
>    `<stable query tag> — <plain-language title>`
>
>    Under each heading, include:
>
>    - Summary: enough context to understand the issue without rereading the thread, including its significance and current state.
>    - Need from you: the specific decision, instruction or missing information required.
>    - Recommendation: the proposed next step and why it is recommended.
>
> Keep each query independently understandable and copyable. Split unrelated decisions into separate queries. Preserve query tags until resolved; never reuse a tag for a different issue.
>
> Do not add a “Your next step” field beneath individual queries.
>
> Finish the report with one fenced text block that offers a copy button. Include every actionable query’s heading and its recommended next step, written as an instruction the owner can adopt or edit and send back. Preserve the same tags and ordering as the query sections.
>
> The suggested reply is not approval. Act on it only when the owner returns an instruction.
>
> Linking requirement
>
> Every ID or named reference to an existing record must be linked to that record, including roadmap items, checkpoints, Projects, Initiatives, decisions, receipts and evidence artifacts. Use the full identifier as the link text where applicable, rather than an abbreviated ID.
>
> For example:
>
> `[HNR-PRINCIPAL-5GE-004](</Users/krisbrown/workspaces/humans-not-robots/hnr-principal/Streams/Roadmap/HNR-PRINCIPAL-5GE-004-complete-phase-2-ms3.md>)`
>
> Prefer verified absolute local file links when the checkout is available; otherwise use the verified canonical remote link. Link a query heading to its underlying record when one exists. Preserve necessary references in the copyable reply block so the returned instruction remains unambiguous.
>
> Never invent a link. If a target cannot be resolved, state that explicitly.
>
> Keep routine outcomes brief, but give outstanding queries enough context for a considered answer. Do not turn every unresolved observation into a request for owner action.

The quotation keeps Kris's em dashes and is laid out as a blockquote; the standard's own text writes the label `Outstanding - no action requested now` and the query heading `<tag> - <title>` with a spaced hyphen. Applied:

- **Sections:** the three headings, in that order, every time. An empty section still appears and says so in one line, `Nothing is running` or `No outstanding queries`, so the owner never wonders whether it was dropped.
- **What has been done:** completed outcomes, one line each, with material failures, corrections and limitations beside them rather than behind them. A background agent puts its commit identifiers and check results here, because the owner reads the report and not the log.
- **What is in progress:** what is running and what is waiting, each with its owner or dependency. Then, under `Outstanding - no action requested now`, the matters that need nothing from the owner, grouped as agent work, receiver-owned work, verification limitations and retained material, kept apart from the decisions the owner must make. A handoff to another thread stays outstanding until the owner expressly says it is done.
- **Outstanding queries:** one heading per actionable query, `<tag> - <plain-language title>`, linked to its record where one exists, carrying **Summary**, **Need from you** and **Recommendation** and nothing else. The tag is a [Needs tag](#needs-tags). A routine open matter is not a query; it belongs in the section above.
- **Reply block:** the report ends with one fenced `text` block listing every query heading and its recommended instruction, in the same tags and order, carrying the references the instruction needs to be unambiguous. It is a suggested reply, not approval: nothing in it is acted on until the owner returns an instruction.
- **Links:** every record, checkpoint, Project, Initiative, decision, receipt and evidence artefact under [Linking records](#linking-records).
- **Levels:** the owner's personal instructions set a communication level, `quiet`, `standard` or `detailed`, and this standard does not restate those instructions. The shape is the same at every level; the level sets only depth. Under `quiet`, the status-line cadence during work is unchanged, this report replaces the end-of-unit report, done items are one line each, in-progress items name only the work and what it waits on, and a query carries just enough context to be answered cold. `standard` adds material context and exceptions to each section. `detailed` adds the plan, validation evidence and rationale. No level hides a failure, a required decision or a material risk.

### Needs tags

Each outstanding query carries a short mnemonic tag, such as `BOT-1`, `CSWAP` or `PUSH`, rather than a bare number, so the owner can reply "BOT-1 do it". The tag heads the query in an owner report, labels the same item in a checkpoint and a recap, and is the one vocabulary for open items wherever they appear. A tag is stable: it keeps its meaning across repeated reports until the item is resolved and is never reused for something else. Queries are never numbered.

### Coordinating threads

A coordinating thread - the master thread or a project thread - also follows these practices with the owner:

- **Questions:** a decision with clear options goes through the runtime's structured-question tool where one is available, recommended option first, a few questions per batch. The query keeps its tag either way.
- **Banner:** every Summary and every [recap](#recap-since-the-mark) opens with one banner header, so either reads cold and several threads' updates read side by side. The banner names the thread, its Project and Initiative as links where it has them, the window covered, and the thread's state: `working`, `resting`, or `waiting on <what>`. The window is `since your last message` for a Summary and `since <mark>` for a recap.
- **Summary:** after its banner, the thread gives one [owner report](#owner-report) covering the window since the owner's last message. It is the form of the proactive update when several background agents have finished or the owner returns after a gap, and is also given on request, such as "summary". A request for everything "since the mark" gets the full [recap](#recap-since-the-mark) instead.
- **Resting point:** when the thread's work is largely complete, or it is waiting on the owner, another thread, a scheduled test or an external fix, it ends with a Summary, because that is the last message the owner sees until they return. Its banner states `resting` or `waiting on <what>` plainly, and the owner report beneath it lets the owner pick the thread up cold.
- **Wording:** plain language, and "background agents", never "helpers". When the owner must paste a message into another thread, the thread gives it in a code block ready to copy.
- **Decisions:** the thread records each owner decision in the run's [decisions log](#decisions-log) before launching the work it authorises.

## Project threads

A project thread coordinates exactly one Project, or one named estate area, for the owner. It is always delegation-based: it runs its work as background agents through `ki agent` under this contract, in a run named after the Project, and keeps its own turns short under [Coordinator responsiveness](#coordinator-responsiveness).

- **Checkpoint:** the thread resumes from the Project's `ki-checkpoint` checkpoint, which holds current state only, and keeps it current. The checkpoint is named `<initiative>.<project>.md` and the master thread's `_state-of-play.md`, under [the checkpoint naming rule](../../ki-checkpoint/references/standards-checkpoints.md#project-thread-naming); a Project that changes Initiative has its checkpoint renamed in the same change. The checkpoint also holds the thread's [mark](#recap-since-the-mark).
- **Decisions:** it records each owner approval with `ki agent decide <run>` before launching the work that approval authorises.
- **Master thread:** the [territory master thread](#territory-master-thread) owns cross-project priorities, releases, and decisions touching more than one Project. Releases follow the `ki-repo-tools` release-on-demand policy: a delivery run never releases by default, and a release run carries the `release` footer for the named release only. A project thread raises those there.
- **Naming:** where the runtime can name a session, the thread takes the checkpoint's `label`, such as `Techne: agent-host`, so the master thread can find it. The label is presentation only; [the checkpoint label rule](../../ki-checkpoint/references/standards-checkpoints.md#thread-label) owns its form.
- **Opening:** open a project thread only where there is active work to drive, within the master thread's [cap](#territory-master-thread). A dormant Project needs no thread.
- **Scope:** it works only its own Project's records. Work that belongs to another Project goes to that Project's thread or checkpoint through the master thread.

### Territory master thread

Each territory Capital has one territory master thread. Its checkpoint is `+/_CHECKPOINTS/_state-of-play.md` in that Capital, labelled `Master: state-of-play`, and it does project management only: it runs no delivery itself and routes all real work to Project threads.

- **Registry:** the Initiatives and Projects it manages are defined in the Capital's `Streams/` registry under the `ki-work` Project registry standard, and their work records live in the roadmaps of the territory's repositories.
- **Owns:** cross-Project priorities, releases, decisions touching more than one Project, [directions](#directions-from-the-master-thread) to Project threads, and the Project-thread queue.
- **Cap:** at most three or four Project threads are active at once, plus the master. The master keeps the active threads and the ordered queue in its checkpoint's `Current state`, each with its label, checkpoint and opener, and opens the next queued thread when an active one closes.
- **Seeding:** before a Project thread opens, the master creates or reconciles its `<initiative>.<project>.md` checkpoint and gives the owner its [opener](#opening-a-thread), so the thread opens with one message.
- **Run:** run names share one machine-wide namespace, so the master's run is `<territory>-state-of-play`, using the territory handle; a master run that predates this rule may keep its existing name. A Project thread's run takes the Project name, prefixed with the territory handle where another territory already uses that name.
- **Other territories:** it coordinates with another territory's master only through the owner. A master never acts with authority in another territory's repositories; each Capital keeps its own ownership, and cross-repository work moves under `ki-trades` or the receiving repository's own process.

### Opening a thread

The owner opens a thread in the Capital's checkout, names it with the checkpoint's `label` where the runtime can name a session, and pastes one opener. The master thread prepares the checkpoint first, so every thread opens with one opener and nothing else. An opener is a steering-ready brief, not a transcript: it names the thread and leaves state to the checkpoint.

For a territory master thread:

```text
Bootstrap as the state-of-play territory master thread for <territory> under ki-delegation.
Role: coordinator only - dispatch, decide with me, report; delegate all substantive work and stay responsive.
Label: Master: state-of-play. Checkpoint: +/_CHECKPOINTS/_state-of-play.md in <capital>.
Project management only: priorities, the Project-thread queue (cap three or four), decisions and releases; route real work to Project threads.
Background agents: run substantive work through `ki agent` in run `<territory>-state-of-play`; stay responsive.
Steering: my messages steer; stop or abort only when I expressly say so, naming the work.
First step: follow the Bootstrap in ki-delegation, then report in three lines.
```

For a Project thread:

```text
Bootstrap as the <project> project thread under ki-delegation.
Role: coordinator only - dispatch, decide with me, report; delegate all substantive work and stay responsive.
Label: <Initiative title>: <project>. Checkpoint: +/_CHECKPOINTS/<initiative>.<project>.md in <capital>.
Project: <project> (Initiative <initiative>); work only this Project's records.
Background agents: run substantive work through `ki agent` in run `<run>`; stay responsive.
Steering: my messages steer; stop or abort only when I expressly say so, naming the work.
First step: follow the Bootstrap in ki-delegation, then report in three lines.
```

The one-line `Re-bootstrap as the <project> project thread under ki-delegation.` form under [Bootstrap](#bootstrap) remains enough for a thread already on this contract.

### Bootstrap

A one-line opener brings a new or already-running thread onto this contract, for example `Re-bootstrap as the <project> project thread under ki-delegation.` The opener uses the Project name alone, and the master thread's opener uses `state-of-play`. The thread then:

1. reads this contract;
2. checks `ki agent status` for its runs and any legacy runs, and reconciles what is actually running rather than assuming;
3. resolves the Project name to the single `+/_CHECKPOINTS/*.<project>.md` checkpoint, or `_state-of-play.md` for the master thread, under `ki-checkpoint` RESUME, stopping to ask the owner if no file or more than one file matches; then creates or reconciles that checkpoint;
4. reports in three lines: its coordinator role and where the Project stands, what is running, and what it needs from the owner.

### Directions from the master thread

The master thread propagates common instructions. Rules go to their durable owner, a skill or a Decision Record. Thread-level directions go into each affected Project's checkpoint under a short `From the master thread` section that holds current directions only.

A project thread re-reads its checkpoint at every recap and before launching work, acts on new directions, and removes each direction once it is absorbed. Where the runtime can message another live session on the same machine, the master thread may also nudge the project thread to re-read it. The checkpoint stays the source of truth, so directions also reach threads on other machines.

## Thread working rules

These rules apply to every coordinating thread: the territory master thread and each project thread.

### Recap since the mark

A recap is a plain-language roll-up for the owner of what has changed in the thread's scope since its mark. Every coordinating thread gives one. A project thread's scope is its Project; the master thread's scope is only what the master thread itself deals with, the records and decisions it raised or owns, not every Project's records. A recap is distinct from `ki-recap`, which summarises one session at a lower level; the two share no format or procedure.

- **Mark:** a baseline the owner strikes at a moment of their choosing. Each thread has one mark, and striking a new one replaces it; Git holds the history of earlier marks. The thread keeps it in its checkpoint's `Current state` as `Mark: <UTC timestamp>, decisions log at Decision <N>`. The timestamp bounds Git history, work-record transitions and background-agent reports; the decision number bounds the decisions log exactly. Per-repository commit identifiers stay out.
- **Striking:** only the owner moves the mark, by saying "mark", or "recap and mark" to roll up and then re-strike. Giving a recap does not move it, so a recap can always reach back to a moment the owner chose. The thread commits the checkpoint update and confirms in one line.
- **Shape:** a recap opens with the [banner](#reporting) shared with the Summary, its window `since <mark>`. It then covers what was delivered, decided, started, stopped or blocked, and newly captured; what is running now; and what is outstanding. It cites records by full identifier as links, with no tool output and no commit identifiers.
- **Outstanding:** the checkpoint's open [Needs-tagged](#needs-tags) queries, open work records in the thread's scope, running or queued background agents, and parked tangents. Outstanding carries forward across marks: it is everything still open, whenever it arose, and striking a mark resets only the window for what was delivered, decided, started, stopped or blocked, and newly captured. Striking or re-striking never drops, closes or hides an open item, and the thread keeps every open query, with its Needs tag, in its checkpoint when it re-strikes.
- **Sources:** the run's decisions log after Decision N; background-agent reports finished since the timestamp; `ki agent status` for running and queued agents; work-record transitions in the thread's scope since the timestamp, from the Git history of the roadmap paths; and the checkpoint's open Needs-tagged queries and parked tangents.
- **When:** the thread gives a recap on request, such as "recap". Proactive updates take the shorter [Summary](#coordinating-threads) form, so they do not repeat everything since a distant mark.
- **No mark yet:** the first recap covers the window since the checkpoint's last-recap time, if it notes one, or else its `created_at`, states that window in its banner, and strikes the first mark. A thread whose checkpoint still notes a last-recap time converts it into a mark when the [refresh rule](#refreshing-this-guidance) tells it this guidance changed.

### Parking tangents

When the owner raises a side topic in passing, the thread records it as one dated line, says it is parked, and carries on with the current work. It does not explore the tangent unasked.

Parked items live in the thread's checkpoint under `Open questions`, each as `- Parked <YYYY-MM-DD>: <one line>`. They need no section of their own: [the checkpoint record form](../../ki-checkpoint/references/standards-checkpoints.md#exact-record-form) fixes the six sections. They count as outstanding in the thread's [recap](#recap-since-the-mark).

On request, such as "what's parked?", the thread lists its parked items. When the owner picks one up, it gets a home - a Project, a work record through `ki-next`, or another thread's checkpoint - or is dropped, and the thread removes it from `Open questions` in the same update.

### Linking records

Whenever a thread or a report mentions a roadmap or work record, a checkpoint, an Initiative, a Project, a decision, a receipt or an evidence artefact, it cites the full identifier, such as `KI-HARNESS-GOV-144` rather than `GOV-144`, because area codes repeat across repositories, and uses that full identifier as the link text.

It links each one to the local file by absolute path, so that it opens in the owner's editor, resolving the repository through the KI registry (`ki registry`) where one is available. It uses the verified canonical remote URL only when there is no local copy. A query heading links to its underlying record when one exists, and the reply block keeps the references an instruction needs. A link is never invented: when a target cannot be resolved, the text says so. This applies to status lines, owner reports, recaps and checkpoints alike.

### Keeping primary checkouts current

Background agents work in worktrees and push their own commits, so the owner's primary checkouts fall behind. The coordinating thread fast-forward pulls each affected primary checkout periodically: after a background agent that pushed finishes, and before a recap.

It pulls only with `--ff-only` into a clean checkout. A checkout with uncommitted changes, or one that has diverged from its upstream, is skipped and reported to the owner rather than stashed, rebased or reset. The pull is a quick one-step check under [Coordinator responsiveness](#coordinator-responsiveness); anything needing repair goes to a background agent or the owner.

### Refreshing this guidance

A coordinating thread re-reads this skill's thread guidance - [Reporting](#reporting), [Project threads](#project-threads) and these thread working rules - on its own, without the owner asking:

- at bootstrap or re-bootstrap;
- before each checkpoint update;
- whenever the skill has changed since its last read.

To detect a change, it compares the latest commit touching `skills/governance/ki-delegation` in the `ki-agentic-harness` checkout, from `git log -1 --format=%h -- skills/governance/ki-delegation`, with the revision it last read. It notes that revision in its checkpoint's `Current state` as `ki-delegation read at <revision>`. It then follows the current text and, when anything changed, tells the owner in one line what changed.

## Reference launcher

`ki agent` in `tools-ki` is the reference launcher. It writes the run packet under the KI state root, detaches the Claude Code or Codex adapter, appends the footer selected by `--rules` from this skill, keeps the decisions log, and provides `status` and `watch`, plus `queue`, `dispatch` and `wait --next` for the run queue. `ki agent new` writes a prompt from [the run-prompt skeleton](../assets/run-prompt.md).

Runtime mechanics belong in the launcher, not in this skill or in personal setup.

## Mechanical boundary

The native rubric checks that each authority footer exists, carries the shared prohibitions, and grants exactly its tier. It cannot judge whether a prompt cites a real decision, whether its steps are sufficient, or whether a tier is warranted; the RUN judgment item reviews those.
