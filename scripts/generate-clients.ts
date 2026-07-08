#!/usr/bin/env bun
/**
 * Regenerates mcporter typed clients for all KI mcp-* repos.
 * Run from the harness root: bun run ki:codegen
 * Requires the mcporter daemon to be running (mcporter daemon status).
 */

import { spawnSync } from 'node:child_process'
import { resolve } from 'node:path'

const HARNESS_ROOT = new URL('..', import.meta.url).pathname
const MCP_REPOS_ROOT = resolve(HARNESS_ROOT, '../')

const repos = ['mcp-git-audit', 'mcp-gsuite', 'mcp-claude-housekeeping', 'mcp-m365', 'mcp-kb-notion-mirror', 'mcp-ki-kb-fs'] as const

let ok = 0
let fail = 0

for (const repo of repos) {
  const cwd = resolve(MCP_REPOS_ROOT, repo)
  const result = spawnSync('bun', ['run', 'ki:generate:client'], { cwd, encoding: 'utf8' })
  if (result.status === 0) {
    console.log(`✓ ${repo}`)
    ok++
  } else {
    console.error(`✗ ${repo}`)
    if (result.stderr) console.error(result.stderr.trim())
    fail++
  }
}

console.log(`\n${ok} succeeded, ${fail} failed`)
if (fail > 0) process.exit(1)
