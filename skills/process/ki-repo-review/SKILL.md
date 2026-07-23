---
name: ki-repo-review
ki-depends-on: []
description: >
  Guides a human-led review of a repository's architecture and implementation: frame the scope, gather inspectable evidence, interview material uncertainties, record findings, and route each outcome to a plan, Decision Record, guide, feature definition, or no action. It can maintain optional review records and findings while delivery depends on them, then prune them deliberately. A process skill (kind: process, ADR-KI-HARNESS-SKILLS-006): it does not produce an automatic architecture verdict or replace `ki-repo-roadmap`, `ki-plan`, or `ki-decision-records`. Triggers: "review this repository", "architecture review", "implementation review", "review findings", "/ki-repo-review". Not a mechanical repository audit or a delivery-plan lifecycle.
argument-hint: 'review [scope] | close <REV-NNN> | help'
---

# ki-repo-review

**Kind:** process. Guides an inspectable, human-led repository review. The full review and review-record procedure is in [references/review.md](references/review.md).

## What this skill does

`ki-repo-review` turns an open-ended review request into a bounded conversation with durable, routed outcomes.

1. **Frame** the purpose, scope, constraints, and decision horizon with the user.
2. **Inventory evidence** across the repository’s structure, implementation, documentation, tests, operations, and declared governance.
3. **Inspect** architecture and implementation through explicit lenses, separating observed fact from inference.
4. **Interview** the user about every material uncertainty rather than silently assuming an intent or risk posture.
5. **Route findings** to the right home: delivery plan, Decision Record, guide, feature definition, or no action.
6. **Retain or prune review evidence** only while a concrete dependent artifact needs it.

The process creates neither a universal score nor an authoritative verdict. It stops whenever human intent, product policy, or an ownership choice is unresolved.

## Relationship map

```text
ki-repo-review (evidence, interview, findings)
  ├─> ki-repo-roadmap / ki-plan (delivery work)
  ├─> ki-decision-records (durable why)
  ├─> ki-feature-definitions (durable what)
  └─> repository guides (durable how)
```

`ki-repo-review` owns optional review working evidence and finding identifiers. The destination skills own their own artifacts and lifecycles.

## Invocation

`help` / `-h` / `?` explains the process and stops. `review [scope]` starts a review only after agreeing its frame. `close <REV-NNN>` assesses whether a completed optional record can be pruned; it never removes evidence without the user’s explicit confirmation.

## Notes

- No universal AUDIT/CONFORM/EDUCATE/REFRESH modes — this is a process skill, not a repository checker or architecture standard.
- A mechanical audit may be evidence, but it is never the review itself. Do not add an audit’s findings to the review without checking their architectural significance.
- Installed globally alongside the other process skills and never declared in `.ki-config.toml`.
