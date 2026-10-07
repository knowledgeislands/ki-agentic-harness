---
id: KI-HARNESS-REV-011
area: REV
title: Review harness automation
kind: deliver
purpose: governance
project: baseline-rollout
component: keystone
status: cancelled
resolution: obsolete
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-10-03T02:26:59Z
updated_at: 2026-10-07T17:20:40Z
---

# KI-HARNESS-REV-011: Review harness automation

## Goal

Make every compatible source Harness periodically examine whether more of its skill AUDIT and CONFORM contract can be mechanical, while preserving genuine judgment and safe repair boundaries.

## Context

The owner asked for an aggressive recurring review across Harnesses, alongside source-refresh learning. The canonical Harness now includes this pass in its [monthly engineering-alignment definition](../housekeeping/KI-HARNESS-HK-001-engineering-alignment-review.md), and `ki-skills` [REFRESH](../../skills/keystone/ki-skills/SKILL.md) and [REVIEW](../../skills/keystone/ki-skills/references/mode-review.md) ask for it. The shared `ki-repo` REVIEW checklist routes repeatable checks into owning mechanical rubrics. None of these changes establishes that another compatible source Harness has adopted a recurring review or records its result.

## Boundary

In scope: one judgment criterion in `ki-repo-harness` that expresses the portable obligation, satisfied by any existing recurring review definition in the Harness that covers the mechanicalisation pass and has a recorded result, plus the matching standard paragraph.

Out of scope: a mandated schedule, template or new housekeeping definition; a mechanical check of a definition's mere presence, which would not establish that the review happened or that its conclusions were sound; changing another Harness repository, whose adoption is its own work after this criterion publishes; and treating a deterministic AUDIT violation as an automatically safe CONFORM repair or converting an interpretive criterion into a proxy check.

## Current state

`ki-repo-harness`'s `LONG` family (`skills/repo-structure/ki-repo-harness/scripts/rubric/items/longevity.ts`) holds only `LONG-1`, the refresh-path judgment. `standards-compatible-harness.md` has no recurring-review paragraph. This Harness satisfies the intended obligation through [KI-HARNESS-HK-001](../housekeeping/KI-HARNESS-HK-001-engineering-alignment-review.md), whose step 4 challenges judgment-only and hybrid criteria and diagnostic or guarded repairs, and whose `last-run` and `last-run-ref` record a completed run.

## Steps

- [ ] Add a short paragraph to `standards-compatible-harness.md`, within its refresh discipline: a source Harness keeps at least one recurring review whose procedure examines every applicable judgment-only or hybrid AUDIT criterion and report-only CONFORM result for mechanicalisation, and whose latest run records concrete candidates, routed follow-ups, or an evidenced no-change result; any existing definition with that coverage satisfies it.
- [ ] Add `LONG-2 [J]` "Recurring automation review" to `longevity.ts`, with evidence scope (the Harness's recurring work definitions and their latest recorded run), a prompt asking whether one definition covers the pass and has a recorded, evidenced result within its cadence, outcomes `conforming`, `coverage gap`, `no recorded result`, and guidance to extend an existing definition before creating a new one.
- [ ] Add `LONG-2` to the expected codes in `scripts/rubric/items/index.test.ts` and regenerate `references/rubric.md` with `ki dev skill rubric ki-repo-harness`.
- [ ] Record this Harness's own `LONG-2` outcome as `conforming` with HK-001 and its last recorded run as evidence, and capture through `ki-next` whether `ki-techne-harness` and other compatible source Harnesses need receiver trades.

## Files touched

- `skills/repo-structure/ki-repo-harness/references/standards-compatible-harness.md`
- `skills/repo-structure/ki-repo-harness/scripts/rubric/items/longevity.ts`
- `skills/repo-structure/ki-repo-harness/scripts/rubric/items/index.test.ts`
- `skills/repo-structure/ki-repo-harness/references/rubric.md` (generated)

## Verify

Acceptance criteria, each judgeable by someone who did not write this:

1. `LONG-2` publishes as a judgment criterion with no mechanical audit or conform action.
2. The standard and the criterion both say any existing recurring definition with the coverage and a recorded result satisfies it, and neither names a required file, template or schedule.
3. The criterion's outcomes distinguish a missing pass from a pass with no recorded result.
4. This Harness's outcome cites HK-001 and its recorded `last-run-ref`.

```bash
bun run test
bunx tsc --noEmit
ki dev skill rubric ki-repo-harness
ki repo audit --skill ki-repo-harness --progress never
ki repo audit --skill ki-skills --progress never
```

## Dependencies / blocks

None. Receiver adoption in other Harnesses follows as their own work.

## Documentation impact

### Decision Records

None.

### Specifications

`standards-compatible-harness.md` gains the recurring-review paragraph.

### Guides

None.

### Roadmap

Possible receiver work in other compatible source Harnesses, captured through `ki-next`.

## Cancelled

Approved by Kris on 2026-10-07 under decision 13 of the state-of-play design ("Yes please, lets reduce stuff": cancel and prune obsolete or ownerless records).

Its recurring-review criterion is already met by housekeeping template HK-001 (monthly engineering alignment). Prompting every skill refresh now belongs to the skill-refresh Project in `knowledgeislands/ki-arcadia-principal` (`Streams/Projects/skill-refresh.md`). No outstanding changes.

## Discussion

### Portable route

`ki-repo-harness` is the owner because the obligation applies to every compatible source Harness and to nothing else; `ki-skills` REFRESH and REVIEW already describe how to do the pass, and the stock housekeeping review is one way, not the only way, to schedule it. A judgment criterion is chosen over a mechanical one because the useful outcome is evidenced periodic consideration of every applicable judgment-only or hybrid criterion and report-only repair, with concrete assertions, failing cases, safe-repair boundaries, or an evidenced no-change result, and that cannot be read from file presence.
