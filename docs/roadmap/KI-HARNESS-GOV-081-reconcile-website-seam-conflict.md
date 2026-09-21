---
id: KI-HARNESS-GOV-081
area: GOV
title: Reconcile website seam conflict
theme: governance-consistency
blocks: []
blocked_by: []
baseline_ref: null
transferred_from: ki-website
created_at: 2026-09-21T12:03:51Z
updated_at: 2026-09-21T12:03:51Z
horizon: triage
status: draft
---

## Goal

A website repository can satisfy `ki-repo-website` and `ki-engineering` at the same time. Today it cannot, and the repository that discovers this has to pick a standard to disobey without any guidance on which one.

## Context

The two standards meet at the `ki:site:*` scripts and require opposite things.

`standards-website.md` §47 governs the public seam: an alias "may contain its exact terminal command or exactly `bun run self:site:<primary>:<verb>` when that repository-owned script contains the exact terminal command. Missing, mismatched, chained, or cyclic forwarding fails." It is enforced at `SITE-4`, `SITE-5`, and `SITE-6`, and again for hosted repositories at `WCF-13`, `WCF-14`, and `WCF-25` — the last at FAIL rather than WARN.

`standards-engineering.md` §88 governs the task graph: Turborepo owns it in any repository with a `workspaces` array, because "a root script chaining `bun run --cwd <workspace> build` is a fixed sequence that rebuilds the workspaces nobody touched on every gate run, every `dev` start, and every CI job."

The exact literal form one standard mandates at `ki:site:build` is the form the other names as the anti-pattern it exists to replace. There is no script satisfying both: `turbo run build` fails `WCF-25`, and `bun run --cwd apps/site build` is §88's chain.

KI Website hit this while adopting Turborepo under `KI-WEB-SITE-015`. The `ki:site:*` scripts were first pointed at `turbo run <task>` on the reasoning that the task runner should own every path to a build; `SITE-4/5/6` and `WCF-13/14/25` rejected it. They were restored to exact delegation, with Turborepo behind the root `build` and `clean` — the shape `kit-midnight.ninja` already uses, so the estate had silently resolved this in the seam's favour without the resolution being written anywhere.

The consequence is not cosmetic. Cloudflare Workers Builds invokes the public seam — the [KI Website Cloudflare guide](https://github.com/knowledgeislands/ki-website/blob/main/docs/guides/cloudflare.md) records `bun run ki:site:build` as the build command — so the deploy is the one build that cannot use the cache, while local and CI runs going through root `build` can. The build whose freshness matters most is the one excluded from the mechanism that proves freshness.

## Boundary

This reconciles two standards the harness owns. It does not change any website repository: once the standards agree, each repository conforms on its own schedule.

It does not decide Cloudflare dashboard settings for any specific site, and it does not revisit whether Turborepo is the right task runner. `KI-HARNESS-GOV-079` covers making Turborepo adoption mechanically detectable and is a separate concern — that item is about a standard nobody checks, this one is about two standards that contradict.

## Discussion

### Why each side is defensible

The seam's literalism is not arbitrary. `ki:site:*` is a contract invoked from outside the repository, including from a Cloudflare dashboard that nobody wants to reason about and that fails at deploy time rather than at gate time. A literal, greppable command means the audit can prove what the dashboard will actually run. "Chained forwarding fails" exists so a public alias cannot quietly become a wrapper around something the standard has not seen.

The task graph's claim is equally sound. A build path that bypasses the runner is a build path with no input hashing and no notion of being up to date, and §88's whole argument is that such a path rebuilds unconditionally. Exempting the deploy from it inverts the priority.

### Shapes available

Permit `turbo run <task>` as a third recognised terminal form alongside the exact command and the `self:site` hop. This is the smallest change and directly resolves the contradiction. The cost is that the seam's guarantee weakens: `turbo run build` is only as good as `turbo.json`, which the website rubric does not read, so the audit would be attesting to a command whose behaviour is defined elsewhere. That could be mitigated by requiring a `turbo.json` task of the matching name to exist.

Keep the seam literal and move the deploy off it. If Workers Builds invoked root `build` rather than `ki:site:build`, the contradiction would dissolve without touching either standard — the seam stays a literal contract for humans and tooling, and the deploy uses the task graph. This makes `ki-repo-website-cloudflare` the owner of the resolution rather than `ki-engineering`, and requires a dashboard change per site.

Exempt website repositories from §88 explicitly. Honest, cheap, and probably wrong: it would exempt exactly the repository class where a deployable's stale-build risk is highest.

Declare the seam's priority and record it. The status quo plus a sentence in both standards saying the seam wins and why, with the uncached deploy named as a known cost. This changes no behaviour but stops the next repository from re-litigating it, which is the minimum this item should deliver.

### Alternatives considered

Leaving it undocumented is the status quo. Two repositories have now resolved it the same way independently — `kit-midnight.ninja` by construction and `ki-website` by hitting the FAIL — which suggests the answer is stable even though it is unwritten. The cost is that each adopter pays the discovery again, and pays it mid-implementation after having already written the wrong scripts.

### Open questions

- Which standard yields? The seam's guarantee is about auditability, the task graph's is about correctness, and they are not obviously commensurable.
- If `turbo run <task>` becomes a recognised form, must the website rubric read `turbo.json` to confirm the named task exists, or is that overreach into `ki-engineering`'s territory?
- Is the uncached deploy actually a problem worth solving? A cold site build in `ki-website` measures under a second, so the exposure today is small — but the argument for Turborepo was never about the current repository size.
- Does `ki-repo-website-app` have the same collision, or is it specific to the static-site seam?
