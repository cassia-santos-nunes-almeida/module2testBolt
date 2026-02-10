import { useState } from 'react';
import { MathWrapper } from '../common/MathWrapper';
import { circuitAnalysisFormulas } from '../../utils/componentMath';
import { ArrowRight } from 'lucide-react';

type CircuitType = 'RC' | 'RL' | 'RLC';

export function TimeDomain() {
  const [selectedCircuit, setSelectedCircuit] = useState<CircuitType>('RC');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Time Domain Analysis</h1>
        <p className="text-lg text-slate-600">
          Comparing differential equation approach with Laplace transform method
        </p>
      </div>

      <div className="flex gap-4 border-b border-slate-200">
        {(['RC', 'RL', 'RLC'] as const).map((type) => (
          <button
            key={type}
            onClick={() => setSelectedCircuit(type)}
            className={`px-6 py-3 font-medium transition-colors border-b-2 ${
              selectedCircuit === type
                ? 'border-engineering-blue-600 text-engineering-blue-700'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            {type} Circuit
          </button>
        ))}
      </div>

      {selectedCircuit === 'RC' && <RCCircuitComparison />}
      {selectedCircuit === 'RL' && <RLCircuitComparison />}
      {selectedCircuit === 'RLC' && <RLCCircuitComparison />}
    </div>
  );
}

function RCCircuitComparison() {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="bg-gradient-to-br from-blue-50 to-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
        <h3 className="text-2xl font-semibold text-slate-900 mb-4">
          Time-Domain Approach
        </h3>

        <div className="space-y-4">
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
        </div>
      </div>

      <div className="bg-gradient-to-br from-slate-50 to-white rounded-lg shadow-md p-6 border-l-4 border-slate-500">
        <h3 className="text-2xl font-semibold text-slate-900 mb-4">
          S-Domain Approach
        </h3>

        <div className="space-y-4">
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
        </div>
      </div>

      <div className="col-span-full bg-green-50 rounded-lg shadow-md p-6 border-l-4 border-green-500">
        <div className="flex items-center gap-3 mb-3">
          <ArrowRight className="w-6 h-6 text-green-600" />
          <h3 className="text-xl font-semibold text-slate-900">Conclusion</h3>
        </div>
        <p className="text-slate-700">
          Both methods yield the <strong>identical result</strong>! The time-domain approach
          requires solving a differential equation, while the s-domain approach transforms
          it into an algebraic problem. For simple circuits, both are manageable, but for
          complex circuits, the s-domain method is significantly easier.
        </p>
      </div>
    </div>
  );
}

function RLCircuitComparison() {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="bg-gradient-to-br from-blue-50 to-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
        <h3 className="text-2xl font-semibold text-slate-900 mb-4">
          Time-Domain Approach
        </h3>

        <div className="space-y-4">
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
        </div>
      </div>

      <div className="bg-gradient-to-br from-slate-50 to-white rounded-lg shadow-md p-6 border-l-4 border-slate-500">
        <h3 className="text-2xl font-semibold text-slate-900 mb-4">
          S-Domain Approach
        </h3>

        <div className="space-y-4">
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
        </div>
      </div>

      <div className="col-span-full bg-green-50 rounded-lg shadow-md p-6 border-l-4 border-green-500">
        <div className="flex items-center gap-3 mb-3">
          <ArrowRight className="w-6 h-6 text-green-600" />
          <h3 className="text-xl font-semibold text-slate-900">Conclusion</h3>
        </div>
        <p className="text-slate-700">
          Again, both approaches give the <strong>same result</strong>. The RL circuit behaves
          similarly to the RC circuit with an exponential rise in current and exponential decay
          in voltage across the inductor. The time constant <MathWrapper formula="\tau = L/R" />
          determines the response speed.
        </p>
      </div>
    </div>
  );
}

function RLCCircuitComparison() {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="bg-gradient-to-br from-blue-50 to-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
        <h3 className="text-2xl font-semibold text-slate-900 mb-4">
          Time-Domain Approach
        </h3>

        <div className="space-y-4">
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
        </div>
      </div>

      <div className="bg-gradient-to-br from-slate-50 to-white rounded-lg shadow-md p-6 border-l-4 border-slate-500">
        <h3 className="text-2xl font-semibold text-slate-900 mb-4">
          S-Domain Approach
        </h3>

        <div className="space-y-4">
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
        </div>
      </div>

      <div className="col-span-full bg-green-50 rounded-lg shadow-md p-6 border-l-4 border-green-500">
        <div className="flex items-center gap-3 mb-3">
          <ArrowRight className="w-6 h-6 text-green-600" />
          <h3 className="text-xl font-semibold text-slate-900">Conclusion</h3>
        </div>
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
      </div>
    </div>
  );
}
