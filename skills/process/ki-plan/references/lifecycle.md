# Lifecycle procedure

_On-demand procedure for `ki-plan`'s sub-commands. The preflight, invocation, and composition-on-`ki-plans` model live in [`SKILL.md`](../SKILL.md) and are already loaded; this file is the sub-command procedure only._

Split the argument on the first space to get **sub-command** and **rest**. The lifecycle verbs are `done`, `execute`, `new`, `promote`, and `status`, in that order.

## `done <id>`

1. Locate `<NNN>-*.md`.
2. Set `status: done` (idempotent).
3. Remove its row from `README.md`; rebuild the dependency graph, dropping any edge that referenced `<id>`.
4. **Remove the matching item from `ROADMAP.md`** — ROADMAP is open-only, so a landed plan's roadmap line goes with it. Use the plan's `roadmap:` field to find it; if the match is ambiguous, ask.
5. Delete the plan file (and prune the theme folder if now empty).
6. Report: "Plan `<id>` closed."

## `execute <id>`

1. Locate `<NNN>-*.md` under any theme folder (match on the numeric prefix).
2. Read it. Set `status: in-progress`.
3. Work `## Steps` sequentially; after each completes, prefix that line with `✓` (or check its `- [x]` box). Commit progress as you go — the plan file travels with the code it describes.
4. When all steps are done, set `status: done`.

## `new <theme> <title>`

Enter the host runtime's non-writing planning/review surface if it has one; otherwise review the proposed artifact in conversation before writing. Then:

1. Read `README.md`. Next id = highest global id across all theme folders + 1, zero-padded to three digits; `001` if none.
2. `<theme>` is the first token of `rest` — a kebab-case folder matching a ROADMAP section (create `docs/plans/<theme>/` if absent). The remainder is the title; derive the `<slug>` per the format reference.
3. Confirm the **`roadmap:`** item this plan executes (which ROADMAP `Blocking` or `Next` entry), and **blocks** / **blocked-by** (ids or —). Infer from context and confirm; do not ask for a `phase` — there is none.
4. Write `docs/plans/<theme>/<NNN>-<slug>.md` using the template in `ki-plans`' [plan-format.md](../../../general-governance/ki-plans/references/plan-format.md). Fill Steps with concrete, checkable actions; fill the rest from context, marking gaps `<!-- TODO -->`.
5. Add a row to the flat index in `README.md` and rebuild the dependency graph.
6. Tell the user the plan is written; exit plan mode. Do **not** begin implementation — that is `execute`.

## `promote`

`promote` is deliberate and Claude-Code-only. It consumes the current session token already substituted into `SKILL.md` and the v1 state written by `hooks/plan-stamp.sh`; it never searches for a recent plan, trusts scratch frontmatter as provenance, or falls back to another session. Preserve the scratch plan and its state record throughout.

### 1. Authenticate the current scratch plan

1. Bind the current session id supplied by the always-loaded `SKILL.md`. Stop if its Claude Code placeholder remained unresolved or the value does not match `^[A-Za-z0-9][A-Za-z0-9_-]{0,127}$`.
2. Resolve `$HOME/.claude/plans` physically. Require it to be an existing real directory. Require its `.state` child to be an existing real, non-symlink directory whose physical parent is exactly the resolved plans root.
3. Address only `.state/<current-session-id>`. Require it to be a real, non-symlink regular file. Parse it as JSON; plaintext legacy state and malformed JSON are terminal errors for promotion.
4. Require exactly these keys and types: `version` equal to numeric `1`; string `session_id`, `plan_file`, and `cwd`; no missing or additional keys. Require `session_id` to equal the current session id and match the same allowlist.
5. Require `plan_file` to be absolute and to name an existing real, non-symlink regular file. Resolve its parent physically, require that parent to be contained by the resolved plans root, and reconstruct the physical file path from that parent plus its basename. Recheck the file immediately before reading it.
6. Require `cwd` to be absolute and to name an existing directory whose physical resolution is byte-for-byte the stored value. Resolve its git root and require that physical root to equal the physical git root found by the skill's current-repository preflight. Stop if either directory is not in a git worktree or if the roots differ.

Do not read any other state file, scan `$HOME/.claude/plans`, select by modification time, accept user-supplied paths, or use the scratch file's editable `cwd` frontmatter as evidence. On any rejection, make no repository write.

