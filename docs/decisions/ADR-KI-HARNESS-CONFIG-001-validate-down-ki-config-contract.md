# ADR-KI-HARNESS-CONFIG-001: Validate-down .ki-config.toml contract

**Date:** 2024-01-01

## Context

Each governance skill needed to know whether it applied to a given repo, and what repo-specific configuration it should use. Without a shared signal, skills would either apply to all repos (false positives) or require repo-specific skill customisation (coupling). A single config file per repo, with a table per skill, provides an explicit opt-in that each skill can read independently.

## Decision

`.ki-config.toml` is the compliance marker and the per-skill configuration carrier. Its presence signals that the repo is a Knowledge Islands repo and all applicable governance standards apply. Each governance skill reads its own `[ki-<skill>]` table; the `ki-repo` skill verifies that detected standards (Eleventy config → `[ki-website]`, Streams zone → `[ki-kb-streams]`, etc.) have a declared table. A detected-but-undeclared standard is a WARN; a missing `.ki-config.toml` is a FAIL. Per-repo overrides live in the skill's own sub-table, not in a forked skill.

## Consequences

- Skills discover their own applicability from a single file without asking the repo for anything else.
- Adding a new governance standard to a repo is one table addition — no code change in any skill.
- Forking a skill for a single repo's variation is prevented: the variation is data in `.ki-config.toml`, not code in a derived skill.
- The coverage gate in `ki-repo` AUDIT enforces that detected standards are declared.

## References

This record is self-contained. Its sources are the `ki-repo` skill's `ki-config-standard` reference, which holds the full `.ki-config.toml` contract, and the `ki-repo` SKILL.md, which describes the coverage-gate model.
