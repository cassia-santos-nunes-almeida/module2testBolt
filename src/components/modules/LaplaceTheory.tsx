import { MathWrapper } from '../common/MathWrapper';
import { laplaceTransforms, laplaceProperties } from '../../utils/componentMath';
import { BookOpen, Zap as ZapIcon, ArrowRightLeft } from 'lucide-react';

export function LaplaceTheory() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Laplace Transform Theory</h1>
        <p className="text-lg text-slate-600">
          Mathematical foundation for s-domain circuit analysis
        </p>
      </div>

      <section className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-start gap-3 mb-4">
          <BookOpen className="w-6 h-6 text-engineering-blue-600 mt-1" />
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-3">Definition</h2>
            <p className="text-slate-700 mb-4">
              The Laplace Transform converts a function of time <MathWrapper formula="f(t)" /> into
              a function of complex frequency <MathWrapper formula="F(s)" />, where{' '}
              <MathWrapper formula="s = \sigma + j\omega" /> is a complex variable.
            </p>

            <div className="bg-engineering-blue-50 p-4 rounded-lg">
              <p className="text-sm font-semibold text-slate-800 mb-2">Forward Laplace Transform:</p>
              <MathWrapper formula="\mathcal{L}\{f(t)\} = F(s) = \int_0^\infty f(t)e^{-st}dt" block />
            </div>

            <div className="bg-slate-50 p-4 rounded-lg mt-4">
              <p className="text-sm font-semibold text-slate-800 mb-2">Inverse Laplace Transform:</p>
              <MathWrapper formula="\mathcal{L}^{-1}\{F(s)\} = f(t) = \frac{1}{2\pi j}\int_{\sigma-j\infty}^{\sigma+j\infty}F(s)e^{st}ds" block />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-start gap-3 mb-4">
          <ZapIcon className="w-6 h-6 text-amber-600 mt-1" />
          <h2 className="text-2xl font-semibold text-slate-900">Why Use Laplace Transforms?</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-green-50 to-white p-4 rounded-lg border border-green-200">
            <h4 className="font-semibold text-green-900 mb-2">1. Simplification</h4>
            <p className="text-sm text-slate-700">
              Converts differential equations into algebraic equations, making them much easier to solve.
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-white p-4 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-engineering-blue-900 mb-2">2. Initial Conditions</h4>
            <p className="text-sm text-slate-700">
              Naturally incorporates initial conditions into the transformed equation.
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-white p-4 rounded-lg border border-purple-200">
            <h4 className="font-semibold text-purple-900 mb-2">3. System Analysis</h4>
            <p className="text-sm text-slate-700">
              Provides insight into system behavior through poles and zeros in the s-plane.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-slate-900 mb-4">
          Common Laplace Transform Pairs
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-100">
                <th className="border border-slate-300 px-4 py-3 text-left">Time Domain f(t)</th>
                <th className="border border-slate-300 px-4 py-3 text-left">S-Domain F(s)</th>
                <th className="border border-slate-300 px-4 py-3 text-left">Description</th>
              </tr>
            </thead>
            <tbody>
              {laplaceTransforms.map((transform, index) => (
                <tr key={index} className="hover:bg-slate-50">
                  <td className="border border-slate-300 px-4 py-3">
                    <MathWrapper formula={transform.function} />
                  </td>
                  <td className="border border-slate-300 px-4 py-3">
                    <MathWrapper formula={transform.transform} />
                  </td>
                  <td className="border border-slate-300 px-4 py-3 text-sm text-slate-600">
                    {transform.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-slate-900 mb-4">
          Important Properties
        </h2>

        <div className="space-y-4">
          {laplaceProperties.map((property, index) => (
            <div key={index} className="bg-slate-50 p-4 rounded-lg border-l-4 border-engineering-blue-500">
              <h4 className="font-semibold text-slate-800 mb-2">{property.property}</h4>
              <MathWrapper formula={property.formula} block />
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-start gap-3 mb-4">
          <ArrowRightLeft className="w-6 h-6 text-green-600 mt-1" />
          <h2 className="text-2xl font-semibold text-slate-900">Worked Examples</h2>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-blue-50 to-white p-5 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-slate-900 mb-3">Example 1: Transform a Simple Function</h4>
            <p className="text-sm text-slate-700 mb-2">
              Find the Laplace transform of <MathWrapper formula="f(t) = 3e^{-2t}" />
            </p>

            <div className="bg-white p-4 rounded-lg mt-3">
              <p className="text-sm font-semibold text-slate-800 mb-2">Solution:</p>
              <p className="text-sm text-slate-700 mb-2">
                Using linearity and the exponential transform:
              </p>
              <MathWrapper formula="\mathcal{L}\{3e^{-2t}\} = 3\mathcal{L}\{e^{-2t}\}" block />
              <MathWrapper formula="= 3 \cdot \frac{1}{s+2}" block />
              <MathWrapper formula="= \frac{3}{s+2}" block />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-white p-5 rounded-lg border border-green-200">
            <h4 className="font-semibold text-slate-900 mb-3">Example 2: Transform a Derivative</h4>
            <p className="text-sm text-slate-700 mb-2">
              Find <MathWrapper formula="\mathcal{L}\{\frac{df}{dt}\}" /> given <MathWrapper formula="f(0) = 5" />
            </p>

            <div className="bg-white p-4 rounded-lg mt-3">
              <p className="text-sm font-semibold text-slate-800 mb-2">Solution:</p>
              <p className="text-sm text-slate-700 mb-2">
                Using the differentiation property:
              </p>
              <MathWrapper formula="\mathcal{L}\{\frac{df}{dt}\} = sF(s) - f(0)" block />
              <MathWrapper formula="= sF(s) - 5" block />
              <p className="text-sm text-slate-700 mt-3">
                This shows how initial conditions are naturally incorporated!
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-white p-5 rounded-lg border border-purple-200">
            <h4 className="font-semibold text-slate-900 mb-3">Example 3: Inverse Transform Using Partial Fractions</h4>
            <p className="text-sm text-slate-700 mb-2">
              Find the inverse transform of <MathWrapper formula="F(s) = \frac{5}{s(s+2)}" />
            </p>

            <div className="bg-white p-4 rounded-lg mt-3">
              <p className="text-sm font-semibold text-slate-800 mb-2">Solution:</p>
              <p className="text-sm text-slate-700 mb-2">
                Step 1: Partial fraction decomposition
              </p>
              <MathWrapper formula="\frac{5}{s(s+2)} = \frac{A}{s} + \frac{B}{s+2}" block />
              <p className="text-sm text-slate-700 mt-2 mb-2">
                Solving: <MathWrapper formula="A = 2.5" />, <MathWrapper formula="B = -2.5" />
              </p>
              <MathWrapper formula="F(s) = \frac{2.5}{s} - \frac{2.5}{s+2}" block />
              <p className="text-sm text-slate-700 mt-3 mb-2">
                Step 2: Inverse transform each term
              </p>
              <MathWrapper formula="f(t) = 2.5u(t) - 2.5e^{-2t}u(t)" block />
              <MathWrapper formula="f(t) = 2.5(1 - e^{-2t})u(t)" block />
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-white p-5 rounded-lg border border-amber-200">
            <h4 className="font-semibold text-slate-900 mb-3">Example 4: Solving a Differential Equation</h4>
            <p className="text-sm text-slate-700 mb-2">
              Solve: <MathWrapper formula="\frac{dy}{dt} + 3y = 6" />, with <MathWrapper formula="y(0) = 2" />
            </p>

            <div className="bg-white p-4 rounded-lg mt-3">
              <p className="text-sm font-semibold text-slate-800 mb-2">Solution:</p>
              <p className="text-sm text-slate-700 mb-2">
                Step 1: Take Laplace transform of both sides
              </p>
              <MathWrapper formula="\mathcal{L}\{\frac{dy}{dt}\} + 3\mathcal{L}\{y\} = \mathcal{L}\{6\}" block />
              <MathWrapper formula="sY(s) - y(0) + 3Y(s) = \frac{6}{s}" block />
              <MathWrapper formula="sY(s) - 2 + 3Y(s) = \frac{6}{s}" block />

              <p className="text-sm text-slate-700 mt-3 mb-2">
                Step 2: Solve for Y(s)
              </p>
              <MathWrapper formula="Y(s)(s + 3) = \frac{6}{s} + 2" block />
              <MathWrapper formula="Y(s) = \frac{6 + 2s}{s(s + 3)} = \frac{2s + 6}{s(s + 3)}" block />

              <p className="text-sm text-slate-700 mt-3 mb-2">
                Step 3: Partial fractions
              </p>
              <MathWrapper formula="Y(s) = \frac{2}{s} + \frac{0}{s+3} = \frac{2}{s}" block />

              <p className="text-sm text-slate-700 mt-3 mb-2">
                Step 4: Inverse transform
              </p>
              <MathWrapper formula="y(t) = 2u(t)" block />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-amber-50 rounded-lg shadow-md p-6 border-l-4 border-amber-500">
        <h3 className="text-xl font-semibold text-amber-900 mb-3">Key Insights</h3>
        <ul className="space-y-2 text-slate-700">
          <li className="flex items-start gap-2">
            <span className="text-amber-600 font-bold mt-1">•</span>
            <span>
              The Laplace transform is a powerful tool that converts calculus problems (differentiation,
              integration) into algebra problems (multiplication, division).
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-600 font-bold mt-1">•</span>
            <span>
              Initial conditions are automatically incorporated through the differentiation property.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-600 font-bold mt-1">•</span>
            <span>
              The inverse transform often requires partial fraction decomposition to match standard
              transform pairs.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-600 font-bold mt-1">•</span>
            <span>
              For circuit analysis, the s-domain representation provides deep insight into system
              behavior through pole and zero locations.
            </span>
          </li>
        </ul>
      </section>
    </div>
  );
}
