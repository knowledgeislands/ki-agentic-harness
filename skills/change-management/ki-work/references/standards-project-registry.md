# Project registry standard

## Contents

- [Scope](#scope)
- [Location](#location)
- [Project note](#project-note)
- [Idea-stage Project](#idea-stage-project)
- [Paused Project](#paused-project)
- [Close-out assessment](#close-out-assessment)
- [Theme page](#theme-page)
- [Attributes by level](#attributes-by-level)
- [Rooting](#rooting)
- [Links point upwards](#links-point-upwards)
- [Index notes](#index-notes)
- [Cross-territory references](#cross-territory-references)
- [Membership and authority](#membership-and-authority)
- [Tolerance window](#tolerance-window)
- [Validation](#validation)

## Scope

This standard defines the portable shape of a territory's Project and theme registry, under the work model that [GDR-KI-PRINCIPAL-009](https://github.com/knowledgeislands/ki-principal/blob/main/Admin/Governance/Decisions/GDR-KI-PRINCIPAL-009-the-work-model.md) decides and the [Work Process](https://github.com/knowledgeislands/ki-principal/blob/main/Pillars/Philosophy/Model/Processes/Work%20Process/Work%20Process.md) note describes. A territory's Capital owns the registry instance; this harness owns only its schema. Discovering which checkout holds the registry is a runtime concern of the `ki` registry and the checker, not part of a work record.

"Project" here names a registry entry. The repository shape declared by `repo_type = "project"` is a "project repository"; the two never share a namespace.

## Location

The registry lives in the territory Capital's Knowledge Base in two sibling folders:

```text
Streams/Projects/
  Projects.md          # index note for the folder
  <slug>.md            # one flat Project note per Project
Streams/Themes/
  Themes.md            # index note for the folder
  <slug>.md            # one theme page per theme
```

A work record's `project` value is a Project slug, so it resolves to `Streams/Projects/<slug>.md`; a `theme` value resolves to `Streams/Themes/<slug>.md`. Every registry note is flat: no folder note, and no `design/` folder anywhere under `Streams/`. A [`ki-work-design`](../../ki-work-design/SKILL.md) design lives in its work folder, `+/_WORK/<id>/design/`, with the work's other churning papers. Slugs are lowercase kebab-case and scoped to the territory: each territory keeps its own registry and its own slugs. A record in another territory names an entry with a [cross-territory reference](#cross-territory-references).

## Project note

A Project is a finite outcome with a lead, a target, and a lifecycle. Its note carries this frontmatter:

```yaml
---
note_type: streams/project
slug: baseline-rollout
title: Baseline rollout
outcome: One sentence stating the finite outcome and its test.
theme: platform-foundations
lifecycle: active
lead: Kris Brown
target: 2026-12-31
---
```

- `slug` matches the filename and never changes.
- `outcome` is one sentence naming the finite outcome.
- `theme`, when present, is the slug of the theme the Project carries. A theme is a label: a Project may carry none, and relabelling it renames nothing, because no identifier carries a theme.
- `lifecycle` is `planned`, `active`, `paused`, `completed`, or `cancelled`. A `planned` Project whose `outcome` is a decision is an [idea-stage Project](#idea-stage-project); a `paused` one states its [release condition](#paused-project). Completing or cancelling a Project is an accountable human decision taken after its [close-out assessment](#close-out-assessment); it is never inferred from its records' status.
- `lead` names the accountable person.
- `target` is an ISO date, or `null` when none is set.

The body carries only two sections, in order:

- `## Outcome` expands the finite outcome and its test.
- `## Notes` holds ideas and context: untracked ideas under the [graduation test](../../ki-work-roadmap/references/standards-repository-roadmaps.md#ideas-and-graduation), boundaries, and links to the Project's Decision Records or other durable knowledge.

The note tracks state with `lifecycle` alone. It carries no dated `## Update`, health or status section and lists no work records; status lives only in each record, and the state of the Project work lives in its work file under [`ki-work-folder`](../../../governance/ki-work-folder/SKILL.md).

## Idea-stage Project

An idea-stage Project holds ideas, philosophies and approaches that are worth keeping before anyone is ready to commit to delivering them. It is an ordinary Project at its earliest stage, not a separate kind, so it takes no type field: Kris set on 2026-10-14, "No new kind of Project: inception is the idea-stage pattern". Kris set its shape on 2026-10-15: "Adopt it: an evaluation area is a planned Project whose Outcome is a decision, ideas in Notes, no records or thread, at most one per Initiative and three across the territory; Ways of working holds the rule." The same day Kris confirmed that this answer settles the stage and its cap: "an idea-stage Project is a planned Project whose Outcome is a decision, ideas in Notes, no records and no thread, at most one per Initiative and three across the territory." Under the work model the Initiative is a theme and the thread is Project work.

- `lifecycle` is `planned`.
- `outcome` is a decision its lead takes. It opens with the lead's name, or their first name, followed by "decides", as in "Kris decides whether Delta earns a bounded trial ...", and its test is that the decision is taken and routed to its durable owner. This form is what marks the stage: a `planned` Project with a delivery outcome is delivery not yet started.
- `## Notes` holds the ideas. Captures that name the Project fold back into its Notes.
- No work record names it, and no Project work runs for it.
- A territory holds at most one idea-stage Project per theme and three in all. Kris set on 2026-10-15: "At most one idea-stage Project per Initiative and three across the territory, reviewed at each state-of-play mark." A further one waits until another graduates or folds, or its lead lifts the cap.

It leaves the stage in one of two ways. It **graduates** when its lead takes the decision and delivery follows: `lifecycle` becomes `active`, `outcome` is rewritten as a finite delivery outcome, and records may then name it. It **folds** when no delivery follows: it gets its [close-out assessment](#close-out-assessment), saying where the decision and any surviving ideas now live, and its lead cancels or completes it. A settled slice may leave before the whole does, by the [quotation rule](../../ki-work-roadmap/references/standards-repository-roadmaps.md#ideas-and-graduation).

## Paused Project

A `paused` Project says why it waits and until when. Its `## Notes` opens with one line giving its release condition and a review date; the territory work under [`ki-coordination`](../../ki-coordination/SKILL.md) reviews it at its first mark after that date. The line is prose, and the note gains no frontmatter. Kris set on 2026-10-15: "A paused Project's ## Notes opens with one line giving its release condition and review date, reviewed by state-of-play after that date; no new front matter".

## Close-out assessment

A Project outlives its records. When its records have all finished it does not close: its lead, or an agent for the lead, writes a close-out assessment under a `### Close-out assessment` heading in `## Notes`. The assessment states, in a few plain sentences, what was delivered against the Outcome, what was not, and whether follow-up or remedial work is needed. Any such work is captured as `triage` records in the owning repositories. A captured record that still serves the Outcome names the Project, which then stays open until that work finishes; other work names the Project or theme it serves. Only then does the lead decide to complete or cancel the Project.

The assessment names no work-record identifiers, because links point upwards. It states the current position, so a later assessment replaces an earlier one. A Project cancelled before delivery begins gets the same assessment, saying what is left undone and where any surviving need now lives.

Recurring work never closes and never waits for an assessment: its home is the territory's regular work, which never finishes, or the Project whose own checks it is.

## Theme page

A theme is a label, not a level: regular work, Project work or an ad hoc piece of work may carry one, and it holds no work, has no holder and no session. Each theme has its own page, with frontmatter the checker reads:

```yaml
---
note_type: streams/theme
slug: platform-foundations
title: Platform foundations
direction: One sentence stating the theme's general direction.
---
```

- `slug` matches the filename and never changes.
- `direction` is one sentence naming the theme's general direction.

The body carries only two sections, in order:

- `## Direction` says why it is a theme, what matters about it, its general direction and the guidance common to the work under it.
- `## Notes` holds ideas and context.

A theme page lists neither its Projects nor its records, Activities or housekeeping templates, and carries no lifecycle, lead, dated review or status section.

Upkeep and other work that never finishes has no Project. Its records may name a `theme` directly, usually with `purpose: upkeep`, and recurring runs inherit any theme from their template or Activity.

A Project or theme shaped through [`ki-work-design`](../../ki-work-design/SKILL.md) links any resulting Decision Record once the design is consolidated. The note never copies the brief, reviews, report or decisions, and never points into a work folder.

## Attributes by level

Each level carries the attributes it needs and no more. The comparable attribute at each level is:

| | Theme | Project | Work record | Activity |
| --- | --- | --- | --- | --- |
| What it is | A label with its own page | A finite outcome | One unit of accepted work in one repository | A recurring obligation |
| Lifecycle | None | `lifecycle`: `planned`, `active`, `paused`, `completed`, `cancelled` | `status`: `triage` to `done` or `cancelled` | `status`: `active`, `paused`, `retired` |
| Type | None | None | `kind` and optional `purpose` | `realization`, how it runs |
| Idea stage | Ideas in its `## Notes` when no Project fits | An [idea-stage Project](#idea-stage-project) | None: an idea becomes a record only through the [graduation test](../../ki-work-roadmap/references/standards-repository-roadmaps.md#ideas-and-graduation) | None |
| Priority signal | None | None | `horizon` only | None |
| Owner and parent | No holder; a label | `lead`; an optional `theme` | Its owning repository; one `project` or an optional `theme` | Its owning base; regular work or a Project, with an optional `theme` |

Projects and themes take no type field, and `kind` and `purpose` are record classification only. `horizon` is the only priority signal: no level carries a `priority` field, and the order of Projects is a judgement the territory work makes, never a stored value. Kris set on 2026-10-15 that "horizon stays the only priority signal". The [work-item format](../../ki-work-roadmap/references/standards-work-item-format.md) owns the record fields and the [`ki-repo-kb-activities`](../../../repo-structure/ki-repo-kb-activities/SKILL.md) standard the Activity fields.

## Rooting

Rooting decides where a new idea, philosophy or piece of work lives: first its territory, then its Project or theme, then whether it is a concept or work. Kris asked on 2026-10-14 "how these things get rooted ... down into the territories and then from the territories down into the initiatives, the projects, and the roadmaps, but also where do we put things which are kind of like ideas, philosophies, things that we're discussing, our approaches before we've really got to the point that we need to fully commit to them".

- **The rooting step.** At the mark of the work where the idea arose, the owner confirms the owning territory, the nearest Project or theme, and the split between concept and work, on that work's proposal.
- **The owning territory** is the one whose Capital must accept it. Kris adopted the rule on 2026-10-15: "I confirm the owning territory at the mark, on the proposal of the thread where the idea arose, using "whose Capital must accept it". The model and method root in Knowledge Islands, and my own life and machine bindings root in Personal. Another territory gets one handoff when it must act and otherwise only a one-line link."
- **Concepts and work are held apart.** A concept, a philosophy or approach not yet committed to, is held as an Emerging Concepts note in the owning Capital's knowledge base, which [`ki-repo-kb`](../../../repo-structure/ki-repo-kb/SKILL.md) places. Work is held as an `Idea:` bullet in the `## Notes` of the nearest Project note or theme page, or in an [idea-stage Project](#idea-stage-project) when a decision must come first.
- **One home, never a mirror.** Another territory that must act gets one handoff through [`ki-trades`](../../../governance/ki-trades/SKILL.md); otherwise it gets at most a one-line link to the owning home.
- **Graduation is slice by slice.** What settles leaves its idea home by the [quotation rule](../../ki-work-roadmap/references/standards-repository-roadmaps.md#ideas-and-graduation), so the ideation behind it can carry on.

## Links point upwards

A work record names its Project or theme, a Project names its theme, and a work file names its Project. No link points down: a Project note names no work record or work folder, and a theme page names no Project or record. `ki` views derive the downward lists from the upward links, so the registry never holds a second copy of membership or status. The Streams checker fails a registry note that names a work-record identifier or carries an `## Update` section; Decision Record identifiers are not work records.

## Index notes

`Projects.md` and `Themes.md` are the folders' index notes and own no slugs of their own. Under the knowledge-base index-note rule each describes every child note in a line, by what the Project or theme is for; neither lists records nor restates status.

## Cross-territory references

A record may serve a Project or theme owned by another territory. It then qualifies the value as `<territory>/<slug>`:

```yaml
project: ki/agent-host
theme: ki/rig
```

- `<territory>` is the handle defined by `ki-repo`: the Capital's explicit `territory_prefix`, or its local registry key when the prefix is absent. This is the same handle used by `-t, --territory`; registered Capital keys retain their separate role as local identity metadata. Resolve exactly one registered Capital and reject duplicate handles or prefix/fallback collisions rather than guessing.
- The named checkout must declare itself a Capital: its `ki-repo` `repository` equals its `capital`.
- An unqualified slug always means the repository's own Capital territory, so existing values keep their meaning.
- A qualified value resolves against the named territory's `Streams/Projects/` or `Streams/Themes/`; a Project's registered theme belongs to the Project's territory.

A territory missing from the local registry, a checkout that is not a Capital, or an unknown slug is a warning, never a failure. Resolution is local and read-only. A qualified reference is classification only: the referenced territory gains no plan, priority, or acceptance authority over the record.

## Membership and authority

Membership is classification, not authority. A Project may count records from any repository in the territory, and tagging another repository's record with a Project never transfers its plan, priority, or acceptance; the owning repository decides whether its record joins.

## Tolerance window

The thread-model registry stays readable, with a warning on each shape, until a later phase of the migration closes the window that [KI-HARNESS-GOV-210 (pruned)](https://github.com/knowledgeislands/ki-agentic-harness/blob/08468196/docs/roadmap/KI-HARNESS-GOV-210-work-model-write-in.md) opens:

- `Streams/Initiatives/<slug>.md`, read as the theme page of the same slug, and its `Initiatives.md` index;
- a Project folder note, `Streams/Projects/<slug>/<slug>.md`, read as the flat note;
- a Project note's `initiative:`, read as its `theme:`;
- a record's `initiative`, read as its `theme`.

A `design/` folder under `Streams/` is not tolerated: the Streams checker fails it, and its papers move to the work folder.

## Validation

The roadmap checker resolves `project` slugs against `Streams/Projects/` and `theme` slugs against `Streams/Themes/` of the referenced territory when it can find the registry, reading the [tolerated](#tolerance-window) thread-model shapes with a warning. An unknown slug, or an unavailable registry, is a warning and never a failure or a silent ungrouping. A record naming both a `project` and a `theme` fails only when the registry gives that Project a different theme, including the same slug in a different territory. The Streams checker on the Capital reports a Project with no open record as due for its close-out assessment, and an assessed one as awaiting its lead's close decision. It recognises an idea-stage Project by its `planned` lifecycle and decision outcome, and warns when an open record names one or a cap is exceeded. A legacy `Streams/Projects/Initiatives.md` index stays readable with a warning during the [migration tolerance window](../../ki-work-roadmap/references/standards-repository-roadmaps.md#migration-tolerance).

Views group by Project and theme without copying record lists into a second status source. Status lives in the records and each Project note's `lifecycle`; the state of each piece of work lives in its work file, which `ki-work-folder` owns.
