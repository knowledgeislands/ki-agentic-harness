---
id: KI-HARNESS-GOV-181
area: GOV
title: Chrome-route SVG export
project: ways-of-working
component: governance
kind: deliver
purpose: capability
status: done
blocks: []
blocked_by: []
baseline_ref: 221cc5de7d1c8ff5d8166cec763850e2de56410a
created_at: 2026-10-14T00:05:43Z
updated_at: 2026-10-14T14:11:31Z
---

# SVG Export Through Archify's Own Chrome Route

## Goal

The `ki-diagrams` exporter, `skills/governance/ki-diagrams/scripts/export-svg.ts`, drives the Archify viewer's Export > SVG action through the same headless Chrome route Archify's own browser gate uses, so that Playwright and its cached Chromium stop being a prerequisite of a repository that regenerates a diagram. The output stays the viewer's own download, byte for byte, and the export still fails closed.

## Context

Kris questioned the Playwright dependency on 2026-10-13 ("PLAYWRIGHT - question: why this dependency, how is playwright used?") and chose a comparison: "PLAYWRIGHT-DEP - (a) build and compare a browser-free extractor; adopt only if output matches, else (b)." [KI-HARNESS-GOV-177](KI-HARNESS-GOV-177-browser-free-svg-extractor.md) made that comparison and found that a browser-free port cannot match the viewer export, because the viewer copies its stylesheet from the browser's CSS Object Model, and offered a pinned-stylesheet fixture as a third option. Kris's first answer took it: "EXTRACT-PIN - open deliver record against ki-diagrams pinned-stylesheet extractor." The coordinator held that answer, because new evidence showed Archify's own browser gate already drives the system Chrome headless over the Chrome DevTools Protocol, and put the choice back to Kris as `EXPORT-ROUTE`.

Kris decided on 2026-10-14, in these words: "EXPORT-ROUTE - (a) reuse Archify's Chrome route; open the deliver record." `EXTRACT-PIN` is therefore dropped: no pinned-stylesheet extractor is built. This record is the deliver record that answer opens; its kind on adoption is `deliver`. It is captured under the standing instruction from the same day to create no new feature records except items Kris asks for; Kris asked for this one.

The evidence the decision rests on: Archify 3.0.1's `bin/visual-check.mjs` exports `findChrome`, which finds Google Chrome or Chromium at the platform's fixed paths or on `PATH` and lets `ARCHIFY_CHROME` override it, and `ChromeVisualBrowser`, which launches that executable with `--headless=new --remote-debugging-pipe` and a throwaway profile, speaks the DevTools Protocol over the pipe through its small `PipeCdp` class, and exposes `send` and `waitFor` for `Page.navigate`, `Runtime.evaluate` and any other method. Archify needs no Playwright and no cached browser. The viewer's `Archify.exportMenu.run('svg')` and the `data-last-export-format` and `data-last-export-canonical` receipt attributes are the same on either route.

This record was captured from Kris's answer. Kris adopted it on 2026-10-14 at horizon Next as a deliver record, in the words "ADOPT-181 - adopt at next, kind deliver."; adoption does not plan or implement it.

## Boundary

- `export-svg.ts`: replace its Playwright slice (launch, page, download event) with the Chrome route, either by importing Archify's `findChrome` and `ChromeVisualBrowser` from the installed skill or by porting a minimal pipe client of our own; keep `parseArguments`, `acceptExport`, `externalReference`, the receipt check and the fail-closed refusals as they are, and keep the output the viewer's own download file.
- `export-svg.test.ts`: the existing boundary tests, plus whatever the chosen route needs for the no-Chrome refusal and the version check.
- `ki-diagrams`: the SKILL.md prerequisite line, the standard's exporter and "Without Archify or Playwright" sections and the EDUCATE step that adds Playwright, reworded for the new prerequisite, which is a system Chrome or Chromium and, on the import option, the Archify skill itself.
- Not Archify, not the viewer, not the raster exports, not the diagram manifest and not any diagram source. Not `KI-HARNESS-GOV-177`, which is done on its finding.

## Current state

