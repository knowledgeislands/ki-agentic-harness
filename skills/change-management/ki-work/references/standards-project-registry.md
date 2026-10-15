# Project registry standard

## Contents

- [Scope](#scope)
- [Location](#location)
- [Project note](#project-note)
- [Idea-stage Project](#idea-stage-project)
- [Paused Project](#paused-project)
- [Close-out assessment](#close-out-assessment)
- [Initiative note](#initiative-note)
- [Attributes by level](#attributes-by-level)
- [Rooting](#rooting)
- [Links point upwards](#links-point-upwards)
- [Index notes](#index-notes)
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
  <slug>/              # or, while a design is in progress, a folder
    <slug>.md          #   whose folder note is the Project note
    design/            #   the ki-pmo-design artefacts, with design.md
Streams/Initiatives/
  Initiatives.md       # index note for the folder
  <slug>.md            # one Initiative note per Initiative
```

A work record's `project` value is a Project slug, so it resolves to `Streams/Projects/<slug>.md`; an `initiative` value resolves to `Streams/Initiatives/<slug>.md`. A registry note that holds a [`ki-pmo-design`](../../ki-pmo-design/SKILL.md) design folder is instead the folder note `Streams/Projects/<slug>/<slug>.md` or `Streams/Initiatives/<slug>/<slug>.md`, with the same slug, frontmatter and body; the folder holds only that note and its `design/` folder. Either form resolves the slug. Slugs are lowercase kebab-case and scoped to the territory: each territory keeps its own registry and its own slugs. A record in another territory names an entry with a [cross-territory reference](#cross-territory-references).

## Project note

A Project is a finite outcome with a lead, a target, and a lifecycle. Its note carries this frontmatter:

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
- `lifecycle` is `planned`, `active`, `paused`, `completed`, or `cancelled`. A `planned` Project whose `outcome` is a decision is an [idea-stage Project](#idea-stage-project); a `paused` one states its [release condition](#paused-project). Completing or cancelling a Project is an accountable human decision taken after its [close-out assessment](#close-out-assessment); it is never inferred from its records' status.
- `lead` names the accountable person.
- `target` is an ISO date, or `null` when none is set.

The body carries only two sections, in order:

- `## Outcome` expands the finite outcome and its test.
- `## Notes` holds ideas and context: untracked ideas under the [graduation test](../../ki-work-roadmap/references/standards-repository-roadmaps.md#ideas-and-graduation), boundaries, and links to the Project's Decision Records or other durable knowledge.

The note tracks state with `lifecycle` alone. It carries no dated `## Update`, health or status section and lists no work records; status lives only in each record.

## Idea-stage Project

An idea-stage Project holds ideas, philosophies and approaches that are worth keeping before anyone is ready to commit to delivering them. It is an ordinary Project at its earliest stage, not a separate kind, so it takes no type field: Kris set on 2026-10-14, "No new kind of Project: inception is the idea-stage pattern". Kris set its shape on 2026-10-15: "Adopt it: an evaluation area is a planned Project whose Outcome is a decision, ideas in Notes, no records or thread, at most one per Initiative and three across the territory; Ways of working holds the rule." The same day Kris confirmed that this answer settles the stage and its cap: "an idea-stage Project is a planned Project whose Outcome is a decision, ideas in Notes, no records and no thread, at most one per Initiative and three across the territory."

- `lifecycle` is `planned`.
- `outcome` is a decision its lead takes. It opens with the lead's name, or their first name, followed by "decides", as in "Kris decides whether Delta earns a bounded trial ...", and its test is that the decision is taken and routed to its durable owner. This form is what marks the stage: a `planned` Project with a delivery outcome is delivery not yet started.
- `## Notes` holds the ideas. A [`ki-pmo-design`](../../ki-pmo-design/SKILL.md) `design/` folder may hold its shaping, and captures that name the Project fold back into its Notes.
- No work record names it, and no coordinating thread runs for it.
- A territory holds at most one idea-stage Project per Initiative and three in all. Kris set on 2026-10-15: "At most one idea-stage Project per Initiative and three across the territory, reviewed at each state-of-play mark." A further one waits until another graduates or folds, or its lead lifts the cap.

It leaves the stage in one of two ways. It **graduates** when its lead takes the decision and delivery follows: `lifecycle` becomes `active`, `outcome` is rewritten as a finite delivery outcome, and records may then name it. It **folds** when no delivery follows: it gets its [close-out assessment](#close-out-assessment), saying where the decision and any surviving ideas now live, and its lead cancels or completes it. A settled slice may leave before the whole does, by the [quotation rule](../../ki-work-roadmap/references/standards-repository-roadmaps.md#ideas-and-graduation).

## Paused Project

A `paused` Project says why it waits and until when. Its `## Notes` opens with one line giving its release condition and a review date; the territory's state-of-play thread under [`ki-pmo`](../../ki-pmo/SKILL.md) reviews it at its first mark after that date. The line is prose, and the note gains no frontmatter. Kris set on 2026-10-15: "A paused Project's ## Notes opens with one line giving its release condition and review date, reviewed by state-of-play after that date; no new front matter".

## Close-out assessment

A Project outlives its records. When its records have all finished it does not close: its lead, or an agent for the lead, writes a close-out assessment under a `### Close-out assessment` heading in `## Notes`. The assessment states, in a few plain sentences, what was delivered against the Outcome, what was not, and whether follow-up or remedial work is needed. Any such work is captured as `triage` records in the owning repositories. A captured record that still serves the Outcome names the Project, which then stays open until that work finishes; other work names the Project or Initiative it serves. Only then does the lead decide to complete or cancel the Project.

The assessment names no work-record identifiers, because links point upwards. It states the current position, so a later assessment replaces an earlier one. A Project cancelled before delivery begins gets the same assessment, saying what is left undone and where any surviving need now lives.

Recurring work never closes and never waits for an assessment: its home is an Initiative, which never completes, and each Activity or housekeeping definition names it.

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

The body carries only two sections, in order:

- `## Direction` expands the direction and its boundary with neighbouring Initiatives.
- `## Notes` holds ideas and context, including a plain description of the projectless upkeep the Initiative carries.

An Initiative note lists neither its Projects nor its records, Activities or housekeeping templates, and carries no dated review or status section.

Upkeep and other work that never finishes has no Project. Its records name `initiative` directly, usually with `purpose: upkeep`, and recurring runs inherit the Initiative from their template or Activity.

A Project or Initiative shaped through [`ki-pmo-design`](../../ki-pmo-design/SKILL.md) mentions its design folder in `## Notes` while the folder exists, and links any resulting Decision Record once the design is consolidated and the folder deleted. The note never copies the brief, reviews, report or decisions.

## Attributes by level

Each level of the hierarchy carries the attributes it needs and no more. The comparable attribute at each level is:

| | Initiative | Project | Work record | Activity |
| --- | --- | --- | --- | --- |
| What it is | A long-lived direction | A finite outcome | One unit of accepted work in one repository | A recurring obligation |
| Lifecycle | `lifecycle`: `active`, `paused`, `retired` | `lifecycle`: `planned`, `active`, `paused`, `completed`, `cancelled` | `status`: `triage` to `done` or `cancelled` | `status`: `active`, `paused`, `retired` |
| Type | None | None | `kind` and optional `purpose` | `realization`, how it runs |
| Idea stage | Ideas in its `## Notes` when no Project fits | An [idea-stage Project](#idea-stage-project) | None: an idea becomes a record only through the [graduation test](../../ki-work-roadmap/references/standards-repository-roadmaps.md#ideas-and-graduation) | None |
| Priority signal | None | None | `horizon` only | None |
| Owner and parent | `lead`; top level | `lead`; one `initiative` | Its owning repository; one `project` or `initiative` | Its owning base; one Initiative |

Projects and Initiatives take no type field, and `kind` and `purpose` are record classification only. `horizon` is the only priority signal: no level carries a `priority` field, and the order of Projects is a judgement the territory's state-of-play thread makes, never a stored value. Kris set on 2026-10-15 that "horizon stays the only priority signal". The [work-item format](../../ki-work-roadmap/references/standards-work-item-format.md) owns the record fields and the [`ki-repo-kb-activities`](../../../repo-structure/ki-repo-kb-activities/SKILL.md) standard the Activity fields.

## Rooting

Rooting decides where a new idea, philosophy or piece of work lives: first its territory, then its Initiative and Project, then whether it is a concept or work. Kris asked on 2026-10-14 "how these things get rooted ... down into the territories and then from the territories down into the initiatives, the projects, and the roadmaps, but also where do we put things which are kind of like ideas, philosophies, things that we're discussing, our approaches before we've really got to the point that we need to fully commit to them".

- **The rooting step.** At a thread's mark, the owner confirms the owning territory, the nearest Initiative and Project, and the split between concept and work, on the proposal of the thread where the idea arose.
- **The owning territory** is the one whose Capital must accept it. Kris adopted the rule on 2026-10-15: "I confirm the owning territory at the mark, on the proposal of the thread where the idea arose, using "whose Capital must accept it". The model and method root in Knowledge Islands, and my own life and machine bindings root in Personal. Another territory gets one handoff when it must act and otherwise only a one-line link."
- **Concepts and work are held apart.** A concept, a philosophy or approach not yet committed to, is held as an Emerging Concepts note in the owning Capital's knowledge base, which [`ki-repo-kb`](../../../repo-structure/ki-repo-kb/SKILL.md) places. Work is held as an `Idea:` bullet in the `## Notes` of the nearest Project or Initiative, or in an [idea-stage Project](#idea-stage-project) when a decision must come first.
- **One home, never a mirror.** Another territory that must act gets one handoff through [`ki-trades`](../../../governance/ki-trades/SKILL.md); otherwise it gets at most a one-line link to the owning home.
- **Graduation is slice by slice.** What settles leaves its idea home by the [quotation rule](../../ki-work-roadmap/references/standards-repository-roadmaps.md#ideas-and-graduation), so the ideation behind it can carry on.

## Links point upwards

A work record names its Project or Initiative, and a Project names its Initiative. No link points down: a Project note names no work record, and an Initiative note names no Project or record. `ki` views derive the downward lists from the upward links, so the registry never holds a second copy of membership or status. The Streams checker fails a registry note that names a work-record identifier or carries an `## Update` section; Decision Record identifiers are not work records.

## Index notes

`Projects.md` and `Initiatives.md` are the folders' index notes and own no slugs of their own. Under the knowledge-base index-note rule each describes every child note in a line, by what the Project or Initiative is for; neither lists records nor restates status.

## Cross-territory references

A record may serve a Project or Initiative owned by another territory. It then qualifies the value as `<territory>/<slug>`:

```yaml
project: ki/agent-host
initiative: ki/rig
```

- `<territory>` is the handle defined by `ki-repo`: the Capital's explicit `territory_prefix`, or its local registry key when the prefix is absent. This is the same handle used by `-t, --territory`; registered Capital keys retain their separate role as local identity metadata. Resolve exactly one registered Capital and reject duplicate handles or prefix/fallback collisions rather than guessing.
- The named checkout must declare itself a Capital: its `ki-repo` `repository` equals its `capital`.
- An unqualified slug always means the repository's own Capital territory, so existing values keep their meaning.
- A qualified value resolves against the named territory's `Streams/Projects/` or `Streams/Initiatives/`; a Project's registered Initiative belongs to the Project's territory.

A territory missing from the local registry, a checkout that is not a Capital, or an unknown slug is a warning, never a failure. Resolution is local and read-only. A qualified reference is classification only: the referenced territory gains no plan, priority, or acceptance authority over the record.

## Membership and authority

Membership is classification, not authority. A Project may count records from any repository in the territory, and tagging another repository's record with a Project never transfers its plan, priority, or acceptance; the owning repository decides whether its record joins.

## Validation

The roadmap checker resolves `project` slugs against `Streams/Projects/` and `initiative` slugs against `Streams/Initiatives/` of the referenced territory when it can find the registry. An unknown slug, or an unavailable registry, is a warning and never a failure or a silent ungrouping. A record naming both a `project` and an `initiative` fails only when the registry assigns that Project to a different Initiative, including the same slug in a different territory. The Streams checker on the Capital reports a Project with no open record as due for its close-out assessment, and an assessed one as awaiting its lead's close decision. It recognises an idea-stage Project by its `planned` lifecycle and decision outcome, and warns when an open record names one or a cap is exceeded. A legacy `Streams/Projects/Initiatives.md` index stays readable with a warning during the [migration tolerance window](../../ki-work-roadmap/references/standards-repository-roadmaps.md#migration-tolerance).

Views group by Project and Initiative without copying record lists into a second status source. Status lives in the records and each note's `lifecycle`; `ki-checkpoint` remains only for ephemeral thread reconstruction.
