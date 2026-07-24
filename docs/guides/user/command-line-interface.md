# Command Line Interface

`ki` is the end-user Knowledge Islands command-line interface (CLI). It gives a person one stable command for KI work while keeping user-environment actions and repository actions visibly separate.

## Command groups

`[current]` means the command is implemented and appears in `ki help` and completion output. `[planned]` documents the target interface only: it is not executable yet and may change before release.

### Interface and diagnostics

```text
[current] ki
[current] ki help <command>
[current] ki --help
[current] ki --version
[current] ki version
[current] ki completions <bash|zsh>
[current] ki doctor [--json]
[current] ki paths [--json]
[planned] ki docs
```

### Acquisition

```text
[current] ki acquire chatgpt import <capture-directory> --output <kep-directory> [--dry-run] [--json]
```

### Harness and capability management

```text
[planned] ki list
[planned] ki harness install <harness-id>
[planned] ki harness uninstall <harness-id>
[planned] ki harness list
[planned] ki harness info <harness-id>
[planned] ki missing
[planned] ki outdated
[planned] ki install <capability>
[planned] ki reinstall <capability>
[planned] ki uninstall <capability>
[planned] ki update
[planned] ki upgrade
[planned] ki search
[planned] ki cleanup
```

### Scoped capability activation

```text
[planned] ki repo skill add <skill>
[planned] ki repo skill remove <skill>
[planned] ki user skill add <skill>
[planned] ki user skill remove <skill>
```

### Repository maintenance

```text
[planned] ki repo audit [--repo <path>] [--skill <skill>]
[planned] ki repo conform [--repo <path>] [--skill <skill>] [--dry-run]
```

`ki`, `ki help`, and `ki --help` render the same root HELP and exit successfully. `-h` aliases `--help`; `-V` aliases `--version`; `ki version` is equivalent to `ki --version` and prints exactly `ki X.Y.Z` followed by one newline. `ki completions` writes Bash or Zsh completion source to standard output.

`ki paths` prints the invoked executable path and resolved XDG data, configuration, cache, and state paths without creating them. `ki doctor` prints the CLI version, whether it is a regular executable or a development link, and those resolved paths. `--json` on either command emits a versioned machine-readable result; `ki doctor --json` also reports the resolved repository when one is found. They exit `0` and do not change repository state, network state, or child processes.

> [!NOTE] `ki doctor` establishes only the local CLI and XDG baseline. Harness health, capability activation, and repository diagnostics are planned work.

## General commands [planned]

The following target commands do not yet appear in `ki help` or completion output, but are shown as `[planned]` in the `ki(1)` command map:

```text
ki missing
ki outdated
ki install <capability>
ki reinstall <capability>
ki uninstall <capability>
ki update
ki upgrade
ki list
ki search
ki cleanup
ki docs
```

`ki list` will list installed harnesses and their capabilities, including user activation and, when the current working directory resolves to a KI repository, repository activation. Its status is therefore grounded in the invocation directory. Filtering and alternative output forms are later work.

`ki missing` will report declared capabilities that are absent from their selected activation scope. `ki outdated` will report installed harnesses or activated capabilities with a newer available latest release. `ki install`, `ki reinstall`, and `ki uninstall` are the future package-management forms for a named capability; their exact relationship to the explicit `ki repo skill add/remove` and `ki user skill add/remove` commands remains to be settled before implementation.

`ki update` will update the `ki` executable and refresh installed harnesses to their newest verified latest releases. `ki upgrade` will apply available newer capability releases to the resolved repository context, without changing unrelated user or repository activation. Neither command exists in the seed release.

## Harness installation

The planned `ki harness ...` group manages the verified, user-installed set of KI-compatible harnesses:

```text
ki harness install <harness-id>
ki harness uninstall <harness-id>
ki harness list
ki harness info <harness-id>
```

A harness identifier is a stable, qualified name such as `knowledgeislands/ki-agentic-harness` or `hnr/hnr-harness`. `ki harness install` will resolve that name only through the reviewed immutable release evidence in `$XDG_CONFIG_HOME/ki/harnesses.toml`, verify the release, and atomically install it into the user's XDG data area. It never accepts a floating branch, arbitrary URL, local path, or nearby checkout as a substitute.

`knowledgeislands/ki-agentic-harness` is the mandatory base harness. `ki` ensures it is installed, and refuses to uninstall it. Additional harnesses make their registered skills available for explicit activation; installing a harness does not activate every skill in it.

`ki harness list` is the focused harness inventory: installed identity, source evidence, capability counts and kinds, and installation health. `ki harness info <harness-id>` presents the corresponding record for one harness.

The initial model treats each installed harness as `latest`; there is no user-selectable harness or capability version yet. A later versioning model will retain `latest` and add sibling installed records for each version in use, with explicit resolution and compatibility evidence.

