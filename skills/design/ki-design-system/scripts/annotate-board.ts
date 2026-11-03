#!/usr/bin/env bun
/**
 * Purpose: Build an annotated design board's region overlays from a board plan, its screenshots and the regions
 * measured in the page, or print the in-page collector that measures them.
 * Run: bun scripts/annotate-board.ts --help
 * Boundary: `collector` only prints. `annotate` reads the plan, the regions file and the screenshots the plan names,
 * and writes only `board.json` and `preview/<id>.html` under the output directory it is given; it drives no browser
 * and publishes nothing.
 *
 * Usage:
 *   bun scripts/annotate-board.ts collector <plan.json>
 *   bun scripts/annotate-board.ts annotate <plan.json> <regions.json> <out-dir> --revision <rev> [--date <YYYY-MM-DD>]
 *
 * The method is in `references/standards-annotated-board.md`. The repository's own browser automation takes each screenshot,
 * then evaluates the `collector` expression in the same viewport and state and saves the result in a regions file, an
 * object keyed by each plan entry's `shot`. `annotate` then codes each artboard's regions, writes `board.json` with
 * every artboard's size, coded regions and legend, stamped with the source revision and date, and a local preview of
 * each artboard for checking that the boxes line up before the board is published to its canvas.
 */

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import {
  artboardHtml,
  type BoardPlan,
  codeRegions,
  collectorSource,
  legendLine,
  PlanError,
  parsePlan,
  pngSize,
  previewHtml,
  type Region
} from './internal/board.ts'

const USAGE = [
  'usage: bun scripts/annotate-board.ts collector <plan.json>',
  '       bun scripts/annotate-board.ts annotate <plan.json> <regions.json> <out-dir> --revision <rev> [--date <YYYY-MM-DD>]'
].join('\n')

export type Command =
  | { readonly kind: 'help' }
  | { readonly kind: 'collector'; readonly plan: string }
  | {
      readonly kind: 'annotate'
      readonly plan: string
      readonly regions: string
      readonly out: string
      readonly revision: string
      readonly date: string
    }

/** Parse the command line, refusing anything incomplete with the usage. */
export const parseArguments = (argv: readonly string[], today = new Date()): Command => {
  if (argv.length === 0 || argv.some((arg) => arg === '-h' || arg === '--help')) return { kind: 'help' }
  const [verb, ...rest] = argv
  const flags = new Map<string, string>()
  const positional: string[] = []
  for (let i = 0; i < rest.length; i++) {
    const arg = rest[i] as string
    if (arg === '--revision' || arg === '--date') {
      const value = rest[++i]
      if (!value || value.startsWith('--')) throw new PlanError(`${arg} needs a value\n${USAGE}`)
      flags.set(arg, value)
    } else if (arg.startsWith('--')) throw new PlanError(`unknown option ${arg}\n${USAGE}`)
    else positional.push(arg)
  }
  if (verb === 'collector' && positional.length === 1 && flags.size === 0)
    return { kind: 'collector', plan: resolve(positional[0] as string) }
  if (verb === 'annotate' && positional.length === 3) {
    const revision = flags.get('--revision')
    if (!revision) throw new PlanError(`annotate needs --revision, the source revision the board shows\n${USAGE}`)
    const date = flags.get('--date') ?? today.toISOString().slice(0, 10)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new PlanError(`--date must be YYYY-MM-DD\n${USAGE}`)
    const [plan, regions, out] = positional.map((path) => resolve(path)) as [string, string, string]
    return { kind: 'annotate', plan, regions, out, revision, date }
  }
  throw new PlanError(USAGE)
}

const readJson = (path: string, what: string): unknown => {
  let raw: string
  try {
    raw = readFileSync(path, 'utf8')
  } catch {
    throw new PlanError(`cannot read the ${what} at ${path}`)
  }
  try {
    return JSON.parse(raw)
  } catch (cause) {
    throw new PlanError(`the ${what} at ${path} is not JSON: ${(cause as Error).message}`)
  }
}

/** Read and validate a board plan. */
export const loadPlan = (path: string): BoardPlan => parsePlan(readJson(path, 'board plan'))

/** One built artboard, as `board.json` records it. */
export interface BuiltArtboard {
  readonly id: string
  readonly title: string
  readonly image: string
  readonly width: number
  readonly height: number
  readonly regions: ReturnType<typeof codeRegions>
  readonly legend: string[]
}

/** Build every artboard in the plan from its screenshot and measured regions, writing `board.json` and previews. */
export const annotate = (command: Extract<Command, { kind: 'annotate' }>): BuiltArtboard[] => {
  const plan = loadPlan(command.plan)
  const measured = readJson(command.regions, 'regions file')
  if (typeof measured !== 'object' || measured === null || Array.isArray(measured))
    throw new PlanError('the regions file must be an object keyed by each artboard’s `shot`')
  const base = dirname(command.plan)
  const stamp = `refreshed from ${command.revision}, ${command.date}`
  const built: BuiltArtboard[] = []
  mkdirSync(join(command.out, 'preview'), { recursive: true })
  for (const board of plan.boards) {
    const regions = (measured as Record<string, unknown>)[board.shot]
    if (!Array.isArray(regions)) throw new PlanError(`the regions file has no list for shot ${board.shot}`)
    const image = resolve(base, board.image)
    let bytes: Uint8Array
    try {
      bytes = readFileSync(image)
    } catch {
      throw new PlanError(`cannot read the screenshot for ${board.id} at ${image}`)
    }
    const [width, height] = pngSize(bytes)
    const coded = codeRegions(regions as Region[], board.zones, width, height)
    const artboard = artboardHtml({
      src: image,
      alt: `${board.title}, as built at ${command.revision}`,
      width,
      height,
      regions: coded
    })
    writeFileSync(
      join(command.out, 'preview', `${board.id}.html`),
      previewHtml(`${board.id} · ${board.title}`, artboard, stamp)
    )
    built.push({
      id: board.id,
      title: board.title,
      image: board.image,
      width,
      height,
      regions: coded,
      legend: coded.map(legendLine)
    })
  }
  writeFileSync(
    join(command.out, 'board.json'),
    `${JSON.stringify({ revision: command.revision, refreshed: command.date, boards: built }, null, 1)}\n`
  )
  return built
}

if (import.meta.main) {
  try {
    const command = parseArguments(process.argv.slice(2))
    if (command.kind === 'help') console.log(USAGE)
    else if (command.kind === 'collector') console.log(collectorSource(loadPlan(command.plan).collector))
    else
      for (const board of annotate(command)) console.log(`${board.id} ${board.title}: ${board.regions.length} regions`)
  } catch (error) {
    if (!(error instanceof PlanError)) throw error
    console.error(`annotate-board: ${error.message}`)
    process.exit(2)
  }
}
