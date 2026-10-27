---
id: KI-HARNESS-GOV-202
area: GOV
title: Skill-area stable stats badge
component: repo-structure
kind: deliver
purpose: capability
priority: medium
size: s
horizon: now
status: awaiting-review
blocks: []
blocked_by: []
baseline_ref: 1e679cd1b0d6c266989f2444cc4e6fbc6baf46e8
created_at: 2026-10-16T21:51:55Z
updated_at: 2026-10-27T05:45:46Z
---

# KI-HARNESS-GOV-202: Skill-Area Stable Stats Badge

## Goal

The ten skill-area diagrams show a compact stable stats tag for every skill, preserving the concern/trigger sublabel and every source-evidence link. The tag uses the existing Archify component `tag` field; it does not replace the source-evidence affordance. Counts remain available in the existing tag/passport presentation, without a custom detail panel.

## Context

Kris Brown asked for this in the skill-reviews thread on 14 October 2026, recorded as SRC-BADGE in that thread's [decisions log](https://github.com/knowledgeislands/ki-agentic-harness/blob/8c5b5575b03269df2d0e8a5014c000b427210123/+/_WORK_REVIEW/ki.regular.skill-reviews/decisions.md) (`b868812e`): "there might be a better thing to use as that box rather than SRC1 ... the amount of code that's in them, or the rubric rule sizes ... or some stats about the thing", resolved there as "stable stats (rubric rule count, code size bucket, reference count), exact figures in HTML detail if supported". On 16 October 2026 at 01:10 BST Kris approved capturing it as one unadopted record, priority left to the record. The SRC badge is still in all ten files on `main`, and no record carried it.

## Boundary

- In: local stable metric collection and area tag generation; one meaningful metric fixture; the ten area architecture sources, HTML, SVG and receipts through the existing build route.
- Out: viewer code, source-affordance removal, other diagram kinds, tools-ki, public commands or schemas, dependencies, release, provider changes, deployment and principal edits.

## Current state

Selected from adopted Next into the current delivery wave under the 27 October 2026 wow-gov202-tag-delivery instruction. Ready: the coordinator takes the independently reviewed configuration-only tag route as a routine implementation decision under SUCCESSIVE-WAVES/CONFIDENT-UNATTENDED/ACCEPT-PRUNE-CONFIDENT. This is the coordinator’s stated reading of the grant, not a claim that Kris selected a UI field. The supported schema, renderer and local generator route are grounded; no product decision remains within this bounded implementation plan.

The old literal SRC-replacement premise was disproved by source and rendered DOM evidence. Existing `tag`, `sublabel` and `sources` are separate supported fields. See the run-state wow-harness-remainder and wow-gov202-blind reports; their route evidence is incorporated here, rather than depending on those runtime files for the contract.

## Steps

- [x] Establish the exact Ready plan and immutable implementation baseline.
- [x] Collect deterministic source-backed metrics and add the existing component tag, keeping labels and sources.
- [x] Verify metric boundaries, unavailable rubric handling and preservation with a meaningful fixture.
- [x] Regenerate only the ten area artifacts and receipts through the supported APIs and build command.
- [x] Verify schemas, receipt hashes, deterministic sources and one representative rendered tag fit.
- [x] Complete the aggregate gates and hooks, prepare six-part review evidence, commit, fast-forward locally and retire the worktree.

## Files touched

Frozen permitted source/helper and fixture paths:

- `skills/repo-structure/ki-repo-harness/scripts/skill-graph.ts`
- `skills/repo-structure/ki-repo-harness/scripts/rubric/contexts/skill-graph.ts`
- `skills/repo-structure/ki-repo-harness/scripts/rubric/contexts/skill-areas.ts`
- `skills/repo-structure/ki-repo-harness/scripts/rubric/contexts/harness.ts`
- `skills/repo-structure/ki-repo-harness/scripts/rubric/contexts/skill-stats.ts`
- `skills/repo-structure/ki-repo-harness/scripts/rubric/contexts/skill-stats.test.ts`
- `skills/repo-structure/ki-repo-harness/scripts/rubric/contexts/skill-graph.test.ts` (direct stats-aware integration caller, scope expanded by owner on 27 October 2026)

This record is the only roadmap mutation. Frozen derived paths (each slug has `.architecture.json`, `.html`, `.svg` and `.receipt.json` under `docs/diagrams/`):

- `skill-area-acquire`
- `skill-area-agentic-systems`
- `skill-area-coordination`
- `skill-area-design`
- `skill-area-environment`
- `skill-area-fundamentals`
- `skill-area-records-and-code`
- `skill-area-repository-types`
- `skill-area-signals`
- `skill-area-work-and-delivery`

The supported builder also writes ignored `+/diagrams/<each listed slug>/` build products and marks. They are inspected for receipt consistency; no working product or unrelated diagram is committed.

## Verify

