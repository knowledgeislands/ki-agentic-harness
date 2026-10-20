#!/usr/bin/env bun
/**
 * Purpose: Build the interactive HTML of every diagram a repository's manifest lists, in one local command.
 * Run: bun scripts/build-html.ts --help
 * Boundary: Reads `docs/diagrams/diagrams.toml` and each listed source, writes under `+/diagrams/<slug>/`, and
 * copies the HTML to `docs/diagrams/<slug>.html`, with its `<slug>.receipt.json`, only for a diagram with
 * `commit_html = true`; with `--svg` it re-exports each `docs/diagrams/<slug>.svg` in its manifest `svg_form`. With `--check` it renders
 * nothing and only verifies each committed viewer's receipt. After each finalize it writes the working folder's
 * `mark.toml`, reading the run packet under the KI state home in a background run. It never edits a source or the
 * manifest.
 *
 * Usage: bun scripts/build-html.ts [--repo <dir>] [--work <id>] [--svg | --check] [slug...]
 *
 * Each diagram is finalized at showcase quality with `--repo-root` and a fresh `--out-dir`, exactly as the
 * standard's refresh procedure runs it by hand, and a failing gate stops the build before anything is copied or
 * exported for that diagram. Archify is found at `ARCHIFY_HOME` when set, otherwise as the installed Agent Skill
 * under `~/.claude/skills/archify` or `~/.agents/skills/archify`.
 */

import { spawnSync } from 'node:child_process'
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { basename, dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  type DiagramEntry,
  type DiagramReceipt,
  diagramReceipt,
  formatMark,
  MARK_FILE,
  parseManifest,
  RECEIPT_SUFFIX,
  receiptFindings,
  type WorkingMark
} from './rubric/contexts/diagrams.ts'

const USAGE = 'usage: bun scripts/build-html.ts [--repo <dir>] [--work <id>] [--svg | --check] [slug...]'
const MANIFEST = 'docs/diagrams/diagrams.toml'
const EXPORTER = join(dirname(fileURLToPath(import.meta.url)), 'export-svg.ts')

/** A reason the build stopped, reported as one line rather than a stack. */
export class Refusal extends Error {}

export type BuildArguments = {
  readonly repository: string
  readonly work: string | undefined
  readonly svg: boolean
  readonly check: boolean
  readonly slugs: readonly string[]
}

/** The repository, the work, the SVG and check flags, and any slugs named on the command line. */
export const parseArguments = (argv: readonly string[]): BuildArguments => {
  let repository = '.'
  let work: string | undefined
  let svg = false
  let check = false
  const slugs: string[] = []
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index] as string
    if (arg === '--svg') svg = true
    else if (arg === '--check') check = true
    else if (arg === '--repo') {
      index += 1
      const value = argv[index]
      if (!value) throw new Refusal(USAGE)
      repository = value
    } else if (arg === '--work') {
      index += 1
      const value = argv[index]
      if (!value) throw new Refusal(USAGE)
      work = value
    } else if (arg.startsWith('-')) throw new Refusal(`unknown option ${arg}\n${USAGE}`)
    else slugs.push(arg)
  }
  if (svg && check) throw new Refusal(`--check renders nothing, so it takes no --svg\n${USAGE}`)
  return { repository: resolve(repository), work, svg, check, slugs }
}

/** The Archify command line, or a refusal with the Rig install instruction; `env` and `home` are injectable. */
export const locateArchify = (env: NodeJS.ProcessEnv = process.env, home = homedir()): string => {
  const candidates = [
    ...(env.ARCHIFY_HOME ? [env.ARCHIFY_HOME] : []),
    join(home, '.claude/skills/archify'),
    join(home, '.agents/skills/archify')
  ].map((root) => join(root, 'bin/archify.mjs'))
  const found = candidates.find((path) => existsSync(path))
  if (!found)
    throw new Refusal(
      'Archify is not installed: add [skill.archify] (source tt-a1i/archify) to the Rig skills configuration and apply it, or set ARCHIFY_HOME.'
    )
  return found
}

/** The renderer's identity for a receipt: the name and version in Archify's own `package.json`. */
export const archifyRenderer = (archify: string): DiagramReceipt['renderer'] => {
  const manifest = join(dirname(dirname(archify)), 'package.json')
  let parsed: { name?: unknown; version?: unknown } = {}
  try {
    parsed = JSON.parse(readFileSync(manifest, 'utf8'))
  } catch {
    throw new Refusal(`Archify has no readable package.json at ${manifest}, so a receipt cannot name its renderer.`)
  }
  if (typeof parsed.name !== 'string' || typeof parsed.version !== 'string' || !parsed.name || !parsed.version)
    throw new Refusal(`Archify's package.json at ${manifest} names no renderer and version.`)
  return { name: parsed.name, version: parsed.version }
}

