# AGI–ASI Transition Explorer

A fully interactive, local-first research dashboard for the **Master Era Framework v1.0**, dated **24 October 2026**. Built with React 19, TypeScript, Vite, Tailwind CSS 4 and Lucide icons. No backend, account, remote fonts, analytics or API keys.

## Develop and preview

Use Node.js 24 (see `.nvmrc`).

```sh
npm ci
npm run dev
```

Vite listens on all interfaces, normally on port 5173. Use your environment's forwarded port, or your computer's LAN IP on the same Wi-Fi network, to open the development server on an iPhone. Cloud onboarding does not provide a public preview link. Do not expose development servers on an untrusted network; use a static HTTPS host for a shareable site.

```sh
npm run build
npm run preview -- --port 4173
```

The production app is in `dist/`. The preview server is for inspecting that build. Relative asset paths support hosting at a repository subpath as well as a domain root. Views are local UI state, so no server-side router or rewrite is needed.

## What works

- Overview with the established **Active Early Era 1 of the AGI transition** lower bound, unresolved next milestone and central-scenario summary cards.
- Eight cognitive milestones across three eras, with fast, central and slow windows. Toggle four parallel economic/industrial milestones.
- Central default, individual scenario filters, simultaneous comparison, three time horizons and one-click filter reset.
- Accessible forecast buttons and complete textual windows. Visual hatching denotes subjective windows, not statistical confidence. Arrows indicate open or off-screen windows; exact labels preserve non-arrival and conditionality.
- Mobile bottom navigation and bottom-sheet milestone panels; desktop sidebar navigation and side panels. Native dialog focus containment, Escape dismissal, restored trigger focus, visible focus rings and reduced-motion support.
- Operational definitions, dependencies, blockers, evidence and related milestones. Compare any selection, or immediately compare AGI, ASI and UK E3.
- Editable lifetime lens, initially age 19 in 2026, saved locally. Ages are approximate year-based illustrations; they do not guarantee arrival in a lifetime. Negative ages indicate windows before the implied birth year.
- An expandable 12-requirement Mid Era 1 evidence checklist. Every requirement is **Not independently verified**. This is not a self-certification form and never promotes stages.
- Separate scenario, capability/alignment, economic transition and methodology views. No alignment levels or dates are invented.
- Original-data export, editable hypothetical JSON templates, validated imports and a differences review before applying a hypothesis. Original research remains unchanged. Hypotheses are visibly labelled and can be deactivated immediately.
- Offline production reload after the first complete online load and service-worker installation. Research and interactions require no network. A local-first/offline-available indicator shows service-worker readiness. Offline caching requires HTTPS or localhost; development mode intentionally has no service worker.

## Research data and integrity

`src/data/framework.ts` contains the original structured dataset, definitions, forecast types, evidence requirements, dimensions, import validation and age calculations. All 36 supplied forecast labels are preserved exactly and protected by tests.

The original dataset remains separate from hypothetical overrides. Forecast labels are the authoritative human-readable windows. The numeric start `2026.75` is only a plotting approximation for “Late 2026”, not a prediction of an exact date. `end: null` denotes an unbounded end; `open`, `nonArrival` and `conditional` preserve different types of uncertainty. An arrow can also mean the selected chart horizon clips a later window; the text always supplies the full window.

Forecasts are **subjective scenario windows, not calibrated probabilities or confidence intervals**. Operational classifications are research-defined, not scientific consensus. Only Early Era 1 is the established verified lower bound. Other forecast milestones are provisional; Mid Era 1 remains unresolved. Cognitive ability does not establish alignment, industrial capability or economic abundance.

The supplied initial dataset is the source provenance. The full original framework document has not been supplied. Full phase-specific certification rules and the names of the eight cognitive domains are left unspecified. Detail-panel dependencies and blockers are qualitative explanatory context, not additional forecasts.

UK E3 uses the supplied threshold: at least 95% of residents **within every income quintile** reliably access the essential-needs basket for at most 20% of equivalised disposable income, or free, sustained for five years. The basket covers housing, food, water/sanitation, energy, essential healthcare, education, connectivity and basic mobility. **This is not unlimited post-scarcity.** No global post-scarcity dates are inferred.

If the full original document becomes available, compare definitions and dates against this baseline, present the differences for review, then make approved baseline changes. JSON imports currently change hypothetical forecast windows only; they do not reconcile uploaded documents or change operational definitions.

### Edit a hypothetical scenario

1. Open **Research data**, then **Download editable template**.
2. Edit the JSON's title and the forecast windows you want to change. You can keep only the milestone/scenario overrides you need.
3. Import that JSON. Review each change against the original, then choose **Apply as hypothesis**.
4. Choose **Restore original** to return to the research baseline. A saved hypothesis can be reactivated or exported in Research data.

Example:

```json
{
  "schemaVersion": 1,
  "kind": "user-hypothesis",
  "title": "My alternative AGI scenario",
  "windows": {
    "agi": {
      "central": {
        "label": "2040–2050 hypothetical",
        "start": 2040,
        "end": 2050
      }
    }
  }
}
```

