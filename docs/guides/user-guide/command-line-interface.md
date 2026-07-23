# Knowledge Islands command-line interface

`ki` is the end-user Knowledge Islands command-line interface (CLI). It gives a person one stable command for KI work while keeping user-environment actions and repository actions visibly separate.

The CLI is being introduced in small, safe releases. The seed release establishes the executable, its installation route, and an honest diagnostic placeholder. The first substantive command then imports user-provided ChatGPT material into a Knowledge Export Package (KEP). Broader user and repository lifecycle operations follow later.

## Seed release

The first released surface is deliberately small:

```text
ki
ki help [doctor|completion]
ki --help
ki --version
ki completion <bash|zsh>
ki doctor
```

`ki`, `ki help`, and `ki --help` render the same root HELP and exit successfully. `-h` aliases `--help`; `-V` aliases `--version`. `ki --version` prints exactly `ki X.Y.Z` followed by one newline. Bash and Zsh completion write only completion source to standard output.

`ki doctor` is initially a no-op availability marker. It writes this message to standard output, exits `0`, and does not inspect or change files, repositories, user configuration, network state, or child processes:

```text
Knowledge Islands diagnostics are coming soon. This command currently performs no checks and changes nothing.
```

## Repository maintenance commands

The following public forms replace the harness-maintainer aggregate commands once their separately adopted lifecycle release activates them.

```text
ki repo audit
ki repo conform
ki repo audit --skill ki-repo-roadmap
```

- `ki repo audit` is the end-user form of the aggregate audit currently run in this repository as `bun run ki:audit`.
- `ki repo conform` is the corresponding safe mechanical write pass, currently `bun run ki:conform`.
- `ki repo audit --skill ki-repo-roadmap` is the scoped roadmap audit, currently `bun run ki:repo-roadmap:audit`.
- `bun run test` remains the harness self-test for maintainers. The public contract deliberately defines no `ki repo test` leaf.

Each `ki repo ...` command is a planned repository-scoped operation, not a seed command; it will appear in HELP and completion only after its receiving release is activated.

## Installation

The seed installer places the executable in a user command directory. Its default is `~/.local/bin`; set `KI_CLI_INSTALL_DIR` to choose another directory. `KI_CLI_VERSION` selects a tagged release instead of the installer’s default stable version.

The installer verifies the selected payload before an atomic replacement. It writes only under the selected command directory. If that directory is not on `PATH`, it names the installed path and gives the exact directory to add; it does not edit shell profiles or environment configuration.

## Availability and scope

The root help and completion list only commands available in the installed release. Before the acquisition release, `ki acquire` is reserved but unavailable: it writes `ki: error: ki acquire is not available in this release` to standard error, exits `2`, and does nothing else.

The next released command is:

```text
ki acquire chatgpt import <capture-directory> --output <kep-directory> [--dry-run] [--json]
```

It imports only locally user-provided capture material into a deterministic KEP. It does not control a browser, contact ChatGPT, read credentials or browser profiles, discover a repository, extract reusable knowledge, or govern Knowledge Base ingress.

The later `ki user ...` and `ki repo ...` command groups will keep the same explicit scope boundary: user commands affect only KI-managed user payload, while repository commands affect only the selected repository. They are not part of the seed release and must not be inferred from an unscoped command.

## Help, diagnostics, and recovery

Help, version, and completion are CLI-owned output and use standard output. Grammar errors use standard error, exit `2`, and name the nearest help path:

```text
ki: error: <specific problem>
ki: try 'ki help <nearest-command-path>'
```

No command abbreviation or unknown option is accepted. Options belong to the command that owns them; no ambient lifecycle options exist.

When a later command needs recovery, its own help states the route. The seed release’s only installation recovery is adding the named command directory to `PATH`.

## Release sequence

1. Seed executable: HELP, version, completion, installation, and no-op `ki doctor`.
2. User-assisted local ChatGPT acquisition into a KEP.
3. Explicitly scoped user and repository lifecycle commands.
4. Release packaging and Homebrew delivery after the executable’s behaviour is proven.

For the complete implementation contract, see the [CLI contract](../../../-/_HANDOFFS/ki/command-contract.md). The specification of KEP output is owned by KI Specifications; the executable is owned by `tools-ki`.