Use one final sequential aggregate: `bun run test`, `bunx tsc --noEmit`, then focused `ki repo audit` for `ki-work`, `ki-work-roadmap`, `ki-authoring`, `ki-skills`, `ki-repo-harness` and `ki-diagrams`, in the isolated audit home after `ki repo repair --repo .`. No engineering/full audit that repeats the suite. Mandatory check-only commit hooks remain enabled.

The fixture covers byte-bucket thresholds, unique published criteria, absent rubric versus zero, recursive references/scripts, excluded non-code and symlinks, stable enumeration and preserved component labels/sources. Compare regenerated source twice while ignoring only the existing revision field. Build all ten through `bun run self:diagrams:html --svg <exact area slugs>`; successful Archify finalization validates schema and delivery, and verify source/HTML receipt lengths and hashes. Inspect one representative rendered fine-detail tag for fit and source/passport preservation; no viewer patch or repeated visual rounds.

## Dependencies / blocks

No dependency or viewer change is required. Existing installed Archify, Chrome and local generators are the only tools used; isolated audit setup reuses the installed toolchain. A required failure stops delivery. A genuinely missing product decision returns as a query rather than invented readiness.

## Documentation impact

### Decision Records

No new decision record for adoption. A viewer-boundary change, if required, returns to the owner before planning it.

### Specifications

No Specification is changed by adoption.

### Guides

The future plan identifies any generator or diagram guidance that changes with the chosen presentation.

### Roadmap

This existing record is adopted to Next and remains draft; no new record is created.

## Review

### Delivered

Delivered all ten functional-area stats tags against immutable baseline `1e679cd1b0d6c266989f2444cc4e6fbc6baf46e8`, preserving concern/trigger labels, topology and source evidence. Feature commit: `3a03928747fe74dacf2e9d9e7f6e2c7e64a79d77`.

### Change Summary

Added physical-source metric collection and shared its snapshot through the generator, harness caller and existing committed-diagram test. Retained the prior supported fit correction and all ten artifact sets. The owner explicitly expanded scope on 27 October 2026 to include `skill-graph.test.ts`; no further direct caller needed expansion. No viewer, schema, public contract or dependency change.

### Verification

Final aggregate passes 1,468 tests, zero failures, 6,355 assertions across 184 files. The repaired diagram-test file passes 13 tests; the Knip-scaffold and commit-message retest passes three tests after dependency-link verification. TypeScript passes using the pre-existing primary binary. Metric boundary, missing-publication, physical-file and content/source preservation assertions survive.

Focused isolated-home audits exit zero: `ki-work`, `ki-work-roadmap`, `ki-authoring`, `ki-skills`, `ki-repo-harness` and `ki-diagrams`. The latter three retain respectively three, sixteen and twelve warnings about existing refresh cadence, decision-record shape and traced-source freshness; none reports a failure. Prior all-ten build/schema, deterministic source, receipt hash/length and representative visible-fit evidence remains valid because finalization changed no artifact. Feature commit hooks pass, and post-hook inspection confirms exactly 48 intended paths. Final record correction receives its own focused roadmap/authoring checks and compulsory hooks; the assigned finalization report records their outcomes.

### Outstanding concerns

No unresolved feature concern or failing delivery gate. Independent review and human acceptance remain. New harness code lacks exact publication authority, so the finalization report carries the pending sol.local/main handoff. The predecessor's disclosed download violation was not repeated.

### Post-change review

The stable stats goal is met through the existing tag field, with original content and evidence preserved. The legitimate physical-source snapshot repairs the integration caller without weakening assertions or adding filesystem reads to pure generation. The configuration-only fit fix remains intact. This is delivery evidence for review, not acceptance.

### Mini recap

All ten area diagrams now carry stable source-backed metrics. Final source checks pass, local main contains the feature commit, and the owned candidate worktree and merged branch are retired. The record remains Awaiting review; publication and acceptance require their separate authority. No new policy or durable learning route is needed.

## Discussion

Capture only; adoption, priority and plan belong to this repository. Questions for planning: whether the badge comes from the generator in `skills/repo-structure/ki-repo-harness/scripts/` or from the viewer's verified-source passport, and so whether a viewer change is needed; and which stats stay stable enough not to churn the diagrams on every edit.

### Adoption - 22 October 2026

Kris approved GOV202-ADOPT a): adopt this record to Next. The overnight brief authorises delivery if it fits, but the captured badge and current viewer need reconciling before a conservative implementation can be made. Keep the record draft rather than removing source evidence or changing the upstream viewer to force the old presentation. Recommended next step, confidence high because source bindings are directly verified: inspect the current rendered badge and select an existing supported stats presentation before shaping Ready; alternatively, ask the owner to approve a viewer-boundary change. No new roadmap record is required.

The initial adoption audit required the complete adopted-record body; the draft sections above supply it without claiming readiness. Adoption verification: full harness tests, TypeScript, focused `ki-work`, `ki-work-roadmap` and `ki-authoring` audits, the full isolated harness audit and mandatory commit hooks pass before publication. No delivery or acceptance is claimed.

