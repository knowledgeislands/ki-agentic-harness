---
type: sources@2026-11-09T21:36:32Z
revised: 2026-11-09T22:38:25Z
refresh: canonical · on-change
---

# Sources — ki-bootstrap

## Contents

- [1. Introduction](#1-introduction)
- [2. Outside sources](#2-outside-sources)
  - [2.1 Authoritative](#21-authoritative)
  - [2.2 Advisory](#22-advisory)
- [3. Decisions](#3-decisions)
- [4. Last review](#4-last-review)

## 1. Introduction

The sources and decisions behind [the bootstrap standard](standard-bootstrap.md).

**Refresh:** canonical · on-change

Provenance only: the record of what changed lives in git, not a changelog here. This guidance tracks the delivered Knowledge Islands activation model and refreshes when one of its owners changes.

[Back to contents](#contents)

## 2. Outside sources

The in-house sources the standard follows.

### 2.1 Authoritative

| Source | Governs | Last reviewed |
| --- | --- | --- |
| **[ADR]** [ADR-KI-HARNESS-012](../../../../docs/decisions/ADR-KI-HARNESS-012-compatible-harness-publication-and-governed-rubric-boundary.md) | harness payload, capability, and native-rubric ownership | 2026-08-12 |
| **[HC]** [Compatible harness decision, ADR-KI-HARNESS-012](../../../../docs/decisions/ADR-KI-HARNESS-012-compatible-harness-publication-and-governed-rubric-boundary.md) | harness identity, capability identity, and activation boundary | 2026-08-12 |
| **[TK]** installed `ki --help` surfaces | current public grammar, bootstrap, activation, local development, and diagnostics | 2026-08-12 |
| **[KR]** `ki-repo` skill | `.ki.toml` and declared repository coverage | 2026-08-12 |

[Back to contents](#contents)

### 2.2 Advisory

None.

[Back to contents](#contents)

## 3. Decisions

| Id | Decision | Date | Backs | Status |
| --- | --- | --- | --- | --- |
| BOOT-HOME | Kris's decision: this skill owns the one machine-readiness checklist from a fresh machine to a working coordinator, ending in "Ready to coordinate" with observable hook and output-style checks, and `ki-coordination`'s Bootstrap cites it as its "Before the opener" step. | 2026-10-26 | [bootstrap standard](standard-bootstrap.md#47-machine-readiness-for-coordinating-work) | In force |

[Back to contents](#contents)

## 4. Last review

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
  - Re-check the machine-readiness checklist when the chezmoi hook registration, the output-style link, the Capital's declared skill set or `ki agent prompts` changes, and fold in `ki doctor` once it carries the readiness checks.

[Back to contents](#contents)
