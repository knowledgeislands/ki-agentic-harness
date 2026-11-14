/**
 * Purpose: The site-independent parts of an annotated design board: the board plan, the in-page region collector,
 * region codes, the overlay and its local preview.
 * Boundary: Pure functions over plain data; nothing here reads or writes a file or drives a browser.
 *
 * A board is a projection of a running interface: one artboard per view or shell state, each a screenshot with a
 * labelled box over every region worth talking about. The repository's own browser automation takes the screenshots
 * and runs the collector in the same page state; this module turns what it measured into codes (`N`, `T`, `P` and
 * `S`, with `0` for a whole shell) and draws the overlay. What a site supplies is only its plan: its pages, its shells and their
 * parts, and its own block names.
 */

/**
 * The zones an artboard marks: navigation chrome, a tray or side panel, page content, and the nested shells of an
 * onion, numbered from the outside in so that the window is always `S0`.
 */
export const ZONES = ['navigation', 'tray', 'page', 'shell'] as const
export type Zone = (typeof ZONES)[number]

/** Each zone's code prefix. */
export const ZONE_PREFIX: Record<Zone, string> = { navigation: 'N', tray: 'T', page: 'P', shell: 'S' }

/**
 * The overlay's own colour for each zone's dashed border and badge. These belong to the board, not to the interface
 * under review, and were chosen to stay distinct from each other over a light screenshot.
 */
export const ZONE_COLOUR: Record<Zone, string> = {
  navigation: '#c2410c',
  tray: '#0369a1',
  page: '#7e22ce',
  shell: '#047857'
}

/** One measured region, in screenshot pixels, as the collector returns it. */
export interface Region {
  readonly zone: Zone
  readonly label: string
  readonly x: number
  readonly y: number
  readonly w: number
  readonly h: number
  /** The box drawn around a whole shell, which takes the code `0`. */
  readonly whole?: boolean
}

/** A region with its code, clipped to its screenshot. */
export interface CodedRegion extends Region {
  readonly code: string
}

/** One part of a shell: a single landmark, or with `each` every element the selector matches. */
export interface ShellPart {
  readonly selector: string
  readonly label?: string
  readonly each?: boolean
}

/**
 * A shell, such as the navigation rail or a tray: the whole of it and its named parts. A `shell` zone is the onion of
 * nested shells: its whole is the window and its parts the shells inside it, from the outside in.
 */
export interface ShellPlan {
  readonly zone: 'navigation' | 'tray' | 'shell'
  readonly whole: string
  readonly wholeLabel?: string
  readonly parts: readonly ShellPart[]
}

/** How the collector finds page-content blocks. */
export interface PagePlan {
  /** The page's content root; the first match wins. */
  readonly root: string
  /** The block selector, such as `section, article, details, nav, form, table, figure, header, h1`. */
  readonly blocks: string
  /** Plain names for generic blocks, the first matching selector winning, as in `.eyebrow` → `Eyebrow`. */
  readonly names?: ReadonlyArray<{ readonly selector: string; readonly label: string }>
  /** Nesting levels kept: a block is kept while fewer kept blocks than this contain it. */
  readonly maxDepth?: number
  /** At most this many page regions per artboard. */
  readonly maxRegions?: number
}

/** What the collector measures. */
export interface CollectorPlan {
  readonly shells: readonly ShellPlan[]
  readonly page?: PagePlan
}

/** One artboard: which screenshot, which zones it marks, its code and title. */
export interface BoardEntry {
  /** The artboard's number, as in `0.1a` or `2.1b`. */
  readonly id: string
  readonly title: string
  /** The screenshot's key in the regions file. */
  readonly shot: string
  /** The screenshot, relative to the plan file. */
  readonly image: string
  /** The zones this artboard marks: a chrome page its own shell zone, a view page only `page`. */
  readonly zones: readonly Zone[]
}

/** A whole board plan: the collector's plan and the artboards built from its measurements. */
export interface BoardPlan {
  readonly collector: CollectorPlan
  readonly boards: readonly BoardEntry[]
}

/** The smallest box the collector keeps, in CSS pixels: anything smaller is a control, not a region. */
export const COLLECT_MIN = { w: 24, h: 14 } as const

/** The smallest box left after clipping that still gets a code and a badge. */
export const CODE_MIN = { w: 20, h: 12 } as const

/** Page labels are cut to this many characters so a badge stays on one line. */
export const LABEL_MAX = 48

/** Default page nesting depth and region count, from the first board's review: enough to name, few enough to read. */
export const PAGE_DEFAULTS = { maxDepth: 2, maxRegions: 20 } as const

/** Thrown when a board plan cannot be used, with a message that names the fault. */
export class PlanError extends Error {}

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const text = (value: unknown, where: string): string => {
  if (typeof value !== 'string' || !value.trim()) throw new PlanError(`${where} must be a non-empty string`)
  return value
}

