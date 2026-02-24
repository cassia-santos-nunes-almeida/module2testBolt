import { useState } from 'react';
import { MathWrapper } from '../../common/MathWrapper';
import { CollapsiblePanel } from '../../common/CollapsiblePanel';
import { ModuleSummary } from '../../common/ModuleSummary';
import { RCSection } from './RCSection';
import { RLSection } from './RLSection';
import { RLCSection } from './RLCSection';

type CircuitType = 'RC' | 'RL' | 'RLC';

export function TimeDomain() {
  const [selectedCircuit, setSelectedCircuit] = useState<CircuitType>('RC');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Circuit Analysis</h1>
        <p className="text-lg text-slate-600">
          Explore RC, RL, and RLC circuits step by step — from intuition to simulation
        </p>
      </div>

      {/* Circuit type tabs */}
      <div className="flex border-b-2 border-slate-200">
        {(['RC', 'RL', 'RLC'] as const).map((type) => (
          <button
            key={type}
            onClick={() => setSelectedCircuit(type)}
            className={`px-6 py-3 font-semibold text-sm transition-colors border-b-3 -mb-[2px] ${
              selectedCircuit === type
                ? 'border-engineering-blue-600 text-engineering-blue-700 bg-engineering-blue-50'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
            }`}
          >
            {type} Circuit
          </button>
        ))}
      </div>

      {/* Circuit section with stepper */}
      {selectedCircuit === 'RC' && <RCSection />}
      {selectedCircuit === 'RL' && <RLSection />}
      {selectedCircuit === 'RLC' && <RLCSection />}

      {/* End-of-module: Method Comparison Table (collapsible) */}
      <CollapsiblePanel title="Summary: Time vs. S-Domain">
        <MethodComparisonTable />
      </CollapsiblePanel>

      {/* End-of-module: Response Comparisons (collapsible) */}
      <CollapsiblePanel title="Reference: Response Types">
        <ResponseComparisons />
      </CollapsiblePanel>

      {/* Module summary */}
      <ModuleSummary
        title="What you now know"
        items={[
          'Time constants (\u03C4 = RC for RC circuits, \u03C4 = L/R for RL circuits) determine how fast a circuit responds.',
          'The three damping types: underdamped (oscillates), critically damped (fastest without overshoot), overdamped (sluggish).',
          'The damping ratio \u03B6 = \u03B1/\u03C9\u2080 tells you which regime you\'re in.',
          'Time-domain analysis uses differential equations; s-domain transforms them into algebra. Both give the same answer.',
          'For simple 1st-order circuits, time-domain is straightforward. For 2nd-order and beyond, the s-domain approach is much easier.',
        ]}
      />
    </div>
  );
}

/* ─── Preserved from original ─── */

