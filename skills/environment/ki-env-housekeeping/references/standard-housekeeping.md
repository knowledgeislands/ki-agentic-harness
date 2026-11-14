---
type: standard@2026-11-14T03:32:28Z
revised: 2026-11-14T03:32:28Z
status: in force
---

# Housekeeping standard

## Contents

- [1. Introduction](#1-introduction)
- [2. Scope](#2-scope)
  - [2.1 In scope](#21-in-scope)
  - [2.2 Out of scope](#22-out-of-scope)
- [3. Terms and definitions](#3-terms-and-definitions)
- [4. Rules](#4-rules)
  - [4.1 Native memory policy](#41-native-memory-policy)
  - [4.2 Durable learning](#42-durable-learning)
  - [4.3 Session sources](#43-session-sources)
  - [4.4 Bounded evidence and authority](#44-bounded-evidence-and-authority)

## 1. Introduction

The housekeeping rules every agent host shares, held by the family's lead so each runtime skill adds only its own host's surfaces and controls. The rules were drawn from what `ki-housekeeping-claude` and `ki-housekeeping-chatgpt` both already held. The decisions behind them are in [the sources file](sources.md#3-decisions).

[Back to contents](#contents)

## 2. Scope

The state an agent host leaves on a machine, wherever the rule is the same for every host.

### 2.1 In scope

- The repository's native-memory policy.
- Where durable learning goes.
- Session sources and their authority.
- Bounded evidence, repairs and deletion.

[Back to contents](#contents)

### 2.2 Out of scope

- Each host's surfaces, stores, settings and procedures: its runtime skill.
- Capturing a session's knowledge: `ki-acquire`.
- Context budgets: `ki-tokenomics`.

[Back to contents](#contents)

## 3. Terms and definitions

| Term | Definition |
| --- | --- |
| **Native memory** | Notes an agent host keeps and loads on its own, outside the repository's reviewed guidance. **Standard:** this one, [4.1](#41-native-memory-policy) |
| **Session source** | An agent host's own record of its sessions, read through a housekeeping server or the host's files. **Standard:** this one, [4.3](#43-session-sources) |
| **Bounded evidence** | Evidence read only from the exact, selected location a rule names, never from a guessed or fallback path. **Standard:** this one, [4.4](#44-bounded-evidence-and-authority) |

[Back to contents](#contents)

## 4. Rules

The rules, part by part.

### 4.1 Native memory policy

Every repository that declares a runtime housekeeping skill sets its native-memory policy explicitly, `auto_memory = "disabled" | "transition" | "enabled"`, in that skill's table. An unset policy fails; `transition` warns until the repository's existing notes are reviewed and routed, then becomes `disabled`; and `enabled` needs the owner's express approval and a project-scoped opt-in in the host. The policy is Knowledge Islands' own value, separate from any setting the host keeps. Rubric **HOUSE-1** reviews it.

[Back to contents](#contents)

### 4.2 Durable learning

Durable learning goes into reviewed repository guidance or knowledge-base notes, never into native memory. A housekeeping repair never creates empty memory files and never deletes a memory as a checker repair. Rubric **HOUSE-2** reviews it.

[Back to contents](#contents)

### 4.3 Session sources

A session source stays read-only to housekeeping. Housekeeping keeps a content-minimised inventory of sessions; reading a session's knowledge belongs to `ki-acquire`, where a full-session import is an owner-selected exception. Discovery or checkpoint evidence grants no capture, harvest or retirement authority. Rubric **HOUSE-3** reviews it.

[Back to contents](#contents)

### 4.4 Bounded evidence and authority

The state housekeeping governs lives outside the repository's tree. A runtime skill reads it only from the exact location its rules select; missing, unreadable or unsafe evidence is reported as unavailable, never replaced by another path. A server's source or inventory declaration proves neither registration nor access. Repairs change only what an already selected, bounded location holds; settings managed elsewhere, such as by chezmoi, are never changed as a repair; and deleting a session or other state needs separate, explicit authority each time. Rubric **HOUSE-4** reviews it.

[Back to contents](#contents)
