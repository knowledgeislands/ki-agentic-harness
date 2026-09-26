---
id: KI-HARNESS-GOV-101
area: GOV
title: Record coordination lane roles
theme: governance-consistency
horizon: now
status: draft
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-09-26T13:09:36Z
updated_at: 2026-09-26T13:09:36Z
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

- `subagents/` contains `governance/` with five records and no `coordination/` directory.
- `.ki.toml` already declares `[skills.ki-subagents]` and `[skills.ki-subagents-claude]`; no coverage change is needed.
- `subagents/README.md` documents only the `governance/` domain, so adding a domain without updating it would leave the README stale.
- The four record bodies exist in approved final form on the governing coordination task `KNO-2`, which names this item as its governing record. The approved proposal cited baseline `701d669`; the repository has since advanced to `aa19be0a`, and the approved proposal's reasoning is unaffected by the intervening roadmap-only commits.
- The approved proposal reserved `KI-HARNESS-GOV-096`, which was allocated to other work before this item was written; `GOV-101` is the next free number against the `_ISSUES.md` high-water mark.
- Three of the four records will carry a named `PORTABLE-3` gap on outcome evidence. The roles are one day old and `ki-subagents` states that a syntactically valid file is not evidence that selecting a role improved an outcome. Each gap names the work that closes it.

## Steps

- [ ] Shape this record to Ready: confirm the section set below is concrete, the verification is checkable, and the acceptance criteria are judgeable by a stranger.
- [ ] Create `subagents/coordination/` and write `ki-convenor.md`, `ki-steward.md`, `ki-ferryman.md`, `ki-wright.md` from the approved bodies, one isolated checkout from a named baseline.
- [ ] Update `subagents/README.md` with a `coordination/` section and lane table matching the existing `governance/` section.
- [ ] Run the verification below and record its real output against this item.
- [ ] Return the item to awaiting review; do not accept it.

## Files touched

- `subagents/coordination/ki-convenor.md` (new)
- `subagents/coordination/ki-steward.md` (new)
- `subagents/coordination/ki-ferryman.md` (new)
- `subagents/coordination/ki-wright.md` (new)
- `subagents/README.md` (modified)

## Verify

```bash
ki repo audit --skill ki-repo --repo knowledgeislands/ki-agentic-harness
ki repo audit --skill ki-subagents-claude --repo knowledgeislands/ki-agentic-harness
ki repo audit --skill ki-subagents --repo knowledgeislands/ki-agentic-harness
```

The first must show no coverage failure from four newly detected `subagents/**/*.md` records. The second must show a conforming frontmatter shape, an allowed field set, and names unique across the whole tree, including the flat projection. The third is expected to report three named `PORTABLE-3` gaps on outcome evidence and no other finding; those gaps are the intended result, not a defect to resolve by writing evidence that does not exist.

If the host does not register the `ki-subagents-claude` adapter audit, report that capability as unavailable rather than passed, and fall back to the adapter's focused source tests. The smallest check that would actually fail if these records were wrong is name uniqueness and the allowed field set.

A clean run proves a repository-owned source payload and nothing more. It does not prove installation, activation, effective settings, or execution.

## Dependencies / blocks

No build-order dependency: everything these records need already exists in this repository. `blocked_by` is therefore empty.

Two sequencing relationships that are preference rather than build order:

- `KI-HARNESS-GOV-093` governs keeping the flat plugin projection current. These four records land under that item rather than regenerating the projection here, so the projection is four records behind until it runs.
- The coordination plane's governing rules have no decision record yet. When one exists, the records gain a citation to it; they do not wait on it, because they deliberately cite the standard rather than restating the rules.

## Documentation impact

### Decision Records

No decision record is needed. The location decision is a placement choice inside an existing governed domain, made under an existing standard that leaves location open, and it is recorded here with its reasoning and its revisit condition. A decision record _is_ needed for the separate question of whether `ki-subagents` should define a native serialization so a record can exist independently of every projection; that is captured as its own work and is not part of this item.

### Specifications

No behaviour-level contract changes. The records conform to the existing `ki-subagents` and `ki-subagents-claude` contracts; no new field, rule, or check is introduced.

### Guides

`subagents/README.md` gains a `coordination/` section and lane table. That is in scope here, because adding a domain without documenting it leaves the README describing a tree that no longer matches.

### Roadmap

Two follow-on captures, neither created by this item: a decision record on separating a role record from its projections, and the removal of the inlined unversioned rule copies from the coordination-plane agent configurations once a decision record exists to cite.

## Discussion

### Why one directory rather than four

The four were designed as one interlocking set; each record's hand-offs name the other three. Distributing them by subject would hide that they are a coordinated whole, and would file the stewardship role beside `ki-skills-lead`, which is a domain reviewer rather than a lane owner in an orchestrated set.

### Why the `ki-` prefix on each name

`name` must be unique within the candidate source tree, and the plugin marketplace projection flattens the domain directories, so the tree these names must be unique within is published. Bare `steward`, `wright`, and `ferryman` in a public namespace are collision bait and say nothing about whose they are. The human-facing names survive intact in each record's title and body; the prefix is namespacing, not renaming.

### What publication costs

This repository is public and MIT, and projects into a public marketplace, so these records are published. That is treated as the benefit rather than the cost: it forces the exact line the record/projection distinction asks for, because a fact that cannot be published is a projection fact. Every field placement was decided by asking whether it could be published and still be true of the role on a different substrate.

### When to revisit the location

Revisit on the first role record that _cannot_ be published — one whose lane is only meaningful inside one company, or that must name a private target. At that point a company-scoped repository earns its setup cost. Until then it would be a second home for records with nothing private in them.

### Governing coordination task

Coordination task `KNO-2` on the external plane carries the approved proposal and the human approval. It names this identifier, and this record names it, pending the covering-task frontmatter field that would make the link structural rather than prose.
