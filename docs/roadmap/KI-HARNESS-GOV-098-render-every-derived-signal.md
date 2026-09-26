---
id: KI-HARNESS-GOV-098
area: GOV
title: Render every derived signal
theme: governance-consistency
horizon: triage
status: draft
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-09-26T12:39:00Z
updated_at: 2026-09-26T12:39:00Z
---

# KI-HARNESS-GOV-098: Render every derived signal

## Goal

A count a view reports and the rows that view renders agree, so a reader who is told something was raised can find it.

## Context

Raised by `apps-observatory` on 2026-09-25 under `KI-OBS-VIS-004`, which owns the instance. That repository composes an attention surface from signals each instrument derives about its own subject, and each instrument's view both renders its subjects as rows and reports how many signals it raised.

One signal kind broke the correspondence. Four of the five structural checks over Decision Records name a record as their subject, so each attaches to a row. The fifth — a serial run that is not contiguous from `001` — has a _run_ as its subject, not a record, so it had no row to attach to. The summary counted it; the outline showed it nowhere. The defect surfaced only because a test asserted the on-screen count, which read `2 raised` against one visible tag.

The general shape: a derivation whose subject space is wider than the view's row space produces signals that are counted and invisible. The count is the honest part and the view is the lie, which is the worse way round — a reader who trusts the count goes looking and concludes the tool is broken, and a reader who trusts the rows concludes nothing was raised.

## Boundary

In scope: whether the `ki-repo` REVIEW checklist gains a question about it, and in which lens.

Out of scope: `KI-OBS-VIS-004`, which fixed its instance by rendering a separate line for signals whose subject is not a row and recorded the rule in its own `AGENTS.md`; and the design of any particular view.

## Discussion

The nearest existing lenses each miss it. `Contracts and interfaces` (`skills/keystone/ki-repo/references/mode-review.md:258`) governs what crosses a boundary, and the contract here was correct — the signal was well-formed and carried its subject honestly. `Duplication and reuse` at `:310` is about second sources of truth, and there is only one source here. The failure is a _completeness_ relation between two projections of the same evidence, which no current question asks about.

Candidate wording, for `Contracts and interfaces` or `Human use and configuration` (`:269`): _Where a view reports a count derived from evidence, every item in that count has somewhere in that view to appear; a derivation whose subject space is wider than the view's rows is rendered somewhere else rather than only counted._

Against adding it: it is narrow, firing only on views that both aggregate and enumerate the same evidence. The checklist prefers deleting a question that never fires. In favour: the class is wider than the phrasing suggests — any summary line, badge count, or dashboard tile over a subject space its own table does not cover has this defect, and it is invisible to type-checking, to tests that assert rows, and to tests that assert counts. Only a test asserting _both against each other_ catches it, which is itself the reviewable behaviour.

The evidence is cheap, which is the test `mode-review.md:390` sets for keeping a question: assert the reported count equals the rendered count for a fixture that exercises every subject kind the derivation can produce.

- `KI-OBS-VIS-004` in `apps-observatory` owns the instance and its fix. This record owns the reusable rule, because the REVIEW checklist lives here and that repository cannot change it.
- [KI-HARNESS-GOV-096](KI-HARNESS-GOV-096-detect-zero-match-generators.md) is the neighbouring case from the data side: an empty result that cannot be distinguished from a healthy run. This one is a non-empty result that cannot be found.
