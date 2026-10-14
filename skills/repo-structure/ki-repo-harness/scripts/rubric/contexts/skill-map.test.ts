import { describe, expect, test } from 'bun:test'
import { readSkillGraphNodes } from './skill-graph.ts'
import { buildSkillMap } from './skill-map.ts'

const source = (path: string, frontmatter: string) => ({ path, content: `---\n${frontmatter}\n---\n\n# body\n` })

const skill = (concern: string, name: string, kind: string, applicability: string, extra = '') =>
  source(
    `skills/${concern}/${name}/SKILL.md`,
    `name: ${name}\nki-kind: ${kind}\nki-applicability: ${applicability}\nki-depends-on: []\n${extra}description: ${name}.`
  )

const FIXTURE = [
  skill('governance', 'ki-flow', 'process', 'invocation-only'),
  skill('governance', 'ki-base', 'governance', 'detected'),
  skill('governance', 'ki-root', 'governance', 'baseline'),
  skill('design', 'ki-look', 'governance', 'declaration-only', 'ki-runtime-binding: true\n'),
  skill('keystone', 'ki-key', 'governance', 'detected'),
  skill('zeta', 'ki-later', 'process', 'invocation-only')
]

type Map = {
  meta: { title: string; legend: { entries: Record<string, { label: string }> } }
  components: { id: string; type: string; sublabel: string; tag?: string; pos: [number, number] }[]
  boundaries: { kind: string; label: string; wraps: string[] }[]
  connections: unknown[]
}

describe('buildSkillMap', () => {
  const map = buildSkillMap(readSkillGraphNodes(FIXTURE).nodes) as Map

  test('draws one region per concern, foundations first and unknown concerns last', () => {
    expect(map.boundaries.map((b) => [b.kind, b.label])).toEqual([
      ['region', 'Keystone · 1 skill'],
      ['region', 'Governance · 3 skills'],
      ['region', 'Design · 1 skill'],
      ['region', 'Zeta · 1 skill']
    ])
    expect(map.connections).toEqual([])
  })

  test('orders a concern from always-applicable governance to invocation-only processes', () => {
    expect(map.boundaries[1]?.wraps).toEqual(['ki-root', 'ki-base', 'ki-flow'])
  })

  test('draws each shape as a node type and names it in the sublabel', () => {
    const byId = new Map(map.components.map((c) => [c.id, c]))
    expect(['ki-root', 'ki-base', 'ki-look', 'ki-flow'].map((id) => byId.get(id)?.type)).toEqual([
      'security',
      'backend',
      'database',
      'frontend'
    ])
    expect(byId.get('ki-flow')?.sublabel).toBe('governance · process')
    expect(byId.get('ki-look')?.sublabel).toBe('design · declared')
    expect(byId.get('ki-look')?.tag).toBeUndefined()
    expect(Object.keys(map.meta.legend.entries).sort()).toEqual(['backend', 'database', 'frontend', 'security'])
  })

  test('places every node exactly once without overlap', () => {
    expect(map.components).toHaveLength(FIXTURE.length)
    const corners = map.components.map((c) => c.pos.join(','))
    expect(new Set(corners).size).toBe(corners.length)
  })
})