### 2. Validate the governed-plan baseline

1. Reject `repo_type = "kb"` and reject any `[plans] path` override. Promotion v1 writes only under the default physical `<git-root>/docs/plans`.
2. Require the physical git root to be a real, non-symlink directory. Walk existing `docs` and `plans` components one at a time: each must be a real directory, must not be a symlink, and must resolve inside the physical git root. Missing `docs` or `plans` is allowed but is not created yet; validate the theme component by the same rule after the user selects it.
3. Run the repository's read-only `ki:plans:audit` against the git root. Use its declared package script or vendored `ki-plans` checker; if neither is available, stop. Continue only with zero FAIL and zero WARN. Do not run CONFORM or repair unrelated plan state.
4. Parse the flat `docs/plans/README.md` index if present and every on-disk plan under a theme folder. Require all ids to match `^[0-9]{3,}$`, every filename id to equal its frontmatter id, every index link to resolve to that same plan, and the index and disk sets to agree. Stop on malformed ids, duplicate rows, duplicate files/frontmatter ids, broken links, or any index/on-disk drift.
5. Form the id union from the validated index ids and on-disk filename/frontmatter ids. The candidate id is its maximum plus one, padded to at least three digits; use `001` when both sources are empty. Do not allocate from only one source.

### 3. Confirm the promoted artifact

1. Read the authenticated scratch file without changing it. Confirm with the user a title, a kebab-case theme tied to the matching ROADMAP `Blocking` or `Next` item, the exact `roadmap:` value, and a lowercase hyphenated slug no longer than 50 characters. Verify that the exact roadmap item exists in one of those two horizons. Theme and slug must each match `^[a-z0-9]+(-[a-z0-9]+)*$` and contain no path separator.
2. Map the scratch material into the canonical Context, Current state, Steps, Files touched, Verify, and Dependencies / blocks sections. Preserve its substantive content losslessly: reorganise and clarify, but do not silently discard unmatched constraints, decisions, or checks.
3. Set `status: open`, `blocks: —`, and `blocked-by: —`. Promotion v1 creates an independent plan and does not edit another plan to add reciprocal dependencies.
4. Prepare the corresponding flat index row and rebuild the dependency graph from the validated plans plus this independent plan. Do not write yet.

### 4. Recheck and commit one no-clobber transaction

1. Immediately before writing, rerun the clean read-only plan audit; re-resolve every existing destination component; reparse the index and on-disk plans; and recompute the id union. Abort if any value differs from the validated baseline or the candidate id is no longer next.
2. Recheck the destination `<git-root>/docs/plans/<theme>/<NNN>-<slug>.md` with `lstat` semantics. It must be absent, including no regular file, symlink, or dangling symlink. Create only the previously validated missing `docs`, `plans`, and theme directories, one at a time, and validate each immediately after creation.
3. Snapshot the exact pre-transaction `README.md` bytes and whether each created directory existed. Materialise the complete plan in a temporary regular file inside the safe theme directory, then publish it with an exclusive-create operation (`O_CREAT|O_EXCL`, or an atomic same-directory hard link that fails when the destination exists). Never use an overwrite-capable move or copy for the destination.
4. Before replacing `README.md`, require it to remain byte-for-byte equal to the snapshot. Write the prepared index and graph through a same-directory temporary file and atomic replacement. Record the exact bytes or digest written by this transaction.
5. Run the read-only plan audit again. Success requires zero FAIL and zero WARN, the destination and index row to match, and the scratch/state files to remain untouched.
6. If publication, index replacement, or the post-write audit fails, roll back only transaction-owned changes: remove the new plan only after proving it is the file this transaction created; restore the prior index (or remove the transaction-created index when none existed) only if its current bytes still equal the transaction-written bytes; and prune only empty directories created by this transaction. If concurrent change prevents a safe rollback, stop and report the exact conflict instead of overwriting it.

Report the new plan path and leave implementation to `execute`.

## `status`

Print `README.md` as-is — the flat active index and the dependency graph. If it has no plan rows, report "No active plans."

## Mandate

For any multi-file or multi-step change, run `new` or deliberately `promote` before touching code. The plan file is committed to git as part of the work — a recoverable, dependency-ordered record that survives context resets. Plans exist only for ROADMAP `Blocking` or `Next` items (the near-horizon principle in `ki-plans`).
