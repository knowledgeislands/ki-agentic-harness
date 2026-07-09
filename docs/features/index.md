# Feature Definitions

The behaviour-level contract for what the **ki-agentic-harness** does — the **what**. Decisions capture the why ([`../decisions/`](../decisions/)); guides capture the how ([`../`](../)); these Feature Definitions capture the observable behaviour the harness exhibits today, stated normatively and each paired with a verification hook. This corpus is governed by the `ki-feature-definitions` skill and checked by its `audit-features.ts`.

> **Status:** as-built baseline, behaviour-level.

## How this fits with other docs

| Doc          | Question | Instrument                               |
| ------------ | -------- | ---------------------------------------- |
| `decisions/` | Why      | Decision Records (`ki-decision-records`) |
| `features/`  | What     | Feature Definitions (this corpus)        |
| guides       | How      | Prose guides                             |

## How to read a requirement

Each requirement is a level-3 heading `### <PREFIX>-NNN — <title>`, one RFC-2119 statement, and a `_Verify:_` hook. For example:

    ### BOOT-001 — Self-governing after INIT

    After the INIT chain runs, a target repo MUST pass `bun run ki:audit` with zero skills installed.

    _Verify:_ bootstrap a bare fixture and run `ki:audit`; it executes the vendored checkers.

RFC-2119 keywords (`MUST` / `MUST NOT` / `SHOULD` / `SHOULD NOT` / `MAY`) are normative and uppercase. `_Verify:_` names the concrete check. A requirement governed by a recorded decision cites its DR.

## ID scheme

`<PREFIX>-<NNN>` — a per-file prefix plus a zero-padded three-digit serial, sequential within the file. IDs are **append-only and never reused**: a retired requirement keeps its number, struck through with a `(deprecated)` note. Never renumber to tidy up.

## Gaps

Each area file may end with a `## Gaps` section of **unnumbered** bullets — known divergences or desirable-but-unbuilt behaviours, deliberately outside the as-built contract. Promote a gap to a numbered requirement only once it is built and true.

## Areas

| File          | Prefix | Covers                                                   |
| ------------- | ------ | -------------------------------------------------------- |
| bootstrap.md  | `BOOT` | The INIT chain, self-sufficiency contract, vendoring     |
| governance.md | `GOV`  | Universal modes, mechanical-first, severity, composition |
