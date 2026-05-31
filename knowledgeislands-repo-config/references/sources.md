# Sources — where the repo-config standard comes from

The authoritative sources behind [the standard](repo-config-standard.md), [the rubric](audit-rubric.md), and
[`../scripts/audit-repo-config.ts`](../scripts/audit-repo-config.ts). Mode REFRESH reads this file, re-fetches each source, diffs it against the standard +
script, then **bumps the `last reviewed` dates and records what changed** in the changelog below. GitHub's settings surface moves (rulesets, security toggles,
Actions policy), so this is the skill's memory of where the standard comes from — keep it current.

## Authoritative (GitHub)

| Source                                                                                                                              | Governs                                                              | Last reviewed |
| ----------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- | ------------- |
| [REST: repository settings](https://docs.github.com/en/rest/repos/repos#update-a-repository)                                        | merge methods, auto-delete-branch, features, description, visibility | 2026-05-31    |
| [REST: branch protection](https://docs.github.com/en/rest/branches/branch-protection)                                               | the optional `branch-protection` body (PR, `build` check, linear)    | 2026-05-31    |
| [Repository rulesets](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets) | the modern alternative to classic protection (private-repo path)     | 2026-05-31    |
| [REST: Dependabot alerts / automated security fixes](https://docs.github.com/en/rest/repos/repos#enable-vulnerability-alerts)       | `vulnerability-alerts`, `automated-security-fixes` endpoints         | 2026-05-31    |
| [Secret scanning & push protection](https://docs.github.com/en/code-security/secret-scanning/about-secret-scanning)                 | `security_and_analysis` toggles and their plan/GHAS gating           | 2026-05-31    |
| [REST: Actions permissions for a repository](https://docs.github.com/en/rest/actions/permissions)                                   | `allowed_actions` policy                                             | 2026-05-31    |
| [`gh` CLI manual](https://cli.github.com/manual/)                                                                                   | `gh repo list/view/edit`, `gh api` — how the script reads/writes     | 2026-05-31    |

## Review changelog

Record each REFRESH run: date, what was re-fetched, what changed in the standard / script (or "no change").

- **2026-05-31** — Standard derived from an audit of all 10 `knowledgeislands` repos and applied. Established the three layers (local files; core GitHub
  settings; deeper security & Actions), the visibility-by-prefix rule, and the private-repo exceptions (plan-limited branch protection + secret scanning,
  rulesets/GHAS as the upgrade path). Source list created alongside the auditor script.
- **2026-05-31** — Made `main` **open by default** and reframed `branch-protection` as an **optional, opt-in check**. Introduced the `.ki-config.toml`
  `enforce = [...]` list (optional default-off checks a repo opts _in_ to — the mirror of `exceptions`, which opts _out_ of baseline checks);
  `branch-protection` is its first member. The auditor checks protection only for a repo that lists it in `enforce`, and WARNs on an `enforce` id it doesn't
  recognise. Standard gained an "Optional checks" section; APPLY defaults to stripping protection (open `main`) and applies the protection PUT only to opted-in
  repos.
