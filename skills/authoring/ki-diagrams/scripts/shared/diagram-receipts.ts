import { createHash } from 'node:crypto'
import { lstatSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const DIAGRAMS_DIRECTORY = 'docs/diagrams'
/** The suffix of a committed viewer's receipt, `<slug>.receipt.json`, beside its `<slug>.html`. */
export const RECEIPT_SUFFIX = '.receipt.json'
/** The receipt shape's version, raised only when a field changes meaning. */
export const RECEIPT_SCHEMA = 1
export const DIAGRAM_TYPES = ['architecture', 'workflow', 'sequence', 'dataflow', 'lifecycle'] as const

export type ReceiptEntry = { readonly slug: string; readonly type: string; readonly commitHtml: boolean }
/** One file a receipt vouches for: its name under docs/diagrams, its SHA-256 and its byte count. */
export type ReceiptFile = { readonly file: string; readonly sha256: string; readonly bytes: number }

/**
 * The portable proof that a committed viewer was rendered from its source: both files' hashes and the renderer's
 * identity, with file names only, so it carries no local path.
 */
export type DiagramReceipt = {
  readonly schema: number
  readonly slug: string
  readonly type: string
  readonly source: ReceiptFile
  readonly html: ReceiptFile
  readonly renderer: { readonly name: string; readonly version: string }
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)
const isFile = (path: string): boolean => {
  try {
    const stat = lstatSync(path)
    return stat.isFile() && !stat.isSymbolicLink()
  } catch {
    return false
  }
}

/** The receipt entry for one file's bytes. */
export const fingerprint = (file: string, bytes: Uint8Array): ReceiptFile => ({
  file,
  sha256: createHash('sha256').update(bytes).digest('hex'),
  bytes: bytes.byteLength
})

/** The receipt for a diagram's source and committed viewer bytes, as rendered by the named renderer. */
export const diagramReceipt = <Entry extends ReceiptEntry>(
  { slug, type }: Entry,
  source: Uint8Array,
  html: Uint8Array,
  renderer: DiagramReceipt['renderer']
): DiagramReceipt => ({
  schema: RECEIPT_SCHEMA,
  slug,
  type,
  source: fingerprint(`${slug}.${type}.json`, source),
  html: fingerprint(`${slug}.html`, html),
  renderer: { name: renderer.name, version: renderer.version }
})

const isReceiptFile = (value: unknown): value is ReceiptFile =>
  isRecord(value) &&
  typeof value.file === 'string' &&
  typeof value.sha256 === 'string' &&
  /^[0-9a-f]{64}$/.test(value.sha256) &&
  typeof value.bytes === 'number'

/**
 * Each committed viewer under `directory` whose receipt is missing, unreadable, names the wrong diagram or files, or
 * whose hashes no longer match the current source and HTML. A viewer or source that is itself missing is DIAG-1's
 * finding, not this one's; `last_checked` plays no part.
 */
export const receiptFindings = (
  directory: string,
  entries: readonly ReceiptEntry[],
  read: (file: string) => Uint8Array | undefined = (file) => {
    const path = join(directory, file)
    return isFile(path) ? readFileSync(path) : undefined
  }
): string[] =>
  entries.flatMap((entry) => {
    if (!entry.commitHtml) return []
    const { slug, type } = entry
    const source = read(`${slug}.${type}.json`)
    const html = read(`${slug}.html`)
    if (!source || !html) return []
    const name = `${DIAGRAMS_DIRECTORY}/${slug}${RECEIPT_SUFFIX}`
    const receiptBytes = read(`${slug}${RECEIPT_SUFFIX}`)
    if (!receiptBytes) return [`${slug}: no receipt at ${name}`]
    let receipt: unknown
    try {
      receipt = JSON.parse(new TextDecoder().decode(receiptBytes))
    } catch {
      return [`${slug}: ${name} is not valid JSON`]
    }
    if (
      !isRecord(receipt) ||
      receipt.schema !== RECEIPT_SCHEMA ||
      !isReceiptFile(receipt.source) ||
      !isReceiptFile(receipt.html) ||
      !isRecord(receipt.renderer) ||
      typeof receipt.renderer.name !== 'string' ||
      !receipt.renderer.name ||
      typeof receipt.renderer.version !== 'string' ||
      !receipt.renderer.version
    )
      return [`${slug}: ${name} does not hold a schema ${RECEIPT_SCHEMA} receipt`]
    const expected = diagramReceipt(entry, source, html, {
      name: receipt.renderer.name,
      version: receipt.renderer.version
    })
    if (receipt.slug !== slug || receipt.type !== type)
      return [`${slug}: ${name} names ${String(receipt.slug)} as ${String(receipt.type)}`]
    const findings: string[] = []
    for (const [part, label] of [
      ['source', 'the source'],
      ['html', 'the viewer']
    ] as const) {
      const held = receipt[part] as ReceiptFile
      const now = expected[part]
      if (held.file !== now.file) findings.push(`${slug}: ${name} names ${held.file} for ${label}, not ${now.file}`)
      else if (held.sha256 !== now.sha256 || held.bytes !== now.bytes)
        findings.push(`${slug}: ${label} ${now.file} changed since the viewer was rendered`)
    }
    return findings
  })
