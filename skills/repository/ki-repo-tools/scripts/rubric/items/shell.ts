import type { AuditOutcome, RubricFamily, RubricItem } from '../../shared/rubric.ts'
import type { ShellToolsContext, ToolsRubricContext } from '../contexts/tools.ts'

const STANDARD = 'standards-tool-repositories.md'
const SOURCE = [STANDARD] as const
const one = (outcome: AuditOutcome): readonly AuditOutcome[] => [outcome]

const unavailable = (context: ShellToolsContext): readonly AuditOutcome[] | null =>
  context.applicable
    ? null
    : one({
        status: 'NOT_APPLICABLE',
        message: 'ki-repo-tools is not applicable: its repository declaration is absent.'
      })

const SHELL_LINT: RubricItem<ShellToolsContext> = {
  code: 'SHELL-LINT',
  title: 'Shell lint CI',
  description: 'Shell entrypoints have a physical CI workflow that references shellcheck.',
  sources: SOURCE,
  mechanical: {
    level: 'WARN',
    remediation: {
      class: 'diagnostic',
      guidance: 'Add or correct the shellcheck CI evidence through the repository’s maintained workflow.'
    },
    audit: {
      phase: 'INSPECT',
      run: (context) => {
        const skipped = unavailable(context)
        if (skipped) return skipped
        if (!context.primary || !context.shell)
          return one({ status: 'NOT_APPLICABLE', message: 'Primary executable is not a shell entrypoint.' })
        if (context.workflows === 'unsafe' || context.unsafeWorkflowEntries.length > 0)
          return one({
            status: 'VIOLATION',
            message: 'CI workflow evidence is unsafe or unreadable.',
            subject: '.github/workflows/'
          })
        return /shellcheck/i.test(context.workflowText)
          ? one({ status: 'PASS', message: 'A CI workflow references shellcheck.', subject: `bin/${context.primary}` })
          : one({
              status: 'VIOLATION',
              message: 'Shell entrypoint has no CI shellcheck reference.',
              subject: `bin/${context.primary}`
            })
      }
    }
  }
}

const SHELL_TEST: RubricItem<ShellToolsContext> = {
  code: 'SHELL-TEST',
  title: 'Shell test CI',
  description: 'Shell entrypoints have a physical Bats suite referenced by CI.',
  sources: SOURCE,
  mechanical: {
    level: 'WARN',
    remediation: {
      class: 'diagnostic',
      guidance: 'Add or correct the Bats suite and CI evidence through the repository’s maintained test workflow.'
    },
    audit: {
      phase: 'INSPECT',
      run: (context) => {
        const skipped = unavailable(context)
        if (skipped) return skipped
        if (!context.primary || !context.shell)
          return one({ status: 'NOT_APPLICABLE', message: 'Primary executable is not a shell entrypoint.' })
        if (context.tests === 'unsafe' || context.unsafeTestEntries.length > 0)
          return one({ status: 'VIOLATION', message: 'Bats test evidence is unsafe or unreadable.', subject: 'tests/' })
        if (!context.bats)
          return one({
            status: 'VIOLATION',
            message: 'Shell entrypoint has no physical *.bats suite.',
            subject: 'tests/'
          })
        return /\bbats\b/i.test(context.workflowText)
          ? one({ status: 'PASS', message: 'A *.bats suite is referenced by CI.', subject: 'tests/' })
          : one({ status: 'VIOLATION', message: '*.bats suite is not referenced by CI.', subject: 'tests/' })
      }
    }
  }
}

/**
 * Line numbers of `[[` or `!` assertions that do not end `|| false`. Backslash continuations are joined, and a line
 * that already uses `&&` or `||` is control flow rather than an assertion.
 */
