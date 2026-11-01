---
name: ki-agent-coordination-paperclip
ki-kind: governance
ki-applicability: declaration-only
ki-depends-on: []
ki-shared-dependencies: [ki-skills:rubric]
contributes: ['.ki.toml']
description: >
  Deprecated alias of `ki-delegation-paperclip`, kept only so a repository still declaring
  `[skills.ki-agent-coordination-paperclip]` resolves during the rename's tolerance window. Its audit warns and names the
  replacement declaration; it owns no standard or procedure. Use `ki-delegation-paperclip` for Paperclip delegation.
argument-hint: 'audit <repo> | help | conform | educate | refresh'
---

# KI agent coordination — Paperclip (deprecated alias)

Kris renamed this skill `ki-delegation-paperclip` under ORCH-NAME-DISPATCH on 1 November 2026, choosing the delegation family: `ki-delegation` as the portable contract with an Orca adapter and `ki-delegation-paperclip` as its adapters. This thin skill keeps the old declaration resolving for a tolerance window, so no repository declaring `[skills.ki-agent-coordination-paperclip]` fails while its territory catches up. It owns nothing: every Paperclip rule lives in [`ki-delegation-paperclip`](../ki-delegation-paperclip/SKILL.md) and [its standard](../ki-delegation-paperclip/references/standards-agent-coordination-paperclip.md).

A repository replaces `[skills.ki-agent-coordination-paperclip]` with `[skills.ki-delegation-paperclip]` in its `.ki.toml`, keeping its `organisation_code`, at its own pace. Until it does, `ki-delegation-paperclip`'s own checks do not run there, because the host resolves a declared skill by its own name; the alias is removed when no declaration is left. [The generated rubric](references/rubric.md) publishes its one check and [the sources](references/sources.md) record why it exists.

## Operating modes

### Mode AUDIT

Run `ki repo audit --skill ki-agent-coordination-paperclip --repo <repo>`. The one check warns that the declaration is a deprecated alias and names `[skills.ki-delegation-paperclip]` as its replacement.

### Mode CONFORM

Run `ki repo conform --skill ki-agent-coordination-paperclip --repo <repo> --dry-run` before applying it. CONFORM republishes the generated rubric only; it never rewrites the repository's declaration, which the repository changes itself.

### Mode EDUCATE

Run `ki repo educate --skill ki-agent-coordination-paperclip --repo <repo>` to render the concern and rubric, then point to `ki-delegation-paperclip` itself.

### Mode HELP

Explain that the skill is a deprecated alias, name `ki-delegation-paperclip` and the declaration change, and stop without reading or changing repository state.

### Mode REFRESH

**Precondition:** REFRESH writes only the canonical skill under `ki-agentic-harness`. When invoked from an installed copy, stop and redirect to the harness.

Read [the sources](references/sources.md) and confirm the alias is still needed; once no repository declares `[skills.ki-agent-coordination-paperclip]`, remove the alias rather than refresh it.
