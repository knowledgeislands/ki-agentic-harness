# Audit Rubric — ki-bootstrap

Line-by-line criteria for auditing a Knowledge Islands repo's project-local skill and agent install against [the bootstrap standard](bootstrap-standard.md). Each is tagged **[M] mechanical** (the bundled checker — [`link-skills.ts`](../scripts/link-skills.ts) or [`link-agents.ts`](../scripts/link-agents.ts) `--check` decides it — capture its output, don't re-derive) or **[J] judgment** (assess by reading). Severity uses the unified ladder defined in `ki-engineering`'s [`enforcement-framework.md`](../../ki-engineering/references/enforcement-framework.md) §2.

## BOOT — project-local skill install

- **BOOT-1 [M]** WARN / FAIL — `.claude/skills/` mirrors the repo's declared coverage (`[ki-*]` tables) ∪ the baseline (`ki-repo` + `ki-authoring`), with no missing links, no links outside that set, and no dangling links (harness not reachable). The harness itself is checked with `--all` (every skill). Missing / extra / dangling links are WARN (a CONFORM re-run fixes them). One case is **FAIL**: a declared `[ki-*]` table that resolves to no skill in the harness — almost always a table left behind by an upstream rename or removal (e.g. `ki-websites-11ty` → `ki-website`). It is not auto-renamed (the mapping isn't mechanical), so the `.ki-config.toml` table must be reconciled by hand.
- **BOOT-3 [M]** WARN — `.claude/skills/` is gitignored (the links are generated, never committed). CONFORM writes this line automatically when it links — the write path appends the checker-recognised `.claude/skills/` form (never a leading-slash variant that would leave the check unsatisfied), creating `.gitignore` if absent.
- **BOOT-4 [J]** — the repo's _declared_ coverage is itself correct — it opts into the skills it actually uses. This is `ki-repo`'s coverage cascade (detected-artifact ⟺ declared-table), not this skill's; route a wrong declaration there rather than papering over it by hand-linking. The keystone (`ki-bootstrap`) must be installed globally for the keystone linker to resolve — an environment precondition, not a repo property.

## BOOT — project-local governance agent install

- **BOOT-6 [M]** WARN — `.claude/agents/` mirrors `agents/governance/*.md` when the repo's `.ki-config.toml` carries the bare `[ki-agents]` table, and is empty when it doesn't — no missing links, no links outside that set, no dangling links. Unlike skills there is no baseline: absent the table, the expected set is empty.
- **BOOT-8 [M]** WARN — `.claude/agents/` is gitignored (the links are generated, never committed). As with BOOT-3, CONFORM writes this line automatically when it links agents (only when the `[ki-agents]` set is non-empty).

## BOOT — vendored self-sufficiency install

- **BOOT-9 [M]** WARN — the target's `.ki-meta/skills/` mirrors the harness-side expected set — baseline ∪ declared `[ki-*]` tables ∪ the transitive `implies:` closure, restricted to skills carrying a discoverable checker — with no missing and no extra vendored skill directories. Checked by [`audit-vendored.ts`](../scripts/audit-vendored.ts), run from the harness (the `implies:` graph lives in source SKILL.md frontmatter, not in anything copied into the target, so this cannot be checked by the target's own standalone `.ki-meta/bin/ki-audit`). Drift (a stale re-vendor, a `.ki-config.toml` table added/removed since, an upstream skill add/remove) is always conformable — re-run `bun skills/ki-bootstrap/scripts/bootstrap.ts <target>` to reconcile.

## Reporting

Produce findings on the severity ladder, each `severity · criterion · what · fix`. Almost all BOOT findings are WARN (conformable, never ship-blocking): a missing/dangling link or an absent gitignore entry is fixed by Mode CONFORM (re-run the relevant linker; it recreates the links and appends the gitignore line). Wiring `package.json` convenience keys is out of scope here — that is `ki-engineering`'s concern. The one exception is BOOT-1's orphaned-table case — a declared `[ki-*]` table resolving to no harness skill is a **FAIL**, because CONFORM can't fix it: the rename mapping isn't mechanical, so it needs a human to reconcile `.ki-config.toml`. Close by naming the composition: `ki-repo` owns whether the declared skill coverage is right; whether a repo should opt into `[ki-agents]` at all is likewise a judgment call for the repo owner, not this skill.
