---
id: KI-HARNESS-GOV-224
area: GOV
title: Diagram viewer receipts
project: observatory
component: governance
priority: high
size: m
kind: deliver
status: done
blocks: []
blocked_by: []
baseline_ref: 7dc5bb8aa8d8a0e0fce3a34084a90260033ba643
created_at: 2026-10-19T19:10:30Z
updated_at: 2026-10-21T03:04:48Z
transferred_from: ki-principal ki.observatory OVERLAY-SYNC, 2026-10-19
---

# KI-HARNESS-GOV-224: Diagram Viewer Receipts

## Goal

A saved Archify viewer can be proved to match the diagram source it was rendered from, so that a stale viewer is caught mechanically at audit and at commit rather than discovered by a reader. Rendering writes each saved HTML viewer together with a portable receipt, and `ki repo audit` and the staged-snapshot commit check fail when a receipt is missing or does not match.

## Context

Kris Brown answered OVERLAY-SYNC on 19 October 2026 in the Observatory work: "Overly committed, I agree with recommendation." It is read back as taken in the [Observatory decisions log](/Users/krisbrown/workspaces/knowledge-islands/ki-principal/+/_WORK/ki.observatory/decisions.md) as OVERLAY-COMMITTED a): rendering writes each saved viewer with a receipt of source and HTML hashes; `ki repo audit` and the commit check fail on a missing or mismatched receipt; the Observatory's Interactive button opens a viewer only when its receipt matches, otherwise shows it stale. This record carries the harness part.

The [overlay review report](/Users/krisbrown/.local/state/ki/agents/observatory/obs-overlay-review.report.md) of the same day found:

- all 12 entries in [`docs/diagrams/diagrams.toml`](../diagrams/diagrams.toml) set `commit_html = true`, and [`build-html.ts`](../../skills/governance/ki-diagrams/scripts/build-html.ts) finalizes each diagram and copies its HTML into `docs/diagrams/`, but records nothing that ties the copy to its source;
- the `ki-diagrams` audit checks that committed HTML is present where `commit_html` asks for it, and reads traced-code history against `last_checked`, but never compares a viewer with its source;
- the [pre-commit hook](../../.githooks/pre-commit) has no viewer-sync gate;
- the 5G Emerge Phase 2 site already commits `*.delivery.json` receipts beside two saved viewers, carrying source and HTML hashes that verified against the current bytes, which is the shape this record generalises.

A date or a viewer's presence cannot prove agreement; content hashes can.

## Boundary

- In: rendering through `build-html.ts` writes, beside each committed viewer, a portable receipt holding the source hash, the HTML hash and the renderer's identity, with no local path or address; the `ki-diagrams` standard and manifest text that name the receipt and its shape.
- In: a `ki-diagrams` rubric criterion, run by `ki repo audit --skill ki-diagrams` on committed files alone, that fails when a `commit_html` entry has no receipt or its hashes do not match the current source and HTML; the same check in the staged-snapshot pre-commit audit, so a commit that changes a source or viewer without re-rendering is refused; fixture tests for both.
- In: re-rendering the 12 harness manifest entries so each carries a matching receipt.
- Out: `last_checked`, which keeps its separate question of whether a diagram still describes its traced code; a matching receipt never refreshes it, and a stale `last_checked` never fails the receipt check.
- Out: adopting receipts on the 5G Emerge Phase 2 and Phase 3 sites, which are later adopters in their own repositories; Phase 2's existing delivery receipts are a starting shape to reconcile with, not work done here.
- Out: the Observatory's Interactive button, which apps-observatory.local owns; changing Archify itself.

## Current state

[`build-html.ts`](../../skills/governance/ki-diagrams/scripts/build-html.ts) finalizes each diagram into `+/diagrams/<slug>/` and copies the HTML of a `commit_html = true` entry to `docs/diagrams/<slug>.html`. Archify's `finalize` writes a `<slug>.delivery.json` beside its output carrying the specification and artefact SHA-256 hashes, but with absolute local paths, so it cannot be committed. The `ki-diagrams` rubric, [`scripts/rubric/items/diagrams.ts`](../../skills/governance/ki-diagrams/scripts/rubric/items/diagrams.ts), holds DIAG-1 to DIAG-5; DIAG-1 treats any file under `docs/diagrams/` outside the manifest's forms as stray, and nothing compares a viewer with its source. The [pre-commit hook](../../.githooks/pre-commit), now committed under `.githooks/` since Husky was retired, audits staged skills and type-checks, with no diagram check. The rubric runtime runs on Bun, whose `node:crypto` gives SHA-256, so no tools-ki capability is needed.

## Steps

