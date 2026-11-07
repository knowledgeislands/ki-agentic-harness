---
note_type: streams/design
status: draft - October 2026
work: ki.prj.ways-of-working
run: wow-orca
agent: orca-fit
written_at: 2026-10-30T00:55:13Z
author: Written with Claude
---

# How Orca fits the Knowledge Islands work model

**Owner:** Kris Brown · **Owning repository:** knowledgeislands/ki-principal · **Owning work:** `ki.prj.ways-of-working` · **Date:** 2026-10-30

Design note for ORCA-FIT, the run Kris launched on 30 October 2026: "Yes, launch the design run." It tests the starting proposal that Knowledge Islands is the durable layer and Orca the live layer, against the [Work Process](<../../../../Pillars/Philosophy/Model/Processes/Work Process/Work Process.md>) note, the `ki-delegation` and `ki-coordination` standards, Orca 1.4.244's own orchestration guide on sol, and the first Orca trial in [ki.prj.mac-studio-setup](https://github.com/knowledgeislands/ki-principal/blob/d8ab8112/+/_WORK/ki.prj.orca-evaluation/trial/orca-trial.md) (its [plan069 report](https://github.com/knowledgeislands/ki-principal/blob/d38088a3a47407a4d37ff79050f9e94a52cbdb72/+/_WORK/ki.prj.mac-studio-setup/plan069.report.md)). It changes no standard, skill, record, hook or Orca state. [The explainer](https://github.com/knowledgeislands/ki-principal/blob/d8ab8112/+/_WORK/ki.prj.ways-of-working/orca-subagents/orca-fit-explainer.md) gives the same picture in plain words for Kris. Under `ki-work-design` this note is the design brief: its numbered claims are for at least two independent reviews before Kris decides anything.

## Contents

