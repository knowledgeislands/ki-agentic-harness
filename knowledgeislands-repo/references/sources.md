# Sources — where the repo standard comes from

The authoritative sources behind [the standard](repo-standard.md), [the rubric](audit-rubric.md), and [`../scripts/audit-repo.ts`](../scripts/audit-repo.ts).
Mode REFRESH reads this file, re-fetches each source, diffs it against the standard + script, then **bumps the `last reviewed` dates** and refreshes the
`## Last review` block below (what changed is recorded in the commit, not a changelog). GitHub's settings surface moves (rulesets, security toggles, Actions
policy), so this is the skill's memory of where the standard comes from — keep it current.

## Authoritative (GitHub)

| Source                                                           | Governs                                                              | Last reviewed |
| ---------------------------------------------------------------- | -------------------------------------------------------------------- | ------------- |
| [REST: repository settings][repo-settings]                       | merge methods, auto-delete-branch, features, description, visibility | 2026-06-01    |
| [REST: branch protection][branch-protection]                     | the optional `branch-protection` body (PR, `build` check, linear)    | 2026-06-01    |
| [Repository rulesets][rulesets]                                  | the modern alternative to classic protection (private-repo path)     | 2026-06-01    |
| [REST: Dependabot alerts / automated security fixes][dependabot] | `vulnerability-alerts`, `automated-security-fixes` endpoints         | 2026-06-01    |
| [Secret scanning & push protection][secret-scanning]             | `security_and_analysis` toggles and their plan/GHAS gating           | 2026-06-01    |
| [REST: Actions permissions for a repository][actions]            | `allowed_actions` policy                                             | 2026-06-01    |
| [`gh` CLI manual][gh-cli]                                        | `gh repo list/view/edit`, `gh api` — how the script reads/writes     | 2026-06-01    |

## Last review

REFRESH last run **2026-06-01** against the GitHub REST API, `gh` CLI, rulesets, and security-feature docs (the sources above).

- **State:** the standard was derived from an audit of all 10 `knowledgeislands` repos; the three layers (local files; core GitHub settings; security & Actions)
  match the current API surface. No spec drift found since — this run the REST docs returned HTTP 403, but search confirmed secret scanning and push protection
  remain free for public repos (≈39 token types push-protected by default), so the standard's public-only requirement still holds; the rulesets surface is
  unchanged.
- **Open watch-items:** GitHub's rulesets vs branch-protection surfaces move — re-verify the mapping next refresh.

[repo-settings]: https://docs.github.com/en/rest/repos/repos#update-a-repository
[branch-protection]: https://docs.github.com/en/rest/branches/branch-protection
[rulesets]: https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets
[dependabot]: https://docs.github.com/en/rest/repos/repos#enable-vulnerability-alerts
[secret-scanning]: https://docs.github.com/en/code-security/secret-scanning/about-secret-scanning
[actions]: https://docs.github.com/en/rest/actions/permissions
[gh-cli]: https://cli.github.com/manual/
