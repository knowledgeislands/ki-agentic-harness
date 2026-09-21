# Sources — where the repo standard comes from

**Refresh:** external-spec · monthly

The authoritative sources behind [the repository standard](standards-repository.md), [the configuration standard](standards-configuration.md), and the generated [rubric](rubric.md). Mode REFRESH reads this file, re-fetches each source, diffs it against the standards and structured catalogue, then **bumps the `last reviewed` dates** and refreshes the `## Last review` block below (what changed is recorded in the commit, not a changelog). GitHub's settings surface moves (rulesets, security toggles, Actions policy), so this is the skill's memory of where the standard comes from — keep it current.

## Authoritative (GitHub)

| Source | Governs | Last reviewed |
| --- | --- | --- |
| [REST: repository settings][repo-settings] | merge methods, auto-delete-branch, features, description, visibility, and repository-administration permission | 2026-09-21 |
| [REST: branch protection][branch-protection] | the optional `branch-protection` body (PR, `build` check, linear) | 2026-09-21 |
| [Repository rulesets][rulesets] | the modern alternative to classic protection (private-repo path) | 2026-09-21 |
| [REST: Dependabot alerts / fixes][dependabot] | `vulnerability-alerts`, `automated-security-fixes` endpoints | 2026-09-21 |
| [Secret scanning detection scope][secret-scanning] | public automatic scanning and private/internal GitHub Secret Protection boundary | 2026-09-21 |
| [REST: Actions permissions for a repository][actions] | `allowed_actions` policy | 2026-09-21 |
| [`gh` CLI manual][gh-cli] | `gh repo list/view/edit`, `gh api` — how evidence is read and confirmed live changes are applied | 2026-09-21 |
| [SPDX License List][spdx] | authoritative license identifiers, including MIT and UNLICENSED | 2026-09-21 |
| [Choose a License][choosealicense] | supporting license-selection guidance | 2026-09-21 |

## Last review

REFRESH last run **2026-09-21** (previous: 2026-08-12). Seven of nine sources re-fetched live; spdx.org and cli.github.com were unreachable via the session network proxy.

- **REST repository settings**: merge controls, branch deletion, feature fields, description, and visibility all confirmed unchanged (API version 2026-03-10). Repository-administration permission requirement unchanged.
- **REST branch protection**: GET endpoint active, no deprecation notice. Classic protection and rulesets confirmed to coexist; watch for a future deprecation or recommendation change (open watch-item carried forward).
- **REST Dependabot / Actions**: `vulnerability-alerts`, `automated-security-fixes`, and `/actions/permissions` with `allowed_actions` policy all confirmed present and unchanged.
- **Secret scanning**: public-repo automatic scanning confirmed in scope; private/internal boundary confirmed requires GitHub Secret Protection.
- **SPDX / Choose a License**: spdx.org unreachable this run — carried forward without re-fetch. The authority assignment remains unchanged. Open watch-item: re-fetch SPDX and gh CLI manual on a session with unrestricted egress.

[repo-settings]: https://docs.github.com/en/rest/repos/repos#update-a-repository
[branch-protection]: https://docs.github.com/en/rest/branches/branch-protection
[rulesets]: https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets
[dependabot]: https://docs.github.com/en/rest/repos/repos#enable-vulnerability-alerts
[secret-scanning]: https://docs.github.com/en/code-security/reference/secret-security/secret-scanning-scope
[actions]: https://docs.github.com/en/rest/actions/permissions
[gh-cli]: https://cli.github.com/manual/
[spdx]: https://spdx.org/licenses/
[choosealicense]: https://choosealicense.com/
