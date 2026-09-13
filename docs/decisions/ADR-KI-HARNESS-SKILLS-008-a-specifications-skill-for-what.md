---
id: ADR-KI-HARNESS-SKILLS-008
title: 'A Specifications skill for "what"'
date: 2026-07-09
status: current
decision_type_url: https://knowledgeislands.info/specifications/decision-records/adr
decision_type: architecture
---

# ADR-KI-HARNESS-SKILLS-008: A Specifications skill for "what"

## Context

The skill set needs a governed **what** alongside Decisions' **why** and guides' **how**: an accepted contract for user-observable behaviour and quality properties. Acceptance and implementation are separate facts, so the corpus must show whether each requirement is conforming, pending, or divergent without hiding unfinished accepted behaviour in an unnumbered backlog.

A Specifications corpus also needs stable requirement identity and an explicit applicability boundary. A flat corpus can register multiple prefixes, including independent sequences in one file, while a global or file-based sequence would make identity misleading. The canonical `docs/specs/` root is itself an intentional repository signal: placing content there means the repository adopted the Specifications contract. Material not intended to be governed must live elsewhere or carry an explicit repository coverage opt-out.

## Decision

Introduce **`ki-specs`**, a general-governance skill that codifies Specifications as the **what** within the four-document split: decisions (why), specifications (what), guides (how), and work records (when). It mirrors `ki-decision-records`' shape: a format standard, audit rubric, universal EDUCATE/AUDIT/CONFORM/REFRESH modes plus NEW, and a native mechanical checker.

- **Layout** — `docs/specs/`, flat and one file per comprehensible feature area; `index.md` carries the ID scheme, conformance states, Gaps convention, and one or more areas tables whose `Prefix` and `File` columns register ownership.
- **Requirement** — `### <PREFIX>-NNN — <title>`, one BCP-14 normative statement, `_Conformance:_ conforming | pending | divergent`, a `_Verify:_` plan, and `_Evidence:_` when conforming. IDs are append-only and sequential within the registered prefix; a file may host independent registered prefixes, but full IDs remain unique across the corpus. Deprecated entries keep their number and are struck through.
- **Classification** — requirements are authored as user-observable behaviours or quality properties. The distinction is semantic and reviewable rather than encoded into identity.
- **Gaps** — an unnumbered `## Gaps` backlog contains unaccepted candidates and is exempt from the checker. Accepted pending or divergent requirements remain numbered.
- **Decision link** — a requirement governed by a recorded decision cites its Decision Record; the checker leaves this as a judgment item.
- **Applicability** — content under `docs/specs/` requires the repository to declare `ki-specs`; detected-but-undeclared content fails repository audit. A repository deliberately using that path for unrelated material must record `coverage-specs = false`. A declared repository must provide valid corpus evidence; absent or malformed evidence fails closed rather than being inferred away.

## Consequences

- The harness dogfoods the skill by declaring `[skills.ki-specs]` and shipping its own `docs/specs/` corpus, audited through `ki repo audit --skill ki-specs`.
- The skill sits in the governance concern defined by [ADR-KI-HARNESS-SKILLS-006](ADR-KI-HARNESS-SKILLS-006-concern-first-skill-taxonomy-and-implication-graph.md), is explicitly selected per repository, and has `ki-depends-on: []`.
- Each registered prefix has a clear append-only identity sequence even when prefixes share a file.
- Acceptance can precede implementation without losing the contract or overstating current behaviour.
- Verification plans and current evidence are separate, so a future check is not mistaken for proof.
- RFC 2119 as updated by RFC 8174 (BCP 14) remains the authority for the normative keyword set.

## References

- [ADR-KI-HARNESS-SKILLS-006](ADR-KI-HARNESS-SKILLS-006-concern-first-skill-taxonomy-and-implication-graph.md) — places the skill in the governance concern.
- [ADR-KI-HARNESS-SKILLS-001](ADR-KI-HARNESS-SKILLS-001-audit-conform-educate-refresh-canonical-modes-help.md) — defines the universal modes carried by the skill.
