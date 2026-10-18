import { describe, expect, test } from 'bun:test'
import { createKiShapeContext } from '../contexts/contexts.ts'
import { KI_SHAPE } from './ki-shape.ts'

const referenceVocabulary = KI_SHAPE.items.find(({ code }) => code === 'KI-SHAPE-6')

if (!referenceVocabulary?.mechanical) throw new Error('KI-SHAPE-6 mechanical check missing')

describe('KI-SHAPE-6', () => {
  test('checks only top-level Markdown reference names', () => {
    const findings = referenceVocabulary.mechanical?.audit.run(
      createKiShapeContext({
        skill: {
          knowledgeIslandsSkill: true,
          referencePaths: ['radar.toml', 'standards-model-radar.md', 'notes.md']
        }
      })
    )

    expect(findings).toHaveLength(1)
    expect(findings[0]).toMatchObject({
      status: 'VIOLATION',
      subject: 'references/notes.md'
    })
  })

  test('allows non-Markdown reference artifacts', () => {
    const findings = referenceVocabulary.mechanical?.audit.run(
      createKiShapeContext({
        skill: {
          knowledgeIslandsSkill: true,
          referencePaths: ['radar.toml']
        }
      })
    )

    expect(findings).toHaveLength(1)
    expect(findings[0]).toMatchObject({ status: 'PASS' })
  })
})

const dependencyResolution = KI_SHAPE.items.find(({ code }) => code === 'KI-SHAPE-20')
const bodyReferences = KI_SHAPE.items.find(({ code }) => code === 'KI-SHAPE-21')

if (!dependencyResolution?.mechanical) throw new Error('KI-SHAPE-20 mechanical check missing')
if (!bodyReferences?.mechanical) throw new Error('KI-SHAPE-21 mechanical check missing')

const graph = [
  { name: 'ki-a', dependsOn: ['ki-b'], optionalDependsOn: [] },
  { name: 'ki-b', dependsOn: [], optionalDependsOn: ['ki-c'] },
  { name: 'ki-c', dependsOn: [], optionalDependsOn: [] }
]

describe('KI-SHAPE-20', () => {
  test('passes when declarations resolve to siblings without a cycle', () => {
    const findings = dependencyResolution.mechanical?.audit.run(
      createKiShapeContext({
        skill: { name: 'ki-a', dependsOn: '[ki-b]', optionalDependsOn: '', dependencyGraph: graph }
      })
    )
    expect(findings).toEqual([{ status: 'PASS', message: expect.stringContaining('acyclic') }])
  })

  test('is not applicable without sibling evidence', () => {
    const findings = dependencyResolution.mechanical?.audit.run(
      createKiShapeContext({ skill: { name: 'ki-a', dependsOn: '[ki-b]' } })
    )
    expect(findings?.[0]).toMatchObject({ status: 'NOT_APPLICABLE' })
  })

  test('rejects an unknown, self-referential or doubly declared name', () => {
    const findings = dependencyResolution.mechanical?.audit.run(
      createKiShapeContext({
        skill: { name: 'ki-a', dependsOn: '[ki-zzz]', optionalDependsOn: '', dependencyGraph: graph }
      })
    )
    expect(findings).toEqual([{ status: 'VIOLATION', message: expect.stringContaining('`ki-zzz`') }])

    const self = dependencyResolution.mechanical?.audit.run(
      createKiShapeContext({ skill: { name: 'ki-a', dependsOn: '[ki-a]', dependencyGraph: graph } })
    )
    expect(self?.[0]).toMatchObject({ status: 'VIOLATION', message: expect.stringContaining('itself') })

    const both = dependencyResolution.mechanical?.audit.run(
      createKiShapeContext({
        skill: {
          name: 'ki-a',
          dependsOn: '[ki-b]',
          optionalDependsOnPresent: true,
          optionalDependsOn: '[ki-b]',
          dependencyGraph: graph
        }
      })
    )
    expect(both?.[0]).toMatchObject({ status: 'VIOLATION', message: expect.stringContaining('both') })
  })

  test('rejects a malformed optional list', () => {
    const findings = dependencyResolution.mechanical?.audit.run(
      createKiShapeContext({
        skill: { name: 'ki-a', dependsOn: '[]', optionalDependsOnPresent: true, optionalDependsOn: 'ki-b' }
      })
    )
    expect(findings?.[0]).toMatchObject({ status: 'VIOLATION', message: expect.stringContaining('flow list') })
  })

  test('reports a cycle across hard and optional edges', () => {
    const cyclic = [...graph.slice(0, 2), { name: 'ki-c', dependsOn: ['ki-a'], optionalDependsOn: [] }]
    const findings = dependencyResolution.mechanical?.audit.run(
      createKiShapeContext({ skill: { name: 'ki-a', dependsOn: '[ki-b]', dependencyGraph: cyclic } })
    )
    expect(findings).toEqual([
      { status: 'VIOLATION', message: 'dependency declarations form a cycle: `ki-a` → `ki-b` → `ki-c` → `ki-a`' }
    ])
  })
})

describe('KI-SHAPE-21', () => {
  test('passes when mentions resolve and reliance is declared', () => {
    const findings = bodyReferences.mechanical?.audit.run(
      createKiShapeContext({
        skill: {
          name: 'ki-a',
          dependsOn: '[ki-b]',
          sourceHarnessName: 'ki-agentic-harness',
          dependencyGraph: graph,
          skillMentions: [
            { name: 'ki-b', line: 3, reliance: true },
            { name: 'ki-c', line: 4, reliance: false },
            { name: 'ki-a', line: 5, reliance: true },
            { name: 'ki-agentic-harness', line: 6, reliance: true }
          ]
        }
      })
    )
    expect(findings).toEqual([{ status: 'PASS', message: expect.stringContaining('declared') }])
  })

  test('flags an unresolved name once and an undeclared reliance once', () => {
    const findings = bodyReferences.mechanical?.audit.run(
      createKiShapeContext({
        skill: {
          name: 'ki-a',
          dependsOn: '[]',
          dependencyGraph: graph,
          skillMentions: [
            { name: 'ki-coordination', line: 2, reliance: false },
            { name: 'ki-coordination', line: 9, reliance: true },
            { name: 'ki-c', line: 7, reliance: true },
            { name: 'ki-c', line: 8, reliance: true }
          ]
        }
      })
    )
    expect(findings).toEqual([
      { status: 'VIOLATION', message: 'line 2 references `ki-coordination`, which is not a skill in this collection' },
      {
        status: 'VIOLATION',
        message: 'line 7 relies on `ki-c` without declaring it in ki-depends-on or ki-optional-depends-on'
      }
    ])
  })
})
