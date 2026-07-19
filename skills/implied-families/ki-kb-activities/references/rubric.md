<!-- GENERATED FILE: edit scripts/rubric/items/, not this publication. -->

# Generated rubric — kb-activities

> **Generated publication.** The TypeScript rubric items under `scripts/rubric/items/` are canonical; this file is generated from the in-memory catalogue. Edit the item definitions, then rerun `scripts/rubric/publish.ts`.

Line-by-line criteria for auditing ki-kb-activities. Classifications are derived from item aspects: **[M]** mechanical and **[J]** judgment. Sources are cited as declared by each canonical item.

## Contents

- [ACT — knowledge-base activities](#act--knowledge-base-activities)

## ACT — knowledge-base activities

→ [standard](../SKILL.md)

Activity note structure, frontmatter, realization-specific declarations, and safe index maintenance.

- **ACT-S-1 [M + J] — activity index** — `Activities.md` exists when one or more activity notes exist and lists every note. (sources.md)
  - _Review prompt:_ Is the index current, well ordered, and informative rather than merely mechanically complete?
- **ACT-S-2 [M] — activity collection location** — Activity notes are assessed only within `Admin/Operations/Activities/` in an existing base. (sources.md)
- **ACT-F-1 [M] — activity status** — Frontmatter-bearing activity notes declare `status` as `active`, `paused`, or `retired`. (sources.md)
- **ACT-F-2 [M] — activity realization** — Frontmatter-bearing activity notes declare a `realization`. (sources.md)
- **ACT-F-3 [M] — recognized realization** — Unknown realization values are surfaced for environment documentation without blocking extension. (sources.md)
- **ACT-R-1 [M] — slash-command skill field** — A `slash-command` activity declares its `skill` field. (sources.md)
- **ACT-R-2 [M] — slash-command skill resolution** — A declared slash-command skill resolves when a harness path is supplied. (sources.md)
- **ACT-R-3 [M] — scheduled-task name** — A `scheduled-task` activity declares its `schedule_name`. (sources.md)
- **ACT-R-4 [M] — scheduled-task registration** — Scheduled-task registrations are surfaced for verification in their external environment. (sources.md)
- **ACT-J-1 [J] — activity note clarity** — Each activity note body explains what the activity does, when it runs, and why it was adopted. (sources.md)
  - _Review prompt:_ Does each activity note clearly explain what it does, when it runs, and why it was adopted?
- **ACT-J-2 [J] — activity index quality** — The activity index is current, ordered, and useful to a reader. (sources.md)
  - _Review prompt:_ Is the activity index current, ordered, and useful rather than just mechanically complete?
- **ACT-J-3 [J] — retirement rationale** — Retired activities document why they were retired rather than disappearing silently. (sources.md)
  - _Review prompt:_ Do retired activities document a clear retirement rationale?
- **ACT-J-4 [J] — slash-command documentation** — Slash-command activities link to their skill documentation or trigger description. (sources.md)
  - _Review prompt:_ Does every slash-command activity link to useful skill documentation or trigger guidance?
- **ACT-J-5 [J] — scheduled-task narrative** — Scheduled-task activities document cadence and expected outcome. (sources.md)
  - _Review prompt:_ Does every scheduled-task note state its cadence and expected outcome?
