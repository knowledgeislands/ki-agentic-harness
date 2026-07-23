<!-- GENERATED FILE: edit scripts/rubric/items/, not this publication. -->

# Generated rubric — dotfiles-chezmoi

> **Generated publication.** The TypeScript rubric items under `scripts/rubric/items/` are canonical; this file is generated from the in-memory catalogue. Edit the item definitions, then rerun `scripts/rubric/publish.ts`.

Line-by-line criteria for auditing ki-dotfiles-chezmoi. Classifications are derived from item aspects: **[M]** mechanical and **[J]** judgment. Sources are cited as declared by each canonical item.

## Contents

- [CHEZMOI — chezmoi repository shape](#chezmoi--chezmoi-repository-shape)
- [BIN — bin source naming](#bin--bin-source-naming)
- [GIT — Git hygiene](#git--git-hygiene)
- [PATTERN — app-mutated configuration](#pattern--app-mutated-configuration)
- [CONFIG — configuration editing](#config--configuration-editing)
- [LAYER — instruction layering](#layer--instruction-layering)
- [ETIQ — audit etiquette](#etiq--audit-etiquette)
- [SYNC — standard synchronisation](#sync--standard-synchronisation)

## CHEZMOI — chezmoi repository shape

→ [standard](standards.md)

Required repository-shape files and template support.

- **CHEZMOI-1 [M] — managed ignore file** — `.chezmoiignore` exists at the repository root. (standards.md)
- **CHEZMOI-2 [M] — template support directory** — When `*.tmpl` files exist, `.chezmoidata/` or `.chezmoitemplates/` also exists. (standards.md)
- **CHEZMOI-J1 [J] — chezmoiignore negation intent** — A `.chezmoiignore` negation is deliberate and documented rather than accidentally broad. (standards.md)
  - _Review prompt:_ Are `.chezmoiignore` negations deliberate, documented exceptions to broad ignores?

## BIN — bin source naming

→ [standard](standards.md)

Chezmoi source-attribute naming for direct bin files.

- **BIN-1 [M] — bin source-attribute prefix** — Every direct file in `bin/` carries a recognised chezmoi source-attribute prefix. (standards.md)

## GIT — Git hygiene

→ [standard](standards.md)

Stray lock files that block Git operations.

- **GIT-1 [M] — Git lock hygiene** — No stray `.git/*.lock` files remain in the repository. (standards.md)

## PATTERN — app-mutated configuration

→ [standard](standards.md)

Judgment criteria for Pattern A, Pattern B, and Pattern C selection.

- **PATTERN-J1 [J] — app-mutated config pattern choice** — Pattern A, Pattern B, or Pattern C is chosen correctly for each app-mutated configuration file. (standards.md)
  - _Review prompt:_ For each app-mutated configuration file, does the selected pattern match its template ownership, required native lifecycle visibility, and app-owned scope?
- **PATTERN-J2 [J] — native fragment-binding boundary** — Every Pattern C binding declares its ownership, removal, and adoption boundaries without importing secrets or undeclared application state. (standards.md)
  - _Review prompt:_ Does every native fragment binding state its canonical source, target, selector, ownership and removal policy, and explicit safe-adoption boundary?

## CONFIG — configuration editing

→ [standard](standards.md)

Judgment criteria for format-preserving Pattern A and Pattern C editors.

- **CONFIG-J1 [J] — format-preserving editor selection** — Every Pattern A or Pattern C writer uses an appropriate format-preserving edit API with safe absent-file and invalid-input behaviour. (standards.md)
  - _Review prompt:_ Do Pattern A and Pattern C writers use a format-appropriate edit API, define absent-file and path behaviour, fail closed, and demonstrate syntax preservation and idempotence?

## LAYER — instruction layering

→ [standard](standards.md)

Judgment criteria for repository, user, and memory guidance.

- **LAYER-J1 [J] — agent-instruction layering** — CLAUDE.md-style guidance is placed at the correct repo, user, or persistent-memory layer. (standards.md)
  - _Review prompt:_ Does each piece of CLAUDE.md-style guidance sit at the correct repo-local, user-level, or persistent-memory layer?

## ETIQ — audit etiquette

→ [standard](standards.md)

Judgment criteria for reporting before change.

- **ETIQ-J1 [J] — audit etiquette** — Audits report a file, concise problem, and options before any change is applied. (standards.md)
  - _Review prompt:_ Were findings reported with a file, concise problem statement, and options before a change was applied?

## SYNC — standard synchronisation

→ [standard](standards.md)

Judgment criteria for keeping the standard and implementation aligned.

- **SYNC-1 [J] — standard and rubric synchronisation** — The standard, structured rubric, and mechanical behaviour remain aligned when the standard changes. (standards.md)
  - _Review prompt:_ Do the standard, structured rubric items, and mechanical behaviour still agree?
