# Bootstrap a repository

This is the detailed reference for bringing a repository under Knowledge Islands governance so it **governs itself** — running `./.ki/bin/ki-audit` with **zero skills installed** and **no `package.json` required**. First install the harness for your user account, then use this repository-scoped step; start with [Install and get started](getting-started.md).

Bootstrap is a repository action: it builds that repository's `.ki/` directory and does not configure the user's wider environment. Re-running it is also how a repository stays current — there is no separate migration mode. This guide is the operating manual for the bootstrap chain (ADR-KI-HARNESS-006); its fenced `bash` blocks are executable and are exercised by the harness's own test suite, so they cannot drift from what actually works.

If you maintain the harness itself, [Generated write boundaries](../developer/generated-write-boundaries.md) explains which surfaces are committed, copied, linked, or user-environment-managed and how to recover each safely.

## The remote-run transport — the primary path

The canonical, zero-install form is the `curl | sh` installer idiom — **`cd` into the repo you want to govern**, then run:

```bash
curl -fsSL https://knowledgeislands.info/harness/bootstrap | sh
```

It bootstraps the current directory from the harness's `main`. `/harness/bootstrap` is the stable public route; it resolves to the repository bootstrap entry point, whose implementation may change without changing this command. The entry point is POSIX `sh` and assumes only curl and tar: it fetches the harness source tarball (GitHub's codeload endpoint generates it on demand — no publish step), extracts it to a temp dir, and runs the chain engine from that tree. Bun is required as the mechanical layer's runtime — the engine and every vendored checker are TypeScript — so if it is missing the script fails fast with the install instruction rather than installing a runtime silently.

