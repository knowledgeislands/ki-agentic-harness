---
id: KI-HARNESS-GOV-094
area: GOV
title: Check constraint reach
kind: deliver
purpose: upkeep
initiative: platform-foundations
component: keystone
horizon: next
status: ready
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-09-25T09:06:24Z
updated_at: 2026-10-07T20:43:51Z
---

# KI-HARNESS-GOV-094: Check constraint reach

## Goal

Widening a constraint reaches every skill that restates it, rather than only the skill whose failure prompted the change.

## Context

On 2026-09-24, `69a0fc80` relaxed the digit-leading repository-code rule for roadmap identifiers across `ki-repo`, `ki-work-roadmap`, `ki-work-housekeeping` and `ki-accept`, the four skills that had failed. `ki-decision-records` and `ki-specs` each restate the same alpha-leading grammar in their own vendored rubric contexts (`scripts/rubric/contexts/decision-records.ts`, `scripts/rubric/contexts/specs.ts`) and were not touched, so they carried on enforcing the repealed rule.

Nothing reported the divergence. It surfaced a day later only because `5g-emerge-phase2` tried to use `5GE-P2` for both its roadmap and its decisions, found it legal in one instrument and illegal in the other, and invented the scope `EMERGE-P2` to work around a rule that no longer existed next door. That workaround was then written into `GDR-EMERGE-P2-001` as if it were a standing constraint. `ADR-KI-HARNESS-SKILLS-015` relaxed both instruments on 2026-09-25 and the seven records were renamed, so the instance is closed; the class is not.

The `ki-repo` REVIEW checklist has no question that would have caught it. Three items come close and each misses: "Renames were propagated to every reference" does not fire, because nothing was renamed and the old identifiers stayed valid; "The change does not introduce a second source of truth for an existing fact" prohibits creating duplication, and the duplication here is deliberate and predates the change; "A change to a declaration that another tool consumes was verified by running that tool" assumes the second enforcer is already known, and the failure was not knowing to look for one.

On 2026-10-01 `KI-HARNESS-GOV-125`, since merged into this record, found a seventh restating skill, `ki-batch`, by the same route: a downstream repository using a legal code and hitting a wall.

## Boundary

In scope:

- One shared identifier-grammar module, published by `ki-work-roadmap` through the existing shared-module contract (`ki-shared-modules:` / `ki-shared-dependencies:`, `ADR-KI-HARNESS-SKILLS-012`), carrying the repository-code, scope-segment and serial patterns settled by `ADR-KI-HARNESS-SKILLS-015` and helpers that compose suffixed forms from them.
- Migrating the six original restating skills (`ki-repo`, `ki-work-roadmap`, `ki-work-housekeeping`, `ki-accept`, `ki-decision-records`, `ki-specs`) to import their local materialised copy instead of hand-written literals.
- A conformance test that fails when any copy diverges from the provider or when a restating skill still carries a hand-written repository-code literal. Its inventory names all seven restating skills, including `ki-batch`.
- `ki-batch`'s adoption of the shared grammar, merged from `KI-HARNESS-GOV-125`: declare the shared dependency, materialise the copy, replace its five hand-written literals with composed patterns, and clear the conformance test's pending `ki-batch` entry; resolve `authorisationPath` against `repositoryRoot` rather than the process working directory in `resolveBatchAuthorisation`; and add tests that pin digit-leading codes, item serials wider than three digits, and root-relative path resolution.

Out of scope:

- Any import from `tools-ki`. The shared definition lives in the harness and reaches skills by vendored copy, which `ADR-KI-HARNESS-012` and `ADR-KI-HARNESS-SKILLS-012` require.
- The `ki-repo` REVIEW checklist question considered below; it is not added.
- `ADR-KI-HARNESS-SKILLS-015` itself, which is settled, and any change to which identifiers are legal. The migration preserves current accepted grammar exactly, except where a skill still enforces the repealed alpha-leading form.

## Current state

Each skill still carries its own literal. Verified on `main` at `19651664`:

