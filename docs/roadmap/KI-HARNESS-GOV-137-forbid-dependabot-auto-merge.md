---
id: KI-HARNESS-GOV-137
area: GOV
title: Forbid Dependabot auto-merge
theme: governance-consistency
horizon: now
status: awaiting-review
blocks: []
blocked_by: []
baseline_ref: f0666f8bc52e82046cfc539e30c7dbf416c1173a
created_at: 2026-10-05T10:25:00Z
updated_at: 2026-10-05T10:42:23Z
---

# KI-HARNESS-GOV-137: Forbid Dependabot auto-merge

## Goal

Make the `ki-repo` GitHub-settings contract match the owner's Dependabot policy: Dependabot alerts and security updates are on for every repository, routine version updates come from `bun run ki:deps:update`, and no repository carries a workflow that auto-merges dependency pull requests.

## Context

Kris decided policy (b) on 2026-10-05. Auto-merging dependency pull requests is rejected as a supply-chain risk: a compromised or malicious upstream release would reach `main` without human review. Dependabot version-update configuration produced stuck pull requests (for example `jdx/mise-action` 4 to 5 in three MCP servers) that duplicated the estate's own `ki:deps:update` run. The `ki-repo` repository standard still says every repository "ships a `dependabot-auto-merge.yml`", and the exemplar table cites `mcp-gsuite` for "Dependabot auto-merge", so the estate's seven copies (apps-observatory and six `mcp-*` servers) read as conforming. No template, CONFORM step or `tools-ki` command creates either file, so removing them is safe once the standard changes.

## Boundary

In scope: the `ki-repo` standard, SKILL summary, exemplars, rubric item DEP-1 wording and its generated rubric, the DEP-1 audit evidence, a focused unit test, and one security Decision Record. Alerts and security updates remain bedrock FAIL checks, unchanged.

DEP-1 gains two tree-based checks against the audited content (local checkout or GitHub default branch): FAIL for any `.github/workflows/` file whose name identifies Dependabot auto-merge, and WARN for `.github/dependabot.yml` or `.github/dependabot.yaml`, because a configuration file may legitimately tune security updates only.

Out of scope: removing the files from the seven repositories (each receiving repository commits its own removal), closing pull requests, enabling repository settings, content inspection of arbitrarily named workflows (left to REVIEW judgment), and any change to `ki:deps:update`.

## Current state

- `skills/keystone/ki-repo/references/standards-repository.md` Layer 3 table: "Dependabot security updates | On | All repos (each ships a `dependabot-auto-merge.yml`)".
- `skills/keystone/ki-repo/references/exemplars.md`: `mcp-gsuite` row cites "Dependabot auto-merge".
- `skills/keystone/ki-repo/scripts/rubric/contexts/audit.ts`: DEP-1 checks alerts, security updates and `allow_update_branch` only; it does not inspect workflow files.
- No security Decision Record exists in `docs/decisions/`.

## Steps

- [x] Add `XDR-KI-HARNESS-001` recording the policy and index it in `docs/decisions/README.md`.
- [x] Rewrite the Layer 3 Dependabot rows in `standards-repository.md`, add a short policy paragraph, and correct the exemplar row and SKILL summary.
- [x] Add an exported pure helper `dependabotPolicyFindings(tree)` in `audit.ts`, call it from DEP-1, and update DEP-1 wording in `items/dependencies.ts`; regenerate `references/rubric.md`.
- [x] Add `dependabot-policy.test.ts` covering FAIL, WARN, and clean trees.
- [x] Run the verification below.

## Files touched

- `docs/decisions/XDR-KI-HARNESS-001-dependabot-security-updates-without-auto-merge.md`
- `docs/decisions/README.md`
- `skills/keystone/ki-repo/SKILL.md`
- `skills/keystone/ki-repo/references/standards-repository.md`
- `skills/keystone/ki-repo/references/exemplars.md`
- `skills/keystone/ki-repo/references/rubric.md`
- `skills/keystone/ki-repo/scripts/rubric/items/dependencies.ts`
- `skills/keystone/ki-repo/scripts/rubric/contexts/audit.ts`
- `skills/keystone/ki-repo/scripts/rubric/contexts/dependabot-policy.test.ts`

