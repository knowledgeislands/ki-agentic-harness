import { expect, test } from 'bun:test'
import { cpSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createExchangeDynamicsSession } from '../contexts/exchange-dynamics.ts'
import { ANALYSIS } from './analysis.ts'
import { CONFIG } from './configuration.ts'

const EXAMPLE = new URL('../../../assets/examples/allotment-tool-shed/', import.meta.url)

const session = (repository: string, configuration: Record<string, unknown> = {}) =>
  createExchangeDynamicsSession({
    mode: 'audit',
    repository,
    userHome: repository,
    configuration,
    packageScriptClaims: []
  })

const contextFor = (repository: string, family: string, configuration: Record<string, unknown> = {}) => {
  const subject = session(repository, configuration).subjects.find(({ families }) => families.includes(family))
  if (!subject) throw new Error(`Missing ${family} subject`)
  return subject.context()
}

const auditAnalyses = (repository: string) => {
  const mechanical = ANALYSIS.items[0]?.mechanical
  if (!mechanical) throw new Error('Missing ANALYSIS-1')
  return mechanical.audit.run(contextFor(repository, 'ANALYSIS'))
}

const withRepository = (run: (repository: string) => void) => {
  const repository = mkdtempSync(join(tmpdir(), 'ki-exchange-dynamics-'))
  try {
    run(repository)
  } finally {
    rmSync(repository, { recursive: true, force: true })
  }
}

test('invented settings are reported and no writes are proposed', () => {
  withRepository((repository) => {
    expect(CONFIG.items[0]?.mechanical.audit.run(contextFor(repository, 'CONFIG', { palette: 'warm' }))).toEqual([
      { status: 'VIOLATION', message: 'Unsupported exchange dynamics property: palette' }
    ])
    expect(session(repository).proposal()).toEqual({ writes: [] })
    expect(session(repository).subjects.flatMap(({ families }) => families)).toEqual([
      'CONFIG',
      'ANALYSIS',
      'SAFE',
      'RENDER',
      'RUBRIC'
    ])
  })
})

test('a repository with no analysis is not applicable, and other analysis.json files are ignored', () => {
  withRepository((repository) => {
    writeFileSync(join(repository, 'analysis.json'), JSON.stringify({ name: 'something else' }))
    expect(auditAnalyses(repository)).toEqual([
      { status: 'NOT_APPLICABLE', message: 'No exchange dynamics analysis is committed here.' }
    ])
  })
})

test('committed analyses are validated against their sources', () => {
  withRepository((repository) => {
    const folder = join(repository, 'analyses', 'shed')
    cpSync(EXAMPLE, folder, { recursive: true })
    const audit = () => auditAnalyses(repository)
    expect(audit()).toEqual([
      { status: 'PASS', subject: 'analyses/shed/analysis.json', message: 'The analysis passes the contract.' }
    ])
    writeFileSync(join(folder, 'transcript.md'), 'A different exchange.')
    expect(audit()).toContainEqual({
      status: 'VIOLATION',
      subject: 'analyses/shed/analysis.json',
      message: '$.events[0].quotation does not appear verbatim in the source'
    })
    rmSync(join(folder, 'transcript.md'))
    expect(audit()).toContainEqual({
      status: 'VIOLATION',
      subject: 'analyses/shed/analysis.json',
      message: '$.exchange.source names a source that does not exist'
    })
  })
})
