---
id: KI-HARNESS-GOV-187
area: GOV
title: thread model and banner
project: ways-of-working
component: governance
kind: deliver
purpose: governance
status: awaiting-review
horizon: now
blocks: []
blocked_by: []
baseline_ref: e205e81ff7c9980e34bedc2ad16b21b3eb09db0b
created_at: 2026-10-14T13:53:54Z
updated_at: 2026-10-14T14:05:21Z
---

# Make the Thread Model and the Banner Changes Normative

## Goal

Make the thread model from the ways-of-working designs normative in the harness: the terms thread, session and chat; the three thread types conversational, coordination and state-of-play in place of "project thread" and "territory master thread"; the four decision classes and the one decisions list per thread; the design-note home and its graduation; the Project close-out tidy before DONE; the narrowed meaning of REST; the banner amendments to the frame KI-HARNESS-GOV-186 delivered; re-anchoring after compaction, the surfaces rule and red-x recovery; the restore-path rule in `ki-delegation` and `ki-engineering`; the hook runtime split; and the strict `ki agent close` gate with its waiver, so that every coordinating thread, worker and hook reads the same model.

## Context

Kris requested this record on 2026-10-14 in the ways-of-working thread. The model was decided on 2026-10-14 in these words: "adopt thread, session and chat terms; adopt the three thread types conversational, coordination and state-of-play, replacing the old names; adopt the four decision classes and the homeless-standalone rule; the thread log is the Project's one decisions list; design notes move to +/_DESIGN/<subject>/ and are deleted on graduation; confirm the four close-out steps; open queries do not make a thread BUSY; restore-path rule lives in ki-delegation and ki-engineering; approve the hook runtime split; resume line with an optional compact paste first, Kris runs the Zed test; approve the surfaces rule and the ki agent status follow-on; approve red-x recovery; keep the close gate strict with the reconciled waiver; start KI-HARNESS-GOV-181 now; keep the defaults."

The banner amendments follow three decisions of the same day. On the issued time: "Banner is great, but it needs the date it was issued to be more prominent than the mark", then "Use ISO-8601 UTC for the issued too and fix the border", so the top border reads `╭─ issued <YYYY-MM-DDTHH:MM:SSZ> ─…╮` padded to the frame's width and the frame test asserts that width. On the lines beneath: "the running should each be a line with the running: prefix", so every running, queued or waiting item has its own line. The design names the earlier agent-report lesson: a frame outside a text block is not rendered byte-identical, so an agent report puts the frame inside one. The thread-folder rule follows "threads need to know that they need to commit their work under +/_THREAD/", read as `+/_THREADS/`: a coordinating thread commits and pushes its thread folder at every report and resting point.

The restore-path rule follows the decision Kris set after the Headroom cutover removed the proxy's launchd service and cut every session off: "any change to a firewall or to the configuration of a service critical for connection (Headroom proxy, SSH, Tailscale, network, auth) must carry in its rollout plan a tested restore path that reconnects first, then evaluates why it failed", placed where "Claude and Codex both load it (ki-delegation and the engineering standard)". The homes of the thread artefacts were set earlier: "DECISION-HOME - (b) tracked +/_THREADS/<thread>/ for the decisions log and agent reports; state folder keeps runtime only" and "DESIGN-RETENTION - (a) +/_DESIGN/<subject-slug>/ in every repository". The rule that a record quotes rather than numbers a decision follows "I actually think we should not necessarily need to put the decision number anywhere. It should be written about what the decision was or is."

The designs are `Streams/Projects/ways-of-working/design/thread-types-and-durable-decisions.md` and `thread-banner-and-re-anchoring.md` in Knowledge Islands Principal; this record quotes what it needs and will outlive them.

## Boundary

- In scope: `ki-pmo`'s standard, SKILL.md, sources, rubric items, contexts, tests and generated rubric, and its banner test; `ki-delegation`'s standard, SKILL.md, sources and the four authority footers; `ki-engineering`'s standard and sources; `ki-checkpoint`'s standard, SKILL.md, rubric strings and generated rubric for the renamed thread types; `hooks/coordinator-reminder.sh`, its tests and README; HARN-012 and HARN-013; `output-styles/ki-coordinator.md`; ADR-KI-HARNESS-SKILLS-005 wording; the regenerated catalogue.
- Out of scope: any `tools-ki` change, including `ki agent status` and the `home:` convention, which go back as handoffs; editing any checkpoint, `Admin`, `Pillars` or `Resources`; the `KI_AGENT_RUN` change for Codex; the notification surface; deploying the output style through chezmoi; the Zed compact test, which Kris runs.

## Requirements

