import { execSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'

export const PRETTIER_DEFAULT = `{
  "printWidth": 160,
  "tabWidth": 2,
  "useTabs": false,
  "semi": false,
  "singleQuote": true,
  "proseWrap": "never",
  "trailingComma": "none",
  "overrides": [
    {
      "files": "*.md",
      "options": {
        "parser": "markdown"
      }
    }
  ]
}
`

export const EDITORCONFIG_DEFAULT = `root = true

[*]
indent_style = space
indent_size = 2
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true

[*.md]
trim_trailing_whitespace = false
`

export const MARKDOWNLINT_DEFAULT = `{
  // Base: enable all rules, then selectively adjust below.
  "config": {
    "default": true,

    // MD013 - line length: disabled. Prettier owns line length via printWidth / proseWrap.
    "MD013": false,

    // MD024 - duplicate headings: allow in sibling sections only.
    "MD024": { "siblings_only": true },

    // MD025 - single H1: ignore the frontmatter title field.
    "MD025": { "front_matter_title": "" },

    // MD033 - inline HTML: disabled. <br> is used in table cells and skills use angle-bracket placeholders.
    "MD033": false,

    // MD036 - bold as heading: disabled. Bold labels are used intentionally in skill bodies.
    "MD036": false
  },

  // Skill bodies, references, and repo docs are all markdown content.
  "globs": ["**/*.md"],

  // Never lint generated output, vendored/generated trees, or dependencies. The
  // \`.ki-meta/\` vendored checkers, generated source, and generated runtime payloads are
  // machine-produced (ADR-KI-HARNESS-TOOLCHAIN-005) — excluded like dist/, so their
  // formatting is never a finding. Command files are frontmatter-first runtime definitions,
  // while authored \`.claude/\` siblings such as workflows remain in scope.
  "ignores": ["dist/**", "**/node_modules/**", ".ki-meta/**", "src/generated/**", ".claude/commands/**", ".claude/skills/**", ".claude/agents/**", ".agents/skills/**"]
}
`

const CHECK =
  'bunx prettier --check "**/*.md" "!.ki-meta/**" "!src/generated/**" "!.claude/commands/**" "!.claude/skills/**" "!.claude/agents/**" "!.agents/skills/**" --ignore-path .gitignore && bunx markdownlint-cli2 "**/*.md"'
const CONFORM =
  'bunx prettier --write "**/*.md" "!.ki-meta/**" "!src/generated/**" "!.claude/commands/**" "!.claude/skills/**" "!.claude/agents/**" "!.agents/skills/**" --ignore-path .gitignore && bunx markdownlint-cli2 --fix'

export type OwnedFile = '.prettierrc.json' | '.editorconfig' | '.markdownlint-cli2.jsonc'
export type AuthoringRubricContext = {
  target: string
  dryRun: boolean
  exists: boolean
  markdownAudit: () => { clean: boolean; detail?: string }
  markdownConform: () => boolean
  owned: (name: OwnedFile) => 'missing' | 'canonical' | 'drifted'
  syncOwned: (name: OwnedFile) => 'scaffolded' | 'overwritten' | 'canonical'
}

const canonical: Record<OwnedFile, string> = {
  '.prettierrc.json': PRETTIER_DEFAULT,
  '.editorconfig': EDITORCONFIG_DEFAULT,
  '.markdownlint-cli2.jsonc': MARKDOWNLINT_DEFAULT
}
const sha256 = (content: string): string => createHash('sha256').update(content).digest('hex')

export const createAuthoringContextFactory = ({
  target,
  dryRun = false
}: {
  target: string
  dryRun?: boolean
}): (() => AuthoringRubricContext) => {
  const absoluteTarget = resolve(target)
  const owned = (name: OwnedFile): 'missing' | 'canonical' | 'drifted' => {
    const path = join(absoluteTarget, name)
    if (!existsSync(path)) return 'missing'
    return sha256(readFileSync(path, 'utf8')) === sha256(canonical[name]) ? 'canonical' : 'drifted'
  }
  return () => ({
    target: absoluteTarget,
    dryRun,
    exists: existsSync(absoluteTarget),
    markdownAudit: () => {
      try {
        execSync(CHECK, { cwd: absoluteTarget, stdio: ['pipe', 'pipe', 'pipe'], encoding: 'utf8' })
        return { clean: true }
      } catch (error) {
        const output = (error as { stdout?: string }).stdout?.trim()
        return { clean: false, ...(output ? { detail: output.split('\n').slice(0, 8).join('\n    ') } : {}) }
      }
    },
    markdownConform: () => {
      try {
        execSync(dryRun ? CHECK : CONFORM, { cwd: absoluteTarget, stdio: ['pipe', 'pipe', 'pipe'], encoding: 'utf8' })
        return true
      } catch {
        return false
      }
    },
    owned,
    syncOwned: (name) => {
      const state = owned(name)
      if (state === 'canonical') return 'canonical'
      if (!dryRun) writeFileSync(join(absoluteTarget, name), canonical[name])
      return state === 'missing' ? 'scaffolded' : 'overwritten'
    }
  })
}
