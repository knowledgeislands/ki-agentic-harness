---
id: KI-HARNESS-GOV-181
area: GOV
title: Chrome-route SVG export
project: ways-of-working
component: governance
kind: deliver
purpose: capability
horizon: next
status: draft
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-10-14T00:05:43Z
updated_at: 2026-10-14T01:00:40Z
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

### Open questions

- Whether the skill-graph regeneration script, which today tells the author to run `export-svg.ts`, should call the new route itself once no Playwright is needed.
- Whether `ki-diagrams` EDUCATE should detect Chrome and say so, rather than instruct a Playwright install that is no longer wanted.
