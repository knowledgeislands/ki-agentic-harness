// Knowledge Islands multi-skill harness audit — ADR-KI-HARNESS-AGENTS-001
// Runs COLL checks in the main context, then fans out one agent per concern in
// parallel, synthesises findings ranked by dependency order (foundations first).

export const meta = {
  name: "ki-multi-skill-audit",
  description: "Audit a Knowledge Islands harness across all applicable governance skills using subagent isolation (ADR-KI-HARNESS-AGENTS-001)",
  phases: [
    { title: "COLL checks", detail: "Name uniqueness (COLL-1) + description off-ramp reciprocity (COLL-2)" },
    { title: "Per-concern audit", detail: "One subagent per skill/concern running in parallel" },
    { title: "Synthesis", detail: "Merge and rank findings by dependency order" },
  ],
};

const FINDING_SCHEMA = {
  type: "object",
  properties: {
    concern: { type: "string" },
    exit_code: { type: "number" },
    fail: { type: "array", items: { type: "string" } },
    warn: { type: "array", items: { type: "string" } },
    polish: { type: "array", items: { type: "string" } },
    advisory: { type: "array", items: { type: "string" } },
    pass_count: { type: "number" },
  },
  required: ["concern", "exit_code", "fail", "warn", "polish", "advisory", "pass_count"],
};

// The target harness path — default to current working directory if not supplied.
const target = (args && typeof args === "string" ? args : args?.target) || ".";

// --- Phase 1: COLL checks in the main context ---
phase("COLL checks");

const collResult = await agent(
  `You are auditing a Knowledge Islands harness at path: ${target}

Run the two set-level collision checks and report only these — do not start per-skill work yet:

1. COLL-1 (name uniqueness): Run \`bun run ki:skills:lint\` from the harness root. Capture the output verbatim. Report any FAIL or WARN findings about duplicate names.
2. COLL-2 (description off-ramp reciprocity): Read the \`description:\` frontmatter field of every \`SKILL.md\` in \`skills/\`. For each pair of skills whose descriptions share trigger phrases, check that each names the other as an off-ramp. Report any one-directional guards.

Return a plain summary: COLL-1 result (pass/fail + findings), COLL-2 result (pass/fail + findings).`,
  { label: "COLL-1 + COLL-2", phase: "COLL checks" }
);

log(`COLL checks done. Proceeding to per-concern parallel fan-out.`);

// --- Phase 2: Per-concern parallel fan-out ---
phase("Per-concern audit");

// Dependency order (ADR-KI-HARNESS-SKILLS-003) — determines synthesis ranking, not execution order.
// scopeGated=true means the concern only runs when [ki-<name>] exists in the
// target's .ki-config.toml. Universal concerns (authoring, engineering, repo, skills,
// tokenomics, harness) always run.
const CONCERNS = [
  { name: "authoring", checker: "bun skills/ki-authoring/scripts/audit-authoring.ts", scopeGated: false },
  { name: "engineering", checker: "bun skills/ki-engineering/scripts/audit-engineering.ts", scopeGated: false },
  { name: "repo", checker: "bun skills/ki-repo/scripts/audit-repo.ts", scopeGated: false },
  { name: "kb", checker: "bun skills/ki-kb-base/scripts/audit-kb.ts", scopeGated: true },
  { name: "streams", checker: "bun skills/ki-kb-streams/scripts/audit-streams.ts", scopeGated: true },
  { name: "mcp", checker: "bun skills/ki-mcp/scripts/audit-mcp.ts", scopeGated: true },
  { name: "websites-11ty", checker: "bun skills/ki-websites-11ty/scripts/audit-websites.ts", scopeGated: true },
  { name: "hosting-cloudflare", checker: "bun skills/ki-hosting-cloudflare/scripts/audit-cloudflare-hosting.ts", scopeGated: true },
  { name: "agents", checker: "bun skills/ki-agents/scripts/lint-agents.ts", scopeGated: true },
  { name: "skills", checker: "bun run ki:skills:lint", scopeGated: false },
  { name: "tokenomics", checker: "bun skills/ki-tokenomics/scripts/audit-tokenomics.ts", scopeGated: false },
  { name: "harness", checker: "bun skills/ki-harness/scripts/audit-harness.ts", scopeGated: false },
];

// Read target's .ki-config.toml once in main context to determine which scope-gated
// concerns are declared by this repo. Universal concerns always run regardless.
const scopeActive = await agent(
  `Read the file \`${target}/.ki-config.toml\` and return a JSON array of concern names
that appear as top-level TOML table headers matching the pattern [ki-<name>].
For example if the file contains [ki-kb-base] return ["kb"].
If the file does not exist or is empty return [].
Return ONLY the JSON array, nothing else.`,
  { label: "scope-guard:read-config", phase: "Per-concern audit" }
);

let activeConcerns;
try {
  const declared = JSON.parse(typeof scopeActive === "string" ? scopeActive : JSON.stringify(scopeActive));
  activeConcerns = CONCERNS.filter((c) => !c.scopeGated || declared.includes(c.name));
} catch {
  // If parse fails, fall back to running all concerns
  activeConcerns = CONCERNS;
}

log(`Scope guard resolved. Running ${activeConcerns.length}/${CONCERNS.length} concerns.`);

const concernResults = await parallel(
  activeConcerns.map((c) => () =>
    agent(
      `You are auditing one concern of a Knowledge Islands harness at path: ${target}

Concern: ${c.name}

Steps:
1. Run the mechanical checker: \`${c.checker} ${target} --json\` from the harness root. If the checker script does not exist or fails to start, note that and skip to judgment.
2. Capture its output verbatim — do not re-derive what it found.
3. Read \`skills/ki-${c.name}/SKILL.md\` and its \`references/\` directory.
4. Apply the judgment ([J]-tagged) criteria from \`skills/ki-${c.name}/references/audit-rubric.md\`.
5. Return structured findings only — no preamble.`,
      {
        label: `audit:${c.name}`,
        phase: "Per-concern audit",
        schema: FINDING_SCHEMA,
      }
    )
  )
);

// --- Phase 3: Synthesis ---
phase("Synthesis");

const validResults = concernResults.filter(Boolean);

const synthesisPrompt = `You are synthesising the results of a parallel Knowledge Islands harness audit.

COLL check results:
${collResult}

Per-concern findings (in dependency order — foundations first):
${JSON.stringify(validResults, null, 2)}

Produce a structured report:
1. Executive summary: overall pass/fail verdict, total FAIL/WARN/POLISH counts across all concerns.
2. COLL check summary.
3. Per-concern findings, ordered by dependency order (authoring → engineering → repo → kb → streams → mcp → websites-11ty → hosting-cloudflare → agents → skills → tokenomics → harness). For each concern: FAIL items first, then WARN, then POLISH, then ADVISORY. Skip concerns with zero findings.
4. Concerns with no findings: list them as clean.

Keep it scannable. Use the format: concern name as a heading, severity label on each finding line.`;

const synthesis = await agent(synthesisPrompt, { label: "synthesis", phase: "Synthesis" });

return {
  coll: collResult,
  concerns: validResults,
  report: synthesis,
};
