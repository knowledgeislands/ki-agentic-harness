# Onboarding a repo to Knowledge Islands governance

How to bring a repository under Knowledge Islands governance so it **governs itself** — running `./.ki-meta/bin/ki-audit` with **zero skills installed** and **no `package.json` required**. The one onboarding action is **INIT**: building the repo's `.ki-meta/`. Re-running it is also how a repo stays current — there is no separate migration mode. This guide is the operating manual for the bootstrap chain (ADR-KI-HARNESS-007); its fenced `bash` blocks are executable and are exercised by the harness's own test suite, so they cannot drift from what actually works.

## The remote-run transport — the primary path

The canonical, zero-install form runs the chain straight from the harness on GitHub — no clone, no global install — pinned to a ref (default `main`), in the usual `curl | bash` installer idiom:

```text
curl -fsSL https://raw.githubusercontent.com/knowledgeislands/ki-agentic-harness/main/skills/ki-bootstrap/scripts/bootstrap.sh | bash -s -- <target> [--ref <ref>]
```

The entry point assumes only bash, curl, and tar: it fetches the harness source tarball at the ref (GitHub's codeload endpoint generates it on demand — no publish step), extracts it to a temp dir, and runs the chain engine from that tree. Bun is required as the mechanical layer's runtime — the engine and every vendored checker are TypeScript — so if it is missing the script fails fast with the install instruction rather than installing a runtime silently.

Where bun is already installed, the `bunx` idiom runs the engine directly — the harness `package.json` declares it as the package `bin`:

```text
bunx github:knowledgeislands/ki-agentic-harness#<ref> <target> --ref <ref>
```

Pin a sha (or tag) rather than a branch — bunx caches floating git refs, so `#main` can serve a stale checkout, and a `.git`-less extract needs the explicit `--ref` to stamp the manifest correctly.

## What bootstrap does

Bootstrap's one job is to build `.ki-meta/`. For every skill in the resolved set — the baseline (`ki-repo`, `ki-authoring`), plus every `[ki-<skill>]` table the target declares in its `.ki-config.toml`, plus their `implies:` closure — it:

1. **vendors** the skill's declared mechanical unit (its `vendors:` frontmatter — a checker copied verbatim, or a generated command-wrapper) into `.ki-meta/skills/<skill>/<verb>.ts`, and renders the skill's **HELP snapshot** to `.ki-meta/skills/<skill>/help.md`;
2. **writes** the four `package.json`-free entry points — `.ki-meta/bin/{ki-audit, ki-conform, ki-init, ki-help}` over a `.ki-meta/bin/aggregate.ts` runner that discovers the vendored copies and fans out over them — and **stamps** the vendoring manifest (`.ki-meta/manifest.json`: the harness ref plus a hash per vendored file).

It **never touches `package.json`.** A `.ki-meta/` is dot-prefixed and generated-not-authored, so it stays off the repo's own `scripts/`, and (being idempotent) re-running the bootstrap at the same ref reproduces byte-identical output. The `ki:*` convenience keys that a code repo may want — `bun run ki:audit` aliasing `./.ki-meta/bin/ki-audit` — are wired later by `ki-engineering` when it comes online for that repo, as sugar over these same bins, never by bootstrap.

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

A new repo needs only a `.ki-config.toml` declaring at least `[ki-repo]` (the `ki-authoring` baseline is added automatically). Bootstrap it:

```bash
bun "$KI_HARNESS/skills/ki-bootstrap/scripts/bootstrap.ts" "$TARGET"
```

Then confirm it self-governs — the vendored aggregate invokes each skill's checker in sequence, with nothing installed in `.claude/skills/`:

```bash
cd "$TARGET" && ./.ki-meta/bin/ki-audit
```

A single skill's INIT is reachable the same way through its own `scripts/init.ts`, which seeds that skill (plus its `implies:` closure) into the target — the mechanics and the vendored result are identical to the full chain.

## Keeping current

Re-running the bootstrap **is** the update path. When a standard's REFRESH changes a checker, the repair on a governed target is an idempotent re-run of the chain — `./.ki-meta/bin/ki-init` (or the remote one-liner) — which re-vendors at the recorded ref and re-stamps the manifest.

Drift in the vendored copies is caught mechanically: the audit checks the copies against the manifest — offline integrity against the per-file hashes, staleness against the recorded ref when the source is reachable — and conform only prints the advisory ("stale — re-run INIT"), never re-syncs (in a bootstrapped-only repo the local copies are the only source present, so re-syncing from them would be circular). The repair is always the `ki-init` re-run.
