---
id: ADR-KI-HARNESS-SKILLS-009
title: 'Two repository-structure skills for standalone tools and their Homebrew tap'
date: 2026-09-20
status: current
decision_type_url: https://knowledgeislands.info/specifications/decision-records/adr
decision_type: architecture
---

# ADR-KI-HARNESS-SKILLS-009: Two repository-structure skills for standalone tools and their Homebrew tap

## Context

A standalone command-line tool and its companion Homebrew tap are distinct repository shapes. The tool repository owns a portable executable, installation, testing, release documentation, and public CLI surfaces. The tap repository owns Homebrew formulae and their package-manager validation. Neither shape implies a particular implementation language or the TypeScript/Bun engineering overlay.

Tool repositories also need discoverable local procedures for deciding when work is complete and for publishing releases. Those procedures vary with the tool and its delivery risks, so shared governance can require stable locations without prescribing universal content.

## Decision

Maintain two composable repository-structure skills:

- `ki-repo-tools` governs a repository containing one standalone CLI. It covers the executable container, installer, tests, CI, changelog, version and release markers, help, completion, optional manual, distribution boundaries, and capability-conditional checks.
- `ki-repo-homebrew-tap` governs the companion tap and its `Formula/*.rb` package definitions.
- Both compose with `ki-repo`. A tool repository composes with `ki-engineering` only when its detected implementation capabilities require that overlay.
- `ki-repo-tools` requires physical regular files at `docs/guides/developer/definition-of-done.md` and `docs/guides/developer/releasing.md`. It checks only their presence and safe file type. Each repository owns their substantive procedures; `ki-guides` governs their ordinary guide form.
- The repository coverage cascade detects undeclared tool and tap shapes so that applicable governance remains explicit.

## Consequences

Tool and tap concerns remain independently auditable and can evolve without importing an unrelated language toolchain. Every governed tool repository exposes stable entry points for completion and release procedures, while retaining authority over the checks, sequencing, recovery guidance, and publication details those files contain.

Automated conformance may repair bounded structural properties, but it does not invent repository-specific guide contents, execute releases, or mutate the companion repository. Release work follows the tool repository's local guides together with the shared release-readiness contract and hands formula updates to `ki-repo-homebrew-tap`.

## References

- [ADR-KI-HARNESS-004](ADR-KI-HARNESS-004-composition-over-extension.md) — composes distinct concerns instead of extending a monolithic repository type.
- [ADR-KI-HARNESS-SKILLS-006](ADR-KI-HARNESS-SKILLS-006-concern-first-skill-taxonomy-and-implication-graph.md) — defines the concern-first skill taxonomy and repository-structure overlays.
