---
id: KI-HARNESS-GOV-057
area: GOV
title: Scope Website Development Scripts
theme: governance-consistency
horizon: next
status: done
blocks: []
blocked_by: []
baseline_ref: 83b44cb072b1fd1a8b81b37a87cead8b8c49e848
---

# KI-HARNESS-GOV-057: Scope Website Development Scripts

## Goal

Make website development commands visibly capability-owned in the package that implements them, while retaining one stable repository-root command for users and automation.

## Context

The accepted website contract currently requires root `ki:site:dev` to forward to a selected package's bare `dev`. Content sites additionally require bare `dev:css` and `dev:serve`. That split makes development ownership less explicit than the `ki:` namespace used at the repository seam and differs from the established package-local `ki:site:*` pattern discussed across website repositories.

The agreed correction keeps the root public `ki:site:dev` entry point but requires it to delegate to package-local `ki:site:dev`. A content site owns package-local `ki:site:dev:css` and `ki:site:dev:serve`; an app site implements Vite directly behind package-local `ki:site:dev`. Script command bodies remain package-specific. Bare package-local `build` and `clean` remain lifecycle idioms and are outside this correction.

## Boundary

This work changes the shared website and engineering contract, focused rubric checks and fixtures, the existing live toolchain Decision Record, and registered website repositories that declare the affected capability. It does not rename build, clean, deploy, preview, upload, content-processing, or other repository-owned scripts; change hosting or deployment behaviour; push; deploy; accept receiver work; or prune roadmap records.

## Current state

Website core claims root `ki:site:dev` but checks only that the key is present. The app rubric looks for selected-package `dev` containing Vite. The content rubric's WEB-30 and WEB-31 inspect selected-package `dev`, `dev:css`, and `dev:serve`. Six registered website repositories use a mixture of this split and older root-heavy development scripts.

## Steps

- [x] Amend the live toolchain decision and engineering, website-core, app-site, and content-site standards to define manifest-scoped website development ownership.
- [x] Change focused website checks so root `ki:site:dev` delegates the selected package's same key, app packages implement Vite at `ki:site:dev`, and content packages implement the `ki:site:dev*` family.
- [x] Update fixtures, exemplars, generated rubric publications, and stale-reference coverage without weakening command-body assertions.
- [x] Run focused and repository-wide harness verification, then commit the portable contract as one isolated implementation unit.
- [x] Migrate every registered website repository to the new development-key contract under its own instructions, work record, verification, and commit boundary.
- [x] Record receiver evidence and the canonical six-heading review packet, then leave this item at `awaiting-review`.

## Files touched

- `docs/decisions/ADR-KI-HARNESS-TOOLCHAIN-001-bun-biome-and-knip-standard-toolchain.md`
- `docs/roadmap/_ISSUES.md`
- `docs/roadmap/KI-HARNESS-GOV-057-scope-website-development-scripts.md`
- `skills/governance/ki-engineering/references/standards-engineering.md`
- `skills/repo-structure/ki-repo-website/`
- `skills/repo-structure/ki-repo-website-app/`
- `skills/repo-structure/ki-repo-website-content/`
- receiver-owned `.ki.toml`, package manifests, lockfiles, roadmap records, authorisations, and direct documentation references where required

## Verify

- `bun test skills/repo-structure/ki-repo-website/scripts/rubric/contexts/website.test.ts skills/repo-structure/ki-repo-website/scripts/rubric/items/index.test.ts skills/repo-structure/ki-repo-website-app/scripts/rubric/contexts/app.test.ts skills/repo-structure/ki-repo-website-content/scripts/rubric/contexts/website.test.ts`
- `bunx tsc --noEmit`
- `bun run test`
- `ki repo audit --skill ki-engineering --repo .`
- `ki dev skill rubric ki-repo-website`
- `ki dev skill rubric ki-repo-website-app`
- `ki dev skill rubric ki-repo-website-content`
- `ki repo audit --skill ki-decision-records --repo .`
- `ki repo audit --skill ki-skills --repo .`
- `ki repo audit --skill ki-work-roadmap --repo .`
- Each receiver runs its declared engineering, website-core, selected website-implementation, roadmap, and build checks plus `git diff --check`.

## Dependencies / blocks

The accepted GOV-054 contract is already implemented and provides the root-versus-workspace boundary this correction refines. No build-order dependency remains. Receiver migrations must use the committed harness contract as their immutable reference and retain repository-local review authority.

## Delegation

### Locked decisions

