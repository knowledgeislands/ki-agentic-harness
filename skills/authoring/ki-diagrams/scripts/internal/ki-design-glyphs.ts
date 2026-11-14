/**
 * Purpose: The `ki-design` glyphs the KI-theme SVG export draws in place of Archify's node icons, vendored at the
 * token module's pinned revision.
 * Boundary: Glyph bodies only, copied from `packages/icons/svg/` in `knowledgeislands/ki-design`, each chosen through
 * the symbol in `packages/symbols/src/symbols.ts` whose meaning matches the Archify icon; the drift test compares both
 * against that revision. An Archify icon with no matching KI symbol keeps Archify's own drawing.
 *
 * Archify draws each node icon as a `data-semantic-sigil` group on a 16-unit grid; a KI glyph is drawn on a 24-unit
 * grid, so the exporter scales the group by 16/24 when it swaps the body in, and the group's own stroke applies.
 */

export { KI_DESIGN_REVISION } from './ki-design-tokens.ts'

/** The directory of the glyph files and the symbol library, relative to the `ki-design` repository root. */
export const KI_DESIGN_ICONS_PATH = 'packages/icons/svg'
export const KI_DESIGN_SYMBOLS_PATH = 'packages/symbols/src/symbols.ts'

/** The grid a KI glyph is drawn on, against Archify's 16. */
export const KI_GLYPH_GRID = 24

/** Each mapped Archify icon: the KI symbol whose meaning carries it, that symbol's glyph and the glyph's inner markup. */
export const KI_GLYPHS = {
  calendar: {
    symbol: 'calendar',
    icon: 'calendar',
    body: '<circle cx="12" cy="9" r="5.5"/><path d="M8.5 21 V13.24 M15.5 21 V13.24"/><path d="M12 9 L9.75 7.7 M12 9 L15.2 7.15"/><path d="M10.5 21 V18.5 H13.5 V21"/><path d="M5 21 H19"/>'
  },
  database: {
    symbol: 'library',
    icon: 'library',
    body: '<rect x="4" y="6" width="3" height="14"/><rect x="7" y="4" width="3.5" height="16"/><path d="M11.5 7.5 L14.5 6.7 L17.7 19.2 L14.7 20 Z"/><path d="M4 9 H7 M7 7 H10.5 M7 17 H10.5"/><path d="M3 20 H21"/>'
  },
  decision: {
    symbol: 'council-hall',
    icon: 'council-hall',
    body: '<path d="M3 9 L12 3.5 L21 9 Z"/><path d="M4 11 H20"/><path d="M6 11 V18 M10 11 V18 M14 11 V18 M18 11 V18"/><path d="M4 18.5 H20 M3 21 H21"/>'
  },
  external: {
    symbol: 'port',
    icon: 'port',
    body: '<circle cx="12" cy="5" r="2"/><path d="M12 7 V20"/><path d="M8 10 H16"/><path d="M4.5 13 C4.5 17 8 20 12 20 C16 20 19.5 17 19.5 13"/><path d="M3 14.5 L4.5 13 L6 14.5 M18 14.5 L19.5 13 L21 14.5"/>'
  },
  security: {
    symbol: 'customs-house',
    icon: 'customs-house',
    body: '<rect x="3" y="9" width="7" height="12" rx="1"/><path d="M5 12.5 H8"/><path d="M6.5 9 V3.5 L10 4.5 L6.5 5.5"/><rect x="10" y="13" width="11" height="2" rx="1"/><path d="M13.5 13 V15 M17 13 V15"/><path d="M3 21 H21"/>'
  },
  messagebus: {
    symbol: 'current',
    icon: 'current',
    body: '<path d="M3 7 C5 5 7 5 9 7 S13 9 15 7"/><path d="M3 12 C5 10 7 10 9 12 S13 14 15 12 S19 10 21 12"/><path d="M18.5 9.5 L21 12 L18.5 14.5"/><path d="M9 17 C11 15 13 15 15 17 S19 19 21 17"/>'
  }
} as const satisfies Record<string, { readonly symbol: string; readonly icon: string; readonly body: string }>

/** The glyph body to draw for each mapped Archify icon name, as the exporter's page script takes it. */
export const kiGlyphBodies = (): Record<string, string> =>
  Object.fromEntries(Object.entries(KI_GLYPHS).map(([sigil, { body }]) => [sigil, body]))
