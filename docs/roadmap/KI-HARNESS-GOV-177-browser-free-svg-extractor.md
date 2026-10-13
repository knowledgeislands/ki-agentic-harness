---
id: KI-HARNESS-GOV-177
area: GOV
title: Browser-free SVG extractor
project: ways-of-working
component: governance
kind: investigate
purpose: governance
status: done
blocks: []
blocked_by: []
baseline_ref: 5ee71dc9bc012eab684c973b8957c519e691c9df
created_at: 2026-10-13T21:50:00Z
updated_at: 2026-10-13T23:15:00Z
---

# Browser-Free SVG Extractor Compared with the Viewer Export

## Goal

Decide, on evidence, whether the `ki-diagrams` SVG exporter can read a finalized Archify HTML file and produce the viewer's dual-theme SVG without a browser, so that Playwright and Chromium stop being a prerequisite of an adopting repository.

## Context

The `ki-diagrams` standard exports a diagram's SVG by driving the Archify viewer's own Export > SVG action in headless Chromium through `scripts/export-svg.ts`, which makes Playwright a development dependency of every repository that regenerates a diagram. Kris questioned the dependency on 2026-10-13 ("PLAYWRIGHT - question: why this dependency, how is playwright used?") on the ground that the SVG is already inline in the HTML and should be extractable mechanically, and decided: "PLAYWRIGHT-DEP - (a) build and compare a browser-free extractor; adopt only if output matches, else (b)." Option (b) is to keep Playwright as the adopting repository's development dependency. This record is the comparison. It was carried out against Archify 3.0.1, the version installed through Rig, with the Observatory's Playwright 1.63.0 and its cached Chromium as the reference route; no network fetch was made.

## Boundary

- In scope: a Bun-only port of the viewer's `serializeSvg(1, { theme: 'auto' })` path, namely the clone cleaning, the root attribute edits, the font inlining, the viewer-stylesheet rule selection, the dark and light variable resolution and the XML serialisation; a byte and XML-canonical comparison against the viewer export for the harness skill graph and the `ki-principal` change-management skills diagram; the finding and its consequence for the standard.
- Out of scope: any change to `ki-diagrams`, its standard or its exporter, which the decision reserves for a matching result; the raster and themed single-theme exports; Archify itself.

## Requirements

1. The port follows the viewer's steps in the viewer's order and fails closed in the same cases as `export-svg.ts`: a non-canonical clone, a non-SVG result, or an external reference.
2. The comparison covers both named diagrams and reports a match only when the files are byte-identical or identical after canonicalising XML attribute order and whitespace.
3. Any divergence is attributed to its cause, so that the owner can decide between the options on evidence rather than on a bare mismatch.

## Current state

Finding: the browser-free port does not match the viewer export, and the divergence has one cause. Everything the viewer does with the diagram's own markup is reproduced byte for byte; what it cannot reproduce is the browser's re-serialisation of the viewer stylesheet, which the viewer copies into the SVG's `<style>` element from the CSS Object Model (`rule.cssText`) rather than from the stylesheet's text. By the decision's criterion, option (b) applies: Playwright stays the adopting repository's development dependency and the standard is unchanged.

## Steps

- [x] Read the viewer's `cleanExportClone`, `serializeSvg` and `runExport('svg')` in Archify 3.0.1's `assets/template.html` and port them to a Bun script with a minimal XML DOM (no dependency).
- [x] Produce the reference exports of both diagrams through `export-svg.ts` with the Observatory's Playwright and cached Chromium; confirm each equals the SVG committed from the same HTML.
- [x] Compare the port with the references, then isolate the cause by substituting the browser's serialised stylesheet into the port.
- [x] Record the finding here; commit nothing else, as the decision directs for a mismatch.

## Files touched

- `docs/roadmap/_ISSUES.md` (identifier reservation) and this record.
- No other file. The prototype `extract-svg.ts`, the reference exports and the diffs stay in the local run state of the ways-of-working thread and are not committed, because the decision adopts the extractor only on a match.