- [Verdict on the starting proposal](#verdict-on-the-starting-proposal)
- [The units](#the-units)
- [Hand-offs](#hand-offs)
- [What changes per host](#what-changes-per-host)
- [What Orca should not be made to do](#what-orca-should-not-be-made-to-do)
- [What Knowledge Islands should stop doing where Orca runs](#what-knowledge-islands-should-stop-doing-where-orca-runs)
- [What the trial showed](#what-the-trial-showed)
- [Numbered claims for review](#numbered-claims-for-review)
- [Open choices](#open-choices)
- [What adopting it would touch](#what-adopting-it-would-touch)

## Verdict on the starting proposal

The proposal holds, with four corrections.

1. **Workers never write the package, but someone must still home the report.** Under `ki agent` the launcher copies the report into the work folder. Orca has no such step, so under Orca the coordinator copies the report at receive. The worker writes its report outside every repository and commits only its own work product in the product's own repository. This also removes the trial's commit-hook collision, because no worker commits in the coordinator's checkout.
2. **A gate is not a query.** Orca's gate blocks a Task in a coordinator-owned dependency graph, and Orca's guide says not to create one merely to answer a worker's question. A query lives in `queries.md` and is answered by Kris in speech; a gate is created only when a Task genuinely cannot start until that query is answered, and it is resolved only after the answer is logged in `decisions.md` in Kris's words.
3. **The coordinator wake is the existing armed background check, pointed at Orca.** The trial's third question timed out because nothing in the idle coordinator session was waiting. `ki-coordination` already requires one detached check that exits when an agent finishes or after five minutes and re-invokes the coordinator; under Orca that check is a bounded `orca orchestration check --wait`. A durable wake with no session open stays deferred under WAKE-SUBSTRATE, though Orca's scheduled automations with a shell pre-check are a ready-made candidate for it.
4. **One launcher per package at a time.** Orca and `ki agent` each have a queue, a dependency mechanism, a liveness signal and an inbox. Running both for one package gives two of each and no single answer to "what is running". A package records which launcher it uses, per host, in its decisions log, as ORCA-HOST does for Mac Studio setup.

## The units

Each unit is named once, with its boundary, what it owns and where it lives. "Durable" means it survives the loss of every session, process and machine because it is in Git on a remote. "Live" means it exists only while something runs and may be lost.

| Unit | What it is | Owns | Does not own | Lives | Kind |
| --- | --- | --- | --- | --- | --- |
| Roadmap record | One work item in its owning repository's roadmap, such as KI-TOOL-RIG-CORE-069 | What the work is, its status and horizon, its plan and acceptance evidence | Who is working on it now, live progress | `docs/roadmap/` or `Streams/Roadmap/` in the owning repository | Durable |
| Work package | One piece of coordinated work above work items, `+/_WORK/<id>/` | Definition, state, queries, incoming messages, Kris's decisions; Git history as its logbook | Execution, record status, any machine's processes | The territory's Capital, ki-principal | Durable |
| Brief | The hand-off into one run, `briefs/<run>.md` | Goal, scope, authority cited from `decisions.md`, report rule | The outcome | Work folder, while the hand-off is open | Durable, short-lived |
| Run report | The hand-off back from one run | Outcome, evidence, the run's queries | Acceptance | Outside repositories until received, then the work folder until its outcome is homed | Durable once received |
| Kris, the supervisor | The owner | Authority, decisions, acceptance, adoption, pruning | Execution | Speech in the coordinator thread, recorded in `decisions.md` | Person |
| Coordinator | A session explicitly opened on a package under `ki-coordination` | Turn-by-turn dispatch, steering, receiving, reporting; worker to Kris and supervisor of its runs | Substantive work, authority, acceptance | One runtime session on one host; the package is its memory | Live |
| Run, or worker | One background agent doing one unit under a brief | Doing the unit, committing its product in the product's repository, its report | The package, other units, authority beyond its brief | One process on one host, in a checkout or worktree | Live |
| Host | One machine: sol, the Mac Studio, or terra | Processes, terminals, the Orca runtime and its database, `ki agent` state folders, checkouts | Anything another host needs, which must go through Git | The machine | Physical |
| Repository checkout | A host's primary checkout of one repository, plus any worktrees | The working tree and local commits | Truth across hosts, which is the remote | Each host | Live until pushed |
| Orca Run | Orca's durable namespace and coordinator inbox on one host's runtime | The coordinator binding, the inbox, its Tasks | The package's state, queries or decisions | `orchestration.db` on that host | Host-local |
| Orca Task | One unit of work as Orca sees it, with optional dependencies | The specification a worker receives and its place in a dependency graph | The roadmap record's status | Orca Run | Host-local |
| Orca Dispatch | One authoritative attempt at a Task | The worker's lifecycle: start, heartbeats, `worker_done`, stop, release | Whether the work is accepted | Orca Run | Host-local |
| Orca gate | A decision that blocks a Task until resolved | Holding a Task back | The decision itself, which is Kris's and logged in `decisions.md` | Orca Run | Host-local |
| Orca message | `ask`, `reply`, `send`, heartbeat, `worker_done`, escalation | Live conversation between coordinator and workers | Anything durable | Orca Run | Host-local, never copied into Git |
| Orca worktree | A Git worktree Orca creates for a worker, with repository setup | Filesystem isolation for one worker | Integration into `main` and pushing | Orca's worktree location on that host | Live |
| Orca automation | A scheduled Orca prompt with an optional shell pre-check | Firing a session on a schedule | Authority to act unattended | Orca on that host | Host-local; not adopted |

Two lines in this table carry most of the fit. The package and the record are the only things that know what work exists and where it stands; everything Orca holds is on one machine and can be lost without losing knowledge. And the Orca Dispatch, not the package, is the right home for "is this worker alive and what has it said", which is exactly what `ki agent`'s state folder holds today.

## Hand-offs

Every hand-off between units, in the order work flows. Each says who acts, what crosses and what is written where.

| # | From -> to | Who acts | What crosses | Written where |
| --- | --- | --- | --- | --- |
| H1 | Roadmap record -> package | State of play routes, or the Project's coordinator selects under `ki-next` with Kris adopting | A record id becomes a next step | `state.md` next steps; adoption in the record |
| H2 | Package -> brief | Coordinator | Goal, scope, cited authority, report rule | `briefs/<run>.md`, committed; any new decision first in `decisions.md` |
| H3 | Brief -> prompt | `ki` | Brief plus the `ki-delegation` authority footer and progress or report rule | Rendered prompt in the run's state folder, outside Git |
| H4 | Prompt -> Orca Task and Dispatch | Coordinator, `orca orchestration task-create` then `worker-start` | The rendered prompt as the Task specification; placement and agent | Orca Run; one line in `state.md` Now naming run, host and Orca ids |
| H5 | Dispatch -> worker | Orca | Orca's preamble with Task and Dispatch ids, then the specification | Orca |
| H6 | Worker -> coordinator, operational question | Worker `ask`; coordinator `reply` within the brief's authority | A question the brief already authorises the coordinator to answer | Orca messages; the worker records question and answer in its report |
| H7 | Worker -> Kris, owner-level question | Worker ends its attempt with a blocking query | A query in Context, Query and Options form | Report; at receive the coordinator copies it whole into `queries.md` |
| H8 | Query -> gate | Coordinator, only if a Task cannot start without the answer | The query's tag and title as the gate question | Orca gate on the dependent Task |
| H9 | Kris's answer -> gate and retry | Coordinator: logs the answer, then resolves the gate and starts a retry Dispatch | The decision | `decisions.md` first, then `gate-resolve`; retry with `--retry-of` |
| H10 | Kris's steer -> worker | Coordinator, `orca orchestration send --to dispatch:<id>` | Guidance within existing authority | Orca message; the worker records its disposition in its report |
| H11 | Worker -> product repository | Worker | Its work product | Commit by explicit path in the owning repository, pushed under the standing rule; worktree integration under `ki-git` |
| H12 | Worker -> coordinator, done | Worker `worker_done` with outcome and `--report-path` | Three-sentence summary, outcome, report path | Orca message; report file outside every repository |
| H13 | Report -> package | Coordinator receives | The report and its queries | Report copied into the work folder, queries into `queries.md`, `state.md` rewritten, one commit naming the move |
| H14 | Settled Dispatch -> released | Coordinator | Nothing durable | `worker-release`; the `state.md` Now line goes |
| H15 | Record -> Kris for acceptance | Record reaches `awaiting-review`; coordinator raises one ACCEPT query per work | Review evidence | `queries.md`; acceptance only through `ki-accept` with Kris's approval |
| H16 | Coordinator -> coordinator wake | Armed background `orca orchestration check --wait`, at most five minutes, re-armed each wake | That a `worker_done`, escalation or question has arrived | Nothing; the coordinator reads and acknowledges the delivery at its next turn |
| H17 | Host -> host | Whoever leaves a host | Everything durable | Git: commit, fast-forward pull, push. Orca state does not travel |

H3 and H4 are the seam. `ki` keeps what it does well, turning a brief into a cold-agent-ready prompt carrying the right authority footer, and Orca takes over the launch, supervision and conversation. Today `ki agent launch` both renders and launches; the fit needs the render without the launch. As far as their help text shows, `ki agent new` writes only the skeleton and `--dry-run` resolves the selection without writing, so neither yet gives the rendered prompt alone; this is unverified beyond the help text.

## What changes per host

| Concern | Host using Orca, sol today | Host using `ki agent`, terra and any host without Orca |
| --- | --- | --- |
| Rendering a prompt with its footer | `ki` | `ki` |
| Launching and detaching | `orca orchestration worker-start` | `ki agent launch` or `queue` |
| Queue and ordering | Orca Tasks and dependencies | `ki agent` queue and dispatcher, `--wait-for` |
| Liveness | Orca heartbeats and `worker-list` liveness | Status file and `ki agent status` |
| Steering a running worker | `orchestration send --to dispatch:<id>` | `ki agent send`, the run's `inbox.md` |
| Operational question | `ask` and `reply` | Blocking query in the report |
| Coordinator wake | Background `orchestration check --wait` | Background `ki agent wait --next` |
| Report path | Outside repositories, named by `--report-path`; coordinator copies it | State folder; launcher copies it |
| Worktrees | Orca `--worktree new-child` or `new-top-level` with repository setup, when parallel writers need it; default `current` | `~/.local/state/ki/agents/<run>/worktrees/` |
| Worktree integration and push | `ki-git` self-integration by the worker, unchanged | The same |
| Cross-host placement | Orca connected servers, `--on`, once paired; not yet set up | None |
| Package, record, decisions, acceptance | Unchanged | Unchanged |

Orca's Run and messages sit in one host's database and do not move. A package that moves host drains or settles its Orca workers first, records that the old Run is left behind, and starts a fresh Run on the new host; the package, not the Run, carries the work across.

## What Orca should not be made to do

- **Hold canonical state.** No query, decision, acceptance or record status lives only in Orca. Orca's Task "completed" means the attempt settled, never that the record is done.
- **Stand in for Kris.** A coordinator's `reply` answers only what the brief already authorises. A gate resolution is not a decision until Kris's words are in `decisions.md`.
- **Write to Git.** Orca chatter, heartbeats and message bodies never go into a repository. What matters reaches Git through the report.
- **Integrate or push.** Orca creates worktrees; rebasing, gates on the rebased range, fast-forward into `main` and pushing stay under `ki-git`.
- **Carry work between hosts.** The Run is host-local; Git on the remote is the only cross-host truth.
- **Act unattended without a grant.** An Orca automation that starts a session is a durable wake, which stays deferred under WAKE-SUBSTRATE and needs an away grant under `ki-coordination` when adopted.
- **Mirror every query as a gate.** Only a query that blocks a specific Task gets one.

## What Knowledge Islands should stop doing where Orca runs

- No `ki agent` queue, dispatcher, waiter or monitor for a package that has chosen Orca on that host.
- No KI status file or `inbox.md` protocol for an Orca worker; heartbeats and Dispatch messages replace them, so a worker keeps one protocol, not two.
- No new `ki agent` features that duplicate Orca's dependency graph, liveness projection, remote placement or terminal watching, while the trial runs. `ki agent` stays maintained as the launcher on hosts without Orca and as the reference for the standard.

## What the trial showed

The plan069 trial on sol, one Codex worker planning KI-TOOL-RIG-CORE-069:

| Observation | Cause | What the fit does about it |
| --- | --- | --- |
| Two operational questions answered through Orca within minutes | `ask` and `reply` work as designed | Keep for operational questions (H6) |
| The third question timed out | No coordinator was waiting; Orca cannot wake an idle session | Armed background check (H16) |
| "Never stash" collided with the lint-staged hook's own backup stash | The brief forbade all stashing; the hook stashes internally | Briefs say "never stash manually"; and workers no longer commit in the coordinator's checkout (H12, H13) |
| `check` showed titles only; bodies needed `inbox --full` | Orca's summary view | The worker guidance names how to read a full message body |
| No gates used | Nothing blocked a Task | Correct; gates only for blocking queries (H8) |
| Run, Tasks and messages sit only in `orchestration.db` on sol | Orca's design | Accept: nothing canonical is put there |

## Numbered claims for review

Reviewers mark each Agree, Differ or Add, with evidence for Differ.

1. The work package and the roadmap record remain the only durable statements of what work exists and where it stands; Orca holds none of it.
2. One launcher per package per host, recorded in the package's decisions log.
3. `ki` renders the prompt with its authority footer; Orca launches from that rendered prompt; a render-only `ki` step is the one tooling gap at the seam.
4. Workers never write the work package; the coordinator copies the report in at receive, so no worker commits in the coordinator's checkout.
5. Orca `ask` and `reply` replace nothing in KI for owner-level questions; they serve only questions the brief already authorises the coordinator to answer.
6. An owner-level question ends the worker's attempt with a blocking query; a gate is added only when a Task cannot start without the answer.
7. A gate is resolved only after Kris's answer is logged.
8. The coordinator's armed background check becomes a bounded `orca orchestration check --wait`, which closes the trial's timeout without new machinery.
9. Orca heartbeats replace the KI status file for Orca workers.
10. Orca ids are recorded in `state.md` Now while a unit runs, with the host, and go at receive.
11. Orca worktrees are used only when parallel writers need isolation; integration and push stay under `ki-git`.
12. Orca state never crosses hosts; a host move starts a fresh Run.
13. Durable unattended waking through Orca automations stays deferred under WAKE-SUBSTRATE.
14. `ki agent` launcher features that duplicate Orca are frozen while the trial runs, not removed.

## Open choices

### OF-LAUNCHER - Where Orca launches

a) (recommended) Orca launches only for packages that opt in by a logged decision, as Mac Studio setup has; finish two or three more units there, then decide on wider use with the trial log and this design reviewed.

b) Make Orca the launcher for every package on any host with Orca now.

### OF-REPORT - Where an Orca worker's report goes

a) (recommended) Outside every repository, named in `worker_done --report-path`; the coordinator copies it into the work folder at receive and commits it with the move.

b) The worker writes and commits its report into the work folder itself.

### OF-OWNER-ASK - How a worker raises a question only Kris can answer

a) (recommended) The worker ends its attempt with a blocking query and `worker_done --outcome failed`, its summary naming the tag; the coordinator copies the query into `queries.md`, gates the dependent Task if one exists, and retries after Kris answers.

b) The worker keeps an `ask` open while the coordinator relays to Kris, resuming the same message after each 30-minute timeout.

### OF-WAKE - How the coordinator hears from workers

a) (recommended) A bounded background `orca orchestration check --wait`, re-armed at each wake, as the existing armed-check rule requires; Orca automations as a durable wake stay deferred.

b) Design an Orca automation with a shell pre-check as the durable wake now.

### OF-LIVENESS - Which liveness signal an Orca worker keeps

a) (recommended) Orca heartbeats only; the coordinator's timed updates read `worker-list` and `worker-read`.

b) Both Orca heartbeats and a KI status file.

