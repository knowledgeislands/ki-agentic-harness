---
id: KI-HARNESS-GOV-065
area: GOV
title: Conform current Decision Records
theme: governance-consistency
horizon: next
status: done
blocks: []
blocked_by: []
baseline_ref: 2b34d951560dbc800348e42c8398af4a28ede2b3
created_at: 2026-09-14T19:26:00Z
updated_at: 2026-09-15T12:25:33Z
---

# Conform current Decision Records

## Goal

Keep current Harness Decision Records as present-state authority by removing superseded narration and forward-work instructions while preserving enacted decisions and routing any real unfinished obligation to its roadmap owner.

## Context

The monthly reconciliation found historical or future-state wording in four current records. Decision Records are living statements of what stands now; Git retains earlier states and roadmap records own prospective delivery. The identified passages mix those responsibilities even where their underlying decision remains current.

Existing owners cover the material forward work: [KI-HARNESS-GOV-058](KI-HARNESS-GOV-058-classify-skill-activation.md) owns applicability coverage, and [KI-HARNESS-RTP-002](KI-HARNESS-RTP-002-reach-cowork-mcp-servers.md) owns cross-surface MCP reach. Compatible-Harness version selection is an excluded host concern rather than an accepted Harness commitment, so the current payload decision can state that boundary without promising future work.

## Boundary

Do not erase current rationale, change an enacted decision, hide a real unfinished obligation, rewrite historical Git evidence, or turn this cleanup into a new architecture choice. Preserve external references that still support current claims. Any passage whose correction would change semantics must stop and become separate decision work.

## Current state

The candidate set is bounded:

- `ADR-KI-HARNESS-007` ends an applicability consequence with “tracked on ROADMAP”; the current owner is `KI-HARNESS-GOV-058`, and the Decision Record should state the present coverage boundary only.
- `ADR-KI-HARNESS-012` calls copied projection or version selection “future work”; the current decision needs only the host-ownership and non-contract boundary.
- `ADR-KI-HARNESS-TOOLCHAIN-002` twice says cross-surface enablement is a ROADMAP item; `KI-HARNESS-RTP-002` retains that forward work, so the Decision Record can keep the current non-adoption boundary without tracker narration.
- `ADR-KI-HARNESS-TOOLCHAIN-003` contains later-reframing and legacy-fallback narration around the current XDG source. The current record should directly state the accepted renderer-neutral source and remove superseded migration commentary.

## Steps

- [x] Re-read each complete current record and classify every candidate sentence as current rationale, historical narration, future obligation, or semantic conflict before editing.
- [x] Rewrite only the four bounded passages so each record states current authority directly and retains its original rationale.
- [x] Confirm `KI-HARNESS-GOV-058` and `KI-HARNESS-RTP-002` still retain the two material forward-work outcomes before removing tracker narration.
- [x] Keep compatible-Harness version selection outside the Harness payload contract unless a separate adopted owner already exists; do not create speculative work merely to preserve the phrase.
- [x] Remove obsolete legacy-source wording from `ADR-KI-HARNESS-TOOLCHAIN-003` only after checking the current `ki-binding` source contract.
- [x] Search all current Decision Records for equivalent `ROADMAP`, “future work”, supersession, or migration narration and report any additional semantic candidate rather than widening this cleanup automatically.
- [x] Run Decision Record, authoring, roadmap, and repository-wide verification.

## Files touched

- `docs/decisions/ADR-KI-HARNESS-007-uniform-skill-modes-bare-mode-scripts-and-a-coverage-scoped-aggregate-gate.md`
- `docs/decisions/ADR-KI-HARNESS-012-compatible-harness-publication-and-governed-rubric-boundary.md`
- `docs/decisions/ADR-KI-HARNESS-TOOLCHAIN-002-complementary-tooling-current-adoptions.md`
- `docs/decisions/ADR-KI-HARNESS-TOOLCHAIN-003-proxy-local-mcp-servers-behind-mcporter.md`
- This roadmap record

