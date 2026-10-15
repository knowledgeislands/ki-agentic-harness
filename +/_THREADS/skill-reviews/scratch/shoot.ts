import { chromium } from 'playwright'
import { resolve } from 'node:path'
const slugs = process.argv.slice(2)
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1500, height: Number(process.env.H ?? 1000) }, deviceScaleFactor: 1 })
for (const slug of slugs) {
  await page.goto('file://' + resolve((process.env.SRC ?? '+/diagrams') + `/${slug}/${slug}.html`))
  await page.waitForTimeout(600)
  const svg = await page.$('svg')
  await (svg ?? page).screenshot({ path: (process.env.OUT ?? '+/_THREADS/skill-reviews/screens') + `/${slug}.png` })
  const box = await svg?.boundingBox()
  console.log(slug, box ? `${Math.round(box.width)}x${Math.round(box.height)}` : '')
}
await browser.close()
