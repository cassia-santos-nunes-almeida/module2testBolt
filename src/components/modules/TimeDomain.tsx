import { useState, type ReactNode } from 'react';
import { MathWrapper } from '../common/MathWrapper';
import { circuitAnalysisFormulas } from '../../utils/componentMath';
import { ArrowRight } from 'lucide-react';

type CircuitType = 'RC' | 'RL' | 'RLC';

/** Shared layout for the time-domain vs s-domain comparison sections (F16). */
function CircuitComparisonLayout({ timeContent, sContent, conclusion }: {
  timeContent: ReactNode;
  sContent: ReactNode;
  conclusion: ReactNode;
}) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="bg-gradient-to-br from-blue-50 to-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
        <h3 className="text-2xl font-semibold text-slate-900 mb-4">Time-Domain Approach</h3>
        <div className="space-y-4">{timeContent}</div>
      </div>

      <div className="bg-gradient-to-br from-purple-50 to-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
        <h3 className="text-2xl font-semibold text-slate-900 mb-4">S-Domain Approach</h3>
        <div className="space-y-4">{sContent}</div>
      </div>

      <div className="col-span-full bg-green-50 rounded-lg shadow-md p-6 border-l-4 border-green-500">
        <div className="flex items-center gap-3 mb-3">
          <ArrowRight className="w-6 h-6 text-green-600" />
          <h3 className="text-xl font-semibold text-slate-900">Conclusion</h3>
        </div>
        {conclusion}
      </div>
    </div>
  );
}

export function TimeDomain() {
  const [selectedCircuit, setSelectedCircuit] = useState<CircuitType>('RC');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Circuit Analysis</h1>
        <p className="text-lg text-slate-600">
          Comparing time-domain differential equations with Laplace transform s-domain methods
        </p>
      </div>

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

      {selectedCircuit === 'RC' && <RCCircuitComparison />}
      {selectedCircuit === 'RL' && <RLCircuitComparison />}
      {selectedCircuit === 'RLC' && <RLCCircuitComparison />}

      <MethodComparisonTable />
      <ResponseComparisons />
    </div>
  );
}

function RCCircuitComparison() {
  return (
    <CircuitComparisonLayout
      timeContent={<>
          <div>
            <h4 className="font-semibold text-slate-800 mb-2">Circuit Setup</h4>
            <p className="text-sm text-slate-700">
              Consider a series RC circuit with a voltage source <MathWrapper formula="V_s" />,
              resistor <MathWrapper formula="R" />, and capacitor <MathWrapper formula="C" />.
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-semibold text-slate-800 mb-3">Step 1: Apply KVL</h4>
            <p className="text-sm text-slate-700 mb-2">
              Kirchhoff's Voltage Law around the loop:
            </p>
            <MathWrapper formula="V_s = v_R + v_C" block />
            <MathWrapper formula="V_s = iR + v_C" block />
          </div>

          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-semibold text-slate-800 mb-3">Step 2: Use Constitutive Law</h4>
            <p className="text-sm text-slate-700 mb-2">
              For a capacitor: <MathWrapper formula="i = C\frac{dv_C}{dt}" />
            </p>
            <MathWrapper formula="V_s = RC\frac{dv_C}{dt} + v_C" block />
          </div>

          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-semibold text-slate-800 mb-3">Step 3: Solve ODE</h4>
            <p className="text-sm text-slate-700 mb-2">
              This is a first-order linear ODE. Rearranging:
            </p>
            <MathWrapper formula="\frac{dv_C}{dt} + \frac{1}{RC}v_C = \frac{V_s}{RC}" block />
            <p className="text-sm text-slate-700 mt-2 mb-2">
              Time constant: <MathWrapper formula="\tau = RC" />
            </p>
            <p className="text-sm text-slate-700 mb-2">
              Solution (assuming <MathWrapper formula="v_C(0) = 0" />):
            </p>
            <MathWrapper formula={circuitAnalysisFormulas.rc.voltage} block />
          </div>

          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-semibold text-slate-800 mb-3">Step 4: Find Current</h4>
            <MathWrapper formula="i(t) = C\frac{dv_C}{dt} = \frac{V_s}{R}e^{-t/\tau}" block />
          </div>
      </>}
      sContent={<>
          <div>
            <h4 className="font-semibold text-slate-800 mb-2">Circuit Setup</h4>
            <p className="text-sm text-slate-700">
              Same RC circuit, but we'll transform to the s-domain using Laplace transforms.
            </p>
          </div>

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
            <p className="text-sm text-slate-700 mb-2">
              In s-domain, capacitor impedance is:
            </p>
            <MathWrapper formula="Z_C(s) = \frac{1}{sC}" block />
            <p className="text-sm text-slate-700 mt-2 mb-2">
              Using Ohm's law in s-domain:
            </p>
            <MathWrapper formula="V_C(s) = I(s) \cdot \frac{1}{sC}" block />
          </div>

          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-semibold text-slate-800 mb-3">Step 3: Solve Algebraically</h4>
            <p className="text-sm text-slate-700 mb-2">
              Substitute and solve for <MathWrapper formula="I(s)" />:
            </p>
            <MathWrapper formula="\frac{V_s}{s} = I(s)\left(R + \frac{1}{sC}\right)" block />
            <MathWrapper formula="I(s) = \frac{V_s/s}{R + \frac{1}{sC}} = \frac{V_s C}{s(RCs + 1)}" block />
            <MathWrapper formula="I(s) = \frac{V_s}{R} \cdot \frac{1}{s + \frac{1}{RC}}" block />
          </div>

          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-semibold text-slate-800 mb-3">Step 4: Inverse Transform</h4>
            <p className="text-sm text-slate-700 mb-2">
              Using the transform pair <MathWrapper formula="\mathcal{L}^{-1}\{\frac{1}{s+a}\} = e^{-at}" />:
            </p>
            <MathWrapper formula="i(t) = \frac{V_s}{R}e^{-t/RC}" block />
            <p className="text-sm text-slate-700 mt-3">
              For voltage:
            </p>
            <MathWrapper formula="v_C(t) = V_s(1 - e^{-t/RC})" block />
          </div>
      </>}
      conclusion={
        <p className="text-slate-700">
          Both methods yield the <strong>identical result</strong>! The time-domain approach
          requires solving a differential equation, while the s-domain approach transforms
          it into an algebraic problem. For simple circuits, both are manageable, but for
          complex circuits, the s-domain method is significantly easier.
        </p>
      }
    />
  );
}

