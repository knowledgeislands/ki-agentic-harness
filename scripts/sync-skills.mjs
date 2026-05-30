#!/usr/bin/env node
// Sync this repo's skills into a Claude skills directory by symlink.
//
// A "skill" is any top-level directory in the repo that contains a SKILL.md.
// Symlinking (rather than copying) keeps installed skills live: editing here,
// or `git pull`, updates every consumer at once.
//
// Usage:
//   node scripts/sync-skills.mjs <command> [--target <dir>] [--dry-run]
//
// Commands:
//   link      Create/refresh a symlink for every skill in the target dir
//   unlink    Remove only the symlinks that point back into this repo
//   status    Show each skill and its link state in the target dir
//
// Options:
//   --target <dir>   Where to install (default: ~/.claude/skills)
//   --dry-run        Print what would change without touching the filesystem
//
// Examples:
//   node scripts/sync-skills.mjs link
//   node scripts/sync-skills.mjs status
//   node scripts/sync-skills.mjs link --target /path/to/project/.claude/skills

import { readdirSync, existsSync, lstatSync, mkdirSync, readlinkSync, rmSync, symlinkSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

// --- arg parsing -----------------------------------------------------------
const argv = process.argv.slice(2);
const command = argv.find((a) => !a.startsWith("-"));
const dryRun = argv.includes("--dry-run");
const targetFlag = argv.indexOf("--target");
const defaultTarget = join(homedir(), ".claude", "skills");
const target = targetFlag !== -1 && argv[targetFlag + 1] ? resolve(argv[targetFlag + 1]) : defaultTarget;

const C = { reset: "\x1b[0m", dim: "\x1b[2m", green: "\x1b[32m", yellow: "\x1b[33m", red: "\x1b[31m", cyan: "\x1b[36m" };
const paint = (c, s) => `${c}${s}${C.reset}`;

// --- discovery -------------------------------------------------------------
function discoverSkills() {
  return readdirSync(repoRoot, { withFileTypes: true })
    .filter((e) => e.isDirectory() && !e.name.startsWith(".") && e.name !== "scripts" && e.name !== "node_modules")
    .filter((e) => existsSync(join(repoRoot, e.name, "SKILL.md")))
    .map((e) => e.name)
    .sort();
}

// Returns the link state of `linkPath` relative to the repo's expected source.
function linkState(linkPath, expectedSource) {
  if (!existsSync(linkPath) && !isSymlink(linkPath)) return { kind: "absent" };
  if (!isSymlink(linkPath)) return { kind: "occupied" }; // a real file/dir is in the way
  const dest = resolve(dirname(linkPath), readlinkSync(linkPath));
  if (dest === expectedSource) return { kind: "linked", dest };
  if (dest.startsWith(repoRoot + "/")) return { kind: "linked-other-here", dest };
  return { kind: "linked-elsewhere", dest };
}

function isSymlink(p) {
  try {
    return lstatSync(p).isSymbolicLink();
  } catch {
    return false;
  }
}

// --- commands --------------------------------------------------------------
function cmdLink(skills) {
  if (!existsSync(target)) {
    console.log(paint(C.dim, `creating ${target}`));
    if (!dryRun) mkdirSync(target, { recursive: true });
  }
  for (const name of skills) {
    const source = join(repoRoot, name);
    const linkPath = join(target, name);
    const state = linkState(linkPath, source);

    if (state.kind === "linked") {
      console.log(`${paint(C.dim, "ok    ")} ${name} ${paint(C.dim, "(already linked)")}`);
      continue;
    }
    if (state.kind === "occupied") {
      console.log(`${paint(C.red, "skip  ")} ${name} ${paint(C.red, "(a real file/dir exists at target — remove it manually)")}`);
      continue;
    }
    // absent, or a symlink pointing somewhere else: (re)create it.
    if (isSymlink(linkPath)) {
      if (!dryRun) rmSync(linkPath);
    }
    if (!dryRun) symlinkSync(source, linkPath, "dir");
    const verb = state.kind.startsWith("linked") ? "relink" : "link  ";
    console.log(`${paint(C.green, verb)} ${name} -> ${paint(C.dim, source)}`);
  }
  if (dryRun) console.log(paint(C.yellow, "\n(dry run — nothing changed)"));
}

function cmdUnlink(skills) {
  for (const name of skills) {
    const source = join(repoRoot, name);
    const linkPath = join(target, name);
    const state = linkState(linkPath, source);
    if (state.kind === "linked" || state.kind === "linked-other-here") {
      if (!dryRun) rmSync(linkPath);
      console.log(`${paint(C.green, "unlink")} ${name}`);
    } else if (state.kind === "occupied") {
      console.log(`${paint(C.yellow, "skip  ")} ${name} ${paint(C.dim, "(not a symlink — left untouched)")}`);
    } else {
      console.log(`${paint(C.dim, "absent")} ${name}`);
    }
  }
  if (dryRun) console.log(paint(C.yellow, "\n(dry run — nothing changed)"));
}

function cmdStatus(skills) {
  console.log(paint(C.cyan, `target: ${target}\n`));
  for (const name of skills) {
    const source = join(repoRoot, name);
    const state = linkState(join(target, name), source);
    const label = {
      linked: paint(C.green, "linked"),
      "linked-other-here": paint(C.yellow, "linked → different skill in this repo"),
      "linked-elsewhere": paint(C.yellow, `linked → elsewhere (${state.dest})`),
      occupied: paint(C.red, "occupied by a real file/dir"),
      absent: paint(C.dim, "not installed"),
    }[state.kind];
    console.log(`  ${name.padEnd(28)} ${label}`);
  }
}

// --- main ------------------------------------------------------------------
const skills = discoverSkills();
if (skills.length === 0) {
  console.error(paint(C.red, "No skills found (no top-level directory contains a SKILL.md)."));
  process.exit(1);
}

switch (command) {
  case "link":
    cmdLink(skills);
    break;
  case "unlink":
    cmdUnlink(skills);
    break;
  case "status":
  case undefined:
    cmdStatus(skills);
    break;
  default:
    console.error(paint(C.red, `Unknown command: ${command}`));
    console.error("Usage: node scripts/sync-skills.mjs <link|unlink|status> [--target <dir>] [--dry-run]");
    process.exit(1);
}
