import type { CircuitType } from '../../types/circuit';
import { RCComparison } from './RCComparison';
import { RLComparison } from './RLComparison';
import { RLCComparison } from './RLCComparison';

/** Parametric circuit comparison — renders the RC, RL, or RLC comparison panel. */
export function CircuitComparison({ type }: { type: CircuitType }) {
  if (type === 'RC') return <RCComparison />;
  if (type === 'RL') return <RLComparison />;
  return <RLCComparison />;
}
