<!-- GENERATED FILE: edit scripts/rubric/items/, not this publication. -->

# Generated rubric — plugins

> **Generated publication.** The TypeScript rubric items under `scripts/rubric/items/` are canonical.

## PLUG — Plugin marketplace projection

→ [standard](standards.md)

The marketplace manifest, generated plugin projection, and repository scaffold.

- **PLUG-1 [M] — marketplace manifest** — `.claude-plugin/marketplace.json` exists and parses. (standards.md)
- **PLUG-2 [M] — marketplace ownership** — `owner.name` is `Knowledge Islands`; `plugins` lists exactly one entry. (standards.md)
- **PLUG-3 [M] — plugin entry** — The plugin entry has `name`, `source = ./<name>`, and a description; the source directory exists. (standards.md)
- **PLUG-4 [M] — manifest formatting** — Plugin JSON manifests use two spaces and a trailing newline. (standards.md)
- **PLUG-5 [M] — plugin manifest** — `<plugin>/.claude-plugin/plugin.json` exists, parses, and its name matches the source directory. (standards.md)
- **PLUG-6 [M] — plugin author** — `author.name` is `Knowledge Islands`. (standards.md)
- **PLUG-7 [M] — plugin version and description** — `version` is semver and `description` matches the marketplace entry. (standards.md)
- **PLUG-8 [M] — projected skills** — `<plugin>/skills/*` each carries a `SKILL.md`. (standards.md)
- **PLUG-9 [M] — flattened agents** — `<plugin>/agents/*.md` are flat files. (standards.md)
- **PLUG-10 [M] — MCP deferral** — No `.mcp.json` appears in the plugin. (standards.md)
- **PLUG-11 [J] — projection freshness** — The projected skill and agent set matches the current harness. (standards.md)
  - _Review prompt:_ Does the projected skill and agent set match the current harness without stale or missing entries?
- **PLUG-12 [J] — projection reproducibility** — Re-running `ki:binding:build-plugin` leaves no diff. (standards.md)
  - _Review prompt:_ Is the complete projection byte-for-byte reproducible from the current harness?
- **PLUG-13 [M] — repository scaffold** — `LICENSE`, `README.md`, `.gitignore`, and `CLAUDE.md` are present. (standards.md)
- **PLUG-14 [M] — generated-content warning** — `CLAUDE.md` states the generated-not-hand-edited invariant. (standards.md)
- **PLUG-15 [M] — governance declaration** — Applicable repositories declare `[ki-plugins]` and no unknown keys. (standards.md)
- **PLUG-16 [J] — projection documentation** — `README.md` and `CLAUDE.md` describe the projection model without drift and the licence exception remains deliberate. (standards.md)
  - _Review prompt:_ Do the repository documents accurately describe the projection, generated-content boundary, and deliberate licence exception?
