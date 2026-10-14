---
id: KI-HARNESS-GOV-186
area: GOV
title: banner and prefilled reply
project: ways-of-working
component: governance
kind: deliver
purpose: governance
status: done
blocks: []
blocked_by: []
baseline_ref: 418df4a07e9f1be9861f5b433642ed373298500f
created_at: 2026-10-14T11:05:47Z
updated_at: 2026-10-14T11:17:11Z
---

# Make the Block-Letter Banner Normative and Prefill the Reply Block

## Goal

Make the block-letter status banner the closing frame of every coordinating-thread Summary, recap, full summary and re-bootstrap report in `ki-pmo`, with the REST and BUSY frames, the lines beneath and the resume line in its own text block taken from the `ways-of-working` design, so that a thread re-bootstrapped from `ki-pmo`, `ki-checkpoint` and `ki-delegation` renders it the same way every time; and make the owner report's closing reply block in `ki-delegation` a prefilled answer, one line per query carrying the recommended instruction, never a menu of every option.

## Context

Kris asked for this on 2026-10-14 in the `ways-of-working` thread, with a screenshot of the `acquire-intake` thread's BUSY banner, in these words: "The banner is looking really good. This is one from a choir. But when I'm asking threads to rebootstrap from PMO and Checkpoint and delegation, it's not doing the banner in the same way. For example, your own thread has done the same thing. Clearly the banner is incorrect, but also the proposed copy block is including all the options, rather than the recommended option." The frames follow the design note `thread-banner-and-re-anchoring.md` under the `ways-of-working` Project in Knowledge Islands Principal, whose frame Kris settled on the same day: "(a). Yeah, that's great." and whose states Kris set as "a conversational thread can be considered done. That's the end of the conversation. But a coordination thread can either be busy or at rest. Whether or not it then ends up being done is more a situation about the project itself, and in effect, it's when we say that project's closed and pull out and tidy up all of the stuff that's been happening." No banner, mark or resume line cites a decision number, because a number, in Kris's words of 2026-10-14, "has no meaning to me because I don't know what the decision was ... and I don't know where the list is".

## Boundary

- In scope: the `ki-pmo` standard's Banner practice, report forms, full summary, recap, bootstrap and mechanical boundary; the `ki-pmo` SKILL.md, sources and the PMO-6 judgment item with its regenerated rubric; a frame test under `ki-pmo`'s scripts; the `ki-delegation` reply-block and Needs-tags rules, the RUN-4 judgment item and its regenerated rubric; `ki-recap`'s note reconciling its DONE frame with `ki-pmo`'s; the hook line in `hooks/coordinator-reminder.sh`, its test and README, and HARN-012 and HARN-013; `output-styles/ki-coordinator.md`.
- Out of scope: the DONE frame's close-out tidy procedure beyond naming it; the thread status line, inbox, thread messaging, red-x recovery and the `/compact` option the design also holds; re-anchoring after compaction as a separate subsection; any `tools-ki` change; deploying the output style through chezmoi; declarations in other Capitals.

## Requirements

1. `ki-pmo`'s standard holds the REST and BUSY frames byte-identical to the design, 52 display columns per framed line, with the label, running, queued, waiting and housekeeping lines beneath and the resume line in its own fenced `text` block; DONE is shown once, at Project close, and shares its glyphs with `ki-recap`'s frame.
2. Every Summary, recap, full summary and re-bootstrap report keeps its opening `#` banner heading and closes with the frame and the resume line, whose text is `Resume <label> under current ki-pmo and ki-delegation since <mark>: re-bootstrap, mark, fresh summary with carried-forward open points, take stock, restart authorised work, then banner.`
3. The `ki-delegation` reply block carries one line per query, prefilled with the recommended instruction, ready to send as it stands or to edit, never a menu of the options, with an angle-bracket placeholder only where the owner alone can supply the value; `ki-pmo`'s full-summary text says the same.
4. The hook line and the `ki-coordinator` output style carry the closing banner and the prefilled reply block, so a thread that re-bootstraps renders them; the hook test asserts the new line.
5. `bun run test`, `bunx tsc --noEmit` and the focused audits for `ki-pmo`, `ki-delegation` and `ki-recap` pass on the combined result.

