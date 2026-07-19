import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'

const CONFIG_NAMES = ['eleventy.config.ts', 'eleventy.config.js', 'eleventy.config.mjs', 'eleventy.config.cjs'] as const
const KI_SECTION = 'ki-website'
export const KI_DEFAULT = `# ${KI_SECTION} — opt-in marker: presence of this table opts the repo into the
# Eleventy + Tailwind site-build standard. It takes no per-repo keys today.
[${KI_SECTION}]
`

export type WebsiteContext = {
  target: string
  dryRun: boolean
  available: boolean
  applicable: boolean
  siteRoot: '' | 'site'
  cfgName: string
  config: string
  packageOk: boolean
  deps: Record<string, string>
  scripts: Record<string, string>
  has: (...parts: string[]) => boolean
  read: (...parts: string[]) => string
  isDir: (...parts: string[]) => boolean
  siteAt: (...parts: string[]) => string
  kiWebsiteTable: Record<string, unknown> | null
  malformedConfig: boolean
  seoMeta: boolean
  ensureOptIn: () => 'canonical' | 'fixed'
  ensureDistIgnore: () => 'canonical' | 'fixed' | 'not-applicable'
}

const parseToml = (text: string): { document: Record<string, unknown> | null; malformed: boolean } => {
  try {
    return { document: Bun.TOML.parse(text) as Record<string, unknown>, malformed: false }
  } catch {
    return { document: null, malformed: true }
  }
}
const asTable = (value: unknown): Record<string, unknown> | null =>
  value && typeof value === 'object' && !Array.isArray(value) ? (value as Record<string, unknown>) : null

export const createWebsiteContextFactory = ({ target, dryRun = false }: { target: string; dryRun?: boolean }): (() => WebsiteContext) => {
  const root = resolve(target)
  const available = existsSync(root) && statSync(root).isDirectory()
  const at = (...parts: string[]) => join(root, ...parts)
  const has = (...parts: string[]) => existsSync(at(...parts))
  const read = (...parts: string[]) => {
    try {
      return readFileSync(at(...parts), 'utf8')
    } catch {
      return ''
    }
  }
  const isDir = (...parts: string[]) => has(...parts) && statSync(at(...parts)).isDirectory()
  const flatCfg = CONFIG_NAMES.find((name) => has(name))
  const siteCfg = CONFIG_NAMES.find((name) => has('site', name))
  const siteRoot: '' | 'site' = flatCfg ? '' : siteCfg ? 'site' : ''
  const cfgName = flatCfg ?? siteCfg ?? ''
  const siteAt = (...parts: string[]) => (siteRoot ? join(siteRoot, ...parts) : join(...parts))
  const ki = parseToml(read('.ki-config.toml'))
  const kiWebsiteTable = asTable(ki.document?.[KI_SECTION])
  const applicable = available && (kiWebsiteTable !== null || ki.malformed || Boolean(flatCfg || siteCfg))
  let packageOk = true
  let pkg: Record<string, unknown> = {}
  try {
    pkg = JSON.parse(read('package.json')) as Record<string, unknown>
  } catch {
    packageOk = false
  }
  const deps = { ...((pkg.dependencies as object) ?? {}), ...((pkg.devDependencies as object) ?? {}) } as Record<string, string>
  const scripts = (pkg.scripts ?? {}) as Record<string, string>
  const partials = siteAt('src', '_includes', 'partials')
  let seoMeta = false
  const walk = (path: string) => {
    if (!isDir(path)) return
    for (const entry of readdirSync(at(path), { withFileTypes: true })) {
      if (entry.isDirectory()) walk(join(path, entry.name))
      else if (/seo-meta/i.test(entry.name)) seoMeta = true
    }
  }
  if (available) walk(partials)
  const ensureOptIn = (): 'canonical' | 'fixed' => {
    if (kiWebsiteTable) return 'canonical'
    const next = read('.ki-config.toml')
    if (!dryRun) writeFileSync(at('.ki-config.toml'), next ? `${next.replace(/\n*$/, '\n')}\n${KI_DEFAULT}` : KI_DEFAULT)
    return 'fixed'
  }
  const ensureDistIgnore = (): 'canonical' | 'fixed' | 'not-applicable' => {
    if (!cfgName) return 'not-applicable'
    const current = read('.gitignore')
    const correct = siteRoot ? /^\s*\/?site\/dist\/?\s*$/m.test(current) : /^\s*\/?dist\/?\s*$/m.test(current)
    if (correct) return 'canonical'
    const next =
      siteRoot && /^\s*\/dist\/?\s*$/m.test(current)
        ? current.replace(/^(\s*)\/dist(\/?)(\s*)$/m, '$1/site/dist$2$3')
        : `${current ? current.replace(/\n*$/, '\n') : ''}${siteRoot ? 'site/dist' : 'dist'}\n`
    if (!dryRun) writeFileSync(at('.gitignore'), next)
    return 'fixed'
  }
  return () => ({
    target: root,
    dryRun,
    available,
    applicable,
    siteRoot,
    cfgName,
    config: cfgName ? read(siteAt(cfgName)) : '',
    packageOk,
    deps,
    scripts,
    has,
    read,
    isDir,
    siteAt,
    kiWebsiteTable,
    malformedConfig: ki.malformed,
    seoMeta,
    ensureOptIn,
    ensureDistIgnore
  })
}