Done. Accepted on its review packet after the Verify gates were re-run. `export-svg.ts` finds the system Google Chrome or Chromium the way Archify's gate does, launches it headless over the DevTools pipe through the harness's own `scripts/internal/chrome.ts`, opens the viewer, runs Export > SVG and keeps the download. Playwright is gone from the exporter, its tests and the `ki-diagrams` prose. Three committed SVGs re-exported byte-identical through the new route. Kris opened delivery on 2026-10-14 with "NEXT-181 - start now".

## Steps

- [x] Choose between importing Archify's `findChrome` and `ChromeVisualBrowser` from the installed skill and porting a minimal DevTools-Protocol pipe client, and record the choice in Discussion.
- [x] Replace the Playwright slice of `export-svg.ts` (launch, page, download event) with the chosen Chrome route, keeping `parseArguments`, `acceptExport`, `externalReference`, the receipt check and the fail-closed refusals unchanged.
- [x] Extend `export-svg.test.ts` with the no-Chrome refusal and the Archify version check.
- [x] Re-export one committed diagram and confirm the SVG matches the previous Playwright export byte for byte.
- [x] Reword the `ki-diagrams` SKILL.md prerequisite line, the standard's exporter and "Without Archify or Playwright" sections and the EDUCATE step for the new prerequisite.

## Files touched

- `skills/governance/ki-diagrams/scripts/export-svg.ts`
- `skills/governance/ki-diagrams/scripts/export-svg.test.ts`
- `skills/governance/ki-diagrams/scripts/internal/chrome.ts` (new: the ported Chrome route)
- `skills/governance/ki-diagrams/scripts/internal/chrome.test.ts` (new)
- `skills/governance/ki-diagrams/SKILL.md`
- `skills/governance/ki-diagrams/references/` (`standards-diagrams.md`, `mode-educate.md`, `mode-audit.md`, `sources.md`)

## Verify

- `bun run test` passes, including the extended `export-svg.test.ts`.
- `bunx tsc --noEmit` passes.
- `ki repo audit --skill ki-diagrams` passes.
- A re-exported committed SVG is byte-identical to its Playwright-era export.

## Dependencies / blocks

Depends on the finding of [KI-HARNESS-GOV-177](KI-HARNESS-GOV-177-browser-free-svg-extractor.md), which is done. Requires a system Google Chrome or Chromium on the delivering machine. Blocks nothing recorded.

## Documentation impact

### Decision Records

None. The route choice is Kris's `EXPORT-ROUTE` answer, recorded in Context; it changes a tool prerequisite, not a durable policy.

### Specifications

None. The exporter's accepted behaviour (the viewer's own download, byte for byte, failing closed) is unchanged.

### Guides

The `ki-diagrams` SKILL.md prerequisite line and the diagrams standard's exporter sections change from Playwright to a system Chrome or Chromium.

### Roadmap

No follow-on record. `KI-HARNESS-GOV-177` stays done on its finding; `EXTRACT-PIN` is dropped and opens nothing.

## Review

### Delivered

The approved boundary: the exporter's Playwright slice replaced by Archify's headless Chrome route, the exporter tests extended, and the `ki-diagrams` prose moved from Playwright to a system Chrome or Chromium. Excluded, as the Boundary says: Archify, the viewer, the raster exports, the diagram manifest, every diagram source and `KI-HARNESS-GOV-177`. Immutable baseline `221cc5de7d1c8ff5d8166cec763850e2de56410a`. Resulting evidence: `bun run test` 1140 pass, `bunx tsc --noEmit` clean, `ki repo audit --skill ki-diagrams` PASS, three committed SVGs byte-identical through the new route (table in Verification). Delivery was opened by Kris on 2026-10-14 in the words "NEXT-181 - start now", taken as approval of the plan as this record carried it; the record went from `draft` to `awaiting-review` in one coherent change, as the work-item format allows when planning, approval and delivery land together.

### Change Summary

