import { describe, it, expect } from 'vitest';
import {
  calculateResistance,
  calculateCapacitance,
  calculateInductance,
  materials,
} from './componentMath';

describe('calculateResistance', () => {
  it('calculates R = ρL/A correctly', () => {
    const resistivity = 1.68e-8; // copper
    const length = 1; // 1m
    const area = 1e-6; // 1 mm²
    expect(calculateResistance(resistivity, length, area)).toBeCloseTo(0.0168, 4);
  });

  it('resistance increases with length', () => {
    const r1 = calculateResistance(1e-8, 1, 1e-6);
    const r2 = calculateResistance(1e-8, 2, 1e-6);
    expect(r2).toBeCloseTo(2 * r1, 10);
  });

  it('resistance decreases with area', () => {
    const r1 = calculateResistance(1e-8, 1, 1e-6);
    const r2 = calculateResistance(1e-8, 1, 2e-6);
    expect(r2).toBeCloseTo(r1 / 2, 10);
  });
});

describe('calculateCapacitance', () => {
  it('calculates C = εA/d correctly', () => {
    const permittivity = 8.854e-12; // vacuum
    const area = 0.01; // 100 cm²
    const distance = 0.001; // 1mm
    expect(calculateCapacitance(permittivity, area, distance)).toBeCloseTo(8.854e-11, 14);
  });

  it('capacitance increases with area', () => {
    const c1 = calculateCapacitance(8.854e-12, 0.01, 0.001);
    const c2 = calculateCapacitance(8.854e-12, 0.02, 0.001);
    expect(c2).toBeCloseTo(2 * c1, 14);
  });

  it('capacitance decreases with distance', () => {
    const c1 = calculateCapacitance(8.854e-12, 0.01, 0.001);
    const c2 = calculateCapacitance(8.854e-12, 0.01, 0.002);
    expect(c2).toBeCloseTo(c1 / 2, 14);
  });
});

describe('calculateInductance', () => {
  it('calculates L = μN²A/l correctly', () => {
    const permeability = 1.257e-6;
    const turns = 100;
    const area = 0.001; // m²
    const length = 0.1; // m
    const expected = (permeability * turns * turns * area) / length;
    expect(calculateInductance(permeability, turns, area, length)).toBeCloseTo(expected, 10);
  });

  it('inductance scales with N²', () => {
    const l1 = calculateInductance(1.257e-6, 50, 0.001, 0.1);
    const l2 = calculateInductance(1.257e-6, 100, 0.001, 0.1);
    expect(l2 / l1).toBeCloseTo(4, 5);
  });
});

describe('materials data', () => {
  it('has at least 5 materials', () => {
    expect(materials.length).toBeGreaterThanOrEqual(5);
  });

  it('copper has resistivity and permeability', () => {
    const copper = materials.find(m => m.name === 'Copper');
    expect(copper).toBeDefined();
    expect(copper!.resistivity).toBeDefined();
    expect(copper!.permeability).toBeDefined();
  });

  it('air has permittivity', () => {
    const air = materials.find(m => m.name === 'Air');
    expect(air).toBeDefined();
    expect(air!.permittivity).toBeDefined();
  });
});