/** A run's state folder in the run packet: `<KI state home>/agents/<run>/`, as the `ki agent` launcher places it. */
export const runStateFolder = (run: string, env: NodeJS.ProcessEnv = process.env, home = homedir()): string =>
  join(env.KI_STATE_HOME || join(env.XDG_STATE_HOME || join(home, '.local/state'), 'ki'), 'agents', run)

/** This process and its ancestors, nearest first, as far as `ps` can name them. */
const processChain = (pid = process.pid): number[] => {
  const chain: number[] = []
  for (let current = pid; current > 1 && chain.length < 32 && !chain.includes(current); ) {
    chain.push(current)
    const parent = spawnSync('ps', ['-o', 'ppid=', '-p', String(current)], { encoding: 'utf8', shell: false })
    current = Number.parseInt(parent.stdout?.trim() ?? '', 10)
    if (!Number.isInteger(current)) break
  }
  return chain
}

/**
 * What the run packet says of the writing agent: the work, the last segment of the work folder `thread.json` records,
 * and the agent, the one whose `<name>.pid` names this process or an ancestor. Either is absent where the packet
 * does not say.
 */
export const readRunPacket = (folder: string, chain: readonly number[]): { work?: string; agent?: string } => {
  const packet: { work?: string; agent?: string } = {}
  try {
    const thread = JSON.parse(readFileSync(join(folder, 'thread.json'), 'utf8')) as { folder?: unknown }
    if (typeof thread.folder === 'string' && thread.folder) packet.work = basename(thread.folder)
  } catch {}
  if (!existsSync(folder)) return packet
  for (const file of readdirSync(folder).filter((name) => name.endsWith('.pid'))) {
    const pid = Number.parseInt(readFileSync(join(folder, file), 'utf8').trim(), 10)
    if (chain.includes(pid)) {
      packet.agent = file.slice(0, -'.pid'.length)
      break
    }
  }
  return packet
}

/**
 * The working-area mark for this build: the work, then the run and agent from `KI_AGENT_RUN` and its run packet in
 * a background run, or the native session, or `interactive`, otherwise, then the time. A named work wins over the
 * packet's.
 */
export const workingMark = (
  work: string | undefined,
  env: NodeJS.ProcessEnv = process.env,
  now = new Date(),
  packet: (run: string) => { work?: string; agent?: string } = (run) =>
    readRunPacket(runStateFolder(run, env), processChain())
): WorkingMark => {
  const written_at = now.toISOString()
  const run = env.KI_AGENT_RUN
  if (!run) return { ...(work ? { work } : {}), session: env.CLAUDE_CODE_SESSION_ID || 'interactive', written_at }
  const found = packet(run)
  const named = work ?? found.work
  return { ...(named ? { work: named } : {}), run, ...(found.agent ? { agent: found.agent } : {}), written_at }
}

/** The diagrams to build: every listed one, or the named ones in the order given. */
export const selectDiagrams = (entries: readonly DiagramEntry[], slugs: readonly string[]): DiagramEntry[] => {
  if (slugs.length === 0) return [...entries]
  return slugs.map((slug) => {
    const entry = entries.find((candidate) => candidate.slug === slug)
    if (!entry) throw new Refusal(`${slug} is not listed in ${MANIFEST}`)
    return entry
  })
}

/**
 * Where one diagram's build lands: the finalized HTML, Archify's delivery receipt and the working-area mark beside
 * it, its fresh report directory, and its committed forms.
 */
export const buildPaths = (repository: string, { slug, type }: DiagramEntry) => ({
  source: join(repository, 'docs/diagrams', `${slug}.${type}.json`),
  html: join(repository, '+/diagrams', slug, `${slug}.html`),
  delivery: join(repository, '+/diagrams', slug, `${slug}.delivery.json`),
  mark: join(repository, '+/diagrams', slug, MARK_FILE),
  outDir: join(repository, '+/diagrams', slug, 'build'),
  committedHtml: join(repository, 'docs/diagrams', `${slug}.html`),
  receipt: join(repository, 'docs/diagrams', `${slug}${RECEIPT_SUFFIX}`),
  svg: join(repository, 'docs/diagrams', `${slug}.svg`)
})

/**
 * The portable receipt for one finalized diagram, refused when Archify's own delivery receipt, where it wrote one,
 * vouches for different source or HTML bytes than those hashed here.
 */
export const committedReceipt = (
  entry: DiagramEntry,
  source: Uint8Array,
  html: Uint8Array,
  renderer: DiagramReceipt['renderer'],
  delivery?: string
): DiagramReceipt => {
  const receipt = diagramReceipt(entry, source, html, renderer)
  if (delivery === undefined) return receipt
  let vouched: { specification?: { sha256?: unknown }; artifact?: { sha256?: unknown } } = {}
  try {
    vouched = JSON.parse(delivery)
  } catch {
    throw new Refusal(`${entry.slug}: Archify's delivery receipt is not valid JSON`)
  }
  if (vouched.specification?.sha256 !== receipt.source.sha256 || vouched.artifact?.sha256 !== receipt.html.sha256)
    throw new Refusal(`${entry.slug}: Archify's delivery receipt does not match the source and HTML just finalized`)
  return receipt
}