- Root `ki:site:dev` remains the public repository command and delegates selected-package `ki:site:dev`.
- Every selected website package owns `ki:site:dev`; content packages additionally own `ki:site:dev:css` and `ki:site:dev:serve`.
- Bare selected-package `dev`, `dev:css`, and `dev:serve` are removed rather than retained as compatibility aliases.
- Bare package-local `build` and `clean` remain unchanged.
- Each receiver owns its roadmap lifecycle, review, and commit; no worker pushes, deploys, accepts, or prunes.

### Escalate

- Return to the coordinator for a required public-key change, new development command outside the locked family, contested file, unrelated failing gate, external-system change, or receiver whose selected site package cannot be resolved safely.

### Worker: vite-receivers

- **Deliverable:** Conform `5g-emerge-ibc-2026` and `infoschematics` to package-local `ki:site:dev`, with root forwarding and independently reviewable receiver commits.
- **Inputs:** Committed harness contract from this item; each receiver's `AGENTS.md`, `.ki.toml`, package manifests, selected app-site rubric, and current roadmap.
- **Scope:** Only receiver-local package manifests, lockfile if mechanically changed, direct script references, canonical roadmap/authorisation records required by local process.
- **Authority:** Read local instructions; create and shape one bounded receiver work record; rename only the locked development key and direct invocations; verify and commit explicit uncontested paths. Do not push, deploy, accept, prune, or alter unrelated scripts.
- **Isolation:** One receiver at a time in its shared working tree; retain a touched-path set and use explicit-path staging in a serialized Git write window.
- **Verify:** Coordinator checks diff and commit; worker runs engineering, website-core, app-site, roadmap, build, stale-reference, and `git diff --check` gates applicable locally.
- **Return:** Per receiver, baseline, commit, changed paths, exact verification outcomes, retained warnings, and unresolved concerns.
- **Checkpoint:** Return after both receiver commits or immediately at the first escalation condition.

### Worker: content-receivers

- **Deliverable:** Conform `5g-emerge-testbed-website`, `ki-website`, and `kit-midnight.ninja` to package-local `ki:site:dev`, `ki:site:dev:css`, and `ki:site:dev:serve`, with root forwarding and independently reviewable receiver commits.
- **Inputs:** Committed harness contract from this item; each receiver's `AGENTS.md`, `.ki.toml`, package manifests, selected content-site rubric, and current roadmap.
- **Scope:** Only receiver-local package manifests, lockfile if mechanically changed, direct script references, canonical roadmap/authorisation records required by local process.
- **Authority:** Read local instructions; create and shape one bounded receiver work record; rename only the locked development family and direct invocations; verify and commit explicit uncontested paths. Do not push, deploy, accept, prune, or alter unrelated scripts.
- **Isolation:** One receiver at a time in its shared working tree; retain a touched-path set and use explicit-path staging in a serialized Git write window.
- **Verify:** Coordinator checks diff and commit; worker runs engineering, website-core, content-site, roadmap, build, stale-reference, and `git diff --check` gates applicable locally.
- **Return:** Per receiver, baseline, commit, changed paths, exact verification outcomes, retained warnings, and unresolved concerns.
- **Checkpoint:** Return after all three receiver commits or immediately at the first escalation condition.

### Worker: vallearmonia-receiver

- **Deliverable:** Align `vallearmonia-website` with its actual selected `site/` workspace and move only the locked website development family behind package-local `ki:site:dev*`, returning one independently reviewable receiver commit.
- **Inputs:** Committed harness contract from this item; receiver `AGENTS.md`, `.ki.toml`, root and `site/package.json`, content-site rubric, and current roadmap.
- **Scope:** Receiver `.ki.toml`, root and selected-site package manifests, lockfile if mechanically changed, direct development-script references, and canonical roadmap/authorisation records required by local process.
- **Authority:** Declare the existing `site/` override if absent; move only the locked development family into selected package; keep root public forwarder; verify and commit explicit uncontested paths. Do not restructure other scripts, push, deploy, accept, or prune.
- **Isolation:** Exclusive named paths in the shared working tree; retain a touched-path set and use explicit-path staging in a serialized Git write window.
- **Verify:** Coordinator checks diff and commit; worker runs engineering, website-core, content-site, roadmap, build, stale-reference, and `git diff --check` gates applicable locally.
- **Return:** Baseline, commit, changed paths, exact verification outcomes, retained pre-existing findings, and unresolved concerns.
- **Checkpoint:** Return after the receiver commit or immediately at the first escalation condition.

## Documentation impact

### Decision Records

Amend the existing live toolchain decision in place because it owns the root-versus-workspace script boundary.

### Specifications

No product behaviour or externally consumed protocol changes; the capability contract is owned by governance standards and executable rubrics.

### Guides

No standalone guide is needed; skill standards, mode guidance, and exemplars are the reader-facing source of truth.

### Roadmap

