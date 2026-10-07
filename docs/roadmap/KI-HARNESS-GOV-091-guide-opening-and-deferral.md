---
id: KI-HARNESS-GOV-091
area: GOV
title: Guide opening and deferral
kind: deliver
purpose: upkeep
initiative: platform-foundations
component: governance
horizon: next
status: ready
blocks: []
blocked_by: []
transferred_from: ki-website
baseline_ref: null
created_at: 2026-09-24T19:05:00Z
updated_at: 2026-10-07T20:34:46Z
---

# KI-HARNESS-GOV-091: Guide opening and deferral

## Goal

Two editorial rules KI Website enforces on its published pages are adopted in `ki-guides` as a standard for every repository, each in the form its evidence supports: a guide opens by saying what the reader will be able to do, and no link text stands in for the content the page owes.

## Context

KI Website rewrote its published guidance this week. The corpus it started from read as a routing layer over other repositories' work - seventy links into GitHub across thirty-five pages, six of them with the literal anchor text `The full guide`, and a provenance table as the last thing on nearly every page. A reader's final impression was that the real material was somewhere else.

Two rules came out of that, both now mechanical in `apps/site/scripts/verify-docs-sections.ts` there and stated in that repository's `docs/guides/developer/docs-sections.md`:

1. **An opening claim.** Prose before the first `##`, saying what the reader will be able to do, at least 120 characters of it. A page that opens by describing itself - "this page summarises the material in X" - has told the reader nothing they can act on.
2. **No deferral in link text.** Link text may not be a hand-off phrase: `the full guide`, `see the README`, `full documentation`, `read more`, `learn more`, or a bare `here`, `docs`, `documentation`, `README`. A link is fine, and often right, when it cites a fact the page has already stated. It is wrong when it is the place the answer lives. The test is whether the link survives as a fact rather than as a destination - remove it, and the sentence should still say something true and useful.

This repository is not merely a consumer of the answer, which is what makes the question worth an identifier here rather than a conversation. `ki-guides` lives in this repository, so a decision to adopt either rule is a standard change every repository inherits, and a decision to refuse is equally a decision for all of them.

The third rule from the same review has already landed. `GUIDE-4` and `ROUTE-3` hold a guide inside its own collection and grade that obligation by the reader's distance from the repository. That rule is not revisited here; it is the precedent for how these two would land if adopted - a mechanical item where the check is a check, a judgment item where it is a reading.

`KI-TOOL-CLI-083` asks the same question of `tools-ki` on its own evidence, and `KI-TOOL-CLI-078` is consolidating that collection. Neither blocks this, and this does not block them: if `ki-guides` adopts a rule, `tools-ki` inherits it, and if it does not, that repository may still adopt either locally.

## Boundary

In scope:

- A normative opening-claim section in `ki-guides`' standard and a mechanical criterion, `GUIDE-5`, that fails a guide whose prose before its first `##` is shorter than 120 characters.
- A normative no-deferral paragraph in the same standard and a judgment-only criterion, `ROUTE-4`, asking whether each link's text carries a fact rather than standing in for content the guide owes. No phrase list and no mechanical check.
- Whatever an adopted rule requires of this repository's own `docs/guides/`; all five current guides already clear the 120-character floor (223 to 1905 characters measured on 2026-10-05), so none is expected to change.

Out of scope: `docs/decisions/` and the skills' own `references/`, which are not guides; any repository's guide rewrite outside this one, which each owner performs under its own authority when the audit reports it; and KI Website's own gate, which stays as it is.

## Current state

`skills/governance/ki-guides/scripts/rubric/items/guides.ts` defines `GUIDE-1` to `GUIDE-4`, all mechanical diagnostics, and `routing.ts` defines `ROUTE-1` (mechanical) and the judgment items `ROUTE-2` and `ROUTE-3`. Guide discovery and per-file checks are computed in the harness by `scripts/rubric/contexts/guides.ts` (`guideFiles`, `h1Count`, `escapingLinks`), which excludes the root `docs/guides/README.md`, so a new mechanical check needs no host-side delivery. `references/standards-guides.md` has no opening or link-text rule; its `## A guide is self-contained` section is the nearest. `scripts/rubric/items/index.test.ts` pins the ordered code list and the diagnostic set. `KI-TOOL-CLI-083`, the parallel question raised against `tools-ki`, is no longer present in that repository's roadmap.

## Steps

