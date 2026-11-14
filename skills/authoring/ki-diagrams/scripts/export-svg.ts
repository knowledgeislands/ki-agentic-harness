#!/usr/bin/env bun
/**
 * Purpose: Export the dual-theme SVG of a finalized Archify diagram through its viewer, or a static flattened form.
 * Run: bun scripts/export-svg.ts --help
 * Boundary: Reads one finalized Archify HTML file and writes one SVG; needs a system Google Chrome or Chromium,
 * launched headless against the local file only, and never edits a diagram source.
 *
 * Usage: bun scripts/export-svg.ts [--form dual|light|ki|ki-night] <input.html> <output.svg>
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
 *
 * `--form` chooses what is written. `dual`, the default, is the viewer's file as it is. The static forms, `light`
 * under Archify's light theme, `ki` under the `ki-design` day palette and `ki-night` under its night palette, flatten
 * that same canonical file in Chrome: every computed fill, stroke, opacity and text style is written as a plain
 * attribute, colours as hex, the font becomes a system monospace stack, and the stylesheet, custom properties, font
 * data and animation are dropped, so any previewer, `rsvg-convert` included, renders it as the viewer shows it. The
 * `ki` forms also draw each node icon whose meaning a KI symbol carries with that symbol's glyph. A flattened file that
 * still carries a stylesheet, a `var(` or a font face is refused.
 */

import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { Chrome, findChrome, NO_CHROME } from './internal/chrome.ts'
import { KI_GLYPH_GRID, kiGlyphBodies } from './internal/ki-design-glyphs.ts'
import { kiMonoStack, kiThemeVariables } from './internal/ki-design-tokens.ts'

const USAGE = 'usage: bun scripts/export-svg.ts [--form dual|light|ki|ki-night] <input.html> <output.svg>'

/** The committed SVG forms: the viewer's dual-theme file, or one flattened static palette. */
export const SVG_FORMS = ['dual', 'light', 'ki', 'ki-night'] as const
export type SvgForm = (typeof SVG_FORMS)[number]

/** Archify's system fallback stack, without the web font the static forms cannot carry. */
const SYSTEM_MONO = 'ui-monospace, SFMono-Regular, Menlo, Consolas, "DejaVu Sans Mono", "Liberation Mono", monospace'

/** The Archify release whose viewer and browser route this exporter was verified against, byte for byte. */
export const VERIFIED_ARCHIFY = '3.0.1'

/** An `href` or `url()` that leaves the file: anything but a fragment or an inline `data:` URI. */
const EXTERNAL = /(?:href\s*=\s*["']|url\(\s*["']?)(?!#|data:)[^"')\s]/i

/** A reason the export was not written, reported as one line rather than a stack. */
export class Refusal extends Error {}

/** Whether `value` names one of the committed SVG forms. */
export const isSvgForm = (value: unknown): value is SvgForm => SVG_FORMS.includes(value as SvgForm)

/** The input HTML, output SVG and form named on the command line, or a refusal with the usage line. */
export const parseArguments = (
  argv: readonly string[]
): { readonly source: string; readonly target: string; readonly form: SvgForm } => {
  const positional: string[] = []
  let form: SvgForm = 'dual'
  for (let index = 0; index < argv.length; index++) {
    const arg = argv[index] as string
    if (arg !== '--form') {
      positional.push(arg)
      continue
    }
    const value = argv[++index]
    if (!isSvgForm(value)) throw new Refusal(`--form must be one of ${SVG_FORMS.join(', ')}: ${value ?? ''}`)
    form = value
  }
  const [input, output, ...rest] = positional
  if (!input || !output || rest.length > 0) throw new Refusal(USAGE)
  if (!input.endsWith('.html')) throw new Refusal(`the input must be a finalized Archify HTML file: ${input}`)
  if (!output.endsWith('.svg')) throw new Refusal(`the output must be an .svg file: ${output}`)
  return { source: resolve(input), target: resolve(output), form }
}

/** The first reference that leaves the file, or `undefined` when the SVG is self-contained. */
export const externalReference = (svg: string): string | undefined => svg.match(EXTERNAL)?.[0]

