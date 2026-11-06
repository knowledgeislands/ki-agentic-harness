# [KI > Guilds](/Users/krisbrown/kis/knowledge-islands/ki-agentic-harness/+/_WORK/ki.reg.guilds/work.md) › footer-hook

**🤖 → 👤 Handoff to supervisor · Run report at 20:53 GMT · last mark none**

---

## Done

- `8ec15e63` `feat(hooks): add coordinator footer Stop hook and declare hook payload` is on `main` and on GitHub, in [ki-agentic-harness](/Users/krisbrown/kis/knowledge-islands/ki-agentic-harness).
- **The hook:** [`hooks/coordinator-footer.sh`](/Users/krisbrown/kis/knowledge-islands/ki-agentic-harness/hooks/coordinator-footer.sh) runs when Claude Code finishes a turn (the `Stop` event). If a coordinating reply is missing part of its footer, it blocks the turn from ending and says which parts are missing. The session then gives the whole reply again with them, because Orca shows only the last text.
- **How it decides:** the hook takes the reply text Claude Code hands it (`last_assistant_message`); on older versions it reads the transcript's last reply instead.
  - **Summary:** a reply with `## Summary since` or a `· Summary at` form line needs the long form: the art (unless the owner's last prompt said `no art`), the `###` state heading, the counts line, the 🗺️ roadmap line where the checkout has `docs/roadmap/`, the 📦 package line, and the `🧵` thread line last.
  - **Short form:** a re-bootstrap report, a hold report, or a reply that already starts a banner needs the state heading, the counts line (none under a Finished heading) and the thread line last.
  - **Bare reply after a mark or state word:** a reply with none of those markers needs the short form only when all three of these hold:
    - the owner's last prompt was a mark or state word, such as `mark`, `summary`, `pause`, `with me`, `status` or `/ki-coordination drain`;
    - the checkout declares `[skills.ki-coordination]`;
    - the session has already ended an earlier reply with a `🧵` thread line. This is the cheapest reliable sign that the session holds a work package.
  - **Quiet cases:** the hook stays quiet for plain answers, a run's wake-up lines, conversational sessions, launched agents and code-fenced examples.
  - **Safety:** it never blocks twice in a row (`stop_hook_active`), and it lets the turn end if its input is bad or missing, `jq` is absent, or the transcript can't be read. It makes no network call and reads at most the transcript's last 8 MiB. On a 46 MB transcript it decided in about 0.1 s.
- **Payload:** `ki` already ships the whole `hooks/` folder. The hooks README now has a payload table listing all five hooks, `coordinator-reminder.sh` included, with each one's runtime, event, matcher and timeout. A user-environment manager registers each from the installed path, never from a checkout. `hooks/payload.test.ts` keeps the table in step with the files. The spec gains HARN-014 for the hook, and HARN-012 now says the reminder registers from the installed payload. The ki-coordination standard names the footer check under Generated surfaces, its SKILL.md mentions it, and its sources record the review.
- **Registration snippet the dotfiles need** (Claude Code only, because Codex's `Stop` event is unverified):

  ```json
  { "hooks": { "Stop": [ { "matcher": "*", "hooks": [ { "type": "command", "command": "$HOME/.local/share/ki/harnesses/knowledgeislands/ki-agentic-harness/hooks/coordinator-footer.sh", "timeout": 10 } ] } ] } }
  ```

  The reminder should move to the same installed path: `$HOME/.local/share/ki/harnesses/knowledgeislands/ki-agentic-harness/hooks/coordinator-reminder.sh` at `UserPromptSubmit` and at `SessionStart` with matcher `compact`, timeout 5. It is currently registered from the primary checkout.
- **Reinstall:** no `ki` reinstall is needed on sol. Its installed harness is a local-development link to the primary checkout, so the hook is already there. On a Mac running the verified archive, run `ki harness outdated`, then `ki update`, which refreshes installed harnesses. If `outdated` shows no newer release, the hook arrives with the next harness release; `ki harness reinstall` is only for an inactive harness. I could only check sol.
- **Checks:**
  - **`bun run test`:** 1597 pass, 0 fail, including 34 new hook tests and 6 payload tests.
  - **`bunx tsc --noEmit`:** clean.
  - **`ki dev skill generate ki-coordination`:** in sync.
  - **Audits** (isolated home, run on the rebased result):
    - **`ki-coordination` and `ki-skills`:** pass.
    - **`ki-repo-harness`:** one failure that predates this run. The catalogue check (CAP-2) fails because another session changed the ki-acquire-granola description without regenerating `skills/README.md`.
- **Limitation:** the isolated-home recipe normally runs `ki bootstrap`, which downloads the harness archive. I avoided that network call by setting up the isolated home offline: a local-development link to the worktree, then `ki bootstrap --refresh`, `ki registry add` and `ki repo repair`.

## In Progress

Nothing is running. The worktree is left for `ki agent close`.

Outstanding - no action requested now:

- **Unfinished catalogue update:** `skills/README.md` needs `ki repo conform --skill ki-repo-harness` after the ki-acquire-granola description change. That is a one-line regeneration for whichever session owns that change.
- **Hook can't recognise questions:** it cannot tell that a free-form question such as "what is waiting on me?" asks where the work stands. That still needs the coordinator's own judgement, and the standard now says so.

## Queries

### HOOK-BINDING - Register harness hooks from where `ki` installs them

**Context:** Kris confirmed on 6 November 2026 that hooks ship in the payload `ki` installs and that the dotfiles only register them. On sol, the dotfiles register only the coordinator reminder, and they point it at the primary checkout. The dotfiles' other hook binding validates a payload at `~/.claude/hooks/knowledgeislands/ki-agentic-harness/` whose manifest must name exactly three hooks. Nothing on this Mac writes that payload, so the plan hooks and the Git-lock guard are not registered either. As things stand, the new footer hook would not fire until the dotfiles register it. The dotfiles belong to `personal.reg.household-terra`.

**Query:** Should `personal.reg.household-terra` register all five harness hooks straight from `ki`'s installed harness path, using the README's payload table, instead of the three-hook manifest layout?

**Options:**

a) (recommended, confidence medium - it matches the payload rule Kris confirmed today and needs no new installer, but the manifest layout's integrity checks would need a replacement in the dotfiles) Send `personal.reg.household-terra` a line asking it to register the five hooks from the installed path, using the README table and the snippet above, and to retire the manifest binding.

b) Keep the manifest binding and ask for an installer that writes `~/.claude/hooks/...` with all five hooks, registering only the footer hook directly in the meantime.

### 🤖 → 👤 Handoff to supervisor · since 20:53 GMT

👤 1 with you

- [with you] HOOK-BINDING · owner · since 20:53

🧵 ki.reg.guilds
