# Knowledge Islands command-line interface (CLI) contract

**Contract version:** 1

This contract is the harness-owned boundary for the installable Knowledge Islands command-line interface (CLI), invoked as `ki`. The `tools-ki` repository owns its implementation and `homebrew-tap` owns its Homebrew delivery; neither may redefine the lifecycle operations below.

## Initial grammar

```text
ki
ki help [user install|repo bootstrap|repo educate|repo audit|repo conform|repo clean|completion]
ki --help
ki --version
ki completion <bash|zsh>

ki user install [--runtime <claude-code|codex>]... [--ref <ref>] [--dry-run] [--check]

ki repo bootstrap [target] [--ref <ref>] [--dry-run] [--verbose]
ki repo educate [skill] [--dry-run] [--verbose]
ki repo audit [--skill <ki-skill>] [--progress <auto|always|never>]
              [--progress-style <single|multi>] [--reporter-levels <levels>]
ki repo conform [--skill <ki-skill>] [--dry-run]
                [--progress <auto|always|never>]
                [--progress-style <single|multi>] [--reporter-levels <levels>]
ki repo clean [target] [--ref <ref>] [--dry-run]
```

With no arguments, `ki` renders the same root help as `ki help` and exits successfully. `-h` is accepted wherever `--help` is accepted, and `-V` aliases `--version`. Options belong to their leaf command; there are no ambient lifecycle options.

`target` defaults to the current working directory. A leaf accepts at most one positional target or skill. `--` ends option parsing where a positional value is permitted. An option requiring a value rejects a missing value before dispatch. The initial release accepts no abbreviated groups, commands, options, runtimes, progress modes, or skill names, and forwards no unknown argument.

## Command semantics

### `ki user install`

Installs or verifies only KI-managed user payload. It never reads, bootstraps, audits, or changes a repository.

- `--runtime` may repeat; without it, the installer retains its current detection rule for conformant Claude Code and Codex runtime homes.
- `--ref` selects the harness revision, defaulting to the immutable compatible revision embedded in the `ki` release.
- `--dry-run` reports the complete selected installation plan without changing user-managed state.
- `--check` verifies the selected installed payload without changing it; it is mutually exclusive with `--dry-run`.

Repeated installation at the same revision and runtime selection converges on the same managed payload. It does not write runtime settings, bootstrap a repository, or install development links.

### `ki repo bootstrap`

Obtains temporary harness source and bootstraps the selected repository. It is the initial-adoption and explicit revision-acquisition command.

- `target` defaults to the current directory.
- `--ref` defaults to the immutable compatible revision embedded in the `ki` release.
- `--dry-run` obtains any temporary source needed to calculate the plan but changes neither repository nor user state.
- `--verbose` requests per-file bootstrap reporting from the public launcher.

The command writes only inside the selected repository through the public bootstrap operation. It never installs user payloads. Repeating it at the same revision converges on the declared generated footprint.

### `ki repo educate`

Runs the selected repository's vendored `./.ki/bin/ki-educate` from its physical git root. With no `skill`, it refreshes the complete governed set; with one canonical `ki-*` skill it refreshes that governed skill only.

- `--dry-run` reports the education plan without changing repository state.
- `--verbose` requests per-file reporting.
- No `--ref` is accepted: use `ki repo bootstrap --ref <ref>` to acquire a revision.

If the entrypoint is absent, including after CLEAN, the command fails with the direct recovery instruction `ki repo bootstrap`. It never falls back to a user-installed skill or moving remote source.

### `ki repo audit` and `ki repo conform`

AUDIT runs `./.ki/bin/ki-audit audit` from the physical git root, is read-only, and returns the vendored aggregate result. CONFORM runs `./.ki/bin/ki-conform` and applies only vendored safe mechanical fixes.

- `--skill` requires one canonical `ki-*` name.
- `--progress`, `--progress-style`, and `--reporter-levels` follow the vendored aggregate grammar after CLI validation.
- AUDIT rejects `--dry-run`; CONFORM forwards its write-free preview mode.

If either entrypoint is absent, the command fails and recommends `ki repo bootstrap`. It never substitutes a harness checkout or user-installed checker.

### `ki repo clean`

Obtains temporary harness source and removes only ownership-proven generated repository state. It preserves adoption intent, authored `.ki/self/skill/`, altered or unfamiliar material, and all user-level installation.

