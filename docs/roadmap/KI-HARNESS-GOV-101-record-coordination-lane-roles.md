---
id: KI-HARNESS-GOV-101
area: GOV
title: Record coordination lane roles
theme: governance-consistency
horizon: now
status: done
blocks: []
blocked_by: []
baseline_ref: 3f409aaceaa6baae223a20c297dfd06ad733d536
created_at: 2026-09-26T13:09:36Z
updated_at: 2026-09-26T14:46:39Z
---

# Record Coordination Lane Roles

## Goal

Four coordination lanes — convening, stewardship, crossing, delivery — are currently expressed only as agent configurations in an external coordination plane, with no repository record of what each answers for. Give each lane a portable role record in the repository that already governs role records, so that changing what a lane answers for is a governed repository change rather than an edit to a runtime prompt.

## Context

`ki-subagents` holds that a role record is the original and every runtime agent definition is a projection of it. Five such records exist under `subagents/governance/`. Four further roles have been operating as coordination-plane agents with no original: one convening role and three lane owners for governance, execution substrate, and delivery.

A proposal drafted on 2026-09-25 settled which repository owns them. `ki-subagents` is a skill, not a repository, so it cannot hold records. A new company-scoped repository fails `ki-repo` coverage the moment it contains `subagents/**/*.md` without declaring `[skills.ki-subagents]`, and fails `ki-repo-harness` `LAY-1`, which requires all five harness directories at a source-harness root. This repository already declares `[skills.ki-subagents]` and `[skills.ki-subagents-claude]`, and once instance identifiers, checkout paths, and scheduling settings are stripped from the four agent configurations, nothing company-specific remains: three lanes are harness lanes and the fourth is `ki-next` behaviour.

The proposal was approved by the responsible human on 2026-09-26 together with the four record bodies in their intended final form.

`ki-subagents` deliberately defines no native serialization, so a portable record is carried as the body of a `ki-subagents-claude` file: the frontmatter is the projection layer, the body is the record. Physically separating the original from every projection would require a new serialization and therefore a decision record; that is out of scope here and captured separately.

## Boundary

This item does not:

- restate the coordination plane's governing rules inside the records — they have no decision record yet, and inlining them would create four more unversioned copies of doctrine;
- carry any runtime, instance, path, scheduling, permission, or coordination-plane fact into a record body;
- carry the temporary company-scoped restriction on repository writes into a record, which would make a temporary restriction permanent and export it to every installer;
- name current work items in a record, which describes a durable lane rather than this week's assignments;
- regenerate the flat plugin projection of `subagents/**/*.md`, which is governed by `KI-HARNESS-GOV-093`;
- change `.ki.toml`, which already declares both required skill tables;
- push, merge, release, or accept.

## Current state

Observed at `6dd81641` on `main`.

- `subagents/` contains exactly `README.md` and `governance/`. `governance/` holds five records — `ki-decision-author`, `ki-engineering-lead`, `ki-repo-kb-curator`, `ki-repo-kb-streams-curator`, `ki-skills-lead` — and there is no `coordination/` directory.
- `.ki.toml` already declares `[skills.ki-subagents]` and `[skills.ki-subagents-claude]`, and explicitly opts out of `ki-subagents-codex` with `checks.coverage-subagents-codex = false`. `ki-repo` `COV-1` is already satisfied by the existing `governance/` records, so adding a second domain directory changes nothing in the coverage cascade. No `.ki.toml` change is needed, and none is permitted here.
- `subagents/README.md` documents only the `governance/` domain, with a two-column Agent/Lane table and an "Adding an agent" procedure. Adding a domain without updating it would leave the README stale. The README already states that `name` must be unique across the whole tree, so the new domain inherits that rule without the README needing to restate it.
- The four record bodies exist in approved final form in §4 of the Paperclip document **"Role records for Convenor, Steward, Ferryman and Wright"** (`3d3ef2cb-6f62-47e7-9c13-7aa6f0ffeeb2`, revision `d3675fd9-aac9-4b8e-a9bd-1731ba03aee4`) on coordination task `KNO-2`, which names this item as its governing record. Each carries `name`, `description`, `model` and `color` frontmatter — the same projection-layer set all five existing `governance/` records carry — and an instruction body with `## Grounding`, `## When invoked`, `## What you own vs defer`, `## Orchestration`, `## Lenses`, `## Outcome evidence`, and — for three of the four — `## Output bar`. Implementation transcribes those bodies; it does not author them.
- The approved proposal cited baseline `701d669`. The repository has since advanced through roadmap-only commits to `6dd81641`, which is the commit that captured this record; nothing under `subagents/`, `.ki.toml`, or the `ki-subagents*` skills changed between the two, so the approved reasoning is unaffected.
- The approved proposal reserved `KI-HARNESS-GOV-096`, which was allocated to other work before this item was written; `GOV-101` is the next free number against the `_ISSUES.md` `GOV` high-water mark, which the capture advanced to `101`.
- Three of the four records will carry a named `PORTABLE-3` gap on outcome evidence — Steward, Ferryman, Wright; Convenor is expected conforming. The roles are one day old and `ki-subagents` states that a syntactically valid file is not evidence that selecting a role improved an outcome. Each gap names the work that closes it. `PORTABLE-1` through `PORTABLE-3` and `HOST-1` are all judgment criteria, so these dispositions are recorded by the reviewer in `## Review`; no tool emits them.
- **The `ki` environment on the current development host is not bootstrapped.** `ki repo diag --repo .` reports `ki environment is not bootstrapped; run 'ki bootstrap' first`, and every `ki repo audit --skill <x>` invocation exits `1` with `declared skill ki-repo is provided by no declared harness (knowledgeislands/ki-agentic-harness); knowledgeislands/ki-agentic-harness is not installed`. `ki repo roadmap list --repo .` does run. This is a host-activation condition, not a property of this repository; it is a precondition of the primary gate below, not a `blocked_by` dependency.
- The flat plugin projection referred to in `## Boundary` lives in a different repository: `ki-plugins/knowledge-islands/agents/`, observed at `d177a05e`. It currently contains one file per existing `governance/` record and no coordination names.

