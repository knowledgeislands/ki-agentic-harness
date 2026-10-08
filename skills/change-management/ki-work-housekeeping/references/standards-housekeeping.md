# Housekeeping template standard

## Contents

- [Scope](#scope)
- [Placement and identity](#placement-and-identity)
- [Stock repository review](#stock-repository-review)
- [Frontmatter](#frontmatter)
- [KB recurring-work profile](#kb-recurring-work-profile)
- [Optional execution environments](#optional-execution-environments)
- [Due-run procedure](#due-run-procedure)
- [KB adapter](#kb-adapter)
- [Retention](#retention)

## Scope

This standard defines durable recurring-work templates. A template is not a roadmap item: it is the source from which `ki-next` may spawn one due run. The run uses the common forward-work lifecycle and carries the template identifier plus its scheduled date. Partition templates by independently runnable purpose and cost, not by every artifact type.

## Placement and identity

Project repositories use one flat template directory, `docs/housekeeping/`, with filenames `<REPO>-HK-<NNN>-<slug>.md`. Knowledge Bases use one canonical Activity note in the collection owned by `ki-repo-kb-activities` (default `Admin/Operations/Activities/`, or its configured `activities_dir`). There is no second KB template in Streams.

Every recurring definition has a stable `id` in `<REPO>-HK-<NNN>` form, unique within its collection. Project filenames repeat that identifier followed by a lowercase kebab-case slug. KB filenames follow the Activity note convention; the same note holds both the adopted behaviour and its recurring-work profile.

## Stock repository review

Repository review is a stock recurring obligation for both Projects and Knowledge Bases. Use the [Project template](../assets/repository-review-project.md) or [KB Activity template](../assets/repository-review-activity.md) when adopting it. The master checklist, invocation, assessment output and review-evidence retention remain owned by `ki-repo` REVIEW; do not copy the checklist into the definition or an execution routine.

The proposed cadence is weekly (`P1W`), with ad-hoc review through the same definition and active-run guard. Templates start paused with manual admission: availability in the stock set is not adoption or activation. Before adoption, reconcile existing engineering, knowledge and repository reviews; reuse an equivalent definition and its identity, evidence and active run rather than creating a duplicate. A weekly bounded review may reference deeper periodic reviews without repeating them. Record an explicit reason if repository review is not applicable.

Replace the example identity with an allocated repository-local ID only when no equivalent definition exists. Place a Project template under its identity-bearing filename, or a KB Activity in its configured collection with the actual author, required KB metadata and index entry. Preserve established successful-run evidence; do not populate it from the current date or revision. Declare the applicable skills and agree the review's purpose, scope, depth/budget and repository-owned evidence destination before enabling the obligation. Keep scheduler day/time, IANA timezone and approved dispatch settings in the execution binding, not invented housekeeping fields.

Each run uses `ki-repo` REVIEW to examine purpose and ecosystem fit, consolidation, drift, learning and possible repositioning, redirection or retirement, applying only relevant checklist sections. Compare with the evidenced last-reviewed revision where available; a missing baseline remains an explicit gap. This is judgement-led assessment, not a substitute for mechanical audit/conform. Existing findings and work are reconciled before recommending new work. Findings propose routes; they do not authorise repository repairs, direction changes, work adoption, acceptance, pruning or publication.

The assessment itself is read-only. Admission and approved evidence return are separate bounded lifecycle writes: agree the exact retained output before dispatch, use the normal run record and `ki-repo` review-retention contract, and keep durable conclusions in their owning repository records. Only approved `ki-accept` closure updates the definition's successful-run fields. An external routine points to this canonical definition and uses the same admission guard as an ad-hoc caller; it is not another checklist or backlog.

## Frontmatter

```yaml
---
id: KI-HARNESS-HK-001
title: Engineering alignment
status: active
cadence: P1M
last-run: null
commit-threshold: 100
last-run-ref: null
grace: P7D
spawn-policy: when-overdue
spawn-horizon: now
active-run: null
initiative: platform-foundations
component: skills
purpose: upkeep
---
```

`status` is `active` or `paused` for Project templates. Retiring a Project template means explicitly ending its schedule and disposing any active run before deleting the template. KB Activities also permit retained `retired` status with rationale and `housekeeping.active_run: null`; retired Activities never enter schedule evaluation. `cadence` and `grace` are ISO-8601 calendar durations using one positive unit: `P<n>D`, `P<n>W`, or `P<n>M`. `last-run` is the evidenced ISO date of the last successfully completed review, or `null` without successful-run evidence. A future `last-run` blocks evaluation. `active-run` is `null` or the linked run identity. `spawn-policy` is `manual`, `when-due`, or `when-overdue`; `spawn-horizon` is one of `now`, `next`, `soon`, or `future`. The KB profile maps these fields as described below.

`cadence` and `grace` are ISO-8601 calendar durations using one positive unit: `P<n>D`, `P<n>W`, or `P<n>M`. `last-run` is the evidenced ISO date of the last successfully completed review, or `null` for a template without successful-run evidence. A future `last-run` is invalid completion evidence and blocks evaluation; it cannot postpone calendar review or enable volume-triggered work. `active-run` is `null` or the linked run identity. `spawn-policy` is `manual`, `when-due`, or `when-overdue`; `spawn-horizon` is one of `now`, `next`, `soon`, or `future`. The former `waiting-for` and `parked` values warn during the roadmap [migration tolerance window](../../ki-work-roadmap/references/standards-repository-roadmaps.md#migration-tolerance).

Recurring work is classified like any other record, under the [work-item classification](../../ki-work-roadmap/references/standards-work-item-format.md#classification):

- **`initiative`** names the territory Initiative the obligation serves. The Initiative is the obligation's home: recurring work never belongs to a finite Project, so a template declares `initiative` rather than `project`; a template without it warns during the migration window.
- **`component`** optionally names the repository component the run touches, from the `.ki.toml` vocabulary.
- **`purpose`** optionally says why the obligation exists, usually `upkeep`.
- **`kind`** optionally overrides the runs' default `audit`.

Each spawned run inherits `initiative`, `component`, and `purpose`, takes `kind: audit` unless the template sets another kind, and never carries `project`.

Two optional fields enable change-volume scheduling without changing calendar-only templates:

- **`commit-threshold`** is a positive safe integer selected for this particular obligation. The example's 100 is not a global default. Omission disables the volume trigger.
- **`last-run-ref`** is the full lowercase 40- or 64-hexadecimal commit identity actually covered by the last successful review, or `null` when no verified anchor exists. A non-null value requires a non-null `last-run`. It is not the housekeeping run's implementation baseline, current HEAD, or acceptance commit unless the review evidence explicitly establishes that exact revision as reviewed. It may be retained on a calendar-only template for a later opt-in.

An opted-in threshold with an absent or null anchor is valid but its volume is unknown. Do not infer an anchor from a date, silently use current HEAD, or backfill a historical date. Existing `last-run` values recorded under the former scheduled-date convention remain historical evidence; future accepted runs record the actual successful completion date. A broadened template discloses the narrower scope of any retained prior review.

The body has non-empty `## Goal`, `## Procedure`, `## Successful-run evidence`, and `## Obsolescence` sections. It is a concise source record, not a history log.

AUDIT accepts only safe regular Markdown files below the selected root, without following symbolic links. Project templates admit only the required and optional fields above. A KB Activity keeps its normal Activity and KB metadata; only its nested `housekeeping` mapping has a closed scheduling schema. The audit checks identity, dates, body sections, and linkage. A non-null active-run must resolve to exactly one unfinished roadmap record naming this definition in `housekeeping_template` and carrying a valid `scheduled_for` date. No two definitions may name the same active run.

## KB recurring-work profile

An Activity opts into this lifecycle by declaring a `housekeeping` mapping. Declare and activate `ki-work-housekeeping` alongside `ki-repo-kb-activities`; the latter owns Activity identity, indexing, realization, and the location binding, while this skill owns the recurring profile. An ordinary Activity without the mapping is not a housekeeping template, even if it has a scheduled realization.

Keep `id`, `title`, and `status` at the Activity's top level. Use snake_case inside the mapping: required `cadence`, `last_run`, `grace`, `spawn_policy`, `spawn_horizon`, and `active_run`; optional `commit_threshold`, `last_run_ref`, `initiative`, `component`, `purpose`, and `kind`. These map one-to-one to the Project template's hyphenated fields. There is one status, not a second nested lifecycle. All schedule and acceptance rules below apply to those mapped fields.

```yaml
---
note_type: admin/operations/activity
id: EXAMPLE-HK-001
title: Weekly review
status: active
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
  initiative: platform-foundations
  purpose: upkeep
---
```

Use the normal Activity body plus the four recurring-work sections above. The example is a manually admitted obligation, not permission to create or activate a schedule. An external scheduler's name and environment remain realization metadata, not the authority for cadence, procedure, or successful-run evidence.

## Optional execution environments

Recurring definitions are repository-owned and remain usable by a person or another execution environment with the declared skills and tooling. A scheduler may trigger evaluation and coordinate a run, but does not own another backlog or successful-run state. Before spawning, every caller re-reads the same definition and uses the same serialised reservation; an existing active run is reused or reported, never duplicated. Schedule activation, repairs, acceptance, and pruning retain their separate authority gates. Capture durable outcomes and learning in their repository-owned destinations rather than only in scheduler history.

## Due-run procedure

The calendar boundary is `last-run + cadence`; the overdue boundary adds `grace`. Calendar-month arithmetic clamps to the last valid day of the destination month. A template without any successful `last-run` is due immediately: either automatic policy may spawn its initial run, while `manual` still requires confirmation. Do not slide its initial grace window forward on every evaluation.

The optional volume boundary is reached when the number of first-parent integration commits after `last-run-ref` is at least `commit-threshold`. A merge counts once, not once for every commit on its merged branch; linear or fast-forward commits each count once. Either calendar or volume can make a template due. Reached volume bypasses calendar grace, including for `when-overdue`, but never bypasses `manual`, `paused`, or `active-run`.

Volume evidence requires the exact anchor on the current HEAD's first-parent history in the selected working-copy root. Missing, divergent, rewritten, grafted, shallow, incomplete, moving, or unavailable history remains unknown, never zero. Reads use fixed argument arrays, disable optional Git locks, replacement objects and lazy fetch, and never fetch or mutate repository state. An independently reached calendar boundary remains actionable when volume is unknown; report the uncertainty separately.

The read-only callable [schedule evaluator](../scripts/rubric/contexts/schedule.ts), `evaluateHousekeepingSchedule({ repository, schedule, today })`, is the owner implementation used by hosted `HOUSE-2` diagnostics and by the `ki-next` process caller. `today` is an explicit UTC ISO date. Map template keys to `lastRun`, `commitThreshold`, `lastRunRef`, `spawnPolicy`, and `activeRun` in its typed schedule input; status, cadence, and grace retain their names. The result carries `action`, `due`, calendar boundaries, `scheduledFor`, contributing `triggers`, structured `commits` evidence, and `writes: false`. This is a domain capability, not another command, scheduler, or private CLI.

- **`ignore`**: neither trigger permits spawning yet, including an unelapsed calendar grace period.
- **`propose`**: a due manual template requires exact human confirmation.
- **`spawn`**: the declared automatic policy permits one draft; this evaluator itself writes nothing.
- **`blocked`**: paused, already reserved by an active run, or invalid schedule input.
- **`unknown`**: unavailable volume evidence prevents deciding eligibility, with no independently actionable calendar boundary.

After fresh grounding, `ki-next` consumes this result and rechecks the active reservation before any write. For a calendar-due run, `scheduled_for` is the calendar due date; for volume-only or initial runs it is the evaluation date. A non-null `active-run` prevents another spawn. Spawning atomically creates the linked ordinary `draft` at `spawn-horizon`, with the inherited classification and `kind: audit` unless the template sets another kind, and sets `active-run`, without changing either successful-run field. Manual confirmation authorises only that draft, not implementation or acceptance.

Only `ki-accept`, as part of one coherent approved closure and template-reconciliation commit, changes the run to `done`, records the evidenced actual completion date in `last-run`, records the verified reviewed revision in `last-run-ref`, and clears `active-run`. Do not first commit a `done` run with a stale active reservation; a prior committed `done` state is required only before later pruning. For a commit-triggered template, unavailable reviewed-revision evidence blocks that success reconciliation; never manufacture the anchor. Calendar-only templates may retain a null anchor. The run's original `scheduled_for` remains unchanged and is no longer copied into `last-run`.

Failed, abandoned, or superseded runs do not advance either successful-run field and retain `active-run` until an explicit disposition or replacement. Disposition clears only the link; replacement atomically substitutes a verified linked identity without changing successful-run evidence. This skill owns the template-side state machine; it performs neither process transition.

## KB adapter

The Activity note is the sole standing definition; a due run becomes a linked item in `Streams/Roadmap/`, with its horizon in frontmatter. The base's canonical-change gate applies to adopted behaviour and profile changes. Approval of a run and its closure must explicitly cover the bounded profile reservation and evidence updates; canonical placement is not permission for arbitrary Admin edits. Preserve stable IDs, active-run links, successful dates, reviewed revisions, and rationale when reconciling retained Streams templates into Activities. Conflicting or duplicate definitions block scheduling pending an owner-approved reconciliation; audits and conform do not move or delete them.

## Retention

Completed runs are retained as `done` or `cancelled` records in both adapters until `ki-accept prune` receives an explicit selection. A template retains date and immutable review evidence, not a dependency on the continued presence of an unpruned run file. Lightweight working-area tidying remains subject to each specialist area's retention policy; recurring review does not confer general deletion authority.
