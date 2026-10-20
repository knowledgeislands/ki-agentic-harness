import { expect, test } from 'bun:test'
import { execFileSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { KI_DESIGN_ICONS_PATH, KI_DESIGN_REVISION, KI_DESIGN_SYMBOLS_PATH, KI_GLYPHS } from './ki-design-glyphs.ts'

/** The `ki-design` checkout beside this repository's primary checkout, or `KI_DESIGN_ROOT` where it lives elsewhere. */
const kiDesignRoot = (): string | undefined => {
  if (process.env.KI_DESIGN_ROOT) return process.env.KI_DESIGN_ROOT
  const common = execFileSync('git', ['rev-parse', '--path-format=absolute', '--git-common-dir'], {
    cwd: import.meta.dir,
    encoding: 'utf8'
  }).trim()
  const sibling = join(dirname(dirname(common)), 'ki-design')
  return existsSync(join(sibling, '.git')) ? sibling : undefined
}

/** A file at the pinned revision, or `undefined` where the checkout, the revision or the file is not available. */
const pinned = (path: string): string | undefined => {
  const root = kiDesignRoot()
  if (!root) return undefined
  try {
    return execFileSync('git', ['show', `${KI_DESIGN_REVISION}:${path}`], {
      cwd: root,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore']
    })
  } catch {
    return undefined
  }
}

const symbols = pinned(KI_DESIGN_SYMBOLS_PATH)

/** The inner markup of a glyph file, its elements joined without the whitespace between them. */
const innerMarkup = (svg: string): string =>
  svg
    .replace(/^[\s\S]*?<svg[^>]*>/, '')
    .replace(/<\/svg>\s*$/, '')
    .replace(/>\s+</g, '><')
    .trim()

test.skipIf(symbols === undefined)('each vendored glyph matches its ki-design file at the pinned revision', () => {
  for (const { icon, body } of Object.values(KI_GLYPHS)) {
    const file = pinned(`${KI_DESIGN_ICONS_PATH}/${icon}.svg`)
    expect({ icon, body: file && innerMarkup(file) }).toEqual({ icon, body })
  }
})

test.skipIf(symbols === undefined)('each glyph is the icon of the KI symbol that carries its meaning', () => {
  for (const { symbol, icon } of Object.values(KI_GLYPHS)) {
    const entry = (symbols as string).match(new RegExp(`id: '${symbol}',[\\s\\S]*?\\n  \\}`))?.[0]
    expect({ symbol, icon: entry?.match(/icon: '([^']+)'/)?.[1] }).toEqual({ symbol, icon })
  }
})

test('every glyph body is plain shape markup on the 24-unit grid with no paint of its own', () => {
  for (const { body } of Object.values(KI_GLYPHS)) {
    expect(body).toMatch(/^(<(path|circle|rect|ellipse|line|polyline|polygon) [^<>]*\/>)+$/)
    expect(body).not.toMatch(/fill=|stroke=|style=|class=/)
  }
})
