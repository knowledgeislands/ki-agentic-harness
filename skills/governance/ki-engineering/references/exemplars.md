# Engineering Exemplars

## Contents

- [Collections](#collections)
- [Selected patterns](#selected-patterns)

Curated patterns from the KI sibling repos that illustrate what the engineering standard looks like in practice. Use these as pattern references when configuring a new repo or auditing an existing one — the goal is to show the standard not as abstract rules but as concrete file contents. The `mcp-*` repos are the primary exemplar set for the compiled-TS profile; `ki-agentic-harness` is the primary exemplar for the scripts-only (no `src/`, no `vitest.config`) profile.

For the full upstream pin list and in-house sources, see [sources.md](sources.md).

## Collections

| Source | URL | What it covers |
| --- | --- | --- |
| mcp-gsuite | [github][mcp-gsuite] | Canonical flat-repo compiled-TS profile with env config |
| mcp-kb-fs | [github][mcp-kb-fs] | Canonical flat-repo compiled-TS profile, no CLI binary |
| ki-agentic-harness | [github][harness] | Scripts-only profile; runner-neutral standalone self-tests |
| Biome configuration reference | [biomejs.dev][biome-config] | The schema the `$schema` pin tracks |
| TypeScript compiler options | [typescriptlang.org][ts-tsconfig] | The invariants and the compiled-TS profile options |

## Selected patterns

### Canonical `biome.json`

All 10 KI TS/Bun repos carry this config verbatim. The `$schema` pins the Biome version — when the house upgrades Biome, bump this value and the matching devDependency together. `vcs.useIgnoreFile: true` means `.gitignore` is the single ignore source; no separate Biome ignore file is needed. `lineWidth: 120` is the shared code-formatting budget; Markdown is owned separately by ki-authoring. `noExplicitAny: off` is the deliberate house divergence from the recommended preset — KI TypeScript uses `any` sparingly but does not ban it.

```json
{
  "$schema": "https://biomejs.dev/schemas/2.5.15/schema.json",
  "vcs": { "enabled": true, "clientKind": "git", "useIgnoreFile": true },
  "files": { "includes": ["src/**", "*.ts", "*.json"], "ignoreUnknown": true },
  "formatter": { "enabled": true, "indentStyle": "space", "indentWidth": 2, "lineWidth": 120 },
  "javascript": {
    "formatter": { "quoteStyle": "single", "semicolons": "asNeeded", "trailingCommas": "none" }
  },
  "linter": {
    "enabled": true,
    "rules": { "preset": "recommended", "suspicious": { "noExplicitAny": "off" } }
  },
  "assist": { "enabled": true, "actions": { "source": { "organizeImports": "on" } } }
}
```

### `tsconfig.json` — compiled-TS profile (the `mcp-*` base)

Used by every `mcp-*` repo. The universal invariants (`strict`, `nodenext`, `noEmit`, `isolatedModules`, `esModuleInterop`, `skipLibCheck`, `forceConsistentCasingInFileNames`) must hold in every KI repo, including those that do not compile. The additional fields (`target es2024`, `moduleDetection: force`, `types: ["node"]`, full `noUnused*` / `noImplicit*`) form the compiled-TS profile shared across all repos that ship a `dist/`. A repository that selects Vitest by carrying `vitest.config.*` adds `vitest/globals` to `types`. A `tsconfig.build.json` that extends this adds `noEmit: false`, `outDir: ./dist`, and `rootDir: ./src` — the `include`/`exclude` on the base already match.

```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "compilerOptions": {
    "target": "es2024",
    "lib": ["es2024"],
    "module": "nodenext",
    "moduleResolution": "nodenext",
    "moduleDetection": "force",
    "types": ["node"],
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "sourceMap": true,
    "noEmit": true,
    "isolatedModules": true,
    "verbatimModuleSyntax": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noImplicitReturns": true,
    "noImplicitOverride": true,
    "skipLibCheck": true
  },
  "include": ["**/*.ts"],
  "exclude": ["node_modules", "dist"]
}
```

### Native governance commands and the conditional Vitest profile

The governance surface is direct native `ki repo audit` / `ki repo conform` commands after CI or the user has acquired the verified active skill collection. Repositories do not expose `ki:audit`, `ki:conform`, or derived scoped package-script aliases to local runners. The registered `ki-engineering` rubric runs Biome, TypeScript, syncpack, and knip internally, while `ki-authoring` owns the Markdown tool pass. The critical trap is a non-`test` script calling `bun test`: it bypasses the governed package script and invokes Bun's own runner. Use `bun run test` outside the bare `test` entrypoint; that entrypoint may select a runner, whether `vitest run`, `bun test`, or another whole-suite command.

Repository-local operations make their ownership visible with the `self:` prefix, for example `self:vendor:clone`, `self:typecheck`, or `self:cf:build`. They require no capability claim or `script_exclusions` entry. Keep an exact exclusion only when an external system fixes a bare script name that cannot be migrated.

```jsonc
{
  "scripts": {
    "clean": "rm -rf {dist,node_modules}",
    "prepare": "husky",
    "test": "vitest run",
    "test:coverage": "vitest run --coverage",
    "test:watch": "vitest"
  }
}
```

The three Vitest scripts above apply only when the repository carries `vitest.config.*`. A runner-neutral repository supplies only its appropriate bare `test` script; it does not restore aggregate or scoped governance-script aliases.

The harness's [actual package manifest](../../../../package.json) uses the same bare idiom without a Vitest configuration; the complete entry delegates discovery and execution to Bun without recreating retired bootstrap or governance runners. An abbreviated shape:

```jsonc
{
  "scripts": {
    "test": "bun test --isolate --max-concurrency=1 ./skills ./hooks"
  }
}
```

This runner-neutral profile does not opt into `test:coverage`, `test:watch`, or the Vitest threshold checks. Its bare `test` entrypoint may use `bun test` to glob its suite; other scripts continue to delegate through `bun run test`.

### Monorepo: ownership roots and workspace-scoped Vitest coverage (§0, §6)

The root manifest declares only the ownership groups present in that repository. Bun accepts multiple globs, so a mixed library/application/example repository can state its shape directly rather than forcing every role under one generic directory:

```jsonc
{
  "workspaces": ["packages/*", "apps/*", "examples/*"]
}
```

`packages/*` holds consumable libraries, `apps/*` holds deployables such as `apps/site`, and `examples/*` holds authored examples. An additional justified ownership root remains possible. In any workspace repo the flat `src/**` globs and root coverage output become **workspace-relative** — artifacts sit under the workspace that owns them, never the repo root. The 100%-threshold rule is unchanged; only the paths move.

```ts
// vitest.config.ts (monorepo — tests + coverage scoped to the apps/site workspace)
export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['apps/site/scripts/**/*.test.ts'], // under the workspace, not src/**
    coverage: {
      provider: 'v8',
      reportsDirectory: 'apps/site/reports/coverage',
      include: ['apps/site/scripts/seed-model.ts', 'apps/site/scripts/body-regen.ts'],
      exclude: ['apps/site/scripts/**/*.test.ts'],
      thresholds: { statements: 100, branches: 100, functions: 100, lines: 100 }
    }
  }
})
```

### Canonical `turbo.json` for a website workspace repo (§0)

The house shape, taken from `5g-emerge-ibc2026`. Every website repository with a `workspaces` array carries this file with only its own package names substituted, so the task graph reads the same everywhere and a drift is visible as a diff rather than as a judgement.

```jsonc
{
  "$schema": "https://turborepo.com/schema.json",
  "ui": "stream",
  "remoteCache": { "enabled": false }, // explicit intent, never by omission (TURBO-3)
  "globalDependencies": ["tsconfig.json", "vitest.config.ts"],
  "tasks": {
    "build": { "dependsOn": ["^build"], "inputs": ["$TURBO_DEFAULT$"] },
    "@scope/site#build": {
      "dependsOn": ["^build"],
      "inputs": ["$TURBO_DEFAULT$"], // a deployable hashes its whole workspace
      "outputs": ["dist/**"]
    },
    "clean": { "cache": false },
    "deploy": { "cache": false },
    "ki:site:dev": { "cache": false, "persistent": true },
    "preview": { "cache": false, "persistent": true },
    "test": { "dependsOn": ["^typecheck"] },
    "typecheck": { "dependsOn": ["^typecheck"] }
  }
}
```

Two things make it work, and both live outside this file. Each non-root workspace carries its own `build`, `typecheck` and `test` scripts — the package-local lifecycle surface, not root namespace entries (§2) — so each is a cache unit of its own. The root delegates to the graph rather than chaining workspaces by hand:

```jsonc
{
  "scripts": {
    "build": "turbo run build",
    "test": "turbo run test",
    "self:typecheck": "bunx tsc --noEmit && turbo run typecheck"
  }
}
```

Verify adoption by running the build twice: the second run reports `FULL TURBO`. A second run that rebuilds is a graph that is caching nothing, whatever the configuration says.

### Released `ki` pin and its receiver (CI-1)

`ki-agentic-harness` keeps the released `ki` tag in `.github/ki-version`, one line such as `v0.8.4`, and its CI reads that file before installing the release:

```yaml
- name: Read released KI pin
  run: |
    set -euo pipefail
    KI_VERSION=$(tr -d '[:space:]' < .github/ki-version)
    [[ "$KI_VERSION" =~ ^v[0-9]+\.[0-9]+\.[0-9]+$ ]]
    printf 'KI_VERSION=%s\n' "$KI_VERSION" >> "$GITHUB_ENV"
```

Its `.github/workflows/update-ki-pin.yml` receiver proposes each newer immutable `tools-ki` release as a pull request that rewrites only the pin file, so the release App needs no Workflows permission. The job is inert until the App is installed on the repository and its variable and secret are set; the tap's `tool-release-published` dispatch only shortens the daily schedule's latency. A copy needs no edits: the token is scoped to the running repository by name.

```yaml
name: Update ki pin

# Proposes a .github/ki-version bump when tools-ki publishes an immutable
# release. Inert until the release App is installed here and its variable and
# secret are set; the daily schedule backstops a missed dispatch. The pull
# request merges only after human review (XDR-KI-HARNESS-001).
on:
  repository_dispatch:
    types: [tool-release-published]
  schedule:
    - cron: '41 6 * * *'
  workflow_dispatch:

permissions:
  contents: read

concurrency:
  group: update-ki-pin
  cancel-in-progress: false

jobs:
  propose:
    if: >-
      vars.KI_TOOLS_RELEASE_BOT_APP_ID != '' &&
      (github.event_name != 'repository_dispatch' ||
       github.event.client_payload.source_repository == 'knowledgeislands/tools-ki')
    runs-on: ubuntu-latest
    steps:
      - name: Create tools release bot token
        id: release-bot
        uses: actions/create-github-app-token@v2
        with:
          app-id: ${{ vars.KI_TOOLS_RELEASE_BOT_APP_ID }}
          private-key: ${{ secrets.KI_TOOLS_RELEASE_BOT_PRIVATE_KEY }}
          owner: knowledgeislands
          repositories: ${{ github.event.repository.name }}
      - uses: actions/checkout@v7.0.1
        with:
          token: ${{ steps.release-bot.outputs.token }}
      - name: Propose the latest immutable ki release
        env:
          GH_TOKEN: ${{ steps.release-bot.outputs.token }}
        run: |
          set -euo pipefail
          release=$(gh api repos/knowledgeislands/tools-ki/releases/latest)
          version=$(jq -r '.tag_name' <<<"$release")
          immutable=$(jq -r '.immutable // false' <<<"$release")
          [[ "$version" =~ ^v[0-9]+\.[0-9]+\.[0-9]+$ ]]
          current=$(tr -d '[:space:]' < .github/ki-version)
          [[ "$current" =~ ^v[0-9]+\.[0-9]+\.[0-9]+$ ]]
          if [[ "$immutable" != "true" ]]; then
            echo "latest release $version not immutable; skipped"
            exit 0
          fi
          if [[ "$version" == "$current" ]] ||
             [[ "$(printf '%s\n%s\n' "$current" "$version" | sort -V | tail -n 1)" != "$version" ]]; then
            echo "pin $current is current; nothing to propose"
            exit 0
          fi
          branch="automation/ki-$version"
          if git ls-remote --exit-code --heads origin "$branch" >/dev/null; then
            echo "proposal branch $branch already exists; skipped"
            exit 0
          fi
          printf '%s\n' "$version" > .github/ki-version
          git config user.name 'ki-tools-release-bot[bot]'
          git config user.email 'ki-tools-release-bot[bot]@users.noreply.github.com'
          git switch -c "$branch"
          git commit -m "chore(ci): install ki $version" -- .github/ki-version
          git push origin "$branch"
          gh pr create --base main --head "$branch" \
            --title "Install ki $version in CI" \
            --body "Moves the released \`ki\` pin from $current to $version, the latest immutable \`knowledgeislands/tools-ki\` release. Merge after review once CI passes."
```

### A format reader extracted at its second caller (Code design)

`apps-observatory`'s roadmap adapter carried a private YAML frontmatter reader. Its unquote step anchored on `^['"]`, but an inline YAML list separates its entries with `, `, so every entry after the first arrived with a leading space and kept its opening quote. The first caller hid the defect: the roadmap fields it reads are rarely multi-entry inline lists, so its output looked right and its tests passed.

When a second adapter needed the same format, the reader was extracted into its own module rather than copied (`KI-OBS-VIS-004` in `apps-observatory`). The second caller read differently shaped frontmatter, and the defect surfaced at once: three false `blocking` signals against identifiers such as `'SDR-KI-ARCADIA-003`, a governance viewer reporting dependency breakage that did not exist. The fix and its regression test then covered both callers.

Had the reader been copied, the fix would have landed in one copy. The other would have kept producing plausible identifiers with a stray quote, and no gate would have said so: both copies type-check, both pass their own tests, and the defect is observable only against input the first caller never sees. Duplication that drifts can at least be detected; duplication that silently agrees while wrong cannot.

### Minimal `[skills.ki-engineering]` table in `.ki.toml`

The table is a conformance marker — its presence declares "the engineering standard applies here". It carries no top-level keys because capabilities (tests, compiled build, env config) are auto-detected from repo markers (`vitest.config.*`, `tsconfig.build.json`, `.env*.example`). The only allowed sub-structure is a `[skills.ki-engineering.checks]` table for deliberate waivers. A repo that fully conforms writes the table header and nothing else.

```toml
[skills.ki-engineering]
# This repo fully conforms. Capabilities (tests, compiled build, env config) are auto-detected
# from repo markers — no profile key is needed here.
# To waive a specific check, add:
# [skills.ki-engineering.checks]
# <check-id> = false  # reason: …
```

[mcp-gsuite]: https://github.com/knowledgeislands/mcp-gsuite
[mcp-kb-fs]: https://github.com/knowledgeislands/mcp-kb-fs
[harness]: https://github.com/knowledgeislands/ki-agentic-harness
[biome-config]: https://biomejs.dev/reference/configuration/
[ts-tsconfig]: https://www.typescriptlang.org/tsconfig
