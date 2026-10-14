#!/usr/bin/env bun
/**
 * Purpose: Export the dual-theme SVG of a finalized Archify diagram through its viewer.
 * Run: bun scripts/export-svg.ts --help
 * Boundary: Reads one finalized Archify HTML file and writes one SVG; needs a system Google Chrome or Chromium,
 * launched headless against the local file only, and never edits a diagram source.
 *
 * Usage: bun scripts/export-svg.ts <input.html> <output.svg>
 *
 * The dual-theme SVG a finalized Archify diagram's viewer exports, written without opening the viewer by hand.
 *
 * Archify's command line renders, checks, and finalizes the HTML but has no SVG export: that lives only in the
 * viewer's Export menu. This opens the HTML in headless Chrome and calls `Archify.exportMenu.run('svg')`, the
 * function the menu's SVG item calls, and keeps the file the viewer downloads byte for byte: viewer state stripped,
 * fonts inlined, dark by default and light under `prefers-color-scheme: light`. A serializer of our own would drift
 * from Archify's at its next release; driving the viewer cannot.
 *
 * The browser is the same one Archify's own browser gate drives, found and launched the same way (see
 * `internal/chrome.ts`, verified against Archify 3.0.1), so a repository that can finalize a diagram can also export
 * it, with no Playwright and no cached Chromium. The export fails closed. Without a Chrome or Chromium it stops with
 * Archify's own message and the `ARCHIFY_CHROME` override. The viewer records whether its clone came out free of
 * viewer state, and an export it does not call canonical, or one that carries an external reference, is refused
 * rather than written.
 */

import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { Chrome, findChrome, NO_CHROME } from './internal/chrome.ts'

const USAGE = 'usage: bun scripts/export-svg.ts <input.html> <output.svg>'

/** The Archify release whose viewer and browser route this exporter was verified against, byte for byte. */
export const VERIFIED_ARCHIFY = '3.0.1'

/** An `href` or `url()` that leaves the file: anything but a fragment or an inline `data:` URI. */
const EXTERNAL = /(?:href\s*=\s*["']|url\(\s*["']?)(?!#|data:)[^"')\s]/i

/** A reason the export was not written, reported as one line rather than a stack. */
export class Refusal extends Error {}

/** The input HTML and output SVG named on the command line, or a refusal with the usage line. */
export const parseArguments = (argv: readonly string[]): { readonly source: string; readonly target: string } => {
  const [input, output, ...rest] = argv
  if (!input || !output || rest.length > 0) throw new Refusal(USAGE)
  if (!input.endsWith('.html')) throw new Refusal(`the input must be a finalized Archify HTML file: ${input}`)
  if (!output.endsWith('.svg')) throw new Refusal(`the output must be an .svg file: ${output}`)
  return { source: resolve(input), target: resolve(output) }
}

/** The first reference that leaves the file, or `undefined` when the SVG is self-contained. */
export const externalReference = (svg: string): string | undefined => svg.match(EXTERNAL)?.[0]

/** Refuse a download the viewer did not call a canonical SVG, or one that is not self-contained. */
export const acceptExport = (
  receipt: { readonly format: string | null; readonly canonical: string | null },
  svg: string,
  filename: string
): string => {
  if (receipt.format !== 'svg' || receipt.canonical !== 'true')
    throw new Refusal(`the viewer did not report a canonical SVG export (${JSON.stringify(receipt)})`)
  if (!svg.includes('<svg')) throw new Refusal(`the download ${filename} is not an SVG`)
  const external = externalReference(svg)
  if (external) throw new Refusal(`the SVG carries an external reference: ${external}`)
  return svg
}

/** The browser to launch, or the refusal Archify's own gate would give; `env` is injectable for the tests. */
export const locateChrome = (env: NodeJS.ProcessEnv = process.env): string => {
  const chrome = findChrome({ env })
  if (!chrome) throw new Refusal(NO_CHROME)
  return chrome
}

