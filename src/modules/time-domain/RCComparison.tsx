import { MathWrapper } from '../../components/ui/MathWrapper';
import { circuitAnalysisFormulas } from '../../utils/componentMath';
import { CircuitComparisonLayout } from './CircuitComparisonLayout';

function RCTimeContent() {
  return <>
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
  </>;
}

function RCSContent() {
  return <>
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
  </>;
}

export function RCComparison() {
  return (
    <CircuitComparisonLayout
      timeContent={<RCTimeContent />}
      sContent={<RCSContent />}
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
