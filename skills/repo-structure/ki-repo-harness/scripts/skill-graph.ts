#!/usr/bin/env bun
/**
 * Purpose: Regenerate or check the harness skill graph, the Archify architecture source derived from skill frontmatter.
 * Run: bun scripts/skill-graph.ts --help
 * Boundary: Reads every `skills/<concern>/<skill>/SKILL.md` and the `.ki.toml` repository identity of one harness
 * checkout; writes only `docs/diagrams/skill-graph.architecture.json`, never the SVG, and runs neither Archify nor Git
 * beyond a read-only `rev-parse HEAD`.
 *
 * Usage: bun scripts/skill-graph.ts [--check | --write] [--repository <path>]
 *
 * `--check` (default) exits 1 when the committed graph is missing or differs from the frontmatter-derived rendering,
 * ignoring only the traced revision. `--write` replaces it. `ki repo conform --skill ki-repo-harness` performs the same
 * write under CAP-4; this script is the direct form the diagrams manifest cites. After a write, finalize and re-export
 * the SVG as the ki-diagrams standard describes.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { prepareSkillGraph, SKILL_GRAPH_PATH } from './rubric/contexts/skill-graph.ts'

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
      `${USAGE}\n\nRegenerate (--write) or verify (--check, default) ${SKILL_GRAPH_PATH} from skill frontmatter.`
    )
    return 0
  }
  const { mode, repository } = parsed
  const target = join(repository, SKILL_GRAPH_PATH)
  const committed = existsSync(target) ? readFileSync(target, 'utf8') : undefined
  const draft = prepareSkillGraph(committed, skillSources(repository), {
    repositoryUrl: repositoryUrl(repository),
    revision: revision(repository)
  })
  if (draft.state === 'unsafe') {
    for (const issue of draft.issues) console.error(`skill-graph: ${issue}`)
    return 1
  }
  if (mode === 'write') {
    mkdirSync(dirname(target), { recursive: true })
    writeFileSync(target, draft.expected)
    console.log(
      `skill-graph: wrote ${SKILL_GRAPH_PATH} (${draft.state === 'in-sync' ? 'unchanged apart from revision' : draft.state})`
    )
    return 0
  }
  if (draft.state === 'in-sync') {
    console.log(`skill-graph: ${SKILL_GRAPH_PATH} is in sync with skill frontmatter`)
    return 0
  }
  console.error(
    `skill-graph: ${SKILL_GRAPH_PATH} is ${draft.state}; run with --write, then finalize and re-export the SVG`
  )
  return 1
}

if (import.meta.main) {
  try {
    process.exit(main())
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error))
    process.exit(2)
  }
}
