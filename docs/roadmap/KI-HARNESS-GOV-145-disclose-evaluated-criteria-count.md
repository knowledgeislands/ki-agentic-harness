---
id: KI-HARNESS-GOV-145
area: GOV
title: Disclose evaluated criteria count
kind: deliver
purpose: upkeep
initiative: platform-foundations
component: keystone
status: triage
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-10-06T23:01:19Z
updated_at: 2026-10-07T20:32:40Z
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

## Discussion

### Why this is not cosmetic

A green summary is used as evidence in reviews, acceptance and delegated-agent reports. If the summary cannot distinguish "checked and passed" from "nothing to check", that evidence is weaker than it looks, and a reviewer has no cheap way to notice.

### Open questions

- Should the count appear in the default summary or only at a higher reporter level?
- Should a skill that evaluated zero mechanical criteria report a distinct verdict rather than `PASS`?
