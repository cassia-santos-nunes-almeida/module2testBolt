import { useState, useMemo } from 'react';
import type { CircuitType, InputType, CircuitResponse } from '../types/circuit';
import { calculateCircuitResponse } from '../utils/circuitSolver';
import { DEFAULT_CIRCUIT_PARAMS, CRITICAL_DAMPING_TOLERANCE, AUTO_DURATION_TAU_MULTIPLIER } from '../utils/constants';

/**
 * Shared hook for circuit parameter state and derived simulation values.
 * Used by both InteractiveLab and SDomainAnalysis InteractiveTab.
 */
export function useCircuitParams(defaultCircuitType: CircuitType = 'RLC') {
  const [circuitType, setCircuitType] = useState<CircuitType>(defaultCircuitType);
  const [inputType, setInputType] = useState<InputType>('step');
  const [R, setR] = useState(DEFAULT_CIRCUIT_PARAMS.R);
  const [L, setL] = useState(DEFAULT_CIRCUIT_PARAMS.L);
  const [C, setC] = useState(DEFAULT_CIRCUIT_PARAMS.C);
  const [voltage, setVoltage] = useState(DEFAULT_CIRCUIT_PARAMS.voltage);
  const [duration, setDuration] = useState(0.01);
  const [autoDuration, setAutoDuration] = useState(false);

  const timeConstant = useMemo(() => {
    if (circuitType === 'RC') return R * C;
    if (circuitType === 'RL') return L / R;
    return (2 * L) / R; // RLC envelope: 1/alpha
  }, [circuitType, R, L, C]);

  const rCrit = useMemo(() => {
    if (circuitType === 'RLC') return 2 * Math.sqrt(L / C);
    return null;
  }, [circuitType, L, C]);

  const effectiveDuration = useMemo(() => {
    if (autoDuration) {
      return Math.max(0.001, Math.min(0.1, AUTO_DURATION_TAU_MULTIPLIER * timeConstant));
    }
    return duration;
  }, [autoDuration, timeConstant, duration]);

  const response: CircuitResponse = useMemo(() => {
    return calculateCircuitResponse(
      circuitType,
      { R, L, C, voltage },
      effectiveDuration / 1000,
      effectiveDuration,
      inputType
    );
  }, [circuitType, R, L, C, voltage, effectiveDuration, inputType]);

  const chartData = useMemo(() => {
    return response.data.map((point) => ({
      time: point.time * 1000,
      voltage: point.voltage,
      current: point.current * 1000,
    }));
  }, [response.data]);

  const timeConstantMs = timeConstant * 1000;

  const dampedPeriodMs = useMemo(() => {
    if (circuitType === 'RLC' && response.dampingType === 'underdamped' && response.omega0 && response.zeta) {
      const omegaD = response.omega0 * Math.sqrt(1 - response.zeta * response.zeta);
      return (2 * Math.PI / omegaD) * 1000;
    }
    return null;
  }, [circuitType, response]);

  const rCritPercent = rCrit !== null ? Math.min(100, Math.max(0, (rCrit / 10000) * 100)) : null;

  // Damping type using unified tolerance
  const dampingType = useMemo(() => {
    if (circuitType !== 'RLC') return null;
    const alpha = R / (2 * L);
    const omega0 = 1 / Math.sqrt(L * C);
    const zeta = alpha / omega0;
    if (zeta > 1 + CRITICAL_DAMPING_TOLERANCE) return 'overdamped' as const;
    if (zeta < 1 - CRITICAL_DAMPING_TOLERANCE) return 'underdamped' as const;
    return 'critically-damped' as const;
  }, [circuitType, R, L, C]);

  const handleReset = () => {
    setR(DEFAULT_CIRCUIT_PARAMS.R);
    setL(DEFAULT_CIRCUIT_PARAMS.L);
    setC(DEFAULT_CIRCUIT_PARAMS.C);
    setVoltage(DEFAULT_CIRCUIT_PARAMS.voltage);
    setDuration(0.01);
    setAutoDuration(false);
  };

  return {
    // State
    circuitType, inputType, R, L, C, voltage, duration, autoDuration,
    // Setters
    setCircuitType, setInputType, setR, setL, setC, setVoltage, setDuration, setAutoDuration,
    // Derived
    timeConstant, timeConstantMs, rCrit, rCritPercent, effectiveDuration,
    response, chartData, dampedPeriodMs, dampingType,
    // Actions
    handleReset,
  };
}
