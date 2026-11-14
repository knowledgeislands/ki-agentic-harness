---
type: sources@2026-11-14T03:22:59Z
revised: 2026-11-14T03:22:59Z
refresh: canonical · on-change
---

# Sources — where the Keystone standard comes from

## Contents

- [1. Introduction](#1-introduction)
- [2. Outside sources](#2-outside-sources)
- [3. Decisions](#3-decisions)
- [4. Last review](#4-last-review)

## 1. Introduction

The sources and decisions behind [the Keystone standard](standard-keystone.md), its [rubric](rubric.md), and [the bootstrap standard](standard-bootstrap.md) behind the BOOTSTRAP mode. Mode REFRESH reads this file, compares the standard and the guild purposes in the SKILL.md with the decisions below, and records what it checked in the [Last review](#4-last-review) block.

[Back to contents](#contents)

## 2. Outside sources

Keystone's guild rules have none: Keystone is Knowledge Islands' own, and the industry has no word for a guild of skills, as `ki-agentic-systems`' guild card records. The bootstrap guidance follows these in-house sources, all authoritative:

| Source | Governs | Last reviewed |
| --- | --- | --- |
| **[ADR]** [ADR-KI-HARNESS-012](../../../../docs/decisions/ADR-KI-HARNESS-012-compatible-harness-publication-and-governed-rubric-boundary.md) | harness payload, capability, and native-rubric ownership | 2026-08-12 |
| **[HC]** [Compatible harness decision, ADR-KI-HARNESS-012](../../../../docs/decisions/ADR-KI-HARNESS-012-compatible-harness-publication-and-governed-rubric-boundary.md) | harness identity, capability identity, and activation boundary | 2026-08-12 |
| **[TK]** installed `ki --help` surfaces | current public grammar, bootstrap, activation, local development, and diagnostics | 2026-08-12 |
| **[KR]** `ki-repo` skill | `.ki.toml` and declared repository coverage | 2026-08-12 |

[Back to contents](#contents)

## 3. Decisions

| Id | Decision | Date | Backs | Status |
| --- | --- | --- | --- | --- |
| KEYSTONE-HUB | The owner's decision, in the Cairn summit's change 25: Keystone is the guild of guilds; its lead, `ki-keystone`, mostly signposts, and each guild's lead is a member of Keystone as well as the root of its own guild; there is no deeper hierarchy. | 2026-11-13 | [4.1](standard-keystone.md#41-the-joining-rule), [4.2](standard-keystone.md#42-one-lead-for-each-guild) | In force |
| KEYSTONE-MIN | The owner's decision, in change 25: Keystone holds only what every other guild rests on, and never becomes a dumping ground. | 2026-11-13 | [4.1](standard-keystone.md#41-the-joining-rule) | In force |
| GUILD-LEAD | The owner's decision, in change 25: each guild is a tree of skills led by one lead skill. | 2026-11-13 | [4.2](standard-keystone.md#42-one-lead-for-each-guild) | In force |
| GUILD-PLACE | The owner's decision, in change 25: each skill's frontmatter names its guild and a lead the guild it leads; the folder a skill sits in is storage, not structure. | 2026-11-13 | [4.2](standard-keystone.md#42-one-lead-for-each-guild), [4.3](standard-keystone.md#43-the-guild-map) | In force |
| KEYSTONE-SKILL | The owner's decision, in change 25: `ki-keystone` holds the guild map, each guild's purpose in a line and its lead, generated from frontmatter; where a session starts in a repository, `ki-repo`, `ki-authoring` and `ki-agentic-systems`; and the rule for joining Keystone, pointing to `ki-skills` for the rest. | 2026-11-13 | [4.3](standard-keystone.md#43-the-guild-map), [4.4](standard-keystone.md#44-where-a-session-starts) | In force; the harness's catalogue stays with `ki-repo-backpack` for now, grouped by the same guilds |
| BOOT-HOME | Kris's decision: this skill owns the one machine-readiness checklist from a fresh machine to a working coordinator, ending in "Ready to coordinate" with observable hook and output-style checks, and `ki-coordination`'s Bootstrap cites it as its "Before the opener" step. | 2026-10-26 | [bootstrap standard](standard-bootstrap.md#47-machine-readiness-for-coordinating-work) | In force |
| BOOTSTRAP-FOLD | The owner's decision, in change 25: `ki-bootstrap` becomes `ki-keystone bootstrap`, its body a reference loaded only when the mode is called. | 2026-11-13 | [mode-bootstrap.md](mode-bootstrap.md) | In force |
| GUILD-TREE | The owner's decision, in change 25, option a: the guild tree, with each guild's one-line purpose as its working label. | 2026-11-14 | [SKILL.md](../SKILL.md#the-guilds) | In force |

[Back to contents](#contents)

## 4. Last review

On 14 November 2026 the skill was written from the Cairn summit's change 25, guilds, under GUILDS-REMIT. The guild purposes are change 25's working labels for the guild tree. The same day, under BOOTSTRAP-FOLD and RENAME-NOW, the `ki-bootstrap` skill folded in as the BOOTSTRAP mode, with its standard, exemplars and sources; the core user skills `ki bootstrap` activates were brought into line with tools-ki 0.16.0, `ki-keystone` and `ki-work`.

The bootstrap guidance's earlier reviews, as the `ki-bootstrap` skill recorded them:

A 2026-11-10 in-house review under `agora.sop.main` follows the removal of `ki agent` in `tools-ki` v0.15.0: the checklist's opener step takes the opener from `ki-coordination`'s Opening work templates rather than `ki agent prompts`, the hook check no longer unsets `KI_AGENT_RUN`, and the openers watch-item names `ki-coordination`'s openers. No external source refreshed.

A 2026-10-26 in-house review under `wow-harness-a` applied BOOT-HOME, which Kris decided that day: this skill owns the one machine-readiness checklist from a fresh machine to a working coordinator, ending in "Ready to coordinate" with observable hook and output-style checks, and `ki-coordination`'s Bootstrap cites it as its "Before the opener" step. A `ki doctor` readiness check was requested from `tools-ki` by message; readiness never depends on it before it exists. Command surfaces were confirmed against the installed `ki --help` (`ki agent prompts`, `ki registry`, `ki doctor`), not re-reviewed in full.

REFRESH last ran **2026-08-12**.

- [ADR] and [HC] confirm that verified installed compatible harnesses are authoritative, runtime links are projections, and repositories never carry an alternative executor.
- [TK] confirms current `ki bootstrap`, `ki harness`, `ki skill add/remove`, `ki repo skill add/remove`, `ki repo`, `ki dev local set/on/off`, `ki doctor`, and `ki diag` grammar.
- [KR] confirms that repository coverage remains explicit in `.ki.toml` and separate from user activation.
- The FND-003 boundary review confirmed that this skill remains guidance-only: no harness-local bootstrap process launch, publisher, synchroniser, generated HELP, or repository executor remains. `tools-ki` owns bootstrap execution, native rubric hosting, reporting, and transactions; its validated external `ConformCommand` and per-agent user-space mutation boundaries remain deliberately external.
- **Open watch-items:**
  - Re-check the core user-skill set whenever bootstrap policy changes.
  - Re-check bare-name ambiguity and qualified capability input when multi-harness activation evolves.
  - Re-check supported agent discovery and managed link locations when a runtime binding changes.
  - Re-check acquisition, replacement, and uninstall wording when harness version selection is introduced.
  - Re-check the machine-readiness checklist when the chezmoi hook registration, the output-style link, the Capital's declared skill set or `ki-coordination`'s openers change, and fold in `ki doctor` once it carries the readiness checks.

[Back to contents](#contents)