## Current state

Delivered on harness `main` from baseline `418df4a0` as four commits: the ledger advance, the banner and reply-block change with this record, the regenerated rubrics, and this closing commit with the regenerated catalogue and diagram stamps. Verified and closed on Kris's advance instruction.

## Steps

- [x] Write this record after the ledger advance.
- [x] Add the Banner subsection, the closing rule in every form and the resume line to the `ki-pmo` standard; update SKILL.md, sources, PMO-6 and the frame test; regenerate the rubric.
- [x] Prefill the reply block in `ki-delegation`'s owner report and Needs tags; update RUN-4; regenerate the rubric.
- [x] Reconcile `ki-recap`'s DONE frame note.
- [x] Extend the hook line, its test, README and HARN-012; add the banner and reply-block rule to the output style and HARN-013.
- [x] Run the gates and audits; commit by explicit path; pull with rebase; push fast-forward.

## Files touched

- `skills/change-management/ki-pmo/references/standards-pmo.md`, `SKILL.md`, `references/sources.md`, `references/rubric.md`, `scripts/rubric/items/threads.ts`, `scripts/banner.test.ts` (new).
- `skills/governance/ki-delegation/references/standards-background-runs.md`, `references/rubric.md`, `scripts/rubric/items/background-runs.ts`.
- `skills/change-management/ki-recap/references/standards-session-recap.md`.
- `hooks/coordinator-reminder.sh`, `hooks/coordinator-reminder.test.ts`, `hooks/README.md`, `docs/specs/harness.md`, `output-styles/ki-coordinator.md`.
- `skills/README.md`, `docs/diagrams/diagrams.toml`.
- `docs/roadmap/_ISSUES.md`, this record.

## Verify

- `bun run test`, `bunx tsc --noEmit`, `bun test hooks/coordinator-reminder.test.ts skills/change-management/ki-pmo`.
- `ki repo audit --skill ki-pmo`, `ki repo audit --skill ki-delegation`, `ki repo audit --skill ki-recap`.
- `ki dev skill rubric ki-pmo` and `ki dev skill rubric ki-delegation` report the publications in sync.

## Dependencies / blocks

- None. The design's other units are captured by the `ways-of-working` Project in Knowledge Islands Principal and are not delivered here.

## Documentation impact

### Decision Records

None; the banner is a report form under the coordinating-thread standard, which ADR-KI-HARNESS-SKILLS-006 already places in `ki-pmo`.

### Specifications

HARN-012 names the closing banner in the hook line; HARN-013 names the banner frames in the output style.

### Guides

None.

### Roadmap

No follow-on record here.

## Review

### Delivered

The requested boundary was delivered in full: the `ki-pmo` standard carries the REST, BUSY and DONE frames from the `ways-of-working` design, the lines beneath, the resume line in its own text block and the five steps it runs; every Summary, recap, full summary and re-bootstrap report keeps its `#` heading and closes with the frame and the resume line; the `ki-delegation` reply block is prefilled with the recommended instruction, one line per query, never a menu, with a placeholder only where the owner alone can supply the value, and the Needs-tags rule and the full-summary text say the same; `ki-recap`'s standard names the shared DONE glyphs and their differing side lines; the hook line, its test, README and HARN-012 and HARN-013 carry the banner and the prefilled reply block; the `ki-coordinator` output style carries both frames byte-identical and the resume line; PMO-6 and RUN-4 review them; and a frame test holds the standard, the output style and `ki-recap`'s glyphs together. Nothing from the design beyond section 1 was built. Authority is Kris's request of 2026-10-14 quoted under Context.

### Change Summary

