# KI-wide frontmatter standard

**Refresh:** structure · annually

The authoritative definition of frontmatter fields for all notes in a Knowledge Islands base. Any skill that reads or writes KB notes
follows this standard. Instrument-specific fields (e.g. `decision_type` for DRs) are defined by the skills that introduce them and
documented here only as dependent fields.

## Universal fields

| Field    | Required (KB repos) | Description                                                                                                      |
| -------- | ------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `type`   | Yes                 | The note's **kind** (sole classifier); derived from its location via path-pattern — see taxonomy below           |
| `status` | Yes                 | Note lifecycle: `draft - Month YYYY` / `current - Month YYYY` / `outdated - Month YYYY` / `archive - Month YYYY` |
| `tags`   | Optional            | Topical labels for filtering and discovery — **not** a classifier; a note's kind is its `type`                   |
| `author` | Recommended         | `Written with Claude` / `Manual` / `Mixed`                                                                       |

## Type taxonomy

`type` is a note's sole **kind** classifier — what it _is_, not what it is _about_ (topical labels are `tags`, which never classify). It is
**derivable from the note's location**: a path-pattern registry maps a path to its type (first match wins), so `type` is auto-assignable and
auditable rather than hand-chosen. The slug vocabulary below is the current taxonomy and may grow; the fixed contract is the **pattern** —
`type` is declared and path-derived — not any particular slug or notation.

The slugs use slash-hierarchical notation: `<zone>/<arm>/<leaf>`. The zone prefix identifies the KI zone; subsequent segments identify the
structural role within that zone.

### Admin branch (`admin/`)

| Type                          | Path context                                              | Defined by                          |
| ----------------------------- | --------------------------------------------------------- | ----------------------------------- |
| `admin/zone`                  | `Admin/Admin.md` (zone root)                              | `knowledgeislands-kb`               |
| `admin/index`                 | Area index notes (`Admin/Governance/Governance.md`, etc.) | `knowledgeislands-kb`               |
| `admin/governance/decision`   | `Admin/Governance/Decisions/*.md`                         | `knowledgeislands-decision-records` |
| `admin/governance/convention` | `Admin/Governance/Conventions/**/*`                       | TBD                                 |
| `admin/governance/policy`     | `Admin/Governance/Policies/**/*`                          | TBD                                 |
| `admin/governance/template`   | `Admin/Governance/Templates/**/*`                         | TBD                                 |
| `admin/operations/process`    | `Admin/Operations/Processes/**/*`                         | TBD                                 |
| `admin/operations/activity`   | `Admin/Operations/Activities/**/*`                        | `knowledgeislands-activities`       |
| `admin/operations/skill`      | `Admin/Operations/Skills/**/*`                            | TBD                                 |

`Admin/Operations/Activities/` is governed by `knowledgeislands-activities` and `Admin/Operations/Live Artifacts/` by
`knowledgeislands-live-artifacts`. Both currently define their notes with skill-specific frontmatter — `status` + `realization` and
`status` + `renders` respectively — rather than the `type:` node_type used elsewhere in this table, so Live Artifacts has no row above;
bringing them onto a `type:` field (and adding an `admin/operations/live-artifact` row) is an open reconciliation. The remaining `TBD` rows
have no governing skill yet.

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

| `type`                      | Additional required field | Valid values                                                                                 | Defined by                          |
| --------------------------- | ------------------------- | -------------------------------------------------------------------------------------------- | ----------------------------------- |
| `admin/governance/decision` | `decision_type`           | strategy, product, architecture, data, security, operations, governance, research, knowledge | `knowledgeislands-decision-records` |
