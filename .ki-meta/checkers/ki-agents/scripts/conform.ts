#!/usr/bin/env bun
/**
 * Mechanical CONFORM for the ki-agents rubric.
 *
 * This mode only auto-fixes LAY-3: an agent file's `name:` frontmatter does
 * not match its filename stem. Other mechanics and every judgment criterion
 * stay for AUDIT and human review. Every invocation emits canonical JSONL;
 * `--dry-run` controls writing only.
 */

import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { basename, dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  type CheckerFinding,
  checkerReporterExitCode,
  emitCheckerReporter,
  judgmentFindingsFromRubric
} from './vendored/ki-skills/checker-reporter.ts'

const RUBRIC = 'references/rubric.md'
const findings: CheckerFinding[] = []

function localRubricPath(): string {
  const scriptDir = dirname(fileURLToPath(import.meta.url))
  const skillRoot = basename(scriptDir) === 'scripts' ? dirname(scriptDir) : scriptDir
  return join(skillRoot, 'references', 'rubric.md')
}

function rec(level: 'FAIL' | 'WARN' | 'POLISH' | 'ADVISORY' | 'INFO' | 'NA' | 'PASS', code: string, message: string, file?: string): void {
  findings.push({ type: 'M', level, code, message, ref: RUBRIC, file })
}

// Kept in lockstep with audit.ts for the field this script mutates.
function findName(content: string): { value: string } | null {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!match) return null
  for (const line of (match[1] as string).split(/\r?\n/)) {
    const keyValue = line.match(/^name:(.*)$/)
    if (!keyValue) continue
    let value = (keyValue[1] as string).trim()
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) value = value.slice(1, -1)
    return { value }
  }
  return null
}

function agentsRoot(abs: string): string {
  if (basename(abs) === 'agents') return abs
  const candidate = join(abs, 'agents')
  return existsSync(candidate) && statSync(candidate).isDirectory() ? candidate : abs
}

function discoverAgentFiles(path: string): string[] {
  const abs = resolve(path)
  if (!existsSync(abs)) return []
  if (statSync(abs).isFile()) return abs.endsWith('.md') ? [abs] : []
  const out: string[] = []
  const walk = (directory: string): void => {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      if (entry.name.startsWith('.') || entry.name === 'node_modules') continue
      const file = join(directory, entry.name)
      if (entry.isDirectory() || entry.isSymbolicLink()) {
        try {
          if (statSync(file).isDirectory()) walk(file)
        } catch {
          // Ignore dangling links.
        }
      } else if (entry.name.endsWith('.md') && entry.name !== 'README.md') {
        out.push(file)
      }
    }
  }
  walk(agentsRoot(abs))
  return out.sort()
}

const rawArgs = process.argv.slice(2)
const dryRun = rawArgs.includes('--dry-run')
const target = rawArgs.find((arg) => !arg.startsWith('-')) ?? 'agents'
const abs = resolve(target)

if (!existsSync(abs)) {
  rec('FAIL', 'LAY-1', 'The requested conform path does not exist.')
} else {
  for (const file of discoverAgentFiles(abs)) {
    const content = readFileSync(file, 'utf8')
    const stem = basename(file).replace(/\.md$/, '')
    const found = findName(content)
    if (!found) {
      rec('ADVISORY', 'NAME-1', 'No name field is available for the LAY-3 fix.', file)
      continue
    }
    if (found.value === stem) {
      rec('PASS', 'LAY-3', 'Filename stem already matches name.', file)
      continue
    }
    if (dryRun) {
      rec('POLISH', 'LAY-3', `Would rewrite name to ${stem}.`, file)
      continue
    }
    const lines = content.split(/\r?\n/)
    const nameLine = lines.findIndex((line) => /^name:/.test(line))
    if (nameLine === -1) {
      rec('ADVISORY', 'NAME-1', 'No name field is available for the LAY-3 fix.', file)
      continue
    }
    lines[nameLine] = `name: ${stem}`
    writeFileSync(file, lines.join('\n'))
    rec('POLISH', 'LAY-3', `Rewrote name to ${stem}.`, file)
  }
}

findings.push(...judgmentFindingsFromRubric(localRubricPath(), RUBRIC))
emitCheckerReporter({ mode: 'conform', concern: 'agents', target: abs, findings })
process.exit(checkerReporterExitCode(findings))
