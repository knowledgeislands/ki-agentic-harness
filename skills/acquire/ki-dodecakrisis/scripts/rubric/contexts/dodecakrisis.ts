import { existsSync, readFileSync, statSync } from 'node:fs'
import { resolve } from 'node:path'
import type { RubricContextOptions, RubricPublicationContext, RubricSession } from '../../shared/rubric.ts'

const TOML = (globalThis as unknown as { Bun: { TOML: { parse(text: string): unknown } } }).Bun.TOML

/** The outcomes a rule may name and a correction may record: the seven queues and the two exits. */
export const OUTCOMES = [
  'Determine',
  'Decide',
  'Discuss',
  'Delegate',
  'Defer',
  'Dormant',
  'Digest',
  'Deposit',
  'Delete'
] as const

export type Entry = Readonly<Record<string, unknown>>

/** A repository file named by a configuration property, read and parsed once. */
export type FileEvidence<Value> = {
  /** The configured value, which may not be a string. */
  readonly configured: unknown
  readonly exists: boolean
  readonly parseError?: string
  readonly value?: Value
}

export type RulesFile = {
  readonly guards: readonly Entry[]
  readonly routes: readonly Entry[]
  readonly rules: readonly Entry[]
}

export type CorrectionLine = { readonly line: number; readonly value?: unknown; readonly error?: string }

export type DodecakrisisContext = {
  readonly configurationKeys: readonly string[]
  /** The raw `mailboxes` property, absent when not configured. */
  readonly mailboxes: unknown
  readonly mailboxNames: readonly string[]
  readonly rules: FileEvidence<RulesFile>
  readonly corrections: FileEvidence<readonly CorrectionLine[]>
  readonly rubric: RubricPublicationContext
}

const isTable = (value: unknown): value is Entry => typeof value === 'object' && value !== null && !Array.isArray(value)

const entries = (value: unknown): readonly Entry[] => (Array.isArray(value) ? value.filter(isTable) : [])

const readFile = <Value>(
  repository: string,
  configured: unknown,
  parse: (text: string) => Value
): FileEvidence<Value> => {
  if (typeof configured !== 'string' || configured === '') return { configured, exists: false }
  const path = resolve(repository, configured)
  if (!existsSync(path) || !statSync(path).isFile()) return { configured, exists: false }
  try {
    return { configured, exists: true, value: parse(readFileSync(path, 'utf8')) }
  } catch (error) {
    return { configured, exists: true, parseError: error instanceof Error ? error.message : String(error) }
  }
}

const parseRules = (text: string): RulesFile => {
  const parsed = TOML.parse(text)
  const table = isTable(parsed) ? parsed : {}
  return { guards: entries(table.guard), routes: entries(table.route), rules: entries(table.rule) }
}

const parseCorrections = (text: string): readonly CorrectionLine[] =>
  text.split('\n').flatMap((raw, index): CorrectionLine[] => {
    if (raw.trim() === '') return []
    try {
      return [{ line: index + 1, value: JSON.parse(raw) as unknown }]
    } catch (error) {
      return [{ line: index + 1, error: error instanceof Error ? error.message : String(error) }]
    }
  })

export const createDodecakrisisSession = ({
  repository,
  configuration,
  publication
}: RubricContextOptions): RubricSession<DodecakrisisContext> => {
  const { mailboxes } = configuration
  const context: DodecakrisisContext = {
    configurationKeys: Object.keys(configuration).sort(),
    mailboxes,
    mailboxNames: isTable(mailboxes) ? Object.keys(mailboxes).sort() : [],
    rules: readFile(repository, configuration.rules, parseRules),
    corrections: readFile(repository, configuration.corrections, parseCorrections),
    rubric: { publication }
  }
  return {
    subjects: [
      { families: ['CONFIG'], context: () => context },
      { families: ['RULES'], context: () => context },
      { families: ['MAILBOX'], context: () => context },
      { families: ['LEARN'], context: () => context },
      { families: ['RUBRIC'], context: () => context }
    ],
    proposal: () => ({ writes: [] })
  }
}
