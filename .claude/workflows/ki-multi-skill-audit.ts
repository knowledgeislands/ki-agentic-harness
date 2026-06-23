// Knowledge Islands multi-skill harness audit — ADR-KI-HARNESS-009
// Runs COLL checks in the main context, then fans out one agent per concern in
// parallel, synthesises findings ranked by dependency order (foundations first).

export const meta = {
  name: "ki-multi-skill-audit",
  description: "Audit a Knowledge Islands harness across all applicable governance skills using subagent isolation (ADR-KI-HARNESS-009)",
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

1. COLL-1 (name uniqueness): Run \`bun run skills:lint\` from the harness root. Capture the output verbatim. Report any FAIL or WARN findings about duplicate names.
2. COLL-2 (description off-ramp reciprocity): Read the \`description:\` frontmatter field of every \`SKILL.md\` in \`skills/\`. For each pair of skills whose descriptions share trigger phrases, check that each names the other as an off-ramp. Report any one-directional guards.

Return a plain summary: COLL-1 result (pass/fail + findings), COLL-2 result (pass/fail + findings).`,
  { label: "COLL-1 + COLL-2", phase: "COLL checks" }
);

log(`COLL checks done. Proceeding to per-concern parallel fan-out.`);

// --- Phase 2: Per-concern parallel fan-out ---
phase("Per-concern audit");

// Dependency order (ADR-KI-HARNESS-007) — determines synthesis ranking, not execution order.
const CONCERNS = [
  { name: "authoring", checker: "bun skills/knowledgeislands-authoring/scripts/audit-authoring.ts" },
  { name: "engineering", checker: "bun skills/knowledgeislands-engineering/scripts/audit-engineering.ts" },
  { name: "repo", checker: "bun skills/knowledgeislands-repo/scripts/audit-repo.ts" },
  { name: "kb", checker: "bun skills/knowledgeislands-kb/scripts/audit-kb.ts" },
  { name: "streams", checker: "bun skills/knowledgeislands-streams/scripts/audit-streams.ts" },
  { name: "mcp", checker: "bun skills/knowledgeislands-mcp/scripts/audit-mcp.ts" },
  { name: "11ty-websites", checker: "bun skills/knowledgeislands-11ty-websites/scripts/audit-websites.ts" },
  { name: "cloudflare-hosting", checker: "bun skills/knowledgeislands-cloudflare-hosting/scripts/audit-cloudflare-hosting.ts" },
  { name: "agents", checker: "bun skills/knowledgeislands-agents/scripts/lint-agents.ts" },
  { name: "skills", checker: "bun run skills:lint" },
  { name: "tokenomics", checker: "bun skills/knowledgeislands-tokenomics/scripts/audit-tokenomics.ts" },
  { name: "harness", checker: "bun skills/knowledgeislands-harness/scripts/audit-harness.ts" },
];

const concernResults = await parallel(
  CONCERNS.map((c) => () =>
    agent(
      `You are auditing one concern of a Knowledge Islands harness at path: ${target}

Concern: ${c.name}

Steps:
1. Run the mechanical checker: \`${c.checker} ${target} --json\` from the harness root. If the checker script does not exist or fails to start, note that and skip to judgment.
2. Capture its output verbatim — do not re-derive what it found.
3. Read \`skills/knowledgeislands-${c.name}/SKILL.md\` and its \`references/\` directory.
4. Apply the judgment ([J]-tagged) criteria from \`skills/knowledgeislands-${c.name}/references/audit-rubric.md\`.
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
3. Per-concern findings, ordered by dependency order (authoring → engineering → repo → kb → streams → mcp → 11ty-websites → cloudflare-hosting → agents → skills → tokenomics → harness). For each concern: FAIL items first, then WARN, then POLISH, then ADVISORY. Skip concerns with zero findings.
4. Concerns with no findings: list them as clean.

Keep it scannable. Use the format: concern name as a heading, severity label on each finding line.`;

const synthesis = await agent(synthesisPrompt, { label: "synthesis", phase: "Synthesis" });

return {
  coll: collResult,
  concerns: validResults,
  report: synthesis,
};
