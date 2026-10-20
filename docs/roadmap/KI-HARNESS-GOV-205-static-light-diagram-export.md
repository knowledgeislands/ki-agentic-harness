---
id: KI-HARNESS-GOV-205
area: GOV
title: Static light diagram export
project: ways-of-working
component: governance
kind: deliver
priority: medium
size: l
status: awaiting-review
horizon: now
blocks: []
blocked_by: []
baseline_ref: 791c4ed635f658f0dc6e2e480281aee26feddeac
created_at: 2026-10-17T22:06:58Z
updated_at: 2026-10-20T07:10:00Z
---

# KI-HARNESS-GOV-205: Static Light Diagram Export

## Goal

`skills/governance/ki-diagrams/scripts/export-svg.ts` offers a static flattened light export option beside its dual-theme default, and `ki-work-design` and `ki-diagrams` state that a design report carries its diagrams as inline text diagrams or as exported static SVGs committed beside the subject's Project note, so that every diagram a report shows renders legibly in any previewer. The exporter also offers a KI-theme export that carries the `ki-design` palette, fonts and glyphs, so that the one diagram standard, Archify through `ki-diagrams`, looks like Knowledge Islands and stays readable in viewers that do not run Archify's CSS.

## Context

Kris Brown answered DIAGRAMS-EXPORT on 17 October 2026 at 22:50 BST in the ways-of-working thread: "Add a ki-agentic-harness triage record for a static flattened light export option in export-svg.ts and a ki-work-design and ki-diagrams rule that design reports use inline text diagrams or exported static SVGs beside a Project note."

The [diagram-fix run report](/Users/krisbrown/workspaces/knowledge-islands/ki-principal/+/_WORK/ki/diagram-fix.report.md) found the cause. The exporter writes Archify's dual-theme SVG, dark by default, whose fills, strokes and text colours come from CSS custom properties, `color-mix()` and `:is()` rules in an embedded stylesheet with inlined web fonts. A previewer that does not run that CSS, such as Zed's renderer or `rsvg-convert`, falls back to black, so text and boxes vanish. The run fixed four diagrams by flattening each under Archify's light theme in headless Chrome into a static SVG with plain hex colour attributes, a light background, real `<text>` in a system monospace stack, and no stylesheet, variables or embedded fonts. It used a one-off script outside any repository, so a re-export from source brings the dark dual-theme SVG back.

