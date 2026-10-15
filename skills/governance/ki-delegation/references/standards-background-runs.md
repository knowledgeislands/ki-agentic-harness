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

What stays here is the run side of that relationship. A coordinating thread records each owner decision in the run's [decisions log](#decisions-log) before launching the work it authorises, waits only through a detached [waiter](#run-queue) or [monitor](#monitoring), and reports in the `ki-pmo` [owner report](../../../change-management/ki-pmo/references/standards-pmo.md#owner-report) form, which every agent report, Summary, recap and full summary takes unchanged.

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
| `<name>.report.md` | Each agent's final report, kept until a mark finds its queries all answered and its outcome homed, when the thread deletes it under `ki-pmo`'s [tidying rule](../../../change-management/ki-pmo/references/standards-pmo.md#tidying-the-thread-folder) and Git history holds it |

The owning repository is the one that holds the thread's checkpoint, and the folder takes the run's name, so a thread that spans repositories commits its log in one place and agents working in other repositories report into it. `ki agent` is the only writer of the knowledge files there, as Kris decided on 2026-10-14: "make the launcher the only writer of the thread folder's log and report files". The thread commits them.

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

The thread folder stays thin. At each mark the thread deletes, by explicit path and in one commit, every report whose queries are all answered and whose outcome has a durable home, a work record, the decisions log, the checkpoint or a commit, keeping `decisions.md` and the reports that still carry an open query, as Kris set on 2026-10-14: "THREAD-TIDY / add a rule to ki-pmo: at each mark the thread deletes every report whose queries are all answered and whose outcome has a durable home, keeping only reports with open queries and decisions.md, with Git history holding the rest; each thread applies it to its own folder at its next mark, starting with this one once the commit gate passes". Git history holds the deleted reports, a later recap or full summary reads them from their last revision, each thread tidies only its own folder, and a background agent never deletes a report. `ki-pmo`'s [Tidying the thread folder](../../../change-management/ki-pmo/references/standards-pmo.md#tidying-the-thread-folder) owns the rule.

Once a thread has closed and its in-force decisions are consolidated into their durable owners, the thread deletes its `+/_THREADS/<run>/` folder in one commit, and `ki agent close <run>` archives or deletes its state folder `~/.local/state/ki/agents/<run>/`. The close gate is strict: it prints one line per check and must pass whole, and `--reconciled` is the owner's attestation that waives the decision gate, as Kris settled on 2026-10-14 with "keep the close gate strict with the reconciled waiver". A thread never passes `--reconciled` on its own account.

## Coordination

- **Ordering:** an agent that depends on another waits until that agent's status ends `DONE`, checking every two minutes.
- **Isolation:** parallel agents in one repository each use their own Git worktree. A lone agent may use the primary checkout. A background run's worktrees go under `~/.local/state/ki/agents/<run>/worktrees/<repo>`. Before it reports `DONE`, the agent removes each worktree it created with `git worktree remove` and deletes its branch once merged.
- **Commits:** pull with `--ff-only` before committing, commit only explicit paths, and leave other uncommitted changes untouched, following `ki-git`.
- **Commit trailer:** an agent's co-author trailer names the model that actually made the commit, read from its launch record or runtime, never the coordinator's model or one copied from the brief. This line owns the rule; footers and briefs point here.
- **Pushing:** each session commits its own work, and pushes fast-forward only when its own commits alone sit above the remote branch. Commits of another session stacked with its own are named to the owner, by repository, commit and subject, and the owner decides the push, as Kris set on 2026-10-14: "The most important thing is that each agent session commits its own work. And if there's a need or it has little confidence in the other commits that are stacked up with it, that's flagged to me, and I will then push if I'm happy with the push. If it's only their commits, then them committing and pushing is absolutely fine though." `ki-pmo`'s [Pushing beneath other sessions](../../../change-management/ki-pmo/references/standards-pmo.md#pushing-beneath-other-sessions) applies it to coordinating threads.
- **Ambiguity:** stop and report rather than guess.

### Connection-critical changes

Kris set this rule on 2026-10-14, after a Headroom proxy rollout removed the proxy's launchd service and cut every session off for forty minutes: "any change to a firewall or to the configuration of a service critical for connection (Headroom proxy, SSH, Tailscale, network, auth) must carry in its rollout plan a tested restore path that reconnects first, then evaluates why it failed", placed where "Claude and Codex both load it (ki-delegation and the engineering standard)". So a task that changes any of those carries its restore path in the brief, tested as the `ki-engineering` standard's [connection-critical rollouts](../../../governance/ki-engineering/references/standards-engineering.md#connection-critical-rollouts) subsection defines, and an agent given such a task without one stops and reports before changing anything. Every authority footer carries the rule in one line.

## Run queue

Keep agents moving. A coordinator never waits for a whole batch to finish before starting the next piece of work.

- **Queue:** ready-made prompts wait in the run's queue, each with its agent name and launch options. Queue order sets priority; reorder the queue, not the prompts, to change it.
- **Dispatcher:** one detached dispatcher per run keeps up to a set number of agents running. As soon as any running agent finishes, it launches the next queued agent, logs each launch, and exits when the queue is empty and nothing is running. Under the concurrency practice Kris set on 2026-10-14, "CONCURRENCY / add the current practice to ki-pmo: chain agents that touch the same files, run different repositories in parallel, about three running per thread, the rest queued", the number is about three per thread; agents that touch the same files are queued with a wait on each other so they run in a chain, and agents in different repositories run side by side.
- **Gates:** queued work still waits on `DONE` gates. A queued agent that depends on another is launched with its wait, and waits in the foreground as under [Coordination](#coordination).
- **Waiter:** the coordinator keeps one background waiter armed. It blocks until the next agent finishes, prints that agent's name and last status (or that it exited without `DONE`), and marks it seen. On each wake, the coordinator reports the finish to the owner and re-arms the waiter.

## Monitoring

The launching session stays non-blocking. One monitor per run prints a single line every two minutes listing each agent's latest status, and ends with `ALL FINISHED` once no agent is still running.

An agent whose process has exited without `DONE` is flagged, never counted as finished.

After an interrupt, check the agent processes before saying anything is running. Relaunch a lost agent rather than wait for a notification that will not come.

## Reporting

The owner sees only status one-liners and each report. Kris set the cadence on 2026-10-14, as received: "UPDATE-CADENCE / yes: add to ki-pmo - full Summary only when all dispatched work has finished or on request; otherwise timed one-to-two-line updates; a blocking query raised in a single line; the resume line shown only at rest; a report that does not repeat unchanged queries still carries the full stacked reply block for every open query". So a coordinating thread gives timed updates of one or two lines while dispatched work runs, raises a blocking query in a single line when it arises, gives the full Summary only when all dispatched work has finished or on request, and shows the resume line only at rest; a Summary that leaves an unchanged query unrepeated still carries the full stacked reply block with an entry for every open query. Tooling output, commit identifiers and step narration stay in the log and in the report, unless the owner asks.

An owner report, in every form including the [full summary](../../../change-management/ki-pmo/references/standards-pmo.md#full-summary), is a complete deliverable: its sections, its queries and its reply block are never shortened by any output style, proxy shaping block or communication level, which govern prose around the report and not the report itself.

### Owner report

Every report written for the owner, a background agent's final `<name>.report.md` and a coordinating thread's Summary alike, is an **owner report** in the shape the `ki-pmo` standard's [owner report](../../../change-management/ki-pmo/references/standards-pmo.md#owner-report) sets. That standard is the shape's one source, as Kris decided on 2026-10-14: "REPORT-SOURCE - generate the hook line, output style and prompt skeleton from the ki-pmo standard with a ki dev command, make ki-delegation link to it, and have the existing test check the generated files". This standard does not restate it: the **Report** paragraph of [the run-prompt skeleton](../assets/run-prompt.md) and the report rule of each authority footer are rendered from that standard's [generated surfaces](../../../change-management/ki-pmo/references/standards-pmo.md#generated-surfaces), and a change to them is made there.

### Needs tags

Each outstanding query carries a stable mnemonic Needs tag, never a number, defined with the owner report under the `ki-pmo` standard's [Needs tags](../../../change-management/ki-pmo/references/standards-pmo.md#needs-tags).

## Reference launcher

`ki agent` in `tools-ki` is the reference launcher. It writes the run packet's runtime files under the KI state root, detaches the Claude Code or Codex adapter, appends the footer selected by `--rules` from this skill, keeps the decisions log, which it writes to the tracked thread folder once that change ships, and provides `status` and `watch`, plus `queue`, `dispatch` and `wait --next` for the run queue. `ki agent new` writes a prompt from [the run-prompt skeleton](../assets/run-prompt.md).

Runtime mechanics belong in the launcher, not in this skill or in personal setup.

## Mechanical boundary

The native rubric checks that each authority footer exists, carries the shared prohibitions, and grants exactly its tier. It cannot judge whether a prompt cites a real decision, whether its steps are sufficient, or whether a tier is warranted; the RUN judgment item reviews those.
