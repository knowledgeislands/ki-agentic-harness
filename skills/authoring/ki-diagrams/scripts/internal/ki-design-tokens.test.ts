import { expect, test } from 'bun:test'
import { execFileSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { KI_DESIGN_REVISION, KI_DESIGN_TOKENS, KI_DESIGN_TOKENS_PATH, kiThemeVariables } from './ki-design-tokens.ts'

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

/** The token file at the pinned revision, or `undefined` where the checkout or the revision is not available. */
const pinnedTokens = (): Record<string, unknown> | undefined => {
  const root = kiDesignRoot()
  if (!root) return undefined
  try {
    const text = execFileSync('git', ['show', `${KI_DESIGN_REVISION}:${KI_DESIGN_TOKENS_PATH}`], {
      cwd: root,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore']
    })
    return JSON.parse(text) as Record<string, unknown>
  } catch {
    return undefined
  }
}

const tokens = pinnedTokens()

test.skipIf(tokens === undefined)('the vendored values match ki-design at the pinned revision', () => {
  for (const [path, value] of Object.entries(KI_DESIGN_TOKENS)) {
    const token = path.split('.').reduce<unknown>((node, key) => (node as Record<string, unknown>)?.[key], tokens)
    expect({ path, value: (token as { $value?: unknown })?.$value }).toEqual({ path, value })
  }
})

test('every theme variable is painted from a vendored token in both themes', () => {
  const values = new Set<string>(Object.values(KI_DESIGN_TOKENS).filter((value) => typeof value === 'string'))
  for (const theme of ['light', 'night'] as const) {
    const variables = kiThemeVariables(theme)
    expect(Object.keys(variables)).toContain('--bg')
    for (const value of Object.values(variables)) expect(values.has(value)).toBe(true)
  }
})
