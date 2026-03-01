# EM&AC Lab — Module 2: Circuit Analysis

Interactive learning platform for electromagnetics and analog circuit analysis.
React 19 + TypeScript + Vite 7 + Tailwind CSS 4. Installable as PWA with offline support.

## Build & Dev

```bash
npm run dev        # Vite dev server at localhost:5173
npm run build      # tsc -b && vite build
npm run lint       # ESLint
npm run test       # Vitest unit tests
npm run preview    # Preview production build
```

## Architecture

### Source Layout
```
src/
├── app/          → Entry point (main.tsx, App.tsx, index.css)
├── modules/      → One folder per learning module (page-level components)
├── components/
│   ├── ui/       → Shared UI primitives (MathWrapper, Tabs)
│   ├── circuit/  → Circuit-specific shared components (charts, sliders, diagrams)
│   ├── ai/       → AI Tutor components
│   └── layout/   → App shell (Layout, Sidebar, ErrorBoundary)
├── hooks/        → Custom React hooks (useCircuitParams, useDraggable, useLocalStorage)
├── types/        → All shared TypeScript interfaces and type aliases
└── utils/        → Pure functions (circuitSolver, componentMath, cn, constants)
```

### Key Patterns
- Types: ALL shared types in `src/types/circuit.ts` — never redeclare
- Styling: Tailwind CSS via `cn()` utility from `src/utils/cn`
- Math rendering: KaTeX via `MathWrapper` component
- Charts: Recharts (LineChart, ScatterChart, ResponsiveContainer)
- Circuit simulation: `calculateCircuitResponse()` from `src/utils/circuitSolver`
- Damping classification: single `CRITICAL_DAMPING_TOLERANCE` constant in `src/utils/constants`
- Icons: Lucide React (tree-shakeable SVG icons)

### State Management
- All state is local (useState/useMemo). No global store.
- Shared simulation logic in `useCircuitParams` hook (src/hooks/).
- AI Tutor state lives in Layout component, persists across navigation.

### Routes (6 modules)
- `/` → Overview
- `/component-physics` → R/L/C from first principles
- `/circuit-analysis` → Time-domain analysis
- `/laplace-theory` → Laplace transform theory
- `/s-domain` → S-domain analysis & pole-zero maps
- `/interactive-lab` → Real-time circuit simulator

## Conventions

- React functional components with TypeScript, named exports
- No default exports except App.tsx
- Tailwind for ALL styling. No inline style objects except dynamic SVG coords
- `useMemo` for expensive computations (circuit solver, chart data)
- Keep each file under 200 lines
- Test files co-located: `foo.test.ts` next to `foo.ts`

## Skills
- When creating a new module → read `skills/module-builder/SKILL.md` first
- When refactoring code → read `skills/refactor/SKILL.md` first

## Current Sprint
Read `context/current-sprint.md` for current work items.

## Context Files
- `context/current-sprint.md` — Current work items and priorities
- `context/decisions.md` — Architecture decision log
- `context/known-issues.md` — Active bugs and limitations

## Deployment
Auto-deploys to GitHub Pages on push to `main` via `.github/workflows/deploy.yml`.
CI: lint → test → build → deploy.

## Do Not Touch
- `public/` PWA icons — generated assets, do not modify manually
- `package-lock.json` — auto-generated, do not edit
