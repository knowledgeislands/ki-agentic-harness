---
id: KI-HARNESS-GOV-102
area: GOV
title: Decide role record serialization
theme: governance-consistency
horizon: now
status: ready
blocks: [KI-HARNESS-GOV-103]
blocked_by: []
baseline_ref: null
created_at: 2026-09-26T14:34:49Z
updated_at: 2026-10-05T10:45:00Z
---

# KI-HARNESS-GOV-102: Decide role record serialization

## Goal

`ki-subagents` states whether a role record has a serialization of its own, so that a role can be read, reviewed, cited and audited without opening a runtime projection of it.

## Context

`ADR-KI-HARNESS-AGENTS-002` (2026-08-12, `status: current`) makes `ki-subagents` the portable parent contract for subagent meaning and says plainly that "it owns no runtime serialization". Two adapters own native representation: `ki-subagents-claude` owns Claude Code Markdown with YAML frontmatter, `ki-subagents-chatgpt` owns Codex standalone TOML.

That decision settles which skill owns which syntax. It does not say where the record itself lives, and the consequence is that it lives nowhere in particular. Observed at `3f409aac`: `subagents/` holds `README.md` and `governance/`, and `governance/` holds five records - `ki-decision-author`, `ki-engineering-lead`, `ki-repo-kb-curator`, `ki-repo-kb-streams-curator`, `ki-skills-lead`. Every one is physically a `ki-subagents-claude` file whose body is read as the portable record. The record and its projection are the same bytes.

Three observations from that commit sharpen the question.

`ADR-KI-HARNESS-AGENTS-002` states that "runtime-native definitions live under distinct runtime projections within the `subagents/` source shelf". No such level exists in the tree. `governance/` is a domain, not a runtime, and the files inside it are Claude-shaped. Neither adapter standard defines a runtime directory either: `ki-subagents-claude` discovers physical Markdown, `ki-subagents-chatgpt` discovers physical TOML, and the two would sit side by side in the same domain directory distinguished only by extension. The repository does not match the decision that governs it.

`.ki.toml` declares `[skills.ki-subagents]`, `[skills.ki-subagents-claude]` and `[skills.ki-subagents-chatgpt]`, but sets `checks.coverage-subagents-chatgpt = false`, so the repository publishes the Codex adapter without carrying a Codex projection of any role. While exactly one projection exists, fusing record and projection costs nothing visible. The cost arrives with the second: `CODEX-2` requires `developer_instructions`, so the instruction body would exist twice in two vendor formats, and nothing in either standard says which copy is the role.

The five records carry `name`, `description`, `model: inherit` and a `color`. Two of those four are Claude projection fields. `subagents/README.md` says an agent needs "`name` and `description` frontmatter" - so the README already describes a record while the files on disk are projections, and the two have already diverged. This was observed during the shaping of the accepted coordination-lane delivery, whose `## Current state` repeats the README's description rather than the files'.

The accepted coordination-lane delivery reached this question and declined it on purpose: "Physically separating the original from every projection would require a new serialization and therefore a decision record; that is out of scope here and captured separately." This record is that capture. Without it the question dies with that item.

## Boundary

In scope: whether `ki-subagents` defines a record serialization of its own; if so its shape, discovery rule, and the stated relation between a record and its projections; the partition between record fields and projection fields; and consequently whether `ki repo audit --skill ki-subagents` gains anything mechanical or remains wholly judgment, since `PORTABLE-1` to `PORTABLE-3` and `HOST-1` are all `[J]` today.

Out of scope: the role records delivered under the accepted coordination-lane delivery, which conform to the contract as it currently stands and are not to be reshaped by this question; the retired `ki-plugins` plugin projection (`ADR-KI-HARNESS-015`); adopting the Codex projection in this repository, declined in `.ki.toml`; and the content of any individual role record.

