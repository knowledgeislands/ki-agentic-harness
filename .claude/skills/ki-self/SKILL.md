---
name: ki-self
description: >
  Repository-local governance for ki-agentic-harness. Use when making changes here to preserve generated governance integrity, verify source and vendored checker parity, maintain atomic commits, and follow this repository's runtime-neutral working practices.
argument-hint: 'audit | conform | educate | help'
---

# KI Self

## Purpose

`ki-self` governs repository-local practices that do not belong in a shared Knowledge Islands skill.

It complements the shared skills; it does not duplicate their standards.

## Local working practices

- Make the current contract correct, then conform existing footprints; do not retain compatibility paths unless a transition is explicitly required.
- After changing a coverage-scoped checker, re-vendor it with `bun skills/keystone/ki-bootstrap/scripts/lib/repo-bootstrap.ts .` before verification.
- Run `bun run test` and `bun run ki:audit` sequentially before completing a substantive change.
- Keep work recoverable: give concise progress updates during sustained work and commit each independently verified sensible unit with explicit paths.
- Work directly on `main` for small, self-contained changes; use an isolated branch only when it provides a real review boundary.

## Boundaries

Shared standards remain owned by their named skills, including `ki-authoring`, `ki-engineering`, `ki-skills`, `ki-repo`, and `ki-project-roadmap`.

## Modes

- **AUDIT** — check this repository against its declared shared governance skills and review local working-state hygiene.
- **CONFORM** — apply safe mechanical remediation through the relevant shared skills, then re-run AUDIT.
- **EDUCATE** — explain the local workflow and prepare the repository's generated governance footprint.
- **HELP** — describe this local boundary and route shared concerns to their owning skills.
