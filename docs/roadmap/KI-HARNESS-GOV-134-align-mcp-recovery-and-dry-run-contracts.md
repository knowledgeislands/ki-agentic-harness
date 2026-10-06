---
id: KI-HARNESS-GOV-134
area: GOV
title: Align MCP safety contracts
theme: governance-consistency
horizon: now
status: ready
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-10-04T10:57:53Z
updated_at: 2026-10-06T01:26:00Z
---

# KI-HARNESS-GOV-134: Align MCP safety contracts

## Goal

Make the MCP standard's authentication recovery and dry-run guidance consistent with access gating and complete-operation preview safety, so receiver fixes can be judged against one truthful contract.

## Context

The [MCP server standard](../../skills/repo-structure/ki-repo-mcp/references/standards-mcp-servers.md) correctly hides write-annotated, token-persisting authentication tools at the default read tier, but its recovery guidance in two places unconditionally recommends `*_auth_start`. Fixture-only registration in GSuite and M365 confirmed that the 401 hint names a tool unavailable at that tier. Their receiver-owned records were `MCP-GSUITE-FND-007` and `MCP-M365-FND-006`, both since delivered, accepted and pruned (cited in Dependencies / blocks); their implementations and annotations remain local decisions.

The same standard's dry-run rule does not state clearly that accepting a preview flag on an optional CLI requires the complete operation, including preparatory mutations, to be side-effect-free. Notion Mirror's `roots publish --dry-run` accepts the flag but could still reach mutating branches (`MCP-NOTION-TOOL-009`). Git Audit's commit preview staged into the real index (`MCP-GIT-TOOL-006`). Both receivers have since fixed, accepted and pruned their records. These are receiver-owned defects, not reasons to weaken the standard's access gate or move domain logic into the Harness.

The existing tool catalogue and guide rubrics already own registered-surface accuracy and usable procedures. Current README tool-name sets match the reviewed registrations; GSuite's access-tier prose is a receiver-specific drift. Catalogue generation is an implementation option, not a house requirement. Superseded-repository routing is likewise governed by existing roadmap and trade authority rules.

## Boundary

In scope: both authentication hint passages in the MCP server standard (section 6 item 11 and section 14 item 6), rewritten so the recovery path named in a 401 is reachable at the caller's configured access tier; section 6 item 7, stating that a supported dry run covers the complete operation, preparatory and final effects alike, on tools and optional CLI flags; the `TOOL-1` judgment prompt and source references; the regenerated rubric and the access-gate line in `mode-audit.md`; one focused catalogue test.

Out of scope: a new skill; a mandated generated tool catalogue; any receiver implementation (GSuite, M365, Notion Mirror, Git Audit); Git's hook or concurrency policy; treating a source scan as proof of runtime availability. Authentication that persists tokens keeps its write classification. The shared-code symlink-ancestor defect was `KI-HARNESS-GOV-133`, since accepted and pruned (commits `ac4e7c33` and `0b7bbcc4`), and does not interact with this clarification.

## Current state

- `standards-mcp-servers.md` section 6 item 11 ends "401s hint at the `*_auth_start` remedy"; section 14 item 6 repeats "A 401 hints at the `*_auth_start` remedy without echoing the token". Both are unconditional, while section 4 registers a write-annotated tool only at `write` or above.
- Section 6 item 7 requires destructive or non-idempotent tools to expose `dry_run` defaulting to `true` and to "approximate otherwise", with no statement about preparatory effects or unsupported combinations.
- `TOOL-1` in `scripts/rubric/items/tools.ts` cites only sections 3 and 13. Its judgment prompt asks reviewers to confirm "dry-run defaults" and "applicable OAuth security requirements" without citing sections 6 or 14, so the generated rubric links a reviewer to neither rule.
- `references/mode-audit.md` line 13 checks only that destructive tools default `dry_run: true`.

## Steps