## Skill activation

The planned skill commands make the activation scope explicit:

```text
ki repo skill add <skill>
ki repo skill remove <skill>
ki user skill add <skill>
ki user skill remove <skill>
```

A fully qualified skill name is `<harness-id>:<skill-name>`:

```text
ki repo skill add knowledgeislands/ki-agentic-harness:ki-repo-roadmap
ki user skill add hnr/hnr-harness:hnr-engineering
```

`<skill-name>` is the exact `name:` in the installed skill's `SKILL.md`. A bare skill name is accepted only when exactly one installed harness provides it; `ki` stores the resolved qualified name in repository configuration and refuses an ambiguous name.

- `ki repo skill add` updates the selected repository's `.ki-config.toml` and creates only managed project-runtime discovery links.
- `ki repo skill remove` removes that repository declaration and its owned project-runtime links; it does not uninstall the harness or remove user activation.
- `ki user skill add` creates only managed discovery links in the selected user runtime.
- `ki user skill remove` removes only those owned user-runtime links.

Every activation first requires a valid installed harness and a registered matching skill. It fails with recovery guidance instead of downloading or replacing a harness automatically.

Capability activation will support two managed projection modes: `vendor`, a regular-file copy into the selected runtime discovery location, and `symlink`, a contained managed link to the verified installed harness. Neither mode permits the retired `.ki/bin` executor or an arbitrary checkout to become an operation source. The final command option spelling and default remain open.

These commands are planned; [FND-004](../../roadmap/foundation-tooling/plans/FND-004-define-compatible-harness-registration.md) defines their native-operation boundary.

## Repository maintenance commands

Every planned `ki repo` command accepts `--repo <path>`. With that option, `<path>` must resolve physically to the repository base and directly contain a regular `.ki-config.toml`; `ki` does not search its ancestors. Without it, `ki` resolves the physical current working directory and then each ancestor, selecting the nearest directory that directly contains a regular `.ki-config.toml` and is the Git worktree root. It never treats the user's home directory or filesystem root as a repository candidate.

The expected repository-maintenance forms are:

```text
ki repo audit [--repo <path>]
ki repo conform [--repo <path>]
ki repo audit --skill <skill> [--repo <path>]
```

- `ki repo audit` will resolve the selected repository, read its `.ki-config.toml`, and run the native audit operations registered by its declared skills.
- `ki repo conform` will use the same declared-skill resolution and apply only each registered operation's safe mechanical changes.
- `ki repo audit --skill <skill>` will run one declared skill's scoped audit.
- `bun run test` remains a maintainer self-test; the public contract deliberately defines no `ki repo test` leaf.

These commands are planned. They will not execute vendored `.ki/bin` wrappers or arbitrary skill scripts; the native implementation and migration contract are being defined before they enter HELP and completion.

## Acquisition commands

```text
ki acquire chatgpt import <capture-directory> --output <kep-directory> [--dry-run] [--json]
```

The command imports only locally user-provided capture material into a deterministic Knowledge Export Package (KEP). It does not control a browser, contact ChatGPT, read credentials or browser profiles, discover a repository, extract reusable knowledge, or govern Knowledge Base ingress.

## Installation

The installer places the executable in a user command directory. Its default is `~/.local/bin`; set `KI_CLI_INSTALL_DIR` to choose another directory. `KI_CLI_VERSION` selects a tagged release instead of the installer's default stable version.

The installer verifies the selected payload before an atomic replacement. It installs the executable under the selected command directory and `ki(1)` under `$KI_MAN_INSTALL_DIR` or the corresponding sibling `share/man/man1` directory. If the command directory is not on `PATH`, it names the installed path and gives the exact directory to add; it does not edit shell profiles or environment configuration.

## XDG locations

`ki` uses the XDG Base Directory environment variables for user-owned data. It will use `$XDG_DATA_HOME/ki` for installed harnesses, `$XDG_CONFIG_HOME/ki/harnesses.toml` for reviewed harness release evidence, `$XDG_CACHE_HOME/ki` for disposable downloads, and `$XDG_STATE_HOME/ki` for mutable state. The standard defaults apply when a variable is unset: `~/.local/share`, `~/.config`, `~/.cache`, and `~/.local/state` respectively. It does not define a separate KI home variable.

## Help, diagnostics, and recovery

Help, version, and completion are CLI-owned output and use standard output. Grammar errors use standard error, exit `2`, and name the nearest help path:

```text
ki: error: <specific problem>
ki: try 'ki help <nearest-command-path>'
```

No command abbreviation or unknown option is accepted. Options belong to the command that owns them; no ambient lifecycle options exist.

When a command needs recovery, its own help states the route. Installation recovery is adding the named command directory to `PATH`.
