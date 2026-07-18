# ADR-KI-HARNESS-011: Project skill copies and repository-local links

**Date:** 2026-07-16

## Context

The harness has three distinct payload surfaces: global core skills installed for a user, copied runtime skills in a governed repository, and the mechanical self-governance units in `.ki-meta/`.

Earlier development links conflated those surfaces and made a harness checkout appear to be an ordinary runtime dependency. A future `ki-self` surface also needs an explicit way to link a repository-local command without making that mechanism harness-specific.

## Decision

The three payload surfaces remain separate and have explicit owners.

- User installation publishes regular-file copies of the global core skills into selected runtime discovery directories.
- A harness author may explicitly replace those managed global copies with local-checkout symlinks through `ki:skills:link:global`; `ki-harness` owns that fixed development workflow. It is separate from, and unavailable through, the disposable remote installer.
- Repository bootstrap publishes regular-file copies of a repository's declared skills into its selected project-local runtime discovery directories, and writes no global payload.
- `.ki-meta/` contains only vendored mechanical units, rendered HELP, and runners. It never contains complete runtime skills or runtime-link state.
- `ki-repo` owns an opt-in repository-local command-link capability. It can link a future `ki-self` surface or a harness author's local development payload, but it is never invoked by ordinary user installation or repository bootstrap.
- A linking implementation owns or vendors every helper it needs below its own script surface. It does not import a relative path from another skill's scripts directory.

## Consequences

- Ordinary sessions depend on copied payloads, not a harness checkout.
- A repository can expose deliberate local commands without turning its development topology into a fleet default.
- `ki-harness` owns its fixed global developer set; `ki-repo` continues to own the reusable repository-local command-link capability.
- The former project-local `link-skills.ts` and `link-agents.ts` responsibilities now belong to the `ki-repo` capability. Global development-link behaviour remains a narrow harness developer workflow, separate from `ki-bootstrap`'s copy-based user payload mechanism.

## References

- [ADR-KI-HARNESS-006](ADR-KI-HARNESS-006-bootstrapping-and-self-sufficiency.md) — the user-install, repository-bootstrap, and self-sufficiency contracts.
- [ADR-KI-HARNESS-008](ADR-KI-HARNESS-008-vendored-cross-skill-scripts.md) — harness-gated whole-tree tooling.
- [ADR-KI-HARNESS-SKILLS-004](ADR-KI-HARNESS-SKILLS-004-skills-valid-standalone.md) — standalone skill validity and composition.
