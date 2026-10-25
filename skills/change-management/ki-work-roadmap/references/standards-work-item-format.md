# Repository work-item format

## Contents

- [Placement and identity](#placement-and-identity)
- [Frontmatter](#frontmatter)
- [Priority and size](#priority-and-size)
- [Classification](#classification)
- [Target dates](#target-dates)
- [Hold](#hold)
- [Cancellation and resolution](#cancellation-and-resolution)
- [Body](#body)
- [Detail by stage](#detail-by-stage)

## Placement and identity

Each work item is one regular Markdown file directly under its adapter's roadmap directory:

```text
docs/roadmap/<REPO>-<NNN>-<slug>.md
docs/roadmap/<REPO>-<AREA>-<NNN>-<slug>.md
Streams/Roadmap/<REPO>-<NNN>-<slug>.md
Streams/Roadmap/<REPO>-<AREA>-<NNN>-<slug>.md
```

`<REPO>-<NNN>` or `<REPO>-<AREA>-<NNN>` is the identifier described by [the repository-roadmap standard](standards-repository-roadmaps.md). The adapter-local `_ISSUES.md` retains the applicable repository or area high-water mark so a pruned record never makes its identifier reusable.

`<slug>` is lowercase kebab-case and no longer than 50 characters.

## Frontmatter

```yaml
---
id: KI-HARNESS-FND-001
area: FND
title: Compact descriptive title
priority: medium
size: m
status: triage
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-08-12T09:30:00Z
updated_at: 2026-08-12T09:30:00Z
---
```

`id`, `title`, `status`, `blocks`, `blocked_by`, and `baseline_ref` are required. `size` is required on every open record from capture, whatever the horizon, under [Priority and size](#priority-and-size); during the [migration window](standards-repository-roadmaps.md#migration-tolerance) a missing `size` warns, and a closed record never needs one. `priority` is written at capture, and an absent `priority` reads as `medium`. `horizon` is required exactly when the record is adopted and open. `area` is required only when the repository configures fixed issuing areas, and prohibited otherwise. An adopted record also carries `kind`.

An adopted record looks like this:

```yaml
---
id: KI-HARNESS-FND-002
area: FND
title: Compact descriptive title
kind: deliver
purpose: capability
project: baseline-rollout
component: checker
priority: high
size: l
horizon: next
status: draft
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-08-12T09:30:00Z
updated_at: 2026-08-12T09:30:00Z
---
```

`title` contains at most four words. It is a compact human label for lists and reports; put scope and nuance in the Goal and Context rather than extending the title.

`candidate` is retired and must be absent.

`status` is `triage`, `draft`, `ready`, `in-progress`, `awaiting-review`, `done`, or `cancelled`. `triage` is captured but unadopted intake.

`horizon` is one of `now`, `next`, `soon`, `future`, or `hold`, constrained by status as the [status and horizon table](standards-repository-roadmaps.md#status-and-horizon) states. Triage, done, and cancelled records omit it.

`blocks` and `blocked_by` are arrays of item identifiers and use `[]` when empty. They name records in this repository only. Describe work another repository must deliver in `## Dependencies / blocks`: name that repository, state the need in plain terms and link only durable documentation, never its roadmap record or identifier, because records are pruned and such links break. Hand that need over as a line in the receiving work's `messages.md`, never as a record written into the receiver's roadmap or triage, as Kris set under HANDOFF-AS-MESSAGE on 2026-10-20: "Handoffs are not roadmap items ... we push the need to roll things out into other projects triage folders, and that's not what this is for." The receiver captures a record only for work genuinely deferred that it owns, under the `ki-next` [capture rule](../../ki-next/references/standards-next-work.md#capture-substantive-prospective-work).

`blocked_by` states **build order**: this item cannot be executed because something it must build on does not exist yet. It is discharged when that thing exists, not when the record that produced it reaches a particular lifecycle state. An item is therefore not blocked merely because a related record is unreviewed, unaccepted, or unpruned; a blocker whose work has landed is cleared even while its own record is still open. Recording a lifecycle wait as `blocked_by` stalls executable work behind an approval queue and misreports the reason. Where the real constraint is sequencing preference rather than build order, say so in `## Dependencies / blocks` and leave the field empty.

`baseline_ref` is `null` until execution begins, then the immutable full lowercase commit ID.

`area` is the immutable issuing code included in an area-qualified identifier. It is not a mutable group.

`intake_disposition`, `intake_disposition_target`, and `waiting_on_trades` are retired. The [migration window](standards-repository-roadmaps.md#migration-tolerance) has closed, so the checker fails them. The former free-text `theme` grouping is retired with them; `theme` now names a territory theme under [Classification](#classification).

An optional non-empty `transferred_from` records a durable handoff origin.

### Priority and size

`horizon` says when the work is intended; `priority` says how important it is among records at the same horizon. `priority` is `high`, `medium`, or `low`:

- `high` - deferring it carries a material cost;
- `medium` - useful planned progress;
- `low` - a discretionary benefit.

It is written at capture, and an absent `priority` reads as `medium`, so its absence never fails.

`size` measures the relative end-to-end effort a record involves: implementation, verification, integration and owner review, but not time spent waiting on others. It is not a count of hours, and it guides splitting and capacity, never importance or dispatch. It is required on every open record from capture, whatever its horizon, in roadmap and Streams records alike. The delivery shapes below are worked examples, not definitions:

- `s` - one run, one repository, one commit;
- `m` - one run, several commits and a plan;
- `l` - several chained runs or repositories, with Delegation;
- `xl` - not one record: split it before it becomes Ready.

Reports and messages display a size as a T-shirt label, 👕 and the letter in capitals: `👕 S`, `👕 M`, `👕 L` or `👕 XL`. The field value stays the lower-case `s`, `m`, `l` or `xl`, and there is no XS. Kris asked for it on 24 October 2026, "I wonder if there's a way of showing T-shirt S, M, etc. next to it. And probably put it in a capital letter, almost like it's a label on a t-shirt", and adopted it under SIZE-LABEL on 25 October.

A size set at capture is provisional, set by judgement, and is revisited before the record becomes Ready; a record whose size is uncertain warrants investigation rather than an invented estimate. A `ready` record with `size: xl` fails. During the [migration window](standards-repository-roadmaps.md#migration-tolerance) the checker warns on an open record without `size`; once the window closes it fails. A closed record, done or cancelled, never needs a retrospective `size` or `kind`. A value outside either vocabulary fails at once.

Selection orders work in one sequence, which [`ki-next`](../../ki-next/references/standards-next-work.md#4-select-candidates) applies: adoption, holds and dependencies first, then horizon, then priority, then the nearer target date within that horizon and priority, then size, smallest first. An absent target has no date urgency. Priority never crosses horizons: a `high` record at a later horizon does not overtake a `medium` one at an earlier horizon, but prompts a proposal to move its horizon.

### Retired fields and values

These shapes are retired. A record still carrying one is tolerated with a warning during the [migration window](standards-repository-roadmaps.md#migration-tolerance) and fails once it closes; new records never use them:

- `initiative`, the thread-model name for `theme`: name the theme in `theme`, read meanwhile as the record's theme under the [Project registry tolerance window](../../ki-work/references/standards-project-registry.md#tolerance-window);
- `purpose: adoption`, which no record has used: use `capability` or `upkeep`.

The same review on 2026-10-19 kept three sparsely used shapes because other rules depend on them: `kind: decide`, which the [graduation test](standards-repository-roadmaps.md#ideas-and-graduation) names for decision records; `resolution_target`, which a duplicate, merged or superseded cancellation needs to name its replacement; and [`task_links`](#task-links), which the Paperclip coordination standard uses as the durable link from a record to its tasks. `task_links` is revisited when Paperclip returns at Wave F.

### Classification

Classification fields say what sort of work a record is and what it serves. Each has one owner tier that defines its allowed values.

| Field | Owner | Values | Presence |
| --- | --- | --- | --- |
| `kind` | this standard | `deliver`, `decide`, `investigate`, `audit` | once adopted |
| `purpose` | this standard | `capability`, `corrective`, `debt`, `governance`, `learning`, `upkeep` | optional |
| `project` | territory | a Project registry slug, optionally territory-qualified | optional |
| `theme` | territory | a theme registry slug, optionally territory-qualified | projectless records only |
| `component` | repository | a `components` entry in `.ki.toml` | optional |

`kind` classifies the controlling outcome, not every step. `deliver` produces a change; `decide` closes on an owned decision; `investigate` closes on a finding; `audit` checks an existing state, and is the default for recurring runs. Kind-specific plan and review sections are a later change; today every kind carries the sections below.

`purpose` says why the work exists. Use `upkeep` for work that keeps something accurate and never finishes.

`project` names the finite outcome the record serves; its theme is looked up in the [Project registry](../../ki-work/references/standards-project-registry.md). A record without a Project, such as upkeep, may name its `theme` directly instead. A record with a Project takes its theme from it and does not name `theme` beside it: naming both warns during the [migration window](standards-repository-roadmaps.md#migration-tolerance) and fails once it closes, and a contradiction with the registry fails at once. Under the [work model](https://github.com/knowledgeislands/ki-principal/blob/main/Admin/Governance/Decisions/GDR-KI-PRINCIPAL-009-the-work-model.md) a theme is a label only: it owns no work, and the work a record serves is the territory's regular work or a Project. A record still naming the [retired](#retired-fields-and-values) `initiative` reads it as its theme with a warning; naming both `theme` and `initiative` fails. Project and theme slugs are territory-scoped kebab-case. A bare slug names an entry in the repository's own Capital territory; a record serving another territory's Project or theme qualifies it as `<territory>/<slug>`, such as `ki-principal/agent-host`, under the [Project registry standard](../../ki-work/references/standards-project-registry.md#cross-territory-references). A record whose `project` does not resolve in an available registry fails the roadmap check. An unavailable registry remains an explicit warning, not a successful resolution; unknown theme slugs retain their existing warning. Tagging another repository's record with a Project is classification, not authority: the owning repository keeps its plan, priority, and acceptance.

`component` names the part of the repository the record touches, from the repository's declared vocabulary.

The resolved Project locates its package in the Capital; its `project` tag is the link, not a transfer of authority or records. Selection into `now` neither opens work nor grants execution. The assigned package steward adds the routed record to its next steps at its next wake. A record without `project` goes first to its existing regular or ad hoc owner and reaches State of play's routing queue only if ownership is unresolved. Reclassification first reconciles runs in flight and their reporting package.

### Target dates

An optional `target` mapping records the date the work aims towards:

```yaml
target:
  date: 2026-10-31
  kind: due
  what: Halloween activity planned
```

The mapping contains exactly `date`, a valid ISO calendar date (`YYYY-MM-DD`), `kind`, either `due` for a hard due date or `milestone` for an aim, and `what`, a non-empty single-line description of the outcome. Both kinds may be used at any lifecycle stage, and absence means no target. A target grants no authority and never moves work across horizons or priorities; within one horizon and priority the nearer date goes first, before size. Views flag approaching and past targets and show the date, kind and outcome rather than treating a date as permission to execute. `hold.review` remains the date to reconsider a hold and does not stand in for a target. No unattended-eligibility field is adopted while UNATTENDED-FIELD remains undecided.

### Hold

A record at `horizon: hold` carries a `hold` mapping; every other record omits it.

```yaml
horizon: hold
hold:
  reason: waiting-for
  condition: tools-ki releases the roadmap list grouping
  review: 2026-11-01
  trades: [TRD-1234abcd]
```

`reason` is `waiting-for` for an external condition or `parked` for an intentional pause. `condition` is the non-empty named release condition. `review` is an optional ISO date, required in substance where release cannot be observed. `trades` is an optional list of unique `TRD-<eight-hex>` identities whose observable progress forms the condition; it records cross-repository conditions rather than local dependencies, so never place trade identities in `blocks` or `blocked_by`. The body states the exact condition observed.

A held record keeps its status, `baseline_ref`, completed Steps, and review evidence. Release chooses a horizon afresh.

### Cancellation and resolution

`status: cancelled` is the second terminal ending. It requires `resolution`, one of:

- `obsolete` - the need has gone;
- `rejected` - the work was considered and declined;
- `duplicate` - another record already owns the same work;
- `merged` - the work was folded into another record;
- `superseded` - a later record replaces it.

`resolution_target` names the replacing record for `duplicate`, `merged`, and `superseded` when it lives in the same repository, and is forbidden otherwise. It is a canonical work-item identifier of this repository, different from the record, and should resolve in the roadmap; a target with another repository's code fails, because records are pruned and cross-repository identifiers and links break. Where the replacing work lives in another repository, the record keeps its resolution with no `resolution_target`, and `## Cancelled` names that repository and describes the work in plain words, with no identifier or link. Only the owning repository closes its own record: closing a duplicate here never closes or edits the target.

`resolution` and `resolution_target` are forbidden on every other status.

### Task links

An item MAY carry `task_links` in its own frontmatter. This is the only authoritative structured map from that item to tasks in other systems; do not create a shared writable lookup table or copy remote task status into the KI lifecycle. The field is absent when no link has been verified. When present, it is a non-empty map from provider names matching `^[a-z][a-z0-9-]*$` to non-empty lists of reference objects. Each reference has exactly six non-empty string fields: `authority`, `scope`, `id`, `key`, `url`, and `relation`. Do not infer a URL scheme or provider-specific ID grammar from the portable field. A Paperclip reference uses its admitted instance base URL as `authority`, stable company UUID as `scope`, stable task UUID as `id`, current readable issue key as `key`, and company-prefixed issue URL as `url`.

```yaml
task_links:
  paperclip:
    - authority: http://127.0.0.1:3100
      scope: 558dd49e-7615-409f-b7b2-7f19e22171d9
      id: b76a4ec9-be48-4a3c-8568-7885b5e6789b
      key: KIS-5
      url: http://127.0.0.1:3100/KIS/issues/KIS-5
      relation: implementation
```

`relation` is one of `evaluation`, `implementation`, `review`, `integration`, `coordination`, or `related`. It describes why the item cites the task, not whether the task is active, complete, or assigned. A single item may cite several tasks from one provider and several providers. The qualified identity is provider + authority + scope + id; `key` and `url` are readable locators that may change without changing identity. A duplicate identity with the same relation within one item is invalid. A task may be referenced as context from several items, but a delivery task has at most one governing KI work item, recorded in the task-side locator.

These links preserve historical evaluation, implementation and integration evidence after task completion. They are neither a current claim nor a release. Before assigning work, reconcile the item's local claim or hold note against current task and worktree evidence and record the decision on the item through its designated writing checkout. Missing links, stale locators, paused agents and finished historical tasks do not establish availability. Offline structural validation cannot certify live task ownership. Map writes preserve `created_at`, advance `updated_at`, and follow the [roadmap write locus](standards-repository-roadmaps.md#roadmap-write-locus).

## Timestamps

`created_at` and `updated_at` are mandatory for every local work item. Local work-item timestamps use canonical RFC 3339 UTC at second precision: `YYYY-MM-DDTHH:MM:SSZ`. A new record writes the same instant to both fields. `created_at` is immutable. A governed lifecycle or semantic body mutation preserves `created_at` and advances `updated_at` to the later of the current UTC second or one second after its previous value. Read-only inspection and formatting-only normalisation do not advance `updated_at`.

Before publishing a local mutation, the writer compares the record revision it observed with the revision it will replace and stops on drift. Validation requires pair presence, canonical shape, and `created_at <= updated_at`. It deliberately does not compare either value with the auditor's wall clock, so clock skew or a previously recorded future value cannot make an otherwise monotonic record invalid.

Remote adapters project their provider-native creation and update timestamps into the portable work-item view. They do not duplicate those values into provider bodies. Knowledge Base Streams owns validation and mutation of its local projection; the repository-roadmap adapter owns the equivalent contract under `docs/roadmap/`.

The timestamp pair supports age, inactivity, coverage, and stale-active reporting; it does not establish lifecycle event history, cycle time, throughput, or time-in-state evidence.

## Body

Every item begins with these sections in order and ends with `## Discussion`:

```markdown
## Goal

The plain-language user or system outcome this work should achieve.

## Context

Why the work exists now, including current evidence and technical background.

## Boundary

What this item deliberately does not include.

## Discussion

### Topic

Decision-useful reasoning, alternatives, or unresolved questions.
```

`Discussion` is topic-oriented rather than chronological.

`Goal` is mandatory and non-empty. State the outcome in one to three plain-language sentences that a reader can understand without implementation detail. It names the change in the world, not a file, command, or internal mechanism. `Context` supplies the supporting evidence and technical rationale; it does not substitute for the Goal.

Use descriptive `###` headings such as `### Authority model`, `### Source analysis`, `### Alternatives`, or `### Open questions`.

Do not turn it into a session log.

Material decisions that outlive the item still belong in a Decision Record.

An item may add concise structured sections between `## Boundary` and `## Discussion`.

A focused one-step item may remain brief.

When an item adopts a material handoff, process design, or architectural proposal, preserve the decision-useful detail rather than reducing it to a prompt: its operating model, sources, meaningful alternatives, authority and safety boundaries, unresolved questions, and intended first deliverable.

Use structured sections where the material has a stable shape and retain exploratory reasoning under topic headings in `Discussion`.

The roadmap item is the durable handoff record until its work is planned; external links alone are insufficient.

When delivery uses a pull request, record its link in the work-item body, under Context or the relevant Review evidence. Identify the repository and pull-request number unambiguously, for example `[owner/repository#123](https://github.com/owner/repository/pull/123)`. This is a body reference, not a new required frontmatter field or a substitute for the work record's lifecycle: a pull request opening, merging, or closing does not itself change the item's status. Keep local roadmap reading and listing available offline; refresh live pull-request state during an authorised connected review rather than requiring network access for every listing.

## Detail by stage

### Triage, or Future / draft

`Goal`, `Context`, `Boundary`, and final `Discussion` are sufficient.

They preserve the intended outcome, why the item exists, its deliberate exclusion, and the reasoning needed to shape it later without pretending that it is planned. `status: triage` means the item is captured but not adopted; Future means it has been adopted as long-term work.

### Cancelled

A human-approved cancellation may close any open record, including triage, without adopting or implementing the work. Insert terminal `## Cancelled` immediately before the final `Discussion`. It records who approved the cancellation and when, why, and any outstanding changes the cancellation leaves; for a target in another repository it also names that repository and the target's path, so the evidence survives pruning. A record cancelled before it started keeps `baseline_ref: null` and gains no execution sections or Review packet merely to close.

### Soon / draft

Add `## Shaping` between `Boundary` and `Discussion`.

It states the intended approach, known dependencies, decisions still needed, and the conditions for promotion.

### Next or Now / draft to ready

Once selected for immediate work, retain the earlier sections and add these sections before `Discussion`, in order:

```markdown
## Current state

The honest baseline, including gaps.

## Steps

- [ ] Concrete, inspectable action.

## Files touched

The minimal expected scope.

## Verify

A pass/fail command or assertion.

## Dependencies / blocks

Narrative dependency context.

## Documentation impact

### Decision Records

State the impact, or why no decision record is needed.

### Specifications

State the impact, or why no behaviour-level contract changes.

### Guides

State the impact, or why no human guidance changes.

### Roadmap

State the impact on follow-on work, or why no roadmap change is needed.
```

Immediate `Now` and `Next` records MUST retain this exact `Documentation impact` shape. Each concern records its intended change or a concise, justified non-applicability. The parser checks the shape and non-empty statements; review judges whether the claimed impact is truthful. This records documentation consequences without making documentation a fifth work-item category.

When delegated work is planned, add `## Delegation` after `## Dependencies / blocks`.

It names bounded worker deliverables and file boundaries, the gate between rounds, and the orchestrator’s final review and verification responsibility.

An immediate item may remain `status: draft` while `ki-plan` shapes these sections.

It becomes `status: ready` only after the sections are concrete, dependencies are satisfied, verification is checkable, and the user approves the plan.

Every Step is a Markdown task-list item. New and Ready plans use `- [ ]`; implementation marks completed work as `- [x]`. In-progress items may contain both states, while Acceptance and Done items require every Step to be `- [x]`.

### In progress

The implementation process records the immutable full `HEAD` commit in `baseline_ref`, sets `status: in-progress`, and marks completed Steps `- [x]` without deleting them.

Record material departures, decisions, and newly discovered constraints under the relevant topic in the final `Discussion`; do not record routine activity.

### Awaiting review

Before setting `status: awaiting-review`, insert `## Review` immediately before `Discussion` with `### Delivered`, `### Change Summary`, `### Verification`, `### Outstanding concerns`, `### Post-change review`, and `### Mini recap` in that exact order. The roadmap checker enforces this review-packet shape.

- **Delivered** states the approved boundary and exclusions, plus immutable baseline and resulting evidence.
- **Change Summary** names concrete changed files, material decisions, and approved deviations.
- **Verification** records exact gates and their outcomes.
- **Outstanding concerns** records unresolved, unchecked, or failing issues, or explicitly says none. A concern that names work somebody should still do needs its own identifier before acceptance, and this section cites it. This section is evidence for one acceptance decision, not a backlog: it is deleted with the record at the prune, and anything held only here is held nowhere.
- **Post-change review** freshly assesses goal, scope, regression risk, and acceptance readiness.
- **Mini recap** restates item-scoped delivery, verification, and concerns, then proposes learning routes without promoting them.

Later process skills reuse these producer/consumer semantics; they do not reinterpret heading names or insert parallel review sections.

This is the required evidence and review packet for an explicit acceptance decision. `ki-accept` records the interactive review outcome here before closure.

### Done

After explicit acceptance, insert terminal `## Done` immediately before `Discussion` and set `status: done`. Keep the reviewed record until an explicitly selected prune path or glob removes it.

`## Done` is required, not optional decoration: the checker rejects a `done` record without it, so a record cannot reach the terminal state by changing `status` alone. It records who accepted the work and when, against the review packet above — `Accepted <date> by <name> on the review packet above.` — and nothing else. Evidence belongs in `## Review`, and anything learned during acceptance belongs in `Discussion`.

Retain the accepted or cancelled record until an explicitly selected prune path or glob.

Pruning destroys the record's contents along with the record. Before selecting an item, confirm that every concern its `### Outstanding concerns` still leaves open is carried by a live identifier elsewhere; a deferral that exists only inside the record being removed ceases to exist, and nothing reports that it did.

At every stage, `Discussion` remains the final top-level section.

Completed Steps remain `- [x]` rather than being removed.
