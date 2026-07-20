---
name: ki-self
ki-depends-on: []
description: >
  Repository-local governance for ki-agentic-harness. Use when making changes here to preserve generated governance integrity, verify source and vendored checker parity, maintain atomic commits, and follow this repository's runtime-neutral working practices.
argument-hint: 'audit | conform | educate | refresh | help'
---

# KI Self

## Purpose

`ki-self` governs repository-local practices that do not belong in a shared Knowledge Islands skill.

It complements the shared skills; it does not duplicate their standards.

## Local working practices

- Make the current contract correct, then conform existing footprints; do not retain compatibility paths unless a transition is explicitly required.
- This source harness has manifest-proven live links for direct vendored checker units. After changing one, run `bun run ki:bootstrap:audit` to verify source/vendor parity; re-bootstrap with `bun skills/keystone/ki-bootstrap/scripts/internal/repo-bootstrap/repo-bootstrap.ts .` only when the change affects generated bootstrap material such as rendered HELP, a launcher, aggregate bin, or manifest.
- Run `bun run test` and `bun run ki:audit` sequentially before completing a substantive change.
- Keep work recoverable: give concise progress updates during sustained work and commit each independently verified sensible unit with explicit paths.
- For a repository-footprint migration, search executable hooks, CI, and package entrypoints as well as source and guides; do not leave a legacy path in a staged-only execution route.
- When a migration removes a top-level path, stage that deletion explicitly and confirm it is absent from both the working tree and the committed tree after the commit.
- Work directly on `main` for small, self-contained changes; use an isolated branch only when it provides a real review boundary.

## Boundaries

Shared standards remain owned by their named skills, including `ki-authoring`, `ki-engineering`, `ki-skills`, `ki-repo`, and `ki-repo-roadmap`.

## Operating modes

HELP describes this local boundary and routes shared concerns to their owning skills.

### Mode AUDIT

Check this repository against its declared shared governance skills and review local working-state hygiene.

### Mode CONFORM

Apply safe mechanical remediation through the relevant shared skills, then re-run AUDIT.

### Mode EDUCATE

Explain the local workflow and prepare the repository's generated governance footprint.

### Mode REFRESH

Refresh only this committed `.ki/self/skill/` source against the repository's current practice. If a rule is reusable beyond this repository, stop and promote it to the relevant shared skill rather than copying it into local guidance.

### Mode HELP

Describe this local boundary and route shared concerns to their owning skills.
