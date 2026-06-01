#!/usr/bin/env bun
/**
 * Skill eval harness — behavioural validation, the complement to the linters.
 *
 *   bun evals/harness.ts                 # run every scenario on the default model (sonnet)
 *   bun evals/harness.ts --model opus    # …on another model (sonnet | opus | haiku | full id)
 *   bun evals/harness.ts --scenario toml-style   # one scenario by id
 *
 * For each scenario it runs the same prompt TWICE through the local `claude` CLI:
 *   • baseline  — `claude -p <prompt> --disallowed-tools Skill`  (skills off — see runClaude)
 *   • treatment — `claude -p "/<skill> <prompt>" --add-dir ~/.claude/skills`  (skill loaded)
 * then scores both, HYBRID:
 *   • deterministic — regex assertions over the answer (the skill's checkable house rules)
 *   • judge         — an LLM scores each answer 0-5 against the scenario's rubric
 * and reports, per scenario, whether the skill improved on the baseline. This is the
 * mechanical realisation of skills-rubric PROC-1/2 (eval scenarios vs a no-skill baseline).
 *
 * CAVEATS, by design:
 *   • Non-deterministic — model output varies run to run; treat as a WARN-grade signal, never a gate.
 *   • In-situ baseline — `claude -p` still loads the user's ambient ~/.claude/CLAUDE.md in BOTH
 *     arms (auth here is OAuth, so --bare is unavailable). The score is therefore the skill's
 *     MARGINAL value over that ambient context — a conservative bar. Scenarios target rules the
 *     ambient context does not already supply.
 *   • Spends tokens — every run calls the live model on your Claude Code quota; cost is reported.
 *
 * Uses the local `claude` CLI (no API key needed). Bun/Node built-ins only. Exit 0 always
 * (advisory); a regression is reported, not failed.
 */
import { execFileSync } from 'node:child_process'
import { mkdtempSync } from 'node:fs'
import { homedir, tmpdir } from 'node:os'
import { join } from 'node:path'
import { scenarios as authoringScenarios } from './scenarios/knowledgeislands-authoring.ts'
import { scenarios as kbScenarios } from './scenarios/knowledgeislands-kb.ts'
import { scenarios as mcpScenarios } from './scenarios/knowledgeislands-mcp.ts'
import { scenarios as repoScenarios } from './scenarios/knowledgeislands-repo.ts'
import { scenarios as skillsScenarios } from './scenarios/knowledgeislands-skills.ts'

export type Assertion = { name: string; re: RegExp }
export type Scenario = { skill: string; id: string; prompt: string; assertions: Assertion[]; rubric: string }

// Scenario registry — add a `./scenarios/<skill>.ts` file and spread it in here.
const ALL: Scenario[] = [...authoringScenarios, ...kbScenarios, ...mcpScenarios, ...repoScenarios, ...skillsScenarios]

const C = { reset: '\x1b[0m', dim: '\x1b[2m', green: '\x1b[32m', yellow: '\x1b[33m', red: '\x1b[31m', cyan: '\x1b[36m', bold: '\x1b[1m' }
const paint = (c: string, s: string): string => `${c}${s}${C.reset}`

const CALL_TIMEOUT_MS = 240_000
// Skills install here (symlinks back to this repo). The treatment arm runs in an
// isolated temp cwd, so it needs this dir allowed to READ a skill's reference files
// (the skill's deeper conventions live there) — otherwise the skill can't function.
const SKILLS_DIR = join(homedir(), '.claude', 'skills')
type Run = { text: string; costUsd: number; error: string | null }

