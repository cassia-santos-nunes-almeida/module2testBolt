import { useState } from 'react';
import { MathWrapper } from '../common/MathWrapper';
import { calculateTransferFunction } from '../../utils/circuitSolver';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

export function SDomainAnalysis() {
  const [R, setR] = useState(100);
  const [L, setL] = useState(0.1);
  const [C, setC] = useState(0.0001);

  const { poles, numerator, denominator } = calculateTransferFunction(R, L, C);
  const alpha = R / (2 * L);
  const omega0 = 1 / Math.sqrt(L * C);
  const zeta = alpha / omega0;

  let dampingType = '';
  if (zeta > 1.05) dampingType = 'Overdamped';
  else if (zeta < 0.95) dampingType = 'Underdamped';
  else dampingType = 'Critically Damped';

  const poleData = poles.map((pole, idx) => ({
    x: pole.real,
    y: pole.imag,
    name: `Pole ${idx + 1}`,
  }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-slate-900 mb-2">S-Domain Analysis</h1>
        <p className="text-lg text-slate-600">
          Transfer functions, poles, zeros, and stability analysis
        </p>
      </div>

      <section className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-slate-900 mb-4">Transfer Function Fundamentals</h2>

        <div className="space-y-4">
          <div className="bg-slate-50 p-4 rounded-lg">
            <p className="text-sm font-semibold text-slate-800 mb-2">Definition:</p>
            <p className="text-sm text-slate-700 mb-3">
              A transfer function <MathWrapper formula="H(s)" /> is the ratio of the output to input
              in the s-domain, assuming zero initial conditions.
            </p>
            <MathWrapper formula="H(s) = \frac{Y(s)}{X(s)} = \frac{N(s)}{D(s)}" block />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-white p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-engineering-blue-900 mb-2">Poles</h4>
              <p className="text-sm text-slate-700 mb-2">
                Values of <MathWrapper formula="s" /> where <MathWrapper formula="D(s) = 0" />
              </p>
              <p className="text-sm text-slate-700">
                Poles determine system stability and transient response characteristics.
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-white p-4 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-900 mb-2">Zeros</h4>
              <p className="text-sm text-slate-700 mb-2">
                Values of <MathWrapper formula="s" /> where <MathWrapper formula="N(s) = 0" />
              </p>
              <p className="text-sm text-slate-700">
                Zeros affect the magnitude and phase of the frequency response.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-slate-900 mb-4">RLC Circuit Transfer Function</h2>

        <div className="space-y-4">
          <div className="bg-slate-50 p-4 rounded-lg">
            <p className="text-sm font-semibold text-slate-800 mb-2">For a series RLC circuit:</p>
            <MathWrapper formula="H(s) = \frac{V_C(s)}{V_s(s)} = \frac{\omega_0^2}{s^2 + 2\alpha s + \omega_0^2}" block />
            <div className="mt-3 text-sm text-slate-700 space-y-1">
              <p>where:</p>
              <p><MathWrapper formula="\alpha = \frac{R}{2L}" /> = Damping coefficient</p>
              <p><MathWrapper formula="\omega_0 = \frac{1}{\sqrt{LC}}" /> = Natural frequency (rad/s)</p>
              <p><MathWrapper formula="\zeta = \frac{\alpha}{\omega_0} = \frac{R}{2}\sqrt{\frac{C}{L}}" /> = Damping ratio</p>
            </div>
          </div>

          <div className="bg-engineering-blue-50 p-4 rounded-lg">
            <p className="text-sm font-semibold text-slate-800 mb-2">Characteristic Equation:</p>
            <MathWrapper formula="s^2 + 2\alpha s + \omega_0^2 = 0" block />
            <p className="text-sm text-slate-700 mt-2">
              Poles: <MathWrapper formula="s_{1,2} = -\alpha \pm \sqrt{\alpha^2 - \omega_0^2}" />
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-slate-900 mb-4">Interactive Pole-Zero Map</h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800">Circuit Parameters</h3>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Resistance (R): <span className="text-red-600 font-semibold">{R} &#937;</span>
              </label>
              <input
                type="range"
                min="10"
                max="1000"
                step="10"
                value={R}
                onChange={(e) => setR(parseFloat(e.target.value))}
                className="w-full accent-red-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Inductance (L): <span className="text-purple-600 font-semibold">{(L * 1000).toFixed(1)} mH</span>
              </label>
              <input
                type="range"
                min="10"
                max="1000"
                step="10"
                value={L * 1000}
                onChange={(e) => setL(parseFloat(e.target.value) / 1000)}
                className="w-full accent-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Capacitance (C): <span className="text-green-600 font-semibold">{(C * 1e6).toFixed(1)} &#181;F</span>
              </label>
              <input
                type="range"
                min="10"
                max="1000"
                step="10"
                value={C * 1e6}
                onChange={(e) => setC(parseFloat(e.target.value) / 1e6)}
                className="w-full accent-green-500"
              />
            </div>

            <div className="bg-slate-50 p-4 rounded-lg space-y-2">
              <h4 className="font-semibold text-slate-800">Calculated Parameters:</h4>
              <p className="text-sm text-slate-700">
                α (Damping Coefficient): {alpha.toFixed(2)} rad/s
              </p>
              <p className="text-sm text-slate-700">
                ω₀ (Natural Frequency): {omega0.toFixed(2)} rad/s
              </p>
              <p className="text-sm text-slate-700">
                ζ (Damping Ratio): {zeta.toFixed(3)}
              </p>
              <div className={`mt-3 px-3 py-2 rounded ${
                dampingType === 'Underdamped' ? 'bg-blue-100 text-blue-900' :
                dampingType === 'Overdamped' ? 'bg-amber-100 text-amber-900' :
                'bg-green-100 text-green-900'
              }`}>
                <p className="font-semibold">{dampingType}</p>
              </div>
            </div>

            <div className="bg-engineering-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-slate-800 mb-2">Transfer Function:</h4>
              <MathWrapper
                formula={`H(s) = \\frac{${numerator[0].toFixed(0)}}{s^2 + ${denominator[1].toFixed(2)}s + ${denominator[2].toFixed(0)}}`}
                block
              />
            </div>

            <div className="bg-slate-50 p-4 rounded-lg">
              <h4 className="font-semibold text-slate-800 mb-2">Pole Locations:</h4>
              {poles.map((pole, idx) => (
                <p key={idx} className="text-sm text-slate-700">
                  s<sub>{idx + 1}</sub> = {pole.real.toFixed(2)}
                  {pole.imag !== 0 && ` ${pole.imag > 0 ? '+' : ''}${pole.imag.toFixed(2)}j`}
                </p>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-4">S-Plane Pole-Zero Map</h3>
            <div className="bg-slate-50 p-4 rounded-lg">
              <ResponsiveContainer width="100%" height={400}>
                <ScatterChart margin={{ top: 20, right: 20, bottom: 40, left: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    type="number"
                    dataKey="x"
                    name="Real"
                    label={{ value: 'Real Axis (σ)', position: 'insideBottom', offset: -10 }}
                    domain={['auto', 'auto']}
                  />
                  <YAxis
                    type="number"
                    dataKey="y"
                    name="Imaginary"
                    label={{ value: 'Imaginary Axis (jω)', angle: -90, position: 'insideLeft' }}
                    domain={['auto', 'auto']}
                  />
                  <Tooltip
                    cursor={{ strokeDasharray: '3 3' }}
                    content={({ payload }) => {
                      if (payload && payload.length > 0) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white p-2 border border-slate-300 rounded shadow-lg text-xs">
                            <p className="font-semibold">{data.name}</p>
                            <p>Real: {data.x.toFixed(3)}</p>
                            <p>Imag: {data.y.toFixed(3)}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <ReferenceLine x={0} stroke="#64748b" strokeWidth={2} />
                  <ReferenceLine y={0} stroke="#64748b" strokeWidth={2} />
                  <Scatter
                    name="Poles"
                    data={poleData}
                    fill="#ef4444"
                    shape="cross"
                    line={false}
                  />
                </ScatterChart>
              </ResponsiveContainer>
              <p className="text-xs text-center text-slate-600 mt-2">
                Red ✕ marks indicate pole locations
              </p>
            </div>

            <div className="bg-amber-50 p-4 rounded-lg mt-4 border-l-4 border-amber-500">
              <h4 className="font-semibold text-amber-900 mb-2">Stability Insight:</h4>
              <p className="text-sm text-slate-700">
                {poles.every(p => p.real < 0) ? (
                  <span className="text-green-700 font-semibold">
                    ✓ System is STABLE (all poles in left half-plane)
                  </span>
                ) : (
                  <span className="text-red-700 font-semibold">
                    ✗ System is UNSTABLE (poles in right half-plane)
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-slate-900 mb-4">Damping Behavior</h2>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-white p-5 rounded-lg border-2 border-blue-300">
            <h4 className="font-semibold text-engineering-blue-900 mb-2">
              Underdamped (ζ &lt; 1)
            </h4>
            <div className="mb-3">
              <MathWrapper formula="\alpha < \omega_0" block />
            </div>
            <p className="text-sm text-slate-700 mb-2">
              <strong>Poles:</strong> Complex conjugate pair
            </p>
            <p className="text-sm text-slate-700 mb-2">
              <strong>Response:</strong> Oscillatory with exponential decay
            </p>
            <p className="text-sm text-slate-700">
              Common in lightly damped resonant circuits. Exhibits ringing and overshoot.
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-white p-5 rounded-lg border-2 border-green-300">
            <h4 className="font-semibold text-green-900 mb-2">
              Critically Damped (ζ = 1)
            </h4>
            <div className="mb-3">
              <MathWrapper formula="\alpha = \omega_0" block />
            </div>
            <p className="text-sm text-slate-700 mb-2">
              <strong>Poles:</strong> Two identical real poles
            </p>
            <p className="text-sm text-slate-700 mb-2">
              <strong>Response:</strong> Fastest rise time without overshoot
            </p>
            <p className="text-sm text-slate-700">
              Ideal for control systems requiring fast settling without oscillation.
            </p>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-white p-5 rounded-lg border-2 border-amber-300">
            <h4 className="font-semibold text-amber-900 mb-2">
              Overdamped (ζ &gt; 1)
            </h4>
            <div className="mb-3">
              <MathWrapper formula="\alpha > \omega_0" block />
            </div>
            <p className="text-sm text-slate-700 mb-2">
              <strong>Poles:</strong> Two distinct real poles
            </p>
            <p className="text-sm text-slate-700 mb-2">
              <strong>Response:</strong> Slow exponential approach, no overshoot
            </p>
            <p className="text-sm text-slate-700">
              Heavily damped systems. Slow to reach steady state but very stable.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-engineering-blue-50 to-slate-50 rounded-lg shadow-md p-6 border-l-4 border-engineering-blue-600">
        <h3 className="text-xl font-semibold text-slate-900 mb-3">Key Takeaways</h3>
        <ul className="space-y-2 text-slate-700">
          <li className="flex items-start gap-2">
            <span className="text-engineering-blue-600 font-bold mt-1">•</span>
            <span>
              Transfer functions provide a complete description of system dynamics in the s-domain.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-engineering-blue-600 font-bold mt-1">•</span>
            <span>
              Pole locations determine stability and transient behavior. Poles in the left half-plane
              indicate stability.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-engineering-blue-600 font-bold mt-1">•</span>
            <span>
              The damping ratio ζ predicts oscillatory behavior: ζ &lt; 1 gives oscillations,
              ζ = 1 is optimal damping, ζ &gt; 1 is sluggish.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-engineering-blue-600 font-bold mt-1">•</span>
            <span>
              Natural frequency ω₀ determines how fast the system responds, while α controls
              the rate of decay.
            </span>
          </li>
        </ul>
      </section>
    </div>
  );
}
