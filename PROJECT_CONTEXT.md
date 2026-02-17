# Project Context — EM&AC Lab: Module 2

> Auto-generated project analysis. Use as context in future prompts.

---

## 1. Stack

| Layer | Technology | Version | Notes |
|-------|-----------|---------|-------|
| **Framework** | React | 19.2.x | Functional components, StrictMode enabled |
| **Language** | TypeScript | ~5.9.3 | Strict mode, `noUnusedLocals`, `noUnusedParameters` |
| **Build tool** | Vite | 7.3.x | `@vitejs/plugin-react`, base path `/module2testBolt/` |
| **Styling** | Tailwind CSS | 4.1.x | PostCSS plugin (`@tailwindcss/postcss`), custom `engineering-blue` palette, `cn()` utility (`clsx` + `tailwind-merge`) |
| **Routing** | React Router DOM | 7.13.x | `BrowserRouter` with `basename` from `import.meta.env.BASE_URL` |
| **Charts** | Recharts | 3.7.x | `LineChart`, `ScatterChart`, `ResponsiveContainer` |
| **Math rendering** | KaTeX | 0.16.x | Wrapped by custom `MathWrapper` component; CSS imported globally |
| **Icons** | Lucide React | 0.563.x | Tree-shakeable SVG icons |
| **AI integration** | Google Generative AI SDK | 0.24.x | Gemini 2.0 Flash model via `@google/generative-ai`; API key stored in `localStorage` |
| **Linting** | ESLint 9 | flat config | `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`, `typescript-eslint` |
| **Deployment** | GitHub Pages | — | GitHub Actions workflow (`.github/workflows/deploy.yml`), triggers on push to `main` |
| **Package manager** | npm | lockfile v3 | `package-lock.json` present |

### Not present

- No test framework (no Jest, Vitest, Playwright, etc.)
- No state management library (no Redux, Zustand, Jotai — all state is local `useState`)
- No CSS-in-JS beyond Tailwind
- No backend / server-side code
- No bundled component library (all UI is custom)

---

## 2. Folder Structure

```
module2testBolt/
├── .github/workflows/deploy.yml   # CI/CD — GitHub Pages deploy on push to main
├── public/                         # Static assets (favicon, etc.)
├── src/
│   ├── main.tsx                    # Entry point: ReactDOM.createRoot, StrictMode
│   ├── App.tsx                     # Router config — 6 routes
│   ├── index.css                   # Global styles + Tailwind import
│   ├── assets/                     # Static SVGs (react.svg, vite.svg — unused starter assets)
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Layout.tsx          # Shell: Sidebar + main content + AI Tutor toggle
│   │   │   ├── Sidebar.tsx         # Navigation sidebar with learning-path progress
│   │   │   └── ErrorBoundary.tsx   # Class-based React error boundary
│   │   ├── common/
│   │   │   ├── AiTutor.tsx         # Gemini-powered chat panel (docked/floating/closed)
│   │   │   ├── CircuitCharts.tsx   # Shared chart components (tooltip, R_crit marker, duration control, pole tooltip)
│   │   │   ├── MathWrapper.tsx     # KaTeX rendering wrapper (inline + block)
│   │   │   └── Tabs.tsx            # Generic tab component
│   │   └── modules/
│   │       ├── Overview.tsx        # Landing page — objectives, learning path, about/license
│   │       ├── ComponentPhysics.tsx # R/L/C from first principles — interactive sliders + SVG diagrams
│   │       ├── TimeDomain.tsx      # Time-domain vs s-domain comparison for RC, RL, RLC
│   │       ├── LaplaceTheory.tsx   # Laplace transform theory, tables, worked examples
│   │       ├── SDomainAnalysis.tsx  # Transfer functions, pole-zero maps, interactive RLC lab
│   │       └── InteractiveLab.tsx  # Full circuit simulator — RC/RL/RLC, step/impulse, live charts
│   └── utils/
│       ├── cn.ts                   # Tailwind class merger (clsx + twMerge)
│       ├── componentMath.ts        # Formulas (LaTeX strings), material properties, R/L/C calculators
│       └── circuitSolver.ts        # Circuit response engine: step/impulse for RC, RL, RLC (all damping types), transfer function + poles/zeros
├── index.html                      # HTML shell
├── package.json
├── tsconfig.json / tsconfig.app.json / tsconfig.node.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── eslint.config.js
└── CLAUDE.md                       # Project instructions for AI assistants
```