There is nothing else to pass in the common case: the target is the current directory and the ref is `main`, which is what you want — re-running keeps the repo current with `main` (see [Keeping current](#keeping-current)). Two escape hatches exist for the rare case that needs them: a positional target other than the cwd and a pinned ref, `… | sh -s -- <target> --ref <sha>`; or, where bun is already installed, `bunx github:knowledgeislands/ki-agentic-harness#<sha> <target> --ref <sha>` (pin a sha — bunx caches floating git refs).

### Across a fleet, with `mgit -B`

The one-liner above is per-repo. To bootstrap — or re-sync — every repo in a fleet at once, run it through [`mgit`](https://github.com/knowledgeislands/tools-mgit) in bare mode from the fleet's container directory (each checkout registered in its `.mgitconfig`):

```bash
mgit -B sh -c 'curl -fsSL https://knowledgeislands.info/harness/bootstrap | sh'
```

`-B`/`--bare` execs the given argv directly in each registered repo (`cd "$repo" && "$@"`) instead of prefixing it with `git` — there is no shell in between, so a bare `curl … | sh` won't work as argv (the pipe has nowhere to run); wrap it in `sh -c '...'` as above. The same escape hatches apply per repo, wrapped the same way — e.g. `mgit -B sh -c 'curl -fsSL … | sh -s -- . --ref <sha>'` to pin every repo to one ref.

## What bootstrap does

Bootstrap's one job is to build `.ki/`. For every skill in the resolved set — every `[ki-<skill>]` table the target declares in its `.ki-config.toml` (including a bare `[ki-authoring]`, which every repo must declare itself — there is no injected baseline, per `ADR-KI-HARNESS-007`) — it:

1. **vendors** each governed skill's `scripts/govern.ts` entrypoint into `.ki/bootstrap/checkers/<skill>/scripts/govern.ts`, renders the skill's **HELP snapshot** to `.ki/bootstrap/checkers/<skill>/help.md`, and generates its target-local EDUCATE launcher at `.ki/bootstrap/educators/<skill>/educate.ts`; a physical source harness links its own canonical `skills/` and `agents/` source material instead, while its HELP snapshots, launchers, bins, and manifest remain regular generated files;
2. **writes** the four `package.json`-free entry points — `.ki/bin/{ki-audit, ki-conform, ki-educate, ki-help}` over a `.ki/bin/aggregate.ts` runner that discovers the checker copies and fans out over them — and **stamps** the vendoring manifest (`.ki/manifest.json`: the harness ref plus a hash per vendored file).

It **never touches `package.json`.** A `.ki/` is dot-prefixed and generated-not-authored, so it stays off the repo's own `scripts/`, and (being idempotent) re-running the bootstrap at the same ref reproduces byte-identical output. The `ki:*` convenience keys that a code repo may want — `bun run ki:audit` aliasing `./.ki/bin/ki-audit` — are wired later by `ki-engineering` when it comes online for that repo, as sugar over these same bins, never by bootstrap.

Repository bootstrap does not install or configure user-global hooks. The optional Claude Code hook payload is a separate user-environment action, documented in [Install and get started](getting-started.md); do not add it to a per-repository or `mgit` bootstrap run.

## The four bins — day-to-day, once governed

After EDUCATE the repo governs itself with no skills installed and no `package.json`:

| Command                                  | Mode    | What it does                                                                                         |
| ---------------------------------------- | ------- | ---------------------------------------------------------------------------------------------------- |
| `./.ki/bin/ki-audit`                     | AUDIT   | Report drift across every governed skill, on the severity ladder. Read-only.                         |
| `./.ki/bin/ki-conform`                   | CONFORM | Apply the mechanical fixes across the vendored set.                                                  |
| `./.ki/bin/ki-help [skill]`              | HELP    | Print a skill's HELP block from its vendored snapshot — **pure bash, no bun needed**.                |
| `./.ki/bin/ki-educate [skill] [--ref R]` | EDUCATE | Without a skill, re-run the whole chain at `R`; with one, dispatch only its vendored local educator. |

## Running it locally

A local checkout of the harness runs the identical chain. You need [Bun](https://bun.sh) and the harness; the examples reference it through `KI_HARNESS`:

```bash
export KI_HARNESS="${KI_HARNESS:-$(pwd)}"
```

A new repo needs a `.ki-config.toml` declaring `[ki-repo]` and a bare `[ki-authoring]` — every repo declares both itself; nothing is injected. Bootstrap it:

```bash
bun "$KI_HARNESS/skills/keystone/ki-bootstrap/scripts/internal/repo-bootstrap/repo-bootstrap.ts" "$TARGET"
```

Then confirm it self-governs — the vendored aggregate invokes each skill's checker in sequence, with nothing installed in `.claude/skills/`. Its default progress display is one resize-aware row; pass `--progress-style=multi` with `--progress=always` to show stable per-skill rows in an interactive terminal:

```bash
cd "$TARGET" && ./.ki/bin/ki-audit
cd "$TARGET" && ./.ki/bin/ki-audit audit --progress=always --progress-style=multi
```

A single skill's EDUCATE is reachable the same way through its own `scripts/educate.ts`, which seeds that skill into the target — the mechanics and the vendored result are identical to the full chain once its `ki-depends-on:` requirements are declared.

## Keeping current

Re-running the bootstrap **is** the update path. When a standard's REFRESH changes a checker, the repair on a governed target is an idempotent re-run of the chain — `./.ki/bin/ki-educate` (or the remote one-liner) — which re-vendors at the recorded ref and re-stamps the manifest.

Drift in the vendored copies is caught mechanically: the audit checks ordinary copies against manifest hashes; a later bootstrap or CLEAN validates source-harness links against their manifest-recorded relative targets. A stale, altered, dangling, or escaping link fails closed. Conform only prints the advisory ("stale — re-run EDUCATE"), never re-syncs (in a bootstrapped-only repo the local copies are the only source present, so re-syncing from them would be circular). The repair is always the `ki-educate` re-run.

## Clean generated state

Use CLEAN when you need to remove a repository's generated governance state and rebuild it from scratch — for example, before diagnosing a bootstrap problem. It is intentionally source-owned rather than a command inside `.ki/`, because a successful clean removes that directory.

> **Coming soon:** `ki`, the Knowledge Islands command-line interface (CLI), will first provide HELP, version, completion, and a no-op root `ki doctor` response. The first substantive command then imports user-provided ChatGPT material into a Knowledge Export Package. Explicit user and repository lifecycle commands follow in later releases; unscoped `ki uninstall` will never be valid. Until the seed is released, the source-owned operations below are the current interface. See the [CLI guide](command-line-interface.md).

Start with a dry run from the repository root. Use the path matching the runtime where you installed the harness:

```bash
bun ~/.claude/skills/ki-bootstrap/scripts/clean.ts . --dry-run
```

```bash
bun ~/.agents/skills/ki-bootstrap/scripts/clean.ts . --dry-run
```

Review the reported paths, then rerun the same command without `--dry-run` to remove them. CLEAN removes only an intact manifest-owned `.ki/` tree and unchanged generated runtime skill copies. It is repository-scoped cleanup, not an uninstall: it preserves `.ki-config.toml`, `.gitignore`, agents, `.ki/self/skill/`, its runtime projection links, altered payloads, unfamiliar files, and every user-level KI installation. Unsafe or changed metadata causes it to stop rather than guess. Run bootstrap again afterwards to reconstruct the governed footprint.

If `ki-bootstrap` is not installed for either runtime, use the same `scripts/clean.ts` path from a local harness checkout instead. Do not manually delete `.ki/` or `ki-*` directories to work around a CLEAN refusal; inspect and resolve the preserved state first.

### Uninstall one scope deliberately

UNINSTALL ends Knowledge Islands adoption at one explicit scope; it is not a stronger form of CLEAN.

```bash
# Repository only: remove proven generated state and a sole-purpose KI declaration.
bun ~/.claude/skills/ki-bootstrap/scripts/repo-uninstall.ts . --dry-run

# User only: remove integrity-proven global KI skills and the dedicated KI hook namespace.
bun ~/.claude/skills/ki-bootstrap/scripts/user-uninstall.ts --dry-run
```

Use the equivalent `~/.agents/skills/ki-bootstrap/` path when `ki-bootstrap` is installed for Codex only. Review the dry-run output before rerunning without `--dry-run`. Repository UNINSTALL never touches user state; user UNINSTALL preserves runtime settings, other skills, and other hook namespaces. Both refuse altered, linked, partial, unfamiliar, or concurrently changed managed material rather than guessing.

## Diagnose one lifecycle scope

DOCTOR is a read-only, source-owned diagnosis command. It requires an explicit `repo` or `user` scope and changes neither the selected scope nor the other one.

```bash
# Repository diagnosis from the repository root.
bun ~/.claude/skills/ki-bootstrap/scripts/doctor.ts repo .

# A machine-readable repository report.
bun ~/.claude/skills/ki-bootstrap/scripts/doctor.ts repo . --format json

# User-managed KI skills and hook namespace only.
bun ~/.claude/skills/ki-bootstrap/scripts/doctor.ts user
```

Use the equivalent `~/.agents/skills/ki-bootstrap/` path when `ki-bootstrap` is installed for Codex only. The report has four statuses: `healthy`, `absent`, `recoverable`, and `unsafe`. Healthy and absent reports exit `0`; recoverable and unsafe reports exit `1`; invalid invocation exits `2`. A recoverable report names one next action, but DOCTOR never performs it. An unsafe report requires manual reconciliation rather than guessing.

When no global installation is available, run the same `scripts/doctor.ts` from a local harness checkout. The checkout also provides the zero-install-shaped repository launcher for a temporary-source diagnostic:

```bash
sh "$KI_HARNESS/skills/keystone/ki-bootstrap/scripts/repo-operation.sh" doctor . --format json
```

This launcher downloads temporary source and creates no file in the target repository. The public Website route for that launcher is still pending, so do not substitute an unannounced `curl | sh` URL.
