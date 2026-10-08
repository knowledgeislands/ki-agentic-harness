---
id: KI-HARNESS-GOV-155
area: GOV
title: Detect wikilink name collisions
kind: deliver
purpose: upkeep
initiative: platform-foundations
component: repo-structure
status: done
blocks: []
blocked_by: []
baseline_ref: c6193e3787ec714f1f242343b45dbe3ff565c51b
created_at: 2026-10-07T17:20:21Z
updated_at: 2026-10-08T13:26:12Z
---

# KI-HARNESS-GOV-155: Detect wikilink name collisions

## Goal

A Knowledge Base audit fails mechanically when two tracked notes share a leaf filename that a shortest-unique wikilink would resolve, so adding a second page with a previously unique name can no longer silently break existing bare links.

## Context

`ki-repo-kb` defines `LINK-1` (shortest-unique Obsidian wikilinks), but `scripts/rubric/items/links.ts` implements it as a judgement-only item over sampled notes: nothing detects a collision. `tools-ki` has no wikilink code.

The problem is live in Arcadia. At planning time 19 leaf names collided among tracked Markdown outside `+/` and `-/`, including `Activities.md` (three paths), `Conformance.md` (three), and `Enactment Process.md`, `Processes.md` and `Governance.md` (two each).

Origin: `KI-ARCADIA-OPS-003` in `knowledgeislands/ki-arcadia-principal` (`Streams/Roadmap/KI-ARCADIA-OPS-003-page-registry.md`, pruned 2026-10-07). It proposed a page registry handed over as a work trade. Trades are on hold (decision 11 of the state-of-play design), so the finding is recorded here in the receiving repository instead.

## Boundary

- The check belongs to the `ki-repo-kb` rubric. Whether it needs a generated registry file or a direct scan of tracked notes is a planning question.
- No change to any Knowledge Base's notes is part of this record; each base repairs its own collisions.

## Current state

Verified on `main` `c6193e37`:

- `skills/repo-structure/ki-repo-kb/scripts/rubric/items/links.ts` defines `LINK-1` as judgment-only, and `KbLinkContext` is empty, so no audit evidence about links exists.
- `scripts/rubric/contexts/kb.ts` already walks every Markdown note once for the `NOTE` family; a second scan is unnecessary.
- `references/standards-knowledge-base.md` already requires the shortest unique path and a collision check before writing a bare link, but nothing enforces it.

## Steps

- [x] Add a mechanical diagnostic aspect at level `FAIL` to `LINK-1`, keeping its judgment for the shortest form and contents-list aliases.
- [x] In `collectKbAuditEvidence`, reuse the note walk: for every note outside the staging areas, extract wikilinks and embeds (ignoring code, headings, block references, aliases and non-Markdown targets) and fail each link that Obsidian could resolve to more than one note. Follow Obsidian's order: a link resolving beside its own note or as an exact full path is unambiguous; otherwise it matches case-insensitively against the end of every note path.
- [x] Add a fixture test covering a clean base, a new colliding leaf name, staging exclusion, path-qualified, same-folder, embedded, code and escaped-alias links.
- [x] Regenerate `references/rubric.md` and add the enforcement sentence to the standard's linking paragraph.

## Files touched

- `skills/repo-structure/ki-repo-kb/scripts/rubric/contexts/kb.ts`
- `skills/repo-structure/ki-repo-kb/scripts/rubric/items/links.ts`
- `skills/repo-structure/ki-repo-kb/scripts/rubric/items/index.test.ts`
- `skills/repo-structure/ki-repo-kb/references/rubric.md`
- `skills/repo-structure/ki-repo-kb/references/standards-knowledge-base.md`

## Verify

```bash
bun run test
bunx tsc --noEmit
ki repo audit --skill ki-skills --progress never
ki repo audit --skill ki-repo-kb --repo ../ki-arcadia-principal --progress never
```

## Dependencies / blocks

Nothing blocks this record. Each Knowledge Base repairs the ambiguous links the check reports through its own process; Arcadia's repair follows this record.

## Documentation impact

### Decision Records

None. The standard already states the rule; this record enforces it.

### Specifications

None.

### Guides

None.

### Roadmap

This record only.

## Discussion

- The Arcadia proposal stored every page in a registry, not only the collisions, so a later addition could be checked against existing bare links. A direct scan of `git ls-files '*.md'` gives the same answer without a stored file.

### Decisions at planning

- The check scans notes directly rather than storing a registry: the walk already exists, and a registry would be one more generated file to keep in step.
- A shared leaf name alone is not a failure. Every folder's same-name index note makes repeated leaf names normal (`Activities.md` in three places), and a path-qualified link to any of them is correct. The defect is a link that can resolve to more than one note, which is exactly what a new colliding note silently creates.

### Delivery - 2026-10-08

`LINK-1` now carries a mechanical `FAIL` aspect: the Knowledge Base audit scans every note outside `+/` and `-/` and reports each wikilink or embed that Obsidian could resolve to more than one note, keeping the judgment prompt for shortest form and contents-list aliases. `bun run test` (1,050 tests) and `bunx tsc --noEmit` pass, and the `ki-skills` audit has no failures. Run from source, the check passes Vallearmonia Principal and fails Arcadia Principal, Kit Principal and Kit HNR on their existing ambiguous links; each base repairs them through its own process, and the installed `ki` applies the check after the harness payload next updates.
