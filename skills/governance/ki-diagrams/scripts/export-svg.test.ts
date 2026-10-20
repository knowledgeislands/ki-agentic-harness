import { expect, test } from 'bun:test'
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import {
  acceptExport,
  acceptFlattened,
  dynamicStyle,
  externalReference,
  flatteningFor,
  locateChrome,
  parseArguments,
  Refusal,
  SVG_FORMS,
  VERIFIED_ARCHIFY,
  wantsHelp
} from './export-svg.ts'
import { KI_DESIGN_TOKENS } from './internal/ki-design-tokens.ts'

const CANONICAL = { format: 'svg', canonical: 'true' } as const

test('the arguments name one finalized HTML input, one SVG output and an optional form', () => {
  expect(parseArguments(['build/a.html', 'docs/diagrams/a.svg'])).toEqual({
    source: resolve('build/a.html'),
    target: resolve('docs/diagrams/a.svg'),
    form: 'dual'
  })
  for (const form of SVG_FORMS) {
    expect(parseArguments(['--form', form, 'a.html', 'a.svg']).form).toBe(form)
    expect(parseArguments(['a.html', 'a.svg', '--form', form]).form).toBe(form)
  }
  for (const argv of [[], ['a.html'], ['a.html', 'a.svg', 'extra'], ['a.json', 'a.svg'], ['a.html', 'a.png']])
    expect(() => parseArguments(argv)).toThrow(Refusal)
  for (const argv of [
    ['--form', 'dark', 'a.html', 'a.svg'],
    ['a.html', 'a.svg', '--form']
  ])
    expect(() => parseArguments(argv)).toThrow(/--form must be one of dual, light, ki, ki-night/)
})

test('a flattened SVG is written only when no stylesheet, custom property, font face or external reference is left', () => {
  const svg = '<?xml version="1.0"?><svg viewBox="0 0 1 1"><rect fill="#f5efe0" fill-opacity="0.5"/></svg>'
  expect(dynamicStyle(svg)).toBeUndefined()
  expect(acceptFlattened(svg, 'light')).toBe(svg)
  expect(() => acceptFlattened('<svg><style>rect{fill:red}</style></svg>', 'light')).toThrow(/still carries <style/)
  expect(() => acceptFlattened('<svg><rect fill="var(--bg)"/></svg>', 'ki')).toThrow(/still carries var\(/)
  expect(() => acceptFlattened('<svg><g data-x="@font-face"/></svg>', 'ki')).toThrow(/still carries @font-face/)
  expect(() => acceptFlattened('<svg><a href="https://example.com"/></svg>', 'ki-night')).toThrow(/external/)
  expect(() => acceptFlattened('<html></html>', 'light')).toThrow(/did not return an SVG/)
})

test('each static form flattens under its theme, palette and font stack', () => {
  expect(flatteningFor('light')).toEqual(expect.objectContaining({ theme: 'light', variables: {} }))
  expect(flatteningFor('light').font).not.toContain('JetBrains')
  const day = flatteningFor('ki')
  const night = flatteningFor('ki-night')
  expect([day.theme, night.theme]).toEqual(['light', 'dark'])
  expect(day.variables['--bg']).toBe(KI_DESIGN_TOKENS['color.role.light.paper'])
  expect(day.variables['--text']).toBe(KI_DESIGN_TOKENS['color.role.light.ink'])
  expect(night.variables['--bg']).toBe(KI_DESIGN_TOKENS['color.role.night.paper'])
  expect(night.variables['--text']).toBe(KI_DESIGN_TOKENS['color.role.night.ink'])
  expect(Object.values(day.variables).every((value) => /^#[0-9a-f]{6}$/.test(value))).toBe(true)
  expect(day.font).toBe('ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace')
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
  expect(result.stdout.toString()).toContain(
    'usage: bun scripts/export-svg.ts [--form dual|light|ki|ki-night] <input.html> <output.svg>'
  )
  expect(result.stdout.toString()).toContain(`Verified against Archify ${VERIFIED_ARCHIFY}`)
})
