import { describe, expect, test } from 'bun:test'
import { readdirSync, readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { readSkillGraphNodes } from './skill-graph.ts'
import { groupsOf, SKILL_GROUPS, skillGroupIssues } from './skill-groups.ts'

const source = (path: string, frontmatter: string) => ({ path, content: `---\n${frontmatter}\n---\n\n# body\n` })

const skill = (concern: string, name: string) =>
  source(
    `skills/${concern}/${name}/SKILL.md`,
    `name: ${name}\nki-kind: governance\nki-applicability: detected\nki-depends-on: []\ndescription: ${name}.`
  )

const nodes = readSkillGraphNodes([
  skill('governance', 'ki-base'),
  skill('governance', 'ki-wrapper'),
  skill('governance', 'ki-loose'),
  skill('keystone', 'ki-key')
]).nodes

const TABLE = { governance: [{ title: 'Core', skills: ['ki-base', 'ki-wrapper'] }] }

describe('groupsOf', () => {
  test('splits a concern in table order and gathers unlisted skills last', () => {
    const governance = nodes.filter((node) => node.domain === 'governance')
    expect(groupsOf('governance', governance, TABLE).map((g) => [g.title, g.members.map((m) => m.name)])).toEqual([
      ['Core', ['ki-base', 'ki-wrapper']],
      [undefined, ['ki-loose']]
    ])
  })

  test('keeps a concern with no entry as one untitled group', () => {
    const keystone = nodes.filter((node) => node.domain === 'keystone')
    expect(groupsOf('keystone', keystone, TABLE)).toEqual([{ members: keystone }])
  })
})

describe('skillGroupIssues', () => {
  test('reports a missing, an unknown and a doubled skill', () => {
    const table = {
      governance: [
        { title: 'Core', skills: ['ki-base', 'ki-wrapper', 'ki-gone'] },
        { title: 'Again', skills: ['ki-base'] }
      ]
    }
    expect(skillGroupIssues(nodes, table)).toEqual([
      'governance: capability group lists unknown skill ki-gone',
      'governance: ki-base is in more than one capability group',
      'governance: ki-loose is in no capability group'
    ])
  })

  test('places every harness skill of a split concern in exactly one group', () => {
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
    expect(skillGroupIssues(readSkillGraphNodes(sources).nodes, SKILL_GROUPS)).toEqual([])
  })
})
