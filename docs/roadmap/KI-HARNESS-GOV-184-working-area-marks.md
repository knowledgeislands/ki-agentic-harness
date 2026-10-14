---
id: KI-HARNESS-GOV-184
area: GOV
title: Working-area marks
project: ways-of-working
component: governance
kind: deliver
purpose: governance
horizon: next
status: draft
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-10-14T09:12:30Z
updated_at: 2026-10-14T09:12:30Z
---

# Every Working-Area File Carries a Mark Naming Its Writer

## Goal

Every file an agent or a session writes into a repository's `+/` working area says who wrote it and when: the thread it belongs to, the background run and agent or the interactive session that wrote it, and the time. A later reader, agent or owner, can tell at a glance whether a working file is current, whose it is, and which run to ask before moving or deleting it.

## Context

Working areas accumulate material from several threads and sessions at once. On 2026-10-14 the `ways-of-working` thread found untracked diagram scratch under `+/diagrams/` in this repository and in Knowledge Islands Principal, written by several runs over two days, with nothing in the files to say which run wrote which folder, whether a folder was the current build or a superseded review round, or whether the session that wrote it was still alive. Each background agent that met the folders left them alone as another session's material, which was the right caution and also why nothing was ever tidied.

The coordinator put a reading of the remedy to Kris: every file an agent or session writes into a `+/` working area carries a mark naming the thread, the run and agent or the session, and the time; a Markdown file carries it in its front matter; a diagram folder carries it in a small sidecar file; and the `ki-diagrams` delivery receipt gains the same fields. The rule lives in `ki-delegation`, which owns what a background run writes and how a thread works, and in `ki-diagrams`, which owns the diagram working folder and its receipt.

Kris confirmed the reading on 2026-10-14, in these words: "MARK-RULE - yes, that reading; capture as a harness deliver record at next." This record is the capture that answer asks for. It is captured directly at horizon Next as a deliver record, as the answer directs; capture does not plan or implement it.

In the same answer set Kris chose how to tidy the scratch that prompted the rule: "DIAGRAMS-TIDY - (b) delete scratch and rebuild the stale HTML after the push; keep +/diagrams/ visible." The rebuilt `skill-graph` and `skill-map` folders under this repository's `+/diagrams/` carry a `mark.toml` sidecar written by the `mark-tidy` run as an early, hand-made application of the rule, so the implementer has one worked example of the sidecar form to start from.

## Boundary

- `ki-delegation`: the background-run standard gains the mark rule as a rule on what a run writes into a working area, naming the fields (thread, run and agent or session, time), the Markdown front-matter form and the sidecar form for a folder, and saying that a coordinating thread or an interactive session marks its own working files the same way. The rubric gains the matching criterion and `rubric.md` is regenerated.
- `ki-diagrams`: the diagrams standard's working-folder rule under `+/diagrams/<slug>/` names the sidecar and its fields, and the delivery receipt the exporter or the finalize step writes beside the HTML gains the same fields. The rubric gains the matching criterion and `rubric.md` is regenerated.
- The two skills' SKILL.md summaries are reworded only where they list what the standards cover.
- Not the `+/README.md` text in adopting repositories, which `ki-repo` owns and which stays a general description of the working area; not Git tracking of `+/`, which stays as each repository has it; not a tidy-up tool that acts on marks, which is a later record if wanted; not any checkpoint, decisions log or Project note.

## Current state

No working-area file carries a mark by rule. The only marks that exist are the two `mark.toml` sidecars the `mark-tidy` run wrote beside the rebuilt `skill-graph` and `skill-map` HTML on 2026-10-14, by hand and ahead of the rule. Neither `ki-delegation` nor `ki-diagrams` mentions marks on working files. The record is captured at Next as a deliver record and is not yet planned to Ready.

## Steps

- [ ] Settle the sidecar's name and field names and the front-matter field names, and record them in Discussion, checking the two hand-written `mark.toml` files against the choice.
- [ ] Add the mark rule to the `ki-delegation` background-run standard and its rubric catalogue, and regenerate `rubric.md`.
- [ ] Add the working-folder sidecar and the receipt fields to the `ki-diagrams` diagrams standard and its rubric catalogue, and regenerate `rubric.md`.
- [ ] Make the exporter or the finalize wrapper write the fields into the delivery receipt, with a boundary test.
- [ ] Reword the two SKILL.md summaries where they list what the standards cover.

## Files touched

- `skills/governance/ki-delegation/references/standards-background-runs.md`
- `skills/governance/ki-delegation/references/rubric.md` (regenerated)
- `skills/governance/ki-delegation/SKILL.md`
- `skills/governance/ki-diagrams/references/standards-diagrams.md`
- `skills/governance/ki-diagrams/references/rubric.md` (regenerated)
- `skills/governance/ki-diagrams/SKILL.md`
- `skills/governance/ki-diagrams/scripts/export-svg.ts` and `export-svg.test.ts`, if the receipt fields are written there

## Verify

- `bun run test` and `bunx tsc --noEmit` pass.
- `ki repo audit --skill ki-delegation` and `ki repo audit --skill ki-diagrams` report no failure.
- `ki dev skill rubric ki-delegation` and `ki dev skill rubric ki-diagrams` report rubric publication current.
- A diagram rebuilt by the documented route leaves a sidecar and a receipt that both name the thread, the run and agent or session, and the time.

## Dependencies / blocks

Depends on nothing recorded. The thread-working rules this rule joins are already in the `ki-delegation` background-run standard. Blocks nothing recorded; a later tidy-up tool that reads marks would depend on this record.

## Documentation impact

### Decision Records

None. The rule is Kris's `MARK-RULE` answer, recorded in Context; it is a working-area convention carried by two standards, not a durable policy needing its own record.

### Specifications

None. No accepted behaviour is defined for working-area files.

### Guides

The `ki-delegation` background-run standard and the `ki-diagrams` diagrams standard each gain the rule in their own terms; the two SKILL.md summaries follow.

### Roadmap

No follow-on record is opened by capture. A tidy-up tool acting on marks, if wanted, would be a separate record.

## Discussion

### What a mark is for

A mark answers three questions about a working file without opening a transcript: whose is it, is the writer still around, and is it the current copy. The thread name routes a question to the right owner-facing thread; the run and agent, or the session, names what to check in `ki agent status` or the session list before touching the file; the time orders rival copies. A mark is not provenance for committed work, which Git carries, and it says nothing about retention, which each working subarea's own rule sets.

### Forms

- **Markdown:** fields in the file's front matter, so a note written into `+/_DESIGN/` or `+/_TRADES/` is marked without a second file.
- **A folder of non-Markdown output:** one small sidecar at the folder root. The hand-written example is `mark.toml` with `thread`, `run`, `agent` and `written_at`, plus `rebuilt_from` naming the committed source; the plan settles whether that is the shape to keep.
- **The `ki-diagrams` receipt:** the same fields inside the delivery receipt, so a diagram's evidence and its mark travel together.

### Open questions

- Whether a coordinating thread working interactively writes `session` where a background run writes `run` and `agent`, or whether one `writer` field with a stated form covers both.
- Whether the sidecar is TOML, which `ki-authoring` governs alongside Markdown, or a Markdown file with front matter only, so that one form serves both cases.
