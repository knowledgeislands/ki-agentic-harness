import { describe, expect, test } from 'bun:test'
import { buildSkillArea, SKILL_AREAS, skillAreaPath } from './skill-areas.ts'
import { prepareSkillDiagram, SKILL_DIAGRAMS } from './skill-diagrams.ts'
import { readSkillGraphNodes, renderSkillGraph } from './skill-graph.ts'

const source = (path: string, frontmatter: string) => ({ path, content: `---\n${frontmatter}\n---\n\n# body\n` })

const skill = (concern: string, name: string, extra = '') =>
  source(
    `skills/${concern}/${name}/SKILL.md`,
    `name: ${name}\nki-kind: governance\nki-applicability: detected\n${extra || 'ki-depends-on: []\n'}description: ${name}.`
  )

const FIXTURE = [
  skill('governance', 'ki-base'),
  skill('governance', 'ki-alone'),
  skill('governance', 'ki-wrapper', 'ki-depends-on: [ki-base]\n'),
  skill('governance', 'ki-user', 'ki-depends-on: [ki-key]\n'),
  skill('keystone', 'ki-key'),
  skill('repo-structure', 'ki-leaf', 'ki-depends-on: [ki-base]\n'),
  source(
    'skills/change-management/ki-flow/SKILL.md',
    'name: ki-flow\nki-kind: process\nki-applicability: invocation-only\nki-depends-on: []\nki-optional-depends-on: [ki-wrapper]\ndescription: Flow.'
  )
]

type Area = {
  meta: { title: string; output: string; repository?: { revision: string } }
  components: { id: string; type: string; pos: [number, number] }[]
  boundaries: { kind: string; label: string; wraps: string[] }[]
  connections: { id: string; from: string; to: string; variant: string }[]
}

/** The rows of a diagram, top to bottom, each listing its components left to right. */
const grid = (diagram: Area): string[][] => {
  const rows = [...new Set(diagram.components.map((c) => c.pos[1]))].sort((p, q) => p - q)
  return rows.map((y) =>
    diagram.components
      .filter((c) => c.pos[1] === y)
      .sort((p, q) => p.pos[0] - q.pos[0])
      .map((c) => c.id)
  )
}

const OPTIONS = { repositoryUrl: 'https://example.invalid/harness', revision: 'a'.repeat(40) }
const nodes = readSkillGraphNodes(FIXTURE).nodes
const area = buildSkillArea('governance')(nodes, OPTIONS) as Area

