---
name: ki-diagrams
ki-kind: governance
ki-applicability: declaration-only
ki-depends-on: []
ki-shared-dependencies: [ki-skills:rubric]
description: >
  Create, audit or refresh a repository's living Archify diagrams: committed sources and SVGs, the
  manifest, privacy, type choice and freshness. Use to keep diagrams that explain a system; use
  `ki-authoring` for prose and `ki-guides` for where a guide embeds a figure.
compatibility: >
  Optional: the Archify Agent Skill (installed through Rig) to author or regenerate a diagram, and
  Playwright with Chromium to export its SVG. AUDIT needs neither.
argument-hint: 'audit [dir] | conform [dir] | help | educate [dir] | refresh'
---

# Knowledge Islands Diagrams standard

You are applying the **Knowledge Islands Diagrams standard** - one consistent way to keep diagrams that explain a system: traced from the code, committed as a source and a self-contained SVG, listed in one manifest, and refreshed when what they draw changes. Read [the Diagrams standard](references/standards-diagrams.md) before authoring, auditing or refreshing a set; [the rubric](references/rubric.md) publishes its checkable criteria, [exemplars](references/exemplars.md) point at a conforming set, and [sources](references/sources.md) records the tooling evidence.

## What this skill owns

1. **The diagram standard** - Archify as the tool, the committed forms under `docs/diagrams/`, the `diagrams.toml` manifest and its reader-facing `README.md`, naming, and the privacy rules.
2. **The choice of diagram type** - which of Archify's five types answers a given question.
3. **Regeneration and freshness** - how a diagram is rebuilt from its source and re-exported, and when it is stale.
4. **The SVG exporter** - [`scripts/export-svg.ts`](scripts/export-svg.ts) drives the Archify viewer's own Export > SVG action in headless Chromium and refuses a non-canonical or non-self-contained export.
5. **The mechanical checker** - `ki repo audit --skill ki-diagrams` checks that the manifest and files agree, that no committed file carries a local path or address, that each SVG is self-contained, and, from read-only Git history, whether a traced path changed since a diagram was last checked. It runs on committed files alone, without Archify or Playwright.

Archify itself, its schemas and its viewer stay upstream. Prose style stays with `ki-authoring`, and where a guide may embed a diagram stays with `ki-guides`.

## Operating modes

Carries the universal **AUDIT · CONFORM · EDUCATE · REFRESH**. Invoked as `help` / `-h` / `?`, it explains itself and stops - the generated HELP block (name, purpose, invocation, modes, off-ramps), taking no action. With no mode it does the same, then, in an interactive session only, offers the mode choice via `AskUserQuestion`, prompting for any `argument-hint` target the chosen mode shows.

### Mode EDUCATE

→ Read [references/mode-educate.md](references/mode-educate.md)

### Mode AUDIT

→ Read [references/mode-audit.md](references/mode-audit.md)

### Mode CONFORM

→ Read [references/mode-conform.md](references/mode-conform.md)

### Mode REFRESH

→ Read [references/mode-refresh.md](references/mode-refresh.md)

## Notes

- **No diagram set is mandatory** - a repository adopts the skill by declaring `[skills.ki-diagrams]` and keeps the diagrams that answer its readers' questions. EDUCATE recommends a starter set per repository shape.
- **Without Archify** - AUDIT still runs. EDUCATE, REFRESH and the exporter stop with the install instruction: add `[skill.archify]` (source `tt-a1i/archify`) to the Rig skills configuration and apply it.
- `ki` host owns findings, dry-run publication, reporting, and post-conform verification; judgment aspects are counted as unevaluated rather than emitted as synthetic mechanical findings.
