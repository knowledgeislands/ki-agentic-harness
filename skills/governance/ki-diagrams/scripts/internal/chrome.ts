/**
 * Purpose: Drive a system Google Chrome or Chromium headless over the DevTools Protocol, with no Playwright.
 * Boundary: Finds the browser executable, launches it with a throwaway profile on `about:blank`, speaks the protocol
 * over its remote-debugging pipe and closes it. It navigates nowhere itself; the caller chooses the one page.
 *
 * This is a port of the route Archify drives its own browser gate through, verified against Archify 3.0.1
 * (`bin/visual-check.mjs`: `findChrome`, `chromeVisualBrowserArgs`, `PipeCdp`, `ChromeVisualBrowser`). The discovery
 * order, the `ARCHIFY_CHROME` and `ARCHIFY_CHROME_NO_SANDBOX` overrides and the launch flags are copied as they are, so
 * the exporter and Archify's gate drive the same browser the same way. The module is the harness's own so that
 * `ki-diagrams` depends on no Archify internals and stays installable where the Archify skill is not.
 *
 * Only the pieces the exporter needs are here: find, launch, attach to the first page, `send`, wait for an event,
 * evaluate an expression, close. Framing is the pipe's: one JSON message per NUL-terminated record on file
 * descriptors 3 (to Chrome) and 4 (from Chrome).
 */

