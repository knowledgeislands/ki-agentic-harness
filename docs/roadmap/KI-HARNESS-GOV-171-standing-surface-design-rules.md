---
id: KI-HARNESS-GOV-171
area: GOV
title: Standing-surface design rules
status: triage
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-10-10T16:49:02Z
updated_at: 2026-10-10T16:49:02Z
---

# KI-HARNESS-GOV-171: Standing-Surface Design Rules

## Goal

`ki-tokenomics` tells repository owners how to keep their always-loaded instructions small, not only how large they may be: one routing authority, lessons carried in memory rather than read at load time, and two points at which to review the standing surface before it outgrows its budget.

## Context

Arcadia Principal is retiring its Claude-specific knowledge-base notes, so that the island holds no runtime-specific notes. One of them described Claude as a tool, including the token cost of standing context. Arcadia deletes that note whatever happens here; this record carries the points it held that `ki-tokenomics` does not yet state. `ki-tokenomics` already owns the component budgets (`instructions = 2500` and the rest) and standing-surface attribution, but its standard says nothing about how to design a surface to stay within them.

The points, in runtime-neutral terms:

- **One routing authority.** Keep a single routing authority for a repository: a skill defers to the root instructions instead of restating them, because every restatement is standing context paid for twice and a source of drift.
- **Resolved lessons in memory, not in a load-time note.** Carry resolved operational lessons in the runtime's memory, where they are active without a read, rather than in a note that every session must load.
- **Review the instructions file as it nears its budget.** Arcadia's former Claude note used about 10,000 bytes, roughly 2,500 tokens, which is the `instructions` default; growth past that point was the signal to prune or move material on demand.
- **Ask before adding a permanent always-loaded section.** Before adding one, ask whether the material could be read only when it is needed, through a skill or an on-demand note.

This is a non-blocking handoff from Arcadia Principal. It blocks nothing in Arcadia or here.

## Boundary

- In scope: deciding whether these points belong in the `ki-tokenomics` standard, its educate mode, or guidance, and wording them runtime-neutrally.
- Out of scope: changing the default budgets, any runtime adapter's evidence collection, and Arcadia's notes, which are already retired.

## Discussion

### Placement

The first two points are design rules and may suit the standard or a judgement criterion; the last two are tending triggers and may suit educate-mode guidance rather than an audit criterion. The receiving owner decides.
