# Sources — GitHub Issues adapter

**Refresh:** external-spec · monthly

| Source | Governs | Last reviewed |
| --- | --- | --- |
| [Issue dependencies][dependencies] | blocker relation semantics and permissions | 2026-09-14 |
| [Sub-issues][subissues] | hierarchy distinct from blockers | 2026-09-14 |
| [Issue fields][fields] | organisation-wide versus project-scoped metadata planes | 2026-09-14 |
| [Close an issue][close] | closure state and permissions | 2026-09-14 |
| [Transfer an issue][transfer] | mutable locator, redirect, retained/missing metadata | 2026-09-14 |
| [Delete an issue][delete] | permanent Issue deletion, distinct from project-item archive | 2026-09-14 |
| [Issues REST API][api] | Issue-versus-pull-request filtering and API boundary | 2026-09-14 |

## Local authority

The adapter standard is normative for KI configuration, migration stops, and no-execution boundary. GitHub documentation is primary evidence for remote capability and behaviour; it does not authorise KI process execution.

## Last review

REFRESH last run **2026-09-14** (previous: 2026-08-12). All seven sources fetched and diffed against the standard.

**Confirmed (unchanged):**

- Dependencies and sub-issues remain separate relationships and must never be treated as interchangeable.
- Issue fields and project fields remain distinct metadata planes.
- REST Issues endpoints can return pull requests; the `pull_request` key distinguishes them.
- Transfers redirect old URLs; the old locator survives as a historical alias only.
- Permanent Issue deletion differs from closing an Issue or removing a project-item from a board.

**Drift applied this pass:**

- **Sub-issues** now document a hard cap of 100 sub-issues per parent and up to 8 nesting levels. The standard now records these bounds in a dedicated "Sub-issues and hierarchy" section.
- **Issue fields** now document a 25-field org cap, four default fields auto-generated on activation (Priority, Effort, Start date, Target date), visibility controls, and field-pinning to issue types. The standard now records these in a dedicated "Issue fields" section.
- **Transfer** now documents that both repositories must be owned by the same user or organisation, and that a private-repository Issue cannot be transferred to a public repository. Added to the standard's transfer migration-stop description.
- **Delete** now explicitly documents that org owners must enable deletion before admins can use it. Added to the standard's lifecycle/retention section.
- **REST API**: four new endpoint groups are documented — issue suggestions (agent-proposed changes with approve/dismiss), issue field values (API access to org-wide custom fields), sub-issues (tracking with completion summaries), and issue dependencies (blocking/blocked management). The standard's API boundary note is updated accordingly. The current API version header is `X-GitHub-Api-Version: 2026-03-10`.

**Open watch-items:**

- Issue dependency creation documents `--blocked-by` / `--blocking` CLI flags but does not specify required permissions. Monitor for documentation of permission requirements.
- Monitor for changes to the sub-issue nesting depth or parent-cap limits as the feature matures.
- Monitor for the `KI-HARNESS-FND-014` executor that will activate remote discovery, authentication, and mutation. The issue suggestions endpoints are directly relevant once that executor exists.

[dependencies]: https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/creating-issue-dependencies
[subissues]: https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/adding-sub-issues
[fields]: https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/managing-issue-fields-in-your-organization
[close]: https://docs.github.com/en/issues/tracking-your-work-with-issues/administering-issues/closing-an-issue
[transfer]: https://docs.github.com/en/issues/tracking-your-work-with-issues/administering-issues/transferring-an-issue-to-another-repository
[delete]: https://docs.github.com/en/issues/tracking-your-work-with-issues/administering-issues/deleting-an-issue
[api]: https://docs.github.com/en/rest/issues/issues
