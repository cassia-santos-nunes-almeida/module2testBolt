import { describe, it, expect } from 'vitest';
import { calculateCircuitResponse, calculateTransferFunction } from './circuitSolver';

describe('calculateCircuitResponse', () => {
  const defaultParams = { R: 100, L: 0.1, C: 0.0001, voltage: 10 };

  describe('RC circuit', () => {
    it('step response starts at 0V and approaches Vs', () => {
      const result = calculateCircuitResponse('RC', defaultParams, 0.0001, 0.05);
      expect(result.data[0].voltage).toBeCloseTo(0, 5);
      const lastPoint = result.data[result.data.length - 1];
      expect(lastPoint.voltage).toBeCloseTo(defaultParams.voltage, 0);
    });

    it('step response current starts at Vs/R and decays to 0', () => {
      const result = calculateCircuitResponse('RC', defaultParams, 0.0001, 0.05);
      expect(result.data[0].current).toBeCloseTo(defaultParams.voltage / defaultParams.R, 5);
      const lastPoint = result.data[result.data.length - 1];
      expect(lastPoint.current).toBeCloseTo(0, 2);
    });

    it('returns correct time constant tau = RC', () => {
      const result = calculateCircuitResponse('RC', defaultParams);
      expect(result.timeConstant).toBeCloseTo(defaultParams.R * defaultParams.C, 10);
    });

    it('impulse response starts high and decays', () => {
      const result = calculateCircuitResponse('RC', defaultParams, 0.0001, 0.1, 'impulse');
      expect(result.data[0].voltage).toBeGreaterThan(0);
      const lastPoint = result.data[result.data.length - 1];
      // After 10*tau the signal should be very small
      expect(Math.abs(lastPoint.voltage)).toBeLessThan(1);
    });
  });

  describe('RL circuit', () => {
    it('step response voltage starts at Vs and decays to 0', () => {
      const result = calculateCircuitResponse('RL', defaultParams, 0.0001, 0.01);
      expect(result.data[0].voltage).toBeCloseTo(defaultParams.voltage, 5);
      const lastPoint = result.data[result.data.length - 1];
      expect(Math.abs(lastPoint.voltage)).toBeLessThan(0.5);
    });

    it('step response current starts at 0 and approaches Vs/R', () => {
      const result = calculateCircuitResponse('RL', defaultParams, 0.0001, 0.01);
      expect(result.data[0].current).toBeCloseTo(0, 5);
      const lastPoint = result.data[result.data.length - 1];
      expect(lastPoint.current).toBeCloseTo(defaultParams.voltage / defaultParams.R, 1);
    });

    it('returns correct time constant tau = L/R', () => {
      const result = calculateCircuitResponse('RL', defaultParams);
      expect(result.timeConstant).toBeCloseTo(defaultParams.L / defaultParams.R, 10);
    });
  });

  describe('RLC circuit', () => {
    it('underdamped response oscillates', () => {
      const params = { R: 10, L: 0.1, C: 0.0001, voltage: 10 };
      const result = calculateCircuitResponse('RLC', params, 0.00001, 0.05);
      expect(result.dampingType).toBe('underdamped');
      // Voltage should exceed Vs due to overshoot
      const maxV = Math.max(...result.data.map(d => d.voltage));
      expect(maxV).toBeGreaterThan(params.voltage);
    });

    it('overdamped response does not overshoot', () => {
      const params = { R: 1000, L: 0.1, C: 0.0001, voltage: 10 };
      const result = calculateCircuitResponse('RLC', params, 0.0001, 0.1);
      expect(result.dampingType).toBe('overdamped');
      const maxV = Math.max(...result.data.map(d => d.voltage));
      expect(maxV).toBeLessThanOrEqual(params.voltage + 0.01);
    });

    it('critically damped has zeta ≈ 1', () => {
      // R_crit = 2 * sqrt(L/C) for series RLC
      const L = 0.1, C = 0.0001;
      const rCrit = 2 * Math.sqrt(L / C);
      const params = { R: rCrit, L, C, voltage: 10 };
      const result = calculateCircuitResponse('RLC', params, 0.0001, 0.05);
      expect(result.dampingType).toBe('critically-damped');
      expect(result.zeta).toBeCloseTo(1, 1);
    });

    it('returns alpha, omega0, and zeta', () => {
      const result = calculateCircuitResponse('RLC', defaultParams, 0.0001, 0.01);
      expect(result.alpha).toBeDefined();
      expect(result.omega0).toBeDefined();
      expect(result.zeta).toBeDefined();
    });

    it('impulse response starts near zero', () => {
      const result = calculateCircuitResponse('RLC', defaultParams, 0.0001, 0.05, 'impulse');
      expect(result.data[0].voltage).toBeCloseTo(0, 3);
    });
  });
});

describe('calculateTransferFunction', () => {
  it('returns correct denominator coefficients', () => {
    const R = 100, L = 0.1, C = 0.0001;
    const result = calculateTransferFunction(R, L, C);
    const omega0Squared = 1 / (L * C);
    const alpha = R / (2 * L);
    expect(result.denominator).toEqual([1, 2 * alpha, omega0Squared]);
  });

  it('returns omega0^2 as numerator', () => {
    const R = 100, L = 0.1, C = 0.0001;
    const result = calculateTransferFunction(R, L, C);
    expect(result.numerator).toEqual([1 / (L * C)]);
  });

  it('returns two poles', () => {
    const result = calculateTransferFunction(100, 0.1, 0.0001);
    expect(result.poles).toHaveLength(2);
  });

  it('underdamped circuit has complex conjugate poles', () => {
    const result = calculateTransferFunction(10, 0.1, 0.0001);
    expect(result.poles[0].imag).not.toBe(0);
    expect(result.poles[0].imag).toBe(-result.poles[1].imag);
  });

  it('overdamped circuit has real poles', () => {
    const result = calculateTransferFunction(1000, 0.1, 0.0001);
    expect(result.poles[0].imag).toBe(0);
    expect(result.poles[1].imag).toBe(0);
  });

  it('returns empty zeros array', () => {
    const result = calculateTransferFunction(100, 0.1, 0.0001);
    expect(result.zeros).toEqual([]);
  });
});
