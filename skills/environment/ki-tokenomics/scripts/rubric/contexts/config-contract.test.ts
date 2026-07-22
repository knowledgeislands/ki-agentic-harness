#!/usr/bin/env bun

import { spawnSync } from 'node:child_process'
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const auditEngine = join(here, 'audit-engine.ts')
const conformEngine = join(here, 'conform-engine.ts')
let failed = false

function check(label: string, condition: boolean, diagnostic = ''): void {
  if (condition) console.log(`  \x1b[32mok\x1b[0m   ${label}`)
  else {
    failed = true
    console.log(`  \x1b[31mFAIL\x1b[0m ${label}${diagnostic ? ` — ${diagnostic}` : ''}`)
  }
}

function runEngine(engine: string, config: string): string[] {
  const root = mkdtempSync(join(tmpdir(), 'ki-tokenomics-config-'))
  try {
    writeFileSync(join(root, '.ki-config.toml'), config)
    const result = spawnSync(process.execPath, [engine, root, '--no-user'], { encoding: 'utf8' })
    return `${result.stdout ?? ''}${result.stderr ?? ''}`.split(/\r?\n/).flatMap((line) => {
      try {
        const record = JSON.parse(line) as { record?: string; message?: unknown }
        return record.record === 'finding' && typeof record.message === 'string' ? [record.message] : []
      } catch {
        return []
      }
    })
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
}

const audit = (config: string): string[] => runEngine(auditEngine, config)
const conform = (config: string): string[] => runEngine(conformEngine, config)

{
  const messages = audit('[ki-tokenomics]\nheadroom = "off"\npreferred_model_type = "reasoning"\n')
  check(
    'portable model type remains recognised',
    messages.some((message) => message.includes('preferred_model_type = "reasoning"'))
  )
  check(
    'portable model type produces no unknown-key diagnostic',
    !messages.some((message) => message.includes('unrecognised key "preferred_model_type"'))
  )
}

{
  const config = '[ki-tokenomics]\nheadroom = "off"\npreferred_model = "opus"\n'
  const messages = audit(config)
  check(
    'retired key follows ordinary validate-down handling',
    messages.some((message) => message.includes('unrecognised key "preferred_model"'))
  )
  check(
    'retired key no longer carries a migration mapping',
    !messages.some((message) => message.includes('retired Claude-only key') || message.includes('map it to preferred_model_type'))
  )

  const conformMessages = conform(config)
  check(
    'retired key produces an ordinary conform validate-down TODO',
    conformMessages.some((message) => message.includes('unrecognised key "preferred_model"'))
  )
  check(
    'conform no longer carries a migration mapping',
    !conformMessages.some(
      (message) => message.includes('retired Claude-only key') || message.includes('replace it with preferred_model_type')
    )
  )
}

if (failed) process.exit(1)
console.log('\x1b[32mconfig-contract.test.ts: all checks passed\x1b[0m')