- `ki-work-roadmap`: `ID_RE` and `FILE_RE` at `scripts/rubric/contexts/roadmap-evidence.ts:37`-`:38`, and the `repo_code` check at `:200`.
- `ki-repo`: `repo_code` check at `scripts/rubric/contexts/audit.ts:919`.
- `ki-work-housekeeping`: `TEMPLATE_ID` and `RUN_ID` at `scripts/rubric/contexts/housekeeping.ts:7`-`:8`. `RUN_ID` is still alpha-leading (`[A-Z][A-Z0-9-]{1,31}`), a live divergence of the same class.
- `ki-accept`: `WORK_ITEM_ID_RE` at `scripts/internal/acceptance-cycle.ts:10`.
- `ki-decision-records`: seven patterns at `scripts/rubric/contexts/decision-records.ts:53`-`:61` and one at `scripts/rubric/items/root.ts:28`. Some spell the scope as repeated segments and some as `[A-Z0-9]*[A-Z][A-Z0-9-]*`, so the copies already differ within one skill.
- `ki-specs`: four patterns at `scripts/rubric/contexts/specs.ts:14`-`:18`.
- `ki-batch`: five alpha-leading, three-digit sites, inventoried in the merged `KI-HARNESS-GOV-125` (see Discussion).

Shared modules exist today for `ki-skills:rubric`, `ki-repo-website:site-selection` and `ki-binding:binding`; each consumer holds a committed regular-file copy under `scripts/shared/`.

## Steps

- [ ] Add `skills/change-management/ki-work-roadmap/scripts/shared/work-identifiers.ts` exporting the repository-code source (`[A-Z0-9][A-Z0-9-]{1,23}`), scope-segment source (`[A-Z0-9]*[A-Z][A-Z0-9]*`), serial source (`\d{3,}`), and anchored builders for an item identifier, an area or infix-suffixed identifier (for `-HK-`, `-BATCH-`, `-RUN-`), a multi-segment scope, and a decision-record or requirement identifier with a supplied prefix set. Builtins only, no sibling import.
- [ ] Declare `ki-shared-modules: [work-identifiers]` in `ki-work-roadmap`'s `SKILL.md` and add `ki-work-roadmap:work-identifiers` to `ki-shared-dependencies:` in `ki-repo`, `ki-work-housekeeping`, `ki-accept`, `ki-decision-records` and `ki-specs`.
- [ ] Materialise a byte-identical copy at `scripts/shared/work-identifiers.ts` in each of those five skills.
- [ ] Replace each literal listed under Current state with an import from the local copy. Align `ki-work-housekeeping`'s `RUN_ID` with the shared repository-code grammar, and use one scope-segment form for every `ki-decision-records` pattern.
- [ ] Add `work-identifiers.test.ts` beside the provider module pinning: a digit-leading code (`5GE-P2-DATA-008`), a four-digit serial, a 24-character code accepted and 25 rejected, a digit-only scope segment rejected, and each composed suffix form.
- [ ] Add the conformance test `work-identifiers.conformance.test.ts` beside the provider. It resolves the harness `skills/` root from its own path, then fails when (a) any `scripts/shared/work-identifiers.ts` copy is not byte-identical to the provider, (b) a skill declaring the dependency lacks its copy, or (c) a non-test `.ts` file in any of the seven restating skills contains a hand-written repository-code or scope-segment literal. The inventory names all seven; `ki-batch` is an explicit pending entry marked with `KI-HARNESS-GOV-125`, reported by name rather than silently skipped. The test only reads files, so it adds no cross-skill import.
- [ ] Regenerate any rubric publication whose wording changes (`ki dev skill rubric <skill>`), and update `ki-work-roadmap`'s standard to name the module as the single definition of the `<REPO>` grammar.

## Files touched