// One `claude -p` call in an isolated cwd. With `skill`, prepend the slash invocation
// so the skill loads, and allow reading its reference files. Without it, BLOCK the
// `Skill` tool — this is the true skill-free baseline. (`--disable-slash-commands`
// alone does NOT stop a skill auto-loading by description match, so the baseline
// would otherwise be contaminated by the very skill under test.)
function runClaude(prompt: string, model: string, cwd: string, skill?: string): Run {
  const input = skill ? `/${skill}\n\n${prompt}` : prompt
  const args = ['-p', input, '--model', model, '--output-format', 'json']
  if (skill) args.push('--add-dir', SKILLS_DIR)
  else args.push('--disallowed-tools', 'Skill')
  try {
    const out = execFileSync('claude', args, { cwd, encoding: 'utf8', timeout: CALL_TIMEOUT_MS, maxBuffer: 64 * 1024 * 1024 })
    const j = JSON.parse(out) as { result?: unknown; total_cost_usd?: number; is_error?: boolean; subtype?: string }
    return { text: typeof j.result === 'string' ? j.result : '', costUsd: j.total_cost_usd ?? 0, error: j.is_error ? (j.subtype ?? 'error') : null }
  } catch (e) {
    return { text: '', costUsd: 0, error: String((e as Error).message ?? e).split('\n')[0] }
  }
}

// Pull the first JSON object out of a judge reply that may be fenced or prefaced.
function extractJson(text: string): string {
  const fenced = text.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/)
  if (fenced?.[1]) return fenced[1]
  const start = text.indexOf('{')
  const end = text.lastIndexOf('}')
  return start !== -1 && end > start ? text.slice(start, end + 1) : text
}

type Judgement = { baseline: number; treatment: number; note: string; costUsd: number }
function judge(s: Scenario, baseline: string, treatment: string, model: string, cwd: string): Judgement {
  const prompt = `You are scoring two answers against a house style-guide rubric. Score EACH answer 0-5 for how well it satisfies the rubric (5 = fully matches the house convention; 0 = ignores or contradicts it). Output ONLY compact JSON, no prose: {"baseline":N,"treatment":N,"note":"<=15 words"}.

RUBRIC:
${s.rubric}

ANSWER A (baseline):
${baseline || '(empty)'}

ANSWER B (treatment):
${treatment || '(empty)'}`
  const r = runClaude(prompt, model, cwd)
  try {
    const j = JSON.parse(extractJson(r.text)) as { baseline?: number; treatment?: number; note?: string }
    const clamp = (n: unknown): number => (typeof n === 'number' && n >= 0 && n <= 5 ? n : -1)
    return { baseline: clamp(j.baseline), treatment: clamp(j.treatment), note: String(j.note ?? ''), costUsd: r.costUsd }
  } catch {
    return { baseline: -1, treatment: -1, note: 'judge parse failed', costUsd: r.costUsd }
  }
}

// ── run ────────────────────────────────────────────────────────────────────
const argv = process.argv.slice(2)
const arg = (flag: string): string | undefined => {
  const i = argv.indexOf(flag)
  return i !== -1 ? argv[i + 1] : undefined
}
const model = arg('--model') ?? 'sonnet'
const only = arg('--scenario')
const skillOnly = arg('--skill')
const judgeModel = arg('--judge-model') ?? 'sonnet'
const runs = Math.max(1, Number.parseInt(arg('--runs') ?? '1', 10) || 1)
let scenarios = only ? ALL.filter((s) => s.id === only) : ALL
if (skillOnly) scenarios = scenarios.filter((s) => s.skill === skillOnly)
if (scenarios.length === 0) {
  console.error(paint(C.red, `no scenario matches ${only ? `--scenario ${only}` : `--skill ${skillOnly}`}`))
  process.exit(2)
}

const cwd = mkdtempSync(join(tmpdir(), 'ki-eval-'))
const mean = (xs: number[]): number => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : -1)
const fmt = (x: number): string => (runs === 1 ? String(x) : x.toFixed(1))

console.log(paint(C.dim, `model: ${model} · judge: ${judgeModel} · scenarios: ${scenarios.length} · runs/arm: ${runs} · isolated cwd: ${cwd}`))
console.log(paint(C.dim, 'baseline = skills off · treatment = skill loaded · in-situ (ambient CLAUDE.md in both) · non-deterministic, advisory'))