## Steps

- [x] Take one isolated checkout of `ki-agentic-harness` from a named revision and record that full commit ID in `baseline_ref`. Do not share a mutable working directory with another writer.
- [x] Create `subagents/coordination/` and transcribe `ki-convenor.md`, `ki-steward.md`, `ki-ferryman.md`, `ki-wright.md` verbatim from §4 of the approved document named in `## Current state`. Frontmatter is `name` and `description` only; nothing from `## Boundary` may enter either.
- [x] Update `subagents/README.md`: add a `## coordination/` section after `## governance/`, with the same two-column Agent/Lane table shape, one row per new record.
- [x] Run tier 0 and tier 2 of `## Verify` and paste their real output — not a summary — into `## Review` / `### Verification`.
- [x] Attempt tier 1. If the host precondition is unmet, record the exact failure text under `### Verification` and report the capability as unavailable; do not report it as passed and do not substitute tier 2 for it.
- [x] Record the `PORTABLE-1`, `PORTABLE-2`, `PORTABLE-3` and `HOST-1` disposition for each of the four records in `## Review` as a conforming / gap / exclusion judgment, with the three expected `PORTABLE-3` gaps named and each naming the work that closes it.
- [x] Insert the `## Review` packet in its required section order, set `status: awaiting-review`, and stop. Do not accept, prune, push, merge, or release.

## Files touched

- `subagents/coordination/ki-convenor.md` (new)
- `subagents/coordination/ki-steward.md` (new)
- `subagents/coordination/ki-ferryman.md` (new)
- `subagents/coordination/ki-wright.md` (new)
- `subagents/README.md` (modified)
- `docs/roadmap/KI-HARNESS-GOV-101-record-coordination-lane-roles.md` (modified — `baseline_ref`, `status`, `updated_at`, completed Steps, `## Review`)

Nothing else. In particular not `.ki.toml`, not `ki-plugins`, and not any file under `skills/`.

## Verify

### Tier 0 — this record's own integrity

Runs on any host with the repository checked out. Exits `1` on malformed work-item frontmatter and `0` when clean; both outcomes were observed on this host at `6dd81641`.

```bash
ki repo roadmap list --repo .
```

This proves nothing about the four records. It guards the edits this item makes to its own roadmap file.

### Tier 1 — primary gate

This is the only mechanical check on the four record files. `ki-subagents-claude` `CLAUDE-1` to `CLAUDE-5` are all `[M]` at `FAIL` level: parseable YAML mapping frontmatter, a string `name` matching `^[a-z]+(?:-[a-z]+)*$` plus a non-empty string `description`, no field outside the current Claude field set, a non-empty instruction body, and no duplicate `name` among physical sources discovered under `subagents/`.

```bash
ki repo audit --skill ki-repo --repo .
ki repo audit --skill ki-subagents-claude --repo .
ki repo audit --skill ki-subagents --repo .
```

Read each honestly:

- The `ki-repo` run is a **regression guard**, not evidence about these records. `COV-1` is already satisfied by the existing `governance/` records; it would newly fail only if `.ki.toml` lost a declaration. Expect no change.
- The `ki-subagents-claude` run is the gate. Its `CLAUDE-5` uniqueness compares names only among files discovered under this repository's `subagents/` tree. It does **not** see `ki-plugins`, so it cannot prove uniqueness in the published flat namespace; tier 2 covers that.
- The `ki-subagents` run emits no mechanical verdict on record content. Every `PORTABLE` and `HOST` criterion is `[J]`. It renders review prompts; the dispositions are the reviewer's, recorded in `## Review`.

