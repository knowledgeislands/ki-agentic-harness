import { expect, test } from 'bun:test'
import { resolve } from 'node:path'
import { acceptExport, externalReference, parseArguments, Refusal, wantsHelp } from './export-svg.ts'

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

test('help is asked for with -h or --help and prints without Playwright', () => {
  expect(wantsHelp(['--help'])).toBe(true)
  expect(wantsHelp(['a.html', '-h'])).toBe(true)
  expect(wantsHelp(['a.html', 'a.svg'])).toBe(false)
  const result = Bun.spawnSync(['bun', `${import.meta.dir}/export-svg.ts`, '--help'])
  expect(result.exitCode).toBe(0)
  expect(result.stdout.toString()).toContain('usage: bun scripts/export-svg.ts <input.html> <output.svg>')
})