This record also carries the open concern of [KI-HARNESS-GOV-217](https://github.com/knowledgeislands/ki-agentic-harness/blob/87da1b26/docs/roadmap/KI-HARNESS-GOV-217-coordination-and-work-design-renames.md), folded here on 18 October 2026 under Kris's PRUNE-HELD a) answer: the harness `thread-model` diagram stays pinned at `b7d3b53e`, where its cited `ki-pmo` paths exist, and renaming its node label and sources means re-tracing it at HEAD under its `regenerate` instruction in `docs/diagrams/diagrams.toml`.

Kris Brown widened the scope on 19 October 2026 in the Observatory work, answering DIAGRAM-STANDARD through the RECOMMENDED answer, "Go with recommendations taking the above into account." Its recommended course, taken as read back in the [Observatory decisions log](/Users/krisbrown/workspaces/knowledge-islands/ki-principal/+/_WORK/ki.observatory/decisions.md), is that Archify through `ki-diagrams` is the one diagram standard, extended to the knowledge-base islands, with a KI-theme export folded into this record; D2 stays allowed only for diagrams generated from code, on the tokens; and Mermaid is excluded, following the NO-MERMAID answer of 18 October 2026, "I don't want mermaid as a diagram standard really, its pants". The theme maps colours from the `packages/tokens` night and day themes in `ki-design` as plain colour attributes any viewer renders, uses the `font.mono` system stack instead of embedded JetBrains Mono, and uses KI glyphs where the symbol library carries the meaning; the JSON source and interactive viewer stay as they are. The same day Kris kept the name `ki-diagrams` under ADR-KI-HARNESS-SKILLS-003 (DIAGRAM-NAME). The Mermaid audit warning the DIAGRAM-REPLACE answer relies on is [KI-HARNESS-GOV-221](KI-HARNESS-GOV-221-ki-diagrams-mermaid-fence-warning.md).

## Boundary

- In: a light, static, flattened export option in `export-svg.ts`, built on the existing Chrome driver, with its tests and usage; the `ki-diagrams` rule on when to use it and how the manifest records it; the `ki-work-design` rule that design reports use inline text diagrams or exported static SVGs beside the Project note; regenerated skill surfaces.
- In: re-tracing the `thread-model` diagram at HEAD under its `regenerate` instruction, and re-exporting it.
- In: a KI-theme export option in `export-svg.ts`, mapped from the `ki-design` tokens as above, flattened like the static light form so that it needs no stylesheet, variables or embedded fonts; its tests and usage; the `ki-diagrams` standard text the decision changes, as proposed under Discussion; regenerated skill surfaces.
- In: the KI theme's night palette as its own form, `ki-night`, because the decision maps both the night and day themes and a static SVG carries one; and KI glyphs drawn for the node icons whose meaning a KI symbol carries, vendored from `ki-design` like the tokens.
- Out: changing the dual-theme default for living diagrams elsewhere; changing Archify; re-exporting existing diagrams in other repositories, which their owners do.

## Current state

Checked on 20 October 2026 at `30cbbd1d`.

- `skills/governance/ki-diagrams/scripts/export-svg.ts` takes only `<input.html> <output.svg>`. It drives headless Chrome through `scripts/internal/chrome.ts`, runs Archify's own SVG export, requires Archify's canonical-export receipt and refuses an external reference. It has no option for theme or flattening.
- [KI-HARNESS-GOV-224](KI-HARNESS-GOV-224-diagram-viewer-receipts.md) has since added `scripts/build-html.ts`, which rebuilds every manifest diagram and, with `--svg`, re-exports its SVG, so a new export form must be reachable through it as well.
- The `thread-model` manifest table in `docs/diagrams/diagrams.toml` is still pinned at `last_checked = "b7d3b53e…"` with its `regenerate` instruction.
- The diagrams standard's The tool: Archify and Committed forms sections still read as quoted under Discussion. The `ki-work-design` standard says only where design artefacts live, not how a report carries diagrams.
- The `ki-design` tokens are in the separate `ki-design` repository at `packages/tokens/tokens.json`, a private, unpublished package (`@knowledgeislands/tokens` 0.2.0) with night and day themes and a `font.mono` stack. This harness has no copy and no dependency on it.

## Steps

- [x] Add an export-form option to `export-svg.ts`, recommended `--form dual|light|ki`, defaulting to `dual`. The `light` and `ki` forms switch the viewer to the chosen theme in Chrome, resolve every computed fill, stroke and text colour into plain attributes, replace embedded fonts with the system monospace stack, and strip the stylesheet, custom properties and font data.
- [x] Keep the existing gates for the flattened forms: Archify's canonical receipt before flattening, and the external-reference refusal after it. Add a check that the flattened SVG holds no `<style>`, `var(` or `@font-face`.
- [x] Bring the needed `ki-design` token values into `ki-diagrams` as a vendored copy recording its pinned `ki-design` revision, with a drift test against that revision. The `ki` form maps the night and day palettes and `font.mono` to the attributes it writes.
- [x] Pass the form through `build-html.ts --svg`, and record it in the manifest's optional `svg_form` field, absent meaning `dual`.
- [x] In the `ki` and `ki-night` forms, draw each Archify node icon whose meaning a `ki-design` symbol carries with that symbol's glyph, vendored at the pinned revision with a drift test against the glyph files and the symbol library.
- [x] Add tests: argument parsing, a flattened fixture with no stylesheet, variables or font data, the token drift check and the glyph drift check.
- [x] Edit the diagrams standard: its opening scope to cover knowledge-base islands with a short island-diagrams section; The tool: Archify for D2 and Mermaid as proposed under Discussion; Committed forms to name the new forms; and The SVG exporter for the option.
- [x] Add the `ki-work-design` rule that a design report carries its diagrams as inline text diagrams or exported static SVGs committed beside the subject's Project note.
- [x] Re-trace `thread-model` at HEAD under its `regenerate` instruction, rebuild and re-export it, and advance its `last_checked`.
- [x] Regenerate the `ki-diagrams` `rubric.md` where the published text changes; `ki-work-design` has no rubric.

## Files touched

- `skills/governance/ki-diagrams/scripts/export-svg.ts`, `export-svg.test.ts`, `build-html.ts`, `build-html.test.ts`, and the vendored token and glyph modules `scripts/internal/ki-design-tokens.ts` and `scripts/internal/ki-design-glyphs.ts` with their tests
- `skills/governance/ki-diagrams/references/standards-diagrams.md`, `rubric.md`, `SKILL.md` where it summarises the forms
- `skills/change-management/ki-work-design/references/standards-work-design.md`
- `docs/diagrams/diagrams.toml`, `docs/diagrams/thread-model.*` and `docs/diagrams/README.md`

## Verify

- `bun run test` and `bunx tsc --noEmit` pass.
- `ki dev skill rubric ki-diagrams` leaves no diff.
- `ki repo audit --skill ki-diagrams` reports no FAIL here.
- `rsvg-convert` renders a `light` and a `ki` export of one diagram with visible text and boxes, and `grep -E '<style|var\(|@font-face'` finds nothing in either.

## Dependencies / blocks

Decided on 20 October 2026 under PLANNED-READY a), each as recommended:

