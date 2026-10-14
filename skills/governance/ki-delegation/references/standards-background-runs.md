# Background-run standard

## Contents

- [Scope](#scope)
- [Detachment](#detachment)
- [Coordinating threads](#coordinating-threads)
- [Run packet](#run-packet)
- [Prompt shape](#prompt-shape)
- [Authority tiers](#authority-tiers)
- [Decisions log](#decisions-log)
- [Coordination](#coordination)
  - [Connection-critical changes](#connection-critical-changes)
- [Run queue](#run-queue)
- [Monitoring](#monitoring)
- [Reporting](#reporting)
  - [Owner report](#owner-report)
  - [Needs tags](#needs-tags)
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

## Coordinating threads

A coordinating thread - a coordination thread or the state-of-play thread, two of the three thread types `ki-pmo` defines beside the conversational thread - launches and steers background runs under this contract and is itself governed by [the coordinating-thread standard](../../../change-management/ki-pmo/references/standards-pmo.md) that `ki-pmo` owns: the responsive-coordinator principle in Kris's words, the counted turn budget and self-check, the Summary, recap and full summary, the banner, re-anchoring after compaction, coordination threads, the state-of-play thread, the openers and bootstrap, directions from the state-of-play thread, the decision classes and Project close, the recap since the mark, parking tangents, linking records, committing the thread folder, keeping primary checkouts current and refreshing that guidance. A repository whose threads coordinate declares `ki-pmo` beside this skill; the `coordinator-reminder` hook and the `ki-coordinator` output style belong to it.

What stays here is the run side of that relationship. A coordinating thread records each owner decision in the run's [decisions log](#decisions-log) before launching the work it authorises, waits only through a detached [waiter](#run-queue) or [monitor](#monitoring), and reports in the [owner report](#owner-report) form below, which every Summary, recap and full summary adopts unchanged.

## Run packet

A run is a named set of agents sharing one state directory for runtime files and one tracked thread folder for knowledge files. The split follows what each file is for. A runtime file describes one process on one machine and can be lost without losing knowledge. A knowledge file records what the owner approved and what was done under it, and a later thread or another machine needs it. Kris settled the split on 2026-10-14, in these words: "tracked +/_THREADS/<thread>/ for the decisions log and agent reports; state folder keeps runtime only."

Runtime files stay in the state folder, `~/.local/state/ki/agents/<run>/`:

| File | Content |
| --- | --- |
| `<name>.prompt.md` | The prompt as launched, with its authority footer and progress protocol |
| `<name>.launch.json` | The launch record: runtime, model and effort as launched |
| `<name>.status` | One line, `HH:MM <TZ> - plain-language activity`, in the owner's local time |
| `<name>.pid` | The detached process identifier |
| `<name>.log` | The runtime's combined output |
| `queue.jsonl`, `seen`, `dispatch.*` | The run queue, the waiter's seen list and the dispatcher's own files |
| `worktrees/` | The run's Git worktrees, placed under [Coordination](#coordination) |

Knowledge files live in the owning repository's tracked `+/_THREADS/<run>/` folder, committed as the thread goes:

| File | Content |
| --- | --- |
| `decisions.md` | The run's [decisions log](#decisions-log) |
| `<name>.report.md` | Each agent's final report |

The owning repository is the one that holds the thread's checkpoint, and the folder takes the run's name, so a thread that spans repositories commits its log in one place and agents working in other repositories report into it, as they report into one state folder today. `ki agent` writes the knowledge files there once `tools-ki` ships that change. Until then the thread copies the log and each report into the folder by hand, at each mark and when a report lands, and commits them.

The agent overwrites its status at each change of activity and at least every two minutes, writes its report, then writes `DONE` as the last line of its status. `DONE` is the only completion signal.

The semantics are portable; the file names are the reference layout the launcher writes.

## Prompt shape

A run prompt is cold-agent ready. It contains, in order:

1. the task, quoting the owner decision that authorises it, in the owner's words and dated;
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

Each owner approval for delegated work becomes one numbered, timestamped entry in the run's decisions log, quoted in the owner's own words where possible. Numbers never repeat; they are the launcher's own handles within the log, and nothing outside the log relies on them. A prompt, brief, record, report, checkpoint or banner describes the decision it acts under in the owner's words and with its date, and never by its number: Kris said on 2026-10-13 that "it should be written about what the decision was or is", and on 2026-10-14 that a numbered citation "has no meaning to me because I don't know what the decision was ... and I don't know where the list is".

The owner's words are whole only on the turn they arrive: a context-compressing proxy, a compaction or a shell read of a transcript can rewrite every earlier turn without saying so. Two rules keep the log faithful, on any machine and whatever the proxy setting:

- **Log in the turn it arrives:** the thread writes an owner decision into the log in the same turn as the message that carries it, while that turn is still uncompressed, before it does anything else with the message.
- **Verify later quotations from the file:** any later quotation of the owner's words, in a log entry, a brief, a record or a report, is checked against the session transcript file read with the runtime's file-read tool, which the proxy protects, never from in-context recall or from shell output such as `cat` or `grep`, which it does not.

The tracked `+/_THREADS/<run>/` folder is the thread's working record between consolidations, not a replacement for them. The thread commits and pushes the log and each report there at every owner report and resting point, at each mark, when a report lands and before the thread closes, as Kris set on 2026-10-14, "threads need to know that they need to commit their work under +/_THREAD/", so that the test Kris set on 2026-10-13 holds: "if the state folder is lost, you shouldn't lose any knowledge". The log is the Project's one decisions list across every thread of that Project, and each entry is classified at the mark under `ki-pmo`'s [decision classes](../../../change-management/ki-pmo/references/standards-pmo.md#decision-classes): operational, rule, standalone or held, each with its home named in the log. The state folder under the XDG state root holds runtime only: it is not backed up or synced. Neither folder is a Decision Record. At each checkpoint update, and before a run or thread closes, consolidate every in-force decision into its durable owner - a Decision Record through `ki-decision-records`, a skill, or the thread's checkpoint. Nothing durable may exist only in the thread folder or the state folder.

Once a thread has closed and its in-force decisions are consolidated into their durable owners, the thread deletes its `+/_THREADS/<run>/` folder in one commit, and `ki agent close <run>` archives or deletes its state folder `~/.local/state/ki/agents/<run>/`. The close gate is strict: it prints one line per check and must pass whole, and `--reconciled` is the owner's attestation that waives the decision gate, as Kris settled on 2026-10-14 with "keep the close gate strict with the reconciled waiver". A thread never passes `--reconciled` on its own account.

## Coordination

- **Ordering:** an agent that depends on another waits until that agent's status ends `DONE`, checking every two minutes.
- **Isolation:** parallel agents in one repository each use their own Git worktree. A lone agent may use the primary checkout. A background run's worktrees go under `~/.local/state/ki/agents/<run>/worktrees/<repo>`. Before it reports `DONE`, the agent removes each worktree it created with `git worktree remove` and deletes its branch once merged.
- **Commits:** pull with `--ff-only` before committing, commit only explicit paths, and leave other uncommitted changes untouched, following `ki-git`.
- **Commit trailer:** an agent's co-author trailer names the model that actually made the commit, read from its launch record or runtime, never the coordinator's model or one copied from the brief. This line owns the rule; footers and briefs point here.
- **Pushing:** never push someone else's unpushed commits without asking the owner.
- **Ambiguity:** stop and report rather than guess.

### Connection-critical changes

Kris set this rule on 2026-10-14, after a Headroom proxy rollout removed the proxy's launchd service and cut every session off for forty minutes: "any change to a firewall or to the configuration of a service critical for connection (Headroom proxy, SSH, Tailscale, network, auth) must carry in its rollout plan a tested restore path that reconnects first, then evaluates why it failed", placed where "Claude and Codex both load it (ki-delegation and the engineering standard)". So a task that changes any of those carries its restore path in the brief, tested as the `ki-engineering` standard's [connection-critical rollouts](../../../governance/ki-engineering/references/standards-engineering.md#connection-critical-rollouts) subsection defines, and an agent given such a task without one stops and reports before changing anything. Every authority footer carries the rule in one line.

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

An owner report, in every form including the [full summary](../../../change-management/ki-pmo/references/standards-pmo.md#full-summary), is a complete deliverable: its sections, its queries and its reply block are never shortened by any output style, proxy shaping block or communication level, which govern prose around the report and not the report itself.

### Owner report

Every report written for the owner takes one shape, the **owner report**: a background agent's final `<name>.report.md`, which the owner reads directly, and a coordinating thread's Summary, including the Summary at a resting point. It replaces the Done / Failed / Needs \<owner\> report wherever that shape was set. Kris set the format on 2026-10-13 in the `ways-of-working` thread, in these words:

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
- **Reply block:** the report ends with one fenced `text` block holding one line per open query, in the same tags and order, each prefilled with the recommended instruction, `<tag> - <recommended instruction>`, carrying the references the instruction needs to be unambiguous, so the owner sends the block back as it stands or edits a line. A line never lists the options or restates the choice as a menu: the Recommendation above has chosen, and the line says what it chose. Kris corrected the menu form on 2026-10-14: "the proposed copy block is including all the options, rather than the recommended option." Only where the owner alone can supply a value the thread cannot know, such as a date, an amount or a name, does the line carry an angle-bracket placeholder naming it, such as `<date>` or `<amount>`, so the owner edits one token. It is a suggested reply, not approval: nothing in it is acted on until the owner returns an instruction.
- **Headings:** the three sections are `##` headings and each query is a `###` heading, so a report nests the same way wherever it appears: under a coordinating thread's `#` [banner](../../../change-management/ki-pmo/references/standards-pmo.md#coordinating-thread-practices), or under the `#` title of a background agent's report file. Sub-headings inside `What has been done`, where a long report groups outcomes by topic, are `###` too.
- **Links:** every record, checkpoint, Project, Initiative, decision, receipt and evidence artefact under [Linking records](../../../change-management/ki-pmo/references/standards-pmo.md#linking-records).
- **Levels:** the owner's personal instructions set a communication level, `quiet`, `standard` or `detailed`, and this standard does not restate those instructions. The shape is the same at every level; the level sets only depth. Under `quiet`, the status-line cadence during work is unchanged, this report replaces the end-of-unit report, done items are one line each, in-progress items name only the work and what it waits on, and a query carries just enough context to be answered cold. `standard` adds material context and exceptions to each section. `detailed` adds the plan, validation evidence and rationale. No level hides a failure, a required decision or a material risk.

### Needs tags

Each outstanding query carries a short mnemonic tag, such as `BOT-1`, `CSWAP` or `PUSH`, rather than a bare number, so the owner can reply "BOT-1 do it". The tag heads the query in an owner report, labels the same item in a checkpoint and a recap, and is the one vocabulary for open items wherever they appear. A tag is stable: it keeps its meaning across repeated reports until the item is resolved and is never reused for something else. Queries are never numbered. In the reply block the tag opens its line, `<tag> - <recommended instruction>`, so a returned line is unambiguous on its own and carries the answer rather than the choice.

## Reference launcher

`ki agent` in `tools-ki` is the reference launcher. It writes the run packet's runtime files under the KI state root, detaches the Claude Code or Codex adapter, appends the footer selected by `--rules` from this skill, keeps the decisions log, which it writes to the tracked thread folder once that change ships, and provides `status` and `watch`, plus `queue`, `dispatch` and `wait --next` for the run queue. `ki agent new` writes a prompt from [the run-prompt skeleton](../assets/run-prompt.md).

Runtime mechanics belong in the launcher, not in this skill or in personal setup.

## Mechanical boundary

The native rubric checks that each authority footer exists, carries the shared prohibitions, and grants exactly its tier. It cannot judge whether a prompt cites a real decision, whether its steps are sufficient, or whether a tier is warranted; the RUN judgment item reviews those.
