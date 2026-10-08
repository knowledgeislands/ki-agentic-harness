# Exemplars

These illustrate [the Diagrams standard](standards-diagrams.md) but do not add requirements.

## The Observatory set

`apps-observatory` at `0617cc4d43c69cd82737bec68ab82b0df377b182` keeps seven diagrams under `docs/diagrams/`, one or more of each type: `architecture`, `confirmed-operation` (workflow), `beacon-request` (sequence), `evidence-flow` (dataflow), `signal-lifecycle` (lifecycle), `site-map` and `page-components` (both architecture). Each section of its `README.md` states the question, audience, traced files, staleness trigger, regeneration prompt and last checked revision, and embeds the SVG.

It predates the standard in three ways an adopting repository does not copy: its manifest is prose rather than `diagrams.toml`, its interactive builds go to `tmp/diagrams/` rather than `+/diagrams/`, and its exporter is a repository script rather than this skill's `scripts/export-svg.ts`.

## A manifest table

```toml
[beacon-request]
type = "sequence"
question = "What happens, in order, when the operator opens or refreshes the Beacon?"
audience = "Observatory contributors and reviewers"
traced = ["packages/instruments/src/beacon.ts", "apps/site/src/server.ts", "packages/evidence/src/beacon.ts"]
stale_when = "a contributor is added or removed, or a contributor's time limit changes"
regenerate = "Trace one Beacon request from the view's load() through /api/beacon to the rendered rows as an Archify sequence. Cite source lines for every participant and finalize at showcase quality with --repo-root."
last_checked = "18b1c069fc860b926de1d2f848c35034eca2c6cc"
```

## A README section

```markdown
## Beacon request

What happens, in order, when the operator opens or refreshes the Beacon.

![Beacon request](beacon-request.svg)
```
