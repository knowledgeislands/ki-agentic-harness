# KI-wide frontmatter standard

**Refresh:** structure · annually

The authoritative definition of frontmatter fields for all notes in a Knowledge Islands base. Any skill that reads or writes KB notes
follows this standard. Instrument-specific fields (e.g. `decision_type` for DRs) are defined by the skills that introduce them and
documented here only as dependent fields.

## Universal fields

| Field    | Required (KB repos) | Description                                                                                                              |
| -------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `type`   | Yes                 | Slash-hierarchical structural type — see taxonomy below                                                                  |
| `status` | Yes                 | Content-note lifecycle: `draft - Month YYYY` / `current - Month YYYY` / `outdated - Month YYYY` / `archive - Month YYYY` |
| `tags`   | Recommended         | Topic tags for classification and filtering                                                                              |
| `author` | Recommended         | `Written with Claude` / `Manual` / `Mixed`                                                                               |

## Type taxonomy

The `type` field uses slash-hierarchical notation: `<zone>/<arm>/<leaf>`. The zone prefix identifies the KI zone; subsequent segments
identify the structural role within that zone.

### Admin branch (`admin/`)

| Type                             | Path context                                              | Defined by                          |
| -------------------------------- | --------------------------------------------------------- | ----------------------------------- |
| `admin/zone`                     | `Admin/Admin.md` (zone root)                              | `knowledgeislands-kb`               |
| `admin/index`                    | Area index notes (`Admin/Governance/Governance.md`, etc.) | `knowledgeislands-kb`               |
| `admin/governance/decision`      | `Admin/Governance/Decisions/*.md`                         | `knowledgeislands-decision-records` |
| `admin/governance/convention`    | `Admin/Governance/Conventions/**/*`                       | TBD                                 |
| `admin/governance/policy`        | `Admin/Governance/Policies/**/*`                          | TBD                                 |
| `admin/governance/template`      | `Admin/Governance/Templates/**/*`                         | TBD                                 |
| `admin/operations/process`       | `Admin/Operations/Processes/**/*`                         | TBD                                 |
| `admin/operations/activity`      | `Admin/Operations/Activities/**/*`                        | `knowledgeislands-activities`       |
| `admin/operations/live-artifact` | `Admin/Operations/Live Artifacts/**/*`                    | `knowledgeislands-live-artifacts`   |
| `admin/operations/skill`         | `Admin/Operations/Skills/**/*`                            | TBD                                 |

**Operational notes** (`admin/operations/activity`, `admin/operations/live-artifact`) carry a `type:` like every other note, but their
`status` is the operational pair **`active` | `inactive`** — not the content-note lifecycle vocabulary above — since an activity or live
artifact is simply on or off. Each is otherwise governed by `knowledgeislands-activities` / `knowledgeislands-live-artifacts`, which add
their own fields (`realization`, `renders`). The remaining `TBD` rows have no governing skill yet.

### Outbound staging (`-/`)

These types are only valid under `-/`. Files carrying them elsewhere are a ZONE-5 FAIL (see audit rubric).

| Type             | Path context       | Lifecycle                                                                | Defined by            |
| ---------------- | ------------------ | ------------------------------------------------------------------------ | --------------------- |
| `session-digest` | `-/_DIGESTS/*.md`  | Ephemeral. Delete once content is extracted into Pillars/Streams/handoff | `knowledgeislands-kb` |
| `handoff`        | `-/_HANDOFFS/*.md` | Ephemeral. Delete once recipient has routed it through their `+/`        | `knowledgeislands-kb` |

### Other zone branches (stubs)

Defined as those zones are built out:

- `calendar/...` — Calendar zone content
- `pillars/...` — Pillars zone content
- `resources/...` — Resources zone content
- `streams/...` — Streams zone content

## Dependent fields

Some `type` values require additional fields, defined by the skill that owns that type:

| `type`                           | Additional required field | Valid values                                                                                 | Defined by                          |
| -------------------------------- | ------------------------- | -------------------------------------------------------------------------------------------- | ----------------------------------- |
| `admin/governance/decision`      | `decision_type`           | strategy, product, architecture, data, security, operations, governance, research, knowledge | `knowledgeislands-decision-records` |
| `admin/operations/activity`      | `realization`             | slash-command, scheduled-task, conversational (open enumeration)                             | `knowledgeislands-activities`       |
| `admin/operations/live-artifact` | `renders`                 | `html` (or a comma-separated list of render types)                                           | `knowledgeislands-live-artifacts`   |
