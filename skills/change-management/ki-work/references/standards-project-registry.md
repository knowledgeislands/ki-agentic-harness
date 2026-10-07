# Project registry standard

## Contents

- [Scope](#scope)
- [Location](#location)
- [Project note](#project-note)
- [Initiative note](#initiative-note)
- [Cross-territory references](#cross-territory-references)
- [Membership and authority](#membership-and-authority)
- [Validation](#validation)

## Scope

This standard defines the portable shape of a territory's Project and Initiative registry. A territory's Capital owns the registry instance; this harness owns only its schema. Discovering which checkout holds the registry is a runtime concern of the `ki` registry and the checker, not part of a work record.

"Project" here names a registry entry. The repository shape declared by `repo_type = "project"` is a "project repository"; the two never share a namespace.

## Location

The registry lives in the territory Capital's Knowledge Base in two sibling folders:

```text
Streams/Projects/
  Projects.md          # index note for the folder
  <slug>.md            # one Project note per Project
Streams/Initiatives/
  Initiatives.md       # index note for the folder
  <slug>.md            # one Initiative note per Initiative
```

A work record's `project` value is a Project slug, so it resolves to `Streams/Projects/<slug>.md`; an `initiative` value resolves to `Streams/Initiatives/<slug>.md`. Slugs are lowercase kebab-case and scoped to the territory: each territory keeps its own registry and its own slugs. A record in another territory names an entry with a [cross-territory reference](#cross-territory-references).

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

## Initiative note

An Initiative is a long-lived direction that never finishes. Each Initiative has its own note, with frontmatter the checker reads:

```yaml
---
note_type: streams/initiative
slug: platform-foundations
title: Platform foundations
direction: One sentence stating the long-lived direction.
lifecycle: active
lead: Kris Brown
---
```

- `slug` matches the filename and never changes.
- `direction` is one sentence naming the direction the Initiative keeps.
- `lifecycle` is `active`, `paused`, or `retired`. An Initiative never completes; retiring it is an accountable human decision.
- `lead` names the accountable person.

The body carries these sections in order:

- `## Direction` expands the direction and its boundary with neighbouring Initiatives.
- `## Projects` links each Project note whose `initiative` names this Initiative. The Project note's frontmatter is the membership; this section is orientation.
- `## Upkeep` describes the projectless work the Initiative carries: the components and `purpose: upkeep` records that name it directly.
- `## Activities` links the recurring Activities and housekeeping templates whose `initiative` names it.
- `## Review` holds the territory's periodic review of the Initiative: a dated judgement of its direction and Projects, the decisions it needs, and one next step. It never copies record lists or status.

`Initiatives.md` is the folder's index note. It lists the Initiative notes and owns no slugs of its own.

Upkeep and other work that never finishes has no Project. Its records name `initiative` directly, usually with `purpose: upkeep`, and recurring runs inherit the Initiative from their template or Activity.

A Project or Initiative shaped through [`ki-design-loop`](../../ki-design-loop/SKILL.md) links its design's Decision Record from the Project's `## Update` or the Initiative's `## Review`, and from the note's sources. The note links the design; it never copies the brief, reviews, report or decisions.

## Cross-territory references

A record may serve a Project or Initiative owned by another territory. It then qualifies the value as `<territory>/<slug>`:

```yaml
project: ki-arcadia-principal/agent-host
initiative: ki-arcadia-principal/rig
```

- `<territory>` is the key under which the local `ki` registry, `~/.local/state/ki/registry.toml`, registers the territory's Capital checkout. A territory has no other machine-readable name, and a repository owner can hold several Capitals, so the Capital's registry key is the only unambiguous handle.
- The named checkout must declare itself a Capital: its `ki-repo` `repository` equals its `capital`.
- An unqualified slug always means the repository's own Capital territory, so existing values keep their meaning.
- A qualified value resolves against the named territory's `Streams/Projects/` or `Streams/Initiatives/`; a Project's registered Initiative belongs to the Project's territory.

A territory missing from the local registry, a checkout that is not a Capital, or an unknown slug is a warning, never a failure. Resolution is local and read-only. A qualified reference is classification only: the referenced territory gains no plan, priority, or acceptance authority over the record.

## Membership and authority

Membership is classification, not authority. A Project may count records from any repository in the territory, and tagging another repository's record with a Project never transfers its plan, priority, or acceptance; the owning repository decides whether its record joins.

## Validation

The roadmap checker resolves `project` slugs against `Streams/Projects/` and `initiative` slugs against `Streams/Initiatives/` of the referenced territory when it can find the registry. An unknown slug, or an unavailable registry, is a warning and never a failure or a silent ungrouping. A record naming both a `project` and an `initiative` fails only when the registry assigns that Project to a different Initiative, including the same slug in a different territory. A Project whose open records are all terminal is reported for a human lifecycle decision. A legacy `Streams/Projects/Initiatives.md` index stays readable with a warning during the [migration tolerance window](../../ki-work-roadmap/references/standards-repository-roadmaps.md#migration-tolerance).

Views group by Project and Initiative without copying record lists into a second status source. Each Initiative note's Review replaces the per-theme checkpoints and the territory's state-of-play review; `ki-checkpoint` remains only for ephemeral thread reconstruction.
