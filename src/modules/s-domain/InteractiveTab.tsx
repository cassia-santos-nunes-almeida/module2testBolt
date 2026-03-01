import { useState, useMemo } from 'react';
import { RotateCcw } from 'lucide-react';
import { MathWrapper } from '../../components/ui/MathWrapper';
import { RCritMarker, DurationControl } from '../../components/circuit/CircuitCharts';
import { calculateTransferFunction, calculateCircuitResponse } from '../../utils/circuitSolver';
import { CRITICAL_DAMPING_TOLERANCE } from '../../utils/constants';
import { PoleZeroMap } from './PoleZeroMap';
import { StepResponsePanel } from './StepResponsePanel';

/** Interactive simulation with sliders, transfer function display, charts, and pole-zero map. */
export function InteractiveTab() {
  const [R, setR] = useState(100);
  const [L, setL] = useState(0.1);
  const [C, setC] = useState(0.0001);
  const [autoDuration, setAutoDuration] = useState(true);
  const [duration, setDuration] = useState(0.01);

  const { poles, numerator, denominator } = calculateTransferFunction(R, L, C);
  const alpha = R / (2 * L);
  const omega0 = 1 / Math.sqrt(L * C);
  const zeta = alpha / omega0;

  let dampingType = '';
  if (zeta > 1 + CRITICAL_DAMPING_TOLERANCE) dampingType = 'Overdamped';
  else if (zeta < 1 - CRITICAL_DAMPING_TOLERANCE) dampingType = 'Underdamped';
  else dampingType = 'Critically Damped';

  const rCrit = 2 * Math.sqrt(L / C);
  const rCritPercent = Math.min(100, Math.max(0, (rCrit / 10000) * 100));
  const timeConstant = (2 * L) / R;
  const timeConstantMs = timeConstant * 1000;

  const effectiveDuration = useMemo(() => {
    return autoDuration ? Math.max(0.001, Math.min(0.1, 5 * timeConstant)) : duration;
  }, [autoDuration, timeConstant, duration]);

  const dampedPeriodMs = useMemo(() => {
    if (zeta >= 1) return null;
    const omegaD = omega0 * Math.sqrt(1 - zeta * zeta);
    return (2 * Math.PI / omegaD) * 1000;
  }, [zeta, omega0]);

  const poleData = poles.map((pole, idx) => ({
    x: pole.real, y: pole.imag, name: `Pole ${idx + 1}`,
  }));

  const response = useMemo(() => {
    return calculateCircuitResponse('RLC', { R, L, C, voltage: 10 }, effectiveDuration / 1000, effectiveDuration, 'step');
  }, [R, L, C, effectiveDuration]);

  const chartData = useMemo(() => {
    return response.data.map((point) => ({
      time: point.time * 1000, voltage: point.voltage, current: point.current * 1000,
    }));
  }, [response.data]);

  const handleReset = () => {
    setR(100);
    setL(0.1);
    setC(0.0001);
    setAutoDuration(true);
    setDuration(0.01);
  };

  return (
    <div className="space-y-6">
      {/* ROW 1: Sliders + Transfer Function / Pole Locations (2-col) */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left: Sliders */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-slate-900">Circuit Parameters</h2>
            <button
              onClick={handleReset}
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
                <input type="range" min="1" max="10000" step="1" value={R} onChange={(e) => setR(parseFloat(e.target.value))} className="w-full accent-red-500" />
                <RCritMarker rCrit={rCrit} rCritPercent={rCritPercent} />
              </div>
              <div className="flex justify-between text-xs text-slate-400 mt-5">
                <span>1 &#937;</span><span>10 k&#937;</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Inductance (L): <span className="text-engineering-blue-700 font-semibold">{(L * 1000).toFixed(1)} mH</span>
              </label>
              <input type="range" min="1" max="1000" step="1" value={L * 1000} onChange={(e) => setL(parseFloat(e.target.value) / 1000)} className="w-full accent-purple-500" />
              <div className="flex justify-between text-xs text-slate-400 mt-0.5"><span>1 mH</span><span>1 H</span></div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Capacitance (C): <span className="text-engineering-blue-700 font-semibold">{(C * 1e6).toFixed(1)} &#181;F</span>
              </label>
              <input type="range" min="1" max="1000" step="1" value={C * 1e6} onChange={(e) => setC(parseFloat(e.target.value) / 1e6)} className="w-full accent-green-500" />
              <div className="flex justify-between text-xs text-slate-400 mt-0.5"><span>1 &#181;F</span><span>1 mF</span></div>
            </div>

            <DurationControl
              effectiveDuration={effectiveDuration}
              autoDuration={autoDuration}
              duration={duration}
              onAutoDurationChange={setAutoDuration}
              onDurationChange={setDuration}
            />
          </div>
        </div>

        {/* Right: Transfer function + characteristic equation */}
        <div className="bg-white rounded-lg shadow-md p-6 flex flex-col">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Transfer Function</h2>

          <div className="space-y-4 flex-1">
            <div className="bg-engineering-blue-50 p-4 rounded-lg">
              <MathWrapper
                formula={`H(s) = \\frac{${numerator[0].toFixed(0)}}{s^2 + ${denominator[1].toFixed(2)}s + ${denominator[2].toFixed(0)}}`}
                block
              />
            </div>

            <div className="bg-slate-50 p-4 rounded-lg">
              <p className="text-sm font-semibold text-slate-700 mb-2">Characteristic Parameters:</p>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <MathWrapper formula="\alpha = \frac{R}{2L}" />
                  <p className="text-sm text-slate-600 mt-1">= {alpha.toFixed(2)} rad/s</p>
                </div>
                <div>
                  <MathWrapper formula="\omega_0 = \frac{1}{\sqrt{LC}}" />
                  <p className="text-sm text-slate-600 mt-1">= {omega0.toFixed(2)} rad/s</p>
                </div>
                <div>
                  <MathWrapper formula="\zeta = \frac{\alpha}{\omega_0}" />
                  <p className="text-sm text-slate-600 mt-1">= {zeta.toFixed(3)}</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-lg">
              <p className="text-sm font-semibold text-slate-700 mb-2">Pole Locations:</p>
              <div className="space-y-1">
                {poles.map((pole, idx) => (
                  <p key={idx} className="text-sm text-slate-700">
                    s<sub>{idx + 1}</sub> = {pole.real.toFixed(2)}
                    {pole.imag !== 0 && ` ${pole.imag > 0 ? '+' : ''}${pole.imag.toFixed(2)}j`}
                  </p>
                ))}
              </div>
            </div>

            <div className={`rounded-lg p-4 ${
              dampingType === 'Underdamped' ? 'bg-blue-50 border-l-4 border-blue-500' :
              dampingType === 'Overdamped' ? 'bg-amber-50 border-l-4 border-amber-500' :
              'bg-green-50 border-l-4 border-green-500'
            }`}>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Damping Type</p>
              <p className="text-xl font-bold text-slate-900 mt-0.5">{dampingType}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ROW 2: Pole-Zero Map + Step Response side-by-side */}
      <div className="grid lg:grid-cols-2 gap-6">
        <PoleZeroMap poleData={poleData} poles={poles} />
        <StepResponsePanel
          chartData={chartData}
          timeConstantMs={timeConstantMs}
          dampedPeriodMs={dampedPeriodMs}
          effectiveDuration={effectiveDuration}
        />
      </div>
    </div>
  );
}
