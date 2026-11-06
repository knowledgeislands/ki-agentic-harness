# SKILL-HARVEST intake

Replies to MSG-c6fa7c81, sent on 6 November 2026 at about 22:15 GMT to 41 live packages on sol. Each item gives what it is, where it lives now and the skill proposed to own it. Where each item lands follows HARNESS-SCOPE.

## ki-coordination

- Listening on Agora's call: wait on `~/.local/state/ki/agora/call/<work-id>`, remove it on read, re-arm with a period, and watch `call/` and `doorbell/` until the old path ends. Lives in the apps-agora.local README, under 'Agora's call'. From ki.prj.agora.
- Health tiers: ping at 50% and 75% of a listener's period, then every 5% until the listener is lost, with roll call and keep-alive as one. Lives in ki.prj.agora's HEALTH-TIERS and a `/tmp` script. From ki.prj.agora.
- A Claude Code listener is a background wait under the two-hour limit, re-armed at every wake. `listening_status: on` holds only while that wait runs. Lives in the `host-loop.sh` header and household-sol's LOOP-REARM. From personal.reg.household-sol.
- An unattended window's return timer must sit under the same limit, or be re-set. It died twice on 6 November. From personal.reg.household-sol.

## ki-git

- Settle: when two rigs change one repository, whoever went second brings their work in on top, then pushes. Lives in the apps-agora.local README, under 'Keeping level'. From ki.prj.agora.
- Committer hygiene in work packages: run the formatter before every commit, and keep subjects under 100 characters. Lives only in the hooks. From ki.prj.agora.
- Pull a shared checkout with `merge.autostash` and `rebase.autostash` off. Lives in household-sol's AGORA-READY. From personal.reg.household-sol.
- Before rebasing a shared checkout, list `origin/main..HEAD` and rebase only your own commits. Lives in household-sol's LEVEL-DOTFILES. From personal.reg.household-sol.

## ki-delegation

- Shared checkouts: runs that share one checkout see each other's unfinished edits, so verify, build and install from a clean worktree of `origin/main`. Lives only in run reports, with ki-git also proposed. From ki.prj.agora.
- Dual-model review, then merge: two independent read-only reviews on different models, then one run merges in small gated commits. Lives in ki.prj.agora's CODE-REVIEW. From ki.prj.agora.
- Word-chain test for every new agent link. Lives in apps-agora.local `docs/spec/agent-interaction.md`. From ki.prj.agora.
- Doer contact contract, CD-54 and ILL-24: DELEGATE ids, ACK within 30 s, escalate after 3 minutes, WINDOW-OPEN and WINDOW-CLOSE. Lives in ki.prj.agora `identity/*/messages.md`. Proposed owner ki-delegation, or a new doer skill. From ki.prj.agora.

## ki-work-package

- Publishing into a busy checkout: commit from a detached worktree off `origin/main`, push `HEAD:main`, then remove the worktree. Written nowhere, with ki-git also proposed. From personal.reg.household-sol.

## Role catalogue and personal skills

- Skill tending, from Kris at 22:00 GMT: using a skill includes folding what you learn back into it in due course, without telling the guildmaster each time. Proposed home: a personal skill plus a role-catalogue line. From ki.prj.agora.

## Wrongly held

- The Agora specification says Agora never edits knowledge, but the KIV it owns can defer an action card. This is KIV-WRITE, open with Kris. From ki.prj.agora.