- `target` defaults to the current directory.
- `--ref` selects the source-owned CLEAN implementation, defaulting to the immutable compatible revision embedded in the `ki` release.
- `--dry-run` reports the complete proven removal set without changing repository or user state.

Its recovery route is `ki repo bootstrap`, which acquires source and runs the EDUCATE chain. CLEAN is not UNINSTALL, and a repeat after successful CLEAN makes no broader ownership inference.

### HELP, version, and completion

`ki help` / `ki --help` render root help without invoking a lifecycle operation. `ki help <path>` and `<path> --help` render the same leaf help and name only commands available in that release.

`ki --version` / `ki -V` print exactly `ki X.Y.Z` followed by one newline. The version is the `tools-ki` release version, not the embedded harness revision.

`ki completion bash` and `ki completion zsh` print completion source to standard output. Completion contains only available commands and options and never inspects or changes either scope.

## Reserved lifecycle forms

These paths are reserved but not initial surface:

```text
ki repo doctor
ki user doctor
ki repo uninstall
ki user uninstall
```

The parser must not implement, list, or complete them until their receiving plan activates them. Before activation, a reserved path writes `ki: error: <path> is not available in this release` to standard error, exits `2`, and performs no discovery or dispatch.

Unscoped `ki doctor` and `ki uninstall` are permanently invalid. No compatibility alias may infer `repo` or `user`.

## Dispatch and trust boundaries

`ki` is a dispatcher over public contracts, not another lifecycle engine.

- User installation dispatches the stable public user-install launcher with selected runtime, pinned ref, and mode flags.
- Repository bootstrap and CLEAN dispatch their stable public temporary-source launchers with physical target and pinned ref.
- EDUCATE, AUDIT, and CONFORM dispatch only the named executable below the selected repository's `.ki/bin/`.
- No command invokes `scripts/internal/`, a harness-maintainer package script, a source checkout found elsewhere on disk, or a user-installed skill as fallback.

Temporary-source commands may use a private temporary directory and HTTPS transport, clean it on success, error, or signal, and never use it as an installation location.

Each `ki` release records one full compatible harness commit SHA. `--ref` is an expert override that accepts only a non-empty ref containing ASCII letters, digits, `.`, `_`, `/`, and `-`; it rejects whitespace, controls, URL delimiters, a leading `-`, and `..` components before network access. The CLI downloads launchers completely before execution and stops on transport or integrity failure.

## Repository resolution

EDUCATE, AUDIT, and CONFORM find the git root with `git rev-parse --show-toplevel`, physically resolve it, and reject unsafe or missing roots. They do not walk upward for a convenient `.ki/` directory or cross a symlinked repository boundary.

Bootstrap and CLEAN physically resolve their explicit or default target before dispatch. Missing, non-directory, unsafe-link, or resolution failure is an operation error; the selected lifecycle implementation retains its stronger ownership and transaction checks.

## Output and exit contract

CLI-owned help, version, and completion use standard output. CLI diagnostics use standard error:

```text
ki: error: <specific problem>
ki: try 'ki help <nearest-command-path>'
```

The second line is omitted when a single recovery command is more useful, such as `ki repo bootstrap` for a missing vendored runner. After dispatch, the child inherits all three streams; `ki` never captures, reorders, recolours, parses, summarises, or relabels its output. It prints no success banner.

- `0` means the requested command, help, version, completion, check, or dry-run completed successfully.
- `2` means the CLI rejected its grammar before dispatch.
- After dispatch, `ki` returns the child status unchanged.
- A CLI preflight, transport, integrity, dependency, or repository-resolution failure returns `1`.
- Signal termination retains the shell's conventional signal-derived status after temporary cleanup.

## Runtime and compatibility

The `ki` executable is one Bash 3.2-compatible script with no package-manager or language-runtime dependency for HELP, version, or completion. Local EDUCATE, AUDIT, and CONFORM require `bash`, `git`, and `bun`; temporary-source user install, bootstrap, and CLEAN require `bash`, `curl`, `tar`, and `bun`. Each leaf checks only its own prerequisites.

Within one `ki` major version, existing command paths and option meanings remain stable; CLI-owned output retains the prefixes and version shape above; new lifecycle commands use new explicitly scoped paths; and the embedded harness SHA advances only after the integration suite passes. Breaking parser, scope, stream, or exit changes require a new `ki` major version.