import { type ChildProcess, spawn } from 'node:child_process'
import { accessSync, constants, mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { delimiter, join, resolve, win32 } from 'node:path'
import type { Readable, Writable } from 'node:stream'

/** Archify's message when nothing is found; the exporter repeats it so both tools ask for the same remedy. */
export const NO_CHROME = 'Chrome or Chromium is unavailable. Set ARCHIFY_CHROME to its executable path.'

/** How long the launched browser may take before its first protocol answer, copied from Archify. */
export const STARTUP_TIMEOUT = 90_000

/** How long any later protocol call or awaited event may take. */
export const PROTOCOL_TIMEOUT = 30_000

type Platform = 'darwin' | 'win32' | 'linux'

/** The absolute path of `file` when it exists and is executable (exists, on Windows), otherwise `null`. */
const executable = (file: string, platform: Platform): string | null => {
  try {
    accessSync(file, platform === 'win32' ? constants.F_OK : constants.X_OK)
    return resolve(file)
  } catch {
    return null
  }
}

const findOnPath = (
  command: string,
  env: NodeJS.ProcessEnv,
  platform: Platform,
  resolveExecutable: typeof executable
): string | null => {
  const pathApi = platform === 'win32' ? win32 : { join, delimiter }
  const directories = String(env.PATH ?? '')
    .split(pathApi.delimiter)
    .filter(Boolean)
  const extensions =
    platform === 'win32'
      ? String(env.PATHEXT ?? '.EXE;.CMD;.BAT;.COM')
          .split(';')
          .filter(Boolean)
      : ['']
  for (const directory of directories)
    for (const extension of extensions) {
      const found = resolveExecutable(pathApi.join(directory, `${command}${extension}`), platform)
      if (found) return found
    }
  return null
}

/**
 * The Chrome or Chromium executable to launch, or `null` when none is found. `ARCHIFY_CHROME` wins when set, even to
 * an unusable path; otherwise the platform's fixed install locations are tried before the commands on `PATH`.
 */
export const findChrome = ({
  env = process.env,
  platform = process.platform as Platform,
  resolveExecutable = executable
}: {
  env?: NodeJS.ProcessEnv
  platform?: Platform
  resolveExecutable?: typeof executable
} = {}): string | null => {
  if (Object.hasOwn(env, 'ARCHIFY_CHROME')) return resolveExecutable(env.ARCHIFY_CHROME ?? '', platform)

  const fixed: string[] = []
  const commands: string[] = []
  if (platform === 'darwin') {
    fixed.push(
      '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      '/Applications/Chromium.app/Contents/MacOS/Chromium'
    )
  } else if (platform === 'win32') {
    for (const root of [env.PROGRAMFILES, env['PROGRAMFILES(X86)'], env.LOCALAPPDATA].filter(Boolean) as string[])
      fixed.push(
        win32.join(root, 'Google', 'Chrome', 'Application', 'chrome.exe'),
        win32.join(root, 'Chromium', 'Application', 'chrome.exe')
      )
    commands.push('chrome', 'google-chrome', 'google-chrome-stable', 'chromium', 'chromium-browser')
  } else {
    commands.push('google-chrome', 'google-chrome-stable', 'chromium', 'chromium-browser')
  }

  for (const candidate of fixed) {
    const found = resolveExecutable(candidate, platform)
    if (found) return found
  }
  for (const command of commands) {
    const found = findOnPath(command, env, platform, resolveExecutable)
    if (found) return found
  }
  return null
}

/** The launch arguments Archify uses, with `--no-sandbox` only for root or an explicit `ARCHIFY_CHROME_NO_SANDBOX=1`. */
export const launchArguments = (
  profileRoot: string,
  { env = process.env, uid = process.getuid?.() }: { env?: NodeJS.ProcessEnv; uid?: number } = {}
): string[] => {
  const args = [
    '--headless=new',
    '--remote-debugging-pipe',
    '--disable-gpu',
    '--hide-scrollbars',
    '--disable-background-networking',
    '--disable-component-update',
    '--disable-default-apps',
    '--disable-sync',
    '--metrics-recording-only',
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-background-timer-throttling',
    '--disable-backgrounding-occluded-windows',
    '--disable-renderer-backgrounding',
    '--force-device-scale-factor=1',
    `--user-data-dir=${profileRoot}`,
    'about:blank'
  ]
  if (uid === 0 || env.ARCHIFY_CHROME_NO_SANDBOX === '1') args.unshift('--no-sandbox')
  return args
}

/** One protocol message from Chrome: an answer carries `id`, an event carries `method`. */
export interface ProtocolMessage {
  readonly id?: number
  readonly sessionId?: string
  readonly method?: string
  readonly params?: Record<string, unknown>
  readonly result?: Record<string, unknown>
  readonly error?: { readonly message: string }
}

/** Encode one outgoing message as the pipe carries it. */
export const frame = (message: Record<string, unknown>): string => `${JSON.stringify(message)}\0`

/**
 * Split buffered pipe text into complete messages and the unread remainder. A record that is not JSON is reported as
 * an error rather than dropped, because a corrupt stream must fail the export, not stall it.
 */
export const parseFrames = (
  buffer: string
): { readonly messages: ProtocolMessage[]; readonly rest: string; readonly error?: string } => {
  const messages: ProtocolMessage[] = []
  let rest = buffer
  let boundary = rest.indexOf('\0')
  while (boundary >= 0) {
    const raw = rest.slice(0, boundary)
    rest = rest.slice(boundary + 1)
    if (raw) {
      try {
        messages.push(JSON.parse(raw) as ProtocolMessage)
      } catch (cause) {
        return { messages, rest, error: `Chrome DevTools returned invalid JSON: ${(cause as Error).message}` }
      }
    }
    boundary = rest.indexOf('\0')
  }
  return { messages, rest }
}

interface Pending {
  readonly method: string
  readonly resolve: (result: Record<string, unknown>) => void
  readonly reject: (error: Error) => void
  readonly timer: ReturnType<typeof setTimeout>
}

interface Listener {
  readonly method: string
  readonly sessionId: string | undefined
  readonly handler: (params: Record<string, unknown>) => void
}

/** The DevTools Protocol over Chrome's remote-debugging pipe: requests by id, events to whoever listens. */
export class PipeProtocol {
  private nextId = 1
  private buffer = ''
  private readonly pending = new Map<number, Pending>()
  private listeners: Listener[] = []
  private readonly failures: Array<() => void> = []
  private readonly writePipe: Writable
  private readonly readPipe: Readable
  private failed: Error | undefined

  constructor(
    child: ChildProcess,
    private readonly failureDetails: () => string = () => ''
  ) {
    this.writePipe = child.stdio[3] as Writable
    this.readPipe = child.stdio[4] as Readable
    this.readPipe.setEncoding('utf8')
    this.readPipe.on('data', (chunk: string) => this.consume(chunk))
    this.writePipe.on('error', (error) => this.failAll(this.failure('write pipe', error)))
    this.readPipe.on('error', (error) => this.failAll(this.failure('read pipe', error)))
    this.readPipe.once('end', () => this.failAll(this.failure('read pipe', new Error('stream ended'))))
    child.once('error', (error) => this.failAll(this.failure('process launch', error)))
    child.once('close', (code, signal) =>
      this.failAll(
        this.failure(
          'process exit',
          new Error(`Chrome closed with ${signal ? `signal ${signal}` : `exit code ${code}`}`)
        )
      )
    )
  }

  private failure(stage: string, error: unknown): Error {
    const message = error instanceof Error ? error.message : String(error)
    return new Error([`Chrome DevTools ${stage} failed: ${message}`, this.failureDetails()].filter(Boolean).join('\n'))
  }

  private consume(chunk: string): void {
    const { messages, rest, error } = parseFrames(this.buffer + chunk)
    this.buffer = rest
    for (const message of messages) {
      if (message.id !== undefined) {
        const pending = this.pending.get(message.id)
        if (!pending) continue
        clearTimeout(pending.timer)
        this.pending.delete(message.id)
        if (message.error) pending.reject(new Error(`${pending.method}: ${message.error.message}`))
        else pending.resolve(message.result ?? {})
        continue
      }
      for (const listener of [...this.listeners]) {
        if (listener.method !== message.method) continue
        if (listener.sessionId && listener.sessionId !== message.sessionId) continue
        listener.handler(message.params ?? {})
      }
    }
    if (error) this.failAll(new Error(error))
  }

  /** Send one request and await its answer; `sessionId` targets an attached page, none targets the browser. */
  send(
    method: string,
    params: Record<string, unknown> = {},
    sessionId?: string,
    timeout = PROTOCOL_TIMEOUT
  ): Promise<Record<string, unknown>> {
    if (this.failed) return Promise.reject(this.failed)
    const id = this.nextId++
    const message: Record<string, unknown> = { id, method, params }
    if (sessionId) message.sessionId = sessionId
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pending.delete(id)
        reject(this.failure('protocol timeout', new Error(`${method}: timed out after ${timeout}ms`)))
      }, timeout)
      this.pending.set(id, { method, resolve, reject, timer })
      this.writePipe.write(frame(message), (error) => {
        if (error) this.failAll(this.failure('write pipe', error))
      })
    })
  }

  /** Call `handler` for every `method` event until the returned function is called. */
  on(method: string, handler: (params: Record<string, unknown>) => void, sessionId?: string): () => void {
    const listener: Listener = { method, sessionId, handler }
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter((entry) => entry !== listener)
    }
  }

  /** The params of the first `method` event for which `accept` is true, or a timeout failure. */
  waitFor(
    method: string,
    sessionId?: string,
    accept: (params: Record<string, unknown>) => boolean = () => true,
    timeout = PROTOCOL_TIMEOUT
  ): Promise<Record<string, unknown>> {
    if (this.failed) return Promise.reject(this.failed)
    return new Promise((resolve, reject) => {
      const stop = this.on(
        method,
        (params) => {
          if (!accept(params)) return
          clearTimeout(timer)
          stop()
          resolve(params)
        },
        sessionId
      )
      const timer = setTimeout(() => {
        stop()
        reject(this.failure('event timeout', new Error(`${method}: event timed out after ${timeout}ms`)))
      }, timeout)
      this.failures.push(() => {
        clearTimeout(timer)
        stop()
        reject(this.failed as Error)
      })
    })
  }

  /** Fail every outstanding request and awaited event; later calls fail at once with the same error. */
  failAll(error: Error): void {
    this.failed ??= error
    for (const pending of this.pending.values()) {
      clearTimeout(pending.timer)
      pending.reject(error)
    }
    this.pending.clear()
    for (const fail of this.failures.splice(0)) fail()
  }
}

