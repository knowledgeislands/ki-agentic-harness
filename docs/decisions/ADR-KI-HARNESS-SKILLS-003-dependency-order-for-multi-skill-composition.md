---
id: ADR-KI-HARNESS-SKILLS-003
title: 'Dependency order for multi-skill composition'
date: 2026-06-23
status: current
type: Architecture Decision Record
type_url: https://knowledgeislands.info/specifications/decision-records/adr
decision_type: architecture
---

# ADR-KI-HARNESS-SKILLS-003: Dependency order for multi-skill composition

## Context

When auditing a repo that multiple governance skills apply to, the skills must be applied in some order. A skill that composes on a sibling (e.g. `ki-mcp` composes on `ki-engineering`) produces more accurate results if the base has already been judged. Without a canonical order, different callers would apply skills in different sequences, producing inconsistent results and risking context overflow when all skill files are loaded simultaneously.

## Decision

When walking a set of skills serially in a single agent context, apply them in **dependency order**, foundations first:

```text
authoring → engineering → repo → decision-records → feature-definitions → housekeeping → kb → streams → activities → live-artifacts → mcp → website → website-cloudflare → plugins → tools → homebrew-tap → plans → agents → skills → tokenomics → handoffs → harness → bootstrap → binding
```

`binding` is last because it composes on `bootstrap`'s Claude Code skill-links and on `mcp` to wire tools consistently across the surfaces that run them; `bootstrap` precedes it as the install keystone that wires every other skill into a repo, so it composes on `repo`, `engineering`, and `harness`; `harness` precedes `bootstrap` because it composes on the skills and agents linters and the engineering toolchain. The repo-structure skills run together — `mcp` → `website` → `website-cloudflare` → `plugins` → `tools` → `homebrew-tap` — each governing one repo shape (`plugins` is the harness's own projection). The KB-zone skills cluster after `kb` (`streams` → `activities` → `live-artifacts`), `decision-records`, `feature-definitions`, and `housekeeping` sit after `repo` as the governance instruments over repo-external artifacts that repos and bases both consume, and `handoffs` follows `tokenomics` (its model-tier basis). Load and release one skill at a time to keep peak context at one skill, not the full set — this is what prevents a mid-audit compaction.

### Naming grammar

Skill names follow the grammar **`ki-<concern>[-<technology>]`**. The set has three name classes, all conforming to it: **artifact-type** names govern a kind of thing (`ki-repo`, `ki-skills`, `ki-agents`, `ki-mcp`, `ki-harness`, `ki-repo-roadmap`, `ki-decision-records`, `ki-housekeeping`); **doctrine/family** names govern a practice or a family with members (`ki-authoring`, `ki-engineering`, `ki-tokenomics`, `ki-handoffs`, `ki-bootstrap`, the `ki-kb-*` family with its `<family>-<member>` shape); **stack-specific standards** realise a concern in a named technology, with the concern leading and the technology qualifier last, so that replacing the stack is a suffix edit and siblings sort by concern. Applying the rule to the website standards names them **`ki-website`** and **`ki-website-cloudflare`** — concern leading, technology qualifier last. Considered and declined: `ki-tokenomics` → `ki-tiering` (routability is cheaper to fix by sharpening the repository-roadmap/handoffs/tokenomics descriptions); `ki-housekeeping` → `ki-housekeeping-claude` (a qualifier earns its place only when a second memory system exists); any rename of `ki-authoring` (the most-referenced off-ramp — worst cost-benefit). Future stack-specific skills take the same shape (a hosting standard on another provider would be `ki-hosting-<provider>`).

## Consequences

- A composing skill's base is judged before the skill itself is reached.
- In a serial walk, execution time scales with the number of skills; in parallel invocations (ADR-KI-HARNESS-AGENTS-001, later in the reading order), this order governs synthesis ranking, not execution order.
