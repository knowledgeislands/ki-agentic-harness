---
id: KI-HARNESS-GOV-221
area: GOV
title: ki-diagrams Mermaid fence warning
project: observatory
component: governance
kind: deliver
priority: medium
size: s
status: done
blocks: []
blocked_by: []
baseline_ref: 5f921df4385029e377f86a23e72b24cf59ac3401
created_at: 2026-10-19T07:17:31Z
updated_at: 2026-10-20T06:17:04Z
---

# KI-HARNESS-GOV-221: ki-diagrams Mermaid Fence Warning

## Goal

`ki repo audit --skill ki-diagrams` warns on every fenced `mermaid` code block in a repository's tracked Markdown, naming the file and line, so that each Mermaid diagram left after the Archify migration is visible until it is replaced or the owner has decided to keep it.

## Context

Kris Brown answered DIAGRAM-REPLACE on 19 October 2026 in the Observatory work: "Re mermaid diagrams, if they can be replaced with archify they should be, e.g. activity diagrams. Flag any others that don't and I'll decide about them too". The recommended course Kris took the same day under RECOMMENDED, "Go with recommendations taking the above into account.", includes a `ki-diagrams` audit item that warns on any Mermaid fence. Both are logged in the [Observatory decisions log](/Users/krisbrown/workspaces/knowledge-islands/ki-principal/+/_WORK/ki.observatory/decisions.md). The obs-diagrams survey counted 34 Mermaid fences in 24 files across 9 repositories; the migration pilots in ki-principal and the Observatory, then hands off to each other repository.

The standard already excludes Mermaid in [The tool: Archify](../../skills/governance/ki-diagrams/references/standards-diagrams.md#the-tool-archify). The current DIAG criteria cover only `docs/diagrams/` and its manifest, so a Mermaid fence elsewhere goes unseen. [KI-HARNESS-GOV-205](KI-HARNESS-GOV-205-static-light-diagram-export.md) carries the KI-theme export and the standard's wording for the same decision.

## Boundary

- In: one mechanical `ki-diagrams` rubric item under `scripts/rubric/items/` that reports each tracked Markdown file and line opening a `mermaid` fence, as a warning rather than a failure; its tests; its remediation pointing at Mode REFRESH or an owner decision; the regenerated `references/rubric.md`.
- In: a way to record an owner-kept Mermaid diagram so the warning stops repeating for it, if planning finds one is needed.
- Out: converting any repository's diagrams, which each owner does under its handoff; changing the Observatory's read-only Mermaid renderer; failing the audit on a Mermaid fence.

## Current state

Checked on 20 October 2026 at `30cbbd1d`. The `ki-diagrams` rubric has DIAG-1 to DIAG-6 in `scripts/rubric/items/diagrams.ts`, fed by `scripts/rubric/contexts/diagrams.ts`, which already shells out to Git for tracked-file and commit checks; none reads Markdown outside `docs/diagrams/`. The manifest `docs/diagrams/diagrams.toml` has one table per slug and no exclusion field. `git grep` finds no Mermaid fence in this repository. A rubric item runs only where a repository declares `[skills.ki-diagrams]`, and today only this harness declares it among the local workspace checkouts, so the warning would reach none of the 9 repositories the obs-diagrams survey found until they declare the skill.

## Steps

- [x] Add a context reader that lists tracked Markdown with `git ls-files '*.md'` and records each line opening a fenced block whose info string is `mermaid`, backtick or tilde, ignoring fences nested in a longer fence.
- [x] Add DIAG-7, mechanical at WARN, one violation per fence naming the file and line, with remediation pointing at Mode REFRESH or an owner decision.
- [x] Add the keep marker, `<!-- ki-diagrams: keep mermaid -->` on the line before the fence, to the standard, and have DIAG-7 pass a fence that carries it.
- [x] Add context and item tests: no fence passes, a fence warns with its file and line, an untracked file is ignored, a nested example fence is ignored, and a fence with the keep marker passes.
- [x] Add a sentence to the standard's The tool: Archify section saying the audit warns on each remaining Mermaid fence, and regenerate `references/rubric.md` and the remediation-inventory counts.

## Files touched

- `skills/governance/ki-diagrams/scripts/rubric/contexts/diagrams.ts` and `diagrams.test.ts`
- `skills/governance/ki-diagrams/scripts/rubric/items/diagrams.ts`, `index.ts` and `index.test.ts`
- `skills/governance/ki-diagrams/references/standards-diagrams.md` and `rubric.md`
- `skills/keystone/ki-skills/scripts/internal/remediation-inventory.test.ts`

## Verify

- `bun run test` and `bunx tsc --noEmit` pass.
- `ki dev skill rubric ki-diagrams` leaves no diff.
- `ki repo audit --skill ki-diagrams` passes DIAG-7 here, and over a fixture holding a tracked Mermaid fence it warns naming the file and line without failing.

## Dependencies / blocks

Decided on 20 October 2026 under PLANNED-READY a), each as recommended:

- Reach: the item applies where `ki-diagrams` is declared, the normal rubric rule, and the migration hand-offs ask each owner to declare the skill; the alternative, a scan in every audited repository, would need a `ki-repo` item instead.
- Scan scope: tracked Markdown only, where the survey found every fence.
- Kept diagrams: a marker comment on the line before the fence, `<!-- ki-diagrams: keep mermaid -->`, so the decision sits beside the diagram; the alternative is a manifest table, which the manifest's slug-only shape does not fit.

