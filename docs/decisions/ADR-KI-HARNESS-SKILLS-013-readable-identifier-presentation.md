# ADR-KI-HARNESS-SKILLS-013: Readable identifier presentation

**Date:** 2026-07-18

## Context

Governance codes are durable references for checkers, documentation, and tooling, but a bare code such as `GOV-002` does not tell a reader what has happened. Human-readable titles already exist in rubrics and definitions, while the canonical checker reporter keeps machine fields separate from terminal formatting.

The harness also has several distinct naming surfaces. Functional areas describe collections of responsibility, commands express an action, and implementation modules describe a role. Treating those surfaces as one identifier scheme would either obscure their purpose or force unstable names into durable fields.

## Decision

The harness keeps stable codes as opaque machine and citation identifiers. It does not rename existing codes merely to make them descriptive.

Human-facing checker output presents the resolved readable title first, followed by the stable code in parentheses: `title (CODE)`. JSONL retains its separate `code` field and does not require consumers to parse terminal presentation.

Naming follows the role of the surface: plural responsibility nouns for functional-area directories, action verbs for command entrypoints, and role nouns for implementation modules. A new durable code needs a distinct semantic family only when its stable identifier itself is consumed outside the owning definition; otherwise its title and navigation provide the human meaning.

## Consequences

Terminal output is immediately legible without sacrificing stable references or machine processing.

The bootstrap aggregate remains the one formatter, so every governed checker receives the same presentation after vendoring.

Existing code families remain valid. A future request to replace opaque identifiers with semantic ones requires an explicit migration decision covering citations, tests, and generated output rather than a cosmetic rename.

## References

- [ADR-KI-HARNESS-SKILLS-010](ADR-KI-HARNESS-SKILLS-010-comparable-cited-checker-findings.md) — comparable cited checker findings and the aggregate rendering boundary.
- [ADR-KI-HARNESS-SKILLS-012](ADR-KI-HARNESS-SKILLS-012-local-copies-for-checker-support.md) — local checker modules and their portable ownership boundary.
