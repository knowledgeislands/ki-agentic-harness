---
code: RTP
---

# Runtime portability roadmap

## Blocking

Actively broken, or blocking the `Next` horizon: takes priority over everything else and must clear before `Next` work proceeds. Empty means nothing is on fire.

### Detect vendor-specific assumptions in portable skill contracts

Add a `ki-skills` audit criterion that detects runtime- or vendor-specific language in contracts intended to be portable, including unqualified references to Claude, Codex, their home directories, and their runtime-only capabilities. Keep explicit exceptions for skills and passages whose declared responsibility is runtime binding, for attributed source material, and for examples that intentionally compare runtimes. Phrase shared standards and guidance in agent- and runtime-neutral terms, then make each existing finding conform rather than retaining an allowlist for accidental historical wording.

## Next

Scoped and ready to start — the immediate queue, picked up before anything in **Soon** or **Future**.

## Soon

Understood and roughly scoped but not yet started — worth doing once the **Next** queue clears, ahead of anything still speculative.

## Waiting for

Worth doing, but presently blocked on an external dependency or decision. Revisit when its named condition changes rather than treating it as dormant local work.

### Make KI MCP servers reachable from Cowork

Choose between sandbox-bundled servers and authenticated remote endpoints for host-local KI MCP servers in Cowork, then prove one supported path. Resolve the `ki-plugins` license and visibility conflict as part of that decision. Unblock when the owner selects the sandbox-versus-endpoint security posture and settles the plugin's license and visibility. Web remains a separate, manual-connector concern.

## Future

Speculative or not yet scoped — items marked _(candidate)_ need a scoping pass (or a decision to drop them) before they're actionable.

### Route multi-machine harness state through durable homes

Produce a finite routing table or decision record assigning each state class to repository tracking, knowledge-base content, synchronized personal configuration, or intentionally disposable machine-local storage. Cover project memory, runtime settings and hooks, learned patterns, and caches; create follow-up migrations only for state proven to be in the wrong home.
