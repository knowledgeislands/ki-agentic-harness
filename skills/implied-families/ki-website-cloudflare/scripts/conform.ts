#!/usr/bin/env bun
/**
 * Mechanical CONFORM for the Cloudflare hosting standard.
 *
 * Only unambiguous, reversible changes are made: enable observability in a
 * JSON/JSONC site config, append missing ignore entries, and derive a missing
 * deploy script from the discovered site-config directory. The canonical
 * checker reporter owns all emitted JSONL output and exit handling.
 */
import { readdir, readFile, stat, writeFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  type CheckerFinding,
  checkerReporterExitCode,
  emitCheckerReporter,
  judgmentFindingsFromRubric
} from './vendored/ki-skills/checker-reporter.ts'

const KI_SECTION = 'ki-website-cloudflare'
const WRANGLER_NAMES = ['wrangler.jsonc', 'wrangler.json', 'wrangler.toml']
const SKIP_DIRS = ['node_modules', '.git', 'dist', '.wrangler']
const STD = 'references/standards.md'
const RUBRIC = 'references/rubric.md'
const rubricPath = join(dirname(fileURLToPath(import.meta.url)), '..', 'references', 'rubric.md')
const hasAssets = (text: string): boolean => /"assets"\s*:/.test(text) || /\[assets\]|assets\s*=/.test(text)
const hasMain = (text: string): boolean => /"main"\s*:/.test(text) || /^\s*main\s*=/m.test(text)
const hasObservability = (text: string): boolean =>
  /"observability"\s*:\s*\{[\s\S]*?"enabled"\s*:\s*true/.test(text) || /\[observability\][\s\S]*?enabled\s*=\s*true/.test(text)
type Config = { rel: string; text: string }

async function tryRead(path: string): Promise<string | null> {
  try {
    return await readFile(path, 'utf8')
  } catch {
    return null
  }
}

async function collectConfigs(target: string): Promise<Config[]> {
  const configs: Config[] = []
  const collectFrom = async (subdir: string): Promise<void> => {
    for (const filename of WRANGLER_NAMES) {
      const rel = subdir ? join(subdir, filename) : filename
      const text = await tryRead(join(target, rel))
      if (text !== null) configs.push({ rel, text })
    }
  }
  await collectFrom('')
  for (const entry of await readdir(target, { withFileTypes: true })) {
    if (entry.isDirectory() && !SKIP_DIRS.includes(entry.name)) await collectFrom(entry.name)
  }
  return configs
}

function addObservability(text: string): string | null {
  if (hasObservability(text)) return null
  const lastBrace = text.lastIndexOf('}')
  if (lastBrace === -1) return null
  const head = text.slice(0, lastBrace).replace(/\s*$/, '')
  if (!head) return null
  const comma = !head.endsWith('{') && !head.endsWith(',') ? ',' : ''
  return `${head}${comma}\n  "observability": { "enabled": true }\n${text.slice(lastBrace)}`
}

async function conform(target: string, dryRun: boolean): Promise<CheckerFinding[]> {
  const findings: CheckerFinding[] = []
  const add = (level: CheckerFinding['level'], code: string, message: string, ref?: string, file?: string): void => {
    findings.push({ type: 'M', level, code, message, ref, file })
  }
  const configs = await collectConfigs(target)
  const ki = (await tryRead(join(target, '.ki-config.toml'))) ?? ''
  const kiTable = new RegExp(`^\\[${KI_SECTION}\\]`, 'm').test(ki)
  if (!configs.length && !kiTable) {
    add('NA', 'WCF-1', 'No wrangler config or opt-in table found; nothing applies.', STD)
    return findings
  }

  const site = configs.find((config) => hasAssets(config.text))
  if (!site) {
    add('ADVISORY', 'WCF-1', 'No site Worker config is available to normalise.', STD)
  } else if (!/\.jsonc?$/.test(site.rel)) {
    add(
      hasObservability(site.text) ? 'PASS' : 'ADVISORY',
      'WCF-9',
      hasObservability(site.text) ? 'observability is already enabled.' : 'A TOML config needs observability enabled by hand.',
      STD,
      site.rel
    )
  } else if (hasObservability(site.text)) {
    add('PASS', 'WCF-9', 'observability is already enabled.', STD, site.rel)
  } else {
    const updated = addObservability(site.text)
    if (!updated) add('ADVISORY', 'WCF-9', 'observability could not be inserted safely.', STD, site.rel)
    else {
      add('POLISH', 'WCF-9', dryRun ? 'observability would be enabled.' : 'observability was enabled.', STD, site.rel)
      if (!dryRun) await writeFile(join(target, site.rel), updated)
    }
  }

  const gitignorePath = join(target, '.gitignore')
  const gitignore = (await tryRead(gitignorePath)) ?? ''
  const additions = [!/^\s*\/?dist\/?\s*$/m.test(gitignore) ? 'dist/' : null, !/\.wrangler/.test(gitignore) ? '.wrangler/' : null].filter(
    (entry): entry is string => entry !== null
  )
  if (!additions.length) add('PASS', 'WCF-6', 'dist and .wrangler are already ignored.', STD, '.gitignore')
  else {
    for (const entry of additions)
      add('POLISH', 'WCF-6', dryRun ? `${entry} would be appended.` : `${entry} was appended.`, STD, '.gitignore')
    if (!dryRun) await writeFile(gitignorePath, `${gitignore === '' ? '' : gitignore.replace(/\n*$/, '\n')}${additions.join('\n')}\n`)
  }

  const packagePath = join(target, 'package.json')
  const packageText = await tryRead(packagePath)
  let pkg: { scripts?: Record<string, string> } | null = null
  try {
    pkg = packageText ? (JSON.parse(packageText) as { scripts?: Record<string, string> }) : null
  } catch {
    pkg = null
  }
  if (!pkg) {
    add('ADVISORY', 'WCF-13', 'No parseable package.json is available for a deploy script.', STD, 'package.json')
  } else {
    const scripts = pkg.scripts ?? {}
    const deployKey = scripts['ki:site:deploy'] ? 'ki:site:deploy' : scripts.deploy ? 'deploy' : ''
    if (deployKey && /wrangler\s+deploy/.test(scripts[deployKey] ?? '')) {
      add('PASS', 'WCF-13', `The ${deployKey} script already runs wrangler deploy.`, STD, 'package.json')
    } else if (deployKey) {
      add('ADVISORY', 'WCF-13', `The ${deployKey} script needs a manual deploy command correction.`, STD, 'package.json')
    } else if (!site) {
      add('ADVISORY', 'WCF-13', 'A deploy script cannot be derived without a site config.', STD, 'package.json')
    } else {
      const siteDir = dirname(site.rel)
      const key = siteDir === '.' || siteDir === '' ? 'deploy' : 'ki:site:deploy'
      const value = siteDir === '.' || siteDir === '' ? 'bunx wrangler deploy' : `cd ${siteDir} && bunx wrangler deploy`
      add('POLISH', 'WCF-13', dryRun ? `scripts.${key} would be added.` : `scripts.${key} was added.`, STD, 'package.json')
      if (!dryRun) await writeFile(packagePath, `${JSON.stringify({ ...pkg, scripts: { ...scripts, [key]: value } }, null, 2)}\n`)
    }
  }

  const companions = configs.filter((config) => !hasAssets(config.text) && hasMain(config.text))
  if (companions.length)
    add('INFO', 'WCF-19', `Companion Workers were left untouched: ${companions.map((config) => config.rel).join(', ')}.`, STD)
  return findings
}

async function main(): Promise<number> {
  const args = process.argv.slice(2)
  const dryRun = args.includes('--dry-run')
  const target = resolve(args.find((arg) => !arg.startsWith('-')) ?? '.')
  let findings: CheckerFinding[]
  try {
    const info = await stat(target)
    findings = info.isDirectory()
      ? await conform(target, dryRun)
      : [{ type: 'M', level: 'FAIL', code: 'WCF-1', message: `Target is not a directory: ${target}.`, ref: STD }]
  } catch {
    findings = [{ type: 'M', level: 'FAIL', code: 'WCF-1', message: `Target directory is unavailable: ${target}.`, ref: STD }]
  }
  findings.push(...judgmentFindingsFromRubric(rubricPath, RUBRIC))
  emitCheckerReporter({ mode: 'conform', concern: 'website-cloudflare', target, findings })
  return checkerReporterExitCode(findings)
}

process.exit(await main())
