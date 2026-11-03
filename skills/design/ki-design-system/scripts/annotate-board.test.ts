import { expect, test } from 'bun:test'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { annotate, parseArguments } from './annotate-board.ts'
import { PlanError } from './internal/board.ts'

const png = (width: number, height: number): Uint8Array => {
  const bytes = new Uint8Array(24)
  bytes.set([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
  new DataView(bytes.buffer).setUint32(16, width)
  new DataView(bytes.buffer).setUint32(20, height)
  return bytes
}

test('the arguments name a verb, its files and, for annotate, the source revision', () => {
  expect(parseArguments([])).toEqual({ kind: 'help' })
  expect(parseArguments(['annotate', '--help'])).toEqual({ kind: 'help' })
  expect(parseArguments(['collector', 'board.json'])).toEqual({ kind: 'collector', plan: resolve('board.json') })
  expect(
    parseArguments(['annotate', 'p.json', 'r.json', 'out', '--revision', 'abc1234'], new Date('2026-11-03'))
  ).toEqual({
    kind: 'annotate',
    plan: resolve('p.json'),
    regions: resolve('r.json'),
    out: resolve('out'),
    revision: 'abc1234',
    date: '2026-11-03'
  })
  for (const argv of [
    ['annotate', 'p.json', 'r.json', 'out'],
    ['annotate', 'p.json', 'r.json', 'out', '--revision'],
    ['annotate', 'p.json', 'r.json', 'out', '--revision', 'a', '--date', '3 Nov'],
    ['collector'],
    ['collector', 'p.json', '--revision', 'a'],
    ['publish', 'p.json'],
    ['annotate', 'p.json', 'r.json', 'out', '--force']
  ])
    expect(() => parseArguments(argv)).toThrow(PlanError)
})

test('annotate writes the coded board and one preview per artboard, and nothing else', () => {
  const root = mkdtempSync(join(tmpdir(), 'ki-board-'))
  try {
    mkdirSync(join(root, 'shots'))
    writeFileSync(join(root, 'shots/home.png'), png(1440, 900))
    writeFileSync(
      join(root, 'plan.json'),
      JSON.stringify({
        collector: { shells: [] },
        boards: [{ id: '1', title: 'Home', shot: 'home', image: 'shots/home.png', zones: ['page'] }]
      })
    )
    writeFileSync(
      join(root, 'regions.json'),
      JSON.stringify({ home: [{ zone: 'page', label: 'Page title', x: 240, y: 20, w: 600, h: 40 }] })
    )
    const out = join(root, 'out')
    const built = annotate({
      kind: 'annotate',
      plan: join(root, 'plan.json'),
      regions: join(root, 'regions.json'),
      out,
      revision: 'abc1234',
      date: '2026-11-03'
    })
    expect(built.map((b) => [b.id, b.width, b.height, b.legend])).toEqual([['1', 1440, 900, ['P1 Page title']]])
    const board = JSON.parse(readFileSync(join(out, 'board.json'), 'utf8'))
    expect(board).toMatchObject({ revision: 'abc1234', refreshed: '2026-11-03' })
    const preview = readFileSync(join(out, 'preview/1.html'), 'utf8')
    expect(preview).toContain('data-region="P1"')
    expect(preview).toContain('refreshed from abc1234, 2026-11-03')
    writeFileSync(join(root, 'regions.json'), JSON.stringify({}))
    expect(() =>
      annotate({
        kind: 'annotate',
        plan: join(root, 'plan.json'),
        regions: join(root, 'regions.json'),
        out,
        revision: 'a',
        date: '2026-11-03'
      })
    ).toThrow(/no list for shot home/)
    expect(existsSync(join(root, 'out/preview'))).toBe(true)
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
})