**Precondition, currently unmet.** Tier 1 requires a bootstrapped `ki` environment with this harness installed. On the host observed at `6dd81641` it is not, and all three commands exit `1` before reading anything — see `## Current state`. Running `ki bootstrap` is host activation owned outside this item; it is not a repository change and must not be performed as part of it.

### Tier 2 — host-independent minimum

These need only the checkout and POSIX tools, and each was executed on this host: empty against the existing `governance/` records, and non-empty against deliberately malformed fixtures carrying an unsupported `checkoutPath` field, an underscore in a `name`, and a duplicated `name`.

```bash
# CLAUDE-3: no frontmatter field outside the supported Claude set
keys() { for f in subagents/coordination/*.md; do sed -n '2,/^---$/p' "$f"; done \
  | sed -n 's/^\([A-Za-z][A-Za-z0-9_-]*\):.*/\1/p' | sort -u; }
test -z "$(keys | grep -vxE 'name|description|tools|disallowedTools|model|permissionMode|maxTurns|skills|mcpServers|hooks|memory|background|effort|isolation|color|initialPrompt')"

# CLAUDE-2: name grammar
test -z "$(grep -h '^name:' subagents/coordination/*.md | sed 's/^name:[[:space:]]*//' | grep -vxE '[a-z]+(-[a-z]+)*')"

# CLAUDE-5: no duplicate name anywhere under subagents/
test -z "$(grep -h '^name:' subagents/*/*.md | sed 's/^name:[[:space:]]*//' | sort | uniq -d)"

# Published flat namespace: no new name already taken in ki-plugins
test -z "$(comm -12 <(printf '%s\n' ki-convenor ki-ferryman ki-steward ki-wright) \
  <(grep -h '^name:' ../ki-plugins/knowledge-islands/agents/*.md | sed 's/^name:[[:space:]]*//' | sort -u))"
```

Each `test` exits `0` on pass and `1` on failure. Tier 2 is a re-implementation of four of the auditor's rules and will drift from it; it is a fallback that genuinely fails, not a replacement for tier 1, and it covers none of `CLAUDE-1` YAML parseability or `CLAUDE-4` body presence.

### What a clean run does not prove

A clean run at any tier proves a repository-owned source payload. It does not prove installation, activation, effective settings, or execution, and it says nothing about whether selecting one of these roles improves an outcome — which is exactly the `PORTABLE-3` gap the three records carry.

## Dependencies / blocks

`blocked_by: []` is correct, and was re-confirmed at `6dd81641`. Build order asks what must exist before this can be executed, and everything does: `subagents/` is a physical directory with an established domain-subdirectory convention, `.ki.toml` declares `[skills.ki-subagents]` and `[skills.ki-subagents-claude]`, the `ki-subagents-claude` contract these records must satisfy is published in this repository, and the four bodies are approved in final form. Nothing is waiting to be built.

`blocks: []` is likewise correct. The delivery that depends on this shaping is tracked on the coordination plane, not as another roadmap item.

Three relationships that deliberately are **not** `blocked_by`:

- **The unbootstrapped host.** Tier 1 of `## Verify` cannot run until the executing host has a bootstrapped `ki` environment. That is a host-activation condition with no work-item identifier, and the work-item format reserves `blocked_by` for build order between records. Recording it there would stall executable work behind an environment queue and misreport the reason. It is stated as a precondition in `## Verify` instead, with its observed failure text in `## Current state`.
- **`KI-HARNESS-GOV-093`.** It governs keeping the flat plugin projection in `ki-plugins/knowledge-islands/agents/` current. These four records land under that item rather than regenerating the projection here, so the published projection is four records behind until it runs. That is downstream of this item, not upstream of it.
- **A decision record for the coordination plane's governing rules.** None exists yet. When one does, the records gain a citation to it; they do not wait on it, because they deliberately cite the standard rather than restating the rules.

## Documentation impact

### Decision Records

No decision record is needed. The location decision is a placement choice inside an existing governed domain, made under an existing standard that leaves location open, and it is recorded here with its reasoning and its revisit condition. A decision record _is_ needed for the separate question of whether `ki-subagents` should define a native serialization so a record can exist independently of every projection; that is captured as its own work and is not part of this item.

### Specifications

No behaviour-level contract changes. The records conform to the existing `ki-subagents` and `ki-subagents-claude` contracts; no new field, rule, or check is introduced.

### Guides

`subagents/README.md` gains a `## coordination/` section and lane table, in the same shape as the existing `## governance/` section. That is in scope here, because adding a domain without documenting it leaves the README describing a tree that no longer matches. Its `## Convention` and `## Adding an agent` sections already cover the new domain and are not changed.

### Roadmap

Three follow-on captures, none created by this item and none blocking it:

