# Plan

`ki-work plan` is a subcommand of the Work guild's lead. It was the `ki-plan` process skill until the guild folded it into `ki-work` (PROCESS-SUBCOMMANDS), and keeps that skill's procedure and boundaries.

Shapes one or more selected Now or Next drafts through Ready.

The class-level standard—horizons, identity, and file shape—is owned by `ki-work-roadmap`; read [the lifecycle procedure](standards-plan-lifecycle.md) for the complete operation.

## What this subcommand does

`ki-work plan` resolves the selected record through the repository adapter and enriches it in place. `ki-work next` captures unadopted triage records and separately adopts or promotes them; this subcommand accepts only selected Now or Next drafts and never creates a duplicate plan record.

For the selected `roadmap` adapter it adds the work-item execution sections; for selected `kb-streams` it applies the same record model inside the Streams container. Readiness is explicit and all-or-nothing: validate every named record before publishing any `ready` transition. Commit the resulting state with its coherent planning unit; the transition does not require a standalone commit, and an item may first land as `ready` when capture, shaping, and approval occur together. GitHub Issues and Linear selections stop without writes until their remote process execution exists.

## Responsibility boundary

```text
ki-work next
  selection and horizon placement
    └─> ki-work plan
          create, shape, and mark Ready
            └─> ki-work implement
                  Ready → In progress → Awaiting review
                    └─> ki-work accept
                          Awaiting review → Done and explicit prune selection
```

`ki-work plan` does not implement work, assemble a review packet, close delivery, mark an item Done, or prune retained records.

Those responsibilities belong to the other subcommands; `ki-work plan` carries no compatibility verbs or fallback path for them.

## Planning is repo-first

In a KI code repository the canonical record is `docs/roadmap/<REPO>-<NNN>-<slug>.md`, or `docs/roadmap/<REPO>-<AREA>-<NNN>-<slug>.md` where the repository declares fixed issuing areas, authored through this subcommand—not a runtime-native Plan Mode scratch file.

`ki-work-roadmap` owns the stable `<REPO>` code and any fixed `<AREA>` namespace in `.ki.toml`; grouping lives in the classification fields `kind`, `purpose`, `project`, `initiative`, and `component`.

A native scratch file is only a draft.

Where one exists, prefer to leave it a pointer to the governed item rather than duplicate content.

When referring to a specific work item in prose, link its canonical document using the host’s Markdown-link convention; use a bare identifier only in structured fields or lifecycle commands.

## Invocation

`help` / `-h` / `?` explains this subcommand and stops, taking no action. `plan <work>...` resolves one or more explicit selected records; with no target, identify that `ki-work next` must first adopt and select a Now or Next draft and stop.

## Preflight

1. Run `git rev-parse --show-toplevel` and physically resolve the result.
2. Run `ki repo audit --skill ki-work --repo <git-root>` and stop on any failure. Read the selected adapter literal and require its matching declared owner table; the base audit remains the semantic selector authority.
3. `roadmap` uses `ki-work-roadmap` and `docs/roadmap/`; `kb-streams` uses `ki-repo-kb-streams` and `Streams/Roadmap/`. Run the selected local adapter audit and stop on any failure or warning. `github-issues` and `linear` stop without reads or writes because remote process execution is not implemented.
4. Resolve each record only inside the selected canonical root; never follow a symlink outside the physical git root, infer an alternate tree, or use repository shape as an adapter fallback.

## Notes

- This subcommand has no capture, status, import, or runtime scratch-plan verb. `ki-work next` owns queue changes and capture; an adapter may preserve a native scratch record only as a pointer to its governed record.
