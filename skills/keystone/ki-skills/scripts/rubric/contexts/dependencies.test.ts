import { describe, expect, test } from 'bun:test'
import { findDependencyCycle, skillMentions } from './dependencies.ts'

describe('skillMentions', () => {
  test('classifies reliance cues and leaves routing mentions unflagged', () => {
    const body = [
      'This adapter composes `ki-binding` and adds its delta.',
      'The lifecycle is owned by `ki-work-roadmap`; route adoption through `ki-next`.',
      'Follow `ki-authoring` for Markdown; apply the `ki-git` policy as defined in `ki-engineering`.',
      '```',
      'fenced `ki-ignored` mention',
      '```'
    ].join('\n')
    expect(skillMentions(body)).toEqual([
      { name: 'ki-binding', line: 1, reliance: true },
      { name: 'ki-work-roadmap', line: 2, reliance: false },
      { name: 'ki-next', line: 2, reliance: false },
      { name: 'ki-authoring', line: 3, reliance: true },
      { name: 'ki-git', line: 3, reliance: true },
      { name: 'ki-engineering', line: 3, reliance: true }
    ])
  })

  test('ignores non-skill ki tokens', () => {
    expect(skillMentions('run `ki repo audit` and read `ki-skills:rubric`')).toEqual([])
  })
})

describe('findDependencyCycle', () => {
  const graph = [
    { name: 'a', dependsOn: ['b'], optionalDependsOn: [] },
    { name: 'b', dependsOn: [], optionalDependsOn: ['c'] },
    { name: 'c', dependsOn: ['a'], optionalDependsOn: [] },
    { name: 'd', dependsOn: ['b'], optionalDependsOn: [] }
  ]

  test('returns the path of a cycle through the start skill', () => {
    expect(findDependencyCycle(graph, 'a')).toEqual(['a', 'b', 'c', 'a'])
  })

  test('returns null when the start skill is not on a cycle', () => {
    expect(findDependencyCycle(graph, 'd')).toBeNull()
  })
})
