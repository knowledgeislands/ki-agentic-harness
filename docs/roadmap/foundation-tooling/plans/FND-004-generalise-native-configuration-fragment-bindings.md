---
id: 'FND-004'
title: Generalise native configuration-fragment bindings
status: acceptance
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

- [x] Define the native fragment-binding pattern and its relationship to surgical patches and full-template reverse merges.
- [x] Specify the portable binding contract: canonical source, target, selectors or client applicability, ownership and removal policy, explicit adoption, and secret/template-expression boundaries.
- [x] Extend the format-preserving editor and verification guidance for `modify_` bindings, including absent-input behaviour, parsing, idempotence, and preservation of undeclared content.
- [x] Update the chezmoi skill overview, standards, and judgment rubric without embedding dotfiles-specific application data or scripts.
- [x] Add focused documentation or test coverage appropriate to the updated standard, then validate the skill and its generated surfaces.

## Files touched

- `skills/repo-structure/ki-dotfiles-chezmoi/`
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

## Acceptance

### Delivered

`ki-dotfiles-chezmoi` now defines Pattern C, a native chezmoi `modify_` fragment binding, alongside its surgical-patch and full-template/reverse-merge patterns.

### Summary of changes

- Added the portable Pattern C decision rule, ownership/adoption/removal contract, and format-preserving verification requirements to the chezmoi standard.
- Added `PATTERN-J2` to the judgment rubric and focused publication-test coverage for the generated rubric.
- Kept concrete dotfiles applications, client selectors, and helper scripts out of the shared standard.

### Verification

- `bun run ki:skills:audit` — no FAIL; two existing `KI-SHAPE-7` warnings remain.
- `bun run ki:authoring:audit`, `bun run test`, and `bun run ki:audit` — passed at current `HEAD` (`8da25d17`).
- Implementation evidence: `eef753c1` (`Add native fragment binding pattern`).

### Outstanding concerns

The standard is a contract and rubric, not a universal executable fixture suite; each repository still has to prove its chosen binding against its live application format and ownership boundary.

### Mini recap

Native lifecycle visibility is a distinct ownership requirement, not merely an implementation detail of a post-apply patch. No further route is proposed.
