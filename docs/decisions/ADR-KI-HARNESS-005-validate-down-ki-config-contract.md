# ADR-KI-HARNESS-005: Validate-down .ki-config.toml contract

**Date:** 2026-06-23

## Context

Each governance skill needed to know whether it applied to a given repo, and what repo-specific configuration it should use. Without a shared signal, skills would either apply to all repos (false positives) or require repo-specific skill customisation (coupling). A single config file per repo, with a table per skill, provides an explicit opt-in that each skill can read independently.

## Decision

`.ki-config.toml` is the compliance marker and the per-skill configuration carrier. Its presence signals that the repo is a Knowledge Islands repo and all applicable governance standards apply. Each governance skill reads its own `[ki-<skill>]` table; the repo standard verifies that detected standards (Eleventy config → `[ki-website]`, Streams zone → `[ki-kb-streams]`, etc.) have a declared table. This direction — each skill reads its own table and verifies downward from the standard, rather than the repo pushing configuration up into the skills — is the **validate-down contract**. A detected-but-undeclared standard is a WARN; a missing `.ki-config.toml` is a FAIL. Per-repo overrides live in the skill's own sub-table, not in a forked skill.

The **baseline** every Knowledge Islands repo is governed by is exactly `ki-repo` + `ki-authoring`, and both are **declared explicitly** — `[ki-repo]` and `[ki-authoring]` tables, written by `--educate` and required by the repo standard (a missing `[ki-authoring]` is a FAIL). Authoring is an explicit `[ki-authoring]` declaration rather than a baseline hardcoded in the tooling, so the config shows the full governance set and no standard is invisible. This is a distinction between **governance of the repo's own files** — the baseline, always declared — and standards that govern the surrounding **machine or user surface** rather than the repo (`ki-tokenomics`, `ki-housekeeping`): those stay **opt-in**, declared only when wanted, never baseline. They are still vendored and run by the repo's self-check when declared.

## Consequences

- Skills discover their own applicability from a single file without asking the repo for anything else.
- Adding a new governance standard to a repo is one table addition — no code change in any skill.
- Forking a skill for a single repo's variation is prevented: the variation is data in `.ki-config.toml`, not code in a derived skill.
- The repo coverage gate enforces that detected standards are declared.
- The baseline (`ki-repo` + `ki-authoring`) is declared, not assumed: the config is the complete picture of what governs a repo, with no implicit universal hidden in the tooling.
- Machine/user-surface standards (`ki-tokenomics`, `ki-housekeeping`) are opt-in, keeping the baseline scoped to the repo's own files.
