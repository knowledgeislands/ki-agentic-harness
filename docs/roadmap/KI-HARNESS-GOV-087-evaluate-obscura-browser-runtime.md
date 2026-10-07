---
id: KI-HARNESS-GOV-087
area: GOV
title: Evaluate Obscura browser runtime
kind: investigate
purpose: learning
project: knowledge-acquisition
component: acquire
status: cancelled
resolution: merged
resolution_target: KI-HARNESS-OPS-005
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-09-22T06:15:11Z
updated_at: 2026-10-07T20:29:49Z
---

## Goal

Determine whether self-hosted Obscura should become a reusable Knowledge Islands browser-execution option for isolated, read-only agent workflows, beginning with a bounded ChatGPT acquisition trial.

## Context

Obscura is an open-source headless browser engine that advertises Chrome DevTools Protocol compatibility, Playwright and Puppeteer reuse, fast isolated sessions, JavaScript rendering, and self-hosting. This could provide a lighter agent-owned browser surface when a task should not depend on a person's everyday Chrome profile.

The immediate practical case is ChatGPT acquisition. The installed local cache supplies opaque identity and change evidence, while account exports are readable but delayed and manually requested. A browser trial could establish whether an explicitly authenticated isolated session can enumerate projects and conversations, read complete visible content, and emit deterministic checkpoints without relying on undocumented network endpoints.

On 2026-09-26, the user confirmed that an official ChatGPT account export is available. The export is the bootstrap comparison source rather than a reason to skip the browser trial: the trial now asks whether an isolated browser can retrieve new or changed readable conversations that correlate with cache identities and reconcile cleanly against export evidence.

## Boundary

This item evaluates and records evidence; it does not adopt Obscura across the estate, install a managed cloud dependency, transfer personal browser cookies, automate passwords or multi-factor authentication, enable stealth or detection-evasion features, mutate or delete provider content, or treat rendered UI as complete without verification.

Prefer a self-hosted disposable runtime with a deliberately provisioned authentication profile. Any managed-service use, persistent credential custody, or provider-specific mutation needs a separate security and authority decision. The trial must use supported page interaction and fail closed when virtualisation, lazy loading, branches, attachments, omissions, rate limits, or authentication prevent fidelity.

## Cancelled

Approved by Kris on 2026-10-07 under decision 17 of the state-of-play design, which approved every cancel and merge in the easiest-first delivery plan.

Resolution `merged` into [KI-HARNESS-OPS-005](KI-HARNESS-OPS-005-acquire-ai-sessions.md): that record's hybrid-path Step already names this trial. The scope worth keeping is folded into that record's Boundary and Discussion. It leaves no outstanding change of its own.

## Discussion

Compare Obscura with the current interactive Chrome and in-app browser surfaces on isolation, authenticated-state handling, rendering fidelity, accessibility-tree or DOM extraction, downloads, observability, resource cost, and maintenance risk. Confirm actual compatibility rather than accepting CDP and performance claims as interoperability evidence.

For ChatGPT, attempt a small read-only project and conversation inventory. Correlate browser-observed identities with local-cache evidence and the delivered official export. Record whether every message branch, write-up, file, timestamp, project association, and omission can be represented and hashed. Treat the export as the one-time bootstrap candidate and browser reads as provisional incremental evidence until periodic export reconciliation demonstrates coverage. A useful result may be a constrained browser adapter, a hybrid cache-plus-browser design, or evidence that browser acquisition is too fragile.

The trial should produce a recommendation, reproducible fixture or evidence packet, explicit credential boundary, and follow-on owner. It must not silently broaden `ki-acquire-chatgpt`'s executable capability metadata before the evidence exists.

### Blocker checkpoint - 2026-10-04 (estate push)

Not started in the 2026-10-04 estate push. Step 3 requires the owner to confirm and complete an interactive ChatGPT authentication window in the isolated runtime, which cannot be done unattended; Steps 1-2 were not begun in isolation because their evidence would go stale before that gate. Resume when the owner is available for the authentication step.

### Question for Kris - 2026-10-04

Still not started on the second 2026-10-04 pass; evaluation only, nothing adopted. Step 1 would clone and build `h4ckf0r0day/obscura`, an unvetted third-party Rust source whose build scripts execute locally, and Step 3 needs you present for the isolated ChatGPT sign-in, so running Steps 1-2 unattended would add risk and produce evidence that goes stale before the gate.

**Question:** Do you approve building a pinned `h4ckf0r0day/obscura` revision on this Mac (or should the trial use a disposable VM or container instead), and when can you be present for the isolated ChatGPT authentication window? Until then this record stays `ready`.
