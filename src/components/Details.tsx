import {
  ArrowRight,
  GitCompareArrows,
  ShieldCheck,
  Unplug,
} from "../ascii/symbols";
import { ageWindow, SCENARIOS, type Milestone } from "../data/framework";
import Modal from "./Modal";
export default function Details({
  milestone: m,
  close,
  open,
  milestones,
  compare,
  toggleCompare,
  age,
  referenceAge,
  referenceYear,
  hypothetical,
}: {
  milestone: Milestone;
  close: () => void;
  open: (id: string) => void;
  milestones: Milestone[];
  compare: string[];
  toggleCompare: (id: string) => void;
  age: boolean;
  referenceAge: number;
  referenceYear: number;
  hypothetical: boolean;
}) {
  return (
    <Modal title={`${m.name} details`} close={close}>
      <div className="detail-content">
        <span className={`detail-era era-${m.era}`}>
          {m.era === "parallel"
            ? `${m.dimension} · Parallel progress`
            : `Era ${m.era} · Cognitive framework`}
        </span>
        <h2>{m.name}</h2>
        <p className="detail-subtitle">{m.subtitle}</p>
        <span className="status-chip amber">
          <span /> {m.id === "mid-1" ? "Unresolved" : "Provisional forecast"} ·
          Not independently verified
        </span>
        <h3>Operational definition</h3>
        <p>{m.definition}</p>
        <h3>
          Scenario windows{" "}
          {hypothetical && (
            <span className="hypothesis-label">Hypothetical</span>
          )}
        </h3>
        <div className="detail-windows">
          {SCENARIOS.map((s) => (
            <div key={s.id}>
              <div>
                <i style={{ background: s.color }} />
                <span>
                  {s.name} / {s.alias}
                </span>
              </div>
              <strong>{m.windows[s.id].label}</strong>
              {age && (
                <small>
                  {ageWindow(m.windows[s.id], referenceAge, referenceYear)}
                </small>
              )}
            </div>
          ))}
        </div>
        <p className="muted small">
          These are subjective projections. They do not certify achievement or
          guarantee arrival within a lifetime.
        </p>
        <button
          className="secondary-button full-width"
          onClick={() => toggleCompare(m.id)}
        >
          <GitCompareArrows size={16} />
          {compare.includes(m.id)
            ? "Remove from comparison"
            : "Add to comparison"}
        </button>
        <h3>Key technical dependencies</h3>
        <ul className="detail-list">
          {m.dependencies.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
        <h3>Main uncertainties & blockers</h3>
        <ul className="detail-list">
          {m.uncertainties.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
        <h3>
          <ShieldCheck size={16} /> Evidence for verified achievement
        </h3>
        <ul className="detail-list evidence-list">
          {m.evidence.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
        <aside className="inline-note">
          <Unplug size={17} />
          <p>
            Cognitive capability and alignment are independent. No stage
            promotion is inferred from these forecasts.
          </p>
        </aside>
        <h3>Connected milestones</h3>
        <div className="related-list">
          {m.related.map((id) => (
            <button key={id} onClick={() => open(id)}>
              {milestones.find((x) => x.id === id)?.name}
              <ArrowRight size={14} />
            </button>
          ))}
        </div>
      </div>
    </Modal>
  );
}