- `scripts/internal/chrome.ts` (new): `findChrome`, `launchArguments`, `frame`, `parseFrames`, `PipeProtocol` and `Chrome`, a port of Archify 3.0.1's `findChrome`, `chromeVisualBrowserArgs`, `PipeCdp` and `ChromeVisualBrowser` from `bin/visual-check.mjs`. Discovery order, `ARCHIFY_CHROME`, `ARCHIFY_CHROME_NO_SANDBOX` and the launch flags copied as they are; the header names the source and version. It sits under `scripts/internal/` because the `ki-skills` rubric (SCRIPT-8) reserves top-level `scripts/` for public commands.
- `scripts/export-svg.ts`: the Playwright slice (dynamic import, `chromium.launch`, `newPage`, `waitForEvent('download')`) replaced by `Chrome` plus `Browser.setDownloadBehavior` (`allowAndName`, events on), `Page.navigate`, a polled wait for `Archify.exportMenu.run`, `document.fonts.ready`, `Browser.downloadWillBegin` and the `completed` `Browser.downloadProgress`. `parseArguments`, `acceptExport`, `externalReference`, the receipt check and the fail-closed refusals are unchanged. New `locateChrome` refuses with Archify's own message; new `VERIFIED_ARCHIFY` constant (`3.0.1`) named in `--help`.
- `scripts/export-svg.test.ts`: the four existing boundary tests kept; the no-Chrome refusal added at both the function and the process boundary (`ARCHIFY_CHROME` pointing at nothing), and the help test now asserts the verified Archify release.
- `scripts/internal/chrome.test.ts` (new): `ARCHIFY_CHROME` precedence, discovery order on darwin and linux through an injected resolver, the null result, the launch flags and the `--no-sandbox` conditions, pipe framing including a partial chunk and a corrupt record. No test launches a browser.
- `SKILL.md`: `compatibility` and items 4 and 5 of "What this skill owns" reworded. `references/standards-diagrams.md`: "The SVG exporter" gains a paragraph on the route; "Without Archify or Playwright" becomes "Without Archify or a browser" with Archify's message. `references/mode-educate.md` step 6 confirms a Chrome instead of adding Playwright. `references/mode-audit.md` says "a browser". `references/sources.md` dates Archify 2026-10-14 and logs this delivery.
- Material decisions: the port, not the import, as the record's Discussion recommended, so the exporter depends on no undocumented Archify export and stays installable without the Archify skill; downloads named by GUID (`allowAndName`) after the first live run showed `allow` writes the suggested filename instead; `ARCHIFY_CHROME_NO_SANDBOX` honoured for parity with Archify.
- Deviation, within the record's own terms: the Step "the Archify version check" is met on the port route as the record's Discussion defined it for that route, a recorded and tested verified version rather than a refusal, because the port drives whatever viewer the HTML carries and pins nothing in Archify's code.

### Verification

| Gate | Outcome |
| --- | --- |
| `bun run test` | 1140 pass, 0 fail, 166 files (includes 6 new `chrome.test.ts` and 5 `export-svg.test.ts` tests) |
| `bunx tsc --noEmit` | clean |
| `ki repo audit --skill ki-diagrams` | PASS, 5/5 criteria |
| `ki repo audit --skill ki-skills` | PASS=0 WARN=1 FAIL=0; the two warnings are `ki-skills`' own LONG-3 refresh cadence, unrelated to this change |
| Biome and rumdl on touched files | clean |

Byte-for-byte re-export through the new route, Google Chrome 155.0.8059.40, Bun 1.4.2, no Playwright installed:

| Diagram | Committed SVG | Bytes | Identical |
| --- | --- | --- | --- |
| `skill-graph` | `docs/diagrams/skill-graph.svg` | 199705 | yes |
| `skill-map` | `docs/diagrams/skill-map.svg` | 217137 | yes |
| Knowledge Islands Principal `change-management-skills` | `Streams/Projects/ways-of-working/design/change-management-skills.svg` | 218873 | yes |

Each export took about one second end to end. The no-Chrome path verified live: `ARCHIFY_CHROME=/nonexistent` exits 1 with `export-svg: Chrome or Chromium is unavailable. Set ARCHIFY_CHROME to its executable path.` and leaves no profile or download directory behind.

### Outstanding concerns

None failing or unchecked. Two notes for the reviewer, neither needing a record: the exporter now spawns the browser itself, so a machine with neither Chrome nor Chromium cannot export, exactly as it could not before without Playwright's Chromium; and Chrome is still unpinned on either route, so a Chrome release can change a committed SVG, which the byte comparison at REFRESH is how one notices, unchanged from the Playwright route.

