---
id: KI-HARNESS-GOV-209
area: GOV
title: "+/_ACQUIRED/ inbound area"
kind: deliver
purpose: governance
size: m
component: repo-structure
status: done
blocks: []
blocked_by: []
baseline_ref: f59c00698d4535b617746a67e6d71c2ae98c1f4c
created_at: 2026-10-18T00:40:08Z
updated_at: 2026-10-21T13:31:33Z
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

Accepted after independent review by wow-day-gov-209-accept under Kris's 21 October 2026 GOV209-OWNER a) decision and the 14:11 BST extension of their 01:55 BST grant. The unchanged baseline passes the offline work-selector, roadmap, skill, harness, test and type gates; the roadmap's existing migration warnings are covered by the pre-existing-warnings decision. At the immutable starting baseline, the principal overlay had no acquired scaffold or automatic conform writes. This delivery adds both without conforming a real principal.

The 20 October decision supersedes the historical return route: delivery is acceptance and a misdelivery is handled case by case. Acquire's dispatch guide supplies the delivery layout: one folder per delivery, containing a whole capture package or several whole packages, with original names and bytes and no extra manifest, dispatch ID or ledger. The scaffold is not a dispatch precondition because Acquire can create the directory.

## Steps

- [x] Add the exact `+/_ACQUIRED/README.md` template owned by `ki-repo-kb-principal` and document its lifetime while the overlay is declared.
- [x] Add a principal audit criterion and native conform proposal to create or restore that README, refusing unsafe paths and preserving every delivery packet.
- [x] Add receiver triage guidance to `ki-repo-kb`: file the packet, turn it into work through the selected adapter, or park it locally; write nothing into the port and add no return marker.
- [x] Test missing, canonical and drifted scaffolds, unsafe ancestors and leaves, read-only audit, draft-only conform and packet preservation; regenerate the rubric and capability catalogue.
- [x] Run offline harness tests, TypeScript and focused work, roadmap, skills, authoring and harness audits; retain baseline warnings separately and prepare the independent-review packet without acceptance.

## Files touched

- This existing roadmap record.
- `skills/repo-structure/ki-repo-kb-principal/SKILL.md`, `references/standards-principal.md` and generated `references/rubric.md`.
- `skills/repo-structure/ki-repo-kb-principal/assets/templates/acquired/README.md`.
- The principal overlay's `scripts/rubric/contexts/principal.ts`, `scripts/rubric/items/principal.ts` and `scripts/rubric/items/index.test.ts`.
- `skills/repo-structure/ki-repo-kb/SKILL.md` and a focused receiver-triage reference.
- Generated `skills/README.md`, whose principal description changes with the published capability.
- `skills/keystone/ki-skills/scripts/internal/remediation-inventory.test.ts`: increment the exact inventory counts for the one additional automatic mechanical criterion.

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

## Review

### Delivered

The approved scaffold and receiver-triage boundary is delivered from immutable baseline `f59c00698d4535b617746a67e6d71c2ae98c1f4c`. The principal overlay owns the exact `+/_ACQUIRED/README.md` while declared and its native CONFORM requests only the scaffold. Real principal conformance, Acquire dispatch and acceptance remain outside this delivery. The committed plan precedes implementation.

### Change Summary

Added the scaffold template and PRINCIPAL-5 audit/conform support, with unsafe-component refusal and draft-only write proposals. Updated the principal standard and its generated rubric; added receiver-triage guidance routed from `ki-repo-kb`; regenerated the published capability description. The existing inventory test's exact totals increase by one criterion, one mechanical item and one automatic remediation; this is the only supporting file beyond the planned skill files. No packet format, dispatch authority, return route or roadmap record was introduced.

### Verification

