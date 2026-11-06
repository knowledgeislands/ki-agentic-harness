# SKILL-HARVEST intake

Replies to MSG-c6fa7c81, sent on 6 November 2026 at about 22:15 GMT to 41 live packages on sol. Each item gives what it is, where it lives now and the skill proposed to own it. Where each item lands follows HARNESS-SCOPE.

## ki-coordination

- Listening on Agora's call: wait on `~/.local/state/ki/agora/call/<work-id>`, remove it on read, re-arm with a period, and watch `call/` and `doorbell/` until the old path ends. Lives in the apps-agora.local README, under 'Agora's call'. From ki.prj.agora.
- Health tiers: ping at 50% and 75% of a listener's period, then every 5% until the listener is lost, with roll call and keep-alive as one. Lives in ki.prj.agora's HEALTH-TIERS and a `/tmp` script. From ki.prj.agora.
- A Claude Code listener is a background wait under the two-hour limit, re-armed at every wake. `listening_status: on` holds only while that wait runs. Lives in the `host-loop.sh` header and household-sol's LOOP-REARM. From personal.reg.household-sol.
- An unattended window's return timer must sit under the same limit, or be re-set. It died twice on 6 November. From personal.reg.household-sol.
- Watcher lifetime: the inbox watcher dies with its session and the runtime's background limit, so the standard's "no timed bound" is wrong. Arm it with the longest limit and re-arm at every wake. From ki.sop.main.
- Count only Inbound lines, so a work's own Outbound writes don't wake its watcher. From ki.sop.main.
- The watcher waits on Agora's `call/` and `doorbell/` paths, while the standards still say it fetches and that doorbells are deferred (AGORA-DOORBELL, AGORA-CALL-PATH). From ki.sop.main.
- ACK on taking: every Inbound line is ACKed in its sender's Inbound the moment it is taken, held lines included (ACK-ALWAYS). From ki.sop.main.
- Owner-query mirror: check a site's open-decision tags against `discussions.md`, excluding internal and completed queries. From hnr.prj.5g-emerge-p2ms3.
- Owner-requested query batches conflict with the never-batch interactive pass. Allow an explicit owner override that keeps the review and per-query answers (QUERY-NOD). From hnr.prj.5g-emerge-p2ms3.
- Store what Kris gives at once, with only its place a query (STORE-WHAT-I-GIVE, HNR-PRINCIPAL-KM-075). From hnr.sop.main.
- Topic material pasted into a State of play is stored and routed to its Project, bypassing the Inbox flow (DIRECT-TO-SOP). The boundary is named in ki-acquire. From hnr.sop.main.
- A private aside from Kris is never recorded: the one exception to storing what he gives. From hnr.sop.main.
- Temporary designs sit under a package's focus areas until they get a durable home, recorded in `work.md` (DESIGNS-STANDARD). Applies once proven. From personal.reg.inbox-terra.

## ki-git

- Settle: when two rigs change one repository, whoever went second brings their work in on top, then pushes. Lives in the apps-agora.local README, under 'Keeping level'. From ki.prj.agora.
- Committer hygiene in work packages: run the formatter before every commit, and keep subjects under 100 characters. Lives only in the hooks. From ki.prj.agora.
- Pull a shared checkout with `merge.autostash` and `rebase.autostash` off. Lives in household-sol's AGORA-READY. From personal.reg.household-sol.
- Before rebasing a shared checkout, list `origin/main..HEAD` and rebase only your own commits. Lives in household-sol's LEVEL-DOTFILES. From personal.reg.household-sol.
- A reply line to a dirty shared checkout is written, committed and pushed in one step, through a temporary worktree from `origin/main` (UNCOMMITTED-LINE). From ki.sop.main.
- A fresh worktree needs `bun install` before its commit hooks can run. From ki.sop.main.

## ki-delegation

- Shared checkouts: runs that share one checkout see each other's unfinished edits, so verify, build and install from a clean worktree of `origin/main`. Lives only in run reports, with ki-git also proposed. From ki.prj.agora.
- Dual-model review, then merge: two independent read-only reviews on different models, then one run merges in small gated commits. Lives in ki.prj.agora's CODE-REVIEW. From ki.prj.agora.
- Word-chain test for every new agent link. Lives in apps-agora.local `docs/spec/agent-interaction.md`. From ki.prj.agora.
- Doer contact contract, CD-54 and ILL-24: DELEGATE ids, ACK within 30 s, escalate after 3 minutes, WINDOW-OPEN and WINDOW-CLOSE. Lives in ki.prj.agora `identity/*/messages.md`. Proposed owner ki-delegation, or a new doer skill. From ki.prj.agora.
- Waiter bound conflict: the Wait verb bounds the waiter at five minutes, while ki-coordination gives it no bound. Align the two. From ki.sop.main.
- A brief whose body needs a fetch, pull or push must launch with `--allow fetch` or cite a push rule, because the footer's Rules beat the body. From ki.sop.main.
- Scoped read and sign-in grants are missing: live-page and Grafana or Cognito checks hit the network ban, and fetch grants Git only. From hnr.prj.5g-emerge-p2ms3.
- Provider-limit recovery: a reconciled relaunch on another provider when Claude is exhausted (APPS-SITE). From hnr.prj.5g-emerge-p2ms3.
- Kris's narrow exception allowing demo credentials on the Access-protected site only needs reconciling with the ban on credentials in tracked files. Never infer permission from Access alone. From hnr.prj.5g-emerge-p2ms3.
- No rules footer covers an attended, Kris-approved provider change, such as GitHub settings or Cloudflare Workers, DNS or Access. Proposed: a provider footer, like the release footer, naming each call (PROVIDER-GO). From hnr.sop.main.

