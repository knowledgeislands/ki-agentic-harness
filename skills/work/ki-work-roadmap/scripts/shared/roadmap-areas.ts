/** Shared area configuration and record-identity checks for both roadmap adapters. */
import { AREA_CODE } from './work-identifiers.ts'

export type RoadmapAreas = {
  areas: ReadonlyMap<string, string | undefined>
  legacy: boolean
  error?: string
}

/** Preserve the local roadmap adapter's first-error diagnostics and legacy-list tolerance. */
export const inspectRoadmapAreas = (configuredAreas: unknown): RoadmapAreas => {
  const areas = new Map<string, string | undefined>()
  const invalid = (error: string): RoadmapAreas => ({ areas, legacy: false, error })
  if (Array.isArray(configuredAreas)) {
    if (!configuredAreas.length || configuredAreas.some((area) => typeof area !== 'string' || !AREA_CODE.test(area)))
      return invalid('ki-work-roadmap areas must map uppercase area codes to titles')
    if (new Set(configuredAreas).size !== configuredAreas.length)
      return invalid('ki-work-roadmap areas must not repeat an area code')
    for (const area of configuredAreas) areas.set(area, undefined)
    return { areas, legacy: true }
  }
  if (configuredAreas !== undefined) {
    if (typeof configuredAreas !== 'object' || configuredAreas === null)
      return invalid('ki-work-roadmap areas must map uppercase area codes to titles')
    for (const [area, title] of Object.entries(configuredAreas)) {
      if (!AREA_CODE.test(area))
        return invalid('roadmap area codes must be uppercase alphanumeric with at least one letter')
      if (typeof title !== 'string' || !/^[A-Z0-9]\S*(?: \S+)*$/.test(title))
        return invalid(
          typeof title === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(title)
            ? `area ${area} maps to theme '${title}'; the area-to-theme map is retired, so map the code to its title`
            : `area ${area} must map to a title that starts with a capital letter`
        )
      areas.set(area, title)
    }
    if (!areas.size) return invalid('ki-work-roadmap areas must not be empty when declared')
  }
  return { areas, legacy: false }
}

/** A record must use the declared repository code and, when configured, one declared issuing area. */
export const matchesRoadmapArea = (
  id: string | undefined,
  area: string | undefined,
  configuration: { repoCode: string; areas: ReadonlyMap<string, string | undefined> } | undefined
): boolean => {
  if (!configuration) return false
  const configuredArea = area && configuration.areas.has(area) ? area : undefined
  const issueNumber = id?.slice(`${configuration.repoCode}${configuration.areas.size ? `-${area ?? ''}` : ''}-`.length)
  const expectedPrefix = configuration.areas.size
    ? `${configuration.repoCode}-${configuredArea ?? ''}-`
    : `${configuration.repoCode}-`
  return Boolean(
    id?.startsWith(expectedPrefix) &&
      issueNumber &&
      /^\d{3,}$/.test(issueNumber) &&
      (configuration.areas.size > 0 ? area && configuredArea : area === undefined)
  )
}
