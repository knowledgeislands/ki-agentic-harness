# `kisle` command contract

**Contract version:** 1

This contract is the harness-owned boundary for the installable `kisle` command. The `tools-kisle` repository owns its implementation and the `homebrew-tap` repository owns its Homebrew delivery; neither repository may redefine the lifecycle operations described here.

## Initial grammar

```text
kisle
kisle help [user install|repo bootstrap|repo educate|repo audit|repo conform|repo clean|completion]
kisle --help
kisle --version
kisle completion <bash|zsh>

kisle user install [--runtime <claude-code|codex>]... [--ref <ref>] [--dry-run] [--check]

kisle repo bootstrap [target] [--ref <ref>] [--dry-run] [--verbose]
kisle repo educate [skill] [--dry-run] [--verbose]
kisle repo audit [--skill <ki-skill>] [--progress <auto|always|never>]
                 [--progress-style <single|multi>] [--reporter-levels <levels>]
kisle repo conform [--skill <ki-skill>] [--dry-run]
                   [--progress <auto|always|never>]
                   [--progress-style <single|multi>] [--reporter-levels <levels>]
kisle repo clean [target] [--ref <ref>] [--dry-run]
```

With no arguments, `kisle` renders the same root help as `kisle help` and exits successfully. `-h` is accepted wherever `--help` is accepted. `-V` is an alias for `--version`. Options belong to their leaf command; there are no ambient lifecycle options.

`target` defaults to the current working directory. A leaf command accepts at most one positional target or skill. `--` ends option parsing where a positional value is permitted. An option requiring a value must reject a missing value before any operation is dispatched.

The initial release does not accept abbreviated groups, commands, options, runtimes, progress modes, or skill names. It does not forward unknown arguments to an underlying command.

## Command semantics

### `kisle user install`

Installs or verifies only the KI-managed user payload. It never reads, bootstraps, audits, or changes a repository.

- `--runtime` may be repeated. With no explicit runtime, the user installer retains its current detection rule: select only conformant existing Claude Code and Codex runtime homes.
- `--ref` selects the harness revision. Its default is the immutable harness revision embedded in the `kisle` release, not a moving branch.
- `--dry-run` reports the complete selected installation plan without changing user-managed state.
- `--check` verifies the selected installed payload without changing it.
- `--dry-run` and `--check` are mutually exclusive.

Repeated installation of the same revision and runtime selection converges on the same managed payload. It does not write runtime settings, bootstrap a repository, or install development links.

### `kisle repo bootstrap`

Obtains temporary harness source and bootstraps the selected repository. It is the initial-adoption and explicit harness-revision acquisition command.

- `target` defaults to the current working directory.
- `--ref` selects the harness revision. Its default is the immutable harness revision embedded in the `kisle` release.
- `--dry-run` obtains any temporary source needed to calculate the plan but does not change repository or user state.
- `--verbose` requests per-file bootstrap reporting from the public launcher.

The command writes only inside the selected repository through the public bootstrap operation. It never installs user payloads. Repeating it at the same revision converges on the declared generated footprint.

### `kisle repo educate`

Runs the repository's vendored `./.ki/bin/ki-educate` entrypoint from the physical git root. With no `skill`, it refreshes the whole governed set; with one canonical `ki-*` skill name, it refreshes only that governed skill.

- `--dry-run` reports the education plan without changing repository state.
- `--verbose` requests per-file reporting.
- No `--ref` is accepted. Acquiring a different harness revision is explicitly `kisle repo bootstrap --ref <ref>`.

If the vendored entrypoint is absent, including after CLEAN, the command fails with a direct recovery instruction: run `kisle repo bootstrap` to reacquire source and execute the repository EDUCATE chain. It never falls back silently to a user-installed skill or a moving remote source.

### `kisle repo audit`

Runs `./.ki/bin/ki-audit audit` from the physical git root. It is read-only and returns the vendored aggregate's result.

- `--skill` selects one governed checker and requires one canonical `ki-*` name.
- `--progress`, `--progress-style`, and `--reporter-levels` are forwarded without reinterpretation after their values pass the published grammar.
- `--dry-run` is rejected because AUDIT is already read-only.

If the entrypoint is absent, the command fails and recommends `kisle repo bootstrap`. It never substitutes a harness-checkout or user-installed checker.

### `kisle repo conform`

Runs `./.ki/bin/ki-conform` from the physical git root. It applies only the vendored checkers' safe mechanical fixes.

- `--skill`, progress, and reporter options have the same grammar as AUDIT.
- `--dry-run` forwards the aggregate's write-free preview mode.

If the entrypoint is absent, the command fails and recommends `kisle repo bootstrap`. Repeating a successful CONFORM converges on the same mechanically conformant state.

### `kisle repo clean`

Obtains temporary harness source and removes only ownership-proven generated repository state. It preserves repository adoption intent, authored `.ki/self/skill/`, altered or unfamiliar material, and every user-level installation.

- `target` defaults to the current working directory.
- `--ref` selects the source-owned CLEAN implementation. Its default is the immutable harness revision embedded in the `kisle` release.
- `--dry-run` reports the complete proven removal set without changing repository or user state.

The command must describe the recovery route as `kisle repo bootstrap`: bootstrap reacquires source and runs the EDUCATE chain that reconstructs generated state. CLEAN is not UNINSTALL. A repeat after successful CLEAN is safe and makes no broader ownership inference.

### HELP, version, and completion

`kisle help` and `kisle --help` render root help without invoking a lifecycle operation. `kisle help <path>` and `<path> --help` render the same leaf help. Help names only commands available in that `kisle` release.