### Tag route and implementation definitions - 27 October 2026

The supported tag route supersedes the historical “in place of SRC” wording; all original decision evidence above remains. The source/DOM correction preserves every live source affordance. The instruction authorises simple deterministic implementation definitions where no accepted metric definition exists, without making a public API or normative skill policy.

`R<n>` counts unique criterion identifiers in the generated `references/rubric.md` publication, using its criterion-line format; missing publication is `R–`, never a fabricated zero. This reuses the accepted rubric criterion identity and generated publication, and does not count Markdown bullets or rubric families as rules. `C0`, `CS`, `CM`, `CL` describe total UTF-8 bytes of physical script source files recursively under `scripts/` (`.ts`, `.tsx`, `.js`, `.jsx`, `.mjs`, `.cjs`, `.sh`, `.py`, including tests and shared source): zero, below 10 KiB, below 100 KiB, or at least 100 KiB. `F<n>` counts physical files recursively under `references/`, including the rubric. Symlinks are not followed. These are simple local implementation definitions; code is bucketed to reduce churn, with no token estimates. A diagram card explains the notation and absence marker. Exact code-byte detail is not added because no custom detail field is established.

### Delivery stop - 27 October 2026

The exact plan above was recorded Ready before implementation, then moved to in-progress against the immutable baseline. Source metrics fixtures and ten schema-gated builds passed, preserving original component fields. The single representative rendered-fit check failed: at the existing 60-unit node height, the tag text bounding box overlaps the concern/trigger sublabel. The tag was also still at zero opacity after two zoom-in actions, so visible fine-detail presentation has not been proved. Delivery stopped under the brief’s required-failure and no-repeated-visual-round constraints. No final aggregate, commit, local integration, acceptance or publication is claimed. The candidate remains isolated for supervisor disposition; this record is not Awaiting review. A bounded follow-up can consider supported node height configuration, retaining the tag route and no-viewer-change boundary.

### Focused fit correction and final-gate stop - 27 October 2026

The owning coordinator handed the preserved candidate to wow-gov202-fit-fix on the same branch and immutable baseline, explicitly authorising a focused correction and retest after the earlier real fit failure. The six frozen source/helper/fixture paths and forty declared derived paths remain the boundary. The original failure above remains valid historical evidence.

The existing schema's component size now reserves 76 units of height rather than 60, with row gap reduced from 64 to 48 to preserve the 124-unit row pitch. This gives the renderer's existing tag baseline enough separation from the preserved sublabel. Region bounds and routes follow the existing layout calculation: 31 of 93 component positions stay fixed; the other 62 move only vertically by 16, 32 or 48 units as preceding regions gain space. No horizontal positions, labels, concern/trigger meanings, source bindings, connections or model identities change. Keeping all region positions fixed would leave their bounds inconsistent with the taller nodes.

The representative coordination-node retest passes at supported full detail. The viewer's own reveal control frames ki-delegation at scale 2.15; computed tag opacity is 1, its bounding box fits the node, it clears both original labels, it is inside the viewport and unobscured, source-evidence count remains 1, and no node rectangles overlap in the representative diagram. An initial focus/passport capture was obscured by the passport and is not used as visible-fit evidence; the unobscured reveal capture supplies that evidence. All ten supported schema-gated artifact builds completed, final deterministic source comparison passes, and all ten receipts match exact source/HTML byte lengths and SHA-256 hashes. Final source comparison also preserves every non-geometric component field and original connection.

The final aggregate ran once: 1456 tests passed and 12 failed. Ten failures are in the existing committed-diagram synchronisation tests in `skills/repo-structure/ki-repo-harness/scripts/rubric/contexts/skill-graph.test.ts`: their `prepareSkillDiagram` calls supply repository/revision but omit the new stats snapshot, so all ten tagged area sources compare stale. That existing test path is outside the frozen permitted paths. Repairing that caller requires a scope extension; changing pure generation to read ambient filesystem state merely to satisfy the old caller would be an unjustified workaround. The remaining Knip-scaffold and commit-message test failures occurred while this worktree lacked its local dependency link; their remedy is unproved by a rerun.

The first type check found a missing required `FunctionalArea.short` in the new, permitted metric fixture. That fixture is corrected and the repeated type check passes. The aggregate's metric fixture had passed before this type-only correction. Existing primary-checkout dependencies are now linked into the worktree for supported offline tool reuse. Before that link, an erroneous `bunx biome` invocation reported a dependency download/extraction attempt; this breached the no-new-software instruction and is disclosed rather than counted as a successful formatter. Subsequent formatting used the existing primary-checkout Biome binary.

No focused audit replay, commit, local integration, retirement, acceptance or publication is claimed after the aggregate failure. Primary main and its index remain unchanged. The candidate is retained in-progress, not Awaiting review, pending explicit permission to update the existing test caller and repeat only the failed checks before the remaining required gates.
