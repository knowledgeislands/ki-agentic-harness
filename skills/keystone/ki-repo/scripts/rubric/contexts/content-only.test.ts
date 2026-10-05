import { afterEach, expect, test } from 'bun:test'
import { execFileSync } from 'node:child_process'
import { chmodSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const roots: string[] = []
afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true })
})

const fixture = (hosted: boolean) => {
  const root = mkdtempSync(join(tmpdir(), 'ki-content-only-'))
  roots.push(root)
  const repository = join(root, 'repository')
  const bin = join(root, 'bin')
  mkdirSync(repository)
  mkdirSync(bin)
  execFileSync('git', ['init', '--quiet', repository])
  if (hosted)
    execFileSync('git', ['-C', repository, 'remote', 'add', 'origin', 'https://github.com/fixture/hosted.git'])
  writeFileSync(
    join(repository, '.ki.toml'),
    '[skills.ki-repo]\nrepo_type = "project"\nprimary_shape = "ki-repo-project"\nvisibility = "public"\nlicense = "MIT"\ndescription = "Synthetic provider boundary"\n[skills.ki-repo.checks]\nbranch-protection = true\n'
  )
  mkdirSync(join(repository, '.github'))
  writeFileSync(join(repository, '.github', 'dependabot.yml'), 'version: 2\nupdates:\n  - package-ecosystem: npm\n')
  const requests = join(root, 'requests.jsonl')
  const executable = join(bin, 'gh')
  // A scoped protocol fixture: unknown commands/endpoints fail, rather than silently succeeding.
  writeFileSync(
    executable,
    `#!/usr/bin/env bun
import {appendFileSync} from 'node:fs';
const args=process.argv.slice(2);
appendFileSync(process.env.KI_FIXTURE_REQUESTS,JSON.stringify(args)+'\\n');
if(args.join(' ')==='auth status')process.exit(0);
if(args[0]==='repo'&&args[1]==='view'&&args[2]==='fixture/hosted'){
 console.log(JSON.stringify({nameWithOwner:'fixture/hosted',visibility:'PUBLIC',isArchived:false,defaultBranchRef:{name:'main'},mergeCommitAllowed:false,squashMergeAllowed:true,rebaseMergeAllowed:false,deleteBranchOnMerge:true,hasIssuesEnabled:false,hasProjectsEnabled:false,hasWikiEnabled:false,repositoryTopics:[],licenseInfo:{key:'mit'},description:'Synthetic provider boundary'}));process.exit(0);
}
if(args[0]==='api'){
 const responses={
  'repos/fixture/hosted/branches/main/protection':null,
  'repos/fixture/hosted/vulnerability-alerts':null,
  'repos/fixture/hosted/automated-security-fixes':{enabled:false},
  'repos/fixture/hosted':{allow_update_branch:false,security_and_analysis:{}},
  'repos/fixture/hosted/actions/permissions':{allowed_actions:'all'}
 };
 if(Object.hasOwn(responses,args[1])){console.log(JSON.stringify(responses[args[1]]));process.exit(args[1].endsWith('/vulnerability-alerts')?1:0);}
}
console.error('Unexpected fixture command',JSON.stringify(args));process.exit(97);
`
  )
  chmodSync(executable, 0o755)
  const runner = join(root, 'runner.ts')
  writeFileSync(
    runner,
    `import {collectAuditFindings} from ${JSON.stringify(join(import.meta.dir, 'audit.ts'))};\nconsole.log(JSON.stringify(await collectAuditFindings([${JSON.stringify(repository)}])));\n`
  )
  const report = JSON.parse(
    execFileSync(process.execPath, [runner], {
      encoding: 'utf8',
      env: { ...process.env, PATH: `${bin}:${process.env.PATH}`, KI_FIXTURE_REQUESTS: requests }
    })
  ) as { findings: { code: string; message: string }[] }
  const calls = (() => {
    try {
      return readFileSync(requests, 'utf8')
        .trim()
        .split('\n')
        .map((line) => JSON.parse(line) as string[])
    } catch {
      return []
    }
  })()
  return { report, calls }
}

test('public local collector never invokes gh and retains local Dependabot policy findings', () => {
  const { report, calls } = fixture(false)
  expect(calls).toEqual([])
  expect(report.findings).toContainEqual(
    expect.objectContaining({ code: 'DEP-1', message: expect.stringContaining('updates') })
  )
  expect(report.findings.some(({ message }) => message.includes('Dependabot alerts are off'))).toBe(false)
})

test('default hosted collector still invokes and reports provider checks', () => {
  const { report, calls } = fixture(true)
  const endpoints = calls.filter(([command]) => command === 'api').map(([, endpoint]) => endpoint)
  expect(endpoints).toHaveLength(6)
  expect(endpoints).toContain('repos/fixture/hosted/branches/main/protection')
  expect(endpoints).toContain('repos/fixture/hosted/vulnerability-alerts')
  expect(endpoints).toContain('repos/fixture/hosted/automated-security-fixes')
  expect(endpoints).toContain('repos/fixture/hosted/actions/permissions')
  expect(endpoints.filter((path) => path === 'repos/fixture/hosted')).toHaveLength(2)
  expect(report.findings).toContainEqual(
    expect.objectContaining({ code: 'DEP-1', message: 'Dependabot alerts are off' })
  )
  expect(report.findings).toContainEqual(
    expect.objectContaining({ code: 'DEP-1', message: 'Dependabot security updates are off' })
  )
  expect(report.findings).toContainEqual(
    expect.objectContaining({ code: 'BP-1', message: 'no branch protection on main' })
  )
})
