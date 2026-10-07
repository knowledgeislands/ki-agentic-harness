---
name: ki-repo-kb-streams
ki-kind: governance
ki-applicability: detected
ki-shared-dependencies: [ki-skills:rubric, ki-work-roadmap:work-identifiers]
ki-depends-on: []
description: >
  Govern the KI knowledge-base Streams container and flat Roadmap records. Use for KB
  forward-work structure or migration; lifecycle actions belong to `ki-next`, `ki-plan`, `ki-implement`, and
  `ki-accept`, while `ki-repo-kb` owns zones.
argument-hint: 'audit | conform | help | educate | iterate | propose | ready | refresh | rollout'
---

# Knowledge Islands Streams

You are operating the **`Streams` zone** of a Knowledge Islands base. `Streams/` contains finite change-management work, not a second hierarchy of attention or lifecycle folders. `Streams/Roadmap/` holds flat forward-work records. Recurring obligations are Activity notes under the collection configured by `ki-repo-kb-activities`, not a separate Streams area. A future `Streams/Trades/` area may be added when the trade model needs KB-specific placement.

The governing change-management skills own the records and lifecycle inside those areas: `ki-work-roadmap` owns roadmap work and `ki-trades` owns trade records. `ki-repo-kb-activities` owns recurring Activity notes; `ki-work-housekeeping` supplies their opted-in recurring-work lifecycle. This skill owns the KB container and its routing only. **Nothing reaches a canonical zone (`Admin/` — the base's own operating model — `Pillars/`, or `Resources/`) except through approved forward work** under the applicable adapter.

The companion `ki-repo-kb` skill owns the five-zone model and note CRUD / routing, and **delegates the inside of `Streams/` here**; load it for anything outside this zone. This skill carries the structure and process as fixed knowledge; only a couple of store-level **bindings** come from the host base.

The full detail lives in the references (progressive disclosure): the structure in [the Streams structure standard](references/standards-streams-structure.md), the shared lifecycle boundary in [the Enactment Process standard](references/standards-enactment-process.md), and worked shapes in [the exemplars](references/exemplars.md). The line-by-line checkable items live in [the rubric](references/rubric.md); `ki repo audit --skill ki-repo-kb-streams` runs their mechanical evidence and `ki repo conform --skill ki-repo-kb-streams` applies its safe declared repairs.

## The Streams zone at a glance

```text
Streams/
  Roadmap/       # flat roadmap work records, its _ISSUES.md ledger, and optional _IDEAS.md
  Projects/      # the territory Project registry, in a Capital only
  Initiatives/   # the territory Initiative registry, in a Capital only
  Trades/        # reserved for a future KB trade placement, if adopted
```

`Roadmap/` is an operational area, not a horizon. Roadmap work keeps its horizon and lifecycle in frontmatter, exactly as project roadmap does; it is not moved between `Triage`, `Now`, `Next`, `Soon`, or other folders. `status: triage` is metadata on a flat `Streams/Roadmap/` record and never a `Streams/Triage/` directory. `Projects/` and `Initiatives/` hold the territory's [Project registry](../../change-management/ki-work/references/standards-project-registry.md) notes, one per Project and one per Initiative; neither is a work queue. A base may add topical metadata to a record when its owning adapter supports it, but the shared Streams container does not prescribe topical folders or group vocabulary.

Legacy `Active`, `Background`, `Dormant`, and Focus-style folders are migration inputs, not parts of the target structure. The receiving Knowledge Base chooses how to reconcile each retained record into the appropriate operational area and its owning adapter's format.

## Status lifecycle

A roadmap item's `status` is its position in the shared delivery lifecycle:

| Status            | Meaning                                                                 |
| ----------------- | ----------------------------------------------------------------------- |
| `triage`          | Captured intake, not yet adopted                                        |
| `draft`           | Work is being shaped in its roadmap record                              |
| `ready`           | Stable; no open questions; prerequisites satisfied; approved to deliver |
| `in-progress`     | Approved rollout underway                                               |
| `awaiting-review` | Checklist executed; required review packet awaits human closure         |
| `done`            | Review accepted; retain the completed record until explicit pruning     |
| `cancelled`       | Closed with a resolution; retain the record until explicit pruning      |

Order: `draft` → `ready` → `in-progress` → `awaiting-review` → `done`.

## Record ownership

Each adapter owns its record shape. A roadmap item is a flat working record in `Streams/Roadmap/`; its ID, lifecycle, horizon, dependencies, and durable `_ISSUES.md` allocation ledger follow the roadmap standard. Its durable outputs belong in a canonical zone. A recurring Activity is the canonical definition of an adopted obligation; its due runs become separate linked roadmap records through `ki-work-housekeeping`. Never create a second definition in `Streams/Housekeeping/`.

Use the owning adapter's standard rather than retaining a generic Streams record shape.

## Project bindings

Almost everything is fixed above. Only these come from the host base — take declarative overrides from the base's `.ki.toml` `[skills.ki-repo-kb-streams]` table (the shared-file contract is owned by `ki-repo`; validate your own table, warn on an unrecognised key, never read another skill's), otherwise from the auto-loaded `CLAUDE.md`.