- `bun run test`: 1,414 pass, zero fail; the unchanged baseline had 1,405 pass. The new fixtures cover missing, canonical, empty, changed, CRLF and extra-byte scaffolds, symlink and dangling-link ancestors and leaves, wrong file types, read-only audit, coalesced draft-only conform and original packet bytes.
- `bunx --no-install tsc --noEmit`: pass.
- Sequential focused `ki repo audit --skill ki-work`, `ki-work-roadmap`, `ki-skills`, `ki-authoring` and `ki-repo-harness`: pass, with unchanged baseline warnings retained separately under Kris's pre-existing-warnings decision.
- Full `ki repo audit`: zero failures, 72 existing warnings across six warning-bearing skills, matching the pre-implementation full audit. Working-tree leftover counts reflect this run's source files until committed.
- `ki dev skill rubric ki-repo-kb-principal --write` generated the readable rubric; the skill audit verifies exact publication. Harness CONFORM regenerated only `skills/README.md` in this repository.
- Hosted principal fixture: the missing scaffold fails its scoped audit; dry-run CONFORM proposes the exact scaffold without writing it; the canonical scaffold passes the hosted scoped audit and the binary original remains unchanged. No real principal was conformed.
- Every gate ran under the network-denying sandbox in this run's fresh audit-home copy, with both Capital registrations, local harness activation and worktree repair. Commit hooks remain enabled.

### Outstanding concerns

No unresolved delivery defect. Independent review and acceptance are still required. The eight receiver-owned conformance applications are outside this record's boundary and listed in the run report; this run sends nothing to those repositories. Existing fleet warnings are unchanged contract findings, not newly introduced failures.

### Post-change review

The change satisfies the decided ownership boundary: only declared principal overlays require the literal scaffold, and the base skill owns triage. The repair path refuses unsafe filesystem components and leaves packets alone; host publication retains race protection. The scaffold grants no new delivery or adoption authority. Review should inspect the exact delivery commit and verify the ownership and preservation fixtures before any acceptance.

### Mini recap

Delivered one governed scaffold, its audit and bounded repair, and receiver triage, with passing source and hosted checks. No work was accepted or pruned. The reusable guidance is already in its owning skill standards; no further learning promotion or new roadmap record is proposed.

## Done

Accepted 21 October 2026 by wow-day-gov-209-accept under Kris's explicit grant on the review packet above.

## Discussion

### Independent acceptance

Reviewed the complete plan and delivery range `d60b7b9381f83dfc20c01e6636d1ce274c899988..dc8ecc44d3b1d59ea8f831cac6281ab64e8dfc3d` against the Ready plan and GOV209-OWNER a), independently of its author. No delivery defect was found. Independent offline checks passed: 1,414 tests, TypeScript, the five focused audits named in Verify, generated principal rubric synchronisation, and hosted missing/canonical scaffold and dry-run preservation checks in a disposable principal. The template is a formatter fixed point. Full candidate audit: zero failures and 72 pre-existing warnings (LIFECYCLE-1, DIAG-4, CLEAN-7, MATURITY-1, COORD-8 and ITEM-2); comparison with the immutable Ready baseline introduced no warning groups. The historical comparison's COORD-15 failure and extra CLEAN-2 warning were consequences of temporarily checking out the old baseline behind current main; restoring the candidate resolved that setup state.

Kris's 21 October 2026 01:55 BST grant says, "get as many things through to approved and even done if you want, and get them pushed"; their 14:11 BST instruction extends that grant to the answered work for the afternoon. The [Ways of working decisions log](/Users/krisbrown/workspaces/knowledge-islands/ki-principal/+/_WORK/ki.ways-of-working/decisions.md) records both grants and GOV209-OWNER a). The explicit acceptance brief applies that authority to this record only and overrides the standing prohibition on accepting work records. The reviewed implementation is unchanged; the terminal record is retained, and receiver conformance remains receiver-owned.

### Scaffold ownership and authority

Kris took GOV209-OWNER a) on 21 October 2026: `ki-repo-kb-principal` owns, requires and conforms the exact `+/_ACQUIRED/README.md` while its overlay is declared; `ki-repo-kb` carries the receiver dispositions. This plan applies that decision rather than making every base carry the scaffold. The port alone delivers packets; the receiver may triage its own copies under local governance. The scaffold does not grant dispatch, push, canonical adoption or cross-repository authority. Independent review is required before acceptance.

Captured from the `knowledge-acquisition` thread's inbound-record run. The receiver writes nothing back to the port, which keeps the port the single writer across repositories.
