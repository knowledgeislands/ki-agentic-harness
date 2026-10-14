import { describe, expect, test } from 'bun:test'
import { readdirSync, readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { prepareSkillDiagram, SKILL_DIAGRAMS } from './skill-diagrams.ts'
import { buildSkillGraph, readSkillGraphNodes, renderSkillGraph, SKILL_GRAPH_PATH } from './skill-graph.ts'

const GRAPH = SKILL_DIAGRAMS.find((diagram) => diagram.path === SKILL_GRAPH_PATH) as (typeof SKILL_DIAGRAMS)[number]

const source = (path: string, frontmatter: string) => ({ path, content: `---\n${frontmatter}\n---\n\n# body\n` })

const FIXTURE = [
  source(
    'skills/governance/ki-base/SKILL.md',
    'name: ki-base\nki-kind: governance\nki-applicability: detected\nki-depends-on: []\ndescription: Base.'
  ),
  source(
    'skills/repo-structure/ki-leaf/SKILL.md',
    'name: ki-leaf\nki-kind: governance\nki-applicability: declaration-only\nki-runtime-binding: true\nki-depends-on: [ki-base]\ndescription: Leaf.'
  ),
  source(
    'skills/change-management/ki-flow/SKILL.md',
    'name: ki-flow\nki-kind: process\nki-applicability: invocation-only\nki-depends-on: []\nki-optional-depends-on: [ki-base]\ndescription: Flow.'
  )
]

describe('readSkillGraphNodes', () => {
  test('reads both dependency lists and reports unknown targets', () => {
    const { nodes, issues } = readSkillGraphNodes([
      ...FIXTURE,
      source(
        'skills/governance/ki-dangling/SKILL.md',
        'name: ki-dangling\nki-kind: governance\nki-applicability: detected\nki-depends-on: [ki-pmo]\ndescription: Dangling.'
      )
    ])
    expect(nodes.map((node) => node.name)).toEqual(['ki-base', 'ki-dangling', 'ki-flow', 'ki-leaf'])
    expect(nodes.find((node) => node.name === 'ki-flow')?.optionalDependsOn).toEqual(['ki-base'])
    expect(issues).toEqual(['skills/governance/ki-dangling/SKILL.md: depends on unknown skill `ki-pmo`'])
  })
})

describe('buildSkillGraph', () => {
  const graph = buildSkillGraph(readSkillGraphNodes(FIXTURE).nodes, {
    repositoryUrl: 'https://example.invalid/harness',
    revision: 'a'.repeat(40)
  }) as {
    meta: { repository?: { revision: string } }
    components: { id: string; type: string; tag?: string; pos: [number, number] }[]
    connections: { id: string; from: string; to: string; variant: string }[]
  }

  test('maps shapes to node types and declarations to edge variants', () => {
    expect(graph.components.map((c) => [c.id, c.type, c.tag])).toEqual([
      ['ki-flow', 'frontend', undefined],
      ['ki-leaf', 'database', undefined],
      ['ki-base', 'backend', undefined]
    ])
    expect(graph.connections.map((c) => [c.id, c.variant])).toEqual([
      ['ki-flow--ki-base', 'dashed'],
      ['ki-leaf--ki-base', 'default']
    ])
    expect(graph.meta.repository?.revision).toBe('a'.repeat(40))
  })

  test('leaves skills without any relationship to the skill map', () => {
    const withIsolated = buildSkillGraph(
      readSkillGraphNodes([
        ...FIXTURE,
        source(
          'skills/design/ki-alone/SKILL.md',
          'name: ki-alone\nki-kind: process\nki-applicability: invocation-only\nki-depends-on: []\ndescription: Alone.'
        )
      ]).nodes
    ) as { components: { id: string }[]; boundaries?: unknown }
    expect(withIsolated.components.map((c) => c.id)).not.toContain('ki-alone')
    expect(withIsolated.boundaries).toBeUndefined()
  })

  test('places every dependent above its prerequisite', () => {
    const y = new Map(graph.components.map((c) => [c.id, c.pos[1]]))
    for (const edge of graph.connections) expect(y.get(edge.from)).toBeLessThan(y.get(edge.to) ?? 0)
  })

  test('is deterministic and ignores only the revision when compared', () => {
    const rendered = renderSkillGraph(graph)
    expect(
      prepareSkillDiagram(GRAPH, rendered, FIXTURE, {
        repositoryUrl: 'https://example.invalid/harness',
        revision: 'b'.repeat(40)
      }).state
    ).toBe('in-sync')
    expect(prepareSkillDiagram(GRAPH, undefined, FIXTURE).state).toBe('missing')
    expect(prepareSkillDiagram(GRAPH, rendered.replace('"dashed"', '"default"'), FIXTURE).state).toBe('stale')
  })
})

describe('the committed harness skill diagrams', () => {
  const root = resolve(import.meta.dir, '../../../../../..')
  const sources = readdirSync(join(root, 'skills'), { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .flatMap((concern) =>
      readdirSync(join(root, 'skills', concern.name), { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((skill) => `skills/${concern.name}/${skill.name}/SKILL.md`)
    )
    .filter((path) => {
      try {
        readFileSync(join(root, path))
        return true
      } catch {
        return false
      }
    })
    .map((path) => ({ path, content: readFileSync(join(root, path), 'utf8') }))

  for (const diagram of SKILL_DIAGRAMS)
    test(`${diagram.path} is in sync with canonical frontmatter`, () => {
      let committed: string | undefined
      try {
        committed = readFileSync(join(root, diagram.path), 'utf8')
      } catch {
        committed = undefined
      }
      const draft = prepareSkillDiagram(diagram, committed, sources, {
        repositoryUrl: 'https://github.com/knowledgeislands/ki-agentic-harness',
        revision: '0'.repeat(40)
      })
      expect(draft.issues).toEqual([])
      expect(draft.state).toBe('in-sync')
    })
})
