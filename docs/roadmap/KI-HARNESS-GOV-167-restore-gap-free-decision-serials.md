---
id: KI-HARNESS-GOV-167
area: GOV
title: Restore gap-free decision serials
kind: deliver
purpose: upkeep
initiative: platform-foundations
component: governance
horizon: now
status: in-progress
blocks: []
blocked_by: []
baseline_ref: 35e36d4ef8c46aebfe76d24aaad7b1fd5358d210
created_at: 2026-10-09T07:40:00Z
updated_at: 2026-10-09T08:00:00Z
---

# KI-HARNESS-GOV-167: Restore gap-free decision serials

## Goal

Decision Record serials are gap-free again: each prefix-and-scope series starts at `001` and is contiguous, records are living documents refined in place, and a real removal or reclassification renumbers the series and sweeps every citation in the same change.

## Context

Kris decided on 2026-10-09 (GOV-020 owner decision 6) that decision-record serials must be gap-free, and that Decision Records are living documents: refine and update existing records in place so every key decision stays visible, which keeps gaps rare. This reverses the gaps-allowed outcome of KI-HARNESS-GOV-099 (done and pruned; harness commits `3455e0f0`, `8187a07d`, `15f84f7a`), which [ADR-KI-HARNESS-SKILLS-018](../decisions/ADR-KI-HARNESS-SKILLS-018-decision-record-serials-may-contain-gaps.md) records.

## Boundary

In scope: amending ADR-KI-HARNESS-SKILLS-018 in place, the `ki-decision-records` standard and CONSOLIDATE mode, a new contiguity rubric item under a fresh code, the INDEX-8 wording, tests and the generated rubric, and a read-only territory-wide check of which repositories would now fail.

Out of scope: renumbering any record in another repository; `KI-OBS-VIS-004` in `apps-observatory`, which may keep its contiguity check, so no trade is raised.

## Current state

Verified on `main` at `35e36d4e`. `standards-decision-records.md:28` issues serials from a high-water mark, never reuses or reassigns them, permits gaps, and leaves a reclassified record's old serial vacant. `:176` says an INDEX-8 conflict is settled by numbering before issue, never by renumbering; `INDEX-8` in `scripts/rubric/items/index-records.ts:182`-`:188` says the same. `FILENAME-3` is retired: `scripts/rubric/items/filename.ts` carries `FILENAME-0`, `-1`, `-2` and `-4`, and `scripts/rubric/contexts/decision-records.ts` computes only `duplicateIds`. `decision-records.test.ts:334` pins that a gap produces no `FILENAME` finding. `references/mode-consolidate.md:21` says "Do not renumber surviving records". `SKILL.md:73` still describes the shared-record mirror exclusion from a local serial series. ADR-KI-HARNESS-SKILLS-018 states the gaps-allowed rule and is indexed at `docs/decisions/README.md:88`.

## Steps

- [ ] Amend ADR-KI-HARNESS-SKILLS-018 in place: retitle it "Decision-record serials are gap-free and records are living", rename the file to match, and state that serials start at `001` and are contiguous, that records are refined, merged or superseded in place so every key decision stays visible, and that a real removal or reclassification renumbers the series and sweeps every citation in the same change. Update its index entry and every link to the old filename.
- [ ] Rewrite the `NNN` bullet in `standards-decision-records.md`: serials start at `001` and are contiguous; prefer amending, merging or superseding in place over adding records; a removal or reclassification renumbers the remaining series and sweeps every citation in the same change. Restore the shared-record mirror's serial-continuity exclusion, matching `SKILL.md:73`, and the same clause under Frontmatter.
- [ ] Revert the INDEX-8 wording in the standard and in `index-records.ts` so that a reveal-order conflict is fixed by renumbering the affected records and their citations.
- [ ] Align `mode-consolidate.md`: a merge or retirement renumbers the remaining series and sweeps every citation in the same change, and a scope correction renumbers the old series.
- [ ] Add `FILENAME-5` "Contiguous serial series" at `FAIL`, since contiguity is a requirement of the standard; never reuse `FILENAME-3`. Restore the `serialGaps` evidence, including the shared-mirror exclusion, and replace the gaps-permitted test with tests for a gap, a contiguous series, an `XXX` exemption and the shared-mirror cases. Update the criterion list and the `ki-skills` remediation-inventory counts.
- [ ] Regenerate `references/rubric.md`.
- [ ] Run a read-only territory-wide check of which repositories' decision collections now have a gap, and list them in the review; renumber nothing outside this repository.

## Files touched

- `docs/decisions/ADR-KI-HARNESS-SKILLS-018-*.md` (renamed) and `docs/decisions/README.md`
- `skills/governance/ki-decision-records/references/standards-decision-records.md`, `mode-consolidate.md` and generated `rubric.md`
- `skills/governance/ki-decision-records/scripts/rubric/items/filename.ts`, `index-records.ts` and `index.test.ts`
- `skills/governance/ki-decision-records/scripts/rubric/contexts/decision-records.ts` and its test
- `skills/keystone/ki-skills/scripts/internal/remediation-inventory.test.ts`

## Verify

1. The standard requires contiguous serials from `001`, prefers in-place amendment, and renumbers with a citation sweep on removal or reclassification; no sentence permits gaps.
2. A fixture with `ADR-EXAMPLE-001` and `ADR-EXAMPLE-003` fails `FILENAME-5`; a contiguous series and an `XXX` record pass.
3. This repository's decision collection passes `FILENAME-5`.

```bash
bun run test
bunx tsc --noEmit
ki repo audit --skill ki-decision-records
ki repo audit --skill ki-skills
```

## Dependencies / blocks

None. KI-HARNESS-GOV-166 (triage) would later remove the shared-record exclusion with the rest of `shared_record`.

## Documentation impact

### Decision Records

ADR-KI-HARNESS-SKILLS-018 is amended in place rather than joined by a new record.

### Specifications

`standards-decision-records.md` and `mode-consolidate.md`, as above.

### Guides

None.

### Roadmap

None.

## Discussion

Captured from the GOV-020 state-of-play rollout; Kris's decision is the approval of this outcome.

`apps-observatory` may keep the serial-contiguity check it built under `KI-OBS-VIS-004`, which now agrees with the standard; no trade is raised.

`FILENAME-5` is `FAIL` because the rubric reserves `WARN` for recommended criteria and the standard now requires contiguity. Repositories with a gap therefore fail their Decision Records audit until their owners renumber.
