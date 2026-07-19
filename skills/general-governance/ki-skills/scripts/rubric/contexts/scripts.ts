import { spawnSync } from 'node:child_process'
import { existsSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import type { ScriptHelpProbe } from './contexts.ts'

/** Probe the public Bun entry points without asking rubric items to execute processes. */
export const probeScriptHelp = (skillDirectory: string): readonly ScriptHelpProbe[] => {
  const scriptsDirectory = join(skillDirectory, 'scripts')
  if (!existsSync(scriptsDirectory)) return []

  return readdirSync(scriptsDirectory, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.ts') && !entry.name.endsWith('.test.ts'))
    .sort((left, right) => left.name.localeCompare(right.name))
    .map((entry) => {
      const result = spawnSync('bun', [join(scriptsDirectory, entry.name), '-h'], {
        encoding: 'utf8',
        timeout: 5_000
      })
      return {
        subject: `scripts/${entry.name}`,
        status: result.status,
        output: `${result.stdout ?? ''}${result.stderr ?? ''}`
      }
    })
}
