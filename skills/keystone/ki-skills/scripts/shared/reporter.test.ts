#!/usr/bin/env bun
import { describe, expect, test } from 'bun:test'
import { createTerminalStatusTracker, parseProgressArguments, parseReporterArguments } from './reporter.ts'

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

  test('rejects missing reporter argument values', () => {
    expect(() => parseReporterArguments(['--reporter'])).toThrow('--reporter requires a value')
    expect(() => parseReporterArguments(['--reporter='])).toThrow('--reporter requires a value')
    expect(() => parseReporterArguments(['--reporter-levels'])).toThrow('--reporter-levels requires a value')
    expect(() => parseReporterArguments(['--reporter-levels='])).toThrow('--reporter-levels requires a value')
  })

  test('selects a progress mode independently of reporting', () => {
    expect(parseProgressArguments(['--progress=always', 'target'])).toEqual({
      arguments: ['target'],
      mode: 'always'
    })
    expect(() => parseProgressArguments(['--progress=soon'])).toThrow('--progress accepts auto, always, never')
  })

  test('renders progress on its separate status channel', () => {
    const lines: string[] = []
    const tracker = createTerminalStatusTracker({ mode: 'always', interactive: false, write: (line) => lines.push(line) })
    tracker?.({ type: 'start', mode: 'audit', completed: 0, total: 2 })
    tracker?.({ type: 'item-complete', mode: 'audit', completed: 1, total: 2, code: 'NAME-1', title: 'name matches', phase: 'INSPECT' })
    tracker?.({ type: 'complete', mode: 'audit', completed: 2, total: 2 })
    expect(lines).toEqual([
      'AUDIT [............] 0/2 starting\n',
      'AUDIT [######......] 1/2 NAME-1: name matches\n',
      'AUDIT [############] 2/2 complete\n'
    ])
  })

  test('suppresses progress when disabled or non-interactive in auto mode', () => {
    expect(createTerminalStatusTracker({ mode: 'never', interactive: true, write: () => undefined })).toBeUndefined()
    expect(createTerminalStatusTracker({ mode: 'auto', interactive: false, write: () => undefined })).toBeUndefined()
  })

  test('clears an interactive line and terminates a failed tracker', () => {
    const lines: string[] = []
    const tracker = createTerminalStatusTracker({ mode: 'auto', interactive: true, write: (line) => lines.push(line) })
    tracker?.({ type: 'failed', mode: 'conform', completed: 2, total: 4 })
    expect(lines).toEqual(['\r\x1b[2KCONFORM [######......] 2/4 failed\n'])
  })
})
