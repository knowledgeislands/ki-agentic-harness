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

- `status` is `open`, `in-progress`, or transient `done`.
- `roadmap` is a qualified `<theme>/<item-slug>` locator for an item in `Blocking` or `Next`; its theme must match the plan directory.
- `blocks` and `blocked-by` are comma-separated canonical `<THEME>-<NNN>` plan identifiers or `—`, and are reverse-consistent.
- There is no `phase` field; the canonical roadmap horizon is authoritative.

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

During execution, mark completed steps without deleting their instructions. Delete the plan when it lands; do not retain done plans in the index.

Composed governance may add `handoff`, `tier`, or `readiness` frontmatter and additional H2 sections, but it must preserve the six core sections exactly once and in the order above.
