# AUDIT — inspect repository Codex sessions

## Preconditions

- The target resolves to one physical Git repository.
- The installed `codex` command supports app-server with the documented protocol.
- The caller understands that output is a review artifact, not approval to delete.

## Procedure

From the skill root, run:

```bash
bun scripts/app-server.ts inventory --repo /absolute/path/to/repository
```

Capture standard output as the review artifact only when the user requests a durable file. Standard error carries diagnostics and is not part of the artifact.

Review the physical repository path, installed version, active and archived roots, and every descendant ID. The artifact intentionally contains no preview, name, turns, items, or transcript content.

Stop after presenting the artifact. AUDIT never invokes `thread/delete`.
