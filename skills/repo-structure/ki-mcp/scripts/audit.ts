#!/usr/bin/env bun
import { resolve } from 'node:path'
import { createMcpContext } from './rubric/contexts/mcp.ts'
import { KI_MCP_FAMILY_CODES, KI_MCP_RUBRIC } from './rubric/items/index.ts'
import { runChecker } from './vendored/ki-skills/checker.ts'
import { createTerminalStatusTracker, parseCheckerArguments, renderCheckerResult } from './vendored/ki-skills/reporter.ts'

const usage = `Usage: bun scripts/audit.ts [repo-path] [--reporter=terminal] [--reporter-levels=all]\n\nAudit one Knowledge Islands MCP server.\nWith no reporter the command emits the canonical JSONL checker response.\n`
const main = (): never => {
  const argv = process.argv.slice(2)
  if (argv.some((argument) => ['-h', '--help', 'help', '?'].includes(argument))) {
    process.stdout.write(usage)
    process.exit(0)
  }
  let parsed: ReturnType<typeof parseCheckerArguments>
  try {
    parsed = parseCheckerArguments(argv)
  } catch (error) {
    process.stderr.write(`error: ${error instanceof Error ? error.message : String(error)}\n`)
    process.exit(2)
  }
  const unknown = parsed.arguments.find((argument) => argument.startsWith('-'))
  if (unknown || parsed.arguments.length > 1) {
    process.stderr.write(`error: ${unknown ? `unknown option: ${unknown}` : 'audit accepts at most one target'}\n`)
    process.exit(2)
  }
  const target = resolve(parsed.arguments[0] ?? '.')
  const context = createMcpContext(target, true)
  const families = context.applicable || !context.rootExists ? KI_MCP_FAMILY_CODES : ['KI']
  const result = runChecker({
    mode: 'audit',
    concern: KI_MCP_RUBRIC.concern,
    target,
    rubric: KI_MCP_RUBRIC,
    subjects: [{ familyCodes: families, context: () => context }],
    statusTracker: createTerminalStatusTracker({
      mode: parsed.progress,
      interactive: Boolean(process.stderr.isTTY),
      write: (line) => process.stderr.write(line)
    })
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