- **Process note** — the base's local change-process note: a thin pointer to the shared change-management skills plus base-specific authority and routing. _Default:_ `Enactment Process`. A base may host it under a non-default name or location (e.g. `kit-legal` keeps it under `Admin/Operations/Processes/`); declare it as `process_note = "Admin/Operations/Processes/Enactment Process"` where needed.
- **Area bindings** — `Roadmap/` is the fixed operational area. A future `Trades/` area is explicit work, not an implicit folder a base creates ad hoc. An existing `Streams/Housekeeping/` directory requires owner-approved reconciliation into the configured Activity collection; AUDIT reports it and CONFORM never moves or deletes it automatically.
- **Canonical zones** — the zones the gate protects, where a record's durable output lands. The knowledge **stores** a settled stream migrates into are `Pillars/` (internal; a base that holds it under a legacy folder name resolves it via the `ki-repo-kb` zone alias) and `Resources/` (external knowledge). `Admin/` — the base's operating model (its processes, conventions, configuration) — is equally canonical and equally gated, but receives operating-model changes rather than migrated subject-knowledge.

## Step 1 — Load context

1. Resolve the bindings: read the base's `.ki.toml` `[skills.ki-repo-kb-streams]` table and `CLAUDE.md`. Load the base's bound **process note** if it has one, for local authority and routing.
2. For roadmap work, load the relevant flat work item and `Streams/Roadmap/_ISSUES.md` **fresh**; for recurring obligations, hand off to `ki-repo-kb-activities` and `ki-work-housekeeping`, loading the configured Activity note. Never act on a cached record.

## Operating modes

Invoked as `help` / `-h` / `?`, it explains itself and stops — the generated HELP block (name, purpose, invocation, modes, off-ramps), taking no action. With no mode it does the same, then, in an interactive session only, offers the mode choice via `AskUserQuestion`, prompting for any `argument-hint` target the chosen mode shows. The shared model above — the operational areas, lifecycle, bindings, Step 1, and Working rules — is what every mode needs and stays loaded; each mode's _procedure_ lives in its own on-demand file, so read only the one the request selects. This carries the universal **AUDIT · CONFORM · EDUCATE · REFRESH**. EDUCATE explains the canonical Streams model and routes creation of the parent zone to `ki-repo-kb`; it ships no standalone scaffold or runner. Its adapter modes are **ITERATE · PROPOSE · READY · ROLLOUT**. Common review and closure belong to `ki-accept`. Modes are named and alphabetical.

| Mode | Fires on | Read before acting |
| --- | --- | --- |
| AUDIT | "audit my streams" | [mode-audit.md](references/mode-audit.md) |
| CONFORM | "conform my streams / bring them into line" | [mode-conform.md](references/mode-conform.md) |
| EDUCATE | "bootstrap streams governance" (via the `ki-bootstrap` chain) | the EDUCATE sentence above — no procedure file |
| ITERATE | "plan this roadmap record" | [mode-iterate.md](references/mode-iterate.md) |
| PROPOSE | "capture KB work" | [mode-propose.md](references/mode-propose.md) |
| READY | "mark this ready" | [mode-ready.md](references/mode-ready.md) |
| REFRESH | "is the Streams model still current" (on its declared cadence) | [mode-refresh.md](references/mode-refresh.md) |
| ROLLOUT | "implement this roadmap record" (needs explicit authorisation) | [mode-rollout.md](references/mode-rollout.md) |

The Working rules apply on every fire, before any mode procedure loads — ROLLOUT in particular must not begin without explicit user authorisation.

## Working rules

These apply to every change (the discipline that keeps the workspace trustworthy):

- **Capture before adoption.** Deduplicate substantive prospective work, then capture it automatically as a flat `status: triage` roadmap record with no horizon, using the canonical issue ledger, once it passes the roadmap graduation test. Report the new title, path, and ID; creation does not adopt or prioritise the work.
- **Approval at disposition.** Require explicit human approval before a record leaves triage or is renamed, rejected, or merged. Apply adoption through `ki-next`; route a cancellation with its resolution to `ki-accept` for retained `cancelled` closure before any later prune. Never infer adoption or disposal from silence or surrounding discussion, and never delete open intake directly.
- **Keep the owned record current.** Update immediately on a decision or status change; the canonical state must never lag.
- **Load before editing.** Reload the work item or template and its ledger before resuming work.
- **No `ready` while a prerequisite is below `done`.** No rollout without explicit authorisation.
- **Re-verify each rollout item against the live file** before making the edit.
- **Retain done work records** until an explicit prune selection removes their reviewed evidence.
- **Out of scope** (no forward-work record needed): trivial typo / formatting fixes, time-bound `Calendar/` entries, person-file auto-appends, inbound `+/` triage — though when in doubt, prefer a lightweight record: the cost is low, while an unauthorised change to canonical content is high.

## Change-management gate

The rule that substantive canonical changes use approved forward work must be anchored in the base's always-loaded `CLAUDE.md` / `AGENTS.md`. The directive routes roadmap work through `Streams/Roadmap/` and the relevant shared change-management skill; this container skill does not invent a second work lifecycle.

## Notes

- This skill governs the **inside of the `Streams/` zone**. For the five-zone model, routing into the zones, note CRUD, and session digests, use the `ki-repo-kb` skill — it knows `Streams` is a zone and delegates its internals here.
- When a material decision in a roadmap record warrants a durable, standalone Decision Record rather than an inline note, author it with the `ki-decision-records` skill and reference it from the record.
- If a base does not follow this structure, or a binding cannot be resolved and no default fits, ask rather than guess.
