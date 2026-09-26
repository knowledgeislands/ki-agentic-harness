---
id: KI-HARNESS-GOV-102
area: GOV
title: Decide role record serialization
theme: governance-consistency
horizon: triage
status: draft
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-09-26T14:34:49Z
updated_at: 2026-09-26T18:20:00Z
---

# KI-HARNESS-GOV-102: Decide role record serialization

## Goal

`ki-subagents` states whether a role record has a serialization of its own, so that a role can be read, reviewed, cited and audited without opening a runtime projection of it.

## Context

`ADR-KI-HARNESS-AGENTS-002` (2026-08-12, `status: current`) makes `ki-subagents` the portable parent contract for subagent meaning and says plainly that "it owns no runtime serialization". Two adapters own native representation: `ki-subagents-claude` owns Claude Code Markdown with YAML frontmatter, `ki-subagents-codex` owns Codex standalone TOML.

That decision settles which skill owns which syntax. It does not say where the record itself lives, and the consequence is that it lives nowhere in particular. Observed at `3f409aac`: `subagents/` holds `README.md` and `governance/`, and `governance/` holds five records — `ki-decision-author`, `ki-engineering-lead`, `ki-repo-kb-curator`, `ki-repo-kb-streams-curator`, `ki-skills-lead`. Every one is physically a `ki-subagents-claude` file whose body is read as the portable record. The record and its projection are the same bytes.

Three observations from that commit sharpen the question.

`ADR-KI-HARNESS-AGENTS-002` states that "runtime-native definitions live under distinct runtime projections within the `subagents/` source shelf". No such level exists in the tree. `governance/` is a domain, not a runtime, and the files inside it are Claude-shaped. Neither adapter standard defines a runtime directory either: `ki-subagents-claude` discovers physical Markdown, `ki-subagents-codex` discovers physical TOML, and the two would sit side by side in the same domain directory distinguished only by extension. The repository does not match the decision that governs it.

`.ki.toml` declares `[skills.ki-subagents]` and `[skills.ki-subagents-claude]` and sets `checks.coverage-subagents-codex = false`, so the Codex projection is deliberately absent. While exactly one projection exists, fusing record and projection costs nothing visible. The cost arrives with the second: `CODEX-2` requires `developer_instructions`, so the instruction body would exist twice in two vendor formats, and nothing in either standard says which copy is the role.

The five records carry `name`, `description`, `model: inherit` and a `color`. Two of those four are Claude projection fields. `subagents/README.md` says an agent needs "`name` and `description` frontmatter" — so the README already describes a record while the files on disk are projections, and the two have already diverged. This was observed during the shaping of the accepted coordination-lane delivery, whose `## Current state` repeats the README's description rather than the files'.

the accepted coordination-lane delivery reached this question and declined it on purpose: "Physically separating the original from every projection would require a new serialization and therefore a decision record; that is out of scope here and captured separately." This record is that capture. Without it the question dies with that item.

## Boundary

In scope: whether `ki-subagents` defines a record serialization of its own; if so its shape, discovery rule, and the stated relation between a record and its projections; the partition between record fields and projection fields; and consequently whether `ki repo audit --skill ki-subagents` gains anything mechanical or remains wholly judgment, since `PORTABLE-1` to `PORTABLE-3` and `HOST-1` are all `[J]` today.

Out of scope: the role records delivered under the accepted coordination-lane delivery, which conform to the contract as it currently stands and are not to be reshaped by this question; the flat plugin projection in `ki-plugins`, governed by `KI-HARNESS-GOV-093`; adopting the Codex projection in this repository, declined in `.ki.toml`; and the content of any individual role record.

## Discussion

Three answers are available.

**Keep the fusion and say so.** Amend `ADR-KI-HARNESS-AGENTS-002` to state that the record is carried in the body of exactly one designated primary projection, and name which. Cheapest, and honest about current practice. The price is permanent: `PORTABLE-1` to `PORTABLE-3` can then only ever be judged against a vendor file, and a second projection has no way to disagree with the first — whichever file a reader opens becomes the record.

**Define a native serialization.** `ki-subagents` gains its own file shape and each adapter file becomes generated from it or checked against it. This is the only answer under which "the record is the original and the agent is a projection" is a fact rather than an intention, and the only one under which a portable fact no runtime happens to carry has somewhere to live. It costs a new format, a discovery rule, a drift check — the `KI-HARNESS-GOV-093` shape again — and a migration of the existing records.

**Derive the record rather than store it.** Define a normalization that strips projection fields, so the record is a view over the projections instead of a file. No migration, no second source of truth, and it yields a real cross-runtime parity check. It still requires the field partition to be written down, which is most of the work of the second answer, and it leaves a portable-only fact with nowhere to go.

One thing is already settled by evidence rather than argument, whichever answer is chosen: the partition between record fields and projection fields has to be written down. `model` and `color` are in five records today and `subagents/README.md` says they are not. That is the smallest reproducible instance of the problem and it does not wait on the larger decision.

This is a decision record question and not a contract change to be made quietly. `ADR-KI-HARNESS-AGENTS-002` is `status: current` and the sentence at issue is one of its own, so the outcome is either a record that supersedes or amends it, or a recorded decision to leave it as written with the fusion made explicit.

- the accepted coordination-lane delivery raised the question and declined it; this record owns it.
- `KI-HARNESS-GOV-103` needs this answered before rule 6 of the coordination rules has a citation target.
