# Coordinating-work standard: territory work

This file holds States of play, Project work under them, assigned packages, the owner queue and the worktree sweep. It extends [the core](standards-coordination.md).

## Contents

- [Coordinating work](#coordinating-work)
  - [Territory work](#territory-work)
  - [Coordinating assigned packages](#coordinating-assigned-packages)
  - [Secondary States of play](#secondary-states-of-play)
- [Owner queue](#owner-queue)
- [Worktree sweep](#worktree-sweep)

## Coordinating work

Project work coordinates exactly one Project for the owner. It always delegates: it runs its work as background agents on its agent host's own subagents under the `ki-delegation` [background-run standard](../../../agentic-systems/ki-delegation/references/standards-background-runs.md), and keeps its own turns short under [Coordinator responsiveness](standards-coordination.md#coordinator-responsiveness).

- **Package:** the coordinator picks the work up from `+/_WORK/<territory>.prj.<project>/`, whose `_index.md` defines the work and whose `state.md` holds its current state only, and keeps both current under the work-package standard. `_index.md` names its Project in front matter; the Project note does not link down.
- **Decisions:** log each owner approval in `+/_WORK/<id>/decisions.md` before launching the work it authorises.
- **State of play:** the [State of play](#territory-work) owns cross-Project priorities, releases and decisions touching more than one Project, and Project work raises those there. Releases follow the `ki-repo-tools` release-on-demand policy: a delivery run never releases by default, and a release run carries the `release` footer for the named release only.
- **Naming:** where the runtime can name a session, it takes its seat's thread line, such as `⚒️ 🔑 ki.prj.ways-of-working`, under [Work naming](standards-opening.md#work-naming).
- **Opening:** open Project work only where there is active work to drive, within the State of play's [cap](#territory-work). A dormant, registered Project may have an On hold package solely to receive its first line, under [Seeding](#territory-work).
- **Scope:** work only the Project's own records. Work belonging to another Project goes to that Project's `messages.md` through the State of play, the secondary covering both where one does.
- **Close:** Project work shows Finished only at [Finishing Project work](standards-mark.md#finishing-project-work); until then it moves between the other six states.

### Territory work

Each territory Capital holds one main State of play, `+/_WORK/<territory>.sop.main/_index.md`, titled `<Territory> > SoP`: the coordination of the territory's coordinations. It may also hold [secondary States of play](#secondary-states-of-play), each coordinating a named part of the territory under the main.

- Each does project management and may coordinate explicitly assigned Project packages. Delivery stays in those packages and their product repositories, never in the State of play's own package.
- Only a Capital holds a State of play. The main is never Finished while the territory is open.
- "The State of play" unqualified means the main; a secondary takes those duties only for the work it covers, under [Secondary States of play](#secondary-states-of-play).

Its duties:

- **Registry:** the themes and Projects it manages are defined in the Capital's `Streams/` registry under the `ki-work` Project registry standard; their records live in the roadmaps of the territory's repositories.
- **Owns:** cross-Project priorities; releases; decisions touching more than one Project; [lines](standards-messages.md#messages-between-work) to Project work, written into their `messages.md` and Project notes; the Project-work queue; and a territory hold with the list of work to restart from it.
- **Views:** it rolls up the five views the Work Process note sets, with you, stuck, blocked, moving and on hold, across the territory through `ki work status`. Work awaiting review stays out of the five views and shows as a count.
- **Regular work:** it may discuss regular work and send it lines without opening coordination on that package; dispatch follows its explicit assignment and the owner-approved scope.
- **Acting for idle work:** where a package in its territory has no active session, `listening_status` not `on`, the State of play takes its lines; otherwise nothing would until the package is next opened.
  - It takes the package's Inbound under [Messages between work](standards-messages.md#messages-between-work), `IMPORTANT` lines first, then in queue order, one package per turn.
  - For each line it ACKs at the top of the sender's Inbound; routes a part belonging to other work by a line in that work's `messages.md`, under **Dispatch** below; answers what the territory's coordination can answer by a reply line to the sender; and puts what needs the package's own judgement or the owner into the package's `state.md` next steps or `discussions.md`.
  - It then removes the line in a commit naming the line and the package, `docs(work): <id> messages taken by <State of play id>`.
  - It takes the package's work forward only where its own assignment already covers it. Acting for the package, it launches no run and changes none of its state, holder, `since`, mark, hold or decisions; an On hold package stays on hold.
  - Acting for is not stewardship and transfers nothing under [Coordinating assigned packages](#coordinating-assigned-packages). A package whose home is absent, stale or ambiguous is surfaced, not acted for.
  - A secondary acts for the packages it covers, the main for the rest.
  - When the package's own session opens, it takes only the lines still queued, finds the dispositions in its files and Git, and the State of play stops acting for it.
- **Cap:** at most three or four Project packages are active at once, however many sessions act on them; On hold and Finished do not count.
  - Exceeding the cap needs the owner's explicit agreement beforehand; the coordinator cannot raise it alone. Until then, queue the next piece.
  - Keep the active work and the ordered queue in `state.md`'s `## Queue`, each with its title and opener, and open the next queued piece when an active one goes on hold or finishes.
  - Within one piece, about three background agents run at once and the rest wait in the run queue, under [Coordinator responsiveness](standards-coordination.md#coordinator-responsiveness).
- **Acceptance first:** at bootstrap and resume, its first call on the owner, before any other query, is the territory's records awaiting acceptance, as one bundle per work under [Acceptance bundles](standards-queries.md#acceptance-bundles).
- **Seeding:** before Project work opens, the State of play creates or reconciles its package and gives the owner its [opener](standards-opening.md#opening-work), so the session opens with one message. The sender or the State of play may create an absent, registered Project's package solely to queue its first line, within the receiving repository's authority: all five files, with a minimal definition, empty queries and decisions, `state: on-hold`, `hold.reason: paused` and `hold.release: when Kris opens this Project work`. A queued line neither opens nor releases the work.
- **Flags:** at its own mark, it names by a line in each owning work's `messages.md` every package the `ki-work-package` rubric's [FOLDER](../../ki-work-package/references/rubric.md) items flag, under [Pruning the work folder](standards-mark.md#pruning-the-work-folder).
  - It never names a finished work's package in a line: it closes that package itself under the `ki-work-package` [close-out](../../ki-work-package/references/standard-work-package.md#410-the-tidy), putting the query in its own `discussions.md` if a close-out check fails.
  - It never prunes another package otherwise.
  - At the same mark it runs the [worktree sweep](#worktree-sweep) and reports only what it finds.
- **Other territories:** it coordinates with another territory's State of play only through the owner, and never acts with authority in another territory's repositories. Each Capital keeps its own ownership; cross-repository work moves under `ki-trades` or the receiving repository's own process.

**Dispatch.** The State of play is the single dispatch coordinator. Every new unit with no clear owner, an owner dump, a handoff with no owning work, a cross-work item whose owner is unclear, and every method improvement, comes to it, pasted by the owner or as a line in its own `messages.md`. A work's own follow-ups, an item in a record already naming its work, and a reply to a line go direct.

- **Matching:** match the unit against the register, the `_index.md` and `state.md` front matter `ki work status` derives from the packages, reading a `_index.md` body only where two descriptions match. Keep no copy of the register.
- **Routing:** write one dated line into the chosen work's `messages.md`, `- <date> · ROUTE · <Territory> > SoP (<territory>): <the unit in the owner's words, with links>`, at the position its priority warrants, flagged important where it must be taken first, under [Messages between work](standards-messages.md#messages-between-work). Where nothing matches, propose to the owner a new piece of work, within the cap, or a record captured through `ki-work next`.
- **Returns:** a returned part is routed once more at most. If it cannot be placed, or would come back again, it goes to the owner as a query, so nothing bounces.
- **Unread lines:** show in the register the count and age of lines nobody has picked up. A line routed to work On hold, paused, waits without waking it. For work Snoozing whose session is closed or not waking, identify the work by its thread line, and ask the owner to lift a hold where a line is urgent.

**Stewardship of continual improvement.** Every work tries to improve continually, and the State of play coordinates it.

- Every work sends a method improvement to the State of play as a `METHOD` line in its `messages.md`, and the State of play also watches the works for improvements.
- While Ways of working is open, the State of play routes each improvement to it like any other unit, its description saying it takes method changes, and Ways of working sends targeted `REFRESH` lines under [Refreshing this guidance](standards-coordination.md#refreshing-this-guidance).
- When Ways of working finishes, the State of play's `_index.md` description gains method stewardship and its Scope says where method changes go. It keeps a method backlog, dispatches each accepted small improvement as small regular work or into the Project it most affects, with a design review for a change of shape, and sends the `REFRESH` lines itself. A significant change revives Ways of working, or a more targeted Project under the Model theme.
- Lasting method authority stays in the skills and Decision Records, and the State of play still executes nothing.

Sources: SOP-ACTS-FOR-IDLE, WORK-ROUTING and STEWARD-HOME in [the decision register](sources.md#decision-register).

### Coordinating assigned packages

**Tending.** The acknowledged steward tends a package's disposition, queues and tidy independently of any active coordinator. The parent State of play reconciles assigned regular umbrellas, children and declared member homes through `parent`/`covers` and the home reference at opening, bootstrap, approved moves and ordinary tending.

- Surface absent, stale, inaccessible or ambiguous homes and unacknowledged ownership; do not take over or clear their lines.
- The Capital's prose home reference is discovery, never a second package, state or inbox.
- Reader compatibility is a prerequisite to automated member-home discovery; the local advisory hook neither scans the estate nor guarantees runtime injection.

**Stewardship.** A State of play may steward an assigned package of any level only by the explicit committed assignment and acknowledged handover of the `ki-work-package` [stewardship rule](../../ki-work-package/references/standard-work-package.md#49-writers).

- Its field stays the marked STEWARD-FIELD placeholder; add no field and do not reinterpret `worker`.
- The old steward stops launches and reconciles runs in flight, queued launches and pending writes; the new steward acknowledges and takes their supervision before acting.
- No absent session, missing binding, quiet session or timeout transfers stewardship. Assignment never changes the holder or releases On hold work.
- An assigned State of play may use the package's own entry points, tidying included. It may create or adopt a package only for a registered Project within the cap, with a state the actual move justifies. First-line seeding of dormant work stays On hold.
- A package assigned elsewhere receives only lines. A territory hold drains assigned Project packages first and asks any independent steward to drain its own; it never writes another steward's package.

**One Summary across packages.** A territory Summary reports across the packages it stewards, naming the package on every item.

- A query's identity is `(work id, tag)`; its full text lives in that package's `discussions.md`, and the owner's answer in that package's `decisions.md`.
- Each package keeps its own state, `since`, mark and beat. A territory mark never moves Project marks, and an acknowledgement moves only the work it clearly names.
- Keep a decision spanning Projects once, at the territory home, and link it, rather than copying it as several grants.

**Records.** A record's `project` resolves through the registry to its package and grants no authority. Selection into `now` neither opens Project work nor grants execution. The steward adds the next-step link from the routed line at its next wake; records keep the owning repository's holds, readiness and acceptance. Project-less work goes first to its existing regular or ad hoc owner, and to the State of play's routing queue only if unresolved. Reclassification reconciles running work and report destinations first.

**Runs and hosts.**

- Every run brief separates its reporting package from the product repository. The session that started the run homes the report in that package under the `ki-delegation` [run packet](../../../agentic-systems/ki-delegation/references/standards-background-runs.md#run-packet).
- Bootstrap and re-anchoring establish the local machine through the territory's machine inventory.
- Host requirements restrict only device-dependent execution: any coordinator may acknowledge, plan, ask about or dispatch a targeted line, in `IMPORTANT` and queue order. Keep unfulfilled requirements queued and counted, flagging their age when no eligible host has taken them; never infer a takeover.
- Resolve concrete hosts, categories and unknown or renamed names under the `ki-work-package` [message rule](../../ki-work-package/references/standard-work-package.md#48-messages).
- The session's host seat stays out of packages, holds and reports.

### Secondary States of play

A territory always has its main State of play and may add secondaries where it has more work than one coordinator can hold, such as `HNR > SoP (main)`, `HNR > SoP (5ge)` and `HNR > SoP (sites)`. A territory with no secondary needs no change.

- **Declaration:** a secondary is a State of play in the Capital, `+/_WORK/<territory>.sop.<name>/`, a five-file package at `level: territory`, titled `<Territory> > SoP (<name>)`, with `parent: <territory>` and `covers` naming its assigned same-territory Project and ad hoc work.
  - Every package below the main names its coordinating State of play as `parent`.
  - The main's `covers` is the register of record, including coverage through secondaries and registered work whose package is absent or pruned; a secondary's list is an assigned subset.
  - Check parents against the register, same-territory membership, unique secondary coverage and cycles, under the `ki-work-package` [definition fields](../../ki-work-package/references/standard-work-package.md#44-the-entry-file).
  - Work with no secondary stays with the main.
- **Creating:** the owner decides each secondary and its coverage at the main, which logs the decision and prepares the package On hold until the owner opens it. Changing coverage is a main decision, made in both `_index.md` files in one commit.
- **Front door:** the main stays the owner's only front door and the single dispatch coordinator. Owner dumps, units with no clear owner, method improvements, and anything touching more than one secondary, or a secondary and uncovered work, come to the main.
- **Main owns:** the registry, membership and Known Lands; releases and priorities across secondaries; the territory-wide ceiling on active Project work; method stewardship; the worktree sweep; and every decision touching more than one secondary.
- **Secondary owns,** for its covered work alone: cross-Project priorities; its queue in its own `state.md` `## Queue`, within its share of the main's ceiling; acceptance bundles; decisions touching more than one covered Project; and routing between them. It rolls up the five views across its covered work; the main rolls up all.
- **Routing down:** the main routes a unit within one secondary's coverage as one `ROUTE` line into that secondary's `messages.md`, and the secondary routes it on. A unit for one named covered work may go straight there.
- **Routing up and across:** covered work sends a matter across its covered Projects to its secondary, and a `METHOD` line or anything beyond the coverage to the main. A secondary sends cross-cutting matters to the main and may message another secondary directly where the matter's owner is clear. A secondary returns a part it cannot place to the main, once; the main places it or asks the owner.
- **Acceptance:** each secondary brings its covered work's acceptance bundles first at its own bootstrap and resume; the main brings the rest and shows each secondary's count.
- **Opening:** the owner opens a secondary with the [secondary opener](standards-opening.md#opening-work), and takes every opener for the territory from [Opening work](standards-opening.md#opening-work).

Sources: SECONDARY-SOP in [the decision register](sources.md#decision-register).

## Owner queue

Each piece of Project work is capped at eight records awaiting acceptance and at eight open queries.

- Over either cap, launch no new build or planning run until the owner catches up; acceptance fixes and work that clears the backlog stay allowed.
- Bring acceptance as one bundle per work under [Acceptance bundles](standards-queries.md#acceptance-bundles); the banner's counts line shows the records waiting, under [Banner](standards-coordination.md#banner).
- The rubric warns over either cap, under [Pruning the work folder](standards-mark.md#pruning-the-work-folder).

Sources: OWNER-QUEUE in [the decision register](sources.md#decision-register).

## Worktree sweep

At each mark the State of play sweeps its territory's repositories for work left between a run and `main`, and reports only what it finds.

- **Reads:** each repository's linked worktrees, branches not merged into `main`, stashes, and mains ahead of their upstream, through read-only Git.
- **Shows:** each finding in its banner as `- [stranded] <worktree or branch> · <owning work>`, `[branch]` or `[stash]`, whatever its age. A clean sweep adds nothing, and routine push state is omitted.
- **Removes nothing:** integrating goes to the owning work; a stash drop, branch deletion or worktree removal goes to the owner by name under the `ki-git` [clean-down](../../../repository/ki-git/references/standards-git.md#clean-down-state) rule. The sweep reports Git state, not age.

Sources: STALE-SWEEP and WORKTREE-START in [the decision register](sources.md#decision-register).