- a decision record on separating a role record from its projections, so a record can exist independently of every runtime serialization;
- removal of the inlined unversioned rule copies from the coordination-plane agent configurations, once a decision record exists to cite;
- host activation of the `ki` environment on the development machine, so `ki repo audit` — the primary gate in `## Verify`, and the gate for every other governed item in the archipelago — can run at all. This is the condition recorded in `## Current state`; it is environment work rather than roadmap delivery, and its owner is named on coordination task `KNO-15`.

## Review

### Delivered

The approved boundary: four coordination-lane role records under `subagents/coordination/`, transcribed verbatim from the human-approved bodies, plus the `subagents/README.md` domain section that keeps the guide matching the tree. Exclusions held: no `.ki.toml` change, no regeneration of the flat `ki-plugins` projection (`KI-HARNESS-GOV-093`), no runtime/instance/path/scheduling/permission fact carried into any record body, no coordination-plane doctrine restated, no current work item named in a record, and no push, merge, release or acceptance.

Immutable baseline: `3f409aaceaa6baae223a20c297dfd06ad733d536` on `main`. The record was captured at `6dd81641`; the baseline advanced by exactly one commit, `3f409aac docs(roadmap): shape KI-HARNESS-GOV-101 to ready`, which touched only this roadmap file. Nothing under `subagents/`, `.ki.toml`, or `skills/` moved, so the approved reasoning is unaffected.

Executed in one isolated `git worktree` on branch `ki-harness-gov-101-coordination-lane-roles`, not in the shared archipelago checkout. One writer, one checkout.

Evidence: the four record files are byte-identical to the approved bodies (verified by re-extraction and comparison, below); tier 0 and tier 2 of `## Verify` pass with real output recorded; tier 1 is **unavailable** on this host and is reported as unavailable, not as passed.

### Change Summary

Five files changed, all inside `## Files touched`:

- `subagents/coordination/ki-convenor.md` (new, 4648 bytes)
- `subagents/coordination/ki-steward.md` (new, 5587 bytes)
- `subagents/coordination/ki-ferryman.md` (new, 5811 bytes)
- `subagents/coordination/ki-wright.md` (new, 5274 bytes)
- `subagents/README.md` (modified — `## coordination/` section inserted after `## governance/`, with a two-column Agent/Lane table in the existing shape)
- this record (modified — `baseline_ref`, `status`, `updated_at`, Steps, `## Review`, `Discussion`)

Material decisions:

- **Transcription was mechanical, not manual.** The four bodies were extracted programmatically from the fenced blocks of the approved document and written unmodified, then re-extracted and compared byte-for-byte. This removes transcription drift as a failure mode rather than asserting it did not occur.
- **The repository's own markdown formatter enforced nothing.** `bunx rumdl check` — the `*.md` hook this repository runs on commit, per `lint-staged` in `package.json` — reports `Success: No issues found in 5 files`. The approved bodies therefore land with zero mechanical deviation, not merely with permitted deviation.
- **README lane wording is authored here, not approved elsewhere.** The four lane cells are one-line summaries of each record's own `## What you own vs defer`; they are guide text in the existing table's shape, not record content.

Approved deviation, one: **`## Current state` understates the approved frontmatter.** It says each record "carries `name` and `description` frontmatter only." The approved bodies also carry `model: inherit` and a `color`. Both are inside the `ki-subagents-claude` supported field set, both are projection-layer fields rather than record content — which `## Context` already establishes is where projection facts belong — and all five existing `governance/` records carry exactly the same pair. The approved bodies were transcribed as approved; the item's prose is the inaccurate side, and re-drafting the records to match it would have been an ungoverned edit to an approved original. Flagged for the reviewer rather than silently reconciled.

### Verification

#### Tier 0 — this record's own integrity

```console
$ ki repo roadmap list --repo .
├─ roadmap (21)
│  ├─ now (4)
│  │  ├─ KI-HARNESS-OPS-005 [in-progress] Acquire AI sessions
│  │  ├─ KI-HARNESS-GOV-087 [ready] Evaluate Obscura browser runtime
│  │  ├─ KI-HARNESS-GOV-090 [ready] Accept estate work trades
│  │  ╰─ KI-HARNESS-GOV-101 [ready] Record coordination lane roles
...
╰─ summary: ITEMS=21 ACTIVE=21 DONE=0 TRADES=0 IMPORTS=0 EXPORTS=0
$ echo $?
0
```

Exit `0`. Run before this record's own edits; the `[ready]` shown is the pre-edit status.

Re-run after the edits to this record — the run that actually guards them, including the `## Review` packet shape:

```console
$ ki repo roadmap list --repo .
│  ╰─ 📁 ki-agentic-harness-GOV-101 (/Users/krisbrown/workspaces/kit/worktrees/ki-agentic-harness-GOV-101)
│  │  ├─ KI-HARNESS-GOV-101 [awaiting-review] Record coordination lane roles
╰─ summary: ITEMS=21 ACTIVE=21 DONE=0 TRADES=0 IMPORTS=0 EXPORTS=0
$ echo $?
0
```

