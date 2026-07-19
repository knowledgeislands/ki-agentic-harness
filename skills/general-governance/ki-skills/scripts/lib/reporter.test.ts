#!/usr/bin/env bun
import { describe, expect, test } from 'bun:test'
import { parseReporterArguments } from './reporter.ts'

describe('checker reporter arguments', () => {
  test('defaults to JSONL and preserves checker arguments', () => {
    expect(parseReporterArguments(['target', '--dry-run'])).toEqual({
      arguments: ['target', '--dry-run'],
      options: { reporter: 'jsonl' }
    })
  })

  test('selects terminal reporting and normalises levels', () => {
    expect(parseReporterArguments(['--reporter', 'terminal', '--reporter-levels=fail,pass', 'target'])).toEqual({
      arguments: ['target'],
      options: { reporter: 'terminal', levels: ['FAIL', 'PASS'] }
    })
  })

  test('rejects filtered canonical JSONL', () => {
    expect(() => parseReporterArguments(['--reporter-levels=all'])).toThrow('--reporter-levels requires --reporter=terminal')
  })

  test('rejects an unknown reporter', () => {
    expect(() => parseReporterArguments(['--reporter=markdown'])).toThrow('--reporter accepts jsonl or terminal')
  })
})
