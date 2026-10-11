---
id: KI-HARNESS-GOV-169
area: GOV
title: Roll up since mark
kind: deliver
purpose: capability
project: ways-of-working
component: governance
horizon: next
status: awaiting-review
blocks: []
blocked_by: []
baseline_ref: bd6e29b5e0d567fb5ebb83566ddd46b3f6ba778b
created_at: 2026-10-09T12:00:00Z
updated_at: 2026-10-11T02:36:39Z
---

# KI-HARNESS-GOV-169: Roll Up Since Mark

## Goal

The owner can strike a mark in any coordinating thread at any moment and later ask that thread for one roll-up of everything done and everything still outstanding since that mark, without reconstructing it from several recaps.

## Context

Kris runs a master state-of-play thread and Project threads, each delegating to detached background agents under `ki-delegation` and keeping a `ki-checkpoint` checkpoint. A project recap covers only one Project and only "since the last recap", and `ki-recap` covers one session. Neither answers "what has happened since I last stood back?" when that moment was chosen by the owner or predates the last recap.

The owner strikes a mark, a baseline captured at a moment, and later asks for a roll-up since that mark: delivered, decided, started, stopped or blocked, newly captured, and outstanding.

Kris settled the design on 2026-10-09 (state-of-play decisions log, Decision 16); see [Owner decisions](#owner-decisions---2026-10-09). Kris confirmed every recommended default for the remaining detail on 2026-10-11 (Decision 39); see [Confirmed defaults](#confirmed-defaults---2026-10-11).

The plan builds on the [reporting practices](../../skills/governance/ki-delegation/references/standards-background-runs.md#reporting) and the [guidance-refresh rule](../../skills/governance/ki-delegation/references/standards-background-runs.md#refreshing-this-guidance) that commit b03a5d55 added to `ki-delegation`: the refresh rule is how running threads learn the new mark rule, and the Summary practice is the light-weight counterpart to the roll-up.

## Boundary

- **In:** the mark and the roll-up in `ki-delegation`, generalising the project recap from "since the last recap" to "since the mark" for every coordinating thread; the one-line pointer in the `ki-checkpoint` standard; the `ki-delegation` rubric wording that cites the recap.
- **Out:** any `ki agent` launcher change in `tools-ki`; any change to `ki-recap`; a new checkpoint H2 or field (RECORD-2 fixes the six sections and the frontmatter); several or named marks; a cross-thread roll-up spanning every Project thread; migrating existing checkpoints in other repositories, which threads absorb through the refresh rule.

## Shaping

The approach is settled by the owner decisions and the confirmed defaults below. The record moved to `next` and `ready` on Kris's instruction of 2026-10-09 to plan it to Ready, and to `in-progress` on Kris's confirmation of 2026-10-11 (Decision 39).

## Current state

- [standards-background-runs.md](../../skills/governance/ki-delegation/references/standards-background-runs.md) § Project recap defines a Project-only recap with the window `since <time of last recap>`, noted in the checkpoint, given on request and proactively when several background agents have finished or the owner returns after a gap. The master thread has no recap.
- § Reporting's Summary bullet offers "done since the owner's last message or a named mark", which conflicts with one unnamed mark per thread.
- § Directions from the master thread and § Keeping primary checkouts current key their re-read and fast-forward to "every project recap".
- [standards-checkpoints.md](../../skills/governance/ki-checkpoint/references/standards-checkpoints.md) § Exact record form already routes parked tangents to `Open questions` and the `ki-delegation read at <revision>` note to `Current state`; it says nothing about a mark.
- [SKILL.md](../../skills/governance/ki-delegation/SKILL.md) names "project threads with their bootstrap and project recap" and notes the project recap's distinction from `ki-recap`.
- RUN-3 and RUN-4 in [background-runs.ts](../../skills/governance/ki-delegation/scripts/rubric/items/background-runs.ts) cite "project recaps" in their evidence scope; no rubric item checks the recap window.

## Steps

- [x] Re-ground: confirm Kris's answers to the tagged recommendations in [Confirmed defaults](#confirmed-defaults---2026-10-11). Apply any change and, if one alters scope, return the record to `draft` and replan.
- [x] In `standards-background-runs.md`, replace § Project recap with a § Recap since the mark under Thread working rules, so it applies to the master thread and to each project thread. It defines the mark (one per thread, replaced when struck, held in the checkpoint's `Current state` as `Mark: <UTC timestamp>, decisions log at Decision <N>`), striking it on the owner's word ("mark"), the scope per thread, the window `since <mark>`, the sections (delivered, decided, started, stopped or blocked, newly captured, running now, outstanding), the definition of outstanding, the sources, and the no-mark default.
- [x] Update § Reporting's Summary bullet to "since the owner's last message", pointing a "since the mark" request at the recap, and make it the form of a proactive update.
- [x] Update § Project threads, § Directions from the master thread, § Parking tangents, § Linking records and § Keeping primary checkouts current to say "recap" for every coordinating thread, and repoint each `#project-recap` link.
- [x] Update `ki-delegation` `SKILL.md`'s Background runs line and Notes bullet to name the recap since the mark and keep `ki-recap` as the single-session summary.
- [x] In `standards-checkpoints.md` § Exact record form, add one sentence: a coordinating thread keeps its mark in `Current state`, under `ki-delegation`'s mark rule, and striking a new one replaces it.
- [x] Extend RUN-5 in `background-runs.ts` to cover keeping the mark in the checkpoint and giving recaps since it, update RUN-3 and RUN-4 evidence-scope wording from "project recaps" to "recaps", and regenerate `references/rubric.md` with `ki dev skill rubric ki-delegation`.
- [x] Run Verify, write the evidence into Discussion, and set the record `awaiting-review`.

## Files touched

- `skills/governance/ki-delegation/references/standards-background-runs.md`
- `skills/governance/ki-delegation/SKILL.md`
- `skills/governance/ki-delegation/scripts/rubric/items/background-runs.ts`
- `skills/governance/ki-delegation/references/rubric.md` (generated)
- `skills/governance/ki-checkpoint/references/standards-checkpoints.md`
- This record

## Verify

- `grep -rn -i -e 'last recap' -e 'named mark' -e 'project-recap' skills/governance` returns nothing.
- `ki dev skill rubric ki-delegation` leaves `references/rubric.md` unchanged after regeneration.
- `bun run test` and `bunx tsc --noEmit` pass.
- `ki repo audit --skill ki-delegation`, `ki repo audit --skill ki-checkpoint` and `ki repo audit --skill ki-skills` pass, with fleet findings recorded separately.
- Review: a reader of the new section can strike a mark, find it in a checkpoint and produce a roll-up for the master thread and for a project thread without consulting this record.

## Dependencies / blocks

No roadmap dependency. Builds on the reporting and guidance-refresh rules committed in b03a5d55. `ki-checkpoint` RECORD-2 constrains the mark to a line inside an existing section.

## Delegation

Suitable for one background agent under the `deliver` footer, citing Decision 16 and Decision 39, Kris's confirmation of the tagged recommendations. One lane; no parallel split is useful.

## Documentation impact

### Decision Records

None. The design is a thread working rule, and `ki-delegation` is its durable owner, as for the reporting practices of Decision 15.

### Specifications

None; no accepted behaviour-level contract covers coordinating threads.

### Guides

The `ki-delegation` background-run standard and the `ki-checkpoint` record-form note, above. The website-owned skills-by-outcome guide needs no change.

### Roadmap

Closes this record on acceptance. A cross-thread roll-up spanning every Project thread, if wanted later, is new work through `ki-next`.

## Review

### Delivered

Delivered the recap since the mark from immutable baseline `bd6e29b5e0d567fb5ebb83566ddd46b3f6ba778b`, on Decision 16 and Decision 39 with every recommended default confirmed unchanged. Every coordinating thread, the master thread and each project thread, now keeps one owner-struck mark in its checkpoint's `Current state` and gives a recap since it on request; proactive updates use the Summary. No `ki agent`, `ki-recap` or checkpoint-shape change, and no migration of existing checkpoints, which threads absorb through the refresh rule.

### Change Summary

- `standards-background-runs.md`: removed § Project recap and added § Recap since the mark under Thread working rules, with the mark, striking, shape, outstanding, sources, when, and no-mark rules. The Summary bullet now uses "since the owner's last message", is the proactive form, and routes "since the mark" to the recap. § Project threads names the mark in the checkpoint; § Directions from the master thread, § Linking records and § Keeping primary checkouts current say "recap"; § Parking tangents counts parked items as outstanding.
- `ki-delegation` `SKILL.md`: the Background runs line names the recap since the mark under thread working rules, and the Notes bullet keeps `ki-recap` as the single-session summary.
- `standards-checkpoints.md` § Exact record form: one sentence placing the mark in `Current state` under the mark rule, replaced when a new one is struck.
- `background-runs.ts`: RUN-5 now covers the mark and recaps since it, with a "restore the mark" outcome; RUN-3 and RUN-4 evidence scopes say "recaps". `references/rubric.md` regenerated.

### Verification

- `grep -rn -i -e 'last recap' -e 'named mark' -e 'project-recap' skills/governance` returns nothing.
- `ki dev skill rubric ki-delegation` reports `references/rubric.md` in sync after regeneration. The dev-linked install points at the primary checkout, so it ran against the worktree through a temporary `XDG_DATA_HOME` harness link for that command only.
- `bun run test`: 1,062 pass, 0 fail. `bunx tsc --noEmit`: pass.
- `ki repo audit --skill ki-delegation`: PASS. `ki repo audit --skill ki-checkpoint`: PASS. `ki repo audit --skill ki-skills`: FAIL=0, WARN=1; the warning is the pre-existing fleet finding LONG-3 (a `references/sources.md` source last reviewed 2026-06-21), unrelated to this change.

### Outstanding concerns

None in scope. Running threads pick the rule up through the refresh rule; any private mark kept outside a checkpoint, such as in a run directory, needs moving into the checkpoint by its thread.

### Post-change review

Read § Recap since the mark cold: it states how to strike a mark, its exact line in `Current state`, the window, sections, outstanding set, sources and the no-mark start, for both the master thread and a project thread, without needing this record. MARK-NONE's first strike is the one case where the thread, not the owner, sets the mark; the text says so explicitly, matching the confirmed default.

### Mini recap

Coordinating threads now share one recap since the owner's mark, held in the checkpoint, with the Summary as the light proactive form. `ki-delegation` is the durable home; no memory or knowledge-base note was promoted.

## Discussion

### Owner decisions - 2026-10-09

Kris answered the design questions in the state-of-play thread (decisions log, Decision 16). These are decided:

- **Scope:** marks are per thread only. A Project thread's mark covers that Project; the master thread's mark covers only what the master thread itself deals with.
- **Number:** one mark per thread. Striking a new mark replaces the old one.
- **Home:** the mark lives in the thread's checkpoint, within the existing six sections, which RECORD-2 fixes; Git holds the history of earlier marks.
- **Outstanding:** Needs-you items, open work records in scope, running or queued background agents, and parked tangents.
- **Owner:** `ki-delegation`, generalising the existing project recap from "since the last recap" to "since the mark". `ki-recap` stays the single-session summary.

These answer the original questions on whether a mark belongs to one thread or spans threads, whether several coexist, how outstanding is defined, the relation to the project recap and `ki-recap`, and which skill owns it.

### Confirmed defaults - 2026-10-11

These answer the remaining questions. Kris confirmed every one unchanged on 2026-10-11 (state-of-play decisions log, Decision 39), so no scope change follows.

- **MARK-FORM:** a mark is a UTC timestamp plus the thread's decisions-log position, written in `Current state` as `Mark: <UTC timestamp>, decisions log at Decision <N>`. The timestamp bounds Git history, work-record transitions and background-agent reports; the decision number bounds the log exactly. Per-repository commit identifiers are left out: they bloat the checkpoint, and reports avoid commit identifiers.
- **MARK-STRIKE:** only the owner moves the mark, by saying "mark" (or "recap and mark" to roll up and then re-strike). Giving a recap does not move it, so a roll-up can always reach back to a moment the owner chose. The thread commits the checkpoint update and confirms in one line.
- **MARK-NONE:** with no mark yet, the first recap uses the checkpoint's last-recap time, if any, or else the checkpoint's `created_at`, states that window in its header, and strikes the first mark. Existing threads convert their last-recap note into a mark when the refresh rule tells them the guidance changed.
- **MARK-SOURCES:** the roll-up reads the run's decisions log after Decision N, background-agent reports finished since the timestamp, `ki agent status` for running and queued agents, work-record transitions in the thread's scope since the timestamp (Git history of the roadmap paths), the checkpoint's Needs-you items and parked tangents. For the master thread, "in scope" means records and decisions the master thread itself raised or owns, not every Project's records.
- **MARK-SUMMARY:** the Summary practice keeps the "since the owner's last message" window and becomes the form of the proactive update when several background agents finish or the owner returns after a gap; the full recap since the mark is given on request. This avoids proactive recaps repeating everything since a distant mark.
- **MARK-NAME:** call the generalised capability the "recap since the mark", or "recap" for short, placed under Thread working rules, rather than keeping the Project-specific name.
- **MARK-RUBRIC:** extend the existing RUN-5 judgment item rather than adding a new rubric item.

### Original open questions

The record was captured with these questions; the two sections above answer each one.

- What is a mark: a named baseline checkpoint, a timestamp, a set of commit identifiers per repository, a decisions-log number, or a combination? (MARK-FORM)
- Where does a mark live durably, given that run directories are non-durable and checkpoints hold current state only? (decided: the checkpoint)
- Does a mark belong to one thread, or to the master thread spanning every Project thread? (decided: per thread)
- Can several marks coexist, and are they named, listed, superseded or removed? (decided: one, replaced)
- What are the roll-up sources? (MARK-SOURCES)
- How is "outstanding" defined? (decided)
- How does it relate to the project recap and to `ki-recap`? (decided: generalises the project recap)
- Which skill owns it? (decided: `ki-delegation`)
