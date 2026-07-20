<!-- GENERATED FILE: edit scripts/rubric/items/, not this publication. -->

# Generated rubric — repository bootstrap

> **Generated publication.** The TypeScript rubric items under `scripts/rubric/items/` are canonical; this file is generated from the in-memory catalogue. Edit the item definitions, then rerun `scripts/rubric/publish.ts`.

Line-by-line criteria for auditing ki-bootstrap. Classifications are derived from item aspects: **[M]** mechanical and **[J]** judgment. Sources are cited as declared by each canonical item.

## BOOT — repository bootstrap and generated governance payloads

→ [standard](standards.md)

Project-local runtime publication and the vendored self-sufficiency surface.

- **BOOT-1 [M] — runtime skill directories mirror declared coverage** — For each declared runtime, the project-local skills directory mirrors the repository's declared coverage. Ordinary repositories receive complete generated regular-file copies; a harness links its own canonical source skills. Missing, extra, invalidly linked, or source-drifted payloads are WARN; an unresolvable declaration or dependency is FAIL and must be reconciled by hand. A valid committed `ki-self` skill is preserved as the local-governance exception. ([KR], [AH], [ADR-KI-HARNESS-007])
- **BOOT-3 [M] — runtime skill directories are gitignored** — Each declared runtime's project-local skills directory is gitignored because its published payloads are generated and never committed. CONFORM writes the recognised trailing-slash entry and creates `.gitignore` when needed. ([KR], [KH])
- **BOOT-4 [J] — declared governance coverage is correct for the repository** — The repository opts into the skills it actually uses. This is `ki-repo`'s coverage cascade rather than a bootstrap mutation; wrong declarations are corrected through that owner rather than by hand-linking. ([KR])
  - _Review prompt:_ Does the repository declare the governance skills its actual artifacts and responsibilities require?
- **BOOT-6 [M] — governance agent directories mirror the declared agent set** — Each supported runtime's governance agent directory mirrors the available governance agents when the repository declares `[ki-agents]`, and is empty otherwise, with no missing, extra, or dangling managed links. ([KH])
- **BOOT-8 [M] — governance agent directories are gitignored** — Each supported runtime's generated governance agent directory is gitignored when applicable, because managed agent links are regenerated rather than committed. ([KH])
- **BOOT-9 [M] — vendored checker set matches the resolved governance set** — `.ki/bootstrap/checkers/` mirrors the explicitly declared, resolvable checker-bearing governance set with no injected baseline. Missing or extra generated checkers are WARN; missing dependencies or unresolvable declarations are FAIL and are never guessed or renamed mechanically. ([KR], [AH], [ADR-KI-HARNESS-006])
- **BOOT-11 [M] — direct vendored checker units match canonical source bytes** — When the target carries matching canonical skill sources, every direct file-kind AUDIT and CONFORM unit in `.ki/bootstrap/checkers/` is a regular file matching its canonical source byte-for-byte. Drift is a commit-blocking FAIL repaired by restoring source and re-running EDUCATE; a bootstrapped-only target reports NOT_APPLICABLE. ([AH], [ADR-KI-HARNESS-006])
- **BOOT-12 [M] — educator payloads match the resolved governance set** — `.ki/bootstrap/educators/` contains one regular, non-symlinked target-local EDUCATE launcher for every resolved skill declaring `educate`, with no missing, extra, or unsafe payloads. EDUCATE restores or prunes this generated surface. ([AH], [ADR-KI-HARNESS-006])
- **BOOT-13 [M] — source harness shared payloads are declared canonical links** — A source harness has no copied or undeclared payload beneath canonical `skills/**/scripts/vendored/`: every payload is declared by `ki-shared-dependencies` and resolves as a link to its provider. This source-only rule never applies to deliberately self-contained `.ki/bootstrap/` copies or ordinary repository payloads. ([AH], [ADR-KI-HARNESS-006])
- **BOOT-10 [J] — aggregate governance includes each governed skill's judgment criteria** — Whenever vendored checkers are present, AUDIT and CONFORM apply each governed skill's judgment criteria after the mechanical aggregate, using a matching governance lead where one exists and the generated readable rubric otherwise. The mechanical checker reports this work only through the unevaluated judgment count. ([KS], [ADR-KI-HARNESS-SKILLS-001], [ADR-KI-HARNESS-SKILLS-010])
  - _Review prompt:_ Did the aggregate review apply every governed skill's judgment criteria as well as its mechanical checker output?
