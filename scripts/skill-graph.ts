#!/usr/bin/env bun
// scripts/skill-graph.ts — read the `implies:` frontmatter graph across every
// SKILL.md and (a) validate it, (b) render the dependency tree.
//
//   bun scripts/skill-graph.ts --check   validate the graph (CI gate); exit 1 on error
//   bun scripts/skill-graph.ts --tree     print the Markdown dependency tree to stdout
//
// The `implies:` list in each skill's frontmatter is the single declared source
// of the implication graph: linking a skill pulls in the skills it implies. Both
// the bootstrap chain and the user-guide dependency tree derive from it, so a
// broken edge (e.g. an un-updated name after a rename) fails `ki:verify`.

import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const SKILLS_DIR = 'skills'

type Graph = Map<string, string[]>

/** Parse the `implies:` flow list from a SKILL.md frontmatter block. */
function parseImplies(skillMd: string): string[] | null {
  const fm = skillMd.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!fm) return null
  const line = fm[1].split(/\r?\n/).find((l) => /^implies:/.test(l))
  if (line === undefined) return null
  const body = line.replace(/^implies:\s*/, '').trim()
  const inner = body.replace(/^\[/, '').replace(/\]$/, '').trim()
  if (inner === '') return []
  return inner
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
}

function loadGraph(): { graph: Graph; unannotated: string[] } {
  const graph: Graph = new Map()
  const unannotated: string[] = []
  const dirs = readdirSync(SKILLS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort()
  for (const dir of dirs) {
    let md: string
    try {
      md = readFileSync(join(SKILLS_DIR, dir, 'SKILL.md'), 'utf8')
    } catch {
      continue // not a skill directory
    }
    const implies = parseImplies(md)
    if (implies === null) {
      unannotated.push(dir)
      continue
    }
    graph.set(dir, implies)
  }
  return { graph, unannotated }
}

/** Detect a cycle; return the offending path if one exists. */
function findCycle(graph: Graph): string[] | null {
  const WHITE = 0
  const GREY = 1
  const BLACK = 2
  const colour = new Map<string, number>()
  for (const k of graph.keys()) colour.set(k, WHITE)
  const stack: string[] = []

  function visit(node: string): string[] | null {
    colour.set(node, GREY)
    stack.push(node)
    for (const next of graph.get(node) ?? []) {
      if (!graph.has(next)) continue // missing edge handled separately
      const c = colour.get(next)
      if (c === GREY) return [...stack.slice(stack.indexOf(next)), next]
      if (c === WHITE) {
        const cyc = visit(next)
        if (cyc) return cyc
      }
    }
    stack.pop()
    colour.set(node, BLACK)
    return null
  }

  for (const node of graph.keys()) {
    if (colour.get(node) === WHITE) {
      const cyc = visit(node)
      if (cyc) return cyc
    }
  }
  return null
}

function check(): number {
  const { graph, unannotated } = loadGraph()
  const errors: string[] = []

  for (const skill of unannotated) {
    errors.push(`${skill}: SKILL.md has no \`implies:\` frontmatter key (every skill must declare one, even if empty)`)
  }
  for (const [skill, implies] of graph) {
    for (const target of implies) {
      if (!graph.has(target)) {
        errors.push(`${skill}: implies "${target}", which is not a skill directory under ${SKILLS_DIR}/`)
      }
      if (target === skill) {
        errors.push(`${skill}: implies itself`)
      }
    }
  }
  const cycle = findCycle(graph)
  if (cycle) errors.push(`implication cycle: ${cycle.join(' → ')}`)

  if (errors.length > 0) {
    console.error('FAIL  skill-graph — implication graph invalid:')
    for (const e of errors) console.error(`  · ${e}`)
    return 1
  }
  console.log(`PASS  skill-graph — ${graph.size} skills, implication graph valid`)
  return 0
}

// Presentation-only ordering of roots for the rendered tree.
const CLUSTER_ORDER = [
  'ki-bootstrap',
  'ki-harness',
  'ki-kb-base',
  'ki-websites-11ty',
  'ki-mcp',
  'ki-handoffs',
  'ki-plans',
  'ki-binding',
  'ki-memory',
  'ki-tokenomics'
]

function renderTree(): string {
  const { graph } = loadGraph()
  const implied = new Set<string>()
  for (const targets of graph.values()) for (const t of targets) implied.add(t)
  const roots = [...graph.keys()]
    .filter((s) => !implied.has(s))
    .sort((a, b) => {
      const ia = CLUSTER_ORDER.indexOf(a)
      const ib = CLUSTER_ORDER.indexOf(b)
      if (ia !== -1 && ib !== -1) return ia - ib
      if (ia !== -1) return -1
      if (ib !== -1) return 1
      return a.localeCompare(b)
    })

  const lines: string[] = []
  function walk(node: string, prefix: string, isLast: boolean, isRoot: boolean): void {
    if (isRoot) {
      lines.push(node)
    } else {
      lines.push(`${prefix}${isLast ? '└─ ' : '├─ '}${node}`)
    }
    const children = graph.get(node) ?? []
    const childPrefix = isRoot ? '' : prefix + (isLast ? '   ' : '│  ')
    children.forEach((c, i) => {
      walk(c, childPrefix, i === children.length - 1, false)
    })
  }
  for (const root of roots) {
    walk(root, '', true, true)
    lines.push('')
  }
  return lines.join('\n').trimEnd()
}

const argv = process.argv.slice(2)
if (argv.includes('--tree')) {
  console.log(renderTree())
  process.exit(0)
} else {
  // default is --check
  process.exit(check())
}