- [ ] `references/standards-guides.md`: add `## A guide opens with its outcome` before `## A guide is self-contained`. A guide MUST open, before its first `##`, with prose saying what the reader will be able to do, at least 120 characters of it; the H1, front matter, headings and HTML blocks do not count, and a page that describes itself has not met the rule.
- [ ] `references/standards-guides.md` `## A guide is self-contained`: add one paragraph that link text carries a fact the guide has already stated, never the place the answer lives; remove the link and the sentence should still say something true and useful. State that this is a review judgment, not a phrase list.
- [ ] `references/standards-guides.md` `## Judgment boundary`: add the link-text question to the review questions and note that the opening floor is checked mechanically while its quality is not.
- [ ] `scripts/rubric/contexts/guides.ts`: add `openingIssues` to `GuidesLayoutContext`, computed over the same `files` set as `headingIssues` with a lead reader that skips front matter, the H1, blank lines and lines starting `<`, stops at the first `##` outside a fence, and joins the remaining trimmed lines with single spaces.
- [ ] `scripts/rubric/items/guides.ts`: add `GUIDE-5 [M]`, level `FAIL`, diagnostic remediation, sourced from `standards-guides.md#a-guide-opens-with-its-outcome`, reporting each offending guide with its measured length.
- [ ] `scripts/rubric/items/routing.ts`: add `ROUTE-4 [J]`, sourced from `standards-guides.md#a-guide-is-self-contained`, with scope, prompt, outcomes and guidance that forbid failing a phrase mechanically.
- [ ] `scripts/rubric/items/index.test.ts`: add `GUIDE-5` and `ROUTE-4` to the ordered code list and `GUIDE-5` to the diagnostic set; assert `ROUTE-4` is judgment-only.
- [ ] `scripts/rubric/contexts/guides.test.ts`: add fixtures for a 119-character lead (reported), a 120-character lead (clear), a lead behind front matter and H1 (measured correctly), and a short root `README.md` (exempt).
- [ ] Regenerate `references/rubric.md` with `ki dev skill rubric ki-guides --write`.
- [ ] Run the focused audit over every registered repository that declares `ki-guides`, read-only, and record which ones newly fail `GUIDE-5` in the review packet as fleet findings for their owners, not as failures of this delivery.

## Files touched

- `skills/governance/ki-guides/references/standards-guides.md`
- `skills/governance/ki-guides/scripts/rubric/contexts/guides.ts`
- `skills/governance/ki-guides/scripts/rubric/contexts/guides.test.ts`
- `skills/governance/ki-guides/scripts/rubric/items/guides.ts`
- `skills/governance/ki-guides/scripts/rubric/items/routing.ts`
- `skills/governance/ki-guides/scripts/rubric/items/index.test.ts`
- `skills/governance/ki-guides/references/rubric.md` (generated)

## Verify

1. In a fixture repository, a guide whose prose before its first `##` is 119 characters produces one `GUIDE-5` violation naming the file; at 120 characters it passes; front matter, the H1 and HTML lines do not count towards the length; the root `docs/guides/README.md` is never assessed.
2. `ki repo audit --skill ki-guides --reporter-levels all` in this repository reports `GUIDE-5` as passed for every guide.
3. `ROUTE-4` appears in the generated rubric as a judgment item with no mechanical audit, and its guidance says not to fail a phrase mechanically.
4. `ki dev skill rubric ki-guides` reports the committed `references/rubric.md` current.
5. The fleet read-out of newly failing declaring repositories is recorded in the review packet, separately from this delivery's pass or fail.
6. `bun run test` and `bunx tsc --noEmit` pass.

```bash
bun run test
bunx tsc --noEmit
ki dev skill rubric ki-guides
ki repo audit --skill ki-guides --reporter-levels all --progress never
ki repo audit --skill ki-skills --progress never
```

## Dependencies / blocks

`blocked_by` and `blocks` are empty by intent. No host-side delivery is needed, because the guide context is computed in this repository. Repositories that declare `ki-guides` inherit `GUIDE-5` on their next audit; any guide that then fails is that repository's own work under its own authority.

## Documentation impact

### Decision Records

None. The `GUIDE-4` and `ROUTE-3` precedent landed inside the `ki-guides` standard without a Decision Record, and these two rules follow the same route.

### Specifications

None.

### Guides

None expected in this repository: its five guides already meet the opening floor. The website skills-by-outcome guide does not restate the guides standard.

### Roadmap

None required. `KI-WEB-SITE-027` in `ki-website` raised this as non-blocking in both directions and needs no reply to close; `KI-TOOL-CLI-083` in `tools-ki` is no longer present.

## Discussion

### Decision

Adopt the opening-claim rule as a mechanical `ki-guides` criterion; adopt the no-deferral link text rule as judgment-only. Decided by the Fable reviewer under delegated autonomy, reversible. This supersedes the earlier boundary that this item would decide without committing `ki-guides` to either rule.

### Which of the two is likelier to survive (resolved)

The opening-claim rule looks portable. It is about whether the first paragraph is worth reading, which does not depend on where the guide is read, and it is mechanical without being brittle - a character floor on prose before the first heading.

The no-deferral rule is the interesting one. Its underlying test is sound anywhere: does the link carry a fact or a destination? But the mechanical form is a phrase list, and a phrase list is a proxy that will refuse honest sentences and pass dishonest ones. `GUIDE-4` already removes the worst case for a repository guide by refusing the escaping link outright, which means the phrase that remains is either pointing at code or at a sibling - both places a reader can be sent without losing the thread.

### Why this arrives as a record rather than a conversation

The handoff was decided in `KI-WEB-SITE-027` and recorded in that item's `## Review`, which was the right place at the time and would not have survived the record being accepted and pruned. A deferred concern that lives only inside an accepted record has a lifespan bounded by the prune, so this one has an identifier in the repository that would act on it.

### Origin

`knowledgeislands/ki-website`, `KI-WEB-SITE-027`. Non-blocking in both directions.
