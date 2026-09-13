---
id: ADR-KI-HARNESS-SKILLS-008
title: 'A Specifications skill for the "what"'
date: 2026-07-09
status: current
decision_type_url: https://knowledgeislands.info/specifications/decision-records/adr
decision_type: architecture
---

# ADR-KI-HARNESS-SKILLS-008: A Specifications skill for the "what"

## Context

The skill set needs a governed **what** alongside Decisions' **why** and guides' **how**: a behaviour-level specification of what a system does. A Specifications corpus needs stable requirement identity and an explicit applicability boundary. A flat corpus can register multiple prefixes, including independent sequences in one file, so a global file-based sequence would make identity misleading. The canonical `docs/specs/` root is itself an intentional repository signal: placing content there means the repository has adopted the Specifications contract. Material that is not intended to be governed must live elsewhere or carry an explicit repository coverage opt-out.

## Decision

Introduce **`ki-specs`**, a general-governance skill that codifies Specifications as the third leg of the `docs/` triad — decisions (why) / **specifications (what)** / guides (how). It mirrors `ki-decision-records`' shape: a format standard, an audit rubric, the universal EDUCATE/AUDIT/CONFORM/REFRESH modes plus NEW, and a native mechanical checker.

- **Layout** — `docs/specs/`, flat one file per area; an `index.md` carries the ID scheme, the Gaps convention, and one or more **areas tables** (columns include `Prefix` and `File`) that register each area's prefix.
- **Requirement** — `### <PREFIX>-NNN — <title>` (multi-segment uppercase prefix, ≥ 3-digit serial, em-dash), one **RFC-2119** normative statement, and a `_Verify:_` hook naming the concrete check. IDs are append-only and sequential within each prefix registered in an areas table; a file may host independent sequences for its registered prefixes, and full IDs remain unique across the corpus. Deprecated entries keep their number struck through.
- **Gaps** — an unnumbered `## Gaps` backlog sits outside the as-built contract and is exempt from the checker.
- **Decision link** — a requirement governed by a recorded decision cites its DR; the checker leaves this as a judgment item.
- **Applicability** — content under `docs/specs/` requires the repository to declare `ki-specs`; detected-but-undeclared content fails the repository audit. A repository that deliberately uses the path for unrelated material must record `coverage-specs = false`. A declared repository must provide valid corpus evidence; absent or malformed evidence fails closed rather than being inferred or ignored.

## Consequences

- The harness dogfoods the skill: it declares `[skills.ki-specs]` and ships its own `docs/specs/` corpus describing the bootstrap chain and the governance model, audited green by the native `ki repo audit --skill ki-specs` command.
- The skill sits in the governance concern ([ADR-KI-HARNESS-SKILLS-006](ADR-KI-HARNESS-SKILLS-006-concern-first-skill-taxonomy-and-implication-graph.md)) — declared opt-in per repo (like `ki-decision-records`/`ki-change-management-roadmap`), has `ki-depends-on: []`, and is not artifact-detected in `ki-repo`'s coverage cascade.
- Each registered prefix has a clear, append-only identity sequence even when several areas share a file; requirements retain stable full IDs as the corpus grows.
- A repository's declaration, rather than a directory heuristic, determines whether the checker applies. Declared repositories receive a clear failure when the required evidence is missing or malformed; undeclared repositories can keep unrelated material without acquiring an implicit governed corpus.
- RFC 2119 (BCP 14) becomes a tracked source: it is the authority for the normative keyword set the checker recognises.
- The corpus it generalizes from (`vallearmonia-website/docs/specs/`) is a tracked reference, not a governed sibling — divergence there is a REFRESH signal, reconciled deliberately.

## References

- [ADR-KI-HARNESS-SKILLS-006](ADR-KI-HARNESS-SKILLS-006-concern-first-skill-taxonomy-and-implication-graph.md) — the taxonomy that places this skill in the governance concern.
- [ADR-KI-HARNESS-SKILLS-001](ADR-KI-HARNESS-SKILLS-001-audit-conform-educate-refresh-canonical-modes-help.md) — the universal modes this skill carries.
