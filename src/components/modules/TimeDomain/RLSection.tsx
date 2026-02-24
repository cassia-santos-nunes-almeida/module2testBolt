import { useState, useMemo } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Legend,
} from 'recharts';
import { StepperLayout } from '../../common/StepperLayout';
import { PlainLanguageBlock } from '../../common/PlainLanguageBlock';
import { LiveEquation } from '../../common/LiveEquation';
import { GuidedQuestion } from '../../common/GuidedQuestion';
import { CollapsiblePanel } from '../../common/CollapsiblePanel';
import { MathWrapper } from '../../common/MathWrapper';
import { CircuitDiagram } from '../../common/CircuitDiagram';
import { ResponseChartTooltip } from '../../common/CircuitCharts';
import { calculateCircuitResponse } from '../../../utils/circuitSolver';
import { circuitAnalysisFormulas } from '../../../utils/componentMath';

export function RLSection() {
  // --- Hook state ---
  const [hookL, setHookL] = useState(100); // in mH
  const [hookMoved, setHookMoved] = useState(false);

  const [intuitionUnderstood, setIntuitionUnderstood] = useState(false);

  // --- Verify state ---
  const [verifyR, setVerifyR] = useState(100);
  const [verifyL, setVerifyL] = useState(100); // in mH
  const [verifyVs, setVerifyVs] = useState(10);
  const [verifyMoved, setVerifyMoved] = useState(false);

  // --- Hook chart data ---
  const hookChartData = useMemo(() => {
    const R = 100; // fixed
    const L_SI = hookL / 1000;
    const tau = L_SI / R;
    const dur = Math.max(0.001, Math.min(0.1, 5 * tau));
    const response = calculateCircuitResponse('RL', { R, L: L_SI, C: 0.0001, voltage: 10 }, dur / 1000, dur);
    return response.data.map((p) => ({ time: p.time * 1000, current: p.current * 1000 }));
  }, [hookL]);

  // --- Verify simulator data ---
  const L_SI = verifyL / 1000;
  const tau = L_SI / verifyR;
  const tauMs = tau * 1000;
  const duration = Math.max(0.001, Math.min(0.1, 5 * tau));

  const verifyResponse = useMemo(() => {
    return calculateCircuitResponse('RL', { R: verifyR, L: L_SI, C: 0.0001, voltage: verifyVs }, duration / 1000, duration);
  }, [verifyR, L_SI, verifyVs, duration]);

  const verifyChartData = useMemo(() => {
    return verifyResponse.data.map((p) => ({
      time: p.time * 1000,
      voltage: p.voltage,
      current: p.current * 1000,
    }));
  }, [verifyResponse.data]);

  return (
    <StepperLayout
      steps={[
        // ─── Step 1: HOOK ───
        {
          label: 'Feel It',
          title: 'Feel It',
          isGateSatisfied: () => hookMoved,
          content: (
            <div className="space-y-6">
              <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
                <p className="text-lg text-slate-800 leading-relaxed italic">
                  "You flip a light switch. Why does a fluorescent lamp sometimes
                  flicker or spark — and an LED doesn't?"
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Inductance (L):{' '}
                  <span className="text-engineering-blue-700 font-semibold">{hookL.toFixed(1)} mH</span>
                </label>
                <input
                  type="range" min="1" max="1000" step="1" value={hookL}
                  onChange={(e) => { setHookL(Number(e.target.value)); setHookMoved(true); }}
                  className="w-full accent-purple-500"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-0.5">
                  <span>1 mH</span><span>1 H</span>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-4">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={hookChartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" label={{ value: 'time', position: 'insideBottom', offset: -5 }} />
                    <YAxis label={{ value: 'current', angle: -90, position: 'insideLeft' }} />
                    <Line type="monotone" dataKey="current" stroke="#ef4444" dot={false} strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {!hookMoved && (
                <p className="text-sm text-amber-600 font-medium text-center">
                  Move the slider to continue.
                </p>
              )}
            </div>
          ),
        },

        // ─── Step 2: INTUITION ───
        {
          label: 'Build Intuition',
          title: 'Build Intuition',
          isGateSatisfied: () => intuitionUnderstood,
          content: (
            <PlainLanguageBlock onUnderstood={() => setIntuitionUnderstood(true)}>
              <p>
                An inductor is like a heavy flywheel. Push it — it resists
                speeding up. Stop pushing — it keeps spinning.
              </p>
              <p>
                That "sluggishness" is inductance. Higher inductance means the
                current takes longer to build up, just like a heavier flywheel
                takes longer to get going.
              </p>
            </PlainLanguageBlock>
          ),
        },

        // ─── Step 3: FORMALISM ───
        {
          label: 'The Math',
          title: 'The Math',
          content: (
            <div className="space-y-6">
              {/* KVL */}
              <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
                <h4 className="font-semibold text-slate-800">Step 1: Apply KVL</h4>
                <MathWrapper formula="V_s = v_R + v_L" block />
                <MathWrapper formula="V_s = iR + v_L" block />
              </div>

              {/* Constitutive law */}
              <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
                <h4 className="font-semibold text-slate-800">Step 2: Use Constitutive Law</h4>
                <p className="text-sm text-slate-700">
                  For an inductor: <MathWrapper formula="v_L = L\frac{di}{dt}" />
                </p>
                <MathWrapper formula="V_s = iR + L\frac{di}{dt}" block />
              </div>

              {/* Solve ODE */}
              <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
                <h4 className="font-semibold text-slate-800">Step 3: Solve ODE</h4>
                <p className="text-sm text-slate-700">Rearranging:</p>
                <MathWrapper formula="\frac{di}{dt} + \frac{R}{L}i = \frac{V_s}{L}" block />
                <p className="text-sm text-slate-700">
                  Time constant: <MathWrapper formula="\tau = \frac{L}{R}" />
                </p>
                <p className="text-sm text-slate-600 italic">
                  "The time constant — how long until the current reaches about 63% of its final value."
                </p>
                <p className="text-sm text-slate-700">
                  Solution (assuming <MathWrapper formula="i(0) = 0" />):
                </p>
                <MathWrapper formula={circuitAnalysisFormulas.rl.current} block />
              </div>

              {/* Voltage */}
              <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
                <h4 className="font-semibold text-slate-800">Step 4: Find Voltage</h4>
                <MathWrapper formula="v_L(t) = L\frac{di}{dt} = V_s e^{-Rt/L}" block />
              </div>

              {/* S-Domain in collapsible */}
              <CollapsiblePanel title="Alternative: S-Domain Derivation">
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-semibold text-slate-800 mb-3">Step 1: Transform to S-Domain</h4>
                    <MathWrapper formula="\frac{V_s}{s} = I(s)R + V_L(s)" block />
                  </div>

                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-semibold text-slate-800 mb-3">Step 2: Inductor Impedance</h4>
                    <MathWrapper formula="Z_L(s) = sL" block />
                    <MathWrapper formula="V_L(s) = I(s) \cdot sL" block />
                  </div>

                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-semibold text-slate-800 mb-3">Step 3: Solve Algebraically</h4>
                    <MathWrapper formula="\frac{V_s}{s} = I(s)(R + sL)" block />
                    <MathWrapper formula="I(s) = \frac{V_s}{R}\left(\frac{1}{s} - \frac{1}{s + \frac{R}{L}}\right)" block />
                  </div>

                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-semibold text-slate-800 mb-3">Step 4: Inverse Transform</h4>
                    <MathWrapper formula="i(t) = \frac{V_s}{R}(1 - e^{-Rt/L})" block />
                    <MathWrapper formula="v_L(t) = V_s e^{-Rt/L}" block />
                  </div>
                </div>
              </CollapsiblePanel>
            </div>
          ),
        },

        // ─── Step 4: VERIFY ───
        {
          label: 'Try It Yourself',
          title: 'Try It Yourself',
          isGateSatisfied: () => verifyMoved,
          content: (
            <div className="space-y-6">
              {/* Sliders */}
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-md p-6 space-y-5">
                  <h4 className="text-lg font-semibold text-slate-900">RL Simulator</h4>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Resistance (R):{' '}
                      <span className="text-engineering-blue-700 font-semibold">
                        {verifyR >= 1000 ? `${(verifyR / 1000).toFixed(1)} k\u03A9` : `${verifyR} \u03A9`}
                      </span>
                    </label>
                    <input
                      type="range" min="1" max="10000" step="1" value={verifyR}
                      onChange={(e) => { setVerifyR(Number(e.target.value)); setVerifyMoved(true); }}
                      className="w-full accent-red-500"
                    />
                    <div className="flex justify-between text-xs text-slate-400 mt-0.5">
                      <span>1 {'\u03A9'}</span><span>10 k{'\u03A9'}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Inductance (L):{' '}
                      <span className="text-engineering-blue-700 font-semibold">{verifyL.toFixed(1)} mH</span>
                    </label>
                    <input
                      type="range" min="1" max="1000" step="1" value={verifyL}
                      onChange={(e) => { setVerifyL(Number(e.target.value)); setVerifyMoved(true); }}
                      className="w-full accent-purple-500"
                    />
                    <div className="flex justify-between text-xs text-slate-400 mt-0.5">
                      <span>1 mH</span><span>1 H</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Source Voltage (V<sub>s</sub>):{' '}
                      <span className="text-engineering-blue-700 font-semibold">{verifyVs.toFixed(1)} V</span>
                    </label>
                    <input
                      type="range" min="1" max="50" step="0.5" value={verifyVs}
                      onChange={(e) => { setVerifyVs(Number(e.target.value)); setVerifyMoved(true); }}
                      className="w-full accent-blue-500"
                    />
                    <div className="flex justify-between text-xs text-slate-400 mt-0.5">
                      <span>1 V</span><span>50 V</span>
                    </div>
                  </div>
                </div>

                {/* Circuit Diagram */}
                <div className="bg-white rounded-lg shadow-md p-6 flex flex-col">
                  <h4 className="text-lg font-semibold text-slate-900 mb-3">Circuit Diagram</h4>
                  <div className="flex-1 flex items-center justify-center bg-slate-50 rounded-lg p-4 border border-slate-100">
                    <CircuitDiagram type="RL" R={verifyR} L={L_SI} C={0.0001} voltage={verifyVs} />
                  </div>
                </div>
              </div>

              {/* Live equation */}
              <LiveEquation
                label="Inductor Current"
                formula="i(t) = \frac{V_s}{R}(1 - e^{-Rt/L})"
                substituted={`i(t) = \\frac{${verifyVs.toFixed(1)}}{${verifyR}}\\,(1 - e^{-t/${tauMs.toFixed(3)}\\text{ ms}}),\\quad \\tau = ${tauMs.toFixed(3)}\\text{ ms}`}
              />

              {/* Chart */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h4 className="text-lg font-semibold text-slate-900 mb-4">Response</h4>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={verifyChartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" label={{ value: 'Time (ms)', position: 'insideBottom', offset: -5 }} />
                    <YAxis label={{ value: 'V / mA', angle: -90, position: 'insideLeft' }} />
                    <Tooltip content={({ payload, label }) => <ResponseChartTooltip payload={payload as Array<{ color?: string; name?: string; value?: string | number }>} label={label} />} />
                    <Legend />
                    {tauMs <= duration * 1000 && (
                      <ReferenceLine
                        x={tauMs}
                        stroke="#16a34a"
                        strokeWidth={1.5}
                        strokeDasharray="6 3"
                        label={{ value: '\u03C4', position: 'top', fill: '#16a34a', fontWeight: 'bold', fontSize: 14 }}
                      />
                    )}
                    <Line type="monotone" dataKey="voltage" stroke="#3b82f6" name="Voltage" dot={false} strokeWidth={2} />
                    <Line type="monotone" dataKey="current" stroke="#ef4444" name="Current" dot={false} strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Guided question */}
              <GuidedQuestion question="Set L = 100mH and R = 100\u03A9. What is \u03C4? Now halve R. What happened?" />

              {!verifyMoved && (
                <p className="text-sm text-amber-600 font-medium text-center">
                  Move at least one slider to continue.
                </p>
              )}
            </div>
          ),
        },
      ]}
    />
  );
}
