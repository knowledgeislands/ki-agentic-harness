import { existsSync, readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
export type WebsiteCloudflareContext = {
  target: string
  available: boolean
  config: string
  packageJson: string
  gitignore: string
  optIn: boolean
}
export const createWebsiteCloudflareContext = (target: string): WebsiteCloudflareContext => {
  const root = resolve(target)
  const config = ['wrangler.jsonc', 'wrangler.json', 'wrangler.toml'].map((file) => join(root, file)).find(existsSync)
  return {
    target: root,
    available: existsSync(root),
    config: config ? readFileSync(config, 'utf8') : '',
    packageJson: existsSync(join(root, 'package.json')) ? readFileSync(join(root, 'package.json'), 'utf8') : '',
    gitignore: existsSync(join(root, '.gitignore')) ? readFileSync(join(root, '.gitignore'), 'utf8') : '',
    optIn:
      existsSync(join(root, '.ki-config.toml')) && /\[ki-website-cloudflare\]/.test(readFileSync(join(root, '.ki-config.toml'), 'utf8'))
  }
}
