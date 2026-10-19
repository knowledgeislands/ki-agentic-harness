---
id: KI-HARNESS-GOV-224
area: GOV
title: Diagram viewer receipts
project: observatory
component: governance
priority: high
size: m
kind: deliver
status: awaiting-review
horizon: now
blocks: []
blocked_by: []
baseline_ref: af2387eae29315098b4ddd2675d43ffbcd65c66b
created_at: 2026-10-19T19:10:30Z
updated_at: 2026-10-19T23:50:31Z
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
- [x] Commit check: `build-html.ts --check` runs the same `receiptFindings` without Archify, and the pre-commit hook runs it on the staged snapshot whenever `docs/diagrams/` or the `ki-diagrams` scripts are staged.
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

The approved boundary, against baseline `af2387eae29315098b4ddd2675d43ffbcd65c66b`: the build command writes a portable `<slug>.receipt.json` beside each committed viewer; DIAG-6 fails on a missing or mismatched receipt from committed files alone; the pre-commit hook runs the same check on the staged snapshot; and the 12 manifest entries are re-rendered with matching receipts. `last_checked`, the 5G Emerge sites, the Observatory's Interactive button and Archify itself are untouched.

### Change Summary

- `skills/governance/ki-diagrams/scripts/rubric/contexts/diagrams.ts`: the `DiagramReceipt` shape, `fingerprint`, `diagramReceipt` and `receiptFindings`, a `receipts` context, and DIAG-1 admitting `<slug>.receipt.json` only under `commit_html = true`.
- `skills/governance/ki-diagrams/scripts/rubric/items/diagrams.ts`: DIAG-6, FAIL, diagnostic remediation; DIAG-1's description names the receipt.
- `skills/governance/ki-diagrams/scripts/build-html.ts`: `archifyRenderer` reads the renderer's name and version from Archify's `package.json`; `committedReceipt` builds the receipt and refuses when Archify's own `<slug>.delivery.json` vouches for other bytes; the build writes the receipt with the viewer; `--check` verifies receipts without Archify.
- `.githooks/pre-commit`: `check_staged_receipts` runs the staged snapshot's own `build-html.ts --check` whenever `docs/diagrams/` or the `ki-diagrams` skill is staged. It runs the staged code rather than `ki repo audit --skill ki-diagrams`, so the change lands without the installed harness already knowing the receipt.
- Tests: `build-html.test.ts` covers the receipt shape, the delivery cross-check and the `--check` exit code; `diagrams.test.ts` covers a matching receipt, a missing one, a changed source and viewer, malformed and misnamed receipts, and a stray receipt; `items/index.test.ts` and the `ki-skills` remediation inventory count DIAG-6, a justified report-only boundary since its fix is a re-render.
- `skills/governance/ki-diagrams/references/standards-diagrams.md` and `SKILL.md`: the receipt as a fourth committed form, the build command's receipt and `--check`, and the manifest's `commit_html` row; `references/rubric.md` gains DIAG-6, written to the item's text because `ki dev skill rubric` renders only from the dev-linked main checkout.
- `docs/diagrams/`: 12 new receipts. Nine viewers changed bytes: their sources are unchanged since they were last rendered under Archify 3.0.1, and re-rendering under 3.2.0 gives new viewers; `skill-map`, `skill-area-coordination` and `skill-area-acquire` re-rendered byte for byte. The SVGs were not re-exported.

### Verification

- `bun test skills/governance/ki-diagrams`: 32 pass, 0 fail.
- `bunx tsc --noEmit`: passes.
- `bun run test`: 1308 pass, 4 fail; the four hook tests fail the same way on the untouched baseline, as recorded for [KI-HARNESS-GOV-219](KI-HARNESS-GOV-219-feedback-work-folder-kind.md).
- `bun skills/governance/ki-diagrams/scripts/build-html.ts --check`: 12 committed viewer receipts match; on a copy with one byte appended to `skill-map.html` it refuses, naming the viewer.
- `bunx @biomejs/biome check skills/governance/ki-diagrams/scripts`: clean. `sh -n .githooks/pre-commit`: clean.
- `ki repo audit --skill ki-skills`: PASS. `--skill ki-work-roadmap`: FAIL only on ITEM-3 for other drafts adopted into Now and not yet planned. `--skill ki-diagrams`: the installed harness, still the main checkout's, reads the 12 receipts as stray under its old DIAG-1, as planned; that clears once this change is integrated.

### Outstanding concerns

- Until integrated and installed, `ki repo audit --skill ki-diagrams` on this repository fails DIAG-1 on the receipts; the pre-commit check does not, since it runs the staged code.
- The nine SVGs were exported from the Archify 3.0.1 viewers. Their sources have not changed, so they still draw the same diagram, but they were not re-exported under 3.2.0; whether to re-export is a refresh choice outside this record.
- The four pre-existing hook-test failures stand outside this record.

### Post-change review

The goal is met: a committed viewer can now be proved against its source, and a stale one is caught at audit and at commit; the re-render itself showed nine viewers had been produced by an older renderer. Scope held: no `last_checked` change, no other repository, no Archify change. Regression risk is moderate and bounded: DIAG-1 now admits one more file kind only under `commit_html`, DIAG-6 is new, and the hook gains one check that fails closed without `bun`. Ready for acceptance.

### Mini recap

Receipts of source and HTML hashes now sit beside each of the 12 committed viewers, DIAG-6 and the commit hook check them, and the tests and type check pass, with four pre-existing hook-test failures and the planned stray reading under the installed harness until integration. Learning routes, not promoted: whether the receipt should also carry the SVG export, and whether `ki dev skill rubric` should render from the current worktree.

## Discussion

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
