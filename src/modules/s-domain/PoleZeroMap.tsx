import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine,
} from 'recharts';
import { PoleTooltip } from '../../components/circuit/CircuitCharts';
import type { Complex } from '../../types/circuit';

export interface PoleZeroMapProps {
  poleData: Array<{ x: number; y: number; name: string }>;
  poles: Complex[];
}

/** Pole-zero scatter plot on the s-plane (F21). */
export function PoleZeroMap({ poleData, poles }: PoleZeroMapProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">S-Plane Pole-Zero Map</h3>
      <div className="bg-slate-50 p-4 rounded-lg">
        <ResponsiveContainer width="100%" height={350}>
          <ScatterChart margin={{ top: 20, right: 20, bottom: 40, left: 40 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              type="number"
              dataKey="x"
              name="Real"
              label={{ value: 'Real Axis (\u03C3)', position: 'insideBottom', offset: -10 }}
              domain={['auto', 'auto']}
            />
            <YAxis
              type="number"
              dataKey="y"
              name="Imaginary"
              label={{ value: 'Imaginary Axis (j\u03C9)', angle: -90, position: 'insideLeft' }}
              domain={['auto', 'auto']}
            />
            <Tooltip
              cursor={{ strokeDasharray: '3 3' }}
              content={({ payload }) => <PoleTooltip payload={payload as Array<{ payload: { name: string; x: number; y: number } }>} />}
            />
            <ReferenceLine x={0} stroke="#64748b" strokeWidth={2} />
            <ReferenceLine y={0} stroke="#64748b" strokeWidth={2} />
            <Scatter
              name="Poles"
              data={poleData}
              fill="#ef4444"
              shape="cross"
              line={false}
            />
          </ScatterChart>
        </ResponsiveContainer>
        <p className="text-xs text-center text-slate-600 mt-2">
          Red &#10005; marks indicate pole locations
        </p>
      </div>

      <div className="bg-amber-50 p-4 rounded-lg mt-4 border-l-4 border-amber-500">
        <h4 className="font-semibold text-amber-900 mb-1">Stability:</h4>
        <p className="text-sm text-slate-700">
          {poles.every(p => p.real < 0) ? (
            <span className="text-green-700 font-semibold">
              &#10003; STABLE — all poles in left half-plane
            </span>
          ) : (
            <span className="text-red-700 font-semibold">
              &#10007; UNSTABLE — poles in right half-plane
            </span>
          )}
        </p>
      </div>
    </div>
  );
}
