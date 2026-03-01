import { MathWrapper } from '../../components/ui/MathWrapper';

export function ResponseComparisons() {
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
