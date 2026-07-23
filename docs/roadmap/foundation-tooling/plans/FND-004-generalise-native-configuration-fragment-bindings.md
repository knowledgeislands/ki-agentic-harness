---
id: 'FND-004'
title: Generalise native configuration-fragment bindings
status: ready
roadmap: foundation-tooling/generalise-native-configuration-fragment-bindings
blocks: —
blocked-by: —
---

## Context

The current `ki-dotfiles-chezmoi` standard offers surgical post-apply patches and whole-file template reverse merges for application-mutated configuration.

The completed dotfiles implementation demonstrates a third, reusable ownership shape: a native chezmoi `modify_` binding reconciles only declared fragments while preserving undeclared application state and participating in `chezmoi status`, `diff`, and `apply`.

## Current state

The shared standard does not yet name or bound fragment bindings, so a repository can adopt the mechanism without a reusable contract for ownership, live adoption, secrets, replacement semantics, format preservation, or verification.

The dotfiles repository is the initial case study. Its application-specific sources, selectors, and helper commands must remain local.

## Steps

1. Define the native fragment-binding pattern and its relationship to surgical patches and full-template reverse merges.
2. Specify the portable binding contract: canonical source, target, selectors or client applicability, ownership and removal policy, explicit adoption, and secret/template-expression boundaries.
3. Extend the format-preserving editor and verification guidance for `modify_` bindings, including absent-input behaviour, parsing, idempotence, and preservation of undeclared content.
4. Update the chezmoi skill overview, standards, and judgment rubric without embedding dotfiles-specific application data or scripts.
5. Add focused documentation or test coverage appropriate to the updated standard, then validate the skill and its generated surfaces.

## Files touched

- `skills/keystone/ki-dotfiles-chezmoi/`
- Its rubric, references, and focused tests or evaluation material
- Generated skill documentation only where the skill contract requires it
- This plan and its Foundation Tooling roadmap reference

## Verify

1. The standard distinguishes the three ownership shapes and provides a decision route for each.
2. A reader can state the binding scope, resulting lifecycle visibility, adoption boundary, and removal semantics before authoring a `modify_` binding.
3. The verification rule requires safe parse/write behaviour, unchanged undeclared data, and an idempotent second run.
4. `bun run ki:skills:audit`, `bun run ki:authoring:audit`, `bun run test`, and `bun run ki:audit` pass serially.

## Dependencies / blocks

This plan is informed by the completed dotfiles configuration-fragment implementation but is independently executable.