Decided 2026-10-05 under delegated owner authority: **keep the fusion and say so.** The record is carried by exactly one designated primary projection, the `ki-subagents-claude` Markdown file; any other projection corresponds to it and never establishes the record. `ADR-KI-HARNESS-AGENTS-002` is amended in place under the living-record rule in `ki-decision-records`, not superseded. No native serialization and no derived normal form are introduced, and `PORTABLE-1` to `PORTABLE-3` and `HOST-1` stay judgment criteria.

## Current state

- `ADR-KI-HARNESS-AGENTS-002` still says the parent "owns no runtime serialization" and that runtime-native definitions "live under distinct runtime projections within the `subagents/` source shelf". Neither describes the tree: `subagents/governance/` and `subagents/coordination/` are domains holding nine Claude-shaped files.
- `skills/agentic-systems/ki-subagents/references/standards-portable-subagents.md` names the portable semantics but has no field partition and no statement of where a record physically lives.
- `skills/agentic-systems/ki-subagents-claude/references/standards-subagent-definitions.md` and `skills/agentic-systems/ki-subagents-chatgpt/references/standards-codex-subagents.md` each describe their projection without saying which one is primary.
- `subagents/README.md` still calls the Codex question "a provisional, open question pending a research spike" and its convention paragraph does not separate record from projection fields.
- All nine role records carry `name`, `description`, `model: inherit` and a `color`. Under the partition below `model` and `color` are Claude projection fields, which the primary projection may carry; nothing in a record needs to change.

## Steps

- [ ] Amend `ADR-KI-HARNESS-AGENTS-002` in place: the portable record is carried by the designated primary projection, the `ki-subagents-claude` Markdown file under a domain directory of `subagents/`; its record fields are `name`, `description` and the instruction body; every other projection corresponds to the primary and never establishes the record; a disagreement resolves to the primary. Replace the "distinct runtime projections" sentence with the domain layout the tree uses and the extension-based discovery the adapters implement. Revise the Consequences bullet that requires both projections for every role so it matches `checks.coverage-subagents-chatgpt = false`, and state the cost the fusion accepts: the portable criteria are judged against the primary file.
- [ ] Add a `## Record and projections` section to `standards-portable-subagents.md` holding the field partition: record fields are identity (`name`), selection (`description`) and the instruction body carrying lane, grounding, hand-offs, orchestration and outcome evidence; projection fields are every other key an adapter supports. Name the Claude projection as primary and cite the amended decision. Adjust `## Purpose` so "does not define a native serialization" reads consistently with a designated primary carrier.
- [ ] Add one sentence to the opening of `standards-subagent-definitions.md` naming this projection as the primary carrier of the record, and one to `standards-codex-subagents.md` stating that a Codex file's `name`, `description` and `developer_instructions` must correspond to the primary's record fields and that its remaining keys are projection fields.
- [ ] Add one sentence to `## Position` in `skills/agentic-systems/ki-subagents/SKILL.md` pointing at the primary-carrier rule, without restating it.
- [ ] Rewrite the opening and `## Convention` of `subagents/README.md` to describe the files as primary Claude projections carrying the record, list the record fields and say the other frontmatter keys are projection fields, and drop the "pending a research spike" wording.
- [ ] Run the verification below and record the results in `## Discussion`.

## Files touched

- `docs/decisions/ADR-KI-HARNESS-AGENTS-002-portable-subagent-contract-and-runtime-adapters.md`
- `skills/agentic-systems/ki-subagents/references/standards-portable-subagents.md`
- `skills/agentic-systems/ki-subagents/SKILL.md`
- `skills/agentic-systems/ki-subagents-claude/references/standards-subagent-definitions.md`
- `skills/agentic-systems/ki-subagents-chatgpt/references/standards-codex-subagents.md`
- `subagents/README.md`

## Verify

