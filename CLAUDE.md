# EM&AC Lab — Module 2: Circuit Analysis

Interactive learning platform for electromagnetics and analog circuit analysis. React 19 + TypeScript app built with Vite.

## Build & Dev

- `npm run dev` — Start Vite dev server (localhost:5173)
- `npm run build` — TypeScript check + production build (`tsc -b && vite build`)
- `npm run lint` — ESLint
- `npm run preview` — Preview production build locally

No test suite is configured yet.

## Architecture

- `src/components/modules/` — Page-level components for each learning module (Overview, ComponentPhysics, TimeDomain, LaplaceTheory, SDomainAnalysis, InteractiveLab)
- `src/components/layout/` — Layout, Sidebar, ErrorBoundary
- `src/components/common/` — Shared components (AiTutor, MathWrapper, Tabs)
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
- Optional Google Generative AI integration for AI tutor (API key in localStorage only)

## Deployment

Auto-deploys to GitHub Pages on push to `main` via `.github/workflows/deploy.yml`. Deploys from `gh-pages` branch.
