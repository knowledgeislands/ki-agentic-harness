/**
 * Renders the runtime surfaces that carry the owner-report shape from the `ki-coordination` standard's Generated surfaces
 * section, so the standard is their one source: the coordinator hook's `line` and `pointer`, the whole
 * `ki-coordinator` output style, the run-prompt skeleton's Report paragraph and each authority footer's report rule, and
 * the review-independence line of the run-prompt skeleton and the `ki-work-design` brief template.
 *
 * Boundary: reads the standard and the current surfaces under the harness root and returns each surface's rendered
 * bytes; it never writes. `ki dev skill generate ki-coordination` compares or publishes them, and the banner test checks the
 * committed surfaces against them.
 */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

export type GeneratedSurface = { readonly path: string; readonly content: string }

export type SkillGeneration = {
  readonly contract: 1
  readonly name: string
  readonly generate: (harnessRoot: string) => readonly GeneratedSurface[]
}

const STANDARD = 'skills/change-management/ki-coordination/references/standards-coordination.md'
const HOOK = 'hooks/coordinator-reminder.sh'
const OUTPUT_STYLE = 'output-styles/ki-coordinator.md'
const DELEGATION_ASSETS = 'skills/governance/ki-delegation/assets'
const RUN_PROMPT = `${DELEGATION_ASSETS}/run-prompt.md`
const DESIGN_BRIEF = 'skills/change-management/ki-work-design/assets/brief.md'
const FOOTERS = ['none', 'push', 'prune', 'release'].map((tier) => `${DELEGATION_ASSETS}/rules-${tier}.md`)
/** The Banner examples the output style source names by token, each written once in the standard. */
const BANNER_BLOCKS = ['heading-example', 'with-worker-banner', 'handoff-banner', 'hold-banner'] as const

type Marked = { readonly block: string; readonly body: string }

/** The fenced block directly after `<!-- ki-coordination:<kind> <name> -->` and one blank line: whole, and its body alone. */
export const markedBlock = (standard: string, kind: 'source' | 'block', name: string): Marked => {
  const marker = `<!-- ki-coordination:${kind} ${name} -->\n\n`
  const at = standard.indexOf(marker)
  if (at < 0 || standard.indexOf(marker, at + 1) >= 0)
    throw new Error(`${STANDARD} must mark exactly one ki-coordination:${kind} ${name} block`)
  const rest = standard.slice(at + marker.length)
  const opening = /^(`{3,})[a-z]*\n/.exec(rest)
  if (!opening?.[1]) throw new Error(`ki-coordination:${kind} ${name} is not followed by a fenced block`)
  const fence = opening[1]
  const close = rest.indexOf(`\n${fence}\n`, opening[0].length - 1)
  if (close < 0) throw new Error(`ki-coordination:${kind} ${name} has no closing fence`)
  return { block: rest.slice(0, close + fence.length + 2), body: rest.slice(opening[0].length, close) }
}

/** Replace the one line a pattern matches, refusing a surface that has none or several. */
const spliceLine = (text: string, path: string, pattern: RegExp, line: string): string => {
  const global = new RegExp(pattern.source, 'gm')
  const count = text.match(global)?.length ?? 0
  if (count !== 1) throw new Error(`${path} must hold exactly one line matching ${pattern.source}; found ${count}`)
  return text.replace(global, () => line)
}

const shellValue = (name: string, value: string): string => {
  if (value.includes("'") || value.includes('\n'))
    throw new Error(`ki-coordination:source hook-${name} must be one line with no single quote`)
  return `${name}='${value}'`
}

export const generate = (harnessRoot: string): readonly GeneratedSurface[] => {
  const read = (path: string): string => readFileSync(join(harnessRoot, path), 'utf8')
  const standard = read(STANDARD)
  const source = (name: string): string => markedBlock(standard, 'source', name).body

  let hook = read(HOOK)
  hook = spliceLine(hook, HOOK, /^line='.*'$/, shellValue('line', source('hook-line')))
  hook = spliceLine(hook, HOOK, /^pointer='.*'$/, shellValue('pointer', source('hook-pointer')))

  let style = `${source('output-style')}\n`
  for (const name of BANNER_BLOCKS) {
    const token = `{{${name}}}\n`
    if (style.split(token).length !== 2)
      throw new Error(`ki-coordination:source output-style must name {{${name}}} once`)
    style = style.replace(token, () => markedBlock(standard, 'block', name).block)
  }

  const independence = source('review-independence')
  let prompt = spliceLine(read(RUN_PROMPT), RUN_PROMPT, /^\*\*Report\*\* to .*$/, source('run-report'))
  prompt = spliceLine(prompt, RUN_PROMPT, /^\*\*Independence\*\*.*$/, independence)
  const brief = spliceLine(read(DESIGN_BRIEF), DESIGN_BRIEF, /^\*\*Independence\*\*.*$/, independence)
  const footers = FOOTERS.map((path) => ({
    path,
    content: spliceLine(read(path), path, /^- Write the report .*$/, source('footer-report'))
  }))

  return [
    { path: HOOK, content: hook },
    { path: OUTPUT_STYLE, content: style },
    { path: RUN_PROMPT, content: prompt },
    { path: DESIGN_BRIEF, content: brief },
    ...footers
  ]
}

export default { contract: 1, name: 'ki-coordination', generate } satisfies SkillGeneration
