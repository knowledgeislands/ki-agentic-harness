import { execSync } from 'node:child_process'
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import type { ConformOutcome, RubricOutcomes } from '../../vendored/ki-skills/rubric.ts'

export type McpRubricContext = {
  root: string
  dryRun: boolean
  rootExists: boolean
  applicable: boolean
  config: string | null
  configMalformed: boolean
  configTable: Record<string, unknown> | null
  packageJson: Record<string, unknown> | null
  packageMalformed: boolean
  exists: (...parts: string[]) => boolean
  isDir: (...parts: string[]) => boolean
  read: (...parts: string[]) => string
  vitestFile: string | null
  toolFiles: readonly string[]
  ensureMcpConfig: () => RubricOutcomes<ConformOutcome>
  ensurePackageShape: () => RubricOutcomes<ConformOutcome>
  regenerateClient: () => RubricOutcomes<ConformOutcome>
}

const TOML = (globalThis as unknown as { Bun: { TOML: { parse(text: string): unknown } } }).Bun.TOML
const asTable = (value: unknown): Record<string, unknown> | null =>
  value && typeof value === 'object' && !Array.isArray(value) ? (value as Record<string, unknown>) : null
const parseToml = (text: string): { document: Record<string, unknown> | null; malformed: boolean } => {
  try {
    return { document: TOML.parse(text) as Record<string, unknown>, malformed: false }
  } catch {
    return { document: null, malformed: true }
  }
}
const filesBelow = (directory: string): string[] => {
  if (!existsSync(directory)) return []
  const files: string[] = []
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) files.push(...filesBelow(path))
    else if (entry.name.endsWith('.ts')) files.push(path)
  }
  return files
}
const readPackage = (path: string): { value: Record<string, unknown> | null; malformed: boolean } => {
  if (!existsSync(path)) return { value: null, malformed: false }
  try {
    return { value: JSON.parse(readFileSync(path, 'utf8')) as Record<string, unknown>, malformed: false }
  } catch {
    return { value: null, malformed: true }
  }
}

export const createMcpContext = (target: string, dryRun: boolean): McpRubricContext => {
  const root = resolve(target)
  const rootExists = existsSync(root) && statSync(root).isDirectory()
  const at = (...parts: string[]): string => join(root, ...parts)
  const exists = (...parts: string[]): boolean => rootExists && existsSync(at(...parts))
  const isDir = (...parts: string[]): boolean => exists(...parts) && statSync(at(...parts)).isDirectory()
  const read = (...parts: string[]): string => {
    try {
      return readFileSync(at(...parts), 'utf8')
    } catch {
      return ''
    }
  }
  const config = exists('.ki-config.toml') ? read('.ki-config.toml') : null
  const parsedConfig = parseToml(config ?? '')
  const configTable = asTable(parsedConfig.document?.['ki-mcp'])
  const packageState = readPackage(at('package.json'))
  const applicable = rootExists && (configTable !== null || parsedConfig.malformed || isDir('src', 'mcp-server'))
  const vitestFile =
    ['vitest.config.ts', 'vitest.config.js', 'vitest.config.mts', 'vitest.config.cts', 'vitest.config.mjs', 'vitest.config.cjs'].find(
      (file) => exists(file)
    ) ?? null
  const toolFiles = filesBelow(at('src', 'tools')).filter((file) => !file.endsWith('.test.ts'))
  const packagePath = at('package.json')
  return {
    root,
    dryRun,
    rootExists,
    applicable,
    config,
    configMalformed: parsedConfig.malformed,
    configTable,
    packageJson: packageState.value,
    packageMalformed: packageState.malformed,
    exists,
    isDir,
    read,
    vitestFile,
    toolFiles,
    ensureMcpConfig: () => {
      if (!rootExists || config === null)
        return [{ status: 'NOT_APPLICABLE', message: '.ki-config.toml is absent; ki-repo owns its creation.', subject: '.ki-config.toml' }]
      if (configTable) return [{ status: 'PASS', message: '[ki-mcp] table is present.', subject: '.ki-config.toml' }]
      if (!dryRun) writeFileSync(at('.ki-config.toml'), `${config.replace(/\n*$/, '\n')}\n[ki-mcp]\n`)
      return [
        { status: 'FIXED', message: `[ki-mcp] marker table ${dryRun ? 'would be appended' : 'appended'}.`, subject: '.ki-config.toml' }
      ]
    },
    ensurePackageShape: () => {
      if (!packageState.value)
        return [{ status: 'VIOLATION', message: 'Package manifest is absent or unparseable.', subject: 'package.json' }]
      const pkg = structuredClone(packageState.value)
      const main = 'dist/mcp-server/index.js'
      const bin = (pkg.bin && typeof pkg.bin === 'object' && !Array.isArray(pkg.bin) ? pkg.bin : {}) as Record<string, string>
      const exports_ = (pkg.exports && typeof pkg.exports === 'object' && !Array.isArray(pkg.exports) ? pkg.exports : {}) as Record<
        string,
        unknown
      >
      let changed = false
      if (pkg.main !== main) {
        pkg.main = main
        changed = true
      }
      if (!Object.values(bin).includes(main)) {
        bin[Object.keys(bin).length === 1 ? (Object.keys(bin)[0] as string) : String(pkg.name ?? 'mcp-server').replace(/^@[^/]+\//, '')] =
          main
        pkg.bin = bin
        changed = true
      }
      for (const [key, value] of Object.entries({
        '.': { types: './dist/index.d.ts', default: `./${main}` },
        './config': { types: './dist/config/index.d.ts', default: './dist/config/index.js' },
        './package.json': './package.json'
      }))
        if (exports_[key] === undefined) {
          exports_[key] = value
          changed = true
        }
      if (changed && !dryRun) writeFileSync(packagePath, `${JSON.stringify({ ...pkg, exports: exports_ }, null, 2)}\n`)
      return [
        {
          status: changed ? 'FIXED' : 'PASS',
          message: changed
            ? `MCP package entry points ${dryRun ? 'would be conformed' : 'conformed'}.`
            : 'MCP package entry points are conformant.',
          subject: 'package.json'
        }
      ]
    },
    regenerateClient: () => {
      const scripts = (packageState.value?.scripts ?? {}) as Record<string, unknown>
      if (typeof scripts['ki:generate:client'] !== 'string')
        return [{ status: 'NOT_APPLICABLE', message: 'No ki:generate:client script is defined.', subject: 'package.json' }]
      if (dryRun) return [{ status: 'INFO', message: 'Would run bun run ki:generate:client.', subject: 'package.json' }]
      try {
        execSync('bun run ki:generate:client', { cwd: root, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] })
        return [{ status: 'FIXED', message: 'Regenerated the typed MCP client.', subject: 'src/generated/client.ts' }]
      } catch (error) {
        const detail = (error as { stderr?: string; stdout?: string }).stderr ?? (error as { stdout?: string }).stdout ?? String(error)
        return [
          { status: 'VIOLATION', message: `ki:generate:client failed: ${detail.trim().split('\n')[0]}`, subject: 'src/generated/client.ts' }
        ]
      }
    }
  }
}

export const relative = (context: McpRubricContext, path: string): string => path.replace(`${context.root}/`, '')
