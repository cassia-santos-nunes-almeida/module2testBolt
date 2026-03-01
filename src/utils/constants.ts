/** Shared constants for circuit simulation */

/** Tolerance for treating zeta ≈ 1 as critically damped */
export const CRITICAL_DAMPING_TOLERANCE = 0.01;

/** Default circuit parameter values */
export const DEFAULT_CIRCUIT_PARAMS = {
  R: 100,
  L: 0.1,
  C: 0.0001,
  voltage: 10,
} as const;

/** Default simulation parameters */
export const DEFAULT_TIME_STEP = 0.0001;
export const DEFAULT_DURATION = 0.01;

/** Auto-duration multiplier (number of time constants to show) */
export const AUTO_DURATION_TAU_MULTIPLIER = 5;

/** AI Tutor floating window dimensions */
export const FLOAT_DIMENSIONS = {
  width: 380,
  height: 520,
  padding: 20,
} as const;
