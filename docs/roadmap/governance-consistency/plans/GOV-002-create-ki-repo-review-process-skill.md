---
id: 'GOV-002'
title: Create ki-repo-review as a human-led process skill
status: open
roadmap: governance-consistency/create-ki-repo-review-as-a-human-led-process-skill
blocks: —
blocked-by: —
---

## Context

Repository reviews need a reusable process that helps a human gather evidence, surface material uncertainty, and route outcomes to the right durable home without pretending that an automated checklist can supply architectural judgment.

The completed dotfiles assessment established useful review and finding identifiers, but its repository-local review-record convention was retired after its delivery plan closed because neither `ki-repo-roadmap` nor `ki-plan` owns that lifecycle.

## Current state

`ki-repo-roadmap` governs thematic open work and `ki-plan` governs delivery-plan lifecycle, acceptance, and pruning.

Neither skill defines a review mandate, review records, finding identifiers, interview prompts, or review-evidence retention.

The completed `REV-001` dotfiles assessment and its delivery history provide a concrete forward-test source, but no active dotfiles review record remains.

## Steps

1. Reconstruct the reusable review method from the dotfiles assessment and its delivery history: evidence inventory, architecture and implementation lenses, material-uncertainty interviews, findings, decisions, and delivery routing.
2. Define `ki-repo-review` as a human-led process skill with clear invocation, inputs, stopping points, and boundaries; it must guide review work rather than generate an authoritative review verdict.
3. Define an optional, portable review-record and finding convention, including ownership, links to roadmap items and plans, and explicit retention or pruning rules without changing `ki-repo-roadmap` or `ki-plan` generic lifecycle semantics.
4. Add only the documentation, references, and focused verification needed to make the skill usable across repository styles; preserve repository-specific decisions as local records rather than embedding them in the shared skill.
5. Forward-test the process against the completed dotfiles assessment, validate its routing of findings to plans or Decision Records, and reconcile the user-guide skill map and generated skill graph.

## Files touched

- `skills/process/ki-repo-review/`
- `docs/guides/user-guide/skills.md`
- Generated skill-graph surface and focused process-skill tests or scenarios
- Any shared taxonomy or reference material required by the settled composition boundary

## Verify

1. A walkthrough based on the dotfiles assessment produces a review scope, evidence log, material uncertainties, findings, and explicit routes to plans or Decision Records without treating the process as automatic judgment.
2. The skill clearly distinguishes review working evidence from durable guidance, decisions, and delivery plans, and names its retention or pruning boundary.
3. `bun run ki:skills:audit`, `bun run ki:authoring:audit`, `bun run test`, and `bun run ki:audit` pass serially.
4. The generated skill graph and user-guide skills map agree with the new skill's composition edges.

## Dependencies / blocks

The plan is self-contained. It consumes the completed dotfiles review as an example and does not reopen its completed delivery plan or local review convention.
