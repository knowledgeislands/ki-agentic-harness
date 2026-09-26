---
id: KI-HARNESS-GOV-101
area: GOV
title: Record coordination lane roles
theme: governance-consistency
horizon: now
status: ready
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-09-26T13:09:36Z
updated_at: 2026-09-26T13:19:12Z
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
- The four record bodies exist in approved final form in §4 of the Paperclip document **"Role records for Convenor, Steward, Ferryman and Wright"** (`3d3ef2cb-6f62-47e7-9c13-7aa6f0ffeeb2`, revision `d3675fd9-aac9-4b8e-a9bd-1731ba03aee4`) on coordination task `KNO-2`, which names this item as its governing record. Each carries `name` and `description` frontmatter only, and an instruction body with `## Grounding`, `## When invoked`, `## What you own vs defer`, `## Orchestration`, `## Lenses`, `## Outcome evidence`, and — for three of the four — `## Output bar`. Implementation transcribes those bodies; it does not author them.
- The approved proposal cited baseline `701d669`. The repository has since advanced through roadmap-only commits to `6dd81641`, which is the commit that captured this record; nothing under `subagents/`, `.ki.toml`, or the `ki-subagents*` skills changed between the two, so the approved reasoning is unaffected.
- The approved proposal reserved `KI-HARNESS-GOV-096`, which was allocated to other work before this item was written; `GOV-101` is the next free number against the `_ISSUES.md` `GOV` high-water mark, which the capture advanced to `101`.
- Three of the four records will carry a named `PORTABLE-3` gap on outcome evidence — Steward, Ferryman, Wright; Convenor is expected conforming. The roles are one day old and `ki-subagents` states that a syntactically valid file is not evidence that selecting a role improved an outcome. Each gap names the work that closes it. `PORTABLE-1` through `PORTABLE-3` and `HOST-1` are all judgment criteria, so these dispositions are recorded by the reviewer in `## Review`; no tool emits them.
- **The `ki` environment on the current development host is not bootstrapped.** `ki repo diag --repo .` reports `ki environment is not bootstrapped; run 'ki bootstrap' first`, and every `ki repo audit --skill <x>` invocation exits `1` with `declared skill ki-repo is provided by no declared harness (knowledgeislands/ki-agentic-harness); knowledgeislands/ki-agentic-harness is not installed`. `ki repo roadmap list --repo .` does run. This is a host-activation condition, not a property of this repository; it is a precondition of the primary gate below, not a `blocked_by` dependency.
- The flat plugin projection referred to in `## Boundary` lives in a different repository: `ki-plugins/knowledge-islands/agents/`, observed at `d177a05e`. It currently contains one file per existing `governance/` record and no coordination names.

## Steps

- [ ] Take one isolated checkout of `ki-agentic-harness` from a named revision and record that full commit ID in `baseline_ref`. Do not share a mutable working directory with another writer.
- [ ] Create `subagents/coordination/` and transcribe `ki-convenor.md`, `ki-steward.md`, `ki-ferryman.md`, `ki-wright.md` verbatim from §4 of the approved document named in `## Current state`. Frontmatter is `name` and `description` only; nothing from `## Boundary` may enter either.
- [ ] Update `subagents/README.md`: add a `## coordination/` section after `## governance/`, with the same two-column Agent/Lane table shape, one row per new record.
- [ ] Run tier 0 and tier 2 of `## Verify` and paste their real output — not a summary — into `## Review` / `### Verification`.
- [ ] Attempt tier 1. If the host precondition is unmet, record the exact failure text under `### Verification` and report the capability as unavailable; do not report it as passed and do not substitute tier 2 for it.
- [ ] Record the `PORTABLE-1`, `PORTABLE-2`, `PORTABLE-3` and `HOST-1` disposition for each of the four records in `## Review` as a conforming / gap / exclusion judgment, with the three expected `PORTABLE-3` gaps named and each naming the work that closes it.
- [ ] Insert the `## Review` packet in its required section order, set `status: awaiting-review`, and stop. Do not accept, prune, push, merge, or release.

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

### Governing coordination task

Coordination task `KNO-2` on the external plane carries the approved proposal and the human approval. It names this identifier, and this record names it, pending the covering-task frontmatter field that would make the link structural rather than prose.
