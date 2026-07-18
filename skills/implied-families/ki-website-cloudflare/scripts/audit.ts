#!/usr/bin/env bun
/**
 * Mechanical auditor for a Knowledge Islands site's Cloudflare hosting.
 *
 *   bun scripts/audit.ts <repo-path>
 *   bun scripts/audit.ts --educate
 *
 * The checker collects the hosting findings only. Its local vendored canonical
 * checker reporter emits the JSONL transport, summary, and exit status.
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  type CheckerFinding,
  checkerReporterExitCode,
  emitCheckerReporter,
  judgmentFindingsFromRubric
} from './vendored/ki-skills/checker-reporter.ts'

const STD = 'references/standards.md'
const RUBRIC = 'references/rubric.md'
const KI_SECTION = 'ki-website-cloudflare'
const WRANGLER_NAMES = ['wrangler.jsonc', 'wrangler.json', 'wrangler.toml']
const SKIP_DIRS = ['node_modules', '.git', 'dist', '.wrangler']
const KI_DEFAULT = `# ${KI_SECTION} — opt-in marker: presence of this table opts the repo into the
# Workers + Static Assets hosting standard (serving the built dist/).
[${KI_SECTION}]
# site-root is the path (relative to the repo root) where wrangler.jsonc lives:
# "." for the flat layout, "site" for the subfolder layout. Optional — omit to let
# the auditor discover it (it scans the repo root and one level of subdirs).
# site-root = "."
`
const rubricPath = join(dirname(fileURLToPath(import.meta.url)), '..', 'references', 'rubric.md')

const hasAssets = (text: string): boolean => /"assets"\s*:/.test(text) || /\[assets\]|assets\s*=/.test(text)
const hasMain = (text: string): boolean => /"main"\s*:/.test(text) || /^\s*main\s*=/m.test(text)

type Config = { rel: string; text: string }

function audit(repo: string): CheckerFinding[] {
  const findings: CheckerFinding[] = []
  const add = (level: CheckerFinding['level'], code: string, message: string, ref?: string, file?: string): void => {
    findings.push({ type: 'M', level, code, message, ref, file })
  }
  const at = (...parts: string[]): string => join(repo, ...parts)
  const read = (...parts: string[]): string => {
    try {
      return readFileSync(at(...parts), 'utf8')
    } catch {
      return ''
    }
  }

  const configs: Config[] = []
  const collectFrom = (subdir: string): void => {
    for (const filename of WRANGLER_NAMES) {
      const rel = subdir ? join(subdir, filename) : filename
      if (existsSync(at(rel))) configs.push({ rel, text: read(rel) })
    }
  }
  collectFrom('')
  for (const entry of readdirSync(repo, { withFileTypes: true })) {
    if (entry.isDirectory() && !SKIP_DIRS.includes(entry.name)) collectFrom(entry.name)
  }

  const ki = read('.ki-config.toml')
  const kiTable = new RegExp(`^\\[${KI_SECTION}\\]`, 'm').test(ki)
  const scripts = (() => {
    try {
      return ((JSON.parse(read('package.json')) as { scripts?: Record<string, string> }).scripts ?? {}) as Record<string, string>
    } catch {
      return {} as Record<string, string>
    }
  })()

  if (!configs.length && !kiTable) {
    add('NA', 'WCF-1', 'No wrangler config or opt-in table found; this repository is not Cloudflare-hosted.', STD)
    add('INFO', 'WCF-22', 'Hosting delta only; compose this with the toolchain and site-build audits.', RUBRIC)
    return findings
  }

  const siteConfigs = configs.filter((config) => hasAssets(config.text))
  const companions = configs.filter((config) => !hasAssets(config.text) && hasMain(config.text))
  if (!siteConfigs.length) {
    add(
      'FAIL',
      'WCF-1',
      `No site Worker config with an assets block was found (found ${configs.map((config) => config.rel).join(', ') || 'none'}).`,
      STD
    )
  } else if (siteConfigs.length > 1) {
    add('WARN', 'WCF-3', `More than one config has an assets block: ${siteConfigs.map((config) => config.rel).join(', ')}.`, STD)
  }

  const site = siteConfigs[0]
  if (site) {
    add('PASS', 'WCF-1', 'Site Worker config is present.', STD, site.rel)
    const directory = site.text.match(/"directory"\s*:\s*"([^"]+)"/)?.[1] ?? site.text.match(/directory\s*=\s*"([^"]+)"/)?.[1]
    if (!directory) add('FAIL', 'WCF-4', 'The assets block has no directory.', STD, site.rel)
    else if (/dist\/?$/.test(directory)) add('PASS', 'WCF-4', `assets.directory points at dist (${directory}).`, STD, site.rel)
    else add('WARN', 'WCF-4', `assets.directory points at ${directory}, not the build dist directory.`, STD, site.rel)

    const hasName = /"name"\s*:/.test(site.text) || /^\s*name\s*=/m.test(site.text)
    add(hasName ? 'PASS' : 'FAIL', 'WCF-8', hasName ? 'name is present.' : 'name is absent.', STD, site.rel)
    const hasCompatibilityDate =
      /"compatibility_date"\s*:\s*"\d{4}-\d{2}-\d{2}"/.test(site.text) || /compatibility_date\s*=\s*"\d{4}-\d{2}-\d{2}"/.test(site.text)
    add(
      hasCompatibilityDate ? 'PASS' : 'WARN',
      'WCF-8',
      hasCompatibilityDate ? 'compatibility_date is pinned.' : 'compatibility_date is not pinned.',
      STD,
      site.rel
    )
    const hasObservability =
      /"observability"\s*:\s*\{[\s\S]*?"enabled"\s*:\s*true/.test(site.text) ||
      /\[observability\][\s\S]*?enabled\s*=\s*true/.test(site.text)
    add(
      hasObservability ? 'PASS' : 'WARN',
      'WCF-9',
      hasObservability ? 'observability.enabled is true.' : 'observability is not enabled.',
      STD,
      site.rel
    )
    const customDomain = /"custom_domain"\s*:\s*true/.test(site.text) || /custom_domain\s*=\s*true/.test(site.text)
    add(
      customDomain ? 'PASS' : 'WARN',
      'WCF-10',
      customDomain ? 'Routes use custom_domain.' : 'No custom_domain route was found.',
      STD,
      site.rel
    )
  }

  if (companions.length)
    add('INFO', 'WCF-19', `Companion Workers were left out of scope: ${companions.map((config) => config.rel).join(', ')}.`, STD)

  const deployKey = scripts['ki:site:deploy'] ? 'ki:site:deploy' : scripts.deploy ? 'deploy' : ''
  const hasDeploy = deployKey !== '' && /wrangler\s+deploy/.test(scripts[deployKey])
  add(
    hasDeploy ? 'PASS' : 'WARN',
    'WCF-13',
    hasDeploy ? `The ${deployKey} script runs wrangler deploy.` : 'No site deploy script runs wrangler deploy.',
    STD,
    'package.json'
  )
  const pagesDeploy = Object.entries(scripts).find(([, script]) => /wrangler\s+pages\s+deploy/.test(script))
  add(
    pagesDeploy ? 'FAIL' : 'PASS',
    'WCF-2',
    pagesDeploy ? `The ${pagesDeploy[0]} script uses wrangler pages deploy.` : 'No script uses wrangler pages deploy.',
    STD,
    'package.json'
  )
  const previewKey = scripts['ki:site:preview'] ? 'ki:site:preview' : scripts.preview ? 'preview' : ''
  const hasPreview = previewKey !== '' && /wrangler\s+dev/.test(scripts[previewKey])
  add(
    hasPreview ? 'PASS' : 'WARN',
    'WCF-14',
    hasPreview ? `The ${previewKey} script runs wrangler dev.` : 'No site preview script runs wrangler dev.',
    STD,
    'package.json'
  )

  const gitignore = read('.gitignore')
  add(
    /^\s*\/?dist\/?\s*$/m.test(gitignore) ? 'PASS' : 'WARN',
    'WCF-6',
    /^\s*\/?dist\/?\s*$/m.test(gitignore) ? 'dist is gitignored.' : 'dist is not gitignored.',
    STD,
    '.gitignore'
  )
  add(
    /\.wrangler/.test(gitignore) ? 'PASS' : 'WARN',
    'WCF-6',
    /\.wrangler/.test(gitignore) ? '.wrangler is gitignored.' : '.wrangler is not gitignored.',
    STD,
    '.gitignore'
  )

  add(kiTable ? 'PASS' : 'WARN', 'WCF-20', kiTable ? 'The opt-in table is present.' : 'The opt-in table is absent.', STD, '.ki-config.toml')
  if (kiTable) {
    const body = ki.split(new RegExp(`^\\[${KI_SECTION}\\]`, 'm'))[1]?.split(/^\[/m)[0] ?? ''
    let siteRoot: string | null = null
    for (const match of body.matchAll(/^\s*([A-Za-z0-9_-]+)\s*=\s*(.+?)\s*$/gm)) {
      if (match[1] === 'site-root') siteRoot = match[2].replace(/^["']|["']$/g, '')
      else add('WARN', 'WCF-21', `Unknown opt-in key: ${match[1]}.`, STD, '.ki-config.toml')
    }
    if (siteRoot !== null) {
      const configDirs = new Set(configs.map((config) => dirname(config.rel)))
      add(
        configDirs.has(siteRoot) ? 'PASS' : 'WARN',
        'WCF-21',
        configDirs.has(siteRoot)
          ? `The declared site-root ${siteRoot} holds a config.`
          : `The declared site-root ${siteRoot} holds no config.`,
        STD,
        '.ki-config.toml'
      )
    }
  }
  add('INFO', 'WCF-22', 'Hosting delta only; compose this with the toolchain and site-build audits.', RUBRIC)
  return findings
}

const args = process.argv.slice(2)
if (args.includes('--educate')) {
  process.stdout.write(KI_DEFAULT)
  process.exit(0)
}

const requested = args.find((arg) => !arg.startsWith('-'))
const target = resolve(requested ?? '.')
let findings: CheckerFinding[]
if (!requested || !existsSync(target)) {
  findings = [{ type: 'M', level: 'FAIL', code: 'WCF-1', message: `Target directory is unavailable: ${target}.`, ref: STD }]
} else {
  findings = audit(target)
}
findings.push(...judgmentFindingsFromRubric(rubricPath, RUBRIC))
emitCheckerReporter({ mode: 'audit', concern: 'website-cloudflare', target, findings })
process.exit(checkerReporterExitCode(findings))
