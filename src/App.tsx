import { useEffect, useRef, useState } from "react";
import {
  ArrowDownToLine,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Compass,
  Download,
  FlaskConical,
  GitCompareArrows,
  Layers3,
  Leaf,
  Menu,
  Orbit,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Upload,
  UserRound,
  X,
  Zap,
} from "lucide-react";
import {
  ageWindow,
  applyHypothesis,
  DIMENSIONS,
  FRAMEWORK,
  MILESTONES,
  parseHypothesis,
  SCENARIOS,
  VERIFICATION_REQUIREMENTS,
  type Hypothesis,
  type ScenarioMode,
} from "./data/framework";
import Timeline from "./components/Timeline";
import Details from "./components/Details";
import AgeLens from "./components/AgeLens";
import Modal from "./components/Modal";
type View = "overview" | "scenarios" | "alignment" | "economy" | "methodology";
const NAV = [
  { id: "overview", label: "Overview", mobile: "Overview", icon: Compass },
  {
    id: "scenarios",
    label: "Scenario comparison",
    mobile: "Scenarios",
    icon: GitCompareArrows,
  },
  {
    id: "alignment",
    label: "Capability & alignment",
    mobile: "Alignment",
    icon: ShieldCheck,
  },
  {
    id: "economy",
    label: "Economic transition",
    mobile: "Economy",
    icon: Leaf,
  },
  {
    id: "methodology",
    label: "Methodology",
    mobile: "Methods",
    icon: BookOpen,
  },
] as const;
const TITLES: Record<
  View,
  { eyebrow: string; title: string; accent: string; description: string }
