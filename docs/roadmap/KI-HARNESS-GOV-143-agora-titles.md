---
id: KI-HARNESS-GOV-143
area: GOV
title: Agora titles
theme: governance-consistency
horizon: now
status: done
blocks: []
blocked_by: []
baseline_ref: 6172a1c8846b760640d21ec56f307b1f4dc737b7
created_at: 2026-10-06T11:05:00Z
updated_at: 2026-10-06T12:20:00Z
---

# KI-HARNESS-GOV-143: Agora titles

## Goal

Every Agora declaration carries a required, owner-declared readable `title` separate from its stable identifier. The `ki-agora` standard, structured rubric and GDR-KI-HARNESS-006 say that the identifier is the only machine and path key and the title is what people see.

## Context

This item is a handoff from [KI-ARCADIA-GOV-017](https://github.com/knowledgeislands/ki-arcadia-principal/blob/main/Streams/Roadmap/KI-ARCADIA-GOV-017-agora-identifiers-and-titles.md), which Kris Brown approved on 2026-10-06: "Agora titles - KI-ARCADIA-GOV-017 - yes please … process as much as possible." Kit Principal's ChatGPT capture surface already files context and capture under `-/_CONTEXT/chatgpt/<agora-id>/` and `+/_ACQUIRE/chatgpt/<agora-id>/` with readable headings such as Personal and Legal; the owner wants those headings declared as the Agora's title.

Arcadia decided under the owner's delegated direction that `title` is mandatory, leaning on the owner's mandatory direction for the parallel `capital` key. Every declaration in the local registry belongs to the same owner and migrates in the same change.

## Boundary

In scope: the `ki-agora` standard, `SKILL.md`, the CONFIG-1 structured rubric item and its context, the generated rubric, `sources.md`, GDR-KI-HARNESS-006 and its index line.

Out of scope: the `ki` parser and presentation (tools-ki [KI-TOOL-CLI-106](https://github.com/knowledgeislands/tools-ki/blob/main/docs/roadmap/KI-TOOL-CLI-106-agora-titles.md)); declaring titles in owner repositories (KI-ARCADIA-GOV-017); renaming any Agora; any release.

## Current state

CONFIG-1 accepts only `purpose`, `members` and `includes` and fails `title` as an unrecognised key. The standard names the identifier but gives people no readable label beyond `purpose`.

## Steps

- [x] `scripts/rubric/contexts/agora.ts`: admit `title` and fail a missing, non-string, blank, padded or multi-line title.
- [x] `scripts/rubric/items/configuration.ts`: describe the required title; regenerate `references/rubric.md`.
- [x] `scripts/rubric/contexts/agora.test.ts`: titled fixtures and a focused title test.
- [x] `references/standards-agora.md`: example and `title` bullet, plus an Identifier and title section covering keys, derived paths, presentation, renaming and capture.
- [x] `SKILL.md`, `references/sources.md`, GDR-KI-HARNESS-006 and `docs/decisions/README.md`: name the title.

## Files touched

- `docs/roadmap/KI-HARNESS-GOV-143-agora-titles.md`
- `skills/governance/ki-agora/SKILL.md`
- `skills/governance/ki-agora/references/standards-agora.md`
- `skills/governance/ki-agora/references/rubric.md` (generated)
- `skills/governance/ki-agora/references/sources.md`
- `skills/governance/ki-agora/scripts/rubric/contexts/agora.ts`
- `skills/governance/ki-agora/scripts/rubric/contexts/agora.test.ts`
- `skills/governance/ki-agora/scripts/rubric/items/configuration.ts`
- `docs/decisions/GDR-KI-HARNESS-006-owner-declared-agoras.md`
- `docs/decisions/README.md`

## Verify

```bash
bun run test
bunx tsc --noEmit
bunx biome check .
ki dev skill rubric ki-agora
ki repo audit --repo . --progress never --concise
```

The repository audit reports FAIL=0. Against this harness, `ki repo audit --skill ki-agora` passes for every titled owner and fails for an untitled one.

## Dependencies / blocks

No local dependency. The handoff is non-blocking in both directions; neither KI-ARCADIA-GOV-017 nor KI-TOOL-CLI-106 is listed in `blocks` or `blocked_by`.

## Documentation impact

### Decision Records

GDR-KI-HARNESS-006 is edited in place to name the required title.

### Specifications

The `ki-agora` standard and CONFIG-1.

### Guides

None.

### Roadmap

None beyond this record.

## Review

### Delivered

The approved boundary: `title` becomes a required, non-empty, single-line `ki-agora` declaration key in the standard, the CONFIG-1 rubric and GDR-KI-HARNESS-006, with the identifier kept as the only machine key. Excluded: the CLI parser (KI-TOOL-CLI-106), owner declarations (KI-ARCADIA-GOV-017), releases and remote operations. Baseline `6172a1c8846b760640d21ec56f307b1f4dc737b7`; the delivery commits follow it on `main`.

### Change Summary

- `scripts/rubric/contexts/agora.ts`: CONFIG-1 admits `title` and fails one that is missing, non-string, empty, padded, or contains CR, LF, U+2028 or U+2029, with `home <id> requires a non-empty single-line title`.
- `scripts/rubric/contexts/agora.test.ts`: titled fixtures and a focused test for each failing form and a titled pass.
- `scripts/rubric/items/configuration.ts` and the regenerated `references/rubric.md`: CONFIG-1 and family wording.
- `references/standards-agora.md`: example, required keys, `title` bullet and an Identifier and title section (identifier as the only key and folder name, title as presentation mirrored by derived headings, renaming moves nothing, no authority).
- `SKILL.md`, `references/sources.md`, `docs/decisions/README.md`, and GDR-KI-HARNESS-006 amended in place with its as-of date advanced to 2026-10-06.
- Material decision: `title` is mandatory with no identifier fallback, as decided in KI-ARCADIA-GOV-017. No approved deviations.

### Verification

- `bun run test`: all tests pass, including the ten `ki-agora` tests.
- `bunx tsc --noEmit`: clean.
- `bunx biome check .`: no errors; warnings and infos unchanged from the baseline.
- `ki dev skill rubric ki-agora`: `references/rubric.md` in sync with the catalogue.
- `ki repo audit --repo . --progress never --concise` in an isolated environment that registers this worktree: FAIL=0.
- With this harness and a tools-ki build that includes KI-TOOL-CLI-106, `ki repo audit --skill ki-agora` passes for all seven titled owner repositories; an untitled owner fails CONFIG-1.

### Outstanding concerns

None in this item. Until a harness release includes it, CI that installs the released harness reports CONFIG-1 `unrecognised key title` for titled owners; the owner has accepted that window and the coordinator holds the release.

### Post-change review

Goal met: the portable contract separates identifier from title and the rubric enforces it with the same rule as the CLI parser. Scope stayed inside `ki-agora` and its decision. Regression risk is limited to owners without a title, which is the intended failure; every owner in the local registry now declares one. Fable review found the review-packet shape, the GDR as-of date, three missing test cases and Unicode line separators; all are addressed. Ready for acceptance.

Review outcome: Fable reviewed the delivery commit and reported one blocking finding (review-packet shape), two should-fix findings (GDR as-of date, missing empty, tab and CR test cases) and two nits (Unicode line separators, house-style dashes). All but the house-style nit are addressed in the follow-up commit; the dashes match this repository's existing style. Gates were rerun after rebasing onto `main`: 908 tests passing and the audit at FAIL=0.

### Mini recap

Required Agora `title` landed in the `ki-agora` standard, rubric and GDR with focused tests and passing gates; the only open matter is the owner-held harness release. Learning route: none proposed beyond the Arcadia record.

## Done

Accepted 2026-10-06 by Kris Brown on review packet above.

## Discussion

### Cross-repository relationship

Originates from `knowledgeislands/ki-arcadia-principal` KI-ARCADIA-GOV-017. tools-ki carries the parser under KI-TOOL-CLI-106. Owner declarations gain titles under the Arcadia record.

### Release window

Until the harness is released, CI runs that bootstrap the released harness fail CONFIG-1 for titled owners on the unrecognised key. No release is cut here.
