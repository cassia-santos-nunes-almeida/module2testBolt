# EM&AC Lab — Module 2: Circuit Analysis

Interactive learning platform for electromagnetics and analog circuit analysis. React 19 + TypeScript app built with Vite. Installable as a PWA with offline support.

## Build & Dev

- `npm run dev` / `npm start` — Start Vite dev server (localhost:5173)
- `npm run build` — TypeScript check + production build (`tsc -b && vite build`)
- `npm run lint` — ESLint
- `npm run preview` — Preview production build locally

No test suite is configured yet.

## Architecture

- `src/components/modules/` — Page-level components for each learning module (Overview, ComponentPhysics, TimeDomain, LaplaceTheory, SDomainAnalysis, InteractiveLab). Each module contains co-located sub-components (e.g., `PoleZeroMap`, `StepResponsePanel`, `CircuitEquations`, `CircuitDiagram`).
- `src/components/layout/` — Layout, Sidebar, ErrorBoundary
- `src/components/common/` — Shared components (AiTutor, CircuitCharts, MathWrapper, Tabs)
- `src/utils/` — Math/physics calculations (componentMath.ts, circuitSolver.ts), utility helpers (cn.ts)
- `src/App.tsx` — Main app with React Router
- `src/main.tsx` — Entry point

## Conventions

- React functional components with TypeScript
- Tailwind CSS for styling (via `cn()` utility from `src/utils/cn.ts`)
- KaTeX for math rendering (wrapped by `MathWrapper` component)
- Recharts for data visualization / circuit plots
- Lucide React for icons
- React Router for navigation
- vite-plugin-pwa for service worker generation and offline caching (auto-update strategy)
- Optional Google Generative AI integration for AI tutor (API key in localStorage only)

## Deployment

Auto-deploys to GitHub Pages on push to `main` via `.github/workflows/deploy.yml`. The CI pipeline runs lint, type-check, and build before deploying. A `404.html` fallback is generated for SPA client-side routing. Uses `actions/deploy-pages` (requires Pages source set to "GitHub Actions" in repo settings).
