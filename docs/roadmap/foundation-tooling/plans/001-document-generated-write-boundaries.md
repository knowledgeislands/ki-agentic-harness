---
id: '001'
title: Document generated-write boundaries
status: in-progress
roadmap: foundation-tooling/document-generated-write-boundaries
blocks: —
blocked-by: —
---

## Context

Bootstrap and project-link behaviour now distinguishes durable vendored governance, generated runtime copies, agent links, and deliberate local development links.

That implementation is safe, but its ownership and recovery boundaries are spread across skill contracts and tests.

## Current state

Users and maintainers have no one concise reference for which component owns each generated surface, what is committed, how normal copies differ from development links, or how to recover drift safely.

## Steps

1. [x] Inventory the existing bootstrap, scaffold, and project-link ownership contracts without changing their behaviour.
2. [x] Write one user/developer-facing boundary guide covering ownership, markers, copying versus development links, `.gitignore`, preservation, and safe recovery.
3. [x] Link the guide from the relevant bootstrap and onboarding documentation without duplicating normative rules.
4. [x] Run the authoring, skill, and aggregate gates; close the plan when the new guide accurately reflects the implementation.

## Files touched

- `docs/guides/`
- `skills/keystone/ki-bootstrap/`
- Relevant user-guide navigation or onboarding references

## Verify

- The guide names the owner and recovery route for every generated or linked surface.
- Normal generated copies and explicit local development links have distinct, unambiguous descriptions.
- `bun run ki:authoring:audit`
- `bun run ki:skills:audit`
- `bun run ki:audit`

## Dependencies / blocks

This documentation work is independent of the other Foundation Tooling plans.
