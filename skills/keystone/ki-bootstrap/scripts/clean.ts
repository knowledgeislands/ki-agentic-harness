#!/usr/bin/env bun
/** Source-owned CLEAN entrypoint; it remains usable after deleting generated .ki output. */
import { runRepositoryClean } from './internal/repo-bootstrap/repo-clean.ts'

if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log('Usage: clean.ts [target] [--dry-run]')
  console.log('\nRemove only manifest-proven .ki generated output and unchanged generated runtime skill copies.')
  process.exit(0)
}

try {
  process.exit(runRepositoryClean())
} catch (error) {
  console.error(`FAIL  CLEAN: ${(error as Error).message}`)
  process.exit(1)
}
