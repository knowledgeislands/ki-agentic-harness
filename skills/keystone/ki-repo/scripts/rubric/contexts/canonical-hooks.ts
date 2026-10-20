/**
 * The canonical committed hooks, one pair per `primary_shape` and package presence, composed in a fixed order from
 * the `ki-repo` frame and the block each shape skill's standard declares. `HOOK-4` compares each committed hook with
 * this text byte for byte, and `ki dev skill generate ki-repo` publishes it as each shape skill's worked example under
 * `assets/githooks/`, so a repository copies it exactly and a later composer finds it already canonical.
 *
 * Content is lint, format and message checks over what is staged, quiet on success and offline: no test suite,
 * whole-project type check, full audit, build or network fetch, which belong to the manual gate and CI. There is no
 * extension point; a repository-specific check that is fast and check-only becomes a criterion of its shape skill and
 * runs through the focused staged audit.
 */
import type { RepositoryShape } from './shapes.ts'

export type HookName = 'pre-commit' | 'commit-msg'
export type HookVariant = 'package' | 'no-package'
export type CanonicalHooks = Readonly<Record<HookName, string>>

/** What a shape adds after the common staged lint: its own check-only lines and its focused audit. */
type ShapeBlock = {
  /** External tools the lines call, tested in the refusal. */
  readonly tools: readonly string[]
  readonly lines: readonly string[]
  /** The one shape skill whose focused `--staged` audit the hook runs. */
  readonly audit?: string
}

type ShapeHooks = { readonly owner: string; readonly package: ShapeBlock; readonly 'no-package': ShapeBlock } | null

const NONE: ShapeBlock = { tools: [], lines: [] }
const both = (owner: string, block: ShapeBlock): ShapeHooks => ({ owner, package: block, 'no-package': block })

// `ki-repo-tools`: staged shell files by name or shebang, and staged manual pages.
const SHELL_LINES = [
  '# Staged shell files, by name or by a sh or bash shebang, and staged manual pages (ki-repo-tools SHELL-HOOK).',
  'staged_shell() {',
  '  git diff --cached --name-only --diff-filter=ACMR | while IFS= read -r path; do',
  '    case "$path" in',
  '      *.sh | *.bash) printf \'%s\\n\' "$path" ;;',
  '      *) if head -n 1 -- "$path" 2>/dev/null | grep -Eq \'^#!.*[/ ](ba)?sh([[:space:]]|$)\'; then printf \'%s\\n\' "$path"; fi ;;',
  '    esac',
  '  done',
  '}',
  'shell_files="$(staged_shell)" || exit 1',
  'if [ -n "$shell_files" ]; then',
  "  printf '%s\\n' \"$shell_files\" | tr '\\n' '\\0' | xargs -0 shellcheck || exit 1",
  '  printf \'%s\\n\' "$shell_files" | while IFS= read -r path; do bash -n "$path" || exit 1; done || exit 1',
  'fi',
  "git diff --cached --name-only --diff-filter=ACMR -z -- 'man/*.[1-9]' | xargs -0 -r mandoc -T lint || exit 1"
]

const RUBY_LINES = [
  '# Staged Ruby, syntax-checked with warnings (ki-repo-homebrew-tap GATE-1).',
  "git diff --cached --name-only --diff-filter=ACMR -z -- '*.rb' | xargs -0 -r -n 1 ruby -wc >/dev/null || exit 1"
]

/** Every repository shape's hooks; `null` is a shape that declares no hook. */
export const SHAPE_HOOKS: Readonly<Record<RepositoryShape, ShapeHooks>> = {
  'ki-repo-project': both('ki-repo-project', NONE),
  'ki-repo-mcp': both('ki-repo-mcp', NONE),
  'ki-repo-website': both('ki-repo-website', NONE),
  'ki-repo-kb': both('ki-repo-kb', { ...NONE, audit: 'ki-repo-kb' }),
  'ki-repo-harness': both('ki-repo-harness', { ...NONE, audit: 'ki-repo-harness' }),
  'ki-repo-specifications': both('ki-repo-specifications', { ...NONE, audit: 'ki-repo-specifications' }),
  'ki-repo-homebrew-tap': both('ki-repo-homebrew-tap', {
    tools: ['ruby'],
    lines: RUBY_LINES,
    audit: 'ki-repo-homebrew-tap'
  }),
  'ki-repo-tools': both('ki-repo-tools', {
    tools: ['shellcheck', 'bash', 'mandoc'],
    lines: SHELL_LINES,
    audit: 'ki-repo-tools'
  }),
  'ki-repo-dotfiles-chezmoi': null
}

// `ki-engineering` SCR-11: staged formatters through lint-staged, then check-only Syncpack, then Commitlint.
const PACKAGE_TOOLS = ['lint-staged', 'syncpack', 'biome', 'rumdl']
const PACKAGE_LINES = ['lint-staged --quiet || exit 1', 'syncpack format --check || exit 1']
// `ki-authoring` MD-hook: staged Markdown where no package runs lint-staged.
const MARKDOWN_LINES = [
  '# Staged Markdown, checked where it stands (ki-authoring MD-hook).',
  "git diff --cached --name-only --diff-filter=ACMR -z -- '*.md' | xargs -0 -r rumdl check --quiet -- || exit 1"
]

