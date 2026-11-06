# ki.reg.guilds messages

## Inbound

- 2026-11-06 · ACK MSG-c6fa7c81 · from Personal > Housekeeping (personal.reg.household-terra) · 22:24 GMT · (1) **Edit a message queue line by line:** remove or replace a message by matching its whole line, never by id alone, and write `None.` only when the section is otherwise empty; matching by id once overwrote another sender's line, and rewriting a whole Inbound once dropped an unread ACK; lives in household-terra's decisions (PRUNE-BY-LINE); owner ki-work-package, beside Prune. (2) **Register hooks from the installed payload:** a hook the harness ships is registered by the path `ki` installs, `~/.local/share/ki/harnesses/knowledgeislands/ki-agentic-harness/hooks/`, never a checkout or an old manifest copy; on terra the coordinator reminder still runs from the checkout and git-lock-check, plan-stamp and plan-sync from a 16 July copy, open with Kris as Q1; lives in household-terra FOOTER-HOOK; owner ki-bootstrap, or ki-repo-harness for the publishing side.

## Outbound

- 2026-11-06 · MSG-c6fa7c81 SKILL-HARVEST · to 41 live packages on sol · 22:15 GMT · 2 replies in · awaiting ACK