1. `ki-pmo`'s glossary defines thread, session and chat; the three thread types replace the old names everywhere in the harness, and a thread with no stated type is conversational.
2. The standard carries the four decision classes with the rule that a decision with no home stands alone, one decisions list per thread, the design-note home `+/_DESIGN/<subject-slug>/` with deletion on graduation, the four close-out steps before DONE, and REST meaning only that nothing is running or queued, with waiting queries on lines beneath the frame.
3. The banner's top border carries the issued time padded to the frame's width; `banner <UTC>` leaves the housekeeping line; each running, queued or waiting item has its own prefixed line; an agent report puts the frame in a text block; the banner test asserts the border width and the per-item lines.
4. Re-anchoring after compaction offers the optional compact paste first; the surfaces rule and red-x recovery are stated; the restore-path rule is in `ki-delegation` and `ki-engineering`; the hook skips the terminal check under `CLAUDECODE`, keeps it for Codex, and emits a re-anchoring pointer on a compact session start; the documented `ki agent close` gate stays strict with `--reconciled` as the waiver.
5. `bun run test`, `bunx tsc --noEmit`, the skill-graph check and the focused audits for `ki-skills`, `ki-delegation`, `ki-checkpoint`, `ki-pmo`, `ki-engineering`, `ki-repo-harness` and `ki-work-roadmap` pass on the combined result.

## Current state

Delivered on harness `main` from baseline `e205e81f` as one commit after the ledger advance, with every gate passing. Awaiting review.

## Steps

- [x] Rewrite the `ki-pmo` standard, SKILL.md and sources; rename the rubric strings; regenerate the rubric; extend the banner test.
- [x] Update the output style, the hook, its tests, README, HARN-012 and HARN-013.
- [x] Add the restore-path rule to `ki-delegation` and `ki-engineering`; rename the thread types in `ki-delegation`, `ki-checkpoint` and ADR-KI-HARNESS-SKILLS-005.
- [x] Regenerate the catalogue; run the gates; commit by explicit path and push fast-forward.

## Files touched

- `skills/change-management/ki-pmo/SKILL.md`, `references/standards-pmo.md`, `references/sources.md`, `references/rubric.md`, `scripts/banner.test.ts`, `scripts/rubric/items/threads.ts`, `scripts/rubric/contexts/pmo.ts`, `scripts/rubric/contexts/pmo.test.ts`.
- `skills/governance/ki-delegation/SKILL.md`, `references/standards-background-runs.md`, `references/sources.md`, `assets/rules-none.md`, `assets/rules-push.md`, `assets/rules-prune.md`, `assets/rules-release.md`.
- `skills/governance/ki-engineering/references/standards-engineering.md`, `references/sources.md`, `references/rubric.md`.
- `+/_CHECKPOINTS/README.md`, the canonical scaffold orientation `ki-checkpoint` CONFORM republished after its wording changed; no checkpoint record was touched.
- `skills/governance/ki-checkpoint/SKILL.md`, `references/standards-checkpoints.md`, `references/rubric.md`, `scripts/rubric/items/records.ts`, `scripts/rubric/contexts/checkpoints.ts`, `scripts/rubric/contexts/checkpoints.test.ts`.
- `hooks/coordinator-reminder.sh`, `hooks/coordinator-reminder.test.ts`, `hooks/README.md`, `docs/specs/harness.md`, `output-styles/ki-coordinator.md`, `docs/decisions/ADR-KI-HARNESS-SKILLS-005-*.md`, `skills/README.md`, `docs/roadmap/_ISSUES.md`.

## Verify

- `bun run test`, `bunx tsc --noEmit`, `bun skills/repo-structure/ki-repo-harness/scripts/skill-graph.ts --check`.
- `ki repo audit --skill ki-skills`, `ki-delegation`, `ki-checkpoint`, `ki-pmo`, `ki-engineering`, `ki-repo-harness`, `ki-work-roadmap`.
- A search across the harness for "project thread", "master thread" and "territory master" finds only this record and the skills' review notes.

## Dependencies / blocks

- KI-HARNESS-GOV-186 delivered the banner this record amends; its record is accepted and pruned.
- The `home:` convention on `ki agent decide` and the `ki agent status` follow-on belong to `tools-ki` and are handoffs, not edits here.

## Documentation impact

### Decision Records

None new. ADR-KI-HARNESS-SKILLS-005 is reworded in place for the thread type names.

### Specifications

HARN-012 records the hook's runtime split and compact pointer; HARN-013 records the banner's issued border and per-item lines.

### Guides

None.

### Roadmap

No follow-on record here; the `tools-ki` handoffs are named under Review.

## Review

### Delivered

The thread model and the banner amendments are normative in the harness: `ki-pmo` defines the three thread types and the glossary terms, carries the decision classes, the one list, the design-note home and the four-step Project close, narrows REST, amends the banner, and adds re-anchoring, the surfaces rule and red-x recovery; `ki-delegation` and `ki-engineering` carry the restore-path rule; the hook splits by runtime and points at re-anchoring after compaction; the output style, the banner test, the rubrics, the specifications and the catalogue follow.

