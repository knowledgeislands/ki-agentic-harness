---
id: KI-HARNESS-GOV-162
area: GOV
title: Cite rules in Paperclip
kind: deliver
purpose: debt
project: paperclip-bootstrap-and-recovery
component: agentic-systems
status: cancelled
resolution: rejected
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-10-08T08:47:44Z
updated_at: 2026-10-09T21:01:43Z
---

# KI-HARNESS-GOV-162: Cite rules in Paperclip

## Goal

The three local Paperclip agent instruction files that restate the seven coordination rules carry a citation of the coordination standard's rule table instead, so the rule text has one governed home and the agents cannot act on a diverged copy.

## Context

Split from KI-HARNESS-GOV-103 on 2026-10-08. That record added the [coordination rules](../../skills/agentic-systems/ki-agent-coordination-paperclip/references/standards-agent-coordination-paperclip.md#coordination-rules) table, the rule 7 sentence in `ki-work-roadmap`, and the citation in the `ki-wright` role record. Its last step - replacing the rule copies in the managed agent instructions - needs a Paperclip managed-instruction update on the local instance, which the delegated background run delivering KI-HARNESS-GOV-103 was not authorised to make.

Read-only inspection on 2026-10-05 found the rule text in three managed agent instruction files on the local instance (agents `61d06d85`, `48c0ddf2` and `9bd94a34`, each `instructions/AGENTS.md` under `# Where the work lives`) and none in the Convenor's (`4b312799`). The three copies had already diverged from one another.

## Boundary

In scope: under a Paperclip coordination task linked from this record's `task_links`, replace the rule text in those three files with a citation of the rule table at an admitted harness revision, through Paperclip's supported managed-instruction route on the local instance, and record before and after digests of each file.

Out of scope: any remote or non-local Paperclip operation, which the Techne Programme Hold excludes; any change to the rule table or the rules' normative homes; and a mechanical check that a copy has reappeared.

## Cancelled

Cancelled 2026-10-09 as rejected, approved by Kris Brown (state-of-play decisions log, Decision 22): Kris chose not to keep this as a work record. It is kept as a one-line idea in Arcadia's paperclip-bootstrap-and-recovery Project (`ki-arcadia-principal`, `Streams/Projects/paperclip-bootstrap-and-recovery.md`). It leaves no outstanding change.

## Discussion

### Acceptance evidence

A read-only grep of the three files after the update returns citations of the table and none of the rule sentences, with before and after digests recorded here.

### Why this is separate

The repository side of KI-HARNESS-GOV-103 is complete and verifiable on its own. This step acts on the coordination plane rather than the repository, needs an operator with Paperclip access on the local instance, and was never a gate on KI-HARNESS-GOV-103's `done`.
