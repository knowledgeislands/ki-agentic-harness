# Onboarding a repo to Knowledge Islands governance

How to bring a repository under Knowledge Islands governance so it **governs itself** — running `./.ki-meta/bin/ki-audit` with **zero skills installed** and **no `package.json` required**. The one onboarding action is **INIT**: building the repo's `.ki-meta/`. Re-running it is also how a repo stays current — there is no separate migration mode. This guide is the operating manual for the bootstrap chain (ADR-KI-HARNESS-006); its fenced `bash` blocks are executable and are exercised by the harness's own test suite, so they cannot drift from what actually works.

## The remote-run transport — the primary path

The canonical, zero-install form is the `curl | sh` installer idiom — **`cd` into the repo you want to govern**, then run:

```bash
curl -fsSL https://raw.githubusercontent.com/knowledgeislands/ki-agentic-harness/main/skills/keystone/ki-bootstrap/scripts/bootstrap.sh | sh
```

It bootstraps the current directory from the harness's `main`. The entry point is POSIX `sh` and assumes only curl and tar: it fetches the harness source tarball (GitHub's codeload endpoint generates it on demand — no publish step), extracts it to a temp dir, and runs the chain engine from that tree. Bun is required as the mechanical layer's runtime — the engine and every vendored checker are TypeScript — so if it is missing the script fails fast with the install instruction rather than installing a runtime silently.

There is nothing else to pass in the common case: the target is the current directory and the ref is `main`, which is what you want — re-running keeps the repo current with `main` (see [Keeping current](#keeping-current)). Two escape hatches exist for the rare case that needs them: a positional target other than the cwd and a pinned ref, `… | sh -s -- <target> --ref <sha>`; or, where bun is already installed, `bunx github:knowledgeislands/ki-agentic-harness#<sha> <target> --ref <sha>` (pin a sha — bunx caches floating git refs).

### Across a fleet, with `mgit -B`

The one-liner above is per-repo. To bootstrap — or re-sync — every repo in a fleet at once, run it through [`mgit`](https://github.com/knowledgeislands/tools-mgit) in bare mode from the fleet's container directory (each checkout registered in its `.mgitconfig`):

```bash
mgit -B sh -c 'curl -fsSL https://raw.githubusercontent.com/knowledgeislands/ki-agentic-harness/main/skills/keystone/ki-bootstrap/scripts/bootstrap.sh | sh'
```

`-B`/`--bare` execs the given argv directly in each registered repo (`cd "$repo" && "$@"`) instead of prefixing it with `git` — there is no shell in between, so a bare `curl … | sh` won't work as argv (the pipe has nowhere to run); wrap it in `sh -c '...'` as above. The same escape hatches apply per repo, wrapped the same way — e.g. `mgit -B sh -c 'curl -fsSL … | sh -s -- . --ref <sha>'` to pin every repo to one ref.

## What bootstrap does

Bootstrap's one job is to build `.ki-meta/`. For every skill in the resolved set — every `[ki-<skill>]` table the target declares in its `.ki-config.toml` (including a bare `[ki-authoring]`, which every repo must declare itself — there is no injected baseline, per `ADR-KI-HARNESS-007`), plus their `implies:` closure — it:

1. **vendors** the skill's declared mechanical unit (its `vendors:` frontmatter — a checker copied verbatim, or a generated command-wrapper) into `.ki-meta/skills/<skill>/<verb>.ts`, and renders the skill's **HELP snapshot** to `.ki-meta/skills/<skill>/help.md`;
2. **writes** the four `package.json`-free entry points — `.ki-meta/bin/{ki-audit, ki-conform, ki-init, ki-help}` over a `.ki-meta/bin/aggregate.ts` runner that discovers the vendored copies and fans out over them — and **stamps** the vendoring manifest (`.ki-meta/manifest.json`: the harness ref plus a hash per vendored file).

It **never touches `package.json`.** A `.ki-meta/` is dot-prefixed and generated-not-authored, so it stays off the repo's own `scripts/`, and (being idempotent) re-running the bootstrap at the same ref reproduces byte-identical output. The `ki:*` convenience keys that a code repo may want — `bun run ki:audit` aliasing `./.ki-meta/bin/ki-audit` — are wired later by `ki-engineering` when it comes online for that repo, as sugar over these same bins, never by bootstrap.

## Optional global Claude hook payload

Repository bootstrap does not install or configure user-global hooks. If the local user environment needs the harness's Claude Code Plan Mode lifecycle and stale Git-lock payload, install it once with the separate remote entry point:

```bash
curl -fsSL https://raw.githubusercontent.com/knowledgeislands/ki-agentic-harness/main/skills/keystone/ki-bootstrap/scripts/install-hooks.sh | sh
```

It downloads a disposable source, copies the hook files as manifest-verified regular files below `~/.claude/hooks/knowledgeislands/ki-agentic-harness/`, and records the active content-addressed payload. It never creates hook symlinks and never reads or writes `~/.claude/settings.json`. A compliant user-environment manager — currently chezmoi through `ki-dotfiles-chezmoi` — separately checks that payload and owns the matching Claude settings registrations. Do not add this command to a per-repository or `mgit` bootstrap run.

## The four bins — day-to-day, once governed

After INIT the repo governs itself with no skills installed and no `package.json`:

| Command                            | Mode    | What it does                                                                           |
| ---------------------------------- | ------- | -------------------------------------------------------------------------------------- |
| `./.ki-meta/bin/ki-audit`          | AUDIT   | Report drift across every governed skill, on the severity ladder. Read-only.           |
| `./.ki-meta/bin/ki-conform`        | CONFORM | Apply the mechanical fixes across the vendored set.                                    |
| `./.ki-meta/bin/ki-help [skill]`   | HELP    | Print a skill's HELP block from its vendored snapshot — **pure bash, no bun needed**.  |
| `./.ki-meta/bin/ki-init [--ref R]` | INIT    | Re-sync: re-run the chain at the ref in the manifest (`--ref` to move to a newer one). |

## Running it locally

A local checkout of the harness runs the identical chain. You need [Bun](https://bun.sh) and the harness; the examples reference it through `KI_HARNESS`:

```bash
export KI_HARNESS="${KI_HARNESS:-$(pwd)}"
```

A new repo needs a `.ki-config.toml` declaring `[ki-repo]` and a bare `[ki-authoring]` — every repo declares both itself; nothing is injected. Bootstrap it:

```bash
bun "$KI_HARNESS/skills/keystone/ki-bootstrap/scripts/bootstrap.ts" "$TARGET"
```

Then confirm it self-governs — the vendored aggregate invokes each skill's checker in sequence, with nothing installed in `.claude/skills/`:

```bash
cd "$TARGET" && ./.ki-meta/bin/ki-audit
```

A single skill's INIT is reachable the same way through its own `scripts/init.ts`, which seeds that skill (plus its `implies:` closure) into the target — the mechanics and the vendored result are identical to the full chain.

## Keeping current

Re-running the bootstrap **is** the update path. When a standard's REFRESH changes a checker, the repair on a governed target is an idempotent re-run of the chain — `./.ki-meta/bin/ki-init` (or the remote one-liner) — which re-vendors at the recorded ref and re-stamps the manifest.

Drift in the vendored copies is caught mechanically: the audit checks the copies against the manifest — offline integrity against the per-file hashes, staleness against the recorded ref when the source is reachable — and conform only prints the advisory ("stale — re-run INIT"), never re-syncs (in a bootstrapped-only repo the local copies are the only source present, so re-syncing from them would be circular). The repair is always the `ki-init` re-run.
