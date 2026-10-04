---
id: KI-HARNESS-GOV-113
area: GOV
title: Govern workspace retirement
theme: governance-consistency
horizon: now
status: done
blocks: []
blocked_by: []
baseline_ref: 5514e48fa6557d150441a9ca83ff036bcdd3aca9
task_links:
  paperclip:
    - authority: http://127.0.0.1:3100
      scope: 558dd49e-7615-409f-b7b2-7f19e22171d9
      id: a3bb5b60-6f24-41d2-9be7-35346c1d04cb
      key: KIS-39
      url: http://127.0.0.1:3100/KIS/issues/KIS-39
      relation: implementation
created_at: 2026-09-26T22:55:00Z
updated_at: 2026-10-04T11:38:32Z
---

# KI-HARNESS-GOV-113: Govern workspace retirement

## Goal

An isolated workspace ends one way and one way only, and a reader of the coordination standard can tell whether a workspace still sitting on disk is correct or a defect. Where the retirement mechanism declines to destroy a workspace, the unlanded work inside it becomes a decision someone is asked to make and record, rather than residue that accumulates until a person tidies it by hand.

## Context

The coordination standard's workspace model says how an isolated checkout is created and says nothing about how one ends. Agents therefore guessed, and guessing has already cost: hand-removal of six worktrees from this repository's checkout left six `active` workspace records pointing at directories that no longer existed, which coordination task `KIS-32` created and `KIS-38` is still reconciling. Nothing in doctrine forbade the removal, because nothing in doctrine described the alternative.

The alternative exists and is precise. It was read out of the `@paperclipai/server` **2026.916.1** build installed at `/Users/krisbrown/.paperclip/cli/installs/npm/2026.916.1`, which the running coordination-plane server executes, rather than out of published documentation, which does not state it:

- A sweep runs on the heartbeat scheduler's cadence (`dist/services/execution-workspaces.js:1905`, `sweepTerminalWorkspaces`). When a workspace passes every gate it archives the workspace record with a cleanup reason and removes the artefacts it created (`dist/services/workspace-runtime.js:3067`): worktree removal, then branch deletion, then directory removal, under a per-repository cleanup lock, re-checking the recorded `HEAD` commit immediately before deleting.
- It destroys only what it created. A branch the coordination plane did not create is deliberately left behind (`dist/services/workspace-runtime.js:2513`, `branchCreatedByRuntime`).
- A lifecycle-generation fence means a workspace rebuilt by a resume is never destroyed by a sweep that already decided to archive it (`dist/services/execution-workspaces.js:2081`).
- Five gates must all pass: the source task and every task in its subtree terminal (`:1987`, re-checked under the lifecycle lock by a recursive-tree predicate); a clean tree where untracked entries count as dirty (`:2001`, derived at `:1055` from tracked-dirty or untracked); a branch merged into its base, where both `unmerged` and `unknown` stop it (`:2005`); no queued or running run on the workspace or the source task (`:2072`, re-checked by a live-run predicate); and an elapsed cooldown anchored on the most recent terminal transition anywhere in the task tree (`:2010`–`:2021`).
- A sixth precondition sits before the gates: a workspace whose Git status cannot be verified is skipped (`:1981`). That is the mechanism refusing to act on an unreadable tree rather than a governance rule, so the standard states five.
- The cooldown default is seven days, and a configured `0` disables the cooldown rather than the sweep — `cooldownCutoff` becomes null and the gate can never hold (`dist/config.js:180`–`:186`, gate at `dist/services/execution-workspaces.js:2016`).
- A person may retire one workspace early from the workspace view. That path runs the same cleanup but uses close-readiness instead of the five gates: it refuses only when Git status cannot be verified or open tasks are still linked, and reports dirty, untracked, ahead and behind as warnings a human may accept (`dist/services/execution-workspaces.js:1744`–`:1805`).
- The delivery state shown in a workspace list is not a stale assessment, it is no assessment: `toExecutionWorkspace(row, runtimeServices, deliveryState = 'unknown')` takes `'unknown'` as a default parameter (`:758`), and only the single-workspace path passes a real reading (`:1086`).

`KI-HARNESS-GOV-103` already records this standard as the single citable home for the workspace-isolation rule, so retirement belongs in the same file rather than in a fifth place. The declaration gap that used to make the `COORD` family unexercised is closed: `.ki.toml` declares `[skills.ki-agent-coordination-paperclip]`, so a criterion added here is audited rather than published and ignored.

