#!/usr/bin/env bun
/**
 * Purpose: Build the interactive HTML of every diagram a repository's manifest lists, in one local command.
 * Run: bun scripts/build-html.ts --help
 * Boundary: Reads `docs/diagrams/diagrams.toml` and each listed source, writes under `+/diagrams/<slug>/`, and
 * copies the HTML to `docs/diagrams/<slug>.html` only for a diagram with `commit_html = true`; with `--svg` it
 * re-exports each `docs/diagrams/<slug>.svg`. It never edits a source or the manifest.
 *
 * Usage: bun scripts/build-html.ts [--repo <dir>] [--svg] [slug...]
 *
 * Each diagram is finalized at showcase quality with `--repo-root` and a fresh `--out-dir`, exactly as the
 * standard's refresh procedure runs it by hand, and a failing gate stops the build before anything is copied or
 * exported for that diagram. Archify is found at `ARCHIFY_HOME` when set, otherwise as the installed Agent Skill
 * under `~/.claude/skills/archify` or `~/.agents/skills/archify`.
 */

import { spawnSync } from 'node:child_process'
import { copyFileSync, existsSync, mkdirSync, readFileSync, rmSync } from 'node:fs'
import { homedir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { type DiagramEntry, parseManifest } from './rubric/contexts/diagrams.ts'

const USAGE = 'usage: bun scripts/build-html.ts [--repo <dir>] [--svg] [slug...]'
const MANIFEST = 'docs/diagrams/diagrams.toml'
const EXPORTER = join(dirname(fileURLToPath(import.meta.url)), 'export-svg.ts')

/** A reason the build stopped, reported as one line rather than a stack. */
export class Refusal extends Error {}

export type BuildArguments = { readonly repository: string; readonly svg: boolean; readonly slugs: readonly string[] }

/** The repository, the SVG flag and any slugs named on the command line. */
export const parseArguments = (argv: readonly string[]): BuildArguments => {
  let repository = '.'
  let svg = false
  const slugs: string[] = []
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index] as string
    if (arg === '--svg') svg = true
    else if (arg === '--repo') {
      index += 1
      const value = argv[index]
      if (!value) throw new Refusal(USAGE)
      repository = value
    } else if (arg.startsWith('-')) throw new Refusal(`unknown option ${arg}\n${USAGE}`)
    else slugs.push(arg)
  }
  return { repository: resolve(repository), svg, slugs }
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

/** The diagrams to build: every listed one, or the named ones in the order given. */
export const selectDiagrams = (entries: readonly DiagramEntry[], slugs: readonly string[]): DiagramEntry[] => {
  if (slugs.length === 0) return [...entries]
  return slugs.map((slug) => {
    const entry = entries.find((candidate) => candidate.slug === slug)
    if (!entry) throw new Refusal(`${slug} is not listed in ${MANIFEST}`)
    return entry
  })
}

/** Where one diagram's build lands: the finalized HTML, its fresh report directory, and its committed forms. */
export const buildPaths = (repository: string, { slug, type }: DiagramEntry) => ({
  source: join(repository, 'docs/diagrams', `${slug}.${type}.json`),
  html: join(repository, '+/diagrams', slug, `${slug}.html`),
  outDir: join(repository, '+/diagrams', slug, 'build'),
  committedHtml: join(repository, 'docs/diagrams', `${slug}.html`),
  svg: join(repository, 'docs/diagrams', `${slug}.svg`)
})

const run = (
  command: string,
  args: readonly string[],
  cwd: string
): { ok: boolean; stdout: string; stderr: string } => {
  const result = spawnSync(command, args, { cwd, encoding: 'utf8', shell: false, maxBuffer: 64 * 1024 * 1024 })
  return { ok: !result.error && result.status === 0, stdout: result.stdout ?? '', stderr: result.stderr ?? '' }
}

/** Finalize one diagram, then copy or export its committed forms; a failing gate stops it. */
const build = (archify: string, repository: string, entry: DiagramEntry, svg: boolean): string => {
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
  const done = [`${entry.slug}: finalized`]
  if (entry.commitHtml) {
    copyFileSync(paths.html, paths.committedHtml)
    done.push('HTML committed form written')
  }
  if (svg) {
    const exported = run('bun', [EXPORTER, paths.html, paths.svg], repository)
    if (!exported.ok) throw new Refusal(`${entry.slug}: ${exported.stderr.trim() || 'SVG export failed'}`)
    done.push('SVG exported')
  }
  return done.join(', ')
}

const HELP = `${USAGE}

Finalize every diagram listed in ${MANIFEST} at showcase quality into +/diagrams/<slug>/<slug>.html, each with a
fresh --out-dir, and copy it to docs/diagrams/<slug>.html where the manifest sets commit_html = true. Name slugs
to build only those. --svg also re-exports each docs/diagrams/<slug>.svg through the viewer. Archify is found at
ARCHIFY_HOME, otherwise under ~/.claude/skills/archify or ~/.agents/skills/archify.`

const main = (argv: readonly string[]): void => {
  if (argv.some((arg) => arg === '-h' || arg === '--help')) {
    console.log(HELP)
    return
  }
  const { repository, svg, slugs } = parseArguments(argv)
  const manifest = join(repository, MANIFEST)
  if (!existsSync(manifest)) throw new Refusal(`no manifest at ${manifest}`)
  const { entries, issues } = parseManifest(readFileSync(manifest, 'utf8'))
  if (issues.length > 0) throw new Refusal(`${MANIFEST} is not valid:\n${issues.join('\n')}`)
  const archify = locateArchify()
  for (const entry of selectDiagrams(entries, slugs)) console.log(build(archify, repository, entry, svg))
}

if (import.meta.main)
  try {
    main(process.argv.slice(2))
  } catch (error) {
    if (!(error instanceof Refusal)) throw error
    console.error(`build-html: ${error.message}`)
    process.exitCode = 1
  }
