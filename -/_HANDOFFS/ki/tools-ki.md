# `tools-ki` implementation brief

**Origin:** `ki-agentic-harness` FND-018

**Receiving repository:** `knowledgeislands/tools-ki`

**Relationship:** this handoff blocks the first `ki` release but does not authorise creating, publishing, or releasing the receiving repository from the harness.

Implement the Knowledge Islands command-line interface (CLI), invoked as `ki`, against the harness-owned [CLI contract](command-contract.md). The receiving repository owns the executable, installer, release process, and tests; the harness remains the source of lifecycle meaning and public operation contracts.

## Locked decisions

- The executable is `bin/ki`, one Bash 3.2-compatible executable modelled on `tools-mgit`. HELP, version, completion, and parsing require no package manager or language runtime.
- The seed surface is HELP, version, Bash/Zsh completion, and root `ki doctor`. Doctor writes its fixed coming-soon response, exits successfully, and performs no inspection or mutation.
- `ki acquire chatgpt import` is the first substantive command after the seed. The `user` and `repo` lifecycle groups follow in later releases. Scope-specific doctor and uninstall forms remain reserved; unscoped `ki uninstall` is never valid.
- The CLI dispatches public operations and repository-local generated commands. It contains no lifecycle ownership logic and reaches no harness-internal or maintainer entrypoint.
- Each release embeds one compatible `ki-agentic-harness` commit SHA. A user may override it only on temporary-source leaves that publish `--ref`.
- The CLI preserves child streams and exit status. Its parser returns `2`; its preflight and transport failures return `1`.
- Releases use semantic versioning with `vX.Y.Z` tags, one GitHub release per tag, and Keep a Changelog.

## Escalations before implementation

The harness and Website owners must provide and stability-test public HTTPS endpoints for user install, repository bootstrap, and repository operation CLEAN. The current harness source entrypoints exist, but the repository-operation Website route is not yet recorded as stable. Do not invent a Website URL or call `scripts/internal/` to bypass it.

## Repository shape

```text
tools-ki/
├── bin/ki
├── install.sh
├── tests/ki.bats
├── tests/helpers/
├── .github/workflows/ci.yml
├── CHANGELOG.md
├── README.md
├── LICENSE
└── .ki-config.toml
```

Declare `[ki-repo]` and keyless `[ki-tools]`. Preserve the executable bit on `bin/ki`. CI runs ShellCheck and Bats on macOS and Linux, including the macOS system-Bash boundary.

## Ordered implementation units

### Unit 1 — seed parser, HELP, version, completion, and doctor

**Recommended tier:** haiku.

1. Implement a parser for root HELP, `doctor`, version, and completion without prefix matching.
2. Validate the seed grammar before any filesystem, repository, network, environment, or child-process access.
3. Derive parser, help, and completion from one available-command definition.
4. Implement `--version` as `ki X.Y.Z` from one marker checked against the release tag.
5. Generate Bash and Zsh completion from that same definition, omitting acquisition and every future lifecycle command.

**Definition of done:** Bats covers accepted seed grammar, exact doctor output and non-interference, exact version shape, root/leaf help equivalence, reserved-command refusal, no prefix matching, completion parity, and no child invocation on parser failure.

### Unit 2 — user-assisted ChatGPT acquisition

**Recommended tier:** sonnet.

Implement the `ki acquire chatgpt import` contract from the KEP v0 specification and the dedicated acquisition brief. It is a local user-prepared import only: no browser automation, API, authentication material, network access, repository discovery, knowledge extraction, or ingress.

**Definition of done:** the CLI-002 plan's deterministic KEP, dry-run, validation, and source-isolation checks pass.

## Deferred lifecycle implementation

### Unit 3 — repository-local dispatch

**Recommended tier:** sonnet.

1. Resolve the physical git root once for EDUCATE, AUDIT, and CONFORM.
2. Validate the exact `.ki/bin` entrypoint without any fallback.
3. Invoke exact contract argv while inheriting all streams and child status.
4. Propagate signal termination after cleanup and emit the direct bootstrap recovery message when the runner is absent.

**Definition of done:** executable fixtures prove exact cwd/argv, byte-transparent stdout/stderr, several child statuses, signal handling, and no fallback invocation.

### Unit 4 — temporary-source dispatch

**Recommended tier:** sonnet.

1. Embed a full harness commit SHA as the default compatible ref and validate override refs before network access.
2. Download each stable launcher completely over HTTPS into a private temporary directory; never evaluate partial output.
3. Dispatch exact target, ref, runtime, and mode arguments; preserve streams/status and clean up on success, failure, and signal.
4. Check only the current leaf's prerequisites and keep user/repository scope isolated.

**Definition of done:** controlled transport fixtures prove pin forwarding, pre-access ref rejection, download failure, truncated response refusal, cleanup, dry-run forwarding, scope-isolated argv, and child status preservation.

### Unit 5 — installer and release integrity

**Recommended tier:** sonnet.

1. Add `install.sh` with `KI_CLI_INSTALL_DIR` and `KI_CLI_VERSION` overrides, defaulting to `~/.local/bin` and the latest stable release.
2. Install only a tagged `bin/ki` payload, verify its version marker and published SHA-256 digest, and replace atomically.
3. Fail on missing stable release or digest utility; never fall back to `main` after a failed lookup.
4. Publish executable and digest as release assets for every `vX.Y.Z` tag, and document CLI version separately from embedded harness SHA.

**Definition of done:** fixtures cover default/custom directory, explicit version, repeat install, corrupt payload, version mismatch, missing digest utility, failed lookup, interrupted replacement, and PATH guidance. No test writes outside its temporary home.

### Unit 6 — end-to-end contract matrix

**Recommended tier:** sonnet.

Run the release candidate against a temporary repository and controlled user home: HELP/version/completion without Bun; user install dry-run/check per runtime; bootstrap dry-run/real at embedded SHA; vendored AUDIT, CONFORM dry-run, CONFORM, and EDUCATE; CLEAN dry-run/real followed by recovery; nested working directories; and reserved/unscoped DOCTOR/UNINSTALL refusal with filesystem and network spies.

**Definition of done:** current macOS and Linux pass; the harness SHA is recorded; no command crosses scope; `shellcheck bin/ki install.sh`, `bats tests/`, `ki-tools` AUDIT, and repository aggregate AUDIT pass.

## Error and test fixtures

Use ordinary executable fixtures through isolated `PATH` or fixture repositories, never production-only switches. Cover missing leaf prerequisites, no git root, unsafe/missing target, missing or non-executable `.ki/bin`, legal and illegal aggregate options, child stdout/stderr without newline, child exits 1/2/other, invalid refs, temporary cleanup after error/termination, and dry-run placement without selected-scope mutation.

## Release and compatibility handoff

Before tagging, update the version marker, changelog, embedded harness SHA, integration fixture, and README surface in one release commit. Tag `vX.Y.Z`, publish release assets and digest, then hand the immutable tarball URL and SHA-256 to `homebrew-tap`. A patch or minor release may advance the embedded harness SHA only after the complete matrix passes; breaking grammar, scope, stream, or exit changes require a major release and matching harness contract revision.

## Readiness

The cold-agent readiness test passed on 2026-07-21: a fresh executor can begin Unit 1 without reopening lifecycle ownership decisions. The public Website CLEAN endpoint is the sole external prerequisite.
