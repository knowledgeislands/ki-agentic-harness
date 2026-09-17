---
id: KI-HARNESS-GOV-071
area: GOV
title: Follow shared site config
theme: governance-consistency
horizon: now
status: awaiting-review
blocks: []
blocked_by: []
baseline_ref: e7d90fbdf6b4750c701a2192b2cda6bcde35de95
created_at: 2026-09-17T16:53:09Z
updated_at: 2026-09-17T21:37:35Z
---

# Follow shared site config

## Goal

`ki-repo-website-content` should recognise required Eleventy behaviour when a selected site's configuration obtains that behaviour from a repository-local shared module, without weakening WEB-12 through WEB-16.

## Context

WEB-12 through WEB-16 use `configRule` in `skills/repo-structure/ki-repo-website-content/scripts/rubric/items/web.ts`, which currently regex-tests only the selected site's raw Eleventy configuration text. The checks require an absolute-to-relative URL transform, TypeScript and JSON5 data extensions, the Tailwind build hook, and the compiled-CSS watch target.

That model works for an inline single-site configuration. It produces false findings when several sites correctly share the same behaviour through a workspace package. `krisb/kit-midnight.ninja`, a named reference for the skill, imports `applyViewCommon()` from `packages/view-common`; byte-comparison evidence showed unchanged built output, but WEB-12 fails and WEB-13 through WEB-16 warn because the current context never reads the imported module.

## Boundary

Keep every behavioural requirement and its existing severity. Do not require duplicated inline code, traverse installed `node_modules`, execute configuration, interpret dynamic imports, or build a general TypeScript dependency graph. Checks that genuinely concern the site configuration file itself remain single-file checks.

## Current state

`WebsiteContext.config` contains one file. The context has repository-bounded readers and workspace evidence but no collection of configuration sources. `configRule` cannot distinguish absent behaviour from behaviour supplied by a direct repository-local import.

## Locked decisions

- Add an ordered `configSources` collection containing the site configuration and directly imported repository-local configuration modules.
- Resolve static relative imports and static workspace-package imports from the selected site configuration by using the root workspace declarations and each package's `name` and `exports` or entry-point metadata.
- Follow one import edge only. Accept TypeScript and JavaScript source extensions and index files, require physical repository-contained files, and report unresolved or unsafe imports as evidence rather than following them.
- Evaluate WEB-12 through WEB-16 across the source collection with `some`; do not concatenate files or change their severities.
- Preserve `config` as the selected site's own text for checks whose contract is explicitly file-local.

## Steps

- [x] Extend `WebsiteContext` with path-qualified configuration sources and a bounded direct-import resolver.
- [x] Rework only WEB-12 through WEB-16 to inspect the resolved source collection while keeping their current outcomes when behaviour is absent.
- [x] Add focused fixtures for inline behaviour, a relative shared module, a workspace-package export, an unresolved or unsafe import, and behaviour absent from every source.
- [x] Update the website-content standard and generated rubric to state the repository-local direct-import evidence boundary.
- [x] Verify the real `kit-midnight.ninja` shape without moving shared code back into either site configuration.

## Files touched

- `skills/repo-structure/ki-repo-website-content/scripts/rubric/contexts/website.ts`
- `skills/repo-structure/ki-repo-website-content/scripts/rubric/contexts/website.test.ts`
- `skills/repo-structure/ki-repo-website-content/scripts/rubric/items/web.ts`
- Focused WEB item tests if needed by the existing test layout
- `skills/repo-structure/ki-repo-website-content/references/standards-eleventy-site.md`
- Generated `skills/repo-structure/ki-repo-website-content/references/rubric.md`
- This work item

## Verify

- Focused website-content context and rubric tests pass.
- Inline, relative-module, and workspace-package fixtures pass WEB-12 through WEB-16.
- A fixture missing the behaviour everywhere retains the current FAIL and WARN outcomes.
- Unsafe, external, dynamic, and installed-package imports are not followed.
- `ki repo audit --skill ki-repo-website-content --repo <kit-midnight.ninja>` passes WEB-12 through WEB-16 without duplicating configuration code.
- `ki dev skill rubric ki-repo-website-content`, `bun run test`, `bunx tsc --noEmit`, and `ki repo audit --skill ki-skills --repo .` pass.

## Dependencies / blocks

No delivery blocker. Implement before [KI-HARNESS-GOV-072](KI-HARNESS-GOV-072-govern-multi-site-repositories.md) when convenient because the later context generalisation can then preserve this resolved-source seam, but neither item depends on the other's output.

## Documentation impact

### Decision Records

No Decision Record is required: this restores existing WEB-12 through WEB-16 behaviour across an already-supported workspace composition without changing the required outcome.

### Specifications

Update the website-content standard to define which repository-local imports count as configuration evidence and which imports remain outside the mechanical audit boundary.

### Guides

No guide change is required; repository authors keep importing shared configuration normally.

### Roadmap

Keep [KI-HARNESS-GOV-072](KI-HARNESS-GOV-072-govern-multi-site-repositories.md) independent and ready; record any need for recursive dependency analysis as separate prospective work rather than expanding this item.

## Review

### Delivered

WEB-12 through WEB-16 now inspect the selected Eleventy configuration and its direct, safe repository-local imports without executing configuration code or traversing a general dependency graph.

### Summary of changes

- Added ordered, path-qualified `configSources` and one-edge resolution for relative modules and declared workspace package exports or entry points.
- Preserved file-local `config` for checks outside WEB-12 through WEB-16 and preserved existing FAIL and WARN severities when required behaviour is absent.
- Added focused inline, relative, workspace, unsafe, installed, dynamic, and second-edge fixtures.
- Updated the normative standard and generated rubric wording.

### Verification

- `bun test skills/repo-structure/ki-repo-website-content/scripts/rubric/contexts/website.test.ts` — 20 pass, 0 fail.
- `bun run test` — 718 pass, 0 fail.
- `bunx tsc --noEmit` — pass.
- `ki dev skill rubric ki-repo-website-content` — generated publication in sync.
- `ki repo audit --skill ki-skills --repo .` and `ki repo audit --skill ki-work-roadmap --repo .` — pass.
- Real `kit-midnight.ninja` evidence resolved `apps/site-apex/eleventy.config.ts` then `packages/view-common/src/eleventy.ts`; WEB-12 through WEB-16 all passed with the shared module as the reported subject.

### Outstanding concerns

None within the approved one-edge source boundary. Multi-site selection remains owned by KI-HARNESS-GOV-072.

### Post-change review

The resolver remains fail-closed: it accepts only physical repository-contained TypeScript or JavaScript, derives workspace packages from the root manifest, and ignores symlinks, external packages, installed packages, dynamic imports, and transitive imports.

### Mini recap

Shared Eleventy behaviour is now recognised where it is authored, while absent behaviour and unsafe resolution retain the prior findings.

## Discussion

### Detection seam

Following direct static repository-local imports is the cheapest honest seam. A declared list would duplicate the import graph in `.ki.toml`, while treating any workspace call as sufficient would turn missing behaviour into an unearned pass. One bounded edge covers the evidenced shared-helper shape without pretending to be a compiler or package manager.

### Safety and fidelity

Resolution must use repository-declared workspaces rather than the installed layout, reject symlinks and paths outside the repository, and retain path-qualified evidence. WEB-12 through WEB-16 then ask whether the required construct exists in any trusted source; every unrelated config-file check continues to inspect the selected file only.