- [ ] Rewrite section 6 item 11's 401 clause: a 401 names a recovery path the caller can reach at its configured access level. Where `*_auth_start` is registered at that level, name it; otherwise name the out-of-band remedy the repository ships (its `mcp-<name>-auth` bin or equivalent CLI) and the `MCP_<APP>_ACCESS_LEVEL` change that would expose the tool. A hint must never name a tool that is not registered.
- [ ] Replace section 14 item 6's duplicate clause with a cross-reference to section 6 item 11, keeping its own token-redaction requirement, so the rule has one normative home.
- [ ] Extend section 6 item 7: a dry run, whether a tool's `dry_run` argument or an optional CLI's `--dry-run` flag, covers the complete operation; preparatory steps (staging into an index, temporary or cache writes, lock or token acquisition, remote calls with effects) are side-effect-free as well as the final mutation. A flag combination that cannot be previewed without effects is rejected before any effect. Replace "approximate otherwise" with that rule.
- [ ] In `TOOL-1`, add `standards-mcp-servers.md#6-security-invariants` and `standards-mcp-servers.md#14-oauth-security-auth-server-repos` to `sources`, and change the judgment prompt so it asks reviewers to confirm that dry runs are side-effect-free across the complete operation and that 401 recovery hints name a path reachable at the configured access tier.
- [ ] Add a test to `scripts/rubric/contexts/mcp.test.ts` asserting that `TOOL-1` cites both new anchors and that its prompt names complete-operation dry runs and tier-reachable recovery.
- [ ] Update the access-gate line in `references/mode-audit.md` to include complete-operation dry runs and tier-reachable 401 hints.
- [ ] Regenerate `references/rubric.md` with `ki dev skill rubric ki-repo-mcp`.

## Files touched

- `skills/repo-structure/ki-repo-mcp/references/standards-mcp-servers.md`
- `skills/repo-structure/ki-repo-mcp/scripts/rubric/items/tools.ts`
- `skills/repo-structure/ki-repo-mcp/scripts/rubric/contexts/mcp.test.ts`
- `skills/repo-structure/ki-repo-mcp/references/mode-audit.md`
- `skills/repo-structure/ki-repo-mcp/references/rubric.md` (generated)

## Verify

1. `grep -n 'auth_start' skills/repo-structure/ki-repo-mcp/references/standards-mcp-servers.md` shows no unconditional 401 remedy; the only normative 401 clause makes the named path conditional on the configured access level, and section 14 item 6 cross-refers to it.
2. Section 6 item 7 states that a dry run covers preparatory and final effects, applies to optional CLI `--dry-run` flags, and rejects an unpreviewable combination before any effect; "approximate otherwise" is gone.
3. Section 4's write classification of token-persisting authentication is unchanged (`git diff` shows no edit to section 4).
4. The generated `references/rubric.md` entry for `TOOL-1` cites sections 3, 6, 13 and 14, and its prompt names both new checks.
5. The new `mcp.test.ts` case fails before the `tools.ts` change and passes after it.
6. No receiver repository is modified.

```bash
bun run test
bunx tsc --noEmit
ki dev skill rubric ki-repo-mcp
ki repo audit --skill ki-repo-mcp --progress never
ki repo audit --skill ki-skills --progress never
ki repo audit --skill ki-authoring --progress never
```

## Dependencies / blocks

None. The four receiver records are no longer live; each was delivered, accepted and pruned in its own repository on 2026-10-04, so they are cited by repository and revision as historical evidence only:

- `mcp-gsuite` `MCP-GSUITE-FND-007`: fixed in `0df38ad`, accepted in `5b092fc`, pruned in `8d660a9`.
- `mcp-m365` `MCP-M365-FND-006`: fixed in `becddd7`, accepted in `a163f7a`, pruned in `15a34c3`.
- `mcp-ki-kb-notion-mirror` `MCP-NOTION-TOOL-009`: fixed in `9d46a5b`, accepted in `129c900`, pruned in `eb00d23`.
- `mcp-git-audit` `MCP-GIT-TOOL-006`: fixed in `3972535`, accepted in `d07917a`, pruned in `d86f744`.

None of them blocked or was blocked by this record, and this record remains valid: the standard's guidance is still unclarified. No trade is needed; the clarified standard reaches every MCP repository through ordinary skill refresh.

## Documentation impact

### Decision Records

None. The change makes two existing rules say what the access gate and the dry-run default already imply; it adopts no new architecture or policy.

### Specifications

`standards-mcp-servers.md` is the behaviour contract and changes as described in Steps. No other specification cites the affected clauses.

### Guides

None. No guide in this repository restates the 401 hint or the dry-run rule.

### Roadmap

None beyond this record.

## Discussion

This item records the narrow cross-repository standard refinement identified by the full rubric comparison on 2026-10-04. Receiver records retain selection, delivery and acceptance authority; this item grants none of those transitions.

### Decision

Fix both auth-hint passages with tier-aware recovery; the dry-run rule states complete-operation side-effect freedom; align `TOOL-1`. Decided by the Fable reviewer under delegated autonomy, reversible.
