#!/usr/bin/env bun
import { execFileSync } from 'node:child_process'
import { resolve } from 'node:path'
import { runSkillEducator } from './vendored/ki-bootstrap/educator.ts'

const argv = process.argv.slice(2)
if (argv.includes('--scaffold-config-only')) {
  execFileSync('bun', [resolve(import.meta.dirname, 'conform.ts'), ...argv], { stdio: 'inherit' })
} else {
  runSkillEducator({ skill: 'ki-repo', source: resolve(import.meta.dirname, '..'), argv })
}
