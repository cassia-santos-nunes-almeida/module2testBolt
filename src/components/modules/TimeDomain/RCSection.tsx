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

export function RCSection() {
  // --- Shared slider state across steps ---
  const [hookR, setHookR] = useState(500);
  const [hookMoved, setHookMoved] = useState(false);

  const [verifyR, setVerifyR] = useState(1000);
  const [verifyC, setVerifyC] = useState(100); // in µF
  const [verifyVs, setVerifyVs] = useState(10);
  const [verifyMoved, setVerifyMoved] = useState(false);

  const [intuitionUnderstood, setIntuitionUnderstood] = useState(false);

  // --- Hook chart data ---
  const hookChartData = useMemo(() => {
    const C = 0.0001; // fixed 100µF for hook
    const response = calculateCircuitResponse('RC', { R: hookR, L: 0.1, C, voltage: 10 }, (hookR * C * 5) / 1000, hookR * C * 5);
    return response.data.map((p) => ({ time: p.time * 1000, voltage: p.voltage }));
  }, [hookR]);

  // --- Verify simulator data ---
  const cSI = verifyC / 1e6;
  const tau = verifyR * cSI;
  const tauMs = tau * 1000;
  const duration = Math.max(0.001, Math.min(0.1, 5 * tau));

  const verifyResponse = useMemo(() => {
    return calculateCircuitResponse('RC', { R: verifyR, L: 0.1, C: cSI, voltage: verifyVs }, duration / 1000, duration);
  }, [verifyR, cSI, verifyVs, duration]);

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
                  "You plug in a USB cable to charge your phone. Why doesn't it charge
                  instantly — and why does the last 20% take so long?"
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Resistance (R):{' '}
                  <span className="text-engineering-blue-700 font-semibold">
                    {hookR >= 1000 ? `${(hookR / 1000).toFixed(1)} k\u03A9` : `${hookR} \u03A9`}
                  </span>
                </label>
                <input
                  type="range" min="10" max="1000" step="10" value={hookR}
                  onChange={(e) => { setHookR(Number(e.target.value)); setHookMoved(true); }}
                  className="w-full accent-red-500"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-0.5">
                  <span>10 {'\u03A9'}</span><span>1 k{'\u03A9'}</span>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-4">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={hookChartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" label={{ value: 'time', position: 'insideBottom', offset: -5 }} />
                    <YAxis label={{ value: 'voltage', angle: -90, position: 'insideLeft' }} />
                    <Line type="monotone" dataKey="voltage" stroke="#3b82f6" dot={false} strokeWidth={2} />
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
                A capacitor is like a water tank being filled through a pipe.
              </p>
              <p>
                The resistance is the pipe's width — a narrow pipe (high R)
                fills the tank slowly.
              </p>
              <p>
                The capacitance is the tank's size — a bigger tank (high C)
                takes longer to fill.
              </p>
              <p>
                The "time constant" is how long the tank takes to reach about
                two-thirds full. That's it — that's the entire story of an RC
                circuit.
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
                <p className="text-sm text-slate-700">
                  Kirchhoff's Voltage Law around the loop:
                </p>
                <MathWrapper formula="V_s = v_R + v_C" block />
                <MathWrapper formula="V_s = iR + v_C" block />
                <p className="text-sm text-slate-600 italic mt-1">
                  "The source voltage splits between the resistor and the capacitor."
                </p>
              </div>

              {/* Constitutive law */}
              <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
                <h4 className="font-semibold text-slate-800">Step 2: Use Constitutive Law</h4>
                <p className="text-sm text-slate-700">
                  For a capacitor: <MathWrapper formula="i = C\frac{dv_C}{dt}" />
                </p>
                <MathWrapper formula="V_s = RC\frac{dv_C}{dt} + v_C" block />
              </div>

              {/* Solve ODE */}
              <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
                <h4 className="font-semibold text-slate-800">Step 3: Solve ODE</h4>
                <p className="text-sm text-slate-700">
                  This is a first-order linear ODE. Rearranging:
                </p>
                <MathWrapper formula="\frac{dv_C}{dt} + \frac{1}{RC}v_C = \frac{V_s}{RC}" block />
                <p className="text-sm text-slate-700">
                  Time constant: <MathWrapper formula="\tau = RC" />
                </p>
                <p className="text-sm text-slate-600 italic">
                  "The time constant — how many seconds until the capacitor is about 63% charged."
                </p>
                <p className="text-sm text-slate-700">
                  Solution (assuming <MathWrapper formula="v_C(0) = 0" />):
                </p>
                <MathWrapper formula={circuitAnalysisFormulas.rc.voltage} block />
                <p className="text-sm text-slate-600 italic">
                  "The capacitor voltage rises as a 'lazy S' toward the source voltage,
                  never quite reaching it instantly."
                </p>
              </div>

              {/* Find Current */}
              <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
                <h4 className="font-semibold text-slate-800">Step 4: Find Current</h4>
                <MathWrapper formula="i(t) = C\frac{dv_C}{dt} = \frac{V_s}{R}e^{-t/\tau}" block />
              </div>

              {/* S-Domain in collapsible */}
              <CollapsiblePanel title="Alternative: S-Domain Derivation">
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-semibold text-slate-800 mb-3">Step 1: Transform to S-Domain</h4>
                    <p className="text-sm text-slate-700 mb-2">
                      Apply Laplace transform to the time-domain equation:
                    </p>
                    <MathWrapper formula="\mathcal{L}\{V_s\} = \mathcal{L}\{iR + v_C\}" block />
                    <MathWrapper formula="\frac{V_s}{s} = RI(s) + V_C(s)" block />
                  </div>

                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-semibold text-slate-800 mb-3">Step 2: Capacitor Impedance</h4>
                    <MathWrapper formula="Z_C(s) = \frac{1}{sC}" block />
                    <MathWrapper formula="V_C(s) = I(s) \cdot \frac{1}{sC}" block />
                  </div>

                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-semibold text-slate-800 mb-3">Step 3: Solve Algebraically</h4>
                    <MathWrapper formula="\frac{V_s}{s} = I(s)\left(R + \frac{1}{sC}\right)" block />
                    <MathWrapper formula="I(s) = \frac{V_s}{R} \cdot \frac{1}{s + \frac{1}{RC}}" block />
                  </div>

                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-semibold text-slate-800 mb-3">Step 4: Inverse Transform</h4>
                    <MathWrapper formula="i(t) = \frac{V_s}{R}e^{-t/RC}" block />
                    <MathWrapper formula="v_C(t) = V_s(1 - e^{-t/RC})" block />
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
                  <h4 className="text-lg font-semibold text-slate-900">RC Simulator</h4>

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
                      Capacitance (C):{' '}
                      <span className="text-engineering-blue-700 font-semibold">{verifyC.toFixed(1)} {'\u00B5'}F</span>
                    </label>
                    <input
                      type="range" min="1" max="1000" step="1" value={verifyC}
                      onChange={(e) => { setVerifyC(Number(e.target.value)); setVerifyMoved(true); }}
                      className="w-full accent-green-500"
                    />
                    <div className="flex justify-between text-xs text-slate-400 mt-0.5">
                      <span>1 {'\u00B5'}F</span><span>1 mF</span>
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
                    <CircuitDiagram type="RC" R={verifyR} L={0.1} C={cSI} voltage={verifyVs} />
                  </div>
                </div>
              </div>

              {/* Live equation */}
              <LiveEquation
                label="Capacitor Voltage"
                formula="v_C(t) = V_s(1 - e^{-t/\tau})"
                substituted={`v_C(t) = ${verifyVs.toFixed(1)}\\,(1 - e^{-t/${tauMs.toFixed(3)}\\text{ ms}}),\\quad \\tau = ${tauMs.toFixed(3)}\\text{ ms}`}
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
              <GuidedQuestion question="Set R = 1k\u03A9 and C = 100\u00B5F. What is \u03C4? Now double R. What happened to the curve? Why does it take longer?" />

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
