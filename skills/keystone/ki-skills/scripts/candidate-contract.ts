#!/usr/bin/env bun

import { readFileSync } from 'node:fs'

export const candidateDispositions = [
  'keep-as-guidance',
  'move-to-reference',
  'extract-script',
  'new-skill',
  'new-agent-or-hook',
  'not-worth-formalising'
] as const
export const roadmapTreatments = ['new-item', 'amend-existing-item', 'no-roadmap-work'] as const

type CandidateDisposition = (typeof candidateDispositions)[number]
type RoadmapTreatment = (typeof roadmapTreatments)[number]

export type CandidateFinding = {
  title: string
  evidence: readonly string[]
  disposition: CandidateDisposition
  roadmap: { treatment: RoadmapTreatment; locator?: string }
}

export type RoadmapItem = { locator: string; title: string }

const locatorPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*\/[a-z0-9]+(?:-[a-z0-9]+)*$/

const isRecord = (value: unknown): value is Record<string, unknown> => value !== null && typeof value === 'object' && !Array.isArray(value)

const nonEmptyString = (value: unknown): value is string => typeof value === 'string' && value.trim().length > 0

const normaliseTitle = (title: string): string =>
  title
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ')

export const validateCandidate = (candidate: unknown): string[] => {
  if (!isRecord(candidate)) return ['candidate must be an object']

  const errors: string[] = []
  if (!nonEmptyString(candidate.title)) errors.push('title must be a non-empty string')
  if (!Array.isArray(candidate.evidence) || candidate.evidence.length === 0 || !candidate.evidence.every(nonEmptyString)) {
    errors.push('evidence must contain at least one non-empty string')
  }
  if (typeof candidate.disposition !== 'string' || !candidateDispositions.includes(candidate.disposition as CandidateDisposition)) {
    errors.push(`disposition must be one of: ${candidateDispositions.join(', ')}`)
  }
  if (!isRecord(candidate.roadmap)) {
    errors.push('roadmap must be an object')
    return errors
  }

  const treatment = candidate.roadmap.treatment
  if (typeof treatment !== 'string' || !roadmapTreatments.includes(treatment as RoadmapTreatment)) {
    errors.push(`roadmap.treatment must be one of: ${roadmapTreatments.join(', ')}`)
    return errors
  }

  const locator = candidate.roadmap.locator
  if (treatment === 'amend-existing-item') {
    if (!nonEmptyString(locator) || !locatorPattern.test(locator)) errors.push('an amendment requires a qualified roadmap locator')
  } else if (locator !== undefined) {
    errors.push('only an amendment may name a roadmap locator')
  }
  return errors
}

/** Exact normalised-title matches are reconciliation prompts, never automatic duplicate decisions. */
export const matchingRoadmapItems = (title: string, items: readonly RoadmapItem[]): RoadmapItem[] => {
  const normalised = normaliseTitle(title)
  return items.filter((item) => normaliseTitle(item.title) === normalised)
}

export const validateCandidateSet = (value: unknown): string[] => {
  if (!isRecord(value) || !Array.isArray(value.candidates)) return ['candidate document must contain a candidates array']
  return value.candidates.flatMap((candidate, index) => validateCandidate(candidate).map((error) => `candidates[${index}]: ${error}`))
}

const usage = `Usage: bun scripts/candidate-contract.ts --validate <candidates.json>

Validate a read-only ki-skills REVIEW or EXTRACT candidate report. The file must
contain { "candidates": [...] }; this command never writes repository state.`

const main = (argv: readonly string[]): number => {
  if (argv.length === 1 && ['-h', '--help', '?'].includes(argv[0])) {
    console.log(usage)
    return 0
  }
  if (argv.length !== 2 || argv[0] !== '--validate') {
    console.error(usage)
    return 1
  }
  let value: unknown
  try {
    value = JSON.parse(readFileSync(argv[1], 'utf8')) as unknown
  } catch (error) {
    console.error(`cannot read candidate document: ${error instanceof Error ? error.message : String(error)}`)
    return 1
  }
  const errors = validateCandidateSet(value)
  if (errors.length > 0) {
    console.error('FAIL candidate contract')
    for (const error of errors) console.error(`  - ${error}`)
    return 1
  }
  const count = (value as { candidates: unknown[] }).candidates.length
  console.log(`PASS candidate contract — ${count} candidate${count === 1 ? '' : 's'}`)
  return 0
}

if (import.meta.main) process.exit(main(process.argv.slice(2)))