[KI-HARNESS-GOV-205](KI-HARNESS-GOV-205-static-light-diagram-export.md) edits the same standard section; deliver one after the other.

## Documentation impact

### Decision Records

None needed: the owner's DIAGRAM-REPLACE answer is recorded in the Observatory decisions log.

### Specifications

None: no Specification covers the diagrams rubric.

### Guides

None.

### Roadmap

None; conversion in other repositories is their owners' work under the migration hand-offs.

## Review

### Delivered

`ki repo audit --skill ki-diagrams` warns on each fenced `mermaid` block in the repository's tracked Markdown, naming its file and line (DIAG-7). A fence passes when the owner keeps it with `<!-- ki-diagrams: keep mermaid -->` on the line before.

### Change Summary

- `scripts/rubric/contexts/diagrams.ts`: `mermaidFences(text)` finds fences that open with backticks or tildes and carry the info string `mermaid` (case-insensitive). It skips fences nested inside a longer fence and reads the keep marker on the line before. A repository reader lists tracked Markdown through `git ls-files -z -- '*.md'` and adds a `mermaid` context with `gitAvailable`, `fences` and `kept`.
- `scripts/rubric/items/diagrams.ts`: adds DIAG-7, mechanical at WARN, with one violation per fence and the subject `<file>:<line>`. Remediation points to Mode REFRESH or the keep marker. It is not applicable outside Git.
- `references/standards-diagrams.md`: The tool: Archify section now states the warning and the keep marker, and quotes Kris's DIAGRAM-REPLACE answer of 19 October.
- `references/rubric.md` is regenerated. The `index.test.ts` catalogue and the remediation-inventory counts are updated (+1 criterion).

### Verification

- `bun run test`: 1352 pass, 0 fail.
- `bunx tsc --noEmit`: clean.
- New tests cover:
  - backtick and tilde fences;
  - an example nested in a longer fence (ignored);
  - the keep marker;
  - a repository with no fence (PASS);
  - a tracked fence (WARN, subject `docs/notes/flow.md:3`);
  - an untracked file (ignored);
  - a kept fence (PASS);
  - a checkout outside Git (NOT_APPLICABLE).
- `ki repo audit --skill ki-diagrams` (isolated home): FAIL=0, and DIAG-7 passes here. The 12 warnings are pre-existing DIAG-4 staleness warnings on the harness's own diagrams.
- `ki repo audit --skill ki-skills`: PASS.
- `git grep` finds no Mermaid fence in this repository.

### Outstanding concerns

- The item runs only where `[skills.ki-diagrams]` is declared. Among local checkouts that is the harness alone, so the 34 fences the obs-diagrams survey counted in other repositories stay unflagged until those repositories adopt the skill. The record's planning answer accepted this.

### Post-change review

- Only tracked files are read, and they are read from the working tree.
- The fence rule follows CommonMark: up to three spaces of indent, and a closing fence of the same character at least as long as the opening one.
- A backtick info string containing a backtick is not treated as a fence.

### Mini recap

DIAG-7 warns on each Mermaid fence left after the Archify migration until it is replaced or kept by marker.

## Done

Accepted 2026-10-20 by GPT-6 Codex as independent reviewer under Kris Brown's standing grant on the review packet above.

## Discussion

Questions for planning: whether the item applies to every repository that runs the audit or only to those adopting `ki-diagrams`; whether the scan reads tracked Markdown only or also other text files; and whether a kept diagram is recorded as a manifest exclusion or a marker beside the fence.

### Planning answers, 20 October 2026

Kris Brown answered PLANNED-READY on 20 October 2026 in the ways-of-working decisions log, "owner answers on the 03:08 BST send": "the old do need to move to Ready if possible, and we need to move them", taken as a): take the listed answers and mark each record Ready where the readiness checks pass. The three decisions are recorded under Dependencies / blocks, and the record is Ready.

### Independent acceptance, 20 October 2026

Kris Brown's overnight grant is quoted in the accept-harness-batch brief: "if you can quickly now accept ... accepting new things that are waiting with you and pruning those ... getting the roadmaps down to zero". The [ways-of-working decisions log](../../../ki-principal/+/_WORK/ki.ways-of-working/decisions.md), entry "2026-10-20 07:14 BST - received harness-batch", confirms the exact seven-record scope and independent review before acceptance. This acceptance exercises that grant for KI-HARNESS-GOV-221.

Independently reviewed delivery `a3cd97aa73cb06d19a905beb8eec76f18a769234` against combined revision `ae58540ecf69ee171e14282496f8ed1b904d9359`. Tests: 1,363 pass, zero failures. TypeScript passes. Published rubrics for ki-coordination, ki-work-package, ki-delegation, ki-diagrams and ki-repo are in sync. The eight focused harness audits (ki-work-roadmap, ki-authoring, ki-coordination, ki-work-package, ki-delegation, ki-diagrams, ki-repo and ki-skills) report zero failures. Existing roadmap and diagram warnings and the deliberately absent maturity declaration are recorded separately from this record's acceptance.

DIAG-7 reports tracked file and line, honours the adjacent keep marker and ignores untracked files and nested example fences; its boundary fixtures pass.
