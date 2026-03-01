import { MathWrapper } from '../../components/ui/MathWrapper';

/** S-domain theory content: transfer function fundamentals and RLC derivation. */
export function TheoryTab() {
  return (
    <div className="space-y-6">
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
              <h4 className="font-semibold text-blue-900 mb-2">Poles</h4>
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
    </div>
  );
}
