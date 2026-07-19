#!/usr/bin/env bun
/**
 * Mechanical CONFORM for the ki-engineering standard — fixes the subset of
 * audit.ts's findings that are unambiguous and reversible, leaving
 * everything that needs a human call as a printed manual TODO.
 *
 * Scope: a single target repo (default cwd), matching the house conform shape
 * (conform.ts, conform.ts) — `bun conform.ts .` /
 * `ki:engineering:conform`. Known-good defaults (canonical script bodies,
 * tsconfig/biome/knip field sets, required devDeps) are copied from
 * audit.ts rather than imported, so each script stays valid
 * standalone per the composition-only rule.
 *
 *   bun scripts/conform.ts [path]   # default: cwd
 *   --dry-run                                    # report the planned actions, mutate nothing
 *
 * each action becomes a typed structured outcome — changed work is FIXED, an already-canonical
 * target is PASS, a tool failure is a violation, and manual follow-up is INFO. A single audit area
 * fans into several sections, and the toolchain write pass bundles biome + syncpack +
 * knip + deps — each emitted line cites ITS OWN criterion code (BIO-1 / SYNC-1 / KNIP-2 /
 * DEPS-1), regardless of the section where it originates. `--dry-run` governs
 * *writing* only.
 *
 * Fixes:
 *   - package.json: `type`, `packageManager`, `engines.node`, the exact
 *     the aggregate `ki:audit`/`ki:conform`/`ki:educate`/`ki:help` entrypoints + derived
 *     per-skill keys, `clean`, `prepare`, and running the write toolchain directly,
 *     missing toolchain devDependencies, and a missing/incomplete
 *     `lint-staged` block — all set/overwritten to the standard's exact value.
 *   - Scaffolds mise.toml / tsconfig.json / biome.json / knip.json when
 *     absent entirely, using the same known-good defaults audit.ts checks
 *     against. Never overwrites an existing file of these (field-level
 *     repair inside an existing file needs a human decision —
 *     not scripted here). `.prettierrc.json` is owned by ki-authoring
 *     (it backs that skill's own Markdown conform pass) — not this skill.
 *   - Appends a `[ki-engineering]` marker table to .ki-config.toml when the
 *     table is missing (mirrors conform.ts's own config-marker append).
 *
 * Deliberately NEVER touches (judgment → manual TODOs):
 *   - Ungoverned/extra package.json top-level keys (drift needs a human call
 *     on where the key actually belongs).
 *   - CI workflow (.github/workflows/ci.yml) content — authoring YAML by hand.
 *   - Monorepo-specific checks (per-workspace tsc, per-workspace vitest scoping) —
 *     repo-shape-specific, not a single mechanical fix.
 *   - Compiled-build / cli-chmod steps (build script body, tsconfig.build.json,
 *     files/dist, chmod targets) — depends on repo-specific src/ layout.
 *   - Anything env/secret-related (NODE_ENV leaks outside dev/inspect scripts,
 *     .env*.example authoring) — never auto-fixed; could mask a real leak.
 *   - Field-level repairs inside an EXISTING tsconfig/biome/knip file
 *     (only scaffolds when the file is missing entirely).
 *
 * Zero npm dependencies (bun + node stdlib only). Exit code is non-zero only on
 * an unrecoverable error (target dir not found / package.json unparseable);
 * findings/fixes never fail the run.
 */
import { execSync } from 'node:child_process'
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'