## Verify

- `ki repo audit --skill ki-work-roadmap` reports no failure on this record.
- `ki repo audit --skill ki-diagrams` still passes, since no diagram or exporter file changed.
- `bun run test`, `bunx tsc --noEmit` and `bun skills/repo-structure/ki-repo-harness/scripts/skill-graph.ts --check` pass unchanged.

## Dependencies / blocks

- `ki-diagrams` owns the exporter and the standard's prerequisite statement; this record changes neither and closes on its finding.
- A later record may take up the third option described in Discussion if Kris chooses it.

## Documentation impact

### Decision Records

None: the tool choice stays recorded in the Diagrams standard, and the exporter's rationale already states that a serialiser of our own would drift from Archify's; this record supplies the measured evidence for that statement.

### Specifications

None: no behaviour changes.

### Guides

None: the standard's "Without Archify or Playwright" section remains accurate.

### Roadmap

No follow-on record unless Kris chooses the pinned-stylesheet option in Discussion, which would be a `deliver` record against `ki-diagrams`.

## Review

### Delivered

The approved boundary was delivered in full: the port, the two reference exports, the byte comparison with its cause isolated, and the finding. The exclusions held: no file under `skills/governance/ki-diagrams/` changed, and no package was installed. Baseline `5ee71dc9bc012eab684c973b8957c519e691c9df` (the identifier reservation). Authority is Kris's decision of 2026-10-13: "PLAYWRIGHT-DEP - (a) build and compare a browser-free extractor; adopt only if output matches, else (b)."

### Change Summary

Files are listed under Files touched. Material decisions: the comparison treats a difference inside the `<style>` text as a mismatch, because XML canonicalisation does not reach CSS text; the port's stylesheet step reproduces the viewer's rule selection exactly (the same 211 top-level rules, 16 of them `@keyframes`) and normalises whitespace, quoting and keyframe selectors, but deliberately does not reimplement Chromium's value serialisation, since that would be the drifting serialiser the exporter's rationale warns against. Approved deviation from the record as captured: none.

### Verification

Run on 2026-10-13 against baseline `5ee71dc9bc012eab684c973b8957c519e691c9df`:

- Reference exports: `export-svg.ts` with `NODE_PATH` set to the Observatory's `node_modules` produced `skill-graph.svg` (224596 bytes) and `change-management-skills.svg` (218873 bytes), each byte-identical to the SVG committed from the same HTML.
- Port versus reference: both diagrams differ, first at byte 103930, inside the `<style>` element; 37 of the 211 copied stylesheet rules differ, 74 diff lines in total, and nothing outside the stylesheet differs.
- Port with the browser's serialised stylesheet substituted: byte-identical to the reference for both diagrams.
- The viewer stylesheet is identical across the two diagrams and Archify's five shipped examples of all five types, so the stylesheet step is a constant of the Archify release, not of the diagram.
- `ki repo audit --skill ki-work-roadmap`, `ki repo audit --skill ki-diagrams`, `bun run test`, `bunx tsc --noEmit` and the skill-graph sync check: recorded in the thread report at commit time.

### Outstanding concerns

None on the finding. The prototype has no test file because it is not adopted; the byte comparison against two browser exports was its verification.

### Post-change review

The finding is reproducible from the committed exporter, the untracked finalized HTML under `+/diagrams/` and a browser; nothing in the repository changed behaviour. Ready for acceptance as an investigation closed on its finding.

### Mini recap

Built a browser-free port of the Archify viewer's SVG export and compared it with the viewer's own export for two diagrams. The diagram markup, cleaning, fonts, theme variables and XML serialisation match byte for byte; the copied viewer stylesheet does not, because the viewer takes it from the browser's CSS Object Model. By the decision's criterion option (b) applies. Learning route, not promoted: a pinned, browser-verified stylesheet block per Archify release would make the extractor byte-exact without a browser at export time; see Discussion.

## Done

