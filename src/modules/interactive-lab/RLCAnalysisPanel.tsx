import type { CircuitType, CircuitResponse } from '../../types/circuit';
import { MathWrapper } from '../../components/ui/MathWrapper';

/** RLC circuit analysis sidebar showing damping info and parameters (F24). */
export function RLCAnalysisPanel({ response, timeConstantMs }: {
  response: CircuitResponse;
  timeConstantMs: number;
}) {
  return (
    <div className="space-y-3 flex-1">
      <div className={`rounded-lg p-4 ${
        response.dampingType === 'underdamped' ? 'bg-blue-50 border-l-4 border-blue-500' :
        response.dampingType === 'critically-damped' ? 'bg-green-50 border-l-4 border-green-500' :
        'bg-amber-50 border-l-4 border-amber-500'
      }`}>
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Damping Type</p>
        <p className="text-xl font-bold capitalize text-slate-900 mt-0.5">
          {response.dampingType!.replace('-', ' ')}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        <div className="bg-slate-50 rounded-lg p-3">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Damping Coefficient &#945;</p>
          <p className="text-lg font-bold text-engineering-blue-700 mt-0.5">
            {response.alpha?.toFixed(2)} <span className="text-sm font-normal text-slate-500">rad/s</span>
          </p>
        </div>

        <div className="bg-slate-50 rounded-lg p-3">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Natural Frequency &#969;&#8320;</p>
          <p className="text-lg font-bold text-engineering-blue-700 mt-0.5">
            {response.omega0?.toFixed(2)} <span className="text-sm font-normal text-slate-500">rad/s</span>
          </p>
        </div>

        <div className="bg-slate-50 rounded-lg p-3">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Damping Ratio &#950;</p>
          <p className="text-lg font-bold text-engineering-blue-700 mt-0.5">
            {response.zeta?.toFixed(4)}
          </p>
        </div>

        <div className="bg-slate-50 rounded-lg p-3">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Envelope &#964; = 1/&#945;</p>
          <p className="text-lg font-bold text-green-700 mt-0.5">
            {timeConstantMs.toFixed(3)} <span className="text-sm font-normal text-slate-500">ms</span>
          </p>
        </div>

        {response.dampingType === 'underdamped' && response.omega0 && response.zeta && (
          <div className="bg-slate-50 rounded-lg p-3">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Damped Frequency &#969;<sub>d</sub></p>
            <p className="text-lg font-bold text-engineering-blue-700 mt-0.5">
              {(response.omega0 * Math.sqrt(1 - response.zeta * response.zeta)).toFixed(2)} <span className="text-sm font-normal text-slate-500">rad/s</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/** First-order (RC/RL) analysis sidebar showing time constant info (F24). */
export function FirstOrderAnalysisPanel({ circuitType, response, R, L, C }: {
  circuitType: CircuitType;
  response: CircuitResponse;
  R: number;
  L: number;
  C: number;
}) {
  return (
    <div className="space-y-3 flex-1">
      <div className="bg-engineering-blue-50 rounded-lg p-4 border-l-4 border-engineering-blue-500">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Time Constant &#964;</p>
        <p className="text-xl font-bold text-engineering-blue-700 mt-0.5">
          {response.timeConstant ? (response.timeConstant * 1000).toFixed(3) : '—'} <span className="text-sm font-normal text-slate-500">ms</span>
        </p>
      </div>

      <div className="bg-slate-50 rounded-lg p-3">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Formula</p>
        <div className="mt-1">
          {circuitType === 'RC'
            ? <MathWrapper formula={`\\tau = RC = ${R} \\times ${(C * 1e6).toFixed(1)} \\mu F = ${((R * C) * 1000).toFixed(3)}\\text{ ms}`} />
            : <MathWrapper formula={`\\tau = \\frac{L}{R} = \\frac{${(L * 1000).toFixed(1)}\\text{ mH}}{${R}\\;\\Omega} = ${((L / R) * 1000).toFixed(3)}\\text{ ms}`} />
          }
        </div>
      </div>

      <div className="bg-slate-50 rounded-lg p-3">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">At t = &#964;</p>
        <p className="text-sm text-slate-700 mt-1">
          Response reaches <span className="font-semibold text-engineering-blue-700">63.2%</span> of final value
        </p>
      </div>

      <div className="bg-slate-50 rounded-lg p-3">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">At t = 5&#964;</p>
        <p className="text-sm text-slate-700 mt-1">
          Response reaches <span className="font-semibold text-engineering-blue-700">99.3%</span> of final value (steady state)
        </p>
      </div>
    </div>
  );
}
