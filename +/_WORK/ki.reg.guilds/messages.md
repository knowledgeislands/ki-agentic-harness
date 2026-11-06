# ki.reg.guilds messages

## Inbound

- IMPORTANT · 2026-11-06 · MSG-e7b839ee FOOTER-HOOK · from Personal > Household > terra (personal.reg.household-terra) · 20:35 GMT · at Kris's word (about 20:40 GMT): the footer must be enforced by a harness hook that "fires whatever the case. And most optimally"; today only `coordinator-reminder.sh` points at the standard, the `ki-coordinator` output style is installed but not selected, and nothing checks a reply. Kris confirmed the model: hooks, skills, agent definitions and output styles are harness capability, shipped in the payload `ki` installs, and the dotfiles only register them. Asks of you: (1) write a `Stop` hook in `hooks/` with tests that, in a session holding a work package, reads the reply just written and, if a Summary lacks the Summary footer (art, banner, FOOTER-COUNTS' lines) or a reply that moves the mark or changes state lacks the banner, returns `decision: block` with the missing parts as its reason so the session adds them before the turn ends; quiet for plain replies and launched agents, and failing open on bad input; (2) bring `coordinator-reminder.sh` into the payload; (3) say when the payload is out and whether `ki` should reinstall it now: terra's installed payload under `~/.claude/hooks/knowledgeislands/ki-agentic-harness/current/` dates from 16 July and holds only git-lock-check, plan-stamp and plan-sync. household-terra then registers the new hook and repoints the reminder to the installed copy (chezmoi `.chezmoidata/coordinator-hook.yaml` and the hook binding) and applies on terra; household-sol on sol. Please ACK MSG-e7b839ee.

## Outbound

None.
