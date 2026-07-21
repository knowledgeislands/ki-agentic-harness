# Modes AUDIT and CONFORM

_On-demand procedure for decision-records' AUDIT and CONFORM modes (CONFORM runs AUDIT first, so they share this file). The format standard, prefix table, naming convention, index rule, and placement rule live in [`SKILL.md`](../SKILL.md) and are already loaded; this file is the procedure only._

## Mode AUDIT — check DRs against the standard

1. **Run the mechanical checker**: `bun <skill>/scripts/govern.ts <dir>` where `<dir>` is the decisions directory (`docs/decisions/` for code repos; `Admin/Governance/Decisions/` for KB repos). It auto-detects KB vs code mode from `.ki-config.toml`, emits canonical JSONL by default, and exits non-zero on any FAIL. Use `--reporter=terminal` for concise human-readable output.
2. **Apply the judgment items** in [the generated rubric](rubric.md): mechanical runs count these as unevaluated rather than manufacturing findings. Read the records to assess substantive sections, value-neutral Context, active-voice Decision, focused length, and semantic prefix fit. A metadata/prefix mismatch needs a human choice; do not let CONFORM select one by overwriting the other.
3. **Report** by `DR · check · fix`, lead with FAILs.

## Mode CONFORM — bring DRs into line

1. Run **AUDIT** first.
2. **File renames** — if a filename or prefix does not match, confirm with the user before renaming (a rename changes the canonical ID).
3. **Section repairs** — add missing section stubs; leave content for the author.
4. **Index repair** — add missing entries, restore reveal-order ordering, and convert any leftover table to the ordered-list form.
5. **Present-state migration** — flag any record still carrying old-format lifecycle cruft (`**Status:**`, `**Mutability:**`, `## Changelog`, `Superseded by`/`Supersedes` lines) and rewrite it to the living-record form.
6. Re-run **AUDIT** to confirm convergence.