- Token source: a vendored copy of the needed values in `ki-diagrams` with a drift test against a pinned `ki-design` revision, because the package is private and unpublished; the alternative is a pinned Git dependency.
- Default form: `dual` stays the default for living diagrams, and design reports use `ki` or `light`; the alternative makes `ki` the default everywhere.
- Manifest field: an optional `svg_form` field, absent meaning `dual`, so a reader knows which form is committed.

[KI-HARNESS-GOV-221](KI-HARNESS-GOV-221-ki-diagrams-mermaid-fence-warning.md) and [KI-HARNESS-GOV-214](KI-HARNESS-GOV-214-working-area-marks.md) edit the same standard; deliver them one after another. The size, `l`, may warrant splitting the KI-theme form from the light form at Ready.

## Documentation impact

### Decision Records

None new: ADR-KI-HARNESS-SKILLS-003 already holds the name. The owner's DIAGRAM-STANDARD decision is recorded in the Observatory decisions log, and the standard carries its effect.

### Specifications

None: no Specification covers the exporter.

### Guides

`docs/diagrams/README.md` changes only if `thread-model`'s figure or wording changes on re-trace.

### Roadmap

None; re-exports in other repositories are their owners' work.

## Review

### Delivered

Commit `5abbe1ac` from baseline `791c4ed6`, reworked after the failed review by `48c9bf5a` on `run/harness-fix`.

### Change Summary

- `scripts/export-svg.ts`: `--form dual|light|ki|ki-night`, default `dual`.
  - A static form first takes Archify's canonical export under the existing gates, then reopens it in the same headless Chrome with the form's theme and, for the KI forms, the Archify theme variables set from the tokens.
  - Every computed paint, stroke and text property is written as a plain attribute where it differs from the inherited or initial value, colours as hex with a separate opacity; `vector-effect` is kept, so icon strokes stay unscaled, and a default black stop colour is no longer written out.
  - Hidden elements, the stylesheet, classes and inline styles are dropped, and the root font family is set to the form's monospace stack.
  - The external-reference refusal still applies, and a new check refuses any result still holding `<style>`, `var(` or `@font-face`.
  - In the `ki` and `ki-night` forms, each node icon whose meaning a KI symbol carries is drawn with that symbol's glyph, its group rescaled from the glyph's 24-unit grid to Archify's 16: database as the library, calendar as the calendar, decision as the council hall, external as the port, security as the customs house and message bus as the current. Every other icon stays as Archify draws it.
- `scripts/internal/ki-design-tokens.ts`: the role, wash, `color.core.mist` and `font.mono` values from `ki-design` `packages/tokens/tokens.json` at `cbcc1ace`, with the Archify-variable-to-token map and a drift test through `git show` in a `ki-design` checkout, found through `KI_DESIGN_ROOT` or as a sibling and skipped where none exists.
- `scripts/internal/ki-design-glyphs.ts`: the six glyph bodies from `packages/icons/svg/` at the same revision, each with the symbol that justifies it. Its test compares each body with its glyph file and each symbol's icon with `packages/symbols/src/symbols.ts` at that revision, and checks that no body carries paint of its own.
- `scripts/rubric/contexts/diagrams.ts`: optional manifest `svg_form`, validated against the forms, absent meaning `dual`. `build-html.ts --svg` passes it to the exporter.
- `references/standards-diagrams.md`:
  - the opening covers knowledge-base islands, and a new Island diagrams section has them cite notes in place of code;
  - The tool: Archify carries the D2 and Mermaid wording proposed under Discussion;
  - Committed forms names the four forms, says why `ki-night` exists, and says a design report uses `ki` or `light` beside the subject's Project note;
  - the manifest table gains `svg_form`, and the regeneration step and the exporter section document `--form` and the glyph mapping.