## ki-work-package

- Publishing into a busy checkout: commit from a detached worktree off `origin/main`, push `HEAD:main`, then remove the worktree. Written nowhere, with ki-git also proposed. From personal.reg.household-sol.
- Never drop Inbound lines: a rewrite carries every line it doesn't dispose of. The rewrite in `73a0774a` lost 13 lines. From ki.sop.main.
- Edit a message queue line by line: match the whole line, never the id alone, and write `None.` only when the section is otherwise empty (PRUNE-BY-LINE). From personal.reg.household-terra.

## Role catalogue and personal skills

- Skill tending, from Kris at 22:00 GMT: using a skill includes folding what you learn back into it in due course, without telling the guildmaster each time. Proposed home: a personal skill plus a role-catalogue line. From ki.prj.agora.
- Register harness hooks from the installed payload path `~/.local/share/ki/harnesses/knowledgeislands/ki-agentic-harness/hooks/`, never a checkout or an old copy. On terra, three hooks still run from a 16 July copy, which is with Kris as Q1. Owner: ki-bootstrap, or ki-repo-harness. From personal.reg.household-terra.
- D12, the Dodecakrisis sorting engine, and mailbox pruning by D12 rules: a new skill, `ki-dodecakrisis`. Lives in the inbox `d12/` folder and in ki-principal `Pillars/knowledge-tending/d12-dodecakrisis.md`. From personal.reg.inbox-terra.
- The knowledge-capture funnel (deposit, capture, curate, dispatch) and staging-KB zones: a new knowledge-graph skill. Lives in the inbox's curated knowledge and capture design. From personal.reg.inbox-terra.
- Evidential nodes: legal or signed material is kept whole and verbatim, never split. A future legal evidential skill, with the standard in legal-principal. From personal.reg.inbox-terra.
- Archify showcase layout: route through one hub node, fit within 1440×900, look at it in light and dark, and set `ARCHIFY_UPDATE_CHECK_DISABLED=1` for unattended runs. Owner: ki-diagrams. From hnr.prj.5g-emerge-phase3.
- Cloudflare Access public paths each get their own, more specific self-hosted application, and new-Worker dashboard defaults must be replaced by the house pair. Owner: ki-repo-website-cloudflare. From hnr.prj.5g-emerge-phase3.
- Publication-boundary build gate: a private site's smoke suite fails on any email address or finance marker in its output. Owner: ki-repo-website-content. From hnr.prj.5g-emerge-phase3.
- Agent access for a static site: `llms.txt`, a versioned data index and read-only WebMCP tools. No skill covers it. Owner: ki-repo-website-content. From hnr.prj.5g-emerge-phase3.
- Incremental document-library sync: a manifest-first check, changed files only, one previous copy kept, allowlisted columns only. Owner: ki-acquire. From hnr.prj.5g-emerge-phase3.
- Image slots: every site image gets a fixed slot (path, pixel size, transparency) holding a plain placeholder until art exists, with a slot guide and a reusable image prompt, so files land under slot names with no code change; generated images carry no text. Owner: ki-repo-website-content. From hnr.prj.site-robots.
- No version labels: V1, V2 and the like never appear in code, file names, routes, alt text, copy or record titles; source-store file names are exempt. Owner: ki-engineering. From hnr.prj.site-robots.
- Confirm the deploy: a site agent confirms its Cloudflare Workers Build succeeded after pushing `main`, through read-only GitHub check-run and status calls named in its brief. Owner: ki-repo-website-cloudflare, grant wording in ki-delegation. From hnr.prj.site-robots.
- Prove locally, feed upstream: a cross-site improvement may be proven in one site, then moved into the shared Stoa library and the local copy dropped; a vendored copy is never edited locally, and the build fails on a local edit. Owner: ki-repo-website-content for Stoa, ki-engineering for the general vendoring rule. From hnr.prj.site-robots.
- Work-in-progress limit: a Project package pulls at most three roadmap records at a time and leaves the rest on the roadmap; ki-coordination caps only active Projects. Owner: ki-coordination. From hnr.prj.site-robots.
- Motion and scale: pointer parallax moves only the far and middle layers, keeps the foreground and standing figures fixed together, and respects reduced motion; characters keep a consistent scale. Owner: ki-design-system. From hnr.prj.site-robots.

## Wrongly held

- The Agora specification says Agora never edits knowledge, but the KIV it owns can defer an action card. This is KIV-WRITE, open with Kris. From ki.prj.agora.
- Acting for idle work: ki-coordination says a State of play launches nothing for an idle package, but HNR's SOP-DRIVES lets it. Kris's 5 November words were permissive. To reconcile with Kris. From hnr.sop.main.
