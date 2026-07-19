import { existsSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import type { ConformOutcome, RubricOutcomes } from '../../vendored/ki-skills/rubric.ts'

const SECTION = 'ki-specifications'
const core = ['proposals', 'specifications', 'schemas'] as const
const supporting = ['templates', 'examples', 'docs', 'tooling'] as const
const isDirectory = (path: string): boolean => existsSync(path) && statSync(path).isDirectory()

export type SpecificationsContext = {
  targetExists: boolean
  applicable: boolean
  configExists: boolean
  malformed: boolean
  table: Readonly<Record<string, unknown>> | null
  core: readonly { path: string; exists: boolean }[]
  supporting: readonly { path: string; exists: boolean }[]
  conformMarker: () => RubricOutcomes<ConformOutcome>
}

/** Collect evidence and expose the sole safe write capability. */
export const createSpecificationsContext = ({ target, dryRun }: { target: string; dryRun: boolean }): SpecificationsContext => {
  const absolute = resolve(target)
  const targetExists = isDirectory(absolute)
  const configPath = join(absolute, '.ki-config.toml')
  const configExists = targetExists && existsSync(configPath)
  let malformed = false
  let table: Record<string, unknown> | null = null
  if (configExists)
    try {
      const parsed = Bun.TOML.parse(readFileSync(configPath, 'utf8')) as Record<string, unknown>
      const candidate = parsed[SECTION]
      if (candidate && typeof candidate === 'object' && !Array.isArray(candidate)) table = candidate as Record<string, unknown>
    } catch {
      malformed = true
    }
  const coreEvidence = core.map((path) => ({ path, exists: targetExists && isDirectory(join(absolute, path)) }))
  const supportingEvidence = supporting.map((path) => ({ path, exists: targetExists && isDirectory(join(absolute, path)) }))
  return {
    targetExists,
    configExists,
    malformed,
    table,
    applicable: Boolean(table || malformed || coreEvidence.some((entry) => entry.exists)),
    core: coreEvidence,
    supporting: supportingEvidence,
    conformMarker: () => {
      if (!targetExists) return [{ status: 'VIOLATION', level: 'FAIL', message: 'Conform target must be an existing directory.' }]
      if (!configExists)
        return [
          {
            status: 'VIOLATION',
            level: 'FAIL',
            message: '.ki-config.toml is absent; establish the repository with ki-repo first.',
            subject: '.ki-config.toml'
          }
        ]
      const current = readFileSync(configPath, 'utf8')
      let parsed: Record<string, unknown>
      try {
        parsed = Bun.TOML.parse(current) as Record<string, unknown>
      } catch {
        return [
          {
            status: 'VIOLATION',
            level: 'FAIL',
            message: '.ki-config.toml is malformed; repair it before conforming.',
            subject: '.ki-config.toml'
          }
        ]
      }
      if (parsed[SECTION] !== undefined)
        return [{ status: 'PASS', message: 'The [ki-specifications] marker is already present.', subject: '.ki-config.toml' }]
      if (!dryRun)
        writeFileSync(configPath, `${current.trimEnd()}\n\n# This repo carries the KI Specifications repository structure.\n[${SECTION}]\n`)
      return [
        {
          status: 'FIXED',
          message: `The [ki-specifications] marker ${dryRun ? 'would be added' : 'was added'}.`,
          subject: '.ki-config.toml'
        }
      ]
    }
  }
}
