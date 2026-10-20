---
id: KI-HARNESS-GOV-221
area: GOV
title: ki-diagrams Mermaid fence warning
project: observatory
component: governance
kind: deliver
priority: medium
size: s
status: draft
horizon: now
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-10-19T07:17:31Z
updated_at: 2026-10-20T01:44:15Z
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

- [ ] Settle the three open questions under Dependencies / blocks with the owner.
- [ ] Add a context reader that lists tracked Markdown with `git ls-files '*.md'` and records each line opening a fenced block whose info string is `mermaid`, backtick or tilde, ignoring fences nested in a longer fence.
- [ ] Add DIAG-7, mechanical at WARN, one violation per fence naming the file and line, with remediation pointing at Mode REFRESH or an owner decision.
- [ ] If a kept-diagram record is wanted, add its form to the standard and have DIAG-7 pass a fence that carries it.
- [ ] Add context and item tests: no fence passes, a fence warns with its file and line, an untracked file is ignored, a nested example fence is ignored, and a kept fence passes if the form exists.
- [ ] Add a sentence to the standard's The tool: Archify section saying the audit warns on each remaining Mermaid fence, and regenerate `references/rubric.md` and the remediation-inventory counts.

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

Decisions needed before Ready, each with a recommendation:

- Reach: recommended, the item applies where `ki-diagrams` is declared, the normal rubric rule, and the migration hand-offs ask each owner to declare the skill; the alternative, a scan in every audited repository, would need a `ki-repo` item instead.
- Scan scope: recommended, tracked Markdown only, where the survey found every fence.
- Kept diagrams: recommended, a marker comment on the line before the fence, `<!-- ki-diagrams: keep mermaid -->`, so the decision sits beside the diagram; the alternative is a manifest table, which the manifest's slug-only shape does not fit.

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

## Discussion

Questions for planning: whether the item applies to every repository that runs the audit or only to those adopting `ki-diagrams`; whether the scan reads tracked Markdown only or also other text files; and whether a kept diagram is recorded as a manifest exclusion or a marker beside the fence.
