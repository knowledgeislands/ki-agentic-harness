# Audit Rubric — knowledgeislands-bootstrap

Line-by-line criteria for auditing a Knowledge Islands repo's project-local skill install against
[the bootstrap standard](bootstrap-standard.md). Each is tagged **[M] mechanical** (the bundled [checker](../scripts/link-skills.ts)
`--check` decides it — capture its output, don't re-derive) or **[J] judgment** (assess by reading). Severity uses the unified ladder
defined in `knowledgeislands-engineering`'s
[`enforcement-framework.md`](../../knowledgeislands-engineering/references/enforcement-framework.md) §2.

## BOOT — project-local skill install

- **BOOT-1 [M]** WARN — `.claude/skills/` mirrors the repo's declared coverage (`[knowledgeislands-*]` tables) ∪ the baseline
  (`knowledgeislands-repo` + `knowledgeislands-authoring`), with no missing links, no links outside that set, and no dangling links (harness
  not reachable). The harness itself is checked with `--all` (every skill).
- **BOOT-2 [M]** WARN — `package.json` has a `ki:skills:link:project` script invoking the keystone linker, so the links are reproducible on
  clone.
- **BOOT-3 [M]** WARN — `.claude/skills/` is gitignored (the links are generated, never committed).
- **BOOT-4 [J]** — the repo's _declared_ coverage is itself correct — it opts into the skills it actually uses. This is
  `knowledgeislands-repo`'s coverage cascade (detected-artifact ⟺ declared-table), not this skill's; route a wrong declaration there rather
  than papering over it by hand-linking. The keystone (`knowledgeislands-bootstrap`) must be installed globally for `ki:skills:link:project`
  to resolve — an environment precondition, not a repo property.

## Reporting

Produce findings on the severity ladder, each `severity · criterion · what · fix`. All BOOT criteria are WARN (conformable, never
ship-blocking): a missing/dangling link or absent `ki:skills:link:project`/gitignore is fixed by Mode CONFORM (re-run the linker; add the
script / gitignore line). Close by naming the composition: `knowledgeislands-repo` owns whether the declared coverage is right.
