---
id: KI-HARNESS-GOV-227
area: GOV
title: Repository storage declarations
purpose: capability
project: observatory
component: keystone
priority: medium
size: m
kind: deliver
horizon: next
status: draft
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-10-19T23:30:04Z
updated_at: 2026-10-20T02:39:00Z
transferred_from: ki-principal ki.observatory STORAGE-OWNER a), 2026-10-20
---

# KI-HARNESS-GOV-227: Repository Storage Declarations

## Goal

`ki-repo` owns repository-owned storage declarations as a `.ki.toml` table: what a tool, MCP server or app stores in its XDG config, data, cache and state folders, and why. `ki-engineering` keeps the XDG path-resolution rule, and Rig may later add third-party tools.

## Context

Kris Brown decided STORAGE-OWNER a) on 20 October 2026 in the Observatory work, under the overnight authority recorded as OVERNIGHT in the [Observatory decisions log](/Users/krisbrown/workspaces/knowledge-islands/ki-principal/+/_WORK/ki.observatory/decisions.md): `ki-repo`, as a `.ki.toml` declaration, with `ki-engineering` keeping the path-resolution rule and Rig later adding third-party tools. It was recommended because `ki-repo` is the one repository-wide contract, so it covers tools, MCP servers and apps alike, and `ki` can expose it as a stable machine contract. A blind review agreed and lifted the recommendation to high confidence.

The alternatives considered were [`ki-repo-tools`](../../skills/repo-structure/ki-repo-tools/references/standards-tool-repositories.md), which already requires a tool to follow XDG but covers only tool repositories and would leave MCP servers and apps undeclared; Rig's catalogue, which describes declared intent and profile selection on one machine rather than a repository-owned standard; and [`ki-engineering`](../../skills/governance/ki-engineering/references/standards-engineering.md), which owns how code resolves XDG paths, not what a tool declares.

The review made one point this record carries: choosing `.ki.toml` does not itself choose a schema owner, because the [configuration contract](../../skills/keystone/ki-repo/references/standards-configuration.md#scaffolding--ownership) assigns each table's schema and conformer to the skill that owns it. This decision therefore extends `ki-repo`'s responsibilities to a new table; it does not apply an existing storage-declaration rule. The schema is still to be designed.

## Boundary

- In: a `ki-repo`-owned `.ki.toml` table in which a repository declares, for each tool, MCP server or app it ships, what it stores under each XDG category and why; its schema, documentation and audit; the `ki-repo` standard text that names the new responsibility.
- In: a cross-reference from `ki-engineering`'s XDG path-resolution rule to the declaration, so the two read as one contract.
- Out: XDG path resolution, which stays with `ki-engineering`; third-party tools, which Rig may add later from its side; the Observatory's tool-storage view, which apps-observatory.local owns; any machine inventory, cleanup, deletion or migration.

## Current state

Checked on 20 October 2026 at `071567a1`. No `.ki.toml` table declares storage. `ki-repo-tools` requires a tool to follow XDG, and `ki-engineering` owns XDG path resolution; neither says what a repository stores or why. The configuration contract's Scaffolding and ownership section assigns each table's schema to its owning skill.

## Steps

- [ ] Design the table's schema with the owner: per-item entries for each tool, MCP server or app, each XDG category with its purpose and whether its content is disposable, recoverable or the owner's knowledge, and shared namespaces with their owners.
- [ ] Add the table and its responsibility to the `ki-repo` standard and the configuration contract.
- [ ] Add a `ki-repo` rubric criterion that validates a declared table's shape, with fixture tests, and regenerate `rubric.md`.
- [ ] Add the cross-reference from `ki-engineering`'s XDG rule to the declaration.

## Files touched

- `skills/keystone/ki-repo/references/standards-repository.md`, `standards-configuration.md`, `rubric.md`, and its rubric context, items and tests
- `skills/governance/ki-engineering/references/standards-engineering.md`

## Verify

- `bun run test` and `bunx tsc --noEmit` pass.
- `ki dev skill rubric ki-repo` leaves no diff, and `ki repo audit --skill ki-repo` reports no FAIL here; a fixture with a malformed table fails the new criterion and a well-formed one passes.

## Dependencies / blocks

Blocking for one phase only: the tool-storage phase of the Observatory's machine instrument in apps-observatory.local waits on this declaration owner and needs the table's schema to read. Its other phases do not wait on this record.

`ki` exposes the declaration to readers such as the Observatory; whether that needs a tools-ki change beyond the existing `.ki.toml` reading is settled at planning and named here before the record becomes Ready.

## Documentation impact

### Decision Records

None needed: STORAGE-OWNER a) is in the Observatory decisions log.

### Specifications

None unless `ki` exposes the table as a machine contract, settled at planning.

### Guides

None.

### Roadmap

None.

## Discussion

### Schema

The table's name and shape are open: per-item entries keyed by tool, MCP server or app, each listing its XDG categories with a purpose and a practical meaning, such as whether the content is disposable, recoverable or the owner's knowledge. The Observatory must not infer ownership, recoverability or canonical status from directory names, XDG category, age or size, so the declaration has to state them.

### Shared namespaces

A tool can use several XDG locations, and one namespace can hold material owned by several tools. The schema needs a way to declare a shared namespace and its owners without merging them into one generic bucket.

### Disposition, 20 October 2026

Kris Brown answered HARNESS-TRIAGE on 20 October 2026 in the ways-of-working decisions log, "owner answers on the 03:08 BST send": "let's get the ball moving forwards", taken as a) with changes. Adopted into Next. The schema is still to be designed, and it blocks one Observatory phase.