#### Tier 1 — primary gate: UNAVAILABLE, not passed

All three invocations exit `1` before reading anything in the repository. This is the host-activation precondition recorded in `## Current state`, unchanged at this baseline.

```console
$ ki repo audit --skill ki-repo --repo .
ki: error: declared skill ki-repo is provided by no declared harness (knowledgeislands/ki-agentic-harness); knowledgeislands/ki-agentic-harness is not installed
$ echo $?
1
$ ki repo audit --skill ki-subagents-claude --repo .
ki: error: declared skill ki-repo is provided by no declared harness (knowledgeislands/ki-agentic-harness); knowledgeislands/ki-agentic-harness is not installed
$ echo $?
1
$ ki repo audit --skill ki-subagents --repo .
ki: error: declared skill ki-repo is provided by no declared harness (knowledgeislands/ki-agentic-harness); knowledgeislands/ki-agentic-harness is not installed
$ echo $?
1
$ ki repo diag --repo .
╭─ KI REPO DIAG
├─ repositories (1)
│  ╰─ /Users/krisbrown/workspaces/kit/knowledgeislands/ki-agentic-harness (unrepairable)
│     ╰─ ✗ Repository: ki environment is not bootstrapped; run `ki bootstrap` first
╰─ summary: REPOSITORIES=1 HEALTHY=0 REPAIRABLE=0 UNREPAIRABLE=1
```

**The only mechanical check on the four record files did not run.** `CLAUDE-1` YAML parseability and `CLAUDE-4` body presence are not covered by tier 2 and are therefore unchecked by the contract's own auditor. `ki bootstrap` is host activation owned outside this item and was not performed. A reviewer should treat the four records as unaudited against `ki-subagents-claude` until tier 1 runs.

#### Tier 2 — host-independent minimum

All four checks exit `0`.

```console
$ # CLAUDE-3: no frontmatter field outside the supported Claude set
$ keys() { for f in subagents/coordination/*.md; do sed -n '2,/^---$/p' "$f"; done \
>   | sed -n 's/^\([A-Za-z][A-Za-z0-9_-]*\):.*/\1/p' | sort -u; }
$ keys | tr '\n' ' '
color description model name
$ test -z "$(keys | grep -vxE 'name|description|tools|disallowedTools|model|permissionMode|maxTurns|skills|mcpServers|hooks|memory|background|effort|isolation|color|initialPrompt')"; echo $?
0

$ # CLAUDE-2: name grammar
$ grep -h '^name:' subagents/coordination/*.md | sed 's/^name:[[:space:]]*//' | tr '\n' ' '
ki-convenor ki-ferryman ki-steward ki-wright
$ test -z "$(grep -h '^name:' subagents/coordination/*.md | sed 's/^name:[[:space:]]*//' | grep -vxE '[a-z]+(-[a-z]+)*')"; echo $?
0

$ # CLAUDE-5: no duplicate name anywhere under subagents/
$ grep -h '^name:' subagents/*/*.md | sed 's/^name:[[:space:]]*//' | sort | tr '\n' ' '
ki-convenor ki-decision-author ki-engineering-lead ki-ferryman ki-repo-kb-curator ki-repo-kb-streams-curator ki-skills-lead ki-steward ki-wright
$ grep -h '^name:' subagents/*/*.md | sed 's/^name:[[:space:]]*//' | sort | uniq -d
$ test -z "$(grep -h '^name:' subagents/*/*.md | sed 's/^name:[[:space:]]*//' | sort | uniq -d)"; echo $?
0

$ # Published flat namespace: no new name already taken in ki-plugins
$ PLUGINS=/Users/krisbrown/workspaces/kit/knowledgeislands/ki-plugins/knowledge-islands/agents
$ grep -h '^name:' $PLUGINS/*.md | sed 's/^name:[[:space:]]*//' | sort -u | tr '\n' ' '
ki-decision-author ki-engineering-lead ki-repo-kb-curator ki-repo-kb-streams-curator ki-skills-lead
$ comm -12 <(printf '%s\n' ki-convenor ki-ferryman ki-steward ki-wright) \
>   <(grep -h '^name:' $PLUGINS/*.md | sed 's/^name:[[:space:]]*//' | sort -u)
$ test -z "$(comm -12 <(printf '%s\n' ki-convenor ki-ferryman ki-steward ki-wright) \
>   <(grep -h '^name:' $PLUGINS/*.md | sed 's/^name:[[:space:]]*//' | sort -u))"; echo $?
0
```

One deviation from the literal command text in `## Verify`: the projection check uses an absolute path to `ki-plugins` rather than `../ki-plugins`, because this work ran in an isolated worktree outside the archipelago root and the relative path does not resolve there. Same repository (`d177a05e`), same comparison, same result.

#### Supplementary — not part of `## Verify`

Two host-independent checks were added because tier 1 could not run and tier 2 explicitly covers neither. They are supplementary evidence, not a substitute for the gate.

