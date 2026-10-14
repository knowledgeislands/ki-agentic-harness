import { expect, test } from 'bun:test'
import { findChrome, frame, launchArguments, NO_CHROME, parseFrames } from './chrome.ts'

/** A resolver that knows only the given executables, so discovery is tested without touching this machine. */
const only =
  (...present: string[]) =>
  (file: string): string | null =>
    present.includes(file) ? file : null

test('ARCHIFY_CHROME decides alone when set, even to a path that is not executable', () => {
  const resolveExecutable = only('/opt/chromium', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome')
  expect(findChrome({ env: { ARCHIFY_CHROME: '/opt/chromium' }, platform: 'darwin', resolveExecutable })).toBe(
    '/opt/chromium'
  )
  expect(findChrome({ env: { ARCHIFY_CHROME: '/missing' }, platform: 'darwin', resolveExecutable })).toBeNull()
})

test('discovery tries the fixed install paths, then the commands on PATH, in Archify order', () => {
  const chromium = '/Applications/Chromium.app/Contents/MacOS/Chromium'
  expect(findChrome({ env: {}, platform: 'darwin', resolveExecutable: only(chromium) })).toBe(chromium)
  expect(
    findChrome({ env: { PATH: '/usr/bin:/opt/bin' }, platform: 'linux', resolveExecutable: only('/opt/bin/chromium') })
  ).toBe('/opt/bin/chromium')
  expect(
    findChrome({
      env: { PATH: '/usr/bin' },
      platform: 'linux',
      resolveExecutable: only('/usr/bin/chromium-browser', '/usr/bin/google-chrome')
    })
  ).toBe('/usr/bin/google-chrome')
})

test('no browser anywhere is reported as null, which the exporter turns into Archify’s own message', () => {
  expect(findChrome({ env: { PATH: '/usr/bin' }, platform: 'linux', resolveExecutable: () => null })).toBeNull()
  expect(findChrome({ env: {}, platform: 'darwin', resolveExecutable: () => null })).toBeNull()
  expect(NO_CHROME).toBe('Chrome or Chromium is unavailable. Set ARCHIFY_CHROME to its executable path.')
})

test('the launch is headless over the debugging pipe with a throwaway profile, unsandboxed only on request or as root', () => {
  const args = launchArguments('/tmp/profile', { env: {}, uid: 501 })
  expect(args.slice(0, 2)).toEqual(['--headless=new', '--remote-debugging-pipe'])
  expect(args).toContain('--user-data-dir=/tmp/profile')
  expect(args.at(-1)).toBe('about:blank')
  expect(args).not.toContain('--no-sandbox')
  expect(launchArguments('/tmp/profile', { env: { ARCHIFY_CHROME_NO_SANDBOX: '1' }, uid: 501 })[0]).toBe('--no-sandbox')
  expect(launchArguments('/tmp/profile', { env: {}, uid: 0 })[0]).toBe('--no-sandbox')
})

test('pipe framing is one JSON message per NUL-terminated record, with partial input kept for the next chunk', () => {
  expect(frame({ id: 1, method: 'Page.enable', params: {} })).toBe('{"id":1,"method":"Page.enable","params":{}}\0')
  const answer = frame({ id: 1, result: {} })
  const event = frame({ method: 'Page.loadEventFired', params: { timestamp: 1 } })
  const { messages, rest, error } = parseFrames(`${answer}${event}{"id":2,"res`)
  expect(messages).toEqual([
    { id: 1, result: {} },
    { method: 'Page.loadEventFired', params: { timestamp: 1 } }
  ])
  expect(rest).toBe('{"id":2,"res')
  expect(error).toBeUndefined()
  expect(parseFrames(`${rest}ult":{}}\0`)).toEqual({ messages: [{ id: 2, result: {} }], rest: '' })
})

test('a record that is not JSON fails the stream rather than being dropped', () => {
  const { messages, error } = parseFrames('{"id":1,"result":{}}\0not json\0')
  expect(messages).toEqual([{ id: 1, result: {} }])
  expect(error).toMatch(/invalid JSON/)
})
