---
id: KI-HARNESS-GOV-186
area: GOV
title: thread banner and prefilled reply block
project: ways-of-working
component: governance
kind: deliver
purpose: governance
status: in-progress
horizon: now
blocks: []
blocked_by: []
baseline_ref: 418df4a07e9f1be9861f5b433642ed373298500f
created_at: 2026-10-14T11:05:47Z
updated_at: 2026-10-14T11:05:47Z
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

In progress in a background run from baseline `418df4a0`.

## Steps

- [ ] Write this record after the ledger advance.
- [ ] Add the Banner subsection, the closing rule in every form and the resume line to the `ki-pmo` standard; update SKILL.md, sources, PMO-6 and the frame test; regenerate the rubric.
- [ ] Prefill the reply block in `ki-delegation`'s owner report and Needs tags; update RUN-4; regenerate the rubric.
- [ ] Reconcile `ki-recap`'s DONE frame note.
- [ ] Extend the hook line, its test, README and HARN-012; add the banner and reply-block rule to the output style and HARN-013.
- [ ] Run the gates and audits; commit by explicit path; pull with rebase; push fast-forward.

## Files touched

- `skills/change-management/ki-pmo/references/standards-pmo.md`, `SKILL.md`, `references/sources.md`, `references/rubric.md`, `scripts/rubric/items/threads.ts`, `scripts/banner.test.ts` (new).
- `skills/governance/ki-delegation/references/standards-background-runs.md`, `references/rubric.md`, `scripts/rubric/items/background-runs.ts`.
- `skills/change-management/ki-recap/references/standards-session-recap.md`.
- `hooks/coordinator-reminder.sh`, `hooks/coordinator-reminder.test.ts`, `hooks/README.md`, `docs/specs/harness.md`, `output-styles/ki-coordinator.md`.
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
