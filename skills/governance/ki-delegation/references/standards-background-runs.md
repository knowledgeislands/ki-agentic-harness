# Background-run standard

## Contents

- [Scope](#scope)
- [Detachment](#detachment)
- [Coordinating work](#coordinating-work)
- [Run packet](#run-packet)
  - [Run events](#run-events)
  - [Working-area marks](#working-area-marks)
- [Prompt shape](#prompt-shape)
- [Authority tiers](#authority-tiers)
  - [Grants](#grants)
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

## Coordinating work

Coordinating work - territory work or Project work, the two coordinating forms of the work model that the [Work Process](https://github.com/knowledgeislands/ki-principal/blob/main/Pillars/Philosophy/Model/Processes/Work%20Process/Work%20Process.md) note describes and `ki-coordination` governs - launches and steers background runs under this contract and is itself governed by [the coordinating-work standard](../../../change-management/ki-coordination/references/standards-coordination.md) that `ki-coordination` owns: the responsive-coordinator principle in Kris's words, the counted turn budget and self-check, the levels and forms, the states and moves, the Summary, recap and full summary, the glyph banner, re-anchoring after compaction, the openers and bootstrap, messages between work, the decision classes and their life cycle, Finishing Project work, the recap since the mark, parking tangents, linking records, committing and pruning the work folder, keeping primary checkouts current and refreshing that guidance. A repository that coordinates work declares `ki-coordination` beside this skill; the `coordinator-reminder` hook and the `ki-coordinator` output style belong to it.

What stays here is the run side of that relationship. Coordinating work records each owner decision in its work folder's [decisions log](#decisions-log) before launching the work it authorises, waits only through a detached [waiter](#run-queue) or [monitor](#monitoring), and reports in the `ki-coordination` [owner report](../../../change-management/ki-coordination/references/standards-coordination.md#owner-report) form, which every agent report, Summary, recap and full summary takes unchanged.

At restart, each piece of coordinating work acts on the important `FIRST-STEP` line of its [message queue](../../../change-management/ki-coordination/references/standards-coordination.md#messages-between-work), `messages.md`, or in a single-file work folder its work file's Messages section, before launching any run. Kris set on 2026-10-17 that "each thread fixes its checkpoint form and adds role on its FIRST-STEP line at restart"; under the work model the work file's front matter carries the level, worker and supervisor that the checkpoint's `role` carried.

## Run packet

A run is a named set of agents sharing one state directory for runtime files and one tracked work folder for knowledge files. The split follows what each file is for. A runtime file describes one process on one machine and can be lost without losing knowledge. A knowledge file records what the owner approved and what was done under it, and later work or another machine needs it. Kris settled the split on 2026-10-14, in these words: "tracked +/_THREADS/<thread>/ for the decisions log and agent reports; state folder keeps runtime only." Under the work model the tracked folder is the work folder, `+/_WORK/<id>/`, of the work that launched the run.

Runtime files stay in the state folder, `~/.local/state/ki/agents/<run>/`:

| File | Content |
| --- | --- |
| `<name>.draft.md`, `<name>.queued.md` | A brief's drafts, and a queued agent's brief until it launches |
| `<name>.prompt.md` | The prompt as launched, with its authority footer and progress protocol |
| `<name>.launch.json` | The launch record: runtime, model and effort as launched |
| `<name>.status` | One line, `HH:MM <TZ> - plain-language activity`, in the owner's local time, or one of the [run-event](#run-events) forms |
| `<name>.pid` | The detached process identifier |
| `<name>.log` | The runtime's combined output |
| `<name>.report.md` | Each agent's final report, as written |
| `<name>.work/` | Machine-only scratch with no repository home, removed with the state folder |
| `thread.json`, `thread.status`, `inbox.md` | The coordinating session's runtime: the run's recorded home, its status line and its inbox. The native-session binding is a separate machine-local file under the work-package standard's [Work identity and native sessions](../../ki-work-package/references/standards-work-package.md#work-identity-and-native-sessions) |
| `events.jsonl`, `events.state.json`, `events.seen` | The [event log](#run-events), the snapshot the launcher derives it from, and the waiter's read position |
| `queue.jsonl`, `dispatch.*` | The run queue and the dispatcher's own files |
| `worktrees/` | The run's Git worktrees, placed under [Coordination](#coordination) |

An agent writes its report to the run's state folder and nowhere else; the launcher copies it into the owning work folder, `+/_WORK/<id>/`, once it sees `DONE`, and replaces only a copy Git already holds. The brief sits in the same folder as `briefs/<name>.md` while the run's handoff is open, so that it survives the loss of a state folder. The folder's closed list, what each entry point may write there and when each kind goes are the `ki-work-package` [work-package standard](../../ki-work-package/references/standards-work-package.md#the-work-folder)'s. When the coordinator receives a report it copies each of the report's queries, whole, into the package's `queries.md`, under QUERIES-FILE, so that the report can go once its outcome is homed.

The owning repository is the one that holds the work file, and the work folder takes the work's two-part id, which the `ki-coordination` [Work naming](../../../change-management/ki-coordination/references/standards-coordination.md#work-naming) section sets, so work whose runs span repositories commits its log in one place and agents working in other repositories report into it. The launcher is the only writer of report files there, as Kris decided on 2026-10-14 for the thread folder: "make the launcher the only writer of the thread folder's log and report files". The coordinator writes the decisions log, by hand or through `ki agent decide`, writes the brief and commits the folder.

Everything else a run produces has a home outside the work folder, and a run writes nothing into `+/_WORK/<id>/` beyond the report the launcher copies there; the folder's [closed list](../../ki-work-package/references/standards-work-package.md#closed-list) is the `ki-work-package` standard's, and its rubric fails a file outside it. The prompt a run is launched from lives in the state folder beside the packet. A work product, such as a record, a standard, a diagram or a patch, lives in its owning home in the repository that owns it and is committed there. Temporary output, screenshots and other scratch included, goes in the run's temporary directory, `$TMPDIR/ki-agents/<run>/<name>/`, outside every repository, which the launcher creates and names in the prompt's footer; it never goes in a work folder or a working tree, and `ki agent close` refuses while the directory holds anything and then removes it. Evidence a run must keep, such as a screenshot that proves an outcome, is copied deliberately to its owning home before the run closes and named in the report. Machine-only scratch that belongs to no repository may stay in the state folder as `<name>.work/`.

This replaces the temporary home Kris set on 2026-10-15, now superseded: "Temporary output goes in <primary checkout>/tmp/<run>/<name>/ in the repository the agent works in, ignored and deleted when the run closes or they are superflous to requirements; machine-only scratch may stay in the state folder as <name>.work/." In the 5G Emerge Phase 3 coordination work on 2026-10-16 Kris said: "basically you should be using the temp folder for things like screenshots, not the threads folders", and decided: "Create a Harness work record to add the rule to the ki-delegation background-run standard: screenshots and other scratch output go in the system temp folder, never in a thread folder or repository." On 2026-10-20 Kris adopted that rule under HARNESS-TRIAGE as the launcher's per-run directory, which `ki agent close` empties and removes.

The agent overwrites its status at each change of activity and at least every two minutes, writes its report, then writes `DONE` as the last line of its status. `DONE` is the only completion signal.

An agent's name is unique within its run. A name that has already run is refused; relaunching it on purpose sets its earlier packet aside, and the agent's events then belong to its new attempt.

### Run events

The launcher turns what a run's files show into events, one JSON line each in `events.jsonl`, in the order they happened, so that every coordinator and agent reads one vocabulary. Kris adopted the notification strategy behind it on 2026-10-13, "ADOPT adopt KI-PRINCIPAL-ECO-012 to draft through ki-next; hand phase 1 to tools-ki and the harness now", and the order of delivery, "tools-ki first".

| Event | Derived from |
| --- | --- |
| `launch`, `held` | The launcher starting an agent, or holding it on a gate |
| `progress` | A status line of the form `HH:MM <zone> - milestone: <text>` |
| `done` | `DONE` written as the last status line with the report present |
| `failed` | A status line `HH:MM <zone> - failed: <text>`; `DONE` with no report; an exit without `DONE`; or a launch the launcher cannot make |
| `blocked` | A status line `HH:MM <zone> - blocked: <text>`, or a gate that closes on a held agent because its predecessor failed |
| `needs-owner` | One per query heading under `## Queries` in the report, `### <TAG> - <title>`, or under an older report's `## Outstanding queries` |

Every other status line stays local: it shows in `ki agent status` and the monitor, and makes no event. The launcher appends the forms to each prompt's progress protocol in these words, which every brief and skeleton keeps: "For a milestone the coordinator should hear about, write the line as 'HH:MM <zone> - milestone: <text>'; when you are blocked or the work has failed, as 'HH:MM <zone> - blocked: <text>' or 'HH:MM <zone> - failed: <text>'." A material failure an agent reports in `## Done` reaches the coordinator through its `failed:` status line, since the report's prose gives no parseable signal. The run is finished, `ALL FINISHED`, once no agent is running or held and its queue is empty.

Anything derived from a packet, an event's text, a waiter's line or a later notification, carries summaries, identifiers and paths, never file contents, secrets or the owner's addresses.

The semantics are portable; the file names are the reference layout the launcher writes.

### Working-area marks

Every file an agent or a session writes into a repository's `+/` working area carries a mark that says who wrote it and when, so a later reader, agent or owner, can tell whether it is current, whose it is, and which run to ask before moving or deleting it. Kris confirmed the rule on 14 October 2026, "MARK-RULE - yes, that reading; capture as a harness deliver record at next", and settled the field names for now on 18 October, "Mark feels, let's go with it for now". This is the one place the names are stated, so a later change touches one rule. The fields, in this order:

- `work`: the work id of the work the file belongs to, under `ki-coordination`'s work naming.
- `run` and `agent`: the run and the agent within it, for a file a background run writes; or `session`, the native session, or `interactive` where none is named, for a file an interactive session writes.
- `written_at`: the time it was written, as an ISO 8601 UTC timestamp.

A Markdown file carries the mark in its front matter. A folder of non-Markdown output, such as a rebuilt diagram, carries one `mark.toml` sidecar at its root holding the same fields as TOML strings. Coordinating work and an interactive session mark their own working files the same way. A mark is not provenance for committed work, which Git carries, and says nothing about how long a file is kept; it goes only into the working area, never into a committed receipt or report.

## Prompt shape

A run prompt is cold-agent ready. It contains, in order:

1. the task, quoting the owner decision that authorises it, in the owner's words and dated;
2. numbered steps;
3. a verification step;
4. the report path, in the run's state folder; the launcher homes the report in the work folder;
5. the instructions "Do not use background subagents." and "Never end your session while waiting.";
6. one authority footer, appended last, followed only by any [grant](#grants) sections the task needs.

When writing the steps and rules:

- Before forbidding a pattern, check whether the target repository already uses it as an established idiom. If it does, sanction it on the repository's own terms or raise the change as a separate decision.
- Tell the agent to run its tools quietly under the `ki-coordination` [quiet-tools rule](../../../change-management/ki-coordination/references/standards-coordination.md#quiet-tools): Git with `-q`, no gate, audit or Git output pasted into its status, updates or report, and each outcome reported in one line. Kris set it on 2026-10-17, as received: "Yes: a harness agent adds a quiet-tools rule to the ki-coordination standard and its run-report and brief sources (run git with -q, never paste gate, audit or git output, report each outcome in one line), cuts the coordinator hook line to a pointer plus the five hard rules, regenerates with ki dev skill generate ki-coordination --write and commits, before the RESTART-AGREE run."
- For a read-only audit, name the read-only checks, such as `prettier --check` or `rumdl check`, and forbid `lint:md` and any formatter run with `--write` or `--fix`.
- When hook or script work runs automatically on every matching event, propose an adversarial review by independent security and correctness reviewers, each finding reproduced by a separate agent, where multi-agent orchestration is authorised.
- Carry each target repository's standing rules into the brief by default, and check directly every path, ownership claim and instruction premise the brief rests on; an ambiguous direction is read back in one line before the brief goes out. Kris agreed CLAIM-CHECK as recommended on 2026-10-20, "CLAIM-CHECK - agreed as recommended", which `ki-coordination` [Coordinating practices](../../../change-management/ki-coordination/references/standards-coordination.md#coordinating-practices) applies to the coordinator.
- A fix or revise brief sweeps for the whole class of each finding, not only the instance a reviewer named, and a review loop stops when no must-fix finding remains; should-fix findings go to the owner's read rather than another round. Kris agreed CLASS-FIX as recommended on 2026-10-20, "CLASS-FIX - agreed as recommended".
- A blind review brief is masked under the `ki-coordination` [query review](../../../change-management/ki-coordination/references/standards-coordination.md#query-review): it carries the query's Context and Query only, with the options in no ranked order and no recommendation or confidence, and tells the reviewer not to read the work's `queries.md` or `decisions.md` or any report. Kris agreed BLIND-REVIEW as recommended on 2026-10-20, "BLIND-REVIEW - agreed as recommended".
- Tell the agent it creates no roadmap record. Kris took CAPTURE-GATE a) on 19 October: "runs never create records; the owning work's coordinator captures only a blocker, a defect seen failing or a Kris request; ideas go to Project notes; small audit fixes need no record". A run that finds a candidate names it in its report, and the owning coordinator decides under the `ki-next` [capture rule](../../../change-management/ki-next/references/standards-next-work.md#capture-substantive-prospective-work). A handoff or rollout a run's work needs elsewhere goes as a line in the receiving work's `messages.md` where the brief authorises it, otherwise into the report for the coordinator to send, never as a record in the receiving repository, as Kris set under HANDOFF-AS-MESSAGE on 2026-10-20: "Handoffs are not roadmap items".

A long wait belongs in the foreground: the agent checks the condition every two minutes and updates its status meanwhile.

## Authority tiers

Each prompt ends with exactly one footer from this skill's `assets/`, followed only by any [grants](#grants) the task needs. Footers are cumulative and generalised; the task supplies the specifics.

| Tier | Footer | Adds |
| --- | --- | --- |
| none | [rules-none.md](../assets/rules-none.md) | Local commits only; no remote call of any kind |
| push | [rules-push.md](../assets/rules-push.md) | `git fetch` and fast-forward `git push` of the agent's own commits |
| prune | [rules-prune.md](../assets/rules-prune.md) | Deleting `done` or `cancelled` work records the cited decision approves |
| release | [rules-release.md](../assets/rules-release.md) | Only the release calls the task names, one by one |

No grant is implied. Every remote call an agent may make is named explicitly, either in its footer or in the task. A higher tier needs a cited owner decision. An explicit push rule in the brief's task overrides any generic no-push line in the footer's Rules, because the footer is generic and the task supplies the specifics, as Kris set on 2026-10-17: "the generic brief footer gives way to an explicit push rule in the brief." No footer authorises accepting work, force-pushing, `--no-verify`, handling secrets, or pushing commits the agent did not make.

In Kris's managed environment, when a task separately authorises a 1Password read, use the managed `op_cache` helper with `OP_CACHE_SERVICE_ACCOUNT_ONLY=1`, never call `op` directly, and use `op_cache --tag <tag>` for discovery. If the helper cannot read without a desktop prompt, stop and report; do not fall back to interactive access. Keep credential values out of output and tracked files. This condition grants no credential authority.

Authority limits stay consistent with `ki-agent-coordination-paperclip`, which owns Paperclip delivery and integration grants.

### Grants

A grant is a section appended after the tier footer that lifts exactly one of the footer's bans and nothing else, for authority that is not a step on the cumulative tier ladder. A grant suits any tier. The task names the scope the grant needs: the remotes for a fetch, and each machine change for a machine grant.

| Grant | Section | Lifts |
| --- | --- | --- |
| fetch | [grant-fetch.md](../assets/grant-fetch.md) | Only the ban on a Git fetch: `git fetch` and a rebase or fast-forward pull from the remotes the task names; adds nothing under `push` or above |
| machine | [grant-machine.md](../assets/grant-machine.md) | Only the ban on an environment or scheduler change: the local changes the task names, on this machine, each with its undo; credentials stay banned and the [connection-critical rule](#connection-critical-changes) still applies |

`ki agent launch --allow <grant>` appends a grant section from its `## Grant: <name>` heading, after the tier footer; until the launcher offers that option, a brief appends the section by hand after its footer. Kris approved both texts as drafted on 2026-10-18, taking the recommended option: "you've got my approval for all those things that were recommended".

## Decisions log

Each owner decision about the work is one timestamped entry in the work folder's decisions log, `+/_WORK/<id>/decisions.md`. How an entry is written, logged in the turn it arrives and quoted only from the transcript file, and what becomes of it at each mark are `ki-coordination`'s [decisions log](../../../change-management/ki-coordination/references/standards-coordination.md#decisions-log) and [decisions life cycle](../../../change-management/ki-coordination/references/standards-coordination.md#decisions-life-cycle). A prompt, brief or report describes the decision it acts under in the owner's words and with its date, never by a number.

The run side is this standard's. The launcher adopts the log when it first homes a report into the work folder, and `ki agent decide` and `ki agent reconcile` append to it on the coordinator's instruction; a background agent never writes the log, and the state folder under the XDG state root holds runtime only, is not backed up or synced, and is never a Decision Record. Nothing durable may exist only in the state folder: the test Kris set on 2026-10-13 is that "if the state folder is lost, you shouldn't lose any knowledge".

A background agent never deletes a report or brief; the work folder is tidied by its coordinator under the `ki-work-package` [Tidying the work folder](../../ki-work-package/references/standards-work-package.md#tidying-the-work-folder) rules, which also delete the folder of finished work at the mark that closes it. `ki agent close <run>` then archives or deletes the run's state folder `~/.local/state/ki/agents/<run>/`. The close gate is strict: it prints one line per check and must pass whole, and `--reconciled` is the owner's attestation that waives the decision gate, as Kris settled on 2026-10-14 with "keep the close gate strict with the reconciled waiver". Coordinating work never passes `--reconciled` on its own account.

## Coordination

- **Ordering:** an agent that depends on another waits until that agent's status ends `DONE`, checking every two minutes.
- **Isolation:** parallel agents in one repository each use their own Git worktree. A lone agent may use the primary checkout. A background run's worktrees go under `~/.local/state/ki/agents/<run>/worktrees/<repo>`. Before it reports `DONE`, the agent removes each worktree it created with `git worktree remove` and deletes its branch once merged.
- **Integration:** a run working in a worktree integrates its own work before it reports `DONE`, under the `ki-git` [worktree-run self-integration](../../ki-git/references/standards-git.md#worktree-run-self-integration) grant: rebase onto local `main` without a fetch, gates on the rebased range, a fast-forward into the primary checkout's `main` with one writer at a time in that checkout, then the worktree removed and the branch deleted. Independent review still comes before acceptance. A run that cannot fast-forward keeps its worktree and branch and reports `stranded: <reason>` as a blocking query, never a quiet `DONE`. Kris took WORKTREE-INTEGRATE a) on 2026-10-20: "do whatever that needs to be".
- **Worktree trial:** from 2026-10-20 every writing run in a code repository works in a worktree; Knowledge Islands Principal's long runs join once the `ki` registry recognises a linked worktree as its registered repository, and coordinators and short work-package runs stay on the primary `main`. Kris took WORKTREE-START a) on 2026-10-20, "do whatever that needs to be", whose option read: "Start now in code repositories under F1 and F4, adding ki-principal's long runs once F5 lands."
- **Worktree audit:** until the `ki` registry recognises linked worktrees, `ki repo audit` in a worktree reports false REPO-REG-1 and RUNTIMES-2 failures, because the real registry knows only the primary checkout. Audit a worktree in an isolated home, never against the real registry: from the worktree, point `HOME`, `XDG_CONFIG_HOME`, `XDG_DATA_HOME`, `XDG_STATE_HOME` and every `KI_*_HOME` at a fresh temporary directory, seed there the empty runtime settings and MCP inventory that CI's install step writes, then run `ki bootstrap`, `ki registry add --repo .`, `ki dev local set <harness> "$(pwd -P)"` and `ki dev local on <harness>` when the repository is a harness, `ki repo repair --repo .` and `ki repo audit --repo .`, and delete the temporary directory. This mirrors CI's install step, and on 2026-10-20 it gave the harness the same zero-failure verdict as CI under CI's pinned `ki` v0.11.3 and under v0.12.0, with nothing written under the real home. Kris took WORKTREE-AUDIT a) on 2026-10-20: "the work tree order needs to be a case as well", read as the worktree audit.
- **Commits:** pull with `--ff-only` before committing, commit only explicit paths, and leave other uncommitted changes untouched, following `ki-git`.
- **Commit trailer:** an agent's co-author trailer names the model that actually made the commit, read from its launch record or runtime, never the coordinator's model or one copied from the brief. This line owns the rule; footers and briefs point here.
- **Pushing:** each session commits its own work, fetches and checks the range above the remote branch before pushing, and pushes fast-forward only when its own commits alone sit above that branch. It never force-pushes or pushes another session's commits. Other sessions' stacked commits are left for the owner and omitted from owner reports, run reports and banners, as is routine push state, under Kris's 2026-10-21 instruction to take push state out of reports. If the run's own unit could not be published because its push failed, its `## Done` names the affected unit and reason. A hold report keeps nothing about pushes beyond a failure. `ki-coordination`'s [Pushing beneath other sessions](../../../change-management/ki-coordination/references/standards-coordination.md#pushing-beneath-other-sessions) applies the same rule to coordinating work.
- **Green baseline:** a run starts only from a green harness `main`, and an estate-wide rollout only once the harness hook tests pass. An agent that finds the baseline red stops the line, reports it and changes nothing else; harness edits are made off the shared main checkout, under the `ki-git` [working-copy and review approaches](../../ki-git/references/standards-git.md#working-copy-and-review-approaches). Kris agreed GREEN-MAIN as recommended on 2026-10-20, "GREEN-MAIN - agreed as recommended".
- **Ambiguity:** stop and report rather than guess.

### Connection-critical changes

Kris set this rule on 2026-10-14, after a Headroom proxy rollout removed the proxy's launchd service and cut every session off for forty minutes: "any change to a firewall or to the configuration of a service critical for connection (Headroom proxy, SSH, Tailscale, network, auth) must carry in its rollout plan a tested restore path that reconnects first, then evaluates why it failed", placed where "Claude and Codex both load it (ki-delegation and the engineering standard)". So a task that changes any of those carries its restore path in the brief, tested as the `ki-engineering` standard's [connection-critical rollouts](../../../governance/ki-engineering/references/standards-engineering.md#connection-critical-rollouts) subsection defines, and an agent given such a task without one stops and reports before changing anything. Every authority footer carries the rule in one line.

## Run queue

Keep agents moving. A coordinator never waits for a whole batch to finish before starting the next piece of work.

- **Queue:** ready-made prompts wait in the run's queue, each with its agent name and launch options. Queue order sets priority; reorder the queue, not the prompts, to change it.
- **Dispatcher:** one detached dispatcher per run keeps up to a set number of agents running. As soon as any running agent finishes, it launches the next queued agent, logs each launch, and exits when the queue is empty and nothing is running. Under the concurrency practice Kris set on 2026-10-14, "CONCURRENCY / add the current practice to ki-coordination: chain agents that touch the same files, run different repositories in parallel, about three running per thread, the rest queued", the number is about three per thread; agents that touch the same files are queued with a wait on each other so they run in a chain, and agents in different repositories run side by side.
- **Gates:** queued work still waits on `DONE` gates. A queued agent that depends on another is launched with its wait, and waits in the foreground as under [Coordination](#coordination).
- **Waiter:** the coordinator keeps one background waiter armed, `ki agent wait --next`. It blocks until the next unseen `done`, `failed`, `blocked` or `needs-owner` [event](#run-events), in the order they happened, prints it and moves its read position past it, or prints `ALL FINISHED` when the run has ended with nothing unseen; launches, holds and milestones stay in the log and the monitor. The coordinator reads the event at its next turn, reports it to the owner and re-arms the waiter; it never waits, polls or relays in the foreground, under [Coordinating work](#coordinating-work). When no coordinator session is there to read it, a detached watcher started with an autonomy window resumes the coordinator with the work's work identity, following its work package as each run finishes, as Kris agreed OOS-WAKE on 2026-10-20, "OOS-WAKE - agreed as recommended", under `ki-coordination` [Coordinator responsiveness](../../../change-management/ki-coordination/references/standards-coordination.md#coordinator-responsiveness). Session wakes are best effort and cannot promise an unattended service. Pursue the agreed completion-watcher direction first; launchd, doorbells and extra liveness fields remain deferred. This direction does not establish that the watcher has shipped.

## Monitoring

The launching session stays non-blocking. One monitor per run, `ki agent watch`, prints each new [event](#run-events) as it appears and a single line every two minutes listing each agent's latest status, and ends with `ALL FINISHED` once no agent is still running.

An agent whose process has exited without `DONE` is flagged, never counted as finished.

After an interrupt, check the agent processes before saying anything is running. Relaunch a lost agent rather than wait for a notification that will not come.

## Reporting

The owner sees only status one-liners and each report, in the [reply forms](../../../change-management/ki-coordination/references/standards-coordination.md#reply-forms) the `ki-coordination` standard sets; a background agent's final report is always a completed-work report. Kris set the cadence on 2026-10-14, as received: "UPDATE-CADENCE / yes: add to ki-coordination - full Summary only when all dispatched work has finished or on request; otherwise timed one-to-two-line updates; a blocking query raised in a single line; the resume line shown only at rest; a report that does not repeat unchanged queries still carries the full stacked reply block for every open query". So coordinating work gives timed updates of one or two lines while work lies with a worker, raises a blocking query in a single line when it arises, and gives the full Summary only when all dispatched work has finished or on request. Under the work model, as Kris answered REPLY-BLOCK on 2026-10-18, no report carries a reply block: each query keeps its Context, Query and Options with confidence, the owner answers in speech, and the coordinator reads each answer back as taken in the decisions log; the send line replaces the resume line. Tooling output, commit identifiers and step narration stay in the log and in the report, unless the owner asks, and the report gives each tool outcome in one line, never pasted output, under the `ki-coordination` [quiet-tools rule](../../../change-management/ki-coordination/references/standards-coordination.md#quiet-tools).

An owner report, in every form including the [full summary](../../../change-management/ki-coordination/references/standards-coordination.md#full-summary), is a complete deliverable: its sections, its queries and its banner are never shortened by any output style, proxy shaping block or communication level, which govern prose around the report and not the report itself.

### Owner report

Every completed-work report, a background agent's final `<name>.report.md`, a coordinator's Summary and a conversational session's end-of-unit report alike, is an **owner report** in the shape the `ki-coordination` standard's [owner report](../../../change-management/ki-coordination/references/standards-coordination.md#owner-report) sets, a run report closing with the glyph banner of the work's state as the run leaves it. That standard is the shape's one source, as Kris decided on 2026-10-14: "REPORT-SOURCE - generate the hook line, output style and prompt skeleton from the ki-coordination standard with a ki dev command, make ki-delegation link to it, and have the existing test check the generated files". This standard does not restate it: the **Report** paragraph of [the run-prompt skeleton](../assets/run-prompt.md) and the report rule of each authority footer are rendered from that standard's [generated surfaces](../../../change-management/ki-coordination/references/standards-coordination.md#generated-surfaces), and a change to them is made there.

### Needs tags

Each outstanding query carries a stable mnemonic Needs tag, never a number, defined with the owner report under the `ki-coordination` standard's [Needs tags](../../../change-management/ki-coordination/references/standards-coordination.md#needs-tags).

## Reference launcher

`ki agent` in `tools-ki` is the reference launcher. It writes the run packet's runtime files under the KI state root, detaches the Claude Code or Codex adapter, appends the footer selected by `--rules` from this skill, keeps the decisions log, which it writes to the tracked work folder once that change ships, and provides `status` and `watch`, `queue`, `dispatch` and `wait --next` for the run queue, and `send` for a run's inbox. It derives the [run events](#run-events) and sets `KI_AGENT_RUN` to the run's name in every agent it starts, under Claude Code and Codex alike. `ki agent new` writes a prompt from [the run-prompt skeleton](../assets/run-prompt.md). For the work model's tolerance window it still reads a thread folder, `+/_THREADS/<run>/`, and a checkpoint as before.

Runtime mechanics belong in the launcher, not in this skill or in personal setup.

## Mechanical boundary

The native rubric checks that each authority footer exists, carries the shared prohibitions, and grants exactly its tier. It cannot judge whether a prompt cites a real decision, whether its steps are sufficient, or whether a tier is warranted; the RUN judgment item reviews those.
