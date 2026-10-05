---
id: KI-HARNESS-GOV-121
area: GOV
title: Require substantive store mirrors
theme: governance-consistency
horizon: now
status: in-progress
blocks: []
blocked_by: []
baseline_ref: 00b4b56181a44a2bf77e0a10836e83429f5b62f6
created_at: 2026-09-30T07:00:00Z
updated_at: 2026-10-05T11:50:13Z
---

# KI-HARNESS-GOV-121: Require substantive store mirrors

## Goal

Every Markdown note that mirrors a binary in a paired sources store carries the durable knowledge an agent needs, so a search over the notes store answers most questions without opening the binary, and every Knowledge Base with a sources store holds its own work item to bring its mirrors up to that standard.

## Context

KI's working model is that a sources-store binary always has a mirrored Markdown note, but today that note may be only a summary or a pointer. `ki-repo-kb` describes the relationship in one line ("how note extracts mirror its paths") and the QUERY mode says to cite "the source note or paired source document"; neither defines what a mirror must contain. kit-principal's `Admin/Operations/Source Store Mirroring.md` is the only firm convention: a mirror records the co-located source path, a SHA-256 checksum and "only the durable knowledge needed in the notes store".

Once [KI-HARNESS-FND-028](KI-HARNESS-FND-028-adopt-qmd-kb-search.md) indexes notes stores with qmd, a pointer-only mirror will be indexed but rarely rank, while a mirror with a real extract will. The standard does not depend on that search work: a substantive mirror is also what grep and a whole-file read need. Kris asked on 2026-09-30 that each Knowledge Base gain a roadmap item to complete its mirrors.

## Boundary

In scope:

- a `## Source mirrors` section in the `ki-repo-kb` knowledge-base standard, promoting kit-principal's convention: a mirror carries `source_path` (store-relative) and `source_sha256` frontmatter and a body extract stating what the binary is and the facts a reader would otherwise open it for; no binary is copied or Git-tracked; private detail with no enduring use is not reproduced;
- applicability per base: the rule binds only a base whose `[skills.ki-repo]` `store_roles` includes `sources`;
- mirror identity by the `source_path` field, not by a new `note_type`, so a mirror keeps the kind appropriate to its zone;
- the expected shape of each base's own enrichment record, so those records share one form;
- one mechanical-plus-judgment criterion, `NOTE-4`, that surfaces missing checksums and pointer-only mirrors as `WARN`;
- a derived `mirror_content` search label (`extract`, `pointer`, `unknown`, or null for ordinary notes), backed by one pure metadata/body classifier and synthetic fixtures; the label attests only the declared-provenance and minimum-text checks, never source fidelity, source existence or checksum freshness.

Out of scope:

- writing or editing any other repository, including each base's enrichment record; any such change is a separate trade or the base's own work;
- opening, hashing or resolving the sources store during an audit, which would make the result depend on a machine-local mount outside the selected checkout; checksum freshness stays a judgment and a base-side task;
- the OneDrive store topology, committing any binary, and the search engine itself;
- vallearmonia-website and kit-midnight.ninja, which hold OneDrive directories but declare no sources store; each needs its owner's decision before the rule can bind it.

### Decision

kit-principal's convention, promoted into `ki-repo-kb`, and the pointer-only-mirror rule apply per base: require a substantive mirror where a sources store is declared; changes to other repositories are separate trades. Decided by the Fable reviewer under delegated autonomy, reversible.

## Current state

- `skills/repo-structure/ki-repo-kb/references/standards-knowledge-base.md` onboarding item 2 and `SKILL.md` line 105 mention a sources store in one line each; `references/mode-save.md` step 3 and `references/mode-query.md` step 2 mention mirroring and citation only in passing. No section defines mirror content.
- The `NOTE` family in `scripts/rubric/items/notes.ts` holds `NOTE-1`, `NOTE-1a` to `NOTE-1c`, `NOTE-2` and `NOTE-3`; `NOTE-4` is free. `scripts/rubric/contexts/kb.ts` already parses `.ki.toml` and walks every note's frontmatter, so the new evidence needs no new traversal.
- `store_roles` is validated by `ki-repo` (`skills/keystone/ki-repo/references/standards-repository.md`, "A Knowledge Base declares its roles with `store_roles`").
- Bases that declare `sources` in `store_roles` already hold their own enrichment records: kit-principal `KIT-013`, kit-legal `KIT-LEGAL-EVD-005`, kit-techmedix `TMX-KB-003`, vallearmonia-principal `VA-PRINCIPAL-KNW-001` and er-research `ER-RESEARCH-011`. Mirror frontmatter already diverges: kit-principal mirrors are `note_type: stream-note` without `source_path`; kit-legal uses `note_type: source-note` with `source_path`.
- `ki-acquire-*` skills do not use the word "mirror"; their "source note" means the upstream service's note (for example Granola's), so they need no change, only a disambiguating sentence in the new section.