// ── kept in lockstep with audit.ts ──
const REQUIRED_DEV = ['@biomejs/biome', 'knip', 'prettier', 'husky', 'lint-staged', 'markdownlint-cli2', 'syncpack', 'typescript']
// The aggregate entrypoints every governed repo exposes — identical everywhere, so
// canonical and added when missing. The per-tool ki:lint:*/ki:deps:*/ki:knip families
// and ki:verify are retired (TOOLCHAIN-001): the write tools run directly below.
const CANON: Record<string, string> = {
  'ki:audit': 'bun .ki-meta/bin/aggregate.ts audit',
  'ki:conform': 'bun .ki-meta/bin/aggregate.ts conform',
  'ki:educate': 'bun .ki-meta/bin/aggregate.ts educate',
  'ki:help': 'bun .ki-meta/bin/aggregate.ts help'
}
// Retired keys removed on sight (folded into ki:engineering:audit/conform + ki-authoring).
const RETIRED_KEY = (k: string): boolean =>
  /^ki:(lint|deps):/.test(k) || k === 'ki:knip' || k === 'ki:verify' || /^ki:[a-z-]+:lint$/.test(k)
const LATEST_DEV_VERSIONS: Record<string, string> = {
  '@biomejs/biome': '^1.9.4',
  knip: '^5.44.0',
  prettier: '^3.4.2',
  husky: '^9.1.7',
  'lint-staged': '^15.3.0',
  'markdownlint-cli2': '^0.15.0',
  syncpack: '^13.0.0',
  typescript: '^5.7.2'
}
const LINT_STAGED_DEFAULT = {
  '*.{ts,tsx,js,jsx,json}': ['bunx @biomejs/biome check --write --no-errors-on-unmatched'],
  '*.md': ['bunx prettier --write', 'bunx markdownlint-cli2 --no-globs']
}

const MISE_DEFAULT = `[tools]
node = "22"
bun = "1.3.0"
`
const TSCONFIG_DEFAULT = `{
  "compilerOptions": {
    "target": "es2024",
    "module": "nodenext",
    "moduleResolution": "nodenext",
    "strict": true,
    "noEmit": true,
    "isolatedModules": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "verbatimModuleSyntax": true,
    "noUnusedLocals": true
  },
  "include": ["src/**/*.ts"]
}
`
const BIOME_DEFAULT = `{
  "$schema": "https://biomejs.dev/schemas/1.9.4/schema.json",
  "files": {
    "includes": ["**", "!**/.ki-meta"]
  },
  "formatter": {
    "enabled": true,
    "lineWidth": 140,
    "indentWidth": 2
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "single",
      "semicolons": "asNeeded",
      "trailingCommas": "none"
    }
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "suspicious": { "noExplicitAny": "off" }
    }
  },
  "organizeImports": { "enabled": true }
}
`
const KNIP_DEFAULT = `{
  "$schema": "https://unpkg.com/knip@5/schema.json",
  "entry": ["src/index.ts"],
  "project": ["src/**/*.ts"]
}
`
const KI_CONFIG = '.ki-config.toml'
const KI_MARKER = `[ki-engineering]\n`

export type EngineeringConformFinding = {
  status: 'FAIL' | 'WARN' | 'FIXED' | 'INFO' | 'NOT_APPLICABLE' | 'PASS'
  code: string
  message: string
  subject?: string
}