const REFUSAL_TAIL = (hook: HookName): string[] => [
  `  echo "${hook}: do not bypass with --no-verify; a gate that cannot run is unknown, not a pass." >&2`,
  '  exit 1',
  'fi'
]

// One tool is tested directly; several are collected so the refusal names every missing one at once.
const refusal = (hook: HookName, tools: readonly string[], packaged: boolean): string[] => {
  if (tools.length === 0) return []
  const where = packaged ? 'missing from node_modules/.bin' : 'not on PATH'
  const remedy = packaged
    ? `  echo "${hook}: run \\\`bun install\\\` in $root, then commit again." >&2`
    : `  echo "${hook}: install ${tools.length === 1 ? 'it' : 'them'}, then commit again." >&2`
  if (tools.length === 1)
    return [
      packaged
        ? `if [ ! -x "$root/node_modules/.bin/${tools[0]}" ]; then`
        : `if ! command -v ${tools[0]} >/dev/null 2>&1; then`,
      `  echo "${hook}: the commit gate cannot run; ${where}: ${tools[0]}" >&2`,
      remedy,
      ...REFUSAL_TAIL(hook)
    ]
  return [
    "missing=''",
    `for tool in ${tools.join(' ')}; do`,
    packaged
      ? '  [ -x "$root/node_modules/.bin/$tool" ] || missing="$missing $tool"'
      : '  if ! command -v "$tool" >/dev/null 2>&1; then missing="$missing $tool"; fi',
    'done',
    'if [ -n "$missing" ]; then',
    `  echo "${hook}: the commit gate cannot run; ${where}:$missing" >&2`,
    remedy,
    ...REFUSAL_TAIL(hook)
  ]
}

const QUIET_AUDIT = [
  '# The focused shape audit, check-only over the staged paths; on a failure it runs again in full.',
  'quiet_audit() {',
  '  ki repo audit --repo "$root" --staged --concise --progress never --reporter-levels FAIL "$@" && return 0',
  '  ki repo audit --repo "$root" --staged "$@"',
  '  return 1',
  '}'
]

const header = (hook: HookName, shape: RepositoryShape, variant: HookVariant): string[] => [
  '#!/bin/sh',
  `# Canonical ${hook} for a ${shape} repository ${variant === 'package' ? 'with' : 'without'} a package.json, composed by ki-repo.`,
  `# Copied byte-exact from ${shape}'s assets/githooks/${variant}/${hook}; HOOK-4 compares it, so do not edit it here.`
]

// The repository root, where the package tools or the audit need it.
const ROOT = 'root="$(git rev-parse --show-toplevel)" || exit 1'

const PATH_LINES = ['PATH="$root/node_modules/.bin:$PATH"', 'export PATH']

const preCommit = (shape: RepositoryShape, variant: HookVariant, block: ShapeBlock): string => {
  const packaged = variant === 'package'
  const lines = [...header('pre-commit', shape, variant)]
  if (packaged || block.audit) lines.push(ROOT)
  lines.push('git diff --cached --quiet && exit 0')
  if (packaged) {
    lines.push(...refusal('pre-commit', PACKAGE_TOOLS, true))
    const external = [...block.tools, ...(block.audit ? ['ki'] : [])]
    lines.push(...refusal('pre-commit', external, false), ...PATH_LINES)
  } else lines.push(...refusal('pre-commit', ['rumdl', ...block.tools, ...(block.audit ? ['ki'] : [])], false))
  lines.push(...(packaged ? PACKAGE_LINES : MARKDOWN_LINES), ...block.lines)
  if (block.audit) lines.push(...QUIET_AUDIT, `quiet_audit --skill ${block.audit} || exit 1`)
  return `${lines.join('\n')}\n`
}

// `ki-engineering` SCR-11 where a package exists; `ki-git` `ki git check-message` where none does.
const commitMsg = (shape: RepositoryShape, variant: HookVariant): string => {
  const packaged = variant === 'package'
  const lines = [
    ...header('commit-msg', shape, variant),
    ...(packaged
      ? [ROOT, ...refusal('commit-msg', ['commitlint'], true), ...PATH_LINES, 'commitlint --edit "$1" || exit 1']
      : [...refusal('commit-msg', ['ki'], false), 'ki git check-message "$1" || exit 1'])
  ]
  return `${lines.join('\n')}\n`
}

/** The canonical hooks for a shape and package presence, or `null` where the shape declares no hook. */
export const canonicalHooks = (shape: RepositoryShape, variant: HookVariant): CanonicalHooks | null => {
  const hooks = SHAPE_HOOKS[shape]
  if (!hooks) return null
  return { 'pre-commit': preCommit(shape, variant, hooks[variant]), 'commit-msg': commitMsg(shape, variant) }
}

/** The skill whose `assets/githooks/` publishes a shape's worked example. */
export const hookOwner = (shape: RepositoryShape): string | null => SHAPE_HOOKS[shape]?.owner ?? null

export const HOOK_VARIANTS: readonly HookVariant[] = ['package', 'no-package']

/** Where a shape skill publishes one canonical hook, relative to the harness root. */
export const hookAsset = (owner: string, variant: HookVariant, hook: HookName): string =>
  `skills/repo-structure/${owner}/assets/githooks/${variant}/${hook}`