## Boundary

In scope: the retirement half of the workspace model in `standards-agent-coordination-paperclip.md`; one judgment criterion for it; the source pin for the build the gates were read from; and this instance's cooldown decision recorded where an auditor can find it.

Out of scope: archiving the six orphaned workspace records, which is coordination task `KIS-38`; landing or discarding the four commits that exist only in worktrees, which is `KIS-37`; the creation half of the workspace convention, whose governing item does not exist yet; the roadmap number-reservation and write-locus rules, which are `KI-HARNESS-GOV-104`; making the `COORD` family mechanically checkable rather than judgment-graded, which is `KI-HARNESS-GOV-107`; and configuring the coordination plane to the decided cooldown, which is not a change to this repository at all.

## Current state

`## Workspace model` covers creation and isolation and stops there. No sentence in the repository says who may remove a worktree, what a workspace still on disk means, or what happens to work the mechanism refuses to destroy. `COORD-4` assesses isolation; no criterion assesses retirement.

The mechanism's five gates, its created-artefacts-only rule, and its cooldown are recorded nowhere in this repository. They survive only as a reading of an installed build, which no future reader can reproduce without being told which build was read.

This instance's cooldown is **0 days**, decided by the responsible human on coordination task `KIS-39` on 2026-09-26. The running instance does not yet match that decision: `PAPERCLIP_WORKSPACE_REAPER_COOLDOWN_DAYS` is unset in the coordination-plane instance directory, so the built-in default of seven days is in force. Closing that gap is a coordination-plane configuration change owned outside this repository, and this record states the decision rather than claiming the configuration. The configuration change is coordination task `KIS-80`, which carries the evidence that the variable is set in neither the instance's `.env` nor its `config.json`.

Six of the nine live worktrees in this repository are held correctly by the first gate, because their source tasks are not terminal. They are not a leak, and nothing in the repository currently says so.

## Steps

- [x] Reserve `GOV-113` by committing the `_ISSUES.md` advance on its own, before this record exists.
- [x] Add a `## Workspace retirement` section to `standards-agent-coordination-paperclip.md` stating the single mechanism, the five gates, the refused-case disposition, and where retirement readiness is actually read.
- [x] Add `COORD-9` for workspace retirement in `scripts/rubric/items/coordination.ts`, extend the criterion-code assertion in `scripts/rubric/items/index.test.ts`, and regenerate `references/rubric.md`.
- [x] Pin the server build the gates were read from in `references/sources.md`, so a version bump cannot silently rewrite the doctrine.
- [x] Record the cooldown decision and the configuration gap it leaves in this record's Current state.

## Files touched

- `docs/roadmap/_ISSUES.md`
- `docs/roadmap/KI-HARNESS-GOV-113-govern-workspace-retirement.md`
- `skills/agentic-systems/ki-agent-coordination-paperclip/references/standards-agent-coordination-paperclip.md`
- `skills/agentic-systems/ki-agent-coordination-paperclip/references/sources.md`
- `skills/agentic-systems/ki-agent-coordination-paperclip/scripts/rubric/items/coordination.ts`
- `skills/agentic-systems/ki-agent-coordination-paperclip/scripts/rubric/items/index.test.ts`
- `skills/agentic-systems/ki-agent-coordination-paperclip/references/rubric.md` (generated)
- `skills/keystone/ki-skills/scripts/internal/remediation-inventory.test.ts`

## Verify

```bash
ki dev skill rubric ki-agent-coordination-paperclip
ki repo audit --skill ki-agent-coordination-paperclip
ki repo audit --skill ki-work-roadmap
ki repo audit --skill ki-skills
bun run test
bunx tsc --noEmit
```

The rubric command reports the generated file current and `COORD-9` appears in `references/rubric.md`. Each audit reports no FAIL. The section anchor `#workspace-retirement` resolves from the criterion's declared source.

## Dependencies / blocks

No build-order dependency, so `blocked_by` stays empty.

Four neighbours touch adjacent ground and are reconciled by division rather than sequencing. `KI-HARNESS-GOV-104` edits the same file and claims `COORD-8` on coordination task `KIS-36`'s unmerged branch, so this item takes `COORD-9` and leaves the gap. The creation half of the workspace convention rewrites the existing `## Workspace model` paragraphs and does not touch the sibling section added here. `KI-HARNESS-GOV-107` owns making these criteria mechanical and inherits `COORD-9` as one more judgment criterion to answer for. `KI-HARNESS-GOV-115` is the fourth, and it landed on `main` at `4c854d2c` after this branch was cut: it adds a sibling base-revision claim to the same standard and takes `COORD-10`, having read this branch's reservations rather than colliding with them.