### OF-IDS - Where Orca ids are recorded

a) (recommended) One `state.md` Now line per running unit, naming run, host, Orca Run, Task and Dispatch, removed at receive.

b) In the brief's front matter.

### OF-PROMPT - How the Task specification is formed

a) (recommended) The full rendered prompt, brief plus authority footer and report rule, passed as the specification, so the worker sees one self-contained text.

b) A short specification pointing at the rendered prompt file.

### OF-KI-AGENT - What happens to `ki agent` launcher work

a) (recommended) Freeze new `ki agent` features that duplicate Orca while the trial runs, keep it maintained, and decide at the trial's end.

b) Continue `ki agent` launcher development unchanged.

## What adopting it would touch

Nothing here is enacted. If Kris adopts the design after review, the rollout would be messages to the owning works, not records here:

- `ki-delegation`: an Orca section mapping the run packet, report path, liveness and steering for Orca workers; the "never stash manually" wording.
- `ki-coordination`: the armed check under Orca, the gate rule, the `state.md` Now line.
- `tools-ki`: a render-only prompt step, and the freeze if OF-KI-AGENT a) is taken.
- Mac Studio setup: continue its trial under the adopted shape and keep [its trial log](https://github.com/knowledgeislands/ki-principal/blob/d8ab8112/+/_WORK/ki.prj.orca-evaluation/trial/orca-trial.md).
