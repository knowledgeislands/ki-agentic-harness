---
id: KI-HARNESS-GOV-075
area: GOV
title: Bridge working-area contracts
theme: governance-consistency
horizon: now
status: awaiting-review
blocks: []
blocked_by: []
baseline_ref: fc2e055568420e7950f2db3ca40a0343c229cda1
created_at: 2026-09-18T04:25:43Z
updated_at: 2026-09-18T05:22:00Z
---

# Bridge Working-Area Contracts

## Goal

Provide one bounded transition revision of `ki-repo` that audits both the v0.3.6 generic working-area README pair and the current canonical pair, allowing `tools-ki` to publish a candidate that remains governable by both the released and candidate executables.

## Context

Released `ki` v0.3.6 pins Harness commit `65a223ca9c6d6f8f5b9b48c52e121f1e412d7e71`. Its `WORK-1` audit requires the earlier exact `+/README.md` and `-/README.md` bytes. Current Harness `WORK-1` requires the revised direction-and-retention wording. [KI-TOOL-CLI-074](https://github.com/knowledgeislands/tools-ki/blob/main/docs/roadmap/KI-TOOL-CLI-074-restore-release-governance-compatibility.md) cannot construct a release candidate that both executables govern until one immutable Harness revision accepts the two exact generations.

## Boundary

Remote bridge CI exposed one further immutable predecessor contract: the exact v0.3.6 `tools-ki` `.gitignore`. This item therefore also accepts that one byte-exact repository-specific generation in AUDIT only. Current `.gitignore` composition remains the sole CONFORM output; arbitrary variants and other repositories still fail.

This item changes only `WORK-1` audit acceptance for the two generic working-area READMEs. The current README templates remain the sole canonical CONFORM output and the portable standard remains the desired current contract. The transition accepts only the exact v0.3.6 predecessor bytes; arbitrary drift, unsafe paths, missing files, and specialist subareas remain unchanged failures. It adds no parser fallback, public command alias, or general legacy policy. Removing the predecessor acceptance after the release cutover requires separate governed work.

## Current state

`workingAreaOutcomes` compares each README to one current canonical string. The session proposal already writes only the current canonical strings. Existing tests prove current creation, drift repair, and unsafe-path refusal, but do not exercise a bounded predecessor generation.

## Steps

- [x] Represent the exact v0.3.6 predecessor content as an audit-only accepted generation without changing current canonical templates.
- [x] Accept current and predecessor README pairs while continuing to reject arbitrary or partially corrupted content.
- [x] Prove CONFORM still creates and repairs to the current canonical templates.
- [x] Record the temporary transition explicitly in the `ki-repo` working-area standard.
- [x] Run focused `ki-repo` rubric tests, the complete Harness gates, and native `ki-repo` and roadmap audits.
- [x] Extend the bounded bridge to the exact predecessor `tools-ki` `.gitignore` after remote CI exposed the immutable FILES-6 mismatch.
- [x] Return the immutable Harness commit and archive digest to `KI-TOOL-CLI-074`.

## Files touched

- `skills/keystone/ki-repo/scripts/rubric/contexts/repository.ts`
- `skills/keystone/ki-repo/scripts/rubric/contexts/repository.test.ts`
- `skills/keystone/ki-repo/scripts/rubric/contexts/audit.ts`
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

## Review

### Delivered

Published transition Harness commit `bcdc991946a81bb59f207ee47dba24c138f60abb` on `main`; its codeload archive SHA-256 is `04247d3522b77ee884c30536a463a382de512a7cfbfc5a2654ee7c3ac22e5edf`.

### Summary of changes

- Added audit-only acceptance for the two exact v0.3.6 working-area README generations while leaving current CONFORM templates unchanged.
- Added audit-only acceptance for the exact predecessor `tools-ki` `.gitignore` bytes exposed by remote bridge CI, with arbitrary drift still failing.
- Documented the temporary transition and its removal condition in the repository standard.

### Verification

- The focused `ki-repo` suite passes 40 tests, including exact predecessor acceptance and one-byte-drift rejection.
- The complete Harness suite passes 728 tests across 133 files; TypeScript, Biome, and Markdown checks pass.
- `tools-ki` bridge CI run `35309585380`, v0.4.0 release run `35309891265`, and post-cutover run `35310148886` prove the immutable archive across the complete release sequence.

### Outstanding concerns

The predecessor acceptance is intentionally temporary. Remove it through separately governed Harness work only after the wider estate no longer needs those exact bytes.

### Post-change review

Current repository templates and CONFORM behaviour did not change. The exception is byte-exact, audit-only, repository-specific where necessary, tested against drift, and documented with a removal boundary.

### Mini recap

The Harness bridge enabled immutable v0.4.0 publication without weakening the current repository contract.

## Discussion

The bridge must remain visibly temporary. Audit compatibility is sufficient for the release sequence because `tools-ki` will deliberately carry the predecessor README pair in its bridge candidate, then restore the current pair after the new executable is released and installed by CI. Keeping CONFORM output current avoids silently re-establishing the predecessor contract elsewhere. No delegation is planned: checker, fixtures, standard wording, and release handoff form one small coupled change.