let totalCost = 0
let helped = 0
let regressed = 0
for (const s of scenarios) {
  console.log(`\n${paint(C.bold, s.id)} ${paint(C.dim, `(${s.skill})`)}`)
  const n = s.assertions.length
  const bHits = new Array(n).fill(0) // per-assertion pass count over runs
  const tHits = new Array(n).fill(0)
  const bTrial: number[] = [] // assertions passed per baseline trial
  const tTrial: number[] = []
  const jb: number[] = [] // judge scores (parsed trials only)
  const jt: number[] = []
  let errors = 0
  let lastNote = ''
  for (let i = 0; i < runs; i++) {
    const baseline = runClaude(s.prompt, model, cwd)
    const treatment = runClaude(s.prompt, model, cwd, s.skill)
    totalCost += baseline.costUsd + treatment.costUsd
    if (baseline.error || treatment.error) errors++
    let b = 0
    let t = 0
    s.assertions.forEach((a, idx) => {
      if (a.re.test(baseline.text)) {
        bHits[idx]++
        b++
      }
      if (a.re.test(treatment.text)) {
        tHits[idx]++
        t++
      }
    })
    bTrial.push(b)
    tTrial.push(t)
    const j = judge(s, baseline.text, treatment.text, judgeModel, cwd)
    totalCost += j.costUsd
    if (j.baseline >= 0) {
      jb.push(j.baseline)
      jt.push(j.treatment)
    }
    lastNote = j.note || lastNote
  }
  if (errors) console.log(paint(C.red, `  ! ${errors}/${runs} run(s) had a call error`))

  const meanB = mean(bTrial)
  const meanT = mean(tTrial)
  console.log(`  ${paint(C.dim, 'assertions')}  baseline ${fmt(meanB)}/${n}   treatment ${fmt(meanT)}/${n}${runs > 1 ? paint(C.dim, ` (mean of ${runs})`) : ''}`)
  s.assertions.forEach((a, idx) => {
    const cell = (hits: number): string => (runs === 1 ? (hits ? paint(C.green, '✓') : paint(C.red, '✗')) : paint(hits === runs ? C.green : hits === 0 ? C.red : C.yellow, `${hits}/${runs}`))
    console.log(`    ${cell(bHits[idx])} ${cell(tHits[idx])}  ${paint(C.dim, a.name)}`)
  })

  const mjb = mean(jb)
  const mjt = mean(jt)
  const jstr = mjb < 0 ? paint(C.yellow, lastNote || 'judge parse failed') : `baseline ${fmt(mjb)}/5   treatment ${fmt(mjt)}/5${runs === 1 ? paint(C.dim, ` — ${lastNote}`) : ''}`
  console.log(`  ${paint(C.dim, 'judge')}       ${jstr}`)

  const detDelta = meanT - meanB
  const judgeDelta = mjt >= 0 ? mjt - mjb : 0
  let verdict: string
  if (detDelta > 0 || judgeDelta > 0) {
    helped++
    verdict = paint(C.green, 'skill helped')
  } else if (detDelta < 0 || judgeDelta < 0) {
    regressed++
    verdict = paint(C.red, 'skill regressed')
  } else {
    verdict = paint(C.yellow, 'no measurable difference')
  }
  console.log(`  ${paint(C.dim, 'verdict')}     ${verdict}`)
}

console.log(
  `\n${paint(C.cyan, 'summary')}: ${scenarios.length} scenario(s) × ${runs} run(s) · ${paint(C.green, `${helped} helped`)} · ${paint(C.red, `${regressed} regressed`)} · ${paint(C.dim, `~$${totalCost.toFixed(2)} on ${model}`)}`
)
console.log(paint(C.dim, 'advisory (PROC-1/2) — non-deterministic; raise --runs to stabilise. Marginal value over the ambient baseline.'))
process.exit(0)
