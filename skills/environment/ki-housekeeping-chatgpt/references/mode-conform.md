# CONFORM — delete reviewed Codex sessions

## Preconditions

- The user has reviewed a fresh AUDIT artifact.
- The user explicitly names every root thread to delete.
- The selected repository, artifact, and installed Codex runtime remain unchanged.

## Procedure

From the skill root, run one command with the selected root IDs:

```bash
bun scripts/app-server.ts delete \
  --repo /absolute/path/to/repository \
  --artifact /absolute/path/to/review.json \
  --thread THREAD_ID \
  --confirm PERMANENTLY_DELETE_SELECTED_CODEX_THREADS
```

Repeat `--thread THREAD_ID` for additional reviewed roots. Never select a descendant separately; deleting its reviewed root already removes it.

The adapter validates the entire selection before the first deletion. If any identity, version, protocol, archive state, timestamp, or descendant set differs, stop and run AUDIT again.

After success, re-run AUDIT and confirm the selected roots and descendants are absent. Report partial execution explicitly if app-server fails after any successful delete; do not retry without a new artifact and review.