## Steps

- [ ] Add `## Source mirrors` to `standards-knowledge-base.md`: applicability by `store_roles`; the `source_path` and `source_sha256` contract; extract content (what the binary is, the facts a reader would otherwise open it for, links to canonical knowledge rather than duplicated private detail); identity by field rather than `note_type`; the distinction from an acquisition "source note"; and the expected per-base enrichment record (inventory the store against its mirrors, add or extend extracts and checksums, record controlled groups, no binary in Git).
- [ ] Point onboarding item 2 in the same file, the sources-store binding in `SKILL.md`, `mode-save.md` step 3 and `mode-query.md` step 2 at the new section, replacing their one-line descriptions rather than restating the rule.
- [ ] Publish the pure classifier in `scripts/internal/source-mirrors.ts` and `references/standards-source-mirrors.md`: recognize `source_path` and `source_sha256`, require safe store-relative paths and 64 hexadecimal characters, count at least 40 body words after removing frontmatter, headings, links and HTML comments, return unknown on malformed or incomplete provenance, and do not follow sources. Fixtures cover links/headings-only, forged metadata, ordinary notes, missing checksums and substantive extracts.
- [ ] In `scripts/rubric/contexts/kb.ts`, read `[skills.ki-repo].store_roles` from the already parsed `.ki.toml`, and during the existing frontmatter walk collect notes carrying `source_path`; record a `NOTE-4` check: `PASS` with "not applicable" when `sources` is not declared; `WARN` naming each mirror whose `source_sha256` is absent or not 64 hexadecimal characters; `WARN` naming each mirror whose body, after frontmatter, headings and links are removed, holds fewer than 40 words; `PASS` otherwise. Expose it as `notes.sourceMirrors`.
- [ ] Add `NOTE_4` to `scripts/rubric/items/notes.ts`, sourced to `standards-knowledge-base.md`, mechanical level `WARN` with diagnostic remediation, and a judgment asking whether each sampled extract carries the facts a reader would otherwise open the binary for without private detail of no enduring use.
- [ ] Extend `scripts/rubric/items/index.test.ts`: add `NOTE-4` to the expected code list and the judgment count, and add fixtures for no `sources` role, a pointer-only mirror, a missing checksum and a substantive mirror.
- [ ] Update the counts in `skills/keystone/ki-skills/scripts/internal/remediation-inventory.test.ts` for one new criterion.
- [ ] Regenerate `references/rubric.md` with `ki dev skill rubric ki-repo-kb`.
- [ ] Raise no trade from this repository: its `.ki.toml` forbids formal `ki-trades` routes to personal, legal and other company groups. Each receiving base already holds a draft enrichment record citing this item (kit-principal `KIT-013`, kit-legal `KIT-LEGAL-EVD-005`, kit-techmedix `TMX-KB-003`, vallearmonia-principal `VA-PRINCIPAL-KNW-001`, er-research `ER-RESEARCH-011`) and picks up the published standard through ordinary skill refresh. Record the delivered commit here so those records can cite it.

## Files touched

- `docs/roadmap/KI-HARNESS-GOV-121-require-substantive-store-mirrors.md`
- `skills/repo-structure/ki-repo-kb/scripts/internal/source-mirrors.ts` (new)
- `skills/repo-structure/ki-repo-kb/scripts/internal/source-mirrors.test.ts` (new)
- `skills/repo-structure/ki-repo-kb/references/standards-source-mirrors.md` (new)
- `skills/repo-structure/ki-repo-kb/references/standards-knowledge-base.md`
- `skills/repo-structure/ki-repo-kb/SKILL.md`
- `skills/repo-structure/ki-repo-kb/references/mode-save.md`
- `skills/repo-structure/ki-repo-kb/references/mode-query.md`
- `skills/repo-structure/ki-repo-kb/scripts/rubric/contexts/kb.ts`
- `skills/repo-structure/ki-repo-kb/scripts/rubric/items/config.ts` (shared metadata applicability wording)
- `skills/repo-structure/ki-repo-kb/scripts/rubric/items/notes.ts`
- `skills/repo-structure/ki-repo-kb/scripts/rubric/items/index.test.ts`
- `skills/repo-structure/ki-repo-kb/references/rubric.md` (generated)
- `skills/keystone/ki-skills/scripts/internal/remediation-inventory.test.ts`

## Verify