## Documentation impact

### Decision Records

None required. This records an observed mechanism and states a disposition rule for the cases it refuses; it does not choose between architectures. The seven KI–Paperclip boundary rules do warrant a Decision Record, and that remains separate work rather than a precondition here.

### Specifications

`standards-agent-coordination-paperclip.md` is a behaviour-level contract and gains a section. The change is a strengthening in one respect: removing a worktree by hand was previously unaddressed and is now forbidden. It relaxes nothing.

### Guides

No human-guidance change. The website skills-by-outcome guide selects skills by task and does not restate standard content.

### Roadmap

One follow-on. Nothing surfaces a workspace the mechanism is holding by a gate that can never pass; it is visible only to whoever walks close-readiness per workspace. Captured as `KI-HARNESS-GOV-114` after this record's number was secured, so the two could not race for one ledger advance.

## Review

### Delivered

The approved boundary: the retirement half of the workspace model, one judgment criterion for it, the build pin that makes the reading reproducible, and this instance's cooldown decision. Every exclusion held — the six orphaned workspace records, the four worktree-only commits, the creation half of the convention, `KI-HARNESS-GOV-104`'s write-locus rules, `KI-HARNESS-GOV-107`'s mechanisation, and the coordination-plane configuration change are all untouched.

Immutable baseline `5514e48fa6557d150441a9ca83ff036bcdd3aca9`. The retained KIS-39 branch was refreshed and independently reviewed, then fast-forward integrated into the designated primary checkout's local `main` at `623e0e72c306677b7449adeef11192f03051e9d3`. The original branch commits, including `0cc140ee` and `b7710d0f`, remain reachable. Nothing was pushed or accepted as KI work.

### Change Summary

- `standards-agent-coordination-paperclip.md` gains `## Workspace retirement` as a sibling of `## Workspace model`: one mechanism, five gates, the refused-case Triage disposition with its trigger and owner, and close-readiness as the only place retirement readiness may be read.
- `scripts/rubric/items/coordination.ts` gains `COORD-9`; `scripts/rubric/items/index.test.ts` asserts the new code list; `references/rubric.md` carries the matching published entry.
- `references/sources.md` pins `@paperclipai/server` 2026.916.1 as the source of the gates and records a partial review dated 2026-09-26.
- `skills/keystone/ki-skills/scripts/internal/remediation-inventory.test.ts` updates the combined catalogue expectation from 722 criteria and 273 judgment criteria on the integration base to 723 and 274. COORD-9 adds one judgment criterion.

Material decisions: COORD-8 from the current main and COORD-9 from this delivery both remain in the combined catalogue. The standard distinguishes the automatic five-gate sweep from a warned, person-requested early close that requires explicit retained-work disposition. The instance-specific cooldown figure remains in this item, not the portable standard.

Approved deviations: this record and its ledger advance were written in the task worktree rather than the designated primary checkout, directed by the responsible human on `KIS-39`; see the write-locus topic in Discussion for the collision check that substituted for serialisation.

### Verification

| Gate | Outcome |
| --- | --- |
| `bun run test` | 799 pass, 0 fail on the refreshed combined candidate at `623e0e72` |
| `bunx tsc --noEmit` | exit 0, after `bun install --frozen-lockfile` in this worktree |
| `ki harness list` | resolves `knowledgeislands/ki-agentic-harness`, 62 capabilities |
| `ki repo audit --skill ki-agent-coordination-paperclip` | PASS, 2 skills |
| `ki repo audit --skill ki-work-roadmap` | PASS after this packet was added; it failed `ITEM-3` while the packet was absent, which is what proves the audit reads this worktree |
| `ki repo audit --skill ki-skills` | PASS |
| `ki repo audit --skill ki-authoring` | PASS |

### Outstanding concerns

The earlier rubric-publication concern is resolved for this integrated candidate: the worker compared the candidate's generated rubric directly with its renderer and found exact equality. The ordinary `ki dev skill rubric` command still inspects the installed harness, so it alone is not evidence for this checkout.

`COORD-9` is judgment-graded, so nothing detects a violation mechanically. The skill is declared in `.ki.toml`, so the criterion is at least exercised by review rather than published and ignored, but the detection gap for a held workspace is real and is `KI-HARNESS-GOV-114`.