describe('buildSkillArea', () => {
  test('wraps every skill of the concern, connected or not, in one region', () => {
    const own = area.boundaries.find((boundary) => boundary.label.startsWith('Governance'))
    expect(own?.wraps.sort()).toEqual(['ki-alone', 'ki-base', 'ki-user', 'ki-wrapper'])
    expect(own?.label).toBe('Governance · 4 skills')
  })

  test('groups outside prerequisites and dependents by concern', () => {
    expect(area.boundaries.map((boundary) => [boundary.label, [...boundary.wraps].sort()]).sort()).toEqual([
      ['Change Management · 1 skill', ['ki-flow']],
      ['Governance · 4 skills', ['ki-alone', 'ki-base', 'ki-user', 'ki-wrapper']],
      ['Keystone · 1 skill', ['ki-key']],
      ['Repo Structure · 1 skill', ['ki-leaf']]
    ])
  })

  test("nests a split concern's capability groups and titles outside regions by group", () => {
    const groups = {
      governance: [
        { title: 'Core', skills: ['ki-base', 'ki-wrapper'] },
        { title: 'Edge', skills: ['ki-alone', 'ki-user'] }
      ]
    }
    const split = buildSkillArea('governance')(nodes, { ...OPTIONS, groups }) as Area
    const labels = new Map(split.boundaries.map((b) => [b.label, [...b.wraps].sort()]))
    expect(labels.get('Governance · Core')).toEqual(['ki-base', 'ki-wrapper'])
    expect(labels.get('Governance · Edge')).toEqual(['ki-alone', 'ki-user'])
    expect(labels.get('Governance · 4 skills')).toEqual(['ki-alone', 'ki-base', 'ki-user', 'ki-wrapper'])
    const flow = buildSkillArea('change-management')(nodes, { ...OPTIONS, groups }) as Area
    expect(flow.boundaries.map((b) => b.label).sort()).toEqual(['Change Management · 1 skill', 'Governance · Core'])
  })

  test('draws only edges that touch the concern, solid or dashed by declaration', () => {
    expect(area.connections.map((c) => [c.id, c.variant])).toEqual([
      ['ki-flow--ki-wrapper', 'dashed'],
      ['ki-leaf--ki-base', 'default'],
      ['ki-user--ki-key', 'default'],
      ['ki-wrapper--ki-base', 'default']
    ])
  })

  test('places dependents above the concern, prerequisites below it, and every outside edge downward', () => {
    const y = new Map(area.components.map((c) => [c.id, c.pos[1]]))
    const own = ['ki-alone', 'ki-base', 'ki-user', 'ki-wrapper']
    for (const edge of area.connections.filter((c) => !own.includes(c.from) || !own.includes(c.to)))
      expect(y.get(edge.from) ?? 0).toBeLessThan(y.get(edge.to) ?? 0)
    const ownY = own.map((id) => y.get(id) ?? 0)
    expect(y.get('ki-flow') ?? 0).toBeLessThan(Math.min(...ownY))
    expect(y.get('ki-key') ?? 0).toBeGreaterThan(Math.max(...ownY))
  })

  test('places every node exactly once without overlap', () => {
    expect(area.components).toHaveLength(7)
    const corners = area.components.map((c) => c.pos.join(','))
    expect(new Set(corners).size).toBe(corners.length)
  })

  test('names its output under the local diagrams area and records the revision', () => {
    expect(area.meta.output).toBe('+/diagrams/skill-area-governance/skill-area-governance.html')
    expect(area.meta.repository?.revision).toBe('a'.repeat(40))
  })

  test('lays the agentic systems out as a compact block: hub first, its dependents beside it', () => {
    const agentic = buildSkillArea('agentic-systems')(
      readSkillGraphNodes([
        skill('agentic-systems', 'ki-subagents'),
        skill('agentic-systems', 'ki-subagents-claude', 'ki-depends-on: [ki-subagents]\n'),
        skill('agentic-systems', 'ki-subagents-chatgpt', 'ki-depends-on: [ki-subagents]\n'),
        skill('agentic-systems', 'ki-agent-coordination-paperclip', 'ki-depends-on: [ki-git]\n'),
        skill('governance', 'ki-git'),
        skill('repo-structure', 'ki-repo-harness', 'ki-depends-on: [ki-subagents]\n')
      ]).nodes
    ) as Area
    expect(grid(agentic)).toEqual([
      ['ki-repo-harness'],
      ['ki-subagents', 'ki-subagents-claude'],
      ['ki-agent-coordination-paperclip', 'ki-subagents-chatgpt'],
      ['ki-git']
    ])
    const x = new Map(agentic.components.map((c) => [c.id, c.pos[0]]))
    for (const id of ['ki-repo-harness', 'ki-agent-coordination-paperclip', 'ki-git'])
      expect(x.get(id)).toBe(x.get('ki-subagents'))
    expect(x.get('ki-subagents-chatgpt')).toBe(x.get('ki-subagents-claude'))
  })

  test('gives a skill with outside links above and below a column of its own', () => {
    const through = buildSkillArea('governance')(
      readSkillGraphNodes([
        ...FIXTURE,
        skill('governance', 'ki-bridge', 'ki-depends-on: [ki-key]\n'),
        skill('environment', 'ki-top', 'ki-depends-on: [ki-bridge]\n')
      ]).nodes
    ) as Area
    const pos = new Map(through.components.map((c) => [c.id, c.pos]))
    const [bridgeX] = pos.get('ki-bridge') ?? [0, 0]
    const own = through.boundaries.find((b) => b.label.startsWith('Governance'))?.wraps ?? []
    expect(own.filter((id) => pos.get(id)?.[0] === bridgeX)).toEqual(['ki-bridge'])
  })

  test('draws a concern with no relationships as its region alone', () => {
    const lone = buildSkillArea('design')(readSkillGraphNodes([...FIXTURE, skill('design', 'ki-look')]).nodes) as Area
    expect(lone.components.map((c) => c.id)).toEqual(['ki-look'])
    expect(lone.connections).toEqual([])
  })
})

describe('the area diagram set', () => {
  test('registers one generated source per concern after the skill map', () => {
    expect(SKILL_DIAGRAMS.map((diagram) => diagram.path)).toEqual([
      'docs/diagrams/skill-map.architecture.json',
      ...SKILL_AREAS.map(skillAreaPath)
    ])
  })

  test('is deterministic and ignores only the revision when compared', () => {
    const diagram = SKILL_DIAGRAMS.find(
      (d) => d.path === skillAreaPath('governance')
    ) as (typeof SKILL_DIAGRAMS)[number]
    const rendered = renderSkillGraph(area)
    expect(prepareSkillDiagram(diagram, rendered, FIXTURE, { ...OPTIONS, revision: 'b'.repeat(40) }).state).toBe(
      'in-sync'
    )
    expect(prepareSkillDiagram(diagram, undefined, FIXTURE).state).toBe('missing')
    expect(prepareSkillDiagram(diagram, rendered.replace('"dashed"', '"default"'), FIXTURE, OPTIONS).state).toBe(
      'stale'
    )
  })
})
