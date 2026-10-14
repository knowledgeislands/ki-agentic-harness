import { expect, test } from 'bun:test'
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import {
  acceptExport,
  externalReference,
  locateChrome,
  parseArguments,
  Refusal,
  VERIFIED_ARCHIFY,
  wantsHelp
} from './export-svg.ts'

const CANONICAL = { format: 'svg', canonical: 'true' } as const

test('the arguments name one finalized HTML input and one SVG output', () => {
  expect(parseArguments(['build/a.html', 'docs/diagrams/a.svg'])).toEqual({
    source: resolve('build/a.html'),
    target: resolve('docs/diagrams/a.svg')
  })
  for (const argv of [[], ['a.html'], ['a.html', 'a.svg', 'extra'], ['a.json', 'a.svg'], ['a.html', 'a.png']])
    expect(() => parseArguments(argv)).toThrow(Refusal)
})

test('only fragments and inline data stay inside the file', () => {
  expect(externalReference('<svg><use href="#node"/><image href="data:image/png;base64,AA"/></svg>')).toBeUndefined()
  expect(externalReference('<svg><style>@font-face{src:url(data:font/woff2;base64,AA)}</style></svg>')).toBeUndefined()
  expect(externalReference('<svg xmlns="http://www.w3.org/2000/svg"></svg>')).toBeUndefined()
  expect(externalReference('<svg><a href="https://example.com">x</a></svg>')).toBe('href="h')
  expect(externalReference("<svg><a xlink:href='file:///tmp/x'>x</a></svg>")).toBe("href='f")
  expect(externalReference("<svg><style>a{background:url('fonts/a.woff2')}</style></svg>")).toBe("url('f")
})

test('a download is written only when the viewer calls it canonical and it is self-contained', () => {
  const svg = '<?xml version="1.0"?><svg viewBox="0 0 1 1"></svg>'
  expect(acceptExport(CANONICAL, svg, 'a.svg')).toBe(svg)
  expect(() => acceptExport({ format: 'png', canonical: 'true' }, svg, 'a.png')).toThrow(/canonical SVG/)
  expect(() => acceptExport({ format: 'svg', canonical: null }, svg, 'a.svg')).toThrow(/canonical SVG/)
  expect(() => acceptExport(CANONICAL, '<html></html>', 'a.svg')).toThrow(/not an SVG/)
  expect(() => acceptExport(CANONICAL, '<svg><a href="https://example.com"/></svg>', 'a.svg')).toThrow(
    /external reference/
  )
})

test('without a Chrome or Chromium the export refuses with Archify’s message and names the override', () => {
  // ARCHIFY_CHROME pointing at nothing is the one no-browser case every machine can reproduce.
  expect(() => locateChrome({ ARCHIFY_CHROME: '/nonexistent/chrome' })).toThrow(Refusal)
  expect(() => locateChrome({ ARCHIFY_CHROME: '/nonexistent/chrome' })).toThrow(
    'Chrome or Chromium is unavailable. Set ARCHIFY_CHROME to its executable path.'
  )
  const dir = mkdtempSync(join(tmpdir(), 'ki-diagrams-export-test-'))
  try {
    writeFileSync(join(dir, 'a.html'), '<!doctype html><title>a</title>')
    const result = Bun.spawnSync(['bun', `${import.meta.dir}/export-svg.ts`, join(dir, 'a.html'), join(dir, 'a.svg')], {
      env: { ...process.env, ARCHIFY_CHROME: '/nonexistent/chrome' }
    })
    expect(result.exitCode).toBe(1)
    expect(result.stderr.toString()).toContain('export-svg: Chrome or Chromium is unavailable. Set ARCHIFY_CHROME')
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('help is asked for with -h or --help, prints without a browser, and names the verified Archify release', () => {
  expect(wantsHelp(['--help'])).toBe(true)
  expect(wantsHelp(['a.html', '-h'])).toBe(true)
  expect(wantsHelp(['a.html', 'a.svg'])).toBe(false)
  expect(VERIFIED_ARCHIFY).toMatch(/^\d+\.\d+\.\d+$/)
  const result = Bun.spawnSync(['bun', `${import.meta.dir}/export-svg.ts`, '--help'], {
    env: { ...process.env, ARCHIFY_CHROME: '/nonexistent/chrome' }
  })
  expect(result.exitCode).toBe(0)
  expect(result.stdout.toString()).toContain('usage: bun scripts/export-svg.ts <input.html> <output.svg>')
  expect(result.stdout.toString()).toContain(`Verified against Archify ${VERIFIED_ARCHIFY}`)
})
