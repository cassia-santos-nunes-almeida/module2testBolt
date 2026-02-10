import { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { RotateCcw } from 'lucide-react';
import { calculateCircuitResponse, type CircuitType } from '../../utils/circuitSolver';
import { MathWrapper } from '../common/MathWrapper';

export function InteractiveLab() {
  const [circuitType, setCircuitType] = useState<CircuitType>('RLC');
  const [R, setR] = useState(100);
  const [L, setL] = useState(0.1);
  const [C, setC] = useState(0.0001);
  const [voltage, setVoltage] = useState(10);
  const [duration, setDuration] = useState(0.01);
  const [showCurrent, setShowCurrent] = useState(true);
  const [showVoltage, setShowVoltage] = useState(true);

  const response = useMemo(() => {
    return calculateCircuitResponse(
      circuitType,
      { R, L, C, voltage },
      duration / 1000,
      duration
    );
  }, [circuitType, R, L, C, voltage, duration]);

  const chartData = useMemo(() => {
    return response.data.map((point) => ({
      time: point.time * 1000,
      voltage: point.voltage,
      current: point.current * 1000,
    }));
  }, [response.data]);

  const handleReset = () => {
    setR(100);
    setL(0.1);
    setC(0.0001);
    setVoltage(10);
    setDuration(0.01);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Interactive Lab</h1>
        <p className="text-lg text-slate-600">
          Real-time circuit simulation and visualization
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-slate-900">Circuit Configuration</h2>
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>

        <div className="flex gap-4 mb-6">
          {(['RC', 'RL', 'RLC'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setCircuitType(type)}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                circuitType === type
                  ? 'bg-engineering-blue-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {type} Circuit
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Resistance (R): {R.toFixed(0)} Ω
            </label>
            <input
              type="range"
              min="1"
              max="10000"
              step="1"
              value={R}
              onChange={(e) => setR(parseFloat(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>1 Ω</span>
              <span>10 kΩ</span>
            </div>
          </div>

          {(circuitType === 'RL' || circuitType === 'RLC') && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Inductance (L): {(L * 1000).toFixed(1)} mH
              </label>
              <input
                type="range"
                min="1"
                max="1000"
                step="1"
                value={L * 1000}
                onChange={(e) => setL(parseFloat(e.target.value) / 1000)}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>1 mH</span>
                <span>1 H</span>
              </div>
            </div>
          )}

          {(circuitType === 'RC' || circuitType === 'RLC') && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Capacitance (C): {(C * 1e6).toFixed(1)} µF
              </label>
              <input
                type="range"
                min="1"
                max="1000"
                step="1"
                value={C * 1e6}
                onChange={(e) => setC(parseFloat(e.target.value) / 1e6)}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>1 µF</span>
                <span>1 mF</span>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Source Voltage: {voltage.toFixed(1)} V
            </label>
            <input
              type="range"
              min="1"
              max="50"
              step="0.5"
              value={voltage}
              onChange={(e) => setVoltage(parseFloat(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>1 V</span>
              <span>50 V</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Duration: {(duration * 1000).toFixed(1)} ms
            </label>
            <input
              type="range"
              min="1"
              max="100"
              step="1"
              value={duration * 1000}
              onChange={(e) => setDuration(parseFloat(e.target.value) / 1000)}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>1 ms</span>
              <span>100 ms</span>
            </div>
          </div>
        </div>
      </div>

      {circuitType === 'RLC' && response.dampingType && (
        <div className="grid md:grid-cols-4 gap-4">
          <div className={`rounded-lg p-4 ${
            response.dampingType === 'underdamped' ? 'bg-blue-100 border-2 border-blue-500' :
            response.dampingType === 'critically-damped' ? 'bg-green-100 border-2 border-green-500' :
            'bg-amber-100 border-2 border-amber-500'
          }`}>
            <p className="text-sm font-semibold text-slate-700">Damping Type</p>
            <p className="text-xl font-bold capitalize text-slate-900">
              {response.dampingType.replace('-', ' ')}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4">
            <p className="text-sm font-semibold text-slate-700">Damping Coefficient (α)</p>
            <p className="text-xl font-bold text-engineering-blue-700">
              {response.alpha?.toFixed(2)} rad/s
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4">
            <p className="text-sm font-semibold text-slate-700">Natural Frequency (ω₀)</p>
            <p className="text-xl font-bold text-engineering-blue-700">
              {response.omega0?.toFixed(2)} rad/s
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4">
            <p className="text-sm font-semibold text-slate-700">Damping Ratio (ζ)</p>
            <p className="text-xl font-bold text-engineering-blue-700">
              {response.zeta?.toFixed(3)}
            </p>
          </div>
        </div>
      )}

      {(circuitType === 'RC' || circuitType === 'RL') && response.timeConstant && (
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-sm font-semibold text-slate-700">Time Constant (τ)</p>
          <p className="text-xl font-bold text-engineering-blue-700">
            {(response.timeConstant * 1000).toFixed(3)} ms
          </p>
          <p className="text-sm text-slate-600 mt-2">
            The circuit reaches ~63.2% of its final value in one time constant
          </p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-slate-900">Response Visualization</h3>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showVoltage}
                onChange={(e) => setShowVoltage(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm text-slate-700">Voltage</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showCurrent}
                onChange={(e) => setShowCurrent(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm text-slate-700">Current</span>
            </label>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="time"
              label={{ value: 'Time (ms)', position: 'insideBottom', offset: -5 }}
            />
            <YAxis
              label={{ value: 'Voltage (V) / Current (mA)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip
              content={({ payload, label }) => {
                if (payload && payload.length > 0) {
                  return (
                    <div className="bg-white p-3 border border-slate-300 rounded shadow-lg">
                      <p className="font-semibold text-slate-800">Time: {typeof label === 'string' ? parseFloat(label).toFixed(3) : Number(label).toFixed(3)} ms</p>
                      {payload.map((entry, index) => (
                        <p key={index} style={{ color: entry.color }} className="text-sm">
                          {entry.name}: {parseFloat(entry.value as string).toFixed(3)} {entry.name === 'Voltage' ? 'V' : 'mA'}
                        </p>
                      ))}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend />
            {showVoltage && (
              <Line
                type="monotone"
                dataKey="voltage"
                stroke="#3b82f6"
                name="Voltage"
                dot={false}
                strokeWidth={2}
              />
            )}
            {showCurrent && (
              <Line
                type="monotone"
                dataKey="current"
                stroke="#ef4444"
                name="Current"
                dot={false}
                strokeWidth={2}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-slate-900 mb-4">Circuit Equations</h3>

        {circuitType === 'RC' && (
          <div className="space-y-3">
            <div className="bg-slate-50 p-4 rounded-lg">
              <p className="text-sm font-semibold text-slate-700 mb-2">Time Constant:</p>
              <MathWrapper formula="\tau = RC" block />
              <p className="text-sm text-slate-600 mt-2">
                τ = {R} × {(C * 1e6).toFixed(1)}×10⁻⁶ = {(R * C * 1000).toFixed(3)} ms
              </p>
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

        {circuitType === 'RL' && (
          <div className="space-y-3">
            <div className="bg-slate-50 p-4 rounded-lg">
              <p className="text-sm font-semibold text-slate-700 mb-2">Time Constant:</p>
              <MathWrapper formula="\tau = \frac{L}{R}" block />
              <p className="text-sm text-slate-600 mt-2">
                τ = {(L * 1000).toFixed(1)}×10⁻³ / {R} = {((L / R) * 1000).toFixed(3)} ms
              </p>
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

        {circuitType === 'RLC' && response.alpha && response.omega0 && response.zeta && (
          <div className="space-y-3">
            <div className="bg-slate-50 p-4 rounded-lg">
              <p className="text-sm font-semibold text-slate-700 mb-2">Characteristic Parameters:</p>
              <div className="space-y-2">
                <div>
                  <MathWrapper formula="\alpha = \frac{R}{2L}" />
                  <span className="text-sm text-slate-600 ml-2">
                    = {response.alpha.toFixed(2)} rad/s
                  </span>
                </div>
                <div>
                  <MathWrapper formula="\omega_0 = \frac{1}{\sqrt{LC}}" />
                  <span className="text-sm text-slate-600 ml-2">
                    = {response.omega0.toFixed(2)} rad/s
                  </span>
                </div>
                <div>
                  <MathWrapper formula="\zeta = \frac{\alpha}{\omega_0}" />
                  <span className="text-sm text-slate-600 ml-2">
                    = {response.zeta.toFixed(3)}
                  </span>
                </div>
              </div>
            </div>

            {response.dampingType === 'underdamped' && (
              <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                <p className="text-sm font-semibold text-slate-700 mb-2">Underdamped Response:</p>
                <MathWrapper formula="v_C(t) = V_s\left(1 - e^{-\alpha t}\left(\cos(\omega_d t) + \frac{\alpha}{\omega_d}\sin(\omega_d t)\right)\right)" block />
                <p className="text-sm text-slate-600 mt-2">
                  where <MathWrapper formula="\omega_d = \omega_0\sqrt{1-\zeta^2}" /> = {(response.omega0 * Math.sqrt(1 - response.zeta * response.zeta)).toFixed(2)} rad/s
                </p>
              </div>
            )}

            {response.dampingType === 'critically-damped' && (
              <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                <p className="text-sm font-semibold text-slate-700 mb-2">Critically Damped Response:</p>
                <MathWrapper formula="v_C(t) = V_s(1 - e^{-\alpha t}(1 + \alpha t))" block />
              </div>
            )}

            {response.dampingType === 'overdamped' && (
              <div className="bg-amber-50 p-4 rounded-lg border-l-4 border-amber-500">
                <p className="text-sm font-semibold text-slate-700 mb-2">Overdamped Response:</p>
                <MathWrapper formula="v_C(t) = V_s(A_1 e^{s_1 t} + A_2 e^{s_2 t})" block />
                <p className="text-sm text-slate-600 mt-2">
                  where s₁, s₂ are the two distinct real roots
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="bg-gradient-to-r from-engineering-blue-50 to-slate-50 rounded-lg shadow-md p-6 border-l-4 border-engineering-blue-600">
        <h3 className="text-xl font-semibold text-slate-900 mb-3">Experiment Tips</h3>
        <ul className="space-y-2 text-slate-700">
          <li className="flex items-start gap-2">
            <span className="text-engineering-blue-600 font-bold mt-1">•</span>
            <span>
              <strong>RC Circuits:</strong> Increase R or C to slow down the response. The voltage across
              the capacitor rises exponentially.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-engineering-blue-600 font-bold mt-1">•</span>
            <span>
              <strong>RL Circuits:</strong> Increase L or decrease R to slow the current rise. The inductor
              opposes rapid changes in current.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-engineering-blue-600 font-bold mt-1">•</span>
            <span>
              <strong>RLC Circuits:</strong> Adjust R to change damping. Low R gives oscillations (underdamped),
              high R eliminates them (overdamped).
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-engineering-blue-600 font-bold mt-1">•</span>
            <span>
              Try to achieve critical damping (ζ = 1) for the fastest response without overshoot!
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
