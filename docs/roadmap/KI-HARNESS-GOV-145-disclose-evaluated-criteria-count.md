---
id: KI-HARNESS-GOV-145
area: GOV
title: Disclose evaluated criteria count
kind: deliver
purpose: upkeep
initiative: platform-foundations
component: keystone
horizon: now
status: in-progress
blocks: []
blocked_by: []
baseline_ref: 68da7df79364efae9b0baa03df2b89ae2c3bdbba
created_at: 2026-10-06T23:01:19Z
updated_at: 2026-10-08T08:58:36Z
---

# KI-HARNESS-GOV-145: Disclose evaluated criteria count

## Goal

A reader of an audit summary can tell how many criteria the run actually evaluated, so that a pass with every criterion checked does not look the same as a pass with nothing to check.

## Context

`ki repo audit` reports findings and a per-skill verdict. It does not report how many criteria it evaluated. On 2026-10-07 the summary of `ki repo audit --skill ki-work-roadmap --repo .` on this repository still reads only `PASS · 1 skill`. A judgment-only capability, or a declaration that selects no mechanical criterion, therefore passes with a summary identical to a fully checked pass.

`KI-HARNESS-GOV-107`, already depends on this signal: the current-base assertion it absorbed expects the count of evaluated criteria reported by `--reporter-levels all` to rise above zero. The `apps-observatory` surface also consumes audit summaries, so the disclosure has a reader beyond the command line.

Origin: first raised as branch-local `KI-HARNESS-GOV-107` on the abandoned Paperclip branch `paperclip/KNO-3-record-the-ki-paperclip-boundary-as-a-decision-record-and-activate-it`, commit `49adfa64` (`docs(roadmap): capture the audit disclosure and acceptance gate findings`). The branch serial collides with a different record on `main`, so the finding is captured again here. A patch copy is kept at `~/.local/state/ki/state-of-play/salvage/KNO-3/`. The cleanup that retired the branch is tracked in the `ki-arcadia-principal` checkpoint `+/_CHECKPOINTS/state-of-play.md`.

## Boundary

In scope: what an audit summary discloses about its own coverage - the number of criteria evaluated, and the split between mechanical and judgment criteria, per skill.

Out of scope: changing any criterion's classification, adding mechanical criteria to a judgment-only capability, and changing which criteria a declaration selects. This item is about disclosure only.

## Current state

Verified on harness `main` `68da7df7` and `tools-ki` `main` `76ac4d33`:

- `src/commands/repo/shared/reporting/audit.ts` derives every summary from findings alone. A passing repository renders `PASS · <n> skill(s)`; a non-passing one renders skill and finding counts. Neither form carries a criteria count, and the per-skill result line shows only `FAIL=` and `WARN=`.
- `PreparedSkill.items` holds the mechanical items the host will run; `SkillAuditResult.items` holds each item's outcomes, so an item whose every outcome is `NOT_APPLICABLE`, or which had no applicable subject, is visible to the host but not reported.
- Judgment criteria live only in `PreparedSkill.definition.families`; the host never runs them, and nothing in the summary says they exist.
- `docs/specs/repository-audit.md` has no requirement on coverage disclosure.

## Steps

- [ ] In `tools-ki`, carry a per-skill criteria count from the audit operation to the reporter: mechanical items planned, mechanical items evaluated (at least one outcome other than `NOT_APPLICABLE`), and items with a judgment aspect, which remain unassessed by the host.
- [ ] Append `CRITERIA: EVALUATED=<e>/<m> JUDGMENT=<j>` to the repository summary, the concise summary, each multi-repository line and the totals, and to each per-skill result line.
- [ ] Add `REPO-AUDIT-010 - Criteria coverage disclosure` to `docs/specs/repository-audit.md`, a contract test, and an `Unreleased` changelog entry; update exact-output tests.

## Files touched

- `tools-ki`: `src/core/repository/operations/audit.ts`, `src/commands/repo/shared/reporting/audit.ts`, `src/tests/cli/repo/*.test.ts`, `docs/specs/repository-audit.md`, `CHANGELOG.md`
- Harness: this record only.

## Verify

```bash
# tools-ki
bun run test:coverage
bunx tsc --noEmit
ki repo audit
# harness
ki repo audit --skill ki-work-roadmap
```

The harness audit summary must show a non-zero `EVALUATED` count for `ki-work-roadmap`; a `ki-git` audit must show `EVALUATED=0/0` with a non-zero `JUDGMENT` count.

## Dependencies / blocks

Nothing blocks this record. `KI-HARNESS-GOV-107` (done) relied on the signal it adds.

## Documentation impact

### Decision Records

None. The change discloses existing behaviour and changes no verdict or exit status.

### Specifications

`tools-ki` `REPO-AUDIT-010` states the disclosure.

### Guides

None.

### Roadmap

This record only.

## Discussion

### Why this is not cosmetic

A green summary is used as evidence in reviews, acceptance and delegated-agent reports. If the summary cannot distinguish "checked and passed" from "nothing to check", that evidence is weaker than it looks, and a reviewer has no cheap way to notice.

### Decisions at planning

- The count appears in the default summary at every reporter level. It is cheap, and a disclosure hidden behind a flag would not reach the reviewer who most needs it.
- A skill that evaluated no mechanical criterion keeps its `PASS` verdict. A distinct verdict would change verdict and exit semantics, which the Boundary excludes; `EVALUATED=0/0` beside a non-zero `JUDGMENT` makes the case visible instead.
