#!/usr/bin/env bun
/**
 * Purpose: Export the dual-theme SVG of a finalized Archify diagram through its viewer.
 * Run: bun scripts/export-svg.ts --help
 * Boundary: Reads one finalized Archify HTML file and writes one SVG; needs the optional Playwright and
 * Chromium, launched headless against the local file only, and never edits a diagram source.
 *
 * Usage: bun scripts/export-svg.ts <input.html> <output.svg>
 *
 * The dual-theme SVG a finalized Archify diagram's viewer exports, written without opening the viewer by hand.
 *
 * Archify's command line renders, checks, and finalizes the HTML but has no SVG export: that lives only in the
 * viewer's Export menu. This opens the HTML in headless Chromium and calls `Archify.exportMenu.run('svg')`, the
 * function the menu's SVG item calls, and keeps the file the viewer downloads byte for byte: viewer state stripped,
 * fonts inlined, dark by default and light under `prefers-color-scheme: light`. A serializer of our own would drift
 * from Archify's at its next release; driving the viewer cannot.
 *
 * The export fails closed. Playwright is an optional prerequisite imported only when an export runs, so its absence
 * stops the export with an install hint. The viewer records whether its clone came out free of viewer state, and an
 * export it does not call canonical, or one that carries an external reference, is refused rather than written.
 */

import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const USAGE = 'usage: bun scripts/export-svg.ts <input.html> <output.svg>'
const INSTALL_PLAYWRIGHT = 'bun add --dev playwright && bunx playwright install chromium'
const INSTALL_CHROMIUM = 'bunx playwright install chromium'

/** How long the viewer may take to boot or serialize before the export is abandoned. */
const TIMEOUT = 30_000

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

/** The slice of Playwright this script drives, declared here because Playwright is not a harness dependency. */
interface Download {
  path(): Promise<string>
  suggestedFilename(): string
}
interface Page {
  setDefaultTimeout(timeout: number): void
  goto(url: string): Promise<unknown>
  waitForFunction(predicate: () => boolean): Promise<unknown>
  waitForEvent(event: 'download'): Promise<Download>
  evaluate<Result>(callback: () => Result | Promise<Result>): Promise<Result>
}
interface Browser {
  newPage(options: { acceptDownloads: boolean }): Promise<Page>
  close(): Promise<void>
}
interface Playwright {
  chromium: { launch(): Promise<Browser> }
}

/** The page globals the callbacks read inside Chromium. Playwright serialises each callback, so it may name only page globals, never a closure. */
interface Viewer {
  Archify?: { exportMenu?: { run: (format: string) => Promise<void> } }
  document: {
    fonts: { ready: Promise<unknown> }
    documentElement: { getAttribute(name: string): string | null }
  }
}

const loadPlaywright = async (): Promise<Playwright> => {
  const specifier = 'playwright'
  try {
    return (await import(specifier)) as Playwright
  } catch {
    throw new Refusal(`Playwright is not installed; run \`${INSTALL_PLAYWRIGHT}\` in the repository`)
  }
}

const launch = (playwright: Playwright): Promise<Browser> =>
  playwright.chromium.launch().catch((error: unknown) => {
    const reason = error instanceof Error ? error.message.split('\n')[0] : String(error)
    throw new Refusal(`Chromium did not start (${reason}); run \`${INSTALL_CHROMIUM}\``)
  })

/** Open `source` in the viewer, run its SVG export, and return the downloaded file's text. */
const exportSvg = async (browser: Browser, source: string): Promise<string> => {
  const page = await browser.newPage({ acceptDownloads: true })
  page.setDefaultTimeout(TIMEOUT)
  await page.goto(pathToFileURL(source).href)
  await page.waitForFunction(() => typeof (globalThis as unknown as Viewer).Archify?.exportMenu?.run === 'function')
  // The export inlines the page's font faces, so wait for them as a reader's click would.
  await page.evaluate(() => (globalThis as unknown as Viewer).document.fonts.ready.then(() => undefined))

  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.evaluate(() => (globalThis as unknown as Viewer).Archify?.exportMenu?.run('svg'))
  ])
  const receipt = await page.evaluate(() => ({
    format: (globalThis as unknown as Viewer).document.documentElement.getAttribute('data-last-export-format'),
    canonical: (globalThis as unknown as Viewer).document.documentElement.getAttribute('data-last-export-canonical')
  }))
  return acceptExport(receipt, await Bun.file(await download.path()).text(), download.suggestedFilename())
}

const HELP = `${USAGE}

Export the dual-theme SVG of a finalized Archify diagram through the viewer's own Export > SVG action.
Needs Playwright and Chromium: ${INSTALL_PLAYWRIGHT}`

/** Whether the command line asks for help rather than an export. */
export const wantsHelp = (argv: readonly string[]): boolean => argv.some((arg) => arg === '-h' || arg === '--help')

const main = async (argv: readonly string[]): Promise<void> => {
  if (wantsHelp(argv)) {
    console.log(HELP)
    return
  }
  const { source, target } = parseArguments(argv)
  if (!(await Bun.file(source).exists())) throw new Refusal(`no such file: ${source}`)

  const browser = await launch(await loadPlaywright())
  try {
    const svg = await exportSvg(browser, source)
    await mkdir(dirname(target), { recursive: true })
    await writeFile(target, svg)
    console.log(`${target} (${Buffer.byteLength(svg)} bytes)`)
  } finally {
    await browser.close()
  }
}

if (import.meta.main)
  await main(process.argv.slice(2)).catch((error: unknown) => {
    if (!(error instanceof Refusal)) throw error
    console.error(`export-svg: ${error.message}`)
    process.exitCode = 1
  })