- `skills/change-management/ki-work-roadmap/SKILL.md`
- `skills/change-management/ki-work-roadmap/scripts/shared/work-identifiers.ts` (new)
- `skills/change-management/ki-work-roadmap/scripts/shared/work-identifiers.test.ts` (new)
- `skills/change-management/ki-work-roadmap/scripts/shared/work-identifiers.conformance.test.ts` (new)
- `skills/change-management/ki-work-roadmap/scripts/rubric/contexts/roadmap-evidence.ts`
- `skills/change-management/ki-work-roadmap/references/standards-repository-roadmaps.md`
- `skills/keystone/ki-repo/SKILL.md`, `scripts/shared/work-identifiers.ts` (new), `scripts/rubric/contexts/audit.ts`
- `skills/change-management/ki-work-housekeeping/SKILL.md`, `scripts/shared/work-identifiers.ts` (new), `scripts/rubric/contexts/housekeeping.ts`
- `skills/change-management/ki-accept/SKILL.md`, `scripts/shared/work-identifiers.ts` (new), `scripts/internal/acceptance-cycle.ts`
- `skills/governance/ki-decision-records/SKILL.md`, `scripts/shared/work-identifiers.ts` (new), `scripts/rubric/contexts/decision-records.ts`, `scripts/rubric/items/root.ts`
- `skills/governance/ki-specs/SKILL.md`, `scripts/shared/work-identifiers.ts` (new), `scripts/rubric/contexts/specs.ts`
- `references/rubric.md` in any of the above skills whose generated publication changes

## Verify

1. `grep -rnE "\[A-Z0-9\]\[A-Z0-9-\]\{1,23\}|\[A-Z0-9\]\*\[A-Z\]\[A-Z0-9\]\*" skills --include='*.ts'` returns only the provider module, its tests, and the materialised copies, plus, until the `ki-batch` adoption step lands, the `ki-batch` sites.
2. Editing one byte of any materialised copy makes `bun run test` fail in the conformance test with that copy's path; reverting restores a pass.
3. Re-adding a hand-written `[A-Z0-9][A-Z0-9-]{1,23}` literal to any of the six migrated skills makes the conformance test fail, naming the file.
4. The conformance test output names `ki-batch` as pending under `KI-HARNESS-GOV-125`.
5. A housekeeping run identifier with a digit-leading code is accepted by `ki-work-housekeeping`.
6. No existing accepted identifier changes verdict: every existing test in the six skills passes unchanged, and `ki repo audit` over this repository reports no new finding.
7. Each focused skill audit passes.

```bash
bun run test
bunx tsc --noEmit
for s in ki-skills ki-work-roadmap ki-repo ki-work-housekeeping ki-decision-records ki-specs; do ki repo audit --skill "$s" --progress never; done
```

## Dependencies / blocks

Nothing blocks this record and it blocks nothing. The `ki-batch` adoption merged from `KI-HARNESS-GOV-125` follows the module's creation within this record. [KI-HARNESS-GOV-093](KI-HARNESS-GOV-093-keep-plugin-projection-current.md) is the same one-fact-many-copies shape applied to the plugin projection but shares no build order.

Sequencing: this record, `KI-HARNESS-GOV-095` (done) and `KI-HARNESS-GOV-105` (done) all edit the shared `ki-work-roadmap` files `scripts/rubric/contexts/roadmap-evidence.ts`, `scripts/rubric/items/index.test.ts` and `references/rubric.md`; this record, `KI-HARNESS-GOV-095` (done) and `KI-HARNESS-GOV-103` (done) all edit `references/standards-repository-roadmaps.md`. The anchors differ; whichever lands second rebases.

## Documentation impact

### Decision Records

None. `ADR-KI-HARNESS-SKILLS-012` already provides the shared-module mechanism and `ADR-KI-HARNESS-SKILLS-015` the grammar; this record applies both.

### Specifications

`standards-repository-roadmaps.md` names the shared module as the single executable definition of the `<REPO>` grammar.

### Guides

None.

### Roadmap

The `ki-batch` half, formerly `KI-HARNESS-GOV-125`, is now part of this record.

## Discussion

Two routes, not exclusive.

**The checklist question.** Add to Duplication and reuse in `skills/keystone/ki-repo/references/mode-review.md`, which is already the "one fact, one authoritative definition" lens and whose last item applies the same shape to security-relevant logic. Wording: _A change to a constraint reached every skill that restates it._ The evidence is one grep for the regex literal or the prose sentence across `skills/`, which is cheap enough that a reviewer will actually run it.