**Total source files:** 16 TypeScript/TSX files across `src/`.

---

## 3. Database Schema

**There is no database.** This is a purely client-side single-page application.

All data is:
- **Hardcoded constants** — material properties, LaTeX formula strings, Laplace transform tables, learning-path metadata (in `componentMath.ts` and inline in components)
- **Computed at runtime** — circuit responses generated mathematically from user-selected slider values (in `circuitSolver.ts`)
- **localStorage** — only one key: `emac_gemini_api_key` (the user's Google Gemini API key for the AI Tutor feature)

### Key data shapes (TypeScript interfaces in `circuitSolver.ts`)

| Interface | Fields | Purpose |
|-----------|--------|---------|
| `CircuitParams` | `R`, `L`, `C`, `voltage` | Input to the solver |
| `TimeSeriesPoint` | `time`, `voltage`, `current` | Single data point in a response |
| `CircuitResponse` | `data[]`, `dampingType?`, `alpha?`, `omega0?`, `zeta?`, `timeConstant?` | Full simulation output |
| `Complex` | `real`, `imag` | Pole/zero representation |
| `MaterialProperty` | `name`, `resistivity?`, `permittivity?`, `permeability?` | Material constants for R/L/C calculators |

---

## 4. Authentication

**There is no user authentication.** The app is a static site served from GitHub Pages with no login, accounts, or protected routes.

The only credential-like value is the **Google Gemini API key** for the optional AI Tutor:
- Entered via a password input in the `AiTutor` component
- Stored in `localStorage` under key `emac_gemini_api_key`
- Retrieved on mount; if present, auto-initializes the chat session
- Can be cleared/changed via a key icon button in the tutor header
- The key is sent directly to Google's Generative AI SDK client-side — there is no backend proxy

### Security note
The API key sits in `localStorage` in plain text and is used in direct browser-to-Google API calls. This is acceptable for a student learning tool but would be a concern in a production app.

---

## 5. Main User Flows

### Flow 1: Guided Learning Path
1. User lands on **Overview** (`/`) — sees course objectives, learning path cards, AI tutor callout
2. Navigates through modules in sidebar order:
   - **Component Physics** (`/component-physics`) — selects R, L, or C tab; adjusts physical parameters via sliders; sees calculated component value and SVG diagrams update in real-time
   - **Circuit Analysis** (`/circuit-analysis`) — selects RC, RL, or RLC tab; reads side-by-side time-domain vs s-domain derivations; sees method comparison table and response type reference
   - **Laplace Theory** (`/laplace-theory`) — reads transform definition; references transform pair and properties tables; studies worked examples (tabs)
   - **S-Domain Analysis** (`/s-domain`) — reads transfer function theory; adjusts R/L/C sliders to see transfer function, pole-zero map, and step response update live; studies damping behavior
   - **Interactive Lab** (`/interactive-lab`) — selects circuit type (RC/RL/RLC) and input type (step/impulse); tunes R, L, C, voltage, and duration; watches real-time voltage/current charts; reads dynamic equation panel and analysis sidebar

### Flow 2: AI Tutoring
1. User clicks "AI Circuit Tutor" vertical button on right edge (any page)
2. If no API key saved → enters Gemini API key → "Start Tutoring"
3. Tutor opens in **docked** mode (sidebar panel) or can be detached to **floating** mode
4. User types circuit-analysis questions; receives LaTeX-formatted answers rendered with KaTeX
5. Session persists while navigating between pages (state lives in `Layout`)
6. User can clear API key to reset

### Flow 3: Component Exploration (Component Physics page)
1. User selects component tab (Resistor / Capacitor / Inductor)
2. Left column: reads theory (formulas, definitions) and clicks material buttons to change material properties
3. Right column: sees circuit symbol SVG, physical structure SVG (side view + cross section) that scales with slider values, adjusts sliders (length, area, resistivity, etc.), sees calculated value update

### Flow 4: Interactive Circuit Simulation (Interactive Lab)
1. Selects circuit type via tabs (RC, RL, RLC)
2. Toggles input type (Step / Impulse)
3. Adjusts sliders: R, L (if applicable), C (if applicable), voltage, duration
4. Sees: SVG circuit diagram, relevant equations panel, live Recharts line chart with time-constant and damped-period markers, analysis sidebar (time constant or full RLC damping parameters)
5. Can toggle voltage/current visibility on the chart
6. Reset button returns all values to defaults

---

## 6. Current Pain Points & Technical Debt

### Architecture / Patterns

1. **Large monolithic components** — `ComponentPhysics.tsx` (~760 lines), `InteractiveLab.tsx` (~680 lines), `SDomainAnalysis.tsx` (~540 lines), and `TimeDomain.tsx` (~635 lines) contain deeply nested JSX with inline SVG markup. Extracting sub-components would improve readability and testability.

2. **Inline SVG diagrams** — Circuit symbols and physical-structure drawings are hardcoded SVG in JSX. These could be extracted into reusable components or SVG files. The SVG coordinate math (e.g., `bodyW`, `plateH`, `coilR`) is interleaved with component logic.

3. **Duplicated slider/control patterns** — The R/L/C slider markup is repeated across `SDomainAnalysis.tsx` (InteractiveTab) and `InteractiveLab.tsx` with slight differences. A shared `CircuitParameterSliders` component would reduce duplication.

4. **No global state management** — All state is local `useState`. The AI Tutor state (messages, API key, mode) lives in `Layout.tsx` / `AiTutor.tsx` and would be lost on a full remount. For this app's scale this is acceptable, but it means there's no shared state between module pages.

5. **Duplicated damping-type detection** — The logic for classifying damping type (`zeta > 1`, `zeta < 1`, `zeta ≈ 1`) appears in both `circuitSolver.ts` (with tolerance `0.01`) and `SDomainAnalysis.tsx` (with tolerance `0.05`). These should use a single source of truth.

6. **`CircuitType` defined in two places** — `type CircuitType = 'RC' | 'RL' | 'RLC'` is declared in both `circuitSolver.ts` and `TimeDomain.tsx`. Should be imported from one location.

### Testing & Quality

7. **No test suite** — Zero tests. No test runner configured. Given the math-heavy nature of `circuitSolver.ts` and `componentMath.ts`, unit tests would be high-value.

8. **No CI linting/type-check** — The GitHub Actions workflow only runs `npm run build` (which includes `tsc -b`), but does not run `npm run lint` separately. Lint errors won't block deploys unless they also cause type errors.

### Styling & UX

9. **Tailwind v4 with v3-style config** — The project imports Tailwind via `@import "tailwindcss"` (v4 style) and uses `@tailwindcss/postcss`, but also has a `tailwind.config.js` with v3-style `content` array and `theme.extend`. Tailwind v4 uses CSS-based configuration by default; the JS config file may be partially redundant or could cause confusion.

10. **Unused starter assets** — `src/assets/react.svg` and `src/assets/vite.svg` are Vite starter template files that aren't imported anywhere.

11. **Global heading styles may conflict with Tailwind** — `index.css` sets global `h1`–`h4` styles with hardcoded colors and sizes, which can conflict with Tailwind utility classes applied to headings in components.

### Performance

12. **Chart re-renders on every slider change** — `InteractiveLab` and `SDomainAnalysis` recalculate full circuit responses and re-render Recharts on each slider drag. The `useMemo` hooks help, but the data arrays can be large (1000+ points). Debouncing slider input or reducing sample density during drag could improve smoothness.

13. **KaTeX renders per-instance** — Each `MathWrapper` mounts and calls `katex.render` independently. Pages with many formulas (e.g., `TimeDomain.tsx` with 50+ math expressions) pay a per-element rendering cost. This is fine for the current scale but worth noting.

### Security

14. **API key in localStorage** — The Gemini API key is stored in plain text in `localStorage`. There is no backend proxy to keep the key server-side. Acceptable for a student tool, but a risk if deployed more broadly.

15. **`eslint-disable` comment** — `AiTutor.tsx:181` has `// eslint-disable-next-line react-hooks/exhaustive-deps` to suppress a dependency warning on a mount-only effect. The effect calls `initializeChat` which references state setters — the suppression is intentional but should be documented.

### Missing Features (not bugs, but gaps)

16. **No responsive/mobile layout** — The sidebar is a fixed 256px column. On small screens the layout will overflow horizontally. No mobile menu or responsive breakpoints.

17. **No dark mode** — Despite the custom color palette, there's no dark mode support.

18. **No progress tracking** — The sidebar shows a visual learning-path stepper but doesn't persist any completion state. Navigating away and back doesn't remember progress.

19. **No error handling on AI responses** — The `AiTutor` catch block shows a generic error message but doesn't distinguish between invalid API keys, rate limits, or network failures.
