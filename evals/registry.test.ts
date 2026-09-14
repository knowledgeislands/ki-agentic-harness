import { describe, expect, test } from 'bun:test'
import { readdirSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const EVALS_ROOT = dirname(fileURLToPath(import.meta.url))
const SCENARIOS_ROOT = join(EVALS_ROOT, 'scenarios')
const HARNESS = readFileSync(join(EVALS_ROOT, 'harness.ts'), 'utf8')

const scenarioModules = readdirSync(SCENARIOS_ROOT)
  .filter((entry) => entry.endsWith('.ts'))
  .map((entry) => entry.slice(0, -3))
  .sort()

const scenarioImports = [
  ...HARNESS.matchAll(
    /import\s+\{\s*scenarios\s+as\s+([A-Za-z][A-Za-z0-9]*)\s*\}\s+from\s+'\.\/scenarios\/([^']+)\.ts'/g
  )
].map((match) => ({ alias: match[1] as string, module: match[2] as string }))

const registryBody = /const ALL: Scenario\[\] = \[([\s\S]*?)\n\]/.exec(HARNESS)?.[1] ?? ''
const registeredAliases = [...registryBody.matchAll(/\.\.\.([A-Za-z][A-Za-z0-9]*)/g)].map(
  (match) => match[1] as string
)

describe('evaluation scenario registry', () => {
  test('registers every physical scenario module exactly once', () => {
    const importedModules = scenarioImports.map(({ module }) => module).sort()
    const importedAliases = scenarioImports.map(({ alias }) => alias).sort()

    expect(importedModules).toEqual(scenarioModules)
    expect(new Set(importedModules).size).toBe(importedModules.length)
    expect(new Set(importedAliases).size).toBe(importedAliases.length)
    expect([...registeredAliases].sort()).toEqual(importedAliases)
    expect(new Set(registeredAliases).size).toBe(registeredAliases.length)
  })

  test('uses unique literal scenario identities', () => {
    const identities = scenarioModules.flatMap((module) => {
      const contents = readFileSync(join(SCENARIOS_ROOT, `${module}.ts`), 'utf8')
      return [...contents.matchAll(/\bid:\s*(['"])([^'"\n]+)\1/g)].map((match) => match[2] as string)
    })

    expect(identities.length).toBeGreaterThanOrEqual(scenarioModules.length)
    expect(new Set(identities).size).toBe(identities.length)
  })
})
