---
id: KI-HARNESS-GOV-202
area: GOV
title: Skill-area stable stats badge
component: repo-structure
status: triage
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-10-16T21:51:55Z
updated_at: 2026-10-18T03:42:23Z
---

# KI-HARNESS-GOV-202: Skill-Area Stable Stats Badge

## Goal

The ten skill-area diagrams in `docs/diagrams/skill-area-*.html` show stable stats about each skill in place of the viewer's SRC badge, such as its rubric rule count, a code-size bucket and its reference count, with exact figures in the HTML detail where the viewer supports it, so that the badge tells a reader something about the skill.

## Context

Kris Brown asked for this in the skill-reviews thread on 14 October 2026, recorded as SRC-BADGE in that thread's [decisions log](https://github.com/knowledgeislands/ki-agentic-harness/blob/8c5b5575b03269df2d0e8a5014c000b427210123/+/_WORK_REVIEW/ki.regular.skill-reviews/decisions.md) (`b868812e`): "there might be a better thing to use as that box rather than SRC1 ... the amount of code that's in them, or the rubric rule sizes ... or some stats about the thing", resolved there as "stable stats (rubric rule count, code size bucket, reference count), exact figures in HTML detail if supported". On 16 October 2026 at 01:10 BST Kris approved capturing it as one unadopted record, priority left to the record. The SRC badge is still in all ten files on `main`, and no record carried it.

## Boundary

- In: the badge content for skill-area diagrams; the generator or diagram source that sets it; the ten regenerated files.
- Out: the vendored viewer itself beyond what its configuration allows; other diagram kinds.

## Discussion

Capture only; adoption, priority and plan belong to this repository. Questions for planning: whether the badge comes from the generator in `skills/repo-structure/ki-repo-harness/scripts/` or from the viewer's verified-source passport, and so whether a viewer change is needed; and which stats stay stable enough not to churn the diagrams on every edit.
