---
id: KI-HARNESS-GOV-087
area: GOV
title: Evaluate Obscura browser runtime
theme: governance-consistency
horizon: now
status: ready
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-09-22T06:15:11Z
updated_at: 2026-09-26T16:27:26Z
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

## Current state

`ki-agentic-radar` records Obscura as the reference implementation for the agent-owned isolated-browser-runtime pattern and keeps the stance at `assess`. The source evidence supports self-hosting, CDP compatibility, and isolated zero-state sessions, but there is no Knowledge Islands local-evaluation evidence for build reproducibility, persistent authenticated profiles, complex ChatGPT rendering, downloads, or acquisition completeness.

The existing signed-in browser profile cannot be copied into the trial under this item's approved boundary. A self-hosted Obscura revision has not yet been selected or built, and the user has not yet been presented with an isolated interactive authentication window. Those are execution preconditions rather than facts the plan can infer.

## Steps

- [ ] Select and record one immutable Obscura source revision, verify its self-hosted build and supported automation surfaces, and stop if the repository cannot be built without unmanaged credentials or an unsafe installation path.
- [ ] Run a non-secret synthetic fixture through the self-hosted runtime to verify session isolation, CDP or Playwright interaction, rendered-DOM extraction, downloads, observability, and deterministic teardown before involving an account.
- [ ] Present an isolated browser session for deliberate interactive ChatGPT authentication without copying cookies, passwords, MFA material, or the user's everyday browser profile.
- [ ] Inventory one bounded ChatGPT project and conversation read-only, exercising virtualised history, branches, write-ups, attachments, timestamps, and project association without mutating provider content.
- [ ] Correlate the browser result with local-cache identity evidence and any available official export, record omissions and hashes in a durable local-evaluation packet, and fail closed where completeness cannot be demonstrated.
- [ ] Update the agentic radar evidence, uncertainty, movement, and stance only as the local evaluation warrants, then route any acquisition implementation or security decision to its owning record.

## Files touched

- `skills/governance/ki-agentic-radar/references/evaluations/obscura-chatgpt.md`
- `skills/governance/ki-agentic-radar/references/radar.toml`
- `skills/governance/ki-agentic-radar/references/sources.md`
- Focused `ki-agentic-radar` fixtures if the evidence introduces a new mechanically checked state
- `docs/roadmap/KI-HARNESS-GOV-087-evaluate-obscura-browser-runtime.md`

## Verify

- The evaluation packet pins the tested Obscura revision and records reproducible build, isolation, interaction, fidelity, teardown, and credential-boundary evidence.
- Browser-observed ChatGPT identities and content are reconciled against local-cache or export evidence, with every omission or unavailable surface explicit rather than inferred complete.
- `ki repo audit --skill ki-agentic-radar --repo .`, `ki repo audit --skill ki-skills --repo .`, and `ki repo audit --skill ki-work-roadmap --repo .` pass.
- Focused `ki-agentic-radar` fixtures, `bun run test`, and `bunx tsc --noEmit` pass when executable radar code changes.

## Dependencies / blocks

The item is Ready. The delivered account export supplies the comparison baseline for the later ChatGPT step, but execution still stops at two explicit gates: a selected Obscura revision must prove locally buildable, and the user must explicitly confirm an interactive authentication window in the isolated runtime. These are implementation-time feasibility and authority gates; the safe-local batch policy cannot infer either condition, transfer the existing browser profile, or substitute a synthetic page for the ChatGPT trial.

## Documentation impact

### Decision Records

No Decision Record is required for the evaluation. Adoption, managed-service use, persistent credential custody, or a provider-specific acquisition design would require a separate durable decision after evidence exists.

### Specifications

No accepted behaviour changes during evaluation. A later executable acquisition adapter would require its own specification or governed capability contract.

### Guides

No user guide changes until a supported operating procedure exists. The evaluation packet records evidence, not instructions for routine use.

### Roadmap

Any supported browser adapter, ChatGPT acquisition change, or security boundary becomes a separate owner-scoped follow-up. This record must not broaden `ki-acquire-chatgpt` during the trial.

## Discussion

Compare Obscura with the current interactive Chrome and in-app browser surfaces on isolation, authenticated-state handling, rendering fidelity, accessibility-tree or DOM extraction, downloads, observability, resource cost, and maintenance risk. Confirm actual compatibility rather than accepting CDP and performance claims as interoperability evidence.

For ChatGPT, attempt a small read-only project and conversation inventory. Correlate browser-observed identities with local-cache evidence and the delivered official export. Record whether every message branch, write-up, file, timestamp, project association, and omission can be represented and hashed. Treat the export as the one-time bootstrap candidate and browser reads as provisional incremental evidence until periodic export reconciliation demonstrates coverage. A useful result may be a constrained browser adapter, a hybrid cache-plus-browser design, or evidence that browser acquisition is too fragile.

The trial should produce a recommendation, reproducible fixture or evidence packet, explicit credential boundary, and follow-on owner. It must not silently broaden `ki-acquire-chatgpt`'s executable capability metadata before the evidence exists.
