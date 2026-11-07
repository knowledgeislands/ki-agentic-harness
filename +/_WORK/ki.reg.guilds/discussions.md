# ki.reg.guilds discussions

## Open

### TERRA-ORCA - Remove the stale Orca worktree on terra

**Context:** terra has one leftover worktree in apps-markhowarth.com. Orca, the app that manages agent workspaces, made it on 31 October while preparing a workspace and left it locked. It is clean, and the commit it points at is already published on `main`, so nothing in it would be lost. I changed nothing on terra because this brief allowed only a read-only look.

**Query:** Should a later run on terra unlock and remove it?

**Options:**

a) (recommended, confidence high - reviewed: the blind reviewer chose the same, as Orca has not cleaned it up in a week) Yes: a run on terra re-checks that it is clean and its commit is on `main`, then removes it with Orca's own remove command, which also clears Orca's record; only if Orca no longer lists it, `git worktree unlock` then `git worktree remove`, never a forced `-f -f`. If Orca still lists it as in use, the run stops and asks you.

b) Leave it for Orca to clean up itself.

### VEGA-KEY - Let runs reach vega over SSH

**Context:** vega is listed in `~/.ssh/config` on sol, but SSH refused to connect because vega's host key, the fingerprint SSH uses to recognise a machine, is not recorded on sol. Accepting an unknown key without checking it is unsafe, and it would change the SSH setup, so I left vega unchecked.

**Query:** Should vega's host key be recorded on sol so that runs can check vega read-only?

**Options:**

a) (recommended, confidence high - reviewed: the blind reviewer chose the same, as checking the fingerprint on vega itself is the safe way to trust a new key) You run `ssh-keygen -lf /etc/ssh/ssh_host_ed25519_key.pub` on vega, then `ssh vega` once on sol, accepting only if the two fingerprints match. A later run then repeats the read-only check there.

b) Leave vega out of these checks.

## Parked

- ACQUIRE-ROUTE: acquisition items (GRANOLA-CAPTURED-SKIP MSG-6620cbb7, GRANOLA-COUNT, CHECKSUMS-SETTLED, ACQ-HOLD-WORDING, ACQ-SCAFFOLD-NOTE, ACQUISITION-PROCESS-APPROVE) to ki.reg.main via State of play; recommended a) high. Kris, 7 November: "We can come back to that later." None.
