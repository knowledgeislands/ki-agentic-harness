/**
 * The single definition of the identifier grammar shared by roadmap records, housekeeping runs, batch envelopes,
 * Decision Records and Specification requirements (ADR-KI-HARNESS-SKILLS-015). A scope segment is uppercase
 * alphanumeric, may lead with a digit, and contains at least one letter, so `5GE` is legal and an all-digit segment is
 * not. A repository code may lead with a digit and carries its hyphens inside a 24-character limit. Consumers import
 * their materialised local copy and compose these sources rather than restating them.
 */
export const SCOPE_SEGMENT = '[A-Z0-9]*[A-Z][A-Z0-9]*'

/** One or more hyphen-joined scope segments, as a Decision Record or requirement scope. */
export const SCOPE = `${SCOPE_SEGMENT}(?:-${SCOPE_SEGMENT})*`

/** A repository code, including any issuing area appended to it, as `repo_code` and work identifiers use it. */
export const REPOSITORY_CODE = '[A-Z0-9][A-Z0-9-]{1,23}'

/** A serial of at least three digits. */
export const SERIAL = '\\d{3,}'

/** A fixed roadmap issuing-area code, anchored. */
export const AREA_CODE = new RegExp(`^${SCOPE_SEGMENT}$`)

/** True when the value is a legal fixed roadmap issuing-area code. */
export const isAreaCode = (value: unknown): value is string => typeof value === 'string' && AREA_CODE.test(value)

/** A `repo_code` value, anchored. */
export const REPOSITORY_CODE_PATTERN = new RegExp(`^${REPOSITORY_CODE}$`)

/** True when the value is a legal `repo_code`. */
export const isRepositoryCode = (value: unknown): value is string =>
  typeof value === 'string' && REPOSITORY_CODE_PATTERN.test(value)

/**
 * The unanchored source of a work identifier: a repository code, an optional fixed infix such as `HK`, `BATCH` or
 * `RUN`, and a serial.
 */
export const workIdentifierSource = (infix?: string): string =>
  `${REPOSITORY_CODE}${infix === undefined ? '' : `-${infix}`}-${SERIAL}`

/** An anchored work identifier, optionally carrying a fixed infix. */
export const workIdentifier = (infix?: string): RegExp => new RegExp(`^${workIdentifierSource(infix)}$`)

/** The unanchored source of a prefixed scoped identifier, such as a Decision Record, with a supplied prefix set. */
export const prefixedIdentifierSource = (prefixes: readonly string[], serial: string = SERIAL): string =>
  `(?:${prefixes.join('|')})-${SCOPE}-${serial}`
