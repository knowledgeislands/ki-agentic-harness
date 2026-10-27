import { describe, expect, test } from 'bun:test'
import { readdirSync, readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { SKILL_AREAS, skillAreaPath } from './skill-areas.ts'
import { prepareSkillDiagram, SKILL_DIAGRAMS } from './skill-diagrams.ts'
import { readSkillGraphNodes } from './skill-graph.ts'
import { readSkillStats } from './skill-stats.ts'

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
        'name: ki-dangling\nki-kind: governance\nki-applicability: detected\nki-depends-on: [ki-coordination]\ndescription: Dangling.'
      )
    ])
    expect(nodes.map((node) => node.name)).toEqual(['ki-base', 'ki-dangling', 'ki-flow', 'ki-leaf'])
    expect(nodes.find((node) => node.name === 'ki-flow')?.optionalDependsOn).toEqual(['ki-base'])
    expect(issues).toEqual(['skills/governance/ki-dangling/SKILL.md: depends on unknown skill `ki-coordination`'])
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

  test('draws every skill in at least one functional-area diagram', () => {
    const names = readSkillGraphNodes(sources).nodes.map((node) => node.name)
    const drawn = new Set(
      SKILL_AREAS.flatMap((area) => {
        const diagram = JSON.parse(readFileSync(join(root, skillAreaPath(area.slug)), 'utf8')) as {
          boundaries: { label: string; wraps: string[] }[]
        }
        return diagram.boundaries.find((b) => b.label.startsWith(`${area.title} · `))?.wraps ?? []
      })
    )
    expect(names.filter((name) => !drawn.has(name))).toEqual([])
  })

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
        revision: '0'.repeat(40),
        stats: readSkillStats(root, sources)
      })
      expect(draft.issues).toEqual([])
      expect(draft.state).toBe('in-sync')
    })
})