```console
$ # Verbatim transcription: re-extract each approved body and compare byte-for-byte
$ python3 <re-extract-and-compare>
subagents/coordination/ki-convenor.md: identical=True sha256=a970ad62375b0274
subagents/coordination/ki-steward.md: identical=True sha256=2088ab8e04aa6268
subagents/coordination/ki-ferryman.md: identical=True sha256=a166b6a011faf751
subagents/coordination/ki-wright.md: identical=True sha256=f675c7bc43e541ed

$ # CLAUDE-1 / CLAUDE-4 approximation: YAML mapping frontmatter and non-empty body
$ RUBYOPT=-EUTF-8 ruby -ryaml -e '<parse-each-record>'
subagents/coordination/ki-convenor.md mapping=true keys=["color", "description", "model", "name"] description_ok=true body_nonempty=true body_chars=4025
subagents/coordination/ki-ferryman.md mapping=true keys=["color", "description", "model", "name"] description_ok=true body_nonempty=true body_chars=5058
subagents/coordination/ki-steward.md mapping=true keys=["color", "description", "model", "name"] description_ok=true body_nonempty=true body_chars=4917
subagents/coordination/ki-wright.md mapping=true keys=["color", "description", "model", "name"] description_ok=true body_nonempty=true body_chars=4562
$ echo $?
0

$ # Repository markdown formatter (lint-staged *.md hook)
$ bunx rumdl check subagents/coordination/*.md subagents/README.md
Success: No issues found in 5 files (23ms)
$ echo $?
0
```

Ruby's YAML loader is not the auditor's parser and this is a re-implementation in the same sense tier 2 is. It raises confidence; it does not discharge `CLAUDE-1` or `CLAUDE-4`.

#### `ki-subagents` dispositions

`PORTABLE-1` through `PORTABLE-3` and `HOST-1` are all `[J]` judgment criteria. No tool emits them; these are the implementer's reading, offered for the reviewer to accept or overturn.

| Record         | PORTABLE-1 | PORTABLE-2 | PORTABLE-3 | HOST-1 |
| -------------- | ---------- | ---------- | ---------- | ------ |
| `ki-convenor`  | conforming | conforming | conforming | conforming |
| `ki-steward`   | conforming | conforming | **gap**    | conforming |
| `ki-ferryman`  | conforming | conforming | **gap**    | conforming |
| `ki-wright`    | conforming | conforming | **gap**    | conforming |

- **PORTABLE-1 — Selection and identity.** Conforming for all four. Each has a stable `ki-`-prefixed name, and a `description` that states concrete selection cues and the three roles it is not, with no runtime claim.
- **PORTABLE-2 — Bounded instructions.** Conforming for all four. Each carries `## Grounding`, `## When invoked`, `## What you own vs defer` naming all three siblings, and `## Lenses`. Note that only three of the four carry `## Output bar` — `ki-convenor` does not — which is consistent with the approved bodies and with the criterion, which asks for lane, grounding and hand-offs rather than a fixed section list.
- **PORTABLE-3 — Orchestration and outcome.** Orchestration is bounded in all four. Outcome evidence divides them:
  - `ki-convenor` — **conforming.** Its `## Outcome evidence` records a dated first engagement with three specific findings, and names the load-bearing one: the grounding step prevented a duplicate work record. It also names what is not yet evidenced.
  - `ki-steward` — **gap**, and the intended result. The role is one day old with no completed work. Closed by the boundary-activation and two-way-link work: whether declaring the governing standard in the repositories it governs turns an inert rule into one whose audit fails on a real violation.
  - `ki-ferryman` — **gap**, and the intended result. Closed by naming a remote target and running the persistence proof against it.
  - `ki-wright` — **gap**, and the intended result. Closed by the covering-task front-matter work in `tools-ki`: whether a separately-held delivery role ships the field together with its validation, specification and contradiction check.

  Each gap is declared in the record itself, cites `PORTABLE-3` by name, and names the work that closes it. They were not closed by writing evidence that does not exist; `ki-subagents` holds that a syntactically valid file is not evidence that selecting a role improved an outcome.
- **HOST-1 — No false runtime assurance.** Conforming for all four. No record claims installation, activation, effective settings or execution, and none carries an instance identifier, checkout path, schedule, permission grant or coordination-plane fact. The three `PORTABLE-3` gaps are themselves `HOST-1` compliance: the records decline to present source validity as outcome evidence.

### Outstanding concerns

Four, none of them a defect in the delivered files.

