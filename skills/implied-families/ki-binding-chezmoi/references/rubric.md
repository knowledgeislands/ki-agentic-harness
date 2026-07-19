<!-- GENERATED FILE: edit scripts/rubric/items/, not this publication. -->

# Generated rubric — binding-chezmoi

> **Generated publication.** The TypeScript rubric items under `scripts/rubric/items/` are canonical. Edit those definitions, then rerun `scripts/rubric/publish.ts`.

## BINDCHEZ — Chezmoi binding render path

→ [standard](standards.md)

The renderer-specific binding contract.

- **BINDCHEZ-1 [M] — chezmoi source repo is conventional** — The chezmoi source repo is available for the composed dotfiles audit. (standards.md)
- **BINDCHEZ-2 [M] — surfaces agree with the single source** — The renderer-neutral binding audit owns surface agreement. (standards.md)
- **BINDCHEZ-3 [M] — MCP source data is present** — The chezmoi repository carries supported MCP source data. (standards.md)
- **BINDCHEZ-4 [M] — render template is present** — The mcp-servers-json render template partial exists. (standards.md)
- **BINDCHEZ-5 [M] — render template is wired** — A surface target template references the render partial. (standards.md)
- **BINDCHEZ-6 [J] — render parity** — A chezmoi apply reproduces the surfaces ki-binding audits. (standards.md)
  - _Review prompt:_ Assess render parity from a previewed chezmoi diff.
- **BINDCHEZ-7 [J] — contract coherence** — The rubric, standard, and checker constants agree. (standards.md)
  - _Review prompt:_ Assess whether the binding-chezmoi contract remains coherent.