### Change Summary

- `ki-pmo`: the standard gained Thread types, Re-anchoring after compaction, Surfaces, Recovering a thread showing a red x, Decisions and design with its four subsections, and Committing the thread folder; Project threads became Coordination threads and the territory master thread the State-of-play thread, with the openers, bootstrap and directions renamed and the older wordings accepted until every checkpoint re-bootstraps; the glossary gained thread, session and chat; the banner's top border carries the issued time padded to 52 code points, `banner <UTC>` left the housekeeping line, each running, queued or waiting item has its own line, the housekeeping line reports the thread folder, and an agent report puts the frame in a text block. SKILL.md, sources, the rubric items, contexts, tests and generated rubric follow; `scripts/banner.test.ts` asserts the top border's pattern and width, the per-item lines, the absence of the banner time and the hook's clauses.
- Hook: `has_terminal` is skipped when `CLAUDECODE` is set and kept for Codex; a compact `SessionStart` injects the re-anchoring pointer naming the `ki-pmo` standard; the line names the issued border, the per-item lines and the thread-folder rule. Tests cover a terminal-less Claude Code session, a terminal-less Codex process, the run marker under both runtimes and the pointer. README, HARN-012 and HARN-013 record the split, the pointer and the border.
- Output style: the new type names, the issued border on both frames, the per-item lines, the thread-folder state on the housekeeping line, and a paragraph on re-anchoring and committing the thread folder.
- `ki-delegation`: the coordinating-threads section uses the new names; the decisions-log section carries the commit-and-push rule, the one-list and decision-class pointer, and the strict `ki agent close` gate with `--reconciled` as the owner's waiver; Coordination gained `### Connection-critical changes` in Kris's words; each of the four authority footers carries the restore-path line.
- `ki-engineering`: `### Connection-critical rollouts` beside Clean-end-state cutovers, with "tested" defined as run once before the change on the same machine; sources updated.
- `ki-checkpoint`: Coordination-thread naming replaces Project-thread naming, with the opener example, label rule, RESUME step, SKILL.md, rubric strings and the generated rubric renamed; the canonical scaffold README changed with them and was republished into `+/_CHECKPOINTS/README.md`.
- ADR-KI-HARNESS-SKILLS-005 reworded in place; `skills/README.md` regenerated.

### Verification

`bun run test` (1142 pass, 0 fail), `bunx tsc --noEmit`, the skill-graph check, and `ki repo audit --skill` for `ki-skills`, `ki-delegation`, `ki-checkpoint`, `ki-pmo`, `ki-engineering`, `ki-repo-harness` and `ki-work-roadmap` pass on the combined result. The `ki-skills` and `ki-repo-harness` audits carry pre-existing warnings outside this scope: two `ki-skills` sources past their refresh cadence, and the diagram freshness warnings raised by another session's uncommitted `ki-diagrams` changes. A search for "project thread", "master thread" and "territory master" finds only this record, the review notes in the three sources files and the accepted-older-wording sentences.

### Outstanding concerns

- `tools-ki` handoffs, not edits here: `ki agent status` listing threads beside runs from `thread.status`; the `home:` convention on `ki agent decide` so the log carries each entry's class; `ki agent send` to replace the `--log` inbox idiom; `KI_AGENT_RUN` on the Codex launcher so the hook can drop the terminal check there.
- Every other Capital's `+/_CHECKPOINTS/README.md` now differs from the canonical scaffold until its `ki-checkpoint` CONFORM republishes it; a fleet finding, not a failure of this contract.
- Checkpoints that still say `From the master thread`, or whose openers use the older wordings, keep working and rename at their next update; nothing in them was edited here.
- The Zed compact pass-through test belongs to Kris; the hook's `source: compact` path is covered by the test suite only.

### Post-change review

The three sources files quote Kris's words for every rule they carry, and no record, standard or banner cites a decision by number. The hook remains fail-open and byte-compatible across the two runtimes' payloads. The DONE frame in `ki-pmo` still shares its block word with `ki-recap`'s single-session frame and differs in its side lines and its issued border.

### Mini recap

The thread model Kris adopted on 2026-10-14 is now what the harness says, in `ki-pmo` for threads, `ki-delegation` and `ki-engineering` for the restore path, and the hook, style and tests for the banner; the follow-ons are `tools-ki` handoffs and other Capitals' scaffold refreshes.

## Discussion

### Why the compact pointer names ki-pmo and not ki-delegation

The design wrote the pointer against `ki-delegation` before KI-HARNESS-GOV-185 moved the thread working rules into `ki-pmo`. Re-anchoring is a coordinating-thread practice, so the pointer and the text it names live in `ki-pmo`'s standard, and `ki-delegation` keeps only the run side.
