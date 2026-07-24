# Getting Started

Knowledge Islands is moving to native `ki`-hosted repository governance. The approved model is a verified XDG-managed set of compatible harnesses, with explicit skill activation and repository maintenance through `ki`.

Those native skill and repository commands are planned, not yet released. Until they appear in `ki help` and completion, use this guide to understand the destination and follow [the CLI guide](command-line-interface.md) for released command availability.

## Before you begin

The public native `ki` command contract will not depend on a repository-local Bun toolchain. [Bun](https://bun.sh) remains necessary when developing the harness itself or running its source checks.

The [recommended tools](recommended-tools.md) guide covers optional machine-level tools: chezmoi manages user configuration, headroom-ai helps manage context, and mcporter provides a local MCP tool surface.

## 1. Install `ki`

Install the released `ki` executable in a user command directory, then ensure that directory is on `PATH`.

The installer, its selected version, and recovery guidance are described in [the CLI installation reference](command-line-interface.md#installation).

The current seed release exposes its general commands and acquisition import only. It does not yet expose skill installation, activation, native repository maintenance, or migration.

## 2. Install a harness and activate skills

When the native skill surface is released, install each required verified harness, then activate only the skills needed in the chosen scope:

```text
ki harness install <harness-id>
ki user skill add <harness-id>:<skill-name>
ki repo skill add <harness-id>:<skill-name>
```

- `ki harness install` will acquire or atomically replace one verified harness in the XDG-managed harness set; it will not activate every capability or change a repository.
- `ki user skill add` will create managed discovery links for one installed skill in the selected user runtime.
- `ki repo skill add` will declare one installed skill in the selected repository's `.ki-config.toml` and create only its managed repository-runtime links.

`ki` uses the standard XDG locations: data under `$XDG_DATA_HOME/ki`, configuration under `$XDG_CONFIG_HOME/ki`, disposable downloads under `$XDG_CACHE_HOME/ki`, and mutable state under `$XDG_STATE_HOME/ki`. It does not use a separate KI home variable.

## 3. Govern a repository

Once the native harness and repository operations are released, a repository declares its coverage in `.ki-config.toml` and uses the selected installed skills through:

```text
ki repo audit
ki repo conform
```

`ki repo audit` will read the physical repository's declared skill roots and run their registered native audit operations. `ki repo conform` will apply their safe mechanical changes through the same resolution and reporting model.

Neither command will execute a repository's `.ki/bin` wrappers, copied `govern.ts` scripts, a nearby harness checkout, or another fallback executor.

For the complete native flow, including existing-repository migration and CI, see [the onboarding guide](onboarding.md).

## Existing vendored repositories

Existing `.ki/bootstrap/`, `.ki/bin/`, and manifest material is a future migration source, not the executor for native governance.

Keep that legacy state in place until the explicit native migration operation is released. Do not recreate it, manually delete it, or treat it as a compatibility path for native commands.

## Start using skills

Once a required skill is activated in the relevant runtime scope, describe what you need in plain language or use the runtime's skill invocation mechanism.

[Use skills](using-skills.md) explains both approaches.

For the current skill model, activation boundaries, and future native migration, continue to [the onboarding guide](onboarding.md).
