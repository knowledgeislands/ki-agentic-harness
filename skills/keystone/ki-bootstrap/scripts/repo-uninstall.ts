#!/usr/bin/env bun
/** End repository-level Knowledge Islands adoption without touching user state. */
import { runRepositoryUninstall } from './internal/repo-bootstrap/repo-clean.ts'

if (process.argv.slice(2).some((argument) => argument === '-h' || argument === '--help')) {
  console.log('Usage: repo-uninstall.ts [target] [--dry-run]')
  console.log('\nEnd repository-level Knowledge Islands adoption without touching user state.')
  process.exit(0)
}

try {
  process.exit(runRepositoryUninstall())
} catch (error) {
  console.error(`FAIL  repository UNINSTALL: ${(error as Error).message}`)
  process.exit(1)
}
