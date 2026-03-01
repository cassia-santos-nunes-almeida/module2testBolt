import { RotateCcw } from 'lucide-react';
import type { CircuitType, InputType } from '../../types/circuit';
import { RCritMarker, DurationControl } from '../../components/circuit/CircuitCharts';

/** Props for the circuit type tabs and input type toggle bar. */
interface CircuitTabBarProps {
  circuitType: CircuitType;
  inputType: InputType;
  onCircuitTypeChange: (type: CircuitType) => void;
  onInputTypeChange: (type: InputType) => void;
}

/** Circuit type tabs + input type toggle row. */
export function CircuitTabBar({ circuitType, inputType, onCircuitTypeChange, onInputTypeChange }: CircuitTabBarProps) {
  return (
    <div className="flex items-center justify-between border-b-2 border-slate-200">
      <div className="flex">
        {(['RC', 'RL', 'RLC'] as const).map((type) => (
          <button
            key={type}
            onClick={() => onCircuitTypeChange(type)}
            className={`px-6 py-3 font-semibold text-sm transition-colors border-b-3 -mb-[2px] ${
              circuitType === type
                ? 'border-engineering-blue-600 text-engineering-blue-700 bg-engineering-blue-50'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
            }`}
          >
            {type} Circuit
          </button>
        ))}
      </div>

      <div className="flex items-center gap-1 mr-2">
        <span className="text-xs text-slate-500 mr-2 font-medium">Input:</span>
        {(['step', 'impulse'] as const).map((type) => (
          <button
            key={type}
            onClick={() => onInputTypeChange(type)}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors capitalize ${
              inputType === type
                ? 'bg-engineering-blue-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
            }`}
          >
            {type === 'step' ? 'Step u(t)' : 'Impulse \u03B4(t)'}
          </button>
        ))}
      </div>
    </div>
  );
}

/** Props for the configuration slider panel. */
interface ConfigurationPanelProps {
  circuitType: CircuitType;
  R: number;
  L: number;
  C: number;
  voltage: number;
  duration: number;
  autoDuration: boolean;
  effectiveDuration: number;
  rCrit: number | null;
  rCritPercent: number | null;
  onRChange: (value: number) => void;
  onLChange: (value: number) => void;
  onCChange: (value: number) => void;
  onVoltageChange: (value: number) => void;
  onDurationChange: (value: number) => void;
  onAutoDurationChange: (value: boolean) => void;
  onReset: () => void;
}

/** Slider controls, reset button, and duration panel. */
export function ConfigurationPanel({
  circuitType, R, L, C, voltage, duration, autoDuration, effectiveDuration,
  rCrit, rCritPercent,
  onRChange, onLChange, onCChange, onVoltageChange,
  onDurationChange, onAutoDurationChange, onReset,
}: ConfigurationPanelProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-slate-900">Configuration</h2>
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset
        </button>
      </div>

      <div className="space-y-5">
        {/* R slider with R_crit marker */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Resistance (R): <span className="text-engineering-blue-700 font-semibold">{R >= 1000 ? `${(R/1000).toFixed(1)} k\u03A9` : `${R.toFixed(0)} \u03A9`}</span>
          </label>
          <div className="relative">
            <input type="range" min="1" max="10000" step="1" value={R} onChange={(e) => onRChange(parseFloat(e.target.value))} className="w-full accent-red-500" />
            {rCritPercent !== null && (
              <RCritMarker rCrit={rCrit!} rCritPercent={rCritPercent} />
            )}
          </div>
          <div className={`flex justify-between text-xs text-slate-400 ${rCritPercent !== null ? 'mt-5' : 'mt-0.5'}`}>
            <span>1 &#937;</span><span>10 k&#937;</span>
          </div>
        </div>

        {(circuitType === 'RL' || circuitType === 'RLC') && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Inductance (L): <span className="text-engineering-blue-700 font-semibold">{(L * 1000).toFixed(1)} mH</span>
            </label>
            <input type="range" min="1" max="1000" step="1" value={L * 1000} onChange={(e) => onLChange(parseFloat(e.target.value) / 1000)} className="w-full accent-purple-500" />
            <div className="flex justify-between text-xs text-slate-400 mt-0.5"><span>1 mH</span><span>1 H</span></div>
          </div>
        )}

        {(circuitType === 'RC' || circuitType === 'RLC') && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Capacitance (C): <span className="text-engineering-blue-700 font-semibold">{(C * 1e6).toFixed(1)} &#181;F</span>
            </label>
            <input type="range" min="1" max="1000" step="1" value={C * 1e6} onChange={(e) => onCChange(parseFloat(e.target.value) / 1e6)} className="w-full accent-green-500" />
            <div className="flex justify-between text-xs text-slate-400 mt-0.5"><span>1 &#181;F</span><span>1 mF</span></div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Source Voltage: <span className="text-engineering-blue-700 font-semibold">{voltage.toFixed(1)} V</span>
          </label>
          <input type="range" min="1" max="50" step="0.5" value={voltage} onChange={(e) => onVoltageChange(parseFloat(e.target.value))} className="w-full accent-blue-500" />
          <div className="flex justify-between text-xs text-slate-400 mt-0.5"><span>1 V</span><span>50 V</span></div>
        </div>

        <DurationControl
          effectiveDuration={effectiveDuration}
          autoDuration={autoDuration}
          duration={duration}
          onAutoDurationChange={onAutoDurationChange}
          onDurationChange={onDurationChange}
        />
      </div>
    </div>
  );
}
