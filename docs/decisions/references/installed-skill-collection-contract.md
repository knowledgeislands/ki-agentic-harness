# Installed skill collection contract

Reference companion to [ADR-KI-HARNESS-012](../ADR-KI-HARNESS-012-installed-skill-collections-and-native-repository-operations.md).

This is a contract reference, not a decision record: it defines the interoperable collection and operation shape that `tools-ki` implements and the harness publishes.

## Collection identity and layout

One active collection exists at `$XDG_DATA_HOME/ki/skills`.

Its root is a regular directory, never a symlink, and contains:

```text
collection.json
registry.json
skills/<ki-skill>/
operations/<ki-skill>.mjs
```

`collection.json` is the integrity root.

It has `schema: 1`, a collection semantic version, the immutable source archive URL, source revision, archive SHA-256, the supported `ki` version range, and a sorted file map of every regular collection file (`path` and SHA-256).

Paths are relative POSIX paths with no empty segment, `.` or `..` segment, absolute form, or symlink traversal.

The file map includes `registry.json`, every operation module, and every installed skill file.

The collection is valid only when every declared regular file exists once, hashes exactly, has no escaping link, and no unlisted executable or operation file is loaded.

`registry.json` has `schema: 1`, repeats the collection version and source revision, and contains a sorted entry for each installed skill.

An entry contains the exact skill name, its collection-relative root, the compatible `ki` version range, its explicit `ki-depends-on` names, and its registered operations.

The registry is an index, not a second source of truth: its entry must agree with the installed `SKILL.md` frontmatter and its files must be covered by `collection.json`.

## Installation, selection, and update

`ki skill install` selects the collection version that the installed `ki` release declares as its supported default.

An explicit version selection, when the command later exposes one, is valid only when the installed release has immutable source URL, revision, SHA-256, and compatibility evidence for that exact version.

It may not resolve a floating branch, a nearby checkout, a mutable asset name without a hash, or an unverified cache entry.

Installation downloads into `$XDG_CACHE_HOME/ki`, verifies the archive SHA-256 before unpacking, validates the complete candidate collection, then atomically replaces the active collection root.

The old collection remains active until the new candidate has passed every validation.

An interruption leaves either the old valid collection or no active collection, never a partly updated one.

A process lock under `$XDG_STATE_HOME/ki` serialises installation, activation, and migration.

When a valid active collection already matches the selected evidence, installation is idempotent and makes no replacement.

Offline execution may use only an already-valid active collection.

An unavailable collection, absent release evidence, failed download, hash mismatch, invalid registry, incompatible CLI, or held/stale lock is a named failure with recovery guidance; it never falls back to vendored repository state or a source checkout.

## Native operation registration

A governance skill may register `audit` and `conform` operations.

Each operation entry declares:

```json
{
  "protocol": "ki.native-operation/v1",
  "module": "operations/ki-example.mjs",
  "export": "audit",
  "mode": "audit"
}
```

`module` must be a distinct, manifest-covered regular file below `operations/`, and `export` must be a named export.

The host imports it in-process only after full collection validation; it never shells out to a skill script or imports an unregistered module.

An operation receives an immutable context containing the physical repository root, operation mode, selected skill name, that skill's parsed config table, the collection identity, and a capability-scoped write interface.

The context exposes no ambient working-directory or source-checkout assumption.

AUDIT receives a read-only interface.

CONFORM receives a transaction interface that records its complete intended write set, validates containment and ownership before the first write, honours dry-run without writes, and re-audits after a successful commit.

Operations emit the existing canonical KI finding records through the host reporter.

The host owns collection, repository, resolution, compatibility, and transaction failures; a skill owns findings in its governed domain.

An operation cannot suppress another selected operation's findings, alter ordering, or execute a dependency that the repository did not declare.

## Repository resolution and commands

`ki repo audit [path] [--skill <ki-skill>]` and `ki repo conform [path] [--skill <ki-skill>] [--dry-run]` first physically resolve `path` (default current directory), then read its `.ki-config.toml`.

They select exact declared `[ki-<skill>]` roots.

Every `ki-depends-on` requirement must also be declared; resolution validates rather than expands the set.

The host rejects missing registry entries, duplicate names, incompatible versions, absent mode registrations, mismatched registry/frontmatter dependencies, or an `--skill` value that is not declared.

It topologically orders the declared graph using stable lexical order among independent skills.

AUDIT executes each selected audit operation read-only and returns the canonical aggregate result.

CONFORM calculates and validates every selected operation's write transaction before committing any mutation, commits only safe registered changes, then runs the same resolved AUDIT set.

The commands never execute `.ki/bin`, `.ki/bootstrap`, `.ki/manifest.json`, copied `govern.ts`, package-script aliases, or a nearby harness checkout.

## Activation and migration boundary

`ki skill add <skill> --scope global` creates only the selected runtime's managed user discovery link.

`ki skill add <skill> --scope repo` updates only the selected repository's declaration and managed project discovery links.

Both require the named skill to exist in the valid active registry and use ownership markers, containment checks, idempotence, dry-run, and refusal for altered, unfamiliar, partial, or escaping state.

Existing `.ki/` runners, manifests, copied checkers, and copied payloads are migration inputs only.

An explicit migration first validates the active collection, repository declaration, activation state, and native AUDIT result.

It then proves ownership of every legacy removal target and removes only that complete proven set in one transaction.

Any missing, altered, linked, partial, unfamiliar, or concurrently changed legacy material stops migration and remains untouched.

## CI and automation

CI pins the collection's immutable source revision and archive SHA-256 in reviewed workflow configuration or a reviewed release-evidence file.

It runs `ki skill install` with that pinned selection, then the required `ki repo audit` command.

It does not install from a floating ref, bootstrap a repository-local executor, or use a vendored file after collection acquisition fails.

The resulting logs distinguish CLI release compatibility, source acquisition, integrity validation, registry loading, repository declaration, dependency validation, operation availability, and domain findings so recovery is actionable.
