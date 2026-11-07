/**
 * Purpose: Check one exchange dynamics analysis against its JSON Schema and the cross-references the standard sets.
 * Boundary: Pure functions over parsed JSON and optional source text, apart from `loadAnalysisSchema`, which reads the
 * skill's own `assets/eda-analysis.schema.json`. Nothing here writes a file.
 *
 * The schema check interprets only the JSON Schema keywords the analysis schema uses, so the schema file stays the one
 * contract and this module never restates its fields.
 */

import { readFileSync } from 'node:fs'

export type AnalysisIssue = {
  readonly path: string
  readonly message: string
}

type Schema = {
  readonly $ref?: string
  readonly $defs?: Readonly<Record<string, Schema>>
  readonly type?: string
  readonly const?: unknown
  readonly enum?: readonly unknown[]
  readonly required?: readonly string[]
  readonly properties?: Readonly<Record<string, Schema>>
  readonly additionalProperties?: boolean
  readonly items?: Schema
  readonly minItems?: number
  readonly minLength?: number
  readonly minimum?: number
  readonly maximum?: number
}

type Json = Readonly<Record<string, unknown>>

const SCHEMA_URL = new URL('../../assets/eda-analysis.schema.json', import.meta.url)

/** Read the skill's analysis schema. */
export const loadAnalysisSchema = (): Schema => JSON.parse(readFileSync(SCHEMA_URL, 'utf8')) as Schema

const isObject = (value: unknown): value is Json => typeof value === 'object' && value !== null && !Array.isArray(value)

const typeMatches = (type: string, value: unknown): boolean => {
  switch (type) {
    case 'object':
      return isObject(value)
    case 'array':
      return Array.isArray(value)
    case 'integer':
      return Number.isInteger(value)
    case 'number':
      return typeof value === 'number'
    default:
      return typeof value === type
  }
}

const checkSchema = (schema: Schema, value: unknown, path: string, root: Schema, issues: AnalysisIssue[]): void => {
  if (schema.$ref) {
    const name = schema.$ref.replace('#/$defs/', '')
    const target = root.$defs?.[name]
    if (target) checkSchema(target, value, path, root, issues)
    return
  }
  if ('const' in schema && value !== schema.const) {
    issues.push({ path, message: `must be ${JSON.stringify(schema.const)}` })
    return
  }
  if (schema.enum && !schema.enum.includes(value)) {
    issues.push({ path, message: `must be one of ${schema.enum.map((entry) => JSON.stringify(entry)).join(', ')}` })
    return
  }
  if (schema.type && !typeMatches(schema.type, value)) {
    issues.push({ path, message: `must be ${schema.type === 'integer' ? 'an integer' : `of type ${schema.type}`}` })
    return
  }
  if (typeof value === 'string' && schema.minLength !== undefined && value.length < schema.minLength)
    issues.push({ path, message: 'must not be empty' })
  if (typeof value === 'number') {
    if (schema.minimum !== undefined && value < schema.minimum)
      issues.push({ path, message: `must be at least ${schema.minimum}` })
    if (schema.maximum !== undefined && value > schema.maximum)
      issues.push({ path, message: `must be at most ${schema.maximum}` })
  }
  if (Array.isArray(value)) {
    if (schema.minItems !== undefined && value.length < schema.minItems)
      issues.push({ path, message: `must hold at least ${schema.minItems} item${schema.minItems === 1 ? '' : 's'}` })
    const items = schema.items
    if (items)
      value.forEach((item, index) => {
        checkSchema(items, item, `${path}[${index}]`, root, issues)
      })
  }
  if (isObject(value)) {
    for (const key of schema.required ?? [])
      if (!(key in value)) issues.push({ path: `${path}.${key}`, message: 'is required' })
    for (const [key, entry] of Object.entries(value)) {
      const property = schema.properties?.[key]
      if (property) checkSchema(property, entry, `${path}.${key}`, root, issues)
      else if (schema.additionalProperties === false) issues.push({ path: `${path}.${key}`, message: 'is not allowed' })
    }
  }
}

/** The tension band the standard sets for a score. */
export const tensionBand = (score: number): 'green' | 'yellow' | 'amber' | 'red' =>
  score <= 2 ? 'green' : score <= 4 ? 'yellow' : score <= 7 ? 'amber' : 'red'

const span = (from: number, to: number): string => (from === to ? `event ${from}` : `events ${from} to ${to}`)

const normalise = (text: string): string => text.replace(/\s+/g, ' ').trim()

const duplicates = (ids: readonly unknown[]): unknown[] => ids.filter((id, index) => ids.indexOf(id) !== index)

const list = (value: unknown): readonly Json[] => (Array.isArray(value) ? value.filter(isObject) : [])

const numbers = (value: unknown): readonly number[] =>
  Array.isArray(value) ? value.filter((entry): entry is number => Number.isInteger(entry)) : []

