#!/usr/bin/env bun
/**
 * Mechanical checker for the `Streams` zone of a Knowledge Islands base.
 *
 *   bun scripts/audit.ts [base-path]   # audit a base (default: cwd)
 *   bun scripts/audit.ts --educate        # print the default [ki-kb-streams] block
 *
 * This is the mechanical half of the skill's Mode AUDIT — the deterministic
 * layer the judgment pass (index ordering, Governance sections, proposals-index
 * accuracy, completed-proposal deletion) builds on. It checks, inside the
 * `Streams/` zone (resolved THROUGH any `[ki-kb.zones]` alias, so a
 * base mid-rename is audited at its real folder):
 *
 *   STREAM-1  folders directly under Streams/ are the Focus set.
 *   STREAM-2  each present Focus folder carries a same-name index note.
 *   STREAM-3  a full proposal holds a `* Proposal.md` (leaf/parent) with the suffix;
 *             a lightweight tracker stream needs none (flagged only if it declares a proposal).
 *   ENACT-1   every `* Proposal.md` carries status/priority/dependencies frontmatter.
 *   ENACT-2   status ∈ the lifecycle vocabulary and priority ∈ {urgent…low}, as bare tokens.
 *   CONFIG    the base's [ki-kb-streams] table, validated DOWN.
 *   GATE-1    once the base runs proposals, its CLAUDE.md / AGENTS.md anchors the gate.
 *
 * That `Streams/` exists at all and carries a same-name zone index is the
 * `ki-kb` checker's ZONE-* job, not repeated here. Parent / multi
 * proposal layout and the [J] criteria are applied by reading, per the rubric.
 *
 * READ-ONLY: never mutates the base. `--educate` prints the default block to stdout.
 * No npm dependencies — Bun/Node built-ins only. Exit code is non-zero on any FAIL.
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { basename, dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  type CheckerFinding,
  checkerReporterExitCode,
  emitCheckerReporter,
  judgmentFindingsFromRubric
} from './vendored/ki-skills/checker-reporter.ts'

// ── the structure model (keep in sync with ../SKILL.md + the references) ─────
const FOCI = ['Active', 'Background', 'Dormant', 'Future', 'Settled'] as const
const STATUS = ['draft', 'ready', 'rejected', 'in-progress', 'rolled-out', 'reviewed', 'completed']
const PRIORITY = ['urgent', 'high', 'medium', 'low']
const PROPOSAL_SUFFIX = ' Proposal'
const PROPOSAL_FM = ['status', 'priority', 'dependencies']

const KI_CONFIG = '.ki-config.toml'
const KI_SECTION = 'ki-kb-streams'
const KB_ZONES = 'ki-kb.zones'
const SCHEMES = ['type', 'tags']

// Reference-doc pointers for the cited-finding standard (ref column).
const REF_STRUCTURE = 'references/Streams Structure Reference.md'
const REF_ENACT = 'references/Enactment Process Reference.md'
const REF_SKILL = '../SKILL.md'

// The default block `--educate` emits. The bare [ki-kb-streams] header is the
// OPT-IN MARKER: its presence declares this base's Streams zone governed by the
// Enactment Process (ki-repo's coverage cascade warns a base that has a
// Streams/ zone but no table). The keys below are optional — a base on the defaults
// (process note "Enactment Process", the type: scheme) declares just the bare table.
const KI_DEFAULT = `# ${KI_SECTION} — opt-in marker: declaring this table opts the base's Streams zone into
# the Enactment Process. The keys below are optional; a base on the defaults declares
# just the bare table header.
[${KI_SECTION}]
# The base's canonical change-process note that streams link to (default "Enactment Process").
# process_note = "Admin/Operations/Processes/Repository Change Process"
# Note-type convention for zone/focus/proposal notes: "type" (canonical/default, machine-readable) or "tags" (legacy).
# note_type_scheme = "type"
`

const mk = () => {
  const f: CheckerFinding[] = []
  const push =
    (level: CheckerFinding['level']) =>
    (code: string, message: string, ref?: string, file?: string): void =>
      void f.push({ type: 'M', level, code, message, ref, file })
  return {
    f,
    fail: push('FAIL'),
    warn: push('WARN'),
    note: push('INFO'),
    na: push('NA'),
    advisory: push('ADVISORY'),
    polish: push('POLISH')
  }
}

const isDir = (p: string): boolean => existsSync(p) && statSync(p).isDirectory()
const isFile = (p: string): boolean => existsSync(p) && statSync(p).isFile()
const subdirs = (p: string): string[] =>
  isDir(p)
    ? readdirSync(p, { withFileTypes: true })
        .filter((e) => e.isDirectory())
        .map((e) => e.name)
    : []

// Minimal reader for the constrained schema: this skill's own `[ki-kb-streams]`
// scalars and the kb `[ki-kb.zones]` Streams alias. Validate down, ignore across.
type Ki = { keys: Record<string, string>; streamsZone: string }
const unquote = (s: string): string => s.replace(/^["']|["']$/g, '')
function parseKi(text: string): Ki {
  const out: Ki = { keys: {}, streamsZone: 'Streams' }
  let section = ''
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.replace(/#.*$/, '').trim()
    if (!line) continue
    const header = line.match(/^\[(.+)\]$/)
    if (header) {
      section = (header[1] as string).trim()
      continue
    }
    const eq = line.indexOf('=')
    if (eq === -1) continue
    const key = line.slice(0, eq).trim()
    const val = unquote(line.slice(eq + 1).trim())
    if (section === KI_SECTION) out.keys[key] = val
    else if (section === KB_ZONES && key === 'Streams') out.streamsZone = val
  }
  return out
}

// A note's top-level frontmatter as key→raw-value, plus whether the `---` fence closes.
// Returns null when the file has no leading `---` fence.
function frontmatter(text: string): { map: Record<string, string>; terminated: boolean } | null {
  const lines = text.split(/\r?\n/)
  if (lines[0]?.trim() !== '---') return null
  const map: Record<string, string> = {}
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i] as string
    if (line.trim() === '---') return { map, terminated: true }
    if (/^\s/.test(line)) continue // nested (list item / sub-map) — not a top-level key
    const ci = line.indexOf(':')
    if (ci > 0) map[line.slice(0, ci).trim()] = line.slice(ci + 1).trim()
  }
  return { map, terminated: false }
}

// Every `.md` under a directory, skipping dotdirs and node_modules.
function walkMarkdown(dir: string, acc: string[] = []): string[] {
  if (!isDir(dir)) return acc
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (e.name.startsWith('.') || e.name === 'node_modules') continue
    const p = join(dir, e.name)
    if (e.isDirectory()) walkMarkdown(p, acc)
    else if (e.name.endsWith('.md')) acc.push(p)
  }
  return acc
}

// Does a folder directly hold a `<X> Proposal.md` note? True for a conforming leaf
// (the suffixed same-name note) and a conforming parent (the proposal alongside a
// slim index + children).
const hasProposalNote = (dir: string): boolean => isDir(dir) && readdirSync(dir).some((n) => n.endsWith(`${PROPOSAL_SUFFIX}.md`))

// Stream folders under a Focus: a folder (below the Focus) holding a same-name index
// note and NO subfolders — i.e. a leaf or a notes-only parent (Island MCP-style).
// Folders WITH subfolders are categories or multi-proposal parents — recurse into them.
function leafStreamFolders(focusDir: string, acc: string[] = []): string[] {
  for (const name of subdirs(focusDir)) {
    const dir = join(focusDir, name)
    const kids = subdirs(dir)
    if (kids.length === 0) {
      if (isFile(join(dir, `${name}.md`))) acc.push(dir)
    } else leafStreamFolders(dir, acc)
  }
  return acc
}

const sampleList = (xs: string[], n = 10): string => xs.slice(0, n).join('; ') + (xs.length > n ? `; …+${xs.length - n} more` : '')

function auditStreams(base: string, ki: Ki): CheckerFinding[] {
  const { f, fail, warn, note } = mk()
  const streamsRoot = join(base, ki.streamsZone)
  if (ki.streamsZone !== 'Streams') note('STREAM-1', `Streams zone resolves to ${ki.streamsZone}/ (per [${KB_ZONES}])`, REF_STRUCTURE)

  if (!isDir(streamsRoot)) {
    note('STREAM-1', `no ${ki.streamsZone}/ zone at ${base} — nothing to audit (its presence is a ki-kb ZONE check)`, REF_STRUCTURE)
    return f
  }

  // ── config table: validate this skill's own table, DOWN ──
  for (const key of Object.keys(ki.keys)) {
    if (key !== 'process_note' && key !== 'note_type_scheme')
      warn('CONFIG-1', `unrecognised key "${key}" — recognised: process_note, note_type_scheme`, REF_SKILL, KI_CONFIG)
  }
  const scheme = ki.keys.note_type_scheme
  if (scheme !== undefined && !SCHEMES.includes(scheme))
    warn('CONFIG-2', `note_type_scheme "${scheme}" is not one of: ${SCHEMES.join(', ')}`, REF_SKILL, KI_CONFIG)

  // ── STREAM-1: folders directly under Streams/ are the Focus set ──
  const present = subdirs(streamsRoot)
  for (const name of present) {
    if (!(FOCI as readonly string[]).includes(name))
      warn(
        'STREAM-1',
        `not a Focus (one of: ${FOCI.join(', ')}) — a stream filed without a Focus, or a stray folder`,
        REF_STRUCTURE,
        `${ki.streamsZone}/${name}`
      )
  }
  const foci = FOCI.filter((x) => present.includes(x))
  note('STREAM-1', `Focus folders present: ${foci.join(', ') || '(none)'}`, REF_STRUCTURE)

  // ── STREAM-2 / STREAM-3: per Focus ──
  // A stream is either a FULL PROPOSAL (a governed change — carries the proposal
  // apparatus and the ` Proposal` suffix) or a LIGHTWEIGHT stream (a tracker note,
  // no apparatus). The two weights are part of the Enactment Process. Only a
  // proposal-in-intent that lacks the suffix is drift; a lightweight tracker needs
  // none — so we flag a folder only when its index DECLARES a proposal
  // (`type: stream-proposal` or a lifecycle `status`) yet has no `* Proposal.md`.
  const missingSuffix: string[] = []
  for (const focus of foci) {
    const focusDir = join(streamsRoot, focus)
    if (!isFile(join(focusDir, `${focus}.md`)))
      warn('STREAM-2', `has no same-name index note (${focus}/${focus}.md)`, REF_STRUCTURE, `${ki.streamsZone}/${focus}`)
    for (const leaf of leafStreamFolders(focusDir)) {
      if (hasProposalNote(leaf)) continue // conforming leaf or parent
      const idx = join(leaf, `${basename(leaf)}.md`)
      const fm = isFile(idx) ? frontmatter(readFileSync(idx, 'utf8')) : null
      const declaresProposal = !!fm && (fm.map.type === 'stream-proposal' || STATUS.includes(fm.map.status ?? ''))
      if (declaresProposal) missingSuffix.push(leaf.slice(base.length + 1))
    }
  }
  if (missingSuffix.length)
    warn(
      'STREAM-3',
      `proposal stream(s) missing the \` Proposal\` suffix (a lightweight tracker stream needs none) in ${missingSuffix.length}: ${sampleList(missingSuffix)}`,
      REF_ENACT
    )

  // ── ENACT-1 / ENACT-2: proposal-document frontmatter ──
  const proposals = walkMarkdown(streamsRoot).filter((p) => basename(p, '.md').endsWith(PROPOSAL_SUFFIX))
  const missingKeys: string[] = []
  const badStatus: string[] = []
  const badPriority: string[] = []
  const unterminated: string[] = []
  for (const file of proposals) {
    const fm = frontmatter(readFileSync(file, 'utf8'))
    const rel = file.slice(base.length + 1)
    if (!fm) {
      missingKeys.push(`${rel} (no frontmatter)`)
      continue
    }
    if (!fm.terminated) {
      unterminated.push(rel)
      continue
    }
    for (const k of PROPOSAL_FM) if (!(k in fm.map)) missingKeys.push(`${rel} (${k})`)
    if ('status' in fm.map && !STATUS.includes(fm.map.status as string)) badStatus.push(`${rel}: "${fm.map.status}"`)
    if ('priority' in fm.map && !PRIORITY.includes(fm.map.priority as string)) badPriority.push(`${rel}: "${fm.map.priority}"`)
  }
  if (unterminated.length)
    fail(
      'ENACT-1',
      `unterminated frontmatter (no closing \`---\`) in ${unterminated.length} proposal(s): ${sampleList(unterminated)}`,
      REF_ENACT
    )
  if (missingKeys.length)
    warn(
      'ENACT-1',
      `proposal(s) missing ${PROPOSAL_FM.join('/')} frontmatter in ${missingKeys.length}: ${sampleList(missingKeys)}`,
      REF_ENACT
    )
  if (badStatus.length)
    warn('ENACT-2', `status outside the lifecycle vocabulary (bare token) in ${badStatus.length}: ${sampleList(badStatus)}`, REF_ENACT)
  if (badPriority.length)
    warn('ENACT-2', `priority outside {${PRIORITY.join(', ')}} in ${badPriority.length}: ${sampleList(badPriority)}`, REF_ENACT)
  note('ENACT-1', `${proposals.length} proposal document(s) found (\`* Proposal.md\`)`, REF_ENACT)

  // ── GATE-1: the Enactment gate is anchored in always-loaded context ──
  // Skills load on demand, so the gate only fires on a plain edit if the base's
  // CLAUDE.md / AGENTS.md routes canonical changes through a proposal. Required
  // once the base actually runs proposals; a base with only lightweight streams
  // (no proposals) hasn't opted into the gated model, so the anchor isn't demanded.
  if (proposals.length === 0) {
    note(
      'GATE-1',
      'no proposals yet — the gate applies once the base runs the proposal model (lightweight streams alone need no anchor)',
      REF_SKILL
    )
  } else {
    const anchorFile = ['CLAUDE.md', 'AGENTS.md'].map((n) => join(base, n)).find(isFile)
    if (!anchorFile) {
      warn(
        'GATE-1',
        "no CLAUDE.md / AGENTS.md at the base root — the Enactment gate has no always-on anchor, so the skill won't fire on a plain edit",
        REF_SKILL
      )
    } else {
      const txt = readFileSync(anchorFile, 'utf8')
      const namesProcess = /Enactment Process|ki-kb-streams/i.test(txt)
      const namesGate = /proposal|canonical/i.test(txt)
      if (namesProcess && namesGate) note('GATE-1', 'Enactment gate anchored', REF_SKILL, basename(anchorFile))
      else
        warn(
          'GATE-1',
          'does not anchor the Enactment gate — add a standing directive (route canonical changes through a proposal; load ki-kb-streams) so the gate fires on a plain edit',
          REF_SKILL,
          basename(anchorFile)
        )
    }
  }

  return f
}

// ── run ──────────────────────────────────────────────────────────────────────
const argv = process.argv.slice(2)
if (argv.includes('--educate')) {
  process.stdout.write(KI_DEFAULT)
  process.exit(0)
}

const base = resolve(argv.find((a) => !a.startsWith('-')) ?? '.')
if (!isDir(base)) {
  const findings: CheckerFinding[] = [
    { type: 'M', level: 'FAIL', code: 'STREAM-1', message: `Not a directory: ${base}`, ref: REF_STRUCTURE },
    ...judgmentFindingsFromRubric(join(dirname(fileURLToPath(import.meta.url)), '..', 'references', 'rubric.md'))
  ]
  emitCheckerReporter({ mode: 'audit', concern: 'kb-streams', target: base, findings })
  process.exit(checkerReporterExitCode(findings))
}

const kiPath = join(base, KI_CONFIG)
const ki = isFile(kiPath) ? parseKi(readFileSync(kiPath, 'utf8')) : { keys: {}, streamsZone: 'Streams' }

const findings = auditStreams(base, ki)
findings.push(...judgmentFindingsFromRubric(join(dirname(fileURLToPath(import.meta.url)), '..', 'references', 'rubric.md')))
emitCheckerReporter({ mode: 'audit', concern: 'kb-streams', target: base, findings })
process.exit(checkerReporterExitCode(findings))
