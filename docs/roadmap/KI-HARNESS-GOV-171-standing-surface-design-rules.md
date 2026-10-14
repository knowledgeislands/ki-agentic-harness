---
id: KI-HARNESS-GOV-171
area: GOV
title: Standing-surface design rules
kind: deliver
status: cancelled
resolution: rejected
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-10-10T16:49:02Z
updated_at: 2026-10-14T13:44:24Z
---

# KI-HARNESS-GOV-171: Standing-Surface Design Rules

## Goal

`ki-tokenomics` tells repository owners how to keep their always-loaded instructions small, not only how large they may be: one routing authority, resolved lessons carried in repository guidance rather than in runtime path memory or a load-time note, and two points at which to review the standing surface before it outgrows its budget.

## Context

Arcadia Principal is retiring its Claude-specific knowledge-base notes, so that the island holds no runtime-specific notes. One of them described Claude as a tool, including the token cost of standing context. Arcadia deletes that note whatever happens here; this record carries the points it held that `ki-tokenomics` does not yet state. `ki-tokenomics` already owns the component budgets (`instructions = 2500` and the rest) and standing-surface attribution, but its standard says nothing about how to design a surface to stay within them.

The points, in runtime-neutral terms:

- **One routing authority.** Keep a single routing authority for a repository: a skill defers to the root instructions instead of restating them, because every restatement is standing context paid for twice and a source of drift.
- **Resolved lessons in repository guidance, not in path memory or a load-time note.** Carry resolved operational lessons into the repository's own guidance (root `AGENTS.md`, the owning skill, or the knowledge base), where every runtime finds them, rather than in a runtime's path memory or in a note that every session must load. Kris decided on 12 October 2026 in the state-of-play run to 'move path memory into KBs/projects/AGENTS.md, stop relying on path memory', which reverses the point as Arcadia first recorded it.
- **Review the instructions file as it nears its budget.** Arcadia's former Claude note used about 10,000 bytes, roughly 2,500 tokens, which is the `instructions` default; growth past that point was the signal to prune or move material on demand.
- **Ask before adding a permanent always-loaded section.** Before adding one, ask whether the material could be read only when it is needed, through a skill or an on-demand note.

This is a non-blocking handoff from Arcadia Principal. It blocks nothing in Arcadia or here.

### Claude adapter note

Merged from KI-HARNESS-GOV-172 on 12 October 2026. `ki-tokenomics-claude` should explain which Claude context layers load every time and which load only on demand or conditionally, so that an owner places a rule meant to hold every time in an always-on layer. As Arcadia recorded it in Cowork:

- The system prompt and project instructions are always on.
- The memory index is always loaded, but memory files are read only on demand, so rules held in them apply only conditionally.
- `CLAUDE.md` loads only when its folder is mounted.
- Skills load only when invoked.
- Hence a rule meant to hold every time belongs in an always-on layer.

Confirm the layering against current Claude Code behaviour before relying on it. The point explains where a rule should live rather than how much context it costs, so it may sit better as guidance than as an audit criterion.

## Boundary

- In scope: deciding whether these points belong in the `ki-tokenomics` standard, its educate mode, or guidance, and wording them runtime-neutrally; and the Claude adapter note on context-layer reliability above, merged from the former KI-HARNESS-GOV-172, in `ki-tokenomics-claude` guidance after confirming current Claude Code layer behaviour.
- Out of scope: changing the default budgets, any runtime adapter's evidence collection, and Arcadia's notes, which are already retired.
- If the two parts must stay in separate skills' changes, plan them as separate Steps within this record.

## Cancelled

Cancelled 2026-10-14 as rejected (parked): Kris Brown approved it on 14 October 2026 in the state-of-play thread's roadmap census ('RC-ALL: approve all; ways-of-working applies the harness part'). The record was a non-blocking handoff of design guidance not yet planned, and the relevance question it raises belongs to the skill-refresh Project's keep, merge or retire check. Its four runtime-neutral points, the Claude adapter note merged from KI-HARNESS-GOV-172 and Kris's 12 October 2026 instruction to 'move path memory into KBs/projects/AGENTS.md, stop relying on path memory' are kept as an idea in the skill-refresh Project (`ki-principal`, `Streams/Projects/skill-refresh.md`); Git history keeps the full record. It leaves no outstanding change.

## Discussion

### Placement

The first two points are design rules and may suit the standard or a judgement criterion; the last two are tending triggers and may suit educate-mode guidance rather than an audit criterion. The receiving owner decides.

### Adoption

On 12 October 2026 Kris approved the triage review's proposal as written (state-of-play run, 'TRIAGE-APPROVE (all 13 proposals)'): KI-HARNESS-GOV-172 merged into this record, adopted as `deliver / Next` (guidance), with the lessons point reworded to follow Kris's instruction that day to stop relying on path memory. Adoption grants no implementation, acceptance or remote authority.