- [x] Receipt: `build-html.ts` writes `docs/diagrams/<slug>.receipt.json` beside each committed viewer, after the copy, holding the schema version, the slug and type, the source and HTML file names with their SHA-256 and byte counts, and the renderer's name and version from Archify's `package.json`, with no local path; it refuses when Archify's own delivery receipt disagrees with the bytes it hashed.
- [x] Check: one pure `receiptFindings` in the rubric context names each `commit_html` entry whose receipt is missing, unreadable, misnamed or mismatched against the current source and HTML; DIAG-1 admits `<slug>.receipt.json` only under `commit_html = true`.
- [x] Rubric: a new DIAG-6, FAIL, each committed viewer carries a receipt matching its source and HTML, run on committed files alone; `last_checked` plays no part.
- [x] Commit check: `build-html.ts --check` and DIAG-6 share the receipt checker with canonical `ki-repo-harness` GATE-2. The unchanged canonical pre-commit hook runs its focused staged audit; GATE-2 reads exact index blobs and refuses stale source, stale viewer, changed or missing receipt, and missing required files while accepting a matching staged snapshot despite different unstaged files.
- [x] Tests: fixture tests for the receipt writer's shape, a matching receipt, a missing one, a stale source, a stale viewer, a stray receipt and the `--check` exit code.
- [x] Standard and skill text: Committed forms gains the receipt as a fourth form, the build command and the mechanical checker name it, and `rubric.md` gains DIAG-6.
- [x] Re-render the 12 manifest entries through `bun run self:diagrams:html`, so each committed viewer carries a matching receipt.

## Files touched

- `skills/governance/ki-diagrams/scripts/build-html.ts` and `build-html.test.ts`
- `skills/governance/ki-diagrams/scripts/rubric/contexts/diagrams.ts` and `diagrams.test.ts`
- `skills/governance/ki-diagrams/scripts/rubric/items/diagrams.ts`
- `skills/governance/ki-diagrams/references/standards-diagrams.md`, `references/rubric.md` and `SKILL.md`
- `.githooks/pre-commit`
- `skills/keystone/ki-skills/scripts/internal/remediation-inventory.test.ts`, whose criterion counts include DIAG-6
- `docs/diagrams/*.html` and the new `docs/diagrams/*.receipt.json`, re-rendered

## Verify

- `bun test skills/governance/ki-diagrams` passes, the new fixtures included.
- `bun run test` and `bunx tsc --noEmit` pass, apart from failures shown to exist on the baseline.
- `bun skills/governance/ki-diagrams/scripts/build-html.ts --check` passes on the re-rendered tree and fails on a hand-altered copy of one viewer.
- `ki repo audit --skill ki-diagrams` and `--skill ki-work-roadmap` raise no new finding beyond the installed harness's expected stray-file reading of the receipts before integration.

## Dependencies / blocks

The Observatory in apps-observatory.local opens a saved viewer only when its receipt matches, and otherwise shows it stale; that reader needs the receipt shape this record defines, so this record should land first.

No tools-ki change is identified: rendering runs through the harness's own `build-html.ts`, and the audit criterion is a `ki-diagrams` rubric item that `ki repo audit` runs from the harness. Planning confirms this; if the check needs a new `ki` capability, such as hashing support the rubric runtime does not offer, that tools-ki change is named here as a dependency before the record becomes Ready.

The 5G Emerge Phase 2 and Phase 3 sites in humans-not-robots adopt the receipt once it exists. Phase 2 already carries hashed delivery receipts and Phase 3 renders its saved viewers explicitly, so both can adopt without changing their build order.

## Documentation impact

### Decision Records

None expected: Kris Brown's OVERLAY-COMMITTED a) of 19 October is recorded in the Observatory work's decisions log, and this applies it.

### Specifications

None: the diagram forms are a skill standard here, not a KI Specification.

### Guides

None beyond the `ki-diagrams` standard, its skill summary and its regenerated rubric reference.

### Roadmap

The receipt shape is the input the Observatory's Interactive button in apps-observatory.local reads.

## Review

### Delivered

GOV-224's staged-snapshot enforcement has been repaired within this existing record. The rework baseline is `7dc5bb8aa8d8a0e0fce3a34084a90260033ba643`; the original receipt delivery used baseline `46f4e14d8f9efffa34cb78f166c9c84aa0d54151`. The final combined candidate is recorded in the [run report](/Users/krisbrown/.local/state/ki/agents/ways-of-working/wow-night-harness-queue-d.report.md) for fresh independent acceptance. No acceptance, browser rendering, estate rollout or release is included.

### Change Summary

