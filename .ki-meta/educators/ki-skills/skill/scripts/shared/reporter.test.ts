#!/usr/bin/env bun
import { describe, expect, test } from 'bun:test'
import { createTerminalStatusTracker, parseCheckerArguments, parseProgressArguments, parseReporterArguments } from './reporter.ts'

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

  test('composes progress and reporter options for checker commands', () => {
    expect(parseCheckerArguments(['--progress=always', '--reporter=terminal', '--reporter-levels=warn', 'target'])).toEqual({
      arguments: ['target'],
      options: { reporter: 'terminal', levels: ['WARN'] },
      progress: 'always'
    })
  })

  test('renders progress on its separate status channel', () => {
    const lines: string[] = []
    const tracker = createTerminalStatusTracker({ mode: 'always', interactive: false, write: (line) => lines.push(line) })
    tracker?.({ type: 'start', mode: 'audit', completed: 0, total: 2 })
    tracker?.({ type: 'item-complete', mode: 'audit', completed: 1, total: 2, code: 'NAME-1', title: 'name matches', phase: 'INSPECT' })
    tracker?.({ type: 'complete', mode: 'audit', completed: 2, total: 2 })
    expect(lines).toHaveLength(3)
    expect(lines[0]).toContain('AUDIT [')
    expect(lines[0]).toContain('0/2 0% starting')
    expect(lines[1]).toContain('1/2 50% NAME-1')
    expect(lines[2]).toContain('2/2 100% complete')
    expect(lines.every((line) => line.trimEnd().length <= 80)).toBe(true)
  })

  test('suppresses progress when disabled or non-interactive in auto mode', () => {
    expect(createTerminalStatusTracker({ mode: 'never', interactive: true, write: () => undefined })).toBeUndefined()
    expect(createTerminalStatusTracker({ mode: 'auto', interactive: false, write: () => undefined })).toBeUndefined()
  })

  test('clears an interactive line and terminates a failed tracker', () => {
    const lines: string[] = []
    const tracker = createTerminalStatusTracker({ mode: 'auto', interactive: true, write: (line) => lines.push(line) })
    tracker?.({ type: 'failed', mode: 'conform', completed: 2, total: 4 })
    expect(lines).toEqual(['\r\x1b[2KCONFORM [###########################............................] 2/4 50% failed\n'])
  })

  test('does not display a complete bar before the last item or for no planned work', () => {
    const lines: string[] = []
    const tracker = createTerminalStatusTracker({ mode: 'always', interactive: false, write: (line) => lines.push(line) })
    tracker?.({ type: 'item-complete', mode: 'audit', completed: 2, total: 3, code: 'SHAPE-2', title: 'unused', phase: 'INSPECT' })
    tracker?.({ type: 'complete', mode: 'audit', completed: 0, total: 0 })
    expect(lines[0]).toContain('2/3 67% SHAPE-2')
    expect(lines[0]).not.toContain('100%')
    expect(lines[1]).toContain('0/0 100% complete')
  })

  test('recalculates the three-zone layout at each interactive redraw', () => {
    const lines: string[] = []
    let columns = 32
    const tracker = createTerminalStatusTracker({
      mode: 'always',
      interactive: true,
      columns: () => columns,
      write: (line) => lines.push(line)
    })
    tracker?.({ type: 'start', mode: 'conform', completed: 0, total: 10 })
    columns = 120
    tracker?.({ type: 'item-complete', mode: 'conform', completed: 5, total: 10, code: 'SHAPE-2', title: 'unused', phase: 'INSPECT' })
    expect(lines[0]).toContain('CONFORM [')
    expect(lines[0]).toContain('0/10 0% starting')
    expect(lines[1]).toContain('5/10 50% SHAPE-2')
    expect(lines.every((line, index) => line.slice('\r\x1b[2K'.length).length <= (index === 0 ? 32 : 120))).toBe(true)
  })

  test('uses a compact, non-wrapping form for narrow terminals', () => {
    const lines: string[] = []
    const tracker = createTerminalStatusTracker({ mode: 'always', interactive: true, columns: () => 14, write: (line) => lines.push(line) })
    tracker?.({ type: 'failed', mode: 'conform', completed: 5, total: 10 })
    expect(lines).toEqual(['\r\x1b[2K5/10 50% fail…\n'])
  })
})
