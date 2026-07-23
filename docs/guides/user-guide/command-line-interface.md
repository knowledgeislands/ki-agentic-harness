# Command Line Interface

`ki` is the end-user Knowledge Islands command-line interface (CLI). It gives a person one stable command for KI work while keeping user-environment actions and repository actions visibly separate.

## General commands

```text
ki
ki help [doctor|completion]
ki --help
ki --version
ki completion <bash|zsh>
ki doctor
```

`ki`, `ki help`, and `ki --help` render the same root HELP and exit successfully. `-h` aliases `--help`; `-V` aliases `--version`. `ki --version` prints exactly `ki X.Y.Z` followed by one newline. Bash and Zsh completion write only completion source to standard output.

`ki doctor` currently writes this message to standard output, exits `0`, and does not inspect or change files, repositories, user configuration, network state, or child processes:

```text
Knowledge Islands diagnostics are coming soon. This command currently performs no checks and changes nothing.
```

## Skill installation and activation

The expected `ki skill ...` group will install a verified skill collection once for a user, then explicitly activate named skills in either global or repository scope. Repository activation will declare the skill in `.ki-config.toml` and link it into the selected runtime's project discovery location; global activation will link it only into the selected user runtime. Installing a collection does not activate every skill globally.

The exact leaf names and release contract remain to be adopted. `ki repo audit` and `ki repo conform` will resolve their declared skills from that installed collection rather than from copied repository checkers.

## Repository maintenance commands

The expected repository-maintenance forms are:

```text
ki repo audit
ki repo conform
ki repo audit --skill ki-repo-roadmap
```

- `ki repo audit` will resolve the selected repository physically, read its `.ki-config.toml`, and run the native audit operations registered by its declared skills.
- `ki repo conform` will use the same declared-skill resolution and apply only each registered operation's safe mechanical changes.
- `ki repo audit --skill ki-repo-roadmap` will run one declared skill's scoped audit.
- `bun run test` remains a maintainer self-test; the public contract deliberately defines no `ki repo test` leaf.

These commands are planned. They will not execute vendored `.ki/bin` wrappers or arbitrary skill scripts; the native implementation and migration contract are being defined before they enter HELP and completion.

## Acquisition commands

```text
ki acquire chatgpt import <capture-directory> --output <kep-directory> [--dry-run] [--json]
```

The command imports only locally user-provided capture material into a deterministic Knowledge Export Package (KEP). It does not control a browser, contact ChatGPT, read credentials or browser profiles, discover a repository, extract reusable knowledge, or govern Knowledge Base ingress.

## Installation

The installer places the executable in a user command directory. Its default is `~/.local/bin`; set `KI_CLI_INSTALL_DIR` to choose another directory. `KI_CLI_VERSION` selects a tagged release instead of the installer's default stable version.

The installer verifies the selected payload before an atomic replacement. It writes only under the selected command directory. If that directory is not on `PATH`, it names the installed path and gives the exact directory to add; it does not edit shell profiles or environment configuration.

## XDG locations

`ki` uses the XDG Base Directory environment variables for user-owned data. It will use `$XDG_DATA_HOME/ki` for installed skill collections, `$XDG_CONFIG_HOME/ki` for configuration, `$XDG_CACHE_HOME/ki` for disposable downloads, and `$XDG_STATE_HOME/ki` for mutable state. The standard defaults apply when a variable is unset: `~/.local/share`, `~/.config`, `~/.cache`, and `~/.local/state` respectively. It does not define a separate KI home variable.

## Help, diagnostics, and recovery

Help, version, and completion are CLI-owned output and use standard output. Grammar errors use standard error, exit `2`, and name the nearest help path:

```text
ki: error: <specific problem>
ki: try 'ki help <nearest-command-path>'
```

No command abbreviation or unknown option is accepted. Options belong to the command that owns them; no ambient lifecycle options exist.

When a command needs recovery, its own help states the route. Installation recovery is adding the named command directory to `PATH`.
