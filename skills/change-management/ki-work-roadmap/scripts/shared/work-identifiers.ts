/**
 * The single definition of the identifier segment grammar shared by roadmap issuing areas and Decision Record scopes
 * (ADR-KI-HARNESS-SKILLS-015). A segment is uppercase alphanumeric, may lead with a digit, and contains at least one
 * letter, so `5GE` is legal and an all-digit segment is not. Consumers import their materialised local copy.
 */
export const SCOPE_SEGMENT = '[A-Z0-9]*[A-Z][A-Z0-9]*'

/** A fixed roadmap issuing-area code, anchored. */
export const AREA_CODE = new RegExp(`^${SCOPE_SEGMENT}$`)

/** True when the value is a legal fixed roadmap issuing-area code. */
export const isAreaCode = (value: unknown): value is string => typeof value === 'string' && AREA_CODE.test(value)
