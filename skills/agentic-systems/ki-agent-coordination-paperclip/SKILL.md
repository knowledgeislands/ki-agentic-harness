---
name: ki-agent-coordination-paperclip
ki-kind: governance
ki-applicability: declaration-only
ki-depends-on: []
ki-shared-dependencies: [ki-skills:rubric]
contributes: ['.ki.toml']
description: >
  Retired Paperclip delegation skill, kept only so a repository still declaring `[skills.ki-agent-coordination-paperclip]` resolves while it
  removes the declaration. Its audit warns and asks for the declaration's removal; it owns no standard or procedure and
  nothing replaces it. Use `ki-delegation` for background-run delegation.
argument-hint: 'audit <repo> | help | conform | educate | refresh'
---

# KI agent coordination — Paperclip (retired)

Kris retired Paperclip delegation on 7 November 2026: "anything to do with paperclip. We know that we don't need to be doing anything with that now." It was the deprecated alias of `ki-delegation-paperclip`, which is retired with it. Every Paperclip standard, procedure and check has gone. This stub owns nothing: it exists only because the host refuses a repository whose `.ki.toml` declares a skill no harness provides, and [the migration file](../ki-delegation-paperclip/references/standards-retirement-migration.md) says how a repository leaves it and when the stub goes. [The generated rubric](references/rubric.md) publishes its one check and [the sources](references/sources.md) record why it exists.

## Operating modes

### Mode AUDIT

Run `ki repo audit --skill ki-agent-coordination-paperclip --repo <repo>`. The one check warns that the skill is retired and asks for `[skills.ki-agent-coordination-paperclip]` to be removed from `.ki.toml`.

### Mode CONFORM

Run `ki repo conform --skill ki-agent-coordination-paperclip --repo <repo> --dry-run` before applying it. CONFORM republishes the generated rubric only; it never rewrites the repository's declaration, which the repository removes itself.

### Mode EDUCATE

Run `ki repo educate --skill ki-agent-coordination-paperclip --repo <repo>` to render the concern and rubric, then point to [the migration file](../ki-delegation-paperclip/references/standards-retirement-migration.md).

### Mode HELP

Explain that the skill is retired, that the repository removes its declaration, and stop without reading or changing repository state.

### Mode REFRESH

**Precondition:** REFRESH writes only the canonical skill under `ki-agentic-harness`. When invoked from an installed copy, stop and redirect to the harness.

Read [the migration file](../ki-delegation-paperclip/references/standards-retirement-migration.md); once no repository declares `[skills.ki-agent-coordination-paperclip]`, delete this stub rather than refresh it.
