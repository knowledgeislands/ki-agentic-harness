---
id: KI-HARNESS-GOV-222
area: GOV
title: Timeline and calendar skill
project: observatory
component: governance
status: triage
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-10-19T07:48:44Z
updated_at: 2026-10-19T07:48:44Z
---

# KI-HARNESS-GOV-222: Timeline and Calendar Skill

## Goal

A harness skill governs the dated things a knowledge base keeps, its key dates, due dates and milestones, as one common approach extracted from the 5G Emerge phase 3 calendar component: each knowledge base keeps its dated items, may publish one or more calendar sets that people can subscribe to, and states each item's busy status.

## Context

Kris Brown gave DIAGRAM-GANTT on 19 October 2026 in the Observatory work, logged in the [Observatory decisions log](/Users/krisbrown/workspaces/knowledge-islands/ki-principal/+/_WORK/ki.observatory/decisions.md):

> In phase 3, the 5G merge phase three that is we created a calendar component, which I think is really useful and I definitely think that's something we should have in each knowledge base. Effectively, it should come up with one or more sets of calendars that can be subscribed to ... regardless of that fact as to whether or not we actually expose them as calendars, we should definitely follow its diagramming or its calendar components. I wonder if that's something that can be extracted out into a common approach. It might even need its own skill to deal with that like a timeline skill ... I'm wondering that's possibly something to hand off out of this thread into another. ... we need to have I'll be clear about what the busy status is for the calendar item ... calendar needs its order or timeline or something like that, needs its own thing. It's also like for due dates and milestones and things like that. I think legal would massively help with that. Probably my personal stuff could do with it. And definitely things like 5G merge could do with it.

The read-back taken the same day keeps the legal gantt as it is meanwhile, not forced into Archify, and hands timelines and calendars out of the Observatory thread as their own skill area.

The source component lives in `apps/site` of the 5G Emerge phase 3 repository (`~/workspaces/humans-not-robots/5g-emerge-phase3`), read-only here:

- `src/_data/calendars.json5` is the registry: six calendars, each with a permanent `id`, title, group, short code and colour slot, and entries with a permanent `id`, `start` at day, month or year precision, an inclusive `end`, a `kind` (milestone, deadline, review, meeting, event), a firmness `status` (confirmed, planned, target, proposed, to-confirm) with the source's own words, and source citations. It never invents a date: an undated item stays an open question.
- `lib/ics.ts` writes one RFC 5545 feed per calendar with no dependency: all-day events only, UIDs from the permanent entry ids, month entries spanning their month, year entries left off the feed, a 12-hour refresh hint, and a valid empty feed so people can subscribe before the first date.
- `lib/calendars.ts` and `src/content/tools/calendars/` render a page per calendar and a landing page with List, Months and Runway views, and give webcal, Google, Outlook 365 and Outlook.com subscribe links; `tests/calendars.test.ts` covers it.
- Busy status is not modelled: every event is written `TRANSP:TRANSPARENT`, so it shows as free. Kris's busy-status improvement adds a per-item busy status, mapped to `TRANSP` and the client busy-status properties, and would need times or a stated all-day blocking rule where an item blocks time.

The 5G Emerge programme timeline milestones under `src/_data/programme-model/timeline/` are a second, separate date list beside the registry; extraction should decide whether one source feeds both.

## Boundary

- In: a harness skill, with its standard, rubric and audit, for kept dated items, calendar sets, subscribable feed publication and per-item busy status, extracted from the 5G Emerge component into a reusable shape.
- In: candidate names under [ADR-KI-HARNESS-SKILLS-003](../decisions/ADR-KI-HARNESS-SKILLS-003-dependency-order-for-multi-skill-composition.md), whose concern is plural for a collection of kept things: `ki-calendars`, `ki-timelines` or `ki-key-dates`.
- In: first adopters legal-principal, whose gantt sits in its `FR Timeline to FDR` working note, personal-principal and 5G Emerge.
- Out: changing the 5G Emerge component or the legal gantt before the skill exists; Archify diagram work, which `ki-diagrams` owns.

## Discussion

Open questions for planning: where the subscription feeds are homed and served, a knowledge base's own site, the Observatory or elsewhere, and how a private base publishes without exposing its dates; whether timeline views and calendar feeds are one skill or a skill and a view; the busy-status vocabulary and its default; whether the extracted code lives in the harness, `tools-ki` or a shared package. The harness owns priority and design.