## Verify

1. A tree containing `.github/workflows/dependabot-auto-merge.yml` yields a DEP-1 FAIL; a tree containing only `.github/dependabot.yml` yields a DEP-1 WARN; a clean tree yields none.
2. The standard no longer requires or cites an auto-merge workflow, and states that alerts and security updates are required everywhere.
3. `bun run test`, `bunx tsc --noEmit`, and `ki repo audit --progress never` pass.

```bash
bun run test
bunx tsc --noEmit
ki repo audit --progress never
```

## Dependencies / blocks

None. The seven receiving repositories remove their files independently after this lands.

## Documentation impact

### Decision Records

`XDR-KI-HARNESS-001` records the policy.

### Specifications

None.

### Guides

None.

### Roadmap

None.

## Discussion

### Decision

Owner decision (b), 2026-10-05: Dependabot alerts and security updates on for every repository; Dependabot version-update configuration and every auto-merge workflow removed; routine updates through `bun run ki:deps:update`.

## Review

### Delivered

The `ki-repo` contract now treats Dependabot as a security signal only: alerts and security updates stay bedrock FAIL checks, DEP-1 fails any `.github/workflows/` file named for Dependabot auto-merge and warns on `.github/dependabot.yml` or `.yaml`, and the standard, SKILL summary and exemplars no longer require or cite an auto-merge workflow. `XDR-KI-HARNESS-001` records the owner's policy (b).

### Change Summary

- `docs/decisions/XDR-KI-HARNESS-001-dependabot-security-updates-without-auto-merge.md` and its index entry in `docs/decisions/README.md`.
- `skills/keystone/ki-repo/references/standards-repository.md`: Layer 3 row corrected and a policy paragraph added.
- `skills/keystone/ki-repo/SKILL.md` and `references/exemplars.md`: summary and exemplar wording.
- `skills/keystone/ki-repo/scripts/rubric/contexts/audit.ts`: exported pure `dependabotPolicyFindings(tree)`, called from DEP-1 against the audited tree (local checkout or GitHub default branch).
- `skills/keystone/ki-repo/scripts/rubric/items/dependencies.ts` and generated `references/rubric.md`: DEP-1 wording and remediation.
- `skills/keystone/ki-repo/scripts/rubric/contexts/dependabot-policy.test.ts`: four cases.

No deviation from the plan.

### Verification

- Focused test `dependabot-policy.test.ts`: 4 pass.
- `bunx tsc --noEmit`: clean. `bunx biome check skills/keystone/ki-repo/scripts`: clean (infos only).
- `ki repo audit --progress never`: PASS, 32 skills.
- `bun run test`: 858 pass, 5 fail - all five are 5 s or 10 s timeouts in `repository.test.ts` and session tests. The same file at baseline `c19e358d` in a clean worktree failed six timeouts under the same machine load, so they are pre-existing load-sensitive timeouts, not regressions.
- Estate effect: the seven receiving repositories removed both files and each passes `ki repo audit`.

### Outstanding concerns

- Load-sensitive test timeouts in `repository.test.ts` predate this item and are not addressed here.
- A renamed auto-merge workflow escapes the file-name check; left to REVIEW judgment as planned.

### Post-change review

Goal met within the stated boundary; alerts and security-update checks are unchanged, and the new checks are additive and file-name based, so regression risk is limited to repositories that still carry the files, which the estate no longer does. Ready for acceptance.

### Mini recap

Delivered the standard change, check, test and security DR. Learning route: consider a REVIEW prompt for workflows that call `gh pr merge --auto` under another name; no automatic promotion.
