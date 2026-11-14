import { expect, test } from 'bun:test'
import { spawnSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { createEngineeringSession, type EngineeringRubricContext } from './engineering.ts'

test('a newly scaffolded Knip configuration reads both committed hooks immediately', async () => {
  const repository = mkdtempSync(join(tmpdir(), 'ki-knip-scaffold-'))
  try {
    mkdirSync(join(repository, '.githooks'))
    writeFileSync(join(repository, '.githooks/pre-commit'), '#!/bin/sh\nlint-staged --quiet\nsyncpack format --check\n')
    writeFileSync(join(repository, '.githooks/commit-msg'), '#!/bin/sh\ncommitlint --edit "$1"\n')
    writeFileSync(
      join(repository, 'package.json'),
      JSON.stringify({
        devDependencies: { '@commitlint/cli': '*', 'lint-staged': '*', syncpack: '*' }
      })
    )
    mkdirSync(join(repository, 'src'))
    writeFileSync(join(repository, 'src/index.ts'), 'console.log("fixture")\n')
    const dependencies = resolve(import.meta.dir, '../../../../../../node_modules')
    symlinkSync(dependencies, join(repository, 'node_modules'))
    const session = await createEngineeringSession(
      { mode: 'conform', repository, userHome: tmpdir(), configuration: {}, packageScriptClaims: [] },
      () => [{ level: 'FAIL', code: 'KNIP-1', message: 'knip.json missing' }]
    )
    const context = session.subjects[1]?.context() as EngineeringRubricContext
    context.knip.scaffold?.()
    const write = session.proposal().writes.find((candidate) => candidate.path === 'knip.json')
    expect(write).toBeDefined()
    writeFileSync(join(repository, 'knip.json'), write!.content)
    expect(JSON.parse(readFileSync(join(repository, 'knip.json'), 'utf8')).husky).toEqual({
      config: ['.githooks/pre-commit', '.githooks/commit-msg']
    })
    const result = spawnSync(join(dependencies, '.bin/knip'), ['--include', 'dependencies', '--no-config-hints'], {
      cwd: repository,
      encoding: 'utf8'
    })
    expect(result.status, result.stdout + result.stderr).toBe(0)
  } finally {
    rmSync(repository, { recursive: true, force: true })
  }
})
