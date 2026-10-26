import {
  ArrowRight,
  Check,
  ChevronRight,
  Plus,
  RotateCcw,
  SlidersHorizontal,
} from "lucide-react";
import type { Milestone, ScenarioMode } from "../data/framework";
import { ageWindow, ERA_NAMES, SCENARIOS } from "../data/framework";
export type TimelineProps = {
  milestones: Milestone[];
  mode: ScenarioMode;
  setMode: (mode: ScenarioMode) => void;
  horizon: number;
  setHorizon: (h: number) => void;
  age: boolean;
  referenceAge: number;
  referenceYear: number;
  open: (id: string) => void;
  compare: string[];
  toggleCompare: (id: string) => void;
  showCognitive: boolean;
  setShowCognitive: (v: boolean) => void;
  showEconomic: boolean;
  setShowEconomic: (v: boolean) => void;
  reset: () => void;
  economicOnly?: boolean;
  forceAll?: boolean;
};
export default function Timeline(p: TimelineProps) {
  const scenarios = SCENARIOS.filter(
    (s) => p.forceAll || p.mode === "all" || s.id === p.mode,
  );
  const all = scenarios.length === 3;
  const ticks =
    p.horizon === 2040
      ? [2026, 2030, 2035, 2040]
      : p.horizon === 2060
        ? [2026, 2035, 2045, 2060]
        : [2026, 2040, 2060, 2080, 2100];
  const visible = p.milestones.filter((m) =>
    m.era === "parallel"
      ? p.showEconomic || p.economicOnly
      : p.showCognitive && !p.economicOnly,
  );
  const pos = (year: number) =>
    Math.max(0, Math.min(100, ((year - 2026) / (p.horizon - 2026)) * 100));
  return (
    <section
      className="panel timeline-panel"
      aria-label="Interactive forecast timeline"
    >
      <div className="panel-heading">
        <div>
          <span className="eyebrow">
            <span className="tiny-line" /> THE LONG VIEW
          </span>
          <h2>
            {p.economicOnly ? "The path to abundance" : "Transition timeline"}
            <span className="count-pill">{visible.length} milestones</span>
          </h2>
          <p>
            Possible arrival windows. Explore a milestone to see what it takes.
          </p>
        </div>
        <div className="horizon-control" aria-label="Timeline horizon">
          {[2040, 2060, 2100].map((h) => (
            <button
              key={h}
              aria-pressed={p.horizon === h}
              onClick={() => p.setHorizon(h)}
            >
              {h === 2040 ? "Near" : h === 2060 ? "Mid" : "Long"}
              <span>{h === 2100 ? "2100+" : h}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="timeline-toolbar">
        <div className="scenario-control" aria-label="Scenario selection">
          {!p.forceAll && (
            <>
              <button
                aria-label="Compare all"
                aria-pressed={p.mode === "all"}
                onClick={() => p.setMode("all")}
              >
                Compare all
              </button>
              {SCENARIOS.map((s) => (
                <button
                  key={s.id}
                  aria-label={`${s.name} / ${s.alias}`}
                  aria-pressed={p.mode === s.id}
                  onClick={() => p.setMode(s.id)}
                >
                  <i style={{ background: s.color }} />
                  {s.name}
                  <span className="scenario-alias"> / {s.alias}</span>
                </button>
              ))}
            </>
          )}
          {p.forceAll &&
            SCENARIOS.map((s) => (
              <span className="scenario-key" key={s.id}>
                <i style={{ background: s.color }} />
                {s.name} / {s.alias}
              </span>
            ))}
        </div>
        <button
          className="icon-button reset-button"
          onClick={p.reset}
          title="Reset timeline filters"
          aria-label="Reset timeline filters"
        >
          <RotateCcw size={15} />
        </button>
      </div>
      <div className="filter-row">
        <span className="filter-caption">
          <SlidersHorizontal size={13} /> SHOW
        </span>
        {!p.economicOnly && (
          <label>
            <input
              type="checkbox"
              checked={p.showCognitive}
              onChange={(e) => p.setShowCognitive(e.target.checked)}
            />{" "}
            Cognitive eras
          </label>
        )}
        <label>
          <input
            type="checkbox"
            checked={p.showEconomic || !!p.economicOnly}
            disabled={p.economicOnly}
            onChange={(e) => p.setShowEconomic(e.target.checked)}
          />{" "}
          {p.economicOnly ? "Economic milestones" : "Economic & industrial"}
        </label>
        <span className="window-hint">Shaded bars = scenario windows</span>
      </div>
      <div className={`timeline-chart ${all ? "all-scenarios" : ""}`}>
        <div className="axis-row">
          <div className="axis-name">MILESTONE</div>
          <div className="axis-track">
            {ticks.map((y, i) => (
              <span
                key={y}
                style={{ left: `${pos(y)}%` }}
                className={
                  i === 0
                    ? "first-tick"
                    : i === ticks.length - 1
                      ? "last-tick"
                      : ""
                }
              >
                {y}
                {y === 2100 ? "+" : ""}
              </span>
            ))}
          </div>
          <span className="axis-window">
            {p.age ? "YOUR AGE / WINDOW" : "ARRIVAL WINDOW"}
          </span>
        </div>
        {visible.length === 0 && (
          <div className="empty-state">
            No milestones selected.
            <button className="text-button" onClick={p.reset}>
              Reset filters <ArrowRight size={14} />
            </button>
          </div>
        )}
        {visible.map((m, index) => {
          const groupStart = index === 0 || m.era !== visible[index - 1].era;
          return (
            <div className={`milestone-group era-${m.era}`} key={m.id}>
              {groupStart && (
                <div className="era-divider">
                  <span className="era-dot" />
                  {m.era === "parallel" ? "PARALLEL PROGRESS" : `ERA ${m.era}`}
                  <span>
                    {m.era === "parallel"
                      ? "Technology → real-world access"
                      : ERA_NAMES[m.era]}
                  </span>
                </div>
              )}
              <div className="milestone-row">
                <div className="milestone-label">
                  <button
                    onClick={() => p.open(m.id)}
                    className="milestone-name"
                  >
                    {m.short}
                    {m.id === "agi" || m.id === "asi" ? (
                      <span className="mini-badge">{m.id.toUpperCase()}</span>
                    ) : null}
                    <ChevronRight size={12} />
                  </button>
                  <span className="milestone-subtitle">{m.subtitle}</span>
                  <button
                    className={`add-compare ${p.compare.includes(m.id) ? "is-selected" : ""}`}
                    onClick={() => p.toggleCompare(m.id)}
                    aria-label={`Compare ${m.name}: ${p.compare.includes(m.id) ? "remove from" : "add to"} selection`}
                  >
                    {p.compare.includes(m.id) ? (
                      <Check size={11} />
                    ) : (
                      <Plus size={11} />
                    )}
                    <span>Compare</span>
                  </button>
                </div>
                <div className="row-tracks">
                  {ticks.map((y) => (
                    <i
                      className="grid-line"
                      key={y}
                      style={{ left: `${pos(y)}%` }}
                    />
                  ))}
                  <span className="now-line" />
                  {scenarios.map((s) => {
                    const f = m.windows[s.id];
                    const offscreen = f.start >= p.horizon;
                    const left = offscreen ? 80 : pos(f.start);
                    const width = offscreen
                      ? 20
                      : Math.max(0.6, pos(f.end ?? p.horizon) - left);
                    const continues =
                      offscreen ||
                      f.end === null ||
                      f.open ||
                      f.end > p.horizon;
                    return (
                      <div className="track" key={s.id}>
                        <button
                          className={`forecast-bar ${continues ? "open-ended" : ""} ${offscreen ? "offscreen" : ""}`}
                          style={
                            {
                              left: `${left}%`,
                              width: `${Math.min(100 - left, width)}%`,
                              "--bar-color": s.color,
                            } as React.CSSProperties
                          }
                          aria-label={`${m.name}, ${s.name}: ${f.label}${p.age ? `, ${ageWindow(f, p.referenceAge, p.referenceYear)}` : ""}. Open details.`}
                          title={`${s.name}: ${f.label}`}
                          onClick={() => p.open(m.id)}
                        >
                          <span className="bar-fill" />
                          {continues && <ArrowRight size={12} />}
                        </button>
                      </div>
                    );
                  })}
                </div>
                <div className="window-values">
                  {scenarios.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => p.open(m.id)}
                      style={
                        { "--scenario-color": s.color } as React.CSSProperties
                      }
                    >
                      <span>
                        {p.age
                          ? ageWindow(
                              m.windows[s.id],
                              p.referenceAge,
                              p.referenceYear,
                            )
                          : m.windows[s.id].label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
        <div className="chart-bottom">
          <span>
            <i /> 2026 · Framework baseline
          </span>
          <span>
            Beyond the horizon <ArrowRight size={13} />
          </span>
        </div>
      </div>
      <div className="timeline-footnote">
        <span className="info-symbol">i</span>
        <p>
          Subjective scenario windows, not calibrated probabilities or
          confidence intervals. An arrow indicates an open or off-screen window.
          “Or absent” means arrival is not assured.
        </p>
      </div>
    </section>
  );
}
