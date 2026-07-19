<!-- GENERATED FILE: edit scripts/rubric/items/, not this publication. -->

# Generated rubric — tools

> **Generated publication.** The TypeScript rubric items under `scripts/rubric/items/` are canonical.

## TOOL — tool repository

→ [standard](standards.md)

Layout, executable, distribution, versioning, and judgment criteria.

- **TOOL-BIN [M] — Tool executable** — `bin/` exists and holds at least one file. (standards.md)
- **TOOL-EXEC [M] — Executable bit** — Every `bin/<file>` carries the executable bit. (standards.md)
- **TOOL-SCOPE [J] — One command** — The repository contains genuinely one tool rather than distinct commands. (standards.md)
  - _Review prompt:_ The repository contains genuinely one tool rather than distinct commands.
- **TOOL-XDG [J] — XDG storage** — The tool follows the XDG Base Directory specification for config, state, and cache. (standards.md)
  - _Review prompt:_ The tool follows the XDG Base Directory specification for config, state, and cache.
- **TOOL-INSTALL [M] — Installer executable** — `install.sh` is present and executable. (standards.md)
- **TOOL-INSTALL-QUALITY [J] — Installer quality** — The installer is POSIX-ish, honours overrides, verifies downloads, and is idempotent. (standards.md)
  - _Review prompt:_ The installer is POSIX-ish, honours overrides, verifies downloads, and is idempotent.
- **TOOL-VERSION [M] — Version flag** — The primary executable contains `--version` handling. (standards.md)
- **TOOL-VERSION-SOURCE [J] — Version source** — The version marker has one source of truth aligned with the latest tag and changelog. (standards.md)
  - _Review prompt:_ The version marker has one source of truth aligned with the latest tag and changelog.
- **TOOL-CHANGELOG [M] — Changelog presence** — `CHANGELOG.md` is present. (standards.md)
- **TOOL-CHANGELOG-FORMAT [J] — Changelog format** — The changelog follows Keep a Changelog and semantic versioning. (standards.md)
  - _Review prompt:_ The changelog follows Keep a Changelog and semantic versioning.
- **TOOL-CI [M] — CI workflow** — At least one workflow YAML file is present. (standards.md)
- **TOOL-TAP [J] — Companion formula** — A companion Homebrew formula exists in the governed tap. (standards.md)
  - _Review prompt:_ A companion Homebrew formula exists in the governed tap.
- **TOOL-TESTS [M] — Test directory** — A `tests/` directory is present. (standards.md)
- **TOOL-ENGINEERING [J] — Engineering declaration** — A package.json-bearing repository declares ki-engineering. (standards.md)
  - _Review prompt:_ A package.json-bearing repository declares ki-engineering.
- **TOOL-LANGUAGE [J] — Other-language toolchain** — A non-shell, non-JavaScript tool wires its own lint and test toolchain into CI. (standards.md)
  - _Review prompt:_ A non-shell, non-JavaScript tool wires its own lint and test toolchain into CI.
- **TOOL-RELEASE-CHECK [J] — Release alignment** — Version markers, tags, releases, and changelog entries agree. (standards.md)
  - _Review prompt:_ Version markers, tags, releases, and changelog entries agree.

## SHELL — shell capabilities

→ [standard](standards.md)

Shell-specific CI requirements.

- **SHELL-LINT [M] — Shell lint CI** — Shell entrypoints have a CI shellcheck reference. (standards.md)
- **SHELL-TEST [M] — Shell test CI** — Shell entrypoints have a Bats suite referenced by CI. (standards.md)

## LANG — language capabilities

→ [standard](standards.md)

Language toolchain deferral.

- **LANG-DEFER [M] — JavaScript toolchain deferral** — A package.json-bearing tool defers lint and test to ki-engineering. (standards.md)

## CONFIG — configuration

→ [standard](standards.md)

Applicability marker and validate-down keys.

- **CONFIG-1 [M] — Opt-in marker and keys** — A keyless `[ki-tools]` marker is present and validated down. (standards.md)