- `ki-diagrams` publishes `diagram-receipts` and `staged-diagram-receipts` shared modules. Existing DIAG-6 and `build-html.ts --check` retain the same receipt comparison through their existing exports.
- `ki-repo-harness` materialises those declared modules and adds FAIL-level GATE-2 to the focused audit already called by both canonical hooks. It reads the staged adoption declaration, manifest and regular-file blobs, compares source and viewer hashes and byte counts, refuses missing required files, and attaches findings to staged diagram paths so verdict scoping preserves rejection.
- Canonical hook bytes remain unchanged; no local hook divergence or generic host-snapshot claim is introduced. The harness standard, generated rubric and root orientation describe the native integration.
- Disposable fixture coverage includes stale and missing source, viewer and receipt, malformed or missing manifest, unsafe staged files, and a matching staged snapshot despite different or missing working files. Actual package-hook proof uses the installed `ki` under the offline audit home and proves all four required rejection cases plus valid-snapshot acceptance.

### Verification

- Untouched baseline: `bun run test` passed 1395 tests, TypeScript passed, and the isolated offline whole-repository audit had no failures.
- `bun run test`: 1405 pass, 0 fail.
- `bunx tsc --noEmit`: pass.
- `bun test skills/governance/ki-diagrams`: 57 pass, 0 fail.
- `bun skills/governance/ki-diagrams/scripts/build-html.ts --check`: all 12 committed viewer receipts match.
- Sequential focused audits for `ki-engineering`, `ki-repo-harness`, `ki-diagrams`, `ki-skills`, `ki-authoring` and `ki-work-roadmap`: all pass without failures.
- Whole-repository audit in this run's offline isolated home: PASS=29 WARN=6 FAIL=0; existing warnings are retained rather than suppressed.
- `git diff --check`: pass.
- Actual canonical package hook, with the installed `ki` and network denied: rejects stale staged source, stale staged viewer, changed staged receipt and missing staged receipt; accepts a matching staged snapshot while source, viewer and receipt working files differ. Each rejected case reports GATE-2. The [proof receipt](/Users/krisbrown/.local/state/ki/agents/ways-of-working/wow-night-harness-queue-d.hook-proof.json) and individual logs survive beside the run report.
- New KNIP-1 repository fixture: the creation scaffold writes both committed-hook paths immediately, and an actual Knip scan recognises the hook-only tool dependencies without another conform pass.

Fresh independent acceptance reproduced the claims at exact candidate `e92158541f47a5b41ad2c123ed6d99be7010f69f`, after inspecting both the original delivery and rework diffs and checking the six review headings with an exact predicate. `bun run test` passed 1405 tests with no failures; `bunx tsc --noEmit`, the 57 focused diagram tests, `build-html.ts --check`, focused diagrams, roadmap, authoring, harness and skills audits, the whole-repository audit and `git diff --check` passed. The isolated offline whole-repository audit reported PASS=30 WARN=5 FAIL=0, with 72 warning findings retained. Diagram freshness warnings remain separate from receipt validity.

Independent SHA-256 and byte-count calculations verified all 12 committed source/viewer pairs and recorded hashes of all 12 receipts. Six disposable fixture repositories exercised the actual byte-identical canonical package hook through the installed `ki`, with network denied: stale staged source, stale staged viewer, changed staged receipt and missing staged receipt each failed at GATE-2; matching staged snapshots passed both with different unstaged source/viewer/receipt bytes and with all three working files missing. Exact staged blobs and working files stayed unchanged by every hook invocation. The [independent hash evidence](/Users/krisbrown/.local/state/ki/agents/ways-of-working/wow-night-harness-224-accept-d.evidence/independent-12-receipts.json), [canonical-hook proof](/Users/krisbrown/.local/state/ki/agents/ways-of-working/wow-night-harness-224-accept-d.evidence/canonical-hook-proof.json) and [acceptance report](/Users/krisbrown/.local/state/ki/agents/ways-of-working/wow-night-harness-224-accept-d.report.md) retain the verification details.

### Outstanding concerns

Fresh independent acceptance of `e92158541f47a5b41ad2c123ed6d99be7010f69f` passed in the separate `wow-night-harness-224-accept-d` run; no item-scoped concern remains. Existing diagram freshness and other baseline warnings remain separate from receipt validity. The brief's isolated-home audit procedure was retained for this run. F5's committed implementation and boundary proof were inspected in tools-ki (`5889f847`, `fcc8876a`, `4a02b008`); this receipt repair does not retire that separate audit procedure.

### Post-change review

The failed acceptance defect is addressed through the canonical native hook contract. Receipt checks use the same shared implementation for working-file and index evidence; staged evidence is never repaired from unstaged bytes. The host continues to own verdict scoping and reporting. No viewer, receipt or `last_checked` value was regenerated because the receipt schema and rendered bytes have not changed. Fresh independent acceptance confirms the exact combined candidate meets the goal, closes the previously reproduced hook-enforcement defect and introduces no item-scoped regression found by the required gates. Acceptance covers this record alone; the terminal record remains retained.

### Mini recap

