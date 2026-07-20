# Plan format

Plans exist only in the thematic profile and only for `Blocking` or `Next` items.

## Placement

```text
docs/roadmap/<theme>/plans/<THEME>-<NNN>-<slug>.md
```

`<theme>` matches the canonical roadmap directory. `<THEME>` is that roadmap's authored uppercase `code`; `<NNN>` is a zero-padded serial of at least three digits, allocated within that code from `001`. Together they form the quoted, globally unique canonical plan identifier `<THEME>-<NNN>`. `<slug>` is lowercase kebab-case and no longer than 50 characters.

## Frontmatter

```yaml
---
id: 'HOK-004'
title: Short descriptive title
status: open
roadmap: hooks/promote-plan-mode-plans
blocks: —
blocked-by: —
---
```

- `status` is `open`, `in-progress`, `acceptance`, or transient `done`. `acceptance` means planned work and verification are complete and the plan awaits the user's explicit acceptance.
- `roadmap` is a qualified `<theme>/<item-slug>` locator for an item in `Blocking` or `Next`; its theme must match the plan directory.
- `blocks` and `blocked-by` are comma-separated canonical `<THEME>-<NNN>` plan identifiers or `—`, and are reverse-consistent.
- There is no `phase` field; the canonical roadmap horizon is authoritative.

## Local roadmap reference

The plan's canonical roadmap item carries this final, standalone derived line after its authored prose:

```markdown
**Plan:** [HOK-004](plans/HOK-004-short-description.md)
```

`HOK-004` is the plan's `id`; the relative link names its own file below that theme's `plans/` directory. The line is owned by `ki-repo-roadmap` CONFORM and the `ki-plan` lifecycle, not by the item's prose. It is absent when no active plan resolves to the item.

## Body

Use these sections in order:

```markdown
## Context

Why the work exists and its intended outcome.

## Current state

The honest baseline, including gaps.

## Steps

1. Concrete, inspectable action.

## Files touched

The minimal expected scope.

## Verify

A pass/fail command or assertion.

## Dependencies / blocks

Narrative dependency context.
```

During execution, mark completed steps without deleting their instructions. Before closing completed work, append one non-empty `## Acceptance` section after the six core sections using these H3 subsections, once and in order:

```markdown
## Acceptance

### Delivered

The material outcome in reviewable terms.

### Summary of changes

- The meaningful implementation or documentation changes, with primary paths where useful.

### Verification

- The concrete commands and outcomes, plus the checked commit or other evidence revision.

### Outstanding concerns

Open questions, limitations, and proposed acceptance analysis; write `None` when there are none.

### Mini recap

What was learned and any proposed route. The route remains a proposal until the user approves it separately.
```

Re-run a plan's implementation checks when entering acceptance and after any material implementation, verification, or environment change. An editorial refinement to the acceptance packet instead runs the relevant documentation and roadmap checks; it retains the earlier evidence revision rather than needlessly repeating unrelated full gates. Delete the plan when it lands; do not retain done plans in the index.

Composed governance may add `handoff`, `tier`, or `readiness` frontmatter and additional H2 sections, but it must preserve the six core sections exactly once and in the order above.
