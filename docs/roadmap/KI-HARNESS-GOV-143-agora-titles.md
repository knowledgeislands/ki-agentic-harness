---
id: KI-HARNESS-GOV-143
area: GOV
title: Agora titles
theme: governance-consistency
horizon: now
status: awaiting-review
blocks: []
blocked_by: []
baseline_ref: 3243cbddad16fe9401d2b4958fb70cb60c61c7ad
created_at: 2026-10-06T11:05:00Z
updated_at: 2026-10-06T11:32:00Z
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

## Discussion

### Cross-repository relationship

Originates from `knowledgeislands/ki-arcadia-principal` KI-ARCADIA-GOV-017. tools-ki carries the parser under KI-TOOL-CLI-106. Owner declarations gain titles under the Arcadia record.

### Release window

Until the harness is released, CI runs that bootstrap the released harness fail CONFIG-1 for titled owners on the unrecognised key. No release is cut here.

## Review packet

- Rubric: CONFIG-1 admits `title` and fails a declaration whose title is missing, non-string, empty, padded or multi-line with `home <id> requires a non-empty single-line title`. The focused test covers each case and a titled pass; existing fixtures carry titles.
- Standard: the example, required keys and a `title` bullet, plus a new Identifier and title section: the identifier is the only machine key and folder name, the title is presentation mirrored by derived headings, renaming changes no identifier or captured material, and a title grants no authority.
- Decision: GDR-KI-HARNESS-006 amended in place for the required title and identifier-only machine key; the decisions index line updated.
- Gates: `bun run test` 893 passing; `bunx tsc --noEmit` clean; `bunx biome check .` unchanged baseline (6 warnings, 10 infos); `ki dev skill rubric ki-agora` in sync; `ki repo audit --repo . --progress never --concise` FAIL=0. Against this rubric an untitled owner fails CONFIG-1 as intended.
- Release: owner repositories that declare titles fail the released harness rubric until a harness release includes this item.
