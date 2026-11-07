---
note_type: streams/design
updated: 2026-10-31T02:15:00Z
author: Written with Claude
---

# Empty board

**Owner:** Kris Brown · **Owning repository:** knowledgeislands/ki-principal · **Owning work:** `ki.prj.ways-of-working` · **Date:** 2026-10-31 · **Status:** draft for Kris's morning review

Design note for EMPTY-BOARD and WIP-LIMIT, Kris's answers of 01:36 GMT on 31 October 2026, as read back in this package's [decisions](https://github.com/knowledgeislands/ki-principal/blob/d8ab8112/+/_WORK/ki.prj.ways-of-working/decisions.md#owner-answers-during-away-31-oct-0136-gmt-31-october-2026). Kris asked to move towards an empty board, the old Kanban idea: work packages show only the work that is active, the roadmap shows only the work coming up next, ideas sit in one consolidated place, and gates decide when something moves from one to the next. Kris also asked for less work in progress at once, with units going through one at a time and finishing quickly, and for any place where the structure contradicts itself to be flagged.

This note takes stock of where work and ideas live today, proposes the gates and the limits, lists what does not fit today, and flags the contradictions. It changes nothing: no record, page, package or standard has been touched, and every idea stays where it is. The consolidated list is in [ideas](empty-board-ideas.md). The note graduates when Kris has answered its queries and each accepted rule is written into its owning standard; it is then deleted in the same change.

## Contents

- [In short](#in-short)
- [1. Where things live today](#1-where-things-live-today)
- [2. The consolidated ideas list](#2-the-consolidated-ideas-list)
- [3. Gates and limits](#3-gates-and-limits)
- [4. What does not fit today](#4-what-does-not-fit-today)
- [5. Where the structure contradicts itself](#5-where-the-structure-contradicts-itself)
- [6. What adopting this would take](#6-what-adopting-this-would-take)
- [Queries](#queries)

## In short

- The board is far from empty. Of 16 work packages, one is actively being worked on (this one), five are waiting on Kris, nine are on hold and one is finished but still kept. Together they hold 45 open queries, 120 parked queries and about 140 queued messages.
- The roadmaps are small, 22 records across nine repositories, but only three of them are genuinely next in line or in review. Seven are finished and waiting to be pruned, six are triage or held, and six "now" records belong to work that is not moving.
- Ideas live in at least seven kinds of place. The [ideas](empty-board-ideas.md) list gathers 244 entries from them: 55 on Project and theme pages, 43 in repository idea ledgers, 3 concepts, 8 dormant Projects, 6 roadmap records that are not upcoming, 9 held packages and 120 parked queries.
- The proposal is three columns, **Ideas**, **Upcoming** and **Active**, with a gate between each and a limit on each: one unit at a time per package, at most three active packages across the territory, and at most three upcoming records per repository.
- Twelve contradictions in the structure are flagged in section 5, the most important being that the standards' own concurrency rule ("about three agents running") and Project cap ("three or four") are looser than WIP-LIMIT, and that ideas have four sanctioned homes, not one.

## 1. Where things live today

Taken from the working copies at about 02:00 GMT on 31 October 2026, after run `sync-all` brought every repository level with its remote. The territory is the 20 repositories in [Known Lands](https://github.com/knowledgeislands/ki-principal/blob/d8ab8112/Admin/Governance/Known%20Lands.md); only Knowledge Islands Principal holds work packages.

| Place | What it holds | Count |
| --- | --- | --- |
| Work packages, [`+/_WORK/`](https://github.com/knowledgeislands/ki-principal/tree/d8ab8112/+/_WORK) | One folder per piece of work | 16 packages |
| - by state | With worker (active) | 1: [`ki.prj.ways-of-working`](https://github.com/knowledgeislands/ki-principal/blob/d8ab8112/+/_WORK/ki.prj.ways-of-working/state.md) |
| | With supervisor or handed to supervisor (waiting on Kris) | 5: [`ki.sop.main`](https://github.com/knowledgeislands/ki-principal/blob/d8ab8112/+/_WORK/ki.sop.main/state.md), [`ki.prj.observatory`](https://github.com/knowledgeislands/ki-principal/blob/d8ab8112/+/_WORK/ki.prj.observatory/state.md), [`ki.prj.orca-evaluation`](https://github.com/knowledgeislands/ki-principal/blob/d8ab8112/+/_WORK/ki.prj.orca-evaluation/state.md), [`ki.prj.chezmoi`](https://github.com/knowledgeislands/ki-principal/blob/d8ab8112/+/_WORK/ki.prj.chezmoi/state.md), [`ki.prj.mac-studio-setup`](https://github.com/knowledgeislands/ki-principal/blob/d8ab8112/+/_WORK/ki.prj.mac-studio-setup/state.md) |
| | On hold | 9 (listed in [ideas](empty-board-ideas.md#packages-on-hold)) |
| | Finished | 1: [`ki.prj.knowledge-acquisition`](https://github.com/knowledgeislands/ki-principal/blob/d8ab8112/+/_WORK/ki.prj.knowledge-acquisition/state.md) |
| Open queries | Decisions waiting on Kris, in `queries.md` | 45 (this package 14, State of play 11, Observatory 9, Orca evaluation 9, Mac Studio setup 2) |
| Parked queries | Decisions put aside at a hold | 120 across 9 packages |
| Queued messages | Handoffs waiting in `messages.md` | about 140 lines; 40 of them in the held [`ki.prj.tools-burndown`](https://github.com/knowledgeislands/ki-principal/blob/d8ab8112/+/_WORK/ki.prj.tools-burndown/messages.md) |
| Design notes | `design/` folders in packages | 136 files; 82 of them in this package |
| Run reports | `*.report.md` left in package folders | 129; 76 in this package, 42 in Observatory |
| Roadmap records, Principal | [`Streams/Roadmap/`](https://github.com/knowledgeislands/ki-principal/blob/d8ab8112/Streams/Roadmap/Roadmap.md) | 1: [KI-PRINCIPAL-MOD-011](https://github.com/knowledgeislands/ki-principal/blob/d8ab8112/Streams/Roadmap/KI-PRINCIPAL-MOD-011-amend-work-model-assigned-package-cascade.md) |
| Roadmap records, other repositories | `docs/roadmap/` in 8 repositories | 21 (tools-rig 6, Observatory 5, tools-ki 4, harness 3, ki-design 1, Techne harness 1, tools-mgit 1) |
| - by status | done, awaiting pruning | 7 |
| | awaiting review | 2 |
| | in progress | 1 |
| | draft, horizon `now` | 6 |
| | draft, horizon `hold` | 3 |
| | triage (captured, not adopted) | 3 |
| Triage | No separate triage area exists; triage is a record status | 3 records |
| Repository idea ledgers | `docs/roadmap/_IDEAS.md`, with full text in `docs/ideas/` | 43 ideas in 9 repositories, 40 full-text files |
| `Idea:` lines | [Project](https://github.com/knowledgeislands/ki-principal/blob/d8ab8112/Streams/Projects/Projects.md) and [theme](https://github.com/knowledgeislands/ki-principal/blob/d8ab8112/Streams/Themes/Themes.md) pages | 55 ideas on 17 pages |
| Concepts | [Emerging Concepts](https://github.com/knowledgeislands/ki-principal/blob/d8ab8112/Pillars/Philosophy/Emerging%20Concepts/Emerging%20Concepts.md) | 3 |
| Project registry | Project pages and their `lifecycle` | 24 Projects: 14 active, 6 planned, 3 paused, 1 completed; section 5 shows where lifecycle and package state disagree |
| Trades and acquired packets | [`+/_TRADES/`](https://github.com/knowledgeislands/ki-principal/blob/d8ab8112/+/_TRADES/README.md), [`+/_ACQUIRED/`](https://github.com/knowledgeislands/ki-principal/blob/d8ab8112/+/_ACQUIRED/README.md) | empty |

## 2. The consolidated ideas list

[Ideas](empty-board-ideas.md) gathers every idea, meaning anything that is neither active nor upcoming, into one list, each linked to where it lives. Nothing was moved or deleted. It is grouped by where each idea lives today, so that it can be checked against its source:

| Section | Entries |
| --- | --- |
| Ideas on Project and theme pages | 55 |
| Ideas in repository idea ledgers | 43 |
| Concepts | 3 |
| Projects with no live work (planned or paused, no package) | 8 |
| Roadmap records that are not upcoming (triage or held) | 6 |
| Packages on hold | 9 |
| Parked queries | 120 |
| **Total** | **244** |

Two things it does not list one by one. The queued messages in held packages are counted under each held package rather than listed, since they are handoffs that the receiving work will turn into units when it resumes. Design notes are counted in section 1 rather than listed, since most record designs already decided or under review; the undecided designs, such as host sync and the mgit cache, are already present as parked queries.

## 3. Gates and limits

### The three columns

| Column | What it means | Where it lives | Who moves things in |
| --- | --- | --- | --- |
| **Ideas** | Anything we might do, not yet committed to | One consolidated list (see IDEAS-HOME) | Anyone may add; nothing is ever adopted silently |
| **Upcoming** | Committed, shaped and next in line | The roadmap: records with horizon `now` or `next` | Kris adopts |
| **Active** | Being worked on now | A work package's next steps, one unit at a time | The coordinator, within the limits |

Finished work leaves the board: done records are pruned and finished packages removed at the mark that closes them.

### Gate 1: from idea to upcoming

An idea becomes an upcoming roadmap record only when all of these hold:

1. **Kris says yes.** Adoption is Kris's alone, as it is today; no run or coordinator adopts.
2. **It has a home.** It belongs to an active Project, or to regular work, and names the repository that will deliver it.
3. **The next step is known.** Nothing undecided blocks it; if a decision does, that decision is the work and goes first.
4. **It is small.** It can be finished in a few days at most, sized `s` or `m`; anything larger is split before it is adopted.
5. **There is room.** The repository has fewer than three upcoming records, and the territory fewer than ten.

### Gate 2: from upcoming to active

An upcoming record becomes active work in a package only when all of these hold:

1. **It is Ready.** It has been planned and Kris has approved the plan, as `ki-plan` already requires.
2. **Nothing it needs is missing.** Its dependencies are done, no open query blocks it, and any attended step has Kris booked for it.
3. **The package has a free slot.** The package has no other unit in flight.
4. **The territory has a free slot.** Fewer than three packages are active.

### Limits

| Limit | Proposed | Today's rule | Today's count |
| --- | --- | --- | --- |
| Units in flight per package | 1, plus at most one independent review of that same unit | none; "keep about three agents running at once" | up to 3 in this package overnight |
| Active packages across the territory | 3 Project or regular packages, plus State of play | "three or four" Project packages ([COORD-3](/Users/krisbrown/kis/knowledge-islands/ki-agentic-harness/skills/change-management/ki-coordination/references/rubric.md)) | 5 not on hold, not finished |
| Upcoming records per repository | 3 (`now` and `next` together) | none | tools-rig 4 at `now`; every other repository 1 or none |
| Upcoming records across the territory | 10 | none | 9 at `now` |
| Open queries per package | 8, as OWNER-QUEUE already says | 8 | this package 14, State of play 11, Observatory 9, Orca evaluation 9 |

A package that is waiting on Kris still counts as active. That is deliberate: it keeps the number of things in flight honest, and answering frees a slot.

### Keeping the board empty

- **Ideas age.** Kris reviews the ideas list at a regular point, perhaps weekly; an idea untouched for 90 days is offered for dropping.
- **Parked queries become ideas.** A parked query is a decision nobody is making; at its package's next mark it moves to the ideas list, carrying its recommendation, and leaves `queries.md`.
- **Holds end.** A package on hold for more than 14 days is either released or closed out: its decisions homed, its queued messages and parked queries moved to the ideas list, and its folder removed. The Project stays in the registry as `paused`.
- **Finished means gone.** Done records are pruned and finished packages removed at the closing mark, as the standards already say, not left behind.

## 4. What does not fit today

### Packages that hold work which is not active

| Package | State, since | What it holds that is not active |
| --- | --- | --- |
| [`ki.prj.agent-host`](https://github.com/knowledgeislands/ki-principal/blob/d8ab8112/+/_WORK/ki.prj.agent-host/state.md) | on hold, 29 Oct | 4 messages, 5 parked queries, 3 design notes |
| [`ki.prj.baseline-rollout`](https://github.com/knowledgeislands/ki-principal/blob/d8ab8112/+/_WORK/ki.prj.baseline-rollout/state.md) | on hold, 20 Oct | 11 messages, 15 parked queries about other territories' records |
| [`ki.prj.estate-factorisation`](https://github.com/knowledgeislands/ki-principal/blob/d8ab8112/+/_WORK/ki.prj.estate-factorisation/state.md) | on hold, 19 Oct | 13 parked queries; waits on Kris's review of its close-out |
| [`ki.prj.paperclip-capture-and-rebuild`](https://github.com/knowledgeislands/ki-principal/blob/d8ab8112/+/_WORK/ki.prj.paperclip-capture-and-rebuild/state.md) | on hold, 20 Oct | 2 messages, 2 design notes |
| [`ki.prj.portable-specifications`](https://github.com/knowledgeislands/ki-principal/blob/d8ab8112/+/_WORK/ki.prj.portable-specifications/state.md) | on hold, 20 Oct | 2 parked queries, 9 design notes |
| [`ki.prj.timelines`](https://github.com/knowledgeislands/ki-principal/blob/d8ab8112/+/_WORK/ki.prj.timelines/state.md) | on hold, 20 Oct | 2 messages, 2 parked queries, 5 design notes |
| [`ki.prj.tools-burndown`](https://github.com/knowledgeislands/ki-principal/blob/d8ab8112/+/_WORK/ki.prj.tools-burndown/state.md) | on hold, 20 Oct | 40 messages, including the ORCA-ENV-LEAK security fix; 3 parked queries; 8 design notes |
| [`ki.prj.website`](https://github.com/knowledgeislands/ki-principal/blob/d8ab8112/+/_WORK/ki.prj.website/state.md) | on hold, 25 Oct | 6 messages |
| [`ki.reg.main`](https://github.com/knowledgeislands/ki-principal/blob/d8ab8112/+/_WORK/ki.reg.main/state.md) | on hold, 18 Oct | 3 messages |
| [`ki.prj.knowledge-acquisition`](https://github.com/knowledgeislands/ki-principal/blob/d8ab8112/+/_WORK/ki.prj.knowledge-acquisition/state.md) | finished, 20 Oct | the whole folder, which should have been removed at its closing mark |
| [`ki.prj.chezmoi`](https://github.com/knowledgeislands/ki-principal/blob/d8ab8112/+/_WORK/ki.prj.chezmoi/state.md) | with Kris, 24 Oct | 18 messages; nothing has moved for a week |
| [`ki.prj.mac-studio-setup`](https://github.com/knowledgeislands/ki-principal/blob/d8ab8112/+/_WORK/ki.prj.mac-studio-setup/state.md) | with Kris, 30 Oct | 15 parked queries, 4 run reports |
| [`ki.prj.observatory`](https://github.com/knowledgeislands/ki-principal/blob/d8ab8112/+/_WORK/ki.prj.observatory/state.md) | with Kris, 29 Oct | 9 open queries, 36 messages, 42 run reports |
| [`ki.prj.orca-evaluation`](https://github.com/knowledgeislands/ki-principal/blob/d8ab8112/+/_WORK/ki.prj.orca-evaluation/state.md) | with Kris, 30 Oct | 9 open queries |
| [`ki.sop.main`](https://github.com/knowledgeislands/ki-principal/blob/d8ab8112/+/_WORK/ki.sop.main/state.md) | with Kris, 30 Oct | 11 open queries, 22 parked, 7 run reports |
| [`ki.prj.ways-of-working`](https://github.com/knowledgeislands/ki-principal/blob/d8ab8112/+/_WORK/ki.prj.ways-of-working/state.md) | with worker, 31 Oct | 14 open and 43 parked queries, 82 design notes, 76 run reports |

### Roadmap records that are not truly upcoming

| Record | Status and horizon | Why it is not upcoming |
| --- | --- | --- |
| [KI-OBSERVA-BRG-004](/Users/krisbrown/kis/knowledge-islands/apps-observatory.local/docs/roadmap/KI-OBSERVA-BRG-004-turn-feedback-sending-on.md) | done | finished, waiting to be pruned |
| [KI-HARNESS-GOV-232](/Users/krisbrown/kis/knowledge-islands/ki-agentic-harness/docs/roadmap/KI-HARNESS-GOV-232-any-package-coordination.md), [KI-HARNESS-GOV-233](/Users/krisbrown/kis/knowledge-islands/ki-agentic-harness/docs/roadmap/KI-HARNESS-GOV-233-typed-work-naming-readers.md), [KI-HARNESS-GOV-234](/Users/krisbrown/kis/knowledge-islands/ki-agentic-harness/docs/roadmap/KI-HARNESS-GOV-234-footer-markdown-writers.md) | done | finished, waiting to be pruned |
| [KI-TOOL-KI-CLI-173](/Users/krisbrown/kis/knowledge-islands/tools-ki/docs/roadmap/KI-TOOL-KI-CLI-173-regular-coordination-readers.md), [KI-TOOL-KI-CLI-174](/Users/krisbrown/kis/knowledge-islands/tools-ki/docs/roadmap/KI-TOOL-KI-CLI-174-typed-work-naming-readers.md), [KI-TOOL-KI-CLI-175](/Users/krisbrown/kis/knowledge-islands/tools-ki/docs/roadmap/KI-TOOL-KI-CLI-175-footer-markdown-writers.md) | done | finished, waiting to be pruned |
| [KI-OBSERVA-VIS-032](/Users/krisbrown/kis/knowledge-islands/apps-observatory.local/docs/roadmap/KI-OBSERVA-VIS-032-library-instrument.md), [KI-OBSERVA-VIS-034](/Users/krisbrown/kis/knowledge-islands/apps-observatory.local/docs/roadmap/KI-OBSERVA-VIS-034-streams-instrument.md), [KI-OBSERVA-VIS-045](/Users/krisbrown/kis/knowledge-islands/apps-observatory.local/docs/roadmap/KI-OBSERVA-VIS-045-workers-instrument.md) | draft, hold | held until the instrument restructure decision |
| [KI-TOOL-KI-CLI-172](/Users/krisbrown/kis/knowledge-islands/tools-ki/docs/roadmap/KI-TOOL-KI-CLI-172-group-vscode-workspaces-by-territory.md), [KI-TOOL-RIG-CORE-075](/Users/krisbrown/kis/knowledge-islands/tools-rig/docs/roadmap/KI-TOOL-RIG-CORE-075-restart-services-after-upgrade.md), [KI-TOOL-RIG-CORE-076](/Users/krisbrown/kis/knowledge-islands/tools-rig/docs/roadmap/KI-TOOL-RIG-CORE-076-host-defaults-and-power.md) | triage | captured, never adopted |
| [KI-TECHNE-OPS-018](/Users/krisbrown/kis/knowledge-islands/ki-techne-harness/docs/roadmap/KI-TECHNE-OPS-018-converge-tools-through-rig.md) | draft, now | its Project's package, Agent host, is on hold |
| [KI-TOOL-RIG-CORE-068](/Users/krisbrown/kis/knowledge-islands/tools-rig/docs/roadmap/KI-TOOL-RIG-CORE-068-replaced-pf-root-ruleset-bypass.md) | draft, now | its three plan decisions are parked in Mac Studio setup, and it needs an attended check |
| [KI-TOOL-RIG-CORE-069](/Users/krisbrown/kis/knowledge-islands/tools-rig/docs/roadmap/KI-TOOL-RIG-CORE-069-dynamic-type-handler-fallback.md) | draft, now | its disposition sits inside the parked RIG-TRIAGE query |
| [KI-TOOL-RIG-CORE-047](/Users/krisbrown/kis/knowledge-islands/tools-rig/docs/roadmap/KI-TOOL-RIG-CORE-047-tailnet-only-listener-firewall.md) | in progress, now | untouched since 24 October; no active package is working on it |
| [KI-DESIGN-ART-002](/Users/krisbrown/kis/knowledge-islands/ki-design/docs/roadmap/KI-DESIGN-ART-002-art-licensing.md) | draft, now | names no Project, and the Website package that would use it is on hold |
| [KI-PRINCIPAL-MOD-011](https://github.com/knowledgeislands/ki-principal/blob/d8ab8112/Streams/Roadmap/KI-PRINCIPAL-MOD-011-amend-work-model-assigned-package-cascade.md) | draft, now | names this Project, but no package's next steps or queries mention it |

That leaves three records that are plausibly upcoming or in review: [KI-OBSERVA-APP-044](/Users/krisbrown/kis/knowledge-islands/apps-observatory.local/docs/roadmap/KI-OBSERVA-APP-044-instrument-restructure-decision.md) (a decision the Observatory is waiting on), [KI-TOOL-MGIT-CLI-032](/Users/krisbrown/kis/knowledge-islands/tools-mgit/docs/roadmap/KI-TOOL-MGIT-CLI-032-chain-command.md) and [KI-TOOL-RIG-CORE-070](/Users/krisbrown/kis/knowledge-islands/tools-rig/docs/roadmap/KI-TOOL-RIG-CORE-070-handler-read-back-after-confirmation.md) (both awaiting Kris's review); MOD-011 would join them if this package takes it up.

## 5. Where the structure contradicts itself

1. **The concurrency rule contradicts WIP-LIMIT.** The coordination standard's [Concurrency](/Users/krisbrown/kis/knowledge-islands/ki-agentic-harness/skills/change-management/ki-coordination/references/standards-coordination.md) line and the coordinator output style both say "keep about three agents running at once", and the Project cap allows "three or four" active packages. Kris's WIP-LIMIT answer asks for one at a time where possible. Both cannot hold.
2. **Ideas have four sanctioned homes, not one.** The roadmap standard's [Ideas and graduation](/Users/krisbrown/kis/knowledge-islands/ki-agentic-harness/skills/change-management/ki-work-roadmap/references/standards-repository-roadmaps.md) section places an idea on a Project page, in an idea-stage Project, on a theme page, or in a repository's `_IDEAS.md`, and concepts go to [Emerging Concepts](https://github.com/knowledgeislands/ki-principal/blob/d8ab8112/Pillars/Philosophy/Emerging%20Concepts/Emerging%20Concepts.md). EMPTY-BOARD asks for one place.
3. **The idea ledgers break their own rule.** The same section says `_IDEAS.md` holds only an idea that no Project or theme owns, yet the [tools-ki](/Users/krisbrown/kis/knowledge-islands/tools-ki/docs/roadmap/_IDEAS.md) and [Observatory](/Users/krisbrown/kis/knowledge-islands/apps-observatory.local/docs/roadmap/_IDEAS.md) ledgers hold ideas whose Projects exist, so the Observatory's ideas sit in two places, its ledger and its [Project page](https://github.com/knowledgeislands/ki-principal/blob/d8ab8112/Streams/Projects/observatory.md). The `docs/ideas/` full-text folders the 27 October sweep created are not described by any standard.
4. **The roadmap is allowed to hold work that is not upcoming.** The horizon table admits `soon`, `future` and `hold`, so a record that is adopted but not coming up can stay on the roadmap indefinitely. EMPTY-BOARD says the roadmap holds the upcoming work only.
5. **Project lifecycle disagrees with package state.** Seven Projects are `active` in the registry while their packages are on hold: [Agent host](https://github.com/knowledgeislands/ki-principal/blob/d8ab8112/Streams/Projects/agent-host.md), [Baseline rollout](https://github.com/knowledgeislands/ki-principal/blob/d8ab8112/Streams/Projects/baseline-rollout.md), [Estate factorisation](https://github.com/knowledgeislands/ki-principal/blob/d8ab8112/Streams/Projects/estate-factorisation.md), [Paperclip capture and rebuild](https://github.com/knowledgeislands/ki-principal/blob/d8ab8112/Streams/Projects/paperclip-capture-and-rebuild.md), [Portable specifications](https://github.com/knowledgeislands/ki-principal/blob/d8ab8112/Streams/Projects/portable-specifications.md), [Timelines](https://github.com/knowledgeislands/ki-principal/blob/d8ab8112/Streams/Projects/timelines.md) and [Tools burndown](https://github.com/knowledgeislands/ki-principal/blob/d8ab8112/Streams/Projects/tools-burndown.md). Two more are `active` with no package at all: [Island model and Tending](https://github.com/knowledgeislands/ki-principal/blob/d8ab8112/Streams/Projects/island-model-and-tending.md) and [Secrets hygiene](https://github.com/knowledgeislands/ki-principal/blob/d8ab8112/Streams/Projects/secrets-hygiene.md).
6. **A finished package was never removed.** The work-package skill says a finished work's folder is deleted at the mark that closes it; [`ki.prj.knowledge-acquisition`](https://github.com/knowledgeislands/ki-principal/blob/d8ab8112/+/_WORK/ki.prj.knowledge-acquisition/state.md) finished on 20 October and is still here.
7. **Registry pages name record identifiers.** The registry's rule is that links point upwards, so a Project or theme page never names a record; 13 of the 28 Project and theme pages do, among them [Agent host](https://github.com/knowledgeislands/ki-principal/blob/d8ab8112/Streams/Projects/agent-host.md), [Observatory](https://github.com/knowledgeislands/ki-principal/blob/d8ab8112/Streams/Projects/observatory.md) and [Techne](https://github.com/knowledgeislands/ki-principal/blob/d8ab8112/Streams/Themes/techne.md).
8. **Many records cannot say which package owns them.** Only some records carry a `project` field: none of the six in tools-rig, nor those in tools-mgit, ki-design, the harness, or three of four in tools-ki. With no project, there is no way to tell which package should be working on a record, so the roadmap and the packages cannot be checked against each other.
9. **Parked queries point at records that no longer exist.** Mac Studio setup's [RIG-TRIAGE](https://github.com/knowledgeislands/ki-principal/blob/d8ab8112/+/_WORK/ki.prj.mac-studio-setup/discussions.md#parked) asks about KI-TOOL-RIG-CORE-053, 056, 057, 067 and KI-TOOL-RIG-DIST-011, none of which is on the roadmap now, and KI-TOOL-RIG-CORE-064, now an idea. Agent host's CLI006-PLAN and State of play's CLI006-CONFIRM and CLI006-READY concern KI-TOOL-TECHNE-CLI-006, which has been pruned.
10. **Held packages keep receiving work they cannot do.** The routing rule says a routed line cannot be rejected, and held packages keep their queues, so [`ki.prj.tools-burndown`](https://github.com/knowledgeislands/ki-principal/blob/d8ab8112/+/_WORK/ki.prj.tools-burndown/messages.md), on hold since 20 October, has 40 queued lines, including the ORCA-ENV-LEAK security fix that HOLD-SCOPE parked overnight. Nothing says where routed work goes while its owner is on hold.
11. **A Knowledge Islands package decides other territories' records.** [Baseline rollout](https://github.com/knowledgeislands/ki-principal/blob/d8ab8112/+/_WORK/ki.prj.baseline-rollout/discussions.md#parked)'s 15 parked queries settle area titles, themes and sizes in Humans Not Robots, Techmedix, Valle Armonia, Legal, Personal and Equal Remedy records, while [AGENTS.md](https://github.com/knowledgeislands/ki-principal/blob/d8ab8112/AGENTS.md) says territory standing confers no cross-repository write authority.
12. **Parked queries are duplicated and outside the model.** The [Work Process](https://github.com/knowledgeislands/ki-principal/blob/d8ab8112/Pillars/Philosophy/Model/Processes/Work%20Process/Work%20Process.md) has no "parked" state for a decision, yet 120 sit in Parked sections with no age limit, and in this package eight (HOMES, EXECUTION, HOST, DISPLAY, THEME, ROUTING, SIGNAL and RESTART) appear twice, once as a summary line and once in full.

## 6. What adopting this would take

Nothing here is applied. If Kris accepts the queries below, the work would run one unit at a time, in this order:

1. **Quick fixes in Principal** (this package, small): bring the nine Project lifecycles into line with their packages, remove the finished Knowledge acquisition folder, and remove the duplicated parked entries here. Each is easily undone.
2. **Standards** (KI Agentic Harness, as a message line to its work, medium): the ideas home and the horizon rule in `ki-work-roadmap`; the limits and the concurrency line in `ki-coordination` and the coordinator output style; parked-query ageing and hold close-out in `ki-work-package`.
3. **The ideas move** (Principal and each repository, medium): move ideas to the agreed home by quotation, leaving a "moved to" line at each source, one repository at a time.
4. **Tooling** (tools-ki, through its owning work, small): `ki work status` counts the three columns and warns over the limits.
5. **Clearing the board** (each package, ongoing): parked queries to ideas at each package's next mark; held packages released or closed out under the 14-day rule.

## Queries

None of these has had a blind review yet; each confidence below is this run's own judgement and should go through the masked review before it is taken.

### IDEAS-HOME - Where should ideas live?

**Context:** Ideas live today in four sanctioned places (Project pages, theme pages, idea-stage Projects and repository `_IDEAS.md` ledgers) plus Emerging Concepts, parked queries and held packages. You asked for them to be consolidated in a single place. One territory list is easiest to review and to keep empty, but it moves ideas away from the Project pages that give them context, and it needs the roadmap standard changing.

**Query:** Where should every idea in the Knowledge Islands territory live?

**Options:**

a) (recommended, confidence medium - it gives you one place to review and age ideas, but it reverses the 17 October rule that ideas start on their Project page) One territory ideas list in Knowledge Islands Principal, each idea one line naming its Project or theme and linking to fuller text where it exists; Project and theme pages keep their context but no longer hold ideas.

b) Leave ideas where they are and generate the consolidated list from them on demand, like [ideas](empty-board-ideas.md), so there is one place to look but several places to write.

c) One ideas list per repository, with Project pages pointing to them.

### WIP-PACKAGE - How many units may a package have in flight?

**Context:** Overnight this package ran up to three units at once, as the current "keep about three agents running" rule allows. You asked for one at a time where possible, finished quickly. A unit's independent review is a separate run, but it works on the same change.

**Query:** How many units may one work package have in flight at a time?

**Options:**

a) (recommended, confidence high - it is your WIP-LIMIT answer written down, and allowing the review keeps reviews independent without a second piece of work) One unit at a time, plus at most one independent review of that same unit.

b) One unit at a time with nothing alongside it, reviews included.

c) Up to two units at a time where they touch different repositories.

### WIP-TERRITORY - How many packages may be active across the territory?

**Context:** The current cap is "three or four" Project packages, not counting State of play; today five packages are neither on hold nor finished, one being worked and four waiting on you. A package waiting on you would count as active under this proposal, so that answering frees a slot.

**Query:** How many work packages may be active at once across the Knowledge Islands territory?

**Options:**

a) (recommended, confidence medium - it tightens the existing cap to its lower bound without stopping you working on more than one thing a day, though "minimal parallelisation" could mean one) At most three Project or regular packages, plus State of play, with packages waiting on you counting as active.

b) One package at a time, plus State of play: strictly serial.

c) Keep "three or four", with packages waiting on you not counted.

### ROADMAP-UPCOMING - Should the roadmap hold only upcoming work?

**Context:** Records can sit on the roadmap with horizon `soon`, `future` or `hold`, and done records stay until pruned. Today 19 of 22 records are finished, held, in triage or tied to work that is not moving. Making the roadmap hold only `now` and `next` would turn the other horizons into ideas, which needs the roadmap standard and its checker changing in the harness and tools-ki.

**Query:** Should a roadmap hold only records that are coming up next, with everything else moved back to ideas?

**Options:**

a) (recommended, confidence medium - it is what EMPTY-BOARD asks for, but it changes a standard and a checker that other territories also use) Yes: only `now` and `next` stay, capped at three per repository and ten across the territory; `soon` and `future` records go back to ideas, and held records go back to ideas unless their release is in sight within a fortnight.

b) Keep the horizons as they are, but count only `now` and `next` as upcoming, and cap those.

### GATES - Are the two gates right?

**Context:** Section 3 proposes Gate 1 (idea to upcoming: you say yes, it has a home, the next step is known, it is small, and there is room) and Gate 2 (upcoming to active: it is Ready, nothing it needs is missing, and the package and the territory have a free slot). Most of these already exist in `ki-next` and `ki-plan`; the new parts are the size rule and the room checks.

**Query:** Should the two gates in section 3 be adopted as written?

**Options:**

a) (recommended, confidence medium - most of each gate restates existing rules, and the new size and room checks are easily relaxed later) Adopt both gates as written.

b) Adopt them without the size rule, so larger work can be adopted and split later.

### PARKED-TO-IDEAS - What happens to parked queries?

**Context:** 120 parked queries sit in nine packages with no age limit; several point at records that no longer exist, and eight here are duplicated. A parked query is a decision nobody is currently making, which is what an idea is. Moving one keeps its recommendation, so nothing is lost.

**Query:** Should parked queries move to the ideas list?

**Options:**

a) (recommended, confidence medium - it empties the Parked sections and stops stale decisions piling up, but some parked queries are close to answerable and might be better brought back) Yes: at each package's next mark, each parked query moves to the ideas list with its recommendation, and the Parked section goes.

b) Keep Parked sections, but offer any parked query older than 30 days for dropping at your next review.

### HOLD-CLOSE - What happens to packages on hold?

**Context:** Nine packages are on hold, six of them since 18 to 20 October. While held they still receive messages they cannot act on, such as the ORCA-ENV-LEAK security fix waiting in tools-burndown. Closing a held package would home its decisions, move its messages and parked queries to the ideas list and remove its folder, leaving the Project `paused`; reopening means creating a fresh package.

**Query:** Should a package on hold for more than 14 days be closed out?

**Options:**

a) (recommended, confidence low - it clears the board fastest, but closing a package is hard to undo cleanly and several held packages, such as tools-burndown, hold live handoffs) Yes, after you have seen what each would close, one package at a time.

b) No: keep held packages, but route new messages for a held package to State of play instead, so nothing waits behind a hold.

c) Keep held packages as they are.

### QUICK-FIXES - Fix the easily undone contradictions now?

**Context:** Three contradictions can be fixed in Knowledge Islands Principal alone, each easily undone: nine Project pages whose `lifecycle` disagrees with their package (seven `active` but on hold, two `active` with no package); the finished Knowledge acquisition folder, which the standard says should already be gone and whose history Git keeps; and the eight duplicated parked entries in this package.

**Query:** Should one small run make these three fixes now, as a bounded change you approve?

**Options:**

a) (recommended, confidence medium - each fix is small, within this island and recoverable from Git, though the lifecycle wording for held Projects needs a choice between `paused` and keeping `active`) Yes: set the seven held Projects to `paused` and the two packageless ones to `planned`, remove the Knowledge acquisition folder, and remove the duplicate entries.

b) Fold them into the wider rollout instead, after the standards change.

### DONE-PRUNE - Prune the seven finished records?

**Context:** Seven records are done and accepted but still on their roadmaps: [KI-OBSERVA-BRG-004](/Users/krisbrown/kis/knowledge-islands/apps-observatory.local/docs/roadmap/KI-OBSERVA-BRG-004-turn-feedback-sending-on.md), [KI-HARNESS-GOV-232](/Users/krisbrown/kis/knowledge-islands/ki-agentic-harness/docs/roadmap/KI-HARNESS-GOV-232-any-package-coordination.md), [KI-HARNESS-GOV-233](/Users/krisbrown/kis/knowledge-islands/ki-agentic-harness/docs/roadmap/KI-HARNESS-GOV-233-typed-work-naming-readers.md), [KI-HARNESS-GOV-234](/Users/krisbrown/kis/knowledge-islands/ki-agentic-harness/docs/roadmap/KI-HARNESS-GOV-234-footer-markdown-writers.md), [KI-TOOL-KI-CLI-173](/Users/krisbrown/kis/knowledge-islands/tools-ki/docs/roadmap/KI-TOOL-KI-CLI-173-regular-coordination-readers.md), [KI-TOOL-KI-CLI-174](/Users/krisbrown/kis/knowledge-islands/tools-ki/docs/roadmap/KI-TOOL-KI-CLI-174-typed-work-naming-readers.md) and [KI-TOOL-KI-CLI-175](/Users/krisbrown/kis/knowledge-islands/tools-ki/docs/roadmap/KI-TOOL-KI-CLI-175-footer-markdown-writers.md). Pruning is yours to approve; it removes the file from the roadmap and Git keeps it.

**Query:** Should the seven done records be pruned now?

**Options:**

a) (recommended, confidence medium - they are closed and pruning is recoverable from Git, but this run has not rechecked each one's closure evidence) Yes, through `ki-accept`'s prune, each repository in turn, after a check that each closure is complete.

b) Leave them until each owning work's next mark.