function RLCircuitComparison() {
  return (
    <CircuitComparisonLayout
      timeContent={<>
          <div>
            <h4 className="font-semibold text-slate-800 mb-2">Circuit Setup</h4>
            <p className="text-sm text-slate-700">
              Consider a series RL circuit with voltage source <MathWrapper formula="V_s" />,
              resistor <MathWrapper formula="R" />, and inductor <MathWrapper formula="L" />.
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-semibold text-slate-800 mb-3">Step 1: Apply KVL</h4>
            <MathWrapper formula="V_s = v_R + v_L" block />
            <MathWrapper formula="V_s = iR + v_L" block />
          </div>

          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-semibold text-slate-800 mb-3">Step 2: Use Constitutive Law</h4>
            <p className="text-sm text-slate-700 mb-2">
              For an inductor: <MathWrapper formula="v_L = L\frac{di}{dt}" />
            </p>
            <MathWrapper formula="V_s = iR + L\frac{di}{dt}" block />
          </div>

          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-semibold text-slate-800 mb-3">Step 3: Solve ODE</h4>
            <p className="text-sm text-slate-700 mb-2">
              Rearranging:
            </p>
            <MathWrapper formula="\frac{di}{dt} + \frac{R}{L}i = \frac{V_s}{L}" block />
            <p className="text-sm text-slate-700 mt-2 mb-2">
              Time constant: <MathWrapper formula="\tau = \frac{L}{R}" />
            </p>
            <p className="text-sm text-slate-700 mb-2">
              Solution (assuming <MathWrapper formula="i(0) = 0" />):
            </p>
            <MathWrapper formula={circuitAnalysisFormulas.rl.current} block />
          </div>

          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-semibold text-slate-800 mb-3">Step 4: Find Voltage</h4>
            <MathWrapper formula="v_L(t) = L\frac{di}{dt} = V_s e^{-Rt/L}" block />
          </div>
      </>}
      sContent={<>
          <div>
            <h4 className="font-semibold text-slate-800 mb-2">Circuit Setup</h4>
            <p className="text-sm text-slate-700">
              Same RL circuit, transformed to the s-domain.
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-semibold text-slate-800 mb-3">Step 1: Transform to S-Domain</h4>
            <MathWrapper formula="\frac{V_s}{s} = I(s)R + V_L(s)" block />
          </div>

          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-semibold text-slate-800 mb-3">Step 2: Inductor Impedance</h4>
            <p className="text-sm text-slate-700 mb-2">
              In s-domain, inductor impedance is:
            </p>
            <MathWrapper formula="Z_L(s) = sL" block />
            <p className="text-sm text-slate-700 mt-2 mb-2">
              Therefore:
            </p>
            <MathWrapper formula="V_L(s) = I(s) \cdot sL" block />
          </div>

          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-semibold text-slate-800 mb-3">Step 3: Solve Algebraically</h4>
            <MathWrapper formula="\frac{V_s}{s} = I(s)(R + sL)" block />
            <MathWrapper formula="I(s) = \frac{V_s}{s(R + sL)} = \frac{V_s}{sR(1 + \frac{sL}{R})}" block />
            <MathWrapper formula="I(s) = \frac{V_s}{R} \cdot \frac{1}{s(1 + \frac{sL}{R})} = \frac{V_s}{R}\left(\frac{1}{s} - \frac{1}{s + \frac{R}{L}}\right)" block />
          </div>

          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-semibold text-slate-800 mb-3">Step 4: Inverse Transform</h4>
            <p className="text-sm text-slate-700 mb-2">
              Using standard transform pairs:
            </p>
            <MathWrapper formula="i(t) = \frac{V_s}{R}(1 - e^{-Rt/L})" block />
            <p className="text-sm text-slate-700 mt-3">
              For voltage across inductor:
            </p>
            <MathWrapper formula="v_L(t) = V_s e^{-Rt/L}" block />
          </div>
      </>}
      conclusion={
        <p className="text-slate-700">
          Again, both approaches give the <strong>same result</strong>. The RL circuit behaves
          similarly to the RC circuit with an exponential rise in current and exponential decay
          in voltage across the inductor. The time constant <MathWrapper formula="\tau = L/R" />
          determines the response speed.
        </p>
      }
    />
  );
}

