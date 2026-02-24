import { useState, useMemo } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Legend,
  ScatterChart, Scatter,
} from 'recharts';
import { StepperLayout } from '../../common/StepperLayout';
import { PlainLanguageBlock } from '../../common/PlainLanguageBlock';
import { LiveEquation } from '../../common/LiveEquation';
import { GuidedQuestion } from '../../common/GuidedQuestion';
import { CollapsiblePanel } from '../../common/CollapsiblePanel';
import { MathWrapper } from '../../common/MathWrapper';
import { CircuitDiagram } from '../../common/CircuitDiagram';
import { ResponseChartTooltip, RCritMarker, PoleTooltip, DurationControl } from '../../common/CircuitCharts';
import { calculateCircuitResponse, calculateTransferFunction } from '../../../utils/circuitSolver';
import { circuitAnalysisFormulas } from '../../../utils/componentMath';

export function RLCSection() {
  // --- Hook state ---
  const [hookR, setHookR] = useState(50);
  const [hookMoved, setHookMoved] = useState(false);

  const [intuitionUnderstood, setIntuitionUnderstood] = useState(false);

  // --- Verify state ---
  const [verifyR, setVerifyR] = useState(100);
  const [verifyL, setVerifyL] = useState(100); // mH
  const [verifyC, setVerifyC] = useState(100); // µF
  const [verifyVs, setVerifyVs] = useState(10);
  const [autoDuration, setAutoDuration] = useState(true);
  const [manualDuration, setManualDuration] = useState(0.01);
  const [verifyMoved, setVerifyMoved] = useState(false);

  // --- Hook data ---
  const hookFixedL = 0.1; // 100mH
  const hookFixedC = 0.0001; // 100µF
  const hookRCrit = 2 * Math.sqrt(hookFixedL / hookFixedC);
  const hookRCritPercent = Math.min(100, Math.max(0, (hookRCrit / 10000) * 100));

  const hookChartData = useMemo(() => {
    const tau = (2 * hookFixedL) / hookR;
    const dur = Math.max(0.001, Math.min(0.1, 5 * tau));
    const response = calculateCircuitResponse('RLC', { R: hookR, L: hookFixedL, C: hookFixedC, voltage: 10 }, dur / 1000, dur);
    return response.data.map((p) => ({ time: p.time * 1000, voltage: p.voltage }));
  }, [hookR]);

  // --- Verify data ---
  const L_SI = verifyL / 1000;
  const C_SI = verifyC / 1e6;
  const alpha = verifyR / (2 * L_SI);
  const omega0 = 1 / Math.sqrt(L_SI * C_SI);
  const zeta = alpha / omega0;
  const rCrit = 2 * Math.sqrt(L_SI / C_SI);
  const rCritPercent = Math.min(100, Math.max(0, (rCrit / 10000) * 100));
  const timeConstant = (2 * L_SI) / verifyR;
  const tauMs = timeConstant * 1000;

  const effectiveDuration = useMemo(() => {
    if (autoDuration) return Math.max(0.001, Math.min(0.1, 5 * timeConstant));
    return manualDuration;
  }, [autoDuration, timeConstant, manualDuration]);

  const dampedPeriodMs = useMemo(() => {
    if (zeta < 1) {
      const omegaD = omega0 * Math.sqrt(1 - zeta * zeta);
      return (2 * Math.PI / omegaD) * 1000;
    }
    return null;
  }, [zeta, omega0]);

  let dampingLabel = '';
  if (zeta > 1.01) dampingLabel = 'Overdamped';
  else if (zeta < 0.99) dampingLabel = 'Underdamped';
  else dampingLabel = 'Critically Damped';

  const verifyResponse = useMemo(() => {
    return calculateCircuitResponse('RLC', { R: verifyR, L: L_SI, C: C_SI, voltage: verifyVs }, effectiveDuration / 1000, effectiveDuration);
  }, [verifyR, L_SI, C_SI, verifyVs, effectiveDuration]);

  const verifyChartData = useMemo(() => {
    return verifyResponse.data.map((p) => ({
      time: p.time * 1000,
      voltage: p.voltage,
      current: p.current * 1000,
    }));
  }, [verifyResponse.data]);

  // Pole-zero for verify
  const { poles, numerator, denominator } = useMemo(
    () => calculateTransferFunction(verifyR, L_SI, C_SI),
    [verifyR, L_SI, C_SI]
  );
  const poleData = poles.map((pole, idx) => ({
    x: pole.real,
    y: pole.imag,
    name: `Pole ${idx + 1}`,
  }));

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
                  "Push a child on a swing once and let go. Sometimes the swing
                  rocks back and forth. Sometimes it just… stops. What decides?"
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Resistance (R):{' '}
                  <span className="text-engineering-blue-700 font-semibold">
                    {hookR >= 1000 ? `${(hookR / 1000).toFixed(1)} k\u03A9` : `${hookR} \u03A9`}
                  </span>
                </label>
                <div className="relative">
                  <input
                    type="range" min="1" max="10000" step="1" value={hookR}
                    onChange={(e) => { setHookR(Number(e.target.value)); setHookMoved(true); }}
                    className="w-full accent-red-500"
                  />
                  <RCritMarker rCrit={hookRCrit} rCritPercent={hookRCritPercent} />
                </div>
                <div className="flex justify-between text-xs text-slate-400 mt-5">
                  <span>1 {'\u03A9'}</span><span>10 k{'\u03A9'}</span>
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
            <div className="space-y-6">
              <PlainLanguageBlock onUnderstood={() => setIntuitionUnderstood(true)}>
                <p>
                  The RLC circuit is like a swing set. The inductor is the mass of
                  the swing, the capacitor is the springiness of the chain, and the
                  resistor is friction.
                </p>
                <p>
                  Low friction (low R) = the swing oscillates back and forth. High
                  friction = it barely moves. There's a sweet spot in between —
                  "critical damping" — where the swing returns to center as fast as
                  possible without overshooting. That's the most useful case in
                  engineering.
                </p>
              </PlainLanguageBlock>

              {/* Damping type cards */}
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-lg p-5 border-2 border-blue-300">
                  <h4 className="font-semibold text-blue-900 mb-2">Underdamped</h4>
                  <p className="text-sm text-slate-700">
                    The swing oscillates. It overshoots, comes back, overshoots less,
                    and eventually settles.
                  </p>
                </div>
                <div className="bg-green-50 rounded-lg p-5 border-2 border-green-300">
                  <h4 className="font-semibold text-green-900 mb-2">Critically Damped</h4>
                  <p className="text-sm text-slate-700">
                    The swing returns to center in the shortest time possible without
                    overshooting. This is the sweet spot.
                  </p>
                </div>
                <div className="bg-amber-50 rounded-lg p-5 border-2 border-amber-300">
                  <h4 className="font-semibold text-amber-900 mb-2">Overdamped</h4>
                  <p className="text-sm text-slate-700">
                    The swing is so sluggish it takes forever to return to center.
                    No overshoot, but painfully slow.
                  </p>
                </div>
              </div>
            </div>
          ),
        },

        // ─── Step 3: FORMALISM ───
        {
          label: 'The Math',
          title: 'The Math',
          content: (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
                <h4 className="font-semibold text-slate-800">Step 1: Apply KVL</h4>
                <MathWrapper formula="V_s = v_R + v_L + v_C" block />
                <MathWrapper formula="V_s = iR + L\frac{di}{dt} + v_C" block />
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
                <h4 className="font-semibold text-slate-800">Step 2: Express in Terms of Voltage</h4>
                <p className="text-sm text-slate-700">
                  Since <MathWrapper formula="i = C\frac{dv_C}{dt}" />:
                </p>
                <MathWrapper formula="V_s = RC\frac{dv_C}{dt} + LC\frac{d^2v_C}{dt^2} + v_C" block />
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
                <h4 className="font-semibold text-slate-800">Step 3: Standard Form (2nd-Order ODE)</h4>
                <MathWrapper formula="\frac{d^2v_C}{dt^2} + \frac{R}{L}\frac{dv_C}{dt} + \frac{1}{LC}v_C = \frac{V_s}{LC}" block />
                <p className="text-sm text-slate-700">Define parameters:</p>
                <MathWrapper formula="\alpha = \frac{R}{2L}" block />
                <p className="text-sm text-slate-600 italic">
                  "How quickly the oscillations die out."
                </p>
                <MathWrapper formula="\omega_0 = \frac{1}{\sqrt{LC}}" block />
                <p className="text-sm text-slate-600 italic">
                  "How fast the system wants to oscillate if nothing slows it down."
                </p>
                <MathWrapper formula="\zeta = \frac{\alpha}{\omega_0}" block />
                <p className="text-sm text-slate-600 italic">
                  "The damping ratio — less than 1 means oscillation, exactly 1 is the sweet spot, greater than 1 means sluggish."
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
                <h4 className="font-semibold text-slate-800">Step 4: Solutions by Damping Type</h4>

                <div>
                  <p className="text-sm text-slate-700 mb-2">
                    <strong>Overdamped</strong> (<MathWrapper formula="\zeta > 1" />):
                  </p>
                  <MathWrapper formula={circuitAnalysisFormulas.rlc.overdamped} block />
                </div>

                <div>
                  <p className="text-sm text-slate-700 mb-2 mt-3">
                    <strong>Critically Damped</strong> (<MathWrapper formula="\zeta = 1" />):
                  </p>
                  <MathWrapper formula={circuitAnalysisFormulas.rlc.criticallyDamped} block />
                </div>

                <div>
                  <p className="text-sm text-slate-700 mb-2 mt-3">
                    <strong>Underdamped</strong> (<MathWrapper formula="\zeta < 1" />):
                  </p>
                  <MathWrapper formula={circuitAnalysisFormulas.rlc.underdamped} block />
                  <p className="text-sm text-slate-700 mt-2">
                    where <MathWrapper formula="\omega_d = \omega_0\sqrt{1-\zeta^2}" />
                  </p>
                </div>
              </div>

              {/* S-domain collapsible */}
              <CollapsiblePanel title="Alternative: S-Domain Derivation">
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-semibold text-slate-800 mb-3">Step 1: Component Impedances</h4>
                    <MathWrapper formula="Z_R(s) = R" block />
                    <MathWrapper formula="Z_L(s) = sL" block />
                    <MathWrapper formula="Z_C(s) = \frac{1}{sC}" block />
                  </div>

                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-semibold text-slate-800 mb-3">Step 2: Total Impedance</h4>
                    <MathWrapper formula="Z_{total}(s) = R + sL + \frac{1}{sC}" block />
                    <MathWrapper formula="Z_{total}(s) = \frac{s^2LC + sRC + 1}{sC}" block />
                  </div>

                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-semibold text-slate-800 mb-3">Step 3: Transfer Function</h4>
                    <MathWrapper formula="V_C(s) = \frac{V_s/LC}{s(s^2 + \frac{R}{L}s + \frac{1}{LC})}" block />
                  </div>

                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-semibold text-slate-800 mb-3">Step 4: Find Poles</h4>
                    <MathWrapper formula="s^2 + 2\alpha s + \omega_0^2 = 0" block />
                    <MathWrapper formula="s_{1,2} = -\alpha \pm \sqrt{\alpha^2 - \omega_0^2}" block />
                  </div>

                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-semibold text-slate-800 mb-3">Step 5: Inverse Transform</h4>
                    <ul className="text-sm text-slate-700 space-y-1 ml-4">
                      <li>Two real poles {'\u2192'} Overdamped</li>
                      <li>One repeated real pole {'\u2192'} Critically damped</li>
                      <li>Complex conjugate poles {'\u2192'} Underdamped</li>
                    </ul>
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
              {/* Sliders + Diagram */}
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-md p-6 space-y-5">
                  <h4 className="text-lg font-semibold text-slate-900">RLC Simulator</h4>

                  {/* R slider with Rcrit marker */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Resistance (R):{' '}
                      <span className="text-engineering-blue-700 font-semibold">
                        {verifyR >= 1000 ? `${(verifyR / 1000).toFixed(1)} k\u03A9` : `${verifyR} \u03A9`}
                      </span>
                    </label>
                    <div className="relative">
                      <input
                        type="range" min="1" max="10000" step="1" value={verifyR}
                        onChange={(e) => { setVerifyR(Number(e.target.value)); setVerifyMoved(true); }}
                        className="w-full accent-red-500"
                      />
                      <RCritMarker rCrit={rCrit} rCritPercent={rCritPercent} />
                    </div>
                    <div className="flex justify-between text-xs text-slate-400 mt-5">
                      <span>1 {'\u03A9'}</span><span>10 k{'\u03A9'}</span>
                    </div>
                  </div>

                  {/* L slider */}
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

                  {/* C slider */}
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

                  {/* Vs slider */}
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

                  {/* Duration */}
                  <DurationControl
                    effectiveDuration={effectiveDuration}
                    autoDuration={autoDuration}
                    duration={manualDuration}
                    onAutoDurationChange={setAutoDuration}
                    onDurationChange={setManualDuration}
                  />
                </div>

                {/* Circuit Diagram */}
                <div className="bg-white rounded-lg shadow-md p-6 flex flex-col">
                  <h4 className="text-lg font-semibold text-slate-900 mb-3">Circuit Diagram</h4>
                  <div className="flex-1 flex items-center justify-center bg-slate-50 rounded-lg p-4 border border-slate-100">
                    <CircuitDiagram type="RLC" R={verifyR} L={L_SI} C={C_SI} voltage={verifyVs} />
                  </div>

                  {/* Damping badge */}
                  <div className={`mt-4 rounded-lg p-3 text-center ${
                    dampingLabel === 'Underdamped' ? 'bg-blue-50 border-l-4 border-blue-500' :
                    dampingLabel === 'Critically Damped' ? 'bg-green-50 border-l-4 border-green-500' :
                    'bg-amber-50 border-l-4 border-amber-500'
                  }`}>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Damping Type</p>
                    <p className="text-xl font-bold text-slate-900 mt-0.5">{dampingLabel}</p>
                  </div>
                </div>
              </div>

              {/* Live equation — Transfer function */}
              <LiveEquation
                label="Transfer Function"
                formula="H(s) = \frac{\omega_0^2}{s^2 + 2\alpha s + \omega_0^2}"
                substituted={`H(s) = \\frac{${numerator[0].toFixed(0)}}{s^2 + ${denominator[1].toFixed(2)}s + ${denominator[2].toFixed(0)}}`}
              />

              {/* Pole-zero map + Step response side by side */}
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Pole-zero map */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h4 className="text-lg font-semibold text-slate-900 mb-4">S-Plane Pole-Zero Map</h4>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <ResponsiveContainer width="100%" height={300}>
                      <ScatterChart margin={{ top: 20, right: 20, bottom: 40, left: 40 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          type="number" dataKey="x" name="Real"
                          label={{ value: 'Real Axis (\u03C3)', position: 'insideBottom', offset: -10 }}
                          domain={['auto', 'auto']}
                        />
                        <YAxis
                          type="number" dataKey="y" name="Imaginary"
                          label={{ value: 'Imaginary (j\u03C9)', angle: -90, position: 'insideLeft' }}
                          domain={['auto', 'auto']}
                        />
                        <Tooltip
                          cursor={{ strokeDasharray: '3 3' }}
                          content={({ payload }) => <PoleTooltip payload={payload as Array<{ payload: { name: string; x: number; y: number } }>} />}
                        />
                        <ReferenceLine x={0} stroke="#64748b" strokeWidth={2} />
                        <ReferenceLine y={0} stroke="#64748b" strokeWidth={2} />
                        <Scatter name="Poles" data={poleData} fill="#ef4444" shape="cross" line={false} />
                      </ScatterChart>
                    </ResponsiveContainer>
                    <p className="text-xs text-center text-slate-600 mt-2">
                      Red {'\u2715'} marks indicate pole locations.{' '}
                      {poles.every(p => p.real < 0) ? (
                        <span className="text-green-700 font-semibold">STABLE</span>
                      ) : (
                        <span className="text-red-700 font-semibold">UNSTABLE</span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Step response chart */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h4 className="text-lg font-semibold text-slate-900 mb-4">Step Response</h4>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={verifyChartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" label={{ value: 'Time (ms)', position: 'insideBottom', offset: -5 }} />
                        <YAxis label={{ value: 'V / mA', angle: -90, position: 'insideLeft' }} />
                        <Tooltip content={({ payload, label }) => <ResponseChartTooltip payload={payload as Array<{ color?: string; name?: string; value?: string | number }>} label={label} />} />
                        <Legend />
                        {tauMs <= effectiveDuration * 1000 && (
                          <ReferenceLine
                            x={tauMs}
                            stroke="#16a34a"
                            strokeWidth={1.5}
                            strokeDasharray="6 3"
                            label={{ value: '\u03C4', position: 'top', fill: '#16a34a', fontWeight: 'bold', fontSize: 14 }}
                          />
                        )}
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
                  </div>
                </div>
              </div>

              {/* Guided question */}
              <GuidedQuestion
                question={`Move R past the green triangle (R\u2091\u2098\u1D62\u209C). What just happened to the poles on the s-plane? Why did the oscillations disappear?`}
              />

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
