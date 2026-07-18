#!/usr/bin/env bun
/**
 * Explicit local-development publisher for repository-local commands.
 *
 * This is deliberately separate from `ki-bootstrap`: normal installation and
 * repository bootstrap publish regular copies, while this command alone may
 * replace managed payloads with symlinks into the active harness checkout.
 * `--agents` additionally links the declared Claude governance agents.
 */
import { runProjectLinks } from './lib/project-skill-publisher.ts'

const argv = process.argv.slice(2)
if (!argv.includes('--development')) {
  console.error('link-repository-commands.ts creates links only in explicit local development mode; pass --development')
  process.exit(2)
}

const scope = argv.includes('--agents') ? 'all' : 'skills'
process.exit(
  runProjectLinks(
    scope,
    'development-link',
    argv.filter((arg) => arg !== '--development' && arg !== '--agents')
  )
)