`kisle --version` and `kisle -V` print exactly `kisle X.Y.Z` followed by one newline. The version is the `tools-kisle` release version, not the embedded harness revision.

`kisle completion bash` and `kisle completion zsh` print completion source to standard output. Completion contains only commands and options available in that release. Completion must not inspect or change either scope.

## Reserved lifecycle forms

These command paths are reserved but are not part of the initial surface:

```text
kisle repo doctor
kisle user doctor
kisle repo uninstall
kisle user uninstall
```

The parser must not implement, list, or complete them until their receiving plan explicitly activates them. If a reserved path is entered before activation, `kisle` prints `kisle: error: <path> is not available in this release` to standard error, exits with status 2, and performs no discovery or dispatch.

Unscoped `kisle doctor` and `kisle uninstall` are permanently invalid. No future compatibility alias may infer `repo` or `user`.

## Dispatch and trust boundaries

`kisle` is a dispatcher over public contracts, not another lifecycle engine.

- User installation dispatches the stable public user-install launcher with the selected runtime, pinned ref, and mode flags.
- Repository bootstrap dispatches the stable public repository-bootstrap launcher with the physical target and pinned ref.
- Repository CLEAN dispatches the stable public repository-operation launcher's `clean` operation with the physical target and pinned ref.
- EDUCATE, AUDIT, and CONFORM dispatch only the named executable under the selected repository's `.ki/bin/` directory.
- No command invokes `scripts/internal/`, a harness-maintainer package script, a source checkout discovered elsewhere on disk, or a user-installed skill as a fallback.

The temporary-source commands may use a temporary directory and network transport. They must clean up their own temporary files on success, error, or signal and must never use the temporary source as an installation location.

For every released `kisle`, `tools-kisle` records one full harness commit SHA as its compatible default. `--ref` is an explicit expert override and accepts a non-empty Git ref containing only ASCII letters, digits, `.`, `_`, `/`, and `-`; whitespace, control characters, URL delimiters, leading `-`, and `..` path components are rejected before network access.

The public launchers are responsible for source acquisition and their selected-scope transaction. `kisle` fetches launchers only over HTTPS with failure-aware transport, downloads before execution rather than evaluating a partial response, and preserves the pinned `--ref`. A transport or integrity failure stops before a lifecycle engine is invoked.

## Repository resolution

EDUCATE, AUDIT, and CONFORM locate the git root with `git rev-parse --show-toplevel`, physically resolve it, and reject an unsafe or missing root. They do not walk upward looking for a convenient `.ki/` directory and do not cross a symlinked repository boundary.

Bootstrap and CLEAN physically resolve their explicit or default target before dispatch. A missing path, non-directory, unsafe link, or failure to resolve is an operation error. The selected lifecycle implementation remains responsible for its stronger ownership and transaction checks.

## Output contract

`kisle`-owned help, version, and completion output goes to standard output. `kisle`-owned diagnostics use this form on standard error:

```text
kisle: error: <specific problem>
kisle: try 'kisle help <nearest-command-path>'
```

The second line is omitted when a single recovery command is more useful; for example, a missing vendored runner names `kisle repo bootstrap` directly.

After dispatch, the child operation inherits standard input, standard output, and standard error. `kisle` does not capture, reorder, recolour, parse, summarise, or relabel its output. In particular, interactive progress remains on the stream chosen by the vendored aggregate and machine-readable output remains byte-for-byte available to its caller.

`kisle` prints no success banner around an operation. The selected operation owns its result text. When `--dry-run` is used, the operation's dry-run message is authoritative; `kisle` does not imply that temporary network or filesystem workspace was absent, only that selected repository or user state was not changed.

## Exit contract

- `0` means the requested command, help, version, completion, check, or dry-run completed successfully.
- `2` means `kisle` rejected its own grammar before dispatch: unknown, missing, conflicting, unavailable, or invalid command arguments.
- Once an operation has been dispatched, `kisle` returns that operation's exit status unchanged. AUDIT findings and lifecycle safety refusals therefore remain distinguishable through their existing status and output.
- A `kisle` preflight, transport, integrity, dependency, or repository-resolution failure returns `1`.
- If the child ends because of a signal, `kisle` preserves the shell's conventional signal-derived status and performs temporary cleanup.

Automation may rely on `0` versus non-zero and on `2` meaning a CLI grammar rejection. It must not assume all operation failures use the same non-zero value.

## Runtime requirements

The `kisle` executable is one Bash 3.2-compatible script with no package-manager or language-runtime dependency for HELP, version, or completion. Lifecycle commands require only the tools their public contract needs:

- local EDUCATE, AUDIT, and CONFORM: `bash`, `git`, and `bun`;
- temporary-source user install, bootstrap, and CLEAN: `bash`, `curl`, `tar`, and `bun`.

Each leaf checks only its own requirements and reports every missing command before dispatch. The tool supports current macOS and Linux on architectures supported by those prerequisites.

## Compatibility rules

Within one `kisle` major version:

- existing command paths and option meanings do not change;
- output owned by `kisle` retains the prefixes and version shape above;
- scripts must treat child operation prose as human output unless that operation separately publishes a machine contract;
- new lifecycle commands may be added only as new explicitly scoped paths;
- the embedded harness SHA may advance in a patch or minor release only after this grammar's integration suite passes against it.

A breaking parser, scope, stream, or exit change requires a new `kisle` major version. Harness lifecycle prose may evolve without a `kisle` major release where dispatch and the published machine boundary remain compatible.
