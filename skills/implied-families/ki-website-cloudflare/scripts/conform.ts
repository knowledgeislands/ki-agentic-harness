#!/usr/bin/env bun
import { resolve } from 'node:path'
import { createWebsiteCloudflareContext } from './rubric/contexts/website-cloudflare.ts'
import { KI_WEBSITE_CLOUDFLARE_FAMILY_CODES, KI_WEBSITE_CLOUDFLARE_RUBRIC } from './rubric/items/index.ts'
import { runChecker } from './vendored/ki-skills/checker.ts'
import { createTerminalStatusTracker, parseCheckerArguments, renderCheckerResult } from './vendored/ki-skills/reporter.ts'

const argv = process.argv.slice(2)
if (argv.includes('-h') || argv.includes('--help')) {
  process.stdout.write('Usage: bun scripts/conform.ts <repo-path> [--dry-run]\n')
  process.exit(0)
}
let parsed: ReturnType<typeof parseCheckerArguments>
try {
  parsed = parseCheckerArguments(argv)
} catch (error) {
  process.stderr.write(`error: ${String(error)}\n`)
  process.exit(2)
}
const paths = parsed.arguments.filter((arg) => !arg.startsWith('-'))
if (paths.length !== 1 || parsed.arguments.some((arg) => arg !== '--dry-run' && arg.startsWith('-'))) {
  process.stderr.write('error: conform requires one repository path\n')
  process.exit(2)
}
const target = resolve(paths[0])
const result = runChecker({
  mode: 'conform',
  concern: KI_WEBSITE_CLOUDFLARE_RUBRIC.concern,
  target,
  rubric: KI_WEBSITE_CLOUDFLARE_RUBRIC,
  subjects: [{ familyCodes: KI_WEBSITE_CLOUDFLARE_FAMILY_CODES, context: () => createWebsiteCloudflareContext(target) }],
  statusTracker: createTerminalStatusTracker({
    mode: parsed.progress,
    interactive: Boolean(process.stderr.isTTY),
    write: (line) => process.stderr.write(line)
  })
})
process.stdout.write(renderCheckerResult(result, { ...parsed.options, colour: Boolean(process.stdout.isTTY && !process.env.NO_COLOR) }))
process.exit(result.exitCode)
