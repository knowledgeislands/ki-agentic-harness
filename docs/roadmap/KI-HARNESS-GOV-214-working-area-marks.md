---
id: KI-HARNESS-GOV-214
area: GOV
title: Working-area marks
project: ways-of-working
component: governance
status: triage
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-10-18T08:55:30Z
updated_at: 2026-10-18T17:11:34Z
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

## Discussion

### Forms

Markdown carries the mark in front matter; a folder of non-Markdown output carries one small sidecar at its root (the hand-written example is `mark.toml` with `thread`, `run`, `agent`, `written_at` and `rebuilt_from`); the `ki-diagrams` receipt carries the same fields. A mark is not provenance for committed work, which Git carries, and says nothing about retention.

### Steps carried for planning

Check the two hand-written `mark.toml` files against the settled names below; add the rule to the `ki-delegation` standard and rubric; add the sidecar and receipt fields to the `ki-diagrams` standard and rubric; make the exporter or finalize wrapper write the fields into the delivery receipt, with a boundary test; reword the two SKILL.md summaries. Files: `skills/governance/ki-delegation/references/standards-background-runs.md`, `rubric.md` and `SKILL.md`; `skills/governance/ki-diagrams/references/standards-diagrams.md`, `rubric.md`, `SKILL.md`, and `scripts/export-svg.ts` with its test if the receipt fields are written there. Verify: `ki repo audit --skill ki-diagrams` and `ki dev skill rubric ki-diagrams` join the gates, and a diagram rebuilt by the documented route leaves a sidecar and a receipt naming the work, the run and agent or session, and the time.

### Field names, settled for now

Kris settled the names on 18 October 2026 in the ways-of-working decisions log, 17:59 BST owner answers: "Mark feels, let's go with it for now" (MARK-FIELDS a), "for now"). The first field is `work`, the work id the work model uses, in place of the hand-written `thread`; a background run writes `run` and `agent`, and an interactive session writes `session` instead; a folder's sidecar stays TOML, `mark.toml`. The two hand-written `mark.toml` files under `+/diagrams/` move from `thread` to `work` when the rule lands. The time field's name and whether `rebuilt_from` stays are left to planning. Because the answer is "for now", the standard should state the names in one place so a later change touches one rule.
