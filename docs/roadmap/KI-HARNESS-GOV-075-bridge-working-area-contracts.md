---
id: KI-HARNESS-GOV-075
area: GOV
title: Bridge working-area contracts
theme: governance-consistency
horizon: now
status: in-progress
blocks: []
blocked_by: []
baseline_ref: fc2e055568420e7950f2db3ca40a0343c229cda1
created_at: 2026-09-18T04:25:43Z
updated_at: 2026-09-18T04:34:00Z
---

# Bridge Working-Area Contracts

## Goal

Provide one bounded transition revision of `ki-repo` that audits both the v0.3.6 generic working-area README pair and the current canonical pair, allowing `tools-ki` to publish a candidate that remains governable by both the released and candidate executables.

## Context

Released `ki` v0.3.6 pins Harness commit `65a223ca9c6d6f8f5b9b48c52e121f1e412d7e71`. Its `WORK-1` audit requires the earlier exact `+/README.md` and `-/README.md` bytes. Current Harness `WORK-1` requires the revised direction-and-retention wording. [KI-TOOL-CLI-074](https://github.com/knowledgeislands/tools-ki/blob/main/docs/roadmap/KI-TOOL-CLI-074-restore-release-governance-compatibility.md) cannot construct a release candidate that both executables govern until one immutable Harness revision accepts the two exact generations.

## Boundary

This item changes only `WORK-1` audit acceptance for the two generic working-area READMEs. The current README templates remain the sole canonical CONFORM output and the portable standard remains the desired current contract. The transition accepts only the exact v0.3.6 predecessor bytes; arbitrary drift, unsafe paths, missing files, and specialist subareas remain unchanged failures. It adds no parser fallback, public command alias, or general legacy policy. Removing the predecessor acceptance after the release cutover requires separate governed work.

## Current state

`workingAreaOutcomes` compares each README to one current canonical string. The session proposal already writes only the current canonical strings. Existing tests prove current creation, drift repair, and unsafe-path refusal, but do not exercise a bounded predecessor generation.

## Steps

- [x] Represent the exact v0.3.6 predecessor content as an audit-only accepted generation without changing current canonical templates.
- [x] Accept current and predecessor README pairs while continuing to reject arbitrary or partially corrupted content.
- [x] Prove CONFORM still creates and repairs to the current canonical templates.
- [x] Record the temporary transition explicitly in the `ki-repo` working-area standard.
- [x] Run focused `ki-repo` rubric tests, the complete Harness gates, and native `ki-repo` and roadmap audits.
- [ ] Return the immutable Harness commit and archive digest to `KI-TOOL-CLI-074`.

## Files touched

- `skills/keystone/ki-repo/scripts/rubric/contexts/repository.ts`
- `skills/keystone/ki-repo/scripts/rubric/contexts/repository.test.ts`
- `skills/keystone/ki-repo/references/standards-repository.md`
- `docs/roadmap/KI-HARNESS-GOV-075-bridge-working-area-contracts.md`
- `docs/roadmap/_ISSUES.md`

## Verify

```sh
bunx vitest run skills/keystone/ki-repo/scripts/rubric/contexts/repository.test.ts
bun run test
bunx tsc --noEmit
ki repo audit --skill ki-repo --repo .
ki repo audit --skill ki-work-roadmap --repo .
```

## Dependencies / blocks

The exact predecessor bytes are available from immutable Harness commit `65a223ca9c6d6f8f5b9b48c52e121f1e412d7e71`. This item blocks `KI-TOOL-CLI-074`; it has no other dependency and does not authorise a `tools-ki` release by itself.

## Documentation impact

### Decision Records

None. This is a bounded execution transition under the existing working-area decision and does not alter the durable architecture.

### Specifications

None. The canonical repository contract remains unchanged.

### Guides

None. No user procedure or public command changes.

### Roadmap

The `ki-repo` working-area standard and this record will name the exact audit-only transition and its removal condition.

## Discussion

The bridge must remain visibly temporary. Audit compatibility is sufficient for the release sequence because `tools-ki` will deliberately carry the predecessor README pair in its bridge candidate, then restore the current pair after the new executable is released and installed by CI. Keeping CONFORM output current avoids silently re-establishing the predecessor contract elsewhere. No delegation is planned: checker, fixtures, standard wording, and release handoff form one small coupled change.
