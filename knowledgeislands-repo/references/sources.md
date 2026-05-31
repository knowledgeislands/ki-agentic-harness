# Sources — where the repo standard comes from

The authoritative sources behind [the standard](repo-standard.md), [the rubric](audit-rubric.md), and [`../scripts/audit-repo.ts`](../scripts/audit-repo.ts).
Mode REFRESH reads this file, re-fetches each source, diffs it against the standard + script, then **bumps the `last reviewed` dates and records what changed**
in the changelog below. GitHub's settings surface moves (rulesets, security toggles, Actions policy), so this is the skill's memory of where the standard comes
from — keep it current.

## Authoritative (GitHub)

| Source                                                           | Governs                                                              | Last reviewed |
| ---------------------------------------------------------------- | -------------------------------------------------------------------- | ------------- |
| [REST: repository settings][repo-settings]                       | merge methods, auto-delete-branch, features, description, visibility | 2026-05-31    |
| [REST: branch protection][branch-protection]                     | the optional `branch-protection` body (PR, `build` check, linear)    | 2026-05-31    |
| [Repository rulesets][rulesets]                                  | the modern alternative to classic protection (private-repo path)     | 2026-05-31    |
| [REST: Dependabot alerts / automated security fixes][dependabot] | `vulnerability-alerts`, `automated-security-fixes` endpoints         | 2026-05-31    |
| [Secret scanning & push protection][secret-scanning]             | `security_and_analysis` toggles and their plan/GHAS gating           | 2026-05-31    |
| [REST: Actions permissions for a repository][actions]            | `allowed_actions` policy                                             | 2026-05-31    |
| [`gh` CLI manual][gh-cli]                                        | `gh repo list/view/edit`, `gh api` — how the script reads/writes     | 2026-05-31    |

## Review changelog

Record each REFRESH run: date, what was re-fetched, what changed in the standard / script (or "no change").

- **2026-05-31** — Standard derived from an audit of all 10 `knowledgeislands` repos and applied. Three layers (local files; core GitHub settings; deeper
  security & Actions); visibility declared per repo in `.ki-config.toml`; `main` open by default, with branch protection and the other overridable checks set
  per repo under `[knowledgeislands-repo.checks]` (`true` = enforce, `false` = don't; omitted = the org default in the script's `CHECK_DEFAULTS`). Source list
  created alongside the auditor.

[repo-settings]: https://docs.github.com/en/rest/repos/repos#update-a-repository
[branch-protection]: https://docs.github.com/en/rest/branches/branch-protection
[rulesets]: https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets
[dependabot]: https://docs.github.com/en/rest/repos/repos#enable-vulnerability-alerts
[secret-scanning]: https://docs.github.com/en/code-security/secret-scanning/about-secret-scanning
[actions]: https://docs.github.com/en/rest/actions/permissions
[gh-cli]: https://cli.github.com/manual/
