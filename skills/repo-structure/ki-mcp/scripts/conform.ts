#!/usr/bin/env bun
import { resolve } from 'node:path'
import { createMcpContext } from './rubric/contexts/mcp.ts'
import { KI_MCP_FAMILY_CODES, KI_MCP_RUBRIC } from './rubric/items/index.ts'
import { runChecker } from './vendored/ki-skills/checker.ts'
import { parseReporterArguments, renderCheckerResult } from './vendored/ki-skills/reporter.ts'

const usage = `Usage: bun scripts/conform.ts [repo-path] [--dry-run] [--reporter=terminal] [--reporter-levels=all]\n\nApply safe mechanical remediation to one Knowledge Islands MCP server.\nWith no reporter the command emits the canonical JSONL checker response.\n`
const main = (): never => {
  const argv = process.argv.slice(2)
  if (argv.some((argument) => ['-h', '--help', 'help', '?'].includes(argument))) {
    process.stdout.write(usage)
    process.exit(0)
  }
  let parsed: ReturnType<typeof parseReporterArguments>
  try {
    parsed = parseReporterArguments(argv)
  } catch (error) {
    process.stderr.write(`error: ${error instanceof Error ? error.message : String(error)}\n`)
    process.exit(2)
  }
  const unknown = parsed.arguments.find((argument) => argument.startsWith('-') && argument !== '--dry-run')
  const targets = parsed.arguments.filter((argument) => !argument.startsWith('-'))
  if (unknown || targets.length > 1) {
    process.stderr.write(`error: ${unknown ? `unknown option: ${unknown}` : 'conform accepts at most one target'}\n`)
    process.exit(2)
  }
  const target = resolve(targets[0] ?? '.')
  const dryRun = parsed.arguments.includes('--dry-run')
  const probe = createMcpContext(target, dryRun)
  const families = probe.applicable || !probe.rootExists ? KI_MCP_FAMILY_CODES : ['KI']
  const result = runChecker({
    mode: 'conform',
    concern: KI_MCP_RUBRIC.concern,
    target,
    rubric: KI_MCP_RUBRIC,
    subjects: [{ familyCodes: families, context: () => createMcpContext(target, dryRun) }]
  })
  process.stdout.write(renderCheckerResult(result, { ...parsed.options, colour: Boolean(process.stdout.isTTY && !process.env.NO_COLOR) }))
  process.exit(result.exitCode)
}
if (import.meta.main)
  try {
    main()
  } catch (error) {
    process.stderr.write(`error: ${error instanceof Error ? error.message : String(error)}\n`)
    process.exit(2)
  }
