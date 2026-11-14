#!/usr/bin/env bun
/**
 * Purpose: Regenerate or check the harness skill map and functional-area diagrams, the Archify architecture sources
 * derived from skill frontmatter, the concern layout and the functional-area table.
 * Run: bun scripts/skill-graph.ts --help
 * Boundary: Reads every `skills/<concern>/<skill>/SKILL.md` and the `.ki.toml` repository identity of one harness
 * checkout; writes only `docs/diagrams/skill-map.architecture.json` and the `docs/diagrams/skill-area-<area>.architecture.json`
 * sources, never an SVG or HTML, and runs neither Archify nor Git beyond a read-only `rev-parse HEAD`.
 *
 * Usage: bun scripts/skill-graph.ts [--check | --write] [--repository <path>]
 *
 * `--check` (default) exits 1 when any committed source is missing or differs from the frontmatter-derived rendering,
 * ignoring only the traced revision. `--write` replaces each. `ki repo conform --skill ki-repo-harness` performs the same
 * write under CAP-4; this script is the direct form the diagrams manifest cites. After a write, finalize and re-export
 * each SVG as the ki-diagrams standard describes.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { prepareSkillDiagram, SKILL_DIAGRAMS } from './rubric/contexts/skill-diagrams.ts'

import { readSkillStats } from './rubric/contexts/skill-stats.ts'

const USAGE = 'usage: bun scripts/skill-graph.ts [--check | --write] [--repository <path>]'

const parseArguments = (argv: readonly string[]): { mode: 'check' | 'write'; repository: string } | 'help' => {
  let mode: 'check' | 'write' = 'check'
  let repository = process.cwd()
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index]
    if (argument === '-h' || argument === '--help') return 'help'
    else if (argument === '--check') mode = 'check'
    else if (argument === '--write') mode = 'write'
    else if (argument === '--repository') {
      const value = argv[index + 1]
      if (value === undefined) throw new Error(USAGE)
      repository = value
      index += 1
    } else throw new Error(USAGE)
  }
  return { mode, repository: resolve(repository) }
}

const skillSources = (root: string): { path: string; content: string }[] => {
  const glob = new Bun.Glob('skills/*/*/SKILL.md')
  return [...glob.scanSync({ cwd: root })]
    .sort()
    .map((path) => ({ path, content: readFileSync(join(root, path), 'utf8') }))
}

const repositoryUrl = (root: string): string | undefined => {
  const configuration = join(root, '.ki.toml')
  if (!existsSync(configuration)) return undefined
  try {
    const parsed = Bun.TOML.parse(readFileSync(configuration, 'utf8')) as {
      skills?: { 'ki-repo'?: { repository?: unknown } }
    }
    const url = parsed.skills?.['ki-repo']?.repository
    return typeof url === 'string' && /^https:\/\/github\.com\//.test(url) ? url : undefined
  } catch {
    return undefined
  }
}

const revision = (root: string): string | undefined => {
  const result = Bun.spawnSync(['git', '-C', root, 'rev-parse', 'HEAD'], { stdout: 'pipe', stderr: 'ignore' })
  const output = result.stdout.toString().trim()
  return result.exitCode === 0 && /^[0-9a-f]{40}$/.test(output) ? output : undefined
}

const main = (): number => {
  const parsed = parseArguments(process.argv.slice(2))
  if (parsed === 'help') {
    console.log(
      `${USAGE}\n\nRegenerate (--write) or verify (--check, default) the generated skill diagram sources from skill frontmatter:\n${SKILL_DIAGRAMS.map((d) => `  ${d.path}`).join('\n')}`
    )
    return 0
  }
  const { mode, repository } = parsed
  const sources = skillSources(repository)
  const options = {
    repositoryUrl: repositoryUrl(repository),
    revision: revision(repository),
    stats: readSkillStats(repository, sources)
  }
  let status = 0
  for (const diagram of SKILL_DIAGRAMS) {
    const target = join(repository, diagram.path)
    const committed = existsSync(target) ? readFileSync(target, 'utf8') : undefined
    const draft = prepareSkillDiagram(diagram, committed, sources, options)
    if (draft.state === 'unsafe') {
      for (const issue of draft.issues) console.error(`skill-graph: ${issue}`)
      return 1
    }
    if (mode === 'write') {
      mkdirSync(dirname(target), { recursive: true })
      writeFileSync(target, draft.expected)
      console.log(
        `skill-graph: wrote ${diagram.path} (${draft.state === 'in-sync' ? 'unchanged apart from revision' : draft.state})`
      )
    } else if (draft.state === 'in-sync') console.log(`skill-graph: ${diagram.path} is in sync with skill frontmatter`)
    else {
      console.error(
        `skill-graph: ${diagram.path} is ${draft.state}; run with --write, then finalize and re-export the SVG`
      )
      status = 1
    }
  }
  return status
}

if (import.meta.main) {
  try {
    process.exit(main())
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error))
    process.exit(2)
  }
}