Four commits on `main` from baseline `418df4a0`: the ledger advance; the banner and reply-block change with this record and the frame test; the regenerated `ki-pmo` and `ki-delegation` rubrics, published from the primary checkout because `ki dev skill rubric --write` publishes only into the tree the dev-linked harness resolves to; and this closing commit with the regenerated capability catalogue for the changed `ki-pmo` description, the diagram manifest stamps and this record's review. One correction during delivery: the record's title was shortened to four words and `## Discussion` added after the roadmap audit failed it.

### Verification

Run on 2026-10-14 against the combined result in the primary checkout:

- `bun run test`: 1133 pass, 0 fail across 165 files. `bunx tsc --noEmit`: clean. `bun skills/repo-structure/ki-repo-harness/scripts/skill-graph.ts --check`: both diagram sources in sync.
- `ki repo audit --skill ki-pmo`: PASS. `ki repo audit --skill ki-delegation`: PASS. `ki repo audit --skill ki-skills`: no failures, the two pre-existing refresh-cadence warnings on other skills' sources. `ki repo audit --skill ki-work-roadmap`: PASS. `ki repo audit --skill ki-repo-harness`: PASS after the catalogue regeneration.
- `ki repo audit --skill ki-recap` cannot run here: `ki-recap` is a global process skill with no declaration table, so `--skill` refuses it; its two test files ran in the suite and the `ki-skills` fleet audit covers its SKILL.md.
- `ki dev skill rubric ki-pmo` and `ki dev skill rubric ki-delegation`: in sync.

### Outstanding concerns

- The `ki-recap` focused audit is not runnable for an undeclared skill; this is a property of the audit, not a gap in the change.
- The SVG exports under `docs/diagrams/` were not re-exported; the diagram sources were unchanged and only the manifest stamps moved.
- Deploying the changed `output-styles/ki-coordinator.md` to `~/.claude/output-styles/` belongs to the user-environment manager, so a live thread renders the new banner only once that copy is refreshed or the hook line reaches it.
- The design's other units, re-anchoring after compaction, the thread status line, the inbox, red-x recovery and the `/compact` option, remain with the `ways-of-working` Project.

### Post-change review

The frames were measured at 52 code points per framed line in the standard, the output style and `ki-recap`'s standard, and the frame test fails if any of the three drifts. The hook test asserts the new line for Claude Code and Codex payloads. The record was shaped and closed in the primary checkout after the worktree commits were fast-forwarded into it.

### Mini recap

Made the block-letter banner normative in `ki-pmo` with the resume line, prefilled the `ki-delegation` reply block with the recommended answer, and carried both into the hook line and the output style so a re-bootstrapped thread renders them the same way. Learning route, not promoted: a rubric regeneration from a worktree has to go through the primary checkout, so a delivery that changes rubric items plans a fast-forward step.

## Done

Accepted 2026-10-14 by Kris Brown on the review packet above.

## Discussion

### Why the banner lives in ki-pmo and not in the owner report

The owner report is shared by background agents and coordinating threads, and a background agent has no mark, no queue and no resume. The frame reads thread state, so it belongs to the coordinating-thread standard, which every Summary, recap, full summary and re-bootstrap report already follows; `ki-delegation` keeps the report shape and the reply block, which both kinds of report share.

### Why the rubrics were regenerated in the primary checkout

`ki dev skill rubric --write` publishes only into the working tree the dev-linked harness resolves to, which is the primary checkout, so the worktree commits carried the rubric items and the primary checkout, fast-forwarded to them, carried the regenerated publications in their own commit. KI-HARNESS-GOV-185 met the same constraint for the declaration.

### Owner acceptance

Kris's brief for this run on 2026-10-14 said "Close the record if verified." Every gate and audit named under Verification passed on the combined result, so this record records its Done transition in the same closing commit, removes its horizon and advances `updated_at` while preserving `created_at` and `baseline_ref`. The closure authorises no other acceptance, pruning or publication.
