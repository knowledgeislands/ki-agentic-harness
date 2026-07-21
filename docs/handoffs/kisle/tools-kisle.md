# `tools-kisle` implementation brief

**Origin:** `ki-agentic-harness` FND-018

**Receiving repository:** `knowledgeislands/tools-kisle`

**Relationship:** this handoff blocks the first `kisle` release but does not authorise creating, publishing, or releasing the receiving repository from the harness.

Implement the installable `kisle` façade exactly against the harness-owned [`kisle` command contract](command-contract.md). The receiving repository owns the executable, installer, release process, and tests; the harness remains the source of lifecycle meaning and public operation contracts.

## Locked decisions

- The executable is `bin/kisle`, a single Bash 3.2-compatible executable modelled on `tools-mgit`. HELP, version, completion, and parsing have no package-manager or language-runtime dependency.
- The initial lifecycle surface is only `user install`; repository `bootstrap`, `educate`, `audit`, `conform`, and `clean`; HELP; version; and Bash/Zsh completion.
- DOCTOR and UNINSTALL are reserved, absent commands. An unscoped form is never valid.
- The CLI dispatches public operations and repository-local generated commands. It contains no lifecycle ownership logic and reaches no harness-internal or maintainer entrypoint.
- Every released CLI embeds one full compatible `ki-agentic-harness` commit SHA. A user may override it only on the temporary-source leaf commands that publish `--ref`.
- The CLI preserves child streams and exit status. Its own parser uses exit 2; its own preflight and transport failures use exit 1.
- The release follows semantic versioning with `vX.Y.Z` tags, one GitHub release per tag, and Keep a Changelog.

## Escalations before implementation

The harness and Website owners must provide and stability-test one public HTTPS endpoint for each temporary-source contract:

- user install;
- repository bootstrap;
- repository operation, accepting the `clean` operation.

The current harness source entrypoints exist, but the repository-operation Website route is not yet recorded as a stable public endpoint. The receiving implementation must not invent a Website URL or call `scripts/internal/` to avoid that handoff.

## Repository shape

Create a normal `ki-tools` repository with:

```text
tools-kisle/
├── bin/kisle
├── install.sh
├── tests/kisle.bats
├── tests/helpers/
├── .github/workflows/ci.yml
├── CHANGELOG.md
├── README.md
├── LICENSE
└── .ki-config.toml
```

The configuration declares `[ki-repo]` and keyless `[ki-tools]`. Preserve the executable bit on `bin/kisle`. CI runs ShellCheck and Bats on macOS and Linux, including the macOS system Bash compatibility boundary.

## Ordered implementation units

### Unit 1 — parser, HELP, version, and completion

**Recommended tier:** haiku — the grammar and exact outputs are locked by the command contract.

1. Implement a two-level parser that resolves `user install`, every initial `repo` leaf, `help`, and `completion` without prefix matching.
2. Validate command-specific options before any repository discovery, dependency check, network call, or child process.
3. Implement root and leaf HELP from one data definition so parser, help, and completion cannot drift.
4. Implement `--version` as `kisle X.Y.Z`, with one source version marker checked against the release tag.
5. Generate Bash and Zsh completion from the same available-command definition. Omit reserved commands.

**Definition of done:** Bats proves every accepted grammar path, every missing/unknown/conflicting argument, the exact version shape, root/leaf HELP equivalence, reserved-command refusal, no prefix matching, and completion parity. Parser failures exit 2 and execute no fixture child.

### Unit 2 — repository-local dispatch

**Recommended tier:** sonnet — physical repository resolution and byte-transparent process dispatch need careful shell implementation.

1. Resolve the physical git root once for EDUCATE, AUDIT, and CONFORM.
2. Validate the precise `.ki/bin` entrypoint without searching another checkout or user skill directory.
3. Invoke the exact argv in the contract and inherit all three standard streams.
4. Return the child's exact exit status and propagate signal termination after cleanup.
5. Emit the contract recovery message when the generated runner is absent.

**Definition of done:** fixture executables record cwd and argv, emit distinct stdout/stderr bytes, return several non-zero statuses, and handle a signal. Tests prove exact cwd, argv, stream, and status preservation and prove that no fallback path is invoked.

