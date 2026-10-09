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

The coordinating thread stays responsive to the owner. It does only quick one-step checks and short bookkeeping itself: status reads, queueing, recording decisions and relaying outcomes. It hands anything longer - set-up, prompt rewriting, multi-file or multi-step repository work - to a background agent. If a turn would block the owner for more than a moment, delegate it instead.

## Run packet

A run is a named set of agents sharing one state directory. Each agent has five files:

| File | Content |
| --- | --- |
| `<name>.prompt.md` | The prompt as launched, with its authority footer and progress protocol |
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

## Coordination

- **Ordering:** an agent that depends on another waits until that agent's status ends `DONE`, checking every two minutes.
- **Isolation:** parallel agents in one repository each use their own Git worktree. A lone agent may use the primary checkout.
- **Commits:** pull with `--ff-only` before committing, commit only explicit paths, and leave other uncommitted changes untouched, following `ki-git`.
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

The owner sees only status one-liners and each agent's final report. Tooling output, commit identifiers and step narration stay in the log and report, unless the owner asks.

The report has three parts: **Done** (one line per outcome), **Failed** (if any), and **Needs \<owner\>** (decisions or actions). Omit an empty part. Verbosity follows the owner's communication level in their instructions; this standard does not restate it.

A coordinating thread - the master thread or a project thread - also follows these practices with the owner:

- **Needs items:** each item under **Needs \<owner\>** carries a short mnemonic tag, such as `BOT-1`, `CSWAP` or `PUSH`, rather than a bare number, so the owner can reply "BOT-1 do it". Each item gives enough plain context to be answered cold, a recommendation where the thread has one, and links under [Linking records](#linking-records).
- **Questions:** a decision with clear options goes through the runtime's structured-question tool where one is available, recommended option first, a few questions per batch.
- **Summary:** on request, the thread gives one consolidated list: what is done since the owner's last message or a named mark, what is in progress, and everything still outstanding. It is distinct from a [project recap](#project-recap), which covers one Project since the last recap.
- **Wording:** plain language, and "background agents", never "helpers". When the owner must paste a message into another thread, the thread gives it in a code block ready to copy.
- **Decisions:** the thread records each owner decision in the run's [decisions log](#decisions-log) before launching the work it authorises.

## Project threads

A project thread coordinates exactly one Project, or one named estate area, for the owner. It is always delegation-based: it runs its work as background agents through `ki agent` under this contract, in a run named after the Project, and keeps its own turns short under [Coordinator responsiveness](#coordinator-responsiveness).

- **Checkpoint:** the thread resumes from the Project's `ki-checkpoint` checkpoint, which holds current state only, and keeps it current. The checkpoint is named `<initiative>.<project>.md` and the master thread's `_state-of-play.md`, under [the checkpoint naming rule](../../ki-checkpoint/references/standards-checkpoints.md#project-thread-naming); a Project that changes Initiative has its checkpoint renamed in the same change.
- **Decisions:** it records each owner approval with `ki agent decide <run>` before launching the work that approval authorises.
- **Master thread:** the owner's designated master thread owns cross-project priorities, releases, and decisions touching more than one Project. Releases follow the `ki-repo-tools` release-on-demand policy: a delivery run never releases by default, and a release run carries the `release` footer for the named release only. A project thread raises those there.
- **Naming:** where the runtime can name a session, the thread takes the checkpoint's `label`, such as `Techne: agent-host`, so the master thread can find it. The label is presentation only; [the checkpoint label rule](../../ki-checkpoint/references/standards-checkpoints.md#thread-label) owns its form.
- **Opening:** open a project thread only where there is active work to drive. A dormant Project needs no thread.

### Bootstrap

A one-line opener brings a new or already-running thread onto this contract, for example `Re-bootstrap as the <project> project thread under ki-delegation.` The opener uses the Project name alone, and the master thread's opener uses `state-of-play`. The thread then:

1. reads this contract;
2. checks `ki agent status` for its runs and any legacy runs, and reconciles what is actually running rather than assuming;
3. resolves the Project name to the single `+/_CHECKPOINTS/*.<project>.md` checkpoint, or `_state-of-play.md` for the master thread, under `ki-checkpoint` RESUME, stopping to ask the owner if no file or more than one file matches; then creates or reconciles that checkpoint;
4. reports in three lines where the Project stands, what is running, and what it needs from the owner.

### Directions from the master thread

The master thread propagates common instructions. Rules go to their durable owner, a skill or a Decision Record. Thread-level directions go into each affected Project's checkpoint under a short `From the master thread` section that holds current directions only.

A project thread re-reads its checkpoint at every project recap and before launching work, acts on new directions, and removes each direction once it is absorbed. Where the runtime can message another live session on the same machine, the master thread may also nudge the project thread to re-read it. The checkpoint stays the source of truth, so directions also reach threads on other machines.

### Project recap

A project recap is a plain-language roll-up for the owner of what has changed in the Project since the last recap. It is distinct from `ki-recap`, which summarises one session at a lower level; the two share no format or procedure.

It opens with a header naming the Project and its Initiative as links, the thread, and the window covered (`since <time of last recap>`), so recaps from several threads read side by side. It then covers what was delivered, decided, started, stopped or blocked, and newly captured; what is running now; and what needs the owner. It cites records by full identifier as links, with no tool output and no commit identifiers.

Its sources are the run's decisions log, background-agent reports finished since the last recap, and the Project's records. The thread gives a recap on request, such as "recap", and proactively when several background agents have finished since the last one or the owner returns after a gap. It notes the time of each recap in its checkpoint, so "since the last recap" is well defined.

## Thread working rules

These rules apply to every coordinating thread: the master thread and each project thread.

### Parking tangents

When the owner raises a side topic in passing, the thread records it as one dated line, says it is parked, and carries on with the current work. It does not explore the tangent unasked.

Parked items live in the thread's checkpoint under `Open questions`, each as `- Parked <YYYY-MM-DD>: <one line>`. They need no section of their own: [the checkpoint record form](../../ki-checkpoint/references/standards-checkpoints.md#exact-record-form) fixes the six sections.

On request, such as "what's parked?", the thread lists its parked items. When the owner picks one up, it gets a home - a Project, a work record through `ki-next`, or another thread's checkpoint - or is dropped, and the thread removes it from `Open questions` in the same update.

### Linking records

Whenever a thread mentions a roadmap or work record, a checkpoint, an Initiative or a Project, it cites the full identifier, such as `KI-HARNESS-GOV-144` rather than `GOV-144`, because area codes repeat across repositories.

It links each one to the local file by absolute path, so that it opens in the owner's editor, resolving the repository through the KI registry (`ki registry`) where one is available. It uses the remote URL only when there is no local copy. This applies to status lines, reports and project recaps alike.

### Keeping primary checkouts current

Background agents work in worktrees and push their own commits, so the owner's primary checkouts fall behind. The coordinating thread fast-forward pulls each affected primary checkout periodically: after a background agent that pushed finishes, and before a project recap.

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
