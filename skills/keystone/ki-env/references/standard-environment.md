---
type: standard@2026-11-14T03:31:46Z
revised: 2026-11-14T03:31:46Z
status: in force
---

# Environment standard

## Contents

- [1. Introduction](#1-introduction)
- [2. Scope](#2-scope)
  - [2.1 In scope](#21-in-scope)
  - [2.2 Out of scope](#22-out-of-scope)
- [3. Terms and definitions](#3-terms-and-definitions)
- [4. Rules](#4-rules)
  - [4.1 What the guild covers](#41-what-the-guild-covers)
  - [4.2 Families](#42-families)
  - [4.3 Names](#43-names)

## 1. Introduction

What the Environment guild keeps, and how its skills divide the work between portable family leads and runtime skills. The decisions behind it are in [the sources file](sources.md#3-decisions).

[Back to contents](#contents)

## 2. Scope

What Knowledge Islands sets up and keeps where agents run.

### 2.1 In scope

- The guild's three concerns: tools and access, limits, and the state agent hosts leave.
- Families: a portable lead and its runtime skills.
- The guild's names.

[Back to contents](#contents)

### 2.2 Out of scope

- What an environment, a machine and an agent host are: `ki-agentic-systems`.
- Each family's own rules: its lead and its runtime skills.
- Capturing a session's knowledge: `ki-acquire`.

[Back to contents](#contents)

## 3. Terms and definitions

| Term | Definition |
| --- | --- |
| **Environment** | Where an agent's work runs: the files, tools, access and limits it works with; `ki-agentic-systems`' [environment card](../../ki-agentic-systems/knowledge/industry/industry.environment.md) says what it is. **Standard:** this one, [4.1](#41-what-the-guild-covers) |
| **Family lead** | The portable skill that holds the rules a family's runtime skills share. **Standard:** `ki-skills`' [guilds standard](../../ki-skills/references/standard-guilds.md#45-how-a-lead-discloses-its-guild) |
| **Runtime skill** | A family member bound to one agent host, adding only that host's delta to its family lead's rules. **Standard:** this one, [4.2](#42-families) |

[Back to contents](#contents)

## 4. Rules

The rules, part by part.

### 4.1 What the guild covers

The Environment guild keeps what Knowledge Islands sets up where agents run, in the sense of the environment card: where an agent's work runs, with its files, tools, access and limits (ENV-PREFIX). It has three concerns, each a family:

| Concern | Family lead | What it keeps |
| --- | --- | --- |
| Tools and access | `ki-env-binding` | The portable MCP inventory and each surface it is rendered to |
| Limits | `ki-env-tokenomics` | Context budgets, standing-surface attribution and model-purpose policy |
| State agent hosts leave | `ki-env-housekeeping` | Native memory, sessions, caches and storage on a machine |

Rubric **ENV-1** reviews it.

[Back to contents](#contents)

### 4.2 Families

Each concern is a family. Its portable lead holds the rules every runtime shares, and each runtime skill depends on its lead and adds only its agent host's delta (HOUSEKEEPING-LEAD). A rule that holds for every runtime moves up to the lead; a rule that holds for one stays with its runtime skill. A new agent host gains a runtime skill in each family that needs one, never a fork of the lead. Rubric **ENV-2** reviews it.

[Back to contents](#contents)

### 4.3 Names

The guild's prefix is `ki-env-`, and each family extends it, as `ki-env-binding` and `ki-env-binding-claude` (ENV-PREFIX, GUILD-NAMED). A family's runtime skill is named after the family and the runtime family it serves, `claude` or `chatgpt`, or the tool it renders to, as `chezmoi`.

[Back to contents](#contents)
