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
          referencePaths: ['radar.toml', 'standards-model-radar.md', 'standard-formats-change.md', 'notes.md']
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

  test('admits a graph root and cards named by their ids in knowledge/, in subgraph folders', () => {
    const findings = referenceVocabulary.mechanical?.audit.run(
      createKiShapeContext({
        skill: {
          knowledgeIslandsSkill: true,
          kiKind: 'knowledge',
          referencePaths: ['sources.md', 'naming-proposal.md', 'notes.md'],
          knowledgePaths: ['_graph.md', 'industry/industry.session.md', 'specs/mcp/spec.mcp.md', 'stray.md'],
          knowledgeIds: {
            '_graph.md': 'agentic-systems',
            'industry/industry.session.md': 'industry.session',
            'specs/mcp/spec.mcp.md': 'spec.mcp',
            'stray.md': 'other'
          }
        }
      })
    )

    expect(findings).toHaveLength(2)
    expect(findings?.[0]).toMatchObject({ status: 'VIOLATION', subject: 'references/notes.md' })
    expect(findings?.[1]).toMatchObject({ status: 'VIOLATION', subject: 'knowledge/stray.md' })
  })

  test('points a graph card left in references/ to knowledge/', () => {
    const findings = referenceVocabulary.mechanical?.audit.run(
      createKiShapeContext({
        skill: {
          knowledgeIslandsSkill: true,
          kiKind: 'knowledge',
          referencePaths: ['_graph.md', 'industry.session.md', 'sources.md'],
          knowledgePaths: ['_graph.md'],
          knowledgeIds: { '_graph.md': 'agentic-systems' }
        }
      })
    )

    expect(findings).toHaveLength(2)
    for (const finding of findings ?? [])
      expect(finding).toMatchObject({
        status: 'VIOLATION',
        message: expect.stringContaining('belongs in `knowledge/`')
      })
  })

  test('requires a knowledge skill to hold its graph', () => {
    const findings = referenceVocabulary.mechanical?.audit.run(
      createKiShapeContext({
        skill: { knowledgeIslandsSkill: true, kiKind: 'knowledge', referencePaths: ['sources.md'] }
      })
    )

    expect(findings).toHaveLength(1)
    expect(findings[0]).toMatchObject({ status: 'VIOLATION' })
  })

  test('requires knowledge/ to be opened by its root definition', () => {
    const findings = referenceVocabulary.mechanical?.audit.run(
      createKiShapeContext({
        skill: {
          knowledgeIslandsSkill: true,
          kiKind: 'governance',
          referencePaths: ['sources.md'],
          knowledgePaths: ['card.md'],
          knowledgeIds: { 'card.md': 'card' }
        }
      })
    )

    expect(findings).toHaveLength(1)
    expect(findings?.[0]).toMatchObject({
      status: 'VIOLATION',
      message: expect.stringContaining('knowledge/_graph.md')
    })
  })
})

const kind = KI_SHAPE.items.find(({ code }) => code === 'KI-SHAPE-3')
const applicability = KI_SHAPE.items.find(({ code }) => code === 'KI-SHAPE-19')

if (!kind?.mechanical) throw new Error('KI-SHAPE-3 mechanical check missing')
if (!applicability?.mechanical) throw new Error('KI-SHAPE-19 mechanical check missing')

describe('the knowledge kind', () => {
  test('KI-SHAPE-3 accepts governance, process and knowledge and nothing else', () => {
    const status = (kiKind: string) =>
      kind.mechanical?.audit.run(
        createKiShapeContext({ skill: { knowledgeIslandsSkill: true, kiKindPresent: true, kiKind } })
      )[0]?.status
    expect(['governance', 'process', 'knowledge', 'reference'].map(status)).toEqual([
      'PASS',
      'PASS',
      'PASS',
      'VIOLATION'
    ])
  })

  test('KI-SHAPE-19 requires a knowledge skill to be invocation-only', () => {
    const run = (value: string) =>
      applicability.mechanical?.audit.run(
        createKiShapeContext({
          skill: {
            name: 'ki-terms',
            knowledgeIslandsSkill: true,
            kiKind: 'knowledge',
            applicabilityPresent: true,
            applicability: value
          }
        })
      )
    expect(run('invocation-only')?.[0]).toMatchObject({ status: 'PASS' })
    expect(run('declaration-only')?.[0]).toMatchObject({
      status: 'VIOLATION',
      message: 'every knowledge skill must declare `ki-applicability: invocation-only`'
    })
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
          sourceHarnessName: 'ki-agent-backpack',
          dependencyGraph: graph,
          skillMentions: [
            { name: 'ki-b', line: 3, reliance: true },
            { name: 'ki-c', line: 4, reliance: false },
            { name: 'ki-a', line: 5, reliance: true },
            { name: 'ki-agent-backpack', line: 6, reliance: true }
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

const guildMembership = KI_SHAPE.items.find(({ code }) => code === 'KI-SHAPE-22')

if (!guildMembership?.mechanical) throw new Error('KI-SHAPE-22 mechanical check missing')

describe('KI-SHAPE-22', () => {
  const run = (skill: Parameters<typeof createKiShapeContext>[0]['skill']) =>
    (guildMembership.mechanical?.audit.run(createKiShapeContext({ skill })) ?? []).map(({ status, message }) => [
      status,
      message
    ])

  test('passes a member and a lead that declare their guilds', () => {
    expect(run({ knowledgeIslandsSkill: true, name: 'ki-git', guildPresent: true, guild: 'repository' })).toEqual([
      ['PASS', 'guild membership is declared']
    ])
    expect(
      run({
        knowledgeIslandsSkill: true,
        name: 'ki-repo',
        guildPresent: true,
        guild: 'keystone',
        leadsPresent: true,
        leads: 'repository'
      })
    ).toEqual([['PASS', 'guild membership is declared']])
  })

  test('requires the guild key on every canonical skill, never on ki-self', () => {
    expect(run({ knowledgeIslandsSkill: true, name: 'ki-git' })).toEqual([
      ['VIOLATION', 'missing required `ki-guild:` metadata']
    ])
    expect(run({ knowledgeIslandsSkill: true, name: 'ki-self' })[0]?.[0]).toBe('NOT_APPLICABLE')
    expect(run({ knowledgeIslandsSkill: false, name: 'other' })[0]?.[0]).toBe('NOT_APPLICABLE')
  })

  test('keeps every lead in Keystone and Keystone led by ki-keystone alone', () => {
    expect(
      run({
        knowledgeIslandsSkill: true,
        name: 'ki-work',
        guildPresent: true,
        guild: 'work',
        leadsPresent: true,
        leads: 'work'
      })
    ).toEqual([['VIOLATION', 'a lead skill is a member of Keystone and declares `ki-guild: keystone`']])
    expect(
      run({
        knowledgeIslandsSkill: true,
        name: 'ki-repo',
        guildPresent: true,
        guild: 'keystone',
        leadsPresent: true,
        leads: 'keystone'
      })
    ).toEqual([['VIOLATION', 'only `ki-keystone` leads Keystone']])
    expect(run({ knowledgeIslandsSkill: true, name: 'ki-keystone', guildPresent: true, guild: 'keystone' })).toEqual([
      ['VIOLATION', '`ki-keystone` must declare `ki-leads: keystone`']
    ])
    expect(run({ knowledgeIslandsSkill: true, name: 'ki-git', guildPresent: true, guild: 'Repository' })).toEqual([
      ['VIOLATION', '`ki-guild:` must be one kebab-case guild name']
    ])
  })
})
