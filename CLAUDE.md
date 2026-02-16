# CLAUDE.md

## Project Overview

**EM&AC Lab - Module 2: Circuit Analysis** — an interactive educational web app for electromagnetics and analog circuit analysis. Built for students taking introductory circuit theory courses at LUT University.

Live demo: https://cassia-santos-nunes-almeida.github.io/module2testBolt/

## Tech Stack

- **Framework**: React 19 + TypeScript ~5.9
- **Build tool**: Vite 7 (base path: `/module2testBolt/` for GitHub Pages)
- **Styling**: Tailwind CSS 4 + PostCSS + Autoprefixer
- **Math rendering**: KaTeX
- **Charts**: Recharts
- **Icons**: Lucide React
- **AI tutor**: Google Generative AI (Gemini, optional)
- **Routing**: React Router DOM 7

## Commands

```bash
npm run dev       # Start dev server on localhost:5173
npm run build     # TypeScript check + Vite production build
npm run lint      # ESLint (TypeScript + React hooks + React Refresh)
npm run preview   # Preview production build locally
```

There is no test framework configured. `npm run build` (which runs `tsc -b`) is the primary correctness check.

## Project Structure

```
src/
├── App.tsx                        # Router setup (6 routes)
├── main.tsx                       # React 19 entry point
├── index.css                      # Global styles
├── components/
│   ├── common/
│   │   ├── AiTutor.tsx            # Gemini-powered chat (closed/docked/floating modes)
│   │   ├── MathWrapper.tsx        # KaTeX rendering wrapper
│   │   └── Tabs.tsx               # Reusable tab component
│   ├── layout/
│   │   ├── Layout.tsx             # Page shell: sidebar + content + AI tutor toggle
│   │   ├── Sidebar.tsx            # Navigation with 6-step learning path
│   │   └── ErrorBoundary.tsx      # React error boundary
│   └── modules/
│       ├── Overview.tsx           # Home page (objectives, learning path, about)
│       ├── ComponentPhysics.tsx   # Resistor/capacitor/inductor physics with SVG
│       ├── TimeDomain.tsx         # Time-domain vs s-domain circuit analysis
│       ├── LaplaceTheory.tsx      # Laplace transform theory and examples
│       ├── SDomainAnalysis.tsx    # Transfer functions, pole-zero plots
│       └── InteractiveLab.tsx     # Real-time circuit simulation
├── utils/
│   ├── componentMath.ts           # R/L/C physics formulas, material data
│   ├── circuitSolver.ts           # ODE solvers for RC/RL/RLC circuits
│   └── cn.ts                      # Tailwind className utility (clsx + twMerge)
└── assets/
```

## Architecture Notes

- **All computation is client-side** — no backend. Circuit solving uses numerical ODE integration in `circuitSolver.ts`.
- **State management** uses React hooks only (`useState`, `useMemo`, `useCallback`). No external state library.
- **AI tutor API key** is stored in browser localStorage only — never sent to any server other than Google's API.
- **Deployment** is automated via GitHub Actions: push to `main` triggers build and deploy to `gh-pages` branch.

## Coding Conventions

- TypeScript strict mode with incremental compilation (`tsc -b`)
- ESLint with `@eslint/js` recommended + `typescript-eslint` recommended + React hooks/refresh plugins
- Tailwind utility classes for all styling; custom color palette `engineering-blue` defined in `tailwind.config.js`
- `cn()` utility from `src/utils/cn.ts` for merging Tailwind classes (wraps `clsx` + `tailwind-merge`)
- KaTeX math rendered via `MathWrapper` component — use `displayMode` prop for block-level equations
- Component files use PascalCase, utility files use camelCase

## Key Patterns

- Expensive computations (ODE solving, math) are memoized with `useMemo`
- Module components live in `src/components/modules/` and map 1:1 to routes
- Reusable UI goes in `src/components/common/`
- Layout shell in `src/components/layout/`
- Circuit math utilities are pure functions in `src/utils/`

## Important Warnings

- The Vite `base` path is set to `/module2testBolt/` — this is required for GitHub Pages deployment. Do not remove it.
- No test suite exists. Run `npm run build` to catch type errors before committing.
- The AI tutor requires a user-provided Google Gemini API key. Never hardcode API keys.
