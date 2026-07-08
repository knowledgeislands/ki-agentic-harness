# ADR-KI-HARNESS-003: Adopting Architecture Decision Records

**Date:** 2026-06-23

## Context

The harness grows over time: skills are added, tooling is adopted or declined, structural conventions are established. Without a record of why decisions were made, future contributors (and future agent sessions) must re-derive reasoning from code alone. Oral tradition does not survive context resets.

Architecture Decision Records (ADRs) are a lightweight, file-based mechanism for capturing decisions that are significant enough to affect how work is done here but unlikely to need frequent revision. The format is proven, widely understood, and requires no tooling to read.

The key question was whether to adopt a strict Nygard format, a Y-statements variant, or a house adaptation. The harness's priorities — longevity, minimal tooling, and readability in a plain text editor or agent context — favour a small, stable set of sections rather than a prescriptive template with many optional fields.

## Decision

The harness adopts ADRs as its canonical record for significant decisions. The format used is:

- **Title** — H1 heading, `# ADR-<SCOPE>-NNN: <title>`.
- **Date** (optional) — a bold key-value field immediately under the title.
- **Context** — why the decision was needed; the forces at play.
- **Decision** — what was decided, stated plainly.
- **Consequences** — what changes as a result, including trade-offs.
- **References** — related DRs and external sources.

A Decision Record is a **living present-state record**: it states the decision as it stands now and is edited in place. There is no status lifecycle, no mutability marker, no supersession chain, and no changelog — a decision that changes edits the live record, and the reasoning history lives in git. Superseded/roadmap/forward-looking narration belongs in the ROADMAP (code) or a stream (KB), not in the record.

DR files live in `docs/decisions/` and are indexed in `docs/decisions/README.md`. The naming convention and mechanical rules are governed by the `ki-decision-records` skill.

## Consequences

- Significant decisions accumulate as a searchable, version-controlled record.
- An agent beginning a session can read the `docs/decisions/` index to understand why the harness is shaped the way it is.
- Because records are living and edited in place, the index always reflects the current decision; the reasoning history is recovered from git, not from a status field or a supersession chain.
- Minor decisions (implementation details, naming choices) remain in commit messages; DRs are reserved for choices that would otherwise require excavation to understand.

## References

- [docs/decisions/README.md](README.md) — the index of all DRs in this harness.
- `GDR-KI-ARCADIA-001` (ki-arcadia-principal) — the KI-level decision that established DRs as the instrument; this ADR is its harness realisation (`decision_depends_on: ["GDR-KI-ARCADIA-001"]`)
- [skills/ki-decision-records/SKILL.md](../../skills/ki-decision-records/SKILL.md) — the governance skill that defines and enforces the DR format used here.
- [Michael Nygard, "Documenting Architecture Decisions"](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions) — the original ADR proposal this format descends from.
