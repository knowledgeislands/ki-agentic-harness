# Sources — where the repo standard comes from

**Refresh:** external-spec · monthly

The authoritative sources behind [the repository standard](standards-repository.md), [the configuration standard](standards-configuration.md), and the generated [rubric](rubric.md). Mode REFRESH reads this file, re-fetches each source, diffs it against the standards and structured catalogue, then **bumps the `last reviewed` dates** and refreshes the `## Last review` block below (what changed is recorded in the commit, not a changelog). GitHub's settings surface moves (rulesets, security toggles, Actions policy), so this is the skill's memory of where the standard comes from — keep it current.

## Authoritative (GitHub)

| Source | Governs | Last reviewed |
| --- | --- | --- |
| [REST: repository settings][repo-settings] | merge methods, auto-delete-branch, features, description, visibility | 2026-08-03 |
| [REST: branch protection][branch-protection] | the optional `branch-protection` body (PR, `build` check, linear) | 2026-08-03 |
| [Repository rulesets][rulesets] | the modern alternative to classic protection (private-repo path) | 2026-08-03 |
| [REST: Dependabot alerts / fixes][dependabot] | `vulnerability-alerts`, `automated-security-fixes` endpoints | 2026-08-03 |
| [Secret scanning & push protection][secret-scanning] | `security_and_analysis` toggles and their plan/GHAS gating | 2026-08-03 |
| [REST: Actions permissions for a repository][actions] | `allowed_actions` policy | 2026-08-03 |
| [`gh` CLI manual][gh-cli] | `gh repo list/view/edit`, `gh api` — how evidence is read and confirmed live changes are applied | 2026-06-21 |
| [choosealicense.com][choosealicense] | the declared `license` SPDX id — the picker and the reference for license/`LICENSE`/`package.json` conformance | 2026-07-09 |

## Last review

REFRESH last run **2026-08-03** (previous: 2026-07-04). Five of the eight tracked sources were re-fetched via GitHub Docs this run; the `gh` CLI manual carried from 2026-06-21 and choosealicense.com from 2026-07-09 (both blocked by proxy in the scheduled environment). No drift affecting the standard, rubric, or catalogue — a confirm-current refresh. Both watch-items carried from prior runs still hold.

- **REST repository settings** (fetched this run): merge-method booleans, `delete_branch_on_merge`, `allow_update_branch`, `squash_merge_commit_title` (enum `PR_TITLE`/`COMMIT_OR_PR_TITLE`), features, `description`, and `visibility` all confirmed unchanged. API version header still `2026-03-10`.
- **REST branch protection** (fetched this run): `required_status_checks.contexts` confirmed still present on GET responses (the back-compat the auditor relies on). The "Closing down notice" in favour of `checks` remains in the request/body documentation only — no removal. `enforce_admins`, `required_linear_history`, `allow_force_pushes`, `allow_deletions` unchanged. Watch-item (1) confirmed again.
- **Repository rulesets** (fetched this run): no deprecation signal; classic branch protection is **not** deprecated and rulesets coexist. Staying on classic protection for the optional `branch-protection` check remains correct. Watch-item (2) no change.
- **Dependabot alerts / automated security fixes** (fetched this run): endpoints and shapes unchanged; `.enabled` pattern still correct. `paused` field still additive.
- **Actions permissions** (fetched this run): `/actions/permissions` path and `allowed_actions` enum (`all`/`local_only`/`selected`) unchanged. `sha_pinning_required` still additive; our `actions` check stays WARN-only.
- **Secret scanning & push protection** (fetched this run): still free and automatic for public repos; private/internal require **GitHub Secret Protection** on Team / Enterprise — still exempt (public-only check). No change to the standard.
- **`gh` CLI** (carried — proxy-blocked this run): still carried from 2026-06-21.
- **choosealicense.com** (carried — not re-fetched): still carried from 2026-07-09.
- **Open watch-items:** (1) re-confirm next refresh that GitHub still populates `contexts` on the GET — confirmed again this run. (2) Watch whether GitHub ever deprecates classic protection in favour of rulesets — no signal yet.

[repo-settings]: https://docs.github.com/en/rest/repos/repos#update-a-repository
[branch-protection]: https://docs.github.com/en/rest/branches/branch-protection
[rulesets]: https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets
[dependabot]: https://docs.github.com/en/rest/repos/repos#enable-vulnerability-alerts
[secret-scanning]: https://docs.github.com/en/code-security/secret-scanning/about-secret-scanning
[actions]: https://docs.github.com/en/rest/actions/permissions
[gh-cli]: https://cli.github.com/manual/
[choosealicense]: https://choosealicense.com/
