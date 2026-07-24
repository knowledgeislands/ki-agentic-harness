# Compatible harness contract

Reference companion to [ADR-KI-HARNESS-012](../ADR-KI-HARNESS-012-compatible-harness-publication-and-native-operation-boundary.md).

This is a harness-publication contract, not a CLI decision. It defines the artefacts a compatible harness publishes; `tools-ki` defines how it registers, installs, selects, and executes them.

## Harness identity and manifest

A compatible harness is a verified regular-file source rooted at one directory and carrying `harness.toml`.

The manifest has `schema: 1`, a stable `id`, a `latest` release identity, a supported `ki` version range, immutable source evidence, and an integrity-covered capability inventory.

The baseline harness identifier is `knowledgeislands/ki-agentic-harness`.

Harness identifiers use lowercase owner and name segments separated by one `/`; neither segment is empty, `.` or `..`, and an identifier is not a filesystem path.

The published source is valid only when its declared regular files exist once, have the declared digest, and have no escaping symlink traversal.

## Capability inventory and identity

Each inventory entry declares a capability `kind`, local `name`, contained source root, compatibility requirements, integrity-covered files, and any registered native operations.

The recognised initial kinds are `skill`, `agent`, `mcp-server`, `hook`, and `eval`.

A skill's qualified identity is `<harness-id>:<skill-name>`, for example `knowledgeislands/ki-agentic-harness:ki-repo`.

Other kinds reserve `<harness-id>:<kind>/<name>`, for example `example/operations:mcp-server/catalogue`.

The inventory is an index rather than a second source of truth. A capability's name and kind must agree with its own authoritative format, and an unlisted file or module cannot become executable merely because it appears beneath the harness root.

## Registered native operations

A capability may declare a native operation with a protocol identifier, contained module path, named export, mode, and compatibility requirements.

The host imports a registered operation in process only after it has validated the harness and inventory. It never shells out to a capability script, imports an unregistered module, or treats a repository-vendored runner as an alternative implementation.

The operation receives a host-owned immutable context containing the physical repository root when applicable, the selected capability identity, parsed declared configuration, the verified harness identity, and a capability-scoped write interface.

AUDIT is read-only. CONFORM receives a transaction interface that validates its complete intended write set before the first write, honours dry-run, and re-audits after commit. The host owns integrity, resolution, compatibility, transaction, and reporting infrastructure; a capability owns findings in its governed domain.

## Projection and future versioning

A runtime projection is separate from an installed harness source. `vendor` writes a managed regular-file copy; `symlink` writes a contained managed link to a verified installed source. Both require ownership markers, containment checks, idempotence, dry-run, and refusal for altered, unfamiliar, or escaping state.

Initial registration and selection use the `latest` release only. A later versioned model may add sibling version records beside `latest`, with explicit compatibility and integrity evidence. It must not change existing qualified capability identities or make a nearby checkout a source of truth.
