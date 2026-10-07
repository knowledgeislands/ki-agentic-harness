# Project registry standard

## Scope

This standard defines the portable shape of a territory's Project and Initiative registry. A territory's Capital owns the registry instance; this harness owns only its schema. Discovering which checkout holds the registry is a runtime concern of the `ki` registry and the checker, not part of a work record.

"Project" here names a registry entry. The repository shape declared by `repo_type = "project"` is a "project repository"; the two never share a namespace.

## Location

The registry lives in the territory Capital's Knowledge Base at `Streams/Projects/`:

```text
Streams/Projects/
  Projects.md          # index note for the folder
  Initiatives.md       # Initiatives index
  <slug>.md            # one Project note per Project
```

A work record's `project` value is a Project slug, so it resolves to `Streams/Projects/<slug>.md`. Slugs are lowercase kebab-case and scoped to the territory: each territory keeps its own registry and its own slugs.

## Project note

A Project is a finite outcome with a lead, a target, health, and a lifecycle. Its note carries this frontmatter:

```yaml
---
note_type: streams/project
slug: baseline-rollout
title: Baseline rollout
outcome: One sentence stating the finite outcome and its test.
initiative: platform-foundations
lifecycle: active
lead: Kris Brown
target: 2026-12-31
---
```

- `slug` matches the filename and never changes.
- `outcome` is one sentence naming the finite outcome.
- `initiative` is the slug of the Initiative the Project serves.
- `lifecycle` is `planned`, `active`, `paused`, `completed`, or `cancelled`. Completing or cancelling a Project is an accountable human decision; it is never inferred from its records' status.
- `lead` names the accountable person.
- `target` is an ISO date, or `null` when none is set.

The body carries an `## Outcome` section, an `## Update` section, and an `## Ideas` section. The Update takes over the former theme checkpoint: a dated health judgement, the one current decision and its test, the facts it needs, and one next step. Health is a stated judgement, never a count. Ideas holds untracked ideas under the [graduation test](../../ki-work-roadmap/references/standards-repository-roadmaps.md#ideas-and-graduation). A Project note may link its open records for orientation, but status lives only in each record.

## Initiatives index

An Initiative is a long-lived direction that never finishes. Initiatives have no notes of their own: `Initiatives.md` holds one `##` section per Initiative that states its slug as `` Slug `<slug>`. ``, describes its direction, names the Projects that serve it, and describes its projectless upkeep.

Upkeep and other work that never finishes has no Project. Its records name `initiative` directly, usually with `purpose: upkeep`, and recurring runs inherit the Initiative from their template or Activity.

## Membership and authority

Membership is classification, not authority. A Project may count records from any repository in the territory, and tagging another repository's record with a Project never transfers its plan, priority, or acceptance; the owning repository decides whether its record joins.

## Validation

The roadmap checker resolves `project` and `initiative` slugs against the registry when it can find one. An unknown slug, or an unavailable registry, is a warning and never a failure or a silent ungrouping. A record naming both a `project` and an `initiative` fails only when the registry assigns that Project to a different Initiative. A Project whose open records are all terminal is reported for a human lifecycle decision.

Views group by Project and Initiative without copying record lists into a second status source. A territory's periodic review of its Initiatives replaces per-theme checkpoints; `ki-checkpoint` remains only for ephemeral thread reconstruction.