## Verify

- Focused search for historical and forward-work wording across current Decision Records
- `ki repo audit --skill ki-decision-records --repo .`
- `ki repo audit --skill ki-binding --repo .`
- `ki repo audit --skill ki-work-roadmap --repo .`
- `ki repo audit --skill ki-authoring --repo .`
- `bun run test`
- `bunx tsc --noEmit`
- `git diff --check`

## Dependencies / blocks

No dependency blocks implementation. The two material forward outcomes already have retained canonical owners. Any newly discovered passage that requires a semantic decision is outside this ready plan and must stop for separate routing.

## Documentation impact

### Decision Records

Conform four current records in place without changing their decisions. No new Decision Record is expected.

### Specifications

No Specification change. This work enforces the existing living present-state record contract.

### Guides

No guide change is expected because no user workflow changes.

### Roadmap

Retain the existing applicability and Cowork/MCP owners. Capture only a newly proven, non-duplicate forward obligation; do not create a record for an explicitly excluded possibility.

## Review

### Delivered

From immutable baseline `2b34d951560dbc800348e42c8398af4a28ede2b3`, conformed the four approved current Decision Records to present-state authority. The delivery removes tracker narration, excluded future-model language, and superseded source-transition wording without changing the enacted decisions or their retained rationale.

### Summary of changes

- Recast ADR-007 applicability as the current selected-audit and coverage boundary while leaving implementation ownership with `KI-HARNESS-GOV-058`.
- Kept copied projection and version selection explicitly outside ADR-012's Harness payload contract without promising later work.
- Retained house-mcp-manager as prior art in TOOLCHAIN-002 while stating that the decision does not adopt cross-surface enablement; `KI-HARNESS-RTP-002` remains its roadmap owner.
- Stated TOOLCHAIN-003's renderer-neutral XDG source directly and removed the obsolete source-transition and fallback narration.
- Searched all current Decision Records for equivalent wording. Other matches describe current compatibility boundaries, retained migration safety, present rationale, or reading-order relationships; changing them would exceed this bounded cleanup.

### Verification

- Focused Decision Record search classified the approved passages and found no additional in-scope rewrite.
- `ki repo audit --skill ki-decision-records --repo .` — passed.
- `ki repo audit --skill ki-binding --repo .` — passed.
- `ki repo audit --skill ki-work-roadmap --repo .` — passed.
- `ki repo audit --skill ki-authoring --repo .` — passed.
- `bun run test` and `bunx tsc --noEmit` — reserved for the aggregate batch gate after all independent delivery commits.
- `git diff --check` — passed.

### Outstanding concerns

None within the approved boundary. The broader search found current migration language in other Decision Records, but those passages state active fail-closed compatibility and ownership constraints rather than superseded narrative.

### Post-change review

The four records now state present authority without losing their architectural rationale or hiding forward work. The edits are prose-only and retain the existing owners, so regression risk is limited to accidental semantic drift; focused audits and the aggregate batch gate cover the relevant document contracts. The item is ready for consolidated acceptance.

### Mini recap

Delivered four bounded living-record corrections, verified their retained owners and current binding source, and found no additional automatically actionable cleanup. No new durable learning or roadmap item is required.

## Done

Accepted 2026-09-15 under the approved completion authority in `KI-HARNESS-BATCH-022` after the aggregate repository gate passed.

## Discussion

### Classification rule

Current rationale explains why the decision stands and remains. Historical narration describes a transition already complete and belongs in Git. Forward work describes an outcome not yet delivered and belongs in the roadmap. A semantic conflict changes what stands and therefore cannot be hidden inside conforming prose.

### Review boundary

The small candidate list makes the cleanup independently reviewable. A repository-wide search is a guard for missed examples, not authority to rewrite every phrase that happens to use future tense.