Accepted 2026-10-13 by Kris Brown on the review packet above, in words that reached the `ways-of-working` thread with stop words stripped, quoted as received: "ACCEPT-177 - accept KI-HARNESS-GOV-177 through ki-accept." The Verify checks were re-run at acceptance and passed. The pinned-stylesheet follow-on is held with Kris as `EXPORT-ROUTE`, because Archify's own browser gate already drives system Chrome headless over CDP, so the exporter could reuse it without Playwright.

## Discussion

### What the viewer export is

The viewer's SVG export is not the inline SVG. `serializeSvg` clones `.diagram-container svg`, strips viewer state, sets `width` and `height` from the viewBox, inlines the `#archify-fonts` stylesheet, copies every top-level viewer stylesheet rule whose selector list begins with `svg`, `:root`, `[data-theme`, `[data-preset`, `.c-`, `.t-`, `.a-` or `.m-` and every `@keyframes archify-*` rule, resolves the full variable set for the dark and light themes through an off-DOM probe, prepends a `rect.c-bg-rect` and the `<style>`, and serialises with `XMLSerializer`. The committed SVG is about 225 KB, of which about 134 KB is the `<style>` element and about 90 KB the diagram.

### What matched

With the browser's serialised stylesheet substituted for the port's, the output is byte-identical for both diagrams. That verifies the port of: the clone cleaning list, including the `data-detail` and `data-detail-anchor` attributes that are present in the static markup; the root `style` attribute (`width`, `height`, `min-width: 0px`) and its position before `width`, `height` and `xmlns`, which follows from the viewer having set a view transform at boot; the background rectangle; the font stylesheet and its XML escaping; the fixed font-family rule; the 33 theme variables in both themes, resolved by a small cascade over the probe's matching rules and the document element's inherited ones; and Chromium's `XMLSerializer` conventions (self-closing empty elements without a space, text escaping of `&`, `<` and `>`).

### What diverged, and why

Every difference is Chromium's `cssText` re-serialisation of a rule's values, which the viewer reads from `document.styleSheets` rather than from the source text. The 37 differing rules fall into these forms, each quoted as source then as Chromium:

- string quoting: `'JetBrains Mono'` becomes `"JetBrains Mono"`;
- unit on zero lengths: `translateY(0)` becomes `translateY(0px)`, `translate(-50%, 0)` becomes `translate(-50%, 0px)`;
- colour canonicalisation: `#3b4a63` becomes `rgb(59, 74, 99)`, `#fff` becomes `rgb(255, 255, 255)`, `currentColor` becomes `currentcolor`;
- shorthand reordering: `box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4)` becomes `rgba(0, 0, 0, 0.4) 0px 1px 3px`, `drop-shadow(0 0 5px currentColor)` becomes `drop-shadow(currentcolor 0px 0px 5px)`, `background: radial-gradient(...) 0 0 / 5px 5px, #fff` becomes `... 0px 0px / 5px 5px, rgb(255, 255, 255)`;
- default components dropped: `transition: stroke 150ms ease` becomes `stroke 150ms`;
- list separators: `stroke-dasharray: 5,5` and `3 2` become `5, 5` and `3, 2`;
- property aliasing: `-webkit-mask-image` becomes `mask-image`.

Reproducing these needs a property-grammar-aware CSS serialiser that tracks Chromium's, and the reference moves with Chromium as well as with Archify (the `mask-image` alias is a Chromium change, not an Archify one). That is the serialiser of our own the exporter's rationale rejects, so the port stops short of it.

### A third option, for the owner

Because the copied stylesheet is a constant of the Archify release, the port becomes byte-exact if it carries the browser's serialised stylesheet block (about 34 KB) as a fixture pinned to the Archify version, refuses any other version, and the fixture is regenerated and verified through `export-svg.ts` once per Archify release, for which the Observatory's Playwright route suffices. That removes Playwright from every adopting repository and from routine exports at the cost of one browser-derived fixture in the harness, and it also stops committed SVGs drifting with Chromium releases. It is outside the (a) or (b) choice already made and is offered as a query, not taken.
