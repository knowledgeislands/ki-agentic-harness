import { existsSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import type { ConformOutcome } from '../../vendored/ki-skills/rubric.ts'

const SKIP_DIRS = new Set(['.git', 'node_modules', '.ki', '.claude'])
const RECOGNIZED_PREFIXES = ['executable_', 'symlink_', 'private_', 'readonly_', 'dot_', 'create_', 'modify_'] as const

export type ChezmoiContext = {
  target: string
  available: boolean
  dryRun: boolean
  hasIgnore: boolean
  hasTemplateFiles: boolean
  hasTemplateSupport: boolean
  binEntries: readonly string[] | null
  strayLocks: readonly string[] | null
  ensureIgnore: () => ConformOutcome
}

const walk = (directory: string, onFile: (path: string) => void, skip: (name: string) => boolean): void => {
  let entries: string[]
  try {
    entries = readdirSync(directory)
  } catch {
    return
  }

  for (const entry of entries) {
    if (skip(entry)) continue
    const path = join(directory, entry)
    try {
      if (statSync(path).isDirectory()) walk(path, onFile, skip)
      else onFile(path)
    } catch {
      // Concurrently removed files are not audit failures.
    }
  }
}

export const createChezmoiContextFactory = ({ target, dryRun = false }: { target: string; dryRun?: boolean }): (() => ChezmoiContext) => {
  const root = resolve(target)

  return () => {
    const available = existsSync(root) && statSync(root).isDirectory()
    const at = (...parts: string[]) => join(root, ...parts)
    const has = (...parts: string[]) => existsSync(at(...parts))
    let hasTemplateFiles = false
    if (available)
      walk(
        root,
        (path) => {
          if (path.endsWith('.tmpl')) hasTemplateFiles = true
        },
        (name) => SKIP_DIRS.has(name)
      )

    const binEntries =
      available && has('bin') && statSync(at('bin')).isDirectory()
        ? readdirSync(at('bin')).filter((entry) => {
            try {
              return !statSync(at('bin', entry)).isDirectory()
            } catch {
              return false
            }
          })
        : null

    const strayLocks: string[] = []
    if (available && has('.git')) {
      for (const candidate of ['.git/index.lock', '.git/HEAD.lock', '.git/config.lock', '.git/packed-refs.lock'])
        if (has(candidate)) strayLocks.push(candidate)
      if (has('.git', 'refs'))
        walk(
          at('.git', 'refs'),
          (path) => {
            if (path.endsWith('.lock')) strayLocks.push(path.slice(root.length + 1))
          },
          () => false
        )
    }

    const ensureIgnore = (): ConformOutcome => {
      if (!available) return { status: 'VIOLATION', message: 'conform target is not an existing directory', subject: root }
      if (has('.chezmoiignore')) return { status: 'PASS', message: 'managed ignore file is already present', subject: '.chezmoiignore' }
      if (!dryRun)
        writeFileSync(
          at('.chezmoiignore'),
          '# Files/directories chezmoi should never manage.\n# See references/standards.md (Repo layout & naming) in the ki-dotfiles-chezmoi skill.\n'
        )
      return { status: 'FIXED', message: `${dryRun ? 'would scaffold' : 'scaffolded'} the managed ignore file`, subject: '.chezmoiignore' }
    }

    return {
      target: root,
      available,
      dryRun,
      hasIgnore: available && has('.chezmoiignore'),
      hasTemplateFiles,
      hasTemplateSupport: available && (has('.chezmoidata') || has('.chezmoitemplates')),
      binEntries,
      strayLocks: available && has('.git') ? strayLocks : null,
      ensureIgnore
    }
  }
}

export const hasRecognizedPrefix = (name: string): boolean => RECOGNIZED_PREFIXES.some((prefix) => name.startsWith(prefix))
