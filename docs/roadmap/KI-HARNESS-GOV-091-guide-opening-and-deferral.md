---
id: KI-HARNESS-GOV-091
area: GOV
title: Guide opening and deferral
theme: governance-consistency
horizon: triage
status: draft
blocks: []
blocked_by: []
transferred_from: ki-website
baseline_ref: null
created_at: 2026-09-24T19:05:00Z
updated_at: 2026-09-24T19:05:00Z
---

## Goal

This repository decides whether two editorial rules KI Website now enforces on its published pages belong in `ki-guides` as a standard for every repository, or nowhere: a guide opens by saying what the reader will be able to do, and no link text stands in for the content the page owes.

## Context

KI Website rewrote its published guidance this week. The corpus it started from read as a routing layer over other repositories' work — seventy links into GitHub across thirty-five pages, six of them with the literal anchor text `The full guide`, and a provenance table as the last thing on nearly every page. A reader's final impression was that the real material was somewhere else.

Two rules came out of that, both now mechanical in `apps/site/scripts/verify-guides.ts` there and stated in that repository's `project-guides.md`:

1. **An opening claim.** Prose before the first `##`, saying what the reader will be able to do, at least 120 characters of it. A page that opens by describing itself — "this page summarises the material in X" — has told the reader nothing they can act on.
2. **No deferral in link text.** Link text may not be a hand-off phrase: `the full guide`, `see the README`, `full documentation`, `read more`, `learn more`, or a bare `here`, `docs`, `documentation`, `README`. A link is fine, and often right, when it cites a fact the page has already stated. It is wrong when it is the place the answer lives. The test is whether the link survives as a fact rather than as a destination — remove it, and the sentence should still say something true and useful.

This repository is not merely a consumer of the answer, which is what makes the question worth an identifier here rather than a conversation. `ki-guides` lives in this repository, so a decision to adopt either rule is a standard change every repository inherits, and a decision to refuse is equally a decision for all of them.

The third rule from the same review has already landed. `GUIDE-4` and `ROUTE-3` hold a guide inside its own collection and grade that obligation by the reader's distance from the repository. That rule is not revisited here; it is the precedent for how these two would land if adopted — a mechanical item where the check is a check, a judgment item where it is a reading.

`KI-TOOL-CLI-083` asks the same question of `tools-ki` on its own evidence, and `KI-TOOL-CLI-078` is consolidating that collection. Neither blocks this, and this does not block them: if `ki-guides` adopts a rule, `tools-ki` inherits it, and if it does not, that repository may still adopt either locally.

## Boundary

This item decides and records. It does not commit `ki-guides` to either rule, and it does not rewrite this repository's `docs/guides/` beyond what an adopted rule requires of the four guides there.

The evidence bar is the reason for the caution. Both rules were derived from one corpus under one set of pressures — a public website, where a reader who follows a link off-site is usually lost. A repository guide read in a checkout is not under that pressure, and the no-deferral rule in particular reads as a poor fit for a repository whose `README.md` is a real document a reader should open. A standard that binds every repository wants more than one corpus behind it.

It does not touch `docs/decisions/` or the skills' own `references/`, which are not guides.

## Discussion

### Which of the two is likelier to survive

The opening-claim rule looks portable. It is about whether the first paragraph is worth reading, which does not depend on where the guide is read, and it is mechanical without being brittle — a character floor on prose before the first heading.

The no-deferral rule is the interesting one. Its underlying test is sound anywhere: does the link carry a fact or a destination? But the mechanical form is a phrase list, and a phrase list is a proxy that will refuse honest sentences and pass dishonest ones. `GUIDE-4` already removes the worst case for a repository guide by refusing the escaping link outright, which means the phrase that remains is either pointing at code or at a sibling — both places a reader can be sent without losing the thread.

### Why this arrives as a record rather than a conversation

The handoff was decided in `KI-WEB-SITE-027` and recorded in that item's `## Review`, which was the right place at the time and would not have survived the record being accepted and pruned. A deferred concern that lives only inside an accepted record has a lifespan bounded by the prune, so this one has an identifier in the repository that would act on it.

### Origin

`knowledgeislands/ki-website`, `KI-WEB-SITE-027`. Non-blocking in both directions.
