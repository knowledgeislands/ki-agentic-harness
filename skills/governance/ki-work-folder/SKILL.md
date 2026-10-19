---
name: ki-work-folder
ki-kind: governance
ki-applicability: declaration-only
ki-depends-on: []
ki-shared-dependencies: [ki-skills:rubric]
contributes: ['.ki.toml']
description: >
  Deprecated alias for `ki-work-package`, kept only so a repository still declaring `[skills.ki-work-folder]`
  resolves during the rename's tolerance window. Its audit warns and names the replacement declaration; it owns no
  record, standard or procedure. Use `ki-work-package` for the work package and its work folder `+/_WORK/<id>/`.
argument-hint: 'audit <repo> | help | conform | educate | refresh'
---

# Knowledge Islands work folder (deprecated alias)

Kris renamed this skill `ki-work-package` under PACKAGE-NAME on 19 October 2026: "I want `ki-work-package` please, where it lives is a folder". This thin skill keeps the old declaration resolving for the tolerance window, so that no repository declaring `[skills.ki-work-folder]` fails while its territory catches up. It owns nothing: the work package, its work folder and every rule about them live in [`ki-work-package`](../ki-work-package/SKILL.md) and [its standard](../ki-work-package/references/standards-work-package.md).

A repository replaces `[skills.ki-work-folder]` with `[skills.ki-work-package]` in its `.ki.toml` at its own pace. Until it does, `ki-work-package`'s own checks do not run there, because the host resolves each declared skill by its own name; the alias is removed when no declaration is left. [The generated rubric](references/rubric.md) publishes its one check and [the sources](references/sources.md) record why it exists.

## Operating modes

### Mode AUDIT

Run `ki repo audit --skill ki-work-folder --repo <repo>`. The one check warns that the declaration is a deprecated alias and names `[skills.ki-work-package]` as its replacement.

### Mode CONFORM

Run `ki repo conform --skill ki-work-folder --repo <repo> --dry-run` before applying it. CONFORM republishes the generated rubric only; it never rewrites a repository's declaration, which the repository changes itself.

### Mode EDUCATE

Run `ki repo educate --skill ki-work-folder --repo <repo>` to render the concern and rubric, then point to `ki-work-package` for the work package itself.

### Mode HELP

Explain that the skill is a deprecated alias, name `ki-work-package` and the declaration change, then stop without reading or changing repository state.

### Mode REFRESH

**Precondition:** REFRESH writes only this canonical skill under `ki-agentic-harness`.

When invoked from an installed copy, stop and redirect to the harness.

Read [the sources](references/sources.md) and confirm the alias is still needed; once no repository declares `[skills.ki-work-folder]`, remove the alias rather than refresh it.