1. The amended decision names the `ki-subagents-claude` file as the single primary projection, states that other projections never establish the record, and contains no sentence about a runtime-projection directory level the tree does not have.
2. `standards-portable-subagents.md` has a `#record-and-projections` anchor listing `name`, `description` and the instruction body as record fields and classing every other adapter-supported key, including `model` and `color`, as a projection field.
3. `subagents/README.md`, both adapter standards and the decision agree on the partition; a reader can answer "is `color` part of the role?" from any one of them and get the same answer.
4. No file under `subagents/` changes, and no rubric item changes classification: `PORTABLE-1` to `PORTABLE-3` and `HOST-1` remain judgment.
5. The commands below pass.

```bash
bun run test
bunx tsc --noEmit
ki repo audit --skill ki-subagents --progress never
ki repo audit --skill ki-subagents-claude --progress never
ki repo audit --skill ki-decision-records --progress never
ki repo audit --skill ki-authoring --progress never
```

## Dependencies / blocks

Blocks [KI-HARNESS-GOV-103](KI-HARNESS-GOV-103-cite-coordination-rules-once.md), whose rule 6 cites the amended decision and the new `#record-and-projections` anchor. Nothing blocks this record.

## Documentation impact

### Decision Records

Amends `ADR-KI-HARNESS-AGENTS-002` in place under the living-record rule; no new record.

### Specifications

None. `docs/specs/` does not restate the subagent contract.

### Guides

None. `subagents/README.md` is updated as a step above; no guide describes role records.

### Roadmap

Unblocks [KI-HARNESS-GOV-103](KI-HARNESS-GOV-103-cite-coordination-rules-once.md).

## Discussion

Three answers are available.

**Keep the fusion and say so.** Amend `ADR-KI-HARNESS-AGENTS-002` to state that the record is carried in the body of exactly one designated primary projection, and name which. Cheapest, and honest about current practice. The price is permanent: `PORTABLE-1` to `PORTABLE-3` can then only ever be judged against a vendor file, and a second projection has no way to disagree with the first - whichever file a reader opens becomes the record.

**Define a native serialization.** `ki-subagents` gains its own file shape and each adapter file becomes generated from it or checked against it. This is the only answer under which "the record is the original and the agent is a projection" is a fact rather than an intention, and the only one under which a portable fact no runtime happens to carry has somewhere to live. It costs a new format, a discovery rule, a drift check - the `KI-HARNESS-GOV-093` shape again - and a migration of the existing records.

**Derive the record rather than store it.** Define a normalization that strips projection fields, so the record is a view over the projections instead of a file. No migration, no second source of truth, and it yields a real cross-runtime parity check. It still requires the field partition to be written down, which is most of the work of the second answer, and it leaves a portable-only fact with nowhere to go.

One thing is already settled by evidence rather than argument, whichever answer is chosen: the partition between record fields and projection fields has to be written down. `model` and `color` are in five records today and `subagents/README.md` says they are not. That is the smallest reproducible instance of the problem and it does not wait on the larger decision.

This is a decision record question and not a contract change to be made quietly. `ADR-KI-HARNESS-AGENTS-002` is `status: current` and the sentence at issue is one of its own, so the outcome is either a record that supersedes or amends it, or a recorded decision to leave it as written with the fusion made explicit.

### Relationship to other records

- The accepted coordination-lane delivery raised the question and declined it; this record owns it.
- [KI-HARNESS-GOV-103](KI-HARNESS-GOV-103-cite-coordination-rules-once.md) needs this answered before rule 6 of the coordination rules has a citation target.

### Why the fusion was chosen

The price named above is accepted knowingly. With one carried projection, a native serialization buys a format, a discovery rule, a drift check and a migration for no reader who exists today, and a derived record still needs the same partition written down first. Writing the partition now and naming the primary keeps the door open: if a second projection is adopted, the partition already says which fields must agree, and the revisit condition is the first role that needs a portable fact no runtime field or body can carry.

### Decision

Keep the fusion and say so: write the record/projection field partition down now and amend `ADR-KI-HARNESS-AGENTS-002` in place, naming the `ki-subagents-claude` file as the primary projection. The native-serialization and derived-record options above are superseded. Decided by the Fable reviewer under delegated autonomy, reversible.
