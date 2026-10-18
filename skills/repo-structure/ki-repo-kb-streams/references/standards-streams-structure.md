# Streams structure standard

This standard defines `Streams/` as the operational container of a Knowledge Islands base. It does not define a second Focus-based work queue. The applicable change-management adapter owns each area’s records, lifecycle, and allocation details.

## Contents

- [Operational container](#operational-container)
- [Project close-out](#project-close-out)
- [Idea-stage Projects](#idea-stage-projects)
- [Roadmap](#roadmap)
- [Recurring Activities](#recurring-activities)
- [Future trades](#future-trades)
- [Legacy migration](#legacy-migration)
- [Canonical knowledge and retention](#canonical-knowledge-and-retention)

## Operational container

`Streams/` is the Knowledge Base counterpart to a project repository’s operational `docs/` surface: it holds work-management records, never the settled knowledge they produce.

```text
Streams/
  Roadmap/
  Projects/        # only in a territory Capital holding the Project registry
  Themes/          # only in a territory Capital holding the theme registry
  Trades/          # only when a future KB trade placement is adopted
```

`Roadmap/` is the fixed area, not a horizon or lifecycle state. In particular, triage is roadmap status metadata and never a `Streams/Triage/` directory. `Projects/` and `Themes/` are the fixed homes of a territory Capital's registry under the [Project registry standard](../../../change-management/ki-work/references/standards-project-registry.md): one flat note per Project with a `Projects.md` index, and one theme page per theme with a `Themes.md` index. They hold no work records, and their notes link upwards only: a note names no work record and carries no dated `## Update` section, because each record names its Project or theme and `ki` views list the records. AUDIT fails a Project note or theme page, or either index note, that names a work-record identifier or carries an `## Update` section. Decision Record identifiers are not work records.

`Streams/` holds only definitions and records, under the [work model](https://github.com/knowledgeislands/ki-principal/blob/main/Admin/Governance/Decisions/GDR-KI-PRINCIPAL-009-the-work-model.md): everything that churns, the work file, decisions, reports, briefs and `ki-work-design` papers, stays in the work folder `+/_WORK/<id>/`. AUDIT therefore fails any `design/` folder anywhere under `Streams/`; its papers move to `+/_WORK/<id>/design/`. For the [tolerance window](../../../change-management/ki-work/references/standards-project-registry.md#tolerance-window) AUDIT reads `Streams/Initiatives/` and a Project folder note `Projects/<slug>/<slug>.md` as before, checking them the same way and warning on each. A future `Trades/` area needs an explicit contract; do not create it merely because the generic `ki-trades` working areas exist elsewhere in the repository.

The container does not prescribe a topical-folder or `groups` vocabulary. Where an owning adapter supports topical metadata, the receiving base chooses its vocabulary. That metadata never replaces an operational area or changes an identifier.

## Project close-out

A Project does not close when its records finish: it first gets the [close-out assessment](../../../change-management/ki-work/references/standards-project-registry.md#close-out-assessment), a `### Close-out assessment` heading inside its note's `## Notes`. In a Capital, AUDIT counts each Project's open records, those not `done` or `cancelled`, across the Capital and every checkout in the local ki registry: a bare `project` slug counts from the Capital's members, and a `<territory>/<slug>` value counts from anywhere, whether it names the Capital's territory prefix or its registry key. It warns on an `active` or `paused` Project with no open record and no assessment, and on a `completed` or `cancelled` Project with no assessment. An assessed Project with no open record is reported as awaiting its lead's close decision. Without a readable registry, records outside the Capital are invisible, so a Project with no open record is reported only for information. A `planned` Project is not assessed.

## Idea-stage Projects

In a Capital, AUDIT recognises an [idea-stage Project](../../../change-management/ki-work/references/standards-project-registry.md#idea-stage-project) as a `planned` Project whose `outcome` opens with its lead's name, or their first name, followed by "decides". Counting open records as for close-out, it warns on each idea-stage Project an open record names, because the Project graduates to `active` before records name it. It warns when a theme has more than one idea-stage Project, and when the territory has more than three. The territory work's review of each idea-stage Project at its marks stays with [`ki-coordination`](../../../change-management/ki-coordination/SKILL.md).

## Roadmap

`Streams/Roadmap/` is the KB placement equivalent of a project repository’s `docs/roadmap/`. It contains flat finite work records, its `_ISSUES.md` allocation ledger, and an optional `_IDEAS.md` list of ungraduated ideas. The [repository roadmap standard](../../../change-management/ki-work-roadmap/references/standards-repository-roadmaps.md) owns the record format, lifecycle, identifier grammar, and horizon metadata.

Every record's `id` is unique within the base. AUDIT fails each record whose identifier another record shares, because a collision makes links, trades and closure ambiguous; resolve it by keeping the canonical holder and reallocating the other from `_ISSUES.md`. A pruned record's serial is never reused, but that reuse cannot be seen from the current tree alone.

AUDIT also applies the roadmap standard's [structural-validity invariant](../../../change-management/ki-work-roadmap/references/standards-repository-roadmaps.md): every direct child other than `_ISSUES.md`, `_IDEAS.md`, and a `Roadmap.md` index note must begin with parseable frontmatter whose `id` matches its filename identifier, so no record escapes the identity check by lacking one. It checks only that floor; body sections, other fields and retired fields remain the roadmap adapter's format. Because the KB adapter otherwise reads only the fields it needs, AUDIT also warns on any record frontmatter field that neither the [work-item format](../../../change-management/ki-work-roadmap/references/standards-work-item-format.md) nor the [`ki-repo-kb` universal note fields](../../ki-repo-kb/references/standards-frontmatter.md#universal-fields) define, such as an undefined `priority`; `horizon` is the only priority signal.

`_ISSUES.md` holds counts only. It uses the roadmap standard's canonical ledger form, its header and its `last_id` or area counters, and AUDIT fails any other content, such as migration history or prose about the records. That history belongs in Git or a Decision Record.

Roadmap horizons and lifecycle are frontmatter fields. Do not represent `Triage`, `Now`, `Next`, `Soon`, `Future`, or `Hold` with paths below `Streams/Roadmap/`.

Substantive prospective work is deduplicated against the canonical queue, then captured without an approval gate, once it passes the roadmap graduation test, as a flat `status: triage` roadmap record with no horizon. Its identity is allocated from the canonical `_ISSUES.md` high-water ledger and reserved by the committed ledger advance that precedes the record, and the capture is reported after creation. Capture records the possibility of work; it does not adopt, prioritise, plan, or authorise delivery.

Explicit human approval is required before a captured record leaves triage or is renamed or cancelled. Approval never bypasses the shared lifecycle or done-before-prune rules, and this intake contract creates no direct discard path. Silence, discussion, and automatic capture are not approval. Apply adoption through `ki-next`; route an approved cancellation to `ki-accept` so the record reaches retained `cancelled`, with its resolution, before any later prune.

## Recurring Activities

Recurring obligations are canonical Activity notes in the collection configured by `ki-repo-kb-activities` (default `Admin/Operations/Activities/`). Each active Activity names its home, the territory's regular work or a Project, and may carry a `theme`. An Activity with the `housekeeping` profile uses `ki-work-recurring` for scheduling, due-run reservation and successful-run evidence. It is the single authoritative definition, not a duplicate of a Streams template. Its due runs are ordinary linked roadmap records under `Streams/Roadmap/`.

A due run is a linked ordinary roadmap record in `Streams/Roadmap/`. Its horizon and lifecycle remain record metadata; it is not moved into a Streams state folder.

## Future trades

`Streams/Trades/` is reserved, not yet a required part of the structure. If adopted, it must be defined by a KB-specific extension of `ki-trades`; the generic `+` and `-` repository working areas remain outside this standard.

## Legacy migration

`Active`, `Background`, `Dormant`, and the former Focus folders are legacy navigation and state labels. They are not target paths and must not be reintroduced as topical groups.

For each retained legacy record, the receiving base decides deliberately whether it is:

1. finite forward work → a flat `Streams/Roadmap/` record;
2. a recurring obligation → one Activity note in the configured Activity collection, using the `ki-work-recurring` profile when its recurring-work lifecycle applies;
3. durable knowledge → a canonical `Admin/`, `Pillars/`, or `Resources/` note; or
4. obsolete working material → retained or pruned through explicit owner approval.

The base also decides its own repository code, fixed roadmap area codes, issue-ledger high-water marks, retained-ID map, and any optional topical metadata. Never derive identities or historic topical membership from a legacy path.

## Canonical knowledge and retention

An existing `Streams/Housekeeping/` area is not a supported second schedule source. AUDIT flags it for deliberate reconciliation. Preserve its identifiers, active-run links and successful-run evidence when the owner approves consolidation into Activities; neither AUDIT nor CONFORM moves, deletes or duplicates those definitions.

Streams records are working evidence, not a knowledge store. Durable outputs belong in `Admin/`, `Pillars/`, `Resources/`, or a Decision Record. A completed roadmap record remains until explicitly selected for prune; Activity and trade retention follow their owning standards.
