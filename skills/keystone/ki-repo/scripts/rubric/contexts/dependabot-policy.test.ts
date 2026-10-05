import { describe, expect, test } from 'bun:test'
import { dependabotPolicyFindings } from './audit.ts'

describe('Dependabot file policy', () => {
  test('fails a workflow named for Dependabot auto-merge', () => {
    expect(
      dependabotPolicyFindings(new Set(['README.md', '.github/workflows/dependabot-auto-merge.yml'])).map(
        ({ level, code, subject }) => ({ level, code, subject })
      )
    ).toEqual([{ level: 'FAIL', code: 'DEP-1', subject: '.github/workflows/dependabot-auto-merge.yml' }])
  })

  test('recognises spelling variants of the auto-merge workflow', () => {
    const findings = dependabotPolicyFindings(
      new Set(['.github/workflows/Dependabot-AutoMerge.yaml', '.github/workflows/dependabot_automerge.yml'])
    )
    expect(findings.map(({ level }) => level)).toEqual(['FAIL', 'FAIL'])
  })

  test('warns on Dependabot version-update configuration', () => {
    expect(
      dependabotPolicyFindings(new Set(['.github/dependabot.yml', '.github/dependabot.yaml'])).map(
        ({ level, subject }) => ({ level, subject })
      )
    ).toEqual([
      { level: 'WARN', subject: '.github/dependabot.yaml' },
      { level: 'WARN', subject: '.github/dependabot.yml' }
    ])
  })

  test('leaves an ordinary workflow tree clean', () => {
    expect(
      dependabotPolicyFindings(
        new Set(['.github/workflows/ci.yml', '.github/workflows/release.yml', 'docs/dependabot.yml'])
      )
    ).toEqual([])
  })
})