/** Validate a parsed board plan, naming the first fault and the valid options. */
export const parsePlan = (value: unknown): BoardPlan => {
  if (!isObject(value)) throw new PlanError('the board plan must be a JSON object with `collector` and `boards`')
  const collector = value.collector
  if (!isObject(collector) || !Array.isArray(collector.shells))
    throw new PlanError('`collector.shells` must be a list of shells')
  collector.shells.forEach((shell, i) => {
    const where = `collector.shells[${i}]`
    if (!isObject(shell)) throw new PlanError(`${where} must be an object`)
    if (shell.zone !== 'navigation' && shell.zone !== 'tray' && shell.zone !== 'shell')
      throw new PlanError(`${where}.zone must be one of navigation, tray, shell`)
    text(shell.whole, `${where}.whole`)
    if (!Array.isArray(shell.parts)) throw new PlanError(`${where}.parts must be a list`)
    shell.parts.forEach((part, j) => {
      if (!isObject(part)) throw new PlanError(`${where}.parts[${j}] must be an object`)
      text(part.selector, `${where}.parts[${j}].selector`)
    })
  })
  if (collector.page !== undefined) {
    if (!isObject(collector.page)) throw new PlanError('`collector.page` must be an object')
    text(collector.page.root, 'collector.page.root')
    text(collector.page.blocks, 'collector.page.blocks')
  }
  if (!Array.isArray(value.boards) || value.boards.length === 0)
    throw new PlanError('`boards` must be a non-empty list of artboards')
  const ids = new Set<string>()
  value.boards.forEach((board, i) => {
    const where = `boards[${i}]`
    if (!isObject(board)) throw new PlanError(`${where} must be an object`)
    const id = text(board.id, `${where}.id`)
    if (!/^\d+(\.\d+)*[a-z]?$/.test(id)) throw new PlanError(`${where}.id must be a board number such as 0.1, 2.1b`)
    if (ids.has(id)) throw new PlanError(`${where}.id ${id} is used twice`)
    ids.add(id)
    for (const key of ['title', 'shot', 'image']) text(board[key], `${where}.${key}`)
    if (
      !Array.isArray(board.zones) ||
      board.zones.length === 0 ||
      !board.zones.every((zone) => ZONES.includes(zone as Zone))
    )
      throw new PlanError(`${where}.zones must list one or more of ${ZONES.join(', ')}`)
  })
  return value as unknown as BoardPlan
}

/**
 * Code the regions of one artboard. Regions outside the artboard's zones are dropped, each is clipped to the
 * screenshot, and one that is too small after clipping is skipped. A whole shell takes `<prefix>0`; every other region
 * is numbered within its zone in the order measured, which is the shell plan's order for chrome and document order for
 * page content.
 */
export const codeRegions = (
  regions: readonly Region[],
  zones: readonly Zone[],
  width: number,
  height: number
): CodedRegion[] => {
  const counts: Record<Zone, number> = { navigation: 0, tray: 0, page: 0, shell: 0 }
  const coded: CodedRegion[] = []
  for (const region of regions) {
    if (!zones.includes(region.zone)) continue
    const x = Math.max(0, region.x)
    const y = Math.max(0, region.y)
    const w = Math.min(width, region.x + region.w) - x
    const h = Math.min(height, region.y + region.h) - y
    if (w < CODE_MIN.w || h < CODE_MIN.h) continue
    const prefix = ZONE_PREFIX[region.zone]
    const code = region.whole ? `${prefix}0` : `${prefix}${++counts[region.zone]}`
    coded.push({ ...region, x, y, w, h, code })
  }
  return coded
}

const escapeHtml = (value: string): string =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

/** The legend line of one coded region, as in `P4 Due next`. */
export const legendLine = (region: CodedRegion): string => `${region.code} ${region.label}`

/**
 * The overlay for one artboard: each region its own element with `data-region` and a `title`, so a comment pinned to
 * it anchors to that region; a dashed border in its zone's colour; and a solid badge, `P4 · Due next`, at the top
 * right, so it covers no heading, or at the bottom right for a whole shell.
 */
export const overlayBoxes = (regions: readonly CodedRegion[]): string[] =>
  regions.map((region) => {
    const colour = ZONE_COLOUR[region.zone]
    const label = escapeHtml(`${region.code} · ${region.label}`)
    const corner = region.whole
      ? 'right: -1px; bottom: -1px; border-radius: 4px 0 3px 0'
      : 'right: -1px; top: -1px; border-radius: 0 3px 0 4px'
    return `<div data-region="${region.code}" title="${label}" style="position: absolute; left: ${region.x}px; top: ${region.y}px; width: ${region.w}px; height: ${region.h}px; box-sizing: border-box; border: 1.5px dashed ${colour}; border-radius: 4px"><span style="position: absolute; ${corner}; max-width: 100%; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; background: ${colour}; color: #ffffff; font: 600 11px/16px system-ui, sans-serif; padding: 0 6px; opacity: 0.94">${label}</span></div>`
  })

/** One artboard: the screenshot with its overlay layer above it, marked so a canvas can hide the layer. */
export const artboardHtml = ({
  src,
  alt,
  width,
  height,
  regions
}: {
  readonly src: string
  readonly alt: string
  readonly width: number
  readonly height: number
  readonly regions: readonly CodedRegion[]
}): string =>
  [
    `<div style="position: relative; width: ${width}px; height: ${height}px">`,
    `<img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}" style="display: block; width: ${width}px; height: ${height}px">`,
    '<div data-board-overlay style="position: absolute; inset: 0">',
    ...overlayBoxes(regions),
    '</div>',
    '</div>'
  ].join('\n')