/** A launched headless browser attached to its one page, ready for `Page.*` and `Runtime.*` calls. */
export class Chrome {
  private readonly profileRoot: string
  private readonly child: ChildProcess
  private stderr = ''
  private closing: Promise<void> | undefined
  readonly protocol: PipeProtocol
  /** The attached page session; `send` and `waitFor` with it reach the page, without it the browser. */
  readonly session: Promise<string>

  constructor(chromePath: string, env: NodeJS.ProcessEnv = process.env) {
    this.profileRoot = mkdtempSync(join(tmpdir(), 'ki-diagrams-export-profile-'))
    this.child = spawn(chromePath, launchArguments(this.profileRoot, { env }), {
      stdio: ['ignore', 'ignore', 'pipe', 'pipe', 'pipe']
    })
    this.child.stderr?.setEncoding('utf8')
    this.child.stderr?.on('data', (chunk: string) => {
      this.stderr = `${this.stderr}${chunk}`.slice(-8000)
    })
    this.protocol = new PipeProtocol(this.child, () => {
      const exit = this.child.signalCode
        ? `signal ${this.child.signalCode}`
        : this.child.exitCode === null
          ? 'still running'
          : `exit code ${this.child.exitCode}`
      const stderr = this.stderr.trim()
      return [`Chrome process: ${exit}.`, stderr ? `Chrome stderr:\n${stderr}` : ''].filter(Boolean).join('\n')
    })
    this.session = this.attach()
    this.session.catch(() => {})
  }

