import { useState } from 'react';
import type { CircuitType } from '../../types/circuit';
import { CircuitComparison } from './CircuitComparison';
import { MethodComparisonTable } from './MethodComparisonTable';
import { ResponseComparisons } from './ResponseComparisons';

const CIRCUIT_TYPES: readonly CircuitType[] = ['RC', 'RL', 'RLC'] as const;

export function TimeDomain() {
  const [selectedCircuit, setSelectedCircuit] = useState<CircuitType>('RC');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Circuit Analysis</h1>
        <p className="text-lg text-slate-600">
          Comparing time-domain differential equations with Laplace transform s-domain methods
        </p>
      </div>

      <div className="flex border-b-2 border-slate-200">
        {CIRCUIT_TYPES.map((type) => (
          <button
            key={type}
            onClick={() => setSelectedCircuit(type)}
            className={`px-6 py-3 font-semibold text-sm transition-colors border-b-3 -mb-[2px] ${
              selectedCircuit === type
                ? 'border-engineering-blue-600 text-engineering-blue-700 bg-engineering-blue-50'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
            }`}
          >
            {type} Circuit
          </button>
        ))}
      </div>

      <CircuitComparison type={selectedCircuit} />
      <MethodComparisonTable />
      <ResponseComparisons />
    </div>
  );
}
