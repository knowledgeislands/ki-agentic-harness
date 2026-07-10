# ADR-KI-HARNESS-SKILLS-008: A Feature Definitions skill for the "what"

**Date:** 2026-07-09

## Context

The skill set governed the **why** (Decision Records, `ki-decision-records`) and the **how** (guides, and the procedural skills), but nothing governed the **what** — the behaviour-level specification of what a system actually does. A real corpus already existed in `vallearmonia-website/docs/spec/`: flat one-file-per-area requirements, an `index.md` defining an ID scheme and an areas table, `### <PREFIX>-NNN — title` headings each carrying an RFC-2119 statement and a `_Verify:_` test hook, append-only IDs, and unnumbered `## Gaps` backlogs. That pattern is general and testable, but it lived in one website repo with no standard, no checker, and no way to hold other repos to it.

## Decision

Introduce **`ki-feature-definitions`**, a general-governance skill that codifies Feature Definitions as the third leg of the `docs/` triad — decisions (why) / **features (what)** / guides (how). It mirrors `ki-decision-records`' shape: a format standard, an audit rubric, the universal INIT/AUDIT/CONFORM/REFRESH modes plus NEW, and a mechanical checker (`audit-features.ts`).

- **Layout** — `docs/features/`, flat one file per area; an `index.md` carries the ID scheme, the Gaps convention, and one or more **areas tables** (columns include `Prefix` and `File`) that register each area's prefix.
- **Requirement** — `### <PREFIX>-NNN — <title>` (multi-segment uppercase prefix, ≥ 3-digit serial, em-dash), one **RFC-2119** normative statement, and a `_Verify:_` hook naming the concrete check. IDs are **append-only, never reused**; deprecated entries keep their number struck through.
- **Gaps** — an unnumbered `## Gaps` backlog sits outside the as-built contract and is exempt from the checker.
- **Decision link** — a requirement governed by a recorded decision cites its DR; the checker leaves this as a judgment item.

## Consequences

- The harness dogfoods the skill: it declares `[ki-feature-definitions]` and ships its own `docs/features/` (areas `BOOT` and `GOV`) describing the bootstrap chain and the governance model, audited green by `ki:feature-definitions:audit`.
- The skill sits in the general-governance cluster ([ADR-KI-HARNESS-SKILLS-006](ADR-KI-HARNESS-SKILLS-006-skill-taxonomy-and-implication-graph.md)) — declared opt-in per repo (like `ki-decision-records`/`ki-plans`), `implies:` nothing, and is not artifact-detected in `ki-repo`'s coverage cascade.
- RFC 2119 (BCP 14) becomes a tracked source: it is the authority for the normative keyword set the checker recognises.
- The corpus it generalizes from (`vallearmonia-website/docs/spec/`) is a tracked reference, not a governed sibling — divergence there is a REFRESH signal, reconciled deliberately.

## References

- [ADR-KI-HARNESS-SKILLS-006](ADR-KI-HARNESS-SKILLS-006-skill-taxonomy-and-implication-graph.md) — the taxonomy that places this skill in the general-governance cluster.
- [ADR-KI-HARNESS-SKILLS-001](ADR-KI-HARNESS-SKILLS-001-canonical-modes.md) — the universal modes this skill carries.
