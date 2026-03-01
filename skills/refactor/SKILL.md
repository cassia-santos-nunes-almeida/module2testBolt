# refactor Skill

## When to use
User wants to refactor code files — remove dead code, improve efficiency, preserve all features.

## Workflow
1. **Read** the target file(s) completely
2. **Map dependencies** — find all importers and imports
3. **Catalog public behavior** — list every export and side effect
4. **Analyze** for dead code, efficiency gains, readability improvements
5. **Classify** each finding: HIGH/MEDIUM/LOW certainty
6. **Propose** changes with before/after code
7. **Apply** only HIGH-certainty changes (if --fix mode)
8. **Verify** build passes after changes

## Rules
- **Feature preservation is non-negotiable** — when in doubt, classify as LOW
- Never remove an export without verifying zero imports across the entire codebase
- Never change function signatures for exported functions without updating all callers
- Never remove error handling or input validation
- Never remove TODO/FIXME comments — flag them but don't delete
- Test verification is mandatory before declaring success

## Certainty Levels
- **HIGH**: Deterministically provable (unreachable code, unused symbol, identical transformation)
- **MEDIUM**: Very likely safe but depends on runtime behavior
- **LOW**: Potentially beneficial but changes observable behavior

## This project's patterns to preserve
- All types in `src/types/circuit.ts` — never redeclare
- `cn()` utility for Tailwind classes
- `MathWrapper` for all KaTeX rendering
- `useMemo` for circuit response calculations
- `useCircuitParams` hook interface
