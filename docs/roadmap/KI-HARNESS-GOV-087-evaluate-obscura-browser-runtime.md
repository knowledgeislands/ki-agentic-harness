---
id: KI-HARNESS-GOV-087
area: GOV
title: Evaluate Obscura browser runtime
theme: governance-consistency
horizon: triage
status: draft
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-09-22T06:15:11Z
updated_at: 2026-09-22T06:15:11Z
---

## Goal

Determine whether self-hosted Obscura should become a reusable Knowledge Islands browser-execution option for isolated, read-only agent workflows, beginning with a bounded ChatGPT acquisition trial.

## Context

Obscura is an open-source headless browser engine that advertises Chrome DevTools Protocol compatibility, Playwright and Puppeteer reuse, fast isolated sessions, JavaScript rendering, and self-hosting. This could provide a lighter agent-owned browser surface when a task should not depend on a person's everyday Chrome profile.

The immediate practical case is ChatGPT acquisition. The installed local cache supplies opaque identity and change evidence, while account exports are readable but delayed and manually requested. A browser trial could establish whether an explicitly authenticated isolated session can enumerate projects and conversations, read complete visible content, and emit deterministic checkpoints without relying on undocumented network endpoints.

## Boundary

This item evaluates and records evidence; it does not adopt Obscura across the estate, install a managed cloud dependency, transfer personal browser cookies, automate passwords or multi-factor authentication, enable stealth or detection-evasion features, mutate or delete provider content, or treat rendered UI as complete without verification.

Prefer a self-hosted disposable runtime with a deliberately provisioned authentication profile. Any managed-service use, persistent credential custody, or provider-specific mutation needs a separate security and authority decision. The trial must use supported page interaction and fail closed when virtualisation, lazy loading, branches, attachments, omissions, rate limits, or authentication prevent fidelity.

## Discussion

Compare Obscura with the current interactive Chrome and in-app browser surfaces on isolation, authenticated-state handling, rendering fidelity, accessibility-tree or DOM extraction, downloads, observability, resource cost, and maintenance risk. Confirm actual compatibility rather than accepting CDP and performance claims as interoperability evidence.

For ChatGPT, attempt a small read-only project and conversation inventory. Correlate browser-observed identities with local-cache evidence and, when available, the official export. Record whether every message branch, write-up, file, timestamp, project association, and omission can be represented and hashed. A useful result may be a constrained browser adapter, a hybrid cache-plus-browser design, or evidence that browser acquisition is too fragile.

The trial should produce a recommendation, reproducible fixture or evidence packet, explicit credential boundary, and follow-on owner. It must not silently broaden `ki-acquire-chatgpt`'s executable capability metadata before the evidence exists.