/** The first stylesheet, custom property or font face left in a flattened SVG, or `undefined` when it is static. */
export const dynamicStyle = (svg: string): string | undefined => svg.match(/<style|var\(|@font-face/)?.[0]

/** Refuse a flattened SVG that still depends on CSS or carries a reference out of the file. */
export const acceptFlattened = (svg: string, form: SvgForm): string => {
  if (!svg.includes('<svg')) throw new Refusal(`the ${form} flattening did not return an SVG`)
  const dynamic = dynamicStyle(svg)
  if (dynamic) throw new Refusal(`the ${form} SVG still carries ${dynamic}`)
  const external = externalReference(svg)
  if (external) throw new Refusal(`the ${form} SVG carries an external reference: ${external}`)
  return svg
}

/** The Archify theme, variable overrides, font stack and node-icon glyphs each static form is flattened under. */
export const flatteningFor = (
  form: Exclude<SvgForm, 'dual'>
): {
  readonly theme: 'light' | 'dark'
  readonly variables: Record<string, string>
  readonly font: string
  readonly glyphs: Record<string, string>
  readonly glyphScale: number
} => {
  const glyphScale = 16 / KI_GLYPH_GRID
  if (form === 'light') return { theme: 'light', variables: {}, font: SYSTEM_MONO, glyphs: {}, glyphScale }
  const theme = form === 'ki' ? 'light' : 'dark'
  const variables = kiThemeVariables(form === 'ki' ? 'light' : 'night')
  return { theme, variables, font: kiMonoStack(), glyphs: kiGlyphBodies(), glyphScale }
}

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

/**
 * The page-side flattening, run in Chrome on the exported SVG opened as its own document. It pins the theme, stops
 * animation, applies the variable overrides, swaps each mapped node icon's body for its KI glyph, scaling its group
 * from the glyph's grid to Archify's, reads every element's computed paint and text style, and writes each as
 * a presentation attribute where it differs from what the element would otherwise inherit or default to. Colours are
 * resolved through a canvas pixel to hex plus an opacity, so `color-mix()` and any colour space come out as plain
 * sRGB. It then removes every stylesheet, `style` and `class` attribute and returns the serialised document.
 */
const FLATTEN = `(({ theme, variables, font, glyphs, glyphScale }) => {
  const NS = 'http://www.w3.org/2000/svg'
  const svg = document.documentElement
  svg.setAttribute('data-theme', theme)
  svg.removeAttribute('data-animation')
  const still = document.createElementNS(NS, 'style')
  still.textContent = '*, *::before, *::after { animation: none !important; transition: none !important; }'
  svg.appendChild(still)
  for (const [name, value] of Object.entries(variables)) svg.style.setProperty(name, value)
  for (const sigil of svg.querySelectorAll('[data-semantic-sigil]')) {
    const body = glyphs[sigil.getAttribute('data-semantic-sigil')]
    if (!body) continue
    const glyph = new DOMParser().parseFromString('<svg xmlns="' + NS + '">' + body + '</svg>', 'image/svg+xml')
    sigil.replaceChildren(...[...glyph.documentElement.children].map((shape) => document.importNode(shape, true)))
    const transform = sigil.getAttribute('transform') || ''
    const scale = Number(transform.match(/scale\\(([^)]*)\\)/)?.[1] ?? '1')
    sigil.setAttribute('transform', transform.replace(/\\s*scale\\([^)]*\\)/, '') + ' scale(' + scale * glyphScale + ')')
  }

  const pixel = new OffscreenCanvas(1, 1).getContext('2d', { willReadFrequently: true })
  const colours = new Map()
  const colour = (value) => {
    if (!colours.has(value)) {
      pixel.clearRect(0, 0, 1, 1)
      pixel.fillStyle = '#000'
      pixel.fillStyle = value
      pixel.fillRect(0, 0, 1, 1)
      const [r, g, b, a] = pixel.getImageData(0, 0, 1, 1).data
      const hex = '#' + [r, g, b].map((part) => part.toString(16).padStart(2, '0')).join('')
      colours.set(value, { hex, alpha: a / 255 })
    }
    return colours.get(value)
  }
  const reference = (value) => value.match(/url\\(\\s*["']?(#[^"')\\s]+)/)?.[1]

  const INHERITED = ['fill', 'fill-opacity', 'stroke', 'stroke-opacity', 'stroke-width', 'stroke-dasharray',
    'stroke-dashoffset', 'stroke-linecap', 'stroke-linejoin', 'font-size', 'font-weight', 'font-style',
    'text-anchor', 'dominant-baseline', 'letter-spacing', 'visibility', 'marker-start', 'marker-mid', 'marker-end']
  const OWN = { opacity: '1', 'stop-color': '#000000', 'stop-opacity': '1', filter: 'none', mask: 'none',
    'clip-path': 'none', 'vector-effect': 'none' }
  const DEFAULTS = { fill: 'rgb(0, 0, 0)', 'fill-opacity': '1', stroke: 'none', 'stroke-opacity': '1',
    'stroke-width': '1px', 'stroke-dasharray': 'none', 'stroke-dashoffset': '0px', 'stroke-linecap': 'butt',
    'stroke-linejoin': 'miter', 'font-size': '16px', 'font-weight': '400', 'font-style': 'normal',
    'text-anchor': 'start', 'dominant-baseline': 'auto', 'letter-spacing': 'normal', visibility: 'visible',
    'marker-start': 'none', 'marker-mid': 'none', 'marker-end': 'none' }

  const read = (element) => {
    const style = getComputedStyle(element)
    const values = {}
    for (const name of [...INHERITED, ...Object.keys(OWN)]) values[name] = style.getPropertyValue(name).trim()
    for (const [paint, opacity] of [['fill', 'fill-opacity'], ['stroke', 'stroke-opacity'], ['stop-color', 'stop-opacity']]) {
      const value = values[paint]
      if (!value || value === 'none' || value.startsWith('context-')) continue
      const url = reference(value)
      if (url) { values[paint] = 'url(' + url + ')'; continue }
      const { hex, alpha } = colour(value)
      values[paint] = hex
      const combined = Number(values[opacity] || '1') * alpha
      values[opacity] = String(Math.round(combined * 1000) / 1000)
    }
    for (const name of ['filter', 'mask', 'clip-path', 'marker-start', 'marker-mid', 'marker-end']) {
      const url = reference(values[name])
      values[name] = url ? 'url(' + url + ')' : 'none'
    }
    return { display: style.display, values }
  }

  const elements = [svg, ...svg.querySelectorAll('*')].filter((element) => element !== still)
  const computed = new Map(elements.map((element) => [element, read(element)]))
  const hidden = []
  for (const element of elements) {
    const { display, values } = computed.get(element)
    if (display === 'none' && !element.closest('defs')) { hidden.push(element); continue }
    const parent = element === svg ? undefined : computed.get(element.parentElement)
    for (const name of INHERITED) {
      const value = values[name]
      const inherited = parent ? parent.values[name] : DEFAULTS[name]
      if (value && value !== inherited) element.setAttribute(name, value)
    }
    for (const [name, initial] of Object.entries(OWN)) {
      const value = values[name]
      if (value && value !== initial) element.setAttribute(name, value)
    }
  }
  for (const element of hidden) element.remove()
  for (const element of [...svg.querySelectorAll('style')]) element.remove()
  for (const element of [svg, ...svg.querySelectorAll('*')]) {
    element.removeAttribute('style')
    element.removeAttribute('class')
  }
  svg.setAttribute('font-family', font)
  return '<?xml version="1.0" encoding="UTF-8"?>\\n' + new XMLSerializer().serializeToString(svg)
})`

/** Open the canonical SVG at `file` as its own document in Chrome and return it flattened under `form`. */
const flattenSvg = async (chrome: Chrome, file: string, form: Exclude<SvgForm, 'dual'>): Promise<string> => {
  const session = await chrome.session
  const loaded = chrome.protocol.waitFor('Page.loadEventFired', session)
  loaded.catch(() => {})
  const navigation = await chrome.protocol.send('Page.navigate', { url: pathToFileURL(file).href }, session)
  if (navigation.errorText) throw new Refusal(`Chrome could not open the exported SVG: ${navigation.errorText}`)
  await loaded
  const svg = await chrome.evaluate<string>(`${FLATTEN}(${JSON.stringify(flatteningFor(form))})`)
  return acceptFlattened(svg, form)
}

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
--form light, ki or ki-night flattens that export into a static SVG under Archify's light theme or the
ki-design day or night palette, with no stylesheet, custom properties or embedded fonts; the ki forms also draw
node icons a KI symbol carries with its glyph. dual is the default.
Needs a system Google Chrome or Chromium, the browser Archify's own browser gate drives; set ARCHIFY_CHROME to
choose the executable. Verified against Archify ${VERIFIED_ARCHIFY}.`

/** Whether the command line asks for help rather than an export. */
export const wantsHelp = (argv: readonly string[]): boolean => argv.some((arg) => arg === '-h' || arg === '--help')

const main = async (argv: readonly string[]): Promise<void> => {
  if (wantsHelp(argv)) {
    console.log(HELP)
    return
  }
  const { source, target, form } = parseArguments(argv)
  if (!(await Bun.file(source).exists())) throw new Refusal(`no such file: ${source}`)

  const chromePath = locateChrome()
  const downloads = await mkdtemp(join(tmpdir(), 'ki-diagrams-export-'))
  const chrome = new Chrome(chromePath)
  try {
    const dual = await exportSvg(chrome, source, downloads)
    let svg = dual
    if (form !== 'dual') {
      const canonical = join(downloads, 'canonical.svg')
      await writeFile(canonical, dual)
      svg = await flattenSvg(chrome, canonical, form)
    }
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
