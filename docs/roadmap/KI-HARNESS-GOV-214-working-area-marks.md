---
id: KI-HARNESS-GOV-214
area: GOV
title: Working-area marks
project: ways-of-working
component: governance
kind: deliver
priority: medium
size: m
status: awaiting-review
horizon: now
blocks: []
blocked_by: []
baseline_ref: a3cd97aa73cb06d19a905beb8eec76f18a769234
created_at: 2026-10-18T08:55:30Z
updated_at: 2026-10-20T05:50:18Z
---

# KI-HARNESS-GOV-214: Working-Area Marks

## Goal

Every file an agent or a session writes into a repository's `+/` working area says who wrote it and when: the work it belongs to, the background run and agent or the interactive session that wrote it, and the time. A later reader, agent or owner, can tell at a glance whether a working file is current, whose it is, and which run to ask before moving or deleting it.

## Context

The rule began as [KI-HARNESS-GOV-184 (pruned)](https://github.com/knowledgeislands/ki-agentic-harness/blob/731580841ce5be89687784284a432e84a187646f/docs/roadmap/KI-HARNESS-GOV-184-working-area-marks.md). Kris Brown confirmed it on 14 October 2026: "MARK-RULE - yes, that reading; capture as a harness deliver record at next." In the same answer set Kris chose how to tidy the scratch that prompted it: "DIAGRAMS-TIDY - (b) delete scratch and rebuild the stale HTML after the push; keep +/diagrams/ visible." The rebuilt `skill-graph` and `skill-map` folders under this repository's `+/diagrams/` carry a `mark.toml` sidecar written by the `mark-tidy` run as a hand-made early application of the rule.

Kris then merged it into [KI-HARNESS-GOV-175 (pruned)](https://github.com/knowledgeislands/ki-agentic-harness/blob/87da1b26/docs/roadmap/KI-HARNESS-GOV-175-delegation-run-events.md) on 14 October ("RC-ALL: approve all; ways-of-working applies the harness part"), because both edited the `ki-delegation` background-run standard. On 18 October, with that record's run-events work landed and only this rule unbuilt, Kris split it back out, in the ways-of-working decisions log, "owner answers, batches 6 and 7": "MARK-RULE-SPLIT a) - split the mark rule into its own harness record; KI-HARNESS-GOV-175 to Awaiting review." It is captured here as triage, its field names since settled for now, so that the finished run-events work can go to review.

## Boundary

- `ki-delegation`: the background-run standard gains the mark rule as a rule on what a run writes into a working area, naming the fields (work, run and agent or session, time), the Markdown front-matter form and the sidecar form for a folder, and saying that coordinating work or an interactive session marks its own working files the same way. The rubric gains the matching criterion and `rubric.md` is regenerated.
- `ki-diagrams`: the diagrams standard's working-folder rule under `+/diagrams/<slug>/` names the sidecar and its fields, and the delivery receipt the exporter or the finalize step writes beside the HTML gains the same fields. The rubric gains the matching criterion and `rubric.md` is regenerated.
- The two skills' SKILL.md summaries are reworded only where they list what the standards cover.
- Not the `+/README.md` text in adopting repositories, which `ki-repo` owns; not Git tracking of `+/`; not a tidy-up tool that acts on marks, which is a later record if wanted; not any work file, decisions log or Project note.

## Current state

Checked on 20 October 2026 at `30cbbd1d`.

- Neither the `ki-delegation` background-run standard nor the `ki-diagrams` standard names a mark, and neither rubric checks one.
- The two hand-written `mark.toml` files are gone: the primary checkout's `+/diagrams/` now holds `skill-area-acquire`, `skill-area-coordination`, `skill-area-records-and-code`, `skill-map` and `thread-model`, none with a `mark.toml`, so the Step to migrate them from `thread` to `work` falls away.
- Each working folder holds `build/`, `<slug>.html` and `<slug>.delivery.json`. The `.delivery.json` is Archify's own finalize output, which this record must not change, since changing Archify is out of scope for `ki-diagrams`.
- [KI-HARNESS-GOV-224](KI-HARNESS-GOV-224-diagram-viewer-receipts.md) has since added a committed `<slug>.receipt.json` beside each committed viewer, written by `scripts/build-html.ts`. It is portable proof of what was rendered and carries no local path. A mark is not provenance for committed work, so the mark must not go into that receipt.
- `scripts/build-html.ts` runs the documented rebuild route for every manifest diagram, so it is the one place a `ki-diagrams` working folder is written by tooling.

## Steps

- [x] Add a Working-area marks rule to the background-run standard that states the field names in one place: `work`, then `run` and `agent` for a background run or `session` for an interactive one, then `written_at`. It also names the Markdown front-matter form and the `mark.toml` sidecar form for a folder of non-Markdown output, and says that coordinating work and interactive sessions mark their own working files the same way.
- [x] Add a `ki-delegation` judgment criterion that a run's working-area files carry the mark, and regenerate its `rubric.md`.
- [x] In the diagrams standard's Regeneration and freshness section, name the `mark.toml` sidecar at the root of `+/diagrams/<slug>/`, its fields by reference to the background-run rule, and that neither Archify's `.delivery.json` nor the committed `.receipt.json` carries the mark.
- [x] Make `scripts/build-html.ts` write `+/diagrams/<slug>/mark.toml` after a successful finalize, reading `work`, `run` and `agent` from `KI_AGENT_RUN` and the run packet where present and writing `session` otherwise, with a boundary test for both.
- [x] Add a `ki-diagrams` mechanical criterion at WARN for a working folder without a well-formed `mark.toml`, and regenerate its `rubric.md`.
- [x] Reword the two SKILL.md summaries only where they list what the standards cover.

## Files touched

- `skills/governance/ki-delegation/references/standards-background-runs.md`, `rubric.md`, `SKILL.md`, and its rubric item file if the criterion is published there
- `skills/governance/ki-diagrams/references/standards-diagrams.md`, `rubric.md`, `SKILL.md`
- `skills/governance/ki-diagrams/scripts/build-html.ts` and `build-html.test.ts`
- `skills/governance/ki-diagrams/scripts/rubric/contexts/diagrams.ts`, `diagrams.test.ts` and `scripts/rubric/items/diagrams.ts`
- `skills/keystone/ki-skills/scripts/internal/remediation-inventory.test.ts`

## Verify

- `bun run test` and `bunx tsc --noEmit` pass.
- `ki dev skill rubric ki-delegation` and `ki dev skill rubric ki-diagrams` leave no diff.
- `ki repo audit --skill ki-diagrams` and `ki repo audit --skill ki-delegation` report no FAIL here.
- Rebuilding one diagram with `build-html.ts` leaves `+/diagrams/<slug>/mark.toml` naming the work, the run and agent or the session, and the time, and leaves the committed receipt unchanged.

## Dependencies / blocks

Decided on 20 October 2026 under PLANNED-READY a), each as recommended:

- Time field name: `written_at`, as the hand-written sidecars used, matching the field style of other KI timestamps such as `created_at`.
- `rebuilt_from`: dropped; the manifest's `last_checked` and the committed receipt already say what a diagram was built from.

[KI-HARNESS-GOV-205](KI-HARNESS-GOV-205-static-light-diagram-export.md) and [KI-HARNESS-GOV-221](KI-HARNESS-GOV-221-ki-diagrams-mermaid-fence-warning.md) edit the same diagrams standard and rubric; deliver them one after another.

## Documentation impact

### Decision Records

None needed: the owner's MARK-RULE, MARK-RULE-SPLIT and MARK-FIELDS answers are in the ways-of-working decisions log, and the rule lives in the standard.

### Specifications

None: no Specification covers working areas.

### Guides

None: no guide describes `+/` working files.

### Roadmap

None; a tidy-up tool that acts on marks would be a later record if wanted.

## Review

### Delivered

Every working file a run or session writes into `+/` now has one named mark, stated once in the `ki-delegation` background-run standard, and `ki-diagrams` builds write it. Baseline `a3cd97aa73cb06d19a905beb8eec76f18a769234`.

### Change Summary

- `ki-delegation` `references/standards-background-runs.md`: a new Working-area marks section under Run packet. It states the fields once, in order: `work`; `run` and `agent` for a background run or `session` for an interactive one; `written_at`. It names the front-matter form for Markdown and the `mark.toml` sidecar for a folder, says coordinating work and interactive sessions mark the same way, and keeps marks out of committed receipts and reports. It quotes MARK-RULE (14 October) and MARK-FIELDS (18 October).
- `ki-delegation` rubric: RUN-5, a judgment criterion that a run's working-area files carry the mark. `rubric.md` regenerated.
- `ki-diagrams` `references/standards-diagrams.md`: Regeneration and freshness names the `mark.toml` sidecar at the root of `+/diagrams/<slug>/`, its fields by reference, and that neither Archify's `<slug>.delivery.json` nor the committed `<slug>.receipt.json` carries it. The build command paragraph names the mark and `--work <id>`.
- `scripts/rubric/contexts/diagrams.ts`: `WorkingMark`, `formatMark`, `markIssues` and a `marks` context over `+/diagrams/*/`.
- `scripts/rubric/items/diagrams.ts`: DIAG-8, mechanical at WARN, one violation per folder without a well-formed mark, not applicable where no working folder exists. `rubric.md` regenerated.
- `scripts/build-html.ts`: after a successful finalize it writes `mark.toml`. In a background run it takes `run` from `KI_AGENT_RUN`, `work` from the run packet's `thread.json` and `agent` from the `<name>.pid` that names this process or an ancestor, under `KI_STATE_HOME` or `XDG_STATE_HOME`. Otherwise it writes `session` from `CLAUDE_CODE_SESSION_ID`, or `interactive`. A new `--work <id>` names the work where no run packet does.
- Both SKILL.md summaries now list the marks.
- Remediation-inventory counts updated: criteria 828, diagnostic 433, judgment 321, mechanical 563, report-only 452.

### Verification

- `bun run test`: 1356 pass, 0 fail.
- `bunx tsc --noEmit`: clean.
- New boundary tests cover the run case (packet work and agent from a pid chain, named work wins) and the interactive case (session, `interactive`, missing work), mark parsing, and DIAG-8 PASS, WARN and NOT_APPLICABLE.
- `ki dev skill rubric ki-delegation` and `ki dev skill rubric ki-diagrams`: in sync after `--write`.
- `ki repo audit --skill ki-diagrams` (isolated home): FAIL=0, 12 DIAG-4 staleness warnings; `thread-model` now also traces the background-run standard this change edits.
- `ki repo audit --skill ki-delegation`: PASS. `ki repo audit --skill ki-skills`: PASS.
- A real rebuild of `skill-map` from this run wrote `mark.toml` naming `ki.ways-of-working`, run `ways-of-working`, agent `harness-batch` and the time, and left `docs/diagrams/skill-map.receipt.json` and the committed HTML byte-identical.

### Outstanding concerns

- An interactive build without `--work` writes a mark with no `work`, which DIAG-8 warns on; that is the intended nudge.
- The `agent` lookup walks the process tree with `ps`; where `ps` is missing the mark omits `agent` and DIAG-8 warns.
- Existing working folders in the primary checkout carry no mark, so DIAG-8 will warn there until they are rebuilt or deleted.

### Post-change review

- Scope matches the record's Boundary: no `+/README.md`, no Git tracking of `+/`, no tidy tool, no Archify change, and the receipt format is unchanged.
- Field names live in one rule; the diagrams standard and RUN-5 refer to it rather than restating it.

### Mini recap

Marks are defined once, checked by a delegation judgment and a diagrams WARN, and written by the diagram build without touching what is committed.

## Discussion

### Forms

Markdown carries the mark in front matter; a folder of non-Markdown output carries one small sidecar at its root (the hand-written example is `mark.toml` with `thread`, `run`, `agent`, `written_at` and `rebuilt_from`); the `ki-diagrams` receipt carries the same fields. A mark is not provenance for committed work, which Git carries, and says nothing about retention.

### Steps carried for planning

Check the two hand-written `mark.toml` files against the settled names below; add the rule to the `ki-delegation` standard and rubric; add the sidecar and receipt fields to the `ki-diagrams` standard and rubric; make the exporter or finalize wrapper write the fields into the delivery receipt, with a boundary test; reword the two SKILL.md summaries. Files: `skills/governance/ki-delegation/references/standards-background-runs.md`, `rubric.md` and `SKILL.md`; `skills/governance/ki-diagrams/references/standards-diagrams.md`, `rubric.md`, `SKILL.md`, and `scripts/export-svg.ts` with its test if the receipt fields are written there. Verify: `ki repo audit --skill ki-diagrams` and `ki dev skill rubric ki-diagrams` join the gates, and a diagram rebuilt by the documented route leaves a sidecar and a receipt naming the work, the run and agent or session, and the time.

### Field names, settled for now

Kris settled the names on 18 October 2026 in the ways-of-working decisions log, 17:59 BST owner answers: "Mark feels, let's go with it for now" (MARK-FIELDS a), "for now"). The first field is `work`, the work id the work model uses, in place of the hand-written `thread`; a background run writes `run` and `agent`, and an interactive session writes `session` instead; a folder's sidecar stays TOML, `mark.toml`. The two hand-written `mark.toml` files under `+/diagrams/` move from `thread` to `work` when the rule lands. The time field's name and whether `rebuilt_from` stays are left to planning. Because the answer is "for now", the standard should state the names in one place so a later change touches one rule.

### Planning answers, 20 October 2026

Kris Brown answered PLANNED-READY on 20 October 2026 in the ways-of-working decisions log, "owner answers on the 03:08 BST send": "the old do need to move to Ready if possible, and we need to move them", taken as a): take the listed answers and mark each record Ready where the readiness checks pass. The two field decisions are recorded under Dependencies / blocks, and the record is Ready.
