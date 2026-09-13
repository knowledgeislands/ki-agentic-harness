# Specifications

This is the accepted behaviour and quality contract for **ki-agentic-harness** — **what** it promises. Decisions capture why ([`../decisions/`](../decisions)), guides capture how ([`../guides/`](../guides)), and roadmap items capture when ([`../roadmap/`](../roadmap)). The `ki-specs` skill governs and audits this corpus.

## How it fits with other documentation

| Location               | Question | Instrument                                |
| ---------------------- | -------- | ----------------------------------------- |
| `decisions/`           | Why      | Decision Records (`ki-decision-records`)  |
| `specs/`               | What     | Specifications (this corpus)              |
| [`guides/`](../guides) | How      | Guides (`ki-guides`)                      |
| `roadmap/`             | When     | Repository work items (`ki-work-roadmap`) |

## How to read a requirement

Each accepted requirement has a `### <PREFIX>-NNN — <title>` heading, one BCP-14 statement, and lifecycle fields:

- `_Conformance:_ conforming | pending | divergent` states how the implementation relates to the accepted contract now.
- `_Verify:_` names the check capable of deciding conformance.
- `_Evidence:_` names current proof and is required when conforming.

Requirements are organised as user-observable behaviours or quality properties. Numbered requirements stay in the contract when pending or divergent; unnumbered Gaps are candidates not yet accepted.

## ID scheme

`<PREFIX>-<NNN>` uses a registered prefix and a zero-padded three-digit serial. Serials are append-only and sequential within each prefix. Retired requirements keep their number; IDs are never reused or renumbered merely to tidy the corpus.

## Areas

| File          | Prefix | Covers                                                                 |
| ------------- | ------ | ---------------------------------------------------------------------- |
| bootstrap.md  | `BOOT` | User bootstrap, activation scopes, native repository operations        |
| governance.md | `GOV`  | Universal modes, mechanical-first, severity, composition, checker root |
| harness.md    | `HARN` | Five-part bundle, root anchors, toolchain, skills naming               |
| modes.md      | `MODE` | The four universal modes and HELP behavioural contract                 |
| checkers.md   | `CHK`  | Checker contract: ladder, exit, `--json`, tally, footer                |
