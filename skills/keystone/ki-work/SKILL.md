---
name: ki-work
ki-kind: governance
ki-applicability: declaration-only
ki-guild: keystone
ki-leads: work
ki-depends-on: []
ki-optional-depends-on: [ki-authoring, ki-decision-records, ki-delegation]
ki-shared-dependencies: [ki-skills:rubric, ki-work-roadmap:work-identifiers]
contributes: ['.ki.toml']
description: >
  Lead the Work guild: choose, plan, deliver, accept and recap work. Use `next` to capture prospective work or decide
  what comes next, `plan` to make selected work Ready, `implement` to deliver one Ready record to review, `accept`
  to close, cancel or prune records with human approval, `recap` for a live-session recap or handoff, and `design`
  to shape a new Project or model before any record exists; audit or choose a repository's forward-work adapter:
  local roadmap, KB Streams, GitHub Issues or Linear.
argument-hint: 'accept <work> | accept prune <record-or-glob>... | audit <repo> | conform <repo> | design start <subject> | design resume <id> | educate <repo> | help | implement <work> | next [--review] | next defer <item> <horizon> | plan <work>... | recap [--runtime <runtime>] [--transcript <session-file>] | refresh'
---

# Work

This skill leads the Work guild: how work is chosen, planned, done, accepted and coordinated. It carries the work lifecycle as six subcommands, each loaded from its own reference only when called, and it selects one configured source of forward work; it never becomes a third tracker. The selected adapter owns record storage, identity allocation, and its local structural rules. The subcommands use the adapter to locate a record, assess readiness, record delivery or review evidence, and apply an explicitly authorised close or prune selection.

Read [the change-management adapter standard](references/standards-change-management-adapters.md) before selecting an adapter or changing shared lifecycle behaviour. Read [the generated rubric](references/rubric.md) for its checkable contract, [the migration file](references/standards-change-management-adapters-migration.md) for the steps of the batch retirement still to land outside the harness, and [the sources](references/sources.md) when refreshing it.

## The lifecycle

```text
recap (optional current-session context)
  └─> next (capture, adoption, selection, promotion and deferral)
        ├─> accept (human-approved cancellation with resolution)
        └─> plan (shape each selected record through Ready)
              └─> implement (one Ready record through Awaiting review)
                    └─> accept (Awaiting review through Done, and explicit pruning)
design (shape a new Project or model before any record exists; its rollout goes to next)
```

Two boundaries the separate skills kept are rules of their subcommands: **`implement` never accepts its own work**, and stops at Awaiting review; **`accept` needs the owner's approval**, which a clean gate, a commit, a recap or silence never supplies, and only an approval quoted from the owner or a recorded window grant naming closure gives. `ki bootstrap` activates this skill as a core user skill, so the subcommands work in any repository; they are not separate `.ki.toml` governance roots.

## The guild

Its other members, each with when to use it:

- **`ki-work-roadmap`** to audit or shape flat local work records in `docs/roadmap/`, the default adapter; **`ki-work-github-issues`** and **`ki-work-linear`** when a repository selects a remote tracker.
- **`ki-work-recurring`** for recurring work: templates, cadence and due runs.
- **`ki-work-package`** to create, resume, audit or tidy a work package in the Cairn store.
- **`ki-coordination`** while coordinating opened work, and for how every session replies.
- **`ki-meeting`** to call, hold or close a meeting at one node of the work tree.
- **`ki-trades`** to design or audit trades between repositories, and **`ki-trade`** for one side of one trade.

## Shared model

`[skills.ki-work]` declares exactly one adapter and the matching adapter table is declared beside it. `roadmap` is the default for an ordinary Project repository; `kb-streams` is the default for a Knowledge Base; `github-issues` and `linear` are explicit alternatives. Resolution has no fallback: an absent, unknown, undeclared, or inapplicable declaration stops the process rather than guessing from a directory. This skill owns the abstract lifecycle and classification terms, while the owning adapter retains concrete status mapping, record storage, identity, and structural rules. The [Project registry standard](references/standards-project-registry.md) owns the portable shape of territory Projects and themes.

