#!/usr/bin/env bun
/** Read-only, explicitly scoped Knowledge Islands lifecycle diagnosis. */
import { homedir } from 'node:os'
import { inspectRepository } from './internal/doctor/repo.ts'
import { terminalReport } from './internal/doctor/report.ts'
import { inspectUser, type UserDoctorRuntime } from './internal/doctor/user.ts'

type Output = (value: string) => void

function usage(): string {
  return [
    'Usage: doctor.ts repo [target] [--format <terminal|json>]',
    '       doctor.ts user [--home <dir>] [--runtime <claude-code|codex>]... [--format <terminal|json>]',
    '',
    'Inspect exactly one lifecycle scope without writing. Missing or unknown scope is an error.'
  ].join('\n')
}

export function runDoctor(argv = process.argv.slice(2), output: Output = (value) => process.stdout.write(value)): number {
  if (argv.includes('-h') || argv.includes('--help')) {
    output(`${usage()}\n`)
    return 0
  }
  const scope = argv.shift()
  if (scope !== 'repo' && scope !== 'user') throw new Error('DOCTOR requires exactly one explicit scope: repo or user')
  let format: 'terminal' | 'json' = 'terminal'
  let home = homedir()
  let homeSelected = false
  const runtimes: UserDoctorRuntime[] = []
  const values: string[] = []
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index]
    if (argument === '--format' || argument === '--home' || argument === '--runtime') {
      const value = argv[++index]
      if (!value) throw new Error(`${argument} requires a value`)
      if (argument === '--format') {
        if (value !== 'terminal' && value !== 'json') throw new Error(`unknown format: ${value}`)
        format = value
      } else if (argument === '--home') {
        home = value
        homeSelected = true
      } else if (value === 'claude-code' || value === 'codex') runtimes.push(value)
      else throw new Error(`unknown runtime: ${value}`)
    } else if (argument.startsWith('-')) throw new Error(`unknown argument: ${argument}`)
    else values.push(argument)
  }
  if (scope === 'repo' && (values.length > 1 || homeSelected || runtimes.length))
    throw new Error('repo DOCTOR accepts only one optional target and --format')
  if (scope === 'user' && values.length) throw new Error('user DOCTOR does not accept a repository target')
  const value = scope === 'repo' ? inspectRepository(values[0] ?? '.') : inspectUser(home, runtimes)
  output(format === 'json' ? `${JSON.stringify(value, null, 2)}\n` : terminalReport(value))
  return value.exit
}

if (import.meta.main) {
  try {
    process.exit(runDoctor())
  } catch (error) {
    console.error(`FAIL  DOCTOR: ${(error as Error).message}`)
    console.error(usage())
    process.exit(2)
  }
}