function MethodComparisonTable() {
  return (
    <section className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold text-slate-900 mb-2">Method Comparison</h2>
      <p className="text-sm text-slate-600 mb-5">
        Time-domain vs s-domain: when to use each approach
      </p>

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
    </section>
  );
}

function ResponseComparisons() {
  return (
    <section className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold text-slate-900 mb-2">Circuit Response Types</h2>
      <p className="text-sm text-slate-600 mb-6">
        How circuits respond to different standard inputs — natural, step, and impulse
      </p>

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

      <div className="mt-6 bg-slate-50 rounded-lg p-5 border border-slate-200">
        <h3 className="text-base font-semibold text-slate-900 mb-3">Key Relationships</h3>
        <div className="grid md:grid-cols-3 gap-4 text-sm text-slate-700">
          <div className="bg-white rounded p-3 border border-slate-100">
            <p className="font-medium text-slate-800 mb-1">Impulse → Step</p>
            <p className="text-xs mb-2">The step response is the integral of the impulse response:</p>
            <MathWrapper formula="y_{\text{step}}(t) = \int_0^t h(\tau)\,d\tau" block />
          </div>
          <div className="bg-white rounded p-3 border border-slate-100">
            <p className="font-medium text-slate-800 mb-1">Step → Impulse</p>
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
    </section>
  );
}

