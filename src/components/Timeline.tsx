import { useEffect, useRef, useState } from "react";
import type { Forecast, Milestone, ScenarioMode } from "../data/framework";
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

export function interval(f: Forecast, horizon: number, columns: number) {
  const pos = (year: number) =>
    Math.max(
      0,
      Math.min(
        columns - 1,
        Math.round(((year - 2026) / (horizon - 2026)) * (columns - 1)),
      ),
    );
  if (f.start >= horizon) return ".".repeat(columns - 1) + ">";
  const start = pos(f.start),
    end = pos(f.end ?? horizon);
  const cells: string[] = Array.from({ length: columns }, (_, i) =>
    i < start || i > end ? "." : "=",
  );
  cells[start] = "[";
  cells[end] = f.open || f.end === null || f.end > horizon ? ">" : "]";
  return cells.join("");
}
export default function Timeline(p: TimelineProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [columns, setColumns] = useState(26);
  useEffect(() => {
    const node = ref.current!;
    const observer = new ResizeObserver((entries) =>
      setColumns(
        Math.max(
          18,
          Math.min(70, Math.floor(entries[0].contentRect.width / 8.5)),
        ),
      ),
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  const scenarios = SCENARIOS.filter(
    (s) => p.forceAll || p.mode === "all" || p.mode === s.id,
  );
  const visible = p.milestones.filter((m) =>
    m.era === "parallel"
      ? p.showEconomic || p.economicOnly
      : p.showCognitive && !p.economicOnly,
  );
  return (
    <section
      className="panel timeline-panel"
      aria-label="Interactive forecast timeline"
    >
      <header>
        <span className="eyebrow">
          FORECAST INSTRUMENT / {visible.length} milestones
        </span>
        <h2>
          {p.economicOnly ? "The path to abundance" : "Transition timeline"}
        </h2>
        <p>
          Each character is a time bin. Select a range for its full research
          record.
        </p>
      </header>
      <div className="horizon-control" aria-label="Timeline horizon">
        {[2040, 2060, 2100].map((h) => (
          <button
            key={h}
            aria-pressed={p.horizon === h}
            onClick={() => p.setHorizon(h)}
          >
            {h === 2040 ? "Near" : h === 2060 ? "Mid" : "Long"}{" "}
            {h === 2100 ? "2100+" : h}
          </button>
        ))}
      </div>
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
                aria-pressed={p.mode === s.id}
                onClick={() => p.setMode(s.id)}
              >
                {s.name} / {s.alias}
              </button>
            ))}
          </>
        )}
        <button onClick={p.reset} aria-label="Reset timeline filters">
          Reset
        </button>
      </div>
      <div className="filter-row">
        {!p.economicOnly && (
          <label>
            <input
              type="checkbox"
              aria-label="Cognitive eras"
              checked={p.showCognitive}
              onChange={(e) => p.setShowCognitive(e.target.checked)}
            />{" "}
            Cognitive eras
          </label>
        )}
        <label>
          <input
            type="checkbox"
            aria-label={
              p.economicOnly ? "Economic milestones" : "Economic & industrial"
            }
            checked={p.showEconomic || !!p.economicOnly}
            disabled={p.economicOnly}
            onChange={(e) => p.setShowEconomic(e.target.checked)}
          />
          {p.economicOnly ? "Economic milestones" : "Economic & industrial"}
        </label>
      </div>
      <div ref={ref} className="ascii-chart">
        <div className="axis-row">
          <span>2026</span>
          <span>{p.horizon === 2100 ? "2100+" : p.horizon}</span>
        </div>
        {visible.length === 0 && (
          <p>No milestones selected. Use Reset to restore the timeline.</p>
        )}
        {visible.map((m, index) => (
          <article className="milestone-group" key={m.id}>
            {(index === 0 || visible[index - 1].era !== m.era) && (
              <h3>
                {m.era === "parallel"
                  ? "PARALLEL PROGRESS"
                  : `ERA ${m.era} / ${ERA_NAMES[m.era]}`}
              </h3>
            )}
            <div className="milestone-label">
              <button onClick={() => p.open(m.id)}>{m.name}</button>
              <button
                aria-label={`Compare ${m.name}: ${p.compare.includes(m.id) ? "remove from" : "add to"} selection`}
                onClick={() => p.toggleCompare(m.id)}
              >
                {p.compare.includes(m.id) ? "x" : "+"} Compare
              </button>
            </div>
            <p>{m.subtitle}</p>
            {scenarios.map((s) => {
              const f = m.windows[s.id];
              return (
                <div className="ascii-range" key={s.id}>
                  <span>
                    {s.name} / {s.alias}
                  </span>
                  <button
                    className={`forecast-bar ${f.start >= p.horizon ? "offscreen" : ""}`}
                    aria-label={`${m.name}, ${s.name}: ${f.label}${p.age ? `, ${ageWindow(f, p.referenceAge, p.referenceYear)}` : ""}. Open details.`}
                    onClick={() => p.open(m.id)}
                  >
                    <span className="range-glyphs" aria-hidden="true">
                      {interval(f, p.horizon, columns)}
                    </span>
                  </button>
                  <span>{f.label}</span>
                  {p.age && (
                    <span>{ageWindow(f, p.referenceAge, p.referenceYear)}</span>
                  )}
                </div>
              );
            })}
          </article>
        ))}
      </div>
      <p className="timeline-footnote">
        Legend: . outside window; [ start; = possible arrival; ] end; &gt; open
        or beyond horizon. Character positions are approximate; labels give the
        original windows. Subjective scenarios, not probabilities or confidence
        intervals. "Or absent" preserves non-arrival uncertainty.
      </p>
    </section>
  );
}
