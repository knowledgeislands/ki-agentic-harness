import { expect, test } from 'bun:test'
import {
  AREA_CODE,
  isAreaCode,
  isRepositoryCode,
  prefixedIdentifierSource,
  SCOPE,
  SCOPE_SEGMENT,
  workIdentifier
} from './work-identifiers.ts'

test('an area code may lead with a digit but must contain a letter', () => {
  for (const code of ['5GE', 'GOV', 'P2', 'A', '2A3']) expect(isAreaCode(code)).toBe(true)
  for (const code of ['555', '0', '', '5ge', 'G-E', ' GE']) expect(isAreaCode(code)).toBe(false)
  expect(isAreaCode(5)).toBe(false)
})

test('the scope segment composes into larger anchored patterns', () => {
  expect(new RegExp(`^(${SCOPE_SEGMENT}):\\s*(\\d+)$`).exec('5GE: 12')?.slice(1)).toEqual(['5GE', '12'])
  expect(AREA_CODE.test('5GE')).toBe(true)
})

test('a repository code may lead with a digit and is at most 24 characters', () => {
  for (const code of ['5GE-P2', 'KI-HARNESS', 'A'.repeat(24), 'AB']) expect(isRepositoryCode(code)).toBe(true)
  for (const code of ['A'.repeat(25), 'A', '-KI', 'ki', '', undefined]) expect(isRepositoryCode(code)).toBe(false)
})

test('a work identifier takes a digit-leading code, a serial of three or more digits, and an optional infix', () => {
  expect(workIdentifier().test('5GE-P2-DATA-008')).toBe(true)
  expect(workIdentifier().test('KI-HARNESS-GOV-1024')).toBe(true)
  expect(workIdentifier().test(`${'A'.repeat(24)}-001`)).toBe(true)
  expect(workIdentifier().test(`${'A'.repeat(25)}-001`)).toBe(false)
  expect(workIdentifier().test('KI-HARNESS-GOV-12')).toBe(false)
  expect(workIdentifier('HK').test('5GE-P2-HK-001')).toBe(true)
  expect(workIdentifier('BATCH').test('5GE-P2-BATCH-0012')).toBe(true)
  expect(workIdentifier('BATCH').test('5GE-P2-0012')).toBe(false)
})

test('a scope rejects an all-digit segment and a prefixed identifier composes the supplied prefixes', () => {
  const scope = new RegExp(`^${SCOPE}$`)
  for (const value of ['KI-HARNESS', '5GE-P2', 'KI']) expect(scope.test(value)).toBe(true)
  for (const value of ['KI-5', '55', 'KI-', '-KI']) expect(scope.test(value)).toBe(false)
  const decision = new RegExp(`^${prefixedIdentifierSource(['ADR', 'GDR'], '(?:XXX|\\d{3,})')}$`)
  for (const value of ['ADR-5GE-P2-001', 'GDR-KI-XXX', 'ADR-KI-HARNESS-SKILLS-0015']) {
    expect(decision.test(value)).toBe(true)
  }
  for (const value of ['SDR-KI-001', 'ADR-KI-5-001', 'ADR-KI-01']) expect(decision.test(value)).toBe(false)
  expect(new RegExp(`^${prefixedIdentifierSource(['REQ'])}$`).test('REQ-KI-001')).toBe(true)
})
