import { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { RotateCcw } from 'lucide-react';
import { calculateCircuitResponse, type CircuitType, type InputType } from '../../utils/circuitSolver';
import { MathWrapper } from '../common/MathWrapper';
import { ResponseChartTooltip, RCritMarker, DurationControl } from '../common/CircuitCharts';

function CircuitDiagram({ type, R, L, C, voltage }: { type: CircuitType; R: number; L: number; C: number; voltage: number }) {
  return (
    <svg viewBox="0 0 360 220" className="w-full h-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Voltage source */}
      <line x1="40" y1="40" x2="40" y2="70" stroke="#334155" strokeWidth="2" />
      <circle cx="40" cy="90" r="20" stroke="#3b82f6" strokeWidth="2" fill="#eff6ff" />
      <text x="40" y="87" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#3b82f6">+</text>
      <text x="40" y="98" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#3b82f6">-</text>
      <text x="40" y="120" textAnchor="middle" fontSize="9" fill="#475569">{voltage}V</text>
      <line x1="40" y1="110" x2="40" y2="190" stroke="#334155" strokeWidth="2" />

      {/* Top wire */}
      <line x1="40" y1="40" x2="100" y2="40" stroke="#334155" strokeWidth="2" />

      {/* Resistor */}
      <polyline
        points="100,40 108,30 116,50 124,30 132,50 140,30 148,50 156,40 170,40"
        stroke="#ef4444" strokeWidth="2" fill="none"
      />
      <text x="135" y="25" textAnchor="middle" fontSize="9" fill="#475569">R={R >= 1000 ? `${(R/1000).toFixed(1)}k` : R}&#937;</text>

      {type === 'RC' && (
        <>
          {/* Wire to capacitor */}
          <line x1="170" y1="40" x2="250" y2="40" stroke="#334155" strokeWidth="2" />
          {/* Capacitor (vertical on the right) */}
          <line x1="250" y1="40" x2="250" y2="75" stroke="#334155" strokeWidth="2" />
          <line x1="235" y1="75" x2="265" y2="75" stroke="#22c55e" strokeWidth="3" />
          <line x1="235" y1="85" x2="265" y2="85" stroke="#22c55e" strokeWidth="3" />
          <line x1="250" y1="85" x2="250" y2="190" stroke="#334155" strokeWidth="2" />
          <text x="280" y="83" textAnchor="start" fontSize="9" fill="#475569">C={C >= 0.001 ? `${(C*1000).toFixed(1)}mF` : `${(C*1e6).toFixed(1)}\u00B5F`}</text>
          {/* Bottom wire */}
          <line x1="40" y1="190" x2="250" y2="190" stroke="#334155" strokeWidth="2" />
          {/* Ground */}
          <line x1="135" y1="190" x2="135" y2="200" stroke="#334155" strokeWidth="2" />
          <line x1="120" y1="200" x2="150" y2="200" stroke="#334155" strokeWidth="2" />
          <line x1="125" y1="205" x2="145" y2="205" stroke="#334155" strokeWidth="1.5" />
          <line x1="130" y1="210" x2="140" y2="210" stroke="#334155" strokeWidth="1" />
        </>
      )}

      {type === 'RL' && (
        <>
          {/* Wire to inductor */}
          <line x1="170" y1="40" x2="190" y2="40" stroke="#334155" strokeWidth="2" />
          {/* Inductor (coils) */}
          <path d="M190,40 Q200,20 210,40 Q220,20 230,40 Q240,20 250,40 Q260,20 270,40" stroke="#a855f7" strokeWidth="2" fill="none" />
          <text x="230" y="25" textAnchor="middle" fontSize="9" fill="#475569">L={L >= 1 ? `${L.toFixed(1)}H` : `${(L*1000).toFixed(1)}mH`}</text>
          {/* Wire down and back */}
          <line x1="270" y1="40" x2="300" y2="40" stroke="#334155" strokeWidth="2" />
          <line x1="300" y1="40" x2="300" y2="190" stroke="#334155" strokeWidth="2" />
          {/* Bottom wire */}
          <line x1="40" y1="190" x2="300" y2="190" stroke="#334155" strokeWidth="2" />
          {/* Ground */}
          <line x1="160" y1="190" x2="160" y2="200" stroke="#334155" strokeWidth="2" />
          <line x1="145" y1="200" x2="175" y2="200" stroke="#334155" strokeWidth="2" />
          <line x1="150" y1="205" x2="170" y2="205" stroke="#334155" strokeWidth="1.5" />
          <line x1="155" y1="210" x2="165" y2="210" stroke="#334155" strokeWidth="1" />
        </>
      )}

      {type === 'RLC' && (
        <>
          {/* Wire to inductor */}
          <line x1="170" y1="40" x2="185" y2="40" stroke="#334155" strokeWidth="2" />
          {/* Inductor */}
          <path d="M185,40 Q193,22 201,40 Q209,22 217,40 Q225,22 233,40 Q241,22 249,40" stroke="#a855f7" strokeWidth="2" fill="none" />
          <text x="217" y="25" textAnchor="middle" fontSize="9" fill="#475569">L={L >= 1 ? `${L.toFixed(1)}H` : `${(L*1000).toFixed(1)}mH`}</text>
          {/* Wire to capacitor area */}
          <line x1="249" y1="40" x2="310" y2="40" stroke="#334155" strokeWidth="2" />
          {/* Capacitor (vertical on the right) */}
          <line x1="310" y1="40" x2="310" y2="75" stroke="#334155" strokeWidth="2" />
          <line x1="295" y1="75" x2="325" y2="75" stroke="#22c55e" strokeWidth="3" />
          <line x1="295" y1="85" x2="325" y2="85" stroke="#22c55e" strokeWidth="3" />
          <line x1="310" y1="85" x2="310" y2="190" stroke="#334155" strokeWidth="2" />
          <text x="333" y="83" textAnchor="start" fontSize="9" fill="#475569">C={C >= 0.001 ? `${(C*1000).toFixed(1)}mF` : `${(C*1e6).toFixed(1)}\u00B5F`}</text>
          {/* Bottom wire */}
          <line x1="40" y1="190" x2="310" y2="190" stroke="#334155" strokeWidth="2" />
          {/* Ground */}
          <line x1="170" y1="190" x2="170" y2="200" stroke="#334155" strokeWidth="2" />
          <line x1="155" y1="200" x2="185" y2="200" stroke="#334155" strokeWidth="2" />
          <line x1="160" y1="205" x2="180" y2="205" stroke="#334155" strokeWidth="1.5" />
          <line x1="165" y1="210" x2="175" y2="210" stroke="#334155" strokeWidth="1" />
        </>
      )}

      {/* Current arrow */}
      <defs>
        <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="#f59e0b" />
        </marker>
      </defs>
      <line x1="60" y1="35" x2="85" y2="35" stroke="#f59e0b" strokeWidth="1.5" markerEnd="url(#arrowhead)" />
      <text x="72" y="30" textAnchor="middle" fontSize="8" fontStyle="italic" fill="#f59e0b">i(t)</text>
    </svg>
  );
}

export function InteractiveLab() {
  const [circuitType, setCircuitType] = useState<CircuitType>('RLC');
  const [inputType, setInputType] = useState<InputType>('step');
  const [R, setR] = useState(100);
  const [L, setL] = useState(0.1);
  const [C, setC] = useState(0.0001);
  const [voltage, setVoltage] = useState(10);
  const [duration, setDuration] = useState(0.01);
  const [autoDuration, setAutoDuration] = useState(false);
  const [showCurrent, setShowCurrent] = useState(true);
  const [showVoltage, setShowVoltage] = useState(true);

  // Compute the time constant for the current circuit
  const timeConstant = useMemo(() => {
    if (circuitType === 'RC') return R * C;
    if (circuitType === 'RL') return L / R;
    // RLC: envelope time constant = 1/alpha
    return (2 * L) / R;
  }, [circuitType, R, L, C]);

  // R_crit for RLC: R = 2*sqrt(L/C)
  const rCrit = useMemo(() => {
    if (circuitType === 'RLC') return 2 * Math.sqrt(L / C);
    return null;
  }, [circuitType, L, C]);

  // Auto-duration: 5*tau, clamped to [1ms, 100ms]
  const effectiveDuration = useMemo(() => {
    if (autoDuration) {
      const auto = Math.max(0.001, Math.min(0.1, 5 * timeConstant));
      return auto;
    }
    return duration;
  }, [autoDuration, timeConstant, duration]);

  const response = useMemo(() => {
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

  // Time constant in ms for the chart marker
  const timeConstantMs = timeConstant * 1000;

  // Damped period for underdamped RLC
  const dampedPeriodMs = useMemo(() => {
    if (circuitType === 'RLC' && response.dampingType === 'underdamped' && response.omega0 && response.zeta) {
      const omegaD = response.omega0 * Math.sqrt(1 - response.zeta * response.zeta);
      return (2 * Math.PI / omegaD) * 1000;
    }
    return null;
  }, [circuitType, response]);

  const handleReset = () => {
    setR(100);
    setL(0.1);
    setC(0.0001);
    setVoltage(10);
    setDuration(0.01);
    setAutoDuration(false);
  };

  // R_crit slider position as percentage
  const rCritPercent = rCrit !== null ? Math.min(100, Math.max(0, (rCrit / 10000) * 100)) : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Interactive Lab</h1>
        <p className="text-lg text-slate-600">
          Real-time circuit simulation and visualization
        </p>
      </div>

      {/* Circuit type tabs + input type toggle */}
      <div className="flex items-center justify-between border-b-2 border-slate-200">
        <div className="flex">
          {(['RC', 'RL', 'RLC'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setCircuitType(type)}
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
              onClick={() => setInputType(type)}
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

      {/* ROW 1: Config + Circuit Diagram (2-col) */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left: Sliders */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-slate-900">Configuration</h2>
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
                <input type="range" min="1" max="1000" step="1" value={L * 1000} onChange={(e) => setL(parseFloat(e.target.value) / 1000)} className="w-full accent-purple-500" />
                <div className="flex justify-between text-xs text-slate-400 mt-0.5"><span>1 mH</span><span>1 H</span></div>
              </div>
            )}

            {(circuitType === 'RC' || circuitType === 'RLC') && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Capacitance (C): <span className="text-engineering-blue-700 font-semibold">{(C * 1e6).toFixed(1)} &#181;F</span>
                </label>
                <input type="range" min="1" max="1000" step="1" value={C * 1e6} onChange={(e) => setC(parseFloat(e.target.value) / 1e6)} className="w-full accent-green-500" />
                <div className="flex justify-between text-xs text-slate-400 mt-0.5"><span>1 &#181;F</span><span>1 mF</span></div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Source Voltage: <span className="text-engineering-blue-700 font-semibold">{voltage.toFixed(1)} V</span>
              </label>
              <input type="range" min="1" max="50" step="0.5" value={voltage} onChange={(e) => setVoltage(parseFloat(e.target.value))} className="w-full accent-blue-500" />
              <div className="flex justify-between text-xs text-slate-400 mt-0.5"><span>1 V</span><span>50 V</span></div>
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

        {/* Right: Circuit diagram */}
        <div className="bg-white rounded-lg shadow-md p-6 flex flex-col">
          <h2 className="text-lg font-semibold text-slate-900 mb-3">{circuitType} Circuit Diagram</h2>
          <div className="flex-1 flex items-center justify-center bg-slate-50 rounded-lg p-4 border border-slate-100">
            <CircuitDiagram type={circuitType} R={R} L={L} C={C} voltage={voltage} />
          </div>
        </div>
      </div>

      {/* ROW 2: Equations */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-3 mb-4">
          <h3 className="text-xl font-semibold text-slate-900">Circuit Equations</h3>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
            inputType === 'step'
              ? 'bg-blue-100 text-blue-700'
              : 'bg-amber-100 text-amber-700'
          }`}>
            {inputType === 'step' ? 'Step Response' : 'Impulse Response'}
          </span>
        </div>

        {circuitType === 'RC' && inputType === 'step' && (
          <div className="grid md:grid-cols-3 gap-3">
            <div className="bg-slate-50 p-4 rounded-lg">
              <p className="text-sm font-semibold text-slate-700 mb-2">Time Constant:</p>
              <MathWrapper formula="\tau = RC" block />
            </div>
            <div className="bg-slate-50 p-4 rounded-lg">
              <p className="text-sm font-semibold text-slate-700 mb-2">Voltage Response:</p>
              <MathWrapper formula="v_C(t) = V_s(1 - e^{-t/\tau})" block />
            </div>
            <div className="bg-slate-50 p-4 rounded-lg">
              <p className="text-sm font-semibold text-slate-700 mb-2">Current Response:</p>
              <MathWrapper formula="i(t) = \frac{V_s}{R}e^{-t/\tau}" block />
            </div>
          </div>
        )}

        {circuitType === 'RC' && inputType === 'impulse' && (
          <div className="space-y-3">
            <div className="bg-amber-50 p-4 rounded-lg border-l-3 border-amber-400">
              <p className="text-xs text-amber-700 mb-2">Impulse response h(t) = derivative of step response</p>
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              <div className="bg-slate-50 p-4 rounded-lg">
                <p className="text-sm font-semibold text-slate-700 mb-2">Voltage (Impulse Response):</p>
                <MathWrapper formula="v_C(t) = \frac{1}{RC}e^{-t/\tau}" block />
              </div>
              <div className="bg-slate-50 p-4 rounded-lg">
                <p className="text-sm font-semibold text-slate-700 mb-2">S-Domain:</p>
                <MathWrapper formula="H(s) = \frac{1/RC}{s + 1/RC}" block />
              </div>
            </div>
          </div>
        )}

        {circuitType === 'RL' && inputType === 'step' && (
          <div className="grid md:grid-cols-3 gap-3">
            <div className="bg-slate-50 p-4 rounded-lg">
              <p className="text-sm font-semibold text-slate-700 mb-2">Time Constant:</p>
              <MathWrapper formula="\tau = \frac{L}{R}" block />
            </div>
            <div className="bg-slate-50 p-4 rounded-lg">
              <p className="text-sm font-semibold text-slate-700 mb-2">Current Response:</p>
              <MathWrapper formula="i(t) = \frac{V_s}{R}(1 - e^{-t/\tau})" block />
            </div>
            <div className="bg-slate-50 p-4 rounded-lg">
              <p className="text-sm font-semibold text-slate-700 mb-2">Voltage Response:</p>
              <MathWrapper formula="v_L(t) = V_s e^{-t/\tau}" block />
            </div>
          </div>
        )}

        {circuitType === 'RL' && inputType === 'impulse' && (
          <div className="space-y-3">
            <div className="bg-amber-50 p-4 rounded-lg border-l-3 border-amber-400">
              <p className="text-xs text-amber-700 mb-2">Impulse response h(t) = derivative of step response</p>
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              <div className="bg-slate-50 p-4 rounded-lg">
                <p className="text-sm font-semibold text-slate-700 mb-2">Current (Impulse Response):</p>
                <MathWrapper formula="i(t) = \frac{1}{L}e^{-Rt/L}" block />
              </div>
              <div className="bg-slate-50 p-4 rounded-lg">
                <p className="text-sm font-semibold text-slate-700 mb-2">S-Domain:</p>
                <MathWrapper formula="H(s) = \frac{R/L}{s + R/L}" block />
              </div>
            </div>
          </div>
        )}

        {circuitType === 'RLC' && response.alpha && response.omega0 && response.zeta && (
          <div className="space-y-3">
            {/* Characteristic parameters in a compact row */}
            <div className="bg-slate-50 p-4 rounded-lg">
              <p className="text-sm font-semibold text-slate-700 mb-2">Characteristic Parameters:</p>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <MathWrapper formula="\alpha = \frac{R}{2L}" />
                  <span className="text-sm text-slate-600 ml-2">= {response.alpha.toFixed(2)} rad/s</span>
                </div>
                <div>
                  <MathWrapper formula="\omega_0 = \frac{1}{\sqrt{LC}}" />
                  <span className="text-sm text-slate-600 ml-2">= {response.omega0.toFixed(2)} rad/s</span>
                </div>
                <div>
                  <MathWrapper formula="\zeta = \frac{\alpha}{\omega_0}" />
                  <span className="text-sm text-slate-600 ml-2">= {response.zeta.toFixed(3)}</span>
                </div>
              </div>
            </div>

            {inputType === 'impulse' && (
              <div className="bg-amber-50 p-4 rounded-lg border-l-3 border-amber-400">
                <p className="text-xs text-amber-700 mb-2">
                  Impulse response: <MathWrapper formula="h(t) = \mathcal{L}^{-1}\{H(s)\}" /> — the most fundamental characterization of the system
                </p>
              </div>
            )}

            {response.dampingType === 'underdamped' && (
              <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                <p className="text-sm font-semibold text-slate-700 mb-2">
                  Underdamped {inputType === 'impulse' ? 'Impulse' : 'Step'} Response:
                </p>
                {inputType === 'step' ? (
                  <MathWrapper formula="v_C(t) = V_s\left(1 - e^{-\alpha t}\left(\cos(\omega_d t) + \frac{\alpha}{\omega_d}\sin(\omega_d t)\right)\right)" block />
                ) : (
                  <MathWrapper formula="h(t) = \frac{\omega_0^2}{\omega_d}\,e^{-\alpha t}\sin(\omega_d t)" block />
                )}
                <p className="text-sm text-slate-600 mt-2">
                  where <MathWrapper formula="\omega_d = \omega_0\sqrt{1-\zeta^2}" /> = {(response.omega0 * Math.sqrt(1 - response.zeta * response.zeta)).toFixed(2)} rad/s
                </p>
              </div>
            )}

            {response.dampingType === 'critically-damped' && (
              <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                <p className="text-sm font-semibold text-slate-700 mb-2">
                  Critically Damped {inputType === 'impulse' ? 'Impulse' : 'Step'} Response:
                </p>
                {inputType === 'step' ? (
                  <MathWrapper formula="v_C(t) = V_s(1 - e^{-\alpha t}(1 + \alpha t))" block />
                ) : (
                  <MathWrapper formula="h(t) = \omega_0^2\,t\,e^{-\alpha t}" block />
                )}
              </div>
            )}

            {response.dampingType === 'overdamped' && (
              <div className="bg-amber-50 p-4 rounded-lg border-l-4 border-amber-500">
                <p className="text-sm font-semibold text-slate-700 mb-2">
                  Overdamped {inputType === 'impulse' ? 'Impulse' : 'Step'} Response:
                </p>
                {inputType === 'step' ? (
                  <>
                    <MathWrapper formula="v_C(t) = V_s(A_1 e^{s_1 t} + A_2 e^{s_2 t})" block />
                    <p className="text-sm text-slate-600 mt-2">where s&#8321;, s&#8322; are the two distinct real roots</p>
                  </>
                ) : (
                  <MathWrapper formula="h(t) = \frac{\omega_0^2}{s_1 - s_2}(e^{s_1 t} - e^{s_2 t})" block />
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ROW 3: Chart + Analysis side by side */}
      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        {/* Left: Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-semibold text-slate-900">Response Visualization</h3>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                inputType === 'step' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
              }`}>
                {inputType === 'step' ? 'Step Input u(t)' : 'Impulse Input \u03B4(t)'}
              </span>
            </div>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={showVoltage} onChange={(e) => setShowVoltage(e.target.checked)} className="w-4 h-4 accent-blue-500" />
                <span className="text-sm text-slate-700">Voltage</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={showCurrent} onChange={(e) => setShowCurrent(e.target.checked)} className="w-4 h-4 accent-red-500" />
                <span className="text-sm text-slate-700">Current</span>
              </label>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" label={{ value: 'Time (ms)', position: 'insideBottom', offset: -5 }} />
              <YAxis label={{ value: 'Voltage (V) / Current (mA)', angle: -90, position: 'insideLeft' }} />
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
              {/* Damped period marker for underdamped RLC */}
              {dampedPeriodMs && dampedPeriodMs <= effectiveDuration * 1000 && (
                <ReferenceLine
                  x={dampedPeriodMs}
                  stroke="#7c3aed"
                  strokeWidth={1.5}
                  strokeDasharray="6 3"
                  label={{ value: 'T\u1D48', position: 'top', fill: '#7c3aed', fontWeight: 'bold', fontSize: 13 }}
                />
              )}
              {showVoltage && (
                <Line type="monotone" dataKey="voltage" stroke="#3b82f6" name="Voltage" dot={false} strokeWidth={2} />
              )}
              {showCurrent && (
                <Line type="monotone" dataKey="current" stroke="#ef4444" name="Current" dot={false} strokeWidth={2} />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Right: Analysis panel */}
        <div className="bg-white rounded-lg shadow-md p-6 flex flex-col">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Circuit Analysis</h2>

          {circuitType === 'RLC' && response.dampingType && (
            <div className="space-y-3 flex-1">
              <div className={`rounded-lg p-4 ${
                response.dampingType === 'underdamped' ? 'bg-blue-50 border-l-4 border-blue-500' :
                response.dampingType === 'critically-damped' ? 'bg-green-50 border-l-4 border-green-500' :
                'bg-amber-50 border-l-4 border-amber-500'
              }`}>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Damping Type</p>
                <p className="text-xl font-bold capitalize text-slate-900 mt-0.5">
                  {response.dampingType.replace('-', ' ')}
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
          )}

          {(circuitType === 'RC' || circuitType === 'RL') && (
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
          )}
        </div>
      </div>

      {/* Tips */}
      <div className="bg-gradient-to-r from-engineering-blue-50 to-slate-50 rounded-lg shadow-md p-6 border-l-4 border-engineering-blue-600">
        <h3 className="text-xl font-semibold text-slate-900 mb-3">Experiment Tips</h3>
        <ul className="space-y-2 text-slate-700">
          <li className="flex items-start gap-2">
            <span className="text-engineering-blue-600 font-bold mt-1">&#8226;</span>
            <span><strong>RC Circuits:</strong> Increase R or C to slow down the response. The voltage across the capacitor rises exponentially.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-engineering-blue-600 font-bold mt-1">&#8226;</span>
            <span><strong>RL Circuits:</strong> Increase L or decrease R to slow the current rise. The inductor opposes rapid changes in current.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-engineering-blue-600 font-bold mt-1">&#8226;</span>
            <span><strong>RLC Circuits:</strong> Adjust R to change damping. Low R gives oscillations (underdamped), high R eliminates them (overdamped). The green R<sub>crit</sub> marker on the slider shows where critical damping occurs.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-engineering-blue-600 font-bold mt-1">&#8226;</span>
            <span>The dashed green line on the chart marks the time constant &#964;. For underdamped RLC, the purple line marks one damped period T<sub>d</sub>.</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
