/** Original research dataset. Never mutate this object for hypothetical edits. */
export const FRAMEWORK = {
  version: "1.0",
  date: "24 October 2026",
  year: 2026,
  provenance:
    "User-supplied Master Era Framework v1.0, completed 24 October 2026. The full source document has not been supplied; no external source verification is claimed.",
} as const;
export type Scenario = "fast" | "central" | "slow";
export type ScenarioMode = Scenario | "all";
export type Forecast = {
  label: string;
  start: number;
  end: number | null;
  open?: boolean;
  nonArrival?: boolean;
  conditional?: boolean;
};
export type Milestone = {
  id: string;
  name: string;
  short: string;
  subtitle: string;
  era: 1 | 2 | 3 | "parallel";
  dimension?: string;
  definition: string;
  windows: Record<Scenario, Forecast>;
  dependencies: string[];
  uncertainties: string[];
  evidence: string[];
  related: string[];
};
export const SCENARIOS: {
  id: Scenario;
  name: string;
  alias: string;
  color: string;
}[] = [
  { id: "fast", name: "Fast", alias: "Bull", color: "#6bdbc0" },
  { id: "central", name: "Central", alias: "Base", color: "#95a9ff" },
  { id: "slow", name: "Slow", alias: "Bear", color: "#d5a66b" },
];
const w = (
  label: string,
  start: number,
  end: number | null,
  flags: Partial<Forecast> = {},
): Forecast => ({ label, start, end, ...flags });
const boundedEvidence =
  "Independent, reproducible demonstrations using a fixed system and auditable evaluation.";
const phaseEvidence =
  "A full phase-specific certification protocol has not been supplied. Forecast windows do not certify achievement.";
