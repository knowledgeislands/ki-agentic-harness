# Sources — where the repo standard comes from

**Refresh:** external-spec · monthly

The authoritative sources behind [the repository standard](standards-repository.md), [the configuration standard](standards-configuration.md), and the generated [rubric](rubric.md). Mode REFRESH reads this file, re-fetches each source, diffs it against the standards and structured catalogue, then **bumps the `last reviewed` dates** and refreshes the `## Last review` block below (what changed is recorded in the commit, not a changelog). GitHub's settings surface moves (rulesets, security toggles, Actions policy), so this is the skill's memory of where the standard comes from — keep it current.

## Authoritative (GitHub)

| Source | Governs | Last reviewed |
| --- | --- | --- |
| [REST: repository settings][repo-settings] | merge methods, auto-delete-branch, features, description, visibility, and repository-administration permission | 2026-09-14 |
| [REST: branch protection][branch-protection] | the optional `branch-protection` body (PR, `build` check, linear) | 2026-09-14 |
| [Repository rulesets][rulesets] | the modern alternative to classic protection (private-repo path) | 2026-09-14 |
| [REST: Dependabot alerts / fixes][dependabot] | `vulnerability-alerts`, `automated-security-fixes` endpoints | 2026-09-14 |
| [Secret scanning detection scope][secret-scanning] | public automatic scanning and private/internal GitHub Secret Protection boundary | 2026-09-14 |
| [REST: Actions permissions for a repository][actions] | `allowed_actions` policy | 2026-09-14 |
| [`gh` CLI manual][gh-cli] | `gh repo list/view/edit`, `gh api` — how evidence is read and confirmed live changes are applied | 2026-09-14 |
| [SPDX License List][spdx] | authoritative license identifiers, including MIT and UNLICENSED | 2026-08-12 |
| [Choose a License][choosealicense] | supporting license-selection guidance | 2026-09-14 |

## Last review

REFRESH last run **2026-09-14** (previous: 2026-08-12). Eight of nine sources fetched; SPDX (`spdx.org`) was egress-blocked this cycle — its date remains 2026-08-12. No source required a changed GitHub check, criterion, or implementation.

- **REST repository settings**: new field `pull_request_creation_policy` (`all` | `collaborators_only`) documented; not part of the standard's check set and no change needed. The `security_and_analysis` object has expanded sub-fields for GitHub Advanced Security paid tier (AI detection, non-provider patterns, delegated alert dismissal, bypass reviewer configuration); all out of scope for the current public-repo standard.
- **REST branch protection**: the `contexts` array parameter now carries a "Closing down notice" — it is being deprecated in favour of `checks`. The standard already uses `checks`; no change needed. The GET response's `contexts` field may eventually be removed, which could affect the auditor's compatibility evidence path.
- **Repository rulesets**: new public-preview rules added ("Require additional approval for unattributed Copilot PRs", "Require secret scanning alerts resolved before merging", "Restrict code coverage"). No classic-protection deprecation announced. Classic branch protection and rulesets continue to coexist.
- **`gh` CLI**: `gh ruleset check`, `gh ruleset list`, and `gh ruleset view` subcommands are now documented. These provide a dedicated surface for rulesets alongside the existing `gh repo` routes used by the standard.
- **Dependabot / Actions**: `vulnerability-alerts`, `automated-security-fixes`, and `/actions/permissions` retain observed endpoints and `allowed_actions` policy. New repo-level Actions endpoints documented: `artifact-and-log-retention`, `fork-pr-contributor-approval`, `fork-pr-workflows-private-repos`; not part of the standard's check set.
- **Secret scanning**: public repositories retain automatic free scanning; private/internal require GitHub Secret Protection. The public-only check remains correct.
- **SPDX / Choose a License**: SPDX egress-blocked this cycle; status unverified. MIT and UNLICENSED were confirmed current at 2026-08-12 and are unlikely to have changed. Choose a License confirmed accessible and unchanged.
- **Open watch-items:**
  - `contexts` parameter in branch protection is deprecated in favour of `checks`. The auditor reads branch-protection GET responses; confirm that `contexts` in the GET response is still populated during the deprecation period, and switch the evidence path to `checks`-based responses before `contexts` is removed.
  - Classic branch protection and rulesets continue to coexist; no deprecation signal. Monitor GitHub changelog for any sunset announcement.
  - SPDX could not be fetched this cycle. Verify MIT and UNLICENSED identifiers at next refresh.

[repo-settings]: https://docs.github.com/en/rest/repos/repos#update-a-repository
[branch-protection]: https://docs.github.com/en/rest/branches/branch-protection
[rulesets]: https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets
[dependabot]: https://docs.github.com/en/rest/repos/repos#enable-vulnerability-alerts
[secret-scanning]: https://docs.github.com/en/code-security/reference/secret-security/secret-scanning-scope
[actions]: https://docs.github.com/en/rest/actions/permissions
[gh-cli]: https://cli.github.com/manual/
[spdx]: https://spdx.org/licenses/
[choosealicense]: https://choosealicense.com/