/** The page-side wait for the viewer's export function, polled until it exists or the protocol timeout ends it. */
const VIEWER_READY = `new Promise((ready) => {
  const poll = () => {
    if (typeof globalThis.Archify?.exportMenu?.run === 'function') ready(true)
    else setTimeout(poll, 50)
  }
  poll()
})`

/** The export inlines the page's font faces, so wait for them as a reader's click would. */
const FONTS_READY = 'document.fonts.ready.then(() => true)'

const RUN_EXPORT = "Archify.exportMenu.run('svg').then(() => true)"

const RECEIPT = `({
  format: document.documentElement.getAttribute('data-last-export-format'),
  canonical: document.documentElement.getAttribute('data-last-export-canonical')
})`

/** Open `source` in the viewer, run its SVG export, and return the downloaded file's text. */
const exportSvg = async (chrome: Chrome, source: string, downloads: string): Promise<string> => {
  const session = await chrome.session
  // Chrome writes each download to `downloads/<guid>` and reports its progress on the browser session.
  await chrome.protocol.send('Browser.setDownloadBehavior', {
    behavior: 'allowAndName',
    downloadPath: downloads,
    eventsEnabled: true
  })

  const loaded = chrome.protocol.waitFor('Page.loadEventFired', session)
  loaded.catch(() => {})
  const navigation = await chrome.protocol.send('Page.navigate', { url: pathToFileURL(source).href }, session)
  if (navigation.errorText) throw new Refusal(`Chrome could not open ${source}: ${navigation.errorText}`)
  await loaded
  await chrome.evaluate(VIEWER_READY)
  await chrome.evaluate(FONTS_READY)

  const began = chrome.protocol.waitFor('Browser.downloadWillBegin')
  began.catch(() => {})
  const finished = chrome.protocol.waitFor(
    'Browser.downloadProgress',
    undefined,
    (params) => params.state === 'completed' || params.state === 'canceled'
  )
  finished.catch(() => {})
  await chrome.evaluate(RUN_EXPORT)
  const { guid, suggestedFilename } = (await began) as { guid: string; suggestedFilename: string }
  const { state } = (await finished) as { state: string }
  if (state !== 'completed') throw new Refusal(`the viewer's download of ${suggestedFilename} was ${state}`)

  const receipt = await chrome.evaluate<{ format: string | null; canonical: string | null }>(RECEIPT)
  const download = Bun.file(join(downloads, guid))
  if (!(await download.exists())) throw new Refusal(`the viewer's download of ${suggestedFilename} was not written`)
  return acceptExport(receipt, await download.text(), suggestedFilename)
}

const HELP = `${USAGE}

Export the dual-theme SVG of a finalized Archify diagram through the viewer's own Export > SVG action.
Needs a system Google Chrome or Chromium, the browser Archify's own browser gate drives; set ARCHIFY_CHROME to
choose the executable. Verified against Archify ${VERIFIED_ARCHIFY}.`

/** Whether the command line asks for help rather than an export. */
export const wantsHelp = (argv: readonly string[]): boolean => argv.some((arg) => arg === '-h' || arg === '--help')

const main = async (argv: readonly string[]): Promise<void> => {
  if (wantsHelp(argv)) {
    console.log(HELP)
    return
  }
  const { source, target } = parseArguments(argv)
  if (!(await Bun.file(source).exists())) throw new Refusal(`no such file: ${source}`)

  const chromePath = locateChrome()
  const downloads = await mkdtemp(join(tmpdir(), 'ki-diagrams-export-'))
  const chrome = new Chrome(chromePath)
  try {
    const svg = await exportSvg(chrome, source, downloads)
    await mkdir(dirname(target), { recursive: true })
    await writeFile(target, svg)
    console.log(`${target} (${Buffer.byteLength(svg)} bytes)`)
  } finally {
    await chrome.close()
    await rm(downloads, { recursive: true, force: true })
  }
}

if (import.meta.main)
  await main(process.argv.slice(2)).catch((error: unknown) => {
    if (!(error instanceof Refusal)) throw error
    console.error(`export-svg: ${error.message}`)
    process.exitCode = 1
  })
