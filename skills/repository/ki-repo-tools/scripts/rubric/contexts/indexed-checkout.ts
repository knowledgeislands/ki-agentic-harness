import { execFileSync } from 'node:child_process'
import { mkdirSync, symlinkSync, writeFileSync } from 'node:fs'
import { dirname, isAbsolute, join, normalize, sep } from 'node:path'

/** Materialise raw index blobs, without working-tree attributes, checkout filters or Git metadata. */
export const checkoutIndex = (root: string, destination: string, env: NodeJS.ProcessEnv): void => {
  const options = {
    cwd: root,
    env,
    timeout: 60_000,
    killSignal: 'SIGKILL' as const,
    maxBuffer: 64 * 1024 * 1024
  }
  const listing = execFileSync('git', ['ls-files', '--stage', '-z'], options).toString('utf8')
  const entries = listing
    .split('\0')
    .filter(Boolean)
    .map((line) => {
      const match = /^(100644|100755|120000|160000) ([a-f0-9]+) 0\t([\s\S]+)$/.exec(line)
      if (!match) throw new Error('The index contains an unresolved or unsupported entry.')
      const [, mode = '', oid = '', path = ''] = match
      const normalized = normalize(path)
      if (isAbsolute(path) || normalized === '..' || normalized.startsWith(`..${sep}`))
        throw new Error('The index contains a path outside the repository.')
      return { mode, oid, path }
    })
    .filter((entry) => entry.mode !== '160000')
  const blobs = execFileSync('git', ['cat-file', '--batch'], {
    ...options,
    input: `${entries.map((entry) => entry.oid).join('\n')}\n`
  })
  let offset = 0
  const links: { path: string; target: Buffer }[] = []
  for (const entry of entries) {
    const newline = blobs.indexOf(10, offset)
    const header = blobs.subarray(offset, newline).toString('ascii')
    const [oid, type, sizeText] = header.split(' ')
    const size = Number(sizeText)
    if (newline < 0 || oid !== entry.oid || type !== 'blob' || !Number.isSafeInteger(size) || size < 0)
      throw new Error('The index blob stream is incomplete.')
    offset = newline + 1
    const content = blobs.subarray(offset, offset + size)
    if (content.length !== size || blobs[offset + size] !== 10) throw new Error('The index blob is incomplete.')
    offset += size + 1
    const path = join(destination, entry.path)
    mkdirSync(dirname(path), { recursive: true })
    if (entry.mode === '120000') links.push({ path, target: content })
    else writeFileSync(path, content, { mode: entry.mode === '100755' ? 0o755 : 0o644 })
  }
  // Create links last, so no file can be written through a symlink from the index.
  for (const { path, target } of links) symlinkSync(target, path)
}