> = {
  overview: {
    eyebrow: "MAPPING POSSIBLE FUTURES",
    title: "From intelligence",
    accent: "to transformation.",
    description:
      "Explore the paths from today’s AI to general intelligence, superintelligence and a more abundant world.",
  },
  scenarios: {
    eyebrow: "THREE PATHS. MANY POSSIBLE FUTURES.",
    title: "The future has",
    accent: "more than one pathway.",
    description:
      "Compare the fast, central and slow scenarios. Every window is a possibility, never a promise.",
  },
  alignment: {
    eyebrow: "CAPABILITY ≠ CONTROL",
    title: "More capable.",
    accent: "But more aligned?",
    description:
      "Track cognitive progress and alignment independently. Intelligence alone is no evidence of safe, reliable control.",
  },
  economy: {
    eyebrow: "BEYOND COGNITIVE CAPABILITY",
    title: "Intelligence is a start.",
    accent: "Abundance takes more.",
    description:
      "Follow the physical, industrial and institutional transitions between better AI and accessible essential needs.",
  },
  methodology: {
    eyebrow: "THE RESEARCH BEHIND THE WINDOWS",
    title: "Clear definitions.",
    accent: "Honest uncertainty.",
    description:
      "Understand what this framework claims, what it requires as evidence and what remains unknown.",
  },
};
function loadHypothesis() {
  try {
    const saved = localStorage.getItem("transition-hypothesis");
    return saved ? parseHypothesis(saved) : null;
  } catch {
    return null;
  }
}
function loadAge(): { enabled: boolean; age: number; year: number } {
  try {
    const a = JSON.parse(localStorage.getItem("transition-age") || "null");
    if (
      a &&
      typeof a.enabled === "boolean" &&
      Number.isInteger(a.age) &&
      a.age >= 0 &&
      a.age <= 120 &&
      Number.isInteger(a.year) &&
      a.year >= 1900 &&
      a.year <= 2200
    )
      return a;
  } catch {
    /* Use illustrative baseline. */
  }
  return { enabled: false, age: 19, year: 2026 };
}
function downloadJSON(data: unknown, filename: string) {
  const url = URL.createObjectURL(
    new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export default function App() {
  const [view, setView] = useState<View>("overview");
  const [mode, setMode] = useState<ScenarioMode>("central");
  const [horizon, setHorizon] = useState(2100);
  const [showCognitive, setShowCognitive] = useState(true);
  const [showEconomic, setShowEconomic] = useState(false);
  const [age, setAge] = useState(loadAge);
  const [ageEditor, setAgeEditor] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [compare, setCompare] = useState<string[]>([]);
  const [compareOpen, setCompareOpen] = useState(false);
  const [hypothesis, setHypothesis] = useState<Hypothesis | null>(
    loadHypothesis,
  );
  const [hypothesisActive, setHypothesisActive] = useState(false);
  const [dataOpen, setDataOpen] = useState(false);
  const [pendingImport, setPendingImport] = useState<Hypothesis | null>(null);
  const [importError, setImportError] = useState("");
  const [notice, setNotice] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [offlineReady, setOfflineReady] = useState(false);
  const uploadRef = useRef<HTMLInputElement>(null);
  const milestones = applyHypothesis(hypothesisActive ? hypothesis : null);
  useEffect(() => {
    try {
      localStorage.setItem("transition-age", JSON.stringify(age));
    } catch {
      setNotice(
        "Storage is unavailable. Your settings will last for this session only.",
      );
    }
  }, [age]);
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.ready.then(() => setOfflineReady(true));
    }
  }, []);
  useEffect(() => {
    if (!notice) return;
    const id = setTimeout(() => setNotice(""), 6000);
    return () => clearTimeout(id);
  }, [notice]);
  function navigate(next: View) {
    setView(next);
    setMobileMenu(false);
    window.scrollTo({ top: 0, behavior: "instant" });
  }
  function reset() {
    setMode("central");
    setHorizon(2100);
    setShowCognitive(true);
    setShowEconomic(false);
  }
  function toggleCompare(id: string) {
    setCompare((previous) =>
      previous.includes(id)
        ? previous.filter((x) => x !== id)
        : [...previous, id],
    );
  }
  function quickCompare() {
    setCompare(["agi", "asi", "e3"]);
    setCompareOpen(true);
  }
  async function importFile(file?: File) {
    if (!file) return;
    setImportError("");
    if (file.size > 250_000) {
      setImportError("Choose a JSON file smaller than 250 KB.");
      return;
    }
    try {
      setPendingImport(parseHypothesis(await file.text()));
    } catch (error) {
      setImportError(
        error instanceof Error ? error.message : "Unable to read this file.",
      );
    }
  }
  function applyImport() {
    if (!pendingImport) return;
    setHypothesis(pendingImport);
    setHypothesisActive(true);
    try {
      localStorage.setItem(
        "transition-hypothesis",
        JSON.stringify(pendingImport),
      );
    } catch {
      setNotice(
        "Hypothesis applied for this session; local storage is unavailable.",
      );
    }
    setPendingImport(null);
    setDataOpen(false);
    setNotice(
      "Hypothetical windows applied. The original framework is preserved.",
    );
  }
  const originalExport = {
    framework: FRAMEWORK,
    milestones: MILESTONES,
    verificationRequirements: VERIFICATION_REQUIREMENTS,
    dimensions: DIMENSIONS,
  };
  const template: Hypothesis = {
    schemaVersion: 1,
    kind: "user-hypothesis",
    title: "My hypothetical scenario",
    windows: Object.fromEntries(MILESTONES.map((m) => [m.id, m.windows])),
  };
  const changed = pendingImport
    ? Object.entries(pendingImport.windows).flatMap(([id, forecasts]) =>
        Object.entries(forecasts)
          .filter(
            ([s, f]) =>
              JSON.stringify(f) !==
              JSON.stringify(
                MILESTONES.find((m) => m.id === id)!.windows[
                  s as keyof typeof forecasts
                ],
              ),
          )
          .map(([s, f]) => ({
            id,
            scenario: s,
            forecast: f!,
            original: MILESTONES.find((m) => m.id === id)!.windows[
              s as "fast" | "central" | "slow"
            ],
          })),
      )
    : [];
  const timelineProps = {
    milestones,
    mode,
    setMode,
    horizon,
    setHorizon,
    age: age.enabled,
    referenceAge: age.age,
    referenceYear: age.year,
    open: setSelected,
    compare,
    toggleCompare,
    showCognitive,
    setShowCognitive,
    showEconomic,
    setShowEconomic,
    reset,
  };
  return (
    <div className="app-shell min-h-dvh">
      <a className="skip-link" href="#main-content">
        Skip to research dashboard
      </a>
      <aside
        className={`sidebar ${mobileMenu ? "mobile-open" : ""}`}
        aria-label="Main navigation"
      >
        <a
          className="brand"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            navigate("overview");
          }}
        >
          <span className="brand-symbol">
            <Orbit size={23} />
          </span>
          <span>
            TRANSITION<span className="brand-sub">EXPLORER</span>
          </span>
        </a>
        <button
          className="mobile-menu-close icon-button"
          aria-label="Close navigation"
          onClick={() => setMobileMenu(false)}
        >
          <X size={20} />
        </button>
        <div className="workspace-label">
          RESEARCH WORKSPACE <span>01</span>
        </div>
        <nav aria-label="Main navigation">
          {NAV.map((item) => (
            <button
              key={item.id}
              className={view === item.id ? "active" : ""}
              onClick={() => navigate(item.id)}
              aria-current={view === item.id ? "page" : undefined}
            >
              <item.icon size={18} />
              {item.label}
              {view === item.id && <span className="nav-active-dot" />}
            </button>
          ))}
        </nav>
        <div className="sidebar-framework">
          <span className="framework-icon">
            <Layers3 size={20} />
          </span>
          <span>
            Master Era Framework
            <small>
              Version {FRAMEWORK.version} <span>·</span> October 2026
            </small>
          </span>
          <div className="sidebar-rule" />
          <p>
            A map of possibilities.
            <br />
            Not a prediction of destiny.
          </p>
          <button onClick={() => navigate("methodology")}>
            About the framework <ArrowUpRight size={13} />
          </button>
        </div>
        <div className="sidebar-bottom">
          <span className="green-dot" />
          <span>
            {offlineReady ? "Offline available" : "Local-first research"}
          </span>
          <span className="version-tag">v1.0</span>
        </div>
      </aside>
      <div className="main-shell">
        <header className="topbar">
          <div className="breadcrumb">
            <button
              className="mobile-menu-button icon-button"
              aria-label="Open navigation"
              onClick={() => setMobileMenu(true)}
            >
              <Menu size={20} />
            </button>
            <span className="desktop-breadcrumb">
              Research workspace <ChevronRight size={12} />
            </span>
            <span>{NAV.find((n) => n.id === view)?.label}</span>
          </div>
          <div className="top-actions">
            <span className="framework-pill">
              <span /> Framework v1.0
            </span>
            <button
              className="top-data-button"
              aria-label="Research data"
              onClick={() => setDataOpen(true)}
            >
              <ArrowDownToLine size={15} />
              <span>Research data</span>
            </button>
          </div>
        </header>
        <main id="main-content" tabIndex={-1}>
          <section className="page-intro">
            <div>
              <span className="eyebrow">{TITLES[view].eyebrow}</span>
              <h1>
                {TITLES[view].title}
                <br />
                <span>{TITLES[view].accent}</span>
              </h1>
              <p>{TITLES[view].description}</p>
            </div>
            <div className="intro-meta">
              <span className="meta-rule" />
              <span>AGI → ASI → ABUNDANCE</span>
              <small>2026 — 2100+</small>
              <span className="research-date">RESEARCH AS OF 24 OCT 2026</span>
            </div>
          </section>
          {hypothesisActive && hypothesis && (
            <div className="hypothesis-banner">
              <FlaskConical size={19} />
              <span>
                <strong>User-edited hypothesis: {hypothesis.title}</strong>
                <small>
                  Hypothetical windows. Original Master Era Framework data
                  remains unchanged.
                </small>
              </span>
              <button
                className="text-button"
                onClick={() => setHypothesisActive(false)}
              >
                Restore original <RotateCcw size={14} />
              </button>
            </div>
          )}
          {(view === "overview" || view === "scenarios") && (
            <>
              <section
                className="live-status panel"
                aria-label="Live framework position"
              >
                <div className="status-main">
                  <div className="status-topline">
                    <span className="green-dot pulse" /> VERIFIED LOWER BOUND{" "}
                    <span className="subtle-tag">Live framework position</span>
                  </div>
                  <h2>Active Early Era 1 of the AGI transition</h2>
                  <p>
                    General-purpose AI assistance → reliable bounded delegation
                  </p>
                  <div className="status-progress" aria-hidden="true">
                    <span className="progress-segment complete" />
                    <span className="progress-segment" />
                    <span className="progress-segment" />
                    <span className="progress-segment era2" />
                    <span className="progress-segment era2" />
                    <span className="progress-segment era2" />
                    <span className="progress-segment era3" />
                    <span className="progress-segment era3" />
                    <span className="progress-segment era3" />
                  </div>
                  <div className="progress-labels">
                    <span>EARLY ERA 1</span>
                    <span>GENERAL AGENCY</span>
                    <span>SUPERHUMAN AGENCY</span>
                  </div>
                  <div className="status-framework-meta">
                    <span>
                      Framework version <strong>{FRAMEWORK.version}</strong>
                    </span>
                    <span>
                      Framework date <strong>{FRAMEWORK.date}</strong>
                    </span>
                  </div>
                </div>
                <div className="status-facts">
                  <div>
                    <span>Next milestone</span>
                    <button onClick={() => setSelected("mid-1")}>
                      Mid Era 1 <ArrowUpRight size={14} />
                    </button>
                  </div>
                  <div>
                    <span>Mid Era 1 status</span>
                    <strong className="amber-text">
                      <i />
                      Unresolved
                    </strong>
                  </div>
                  <div>
                    <span>Exact frontier position</span>
                    <strong>Not independently certified</strong>
                  </div>
                  <p>
                    <CircleHelp size={12} /> A lower bound, not a precise
                    frontier claim.
                  </p>
                </div>
              </section>
              <section
                className="summary-cards"
                aria-label="Key central scenario forecasts"
              >
                {[
                  {
                    id: "agi",
                    label: "GENERAL INTELLIGENCE",
                    icon: Sparkles,
                    symbol: "AGI",
                    cls: "agi-card",
                  },
                  {
                    id: "asi",
                    label: "SUPERINTELLIGENCE",
                    icon: Zap,
                    symbol: "ASI",
                    cls: "asi-card",
                  },
                  {
                    id: "e3",
                    label: "UK ESSENTIAL NEEDS",
                    icon: Leaf,
                    symbol: "E3",
                    cls: "e3-card",
                  },
                ].map((card) => {
                  const m = milestones.find((x) => x.id === card.id)!;
                  return (
                    <button
                      className={`summary-card ${card.cls}`}
                      key={card.id}
                      onClick={() => setSelected(card.id)}
                    >
                      <div className="summary-label">
                        <span>{card.label}</span>
                        <card.icon size={17} />
                      </div>
                      <div className="summary-value">
                        {m.windows.central.start}
                        <span>—</span>
                        {m.windows.central.end}
                        <ArrowUpRight size={17} />
                      </div>
                      <div className="summary-bottom">
                        <span>
                          {card.symbol === "E3"
                            ? "Near-abundance · not post-scarcity"
                            : `${card.symbol} · ${m.short}`}
                        </span>
                        <span className="subtle-tag">Central</span>
                      </div>
                    </button>
                  );
                })}
              </section>
            </>
          )}
          {(view === "overview" ||
            view === "scenarios" ||
            view === "economy") && (
            <>
              <div className="workspace-tools">
                <div>
                  <span className="green-dot" />
                  <span>
                    {hypothesisActive
                      ? "User-edited hypothetical data"
                      : "Master Era Framework v1.0"}
                  </span>
                  <span className="tools-divider">/</span>
                  <span className="muted">Subjective projections</span>
                </div>
                <div className="workspace-tool-actions">
                  <button
                    className={
                      age.enabled ? "tool-button enabled" : "tool-button"
                    }
                    onClick={() => setAgeEditor(!ageEditor)}
                    aria-expanded={ageEditor}
                  >
                    <UserRound size={14} />
                    <span>Lifetime lens</span>
                    {age.enabled && <span className="tiny-active-dot" />}
                    <ChevronDown size={13} />
                  </button>
                  <button className="tool-button" onClick={quickCompare}>
                    <GitCompareArrows size={15} />
                    <span>Compare key milestones</span>
                  </button>
                </div>
              </div>
              {ageEditor && <AgeLens settings={age} change={setAge} />}
              <Timeline
                {...timelineProps}
                forceAll={view === "scenarios"}
                economicOnly={view === "economy"}
              />
            </>
          )}
          {view === "overview" && (
            <div className="lower-grid">
              <Verification />
              <section className="panel parallel-card">
                <span className="eyebrow">
                  <Leaf size={14} /> THE PHYSICAL WORLD MATTERS
                </span>
                <h2>Capability isn’t abundance.</h2>
                <p>
                  Scientific progress, robotics, infrastructure and equitable
                  access each have their own bottlenecks.
                </p>
                <div className="parallel-flow">
                  <span>
                    S<small>Science</small>
                  </span>
                  <ChevronRight size={14} />
                  <span>
                    R<small>Robotics</small>
                  </span>
                  <ChevronRight size={14} />
                  <span>
                    I<small>Industry</small>
                  </span>
                  <ChevronRight size={14} />
                  <span>
                    E<small>Access</small>
                  </span>
                </div>
                <button
                  className="text-button"
                  onClick={() => navigate("economy")}
                >
                  Explore the economic transition <ArrowRight size={16} />
                </button>
                <div className="parallel-note">
                  <ShieldCheck size={17} />
                  <p>
                    Alignment is an independent track.
                    <br />
                    <strong>No alignment forecast is assumed.</strong>
                  </p>
                </div>
              </section>
            </div>
          )}
          {view === "alignment" && (
            <>
              <div className="independent-tracks">
                <section className="panel alignment-card">
                  <div className="track-icon purple">
                    <Sparkles size={23} />
                  </div>
                  <span className="eyebrow">
                    TRACK 01 / COGNITIVE CAPABILITY
                  </span>
                  <h2>What can the system do?</h2>
                  <p>
                    Operational classifications describe breadth, reliability
                    and autonomy. The supplied scenario windows apply to
                    cognitive milestones only.
                  </p>
                  <div className="capability-ladder">
                    {[
                      "Early Era 1 · Verified lower bound",
                      "Early Era 2 · Operational AGI",
                      "Early Era 3 · Cognitive ASI",
                    ].map((s, i) => (
                      <button
                        key={s}
                        onClick={() =>
                          i === 0
                            ? setNotice(
                                "Early Era 1 is the established verified lower-bound position. The exact frontier is not independently certified.",
                              )
                            : setSelected(i === 1 ? "agi" : "asi")
                        }
                      >
                        <span>0{i + 1}</span>
                        {s}
                        <ArrowUpRight size={15} />
                      </button>
                    ))}
                  </div>
                </section>
                <section className="panel alignment-card pending-track">
                  <div className="track-icon mint">
                    <ShieldCheck size={23} />
                  </div>
                  <span className="eyebrow">
                    TRACK 02 / ALIGNMENT & CONTROL
                  </span>
                  <h2>Can it be reliably controlled?</h2>
                  <p className="pending-label">
                    Operational levels and dates pending separate alignment
                    research
                  </p>
                  <p>
                    No dated alignment milestones or operational levels have
                    been supplied. Reaching AGI or ASI does not establish
                    reliable alignment.
                  </p>
                  <span className="status-chip amber">
                    <span /> Research pending
                  </span>
                </section>
              </div>
              <div className="panel independence-note">
                <ShieldCheck size={25} />
                <div>
                  <h3>Two independent questions. No automatic connection.</h3>
                  <p>
                    Capability forecasts do not certify safe deployment,
                    control, value alignment or governance readiness. Future
                    alignment research must be evaluated on its own evidence.
                  </p>
                </div>
              </div>
              <Verification />
            </>
          )}
          {view === "economy" && (
            <>
              <section className="panel e3-definition">
                <div>
                  <span className="eyebrow">
                    E3 / A PRECISE, UK-SPECIFIC THRESHOLD
                  </span>
                  <h2>Near-abundance for essential needs.</h2>
                  <p>
                    At least{" "}
                    <strong>
                      95% of residents within every income quintile
                    </strong>{" "}
                    reliably obtaining the essential-needs basket for{" "}
                    <strong>
                      no more than 20% of equivalised disposable income, or free
                    </strong>
                    , sustained for <strong>five years</strong>.
                  </p>
                  <div className="basket-tags">
                    {[
                      "Housing",
                      "Food",
                      "Water & sanitation",
                      "Energy",
                      "Essential healthcare",
                      "Education",
                      "Connectivity",
                      "Basic mobility",
                    ].map((b) => (
                      <span key={b}>{b}</span>
                    ))}
                  </div>
                  <p className="small muted">
                    E3 is not unlimited post-scarcity. No global post-scarcity
                    dates have been supplied.
                  </p>
                </div>
                <div className="e3-stat">
                  <span>
                    95<span>%</span>
                  </span>
                  <small>
                    WITHIN EVERY
                    <br />
                    INCOME QUINTILE
                  </small>
                </div>
              </section>
              <section className="dimension-section">
                <div className="section-title">
                  <h2>Eight dimensions. Uneven progress.</h2>
                  <span className="muted small">
                    No missing dates are inferred.
                  </span>
                </div>
                <div className="dimensions-grid">
                  {DIMENSIONS.map((d) => (
                    <div className="dimension-card" key={d.id}>
                      <span>{d.id}</span>
                      <div>
                        <h3>{d.name}</h3>
                        <p>{d.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}
          {view === "methodology" && (
            <>
              <section className="panel methodology-intro">
                <div className="method-icon">
                  <BookOpen size={28} />
                </div>
                <div>
                  <span className="eyebrow">
                    MASTER ERA FRAMEWORK · VERSION 1.0
                  </span>
                  <h2>A research-defined map of the transition.</h2>
                  <p>
                    Completed 24 October 2026. These are operational research
                    classifications, not universally accepted scientific
                    categories.
                  </p>
                  <p className="muted small">{FRAMEWORK.provenance}</p>
                </div>
              </section>
              <div className="method-grid">
                {[
                  [
                    "01",
                    "Windows, not deadlines",
                    "Fast / Bull, Central / Base and Slow / Bear are subjective scenario windows, not calibrated probabilities or confidence intervals. No probability percentages are assigned. Conditional windows and possible non-arrival are preserved.",
                  ],
                  [
                    "02",
                    "Evidence before certification",
                    "Early Era 1 is the established verified lower bound. Mid Era 1 is unresolved, and the exact frontier position is not independently certified. Forecasts and checklist interactions cannot automatically promote a stage.",
                  ],
                  [
                    "03",
                    "Three cognitive eras",
                    "Era 1 moves from general-purpose assistance to reliable bounded delegation. Era 2 covers general cognitive agency and operational AGI. Era 3 covers broad superhuman cognitive agency and operational cognitive ASI. Each contains Early, Mid and Late phases.",
                  ],
                  [
                    "04",
                    "Cognition is only one dimension",
                    "Alignment, robotics, energy and computing infrastructure, industry, scientific discovery and economic access require separate evidence. Cognitive progress alone does not establish safe control or essential-needs abundance.",
                  ],
                  [
                    "05",
                    "Source provenance & limits",
                    "The user-supplied initial dataset is the original baseline. Full phase-specific definitions and the eight domain names await the original document. Dependencies and blockers shown in detail panels are qualitative explanatory context, not additional research forecasts. No external citations or scientific consensus are invented.",
                  ],
                  [
                    "06",
                    "Reconcile future research explicitly",
                    "If the original document is supplied later, compare its full definitions and forecasts with this baseline, present the differences for review, then apply approved changes. This version imports hypothetical forecast JSON only; it does not automatically reconcile documents or change definitions.",
                  ],
                ].map(([n, title, body]) => (
                  <section className="panel method-card" key={n}>
                    <span>{n}</span>
                    <h3>{title}</h3>
                    <p>{body}</p>
                  </section>
                ))}
              </div>
              <Verification />
              <section className="panel data-method">
                <div>
                  <h2>Your research stays yours.</h2>
                  <p>
                    No accounts, paid APIs or remote data calls. Export the
                    original dataset, or import a separately labelled
                    hypothetical scenario. Personal settings remain on this
                    device.
                  </p>
                </div>
                <button
                  className="secondary-button"
                  onClick={() => setDataOpen(true)}
                >
                  <Download size={16} /> Manage research data
                </button>
              </section>
            </>
          )}
          <footer className="page-footer">
            <span>
              <Orbit size={14} /> AGI–ASI Transition Explorer
            </span>
            <span>
              Master Era Framework v1.0 <i /> 24 October 2026
            </span>
            <button onClick={() => navigate("methodology")}>
              Explore with uncertainty in mind <ArrowUpRight size={12} />
            </button>
          </footer>
        </main>
      </div>
      <nav className="mobile-bottom-nav" aria-label="Mobile navigation">
        {NAV.map((n) => (
          <button
            key={n.id}
            className={view === n.id ? "active" : ""}
            onClick={() => navigate(n.id)}
            aria-current={view === n.id ? "page" : undefined}
          >
            <n.icon size={20} />
            <span>{n.mobile}</span>
          </button>
        ))}
      </nav>
      {compare.length > 0 && !compareOpen && !selected && (
        <div className="compare-tray">
          <span>
            <GitCompareArrows size={16} />
            {compare.length} selected
          </span>
          <button onClick={() => setCompareOpen(true)}>
            Compare milestones <ArrowRight size={15} />
          </button>
          <button
            aria-label="Clear comparison"
            className="icon-button"
            onClick={() => setCompare([])}
          >
            <X size={16} />
          </button>
        </div>
      )}
      {notice && (
        <div className="toast" role="status">
          <Check size={16} />
          {notice}
        </div>
      )}
      {selected && (
        <Details
          key={selected}
          milestone={milestones.find((m) => m.id === selected)!}
          milestones={milestones}
          close={() => setSelected(null)}
          open={setSelected}
          compare={compare}
          toggleCompare={toggleCompare}
          age={age.enabled}
          referenceAge={age.age}
          referenceYear={age.year}
          hypothetical={hypothesisActive}
        />
      )}
      {compareOpen && (
        <Modal
          title="Milestone comparison"
          close={() => setCompareOpen(false)}
          wide
        >
          <div className="detail-content">
            <span className="eyebrow">
              SIDE BY SIDE ·{" "}
              {hypothesisActive ? "HYPOTHETICAL WINDOWS" : "ORIGINAL FRAMEWORK"}
            </span>
            <h2>Compare the milestones.</h2>
            <p className="muted">
              Cognitive capability, industrial progress and economic access have
              distinct thresholds.
            </p>
            <div className="comparison-picker">
              {milestones.map((m) => (
                <label key={m.id}>
                  <input
                    type="checkbox"
                    checked={compare.includes(m.id)}
                    onChange={() => toggleCompare(m.id)}
                  />
                  {m.name}
                </label>
              ))}
            </div>
            {compare.length === 0 ? (
              <div className="empty-state">
                Select milestones above to compare their scenario windows.
              </div>
            ) : (
              <div className="comparison-grid">
                {milestones
                  .filter((m) => compare.includes(m.id))
                  .map((m) => (
                    <article className="comparison-card" key={m.id}>
                      <h3>{m.name}</h3>
                      <p>{m.subtitle}</p>
                      {SCENARIOS.map((s) => (
                        <div className="comparison-window" key={s.id}>
                          <span style={{ color: s.color }}>
                            {s.name} / {s.alias}
                          </span>
                          <strong>{m.windows[s.id].label}</strong>
                          {age.enabled && (
                            <small>
                              {ageWindow(m.windows[s.id], age.age, age.year)}
                            </small>
                          )}
                        </div>
                      ))}
                      <p className="comparison-definition">{m.definition}</p>
                      <span className="small amber-text">
                        {m.id === "mid-1"
                          ? "Unresolved"
                          : "Provisional forecast"}
                      </span>
                    </article>
                  ))}
              </div>
            )}
            <p className="small muted">
              Different milestones do not imply a guaranteed chain of events.
              Every window is subjective; non-arrival remains possible.
            </p>
          </div>
        </Modal>
      )}
      {dataOpen && (
        <Modal
          title="Research data management"
          close={() => {
            setDataOpen(false);
            setPendingImport(null);
            setImportError("");
          }}
          wide
        >
          <div className="detail-content">
            <span className="eyebrow">LOCAL FIRST / NO ACCOUNT REQUIRED</span>
            <h2>Your data, your possibilities.</h2>
            <p className="muted">
              Original research is immutable in the interface. JSON imports are
              separately labelled user hypotheses and stored on this device.
            </p>
            <div className="data-actions">
              <button
                className="secondary-button"
                onClick={() =>
                  downloadJSON(originalExport, "master-era-framework-v1.json")
                }
              >
                <Download size={17} /> Export original framework
              </button>
              <button
                className="secondary-button"
                onClick={() =>
                  downloadJSON(
                    hypothesis || template,
                    "transition-hypothesis.json",
                  )
                }
              >
                <Download size={17} />{" "}
                {hypothesis
                  ? "Export saved hypothesis"
                  : "Download editable template"}
              </button>
              <button
                className="secondary-button"
                onClick={() => uploadRef.current?.click()}
              >
                <Upload size={17} /> Import hypothetical JSON
              </button>
              <input
                ref={uploadRef}
                type="file"
                accept=".json,application/json"
                hidden
                onChange={(e) => {
                  importFile(e.target.files?.[0]);
                  e.target.value = "";
                }}
              />
            </div>
            <p className="small muted">
              Edit forecast labels and numeric start/end values in the template.
              Use end: null for open-ended windows and preserve open, nonArrival
              and conditional flags where appropriate. Imports accept years
              2026–2500; windows beyond the display horizon appear as arrows.
            </p>
            {importError && (
              <div role="alert" className="import-error">
                {importError}
              </div>
            )}
            {hypothesis && !pendingImport && (
              <div className="saved-hypothesis">
                <FlaskConical size={20} />
                <div>
                  <strong>{hypothesis.title}</strong>
                  <p>
                    Saved locally ·{" "}
                    {hypothesisActive
                      ? "Currently active"
                      : "Original framework currently active"}
                  </p>
                </div>
                <button
                  className="secondary-button"
                  onClick={() => {
                    setHypothesisActive(!hypothesisActive);
                    setNotice(
                      hypothesisActive
                        ? "Original research restored."
                        : "User hypothesis activated.",
                    );
                  }}
                >
                  {hypothesisActive ? "Use original" : "Activate hypothesis"}
                </button>
              </div>
            )}
            {pendingImport && (
              <div className="import-review">
                <h3>Review hypothetical changes</h3>
                <p>
                  <strong>{pendingImport.title}</strong> · {changed.length}{" "}
                  changed scenario window{changed.length !== 1 ? "s" : ""}{" "}
                  compared with the original dataset.
                </p>
                <div className="import-diffs">
                  {changed.length === 0 ? (
                    <p>
                      No forecast changes. You may still save this as a
                      hypothetical baseline.
                    </p>
                  ) : (
                    changed.map((d) => (
                      <div key={`${d.id}-${d.scenario}`}>
                        <strong>
                          {MILESTONES.find((m) => m.id === d.id)?.name} /{" "}
                          {d.scenario}
                        </strong>
                        <span>
                          Original: {d.original.label}{" "}
                          <small>
                            ({d.original.start} → {d.original.end ?? "open"};
                            open: {String(!!d.original.open)}, absent:{" "}
                            {String(!!d.original.nonArrival)}, conditional:{" "}
                            {String(!!d.original.conditional)})
                          </small>
                        </span>
                        <span>
                          Hypothesis: {d.forecast.label}{" "}
                          <small>
                            ({d.forecast.start} → {d.forecast.end ?? "open"};
                            open: {String(!!d.forecast.open)}, absent:{" "}
                            {String(!!d.forecast.nonArrival)}, conditional:{" "}
                            {String(!!d.forecast.conditional)})
                          </small>
                        </span>
                      </div>
                    ))
                  )}
                </div>
                <div className="import-buttons">
                  <button className="primary-button" onClick={applyImport}>
                    Apply as hypothesis <ArrowRight size={16} />
                  </button>
                  <button
                    className="text-button"
                    onClick={() => setPendingImport(null)}
                  >
                    Cancel import
                  </button>
                </div>
              </div>
            )}
            <aside className="inline-note">
              <ShieldCheck size={19} />
              <p>
                Importing cannot change the original framework, definitions or
                verified status. A future source-document reconciliation must
                show differences before any baseline changes.
              </p>
            </aside>
          </div>
        </Modal>
      )}
    </div>
  );
}
function Verification() {
  const [expanded, setExpanded] = useState(false);
  return (
    <section className="panel verification-panel">
      <div className="verification-heading">
        <span className="verification-icon">
          <ShieldCheck size={20} />
        </span>
        <div>
          <span className="eyebrow">EVIDENCE BEFORE CERTIFICATION</span>
          <h2>The next threshold: Mid Era 1</h2>
        </div>
        <span className="status-chip amber">
          <span /> Unresolved
        </span>
      </div>
      <p>
        Professional-level bounded delegation must be demonstrated
        independently. No supporting evidence has been supplied.
      </p>
      <div className="verification-summary">
        <span>0 of 12 requirements independently verified</span>
        <span>12 evidence requirements</span>
      </div>
      <div className="verification-meter">
        <span />
      </div>
      <button
        className="verification-toggle"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
        aria-controls="verification-checklist"
      >
        {expanded
          ? "Hide verification requirements"
          : "Explore verification requirements"}
        <ChevronDown size={16} className={expanded ? "rotate" : ""} />
      </button>
      {expanded && (
        <div id="verification-checklist" className="verification-checklist">
          {VERIFICATION_REQUIREMENTS.map((r, i) => (
            <details key={r.title}>
              <summary>
                <span className="unchecked-box" aria-hidden="true" />
                <span>
                  {r.title}
                  <small>Not independently verified</small>
                </span>
                <ChevronDown size={14} />
              </summary>
              <p>{r.detail}</p>
              <span className="requirement-index">
                REQUIREMENT {String(i + 1).padStart(2, "0")}
              </span>
            </details>
          ))}
          <p className="small muted">
            This is an evidence checklist, not a self-certification tool. No
            stage promotion is calculated from incomplete evidence.
          </p>
        </div>
      )}
    </section>
  );
}