// ── entry ──
export const collectConformEvidence = (targetInput: string, dryRun = false): readonly EngineeringConformFinding[] => {
  const target = resolve(targetInput)
  const findings: EngineeringConformFinding[] = []
  const rec = (status: EngineeringConformFinding['status'], code: string, message: string, subject?: string): void =>
    void findings.push({ status, code, message, ...(subject ? { subject } : {}) })

  if (!existsSync(target)) {
    rec('FAIL', 'PKG-4', 'conform target does not exist', target)
    return findings
  }
  const pkgPath = join(target, 'package.json')
  if (!existsSync(pkgPath)) {
    rec('NOT_APPLICABLE', 'PKG-4', 'no package.json — not a TypeScript/Bun repo; the engineering standard does not apply')
    return findings
  }
  let pkg: Record<string, unknown>
  try {
    pkg = JSON.parse(readFileSync(pkgPath, 'utf8'))
  } catch (e) {
    rec('FAIL', 'PKG-4', `package.json is unparseable: ${String((e as Error).message ?? e)}`, 'package.json')
    return findings
  }

  let pkgChanged = false
  const manualTodos: Array<{ code: string; msg: string }> = []

  // ── package.json: core metadata fields ──
  {
    let any = false
    if (pkg.type !== 'module') {
      rec('FIXED', 'PKG-1', `type set to "module"`, 'package.json')
      pkg.type = 'module'
      pkgChanged = true
      any = true
    }
    if (!String(pkg.packageManager ?? '').startsWith('bun@')) {
      rec('FIXED', 'PKG-2', `packageManager set to "bun@1.3.0"`, 'package.json')
      pkg.packageManager = 'bun@1.3.0'
      pkgChanged = true
      any = true
    }
    const engines = (pkg.engines ?? {}) as Record<string, string>
    const nodeOk = /^\s*>=\s*(\d+)/.test(engines.node ?? '') && Number((engines.node ?? '').match(/>=\s*(\d+)/)?.[1]) >= 22
    if (!nodeOk) {
      rec('FIXED', 'PKG-3', `engines.node set to ">=22"`, 'package.json')
      pkg.engines = { ...engines, node: '>=22' }
      pkgChanged = true
      any = true
    }
    if (!any) {
      rec('PASS', 'PKG-1', 'package.json metadata already conforms (type, packageManager, engines.node)', 'package.json')
    }
  }

  // ── package.json: required toolchain devDependencies ──
  {
    const devDeps = (pkg.devDependencies ?? {}) as Record<string, string>
    const missing = REQUIRED_DEV.filter((d) => !(d in devDeps))
    if (!missing.length) {
      rec('PASS', 'PKG-5', 'toolchain devDependencies already present', 'package.json')
    } else {
      for (const d of missing) {
        devDeps[d] = LATEST_DEV_VERSIONS[d] as string
      }
      rec('FIXED', 'PKG-5', `added missing toolchain devDependencies: ${missing.join(', ')} (run \`bun install\`)`, 'package.json')
      pkg.devDependencies = devDeps
      pkgChanged = true
      manualTodos.push({ code: 'PKG-5', msg: 'run `bun install` to materialize newly added devDependencies' })
    }
  }

  // ── package.json: aggregate entrypoints + retired-key removal + derived per-skill keys ──
  {
    const scripts = (pkg.scripts ?? {}) as Record<string, string>
    let any = false
    for (const [k, v] of Object.entries(CANON)) {
      if (scripts[k] !== v) {
        rec('FIXED', 'SCR-2', scripts[k] ? `${k} reset to canonical entrypoint` : `${k} added (aggregate entrypoint)`, 'package.json')
        scripts[k] = v
        any = true
      }
    }
    // Strip retired keys (ki:lint:* / ki:deps:* / ki:knip / ki:verify / ki:<skill>:lint).
    for (const k of Object.keys(scripts).filter(RETIRED_KEY)) {
      rec('FIXED', 'SCR-3', `retired key ${k} removed (folded into ki:engineering:audit/conform + ki-authoring)`, 'package.json')
      delete scripts[k]
      any = true
    }
    // Derived per-skill keys for every vendored skill in .ki-meta (offline-safe).
    const metaCheckers = join(target, '.ki-meta', 'checkers')
    if (existsSync(metaCheckers)) {
      for (const skill of readdirSync(metaCheckers).filter((d) => statSync(join(metaCheckers, d)).isDirectory())) {
        const suffix = skill.replace(/^ki-/, '')
        for (const mode of ['audit', 'conform'] as const) {
          if (!existsSync(join(metaCheckers, skill, 'scripts', `${mode}.ts`))) continue
          const key = `ki:${suffix}:${mode}`
          const val = `bun .ki-meta/bin/aggregate.ts ${mode} --skill ${skill}`
          if (scripts[key] !== val) {
            rec(
              'FIXED',
              'SCR-4',
              scripts[key] ? `${key} repointed to the aggregate command for ${skill}` : `${key} added (aggregate command for ${skill})`,
              'package.json'
            )
            scripts[key] = val
            any = true
          }
        }
      }
    }
    if (!scripts.clean?.includes('node_modules')) {
      rec('FIXED', 'SCR-5', `clean set to "rm -rf dist node_modules"`, 'package.json')
      scripts.clean = 'rm -rf dist node_modules'
      any = true
    }
    if (scripts.prepare !== 'husky') {
      rec('FIXED', 'SCR-5', `prepare set to "husky"`, 'package.json')
      scripts.prepare = 'husky'
      any = true
    }
    if (any) {
      pkg.scripts = scripts
      pkgChanged = true
    } else {
      rec('PASS', 'SCR-2', 'aggregate entrypoints, per-skill keys, clean & prepare already conform', 'package.json')
    }
  }

  // ── package.json: lint-staged block ──
  {
    const lintStaged = pkg['lint-staged']
    const ls = lintStaged && typeof lintStaged === 'object' ? JSON.stringify(lintStaged) : ''
    const ok =
      ls.includes('@biomejs/biome') && ls.includes('prettier') && ls.includes('markdownlint') && ls.includes('markdownlint-cli2 --no-globs')
    if (ok) {
      rec('PASS', 'PKG-6', 'lint-staged block already fans out correctly', 'package.json')
    } else {
      rec('FIXED', 'PKG-6', lintStaged ? 'lint-staged reset to standard fan-out' : 'lint-staged added (standard fan-out)', 'package.json')
      pkg['lint-staged'] = LINT_STAGED_DEFAULT
      pkgChanged = true
    }
  }

  if (pkgChanged && !dryRun) {
    writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`)
  }

  // ── scaffold: mise.toml / tsconfig.json / biome.json / knip.json ──
  function scaffold(name: string, path: string, content: string, code: string): void {
    if (existsSync(path)) {
      rec('PASS', code, `${name} already present (field-level repair is judgment)`, name)
      return
    }
    rec('FIXED', code, `${name} scaffolded (known-good default)`, name)
    if (!dryRun) writeFileSync(path, content)
  }
  scaffold('mise.toml', join(target, 'mise.toml'), MISE_DEFAULT, 'MISE-1')
  scaffold('tsconfig.json', join(target, 'tsconfig.json'), TSCONFIG_DEFAULT, 'TSC-2')
  scaffold('biome.json', join(target, 'biome.json'), BIOME_DEFAULT, 'BIO-2')
  const hasKnip = existsSync(join(target, 'knip.json')) || existsSync(join(target, 'knip.jsonc')) || existsSync(join(target, 'knip.ts'))
  if (hasKnip) {
    rec('PASS', 'KNIP-1', 'knip config already present', 'knip.json')
  } else scaffold('knip.json', join(target, 'knip.json'), KNIP_DEFAULT, 'KNIP-1')

  // ── .ki-config.toml [ki-engineering] marker ──
  {
    const kiPath = join(target, KI_CONFIG)
    const kiText = existsSync(kiPath) ? readFileSync(kiPath, 'utf8') : ''
    if (/^\[ki-engineering\]/m.test(kiText)) {
      rec('PASS', 'TOML-1', '[ki-engineering] table already present', KI_CONFIG)
    } else {
      rec('FIXED', 'TOML-1', `${KI_CONFIG} [ki-engineering] marker table appended`, KI_CONFIG)
      if (!dryRun) {
        writeFileSync(kiPath, kiText ? `${kiText.replace(/\n*$/, '\n\n')}${KI_MARKER}` : KI_MARKER)
      }
    }
  }

  // ── run the write toolchain (conform = lint WITH fixing) ──
  // The tools live INSIDE this conform now (TOOLCHAIN-001): Biome check --write + format
  // --write, syncpack format, knip --fix, and a dependency refresh. Best-effort — a tool
  // exiting non-zero (e.g. residual manual lint) is reported, never fatal. Each step cites
  // its OWN criterion code, not a single section code (rubric: BIO-1 / SYNC-1 / KNIP-2 / DEPS-1).
  {
    const steps: Array<[string, string, string]> = [
      ['biome check --write', 'bunx @biomejs/biome check --write --unsafe', 'BIO-1'],
      ['biome format --write', 'bunx @biomejs/biome format --write', 'BIO-1'],
      ['syncpack format', 'bunx syncpack format', 'SYNC-1'],
      ['knip --fix', 'bunx knip --fix --no-config-hints', 'KNIP-2'],
      ['bun update --latest', 'bun update --latest', 'DEPS-1']
    ]
    for (const [label, cmd, code] of steps) {
      if (dryRun) {
        rec('INFO', code, `${label} would run (dry run — no writes)`)
        continue
      }
      try {
        execSync(cmd, { cwd: target, stdio: 'pipe' })
        rec('FIXED', code, `${label} ran`)
      } catch (err) {
        const detail = err instanceof Error && 'stderr' in err ? String((err as { stderr?: Buffer }).stderr ?? '').trim() : ''
        rec(
          'FAIL',
          code,
          `${label} exited non-zero — residual manual work; re-run ki:engineering:audit${detail ? ` (${detail.split('\n')[0]})` : ''}`
        )
      }
    }
    // 'bun update --latest' can exit non-zero partway through, leaving bun.lock with
    // unresolved "latest" placeholders — always follow with a plain install to reconcile.
    if (dryRun) {
      rec('INFO', 'DEPS-1', 'bun install (lockfile reconcile) would run (dry run — no writes)')
    } else {
      try {
        execSync('bun install', { cwd: target, stdio: 'pipe' })
        rec('FIXED', 'DEPS-1', 'bun install (lockfile reconcile) ran')
      } catch (err) {
        const detail = err instanceof Error && 'stderr' in err ? String((err as { stderr?: Buffer }).stderr ?? '').trim() : ''
        rec(
          'FAIL',
          'DEPS-1',
          `bun install (lockfile reconcile) exited non-zero — residual manual work; re-run ki:engineering:audit${detail ? ` (${detail.split('\n')[0]})` : ''}`
        )
      }
    }
  }

  // ── judgment items — never guessed, always surfaced ──
  const ALLOWED_KEYS = new Set<string>([
    'name',
    'version',
    'description',
    'author',
    'license',
    'private',
    'repository',
    'homepage',
    'bugs',
    'keywords',
    'type',
    'packageManager',
    'engines',
    'scripts',
    'devDependencies',
    'dependencies',
    'workspaces',
    'lint-staged',
    'main',
    'bin',
    'exports',
    'files'
  ])
  const unknownKeys = Object.keys(pkg).filter((k) => !ALLOWED_KEYS.has(k))
  if (unknownKeys.length)
    manualTodos.push({ code: 'PKG-4', msg: `ungoverned package.json key(s): ${unknownKeys.join(', ')} — assign an owning skill or remove` })
  manualTodos.push({
    code: 'CI-1',
    msg: 'CI workflow content — .github/workflows/ci.yml must be authored/edited by hand (mise-action install, no hardcoded version, "bun run ki:audit && bun run test" gate)'
  })
  manualTodos.push({
    code: 'TEST-4',
    msg: 'monorepo-specific checks (§0) — per-workspace tsc and per-workspace vitest scoping need a human call on repo shape'
  })
  manualTodos.push({
    code: 'BUILD-1',
    msg: "compiled-build / cli-chmod steps — build script body, tsconfig.build.json shape, files/dist, and the exact chmod target(s) depend on this repo's src/ layout"
  })
  manualTodos.push({
    code: 'ENV-2',
    msg: 'env / secret-related findings — NODE_ENV leaks outside dev/inspect scripts and .env*.example authoring are never auto-fixed (could mask a real leak)'
  })
  manualTodos.push({
    code: 'TSC-2',
    msg: 'field-level repairs inside an EXISTING tsconfig.json / biome.json / knip.json — only scaffolded when the file was missing entirely; existing-file drift is judgment'
  })
  for (const todo of manualTodos) {
    rec('INFO', todo.code, todo.msg)
  }
  return findings
}
