import { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import type { CircuitType, InputType } from '../../types/circuit';
import { calculateCircuitResponse } from '../../utils/circuitSolver';
import { ResponseChartTooltip } from '../../components/circuit/CircuitCharts';
import { CircuitEquations } from './CircuitEquations';
import { RLCAnalysisPanel, FirstOrderAnalysisPanel } from './RLCAnalysisPanel';
import { CircuitTabBar, ConfigurationPanel } from './LabControls';
import { CircuitDiagram } from './CircuitDiagram';

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
      <CircuitTabBar
        circuitType={circuitType}
        inputType={inputType}
        onCircuitTypeChange={setCircuitType}
        onInputTypeChange={setInputType}
      />

      {/* ROW 1: Config + Circuit Diagram (2-col) */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left: Sliders */}
        <ConfigurationPanel
          circuitType={circuitType}
          R={R} L={L} C={C} voltage={voltage}
          duration={duration} autoDuration={autoDuration} effectiveDuration={effectiveDuration}
          rCrit={rCrit} rCritPercent={rCritPercent}
          onRChange={setR} onLChange={setL} onCChange={setC} onVoltageChange={setVoltage}
          onDurationChange={setDuration} onAutoDurationChange={setAutoDuration}
          onReset={handleReset}
        />

        {/* Right: Circuit diagram */}
        <div className="bg-white rounded-lg shadow-md p-6 flex flex-col">
          <h2 className="text-lg font-semibold text-slate-900 mb-3">{circuitType} Circuit Diagram</h2>
          <div className="flex-1 flex items-center justify-center bg-slate-50 rounded-lg p-4 border border-slate-100">
            <CircuitDiagram type={circuitType} R={R} L={L} C={C} voltage={voltage} />
          </div>
        </div>
      </div>

      {/* ROW 2: Equations */}
      <CircuitEquations circuitType={circuitType} inputType={inputType} response={response} />

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
            <RLCAnalysisPanel response={response} timeConstantMs={timeConstantMs} />
          )}

          {(circuitType === 'RC' || circuitType === 'RL') && (
            <FirstOrderAnalysisPanel circuitType={circuitType} response={response} R={R} L={L} C={C} />
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
