export interface CircuitParams {
  R: number;
  L: number;
  C: number;
  voltage: number;
}

export interface TimeSeriesPoint {
  time: number;
  voltage: number;
  current: number;
}

export type CircuitType = 'RC' | 'RL' | 'RLC';
export type DampingType = 'overdamped' | 'critically-damped' | 'underdamped';

export interface CircuitResponse {
  data: TimeSeriesPoint[];
  dampingType?: DampingType;
  alpha?: number;
  omega0?: number;
  zeta?: number;
  timeConstant?: number;
}

export function calculateCircuitResponse(
  type: CircuitType,
  params: CircuitParams,
  timeStep: number = 0.0001,
  duration: number = 0.01
): CircuitResponse {
  const { R, L, C, voltage } = params;

  switch (type) {
    case 'RC':
      return calculateRCResponse(R, C, voltage, timeStep, duration);
    case 'RL':
      return calculateRLResponse(R, L, voltage, timeStep, duration);
    case 'RLC':
      return calculateRLCResponse(R, L, C, voltage, timeStep, duration);
    default:
      return { data: [] };
  }
}

function calculateRCResponse(
  R: number,
  C: number,
  Vs: number,
  timeStep: number,
  duration: number
): CircuitResponse {
  const tau = R * C;
  const data: TimeSeriesPoint[] = [];

  for (let t = 0; t <= duration; t += timeStep) {
    const v = Vs * (1 - Math.exp(-t / tau));
    const i = (Vs / R) * Math.exp(-t / tau);
    data.push({ time: t, voltage: v, current: i });
  }

  return {
    data,
    timeConstant: tau,
  };
}

function calculateRLResponse(
  R: number,
  L: number,
  Vs: number,
  timeStep: number,
  duration: number
): CircuitResponse {
  const tau = L / R;
  const data: TimeSeriesPoint[] = [];

  for (let t = 0; t <= duration; t += timeStep) {
    const i = (Vs / R) * (1 - Math.exp(-t / tau));
    const v = Vs * Math.exp(-t / tau);
    data.push({ time: t, voltage: v, current: i });
  }

  return {
    data,
    timeConstant: tau,
  };
}

function calculateRLCResponse(
  R: number,
  L: number,
  C: number,
  Vs: number,
  timeStep: number,
  duration: number
): CircuitResponse {
  const alpha = R / (2 * L);
  const omega0 = 1 / Math.sqrt(L * C);
  const zeta = alpha / omega0;

  let dampingType: DampingType;
  const data: TimeSeriesPoint[] = [];

  if (zeta > 1) {
    dampingType = 'overdamped';
    const s1 = -alpha + Math.sqrt(alpha * alpha - omega0 * omega0);
    const s2 = -alpha - Math.sqrt(alpha * alpha - omega0 * omega0);

    for (let t = 0; t <= duration; t += timeStep) {
      const A1 = (Vs * s2) / (s2 - s1);
      const A2 = (-Vs * s1) / (s2 - s1);
      const v = A1 * Math.exp(s1 * t) + A2 * Math.exp(s2 * t);
      const i = C * (A1 * s1 * Math.exp(s1 * t) + A2 * s2 * Math.exp(s2 * t));
      data.push({ time: t, voltage: v, current: i });
    }
  } else if (Math.abs(zeta - 1) < 0.01) {
    dampingType = 'critically-damped';

    for (let t = 0; t <= duration; t += timeStep) {
      const v = Vs * (1 - Math.exp(-alpha * t) * (1 + alpha * t));
      const i = (Vs / L) * t * Math.exp(-alpha * t);
      data.push({ time: t, voltage: v, current: i });
    }
  } else {
    dampingType = 'underdamped';
    const omegaD = omega0 * Math.sqrt(1 - zeta * zeta);

    for (let t = 0; t <= duration; t += timeStep) {
      const expTerm = Math.exp(-alpha * t);
      const v = Vs * (1 - expTerm * (Math.cos(omegaD * t) + (alpha / omegaD) * Math.sin(omegaD * t)));
      const i = (Vs * omega0 * omega0 * C) * expTerm * Math.sin(omegaD * t) / omegaD;
      data.push({ time: t, voltage: v, current: i });
    }
  }

  return {
    data,
    dampingType,
    alpha,
    omega0,
    zeta,
  };
}

export function calculateTransferFunction(R: number, L: number, C: number): {
  numerator: number[];
  denominator: number[];
  poles: Complex[];
  zeros: Complex[];
} {
  const omega0Squared = 1 / (L * C);
  const alpha = R / (2 * L);

  const denominator = [1, 2 * alpha, omega0Squared];
  const numerator = [omega0Squared];

  const discriminant = 4 * alpha * alpha - 4 * omega0Squared;

  let poles: Complex[];
  if (discriminant > 0) {
    const sqrtDisc = Math.sqrt(discriminant);
    poles = [
      { real: (-2 * alpha + sqrtDisc) / 2, imag: 0 },
      { real: (-2 * alpha - sqrtDisc) / 2, imag: 0 }
    ];
  } else if (discriminant === 0) {
    poles = [
      { real: -alpha, imag: 0 },
      { real: -alpha, imag: 0 }
    ];
  } else {
    const imagPart = Math.sqrt(-discriminant) / 2;
    poles = [
      { real: -alpha, imag: imagPart },
      { real: -alpha, imag: -imagPart }
    ];
  }

  return {
    numerator,
    denominator,
    poles,
    zeros: []
  };
}

export interface Complex {
  real: number;
  imag: number;
}
