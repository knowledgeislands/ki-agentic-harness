# Knowledge Islands Activity standard

This standard defines Activity notes: the operational record of intentional automation, scheduling, agentic behaviour, and recurring manual processes adopted by a Knowledge Islands base.

## Collection

The default collection is `Admin/Operations/Activities/`. One note named `<Activity Name>.md` describes one behaviour, and `Activities.md` indexes the collection.

A base may declare a different relative collection path with `activities_dir` under `[skills.ki-repo-kb-activities]`. The path must remain beneath the base and must not traverse a symbolic link. The optional `harness` key names a harness root, absolute or relative to the base, used only to resolve declared skill names at `skills/<name>/SKILL.md`. These are the only recognized keys; AUDIT warns on unknown keys and leaves every sibling configuration table untouched.

When activity notes exist, `Activities.md` lists every note. A repository-standard Obsidian wikilink, with or without an alias, or a Markdown link satisfies index coverage; link-shaped text inside a fenced code block does not. CONFORM may safely create a missing index or append missing entries to a regular index file. It must not create the collection directory, replace a non-regular index entry, follow a symbolic link, or write directly; it prepares one proposal for the host.

## Frontmatter

An activity note that carries frontmatter declares:

| Key           | Value                                  |
| ------------- | -------------------------------------- |
| `status`      | `active` \| `paused` \| `retired`      |
| `realization` | The execution form described below.    |
| `author`      | Who authored or adopted this activity. |

An active Activity may also name a `theme` and, for a Project's own recurring check, a `project`, as described under [Home](#home). The `ki-repo-kb` skill owns general note frontmatter such as tags and dates.

## Home

Under the [Work Process](https://github.com/knowledgeislands/ki-principal/blob/main/Pillars/Philosophy/Model/Processes/Work%20Process/Work%20Process.md), an Activity's home is its territory's regular work, `<territory>.regular`: the territory's recurring work, defined here in the Activity notes. An Activity needs no key to say so. A Project's own recurring check, needed only while the Project runs, stays with that Project instead and names it in a top-level `project` key, a slug in the territory's [Project registry](../../../change-management/ki-work/references/standards-project-registry.md).

An Activity may carry an optional top-level `theme`, a territory theme slug. A theme is a label, not a home: it holds no work. An Activity with a housekeeping profile may name the theme in the profile instead, which its runs inherit; when both are present they agree. The former `initiative`, at either place, is the thread-model name for `theme`: AUDIT warns on it, and on two themes that disagree, until the territory's migration renames it. Paused and retired Activities are not checked.

Regular work is self-coordinating. An occurrence starts by its schedule or by whoever needs it, with no coordinating session; the territory's state of play may discuss regular work but does not necessarily dispatch it. The link points upwards only: neither a theme page nor a Project note lists its Activities.

## Realization

The known realization values are:

| Value            | Meaning                                                       |
| ---------------- | ------------------------------------------------------------- |
| `slash-command`  | A runtime skill named by the `skill` field.                   |
| `scheduled-task` | An external scheduled job named by the `schedule_name` field. |
| `conversational` | A recurring conversational pattern invoked by the user.       |
| `manual`         | A human-run process documented for operational completeness.  |
| `workflow`       | A multi-step automated workflow.                              |

Additional values are allowed. AUDIT reports them as `INFO` so a new execution environment can be documented without first changing this skill.

A `slash-command` activity declares `skill: <skill-name>`. When a harness is configured, AUDIT verifies `skills/<skill-name>/SKILL.md` exists beneath it.

A `scheduled-task` activity declares `schedule_name` and may declare a free-text `schedule_env`. AUDIT can check that the name is present but cannot verify external registration, so it reports the registration check as `INFO`.

## Recurring-work profile

An Activity may opt into the recurring-work lifecycle with a nested `housekeeping` mapping. Declare and activate `ki-work-recurring` when using it; that skill owns the exact profile fields, schedule eligibility, stable housekeeping ID, single active run, and approved successful-run reconciliation. The Activity retains its normal metadata, realization, index entry, and narrative. Its `id`, `title`, and `status` are top-level; scheduling fields inside `housekeeping` use snake_case. There is no second status or copied definition in `Streams/Housekeeping/`.

An Activity without this mapping remains an ordinary Activity, even when externally scheduled. Do not force every conversational habit, automation, or report into a roadmap lifecycle. Recurring work that needs governed finite runs uses the profile; each run lives in `Streams/Roadmap/` and links back to the Activity's stable ID. A retired recurring Activity retains rationale and evidence but must have no active-run reservation; explicit disposition precedes retirement.

The repository definition explains the procedure, required capabilities, authority, evidence destination, and how a person or replacement execution environment can continue. A scheduler is a replaceable realization, not the durable owner of the behaviour or the only place its outcomes are recorded. Its schedule registration is verified separately; naming a task does not prove it exists or grant activation authority.

## Judgment

Each activity note explains what the activity does, when it runs, and why it was adopted. Retired activities retain a rationale. Slash-command activities point readers to useful skill documentation or trigger guidance. Scheduled-task notes state their cadence and expected outcome.

The index is current, ordered, and useful to a reader, including status and realization information rather than serving as a bare mechanically complete list.
