import { expect, test } from 'bun:test'
import {
  artboardHtml,
  CODE_MIN,
  COLLECT_MIN,
  type CollectorPlan,
  codeRegions,
  collectorSource,
  collectRegions,
  LABEL_MAX,
  legendLine,
  PAGE_DEFAULTS,
  PlanError,
  parsePlan,
  pngSize,
  type Region
} from './board.ts'

/** A minimal element: enough of the DOM for the collector, with compound and descendant selectors only. */
class El {
  parentElement: El | null = null
  readonly children: El[] = []
  constructor(
    readonly tagName: string,
    readonly className = '',
    readonly attrs: Record<string, string> = {},
    readonly rect = { left: 0, top: 0, width: 100, height: 40 },
    readonly ownText = ''
  ) {}
  append(...children: El[]): this {
    for (const child of children) {
      child.parentElement = this
      this.children.push(child)
    }
    return this
  }
  get textContent(): string {
    return [this.ownText, ...this.children.map((c) => c.textContent)].join(' ')
  }
  getAttribute(name: string): string | null {
    return this.attrs[name] ?? null
  }
  getBoundingClientRect() {
    return this.rect
  }
  contains(other: El): boolean {
    for (let a: El | null = other; a; a = a.parentElement) if (a === this) return true
    return false
  }
  private simple(part: string): boolean {
    const tag = part.match(/^[a-z0-9]+/i)?.[0]
    if (tag && tag.toUpperCase() !== this.tagName) return false
    for (const cls of part.match(/\.[\w-]+/g) ?? []) if (!this.className.split(' ').includes(cls.slice(1))) return false
    const id = part.match(/#([\w-]+)/)?.[1]
    return !id || this.attrs.id === id
  }
  matches(selector: string): boolean {
    return selector.split(',').some((alternative) => {
      const steps = alternative.trim().split(/\s+/)
      if (!this.simple(steps.at(-1) as string)) return false
      let at = this.parentElement
      for (let i = steps.length - 2; i >= 0; i--) {
        while (at && !at.simple(steps[i] as string)) at = at.parentElement
        if (!at) return false
        at = at.parentElement
      }
      return true
    })
  }
  private descendants(): El[] {
    return this.children.flatMap((c) => [c, ...c.descendants()])
  }
  querySelectorAll(selector: string): El[] {
    return this.descendants().filter((e) => e.matches(selector))
  }
  querySelector(selector: string): El | null {
    return this.querySelectorAll(selector)[0] ?? null
  }
}

const box = (left: number, top: number, width: number, height: number) => ({ left, top, width, height })

/** A page with a navigation rail, a tray and content. */
const page = () => {
  const brand = new El('A', 'brand', {}, box(0, 0, 200, 40), 'Viewer')
  const knowledge = new El('NAV', '', { 'aria-label': 'Knowledge' }, box(0, 50, 200, 120))
  const tiny = new El('NAV', '', { 'aria-label': 'Tiny' }, box(0, 180, 10, 10))
  const rail = new El('ASIDE', 'rail', {}, box(0, 0, 220, 900)).append(brand, knowledge, tiny)
  const panel = new El('DETAILS', 'tray-panel', {}, box(1200, 40, 240, 200)).append(
    new El('SUMMARY', '', {}, box(1200, 40, 240, 20), 'Relationships 3')
  )
  const tray = new El('ASIDE', 'tray', {}, box(1180, 0, 260, 900)).append(panel)
  const title = new El('H1', '', {}, box(240, 20, 600, 40), 'Home')
  const eyebrow = new El('P', 'eyebrow', {}, box(240, 0, 200, 16), 'Today')
  const deep = new El('SECTION', 'inner', {}, box(260, 200, 400, 100))
  const middle = new El('SECTION', 'middle', {}, box(250, 150, 500, 200)).append(deep)
  const outer = new El('SECTION', '', { 'aria-label': 'Due next' }, box(240, 100, 900, 400)).append(middle)
  const card = new El('ARTICLE', 'card-body', {}, box(240, 520, 900, 300)).append(
    new El('H2', '', {}, box(240, 520, 900, 30), '  A   long card\n heading  ')
  )
  const main = new El('MAIN', 'app-main', {}, box(220, 0, 960, 900)).append(eyebrow, title, outer, card)
  const body = new El('BODY').append(rail, main, tray)
  return new El('HTML').append(body)
}

const PLAN: CollectorPlan = {
  shells: [
    {
      zone: 'navigation',
      whole: '.rail',
      wholeLabel: 'Whole rail',
      parts: [
        { selector: '.brand', label: 'Brand' },
        { selector: '.rail nav', label: 'group:', each: true }
      ]
    },
    { zone: 'tray', whole: '.tray', parts: [{ selector: '.tray .tray-panel', label: 'Panel:', each: true }] }
  ],
  page: {
    root: '.app-main',
    blocks: 'section, article, h1, .eyebrow',
    names: [{ selector: '.eyebrow', label: 'Eyebrow' }]
  }
}

test('the collector measures shells in plan order and page blocks in document order', () => {
  const regions = collectRegions(PLAN, page())
  expect(regions.map((r) => [r.zone, r.label, r.whole ?? false])).toEqual([
    ['navigation', 'Whole rail', true],
    ['navigation', 'Brand', false],
    ['navigation', 'group: Knowledge', false],
    ['tray', 'Whole tray', true],
    ['tray', 'Panel: Relationships 3', false],
    ['page', 'Eyebrow', false],
    ['page', 'Page title', false],
    ['page', 'Due next', false],
    ['page', 'middle', false],
    ['page', 'A long card heading', false]
  ])
  expect(regions[2]).toEqual({ zone: 'navigation', label: 'group: Knowledge', x: 0, y: 50, w: 200, h: 120 })
})

test('the collector skips small boxes, keeps two nesting levels and stops at the region cap', () => {
  const labels = collectRegions(PLAN, page()).map((r) => r.label)
  expect(labels).not.toContain('group: Tiny')
  expect(labels).not.toContain('inner')
  const capped = collectRegions(
    { ...PLAN, page: { ...(PLAN.page as NonNullable<CollectorPlan['page']>), maxRegions: 2 } },
    page()
  )
  expect(capped.filter((r) => r.zone === 'page').map((r) => r.label)).toEqual(['Eyebrow', 'Page title'])
})

test('the collector cuts long labels and falls back to the class name, then the tag', () => {
  const long = 'x'.repeat(80)
  const main = new El('MAIN', 'm', {}, box(0, 0, 900, 900)).append(
    new El('SECTION', '', { 'aria-label': long }, box(0, 0, 300, 100)),
    new El('SECTION', 'due_next-list', {}, box(0, 120, 300, 100)),
    new El('FIGURE', '', {}, box(0, 240, 300, 100))
  )
  const doc = new El('HTML').append(main)
  const labels = collectRegions({ shells: [], page: { root: '.m', blocks: 'section, figure' } }, doc).map(
    (r) => r.label
  )
  expect(labels[0]).toHaveLength(LABEL_MAX - 1)
  expect(labels[0]?.endsWith('…')).toBe(true)
  expect(labels.slice(1)).toEqual(['due next list', 'figure'])
})

test('the collector is self-contained, so it survives serialisation into the page', () => {
  const source = collectorSource(PLAN)
  const evaluate = new Function('document', `return ${source}`) as (doc: unknown) => Region[]
  expect(evaluate(page())).toEqual(collectRegions(PLAN, page()))
  expect(source).toContain('"zone":"navigation"')
})

test('the collector’s limits are the published ones', () => {
  const sized = (w: number, h: number, label: string) => new El('SECTION', '', { 'aria-label': label }, box(0, 0, w, h))
  const exact = 'y'.repeat(LABEL_MAX)
  const main = new El('MAIN', 'm', {}, box(0, 0, 900, 900)).append(
    sized(COLLECT_MIN.w, COLLECT_MIN.h, exact),
    sized(COLLECT_MIN.w - 1, COLLECT_MIN.h, 'narrow'),
    sized(COLLECT_MIN.w, COLLECT_MIN.h - 1, 'short')
  )
  const plan = { shells: [], page: { root: '.m', blocks: 'section' } }
  expect(collectRegions(plan, new El('HTML').append(main)).map((r) => r.label)).toEqual([exact])
  const many = new El('MAIN', 'm', {}, box(0, 0, 900, 900)).append(
    ...Array.from({ length: PAGE_DEFAULTS.maxRegions + 5 }, (_, i) => sized(100, 40, `block ${i}`))
  )
  expect(collectRegions(plan, new El('HTML').append(many))).toHaveLength(PAGE_DEFAULTS.maxRegions)
  expect(PAGE_DEFAULTS.maxDepth).toBe(2)
})

const region = (
  zone: Region['zone'],
  label: string,
  x: number,
  y: number,
  w: number,
  h: number,
  whole = false
): Region => (whole ? { zone, label, x, y, w, h, whole } : { zone, label, x, y, w, h })

test('codes number each zone in order, give a whole shell 0, keep only the artboard’s zones and clip', () => {
  const regions = [
    region('navigation', 'Whole rail', 0, 0, 220, 900, true),
    region('navigation', 'Brand', 0, 0, 200, 40),
    region('page', 'Page title', 240, 20, 600, 40),
    region('navigation', 'Status', -10, 860, 200, 80),
    region('page', 'Off the edge', 1430, 10, 100, 100),
    region('page', 'Footer', 240, 880, 600, 100)
  ]
  const coded = codeRegions(regions, ['navigation'], 1440, 900)
  expect(coded.map((r) => r.code)).toEqual(['N0', 'N1', 'N2'])
  expect(coded[2]).toMatchObject({ x: 0, y: 860, w: 190, h: 40 })
  const pageCodes = codeRegions(regions, ['page'], 1440, 900)
  expect(pageCodes.map(legendLine)).toEqual(['P1 Page title', 'P2 Footer'])
  expect(pageCodes[1]?.h).toBe(20)
  expect(CODE_MIN.w).toBeGreaterThan(10)
})

test('the overlay anchors each region by code, escapes labels and places a whole shell’s badge bottom right', () => {
  const coded = codeRegions(
    [region('tray', 'Whole tray', 1180, 0, 260, 900, true), region('page', 'Due <next> & "soon"', 240, 100, 900, 400)],
    ['tray', 'page'],
    1440,
    900
  )
  const html = artboardHtml({ src: 'shots/home.png', alt: 'Home', width: 1440, height: 900, regions: coded })
  expect(html).toContain('data-region="T0"')
  expect(html).toContain('data-region="P1" title="P1 · Due &lt;next&gt; &amp; &quot;soon&quot;"')
  expect(html).toMatch(/data-region="T0"[^\n]*bottom: -1px/)
  expect(html).toMatch(/data-region="P1"[^\n]*top: -1px/)
  expect(html).toContain('data-board-overlay')
})

test('a board plan is validated with the fault named', () => {
  const good = {
    collector: { shells: [] },
    boards: [{ id: '2.1b', title: 'Captured', shot: 'captured', image: 'shots/captured.png', zones: ['page'] }]
  }
  expect(parsePlan(good).boards[0]?.id).toBe('2.1b')
  const bad: Array<[unknown, RegExp]> = [
    [[], /JSON object/],
    [{ collector: {}, boards: [] }, /collector.shells/],
    [{ collector: { shells: [{ zone: 'page', whole: '.x', parts: [] }] }, boards: good.boards }, /navigation, tray/],
    [{ ...good, boards: [] }, /non-empty list/],
    [{ ...good, boards: [{ ...good.boards[0], id: 'two' }] }, /board number/],
    [{ ...good, boards: [good.boards[0], good.boards[0]] }, /used twice/],
    [{ ...good, boards: [{ ...good.boards[0], zones: ['rail'] }] }, /navigation, tray, page/],
    [{ ...good, collector: { shells: [], page: { root: '.m' } } }, /collector.page.blocks/]
  ]
  for (const [plan, message] of bad) expect(() => parsePlan(plan)).toThrow(message)
  expect(() => parsePlan([])).toThrow(PlanError)
})

test('a PNG’s size is read from its header, and anything else is refused', () => {
  const header = new Uint8Array(24)
  header.set([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
  new DataView(header.buffer).setUint32(16, 1440)
  new DataView(header.buffer).setUint32(20, 2400)
  expect(pngSize(header)).toEqual([1440, 2400])
  expect(() => pngSize(new Uint8Array(24))).toThrow(/not a PNG/)
  expect(() => pngSize(header.slice(0, 10))).toThrow(PlanError)
})
