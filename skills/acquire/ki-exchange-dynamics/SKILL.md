---
name: ki-exchange-dynamics
ki-kind: governance
ki-applicability: declaration-only
ki-guild: acquire
ki-depends-on: []
ki-shared-dependencies: [ki-skills:rubric]
description: >
  Analyse a conversation, chat, thread, meeting or negotiation for its dynamics: chronology, sentiment kept apart from
  tension, phases and participants, as one evidence-linked analysis validated against a schema, then render it as an
  infographic or report. Use to analyse an exchange or audit an analysis; `ki-acquire` owns capture and `ki-diagrams`
  system diagrams.
argument-hint: 'audit <repo> | conform <repo> | educate <repo> | analyse <exchange> | render <analysis> | help | refresh'
---

# Exchange dynamics

Read [the exchange dynamics standard](references/standards-exchange-dynamics.md) first: the method, the four layers, the safeguards, the analysis contract, the workflow and privacy. Read [the rendering standard](references/standards-exchange-dynamics-rendering.md) before drawing anything. While [the migration overlay](references/standards-exchange-dynamics-migration.md) exists, read it last; it lists temporary adjustments, and the standards win wherever they differ.

The principle is **analyse once, render many ways**: one analysis, checked against [the schema](assets/eda-analysis.schema.json), is the only thing any rendering reads. Capture of the exchange itself is the `ki-acquire` skill's and its provider skills', and diagrams of systems are the `ki-diagrams` skill's. Drawing goes through the `archify` and `dataviz` renderers, which add no analysis. The invented [allotment example](assets/examples/allotment-tool-shed/design-decisions.md) shows a complete analysis beside its transcript. The [generated rubric](references/rubric.md) holds the review criteria. This skill accepts no repository configuration properties.

## Operating modes

For `help`, `-h`, `?` or no recognised mode, explain the method, modes and off-ramps without reading an exchange or writing an analysis; offer a mode choice only in an interactive session.

Every mode reads first. ANALYSE and RENDER write only beside the exchange or analysis they were given, in its privacy tier, and never copy private material into a public repository.

### Mode AUDIT

Run `ki repo audit --skill ki-exchange-dynamics --repo <repo>`, which validates every committed `analysis.json`, then review the supplied analyses, sources and renderings against the standards, recording each judgment criterion as conforming, a named gap or a justified exclusion. A passing contract does not prove the reading is fair; missing evidence stays a named gap.

### Mode CONFORM

Run AUDIT, then `ki repo conform --skill ki-exchange-dynamics --repo <repo> --dry-run`. The host may regenerate rubric publication. Propose repairs to an analysis as a list; this mode does not re-read an exchange, change a score or regenerate a rendering.

### Mode EDUCATE

Explain the method, the two axes and the four layers using the invented allotment example. Do not analyse a real exchange to demonstrate the method.

### Mode ANALYSE

Take one named exchange and follow the standard's workflow, steps 1 to 10: scope it, select its events, quote and score them, detect phases, read the participants, conclude, then run `bun scripts/validate-analysis.ts <analysis.json>` from this skill and repair the analysis until it passes. Write the analysis as `analysis.json` beside its source. Report the analysis's path, its event count, what stays uncertain and any gap in the source; render nothing unless asked.

### Mode RENDER

Take one validated analysis and render it under the rendering standard: an `archify` explainer for the infographic with the trajectory chart under `dataviz`'s rules, or a Markdown report written straight from the analysis. Record the renderer, variant and instructions in `design-decisions.md` beside the rendering. Validate the analysis first and stop if it fails; never change the reading in a rendering.

### Mode REFRESH

REFRESH writes only in the canonical `ki-agent-backpack` repository; from an installed copy, stop and redirect there. Read [the sources](references/sources.md), compare the method's lineage and the renderers' current behaviour with the standards, then make and verify the smallest correction. When a migration item is done, delete its line, and delete the overlay once it is empty.
