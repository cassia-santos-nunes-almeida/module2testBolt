import { MathWrapper } from '../../components/ui/MathWrapper';
import { circuitAnalysisFormulas } from '../../utils/componentMath';
import { CircuitComparisonLayout } from './CircuitComparisonLayout';

function RLTimeContent() {
  return <>
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
  </>;
}

function RLSContent() {
  return <>
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
  </>;
}

export function RLComparison() {
  return (
    <CircuitComparisonLayout
      timeContent={<RLTimeContent />}
      sContent={<RLSContent />}
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
