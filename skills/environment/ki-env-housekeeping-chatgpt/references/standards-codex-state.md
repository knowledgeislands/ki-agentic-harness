# Codex state housekeeping standard

## Scope

This standard governs explicit cleanup of persisted Codex threads for one selected physical repository. It covers active and archived thread inventory, spawned-descendant impact, a review artifact, stale-selection refusal, and permanent deletion.

It does not govern automatic retention, transcript inspection, unsupported storage, background terminals, caches, memories, or recurring repository maintenance.

## Repository identity

Resolve the selected repository to its physical Git root and canonical real path before starting app-server. Pass that exact path to separate active and archived `thread/list` queries. A thread matches only when its returned `cwd` equals that exact path byte-for-byte.

Parent, child, missing, null, relative, and symlink-alias working directories do not match. Worktrees remain distinct physical repositories for housekeeping purposes.

## Inventory

The adapter initializes app-server with `experimentalApi` because complete impact review uses the experimental `ancestorThreadId` filter. It pages every active and archived result and pages descendants for each candidate.

The review artifact contains only:

- schema and protocol fingerprint;
- installed Codex version and generation time;
- selected physical repository;
- each root thread ID, archive state, creation and update timestamps, runtime status type, and complete descendant IDs.

It excludes preview, name, turns, items, transcript content, messages, commands, tool calls, and credentials. A candidate that appears as another candidate's descendant is not repeated as a root.

## Deletion

Deletion is permanent and also removes spawned descendants. CONFORM requires:

1. a parseable schema-v1 review artifact;
2. one or more exact root IDs present in that artifact;
3. the selected physical repository matching the artifact;
4. the installed Codex version and protocol fingerprint matching the artifact;
5. a fresh active-and-archived inventory matching every selected root and its complete descendants; and
6. the exact confirmation phrase `PERMANENTLY_DELETE_SELECTED_CODEX_THREADS`.

Validate the complete selection before the first `thread/delete` request. Reject a missing, extra, duplicate, cross-repository, archived-state-drifted, timestamp-drifted, descendant-drifted, version-drifted, or protocol-drifted selection without deleting anything.

App-server offers no multi-root transaction. Once validation succeeds, delete selected roots sequentially and report every successful root. A transport or server failure after a successful delete is a material partial-execution concern and must be reported; never retry blindly.

## Interface maturity

The `codex delete <SESSION>` CLI is the stable manual fallback for one reviewed saved session. It is not used for inventory or forced bulk deletion.

The app-server and descendant filter are experimental. The adapter therefore validates its narrow protocol shapes, records the installed version and a local protocol fingerprint, and fails closed on mismatch. Mandatory estate-wide activation remains outside this skill until separately approved rollout evidence exists.
