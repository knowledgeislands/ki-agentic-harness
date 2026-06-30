---
name: knowledgeislands-live-artifacts
description: >
  Author, audit, and manage Live Artifact pairs in a Knowledge Islands base — dynamic operational documents that reflect the current state of the island (dashboards, status boards, queues, trackers). Governs the pairing convention between a Markdown source (.md) and its rendered HTML output (.html), the Live Artifacts index in Admin/Operations/Live Artifacts/, and the sync rules between the two halves of each pair. Triggers: "add a live artifact", "audit live artifacts", "check artifact sync", "what live artifacts does this base have", "create a dashboard", "update the artifact index". For the KB zone structure use `knowledgeislands-kb`; for Markdown or TOML style use `knowledgeislands-authoring`.
argument-hint: 'audit | conform | new <name> | refresh'
---

# Knowledge Islands Live Artifacts

You are helping the user author, audit, and manage **Live Artifacts** in a Knowledge Islands base. A Live Artifact is a named, intentional operational document that reflects the current state of the island — a dashboard, status board, queue, or tracker. Unlike notes in `Pillars/`, live artifacts are **intentionally mutable**: they are updated in place as the island's state changes.

## The Live Artifact model

Each live artifact consists of a **pair**:

| File          | Role                                                                               |
| ------------- | ---------------------------------------------------------------------------------- |
| `<Name>.md`   | The Markdown source — the authoritative, human-readable version of the artifact.   |
| `<Name>.html` | The rendered HTML output — co-located with the `.md` file, same stem, same folder. |

Both halves live under `Admin/Operations/Live Artifacts/` (or a configured path) and are tracked by the same index note, `Admin/Operations/Live Artifacts/Live Artifacts.md`. The `.md` is the source of truth; the `.html` is a render of it. The pair is in sync when the `.html` is not older than the `.md` by more than the configured threshold (default: 24 hours).

### Pairing convention

- Same stem, same directory: `Status Board.md` + `Status Board.html`.
- Both files must exist for the pair to be considered complete; a lone `.md` with no `.html` is an unpublished artifact; a lone `.html` with no `.md` is an orphan.
- The `.md` carries frontmatter; the `.html` does not.

### Required frontmatter (on the .md)

| Key       | Value                                              |
| --------- | -------------------------------------------------- |
| `status`  | `active` \| `archived`                             |
| `renders` | `html` (or a comma-separated list of render types) |
| `author`  | Who owns and maintains this artifact.              |

### Live Artifacts index

`Admin/Operations/Live Artifacts/Live Artifacts.md` lists every artifact pair with its status and a one-line description. The audit checks this file exists when any artifact is found; its contents are a judgment check.

## Operating modes

### AUDIT

Run the mechanical checker (`scripts/audit-live-artifacts.ts`) against the base:

1. Find all `.md` files in the artifacts directory (excluding the index note).
2. For each `.md`: check a same-stem `.html` exists. WARN if absent (unpublished artifact).
3. For each `.html` that has no matching `.md`: WARN (orphaned render).
4. For paired artifacts: check the `.html` mtime is not older than the `.md` mtime by more than the sync threshold. WARN if stale.
5. For `.md` files with frontmatter: check `status` and `renders` are present.
6. Check the index note exists when any artifacts are found.

### CONFORM

Repair structural gaps:

1. Create the index note stub if absent.
2. For unpublished artifacts (`.md` with no `.html`): note that the HTML must be generated — this skill does not render Markdown to HTML; flag the artifact as needing a render step.
3. For orphaned renders: prompt to either create the missing `.md` or delete the stale `.html` — confirm before deleting.
4. For stale pairs: prompt the user to regenerate the HTML.

### NEW

Author a new live artifact. Prompt for:

- Name (becomes the file stem and the `# Heading` in the `.md`)
- Description (one line for the index)
- Initial status (`active`)

Write `<Name>.md` with the required frontmatter and a stub body. Note that the `.html` must be generated separately; add an entry to the index noting it is unpublished.

### REFRESH

**Refresh:** canonical · on-change

The pairing convention and required frontmatter are canonical to this skill. Run REFRESH when the artifact model changes (new render type, new required field, or the artifacts directory moves). Review the sources list and update declarations accordingly.

## Composition

- `knowledgeislands-kb` — owns the Admin/Operations/ zone and the base-level zone audit. This skill composes on it for zone checks; run `knowledgeislands-kb` AUDIT first when auditing a full base.
- `knowledgeislands-authoring` — Markdown style for the `.md` source files.

## Project bindings

Declare in the base's `.ki-config.toml` `[knowledgeislands-live-artifacts]` table:

```toml
[knowledgeislands-live-artifacts]
# Directory holding artifact pairs, relative to the base.
# Default: Admin/Operations/Live Artifacts
# artifacts_dir = "Admin/Operations/Live Artifacts"

# Maximum age difference (in hours) between .html and .md before the pair is flagged stale.
# Default: 24
# sync_threshold_hours = 24
```

## Audit rubric

See [references/audit-rubric.md](references/audit-rubric.md) for the full rubric (mechanical + judgment).
