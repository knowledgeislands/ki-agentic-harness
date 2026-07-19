#!/usr/bin/env bun
/**
 * Materialise declared shared modules in each consumer's local source
 * payload. These are ordinary copied files, not cross-skill imports or symlinks:
 * a checker must run from its own skill and again from `.ki-meta/` unchanged.
 *
 * Internal bootstrap command: bun sync-shared-modules.ts [--check]
 */
import { cpSync, lstatSync, mkdirSync, readdirSync, readFileSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import {
  allSkillNames,
  type SharedModule,
  type SharedModulePayload,
  sharedDependenciesOf,
  sharedModulePayload,
  skillDir
} from './resolve.ts'

const checkOnly = process.argv.slice(2).includes('--check')

function lstatOrNull(path: string): ReturnType<typeof lstatSync> | null {
  try {
    return lstatSync(path)
  } catch {
    return null
  }
}

function destination(skill: string, module: SharedModule, payload: SharedModulePayload): string {
  return join(skillDir(skill), 'scripts', 'vendored', module.provider, payload.targetName)
}

function safeEntry(path: string): ReturnType<typeof lstatSync> | null {
  const stat = lstatOrNull(path)
  if (!stat) return null
  if (stat.isSymbolicLink() || (!stat.isFile() && !stat.isDirectory())) throw new Error(`unsafe shared module entry: ${path}`)
  return stat
}

function samePayload(left: string, right: string): boolean {
  const leftStat = safeEntry(left)
  const rightStat = safeEntry(right)
  if (!leftStat || !rightStat || leftStat.isDirectory() !== rightStat.isDirectory()) return false
  if (leftStat.isFile()) return readFileSync(left).equals(readFileSync(right))
  const leftNames = readdirSync(left).sort()
  const rightNames = readdirSync(right).sort()
  return (
    JSON.stringify(leftNames) === JSON.stringify(rightNames) && leftNames.every((name) => samePayload(join(left, name), join(right, name)))
  )
}

function replacePayload(source: SharedModulePayload, target: string, label: string): void {
  const existing = safeEntry(target)
  if (existing) rmSync(target, { recursive: existing.isDirectory() })
  mkdirSync(join(target, '..'), { recursive: true })
  cpSync(source.source, target, { recursive: source.kind === 'directory' })
  if (!samePayload(source.source, target)) throw new Error(`shared module copy failed verification: ${label}`)
}

const drift: string[] = []
for (const skill of allSkillNames()) {
  for (const module of sharedDependenciesOf(skill)) {
    if (module.provider === skill) throw new Error(`${skill} cannot depend on its own shared module`)
    const payload = sharedModulePayload(module)
    const target = destination(skill, module, payload)
    if (samePayload(payload.source, target)) continue
    const label = `${skill}/scripts/vendored/${module.provider}/${payload.targetName}`
    if (checkOnly) {
      drift.push(label)
      continue
    }
    replacePayload(payload, target, label)
    console.log(`copy ${label}`)
  }
}

if (drift.length) {
  console.error(`shared-module drift: ${drift.join(', ')} — run sync-shared-modules.ts`)
  process.exit(1)
}

console.log(checkOnly ? 'shared module payloads are current' : 'shared module payloads synchronized')