- `ki-diagrams` `SKILL.md`: the exporter summary mentions the forms and the KI glyphs.
- `ki-work-design` `references/standards-work-design.md`, Report diagrams: a design report carries each diagram as an inline text diagram or as a `ki` or `light` SVG committed beside the subject's Project note, in the folder of the note it supports as `ki-repo-kb` sets, and links to it there, so the SVG outlives the report. Until the subject has a Project note, the report carries inline text diagrams.
- `thread-model`, re-traced at `791c4ed6` in `5abbe1ac`:
  - the thread lane now reads `ki-coordination`, the checkpoint step is the work package's `state.md`, reports go to `+/_WORK/<id>/`, the reply block is Answer by tag and Project close is Finish Project;
  - every source cites a current heading line, and the cards and README paragraph match.
  - `last_checked` now advances to `b3b6a808`, whose one-line change to the traced coordination standard lies outside `stale_when` and moves no cited line.
- `rubric.md` is unchanged, since no criterion changed. The remediation-inventory counts are unchanged.

### Verification

- `bun run test`: 1372 pass, 0 fail. The token and glyph drift tests ran against the local `ki-design` checkout and passed. `bunx tsc --noEmit`: OK.
- `ki dev skill rubric ki-diagrams`: in sync.
- `ki repo audit --skill ki-diagrams` (isolated home, worktree source): FAIL=0, with eleven DIAG-4 staleness warnings on the skill-map diagrams, which this record does not touch. `thread-model` does not warn.
- `ki repo audit --skill ki-skills`: PASS. The pre-commit focused audit passed.
- `thread-model` finalized from source into temporary output and exported as `ki`, `ki-night` and `light`: `grep -E '<style|var\(|@font-face'` found nothing in any, and `rsvg-convert` rendered each with visible text and boxes. The `ki` render shows the library, port and current glyphs in place of Archify's database, external and message-bus icons, and the `light` render keeps Archify's.

### Outstanding concerns

- Backend, frontend, cloud and the state icons stay Archify's: no symbol in the `ki-design` library at `cbcc1ace` carries a service, interface or hosting meaning. Most of this repository's own diagrams use backend and frontend icons, so their KI forms change little. A new symbol in `ki-design` would extend the map.
- Security as the customs house, "where what enters or leaves is inspected and declared", is the loosest match of the six; drop that line if the reviewer reads it otherwise.
- `ki-night` stays as a fourth form beyond the planned `dual|light|ki`. The decision maps both the night and day themes, and a static file carries one, so `ki` is the day theme and `ki-night` the night. The design-report rule uses only `ki` or `light`.
- Placement follows the approved wording, beside the Project note. Where a design shapes a Project that has no note yet, the rule falls back to the other approved carrier, inline text diagrams, rather than a third place.
- The static forms use the system monospace stack, not the embedded JetBrains Mono, so a long label may sit closer to its box edge than in `dual`.
- The drift tests skip on a machine with no `ki-design` checkout, including CI, so drift is caught only where that repository is cloned.
- One `thread-model` sublabel was shortened to "record, standard, ADR" to pass Archify's desktop-readability gate.

### Post-change review

- `dual` stays the default everywhere, so no other repository's diagrams change. Re-exports elsewhere remain their owners' work.
- The fail-closed gates are kept: the canonical receipt is checked before flattening, and the external-reference and dynamic-style refusals after it. A glyph body is parsed as SVG shapes only and carries no paint, reference or script.
- `SVG_FORMS` is defined once, in `export-svg.ts`, and imported by the manifest context, which avoids an import cycle. The glyph module takes its revision from the token module, so the two cannot be pinned apart.

