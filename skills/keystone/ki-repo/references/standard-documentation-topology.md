---
type: standard@2026-11-09T21:36:32Z
revised: 2026-11-09T22:38:25Z
status: in force
---

# Documentation topology

## Contents

- [1. Introduction](#1-introduction)
- [2. Scope](#2-scope)
  - [2.1 In scope](#21-in-scope)
  - [2.2 Out of scope](#22-out-of-scope)
- [3. Terms and definitions](#3-terms-and-definitions)
- [4. Rules](#4-rules)
  - [4.1 The four concerns](#41-the-four-concerns)
  - [4.2 Ownership and gaps](#42-ownership-and-gaps)

## 1. Introduction

How durable documentation in a non-Knowledge-Base repository divides into concerns, and who routes material between them. The decisions behind these rules are in [the sources file](sources.md#3-decisions).

[Back to contents](#contents)

## 2. Scope

The repository-level topology of durable documentation.

### 2.1 In scope

- The four documentation concerns of a non-Knowledge-Base repository.
- `ki-repo`'s ownership of the topology and its review of routing.
- How a missing durable contract is treated.

[Back to contents](#contents)

### 2.2 Out of scope

- The content contracts of each concern: `ki-decision-records`, `ki-specs`, `ki-guides` and `ki-work-roadmap`.
- Authored placement and style: `ki-authoring`.
- Knowledge Base repositories.

[Back to contents](#contents)

## 3. Terms and definitions

| Term | Definition |
| --- | --- |
| **Documentation concern** | One of the four kinds of durable documentation: Decision Records, Specifications, Guides and the Roadmap. **Standard:** this one, [4.1](#41-the-four-concerns) |

[Back to contents](#contents)

## 4. Rules

The rules, part by part.

### 4.1 The four concerns

In a non-Knowledge-Base repository, durable documentation has four concerns:

- Decision Records explain durable choices.
- Specifications define behaviour-level contracts.
- Guides help people use, operate, contribute to, or maintain the system.
- The Roadmap records planned work.

[Back to contents](#contents)

### 4.2 Ownership and gaps

`ki-repo` owns this repository-level topology and reviews whether material is routed to the appropriate concern. It does not replace the specialist content contracts owned by `ki-decision-records`, `ki-specs`, `ki-guides`, or `ki-work-roadmap`.

This is not a fifth documentation category and does not require every repository to instantiate every concern. A missing durable contract is a named gap for the relevant specialist skill, not material silently placed in an unowned generic documentation directory. `ki-authoring` continues to govern authored placement and style.

[Back to contents](#contents)