const run = (
  command: string,
  args: readonly string[],
  cwd: string
): { ok: boolean; stdout: string; stderr: string } => {
  const result = spawnSync(command, args, { cwd, encoding: 'utf8', shell: false, maxBuffer: 64 * 1024 * 1024 })
  return { ok: !result.error && result.status === 0, stdout: result.stdout ?? '', stderr: result.stderr ?? '' }
}

/** Finalize one diagram, then copy or export its committed forms; a failing gate stops it. */
const build = (
  archify: string,
  renderer: DiagramReceipt['renderer'],
  repository: string,
  entry: DiagramEntry,
  svg: boolean,
  mark: WorkingMark
): string => {
  const paths = buildPaths(repository, entry)
  if (!existsSync(paths.source)) throw new Refusal(`${entry.slug}: no source at ${paths.source}`)
  rmSync(paths.outDir, { recursive: true, force: true })
  mkdirSync(paths.outDir, { recursive: true })
  const args = [archify, 'finalize', entry.type, paths.source, paths.html, '--repo-root', repository]
  const finalize = run('node', [...args, '--quality', 'showcase', '--out-dir', paths.outDir, '--json'], repository)
  let report: { ok?: boolean; failedStage?: string | null } = {}
  try {
    report = JSON.parse(finalize.stdout)
  } catch {
    throw new Refusal(`${entry.slug}: finalize gave no report: ${finalize.stderr.trim().split('\n')[0] ?? ''}`)
  }
  if (!finalize.ok || report.ok !== true)
    throw new Refusal(
      `${entry.slug}: finalize failed at ${report.failedStage ?? 'an unknown stage'}; see ${paths.outDir}`
    )
  writeFileSync(paths.mark, formatMark(mark))
  const done = [`${entry.slug}: finalized, marked`]
  if (entry.commitHtml) {
    const receipt = committedReceipt(
      entry,
      readFileSync(paths.source),
      readFileSync(paths.html),
      renderer,
      existsSync(paths.delivery) ? readFileSync(paths.delivery, 'utf8') : undefined
    )
    copyFileSync(paths.html, paths.committedHtml)
    writeFileSync(paths.receipt, `${JSON.stringify(receipt, null, 2)}\n`)
    done.push('HTML committed form and receipt written')
  }
  if (svg) {
    const exported = run('bun', [EXPORTER, '--form', entry.svgForm, paths.html, paths.svg], repository)
    if (!exported.ok) throw new Refusal(`${entry.slug}: ${exported.stderr.trim() || 'SVG export failed'}`)
    done.push(entry.svgForm === 'dual' ? 'SVG exported' : `SVG exported (${entry.svgForm})`)
  }
  return done.join(', ')
}

const HELP = `${USAGE}

Finalize every diagram listed in ${MANIFEST} at showcase quality into +/diagrams/<slug>/<slug>.html, each with a
fresh --out-dir, and copy it to docs/diagrams/<slug>.html, with its <slug>.receipt.json of source and HTML
hashes, where the manifest sets commit_html = true. Each working folder gets a mark.toml naming the work, the
run and agent from KI_AGENT_RUN and its run packet or the session, and the time; --work names the work where no
run packet does. Name slugs to build only those. --svg also re-exports each
docs/diagrams/<slug>.svg through the viewer, in the form its svg_form names, dual where it names none. --check renders nothing and needs no Archify: it fails when a
committed viewer's receipt is missing or does not match its source and HTML. Archify is found at ARCHIFY_HOME,
otherwise under ~/.claude/skills/archify or ~/.agents/skills/archify.`

const main = (argv: readonly string[]): void => {
  if (argv.some((arg) => arg === '-h' || arg === '--help')) {
    console.log(HELP)
    return
  }
  const { repository, work, svg, check, slugs } = parseArguments(argv)
  const manifest = join(repository, MANIFEST)
  if (!existsSync(manifest)) throw new Refusal(`no manifest at ${manifest}`)
  const { entries, issues } = parseManifest(readFileSync(manifest, 'utf8'))
  if (issues.length > 0) throw new Refusal(`${MANIFEST} is not valid:\n${issues.join('\n')}`)
  const selected = selectDiagrams(entries, slugs)
  if (check) {
    const findings = receiptFindings(join(repository, 'docs/diagrams'), selected)
    if (findings.length > 0) throw new Refusal(`a committed viewer's receipt does not match:\n${findings.join('\n')}`)
    console.log(`${selected.filter((entry) => entry.commitHtml).length} committed viewer receipts match`)
    return
  }
  const archify = locateArchify()
  const renderer = archifyRenderer(archify)
  const mark = workingMark(work)
  for (const entry of selected) console.log(build(archify, renderer, repository, entry, svg, mark))
}

if (import.meta.main)
  try {
    main(process.argv.slice(2))
  } catch (error) {
    if (!(error instanceof Refusal)) throw error
    console.error(`build-html: ${error.message}`)
    process.exitCode = 1
  }
