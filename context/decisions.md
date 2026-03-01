# Architecture Decisions

## ADR-001: No global state management library
- **Date**: 2026-03-01
- **Decision**: Keep all state local (useState/useMemo). No Redux/Zustand/Jotai.
- **Rationale**: App has 6 independent pages with no cross-page shared state. AI Tutor state lives in Layout and persists via component lifecycle. Adding a store adds complexity with no measurable benefit at this scale.
- **Status**: Active

## ADR-002: Module-per-folder structure
- **Date**: 2026-03-01
- **Decision**: Each learning module gets its own directory under src/modules/ with co-located sub-components.
- **Rationale**: Monolithic 600-700 line files were the #1 maintainability issue. Folder-per-module keeps related code together while enforcing single-responsibility per file.
- **Status**: Active

## ADR-003: Single damping tolerance constant
- **Date**: 2026-03-01
- **Decision**: Use CRITICAL_DAMPING_TOLERANCE = 0.01 everywhere via shared constants.
- **Rationale**: Previously had 0.01 in circuitSolver.ts and 0.05 in SDomainAnalysis.tsx. The 0.05 tolerance was too loose (classifying zeta=1.04 as critically damped). 0.01 is standard in engineering textbooks.
- **Status**: Active

## ADR-004: Centralized type definitions
- **Date**: 2026-03-01
- **Decision**: All shared types live in src/types/circuit.ts. No duplicate type declarations.
- **Rationale**: CircuitType was defined identically in circuitSolver.ts and TimeDomain.tsx. Single source of truth prevents drift.
- **Status**: Active

## ADR-005: Custom hooks for shared logic
- **Date**: 2026-03-01
- **Decision**: Extract shared stateful patterns into src/hooks/ (useCircuitParams, useDraggable, useLocalStorage).
- **Rationale**: SDomainAnalysis and InteractiveLab had ~40 lines of identical state + useMemo logic for circuit parameters. A shared hook eliminates duplication and ensures consistent behavior.
- **Status**: Active

## ADR-006: src/app/ for entry files
- **Date**: 2026-03-01
- **Decision**: Move main.tsx, App.tsx, and index.css to src/app/.
- **Rationale**: Keeps src/ root clean. Entry point is clearly separated from feature code.
- **Status**: Active
