<!-- GENERATED FILE: edit scripts/rubric/items/, not this publication. -->

# Generated rubric — homebrew-tap

> **Generated publication.** The TypeScript rubric items under `scripts/rubric/items/` are canonical.

## TAP — tap structure

→ [standard](standards.md)

Formula layout, local Homebrew evidence, and judgment prompts.

- **TAP-1 [M] — formula directory** — `Formula/` exists and contains at least one Ruby formula. (standards.md)
- **TAP-2 [M] — formula class** — Each formula has a `class <Camel> < Formula` declaration. (standards.md)
- **TAP-3 [M] — formula fields** — Each formula has the required metadata, install method, and test block. (standards.md)
- **TAP-4 [M] — formula description style** — Formula descriptions are no more than 80 characters and do not start with an article. (standards.md)
- **TAP-5 [M] — versioned source URLs** — Formula URLs use a tagged-release tarball rather than a branch or HEAD. (standards.md)
- **TAP-6 [M] — formula discoverability** — README.md lists every formula by name. (standards.md)
- **TAP-7 [M] — Homebrew audit** — When available, Homebrew style and strict audit run for every formula. (standards.md)
- **TAP-J1 [J] — tap naming** — The repository name follows Homebrew tap naming conventions. (standards.md)
  - _Review prompt:_ Does the repository name follow the `homebrew-<name>` convention without an unsafe rename?
- **TAP-J2 [J] — meaningful formula test** — Each `test do` block exercises an installed binary rather than a placeholder. (standards.md)
  - _Review prompt:_ Does each formula test exercise its installed binary with a meaningful assertion?
- **TAP-J3 [J] — install correctness** — Each install block installs the artefact the tool actually ships. (standards.md)
  - _Review prompt:_ Does each `def install` block install the artefact the tool actually ships?
- **TAP-J4 [J] — source integrity** — Checksums and release tags correspond to the declared source archive. (standards.md)
  - _Review prompt:_ Do each source URL, version, and checksum correspond to the intended release archive?
- **TAP-J5 [J] — fresh README entries** — README formula rows have accurate descriptions and source links. (standards.md)
  - _Review prompt:_ Are README formula rows complete, current, and accurate?
- **TAP-J6 [J] — CI Homebrew coverage** — Tap CI runs `brew test-bot` when local Homebrew is unavailable. (standards.md)
  - _Review prompt:_ When local Homebrew is unavailable, does CI run the appropriate Homebrew test-bot checks?

## CONFIG — configuration

→ [standard](standards.md)

Identity marker and keyless configuration.

- **CONFIG-1 [M] — identity marker** — `.ki-config.toml` contains a keyless `[ki-homebrew-tap]` marker with no unknown keys. (standards.md)