### Unit 3 — temporary-source dispatch

**Recommended tier:** sonnet — transport, immutable pinning, cleanup, and shell failure handling form a security boundary.

1. Embed a full harness commit SHA as the default compatible ref.
2. Validate an explicit ref against the command contract before network access.
3. Download each stable launcher completely over HTTPS into a private temporary directory; never pipe or evaluate a partial response.
4. Dispatch the launcher with the exact target, ref, runtime, and mode arguments defined by the contract.
5. Preserve child streams/status and remove temporary material on success, failure, and signal.
6. Check only the current leaf's prerequisites and use the published missing-dependency diagnostic.

**Definition of done:** a local fixture HTTP server supplies launchers and synthetic failures. Bats proves pin forwarding, ref rejection before access, download failure, truncated response refusal, cleanup, dry-run forwarding, scope-isolated argv, child status preservation, and that no user-install leaf invokes a repository launcher or vice versa.

### Unit 4 — installer and release integrity

**Recommended tier:** sonnet — the installer and release assets establish the supply boundary.

1. Add `install.sh` with `KISLE_INSTALL_DIR` and `KISLE_VERSION` overrides, defaulting to `~/.local/bin` and the latest stable release.
2. Install only a tagged `bin/kisle` payload, verify its release version marker and published SHA-256 digest, and use an atomic executable replacement.
3. Fail when no stable release or digest-verification utility is available; never fall back from a failed release lookup to `main`.
4. Publish the executable and digest as GitHub release assets for each `vX.Y.Z` tag.
5. Document the separate CLI version and embedded harness SHA.

**Definition of done:** installer fixtures cover default/custom directory, explicit version, repeat install, corrupted payload, mismatched version, missing digest utility, failed latest lookup, interrupted replacement, and PATH guidance. No test writes outside its temporary home.

### Unit 5 — end-to-end contract matrix

**Recommended tier:** sonnet — this is structured integration work across public and generated boundaries.

Run the released candidate against a temporary repository and controlled user home:

1. HELP, version, and both completions without Bun present.
2. User install dry-run and check with each runtime separately and together.
3. Repository bootstrap dry-run and real bootstrap at the embedded SHA.
4. Repository AUDIT, CONFORM dry-run, CONFORM, and EDUCATE through vendored bins.
5. Repository CLEAN dry-run and real CLEAN, followed by the documented bootstrap/EDUCATE recovery.
6. Every command from a nested working directory where the grammar allows it.
7. Reserved and unscoped DOCTOR/UNINSTALL refusal with filesystem and network spies.

**Definition of done:** the matrix passes on current macOS and Linux; a recorded test identifies the harness SHA; no command crosses user/repository scope; `shellcheck bin/kisle install.sh`, `bats tests/`, `ki-tools` AUDIT, and the repository aggregate AUDIT pass.

## Error and test fixtures

Test doubles must be ordinary executable fixtures selected through an isolated `PATH` or fixture repository, not production-only switches. At minimum cover:

- missing `git`, `bun`, `curl`, or `tar` only on the leaves that require each tool;
- no git root, unsafe or missing target, missing `.ki/bin`, and non-executable entrypoints;
- every legal progress/reporter option and illegal value;
- child stdout without newline, stderr without newline, binary-safe ordinary bytes, and interactive inheritance;
- child exits 1, 2, and another non-zero value;
- whitespace, control, URL delimiter, leading-dash, and traversal-like refs;
- temporary-directory cleanup after transport error and termination;
- dry-run argument placement and absence of selected-scope mutations.

## Release and compatibility handoff

Before tagging, update the version marker, changelog, embedded harness SHA, integration fixture, and README command surface in one release commit. Tag `vX.Y.Z`, publish the GitHub release assets and digest, then hand the immutable tarball URL and SHA-256 to `homebrew-tap`.

A patch or minor release may advance the embedded harness SHA only when the complete contract matrix passes. Any breaking grammar, scope, stream, or exit change requires a major release and a corresponding harness contract revision.

## Readiness

Readiness test passed on 2026-07-21: a cold executor can start Unit 1 from the grammar and exact acceptance tests without reopening lifecycle ownership decisions. The public Website endpoint for repository CLEAN is the sole external prerequisite and is explicitly escalated above.