function MethodComparisonTable() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            <th className="border border-slate-300 bg-slate-100 px-4 py-3 text-left font-semibold text-slate-800 w-1/4">Aspect</th>
            <th className="border border-slate-300 bg-blue-50 px-4 py-3 text-left font-semibold text-blue-800 w-[37.5%]">Time-Domain</th>
            <th className="border border-slate-300 bg-purple-50 px-4 py-3 text-left font-semibold text-purple-800 w-[37.5%]">S-Domain (Laplace)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-slate-300 px-4 py-3 font-medium text-slate-700">Mathematical tool</td>
            <td className="border border-slate-300 px-4 py-3 text-slate-700">Differential equations (ODE/PDE)</td>
            <td className="border border-slate-300 px-4 py-3 text-slate-700">Algebraic equations in <MathWrapper formula="s" /></td>
          </tr>
          <tr className="bg-slate-50/50">
            <td className="border border-slate-300 px-4 py-3 font-medium text-slate-700">Initial conditions</td>
            <td className="border border-slate-300 px-4 py-3 text-slate-700">Applied after finding the general solution (constants of integration)</td>
            <td className="border border-slate-300 px-4 py-3 text-slate-700">Built into the transform automatically from the start</td>
          </tr>
          <tr>
            <td className="border border-slate-300 px-4 py-3 font-medium text-slate-700">Complexity scaling</td>
            <td className="border border-slate-300 px-4 py-3 text-slate-700">Grows rapidly with circuit order; 2nd-order and above require characteristic equation, multiple cases</td>
            <td className="border border-slate-300 px-4 py-3 text-slate-700">Remains algebraic regardless of order; higher-order just means more terms in the polynomial</td>
          </tr>
          <tr className="bg-slate-50/50">
            <td className="border border-slate-300 px-4 py-3 font-medium text-slate-700">Physical intuition</td>
            <td className="border border-slate-300 px-4 py-3 text-slate-700">Direct view of how voltages/currents evolve over time</td>
            <td className="border border-slate-300 px-4 py-3 text-slate-700">Insight via poles/zeros, transfer functions, and frequency response</td>
          </tr>
          <tr>
            <td className="border border-slate-300 px-4 py-3 font-medium text-slate-700">Input handling</td>
            <td className="border border-slate-300 px-4 py-3 text-slate-700">Each input type (step, impulse, sinusoid) may need a different solution technique</td>
            <td className="border border-slate-300 px-4 py-3 text-slate-700">Multiply transfer function by input's Laplace transform — same procedure every time</td>
          </tr>
          <tr className="bg-slate-50/50">
            <td className="border border-slate-300 px-4 py-3 font-medium text-slate-700">Stability analysis</td>
            <td className="border border-slate-300 px-4 py-3 text-slate-700">Must examine solution behavior as <MathWrapper formula="t \to \infty" /></td>
            <td className="border border-slate-300 px-4 py-3 text-slate-700">Check if all poles have negative real parts (left half-plane)</td>
          </tr>
          <tr>
            <td className="border border-slate-300 px-4 py-3 font-medium text-slate-700">Best suited for</td>
            <td className="border border-slate-300 px-4 py-3 text-slate-700">Simple 1st-order circuits, building foundational understanding</td>
            <td className="border border-slate-300 px-4 py-3 text-slate-700">Higher-order circuits, control systems, frequency-domain design</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function ResponseComparisons() {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-6">
        {/* Natural Response */}
        <div className="bg-amber-50 rounded-lg p-5 border border-amber-200">
          <h3 className="text-lg font-semibold text-amber-900 mb-1">Natural Response</h3>
          <p className="text-xs text-amber-700 mb-4">No external input — circuit discharges stored energy</p>

          <div className="space-y-4">
            <div className="bg-white rounded p-3">
              <p className="text-xs font-semibold text-slate-600 mb-2">RC Circuit</p>
              <p className="text-xs text-slate-600 mb-1">Capacitor initially charged to <MathWrapper formula="V_0" />:</p>
              <MathWrapper formula="v_C(t) = V_0 \, e^{-t/RC}" block />
            </div>

            <div className="bg-white rounded p-3">
              <p className="text-xs font-semibold text-slate-600 mb-2">RL Circuit</p>
              <p className="text-xs text-slate-600 mb-1">Inductor initially carrying <MathWrapper formula="I_0" />:</p>
              <MathWrapper formula="i(t) = I_0 \, e^{-Rt/L}" block />
            </div>

            <div className="bg-white rounded p-3">
              <p className="text-xs font-semibold text-slate-600 mb-2">RLC Circuit</p>
              <p className="text-xs text-slate-600 mb-1">Depends on damping ratio <MathWrapper formula="\zeta" />:</p>
              <MathWrapper formula="v(t) = e^{-\alpha t}(A_1 e^{s_1 t} + A_2 e^{s_2 t})" block />
            </div>

            <div className="bg-amber-100/60 rounded p-3">
              <p className="text-xs font-semibold text-amber-800 mb-1">S-Domain View</p>
              <p className="text-xs text-amber-700">
                The natural response comes from the <strong>poles of the transfer function</strong> alone.
                No input transform is involved — only initial condition terms appear.
              </p>
            </div>
          </div>
        </div>

        {/* Step Response */}
        <div className="bg-blue-50 rounded-lg p-5 border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-900 mb-1">Step Response</h3>
          <p className="text-xs text-blue-700 mb-4">
            Response to a suddenly applied constant input: <MathWrapper formula="u(t)" />
          </p>

          <div className="space-y-4">
            <div className="bg-white rounded p-3">
              <p className="text-xs font-semibold text-slate-600 mb-2">RC Circuit</p>
              <p className="text-xs text-slate-600 mb-1">Capacitor voltage rises toward <MathWrapper formula="V_s" />:</p>
              <MathWrapper formula="v_C(t) = V_s(1 - e^{-t/RC})" block />
            </div>

            <div className="bg-white rounded p-3">
              <p className="text-xs font-semibold text-slate-600 mb-2">RL Circuit</p>
              <p className="text-xs text-slate-600 mb-1">Current rises toward <MathWrapper formula="V_s/R" />:</p>
              <MathWrapper formula="i(t) = \frac{V_s}{R}(1 - e^{-Rt/L})" block />
            </div>

            <div className="bg-white rounded p-3">
              <p className="text-xs font-semibold text-slate-600 mb-2">RLC Circuit (underdamped)</p>
              <p className="text-xs text-slate-600 mb-1">Oscillates before settling:</p>
              <MathWrapper formula="v_C(t) = V_s\!\left(1 - \frac{e^{-\alpha t}}{\sqrt{1-\zeta^2}}\sin(\omega_d t + \phi)\right)" block />
            </div>

            <div className="bg-blue-100/60 rounded p-3">
              <p className="text-xs font-semibold text-blue-800 mb-1">S-Domain View</p>
              <p className="text-xs text-blue-700">
                Multiply transfer function <MathWrapper formula="H(s)" /> by the step input <MathWrapper formula="1/s" />,
                then inverse transform. The <MathWrapper formula="1/s" /> factor adds a pole at the origin,
                producing the DC steady-state component.
              </p>
            </div>
          </div>
        </div>

        {/* Impulse Response */}
        <div className="bg-purple-50 rounded-lg p-5 border border-purple-200">
          <h3 className="text-lg font-semibold text-purple-900 mb-1">Impulse Response</h3>
          <p className="text-xs text-purple-700 mb-4">
            Response to a Dirac delta input: <MathWrapper formula="\delta(t)" />
          </p>

          <div className="space-y-4">
            <div className="bg-white rounded p-3">
              <p className="text-xs font-semibold text-slate-600 mb-2">RC Circuit</p>
              <p className="text-xs text-slate-600 mb-1">Instantaneous charge, then exponential decay:</p>
              <MathWrapper formula="v_C(t) = \frac{1}{RC}\,e^{-t/RC}" block />
            </div>

            <div className="bg-white rounded p-3">
              <p className="text-xs font-semibold text-slate-600 mb-2">RL Circuit</p>
              <p className="text-xs text-slate-600 mb-1">Current jumps, then decays:</p>
              <MathWrapper formula="i(t) = \frac{1}{L}\,e^{-Rt/L}" block />
            </div>

            <div className="bg-white rounded p-3">
              <p className="text-xs font-semibold text-slate-600 mb-2">RLC Circuit (underdamped)</p>
              <p className="text-xs text-slate-600 mb-1">Damped oscillation from the start:</p>
              <MathWrapper formula="h(t) = \frac{\omega_0}{\sqrt{1-\zeta^2}}\,e^{-\alpha t}\sin(\omega_d t)" block />
            </div>

            <div className="bg-purple-100/60 rounded p-3">
              <p className="text-xs font-semibold text-purple-800 mb-1">S-Domain View</p>
              <p className="text-xs text-purple-700">
                Since <MathWrapper formula="\mathcal{L}\{\delta(t)\} = 1" />, the impulse response is
                simply <MathWrapper formula="h(t) = \mathcal{L}^{-1}\{H(s)\}" />. This is the most
                fundamental response — it fully characterizes the system.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-50 rounded-lg p-5 border border-slate-200">
        <h3 className="text-base font-semibold text-slate-900 mb-3">Key Relationships</h3>
        <div className="grid md:grid-cols-3 gap-4 text-sm text-slate-700">
          <div className="bg-white rounded p-3 border border-slate-100">
            <p className="font-medium text-slate-800 mb-1">Impulse {'\u2192'} Step</p>
            <p className="text-xs mb-2">The step response is the integral of the impulse response:</p>
            <MathWrapper formula="y_{\text{step}}(t) = \int_0^t h(\tau)\,d\tau" block />
          </div>
          <div className="bg-white rounded p-3 border border-slate-100">
            <p className="font-medium text-slate-800 mb-1">Step {'\u2192'} Impulse</p>
            <p className="text-xs mb-2">The impulse response is the derivative of the step response:</p>
            <MathWrapper formula="h(t) = \frac{d}{dt}\,y_{\text{step}}(t)" block />
          </div>
          <div className="bg-white rounded p-3 border border-slate-100">
            <p className="font-medium text-slate-800 mb-1">Convolution</p>
            <p className="text-xs mb-2">Any response can be found via convolution with the impulse response:</p>
            <MathWrapper formula="y(t) = h(t) * x(t) = \int_0^t h(\tau)\,x(t-\tau)\,d\tau" block />
          </div>
        </div>
      </div>
    </div>
  );
}
