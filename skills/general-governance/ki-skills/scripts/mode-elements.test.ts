#!/usr/bin/env bun
import { readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { type ModeElements, planModeElements, validateModeElements } from './mode-elements.ts'

let failed = false
function check(label: string, condition: boolean): void {
  if (condition) console.log(`  \x1b[32mok\x1b[0m   ${label}`)
  else {
    failed = true
    console.log(`  \x1b[31mFAIL\x1b[0m ${label}`)
  }
}

const elements: Record<string, ModeElements> = {
  'ki-repo': {
    version: 1,
    elements: [
      {
        id: 'config',
        mode: 'conform',
        phase: 'prepare',
        entry: 'scripts/conform.ts',
        reads: ['.ki-config.toml'],
        writes: ['.ki-config.toml']
      }
    ]
  },
  'ki-kb-activities': {
    version: 1,
    elements: [
      {
        id: 'index',
        mode: 'conform',
        phase: 'write',
        entry: 'scripts/conform.ts',
        reads: ['Admin/Operations/Activities'],
        writes: ['Admin/Operations/Activities/Activities.md']
      }
    ]
  },
  'ki-project-roadmap': {
    version: 1,
    elements: [
      {
        id: 'projection',
        mode: 'conform',
        phase: 'project',
        entry: 'scripts/conform.ts',
        after: ['ki-kb-activities/index'],
        reads: ['docs/roadmap'],
        writes: ['ROADMAP.md']
      }
    ]
  }
}

check('valid declaration → no errors', validateModeElements('ki-repo', elements['ki-repo']).length === 0)
const selfDeclaration = JSON.parse(readFileSync(join(resolve(import.meta.dirname, '..'), 'mode-elements.json'), 'utf8')) as ModeElements
check('ki-skills declaration → conforms to the executable schema contract', validateModeElements('ki-skills', selfDeclaration).length === 0)
check(
  'invalid declaration → rejects missing scopes',
  validateModeElements('ki-invalid', {
    version: 1,
    elements: [{ id: 'bad', mode: 'audit', phase: 'inspect', entry: 'scripts/audit.ts', reads: [] }]
  }).length > 0
)
const planned = planModeElements(elements, 'conform')
check('planner → returns no errors', planned.errors.length === 0)
check(
  'planner → respects phases and explicit edges',
  planned.order.map(({ skill }) => skill).join(',') === 'ki-repo,ki-kb-activities,ki-project-roadmap'
)
const cycle = planModeElements(
  {
    'ki-a': {
      version: 1,
      elements: [{ id: 'a', mode: 'audit', phase: 'inspect', entry: 'scripts/a.ts', after: ['ki-b/b'], reads: ['x'], writes: [] }]
    },
    'ki-b': {
      version: 1,
      elements: [{ id: 'b', mode: 'audit', phase: 'inspect', entry: 'scripts/b.ts', after: ['ki-a/a'], reads: ['x'], writes: [] }]
    }
  },
  'audit'
)
check('planner → rejects cycles', cycle.errors.includes('mode-element dependency cycle'))
const unknown = planModeElements(
  {
    'ki-a': {
      version: 1,
      elements: [{ id: 'a', mode: 'audit', phase: 'inspect', entry: 'scripts/a.ts', after: ['ki-missing/other'], reads: ['x'], writes: [] }]
    }
  },
  'audit'
)
check('planner → rejects unknown cross-skill references', unknown.errors.includes('unknown element reference: ki-missing/other'))
const phaseViolation = planModeElements(
  {
    'ki-a': {
      version: 1,
      elements: [
        { id: 'normalise', mode: 'conform', phase: 'normalise', entry: 'scripts/a.ts', before: ['write'], reads: ['x'], writes: [] },
        { id: 'write', mode: 'conform', phase: 'write', entry: 'scripts/b.ts', reads: ['x'], writes: [] }
      ]
    }
  },
  'conform'
)
check('planner → rejects phase reversals', phaseViolation.errors.includes('phase violation: ki-a/normalise cannot precede ki-a/write'))
const collision = planModeElements(
  {
    'ki-a': {
      version: 1,
      elements: [
        { id: 'first', mode: 'conform', phase: 'write', entry: 'scripts/a.ts', reads: ['x'], writes: ['shared'] },
        { id: 'second', mode: 'conform', phase: 'write', entry: 'scripts/b.ts', reads: ['x'], writes: ['shared'] }
      ]
    }
  },
  'conform'
)
check(
  'planner → rejects unordered write collisions',
  collision.errors.includes('undeclared write collision: shared (ki-a/first, ki-a/second)')
)

if (failed) process.exit(1)
console.log('\n\x1b[32mmode-elements.test.ts: all checks passed\x1b[0m')