const nonFatalAssertions = (text: string): readonly number[] => {
  const found: number[] = []
  const lines = text.split(/\r?\n/)
  for (let index = 0; index < lines.length; index += 1) {
    const start = index + 1
    let line = lines[index] ?? ''
    while (line.endsWith('\\') && index + 1 < lines.length) {
      index += 1
      line = `${line.slice(0, -1)} ${lines[index] ?? ''}`
    }
    const command = line.trim()
    if (!/^(\[\[|!)\s/.test(command) || /\|\|\s*false$/.test(command) || /&&|\|\|/.test(command)) continue
    found.push(start)
  }
  return found
}

const SHELL_FATAL: RubricItem<ShellToolsContext> = {
  code: 'SHELL-FATAL',
  title: 'Fatal Bats assertions',
  description:
    'Every `[[ ]]` or `!` assertion in a shell entrypoint repository’s `tests/*.bats` suite ends `|| false`, because under macOS Bash 3.2 such an assertion failing in the middle of a test does not fail it.',
  sources: SOURCE,
  mechanical: {
    level: 'WARN',
    remediation: {
      class: 'diagnostic',
      guidance:
        'Append `|| false` to each reported assertion, then run the suite and correct any latent failure it exposes.'
    },
    audit: {
      phase: 'INSPECT',
      run: (context) => {
        const skipped = unavailable(context)
        if (skipped) return skipped
        if (!context.primary || !context.shell)
          return one({ status: 'NOT_APPLICABLE', message: 'Primary executable is not a shell entrypoint.' })
        if (context.tests === 'unsafe' || context.unsafeTestEntries.length > 0)
          return one({ status: 'VIOLATION', message: 'Bats test evidence is unsafe or unreadable.', subject: 'tests/' })
        if (context.batsSuites.length === 0)
          return one({ status: 'NOT_APPLICABLE', message: 'No physical *.bats suite; SHELL-TEST reports its absence.' })
        return context.batsSuites.map(({ name, text }): AuditOutcome => {
          const subject = `tests/${name}`
          if (text === null) return { status: 'VIOLATION', message: `${subject} is unreadable.`, subject }
          const lines = nonFatalAssertions(text)
          if (lines.length === 0)
            return { status: 'PASS', message: `Every [[ ]] or ! assertion in ${subject} ends || false.`, subject }
          const shown = lines.slice(0, 5).join(', ')
          return {
            status: 'VIOLATION',
            message: `${subject} has ${lines.length} [[ ]] or ! assertion${lines.length === 1 ? '' : 's'} without a trailing || false (line${lines.length === 1 ? '' : 's'} ${shown}${lines.length > 5 ? ', …' : ''}).`,
            subject
          }
        })
      }
    }
  }
}

const HOOK = '.githooks/pre-commit'

const nonComment = (text: string): readonly string[] =>
  text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line !== '' && !line.startsWith('#'))

/** A command runs check-only when it sits on a non-comment line that carries no rewriting flag. */
const runsCheckOnly = (lines: readonly string[], command: RegExp): boolean =>
  lines.some((line) => command.test(line) && !/(^|\s)--(fix|write)\b/.test(line))

/** A line that audits, conforms, repairs or rewrites: none belongs at commit time; the full audit runs in CI. */
const heavy = (line: string): boolean =>
  /\bki repo (?:audit|conform|repair)\b|(?:^|\s)--(?:fix|write)(?=\s|$)|\bquiet_audit\b/.test(line)

const SHELL_HOOK: RubricItem<ShellToolsContext> = {
  code: 'SHELL-HOOK',
  title: 'Shell commit gate',
  description:
    'Where a shell entrypoint repository commits `.githooks/pre-commit`, the hook runs `shellcheck` and `bash -n` over the staged shell files and `mandoc -T lint` over the staged manual pages, all check-only, and runs no `bats` suite, `ki repo audit`, conform, repair, `--fix` or `--write`, which belong to the manual gate and CI. `ki-repo` HOOK-1 owns whether the hook exists and HOOK-4 its canonical text.',
  sources: SOURCE,
  mechanical: {
    level: 'FAIL',
    remediation: {
      class: 'diagnostic',
      guidance:
        'Copy the canonical pre-commit from the matching `assets/githooks/` package variant, then rerun the audit.'
    },
    audit: {
      phase: 'INSPECT',
      run: (context) => {
        const skipped = unavailable(context)
        if (skipped) return skipped
        if (!context.primary || !context.shell)
          return one({ status: 'NOT_APPLICABLE', message: 'Primary executable is not a shell entrypoint.' })
        if (context.hook === 'missing')
          return one({ status: 'NOT_APPLICABLE', message: `No committed ${HOOK}; ki-repo HOOK-1 owns its existence.` })
        if (context.hook === 'unsafe')
          return one({ status: 'VIOLATION', message: `${HOOK} is not a safe regular file.`, subject: HOOK })
        const lines = nonComment(context.hookText)
        if (lines.some((line) => /\bbats\b/.test(line)))
          return one({
            status: 'VIOLATION',
            message: `${HOOK} runs bats; the test suite belongs to the manual gate and CI, not the commit gate.`,
            subject: HOOK
          })
        const offending = lines.find(heavy)
        if (offending !== undefined)
          return one({
            status: 'VIOLATION',
            message: `${HOOK} runs \`${offending}\`; the gate is check-only and runs no audit, conform, repair or fix.`,
            subject: HOOK
          })
        const missing = [
          ['shellcheck', runsCheckOnly(lines, /\bshellcheck\b/)],
          ['bash -n', runsCheckOnly(lines, /\bbash -n\b/)],
          ['mandoc -T lint', runsCheckOnly(lines, /\bmandoc -T lint\b/)]
        ]
          .filter(([, present]) => !present)
          .map(([name]) => name as string)
        return missing.length === 0
          ? one({
              status: 'PASS',
              message: `${HOOK} runs shellcheck, bash -n and mandoc check-only; the full audit runs in CI.`,
              subject: HOOK
            })
          : one({
              status: 'VIOLATION',
              message: `${HOOK} does not run ${missing.join(', ')} check-only.`,
              subject: HOOK
            })
      }
    }
  }
}

export const SHELL: RubricFamily<ToolsRubricContext, ShellToolsContext> = {
  code: 'SHELL',
  title: 'shell capabilities',
  description: 'Shell-specific CI and test requirements.',
  standard: STANDARD,
  selectContext: (context) => context.shell,
  items: [SHELL_LINT, SHELL_TEST, SHELL_FATAL, SHELL_HOOK]
}