Use `end: null` for an open-ended forecast. Optional flags are booleans: `open`, `nonArrival`, `conditional`. Keep the label and numeric range consistent. Imports reject unknown milestones/scenarios, malformed values, reversed ranges, years outside 2026–2500 and files above 250 KB. An original-data export is an archival research record, not a hypothetical import template. Local settings and hypotheses remain on the device; browser storage clearing removes them. Export hypotheses to back them up.

## Checks

```sh
npm test                  # Research integrity, ages and hypothetical import rules
npm run build             # Strict TypeScript check and production build
npx playwright install chromium  # Once, when no system Chromium is installed
npm run test:e2e           # Desktop + iPhone-sized Chromium interaction tests
npm run format:check
```

The browser suite verifies filters, horizons, functional details, keyboard focus return, age edits and persistence, comparisons, all views, checklist expansion, import review/export, original-data isolation, offline reload and viewport overflow. It also runs axe WCAG A/AA checks on the overview and a milestone panel. Mobile tests emulate a 390 × 844 touch viewport; a viewport sweep includes 320, 375, 768 and 1024 px. This is not a claim of testing physical iPhones or all Safari versions.

Playwright uses `/usr/bin/chromium` when present, otherwise its installed Chromium. Set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` to use another local executable. Test screenshots and reports live in ignored `test-results/` and `playwright-report/` directories.

## Deploy a static HTTPS website

**Netlify:** Import this repository. The included `netlify.toml` sets Node 24, build command `npm run build` and publish directory `dist`. Or build locally and upload `dist` to Netlify Drop. The generated HTTPS address can be opened on an iPhone.

**Cloudflare Pages:** Connect the repository, choose build command `npm run build`, output directory `dist`, and Node 24. No functions or environment secrets are required.

**GitHub Pages:** Push the implementation to your repository, set **Settings → Pages → Source → GitHub Actions**, then manually run **Deploy static explorer to GitHub Pages** in the Actions tab. The included workflow builds and tests the data before uploading `dist` and deploying it. Deployment is intentionally manual. No deployment has been triggered by this implementation session.

**Other static hosts:** Upload the contents of `dist` and serve `index.html`. Prefer `Cache-Control: no-cache` for `sw.js` and `index.html`, and long-lived caching for hashed `assets/` files. HTTPS enables offline reload on an iPhone. First-time offline visits cannot work until the app has been loaded online and its cache has finished installing.

## Structure

```text
src/
  data/framework.ts          Original research, types and data helpers
  data/framework.test.ts    Research and import integrity tests
  components/Timeline.tsx   Responsive forecast range chart
  components/Details.tsx    Operational milestone details
  components/Modal.tsx      Accessible side panel / bottom sheet
  components/AgeLens.tsx    Validated lifetime reference inputs
  App.tsx                   Dashboard views and local state
  styles.css                Visual system and responsive layouts
vite.config.ts              Build and offline-shell generation
 tests/explorer.spec.ts     Browser interaction and accessibility checks
```

There are no third-party runtime data requests. The custom range timeline avoids a large charting dependency and keeps each scenario interval keyboard-accessible with full textual labels.

## ASCII-only lab experiment

This checkout is exclusively `bigboibeanlb/agi-transition-lab`. Recovery point before this experiment: `04b1ebb89d19af1f0309b247e7b3fa889cb480b1`. The original `codexcloud` repository is a separate application.

All application-rendered controls, delimiters, status indicators and interval charts are ASCII text. Semantic HTML buttons/dialogs remain for keyboard support, but their native graphical appearance is removed. Checkbox/switch controls render `[ ]` / `[x]` buttons. Text inputs use underlined characters, and the page uses no SVG, canvas, images, graphical borders, gradients or shapes. Font glyphs, browser scrollbars, Safari keyboard/file picker and browser chrome are provided by the device; they are outside application rendering control.

`src/ascii/` provides a JSX presentation boundary, ASCII punctuation conversion and text symbols. This handles dynamic and imported research as well as static labels. Stored original data and exported JSON keep their original Unicode characters. Unrecognised non-ASCII characters display as explicit `\uXXXX` sequences, preserving information without inventing transliterations. Forecast charts quantise dates to responsive character cells; exact supplied windows remain visible alongside them. There are no numeric probability estimates in the original dataset, and none were introduced.

Lab settings now use `agi-lab-age` and `agi-lab-hypothesis`. Existing settings are read as a fallback only; writes never change the original app's storage keys. Offline caches are also scoped by website path.

Run `npm ci`, `npm test`, `npm run build`, and `npm run test:e2e` from this directory. Lab browser tests use port 4183 to avoid the original project's preview. Chromium tests cover desktop, touch-sized iPhone layouts, narrow viewports, keyboard controls, ASCII compliance, forbidden graphics, accessibility, imports and persistence. Physical iOS Safari still requires device verification.

To view on iPhone after the lab deployment completes, open https://bigboibeanlb.github.io/agi-transition-lab/ in Safari and refresh. The original remains at https://bigboibeanlb.github.io/codexcloud/.

To revert, ask Codex to restore only the lab to recovery commit `04b1ebb`, using a new restore commit and pushing to the lab's main branch. Keep the experiment in history; do not force-push or touch the original repository. Saved lab hypotheses can be exported before restoring.
