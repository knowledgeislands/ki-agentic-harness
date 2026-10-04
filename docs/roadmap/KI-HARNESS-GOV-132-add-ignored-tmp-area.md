---
id: KI-HARNESS-GOV-132
area: GOV
title: Add ignored tmp area
theme: governance-consistency
horizon: triage
status: draft
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-10-04T10:18:57Z
updated_at: 2026-10-04T10:18:57Z
---

# KI-HARNESS-GOV-132: Add ignored tmp area

## Goal

Every KI repository has a third top-level working area, `tmp/`, for disposable, regenerable local output. `ki-repo` ignores it in Git by default, so nothing written there can be committed by accident or show up as untracked work.

## Context

`ki-repo` defines two working areas, `+/` for temporary inputs and `-/` for temporary outputs awaiting use or delivery. Both are tracked through their README files, because their contents are meaningful work in transit: batch records, checkpoints, trades and acquired sources. Neither suits build artefacts that are rebuilt from committed sources and never meant to travel.

The apps-observatory diagram pilot (KI-OBS-APP-034) exposed the gap. It rebuilt about 5.8 MB of interactive Archify HTML, plus receipts and browser captures, under `+/diagrams/`, and earlier Archify runs left 3.9 MB under `+/.archify/`. All of it showed as untracked, and it could have been staged by mistake. On 2026-10-04 the owner asked for `tmp` to be recognised as another working area, ignored by default.

## Boundary

The change is owned by `ki-repo`'s working-area standard, its managed ignore block, and the matching WORK checks. It does not change the direction or lifecycle of `+/` and `-/` or their specialist subareas. It does not make `tmp/` a place for anything that has to survive or be reviewed. Repositories adopt the change through `ki repo conform`.

## Discussion

### Shape to settle

- **Ignore entry:** add `tmp/` to the `ki-repo:ignore:ki-repo` managed block in `.gitignore`.
- **README:** an ignored directory cannot carry a tracked README unless it is negated in the ignore rules. Either `tmp/` has no scaffold and is documented only in the standard and the root orientation, or a `!tmp/README.md` exception keeps a one-paragraph orientation.
- **Rule of use:** anything under `tmp/` must be safe to delete at any time and rebuildable from committed sources. Anything needing review or transfer belongs in `+/` or `-/`.
- **Audit:** the WORK checks would fail when the managed ignore block lacks `tmp/`, and perhaps warn when a tracked path exists under `tmp/`.

### Open questions

- Does any repository already use `tmp/` for tracked content? A sweep is needed before conform rewrites the ignore block.
- Should Knowledge Bases under `ki-repo-kb`, with their fixed staging model, receive `tmp/` too?
- Is `tmp` the name, or `.tmp` to keep it out of directory listings and editor trees? Visible matches the owner's request and the `+` and `-` convention.

### Adopters

Once this lands, apps-observatory moves the diagram build location from `+/diagrams/` to `tmp/diagrams/` in `docs/diagrams/README.md` and in each source's `meta.output`.
