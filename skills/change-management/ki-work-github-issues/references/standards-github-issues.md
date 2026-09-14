# GitHub Issues adapter standard

## Configuration and local inspection

Select the adapter, name one current GitHub repository namespace, and make the repository's lifecycle metadata decision inspectable locally.

```toml
[skills.ki-work]
adapter = "github-issues"

[skills.ki-work-github-issues]
repository = "owner/repository"
metadata_owner = "repository-maintainers"
dependencies = "native Issue blocked-by/blocking relations"
hierarchy = "native sub-issues only; not a blocker relation"

[skills.ki-work-github-issues.lifecycle]
queue = "label: queued"
ready = "label: ready"
review = "label: awaiting-review"
done = "closed"
```

`repository` is the configured Issue namespace. `<owner>/<repository>#<number>` is a current mutable locator, not a durable identity: an open Issue transfer changes its namespace and may change its number. The old URL redirects, but retain the old locator only as historical alias evidence. Do not infer a canonical cross-transfer identifier, including an API ID, without a separately evidenced identity decision.

The `lifecycle` table names exact remote values for queue, readiness, review, and done. `metadata_owner` names the authority that resolves a label, Issue-field, or Project-field conflict; `dependencies` and `hierarchy` are separate non-empty mappings and must never silently be treated as interchangeable. The local rubric checks that this declaration is complete, but it does not contact GitHub or prove that the remote configuration matches it.

## Sub-issues and hierarchy

Sub-issues are a parent-child hierarchy distinct from blocker/blocking dependency relations and must never be treated as interchangeable. GitHub documents a maximum of **100 sub-issues per parent** and up to **8 nesting levels**. These are concrete capability bounds, not policy choices. Sub-issues integrate with GitHub Projects for filtering and grouping by parent.

## Issue fields

Organisation-wide issue fields (Settings → Planning → Issue fields) and project-scoped fields are distinct metadata planes; the `metadata_owner` declaration governs conflict resolution. Organisation-wide fields have a hard cap of **25 per organisation**. When the feature is enabled, **four default fields** are auto-generated: Priority, Effort, Start date, and Target date. Fields can be scoped with a visibility control ("Organisation only" or "Public") and pinned to specific issue types so only relevant categories display them.

## Lifecycle, migration, and retention

An Issue is the remote record. Its body and comments are the intended locations for plan, delivery, and review evidence. Never infer readiness from `open` or acceptance from a merged pull request. `done` maps to the declared closed value; closed Issues are retained evidence. This adapter defines no archive or delete/prune operation.

Permanent Issue deletion requires admin or owner permissions. For organisation repositories, **the org owner must first enable the deletion capability** before admins can use it; deletion is not available by default. Permanent deletion is distinct from closing an Issue or removing a project item from a board.

A transfer is an authority-gated migration stop, not a normal lifecycle transition. Transfers require **write access to both the source and destination repositories**, and both repositories must be **owned by the same user or organisation**. A private-repository Issue **cannot be transferred to a public repository**. Labels and milestones transfer only when matching names (and, for milestones, matching due dates) exist in the destination. Before any future authorised operation, `KI-HARNESS-FND-014` must re-resolve the current repository and locator, verify the Issue is not a pull request, inspect the current lifecycle fields and retained aliases, identify transferred labels/milestones that did not survive, and obtain fresh authority for the new write set. This skill performs none of those reads or writes.

## Timestamp projection

The adapter projects GitHub's provider-native Issue creation and update timestamps as portable `created_at` and `updated_at` values. It does not duplicate them into the Issue body or treat a KI read as a provider update. The executor must return the post-write provider timestamp with its opaque snapshot evidence rather than manufacture a local timestamp.

## REST API surface

The REST Issues API can return pull requests; detect them via the presence of a `pull_request` key in the response and exclude them from Issue-specific operations. Four additional endpoint groups are now documented alongside the core six: issue suggestions (agent-proposed changes with approve/dismiss workflows), issue field values (API access to organisation-wide custom fields), sub-issues (tracking with completion summaries), and issue dependencies (blocking/blocked management via API). These groups expand the available API surface but do not change the current execution boundary.

## Execution boundary

Remote discovery, authentication, filtering, stale-read checks, conflict handling, and every mutation fail closed pending `KI-HARNESS-FND-014`. A future executor must re-read each Issue immediately before an approved write and stop on changed lifecycle metadata, conflicting human updates, missing permissions, an uncertain current locator, or an Issue response that represents a pull request.
