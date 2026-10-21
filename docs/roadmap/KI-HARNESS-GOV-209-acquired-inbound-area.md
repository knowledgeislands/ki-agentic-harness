---
id: KI-HARNESS-GOV-209
area: GOV
title: "+/_ACQUIRED/ inbound area"
kind: deliver
purpose: governance
size: m
component: repo-structure
horizon: next
status: ready
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-10-18T00:40:08Z
updated_at: 2026-10-21T13:15:45Z
---

# KI-HARNESS-GOV-209: +/_ACQUIRED/ Inbound Area

## Goal

Each territory principal carries a `+/_ACQUIRED/` folder, with a scaffold README, where the acquire port pushes whole packets, and `ki-repo-kb` tells the receiving principal how to triage a packet: file it, turn it into work, or park it. The port alone writes packets there; the receiver never writes into the port.

## Context

Kris decided on 18 October 2026, 01:40 BST, in the `knowledge-acquisition` thread, taking option a) on DISPATCH-PUSH and RETURN-ROUTE ("You have bypassed my finishes, you don't need to ask me"): the port may write, commit and push its own packet commits in `+/_ACQUIRED/` of each territory principal and nowhere else; an island hands back a packet that is not about it by marking it `returned <reason>` in its own `+/_ACQUIRED/`, and the port's next run reads the mark, takes the packet back as a new acquisition with source `return`, removes the packet folder it wrote after reading it back, and adds the reason to that territory's routing card. The options and reasoning are in the [dispatch options report (deleted)](https://github.com/knowledgeislands/ki-principal/blob/ae15e273a39a1cecb7ab7859230339c1359974d1/+/_THREADS/knowledge-acquisition/dispatch-options.report.md) and the [decisions log (finished work)](https://github.com/knowledgeislands/ki-principal/blob/e5ae1ad3/+/_WORK/ki.knowledge-acquisition/decisions.md).

Today `ki-repo-kb` describes `+/` as an inbox and names the folders specialist skills own (`_TRADES`, `_BATCHES`, `_CHECKPOINTS`), but has no inbound area for packets pushed by the acquire port and no receiver guidance for them.

## Boundary

- In: a scaffold `README.md` for `+/_ACQUIRED/` in each territory principal, saying who writes there (the port alone), what a packet is, and the three receiver dispositions; and receiver triage guidance in `ki-repo-kb`: file, turn into work, or park, with the rule that the receiver never writes into the port.
- Out: the port's dispatch, return-reading, removal and routing cards, which belong to the acquire repository's dispatch record ([KB-ACQUIRE-007 (pruned)](https://github.com/krisb/acquire/blob/7f43c67f899df0554de647920ec42609e32001b5/docs/roadmap/KB-ACQUIRE-007-dispatch-packet-push-and-return.md), "Dispatch packet, push and return"); the Observatory view and the `ki-trades` envelope; amending Personal's Decision 7, which belongs to Personal's acquire-dispatch thread; the Acquisition Process note's Enactment record.

## Current state

Ready under Kris's 21 October 2026 GOV209-OWNER a) decision and the 14:11 BST unattended grant, delivered by the designated harness writer wow-day-gov-209. The unchanged baseline passes the offline work-selector, roadmap, skill, harness, test and type gates; the roadmap's existing migration warnings are covered by the pre-existing-warnings decision. The principal overlay currently has no acquired scaffold or automatic conform writes.

The 20 October decision supersedes the historical return route: delivery is acceptance and a misdelivery is handled case by case. Acquire's dispatch guide supplies the delivery layout: one folder per delivery, containing a whole capture package or several whole packages, with original names and bytes and no extra manifest, dispatch ID or ledger. The scaffold is not a dispatch precondition because Acquire can create the directory.

## Steps

- [ ] Add the exact `+/_ACQUIRED/README.md` template owned by `ki-repo-kb-principal` and document its lifetime while the overlay is declared.
- [ ] Add a principal audit criterion and native conform proposal to create or restore that README, refusing unsafe paths and preserving every delivery packet.
- [ ] Add receiver triage guidance to `ki-repo-kb`: file the packet, turn it into work through the selected adapter, or park it locally; write nothing into the port and add no return marker.
- [ ] Test missing, canonical and drifted scaffolds, unsafe ancestors and leaves, read-only audit, draft-only conform and packet preservation; regenerate the rubric and capability catalogue.
- [ ] Run offline harness tests, TypeScript and focused work, roadmap, skills, authoring and harness audits; retain baseline warnings separately and prepare the independent-review packet without acceptance.

## Files touched

- This existing roadmap record.
- `skills/repo-structure/ki-repo-kb-principal/SKILL.md`, `references/standards-principal.md` and generated `references/rubric.md`.
- `skills/repo-structure/ki-repo-kb-principal/assets/templates/acquired/README.md`.
- The principal overlay's `scripts/rubric/contexts/principal.ts`, `scripts/rubric/items/principal.ts` and `scripts/rubric/items/index.test.ts`.
- `skills/repo-structure/ki-repo-kb/SKILL.md` and a focused receiver-triage reference.
- Generated `skills/README.md` only if its declared ownership projection changes.

## Verify

Run the harness's `bun run test`, then `bunx tsc --noEmit`, then sequential focused `ki repo audit --skill <skill>` checks for `ki-work`, `ki-work-roadmap`, `ki-skills`, `ki-authoring` and `ki-repo-harness`. Run the source catalogue's fixture tests for principal AUDIT and CONFORM behaviour, verify the generated principal rubric and use an isolated declared-principal fixture for hosted audit and dry-run conform. All commands run without network in a fresh copy of the prepared audit home, including its Capital registrations and worktree repair. Commit hooks stay enabled. An unchanged baseline warning passes under Kris's explicit decision; a new failure does not.

## Dependencies / blocks

The scaffold owner decision is settled: `ki-repo-kb-principal` requires the exact README while declared and restores it through CONFORM; `ki-repo-kb` owns receiver triage. Kris's direct instruction authorises planning to Ready and delivery within this boundary. No open delivery dependency remains. The eight principal repositories' eventual conform runs are receiver-owned work, outside this delivery; this run only lists them in its report.

## Documentation impact

### Decision Records

No new Decision Record: the owner decisions are recorded in the Ways of working decisions log. The settled scaffold ownership and the superseding delivery-is-acceptance decision are preserved in this record and the skill standards.

### Specifications

None.

### Guides

None.

### Roadmap

None beyond this record.

## Discussion

### Scaffold ownership and authority

Kris took GOV209-OWNER a) on 21 October 2026: `ki-repo-kb-principal` owns, requires and conforms the exact `+/_ACQUIRED/README.md` while its overlay is declared; `ki-repo-kb` carries the receiver dispositions. This plan applies that decision rather than making every base carry the scaffold. The port alone delivers packets; the receiver may triage its own copies under local governance. The scaffold does not grant dispatch, push, canonical adoption or cross-repository authority. Independent review is required before acceptance.

Captured from the `knowledge-acquisition` thread's inbound-record run. The receiver writes nothing back to the port, which keeps the port the single writer across repositories.
