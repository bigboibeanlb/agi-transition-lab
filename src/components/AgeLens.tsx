import { useEffect, useState } from "react";
import { UserRound } from "lucide-react";
import { ageAt } from "../data/framework";
export type AgeSettings = { enabled: boolean; age: number; year: number };
export default function AgeLens({
  settings,
  change,
}: {
  settings: AgeSettings;
  change: (value: AgeSettings) => void;
}) {
  const [ageInput, setAgeInput] = useState(String(settings.age));
  const [yearInput, setYearInput] = useState(String(settings.year));
  useEffect(() => setAgeInput(String(settings.age)), [settings.age]);
  useEffect(() => setYearInput(String(settings.year)), [settings.year]);
  const valid = (text: string, min: number, max: number) =>
    text.trim() !== "" &&
    Number.isInteger(Number(text)) &&
    Number(text) >= min &&
    Number(text) <= max;
  const ageValid = valid(ageInput, 0, 120),
    yearValid = valid(yearInput, 1900, 2200);
  return (
    <section
      className="panel age-panel"
      aria-label="Personal lifetime perspective"
    >
      <div>
        <UserRound size={20} />
        <div>
          <h3>Your lifetime lens</h3>
          <p>Approximate ages, not a promise of arrival.</p>
        </div>
      </div>
      <label className="switch-label">
        Show ages
        <input
          type="checkbox"
          role="switch"
          checked={settings.enabled}
          onChange={(e) => change({ ...settings, enabled: e.target.checked })}
        />
      </label>
      <label>
        Reference age
        <input
          aria-label="Reference age"
          aria-invalid={!ageValid}
          type="number"
          inputMode="numeric"
          min="0"
          max="120"
          value={ageInput}
          onChange={(e) => {
            setAgeInput(e.target.value);
            if (valid(e.target.value, 0, 120))
              change({ ...settings, age: Number(e.target.value) });
          }}
          onBlur={() => {
            if (!ageValid) setAgeInput(String(settings.age));
          }}
        />
      </label>
      <label>
        Reference year
        <input
          aria-label="Reference year"
          aria-invalid={!yearValid}
          type="number"
          inputMode="numeric"
          min="1900"
          max="2200"
          value={yearInput}
          onChange={(e) => {
            setYearInput(e.target.value);
            if (valid(e.target.value, 1900, 2200))
              change({ ...settings, year: Number(e.target.value) });
          }}
          onBlur={() => {
            if (!yearValid) setYearInput(String(settings.year));
          }}
        />
      </label>
      <div className="age-examples">
        {[2042, 2057, 2072, 2077].map((y) => (
          <span key={y}>
            {y} <strong>≈ {ageAt(y, settings.age, settings.year)}</strong>
          </span>
        ))}
      </div>
      <p className="age-disclaimer">
        Illustrative year-based ages. Negative values indicate a window before
        the implied birth year.
      </p>
    </section>
  );
}
