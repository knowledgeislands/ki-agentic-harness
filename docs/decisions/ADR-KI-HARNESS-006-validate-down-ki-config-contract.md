# ADR-KI-HARNESS-006: Validate-down .ki-config.toml contract

**Date:** 2026-06-23

## Context

Each governance skill needed to know whether it applied to a given repo, and what repo-specific configuration it should use. Without a shared signal, skills would either apply to all repos (false positives) or require repo-specific skill customisation (coupling). A single config file per repo, with a table per skill, provides an explicit opt-in that each skill can read independently.

## Decision

`.ki-config.toml` is the compliance marker and the per-skill configuration carrier. Its presence signals that the repo is a Knowledge Islands repo and all applicable governance standards apply. Each governance skill reads its own `[ki-<skill>]` table; the repo standard verifies that detected standards (Eleventy config → `[ki-website]`, Streams zone → `[ki-kb-streams]`, etc.) have a declared table. This direction — each skill reads its own table and verifies downward from the standard, rather than the repo pushing configuration up into the skills — is the **validate-down contract**. A detected-but-undeclared standard is a WARN; a missing `.ki-config.toml` is a FAIL. Per-repo overrides live in the skill's own sub-table, not in a forked skill.

## Consequences

- Skills discover their own applicability from a single file without asking the repo for anything else.
- Adding a new governance standard to a repo is one table addition — no code change in any skill.
- Forking a skill for a single repo's variation is prevented: the variation is data in `.ki-config.toml`, not code in a derived skill.
- The repo coverage gate enforces that detected standards are declared.