This item captures the post-GOV-054 correction and records receiver migrations without reopening or rewriting the accepted GOV-054 record.

## Review

### Delivered

Against immutable baseline `83b44cb072b1fd1a8b81b37a87cead8b8c49e848`, the website development contract now uses `ki:site:dev` at both root and selected-package manifest scopes. Content packages additionally own `ki:site:dev:css` and `ki:site:dev:serve`. The central contract and all six registered receiver migrations are committed; build, clean, hosting, deployment, push, acceptance, and pruning remained outside the approved boundary.

### Summary of changes

The live toolchain decision, website core, Vite app, and Eleventy content standards now define manifest-scoped capability ownership. Their executable checks validate the package-local key, root forwarding, Vite command body, and referenced Eleventy fan-out rather than merely accepting matching script names. The central implementation is commit `e1b2595dbbbecfa2d838d82edb339153c9ba0357`; the engineering-standard sentence prepared in this delivery landed concurrently in `b3c613b655de2d5941a18224d4f8cffe6de10140` without rewriting that shared-tree commit.

Receiver migrations landed independently and remain at local `awaiting-review`: `5g-emerge-ibc-2026` at `5af7ae24037e0403015268ef71bcc1e5fa9f8c90`, `infoschematics` at `6697d617eed10cfa4e4786a4e0b2f6bd2a559164`, `5g-emerge-testbed-website` at `58daf561a2a13d597b760e7e77241e1069df56f9`, `ki-website` at `460640db3ce2ccd922a2134ae722efd34d3a3b7e`, `kit-midnight.ninja` at `39dcbfc9f1c56b692052731f1ac5cefea1b54273`, and `vallearmonia-website` at `bc260c25d24ceca2054c8d0243edcddad75da095`. Valle Armonia also declares its existing `site/` override; the other receiver changes are limited to manifests, required current guidance, and local lifecycle evidence.

### Verification

Harness verification passed: 28 focused website tests with 76 assertions, `bunx tsc --noEmit`, the full `bun run test` suite, focused audits for `ki-engineering`, `ki-decision-records`, `ki-skills`, `ki-work-roadmap`, and `ki-delegation`, all three `ki dev skill rubric` publication checks, and `git diff --check`. The central hook-backed commit contained exactly the 22 explicitly staged paths.

Each receiver passed its applicable website-core and implementation checks, roadmap validation for its new record, direct stale-reference assertions, a production site build, formatting checks, and `git diff --check`; workers inspected each hook-backed commit and clean post-commit tree. Coordinator review confirmed the six commit boundaries and independently asserted that every root forwards package-local `ki:site:dev`, every selected package owns that key, content packages own both fan-out keys, and no selected package retains bare `dev`, `dev:css`, or `dev:serve`.

### Outstanding concerns

No GOV-057-scoped concern remains. Pre-existing receiver findings were not expanded into this delivery: the testbed retains WEB-19, WEB-20, and WEB-26; IBC and Infoschematics retain their existing Vite large-chunk warning; Infoschematics retains unchanged KNIP-2 evidence for `@infoschematics/view-model`; Valle Armonia retains broader content, engineering, and older roadmap debt. Each exception is recorded in the affected receiver's review packet.

### Post-change review

Fresh review confirms the goal is met across the declared estate without changing runtime command bodies or hosting behaviour. Regression risk is constrained to renamed development entry points and was exercised through focused rubrics, stale-reference searches, manifest assertions, and production builds. Shared-tree isolation held: contested receiver state was allowed to clear, baselines were refreshed, and every commit contains only its tracked touched paths. The item is ready for human acceptance review.

### Mini recap

Website development is now visibly capability-owned at the manifest where it runs while preserving root `ki:site:dev` as the stable user-facing command. The governing decision, standards, executable checks, and six live receivers agree. Durable learning is already routed into the amended decision and skill standards; no additional guide, specification, or automatic backlog item is proposed.

## Done

Accepted 2026-09-09 by Kris Brown on the review packet above.

## Discussion

### Manifest-scoped ownership

The same `ki:site:dev` spelling may appear in root and selected-package manifests because each manifest exposes a distinct command surface. The root key is the stable repository seam; the package key is the implementation entry point. The capability claim remains unique within the root claim aggregation, while the selected implementation skill owns the package-local occurrence and its command shape.

### Development-only correction

The ambiguity arose in development fan-out rather than universal lifecycle commands. Keeping bare package-local `build` and `clean` avoids broadening the change and preserves familiar lifecycle entry points, while the development family gains an explicit website owner.

### No compatibility aliases

Retaining bare development forwarders would leave two supported surfaces and weaken the ownership correction. Repository history provides recovery; direct references move in the same bounded receiver commit.