The cooldown decision of zero days is recorded and not configured. Until `PAPERCLIP_WORKSPACE_REAPER_COOLDOWN_DAYS=0` is set in the coordination-plane instance, the running default of seven days contradicts this record, which is why Current state states the decision and the gap separately.

### Post-change review

The goal is met for the half it claims: a reader of the standard can now tell that a workspace on disk may be correct, can see the five conditions under which it ends, and knows that a refused workspace is someone's decision rather than debris. It does not claim the other half — nothing surfaces the refused cases, so the rule still depends on a person walking close-readiness.

The refreshed candidate was tested with COORD-8 and COORD-9 together, and both survive on local main. The manual early-close rule was corrected after independent review; it requires explicit disposition of retained work behind warnings. The generated rubric matches its candidate-local renderer.

Acceptance readiness: the scoped delivery is integrated and verified on the designated local main. GOV-113 is uniquely retained under the ledger's GOV high-water mark of 116, so no renumbering is needed. KI acceptance still requires the normal human review of this packet; the recorded zero-day cooldown configuration remains separate KIS-80 work.

### Mini recap

Workspace retirement is now doctrine in the coordination standard, distinguishing automatic sweep from manual early close. The reviewed KIS-39 result is on local main at `623e0e72c306677b7449adeef11192f03051e9d3`; 799 combined-candidate tests, TypeScript, focused audits and candidate-local rubric equality passed. The cooldown configuration remains open under KIS-80, and held-workspace detection remains GOV-114. KI acceptance has not occurred.

Learning worth routing, not promoted here: that an audit can report PASS because a criterion is unexercised rather than because the repository conforms is a general trap, and it applies to every `ki repo audit` reported as evidence from a host whose harness is not dev-linked. The natural home is `KI-HARNESS-GOV-107`, which owns making these criteria mechanical.

## Done

Accepted 2026-10-04 on the review packet above, under the owner's delegated estate-push authority following an independent Fable review verdict of ACCEPT. The reviewer confirmed COORD-9, the workspace-retirement standard and the pinned Paperclip source at HEAD; the incorrect Dependencies claim about 4c854d2c and COORD-10 is already corrected by the pickup checkpoint in Discussion.

## Discussion

### Pickup checkpoint — 2026-09-27