1. **The primary gate did not run.** Tier 1 is unavailable on this host, so the four records are unaudited against `ki-subagents-claude`; `CLAUDE-1` and `CLAUDE-4` are unchecked by anything authoritative. Owner and action are recorded on coordination task `KNO-15` (host activation of the `ki` environment). This is a precondition, not a `blocked_by` dependency, and it is a condition on the whole archipelago rather than on this change. A reviewer may reasonably require tier 1 to pass on a bootstrapped host before accepting.
2. **`## Current state` misdescribes the approved frontmatter** as `name` and `description` only. See the approved deviation in `### Summary of changes`. The reviewer decides whether the records or the prose is corrected; correcting the records would be an ungoverned edit to a human-approved original and was not done.
3. **The published projection is four records behind.** `ki-plugins/knowledge-islands/agents/` at `d177a05e` carries the five `governance/` names and none of the four new ones. That is `KI-HARNESS-GOV-093`, deliberately downstream of this item and explicitly excluded by `## Boundary`.
4. **The three follow-on captures in `## Documentation impact` / `Roadmap` have no roadmap identifiers.** They are described but not captured, so today they are held only in this record and in this section — which is deleted at the prune. Capturing them through `ki-next` is `ki-convenor`'s lane and would be a roadmap write outside this item's authorized file set, so it was not done here. The reviewer should require identifiers for at least the decision record on separating a role record from its projections before acceptance, since it is the one with no other home.

### Post-change review

**Goal.** Met. Four lanes that existed only as external agent configurations now have repository originals, so changing what a lane answers for is a governed repository change. The `ki-` prefix rationale is discharged: the names are proven unique both within `subagents/` and against the published flat namespace.

**Scope.** Held exactly. Five files, all named in `## Files touched`, plus this record. No `.ki.toml`, no `skills/`, no `ki-plugins`, no doctrine restated, no work item named in a record body. Nothing was added past the item's edge; the one thing found past it — the frontmatter description mismatch — was reported rather than fixed.

**Regression risk.** Low, and the residue is honest rather than absent. The change is five additive markdown files in a tree that already has an established domain-subdirectory convention. `ki-repo` `COV-1` was already satisfied by `governance/` and `.ki.toml` is untouched, so the coverage cascade cannot have moved. Name collision is the one real regression path and it is checked in both namespaces. The unmeasured risk is that the four records fail a `ki-subagents-claude` rule tier 2 does not re-implement — `CLAUDE-1` or `CLAUDE-4` — which the supplementary parse makes unlikely but does not exclude. Fully reversible: delete `subagents/coordination/` and revert one README section.

**Acceptance readiness.** Ready to review, with concern 1 as the reviewer's call. Everything the item asked for is delivered and evidenced; what is missing is the gate the host cannot currently run, reported as unavailable rather than dressed up as passed.

### Mini recap

Delivered the four coordination-lane role records and the `subagents/README.md` domain section, transcribed byte-for-byte from the human-approved bodies, from immutable baseline `3f409aaceaa6baae223a20c297dfd06ad733d536` in one isolated worktree.

Verified: tier 0 exits `0`; all four tier 2 checks exit `0`, including cross-repository name uniqueness against the published `ki-plugins` projection; the repository's own markdown formatter reports no issues, so the transcription is exact rather than merely permitted. Tier 1 — the only mechanical check on the record files — is **unavailable** on this host and is reported as unavailable.

Concerns: the primary gate did not run (`KNO-15`); `## Current state` misdescribes the approved frontmatter; the published projection is four records behind (`KI-HARNESS-GOV-093`); three follow-on captures still lack identifiers.

Learning routes, proposed and not promoted: that a verification whose primary gate cannot execute on the working host should say so in the record's own `## Verify` at shaping time rather than at review — this item did that, and it is worth generalising; that mechanical transcription with a byte-comparison step is a cheap, reusable way to discharge "transcribe verbatim" instructions; and that three roles landing with a declared, self-citing `PORTABLE-3` gap is a usable pattern for recording a role before it has earned its evidence.

## Done

Accepted 2026-09-26 by Kris Brown on the review packet above.

## Discussion

### Why one directory rather than four

The four were designed as one interlocking set; each record's hand-offs name the other three. Distributing them by subject would hide that they are a coordinated whole, and would file the stewardship role beside `ki-skills-lead`, which is a domain reviewer rather than a lane owner in an orchestrated set.

### Why the `ki-` prefix on each name

`name` must be unique within the candidate source tree, and the plugin marketplace projection flattens the domain directories, so the tree these names must be unique within is published. Bare `steward`, `wright`, and `ferryman` in a public namespace are collision bait and say nothing about whose they are. The human-facing names survive intact in each record's title and body; the prefix is namespacing, not renaming.

### What publication costs

This repository is public and MIT, and projects into a public marketplace, so these records are published. That is treated as the benefit rather than the cost: it forces the exact line the record/projection distinction asks for, because a fact that cannot be published is a projection fact. Every field placement was decided by asking whether it could be published and still be true of the role on a different substrate.

### When to revisit the location

Revisit on the first role record that _cannot_ be published — one whose lane is only meaningful inside one company, or that must name a private target. At that point a company-scoped repository earns its setup cost. Until then it would be a second home for records with nothing private in them.