/** A standalone page for checking locally that the boxes line up and no badge hides anything, before publishing. */
export const previewHtml = (title: string, artboard: string, stamp: string): string =>
  [
    '<!doctype html>',
    '<html lang="en">',
    '<head>',
    '<meta charset="utf-8">',
    `<title>${escapeHtml(title)}</title>`,
    '</head>',
    '<body style="margin: 0">',
    `<p style="margin: 8px; font: 12px/16px system-ui, sans-serif">${escapeHtml(`${title} · ${stamp}`)}</p>`,
    artboard,
    '</body>',
    '</html>',
    ''
  ].join('\n')

/** The width and height of a PNG, read from its header, or a `PlanError` when the bytes are not a PNG. */
export const pngSize = (bytes: Uint8Array): readonly [number, number] => {
  const signature = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]
  if (bytes.length < 24 || signature.some((byte, i) => bytes[i] !== byte)) throw new PlanError('not a PNG image')
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
  return [view.getUint32(16), view.getUint32(20)]
}

/**
 * Measure an artboard's regions. It runs inside the page, through the repository's own browser automation, in the
 * same viewport and state as the screenshot, so it is self-contained: it names nothing outside its body and takes the
 * document as an argument. Use `collectorSource` to get it as one expression.
 */
export function collectRegions(plan: CollectorPlan, doc: any = (globalThis as any).document): Region[] {
  const COLLECT = { w: 24, h: 14 }
  const LABEL = 48
  const out: Region[] = []
  const seen = new Set<any>()
  const tidy = (value: unknown): string =>
    String(value ?? '')
      .replace(/\s+/g, ' ')
      .trim()
  const cut = (value: string): string => (value.length > LABEL ? `${value.slice(0, LABEL - 2)}…` : value)
  const heading = (el: any): string => {
    if (/^(H1|H2|H3|SUMMARY)$/.test(el.tagName)) return tidy(el.textContent)
    const found = el.querySelector('h1, h2, h3, summary')
    return found ? tidy(found.textContent) : ''
  }
  const fallback = (el: any): string => {
    const first = (typeof el.className === 'string' ? el.className : '').split(' ')[0] ?? ''
    return first.replace(/[-_]/g, ' ') || String(el.tagName).toLowerCase()
  }
  const add = (el: any, zone: Zone, label: string, whole = false): boolean => {
    if (!el || seen.has(el)) return false
    const r = el.getBoundingClientRect()
    if (r.width < COLLECT.w || r.height < COLLECT.h) return false
    seen.add(el)
    const region: Region = {
      zone,
      label: cut(label),
      x: Math.round(r.left),
      y: Math.round(r.top),
      w: Math.round(r.width),
      h: Math.round(r.height)
    }
    out.push(whole ? { ...region, whole: true } : region)
    return true
  }
  const shellRoots: any[] = []
  for (const shell of plan.shells) {
    const root = doc.querySelector(shell.whole)
    if (!root) continue
    // The onion's shells hold the page, so only a rail or a tray keeps its content out of the page regions.
    if (shell.zone !== 'shell') shellRoots.push(root)
    add(root, shell.zone, shell.wholeLabel ?? `Whole ${shell.zone}`, true)
    for (const part of shell.parts) {
      const found = part.each ? [...doc.querySelectorAll(part.selector)] : [doc.querySelector(part.selector)]
      for (const el of found) {
        if (!el) continue
        const own = tidy(el.getAttribute('aria-label') || el.getAttribute('title') || heading(el))
        const label = part.each ? tidy(`${part.label ?? ''} ${own || fallback(el)}`) : part.label || own || fallback(el)
        add(el, shell.zone, label)
      }
    }
  }
  const page = plan.page
  const main = page ? doc.querySelector(page.root) : null
  if (page && main) {
    const maxDepth = page.maxDepth ?? 2
    const maxRegions = page.maxRegions ?? 20
    const kept = new Set<any>()
    const name = (el: any): string => {
      if (el.tagName === 'H1') return 'Page title'
      for (const entry of page.names ?? []) if (el.matches(entry.selector)) return entry.label
      return tidy(el.getAttribute('aria-label')) || heading(el) || fallback(el)
    }
    for (const el of main.querySelectorAll(page.blocks)) {
      if (kept.size >= maxRegions) break
      if (shellRoots.some((root) => root === el || root.contains(el))) continue
      let depth = 0
      for (let a = el.parentElement; a && a !== main; a = a.parentElement) if (kept.has(a)) depth++
      if (depth >= maxDepth) continue
      if (add(el, 'page', name(el))) kept.add(el)
    }
  }
  return out
}

/** The collector as one expression to evaluate in the page, its plan inlined, returning the measured regions. */
export const collectorSource = (plan: CollectorPlan): string =>
  `(${collectRegions.toString()})(${JSON.stringify(plan)}, document)`
