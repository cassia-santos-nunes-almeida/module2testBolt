import { MathWrapper } from '../../components/ui/MathWrapper';

/** Damping comparison content: underdamped, critically damped, overdamped explanations and key takeaways. */
export function DampingTab() {
  return (
    <div className="space-y-6">
      <section className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-slate-900 mb-4">Damping Behavior</h2>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-white p-5 rounded-lg border-2 border-blue-300">
            <h4 className="font-semibold text-blue-900 mb-2">
              Underdamped (&zeta; &lt; 1)
            </h4>
            <div className="mb-3">
              <MathWrapper formula="\alpha < \omega_0" block />
            </div>
            <p className="text-sm text-slate-700 mb-2">
              <strong>Poles:</strong> Complex conjugate pair
            </p>
            <p className="text-sm text-slate-700 mb-2">
              <strong>Response:</strong> Oscillatory with exponential decay
            </p>
            <p className="text-sm text-slate-700">
              Common in lightly damped resonant circuits. Exhibits ringing and overshoot.
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-white p-5 rounded-lg border-2 border-green-300">
            <h4 className="font-semibold text-green-900 mb-2">
              Critically Damped (&zeta; = 1)
            </h4>
            <div className="mb-3">
              <MathWrapper formula="\alpha = \omega_0" block />
            </div>
            <p className="text-sm text-slate-700 mb-2">
              <strong>Poles:</strong> Two identical real poles
            </p>
            <p className="text-sm text-slate-700 mb-2">
              <strong>Response:</strong> Fastest rise time without overshoot
            </p>
            <p className="text-sm text-slate-700">
              Ideal for control systems requiring fast settling without oscillation.
            </p>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-white p-5 rounded-lg border-2 border-amber-300">
            <h4 className="font-semibold text-amber-900 mb-2">
              Overdamped (&zeta; &gt; 1)
            </h4>
            <div className="mb-3">
              <MathWrapper formula="\alpha > \omega_0" block />
            </div>
            <p className="text-sm text-slate-700 mb-2">
              <strong>Poles:</strong> Two distinct real poles
            </p>
            <p className="text-sm text-slate-700 mb-2">
              <strong>Response:</strong> Slow exponential approach, no overshoot
            </p>
            <p className="text-sm text-slate-700">
              Heavily damped systems. Slow to reach steady state but very stable.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-engineering-blue-50 to-slate-50 rounded-lg shadow-md p-6 border-l-4 border-engineering-blue-600">
        <h3 className="text-xl font-semibold text-slate-900 mb-3">Key Takeaways</h3>
        <ul className="space-y-2 text-slate-700">
          <li className="flex items-start gap-2">
            <span className="text-engineering-blue-600 font-bold mt-1">&bull;</span>
            <span>
              Transfer functions provide a complete description of system dynamics in the s-domain.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-engineering-blue-600 font-bold mt-1">&bull;</span>
            <span>
              Pole locations determine stability and transient behavior. Poles in the left half-plane
              indicate stability.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-engineering-blue-600 font-bold mt-1">&bull;</span>
            <span>
              The damping ratio &zeta; predicts oscillatory behavior: &zeta; &lt; 1 gives oscillations,
              &zeta; = 1 is optimal damping, &zeta; &gt; 1 is sluggish.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-engineering-blue-600 font-bold mt-1">&bull;</span>
            <span>
              Natural frequency &#969;&#8320; determines how fast the system responds, while &#945; controls
              the rate of decay.
            </span>
          </li>
        </ul>
      </section>
    </div>
  );
}
