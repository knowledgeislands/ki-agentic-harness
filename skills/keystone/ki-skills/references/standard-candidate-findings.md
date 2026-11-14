---
type: standard@2026-11-09T21:36:32Z
revised: 2026-11-09T22:38:25Z
status: in force
---

# Candidate-finding standard

## Contents

- [1. Introduction](#1-introduction)
- [2. Scope](#2-scope)
  - [2.1 In scope](#21-in-scope)
  - [2.2 Out of scope](#22-out-of-scope)
- [3. Terms and definitions](#3-terms-and-definitions)
- [4. Rules](#4-rules)
  - [4.1 Candidate shape](#41-candidate-shape)
  - [4.2 Reconcile and route](#42-reconcile-and-route)

## 1. Introduction

REVIEW and EXTRACT are judgment-led discovery modes. Their result is a compact proposal set for a user to assess, not permission to change a skill, a roadmap, or a plan. The decisions behind these rules are in [the sources file](sources.md#3-decisions).

[Back to contents](#contents)

## 2. Scope

The findings REVIEW and EXTRACT produce, and how they are reconciled and routed.

### 2.1 In scope

- The shape of a candidate and its allowed dispositions.
- The readable report shape.
- Reconciling candidates with the roadmap and routing them to the user's decision.

[Back to contents](#contents)

### 2.2 Out of scope

- Making a roadmap change: the repository's ordinary roadmap process.
- Selecting, promoting and planning work: `ki-work next` and `ki-work plan`.

[Back to contents](#contents)

## 3. Terms and definitions

| Term | Definition |
| --- | --- |
| **Candidate** | One proposed finding from REVIEW or EXTRACT, with a title, evidence, disposition, roadmap treatment and proposed action. **Standard:** this one, [4.1](#41-candidate-shape) |
| **Disposition** | Exactly one of the allowed outcomes for a candidate, from `keep as guidance` to `not worth formalising`. **Standard:** this one, [4.1](#41-candidate-shape) |

[Back to contents](#contents)

## 4. Rules

The rules, part by part.

### 4.1 Candidate shape

Each candidate has all of these fields:

| Field             | Required content                                                                             |
| ----------------- | -------------------------------------------------------------------------------------------- |
| Title             | A concise capability or improvement name.                                                    |
| Evidence          | One or more concrete paths, observed repetitions, or explicitly selected history references. |
| Disposition       | Exactly one of the values below.                                                             |
| Roadmap treatment | `new item`, `amend existing item`, or `no roadmap work`.                                     |
| Proposed action   | The smallest useful next action and its owner.                                               |

Allowed dispositions are:

- `keep as guidance` — the material is specific, infrequent, or judgment-heavy; improve the skill prose only when the user requests it.
- `move to reference` — the material belongs on demand rather than in the loaded skill body.
- `extract script` — a bounded, repeatable, deterministic operation deserves a documented executable helper.
- `new skill` — the work has an independent trigger, stable scope, and reusable procedure.
- `new agent or hook` — the work is a bounded delegated role or an event-driven enforcement point rather than a skill procedure.
- `not worth formalising` — record the reason and do not create an artefact.

Use this readable report shape:

```markdown
## Candidate findings

### Extract the duplicate-scan helper

- **Evidence:** `scripts/a.ts` and `scripts/b.ts` repeat the same content-hash scan.
- **Disposition:** extract script
- **Roadmap treatment:** amend existing item — `foundation-tooling/review-ki-keystone-bootstrap-for-further-simplification`
- **Proposed action:** add a pure scan helper and focused tests; retain judgment over which files are candidates.
```

[Back to contents](#contents)

### 4.2 Reconcile and route

1. Read the target repository's canonical roadmap and run its read-only `ki-work-roadmap` audit before proposing a durable route.
2. Compare each candidate against existing items by concern, scope, and evidence; treat a similar title as a review prompt, not proof of duplication.
3. Present only the deduplicated candidate set, including whether each is a new item, an amendment, or no roadmap work. Stop for the user's explicit decision.
4. After the user confirms a roadmap change, use the repository's ordinary roadmap process to make it. Let `ki-work next` select and promote eligible work; let `ki-work plan` create and progress a plan only when the user requests planned execution.

Neither REVIEW nor EXTRACT writes a roadmap, plan, skill, script, agent, hook, or transcript-derived memory. Historical material is read only when the user names its path or otherwise selects its exact scope.

[Back to contents](#contents)
