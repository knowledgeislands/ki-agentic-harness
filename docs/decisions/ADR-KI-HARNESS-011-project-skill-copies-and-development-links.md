# ADR-KI-HARNESS-011: Project skill copies and development links

**Date:** 2026-07-16

## Context

Bootstrap has one durable self-governance surface: `.ki-meta/`. It holds the organised mechanical units copied from declared skills, their generated help, and the runners that let a repository audit and conform itself. It is not a runtime skill installation and must not become one.

Claude Code and Codex separately discover complete skills from project-local runtime directories: `.claude/skills/` and `.agents/skills/`. Those directories currently contain symlinks into a locally available harness checkout. Live links help a harness author, but make ordinary use depend on that checkout remaining available and make a development topology the default installation.

## Decision

The runtime skill directories and `.ki-meta/` remain separate surfaces with separate purposes.

- `.ki-meta/` remains the durable, organised mechanical-script surface. It contains no complete runtime skill copies and holds no runtime skill installation or development-link state.
- Bootstrap's normal project-local skill installation copies each declared complete skill directly into the selected runtime discovery directory. A copied runtime skill is a regular-file payload, not a symlink to a harness checkout.
- An explicit local development-link capability may replace copied runtime skills with symlinks to the authoring directories in a local harness checkout. It is opt-in and never the result of ordinary bootstrap or repository use.
- The same model applies to the harness and every other governed repository. It applies only to project-local skills; global skill publication, agents, hooks, and user settings remain independent concerns.

## Consequences

- A normal project session reads a complete local skill copy and does not depend on a harness checkout after installation.
- A harness author retains a deliberate live-edit workflow without making it the fleet default.
- The current project skill linker, its audit rules, documentation, and tests need a scoped migration. The implementation must establish its own publication, refresh, and integrity contract without reusing `.ki-meta/` for runtime skill state.
- Repository-specific variation remains declarative configuration and orientation guidance. A copied skill is a deployment payload, not an editable fork of the harness source.

## References

- [ADR-KI-HARNESS-006](ADR-KI-HARNESS-006-bootstrapping-and-self-sufficiency.md) — bootstrap's mechanical self-sufficiency boundary.
- [ADR-KI-HARNESS-008](ADR-KI-HARNESS-008-vendored-cross-skill-scripts.md) — the generated `.ki-meta` cross-skill tooling boundary.
- [ADR-KI-HARNESS-SKILLS-004](ADR-KI-HARNESS-SKILLS-004-skills-valid-standalone.md) — standalone skill validity and composition.
