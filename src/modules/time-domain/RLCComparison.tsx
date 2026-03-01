import { MathWrapper } from '../../components/ui/MathWrapper';
import { circuitAnalysisFormulas } from '../../utils/componentMath';
import { CircuitComparisonLayout } from './CircuitComparisonLayout';

function RLCTimeContent() {
  return <>
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
  </>;
}

function RLCSContent() {
  return <>
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
  </>;
}

export function RLCComparison() {
  return (
    <CircuitComparisonLayout
      timeContent={<RLCTimeContent />}
      sContent={<RLCSContent />}
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
