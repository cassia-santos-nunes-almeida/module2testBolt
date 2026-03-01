import type { CircuitType, InputType, CircuitResponse } from '../../types/circuit';
import { MathWrapper } from '../../components/ui/MathWrapper';

/** Circuit equations panel showing formulas for the selected circuit/input type (F24). */
export function CircuitEquations({ circuitType, inputType, response }: {
  circuitType: CircuitType;
  inputType: InputType;
  response: CircuitResponse;
}) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-3 mb-4">
        <h3 className="text-xl font-semibold text-slate-900">Circuit Equations</h3>
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
          inputType === 'step'
            ? 'bg-blue-100 text-blue-700'
            : 'bg-amber-100 text-amber-700'
        }`}>
          {inputType === 'step' ? 'Step Response' : 'Impulse Response'}
        </span>
      </div>

      {circuitType === 'RC' && inputType === 'step' && (
        <div className="grid md:grid-cols-3 gap-3">
          <div className="bg-slate-50 p-4 rounded-lg">
            <p className="text-sm font-semibold text-slate-700 mb-2">Time Constant:</p>
            <MathWrapper formula="\tau = RC" block />
          </div>
          <div className="bg-slate-50 p-4 rounded-lg">
            <p className="text-sm font-semibold text-slate-700 mb-2">Voltage Response:</p>
            <MathWrapper formula="v_C(t) = V_s(1 - e^{-t/\tau})" block />
          </div>
          <div className="bg-slate-50 p-4 rounded-lg">
            <p className="text-sm font-semibold text-slate-700 mb-2">Current Response:</p>
            <MathWrapper formula="i(t) = \frac{V_s}{R}e^{-t/\tau}" block />
          </div>
        </div>
      )}

      {circuitType === 'RC' && inputType === 'impulse' && (
        <div className="space-y-3">
          <div className="bg-amber-50 p-4 rounded-lg border-l-3 border-amber-400">
            <p className="text-xs text-amber-700 mb-2">Impulse response h(t) = derivative of step response</p>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            <div className="bg-slate-50 p-4 rounded-lg">
              <p className="text-sm font-semibold text-slate-700 mb-2">Voltage (Impulse Response):</p>
              <MathWrapper formula="v_C(t) = \frac{1}{RC}e^{-t/\tau}" block />
            </div>
            <div className="bg-slate-50 p-4 rounded-lg">
              <p className="text-sm font-semibold text-slate-700 mb-2">S-Domain:</p>
              <MathWrapper formula="H(s) = \frac{1/RC}{s + 1/RC}" block />
            </div>
          </div>
        </div>
      )}

      {circuitType === 'RL' && inputType === 'step' && (
        <div className="grid md:grid-cols-3 gap-3">
          <div className="bg-slate-50 p-4 rounded-lg">
            <p className="text-sm font-semibold text-slate-700 mb-2">Time Constant:</p>
            <MathWrapper formula="\tau = \frac{L}{R}" block />
          </div>
          <div className="bg-slate-50 p-4 rounded-lg">
            <p className="text-sm font-semibold text-slate-700 mb-2">Current Response:</p>
            <MathWrapper formula="i(t) = \frac{V_s}{R}(1 - e^{-t/\tau})" block />
          </div>
          <div className="bg-slate-50 p-4 rounded-lg">
            <p className="text-sm font-semibold text-slate-700 mb-2">Voltage Response:</p>
            <MathWrapper formula="v_L(t) = V_s e^{-t/\tau}" block />
          </div>
        </div>
      )}

      {circuitType === 'RL' && inputType === 'impulse' && (
        <div className="space-y-3">
          <div className="bg-amber-50 p-4 rounded-lg border-l-3 border-amber-400">
            <p className="text-xs text-amber-700 mb-2">Impulse response h(t) = derivative of step response</p>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            <div className="bg-slate-50 p-4 rounded-lg">
              <p className="text-sm font-semibold text-slate-700 mb-2">Current (Impulse Response):</p>
              <MathWrapper formula="i(t) = \frac{1}{L}e^{-Rt/L}" block />
            </div>
            <div className="bg-slate-50 p-4 rounded-lg">
              <p className="text-sm font-semibold text-slate-700 mb-2">S-Domain:</p>
              <MathWrapper formula="H(s) = \frac{R/L}{s + R/L}" block />
            </div>
          </div>
        </div>
      )}

      {circuitType === 'RLC' && response.alpha && response.omega0 && response.zeta && (
        <div className="space-y-3">
          <div className="bg-slate-50 p-4 rounded-lg">
            <p className="text-sm font-semibold text-slate-700 mb-2">Characteristic Parameters:</p>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <MathWrapper formula="\alpha = \frac{R}{2L}" />
                <span className="text-sm text-slate-600 ml-2">= {response.alpha.toFixed(2)} rad/s</span>
              </div>
              <div>
                <MathWrapper formula="\omega_0 = \frac{1}{\sqrt{LC}}" />
                <span className="text-sm text-slate-600 ml-2">= {response.omega0.toFixed(2)} rad/s</span>
              </div>
              <div>
                <MathWrapper formula="\zeta = \frac{\alpha}{\omega_0}" />
                <span className="text-sm text-slate-600 ml-2">= {response.zeta.toFixed(3)}</span>
              </div>
            </div>
          </div>

          {inputType === 'impulse' && (
            <div className="bg-amber-50 p-4 rounded-lg border-l-3 border-amber-400">
              <p className="text-xs text-amber-700 mb-2">
                Impulse response: <MathWrapper formula="h(t) = \mathcal{L}^{-1}\{H(s)\}" /> — the most fundamental characterization of the system
              </p>
            </div>
          )}

          {response.dampingType === 'underdamped' && (
            <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
              <p className="text-sm font-semibold text-slate-700 mb-2">
                Underdamped {inputType === 'impulse' ? 'Impulse' : 'Step'} Response:
              </p>
              {inputType === 'step' ? (
                <MathWrapper formula="v_C(t) = V_s\left(1 - e^{-\alpha t}\left(\cos(\omega_d t) + \frac{\alpha}{\omega_d}\sin(\omega_d t)\right)\right)" block />
              ) : (
                <MathWrapper formula="h(t) = \frac{\omega_0^2}{\omega_d}\,e^{-\alpha t}\sin(\omega_d t)" block />
              )}
              <p className="text-sm text-slate-600 mt-2">
                where <MathWrapper formula="\omega_d = \omega_0\sqrt{1-\zeta^2}" /> = {(response.omega0 * Math.sqrt(1 - response.zeta * response.zeta)).toFixed(2)} rad/s
              </p>
            </div>
          )}

          {response.dampingType === 'critically-damped' && (
            <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
              <p className="text-sm font-semibold text-slate-700 mb-2">
                Critically Damped {inputType === 'impulse' ? 'Impulse' : 'Step'} Response:
              </p>
              {inputType === 'step' ? (
                <MathWrapper formula="v_C(t) = V_s(1 - e^{-\alpha t}(1 + \alpha t))" block />
              ) : (
                <MathWrapper formula="h(t) = \omega_0^2\,t\,e^{-\alpha t}" block />
              )}
            </div>
          )}

          {response.dampingType === 'overdamped' && (
            <div className="bg-amber-50 p-4 rounded-lg border-l-4 border-amber-500">
              <p className="text-sm font-semibold text-slate-700 mb-2">
                Overdamped {inputType === 'impulse' ? 'Impulse' : 'Step'} Response:
              </p>
              {inputType === 'step' ? (
                <>
                  <MathWrapper formula="v_C(t) = V_s(A_1 e^{s_1 t} + A_2 e^{s_2 t})" block />
                  <p className="text-sm text-slate-600 mt-2">where s&#8321;, s&#8322; are the two distinct real roots</p>
                </>
              ) : (
                <MathWrapper formula="h(t) = \frac{\omega_0^2}{s_1 - s_2}(e^{s_1 t} - e^{s_2 t})" block />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
