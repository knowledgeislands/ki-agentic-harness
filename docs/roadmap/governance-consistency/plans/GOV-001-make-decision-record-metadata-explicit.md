---
id: 'GOV-001'
title: Make decision-record metadata and filenames explicit
status: acceptance
roadmap: governance-consistency/make-decision-record-metadata-and-filenames-explicit
blocks: —
blocked-by: —
---

## Context

Decision Records currently use an optional bold `Date` line and allow code repositories to omit metadata entirely. Their filenames use an identifier and independently authored short slug, which can drift from the H1 readers actually see.

## Current state

The `ki-decision-records` checker already understands KB frontmatter and record prefixes, but it does not require equivalent metadata in code repositories or verify a title-derived filename. This harness has 36 records and links to them from decision indexes, references, and governance documentation.

## Steps

1. ✓ Define the universal frontmatter schema: `id`, title, date, status, human-readable `type`, stable public `type_url`, and machine `decision_type`; retain the living-record meaning of status.
2. ✓ Update the Decision Records standard, templates, exemplars, NEW guidance, checker context, and rubric so each field and exact ID-plus-title-slug filename rule is mechanically verified.
3. ✓ Rename every existing decision record to its canonical ID-plus-title-slug filename, add frontmatter, and update every inbound Markdown link and index entry.
4. ✓ Regenerate published rubric material and run focused decision-record, documentation, roadmap, and full repository verification.

## Files touched

- `skills/general-governance/ki-decision-records/`
- `docs/decisions/` and inbound Markdown links
- roadmap projections and this plan

## Verify

1. The decision-record checker passes against this repository and its focused failure tests prove missing/mismatched metadata and non-slug filenames are rejected.
2. Every decision-record link resolves after the rename.
3. `bun run test` and `bun run ki:audit` pass serially.

## Dependencies / blocks

This is a direct migration of the Decision Records standard. It deliberately does not wait for the separate first-record-adoption work, which can build on the settled schema.

## Acceptance

### Delivered

Decision Records now use one explicit metadata and filename contract across code and KB repositories.

### Summary of changes

- Added and mechanically validate `id`, `title`, `date`, `status`, `type`, `type_url`, and `decision_type` frontmatter.
- Canonicalised every record as `<ID>-<title-slug>.md`, retaining the uppercase ID and deriving only the trailing slug from the H1 title.
- Migrated all 36 existing records through intermediate filenames so case-insensitive filesystems cannot lose a case-only rename, then updated their inbound links, index, standards, templates, and generated rubrics.

### Verification

- The focused decision-record tests pass, including canonical metadata acceptance and rejection of shortened filenames, missing metadata, and legacy date lines.
- The decision-record checker reports 15 PASS, 0 FAIL, and 0 WARN against this repository.
- `bun run ki:repo-roadmap:conform`, `bun run ki:repo-roadmap:audit`, `bun run ki:authoring:conform`, `bun run ki:authoring:audit`, `bun run ki:bootstrap:audit`, `bun run test`, and `bun run ki:audit` pass serially in the current worktree.

### Outstanding concerns

None. The public specification URLs are intentionally introduced before their corresponding Website pages exist, so those pages can land without another record migration.

### Mini recap

Separating `id` and `title` makes each value directly discoverable while keeping readable filenames. The uppercase ID is an identity boundary, and only the independent title component is slugified; this avoids encoding presentation details into the identifier and makes case-safe migrations explicit.