const checkReferences = (analysis: Json, source: string | undefined, issues: AnalysisIssue[]): void => {
  const participants = list(analysis.participants)
  const messages = list(analysis.messages)
  const events = list(analysis.events)
  const phases = list(analysis.phases)
  const participantIds = new Set(participants.map(({ id }) => id))
  const messageIds = new Set(messages.map(({ id }) => id))
  const phaseIds = new Set(phases.map(({ id }) => id))
  const eventIds = new Set(events.map(({ id }) => id))

  for (const [part, ids] of [
    ['participants', participants.map(({ id }) => id)],
    ['messages', messages.map(({ id }) => id)],
    ['phases', phases.map(({ id }) => id)]
  ] as const)
    for (const id of new Set(duplicates(ids)))
      issues.push({ path: `$.${part}`, message: `id ${JSON.stringify(id)} is used more than once` })

  events.forEach((event, index) => {
    const path = `$.events[${index}]`
    if (event.id !== index + 1)
      issues.push({ path: `${path}.id`, message: `must be ${index + 1}: events run 1, 2, 3 in order` })
    if (!participantIds.has(event.speaker))
      issues.push({ path: `${path}.speaker`, message: `names no participant: ${JSON.stringify(event.speaker)}` })
    if (!phaseIds.has(event.phase))
      issues.push({ path: `${path}.phase`, message: `names no phase: ${JSON.stringify(event.phase)}` })
    const tension = isObject(event.tension) ? event.tension : {}
    if (typeof tension.score === 'number' && tension.band !== tensionBand(tension.score))
      issues.push({
        path: `${path}.tension.band`,
        message: `must be ${tensionBand(tension.score)} for tension ${tension.score}`
      })
    const evidence = Array.isArray(event.evidence) ? event.evidence : []
    if (messages.length)
      for (const id of evidence)
        if (!messageIds.has(id))
          issues.push({ path: `${path}.evidence`, message: `names no message: ${JSON.stringify(id)}` })
    if (typeof event.quotation === 'string') {
      const quotation = normalise(event.quotation)
      const cited = messages.filter(({ id }) => evidence.includes(id))
      if (source !== undefined && !normalise(source).includes(quotation))
        issues.push({ path: `${path}.quotation`, message: 'does not appear verbatim in the source' })
      else if (
        source === undefined &&
        cited.length &&
        !cited.some(({ text }) => typeof text === 'string' && normalise(text).includes(quotation))
      )
        issues.push({ path: `${path}.quotation`, message: 'does not appear verbatim in the messages it cites' })
    }
  })

  const ordered = [...phases].sort((left, right) => Number(left.from) - Number(right.from))
  let next = 1
  for (const phase of ordered) {
    const path = `$.phases[${phases.indexOf(phase)}]`
    const from = Number(phase.from)
    const to = Number(phase.to)
    if (to < from) issues.push({ path, message: `ends at event ${to} before it starts at ${from}` })
    if (from > next) issues.push({ path, message: `leaves ${span(next, from - 1)} in no phase` })
    if (from < next) issues.push({ path, message: `overlaps the phase before it at event ${from}` })
    for (const event of events)
      if (Number(event.id) >= from && Number(event.id) <= to && event.phase !== phase.id)
        issues.push({
          path: `$.events[${events.indexOf(event)}].phase`,
          message: `must be ${JSON.stringify(phase.id)}, the phase covering event ${event.id}`
        })
    next = Math.max(next, to + 1)
  }
  if (events.length && phases.length && next <= events.length)
    issues.push({ path: '$.phases', message: `leave ${span(next, events.length)} in no phase` })

  const cites = (path: string, ids: readonly number[]) => {
    for (const id of ids) if (!eventIds.has(id)) issues.push({ path, message: `cites no event: ${id}` })
  }
  participants.forEach((participant, index) => {
    cites(`$.participants[${index}].evidence`, numbers(participant.evidence))
  })
  list(analysis.takeaways).forEach((takeaway, index) => {
    cites(`$.takeaways[${index}].events`, numbers(takeaway.events))
  })
  if (isObject(analysis.overall)) cites('$.overall.turning_points', numbers(analysis.overall.turning_points))
}

/**
 * Check one parsed analysis. `source`, when given, is the source transcript every quotation must appear in;
 * otherwise quotations are checked against the indexed messages each event cites.
 */
export const validateAnalysis = (
  analysis: unknown,
  { schema = loadAnalysisSchema(), source }: { readonly schema?: Schema; readonly source?: string } = {}
): readonly AnalysisIssue[] => {
  const issues: AnalysisIssue[] = []
  checkSchema(schema, analysis, '$', schema, issues)
  if (isObject(analysis)) checkReferences(analysis, source, issues)
  return issues
}

/** Whether a parsed JSON document claims to be an exchange dynamics analysis. */
export const isAnalysisDocument = (value: unknown): boolean =>
  isObject(value) && 'schema_version' in value && isObject(value.exchange) && Array.isArray(value.events)
