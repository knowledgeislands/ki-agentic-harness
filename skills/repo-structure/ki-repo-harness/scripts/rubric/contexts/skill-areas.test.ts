import { describe, expect, test } from 'bun:test'
import { buildSkillArea, SKILL_AREAS, skillAreaPath } from './skill-areas.ts'
import { prepareSkillDiagram, SKILL_DIAGRAMS } from './skill-diagrams.ts'
import type { FunctionalArea } from './skill-functions.ts'
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

const functional = (slug: string, title: string, groups: FunctionalArea['groups']): FunctionalArea => ({
  slug,
  title,
  short: slug,
  purpose: `serve ${slug}`,
  groups
})

const CORE = functional('core', 'Core', [{ skills: ['ki-base', 'ki-alone', 'ki-wrapper', 'ki-user'] }])
const TABLE = [
  CORE,
  functional('keys', 'Keys', [{ skills: ['ki-key'] }]),
  functional('leaves', 'Leaves', [{ skills: ['ki-leaf'] }]),
  functional('flows', 'Flows', [{ skills: ['ki-flow'] }])
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

const OPTIONS = { repositoryUrl: 'https://example.invalid/harness', revision: 'a'.repeat(40), areas: TABLE }
const nodes = readSkillGraphNodes(FIXTURE).nodes
const area = buildSkillArea(CORE)(nodes, OPTIONS) as Area

describe('buildSkillArea', () => {
  test('wraps every skill of the area, connected or not, in one region titled by function', () => {
    const own = area.boundaries.find((boundary) => boundary.label.startsWith('Core'))
    expect([...(own?.wraps ?? [])].sort()).toEqual(['ki-alone', 'ki-base', 'ki-user', 'ki-wrapper'])
    expect(own?.label).toBe('Core · 4 skills')
    expect(area.meta.title).toBe('Knowledge Islands skills · Core')
  })

  test('labels each skill by its full name and names its source concern in the sublabel', () => {
    const flow = (area.components as unknown as { id: string; label: string; sublabel: string }[]).find(
      (c) => c.id === 'ki-flow'
    )
    expect(flow?.label).toBe('ki-flow')
    expect(flow?.sublabel).toBe('change management · command')
  })

  test('groups outside prerequisites and dependents by home area', () => {
    expect(area.boundaries.map((boundary) => [boundary.label, [...boundary.wraps].sort()]).sort()).toEqual([
      ['Core · 4 skills', ['ki-alone', 'ki-base', 'ki-user', 'ki-wrapper']],
      ['Flows · 1 skill', ['ki-flow']],
      ['Keys · 1 skill', ['ki-key']],
      ['Leaves · 1 skill', ['ki-leaf']]
    ])
  })

  test("nests an area's capability groups and titles outside regions by area and group", () => {
    const split = functional('core', 'Core', [
      { title: 'Base', skills: ['ki-base', 'ki-wrapper'] },
      { title: 'Edge', skills: ['ki-alone', 'ki-user'] }
    ])
    const areas = [split, ...TABLE.slice(1)]
    const built = buildSkillArea(split)(nodes, { ...OPTIONS, areas }) as Area
    const labels = new Map(built.boundaries.map((b) => [b.label, [...b.wraps].sort()]))
    expect(labels.get('Base')).toEqual(['ki-base', 'ki-wrapper'])
    expect(labels.get('Edge')).toEqual(['ki-alone', 'ki-user'])
    expect(labels.get('Core · 4 skills')).toEqual(['ki-alone', 'ki-base', 'ki-user', 'ki-wrapper'])
    const flow = buildSkillArea(areas[3] as FunctionalArea)(nodes, { ...OPTIONS, areas }) as Area
    expect(flow.boundaries.map((b) => b.label).sort()).toEqual(['Core · Base', 'Flows · 1 skill'])
  })

  test('draws a member whose home is another area with only its edges inside this one', () => {
    const shared = functional('flows', 'Flows', [{ skills: ['ki-flow', 'ki-wrapper'] }])
    const areas = [CORE, ...TABLE.slice(1, 3), shared]
    const built = buildSkillArea(shared)(nodes, { ...OPTIONS, areas }) as Area
    expect(built.connections.map((c) => c.id)).toEqual(['ki-flow--ki-wrapper'])
    expect(built.components.map((c) => c.id).sort()).toEqual(['ki-flow', 'ki-wrapper'])
  })

  test('draws only edges that touch the area, solid or dashed by declaration', () => {
    expect(area.connections.map((c) => [c.id, c.variant])).toEqual([
      ['ki-flow--ki-wrapper', 'dashed'],
      ['ki-leaf--ki-base', 'default'],
      ['ki-user--ki-key', 'default'],
      ['ki-wrapper--ki-base', 'default']
    ])
  })

  test('places dependents above the area, prerequisites below it, and every outside edge downward', () => {
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
    expect(area.meta.output).toBe('+/diagrams/skill-area-core/skill-area-core.html')
    expect(area.meta.repository?.revision).toBe('a'.repeat(40))
  })

  test('lays the agentic systems out as a compact block: hub first, its dependents beside it', () => {
    const areas = [
      functional('agentic', 'Agentic', [
        {
          skills: ['ki-subagents', 'ki-subagents-claude', 'ki-subagents-chatgpt', 'ki-agent-coordination-paperclip']
        }
      ]),
      functional('base', 'Base', [{ skills: ['ki-git', 'ki-repo-harness'] }])
    ]
    const agentic = buildSkillArea(areas[0] as FunctionalArea)(
      readSkillGraphNodes([
        skill('agentic-systems', 'ki-subagents'),
        skill('agentic-systems', 'ki-subagents-claude', 'ki-depends-on: [ki-subagents]\n'),
        skill('agentic-systems', 'ki-subagents-chatgpt', 'ki-depends-on: [ki-subagents]\n'),
        skill('agentic-systems', 'ki-agent-coordination-paperclip', 'ki-depends-on: [ki-git]\n'),
        skill('governance', 'ki-git'),
        skill('repo-structure', 'ki-repo-harness', 'ki-depends-on: [ki-subagents]\n')
      ]).nodes,
      { areas }
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
    const bridged = functional('core', 'Core', [
      { skills: ['ki-base', 'ki-alone', 'ki-wrapper', 'ki-user', 'ki-bridge'] }
    ])
    const through = buildSkillArea(bridged)(
      readSkillGraphNodes([
        ...FIXTURE,
        skill('governance', 'ki-bridge', 'ki-depends-on: [ki-key]\n'),
        skill('environment', 'ki-top', 'ki-depends-on: [ki-bridge]\n')
      ]).nodes,
      { areas: [bridged, ...TABLE.slice(1), functional('top', 'Top', [{ skills: ['ki-top'] }])] }
    ) as Area
    const pos = new Map(through.components.map((c) => [c.id, c.pos]))
    const [bridgeX] = pos.get('ki-bridge') ?? [0, 0]
    const own = through.boundaries.find((b) => b.label.startsWith('Core'))?.wraps ?? []
    expect(own.filter((id) => pos.get(id)?.[0] === bridgeX)).toEqual(['ki-bridge'])
  })

  test('draws an area with no relationships as its region alone', () => {
    const look = functional('look', 'Look', [{ skills: ['ki-look'] }])
    const lone = buildSkillArea(look)(readSkillGraphNodes([...FIXTURE, skill('design', 'ki-look')]).nodes, {
      areas: [...TABLE, look]
    }) as Area
    expect(lone.components.map((c) => c.id)).toEqual(['ki-look'])
    expect(lone.connections).toEqual([])
  })
})

describe('the area diagram set', () => {
  test('registers one generated source per functional area after the skill map', () => {
    expect(SKILL_DIAGRAMS.map((diagram) => diagram.path)).toEqual([
      'docs/diagrams/skill-map.architecture.json',
      ...SKILL_AREAS.map((each) => skillAreaPath(each.slug))
    ])
  })

  test('is deterministic and ignores only the revision when compared', () => {
    const diagram = { path: skillAreaPath(CORE.slug), build: buildSkillArea(CORE) }
    const rendered = renderSkillGraph(buildSkillArea(CORE)(nodes, OPTIONS))
    expect(prepareSkillDiagram(diagram, rendered, FIXTURE, { ...OPTIONS, revision: 'b'.repeat(40) }).state).toBe(
      'in-sync'
    )
    expect(prepareSkillDiagram(diagram, undefined, FIXTURE).state).toBe('missing')
    expect(prepareSkillDiagram(diagram, rendered.replace('"dashed"', '"default"'), FIXTURE, OPTIONS).state).toBe(
      'stale'
    )
  })
})
