---
id: KI-HARNESS-GOV-111
title: Separate release readiness
area: GOV
theme: governance-consistency
horizon: now
status: awaiting-review
blocks: []
blocked_by: []
baseline_ref: 0adc528bbe470db32f3c83f9da7facd32ad996c5
created_at: 2026-09-26T17:42:44Z
updated_at: 2026-09-26T17:47:16Z
---

## Goal

Ordinary MCP repository audits distinguish a healthy development checkout from broken source-release evidence, so a warning identifies actionable drift rather than the expected absence of a release tag on development HEAD.

## Context

`DIST-1` currently reports the absence of the annotated `v<SemVer>` tag at HEAD as a WARN violation in every otherwise valid development checkout. That warning is correct for release readiness but noisy in the ordinary repository audit, where it obscures new failures and weakens the pass signal.

The rubric contract already supports neutral `INFO` outcomes. The approved change keeps one source-release criterion and separates the expected development state from actual invalid evidence without weakening the release judgment.

## Boundary

The user approved this item and its implementation on 26 September 2026.

Invalid package versions, missing build scripts, unsafe or untracked lockfiles, invalid repository identity, and invalid HEAD commit evidence remain WARN violations. A matching lightweight or otherwise malformed release marker also remains a WARN violation. Only an otherwise valid development HEAD with no matching release tag becomes INFO.

The release-readiness judgment continues to require an annotated `v<SemVer>` tag. This item does not create or move tags, cut a release, change package versions, alter generic rubric-host semantics, edit MCP repositories, or touch active Paperclip worktrees.

## Current state

The source-distribution standard treats every development checkout as not release-ready at WARN level. The structured `DIST-1` item returns a tag `VIOLATION` whenever HEAD lacks the matching annotated tag, even after all ordinary source evidence passes. Focused item tests do not yet distinguish development INFO from tagged-release PASS.

## Steps

- [x] Amend the MCP source-distribution standard to distinguish ordinary development evidence, malformed release evidence, and release-ready evidence.
- [x] Make `DIST-1` return INFO only for an otherwise valid HEAD with no matching release tag, while retaining WARN violations for invalid source evidence and malformed release markers.
- [x] Add focused rubric tests proving development HEAD INFO, annotated release PASS, and invalid evidence remains violation-level input to the WARN criterion.
- [x] Regenerate the readable `ki-repo-mcp` rubric publication from the structured catalogue.
- [x] Run focused tests, rubric publication verification, TypeScript validation, and the `ki-repo-mcp`, `ki-skills`, and roadmap audits.

## Files touched

- `skills/repo-structure/ki-repo-mcp/references/standards-mcp-distribution.md`
- `skills/repo-structure/ki-repo-mcp/scripts/rubric/items/distribution.ts`
- `skills/repo-structure/ki-repo-mcp/scripts/rubric/items/distribution.test.ts`
- `skills/repo-structure/ki-repo-mcp/references/rubric.md`
- this work record

## Verify

- `bun test skills/repo-structure/ki-repo-mcp/scripts/rubric/items/distribution.test.ts skills/repo-structure/ki-repo-mcp/scripts/rubric/contexts/mcp.test.ts`
- `ki dev skill rubric ki-repo-mcp`
- `bunx tsc --noEmit`
- `ki repo audit --skill ki-repo-mcp --repo ../mcp-housekeeping-claude --concise --progress never`
- `ki repo audit --skill ki-skills --repo . --concise --progress never`
- `ki repo audit --skill ki-work-roadmap --repo . --concise --progress never`

## Dependencies / blocks

No dependency blocks this item. The change uses the existing INFO outcome and changes no generic host contract.

## Documentation impact

### Decision Records

No Decision Record is needed. This refines the signal level within the existing source-distribution decision and does not change the release identity or installation model.

### Specifications

The owning source-distribution standard changes to state the ordinary-audit and release-readiness distinction explicitly. No MCP protocol or server-behaviour specification changes.

### Guides

No practical guide changes. This is rubric policy and test coverage.

### Roadmap

This item is the sole owner of the change. No follow-on work is expected unless verification exposes a separate host or audit-environment defect.

## Review

### Delivered

Delivered the approved source-release signal split from immutable baseline `0adc528bbe470db32f3c83f9da7facd32ad996c5`. A valid MCP development checkout without a matching release tag now produces neutral INFO from `DIST-1`; a matching annotated tag produces PASS; malformed release markers and invalid package, build, lockfile, repository, or HEAD evidence remain violations under the WARN-level criterion.

No tags, releases, versions, MCP repositories, generic host semantics, or Paperclip worktrees changed.

### Change Summary

- `references/standards-mcp-distribution.md` now states the development INFO, malformed WARN, and annotated-release PASS boundary.
- `scripts/rubric/items/distribution.ts` derives ordinary-source validity once and uses it to select INFO only for an untagged valid development HEAD.
- `scripts/rubric/items/distribution.test.ts` proves development INFO, annotated-release PASS, lightweight-tag violation, and invalid evidence violations on the WARN criterion.
- `references/rubric.md` was regenerated from the structured catalogue and now publishes the revised criterion description and remediation.
- This record retained its original creation timestamp, recorded the implementation baseline, completed every approved step, and stopped at Awaiting review.

### Verification

- Focused Bun tests: 19 passed, 0 failed across `distribution.test.ts` and `mcp.test.ts`.
- `ki dev skill rubric ki-repo-mcp`: generated publication is in sync.
- `bunx tsc --noEmit`: passed.
- `ki repo audit --skill ki-repo-mcp --repo ../mcp-housekeeping-claude --concise --progress never`: PASS; the ordinary development checkout no longer reports `DIST-1` WARN.
- `ki repo audit --skill ki-skills --repo . --concise --progress never`: `FAIL=0 WARN=1`; seven pre-existing `LONG-3` cadence findings remain.
- `ki repo audit --skill ki-work-roadmap --repo . --concise --progress never`: PASS.

### Outstanding concerns

No item-scoped concern remains. The seven `ki-skills` `LONG-3` refresh-cadence warnings predate this item and require a separately authorised REFRESH campaign; they do not concern `DIST-1` semantics or generated-publication parity.

### Post-change review

The goal is met without weakening release readiness. Ordinary audits regain a stable signal because an expected development state is informational, while every invalid source input and every malformed attempt to mark a release remains visible as WARN. Release judgment still requires the matching annotated tag.

Scope held to the owning standard, structured item, focused tests, generated publication, and this record. The primary regression risk was accidentally downgrading malformed or incomplete evidence; the focused violation test and end-to-end MCP audit cover that boundary.

The item is ready for human review and is not accepted by this implementation.

### Mini recap

`DIST-1` now reports valid untagged development HEAD as INFO, annotated release evidence as PASS, and invalid or malformed evidence as WARN violations. Nineteen focused tests, rubric parity, TypeScript, the representative MCP audit, and the roadmap audit passed. Only unrelated refresh-cadence warnings remain.

## Discussion

### Signal boundary

INFO means the checkout is valid development source but is not installable release evidence. PASS means HEAD carries the matching annotated release tag. WARN remains reserved for evidence that is invalid, unsafe, inconsistent, or appears to claim a release without satisfying the annotated-tag contract.

### Why one criterion remains

Package identity, immutable revision, build inputs, and release marker form one source-release evidence set. Splitting the tag into a second criterion would duplicate the judgment boundary and make ordinary validity harder to read. One item can emit several outcomes and already has the neutral INFO state needed for the distinction.