### Why the verification is tiered

The first draft named three `ki repo audit` invocations and treated them as one gate. Shaping found three separate problems with that, and the tiers exist to keep each one visible rather than averaged away.

The commands do not run on the host this work is being done from — not because they are the wrong commands, but because the `ki` environment there is not bootstrapped. A verification that cannot execute is not a verification, and the honest response is to name the precondition and its owner rather than to quietly swap in something weaker.

The three invocations also do not carry equal weight. Only `ki-subagents-claude` mechanically inspects the four files. `ki-repo` `COV-1` was already green before this item and is a regression guard. `ki-subagents` has no mechanical item at all — every `PORTABLE` and `HOST` criterion is judgment — so describing it as something that "reports three gaps" attributed to a tool a conclusion only a reviewer can reach.

And the draft claimed the adapter audit proves names unique "across the whole tree, including the flat projection". It does not: source discovery walks this repository's `subagents/` directory, and the published projection lives in `ki-plugins`. Tier 2 makes that cross-repository claim separately and explicitly, because the `ki-` prefix rationale below depends on it.

Tier 2 is knowingly a partial re-implementation of the auditor's rules and will drift from them. It is included because the alternative on an unbootstrapped host is an item whose `## Verify` is aspirational, and a rule nothing checks is a document rather than governance. It was run against the existing records and against deliberately malformed fixtures, so it is known to fail when it should.

### What the approved frontmatter actually carries

Found during implementation. `## Current state` says each approved record carries `name` and `description` frontmatter only. Each also carries `model: inherit` and a `color`, exactly as all five existing `governance/` records do, and both fields are inside the `ki-subagents-claude` supported set. The shaping prose is the inaccurate side, not the approved bodies.

This is worth keeping rather than quietly fixing, because it is the record/projection distinction biting at the one place it is easy to get wrong. `## Context` already settles that the frontmatter is the projection layer and the body is the record; `model` and `color` are therefore correctly placed projection facts, and `## Boundary`'s prohibition on carrying runtime facts binds the body, not the frontmatter. A stricter reading of the Step would have deleted two fields from a human-approved original to satisfy a sentence in the same document — which is the failure mode the "transcribe, do not improve" instruction exists to prevent.

### The baseline moved between capture and execution

Captured at `6dd81641`, executed from `3f409aaceaa6baae223a20c297dfd06ad733d536`. The single intervening commit is this record's own shaping to Ready and touched nothing else, so no approved reasoning was invalidated. Recorded because "the baseline had not moved" is a claim, not a default, and the cost of checking is one `git diff --stat`.

### Governing coordination task

Coordination task `KNO-2` on the external plane carries the approved proposal and the human approval. It names this identifier, and this record names it, pending the covering-task frontmatter field that would make the link structural rather than prose. Delivery ran under child task `KNO-16`.

### What acceptance changed in this record

Two prose corrections, both to this record and neither to a delivered file.

`## Current state` said each approved record carries `name` and `description` frontmatter only; it now names the four fields the approved bodies actually carry. This is the correction the reviewer reserved in `### Outstanding concerns` concern 2 and in `### What approved frontmatter actually carries`. The delivered records were not touched: correcting them to match the prose would have been an ungoverned edit to a human-approved original, and the prose was the inaccurate side. `## Steps` inherits the same understatement in its second step. It is left as written, because it is the instruction that was given rather than an observation, and the step is complete against the approved bodies it points at.

The review packet's second heading was `### Change Summary`. The work-item format requires `### Summary of changes`, and `ki-accept` refuses a packet whose six headings are not exactly those in order, so the record could not have been closed as written. The heading was renamed and its one in-record citation updated. No content moved.

### How the outstanding concerns stood at acceptance

- **Concern 1, the primary gate.** Still unavailable, re-attempted at acceptance rather than carried forward on the earlier claim: `ki repo diag --repo .` reports `ki environment is not bootstrapped; run 'ki bootstrap' first`. `CLAUDE-1` and `CLAUDE-4` remain unchecked by the contract's own auditor. Accepted on tier 0 and tier 2 with tier 1 recorded as unavailable, which is the disposition the approving human gave. `ki bootstrap` is host activation and is not repository work.
- **Concern 2, the frontmatter prose.** Resolved above.
- **Concern 3, the published projection.** Unchanged and out of scope. `KI-HARNESS-GOV-093` owns it.
- **Concern 4, the missing follow-on identifiers.** Closed before acceptance, which is why acceptance waited on it. `KI-HARNESS-GOV-102` — _Decide role record serialization_ — and `KI-HARNESS-GOV-103` — _Cite coordination rules once_ — are captured at `4a04c480` on `main`, both `horizon: triage`, `status: draft`. The third follow-on, host activation, is coordination work with no roadmap identifier and is named in `## Documentation impact`. The two decisions that would otherwise have been deleted with this record now have a home that survives its prune.