- Verified delivery candidate: `623e0e72c306677b7449adeef11192f03051e9d3` is reachable from the audited destination and retains [workspace retirement doctrine](../../skills/agentic-systems/ki-agent-coordination-paperclip/references/standards-agent-coordination-paperclip.md#workspace-retirement), `COORD-9` and its published rubric. The existing Review packet records the delivery and historical verification; it is not evidence of KI acceptance.
- Evidence correction: the earlier Dependencies / blocks paragraph incorrectly attributes a landed base-revision standard and `COORD-10` to `4c854d2c2f2a852575fb8c829e049cd51843f400`. That commit changed only GOV-107’s roadmap cross-reference. At this audit, `COORD-10` instead means Repository skill baseline, a judgment criterion delivered by `7d7b247d`; the proposed mechanical current-base check in GOV-115 is not established by either commit.
- Remaining and closure route: independently review the integrated retirement scope and its retained evidence, then obtain explicit owner acceptance. The zero-day runtime configuration remains separately owned by the historical KIS-80 handoff and was not checked live here; GOV-114 retains held-workspace reporting. The retained KIS-39 worktree still points to `623e0e72`; reachability does not authorise its retirement or release any hold.

Evidence scope: inspected local `main` at `0ad0377a0e7e14b1cd7314bce414d4871b062efc` on 2026-09-27. The read-only probe of `http://127.0.0.1:3100/api/health` could not connect; live tasks, current claims and runtime configuration were not verified. The local Git worktree registry was inspected, not every retained worktree’s contents. Before further implementation, reconcile the current destination branch, linked coordination tasks and retained worktrees where applicable, including reachability, patch equivalence and uncommitted work. Missing evidence does not release ownership or lift a hold. This checkpoint is guidance, not a mechanical execution block or a grant to resume. Lifecycle, checkboxes and ownership remain unchanged; retain any later done record until the principal explicitly selects pruning.

### Why the standard states five gates and not six

The sixth precondition — skipping a workspace whose Git status cannot be read — is the mechanism declining to act on an unreadable tree. Writing it as a governance gate would invite the reading that an arrangement is conforming because it refuses to look. The gates a reviewer must be able to check are the five that describe a delivered ending; the skip is recorded here as an implementation detail instead.

### Why this instance's cooldown is zero, and what zero means

Zero disables the cooldown, not the sweep. With `0` the cutoff is null, the fifth gate can never hold, and retirement follows immediately once the other four gates pass. That is a real choice rather than a disabling: the first four gates already require a terminal task subtree, a clean tree, a merged branch and no live run, so a workspace that satisfies them holds nothing that is not already in the repository's history. The cooldown buys recovery time for work that those gates did not notice, and the responsible human judged that time unnecessary here against roughly twenty open tasks whose worktrees each cost a checkout.

The figure belongs in this record rather than in the standard. The standard is portable to any arrangement that declares the skill; a number that is true of one instance would become a false claim in the next repository to adopt it. What the standard requires is that an arrangement record the cooldown it is configured with, because an unrecorded cooldown cannot be audited.

### Why refused workspaces are a Triage question rather than debris

Dirty, unmerged, detached and abandoned workspaces are the mechanism working correctly: each is unlanded work it declines to destroy. But correct refusal is not the same as resolution, and nothing asks a person to decide. A detached `HEAD` is the clearest case, because no branch state can ever satisfy the merge gate, so the mechanism will hold that workspace forever without anyone being wrong. The disposition rule therefore names a trigger — held past its cooldown by a gate that can never pass — and an owner: the repository that owns the checkout, where the choice is to land it, discard it, or record it as a duplicate of work already landed. With a zero-day cooldown the trigger fires as soon as the task tree is terminal, which is the earliest a person could usefully be asked.

### Why the criterion is `COORD-9`

`COORD-7` is Delegated Git authority. `COORD-8` is the roadmap write locus, committed on coordination task `KIS-36`'s branch for `KI-HARNESS-GOV-104` and not yet merged to `main`. Taking `COORD-8` here would produce two different criteria with one code, discovered at merge rather than at allocation — the same failure mode `GOV-104` exists to prevent, one namespace over. The gap closes when that branch merges; a gap in a criterion namespace costs a reader nothing, whereas a collision costs a reviewer a reconciliation.

### Write locus for this record, and the deviation it records

This record and its ledger advance were written in coordination task `KIS-39`'s isolated worktree, on branch `paperclip/aligned-20260926/KIS-39-write-worktree-retirement-into-the-convention-and-ki-doctrine`, not in this repository's designated primary checkout. That is a deviation from `### Roadmap records are the exception` in the very standard this item edits, and from `COORD-8` as drafted. It is recorded here rather than left for a reviewer to notice.

The deviation was directed by the responsible human on `KIS-39` in answer to a question that named both options, and the alternative was a second writer in a checkout the executing agent is instructed to treat as read-only. What serialisation protects was established by inspection instead of by locus: the primary checkout was clean on `main` at `4eb1ea90` with its ledger at `GOV: 112`; every worktree of this repository read the same high-water mark; no `GOV-113` string existed anywhere in the primary checkout or any worktree; and the only other worktree carrying commits, `KIS-36`'s, touches no roadmap record and no ledger. The reservation was still committed alone and before this record, so the ordering rule holds even though the locus rule does not. A reviewer merging this branch should re-read the ledger first: if `main` has advanced past `GOV-113` in the meantime, this record needs renumbering, which is exactly the cost the locus rule exists to avoid paying. Re-read at merge time: `main` had advanced to `GOV: 115` and had taken neither `113` nor `114`, so no renumbering was needed and the merge resolved the ledger to the higher mark.

### Coordination linkage

Covering coordination task: `KIS-39`. Approval origin: `KNO-22`, card `028e2d50`, option `retirement-doctrine`. That identifier is the one the approval carried on 2026-09-26; the coordination board has since been reorganised into one project per repository and re-issued its identifiers, which is why the neighbouring tasks in this record read `KIS` and the approval does not. The same reorganisation is why `KI-HARNESS-GOV-104` cites `KNO-34` for work this record cites as `KIS-34`. Two decisions on `KIS-39` itself, question card `346970bb` answered 2026-09-26: the cooldown figure of zero days, and the write locus above. The mechanism claims were verified against the installed build rather than the approved plan, which corrected two statements in that plan: the list view's delivery state is an unpassed default rather than stale metadata, and the gate count is five with a separate unreadable-tree skip.
