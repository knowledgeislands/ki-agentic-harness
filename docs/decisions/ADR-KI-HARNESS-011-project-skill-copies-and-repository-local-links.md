# ADR-KI-HARNESS-011: Project skill copies and repository-local links

**Date:** 2026-07-16

## Context

The harness has three distinct payload surfaces: global core skills installed for a user, copied runtime skills in a governed repository, and the mechanical self-governance units in `.ki-meta/`.

Earlier development links conflated those surfaces and made a harness checkout appear to be an ordinary runtime dependency.

## Decision

The three payload surfaces remain separate and have explicit owners.

- User installation publishes regular-file copies of the global core skills into selected runtime discovery directories.
- A harness author may explicitly replace those managed global copies with local-checkout symlinks through `ki:skills:link:global`; `ki-harness` owns that fixed development workflow. It is separate from, and unavailable through, the disposable remote installer.
- Repository bootstrap publishes regular-file copies of a repository's declared skills into its selected project-local runtime discovery directories, and writes no global payload.
- A repository-local `ki-self` is authored once at `.ki-self/` and committed with that repository; bootstrap projects relative directory links into each declared runtime instead of treating it as a generated skill copy.
- `.ki-meta/` contains only vendored mechanical units, rendered HELP, and runners. It never contains complete runtime skills or runtime-link state.
- `ki-harness` owns an opt-in source-harness-only project-link operation. It accepts no target and replaces only marker-proven runtime skill copies in its own checkout; it never links agents or `.ki-meta/`.
- The project linker reuses the bootstrap publisher's transactional, marker, containment, conflict, dry-run, and idempotence checks rather than duplicating them in another skill.

## Consequences

- Ordinary sessions depend on copied payloads, not a harness checkout.
- A consumer repository cannot acquire a checkout-dependent project link by accident or through the public bootstrap path.
- `ki-harness` owns both its fixed global developer set and source-harness project-link operation.
- Global and source-harness project links remain narrow developer workflows, separate from `ki-bootstrap`'s copy-based user payload mechanism.
- A valid legacy `ki-self` runtime copy may migrate only when every discovered copy is byte-identical; divergent or unsafe local content is preserved for manual reconciliation.

## References

- [ADR-KI-HARNESS-006](ADR-KI-HARNESS-006-bootstrapping-and-self-sufficiency.md) — the user-install, repository-bootstrap, and self-sufficiency contracts.
- [ADR-KI-HARNESS-008](ADR-KI-HARNESS-008-vendored-cross-skill-scripts.md) — harness-gated whole-tree tooling.
- [ADR-KI-HARNESS-SKILLS-004](ADR-KI-HARNESS-SKILLS-004-skills-valid-standalone.md) — standalone skill validity and composition.
