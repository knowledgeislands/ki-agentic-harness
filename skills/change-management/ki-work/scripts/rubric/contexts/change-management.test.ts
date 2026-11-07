import { afterEach, expect, test } from 'bun:test'
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createChangeManagementSession } from './change-management.ts'

const temporaryDirectories: string[] = []

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) rmSync(directory, { recursive: true, force: true })
})

const audit = (config: string) => {
  const repository = mkdtempSync(join(tmpdir(), 'ki-work-'))
  temporaryDirectories.push(repository)
  writeFileSync(join(repository, '.ki.toml'), config)
  return createChangeManagementSession({
    mode: 'audit',
    repository,
    userHome: '/tmp',
    configuration: {}
  }).subjects[0]?.context().selection.outcomes
}

test('requires the selected adapter to be declared and applicable', () => {
  expect(audit('[skills.ki-work]\nadapter = "roadmap"\n')).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ status: 'VIOLATION', message: expect.stringContaining('ki-work-roadmap') })
    ])
  )
  expect(audit('[skills.ki-work]\nadapter = "roadmap"\n')).not.toEqual(
    expect.arrayContaining([expect.objectContaining({ status: 'PASS' })])
  )
  expect(
    audit('[skills.ki-repo]\nrepo_type = "kb"\n\n[skills.ki-work]\nadapter = "roadmap"\n\n[skills.ki-work-roadmap]\n')
  ).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ status: 'VIOLATION', message: expect.stringContaining('not kb') })
    ])
  )
})

test('resolves valid local and remote adapters from declared tables', () => {
  expect(
    audit(
      '[skills.ki-repo]\nrepo_type = "project"\nprimary_shape = "ki-repo-project"\n[skills.ki-repo-project]\n[skills.ki-work]\nadapter = "roadmap"\n\n[skills.ki-work-roadmap]\n'
    )
  ).toEqual([expect.objectContaining({ status: 'PASS', message: expect.stringContaining('ki-work-roadmap') })])
  expect(
    audit(
      '[skills.ki-repo]\nrepo_type = "kb"\n\n[skills.ki-work]\nadapter = "kb-streams"\n\n[skills.ki-repo-kb-streams]\n'
    )
  ).toEqual([expect.objectContaining({ status: 'PASS', message: expect.stringContaining('ki-repo-kb-streams') })])
  expect(
    audit(
      '[skills.ki-repo]\nrepo_type = "project"\nprimary_shape = "ki-repo-project"\n[skills.ki-repo-project]\n[skills.ki-work]\nadapter = "linear"\n\n[skills.ki-work-linear]\n'
    )
  ).toEqual([expect.objectContaining({ status: 'PASS', message: expect.stringContaining('ki-work-linear') })])
})

test('does not resolve adapters against an unsupported explicit repository kind', () => {
  for (const kind of ['repository', '', 'mcp'])
    for (const [adapter, skill] of [
      ['roadmap', 'ki-work-roadmap'],
      ['linear', 'ki-work-linear']
    ])
      expect(
        audit(`[skills.ki-repo]\nrepo_type = "${kind}"\n[skills.ki-work]\nadapter = "${adapter}"\n[skills.${skill}]`)
      ).toContainEqual(
        expect.objectContaining({ status: 'VIOLATION', message: expect.stringContaining('Invalid repository kind') })
      )
})