GOV-224 now has a canonical staged receipt gate and regression fixtures, preserving the existing receipt format and record. The combined delivery also contains the separately authorised KNIP-HUSKY creation-scaffold correction, with no new roadmap record; F6 wording already matches. Learning remains with the owning skill standards rather than a new capture.

## Done

Accepted 2026-10-21 by GPT-6.1 Sol under Kris Brown's named overnight acceptance grant on the review packet above.

## Discussion

### Independent acceptance authority

Kris Brown's 20 October OVERNIGHT-BURNDOWN authority states, "Each delivered record gets an independent blind review; a pass is accepted under this grant". The 21 October 01:40 BST QUEUES-OVERNIGHT read-back and this run's explicit dispatch limit that authority to this record after a fresh independent pass. The acceptance run is separate from delivery, independently inspected the exact committed candidate and reproduced enforcement rather than relying on the delivery recommendation. It accepts no other record, performs no implementation repair and grants no pruning or publication.

### Failed independent acceptance review, 20 October 2026

Independent review of harness main at `e8f1da6ef0353c8448d0d7984ebe76f8846fb8f2` fails the Goal and the Commit check Step. The portable receipt writer, DIAG-1 opt-in handling, DIAG-6, receipt documentation, fixtures and all 12 saved viewers are present. Independent SHA-256 and byte-count checks match all 12 source-and-viewer pairs. `bun test skills/governance/ki-diagrams`, `bun run test`, `bunx tsc --noEmit`, the pristine `build-html.ts --check`, and isolated development-linked `ki-diagrams`, `ki-work-roadmap` and `ki-authoring` audits pass. Existing freshness warnings do not affect receipt validity.

Defect: the current `.githooks/pre-commit` and canonical `skills/repo-structure/ki-repo-harness/assets/githooks/package/pre-commit` run the focused `ki-repo-harness` audit only; they no longer run the staged receipt check delivered by this record. In an isolated worktree, appending a comment to `docs/diagrams/skill-area-acquire.html` and staging that viewer made `bun skills/governance/ki-diagrams/scripts/build-html.ts --check` exit 1, while executing the actual pre-commit hook exited 0. The stale viewer would therefore be accepted by the commit gate. The probe was removed and the original bytes restored; the receipt check then passed again.

A direct `ki repo audit --skill ki-diagrams --repo . --staged` on that staged viewer also exited 0 despite reporting a receipt failure outside its selected-path failure count. Rework must establish effective staged-snapshot enforcement, not merely add an audit invocation whose exit remains successful for a stale viewer. Restore it through the canonical hook contract and verify rejection of stale source, changed or missing viewer receipt, and stale viewer, while allowing a matching staged source, viewer and receipt when unstaged working files differ. Keep the delivery in this record; do not create a replacement roadmap item.

The Commit check Step is reopened. The earlier Review packet remains delivery history, superseded by this failed review. Return to Awaiting review only after the defect is repaired and the required gates and independent review pass. Kris Brown's specific acceptance grant permits this failed-review return to In progress; no push or pruning was performed.

### Receipt shape

Whether the receipt is one file per diagram beside its viewer, such as `docs/diagrams/<slug>.receipt.json` mirroring Phase 2's `*.delivery.json`, or one manifest-level ledger; which hash algorithm, with SHA-256 the obvious default; and whether renderer identity means the Archify version alone or also the `build-html.ts` revision.

### Scope of the check

Whether the SVG export joins the receipt now, since `export-svg.ts` already writes from the same viewer, or stays outside it; and whether a viewer with `commit_html = false` needs a receipt at all.

### Planned answers

- **Receipt shape:** one `<slug>.receipt.json` per committed viewer, beside it, mirroring the shape of Archify's own delivery receipt without its local paths, so a reader checks one diagram by reading one small file; SHA-256 throughout.
- **Renderer identity:** Archify's name and version alone. The `build-html.ts` revision would change every receipt on any edit to the script without changing a viewer.
- **SVG:** stays outside the receipt for now; DIAG-3 keeps its own check, and joining it is left as an idea.
- **`commit_html = false`:** no receipt, since no viewer is committed for it to prove; a receipt for such an entry is stray under DIAG-1.
- **Commit check:** the hook runs `build-html.ts --check` from the staged snapshot rather than `ki repo audit --skill ki-diagrams`, so a commit is checked by the code it carries and the change can land without the installed harness already knowing the receipt.

### Approval

Planned and set ready on 20 October 2026 by the `lane-triage` run of the ways-of-working work, whose brief, on Kris Brown's TRIAGE-ALL words of 19 October, "anything which is High confidence recommended. Let's move it into now and get it done", directs delivery of this record through `ki-plan` and `ki-implement` to Awaiting review. Priority raised to high, since the Observatory's Interactive button waits on it.