1. `standards-knowledge-base.md` holds one `## Source mirrors` section defining applicability, `source_path`, `source_sha256`, extract content, identity by field, and the per-base record shape; the four pointer sites link to it and do not restate it.
2. Against a fixture base without `sources` in `store_roles`, `NOTE-4` passes as not applicable even when a note carries `source_path`.
3. Against a fixture base declaring `sources`, a mirror with only a path line reports one `NOTE-4` `WARN` naming its repository-relative path; a mirror lacking `source_sha256` reports a `WARN` naming it; a mirror with a 64-character checksum and a 40-word extract passes.
4. No `NOTE-4` outcome is `FAIL`, and the audit never reads outside the selected checkout (the fixtures carry no sources store).
5. Synthetic fixture bases demonstrate expected first-day `NOTE-4` warnings, safe labels and unchanged source bytes; no live private KB is opened or audited. Search consumers can find the exact schema and fixtures through the KB standard.
6. `bun run test` and `bunx tsc --noEmit` pass, and the regenerated rubric publishes `NOTE-4`.

```bash
bun run test
bunx tsc --noEmit
ki dev skill rubric ki-repo-kb
ki repo audit --skill ki-repo-kb --progress never
ki repo audit --skill ki-skills --progress never
ki repo audit --skill ki-authoring --progress never
```

Follow-on, outside acceptance: each base's enrichment record conforms its mirrors and clears `NOTE-4` in its own repository.

## Dependencies / blocks

None. [KI-HARNESS-FND-028](KI-HARNESS-FND-028-adopt-qmd-kb-search.md) motivates the standard but does not gate it: the mirror contract and its audit are useful to grep and whole-file reads, and neither record needs the other's output. Both records edit `references/mode-query.md`; whichever lands second rebases its one-line change, which is a sequencing note rather than a dependency.

Sequencing: this record and [KI-HARNESS-GOV-117](KI-HARNESS-GOV-117-govern-hooks-beyond-packages.md) both add a criterion through the shared `ki-repo-kb` files `scripts/rubric/items/index.test.ts`, `references/rubric.md` and `references/standards-knowledge-base.md`, and this record and [KI-HARNESS-GOV-131](KI-HARNESS-GOV-131-govern-living-diagrams.md) both edit the counts in `skills/keystone/ki-skills/scripts/internal/remediation-inventory.test.ts`. Increment, do not hardcode; whichever lands second rebases.

## Documentation impact

### Decision Records

None. Promoting an existing base convention into the shared standard is a standards change; the governing choice is recorded under Decision above.

### Specifications

`standards-knowledge-base.md` gains the `## Source mirrors` section; the generated `rubric.md` gains `NOTE-4`.

### Guides

None in this repository. A base's own mirroring guide, such as kit-principal's `Admin/Operations/Source Store Mirroring.md`, may later point to the shared section; that is the base's own work.

### Roadmap

None in this repository. The five per-base records named in Steps are the receivers' own work.

## Discussion

### Current user authority (2026-10-05)

The principal approved the shared mirror label contract necessary for search. This delivery retains the full substantive-mirror standard and diagnostic scope above; verification is synthetic and never opens or modifies live private KBs, acquired notes or binary source stores. Derived labels express only checks over the selected Markdown note and declared provenance, with unknown where evidence is incomplete.

### Bases known to hold a sources store

kit-principal (four controlled mirror groups), kit-legal (about 2,150 record-series notes with `source_path` frontmatter), kit-techmedix (about 46 correspondence notes citing store paths), vallearmonia-principal (store declared, no mirrors yet) and er-research (seven resource notes). vallearmonia-website and kit-midnight.ninja have OneDrive directories but do not declare a store; each needs a decision before it can hold mirrors. The obsolete `hnr-principal`, originally listed here, has since been deregistered and is out of scope.

### Extract scope

The extract should state what the binary is, the facts a reader would otherwise open it for, and the checksum that tells a later session whether the extract is stale. Mirrors may link to canonical knowledge but must not duplicate private source detail with no enduring use, following the kit-principal rule.

### Why a word floor rather than a judgment-only check

A pointer-only mirror is cheap to detect and expensive to miss once search ranks by content. The 40-word floor is a deliberately low mechanical tripwire for the pointer case; whether an extract is good enough remains the `NOTE-4` judgment. The threshold lives in the standard so a later review can tune it without changing the contract.

## Delivery progress

Canonical standards, pure classifier and native NOTE-4 are published in `e71a769f779d3d45ac03886dd9dfc57e2b3d7489`. Strict YAML parsing plus the shared conservative raw grammar reject duplicate, quoted/escaped-key, merge, flow, alias and other ambiguous provenance; malformed notes in a declared-sources base warn unknown rather than earning a positive complete-provenance claim. Shared store-role metadata selects applicability without sibling-table validation. Synthetic fixtures skip external symlink files/directories and never resolve a source store.

Required full test gate remains red: idle run 863 pass / 9 fixture timeouts / 2 asynchronous cleanup errors; independent unchanged repository-context file reproduces 45 pass / 8 timeouts / 3 cleanup errors. These local-content fixtures invoke pre-existing GitHub checks before filtering findings. No timeout widening or acceptance bypass is applied. Focused source tests, TypeScript and all applicable synthetic/standards audits pass; final handoff waits correction and the required full gate.
