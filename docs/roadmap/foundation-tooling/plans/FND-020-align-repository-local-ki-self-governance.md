---
id: 'FND-020'
title: Align the repository-local ki-self governance contract
status: ready
roadmap: foundation-tooling/align-the-repository-local-ki-self-governance-contract
blocks: FND-015, FND-016, FND-017, FND-018, FND-019, RTP-001
blocked-by: —
---

## Context

The FND-015 governed-entrypoint prototype prompted a direct review of this repository's local `ki-self` guidance.

That review found three connected sources of drift: FND-013's same-harness source links make unconditional re-vendoring unnecessary for linked checker payloads; `ki-skills` evaluates the deliberately local `.ki/self/skill/` source as an ordinary indexed governance skill; and some guidance still names the retired `.ki-self/` location.

## Current state

`ki-bootstrap`'s current standard names `.ki/self/skill/` as the one committed repository-local governance-skill exception. It is not in the shared skill index or a vendored coverage set, and runtime publication projects it into each declared runtime.

The local skill's working guidance is valuable and was followed during FND-015: current-state migration, serial verification, explicit-path commits, and explicit removal checks. Its blanket re-vendoring rule predates source-harness linking, however, and the generic `ki-skills` audit reports structural failures that are intentional for this local source layout.

## Steps

1. Establish the current local-skill boundary from the bootstrap standard, publisher, cleaner, and runtime-link tests. Confirm the precise distinction between a harness's live source links and an ordinary repository's copied vendored payload.
2. Update `.ki/self/skill/SKILL.md` so its guidance states the linked-payload verification rule accurately: re-bootstrap when generated bootstrap material changes; otherwise use the appropriate bootstrap parity/audit gate for live source links. Retain the existing current-state, serial-gate, atomic-commit, and explicit-removal rules.
3. Give the local skill the lightweight governance metadata and mode documentation that remain meaningful locally, while preserving its intentional exemption from shared vendoring and the indexed-directory naming shape.
4. Teach the `ki-skills` rubric/context about the single proven `.ki/self/skill/` exception. It must remain narrow, read-only in detection, and never exempt ordinary misplaced or unindexed `ki-*` skills. Republish the generated readable rubric and add focused fixtures for both the valid exception and invalid lookalikes.
5. Reconcile current user/developer/bootstrap guidance with `.ki/self/skill/`. Update only current-state documentation; preserve historical decision records unless they actively prescribe the retired location.
6. Run the relevant focused bootstrap, skills, and documentation gates; then run serial `bun run test` and `bun run ki:audit`. Present the updated local contract for acceptance before marking the plan done.

## Files touched

- `.ki/self/skill/SKILL.md` — local guidance, metadata, and mode documentation.
- `skills/keystone/ki-skills/scripts/rubric/` and generated `references/rubric.md` — narrowly recognised local-skill exception and tests.
- `skills/keystone/ki-bootstrap/references/`, publisher/cleaner tests, and current user/developer guides — canonical local-source location and linked-payload verification guidance.
- `docs/roadmap/` — this plan and its generated index/projection.

## Verify

1. A valid `.ki/self/skill/` source audits without false name, vendoring, or mode-shape failures while an ordinary nonconforming skill still fails the corresponding rules.
2. The local guidance distinguishes live source links from copied consumer payloads and names the correct verification/re-bootstrap route for each.
3. Current-state guides consistently name `.ki/self/skill/`; retained historical decisions are either already accurate or clearly not normative.
4. Focused `ki-skills` and bootstrap tests pass, followed serially by `bun run test` and `bun run ki:audit`.

## Dependencies / blocks

This plan is the immediate priority before every other open or in-progress plan. It resolves the repository-local rule layer those plans rely on; FND-003 remains in acceptance and FND-013 remains done, so neither is blocked.