### Mini recap

Diagrams can now be exported as static light or Knowledge Islands-themed SVGs that render in any previewer, and the KI forms draw KI glyphs where the symbol library carries the meaning. Design reports use the static forms, committed beside the subject's Project note, and `thread-model` is current again.

## Discussion

Captured on Kris Brown's DIAGRAMS-EXPORT answer. Questions for planning: whether the static option should become the default for report diagrams only or for every diagram; whether the exporter's fail-closed checks, canonical export receipt and external-reference refusal apply unchanged to the flattened form; and whether the manifest needs a field naming the export form.

The 19 October decision leaves the `ki-diagrams` standard narrower than the decision in three places, proposed here rather than edited because each changes scope rather than fixing a sentence outright:

- `references/standards-diagrams.md`, opening paragraph: "This standard defines how a Knowledge Islands repository keeps living diagrams" becomes "This standard defines how a Knowledge Islands repository or knowledge-base island keeps diagrams", with a short section on island diagrams, which explain a model or process rather than code and so cite the notes they draw from in place of traced source files.
- The same file, [The tool: Archify](../../skills/governance/ki-diagrams/references/standards-diagrams.md#the-tool-archify): "D2 is the best addition only for maps generated mechanically from code" becomes "D2 is allowed only for maps generated mechanically from code, such as a route manifest or a dependency graph, styled from the `ki-design` tokens; it has no interactive HTML", and "Mermaid and Graphviz were excluded" gains "Mermaid diagrams found in a repository are replaced by Archify diagrams wherever Archify can carry them, and the rest are flagged to the owner".
- The same file, [Committed forms](../../skills/governance/ki-diagrams/references/standards-diagrams.md#committed-forms): the SVG form names the KI-theme export once it exists, and whether it replaces the dual-theme default is a planning question for this record.

### Planning answers, 20 October 2026

Kris Brown answered PLANNED-READY on 20 October 2026 in the ways-of-working decisions log, "owner answers on the 03:08 BST send": "the old do need to move to Ready if possible, and we need to move them", taken as a): take the listed answers and mark each record Ready where the readiness checks pass. The three decisions are recorded under Dependencies / blocks and the record is Ready at size `l`; the KI-theme form was not split out, since a split would create a new record, which CAPTURE-GATE leaves to the owning coordinator.

### Independent review failed, 20 October 2026

Reviewed code `5abbe1ac` and packet `4301c307` together at combined revision `ae58540ecf69ee171e14282496f8ed1b904d9359`. Tests, TypeScript, rubric publication and focused audits pass. The reported ki-diagrams FAIL is not reproducible: this audit has zero failures, eleven existing DIAG-4 staleness warnings and five DIAG-8 working-mark warnings. There is no observed audit regression to waive. Independently exported light and ki SVGs contain no stylesheet, variable or font-face dependency; rsvg-convert renders both with readable text and boxes.

Two approved requirements remain unmet. Goal and DIAGRAM-STANDARD require KI glyphs where the symbol library carries the meaning, but the exporter maps only paint and font tokens and retains every Archify node icon. Delivered claims glyph support and Outstanding concerns acknowledges its absence. The available ki-design symbol and icon libraries include canonical-record and builder meanings; absence of glyph values in the token file does not settle this requirement. Implement the semantic mapping or obtain an explicit scope change, and make Delivered match the result.

The report-diagrams Step and Boundary require exported SVGs beside the subject's Project note. The new Report diagrams rule instead commits them beside the report under the work folder's design/ until graduation, a different placement and lifetime rule. Reconcile the approved requirement with the existing design-folder contract, obtain any required scope decision, and update the rule and packet before re-review. Include the declared extra ki-night form in that scope reconciliation.

### Rework after review, 20 October 2026

Both unmet requirements are now built rather than rescoped. The glyph mapping follows the DIAGRAM-STANDARD read-back, "KI-theme export (ki-design palette, fonts and glyphs ...)", through the symbol library's meanings. The placement follows the DIAGRAMS-EXPORT wording, "exported static SVGs beside a Project note", which `ki-repo-kb` allows, since an image or diagram belongs in the folder of the note it supports and nothing in `Streams/` then points into a work folder. `ki-night` is kept and justified under Boundary.
