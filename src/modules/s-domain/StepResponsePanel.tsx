import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Legend,
} from 'recharts';
import { ResponseChartTooltip } from '../../components/circuit/CircuitCharts';

export interface StepResponsePanelProps {
  chartData: Array<{ time: number; voltage: number; current: number }>;
  timeConstantMs: number;
  dampedPeriodMs: number | null;
  effectiveDuration: number;
}

/** Step response line chart with time constant and damped period markers (F21). */
export function StepResponsePanel({ chartData, timeConstantMs, dampedPeriodMs, effectiveDuration }: StepResponsePanelProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Step Response (Time Domain)</h3>
      <div className="bg-slate-50 p-4 rounded-lg">
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" label={{ value: 'Time (ms)', position: 'insideBottom', offset: -5 }} />
            <YAxis label={{ value: 'V / mA', angle: -90, position: 'insideLeft' }} />
            <Tooltip content={({ payload, label }) => <ResponseChartTooltip payload={payload as Array<{ color?: string; name?: string; value?: string | number }>} label={label} />} />
            <Legend />
            {/* Time constant marker */}
            {timeConstantMs <= effectiveDuration * 1000 && (
              <ReferenceLine
                x={timeConstantMs}
                stroke="#16a34a"
                strokeWidth={1.5}
                strokeDasharray="6 3"
                label={{ value: '\u03C4', position: 'top', fill: '#16a34a', fontWeight: 'bold', fontSize: 14 }}
              />
            )}
            {/* Damped period marker */}
            {dampedPeriodMs && dampedPeriodMs <= effectiveDuration * 1000 && (
              <ReferenceLine
                x={dampedPeriodMs}
                stroke="#7c3aed"
                strokeWidth={1.5}
                strokeDasharray="6 3"
                label={{ value: 'T\u1D48', position: 'top', fill: '#7c3aed', fontWeight: 'bold', fontSize: 13 }}
              />
            )}
            <Line type="monotone" dataKey="voltage" stroke="#3b82f6" name="Voltage" dot={false} strokeWidth={2} />
            <Line type="monotone" dataKey="current" stroke="#ef4444" name="Current" dot={false} strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
        <p className="text-xs text-center text-slate-600 mt-2">
          Green dashed line = &#964; (1/&#945;){dampedPeriodMs ? ', purple = damped period T\u1D48' : ''}
        </p>
      </div>

      {/* Compact analysis metrics */}
      <div className="grid grid-cols-2 gap-3 mt-4">
        <div className="bg-slate-50 rounded-lg p-3">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Envelope &#964; = 1/&#945;</p>
          <p className="text-lg font-bold text-green-700 mt-0.5">
            {timeConstantMs.toFixed(3)} <span className="text-sm font-normal text-slate-500">ms</span>
          </p>
        </div>
        {dampedPeriodMs !== null && (
          <div className="bg-slate-50 rounded-lg p-3">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Damped Freq &#969;<sub>d</sub></p>
            <p className="text-lg font-bold text-engineering-blue-700 mt-0.5">
              {dampedPeriodMs !== null ? ((2 * Math.PI / (dampedPeriodMs / 1000))).toFixed(2) : '\u2014'} <span className="text-sm font-normal text-slate-500">rad/s</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
