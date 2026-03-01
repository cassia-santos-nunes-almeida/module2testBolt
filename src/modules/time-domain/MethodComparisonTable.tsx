import { MathWrapper } from '../../components/ui/MathWrapper';

export function MethodComparisonTable() {
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
