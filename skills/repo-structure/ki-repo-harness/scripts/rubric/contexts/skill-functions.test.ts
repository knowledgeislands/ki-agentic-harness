import { describe, expect, test } from 'bun:test'
import { readdirSync, readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import {
  areaGroupTitle,
  areasOf,
  FUNCTIONAL_AREAS,
  type FunctionalArea,
  functionalAreaIssues,
  groupsOf,
  homeOf
} from './skill-functions.ts'
import { readSkillGraphNodes } from './skill-graph.ts'

const source = (path: string, frontmatter: string) => ({ path, content: `---\n${frontmatter}\n---\n\n# body\n` })

const skill = (concern: string, name: string) =>
  source(
    `skills/${concern}/${name}/SKILL.md`,
    `name: ${name}\nki-kind: governance\nki-applicability: detected\nki-depends-on: []\ndescription: ${name}.`
  )

const nodes = readSkillGraphNodes([
  skill('governance', 'ki-base'),
  skill('governance', 'ki-wrapper'),
  skill('keystone', 'ki-key')
]).nodes

const area = (slug: string, groups: FunctionalArea['groups']): FunctionalArea => ({
  slug,
  title: slug.toUpperCase(),
  short: slug,
  purpose: slug,
  groups
})

const TABLE = [
  area('core', [
    { title: 'Base', skills: ['ki-base', 'ki-key'] },
    { title: 'Wrappers', skills: ['ki-wrapper'] }
  ]),
  area('extra', [{ skills: ['ki-wrapper', 'ki-gone'] }])
]

describe('functional areas', () => {
  test('a skill serves every area that lists it, and its home is the first', () => {
    expect(areasOf('ki-wrapper', TABLE).map((each) => each.slug)).toEqual(['core', 'extra'])
    expect(homeOf('ki-wrapper', TABLE)?.group.title).toBe('Wrappers')
    expect(homeOf('ki-loose', TABLE)).toBeUndefined()
  })

  test('groups keep table order, drop absent skills and title by area then group', () => {
    const [core, extra] = TABLE as [FunctionalArea, FunctionalArea]
    expect(groupsOf(core, nodes).map((g) => [g.title, g.members.map((m) => m.name)])).toEqual([
      ['Base', ['ki-base', 'ki-key']],
      ['Wrappers', ['ki-wrapper']]
    ])
    expect(groupsOf(extra, nodes)).toEqual([{ members: nodes.filter((node) => node.name === 'ki-wrapper') }])
    expect(areaGroupTitle(core, { title: 'Base', skills: [] })).toBe('CORE · Base')
    expect(areaGroupTitle(extra, { skills: [] })).toBe('EXTRA')
  })

  test('reports a skill in no area, an unknown skill and a skill twice in one area', () => {
    const table = [
      area('core', [
        { title: 'Base', skills: ['ki-base'] },
        { title: 'Again', skills: ['ki-base'] }
      ])
    ]
    expect(functionalAreaIssues(nodes, [...table, ...TABLE.slice(1)])).toEqual([
      'core: ki-base is in more than one group',
      'extra: lists unknown skill ki-gone',
      'ki-key is in no functional area'
    ])
  })

  test('every harness skill appears in at least one functional area diagram', () => {
    const root = resolve(import.meta.dir, '../../../../../..')
    const sources = readdirSync(join(root, 'skills'), { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .flatMap((concern) =>
        readdirSync(join(root, 'skills', concern.name), { withFileTypes: true })
          .filter((entry) => entry.isDirectory())
          .map((entry) => `skills/${concern.name}/${entry.name}/SKILL.md`)
      )
      .flatMap((path) => {
        try {
          return [{ path, content: readFileSync(join(root, path), 'utf8') }]
        } catch {
          return []
        }
      })
    const real = readSkillGraphNodes(sources).nodes
    expect(real.length).toBeGreaterThan(0)
    expect(functionalAreaIssues(real, FUNCTIONAL_AREAS)).toEqual([])
  })
})
