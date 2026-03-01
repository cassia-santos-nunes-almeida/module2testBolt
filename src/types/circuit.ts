/** Shared type definitions for circuit analysis */

export type CircuitType = 'RC' | 'RL' | 'RLC';
export type DampingType = 'overdamped' | 'critically-damped' | 'underdamped';
export type InputType = 'step' | 'impulse';
export type ComponentType = 'resistor' | 'capacitor' | 'inductor';

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

export interface CircuitResponse {
  data: TimeSeriesPoint[];
  dampingType?: DampingType;
  alpha?: number;
  omega0?: number;
  zeta?: number;
  timeConstant?: number;
}

export interface Complex {
  real: number;
  imag: number;
}

export interface MaterialProperty {
  name: string;
  resistivity?: number;
  permittivity?: number;
  permeability?: number;
}