Against it: the checklist's own rule prefers deleting an item that never fires, and a constraint grammar changes perhaps a few times a year. For it: the failure mode is silent (nothing goes red, a repository just quietly invents a workaround) and silent failures are what a checklist earns its keep on.

**The structural fix.** The question documents a hazard rather than removing it. The cause is that several skills each vendor a copy of one grammar with no shared definition and nothing that fails when they diverge. A single definition, or a conformance test asserting the copies agree, would make the question unnecessary. This is the same shape as [KI-HARNESS-GOV-093](KI-HARNESS-GOV-093-keep-plugin-projection-current.md): a fact with multiple copies and no drift check.

**Decided 2026-09-25: standardise the grammar.** One shared definition, with the copies held to it by a conformance test that fails when they diverge. That removes the hazard rather than documenting it, and it is why the checklist question is not being added: a question asking a reviewer to grep for copies of a constraint earns nothing once the copies cannot silently disagree.

### Decision

One shared identifier grammar, enforced by a conformance test across the vendored copies rather than imported from `tools-ki`, with `ki-batch` added as the seventh restating skill. Decided by the Fable reviewer under delegated autonomy, reversible.

The shared definition is enforced across vendored copies by a conformance test in this repository, not imported from `tools-ki`; skills stay independently installable under `ADR-KI-HARNESS-012`, and the shared-module contract already gives each consumer a local copy. `ki-batch` is added as the seventh restating skill. The `ki-batch` evidence from `KI-HARNESS-GOV-125` also confirms the structural route over the checklist fallback: `ki-batch` spelled the grammar `[A-Z][A-Z0-9-]*-\d{3}` and never shared the roadmap's literal, so a grep for that literal would not have found it. The conformance test therefore scans for the grammar's shape in named skills, not only for one spelling.

**Why `ki-work-roadmap` is the provider.** Its standard owns the `<REPO>` grammar (`standards-repository-roadmaps.md`), and `ki-repo` validates `repo_code` only because `ki-work-roadmap` is declared. A shared-module dependency is packaging rather than governance, so `ki-repo` depending on a `ki-work-roadmap` module creates no composition edge.

- [ADR-KI-HARNESS-SKILLS-015](../decisions/ADR-KI-HARNESS-SKILLS-015-identifier-scope-segments-accept-any-legal-repository-code.md) relaxed both governance instruments
- [ADR-KI-HARNESS-SKILLS-012](../decisions/ADR-KI-HARNESS-SKILLS-012-local-copies-for-shared-modules.md) owns the shared-module contract
- [KI-HARNESS-GOV-093](KI-HARNESS-GOV-093-keep-plugin-projection-current.md) was the same one-fact-many-copies shape applied to the plugin projection, now closed as superseded because the projection is retired

### Merged from KI-HARNESS-GOV-125

Kris approved merging `KI-HARNESS-GOV-125` (Share batch identifier grammar) into this record on 2026-10-07, under decision 17 of the state-of-play design: the `ki-batch` adoption is the conformance test's pending entry for the same module. `5g-emerge-phase2` (`repo_code = "5GE-P2"`) raised it on 2026-10-01 after `ki-batch` rejected `+/_BATCHES/5GE-P2-BATCH-001.md` and its digit-leading item identifiers, which `ki-work-roadmap` accepts. The five `ki-batch` sites are under `skills/change-management/ki-batch/scripts/internal/`: `identifiers()` and the batch identity check in `authorisation.ts`, the run-ledger marker there, the retention pattern in `batch-retention.ts`, and the legacy migration in `legacy-batch-migration.ts`. The Steps and Verify sections above predate the merge and still treat `ki-batch` as a pending entry: re-plan them to include the adoption before implementation. The merged record's reproduction and site inventory are at [its last open revision](https://github.com/knowledgeislands/ki-agentic-harness/blob/05d6acecb33dc19a6ac4aab7b077700c5ae9d2fc/docs/roadmap/KI-HARNESS-GOV-125-share-batch-identifier-grammar.md).
