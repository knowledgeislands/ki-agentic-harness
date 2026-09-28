---
note_type: admin/operations/activity
id: EXAMPLE-HK-001
title: Repository review
status: paused
realization: manual
author: Repository owner
housekeeping:
  cadence: P1W
  last_run: null
  last_run_ref: null
  grace: P1D
  spawn_policy: manual
  spawn_horizon: next
  active_run: null
---

# Repository review

## Goal

Assess whether this knowledge base remains coherent, useful and directed towards its purpose, using the master `ki-repo` REVIEW checklist. Weekly and ad-hoc invocations share this Activity. `ki-repo-kb-activities` owns the note and index; `ki-work-housekeeping` owns its recurring-work profile.

## Procedure

1. Before adoption, apply `ki-work-housekeeping`'s stock-review adoption rules: reconcile equivalent reviews, replace the example identity and author, supply required KB metadata and index coverage, and agree scope, budget and evidence destination. Retain the pause until explicitly enabled; no external scheduler is required.
2. Before each run, check the shared active-run reservation. Reuse or report an unfinished run rather than duplicating it. Admit an ad-hoc run through the same guarded lifecycle with explicit authority; do not bypass a pause or falsify the due date. Do not create a second definition in Streams.
3. Complete the `ki-repo` REVIEW invocation with the admitted revision, purpose, applicable checklist sections, depth/budget and last-reviewed baseline. State any missing baseline and evidence gaps. Bound weekly scope around material change and unresolved findings; use a separately agreed deeper scope when needed.
4. Perform the read-only REVIEW assessment. Cover purpose, consolidation, drift, learning and possible repositioning, redirection or retirement through the relevant master-checklist sections. Apply KB knowledge and operational concerns; explain inapplicable engineering lenses. Reconcile existing work and deeper reviews before proposing new findings or work.
5. Return the assessment in the agreed format and destination, identifying findings, proposed routes, uncertainties and decisions needed. Evidence return is separately authorised and respects the KB canonical-change gate; the assessment grants no implementation, work adoption, direction change, acceptance, pruning or publication authority.

## Successful-run evidence

The linked run in `Streams/Roadmap/` identifies the reviewed revision, comparison baseline, scope, commands and results, material findings and proposed routes, evidence locator and unresolved gaps. A no-change conclusion needs the same bounded evidence. Retain any separate review record through `ki-repo`'s review-retention contract; durable conclusions belong in their normal repository homes. Only approved `ki-accept` closure updates this Activity's successful-run profile and clears its reservation; scheduler completion alone does neither.

## Obsolescence

Propose retirement only when an accepted replacement covers the review purpose or the base's owner explicitly ends it. Resolve any active run first; retain the retired Activity's rationale, evidence and outstanding findings. Replacing an executor does not retire this obligation.