export const VERIFICATION_REQUIREMENTS = [
  {
    title: "One frozen system configuration",
    detail:
      "Evaluate one fixed system configuration so that results refer to the same system.",
  },
  {
    title: "Four preregistered cognitive domains",
    detail: "Define the four evaluation domains before assessment begins.",
  },
  {
    title: "25 task families × 10 fresh instances",
    detail:
      "At least 25 task families per domain, with at least 10 fresh task instances in each family.",
  },
  {
    title: "Professional parity across domains",
    detail:
      "At least 70% of task families overall and at least 60% within every domain must reach professional parity.",
  },
  {
    title: "80% success on 4–8 hour projects",
    detail:
      "At least 80% success on projects equivalent to 4–8 productive human work hours.",
  },
  {
    title: "100 qualifying projects",
    detail:
      "At least 100 qualifying projects in total, including at least 25 per domain.",
  },
  {
    title: "Limited substantive human assistance",
    detail:
      "Human substantive assistance must be at most 25% of the human reference work time.",
  },
  {
    title: "Recurring system cost ceiling",
    detail:
      "Recurring full system cost must be no more than 10 times the human comparator.",
  },
  {
    title: "Transfer to novel workflows and tools",
    detail:
      "Demonstrate successful transfer beyond familiar workflows and tools.",
  },
  {
    title: "Two independent evaluator organisations",
    detail:
      "Two independent nondeveloper evaluator organisations must evaluate the system.",
  },
  {
    title: "30 days of auditable use",
    detail: "At least 30 days across two independent user organisations.",
  },
  {
    title: "Statistical and adversarial scrutiny",
    detail:
      "Adequate statistical confidence, contamination checks and independent adversarial review.",
  },
];
export const MILESTONES: Milestone[] = [
  {
    id: "mid-1",
    name: "Mid Era 1",
    short: "Mid Era 1",
    subtitle: "Reliable bounded delegation",
    era: 1,
    definition:
      "Reliable, independently demonstrated professional-level bounded delegation.",
    windows: {
      fast: w("Late 2026–2028", 2026.75, 2028),
      central: w("2027–2031", 2027, 2031),
      slow: w("2032–2040 or unresolved longer", 2032, 2040, { open: true }),
    },
    dependencies: [
      "Reliable professional work within bounded tasks",
      "Transfer to unfamiliar workflows and tools",
      "Independent evaluation capacity",
    ],
    uncertainties: [
      "Contamination and task selection",
      "Reliability over full projects",
      "Assistance, recurring cost and evaluator independence",
    ],
    evidence: VERIFICATION_REQUIREMENTS.map((r) => `${r.title}: ${r.detail}`),
    related: ["late-1", "agi"],
  },
  {
    id: "late-1",
    name: "Late Era 1",
    short: "Late Era 1",
    subtitle: "Longer-horizon autonomy",
    era: 1,
    definition:
      "Broader, more reliable and longer-horizon autonomous capabilities.",
    windows: {
      fast: w("2027–2030", 2027, 2030),
      central: w("2029–2035", 2029, 2035),
      slow: w("2035–2050 or absent", 2035, 2050, { nonArrival: true }),
    },
    dependencies: [
      "Reliable bounded delegation",
      "Persistent planning and error recovery",
    ],
    uncertainties: [
      "Compounding errors across long tasks",
      "Robustness outside familiar environments",
    ],
    evidence: [boundedEvidence, phaseEvidence],
    related: ["mid-1", "agi"],
  },
  {
    id: "agi",
    name: "Early Era 2 · AGI",
    short: "Early Era 2",
    subtitle: "Operational AGI",
    era: 2,
    definition:
      "Operational AGI: broad human-professional competence across eight cognitive domains and long autonomous projects. The names and full evaluation rules for the eight domains are pending the full framework document.",
    windows: {
      fast: w("2028–2033", 2028, 2033),
      central: w("2034–2045", 2034, 2045),
      slow: w("2050–2075 or absent", 2050, 2075, { nonArrival: true }),
    },
    dependencies: [
      "Broad cognitive competence",
      "Long autonomous projects",
      "Reliable use of tools and feedback",
    ],
    uncertainties: [
      "Generalisation across all eight domains",
      "Autonomous project reliability",
      "Evaluation validity; alignment remains independent",
    ],
    evidence: [
      "Independent evidence of human-professional competence across all eight cognitive domains and long autonomous projects.",
      phaseEvidence,
    ],
    related: ["late-1", "mid-2", "asi", "e3"],
  },
  {
    id: "mid-2",
    name: "Mid Era 2",
    short: "Mid Era 2",
    subtitle: "Advanced general agency",
    era: 2,
    definition:
      "Increasingly powerful, reliable and autonomous general cognitive agency.",
    windows: {
      fast: w("2030–2036", 2030, 2036),
      central: w("2038–2052", 2038, 2052),
      slow: w("2060–2090 or absent", 2060, 2090, { nonArrival: true }),
    },
    dependencies: [
      "Broad general cognitive agency",
      "Improved reliability and autonomy",
    ],
    uncertainties: ["Scaling of reliability", "Compute and energy constraints"],
    evidence: [boundedEvidence, phaseEvidence],
    related: ["agi", "late-2"],
  },
  {
    id: "late-2",
    name: "Late Era 2",
    short: "Late Era 2",
    subtitle: "Toward superhuman capability",
    era: 2,
    definition: "Further advancement toward broadly superhuman capability.",
    windows: {
      fast: w("2031–2038", 2031, 2038),
      central: w("2040–2060", 2040, 2060),
      slow: w("2070–2100+ or absent", 2070, 2100, {
        open: true,
        nonArrival: true,
      }),
    },
    dependencies: [
      "Advanced general cognitive agency",
      "Broad capability gains beyond professional parity",
    ],
    uncertainties: [
      "Uneven domain progress",
      "Operational reliability and control",
    ],
    evidence: [boundedEvidence, phaseEvidence],
    related: ["mid-2", "asi"],
  },
  {
    id: "asi",
    name: "Early Era 3 · ASI",
    short: "Early Era 3",
    subtitle: "Operational cognitive ASI",
    era: 3,
    definition:
      "Operational cognitive ASI: exceeding expert human teams across eight cognitive domains. This is a cognitive classification; it does not certify alignment, general robotics or economic abundance.",
    windows: {
      fast: w("2032–2040", 2032, 2040),
      central: w("2045–2065", 2045, 2065),
      slow: w("2075–2100+ or absent", 2075, 2100, {
        open: true,
        nonArrival: true,
      }),
    },
    dependencies: [
      "Broad superhuman cognitive performance",
      "Robust long-horizon agency",
      "Sufficient computing infrastructure",
    ],
    uncertainties: [
      "Measuring performance against expert human teams",
      "Safety, governance and infrastructure constraints",
    ],
    evidence: [
      "Independent demonstrations exceeding expert human teams across all eight cognitive domains.",
      phaseEvidence,
    ],
    related: ["late-2", "mid-3", "e3"],
  },
  {
    id: "mid-3",
    name: "Mid Era 3",
    short: "Mid Era 3",
    subtitle: "Advanced superhuman agency",
    era: 3,
    definition: "Increasingly advanced superhuman cognitive agency.",
    windows: {
      fast: w("2034–2045", 2034, 2045),
      central: w("2050–2075", 2050, 2075),
      slow: w("After 2100 or absent", 2100, null, {
        open: true,
        nonArrival: true,
      }),
    },
    dependencies: [
      "Operational cognitive ASI",
      "Continued capability and reliability advances",
    ],
    uncertainties: [
      "Limits to continued progress",
      "Control and deployment constraints",
    ],
    evidence: [boundedEvidence, phaseEvidence],
    related: ["asi", "late-3"],
  },
  {
    id: "late-3",
    name: "Late Era 3",
    short: "Late Era 3",
    subtitle: "Mature superhuman agency",
    era: 3,
    definition: "Mature, highly advanced superhuman cognitive agency.",
    windows: {
      fast: w("2038–2050", 2038, 2050),
      central: w("2060–2100 conditional", 2060, 2100, { conditional: true }),
      slow: w("After 2100 or absent", 2100, null, {
        open: true,
        nonArrival: true,
      }),
    },
    dependencies: [
      "Advanced superhuman cognitive agency",
      "Sustained, conditional long-term development",
    ],
    uncertainties: [
      "Long-range structural uncertainty",
      "Non-arrival and limits to progress",
    ],
    evidence: [boundedEvidence, phaseEvidence],
    related: ["mid-3", "asi"],
  },
  {
    id: "s3",
    name: "S3 · Scientific acceleration",
    short: "S3 · Science",
    subtitle: "Independently validated discovery",
    era: "parallel",
    dimension: "S",
    definition: "Independently validated broad scientific acceleration.",
    windows: {
      fast: w("2030–2038", 2030, 2038),
      central: w("2038–2055", 2038, 2055),
      slow: w("2060+ or absent", 2060, null, { open: true, nonArrival: true }),
    },
    dependencies: [
      "Useful scientific reasoning",
      "Experimental validation and research infrastructure",
    ],
    uncertainties: [
      "Reproducibility",
      "Translation from proposals to validated discoveries",
    ],
    evidence: [
      "Independent validation of broad scientific acceleration.",
      phaseEvidence,
    ],
    related: ["agi", "i3"],
  },
  {
    id: "r3",
    name: "R3 · General robotics",
    short: "R3 · Robotics",
    subtitle: "Economical across sectors",
    era: "parallel",
    dimension: "R",
    definition: "Economical multi-sector general robotics.",
    windows: {
      fast: w("2030–2040", 2030, 2040),
      central: w("2040–2060", 2040, 2060),
      slow: w("2060+ or absent", 2060, null, { open: true, nonArrival: true }),
    },
    dependencies: [
      "Reliable embodied autonomy",
      "Hardware manufacturing and cost reductions",
    ],
    uncertainties: [
      "Physical-world reliability and safety",
      "Deployment economics across sectors",
    ],
    evidence: [
      "Independent demonstrations of economical general robotics in multiple sectors.",
      phaseEvidence,
    ],
    related: ["i3", "e3"],
  },
  {
    id: "i3",
    name: "I3 · Automated industrial capacity",
    short: "I3 · Industry",
    subtitle: "Bounded self-expansion",
    era: "parallel",
    dimension: "I",
    definition: "Bounded self-expanding automated industrial capacity.",
    windows: {
      fast: w("2035–2048", 2035, 2048),
      central: w("2048–2075", 2048, 2075),
      slow: w("After 2075 or absent", 2075, null, {
        open: true,
        nonArrival: true,
      }),
    },
    dependencies: [
      "Economical robotics",
      "Energy, computing infrastructure and material supply",
      "Manufacturing and logistics integration",
    ],
    uncertainties: [
      "Supply chains and capital investment",
      "Bottlenecks in physical production and governance",
    ],
    evidence: [
      "Auditable evidence of bounded automated industrial self-expansion.",
      phaseEvidence,
    ],
    related: ["r3", "s3", "e3"],
  },
  {
    id: "e3",
    name: "E3 · UK near-abundance",
    short: "E3 · UK abundance",
    subtitle: "Essential needs within reach",
    era: "parallel",
    dimension: "E",
    definition:
      "UK essential-needs near-abundance: at least 95% of residents within every income quintile reliably obtain a defined essential-needs basket for no more than 20% of equivalised disposable income, or free, sustained for five years. The basket includes housing, food, water/sanitation, energy, essential healthcare, education, connectivity and basic mobility. This is not unlimited post-scarcity.",
    windows: {
      fast: w("2040–2055", 2040, 2055),
      central: w("2055–2090", 2055, 2090),
      slow: w("After 2100 or absent", 2100, null, {
        open: true,
        nonArrival: true,
      }),
    },
    dependencies: [
      "Industrial and service productivity",
      "Housing, healthcare and infrastructure capacity",
      "Distribution, policy and equitable access",
    ],
    uncertainties: [
      "Distribution of productivity gains",
      "Housing and essential service bottlenecks",
      "Political choices, access and affordability",
    ],
    evidence: [
      "Representative UK evidence covering every income quintile: at least 95% of residents in each quintile meet the affordability and reliable-access threshold.",
      "Measurement of the full basket, sustained for five years.",
    ],
    related: ["agi", "asi", "r3", "i3"],
  },
];
export const DIMENSIONS = [
  { id: "S", name: "Scientific discovery", status: "S3 forecast supplied" },
  { id: "R", name: "Robotics", status: "R3 forecast supplied" },
  {
    id: "F",
    name: "Energy & computing",
    status: "No dated milestone supplied",
  },
  { id: "I", name: "Industrial production", status: "I3 forecast supplied" },
  { id: "L", name: "Alignment & control", status: "Separate research pending" },
  { id: "E", name: "Economic access", status: "E3 forecast supplied" },
  {
    id: "C",
    name: "Cognitive capabilities",
    status: "Cognitive-era framework",
  },
  {
    id: "A",
    name: "Autonomy",
    status: "Embedded in era definitions; no separate dates",
  },
];
export const ERA_NAMES = {
  1: "Bounded delegation",
  2: "General cognitive agency",
  3: "Superhuman cognitive agency",
};
export function ageAt(
  year: number,
  referenceAge: number,
  referenceYear: number,
) {
  return Math.round((referenceAge + year - referenceYear) * 10) / 10;
}
export function ageWindow(
  f: Forecast,
  referenceAge: number,
  referenceYear: number,
): string {
  const start = Math.round(ageAt(f.start, referenceAge, referenceYear));
  const ages =
    f.end === null
      ? `Age ≈${start}+`
      : `Age ≈${start}–${Math.round(ageAt(f.end, referenceAge, referenceYear))}${f.open ? "+" : ""}`;
  return `${ages}${f.nonArrival ? " · or absent" : f.conditional ? " · conditional" : f.open ? " · may be later" : ""}`;
}
export type Hypothesis = {
  schemaVersion: 1;
  kind: "user-hypothesis";
  title: string;
  windows: Record<string, Partial<Record<Scenario, Forecast>>>;
};
export function parseHypothesis(text: string): Hypothesis {
  const data = JSON.parse(text);
  if (
    !data ||
    data.schemaVersion !== 1 ||
    data.kind !== "user-hypothesis" ||
    typeof data.title !== "string" ||
    !data.title.trim() ||
    data.title.length > 100 ||
    !data.windows ||
    typeof data.windows !== "object" ||
    Array.isArray(data.windows)
  )
    throw new Error(
      "Use a schemaVersion 1 user-hypothesis export with a title and windows object.",
    );
  const windows: Hypothesis["windows"] = {};
  for (const [id, forecasts] of Object.entries(data.windows)) {
    if (
      !MILESTONES.some((m) => m.id === id) ||
      !forecasts ||
      typeof forecasts !== "object" ||
      Array.isArray(forecasts)
    )
      throw new Error(`Unknown milestone or invalid windows: ${id}`);
    windows[id] = {};
    for (const [scenario, value] of Object.entries(forecasts)) {
      const f = value as Forecast;
      if (
        !SCENARIOS.some((s) => s.id === scenario) ||
        !f ||
        typeof f.label !== "string" ||
        !f.label.trim() ||
        f.label.length > 120 ||
        !Number.isFinite(f.start) ||
        f.start < 2026 ||
        f.start > 2500 ||
        !(
          f.end === null ||
          (Number.isFinite(f.end) && f.end >= f.start && f.end <= 2500)
        )
      )
        throw new Error(
          `Invalid forecast for ${id}/${scenario}. Years must be 2026–2500 and end must follow start or be null.`,
        );
      for (const flag of ["open", "nonArrival", "conditional"] as const)
        if (f[flag] !== undefined && typeof f[flag] !== "boolean")
          throw new Error(`Invalid ${flag} flag.`);
      windows[id][scenario as Scenario] = {
        label: f.label,
        start: f.start,
        end: f.end,
        open: f.open,
        nonArrival: f.nonArrival,
        conditional: f.conditional,
      };
    }
  }
  return {
    schemaVersion: 1,
    kind: "user-hypothesis",
    title: data.title.trim(),
    windows,
  };
}
export function applyHypothesis(hypothesis: Hypothesis | null): Milestone[] {
  return MILESTONES.map((m) => ({
    ...m,
    windows: { ...m.windows, ...hypothesis?.windows[m.id] },
  }));
}