### Post-change review

Goal met: a repository that regenerates a diagram needs no package install and no cached browser, only the Chrome Archify's own gate already needs. Scope held to the Boundary; nothing in Archify, the viewer, the manifest or any source changed. Regression risk is low: the output is the viewer's own download, proven identical on three diagrams of two repositories, the refusals are unchanged and tested, and the only new runtime code is a pipe client of under three hundred lines with its framing and discovery under test. The one behavioural risk is the DevTools download events, which are Chrome's documented browser-session events and were exercised live. Ready for acceptance.

### Mini recap

Delivered the Chrome-route exporter and its tests, reworded the `ki-diagrams` prerequisite everywhere it appeared, and verified three byte-identical exports plus the full test, type and audit gates. No concern is open. Learning routes, proposed and not promoted: the diagrams manifest's `regenerate` prompts and `skill-graph.ts`'s "finalize and re-export" hint already name no tool and need no change; `ki-diagrams` REFRESH in this repository could note that Archify's `bin/visual-check.mjs` shape is now a thing to re-check against the port at each Archify release.

## Done

Accepted 2026-10-14 by Kris Brown on the review packet above, in Kris's words: "ACCEPT-181 - accept KI-HARNESS-GOV-181 as done on its review packet". The Verify gates were re-run at acceptance: `bun run test` 1142 pass, `bunx tsc --noEmit` clean, `ki repo audit --skill ki-diagrams` 5/5 criteria with no failure (two DIAG-4 freshness warnings on the skill map and skill graph, raised by later `ki-pmo` changes to traced skills, not by this record), and `docs/diagrams/skill-graph.svg` re-exported byte-identical through the Chrome route.

## Discussion

### Trial on this machine

Run read-only on 2026-10-14 with no network and no install: Google Chrome 155.0.8059.40 at `/Applications/Google Chrome.app` (no Chromium present), Archify 3.0.1 at `~/.agents/skills/archify`, against the untracked finalized HTML `+/diagrams/skill-graph/skill-graph.html`. A throwaway script imported `findChrome` and `ChromeVisualBrowser` from `bin/visual-check.mjs`, set `Browser.setDownloadBehavior` to a temporary folder with download events on, navigated to the file, waited for `Archify.exportMenu.run` and `document.fonts.ready`, ran the SVG export, and waited for `Browser.downloadProgress` to complete.

| Runtime | Receipt | Bytes | Identical to committed `docs/diagrams/skill-graph.svg` | Round trip |
| --- | --- | --- | --- | --- |
| Node 24.21.0 | format `svg`, canonical `true` | 224596 | yes | 5.8 s |
| Bun 1.4.2 | format `svg`, canonical `true` | 224596 | yes | 1.5 s |

So the route is viable here: Archify's module imports cleanly under Bun, which is what `export-svg.ts` runs on, the download arrives through the protocol with no Playwright download helper, and the file equals the reference the Playwright route produced. The trial script was not committed.

### How to reuse the route

Two options, for the plan to choose between:

- **Import Archify's module.** `export-svg.ts` resolves the installed Archify skill (the `archify` executable's real path, or an `ARCHIFY_SKILL_ROOT` override) and imports `findChrome` and `ChromeVisualBrowser` from its `bin/visual-check.mjs`. It gets Archify's Chrome discovery, flags, profile handling, pipe framing, timeouts and error text for nothing, and the exporter and the browser gate always agree on which Chrome they drive. Its costs: `ChromeVisualBrowser` is exported but documented nowhere as a public contract, so a later Archify release may rename or reshape it; the exporter gains a run-time dependency on the installed skill's location, which today only the diagram authoring step has; and the import needs the DevTools `Browser.setDownloadBehavior` call, which Archify's own gate does not make, so the download handling is ours either way.
- **Port a minimal pipe client.** Copy the shape of `findChrome`, the launch arguments and `PipeCdp` into a small TypeScript module beside the exporter, perhaps two hundred lines: find Chrome, spawn with `--remote-debugging-pipe`, frame NUL-delimited JSON on file descriptors 3 and 4, send and await, listen for an event, close. No dependency on the skill's layout or on undocumented exports; the harness owns and tests the code; the trade is a second copy of Chrome discovery that can drift from Archify's, and our own maintenance of flags that Archify tunes with each release.

