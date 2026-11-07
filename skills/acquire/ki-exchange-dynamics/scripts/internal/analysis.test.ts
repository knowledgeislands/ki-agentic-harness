import { expect, test } from 'bun:test'
import { readFileSync } from 'node:fs'
import { isAnalysisDocument, tensionBand, validateAnalysis } from './analysis.ts'

const EXAMPLE = new URL('../../assets/examples/allotment-tool-shed/', import.meta.url)
const example = (): Record<string, any> => JSON.parse(readFileSync(new URL('analysis.json', EXAMPLE), 'utf8'))
const transcript = readFileSync(new URL('transcript.md', EXAMPLE), 'utf8')

test('the invented example passes against its transcript and against its own message index', () => {
  expect(validateAnalysis(example(), { source: transcript })).toEqual([])
  expect(validateAnalysis(example())).toEqual([])
  expect(isAnalysisDocument(example())).toBe(true)
  expect(isAnalysisDocument({ name: 'package' })).toBe(false)
})

test('tension bands follow the standard’s scale', () => {
  expect([0, 2, 3, 4, 5, 7, 8, 10].map(tensionBand)).toEqual([
    'green',
    'green',
    'yellow',
    'yellow',
    'amber',
    'amber',
    'red',
    'red'
  ])
})

test('schema faults name their path', () => {
  const analysis = example()
  analysis.schema_version = 2
  analysis.events[0].tension.score = 11
  analysis.events[1].sentiment.score = 1.5
  analysis.participants[0].mood = 'cheerful'
  delete analysis.overall.resolution
  expect(validateAnalysis(analysis)).toEqual(
    expect.arrayContaining([
      { path: '$.schema_version', message: 'must be 1' },
      { path: '$.events[0].tension.score', message: 'must be at most 10' },
      { path: '$.events[1].sentiment.score', message: 'must be an integer' },
      { path: '$.participants[0].mood', message: 'is not allowed' },
      { path: '$.overall.resolution', message: 'is required' }
    ])
  )
})

test('cross-references are checked: speakers, phases, bands, citations and order', () => {
  const analysis = example()
  analysis.events[0].speaker = 'ghost'
  analysis.events[1].tension.band = 'green'
  analysis.events[2].phase = 'clarification'
  analysis.events[3].evidence = ['m99']
  analysis.events[8].id = 10
  analysis.takeaways[0].events = [42]
  analysis.overall.turning_points = [12]
  expect(validateAnalysis(analysis)).toEqual(
    expect.arrayContaining([
      { path: '$.events[0].speaker', message: 'names no participant: "ghost"' },
      { path: '$.events[1].tension.band', message: 'must be amber for tension 6' },
      { path: '$.events[2].phase', message: 'must be "escalation", the phase covering event 3' },
      { path: '$.events[3].evidence', message: 'names no message: "m99"' },
      { path: '$.events[8].id', message: 'must be 9: events run 1, 2, 3 in order' },
      { path: '$.takeaways[0].events', message: 'cites no event: 42' },
      { path: '$.overall.turning_points', message: 'cites no event: 12' }
    ])
  )
})

test('phases must cover the events with no gap or overlap', () => {
  const gap = example()
  gap.phases.splice(4, 1)
  expect(validateAnalysis(gap)).toContainEqual({ path: '$.phases[4]', message: 'leaves event 7 in no phase' })

  const overlap = example()
  overlap.phases[3].from = 4
  expect(validateAnalysis(overlap)).toContainEqual({
    path: '$.phases[3]',
    message: 'overlaps the phase before it at event 4'
  })

  const short = example()
  short.phases.pop()
  expect(validateAnalysis(short)).toContainEqual({ path: '$.phases', message: 'leave event 9 in no phase' })
})

test('quotations must appear verbatim in the source or the messages they cite', () => {
  const analysis = example()
  analysis.events[3].quotation = 'Minutes are pointless.'
  expect(validateAnalysis(analysis, { source: transcript })).toContainEqual({
    path: '$.events[3].quotation',
    message: 'does not appear verbatim in the source'
  })
  expect(validateAnalysis(analysis)).toContainEqual({
    path: '$.events[3].quotation',
    message: 'does not appear verbatim in the messages it cites'
  })
})
