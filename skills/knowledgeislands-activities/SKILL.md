---
name: knowledgeislands-activities
description: >
  Author, audit, and manage Activity notes in a Knowledge Islands base — the operational record of what automation, scheduling, and agentic
  work a base has adopted. Governs the naming convention, required frontmatter, realization types, and the Activities.md index in
  Admin/Operations/Activities/. Checks that activities declared as slash commands have a corresponding skill, and that those declared as
  scheduled tasks are flagged for registration in an external scheduling system. The harness supports any agentic environment; Claude Code
  (slash commands / skills) and Claude Cowork (scheduled tasks) are the primary realizations. Triggers: "add an activity", "audit
  activities", "what activities does this base have", "register this as a scheduled task", "create a skill for this activity", "list my
  activities", "check activity conformance". For the KB zone structure use `knowledgeislands-kb`; for skill authoring use
  `knowledgeislands-skills`; for the harness bundle layout use `knowledgeislands-harness`.
argument-hint: 'audit | conform | new <name> | refresh'
---

# Knowledge Islands Activities

You are helping the user author, audit, and manage **Activity notes** in a Knowledge Islands base. An Activity is a named, intentional
behaviour the base has adopted — a piece of automation, a scheduled task, an agentic capability, or a recurring manual process. This skill
governs the Activity note format and the Activities.md index; it does not define what the activity does — that lives in the activity note
itself and in the agentic environment that runs it.

**Design note:** The harness and the Activity system are designed for any agentic environment. Claude Code (slash commands / SKILL.md files)
and Claude Cowork (scheduled tasks) are the primary realizations, but the realization model is open — a new environment type is declared in
the activity note's `realization` field without requiring a skill update.

## The Activity model

Activity notes live at `Admin/Operations/Activities/<Activity Name>.md` and describe a single named behaviour the base has adopted. They are
indexed by `Admin/Operations/Activities/Activities.md`.

### Required frontmatter

Every activity note that carries a frontmatter block must include:

| Key           | Value                                  |
| ------------- | -------------------------------------- |
| `status`      | `active` \| `paused` \| `retired`      |
| `realization` | See realization types below.           |
| `author`      | Who authored or adopted this activity. |

The `tags` and `date` fields follow the base's general frontmatter standard (governed by `knowledgeislands-kb`).

### Realization types

The `realization` field declares how this activity runs. Known types:

| Value            | Meaning                                                                                            |
| ---------------- | -------------------------------------------------------------------------------------------------- |
| `slash-command`  | A Claude Code skill (SKILL.md). The skill name must be declared in `skill` (see below).            |
| `scheduled-task` | A Cowork or other external scheduled job. The job name is declared in `schedule_name` (see below). |
| `conversational` | A recurring conversational pattern — no external artefact, invoked by the user.                    |
| `manual`         | A human-run process — documented here for completeness.                                            |
| `workflow`       | A multi-step automated workflow (Workflow script or equivalent).                                   |

Additional realization types may be declared freely — the audit treats unrecognised values as ADVISORY rather than WARN/FAIL, so the system
extends to new environments without requiring a skill update.

### Realization-specific fields

When `realization: slash-command`, declare:

```yaml
skill: <skill-name> # e.g. knowledgeislands-kb — must match a SKILL.md name: in the harness
```

The mechanical checker verifies the named skill exists in the connected harness's `skills/` directory.

When `realization: scheduled-task`, declare:

```yaml
schedule_name: <job name> # the name as registered in the external scheduling system
schedule_env: cowork # or another identifier — free text, for documentation
```

The checker cannot verify registration in an external system; it emits WARN if `schedule_name` is absent and ADVISORY noting the job should
be registered in the named environment.

### Activities.md index

`Admin/Operations/Activities/Activities.md` is the index note for all activities in the base. It should list every activity note with its
status and realization type. The audit checks this file exists when any activity note is found; the index contents are a judgment check.

## Operating modes

### AUDIT

Run the mechanical checker (`scripts/audit-activities.ts`) against the base:

1. Find all activity notes in `Admin/Operations/Activities/` (excluding `Activities.md`).
2. For each note with frontmatter: check `status` and `realization` are present; check realization-specific fields match the type.
3. For `slash-command` activities: verify the declared `skill` exists in `<harness>/skills/<skill>/SKILL.md`. FAIL if declared skill is
   absent.
4. For `scheduled-task` activities: WARN if `schedule_name` is absent; ADVISORY that the task should be registered in the declared
   `schedule_env` (or Cowork if unspecified).
5. Check `Activities.md` index exists.
6. Compose on `knowledgeislands-kb` audit for the base-level zone checks — do not re-run them, note the dependency.

### CONFORM

Repair structural gaps:

1. Create `Admin/Operations/Activities/Activities.md` stub if absent.
2. For activity notes missing required frontmatter fields: prompt to fill them in (do not guess values).
3. For a `slash-command` activity whose skill is absent: offer to scaffold the SKILL.md stub (invoke `knowledgeislands-skills` NEW mode).
4. For a `scheduled-task` activity missing `schedule_name`: prompt the user to provide it and register it in the external system.

### NEW

Author a new activity note. Prompt for:

- Name (becomes the filename and the `# Heading`)
- Realization type (offer the known list; accept free text)
- Realization-specific fields (skill name for slash-command; schedule name + env for scheduled-task)
- Initial status (`active` unless otherwise stated)

Write to `Admin/Operations/Activities/<Name>.md` and add an entry to `Activities.md`.

### REFRESH

**Refresh:** canonical · on-change

The realization type list and required frontmatter are canonical to this skill; they have no external spec. Run REFRESH when the realization
model changes (new environment type adopted, field added). Review the sources list and update the declared types if the harness or the
adopted environments have changed.

## Composition

- `knowledgeislands-kb` — owns the Admin/Operations/ zone and the base-level zone audit. This skill composes on it for zone checks; run
  `knowledgeislands-kb` AUDIT first when auditing a full base.
- `knowledgeislands-skills` — invoked by CONFORM when scaffolding a skill stub for a `slash-command` activity.
- `knowledgeislands-harness` — the harness bundle layout; the checker resolves `skills/<name>/SKILL.md` relative to the harness root
  declared in the base's `.ki-config.toml` or a `--harness` flag.

## Project bindings

Declare in the base's `.ki-config.toml` `[knowledgeislands-activities]` table:

```toml
[knowledgeislands-activities]
# Path to the harness root (absolute or relative to the base). Used to resolve skill names.
# harness = "/Users/me/.claude/skills"
#
# Folder holding activity notes, relative to the base (default: Admin/Operations/Activities).
# activities_dir = "Admin/Operations/Activities"
```

## Audit rubric

See [references/audit-rubric.md](references/audit-rubric.md) for the full rubric (mechanical + judgment).