  private async attach(): Promise<string> {
    const targets = await this.protocol.send('Target.getTargets', {}, undefined, STARTUP_TIMEOUT)
    const infos = (targets.targetInfos as Array<{ type: string; targetId: string }> | undefined) ?? []
    let targetId = infos.find((info) => info.type === 'page')?.targetId
    if (!targetId)
      targetId = (await this.protocol.send('Target.createTarget', { url: 'about:blank' })).targetId as string
    const attached = await this.protocol.send('Target.attachToTarget', { targetId, flatten: true })
    const sessionId = attached.sessionId as string
    await this.protocol.send('Page.enable', {}, sessionId)
    await this.protocol.send('Runtime.enable', {}, sessionId)
    return sessionId
  }

  /** Evaluate `expression` in the page and return its value, awaiting a promise when it returns one. */
  async evaluate<Result>(expression: string, timeout = PROTOCOL_TIMEOUT): Promise<Result> {
    const response = await this.protocol.send(
      'Runtime.evaluate',
      { expression, awaitPromise: true, returnByValue: true },
      await this.session,
      timeout
    )
    const details = response.exceptionDetails as { exception?: { description?: string }; text?: string } | undefined
    if (details) throw new Error(details.exception?.description ?? details.text ?? 'Runtime.evaluate failed')
    return (response.result as { value: Result }).value
  }

  /** Stop the browser and remove its profile; safe to call more than once. */
  close(): Promise<void> {
    this.closing ??= this.finishClose()
    return this.closing
  }

  private async finishClose(): Promise<void> {
    this.protocol.failAll(new Error('export finished'))
    try {
      if (this.child.exitCode === null && this.child.signalCode === null)
        await new Promise<void>((done) => {
          let settled = false
          const finish = (): void => {
            if (settled) return
            settled = true
            clearTimeout(timer)
            this.child.removeListener('exit', finish)
            done()
          }
          this.child.once('exit', finish)
          this.child.kill('SIGTERM')
          const timer = setTimeout(() => {
            if (this.child.exitCode === null && this.child.signalCode === null) this.child.kill('SIGKILL')
            finish()
          }, 1500)
        })
    } finally {
      for (const stream of [this.child.stderr, this.child.stdio[3], this.child.stdio[4]])
        if (stream && !stream.destroyed) stream.destroy()
    }
    rmSync(this.profileRoot, { recursive: true, force: true })
  }
}