function RLCCircuitComparison() {
  return (
    <CircuitComparisonLayout
      timeContent={<>
          <div>
            <h4 className="font-semibold text-slate-800 mb-2">Circuit Setup</h4>
            <p className="text-sm text-slate-700">
              Series RLC circuit with <MathWrapper formula="V_s" />, <MathWrapper formula="R" />,
              <MathWrapper formula="L" />, and <MathWrapper formula="C" />.
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-semibold text-slate-800 mb-3">Step 1: Apply KVL</h4>
            <MathWrapper formula="V_s = v_R + v_L + v_C" block />
            <MathWrapper formula="V_s = iR + L\frac{di}{dt} + v_C" block />
          </div>

          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-semibold text-slate-800 mb-3">Step 2: Express in Terms of Voltage</h4>
            <p className="text-sm text-slate-700 mb-2">
              Since <MathWrapper formula="i = C\frac{dv_C}{dt}" />:
            </p>
            <MathWrapper formula="V_s = RC\frac{dv_C}{dt} + LC\frac{d^2v_C}{dt^2} + v_C" block />
          </div>

          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-semibold text-slate-800 mb-3">Step 3: Standard Form</h4>
            <MathWrapper formula="\frac{d^2v_C}{dt^2} + \frac{R}{L}\frac{dv_C}{dt} + \frac{1}{LC}v_C = \frac{V_s}{LC}" block />
            <p className="text-sm text-slate-700 mt-2">
              Define parameters:
            </p>
            <MathWrapper formula="\alpha = \frac{R}{2L}" block />
            <MathWrapper formula="\omega_0 = \frac{1}{\sqrt{LC}}" block />
            <MathWrapper formula="\zeta = \frac{\alpha}{\omega_0}" block />
          </div>

          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-semibold text-slate-800 mb-3">Step 4: Solutions by Damping Type</h4>
            <p className="text-sm text-slate-700 mb-2">
              <strong>Overdamped</strong> (<MathWrapper formula="\zeta > 1" />):
            </p>
            <MathWrapper formula={circuitAnalysisFormulas.rlc.overdamped} block />

            <p className="text-sm text-slate-700 mb-2 mt-3">
              <strong>Critically Damped</strong> (<MathWrapper formula="\zeta = 1" />):
            </p>
            <MathWrapper formula={circuitAnalysisFormulas.rlc.criticallyDamped} block />

            <p className="text-sm text-slate-700 mb-2 mt-3">
              <strong>Underdamped</strong> (<MathWrapper formula="\zeta < 1" />):
            </p>
            <MathWrapper formula={circuitAnalysisFormulas.rlc.underdamped} block />
            <p className="text-sm text-slate-700 mt-2">
              where <MathWrapper formula="\omega_d = \omega_0\sqrt{1-\zeta^2}" />
            </p>
          </div>
      </>}
      sContent={<>
          <div>
            <h4 className="font-semibold text-slate-800 mb-2">Circuit Setup</h4>
            <p className="text-sm text-slate-700">
              Same RLC circuit, transformed to s-domain. Much simpler!
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-semibold text-slate-800 mb-3">Step 1: Component Impedances</h4>
            <p className="text-sm text-slate-700 mb-2">
              In s-domain:
            </p>
            <MathWrapper formula="Z_R(s) = R" block />
            <MathWrapper formula="Z_L(s) = sL" block />
            <MathWrapper formula="Z_C(s) = \frac{1}{sC}" block />
          </div>

          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-semibold text-slate-800 mb-3">Step 2: Total Impedance</h4>
            <p className="text-sm text-slate-700 mb-2">
              Series impedance:
            </p>
            <MathWrapper formula="Z_{total}(s) = R + sL + \frac{1}{sC}" block />
            <MathWrapper formula="Z_{total}(s) = \frac{s^2LC + sRC + 1}{sC}" block />
          </div>

          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-semibold text-slate-800 mb-3">Step 3: Transfer Function</h4>
            <p className="text-sm text-slate-700 mb-2">
              Current in s-domain:
            </p>
            <MathWrapper formula="I(s) = \frac{V_s/s}{Z_{total}(s)}" block />
            <p className="text-sm text-slate-700 mt-2 mb-2">
              Voltage across capacitor:
            </p>
            <MathWrapper formula="V_C(s) = I(s) \cdot \frac{1}{sC}" block />
            <MathWrapper formula="V_C(s) = \frac{V_s}{s^2LC + sRC + 1}" block />
            <MathWrapper formula="V_C(s) = \frac{V_s/LC}{s(s^2 + \frac{R}{L}s + \frac{1}{LC})}" block />
          </div>

          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-semibold text-slate-800 mb-3">Step 4: Find Poles</h4>
            <p className="text-sm text-slate-700 mb-2">
              Characteristic equation:
            </p>
            <MathWrapper formula="s^2 + \frac{R}{L}s + \frac{1}{LC} = 0" block />
            <MathWrapper formula="s^2 + 2\alpha s + \omega_0^2 = 0" block />
            <p className="text-sm text-slate-700 mt-3 mb-2">
              Poles:
            </p>
            <MathWrapper formula="s_{1,2} = -\alpha \pm \sqrt{\alpha^2 - \omega_0^2}" block />
          </div>

          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-semibold text-slate-800 mb-3">Step 5: Inverse Transform</h4>
            <p className="text-sm text-slate-700 mb-2">
              Depending on pole locations (real vs complex), we get:
            </p>
            <ul className="text-sm text-slate-700 space-y-1 ml-4">
              <li>• Two real poles → Overdamped</li>
              <li>• One repeated real pole → Critically damped</li>
              <li>• Complex conjugate poles → Underdamped</li>
            </ul>
            <p className="text-sm text-slate-700 mt-3">
              The inverse Laplace transform yields the same time-domain solutions!
            </p>
          </div>
      </>}
      conclusion={<>
        <p className="text-slate-700 mb-3">
          For the RLC circuit, the s-domain advantage becomes clear! Instead of solving a
          second-order differential equation with multiple cases, we:
        </p>
        <ol className="text-slate-700 space-y-2 ml-6 list-decimal">
          <li>Find the transfer function algebraically</li>
          <li>Determine the pole locations</li>
          <li>Apply inverse Laplace transform based on pole type</li>
        </ol>
        <p className="text-slate-700 mt-3">
          The damping behavior (<MathWrapper formula="\zeta" />) directly relates to pole
          positions in the s-plane, providing deep physical insight!
        </p>
      </>}
    />
  );
}