The recommendation to carry into planning is the port, with Archify's discovery order and flags copied verbatim and a comment naming the source file and version, because the exporter's rationale already refuses to depend on Archify internals beyond the viewer's public `exportMenu`, and because a self-contained module keeps `ki-diagrams` installable in a repository that has the committed HTML but not the Archify skill. The import option stays open if the plan finds Archify declares the module public.

### When no Chrome is present

The exporter keeps failing closed. `findChrome` returns `null` when nothing is found, and Archify's own message is "Chrome or Chromium is unavailable. Set ARCHIFY_CHROME to its executable path." The exporter's refusal should say the same and name the override, replacing today's Playwright install hints; the standard's prerequisite line changes from "Playwright with Chromium" to "a system Google Chrome or Chromium, or `ARCHIFY_CHROME`". A repository with no browser cannot export, as now, and AUDIT still needs neither. Whether to honour `ARCHIFY_CHROME_NO_SANDBOX` for a root user, as Archify does, is a plan detail.

### Archify version pinning

The route depends on two things that move with Archify: the viewer's `exportMenu.run` and receipt attributes, which the exporter already depends on and which [KI-HARNESS-GOV-177](KI-HARNESS-GOV-177-browser-free-svg-extractor.md) found stable across the shipped examples, and, on the import option only, the exported shape of `bin/visual-check.mjs`. The port option pins nothing: it drives whatever Chrome it finds and whatever viewer is in the HTML, the same as the Playwright route. The import option should read `skill-release.json` (`version` `3.0.1` today) and refuse an untested major version with a clear message rather than fail inside Archify's code. Either way the exporter's header comment records the Archify version the route was verified against.

Chrome itself is not pinned on either option, and that is unchanged from today: the SVG's copied stylesheet follows the browser's CSS serialisation, so a Chrome release can change a committed SVG, which is the drift the Playwright route also carried. The byte test below is how that drift is noticed.

### The byte-for-byte test

Acceptance is the test [KI-HARNESS-GOV-177](KI-HARNESS-GOV-177-browser-free-svg-extractor.md) used: the new route's export of `+/diagrams/skill-graph/skill-graph.html` equals the committed `docs/diagrams/skill-graph.svg` byte for byte, and the same for Knowledge Islands Principal's `change-management-skills` diagram against its committed SVG. The trial above already passes the first on this machine. The repository test for the exporter stays at the boundary (argument parsing, refusals, receipt acceptance) and does not launch a browser; the byte comparison is a verification step in the record, run once at delivery and again at acceptance, because a browser in the test suite is what this record removes.

### Route chosen at delivery

The port. `scripts/internal/chrome.ts` copies Archify 3.0.1's discovery order, overrides and launch flags and carries its own pipe client, for the reasons the recommendation above gave: the exporter's rationale already refuses to depend on Archify internals beyond the viewer's public `exportMenu`, `ChromeVisualBrowser` is exported but documented nowhere as public, and a self-contained module keeps `ki-diagrams` installable in a repository that holds the committed HTML but not the Archify skill. The cost accepted is a second copy of Chrome discovery that can drift from Archify's; the module header names the source file and version so REFRESH can re-compare. `ARCHIFY_CHROME_NO_SANDBOX` is honoured as Archify honours it, so a root user gets the same behaviour from both tools.

One detail the trial did not surface: with `Browser.setDownloadBehavior` set to `allow`, Chrome writes the download under its suggested filename, not its GUID; `allowAndName` writes it as the GUID the `downloadWillBegin` event reports, which is what the exporter reads.

### Open questions, resolved at delivery

- The skill-graph regeneration script says only "finalize and re-export the SVG" and names no tool, so it needed no change; it does not call the exporter itself, because finalize is still an Archify step the author runs, and chaining the two is a separate choice nobody has asked for.
- `ki-diagrams` EDUCATE now tells the author to confirm a Chrome or Chromium on the exporting machine and points at `--help` for the override, instead of adding Playwright.
