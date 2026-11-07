#!/usr/bin/env bun
/**
 * Purpose: Validate one exchange dynamics analysis against its schema and cross-references before it is rendered.
 * Run: bun scripts/validate-analysis.ts --help
 * Boundary: Reads the analysis and, where it names one or `--source` gives one, its source transcript; writes nothing.
 *
 * Usage: bun scripts/validate-analysis.ts <analysis.json> [--source <transcript>]
 *
 * Without `--source`, the analysis's own `exchange.source` is read relative to the analysis when present. Exits 0 when
 * the analysis passes and 1 with one line per issue when it does not.
 */

import { existsSync, readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { validateAnalysis } from './internal/analysis.ts'

const USAGE = 'usage: bun scripts/validate-analysis.ts <analysis.json> [--source <transcript>]'

const main = (argv: readonly string[]): number => {
  if (!argv.length || argv.includes('--help') || argv.includes('-h')) {
    console.log(USAGE)
    return argv.length ? 0 : 1
  }
  const sourceFlag = argv.indexOf('--source')
  const sourceArgument = sourceFlag === -1 ? undefined : argv[sourceFlag + 1]
  const target = argv.find(
    (argument, index) => !argument.startsWith('--') && (sourceFlag === -1 || index !== sourceFlag + 1)
  )
  if (!target || (sourceFlag !== -1 && !sourceArgument)) {
    console.error(USAGE)
    return 1
  }
  const analysis: unknown = JSON.parse(readFileSync(target, 'utf8'))
  const named =
    typeof analysis === 'object' && analysis !== null && 'exchange' in analysis
      ? (analysis.exchange as { source?: unknown }).source
      : undefined
  const sourcePath = sourceArgument ?? (typeof named === 'string' ? resolve(dirname(target), named) : undefined)
  if (sourcePath && !existsSync(sourcePath)) {
    console.error(`source not found: ${sourcePath}`)
    return 1
  }
  const issues = validateAnalysis(analysis, { source: sourcePath ? readFileSync(sourcePath, 'utf8') : undefined })
  for (const { path, message } of issues) console.error(`${path} ${message}`)
  if (!issues.length) console.log(`${target}: valid`)
  return issues.length ? 1 : 0
}

if (import.meta.main) process.exit(main(process.argv.slice(2)))
