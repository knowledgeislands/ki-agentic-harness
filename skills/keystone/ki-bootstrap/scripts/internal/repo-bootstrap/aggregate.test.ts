#!/usr/bin/env bun
import { describe, expect, test } from 'bun:test'
import { createAggregateProgress } from './aggregate.ts'

const terminalLinePrefix = `\r${String.fromCharCode(27)}[2K`
const withoutControl = (line: string): string => line.replace(terminalLinePrefix, '').replace(/\n$/u, '')

describe('aggregate progress presentation', () => {
  test('keeps single-row columns stable through startup, discovery, active work, and completion', () => {
    const lines: string[] = []
    const progress = createAggregateProgress('audit', 'always', 'single', ['ki-skills'], {
      interactive: false,
      columns: () => 80,
      write: (line) => lines.push(line)
    })

    progress.initialise()
    progress.discover(1, 1)
    progress.planned(10, new Map([['ki-skills', 10]]))
    progress.start()
    progress.active(5, 'ki-skills', 5, 10, 'SHAPE-2')
    progress.complete()

    const rendered = lines.map(withoutControl)
    expect(rendered).toHaveLength(5)
    expect(rendered.every((line) => line.length <= 80)).toBe(true)
    expect(rendered.map((line) => line.indexOf('['))).toEqual([11, 11, 11, 11, 11])
    expect(rendered.map((line) => line.match(/\[[#.>]+\]/u)?.[0].length)).toEqual([34, 34, 34, 34, 34])
    expect(rendered.map((line) => line.indexOf(']') + 2)).toEqual([46, 46, 46, 46, 46])
    expect(rendered[0]).toContain('initialising')
    expect(rendered[1]).toContain('reading checker plans 1/1')
    expect(rendered[2]).toContain('0/10 0% starting')
    expect(rendered[3]).toContain('5/10 50% SHAPE-2')
    expect(rendered[4]).toContain('10/10 100% complete')
  })

  test('recalculates three-zone columns after a terminal resize and compacts narrow output', () => {
    const lines: string[] = []
    let columns = 32
    const progress = createAggregateProgress('conform', 'always', 'single', ['ki-skills'], {
      interactive: true,
      columns: () => columns,
      write: (line) => lines.push(line)
    })

    progress.planned(10, new Map([['ki-skills', 10]]))
    progress.start()
    columns = 120
    progress.active(5, 'ki-skills', 5, 10, 'SHAPE-2')
    columns = 14
    progress.failed(5, 'ki-skills', 5, 10)

    const rendered = lines.map(withoutControl)
    expect(rendered[0]).toContain('CONFORM    [')
    expect(rendered[0].match(/\[[#.>]+\]/u)?.[0]).toHaveLength(10)
    expect(rendered[1].match(/\[[#.>]+\]/u)?.[0]).toHaveLength(54)
    expect(rendered[0].length).toBeLessThanOrEqual(32)
    expect(rendered[1].length).toBeLessThanOrEqual(120)
    expect(rendered[2]).toBe('5/10 50% fa...')
  })

  test('uses width-safe snapshots for multi-row output and stays silent when disabled', () => {
    const lines: string[] = []
    const progress = createAggregateProgress('audit', 'always', 'multi', ['ki-skills', 'ki-very-long-skill-name'], {
      interactive: false,
      columns: () => 32,
      write: (line) => lines.push(line)
    })

    progress.planned(
      3,
      new Map([
        ['ki-skills', 2],
        ['ki-very-long-skill-name', 1]
      ])
    )
    progress.active(1, 'ki-skills', 1, 2, 'SHAPE-2')
    progress.complete()

    const snapshots = lines.flatMap((line) => line.split('\n').filter(Boolean).map(withoutControl))
    expect(snapshots).toHaveLength(4)
    expect(snapshots.every((line) => line.length <= 32)).toBe(true)
    expect(snapshots.every((line) => line.includes('...'))).toBe(true)

    const quiet: string[] = []
    createAggregateProgress('audit', 'never', 'single', ['ki-skills'], {
      interactive: true,
      columns: () => 80,
      write: (line) => quiet.push(line)
    }).initialise()
    expect(quiet).toEqual([])
  })
})