The selected adapter also controls the GitHub Issues feature through `ki-repo`: it stays disabled, with no `package.json` `bugs` field, unless the root `[skills.ki-work-github-issues]` table is declared.

## Operating modes

Carries the universal **AUDIT · CONFORM · EDUCATE · REFRESH** modes and the six work subcommands, **ACCEPT · DESIGN · IMPLEMENT · NEXT · PLAN · RECAP**. Invoked as `help` / `-h` / `?`, it emits generated HELP and stops. With no recognised mode, it emits the same HELP and, only in an interactive session, offers the mode choice and prompts for the target shown in `argument-hint`. A subcommand invoked with `help` explains itself from its reference and stops.

### Mode ACCEPT

`accept <work>` closes one reviewed record as done, or cancels an open record with an approved resolution; `accept prune <record-or-glob>...` deletes explicitly selected terminal records. Read [the accept reference](references/mode-accept.md) and follow it. It needs the owner's approval for every closure and cancellation, and never chooses work, starts implementation or reconstructs missing verification.

### Mode AUDIT

Run `ki repo audit --skill ki-work --repo <repo>`. It verifies that the local table selects one supported, declared, applicable adapter mapping. Then run the resolved adapter's own audit; this selector neither interprets nor repairs adapter-specific configuration, and resolution alone is not an adapter audit.

### Mode CONFORM

Run `ki repo conform --skill ki-work --repo <repo> --dry-run`. It makes no adapter selection, creates no tracker record, and changes no work record. It never infers an adapter from repository shape; set the declaration deliberately, then audit the selected adapter.

### Mode DESIGN

`design start <subject>` or `design resume <id>` runs the design loop: a brief, independent reviews, one merged report, the owner's decisions and a piloted rollout, committed in the work folder's `design/`. Read [the design reference](references/mode-design.md) and follow it; it starts each artefact from the templates in `assets/design/`. It writes no work record and never chooses for the owner.

### Mode EDUCATE

Run `ki repo educate --skill ki-work --repo <repo>` to render the adapter contract. Choose the Project or KB default only after confirming its primary structure; choose GitHub Issues or Linear only after confirming remote authority and the owning adapter configuration.

### Mode IMPLEMENT

`implement <work>` delivers one approved Ready record from an immutable baseline through verification to Awaiting review. Read [the implement reference](references/mode-implement.md) and follow it. It never selects, replans, accepts its own work, prunes, pushes, releases or expands its authority.

### Mode NEXT

`next [--review]` captures substantive prospective work as unadopted triage records, or selects, adopts, promotes, defers, holds or releases work in the shared queue; `next defer <item> <horizon>` proposes one exact deferral. Read [the next reference](references/mode-next.md) and follow it. Adoption and every queue change other than bounded triage capture need the owner's confirmation.

### Mode PLAN

`plan <work>...` shapes selected Now or Next drafts in place until they are Ready. Read [the plan reference](references/mode-plan.md) and follow it. It never captures, selects, implements, closes or prunes work.

### Mode RECAP

`recap` recaps the live session: what changed, the decisions, the files touched, the work still open and the learning worth keeping, closing with an Actions checklist. Read [the recap reference](references/mode-recap.md) and follow it; [`scripts/recap-grounding.ts`](scripts/recap-grounding.ts) grounds it in current Git state. It routes future-work selection to `next` rather than acting on it.

### Mode REFRESH

**Precondition:** REFRESH writes only this canonical skill under `ki-agent-backpack`. Invoked from an installed copy, stop and redirect to the Harness.

On the cadence in [the sources](references/sources.md), compare supported adapters and the subcommands' use of them with [the adapter standard](references/standards-change-management-adapters.md), and re-check the runtime documentation the recap subcommand relies on. Add a new adapter only with an explicit mapping of its stable reference, lifecycle states, authority boundary, and close/prune semantics; record the normative change in the commit.
